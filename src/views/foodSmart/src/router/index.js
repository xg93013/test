import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const index = r => require.ensure([], () => r(require('../view/index')), 'index') //首页

const home = r => require.ensure([], () => r(require('../view/home/home.vue')), 'home') //引导页

// const riskMap = r => require.ensure([], () => r(require('../view/newBusinessRisk/businessRisk.vue')), 'riskMap') //网络餐饮监管地图

const riskMap = r => require.ensure([], () => r(require('../view/riskMap/riskMap.vue')), 'riskMap') // 地图

const warningAnalysis = r => require.ensure([], () => r(require('../view/warningAnalysis/warningAnalysis.vue')), 'warningAnalysis') // 地图

const inspectResult = r => require.ensure([], () => r(require('../view/inspectResult/inspectResult.vue')), 'riskMap') //核查结果

const netfood = r => require.ensure([], () => r(require('../view/inspectResult/netfood.vue')), 'netfood') //核查结果

const foodWaste = r => require.ensure([], () => r(require('../view/inspectResult/foodWaste.vue')), 'foodWaste') //核查结果

const error = r => require.ensure([], () => r(require('../view/error')), 'error') //错误界面

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        redirect: '/riskMap',
        children: [{
            path: '/home',
            name: 'home',
            component: home
        },{
            path: '/riskMap',
            name: 'riskMap',
            component: riskMap
        },{
            path: '/inspectResult',
            name: 'inspectResult',
            component: inspectResult,
            redirect: '/netfood',
            children: [{
            	path: '/netfood',
            	name: 'netfood',
            	component: netfood
            },{
            	path: '/foodWaste',
            	name: 'foodWaste',
            	component: netfood
            }]
        },{
            path: '/warningAnalysis',
            name: 'warningAnalysis',
            component: warningAnalysis
        }]
    }, {
        path: '*',
        name: 'error',
        component: error
    }]
})