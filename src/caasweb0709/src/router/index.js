import Vue from 'vue'
import Router from 'vue-router'

const home = () => import("@/views/home/home.vue");

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      redirect: { path: '/plan' },
      children: []
    },
    {
      path: '/plan',
      component: home,
      name: '计划管理',
      redirect: { path: '/plan/PlanFormulation' },
      children: [{
        path: 'PlanFormulation',
        name: '计划编制',
        component: () => import("@/views/plan/PlanFormulation.vue")
      }, {
        path: 'PlanApproval',
        name: '计划审批',
        component: () => import("@/views/plan/PlanApproval.vue")
      }, {
        path: 'PlanOverview',
        name: '计划概览',
        component: () => import("@/views/plan/PlanOverview.vue")
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/login/login.vue")
    },
    {
      path: '/refresh',
      name: 'refresh',
      component: () => import("@/components/refresh.vue")
    },
    {
      path: '*',
      name: 'error',
      component: () => import("@/views/error.vue")
    }
  ]
})
