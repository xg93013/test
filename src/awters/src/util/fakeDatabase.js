// import riverDataO from '@/data/data.js';
import regions from '@/data/region.json';
// import globalData from '@/data/json_result.json';
import regionDataO from '@/data/mmmm_manager_resource.json';
import resourceDataO from '@/data/mmmm_resource.json';
import pollutionDataO from '@/data/mmmm_water_pollution.json';
import complaintsDataO from '@/data/complaints.json';
// var Mock = require('mockjs');
import Mock from 'mockjs';

let resourceData,pollutionData,riverData,regionData,complaintsData;
let monitoringPointData = [
        {label:'成华区',value:9},
        {label:'金牛区',value:10},
        {label:'崇州市',value:5},
        {label:'大邑县',value:5},
        {label:'都江堰市',value:8},
        {label:'高新区',value:9},
        {label:'简阳市',value:3},
        {label:'金堂县',value:5},
        {label:'锦江区',value:10},
        {label:'龙泉驿区',value:7},
        {label:'彭州市',value:5},
        {label:'郫都区',value:5},
        {label:'蒲江县',value:4},
        {label:'青白江区',value:7},
        {label:'青羊区',value:10},
        {label:'邛崃市',value:5},
        {label:'双流区',value:10},
        {label:'天府新区',value:9},
        {label:'温江区',value:5},
        {label:'武侯区',value:12},
        {label:'新都区',value:5},
        {label:'新津县',value:5}
];

let regionAreaData = {"all":14400597321.78711,"成华区":109020487.94335938,"金牛区":107859363.52929688,"崇州市":1091635970.1230469,"大邑县":1287141674.5253906,"都江堰市":1212556342.1386719,"高新区":82011140.01367188,"简阳市":2240291221.7773438,"金堂县":1159488166.6445312,"锦江区":60926241.59375,"龙泉驿区":557268820.84375,"彭州市":1425592072.0253906,"郫都区":438236857.4042969,"蒲江县":582034699.46875,"青白江区":379850332.2246094,"青羊区":66508220.1015625,"邛崃市":1381518788.8378906,"双流区":472090219.5488281,"天府新区":563952465.3320312,"温江区":277693927.59765625,"武侯区":75993511.81835938,"新都区":498851600.50390625,"新津县":330075197.7910156};

(function initData () {
    // riverData = _.cloneDeep(riverDataO);

    regionData = _.cloneDeep(_.map(regionDataO, (item, key) =>{
        item.name = key;
        return item
    }));

    resourceData = resourceDataO.result.map((item,index) => {
        // item.id = index;
        return item;
    });

    pollutionData = pollutionDataO.result.map((item,index) => {
        // item.id = index;
        // item[item.pollution_type] = item[]
        for (var i in item) {
            if (i.includes('_norm')) {
                item[i.split('_norm')[0]] = item[i];
            }
        }
        item.pollution_typeO = item.pollution_type;
        item.pollution_type = [item.pollution_type];
        return item;
    });

    complaintsData = complaintsDataO;
})()


function extractParams(url){
    var params={};
    if (url.indexOf('?') == -1) {
        return params;
    }
    var paramsArr = decodeURIComponent(url).split("?")[1].split("&");
    for (var i of paramsArr){
        let temp = i.split("=");
        params[temp[0]] = temp[1]
    }
    return params;
}

Mock.mock(/.{0}\/getWaterResourceData.{0}/,'get',function (params) {
    var filterObj = extractParams(params.url);

    var filteredData,pagedData;
    if (filterObj.id) {
        filteredData = [_.find(resourceData ,(item)=>{return item.id == filterObj.id})]
    } else {
        filteredData = _.filter(resourceData, function (item, index) {
            return ((filterObj.region && filterObj.region != 'all')  ? item.region.toString().includes(filterObj.region) : true) && (filterObj.rType && filterObj.rType !== 'all' ? (filterObj.rType == 'river' ? !item.type.includes('F') : item.type.includes('F')) : true)
        });
        // filteredData = resourceData;
    }

    if(!_.isUndefined(filterObj.current) && !_.isUndefined(filterObj.size)){
        pagedData = filteredData.concat([]).splice(filterObj.current*filterObj.size, filterObj.size);
    } else {
        pagedData = filteredData;
    }

    return {
        code:0,
        data:pagedData,
        totalCount:filteredData.length
    }
});
console.log(';')
Mock.mock(/.{0}\/getPollutionData.{0}/,'get',function (params) {
    var filterObj = extractParams(params.url);

    var filteredData,pagedData;
    if (filterObj.waterId) {
        filteredData = _.filter(pollutionData,(item)=>{return item.id == filterObj.waterId})
    } else {
        filteredData = _.filter(pollutionData, function (item, index) {
            return ((filterObj.region && filterObj.region != 'all') ? item.through.toString().includes(filterObj.region) : true) && 
            (filterObj.rType && filterObj.rType !== 'all' ? (filterObj.rType == 'river' ? item.river == 'T' : item.river != 'T') : true) && 
            (filterObj.pType && filterObj.pType !== 'all' ? new Set([...new Set(filterObj.pType.split(','))].filter(x => new Set(item.pollution_type).has(x))).size != 0 : true)
        });
        
        // filteredData = pollutionData;
    }

    if(!_.isUndefined(filterObj.current) && !_.isUndefined(filterObj.size)){
        pagedData = filteredData.concat([]).splice(filterObj.current*filterObj.size, filterObj.size);
    } else {
        pagedData = filteredData;
    }

    return {
        code:0,
        data:pagedData,
        totalCount:filteredData.length
    }
});

Mock.mock(/.{0}\/regions$/,'get',function (params) {

    return {
        code:0,
        data:regions,
        totalCount:regions.length
    }

});

