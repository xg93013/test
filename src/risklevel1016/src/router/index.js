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
      redirect: { path: '/home' },
      children: []
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: { path: '/plan' },
      children: []
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
      redirect: { path: '/TaskAllocation' },
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
        path: '/TaskAllocation',
        name: '任务分配',
        component: () => import("@/views/task/TaskAllocation.vue")
      }, {
        path: '/Allocation/:taskType/:planNo/:planName',
        name: '分配任务',
        component: () => import("@/views/task/Allocation.vue")
      }, {
        path: '/PlanOverview',
        name: '计划概览',
        component: () => import("@/views/plan/PlanOverview.vue")
      }, {
        path: '/PlanAdd/:planType',
        name: '新增计划',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/PlanEdit/:planType/:planNo',
        name: '编辑计划',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/PlanCopyAdd/:planType/:planNo',
        name: '复制并新增',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/ApprovalPlan/:planType/:planNo',
        name: '审批计划',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/ArchiveDetail/:planType/:planNo',
        name: '归档计划',
        component: () => import("@/views/plan/children/ArchiveDetail.vue")
      }, {
        path: '/MoreDimension/:planNo/:name',
        name: '数据查询',
        component: () => import("@/views/plan/children/MoreDimension.vue")
      },
        // {
        //   path: '/analyze',
        //   name: 'analyze',
        //   component: () => import("@/views/analyze/analyze.vue")
        // }
      ]
    },
    {
      path: '/riskManage',
      component: home,
      name: '风险评定管理',
      // redirect: { path: '/StaticAutoMatch' },
      children: [{
        path: '/StaticAutoMatch',
        name: '企业列表',
        component: () => import("@/views/riskManage/StaticAutoMatch.vue")
      }, {
        path: '/StaticManualMatch',
        name: '手动匹配列表',
        component: () => import("@/views/riskManage/StaticManualMatch.vue")
      },
      // {
      //   path: '/MatchDetail/:matchType',
      //   name: '得分详情',
      //   component: () => import("@/views/riskManage/MatchDetail.vue")
      // }, 
      {
        path: '/MatchDetail/:matchType/:planNo/:taskId/:taskNo',
        name: '配置匹配得分',
        component: () => import("@/views/riskManage/MatchDetail.vue")
      }, {
        path: '/Inspection',
        name: '现场检查',
        component: () => import("@/views/inspection/Inspection.vue")
      }, {
        path: '/InspectionResult/:planNo/:enterpriseId/:taskId',
        name: '结果填报',
        component: () => import("@/views/inspection/InspectionResult.vue")
      }]
    },
    // {
    //   path: '/program',
    //   component: home,
    //   name: '项目管理',
    //   redirect: { path: '/ProgramFormulation' },
    //   children: [{
    //     path: '/ProgramFormulation',
    //     name: '项目编制',
    //     component: () => import("@/views/program/ProgramFormulation.vue")
    //   }, {
    //     path: '/ProgramApproval',
    //     name: '项目审批',
    //     component: () => import("@/views/program/ProgramApproval.vue")
    //   }, {
    //     path: '/ProgramOverview',
    //     name: '项目概览',
    //     component: () => import("@/views/program/ProgramOverview.vue")
    //   }, {
    //     path: '/ProgramEdit/:programType/:programNo',
    //     name: '编制项目',
    //     component: () => import("@/views/program/children/ProgramDetail.vue")
    //   }]
    // },
    // {
    //   path: '/MonitoringManage',
    //   component: home,
    //   name: '检测管理',
    //   redirect: { path: '/MonitoringTask' },
    //   children: [{
    //     path: '/MonitoringTask',
    //     name: '检测任务列表',
    //     component: () => import("@/views/MonitoringManage/MonitoringTask.vue")
    //   }, {
    //     path: '/TaskAllocation',
    //     name: '检测任务分配',
    //     component: () => import("@/views/MonitoringManage/TaskAllocation.vue")
    //   }]
    // },
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
        path: '/ViewPlan/:planType/:planNo',
        name: '预览计划',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/ApprovalDetail/:planType/:planNo',
        name: '审批详情',
        component: () => import("@/views/plan/children/PlanDetail.vue")
      }, {
        path: '/ViewTask/:taskType/:planNo',
        name: '任务预览',
        component: () => import("@/views/task/Allocation.vue")
      }, {
        path: '/ViewMatch/:planNo/:enterpriseId',
        name: '得分详情',
        component: () => import("@/views/riskManage/MatchDetail.vue")
      }, {
        path: '/ViewInspection/:viewType/:enterpriseName',
        name: '预览动态风险因素分值',
        component: () => import("@/views/inspection/children/InspectionDetail.vue")
      }, {
        path: '/ViewInspection/:viewType/:enterpriseName',
        name: '预览企业体系先进性得分',
        component: () => import("@/views/inspection/children/InspectionDetail.vue")
      }]
    },
    {
      path: '*',
      name: 'error',
      component: () => import("@/views/error.vue")
    }
  ]
})
