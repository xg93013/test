import axios from 'axios'
import Vue from 'vue'
const baseUrl = process.env.NODE_ENV == 'development' ? '/pro' : ''

const errAlert = err => {
	Vue.prototype.$msgbox({
		title: "提示",
		message: err,
		type: "error"
	}).catch(_=>{
		
	})
};

const handleResponse = res => {
	if(res) {
		if(res.status == 200) {
			if(res.data.code==0){
				return res.data
			}else if(res.data.code==302){
				window.location.replace(res.data.data)
			}else{
				errAlert(res.data.msg)
			}
		} else if(res.status == 500) {
			errAlert('请求无响应');
		} else {
			errAlert('请求超时');
		}
	}
};

const pubHttp = (type, url, params, contentType) => {
	let uri = encodeURI(baseUrl + url);
//	let uri = baseUrl + url
	return(async() => {
		try {
			let data = {
				method: type,
				url: uri,
				headers: {
					'Content-type': contentType,
					'X-Requested-With':'XMLHttpRequest'
				}
			}
			if(type == 'get') {
				data.params = params;
			} else {
				data.data = params;
			}
			let res = await axios(data)
			return handleResponse(res);
		} catch(err) {
			if(err.response){
				if(err.response.statusText){
					errAlert(err.response.statusText)
				}else{
					errAlert(err)
				}
			}else{
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