﻿import axios from 'axios'
import Vue from 'vue'
const baseUrl = process.env.NODE_ENV == 'development' ? '/apis' : ''

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
			if(res.data.result){
				return res.data
			}else{
				errAlert(res.data.message)
			}
		} else if(res.status == 500) {
			errAlert('请求无响应');
		} else {
			errAlert('请求超时');
		}
	}
};

const pubHttp = (type, url, params, contentType) => {
	//	let uri = encodeURI(baseUrl + url);
	let uri = baseUrl + url
	return(async() => {
		try {
			let data = {
				method: type,
				url: uri,
				headers: {
					'Content-type': contentType
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
				if(err.response.status==403){//未登录，直接跳转至登录页面
					window.location.replace("/")
				}else if(err.response.status==500){
					errAlert(err.response.statusText)
				}else{
					if(err.response.data.message){
						errAlert(err.response.data.message)
					}else{
						errAlert(err.response.data)
					}
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