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
    : getBaseUrl(),
  /**
   * 计划编制
   */
  PLAN: '/apis/plan', // 计划列表
  VALIDATE: '/apis/plan/validate', // 验证文件编号
  AUTO_PLANNONAME: '/apis/plan/autoPlanNoAndName', // 新增计划时生成计划编号、计划名称

  /**
   * 计划审批
   */
  PLAN_APPROVE: 'apis/plan_approve' // 审批列表

}