import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const warningCenter = r => require.ensure([], () => r(require('../view/warningCenter')), 'warningCenter')//登录页

const inspectResult = r => require.ensure([], () => r(require('../view/inspectResult/inspectResult.vue')), 'inspectResult')//核查结果主页

const resultNetfood = r => require.ensure([], () => r(require('../view/inspectResult/resultNetfood.vue')), 'resultNetfood')//网络餐饮

const foodWaste = r => require.ensure([], () => r(require('../view/inspectResult/foodWaste.vue')), 'foodWaste')//餐厨垃圾

const error = r => require.ensure([], () => r(require('../view/error')), 'error')//登录页

export default new Router({
  routes: [
    {
      path: '/',
      name: 'warningCenter',
      component: warningCenter
    },
    {
      path: '/inspectResult',
      name: 'inspectResult',
      component: inspectResult,
      redirect: {path: '/resultNetfood'},
      children: [{
          path: '/resultNetfood',
          name: 'resultNetfood',
          component: resultNetfood,
      },{
        path: '/foodWaste',
        name: 'foodWaste',
        component: foodWaste,
    }]
    },
    {
      path: '*',
      name: 'error',
      component: error
    }
  ]
})
