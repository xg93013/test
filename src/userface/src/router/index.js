import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('../view/login')), 'login') ///登录页

const index = r => require.ensure([], () => r(require('../view/index')), 'index') ///首页

const comAnalysis = r => require.ensure([], () => r(require('../view/comAnalysis/comAnalysis')), 'comAnalysis') ///综合分析

const mt = r => require.ensure([], () => r(require('../view/licenceAnalysis/licenceAnalysis')), 'mt') ///证照分析--美团外卖

const elm = r => require.ensure([], () => r(require('../view/licenceAnalysis/licenceAnalysis')), 'elm') ///证照分析--饿了么

const bd = r => require.ensure([], () => r(require('../view/licenceAnalysis/licenceAnalysis')), 'bd') ///证照分析--百度外卖

const evaluateAnalysis = r => require.ensure([], () => r(require('../view/evaluateAnalysis/evaluateAnalysis')), 'evaluateAnalysis') ///评论分析

const riskAnalysis = r => require.ensure([], () => r(require('../view/riskAnalysis/riskAnalysis')), 'riskAnalysis') ///风险分析

const dataReport = r => require.ensure([], () => r(require('../view/dataReport/dataReport')), 'dataReport') ///数据报表

const account = r => require.ensure([], () => r(require('../view/account/account')), 'account') ///账户管理

const error = r => require.ensure([], () => r(require('../view/error')), 'error') ///错误界面

const errora = r => require.ensure([], () => r(require('../view/errora')), 'errora') ///错误界面
export default new Router({
    routes: [{
        path: '/',
        name: 'login',
        component: login
    }, {
        path: '*',
        name: 'error',
        component: error
    }, {
        path: 'error',
        name: 'error',
        component: error
    }, {
        path: '/errora',
        name: 'errora',
        component: errora
    }, {
        path: '/index',
        name: 'index',
        component: index,
        redirect: "/comAnalysis",
        children: [{
            path: '/comAnalysis',
            name: 'comAnalysis',
            component: comAnalysis
        }, {
            path: '/mt',
            name: 'mt',
            component: mt
        }, {
            path: '/elm',
            name: 'elm',
            component: elm
        }, {
            path: '/bd',
            name: 'bd',
            component: bd
        }, {
            path: '/evaluateAnalysis',
            name: 'evaluateAnalysis',
            component: evaluateAnalysis
        }, {
            path: '/riskAnalysis',
            name: 'riskAnalysis',
            component: riskAnalysis
        }, {
            path: '/dataReport',
            name: 'dataReport',
            component: dataReport
        }, {
            path: '/account',
            name: 'account',
            component: account
        }]
    }]
})