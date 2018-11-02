import axios from "axios";
import Vue from 'vue';
// 引入axios IE兼容
// import "./axios.promise.js";
import {enumeration} from '@/libs/common.js';
import config from '@/config/config.js';
axios.defaults.withCredentials=true;
// import {riskMapVM as mainVm} from '@/feature/main/main.js';
var uBase = {},
    constantMap = {
        commonPreUrl : location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: ''),
        lastUpdateTime : {
            dateString : "",
            defaultFilterDate : {},
            init : false
        },
        permissionMap :[],
        mainVM : {},
        framework : "iview",
        adaptComponent : {
            iview : {
                modal : "$Modal",
                waitingBox : "$Spin"
            }
        }
    },
    userInfo = {};

if (config.env == "development") {
    constantMap.commonPreUrl+="/dev";
    // constantMap.commonPreUrl = "http://172.27.2.191:8081";
}
// IE下重写console对象
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
// constantMap.
/**
 * ajax通信相关接口
 *
 * @param {string} url 命令符号
 * @param {function} successFn 通信成功回调
 * @param {function} failFn 通信失败回调
 * @param {obj} config ajax下发配置参数（如超时时间等等）
 * @return {obj} 返回axios promise对象
 *
 */
uBase.communicationService = {
    get(url, successFn, failFn, config) {
        if (_.isUndefined(successFn)) {
            // 并行时使用
            return axios.get(url);
        } else {
            var tempPromise = axios.get(url);
            tempPromise.then(function(result) {
            	if(result.data.state.code==1&&location.hash!="#/"){//未登录
            		location.hash="/";
            		return false;
            	}
                if (_.isFunction(successFn)) {
                    successFn(result.data);
                }
            }).catch(function (result) {
                if (result.response) {
                    // mainVm.$loading().close();
                    if (_.isFunction(failFn)) {
                        if (!result.data) {
                            failFn(result.response.data);
                        } else {
                            failFn(result.data);
                        }
                        
                    }
                } else {
                    // mainVm.$loading().close();
                    failFn(result);
                    console.error('Error', result.message);
                }
                
            });
            return tempPromise;
        }
    },
    remove : function (url, successFn, failFn, config) {
        if (_.isUndefined(successFn)) {
            // 并行时使用
            return axios.delete(url);
        } else {
            return axios.delete(url).then(function(result) {
                if (_.isFunction(successFn)) {
                    successFn(result.data);
                }
            }).catch(function (result) {
                if (_.isFunction(failFn)) {
                    failFn(result.data);
                }
            });
        }
    },
    post(url, param, successFn, failFn, config) {
        if (_.isUndefined(successFn)) {
            // 并行时使用
            return axios.post(url, param, config || {});
        } else {
            return axios.post(url, param, config || {}).then(function(result) {
            	if(result.data.state.code==1&&location.hash!="#/"){//未登录
            		location.hash="/";
            		return false;
            	}
                if (_.isFunction(successFn)) {
                    successFn(result.data);
                }
            }).catch(function (result) {
                if (_.isFunction(failFn)) {
                    failFn(result.data);
                }
            });
        }
    },
    put : function (url, param, successFn, failFn, config) {
        if (_.isUndefined(successFn)) {
            // 并行时使用
            return axios.put(url, param);
        } else {
            return axios.put(url, param).then(function(result) {
                if (_.isFunction(successFn)) {
                    successFn(result.data);
                }
            }).catch(function (result) {
                if (_.isFunction(failFn)) {
                    failFn(result.data);
                }
            });
        }
    },
    patch : function (url, param, successFn, failFn, config) {
        if (_.isUndefined(successFn)) {
            // 并行时使用
            return axios.patch(url, param);
        } else {
            return axios.patch(url, param).then(function(result) {
                if (_.isFunction(successFn)) {
                    successFn(result.data);
                }
            }).catch(function (result) {
                if (_.isFunction(failFn)) {
                    failFn(result.response.data);
                }
            });
        }
    },
    /*
        并发命令
        @param {array} promises 并发命令集合
        @param {function} successFn 全部成功回调
        @param {function} failFn 失败回调
    */
    concurrentProcessing : function (promises, successFn, failFn) {
        axios.all(promises).then(axios.spread(function () {
            if (_.isFunction(successFn)) {
                successFn(_.map(arguments, function(result) {
                    return result.data;
                }));
            }
        })).catch(function(acct){
            failFn(acct);
        });
    }
}
/*
    工具类服务，用于数据处理等
*/
uBase.utilService = {
    /**
     * 获取下发命令url
     *
     * @param {string} url 命令符号
     * @param {bool} useExternal 是否使用外部服务器
     *
     */
    getResourceUrl : function (url, useExternal) {
        if (useExternal) {
            // return "http://172.27.8.209:8080" + url;
            return "http://172.27.2.186:8080" + url;
        }
         return encodeURI(constantMap.commonPreUrl + url);
        // return encodeURI("http://172.27.2.191:8083" + url);
        // return encodeURI("http://172.27.2.48:18887" + url);
    },
    /*
    根据某个字段对map进行排序，并返回需要的数量
    @param {array} tempArray 原始数据
    @param {object} config 参数
    @param {bool} config.isAscending 是否为升序
    @param {string} config.key 排序关键字
    @param {number} config.length 截取长度

    */
    sortAndSliceArray : function (tempArray, config) {
        var menuList = _.sortBy(tempArray, function (item) {
            if(config.isAscending){
                return item[config.key];
            } else {
                return -item[config.key];
            }
        });
        return menuList = _.slice(menuList, 0, config.length?config.length:tempArray.length-1);
    },
    /**
     * 处理错误信息
     *
     * @param {obj} err 错误对象
     * @param {string} err.code 错误码
     * @param {string} err.description 错误描述
     *
     */
    handleException : function (err) {
        var tempContent, tempResponse, tempTitle = "操作失败";
        if (typeof err == "string") {
            tempContent = err;
        } else if (typeof err == "object") {
            if (err instanceof Error) {
                tempTitle = "程序执行报错";
                tempContent = err.message + "<br/>" + JSON.stringify(err.stack);
                console.error('Error', err);
            } else {
                tempResponse = err.response ? err.response : (err.data?err.data:err);
                // switch (tempResponse.status*1) {
                //     case 401 :
                //         mapVM.$Modal.info({
                //             title: "登录状态失效",
                //             content: "登录状态失效，请重新登录",
                //             onOk : function () {
                //                 // location.href = tBase.getResourceUrl("/login");
                //             }
                //         });
                //         return;
                //     default :
                tempContent = "错误码："+ tempResponse.state.code +"<br>错误描述：" + (tempResponse.state.description || "无");
                if (tempResponse.state.code == 1) {
                    constantMap.mainVM[constantMap.adaptComponent[constantMap.framework].modal].error({
                        title: tempTitle,
                        content: tempContent,
                        onOk : function () {
                            constantMap.mainVM.$router.push("/");
                        }
                    });
                    return;
                }
                // }
            }
        } else {
            tempTitle = "未知错误";
            tempContent = "未知错误";
        }
        
        constantMap.mainVM[constantMap.adaptComponent[constantMap.framework].modal].error({
            title: tempTitle,
            content: tempContent
        });
    },
    /*处理响应*/
    handleResult : function (result, successFn, errFn) {
        if (!result || !result.state) {
            this.handleException(result);
            return;
        }
        if (result.state.code ==0) {
            if (_.isFunction(successFn)) {
                successFn(result);
            }
        } else {
            if (_.isFunction(errFn)) {
                errFn(result);
            }
            this.handleException(result);
        }
    },
    /*
        获取枚举显示值
    */
    getEnumDisplay : function (enumType, value) {
        // _.each(enumeration[enumType], function (item, key) {
        //     if (value == item) {

        //     }
        // });
        for (var i in enumeration[enumType]) {
            if (value == enumeration[enumType][i]) {
                return i;
            }
        }
    },
    /*
        获取或者设置用户信息
    */
    gsetUserInfo : function (data) {
        if (!_.isUndefined(data) || _.isObject(data)) {
            userInfo = _.cloneDeep(data);
        }

        return userInfo;
    },
    getRolePermisson : function (cb) {
        if (constantMap.permissionMap.length == 0) {
            uBase.communicationService.concurrentProcessing([uBase.communicationService.get(uBase.utilService.getResourceUrl("/permission/menu"), function(result) {
            // 路由配置
                var mainRouteChildren = [];
                
            }, function(result) {

            }), uBase.communicationService.get(uBase.utilService.getResourceUrl("/permission/list"))], function(results) {
                constantMap.permissionMap = results;
                if (_.isFunction(cb)) {
                    cb(results);
                    
                }
                
                
            }, function(results) {

            });
        } else {
            return _.cloneDeep(constantMap.permissionMap);
        }
    },
    setMainVM : function (VM) {
        constantMap.mainVM = VM;
    },
    openWaitingBox : function (isOpen, params) {
        if (isOpen) {
            constantMap.mainVM[constantMap.adaptComponent[constantMap.framework].waitingBox].show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'load-c',
                                size: 18
                            }
                        }),
                        h('div', params && params.text ? params.text :'数据加载中')
                    ])
                }
            });
        } else {
            constantMap.mainVM[constantMap.adaptComponent[constantMap.framework].waitingBox].hide();
        }
        
    }
}

uBase.utilService.getRolePermisson();


// uBase.utilService.getLastUpdateTime();
/*
    模态框服务类，用于需要弹窗场景
*/
uBase.modalService = {
    
    /* 
    打开弹出窗
    @param {object} param 配置参数
    */
    open : function (param) {
        // var c = Vue.component("u-panel");
        // _.find(param.vm.$root.$children,function(item){
        //     return item.$el.className == "mask-layer"
        // }).showPanel = true;
        var tempConfig = {
            title : param.title,
            content : param.content
        };
        if (_.isFunction(param.onOk)) {
            tempConfig.onOk = param.onOk;
        }
        constantMap.mainVM[constantMap.adaptComponent[constantMap.framework].modal][param.type](tempConfig);
    },

}


const communicationService = uBase.communicationService,
    utilService=uBase.utilService,
    modalService=uBase.modalService;


export {communicationService,utilService,modalService};
// export default uBase.communicationService