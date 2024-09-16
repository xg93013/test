import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = () => import('@/views/home/home.vue')

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'app',
      component: home,
      redirect: { path: '/home' },
      children: [],
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      // redirect: { path: '/plan' },
      children: [],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue'),
    },

    {
      path: '/plan',
      component: home,
      name: '计划管理',
      // redirect: { path: '/PlanFormulation' },
      children: [
        {
          path: '/PlanFormulation',
          name: '计划编制',
          titleName: '/PlanFormulation',
          component: () => import('@/views/plan/PlanFormulation.vue'),
        }, {
          path: '/TaskAllocation',
          name: '任务分配',
          component: () => import('@/views/task/TaskAllocation.vue'),
        }, {
          path: '/Allocation/:taskType/:planNo/:planName/:enterpriseType',
          name: '分配任务',
          component: () => import('@/views/task/Allocation.vue'),
        }, {
          path: '/PlanOverview',
          name: '计划概览',
          component: () => import('@/views/plan/PlanOverview.vue'),
        }, {
          path: '/ManageAnalyze',
          name: '管理分析',
          component: () => import('@/views/plan/ManageAnalyze.vue'),
        }, {
          path: '/PlanAdd/:planType',
          name: '新增计划',
          component: () => import('@/views/plan/children/PlanDetail.vue'),
        }, {
          path: '/PlanEdit/:planType/:planNo',
          name: '编辑计划',
          component: () => import('@/views/plan/children/PlanDetail.vue'),
        }, {
          path: '/PlanCopyAdd/:planType/:planNo',
          name: '复制并新增',
          component: () => import('@/views/plan/children/PlanDetail.vue'),
        }],
    },
    {
      path: '/riskManage',
      component: home,
      name: '风险评定管理',
      // redirect: { path: '/StaticAutoMatch' },
      children: [
        {
          path: '/StaticAutoMatch',
          name: '企业列表',
          component: () => import('@/views/riskManage/StaticAutoMatch.vue'),
        }, {
          path: '/StaticManualMatch',
          name: '手动匹配列表',
          component: () => import('@/views/riskManage/StaticManualMatch.vue'),
        },
        {
          path: '/MatchDetail/:matchType/:planNo/:taskId/:taskStatus',
          name: '配置匹配得分',
          component: () => import('@/views/riskManage/MatchDetail.vue'),
        }, {
          path: '/Inspection',
          name: '现场检查',
          component: () => import('@/views/inspection/Inspection.vue'),
        }, {
          path: '/DocFormulation',
          name: '报告编制',
          component: () => import('@/views/inspection/DocFormulation.vue'),
        }, {
          path: '/DocApproval',
          name: '报告审批',
          component: () => import('@/views/inspection/DocApproval.vue'),
        }, {
          path: '/Rectification',
          name: '整改复查',
          component: () => import('@/views/inspection/Rectification.vue'),
        }, {
          path: '/RectificationResult/:taskId/:type',
          name: '整改复查结果填报',
          component: () => import('@/views/tracking/TrackingResult.vue'),
        }, {
          path: '/RectificationResult/:taskId/:type',
          name: '整改复查任务详情',
          component: () => import('@/views/tracking/TrackingResult.vue'),
        }, {
          path: '/InspectionResult/:taskId/:inspectionType',
          name: '结果填报',
          component: () => import('@/views/inspection/InspectionResult.vue'),
        }, {
          path: '/Tracking',
          name: '跟踪指导',
          component: () => import('@/views/tracking/Tracking.vue'),
        }, {
          path: '/TrackingResult/:taskId/:type',
          name: '跟踪指导结果填报',
          component: () => import('@/views/tracking/TrackingResult.vue'),
        }, {
          path: '/DocDetail/:taskId/:type',
          name: '修改报告',
          component: () => import('@/views/inspection/children/DocDetail.vue'),
        },
        {
          path: '/DocDetail/:taskId/:type',
          name: '预览报告',
          component: () => import('@/views/inspection/children/DocDetail.vue'),
        }, {
          path: '/DocResult/:taskId/:type/',
          name: '审批报告',
          component: () => import('@/views/inspection/children/DocResult.vue'),
        },
        {
          path: '/DocResult/:taskId/:type/',
          name: '报告审批详情',
          component: () => import('@/views/inspection/children/DocResult.vue'),
        }
      ],
    },
    {
      path: '/modeManage',
      component: home,
      name: '体系检查模板管理',
      // redirect: { path: '/ProgramFormulation' },
      children: [
        {
          path: '/ModeEdit',
          name: '模板编辑',
          component: () => import('@/views/modeManage/ModeEdit.vue'),
        }, {
          path: '/ModeSearch',
          name: '模板查询',
          component: () => import('@/views/modeManage/ModeSearch.vue'),
        }],
    },
    {
      path: '/refresh',
      name: 'refresh',
      component: () => import('@/components/refresh.vue'),
    },
    {
      path: '/view',
      name: '预览',
      component: () => import('@/views/view/index.vue'),
      redirect: { path: '/ViewPlan' },
      children: [
        {
          path: '/ViewPlan/:planType/:planNo',
          name: '预览计划',
          component: () => import('@/views/plan/children/PlanDetail.vue'),
        }, {
          path: '/ViewTask/:taskType/:planNo/:enterpriseType',
          name: '任务预览',
          component: () => import('@/views/task/Allocation.vue'),
        }, {
          path: '/ViewMatch/:matchType/:planNo/:taskId/:taskStatus',
          name: '得分详情',
          component: () => import('@/views/riskManage/MatchDetail.vue'),
        }, {
          path: '/ViewInspection/:viewType/:enterpriseName/:taskId/:enterpriseType',
          name: '预览动态风险因素分值',
          component: () => import('@/views/inspection/children/TableDetail.vue'),
        }, {
          path: '/ViewInspection/:viewType/:enterpriseName/:taskId/:enterpriseType',
          name: '预览企业体系先进性得分',
          component: () => import('@/views/inspection/children/TableDetail.vue'),
        }, {
          path: '/MoreDimension/:planNo/:name/:planId/:planType',
          name: '数据查询',
          component: () => import('@/views/plan/children/MoreDimension.vue'),
        }, {
          path: '/TaskDetail/:taskId/:enterpriseName/:taskStatus/:enterpriseType/:planNo',
          name: '任务详情',
          component: () => import('@/views/task/TaskDetail.vue'),
        }, {
          path: '/InspectionDetail/:taskId/:inspectionType',
          name: '现场检查详情',
          component: () => import('@/views/inspection/InspectionResult.vue'),
        }, {
          path: '/TrackingDetail/:taskId/:type',
          name: '跟踪指导填报详情',
          component: () => import('@/views/tracking/TrackingResult.vue'),
        }],
    },
    {
      path: '*',
      name: 'error',
      component: () => import('@/views/error.vue'),
    },
  ],
})
