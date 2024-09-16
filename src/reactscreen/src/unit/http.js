import axios from 'axios'
import { Modal } from 'antd'
const baseUrl = process.env.NODE_ENV === 'development' ? '/pro' : ''

const errAlert = err => {
    Modal.error({
        title: '提示',
        content: err,
        okText: '确认'
    });
};

const handleResponse = res => {
    if (res) {
        if (res.status === 200) {
            let code = res.data.code;
            if (code === 0) {
                return res.data;
            } else if (code === -1) {
                errAlert(res.data.msg);
                return;
            } else if (code === 101) { //未登录状态，直接返回登录页
                // window.location.href = baseUrl
                return;
            }
        } else if (res.status === 500) {
            errAlert('请求无响应');
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
                }
            }
            if (type === 'get') {
                data.params = params;
            } else {
                data.data = params;
            }
            let res = await axios(data)
            return handleResponse(res);
        } catch (err) {
            if (getError) {
                return err;
            }
            if (err.response) {
                if (err.response.statusText) {
                    errAlert(err.response.statusText)
                } else {
                    errAlert(err)
                }
            } else {
                errAlert(err);
            }
        }
    })()
}

const http = {
    async get(url, params = {}, contentType = 'application/x-www-form-urlencoded', getError) {
        return pubHttp('get', url, params, contentType, getError)
    },

    async post(url, params = {}, contentType = 'application/json', getError) {
        return pubHttp('post', url, params, contentType, getError)
    },

    async put(url, params = {}, contentType = 'application/json', getError) {
        return pubHttp('put', url, params, contentType, getError)
    },

    async delete(url, params = {}, contentType = 'application/json', getError) {
        return pubHttp('delete', url, params, contentType, getError)
    },

    async patch(url, param = {}, contentType = 'application/json', getError) {
        return pubHttp('patch', url, param, contentType, getError)
    }

}
export default http