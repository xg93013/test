export default {
    /**
     * 首页
     **/

    INDEX_APPS: "/apis/index/apps", //外部结构

    /**
     * 地图
     **/

    MAP_LIST_TEN: "/apis/map/list10", //餐饮量化等级风险TOP10

    MAP_INFO: "/apis/map/info/", //获取单个企业的信息（点击评级分数的弹出框）

    MAP_LIST_ONE_HUNDRED: "/apis/map/list100",//企业列表TOP100

    MAP_QUERY: "apis/map/query",//企业列表

    MAP_AREA: "/apis/map/area", //区域列表

    MAP_STREET: "/apis/map/street/", //街道列表

    MAP_BUSINESSITEM: "/apis/map/businessitem", //经营项目列表

    /**
     * 企业全息档案
     **/

    ORG_DETAIL: "/apis/detail/", //单个企业详细信息

    DETAIL_SEARCH: "/apis/detail/enterprise", //企业列表参数name，pageNo

    DETAIL_PUNISHDATA: "/apis/detail/punishdata/",//{name}/{pageNo}获取企业的处罚信息

    DETAIL_PUNISHDATA_MONTH: "/apis/detail/punishdata/month/",//{name}/{pageNo}获取企业本月的处罚信息

    DETAIL_REGULATORYDATA: "/apis/detail/regulatorydata/", //获取企业的监管信息

    DETAIL_REGULATORYDATA_MONTH: "/apis/detail/regulatorydata/month/", //获取企业的本月监管信息

    DETAIL_NETFOOD: "/apis/detail/netfood/",//获取企业网餐预警信息

    DETAIL_NETFOOD_MONTH: "/apis/detail/netfood/month/",//获取企业本月网餐预警信息

    DETAIL_CHECKDATA: "/apis/detail/checkdata/",//{isHg}/{name}/{pageNo}获取企业的抽检数据 isHg 0抽检数据，1预警数据

    DETAIL_CHECKDATA_MONTH: "/apis/detail/checkdata/month/",//{isHg}/{name}/{pageNo}获取企业的抽检数据 isHg 0抽检数据，1预警数据

    DETAIL_EVALUATE: "/apis/detail/evaluate/", // 获取企业评级数据

    /**
     * 餐饮监管预警中心
     **/

    FULL_STATISTICS: "/apis/ew/fullStatistics",//全量统计数据

    AREA_FULL_STATISTICS: "/apis/ew/areaStatistics", //区域统计数据，默认为全量

    EW_LIST: "/apis/ew/list", //分页列表

    EW_EXPORT: "apis/ew/export?tab=", //导出apis/ew/export?tab=NETFOOD


    /** 
     * 预警处置核查结果
     **/

    INSPECT_LIST_DATE: "/apis/inspect/listDate", //时间控件

    INSPECT_STATUS: "/apis/inspect/status", //统计

    INSPECT_AREA: "/apis/inspect/area", //区域统计

    INSPECT_LIST: "/apis/inspect/list" //列表
}

