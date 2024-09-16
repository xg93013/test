const getBaseUrl = () => {
  let base = window.document.location.href;
  let index = base.indexOf('#');
  if (index > -1) {
    base = base.slice(0, index);
  } else {
    base = window.document.location.href;
  }
  return base
}
export default {

  EXPORT_BASE: process.env.NODE_ENV == "development"
    ? getBaseUrl() + "pro/"
    : getBaseUrl(),
  /**
   * 计划相关
   */
  PLAN: '/plan', // 计划列表
  VALIDATE: '/plan/validate', // 验证文件编号
  AUTO_PLANNO: '/plan/planno', //{year} 根据年份自动生成计划号
  ENTERPRISE_DISTRICT: '/plan/enterprise/district', // 通过区域筛选企业
  PLAN_DISTRICT: '/plan/district', // 所有区域
  PLAN_ENTERPRISE: '/plan/enterprise', // 企业详情
  PLAN_TASK: '/plan/task', //  {planNo}/{enterpriseId} 配置计划相关的检查任务  {planNo}/{pageNo}/{pageSize}根据获取计划编号获取相关的任务列表
  PLAN_AUTHORIZED: '/plan/authorized', //  (计划编制页面)通过筛选条件获取计划列表
  PLAN_STATUS: '/plan/status/count', // 获取计划状态统计
  PLAN_ALL: '/plan/all', // (计划概览页面)通过筛选条件获取计划列表


  /**
   * 计划概览
   */
  // PLAN_OVERVIEW: '/apis/plan_overview', // 计划概览列表
  // OVERVIEW_PRODUCT: '/apis/plan_overview/product', // 农产品列表树
  // PLAN_OVERVIEW_FILE: '/apis/plan_overview/file', // 归档操作
  // PLAN_OVERVIEW_SAMPLE: '/apis/plan_overview/sample', // 多维查询列表
  // PLAN_OVERVIEW_STATUS: '/apis/plan_overview/status', // 计划状态列表 

  /**
   * 任务相关
   */

  TASKS_ITEM: '/tasks/item', // 通过计划编号获取任务列表 201901-TXJC/1/10
  TASKS_STATUS: '/tasks/status', // 任务状态
  TASKS_SELECTITEM: '/tasks/select/item', // 获取任务选项筛选集合
  TASKS_TASKACTION: '/tasks/taskaction', // 通过任务编号条件获取任务列表
  TASKS: '/tasks', // {taskIds}下发任务(更改任务状态)
  ACCOUNTS_ALL: '/accounts/all', // 所有人员
  TASKS_ATTENDANCEFILE: 'tasks/attendanceFile', //   {taskId}03现场检查-任务列表-结果填报-首末次签到表
  TASK_TASKDYNAMIC: '/tasks/taskDynamic', // {taskId}03现场检查-任务列表-结果填报-获取动态风险因素
  TASK_TASKADVANCEMENT: '/tasks/taskAdvancement', // {taskId}03现场检查-任务列表-结果填报-获取企业体系先进性
  TASKS_TASK: '/tasks/task', // {taskId}03现场检查-任务列表-结果填报-获取企业状态信息
  TASK_ENTERPRISESTATUS: '/tasks/enterpriseStatus', // PATCH {taskId}03现场检查-任务列表-结果填报-企业状态(信息)
  TASKS_SUMMARY: '/tasks/taskDynamic/{taskId}/summary', // 03现场检查-任务列表-结果填报-获取动态风险因素（汇总）
  TASKS_TASKRECORD: '/tasks/taskRecord', // 检查记录表
  TASKS_TASKIMPORANT: '/tasks/taskImportant', // 重要事件记录
  TASKS_VERIFICATION: '/tasks/verification', // 跟踪指导获取
  TASKS_TASKSVERIFICATION: '/tasks/taskVerification', // {taskId}/{status}04跟踪指导-任务列表-结果填报
  TASKS_PREVIEW: '/tasks/report/preview',
  TASKS_UPDATE: '/tasks/report/update',
  TASKS_APPROVE_UPDATE: '/tasks/approve/update',
  TASKS_APPROVE_DETAIL: '/tasks/approve/detail',
  FOODCATEGORY: '/foodcategory',

  /**
   *  静态风险
   */
  SCORE: '/score', // {catregory}通过大类名称获取静态风险得分列表
  STATICRISK: '/staticrisk', // {taskNo}通过任务编号获取静态风险列表
  STATICRISK_RISK: '/staticrisk/risk', // 更新任务相关静态风险信息
  SCORE_CATEGORY: '/score/category', // 获取大类列表

  /**
   * 企业管理
   */
  ETP: '/etp', // {enterpriseId}查看企业

  /**
   * 检查记录表
   */
  PDRS_DYNAMICRISK: '/pdrs/dynamicrisk', // 

  /**
   * 企业先进性检查项目
   */
  PARS: '/pars', // 获取生产企业先进性检查项目

  /**
   * 导出相关
   */
  EXPORT_STATICRISKFACTOR: 'export/staticRiskFactor', // 静态风险因素'
  EXPORT_TRACKGUIDANCE: 'export/trackGuidance', // 跟踪指导'
  EXPORT_SPOTCHECK: 'export/spotCheck', // 现场检查
  EXPORT_REPORT: 'export/reportCompile', // 现场检查


  /**
 * 监测要素数据获取
 */
  META_INSTITUTION: '/apis/metadata/institution', // 机构列表

  /**
   * 权限树
   */
  PERMISSIONS: '/permissions', // 权限列表
  USERINFO: '/userinfo',

  ACCOUNTS: '/common' // /SPOT_RECORD_GFP/accounts不同类型账户
}
