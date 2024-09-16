export default {
	HOME_PAGE: "/homePage", //主页接口

	OIDC_LOGOUT: "/oidc_logout", //退出登录

	SYSTEM_POWER: "/systempower", //系统菜单栏

	FOOD_INDEX: "/food/index/?dateValue=", //首页接口

	FOOD_MENU: "/food/menu", //get 数据关联分析菜单

	PRODUCT_ORDER: "/product/order/", //根据批次号查询详情

	FOOD_SUMMARY: "/food/summary/",//get 食品页面 /food/summary/{foodId}

	FOOD_DETAILS: "/food/details/",//get 食品页面详情 /food/details/{foodId}

	ENTERPRISE_RELATION: "/enterprise/relation/", //get 企业视角页面 /enterprise/relation/{enterpriseId}

	ENTERPRISE_INSPECTION: "/enterprise/inspection/", //get 食品视角企业环节 enterprise/inspection/{foodId} 

	ENTERPRISE_SEARCH: "/enterprise/search?enterpriseName=", //get 搜索企业列表 /enterprise/search?enterpriseName=

	UREPORT_PREVIEW: "/ureport/preview?_t=4,5&_u=classpath:agriculture.ureport.xml", //报表导出 dateType(年1，季度2，月3)dateValue,
	//&dateType=1&dateValue=2017年&_n=2017年福建省食品（农产品）监管分析报告&_title=2017年福建省食品（农产品）监管分析报告

	FOOD_DATE: "/food/date", //报表日期

}
