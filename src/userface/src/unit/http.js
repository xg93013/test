import axios from 'axios'
import Vue from 'vue'
const baseUrl = process.env.NODE_ENV == 'development' ? '/apis' : ''

const errAlert = (err, isAlert) => {
    if (err.indexOf("USER_MANAGEMENT") > -1) {///针对创建用户重复的提示
        Vue.prototype.$msgbox({
            title: "提示",
            message: err.split("USER_MANAGEMENT:")[1],
            type: "error"
        })
    } else {
        if (isAlert) {
            Vue.prototype.$msgbox({
                title: "提示",
                message: err,
                type: "error"
            }).catch(_ => {

            })
        } else {
            console.log(err)
        }
    }
};

const handleResponse = (res, isAlert) => {
    if (res) {
        if (res.status == 200) {
            if (res.data.result) {
                return res.data
            } else {
                errAlert(res.data.message, isAlert)
            }
        } else if (res.status == 500) {
            errAlert('请求无响应', isAlert);
        } else {
            errAlert('请求超时'.isAlert);
        }
    }
};

const CancelToken = axios.CancelToken;

const pubHttp = (type, url, params, cancel, isAlert, contentType) => {
    let uri;
    var userAgent = navigator.userAgent;
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion < 10) {//判断是否为ie9
            uri = encodeURI(baseUrl + url);
        } else {
            uri = baseUrl + url
        }
    } else {
        uri = baseUrl + url
    }
    return (async () => {
        try {
            let data = {
                method: type,
                url: uri,
                headers: {
                    'Content-type': contentType
                },
                cancelToken: new CancelToken(function (c) {
                    if (cancel instanceof Array) {
                        cancel.push(c);
                    }
                })
            }
            if (type == 'get') {
                data.params = params;
            } else {
                data.data = params;
            }
            let res = await axios(data);
            return handleResponse(res, isAlert);
        } catch (err) {
            if (err.response) {
                if (err.response.status == 403) {//未登录，直接跳转至登录页面
                    window.location.replace("/")
                } else if (err.response.status == 500) {
                    errAlert(err.response.statusText, isAlert)
                } else {
                    if (err.response.data.message) {
                        errAlert(err.response.data.message, isAlert)
                    } else {
                        errAlert(err.response.data, isAlert)
                    }
                }
            } else {
                if (err.message !== "CLOSE_AJAX") {
                    errAlert("请求失败", isAlert);
                }
            }
        }
    })()
}

const http = {

    async get(url, params = {}, cancel, isAlert, contentType = 'application/x-www-form-urlencoded') {
        return pubHttp('get', url, params, cancel, isAlert, contentType)
    },

    async post(url, params = {}, cancel, isAlert, contentType = 'application/json') {
        return pubHttp('post', url, params, cancel, isAlert, contentType)
    },

    async put(url, params = {}, cancel, isAlert, contentType = 'application/json') {
        return pubHttp('put', url, params, cancel, isAlert, contentType)
    },

    async delete(url, params = {}, cancel, isAlert, contentType = 'application/json') {
        return pubHttp('delete', url, params, cancel, isAlert, contentType)
    },

    async patch(url, param = {}, cancel, isAlert, contentType = 'application/json') {
        return pubHttp('patch', url, param, cancel, isAlert, contentType)
    }

}
export default http