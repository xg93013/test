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
      // redirect: { path: '/plan' },
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
      // redirect: { path: '/PlanFormulation' },
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
        path: '/ManageAnalyze',
        name: '管理分析',
        component: () => import("@/views/plan/ManageAnalyze.vue")
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
        path: '/MatchDetail/:matchType/:planNo/:taskId/:taskStatus',
        name: '配置匹配得分',
        component: () => import("@/views/riskManage/MatchDetail.vue")
      }, {
        path: '/Inspection',
        name: '现场检查',
        component: () => import("@/views/inspection/Inspection.vue")
      }, {
        path: '/DocFormulation',
        name: '报告编制',
        component: () => import("@/views/inspection/DocFormulation.vue")
      }, {
        path: '/DocApproval',
        name: '报告审批',
        component: () => import("@/views/inspection/DocApproval.vue")
      }, {
        path: '/InspectionResult/:planNo/:enterpriseId/:taskId',
        name: '结果填报',
        component: () => import("@/views/inspection/InspectionResult.vue")
      }, {
        path: '/Tracking',
        name: '跟踪指导',
        component: () => import("@/views/tracking/Tracking.vue")
      }, {
        path: '/TrackingResult/:planNo/:enterpriseId/:taskId',
        name: '跟踪指导结果填报',
        component: () => import("@/views/tracking/TrackingResult.vue")
      }]
    },
    {
      path: '/modeManage',
      component: home,
      name: '体系检查模板管理',
      // redirect: { path: '/ProgramFormulation' },
      children: [{
        path: '/ModeEdit',
        name: '模板编辑',
        component: () => import("@/views/modeManage/ModeEdit.vue")
      }, {
        path: '/ModeSearch',
        name: '模板查询',
        component: () => import("@/views/modeManage/ModeSearch.vue")
      }]
    },
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
        path: '/ViewMatch/:matchType/:planNo/:taskId/:taskStatus',
        name: '得分详情',
        component: () => import("@/views/riskManage/MatchDetail.vue")
      }, {
        path: '/ViewInspection/:viewType/:enterpriseName/:taskId/:enterpriseType',
        name: '预览动态风险因素分值',
        component: () => import("@/views/inspection/children/InspectionDetail.vue")
      }, {
        path: '/ViewInspection/:viewType/:enterpriseName/:taskId/:enterpriseType',
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
