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
  PLAN_STATUS: '/apis/plan/status', // 计划状态列表
  PLAN_NAME: '/apis/plan/planName', // 计划名称列表

  /**
   * 计划审批
   */
  PLAN_APPROVE: '/apis/plan_approve', // 审批列表（planNo根据计划编号查询计划信息及审批历史）
  PLANAPPROVAL_STATUS: '/apis/plan_approve/status', // 状态列表
  PLANAPPROVAL_NAME: '/apis/plan_approve/planName', // 名称列表
  PLANAPPROVE_APPROVE: '/apis/plan_approve/approve', // 审批操作 
  PLANAPPROVE_PUBLISH: '/apis/plan_approve/publish', // 发布操作 


  /**
   * 计划概览
   */
  PLAN_OVERVIEW: '/apis/plan_overview', // 计划概览列表
  OVERVIEW_PRODUCT: '/apis/plan_overview/product', // 农产品列表树
  PLAN_OVERVIEW_FILE: '/apis/plan_overview/file', // 归档操作
  PLAN_OVERVIEW_SAMPLE: '/apis/plan_overview/sample', // 多维查询列表
  PLAN_OVERVIEW_STATUS: '/apis/plan_overview/status', // 计划状态列表 


  /**
   * 监测要素数据获取
   */
  META_PRODUCTTYPE: '/apis/metadata/product/type', // 农产品业态列表
  META_INSTITUTION: '/apis/metadata/institution', // 机构列表
  META_PRODUCT: '/apis/metadata/product', // 获取农产品分类
  META_JUDGEMENTSTANDARD: '/apis/metadata/judgementStandard', // 判定标准列表 
  META_PLANTYPE: '/apis/metadata/planType', // 计划类型列表
}