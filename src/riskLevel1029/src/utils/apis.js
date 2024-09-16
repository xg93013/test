const getBaseUrl = () => {
  let base = window.location.href;
  let index = base.indexOf('#');
  if (index > -1) {
    base = base.slice(0, index);
  } else {
    base = window.location.href;
  }
  return base
}
export default {

  EXPORT_BASE: process.env.NODE_ENV == "development"
    ? getBaseUrl() + "pro"
    : '',
  /**
   * 计划编制
   */
  PLAN: '/plan', // 计划列表
  VALIDATE: '/plan/validate', // 验证文件编号
  AUTO_PLANNONAME: '/plan/autoPlanNoAndName', // 新增计划时生成计划编号、计划名称
  PLAN_STATUS: '/plan/status', // 计划状态列表
  PLAN_NAME: '/plan/planName', // 计划名称列表

  /**
   * 计划审批
   */
  PLAN_APPROVE: '/plan_approve', // 审批列表（planNo根据计划编号查询计划信息及审批历史）
  PLANAPPROVAL_STATUS: '/plan_approve/status', // 状态列表
  PLANAPPROVAL_NAME: '/plan_approve/planName', // 名称列表
  PLANAPPROVE_APPROVE: '/plan_approve/approve', // 审批操作 
  PLANAPPROVE_PUBLISH: '/plan_approve/publish', // 发布操作 


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
  TASKS_ATTENDANCEFILE: '/tasks/attendanceFile', //   {taskId}03现场检查-任务列表-结果填报-首末次签到表
  TASK_TASKDYNAMIC: '/tasks/taskDynamic', // {taskId}03现场检查-任务列表-结果填报-获取动态风险因素
  TASK_TASKADVANCEMENT: '/tasks/taskAdvancement', // {taskId}03现场检查-任务列表-结果填报-获取企业体系先进性
  TASKS_TASK: '/tasks/task', // {taskId}03现场检查-任务列表-结果填报-获取企业状态信息
  TASK_ENTERPRISESTATUS: '/tasks/enterpriseStatus', // PATCH {taskId}03现场检查-任务列表-结果填报-企业状态(信息)
  TASKS_SUMMARY: '/tasks/taskDynamic/{taskId}/summary', // 03现场检查-任务列表-结果填报-获取动态风险因素（汇总）
  TASKS_TASKRECORD: '/tasks/taskRecord', // 检查记录表
  TASKS_TASKIMPORANT: '/tasks/taskImportant', // 重要事件记录
  TASKS_VERIFICATION: '/tasks/verification', // 跟踪指导获取
  TASKS_TASKSVERIFICATION: '/tasks/taskVerification', // {taskId}/{status}04跟踪指导-任务列表-结果填报

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

  /**
 * 监测要素数据获取
 */
  META_PRODUCTTYPE: '/apis/metadata/product/type', // 农产品业态列表
  META_INSTITUTION: '/apis/metadata/institution', // 机构列表
  META_PRODUCT: '/apis/metadata/product', // 获取农产品分类
  META_JUDGEMENTSTANDARD: '/apis/metadata/judgementStandard', // 判定标准列表 
  META_PLANTYPE: '/apis/metadata/planType', // 计划类型列表

  /**
   * 权限树
   */
  PERMISSIONS: '/permissions', // 权限列表
  USERINFO: '/userinfo',

  ACCOUNTS: '/common' // /SPOT_RECORD_GFP/accounts不同类型账户
}
