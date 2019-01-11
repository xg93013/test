export default {
    UPDATE_TIME: 5000000, //数据轮询更新时间
    CARD_CODE: { //证照分析排序
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

    PASSWORD: "/api/subscriber/password/modify", //修改密码,put

    ACL: "/api/subscriber/acl", //获取用户信息

    VERIFY_CODE: "/api/auth/verifycode/", //get /api/auth/verifycode/{clientTime}.jpg 获取二维码

    EXPORT_ANALYSIS: "/api/comprehensive/exportDynamicIllegalShop",

    /*
     *首页
     */

    STATISTICS: "/api/comprehensive/statistics", // 综合统计 get

    ILLEGAL_TYPE_COMPARE: "/api/comprehensive/illegalTypeCompare", //违规类型对比 get

    REGION_ILLEGAL_RATIOS: "/api/comprehensive/regionIllegalRatios", //违规率 get

    PLAT_FORM_COMPARE: "/api/comprehensive/platformCompare", //网络订餐平台对比 get

    SHOP_DYNAMIC: "/api/comprehensive/shopDynamic?lastReqTime=", //商家分析动态列表  lastReqTime参数时间戳

    REGION_JSON: "/api/dict/region.json", //获取地图边界数据

    EXPORT_ANALYSIS: "/api/comprehensive/exportDynamicIllegalShop", //商家分析动态导出 

    RISKWORDCLOUD_TOP50: "/api/comment/riskWordCloudTop50", // 风险词云

    /*
     *证照分析
     */

    ILLEGAL_COMPARE: "/api/certificate/illegalCompare/", //get 违规类型对比/api/certificate/illegalCompare/{platform}/{month},platform平台类型，month，日期

    ILLEGAL_RATIO_TREND: "/api/certificate/illegalRatioTrend/", //get 违规率变化趋势

    ILLEGAL_ZONE_COMPARE: "/api/certificate/illegalZoneCompare/", //get 违规商家数量区域对比

    ILLEGAL_SHOP_DETAIL: "/api/certificate/illegalShopDetail/", //get 违规商家列表  {platform}/{month}/{lastReqTime}

    EXPORT: "/api/certificate/illegalShopDetail/export/", //get 导出违规商家列表

    /*
     *账户管理 
     */

    TENANT: "/api/user", //get，查询账户，post，创建账户，delete，删除账户，put，修改账户

    REGION: '/api/user/region/', //获取省,市，区 get /api/dict/region/{regionType}

    PERMISSION: '/api/dict/permission/FRONT_END', // 权限列表 get

    PASSWORD_RESET: "/api/subscriber/password/reset", //重置密码

    /**
     * 评论分析
     */

    ALL_RISKTYPES: "/api/comment/riskTypes", // get 获取所有违规类型

    RISKTYPE_TRENDS: "/api/comment/riskTypeTrends", //get 风险词频变化趋势

    RISKWORDBUSMODE_PREDICTION: "/api/comment/riskWordBusModePrediction", //get 高风险业态预测

    RISKWORD_ABNORMAL: "/api/comment/riskWordAbnormal", //get 风险词频异常

    RISKTYPE_ANALYSISRATIOS: "/api/comment/riskTypeAnalysisRatios", //get 风险类型分析

    RISKTYPE_ANALYSIS_DETAIL: "/api/comment/riskTypeAnalysisDetails/", //get {riskWord}风险类型分析风险词详情

    DYNAMIC_COMMENTS: "/api/comment/dynamicComments", //get 动态评论分析列表

    RISKWORD_BUSMODESORT: "/api/comment/riskWordBusModeSort", //get 业态风险词频排序

    RISKWORD_BUSMODESORT_DETAIL: "/api/comment/riskWordBusModeSortDetails/", //get {businessMode}业态风险词详情

    RISKWORD_ZONESORT: "/api/comment/riskWordZoneSort", //get 区域风险词频排序

    RISKWORD_ZONESORT_DETAIL: "/api/comment/riskWordZoneSortDetails/", //get {zoneCode}区域风险词频详情

    RISKWORD_SHOPTOP50: "/api/comment/riskWordShopTop50", //get {riskTypes}风险词频top50商家

    RISKWORD_BUSMODEDETAIL: "/api/comment/riskWordBusModeSortDetails/", //get {shopId}根据店铺id查询评论详情

    COMMENT_DETAIL: "/api/comment/commentDetails/", //get {shopId}{riskWord}根据店铺id和风险词查询评论详情

    TOP_COMMENT_DETAIL: "/api/comment/topnCommentDetails" //get {shopId}{riskTypes}根据店铺id和风险类型查询评论详情， 为top50商家
}