Mock.mock(/.{0}\/introData.{0}/,'get',function (params) {
    let tempData={};
    let filter = extractParams(params.url);
    let gisDataNum = 205;
    if (filter && regionData.filter(item => item.name == filter.county).length != 0) {
        tempData = _.cloneDeep(regionData.filter(item => item.name == filter.county)[0]);
        tempData.monitoringPoint_num = monitoringPointData.find(item=>item.label == filter.county).value;
        tempData.complaints_num = complaintsData.filter(item => item['来电区域'] == filter.county).length;
        tempData.gisdata_num = `${Math.round(gisDataNum * regionAreaData[filter.county] / regionAreaData.all)}G`;
    } else {
        tempData = {
            name : '成都',
            water_quality:_.meanBy(regionData,'water_quality'),
            water_index:_.meanBy(regionData,'water_index'),
            rivers_num:_.sumBy(regionData,'rivers_num'),
            rivers_area:_.sumBy(regionData,'rivers_area'),
            others_num: _.sumBy(regionData,'others_num'),
            others_area: _.sumBy(regionData,'others_area'),
            lakes_num:_.sumBy(regionData,'lakes_num'),
            lakes_area:_.sumBy(regionData,'lakes_area'),
            pollution_area: _.sumBy(regionData, 'pollution_area'),
            pollution_num: _.sumBy(regionData, 'pollution_num'),
            monitoringPoint_num : _.sumBy(monitoringPointData, item => item.value),
            complaints_num : complaintsData.length,
            gisdata_num : `${gisDataNum}G`
        }
    }
    // tempData.cd_area = regionAreaData.all;
    tempData.rivers_num += tempData.others_num;
    tempData.rivers_area += tempData.others_area;
    tempData.total_num = tempData.rivers_num + tempData.lakes_num;
    tempData.total_area = tempData.rivers_area + tempData.lakes_area;
    return {
        code:0,
        data:tempData,
        // totalCount:globalData.length
    }

});
// 查询污染统计
Mock.mock(/.{0}\/pollutionStatistics.{0}/,'get',function (params) {
    let tempData, filterData;
    let filterObj = extractParams(params.url);

    // if (filter && regionData.filter(item=> item.name == filter.county).length != 0) {
    //     filterData = pollutionData.filter(item => item.through.includes(filter.county));
    // } else {
    //     filterData = pollutionData;
    // }
    filterData = _.filter(pollutionData, function (item, index) {
        return ((filterObj.region && filterObj.region != 'all') ? item.through.toString().includes(filterObj.region) : true) && 
        (filterObj.rType && filterObj.rType !== 'all' ? (filterObj.rType == 'river' ? item.river == 'T' : item.river != 'T') : true) && 
        (filterObj.pType && filterObj.pType !== 'all' ? new Set([...new Set(filterObj.pType.split(','))].filter(x => new Set(item.pollution_type).has(x))).size != 0 : true)
    });
    let lzData = filterData.filter(item => item.pollution_type[0] == 'lvzao'),
        hcData = filterData.filter(item => item.pollution_type[0] == 'heichou'),
        nsData = filterData.filter(item => item.pollution_type[0] == 'nisha');
    tempData = {
        lvzao: {
            count : lzData.length,
            area : _.sumBy(lzData,item => item.ares)
        },
        heichou:{
            count : hcData.length,
            area : _.sumBy(hcData,item => item.ares)
        },
        nisha:{
            count : nsData.length,
            area : _.sumBy(nsData,item => item.ares)
        },
        total : {
            count : 0,
            area : 0
        }
    }

    tempData.total.count = _.sumBy(_.map(tempData), item => item.count);
    tempData.total.area = _.sumBy(_.map(tempData), item => item.area);

    return {
        code:0,
        data:tempData,
        // totalCount:globalData.length
    }

});

Mock.mock(/.{0}\/regionsData.{0}/,'get',function (params) {
    var data = regionData;
    return {
        code:0,
        data,
        totalCount: data.length
    }
});

Mock.mock(/.{0}\/monitoringData.{0}/,'get',function (params) {
    let filter = extractParams(params.url);
    let data = [];
    let counties = filter.county.split(',');
    for (let county of counties) {
        for (let i =0; i< monitoringPointData.find(item => item.label == county).value; i++) {
            data.push({
                name : county + '模拟水体监测站点' + (i+1),
                date : `2018年10月${Math.floor(1 + Math.random() * 31)}日`,
                indexs :[
                    {label:'溶解氧',value: Math.floor(2 + Math.random() * 5) + 'mg/L'},
                    {label:'高锰酸盐指数',value: Math.floor(6 + Math.random() * 10)},
                    {label:'化学需氧量(COD)',value: Math.floor(15 + Math.random() * 26)},
                    {label:'氨氮(NH3-N)',value: Math.floor(15 + Math.random() * 1986) / 1000},
                    {label:'总磷',value: Math.floor(1 + Math.random() * 20) / 10}
                ]
            });
        }
    }

    data.sort((a,b) => b.date.split('月')[1].split('日')[0] * 1 - a.date.split('月')[1].split('日')[0] * 1)

    return {
        code:0,
        data,
        totalCount: data.length
    }
});

Mock.mock(/.{0}\/complaints.{0}/,'get',function (params) {
    let filter = extractParams(params.url);
    let data = [];
    let counties = filter.county.split(',');
    
    data = complaintsData.filter(item => {
        return counties.includes(item['来电区域'])
    });
    data.sort((a,b) => new Date(b['来电时间'].split(' ')[0]) - new Date(a['来电时间'].split(' ')[0]))

    return {
        code:0,
        data,
        totalCount: data.length
    }
});

Mock.setup({
    timeout: "100-200"
})

// export default http