import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const index = r => require.ensure([], () => r(require('../view/index')), 'index') //首页

const adverseWarning = r => require.ensure([], () => r(require('../view/AdverseWarning/AdverseWarning')), 'AdverseWarning')  //不良反应预警

const rearchWarning = r => require.ensure([], () => r(require('../view/RearchWarning/RearchWarning')), 'RearchWarning')  //药物研发预警

const specialWarning = r => require.ensure([], () => r(require('../view/SpecialWarning/SpecialWarning')), 'SpecialWarning')  //特殊药品领域预警

const error = r => require.ensure([], () => r(require('../view/error')), 'error') //错误界面

export default new Router({
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        redirect: 'adverseWarning',
        children: [{
            path: 'adverseWarning',
            name: 'adverseWarning',
            component: adverseWarning
        },{
            path: 'specialWarning',
            name: 'specialWarning',
            component: specialWarning
        },{
            path: 'rearchWarning',
            name: 'rearchWarning',
            component: rearchWarning
        }]
    }, {
        path: '*',
        name: 'error',
        component: error
    }]
})