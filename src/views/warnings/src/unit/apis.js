const exportBase =process.env.NODE_ENV=='development'?'https://lihong:1445':''
export default {

	/*
	 ** 定时刷新数据时间
	 */

	TIMING: 6000000000,//60秒

	/*
	 ** 导出接口
	 */

	UREPORT_EXCEL_UNQUALIFIED : exportBase + '/ureport/excel?_u=path*:unqualified.ureport.xml',//不合格食品
	UREPORT_EXCEL_OVERSAMPLE : exportBase + '/ureport/excel?_u=path*:overSample.ureport.xml', //过度抽检企业
	UREPORT_EXCEL_PUNISH : exportBase + '/ureport/excel?_u=path*:punish.ureport.xml', //行政处罚三次以上

	/*
	 ** 食品品类风险预警接口
	 */
	UN_C: '/un_c', // 获取5条不合格食品实时监测动态，/un_c/{reportNo}查看不合格食品明细,get
	C_DETAIL: '/c_detail', //查询某食品品种的抽检明细信息,get
	C_RANK: '/c_rank', //食品大类不合格率排行,get
	C_KEYFOOD: '/c_keyfood', //全国重点抽检食品
	UN_C_DETAIL: '/un_c_detail', ///un_c_detail/{category}/{pageNo}食品大类不合格明细,get

	/*
	 ** 检验项目风险预警
	 */
	I_CAUSERATIO: '/i_causeratio', ///检出不合格原因占比,get
	I_HIGHRISK: '/i_highrisk', ///高危检验项预警,get
	I_TOP_TEN: '/i_top10', //检验项目top10预警， get

	/*
	 ** 国际食品安全
	 */
	NEWS: '/news', //国际食品安全, get

	/*
	 ** 企业主体风险预警
	 */
	E_OVERSAMPLING_LIST: '/e_oversampling/list', //过度抽检企业预警,get
	E_OVERSAMPLING: '/e_oversampling', ///e_oversampling/{name}/{pageNo},过度抽检企业详情,get
	E_PUNISH_LIST: '/e_punish/list', //行政处罚三次以上的企业列表,get
	E_PUNISH: '/e_punish', ///e_punish/{name}/{pageNo}，处罚三次以上企业详情,get

	/*
	** 成都流出不合格食品分布
	*/

	OUTFLOW_LIST: '/outflow/list',//成都流出不合格食品分布,get
	OUTFLOW_DETAIL: '/outflow/detail', //不合格食品分布详情, get

	/*
	** 监管效能分析
	*/

	REGULATORY_CAPACITIES: '/regulatory/capacities', //各区县监管能力对比,get
	SAMPLE_COVERAGE: '/regulatory/sampleCoverage', //抽检覆盖率，get
	SAMPLE_UNQUALIFIED_RATIO: '/regulatory/sampleUnqualifiedRatio', //检验不合格率,get
	ENTERPRISE_GRADE: '/regulatory/enterpriseGrade', //企业分级律
	REEXAMING_PROBLEM: '/regulatory/reexamingProblem', //整改数据异常

	// 餐饮智慧监管平台预警
	GRAPH_CATERING: '/catering/graph', // 图表数据 GET
	ILLEGALSHOPEW: '/catering/illegalShopEW', // 网络餐饮违规店铺预警 GET
	FOODWASTE: '/catering/foodWasteEW', // 餐厨垃圾预警 GET
	ATTENTION: '/catering/attention', // 重点关注 GET

	// 核查结果网络餐饮
	INSPECT_LIST: '/inspect/netfood/list', // GET 核查结果
	LISTDATE: '/inspect/netfood/listDate', // GET 时间状态
	INSPECT_STATUS: '/inspect/netfood/status', // GET 网络餐饮核查结果状态统计
	UPLOAD_NETFOOD: '/inspect/upload/netfood', // POST 导入网络餐饮 
	UPLOAD_FOODWASTE: ''
}

