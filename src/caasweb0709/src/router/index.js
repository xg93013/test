import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = () => import("@/views/home/home.vue");

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'app',
      component: home,
      redirect: { path: '/guide' },
      children: []
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      // redirect: { path: '/program' },
      children: []
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import("@/views/guide/guide.vue")
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/login/login.vue")
    },
    {
      path: '/plan',
      component: home,
      name: '计划管理',
      redirect: { path: '/PlanFormulation' },
      children: [{
        path: '/PlanFormulation',
        name: '计划编制',
        titleName: '/PlanFormulation',
        component: () => import("@/views/plan/PlanFormulation.vue")
      }, {
        path: '/PlanApproval',
        name: '计划审批',
        component: () => import("@/views/plan/PlanApproval.vue")
      }, {
        path: '/PlanOverview',
        name: '计划概览',
        component: () => import("@/views/plan/PlanOverview.vue")
      }, {
        path: '/PlanDetail/:planType',
        name: '新增计划',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/PlanDetail/:planType',
        name: '编辑计划',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/PlanDetail/:planType',
        name: '复制并新增',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/PlanDetail/:planType',
        name: '预览',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/ApprovalDetail/:planType',
        name: '审批计划',
        component: () => import("@/views/plan/children/ApprovalDetail.vue")
      }]
    },
    {
      path: '/program',
      component: home,
      name: '项目管理',
      redirect: { path: '/ProgramFormulation' },
      children: [{
        path: '/ProgramFormulation',
        name: '项目编制',
        component: () => import("@/views/program/ProgramFormulation.vue")
      }, {
        path: '/ProgramApproval',
        name: '项目审批',
        component: () => import("@/views/program/ProgramApproval.vue")
      }, {
        path: '/ProgramOverview',
        name: '项目概览',
        component: () => import("@/views/program/ProgramOverview.vue")
      }]
    },
    {
      path: '/MonitoringManage',
      component: home,
      name: '检测管理',
      redirect: { path: '/MonitoringTask' },
      children: [{
        path: '/MonitoringTask',
        name: '检测任务列表',
        component: () => import("@/views/MonitoringManage/MonitoringTask.vue")
      }, {
        path: '/TaskAllocation',
        name: '检测任务分配',
        component: () => import("@/views/MonitoringManage/TaskAllocation.vue")
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
      path: '/view',
      name: '预览',
      component: () => import("@/views/view/index.vue"),
      redirect: { path: '/ViewPlan' },
      children: [{
        path: '/ViewPlan',
        name: '预览计划',
        component: () => import("@/views/plan/children/PlanView.vue")
      }]
    },
    {
      path: '*',
      name: 'error',
      component: () => import("@/views/error.vue")
    }
  ]
})
