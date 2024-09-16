import axios from 'axios'
import Vue from 'vue'
const baseUrl = process.env.NODE_ENV == 'development' ? '/pro' : ''

const errAlert = err => {
	Vue.prototype.$msgbox({
		title: "提示",
		message: err,
		type: "error"
	}).catch(_ => {

	})
};

const handleResponse = res => {
	if (res) {
		console.log(res);
		if (res.status == 200) {
			// let code = res.data.code;
			// if (code === 0) {
			// 	return res.data;
			// } else if (code === -1) {
			// 	errAlert(res.data.msg);
			// 	return;
			// } else if (code === 101) { //未登录状态，直接返回登录页
			// 	// let baseUrl = sessionStorage.getItem("newBaseUrl");
			// 	// window.location.href = baseUrl
			// 	return;
			// }
			return res.data
		} else if (res.status == 500) {
			errAlert('请求无响应');
		} else if (res.status == 404) {
			errAlert(res.data.message);
		} else {
			errAlert('请求超时');
		}
	}
};

const pubHttp = (type, url, params, contentType) => {
	//	let uri = encodeURI(baseUrl + url);
	let uri = baseUrl + url
	return (async () => {
		try {
			let data = {
				method: type,
				url: uri,
				headers: {
					'Content-type': contentType
				},
				timeout: 30000
			}
			if (type == 'get') {
				data.params = params;
			} else {
				data.data = params;
			}
			let res = await axios(data)
			return handleResponse(res);
		} catch (err) {
			if (err.response) {
				if (err.response.status == 403) {//未登录，直接跳转至登录页面
					window.location.replace("/")
				} else if (err.response.status == 500) {
					console.log(err.response)
					errAlert(err.response.statusText)
				} else {
					if (err.response.data.message) {
						errAlert(err.response.data.message)
					} else {
						errAlert(err.response.data)
					}
				}
			} else {
				errAlert(err);
			}
		}
	})()
}


const http = {

	async get(url, params = {}, contentType = 'application/x-www-form-urlencoded') {
		return pubHttp('get', url, params, contentType)
	},

	async post(url, params = {}, contentType = 'application/json') {
		return pubHttp('post', url, params, contentType)
	},

	async put(url, params = {}, contentType = 'application/json') {
		return pubHttp('put', url, params, contentType)
	},

	async delete(url, params = {}, contentType = 'application/json') {
		return pubHttp('delete', url, params, contentType)
	},

	async patch(url, param = {}, contentType = 'application/json') {
		return pubHttp('patch', url, param, contentType)
	}

}
export default http