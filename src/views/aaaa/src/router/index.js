import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const index = r => require.ensure([], () => r(require('../view/index')), 'index') ///首页

const error = r => require.ensure([], () => r(require('../view/error')), 'error') ///错误界面
export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: login
    }, {
        path: '*',
        name: 'error',
        component: error
    }]
})