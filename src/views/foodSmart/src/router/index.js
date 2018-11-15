import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const index = r => require.ensure([], () => r(require('../view/index')), 'index') //首页

const home = r => require.ensure([], () => r(require('../view/home/home.vue')), 'home') //引导页

const riskMap = r => require.ensure([], () => r(require('../view/riskMap/riskMap.vue')), 'riskMap') //地图

// const specialWarning = r => require.ensure([], () => r(require('../view/SpecialWarning/SpecialWarning')), 'SpecialWarning')  //特殊药品领域预警

const error = r => require.ensure([], () => r(require('../view/error')), 'error') //错误界面

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        redirect: 'riskMap',
        children: [{
            path: 'home',
            name: 'home',
            component: home
        },{
            path: 'riskMap',
            name: 'riskMap',
            component: riskMap
        }]
    }, {
        path: '*',
        name: 'error',
        component: error
    }]
})