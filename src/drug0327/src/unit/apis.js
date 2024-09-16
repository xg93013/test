const exportBase = '/ureport/excel?_u=path*:';

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
	BASE: process.env.NODE_ENV == 'development' ? '/pro' : '', // 接口请求基地址

	BASE_URL: process.env.NODE_ENV == 'development' ? getBaseUrl() + 'pro' : getBaseUrl(), // window.open基地址

	/**
	 * 不良反应接口
	 */
	TIME_LINE: '/apis/adr/trend', // get 时间趋势

	REPORT_UNITOP10: '/apis/adr/reportUnitTop10', // get 医院上报TOP10

	DROPDOWN_LIST: '/apis/adr/listAll', // get 不良反应列表，用于下拉框数据填充

	ANALYSIS: '/apis/adr/analysis', // get 不良反应的怀疑药品分析

	GENER_DATA: '/apis/adr/analysis/gender', // get 获取性别分布

	AGE_DATA: '/apis/adr/analysis/age', // get 获取年龄分布

	IMPORTANT_DATA: '/apis/adr/analysis/important', // get 获取相关重要信息分布

	ADR_TIMES: '/apis/adr/adrTimes', // get 同种不良反应多次发生提示

	MERGE_DRUGEWS: '/apis/adr/mergeDrugEWs', // get 并用药品预警

	DRUGEVAL: '/apis/adr/drugEval', // get 药品关联性预警

	/**
	 * 药品领域预警
	 */
	DRUG_FLOWIN: '/apis/specialDrug/distribution/flowin',   // get 特殊药品流入福建的分布情况

	DRUG_FLOWOUT: '/apis/specialDrug/distribution/flowout',   // get 特殊药品流出福建的分布情况

	DRUG_IN: '/apis/specialDrug/distribution/in',   // get 特殊药品福建省内的分布情况

	DRUG_CIRCULATE: '/apis/specialDrug/drugCirculate',   // get 特殊药品流通预警

	DRUG_ENTERPRISE: '/apis/specialDrug/enterprise/',   // get 特殊药品企业主体预警

	LISTDATE: '/apis/specialDrug/listDate',   // get 列出所有有数据的时间

	LIST_DRUGTYPE: '/apis/specialDrug/listDrugType',   // get 列出特殊药品类型

	/**
	 * 药品研发预警
	 */
	EARLYWARING_ADR: '/apis/drugDevelop/earlywarning/adr',   // get 申报单位风险预警-不良反应

	EARLYWARING_PUNISH: '/apis/drugDevelop/earlywarning/punish',   // get 申报单位风险预警-行政处罚

	EARLYWARING_UNQUALIFY: '/apis/drugDevelop/earlywarning/unqualify',   // get 申报单位风险预警-抽检不合格

	DEVELOP_DISTRIBUTION: '/apis/drugDevelop/statistics/distribution',   // get 药物申报办件统计-区域分布

	DEVELOP_STATUS: '/apis/drugDevelop/statistics/status',   // get 药物申报办件统计-办理状态

	DEVELOP_TRENDS: '/apis/drugDevelop/statistics/trends',   // get 药物申报办件统计-时间趋势

	DEVELOP_BJRISK: '/apis/drugDevelop/statistics/risk', // GET 药物申报办件风险值


	/**
	 * 导出接口
	 */
	EXPORT_OCCURTIMES: exportBase + 'adr-occurtimes.ureport.xml', // 不良反应发生次数

	EXPORT_MERGEDRUG: exportBase + 'adr-mergedrug.ureport.xml', // 不良反应并用药品

	EXPORT_EVAL: exportBase + 'adr-eval.ureport.xml', // 不良反应关联性

	EXPORT_PUNISH: exportBase + 'dd-punish.ureport.xml', // 药物研发行政处罚

	EXPORT_UNQUALIFIED: exportBase + 'dd-unqualified.ureport.xml', // 药物研发抽检不合格

	EXPORT_ADR: exportBase + 'dd-adr.ureport.xml', // 药物研发不良反应

	EXPORT_CIRCULATE: exportBase + 'sd-circulate.ureport.xml', // 特殊药品流通

	EXPORT_ENTERPRISE: exportBase + 'sd-enterprise.ureport.xml', // 特殊药品企业主体

	SYSTEM_POWER: "/systempower", //系统菜单栏

	OIDC_LOGOUT: "/oidc_logout", //退出登录

	HOME_PAGE: "/homePage", //主页接口

	FOOD_DATE: '/apis/specialDrug/listDate', // 时间接口

	EXPORT_DDRISK: exportBase + 'dd-risk.ureport.xml', // 药物申报办件风险值导出

	/**
	 * 药品追溯
	 */

	DRUG_CIRCULATIONLINK: '/apis/drugRetrospect/getCirculationLink', // get流通环节分布

	DRUG_SALESTREND: '/apis/drugRetrospect/getSalesTrend', // get销量趋势

	DRUG_SALEINFO: '/apis/drugRetrospect/getSafeInfo', // get药品安全形势分布

	DRUG_DATELIST: '/apis/drugRetrospect/listDate', //get药品追溯时间

	DRUG_TYPELIST: '/apis/drugRetrospect/listDrugType', // get 药品种类

	DRUG_BASEINFO: '/apis/drugRetrospect/getBaseInfo', // get 生产信息 batchNo

	DRUG_TRANSFORM: '/apis/drugRetrospect/getTransform', // get 流通信息 batchNo

}