import axios from 'axios'
import Vue from 'vue'
import apis from './apis.js'
axios.defaults.withCredentials = true;
const baseUrl = process.env.NODE_ENV == 'development' ? '/api' : `http://${process.integration ? process.apiHost : '172.27.2.107:8080'}/api`;

const errAlert = err => {
    Vue.prototype.$message.error({
        title: '提示',
        content: err
    })
};
let mockHttp;
mockHttp = require('@/util/fakeDatabase.js');

const handleResponse = res => {
    if (res) {
        if (res.status == 200) {
            let code = res.data.status.code;
            if (code == 0) {
                return res.data;
            } else if (code == -1) {
                errAlert(res.data.status.description);
                return;
            } else if (code == 101) { //未登录状态，直接返回登录页
                let baseUrl = sessionStorage.getItem("newBaseUrl");
                Vue.prototype.$Message.info({ content: '登录超时，请重新登录', duration: 2.5 });
                window.location.href = baseUrl
                return;
            }
        } else if (res.status == 500) {
            errAlert('请求无响应');
        } else {
            errAlert('请求超时');
        }
    }
};

const pubHttp = (type, url, params, contentType) => {
    //	let uri = encodeURI(baseUrl + url);
    let uri = baseUrl + url
    return (async() => {
        try {
            let data = {
                method: type,
                url: encodeURI(uri),
                headers: {
                    'Content-type': contentType
                }
            }
            if (type == 'get') {
                data.params = params;
            } else {
                data.data = params;
            }
            let res = await axios(data)
            return handleResponse(res);
        } catch (err) {
            errAlert(err);
        }
    })()
}

const http = {

    async get(url, params = {}, contentType = 'application/x-www-form-urlencoded') {
        
        if (apis[url]) {
            return pubHttp('get', apis[url], params, contentType);
        }
        if (mockHttp) {
            return mockHttp.default('get', url, params, contentType);
        }
        return {
            code: 404,
            data:[]
        }
    },

    async post(url, params = {}, contentType = 'application/json') {
        return pubHttp('post', apis[url], params, contentType)
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