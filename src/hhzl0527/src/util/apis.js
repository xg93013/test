export default {

    /*
     ** 定时刷新数据时间
     */

    TIMING: 60000,//60秒


    //网络理政数据
    COMPLAINTS : '/complaints',
    // 物联网监测站
    MONITORINGDATA: '/iot/monitoringData',
    // 物联网监测站数量（区县）
    MONITORINGSTATIONNUMBER: '/iot/monitoringStationNumber',

    TOTAL_DETAIL: '/water/resource/total/detail', // 水资源智能提取 get month district

    TOTAL_NUM: '/water/resource/total', // 总数 get district month

    RICH_INDEX: '/water/resource/rich_index', // 区县丰富指数  district month

    WATER_RESOURCE: '/water/resource', // 水资源列表 district month pType rType page pageSize ({id} 单个水资源)

    WATER_POLLUTION: '/water/pollution', // 水污染列表  district month pType rType id

    POLLUTION_CLASSIFY: '/water/pollution/classify', // 污染类型智能识别分类 district month pType rType id

    POLLUTION_INDEX: '/water/pollution/index', // 区县水质感官污染指数 district month

    POLLUTION_INDEX_RANK: '/water/pollution/index/rank', // 区县水质感官污染指数排名 district month (水污染排行 pType rType)

    POLLUTION_INDEX_TREND: '/water/pollution/trend', // 水质感官污染指数趋势变化 district type

    COMPLAINTS_TREND: '/complaints/trend', // 网络理政诉求数量趋势分析 district

    FUZZY_SEARCH: '/water/resource/fuzzy_search', // 水资源模糊查询 month name

    STATELLITEDATASIZE: '/iot/satelliteDataSize', // 卫星遥感数据 regionName

    AVAILABLE_MONTH: '/iot/month/available', // 查询遥感数据的可用年月

    MONITORINGSTATION: '/iot/monitoringStation', // 根据区县获取所有检测站点 district

    MONITORINGSTATION_TREND: '/iot/monitoringStation/trend' // 根据月份和坐标点获取监测站点各指标趋势 latitude longitude month

}

