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
	TIMING: '',
	BASE: process.env.NODE_ENV == 'development' ? '/pro' : '', // 接口请求基地址

	BASE_URL: process.env.NODE_ENV == 'development' ? getBaseUrl() + 'pro' : getBaseUrl(), // window.open基地址	
	INSPECT_LIST: '',
	UPLOAD_FOODWASTE: '',	
	INSPECT_LIST: '',
	INSPECT_STATUS: '',	
	FOODWASTE_LIST: '',
	FOODWASTE_STATUS: '',

	GRAPH_CATERING: '/catering/graph', // 图表数据 GET
	ILLEGALSHOPEW: '/catering/illegalShopEW', // 网络餐饮违规店铺预警 GET
	FOODWASTE: '/catering/foodWasteEW', // 餐厨垃圾预警 GET
	ATTENTION: '/catering/attention', // 重点关注 GET

	// 监管平台导出名单
	UREPORT_EXCEL_NETFOOD : exportBase + '/ureport/excel?_u=path*:netfood.ureport.xml',// 导出网络餐饮
	UREPORT_EXCEL_FOODWASTE : exportBase + '/ureport/excel?_u=path*:foodwaste.ureport.xml', // 导出餐厨垃圾
	UREPORT_EXCEL_ATTENTION : exportBase + '/ureport/excel?_u=path*:attention.ureport.xml', // 导出重点关注
}