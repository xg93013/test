export default {
	UPDATE_TIME: 5000,//数据轮询更新时间
	CARD_CODE: {//证照分析排序
		UN_PUBLICIZED: 0,
		VAGUE: 1,
		EXPIRED: 2,
		OVER_RAGE: 3,
		FORGERY: 4,
		MULTI_PURPOSE: 5
	}, //证照数据
	
	/*
	 *登录相关 
	 */
	
	LOGIN: "/api/auth/login", //登录，post

	LOGOUT: "/api/auth/logout", //退出登录 get
	
	PASSWORD: "/api/subscriber/password",//修改密码,put
	
	ACL: "/api/subscriber/acl",//获取用户信息
	
	VERIFY_CODE: "/api/auth/verifycode/" , //get /api/auth/verifycode/{clientTime}.jpg 获取二维码
	
	/*
	 *首页
	 */
	
	STATISTICS: "/api/comprehensive/statistics", // 综合统计 get

	ILLEGAL_TYPE_COMPARE: "/api/comprehensive/illegalTypeCompare", //违规类型对比 get

	REGION_ILLEGAL_RATIOS: "/api/comprehensive/regionIllegalRatios", //违规率 get
	
	PLAT_FORM_COMPARE: "/api/comprehensive/platformCompare", //网络订餐平台对比 get
	
	SHOP_DYNAMIC: "/api/comprehensive/shopDynamic?lastReqTime=", //商家分析动态列表  lastReqTime参数时间戳
	
	/*
	 *证照分析
	 */
	
	ILLEGAL_COMPARE: "/api/certificate/illegalCompare/",//get 违规类型对比/api/certificate/illegalCompare/{platform}/{month},platform平台类型，month，日期
	
	ILLEGAL_RATIO_TREND: "/api/certificate/illegalRatioTrend/",//get 违规率变化趋势
	
	ILLEGAL_ZONE_COMPARE: "/api/certificate/illegalZoneCompare/",//get 违规商家数量区域对比
	
    ILLEGAL_SHOP_DETAIL: "/api/certificate/illegalShopDetail/", //get 违规商家列表  {platform}/{month}/{lastReqTime}
    
    EXPORT: "/api/certificate/illegalShopDetail/export/" //get 导出违规商家列表

}