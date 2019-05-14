// import {regionModule.setRegions,regionModule.setConvexHull} from '@/data/region.js';
import regionModule from '@/data/region.js';



let regionDataO,resourceDataO = {result:[]},pollutionDataO = {result:[]},complaintsDataO = [],regionsO, convexHullO;
let indexedDBused = true;

// window.indexedDB.deleteDatabase('yaogan');
var idxDbReq;
if (indexedDBused) {
    idxDbReq = window.indexedDB.open('yaogan');
    idxDbReq.onsuccess = function (event) {
        idxDb = idxDbReq.result;
        
        yaoganDBSuccess();
        // idxDb.close();
    }
    // }
    // upgrade事件成功（初次创建成功，可以创建表）
    idxDbReq.onupgradeneeded = function (event) {
        idxDb = event.target.result;

        createStores();
    }

    // 打开失败
    idxDbReq.onerror = function () {
        // 数据库打开失败直接读取文件
        getData();
    }
} else {
    getData();
}
var idxDb;

let dataGetting = true;
let waitingQueue = [];
// 打开成功
// async function dbSuccess() {

function createStores () {
    var timestampStore,allDataStore;
    if (!idxDb.objectStoreNames.contains('timeStamp')) {
        timestampStore = idxDb.createObjectStore('timeStamp',{autoIncrement: true});
    }
    if (!idxDb.objectStoreNames.contains('allData')) {
        allDataStore = idxDb.createObjectStore('allData',{autoIncrement: true});
        allDataStore.createIndex('name', 'name', { unique: true });
    }
}
/* 
    成功打开遥感数据库（通过数据库表中时间戳与打包时间戳对比，不一致则刷新）
 */
function yaoganDBSuccess () {
    // 获取时间戳
    var timeStampReadReq = idxDb.transaction(['timeStamp']).objectStore('timeStamp').get(1);

    timeStampReadReq.onsuccess = function (event) {
        // 存在时间戳
        if (timeStampReadReq.result) {
            if (process.env.timeStampHash === timeStampReadReq.result.value) {
                // 如果没有重新部署，则不更新数据库数据
                // 从数据库获取数据
                getData(true);
                console.log(`yaoganDB：${process.env.timeStampHash}(${new Date(process.env.timeStampHash)})未发现更新`);
            } else {
                // 获取元数据
                getData(false, updateDataBaseData);
                var timeStampReq = idxDb.transaction(['timeStamp'],'readwrite').objectStore('timeStamp').put({value: process.env.timeStampHash}, 1)
                timeStampReq.onsuccess = function () {
                    console.log(`yaoganDB：更新${timeStampReadReq.result.value}(${new Date(timeStampReadReq.result.value)}) to ${process.env.timeStampHash}(${new Date(process.env.timeStampHash)})`);
                    // 更新数据
                };
            }
        } else {
            // 首次增加数据
            var timeStampReq = idxDb.transaction(['timeStamp'],'readwrite').objectStore('timeStamp').add({value: process.env.timeStampHash});
            timeStampReq.onsuccess = function (e) {
                console.log(`yaoganDB：数据库初始化:${process.env.timeStampHash}(${new Date(process.env.timeStampHash)})`)
                // 更新数据
            }
            timeStampReq.onerror = function (e) {
                console.log('yaoganDB：数据库初始化失败')
            }
            getData(false , updateDataBaseData);
        }
    }
}

/* 
    数据更新
 */
function updateDataBaseData () {
    let dataNameList = ['regionData','resourceData','pollutionData','regions','convexHull'];
    let allDataStore = idxDb.transaction(['allData'],'readwrite').objectStore('allData');
    let storeModel = {};
    dataNameList.forEach(item => {
        storeModel[item+'Req'] = allDataStore.index('name').getKey(item);
        storeModel[item+'Req'].onsuccess = function (event) {
            if (event.target.result) {
                let putTrans = allDataStore.put({value:dataModel[item], name:item}, event.target.result);
                putTrans.onsuccess = function (event) {
                    console.log(`更新${item}成功`);
                }
                putTrans.onerror = function (event) {
                    console.log(`更新${item}失败`)
                }
            } else {
                let addTrans = allDataStore.add({value:dataModel[item], name:item});
                addTrans.onsuccess = function (event) {
                    console.log(`增加${item}成功`);
                }
            }
        }
    });
    //idxDb.close();
}

// 模拟使用数据
let resourceData,pollutionData,regionData,complaintsData = [], dataModel = {},regions=[],convexHull={};
// let monitoringPointData = [
//         {label:'成华区',value:9},
//         {label:'金牛区',value:10},
//         {label:'崇州市',value:5},
//         {label:'大邑县',value:5},
//         {label:'都江堰市',value:8},
//         {label:'高新区',value:9},
//         {label:'简阳市',value:3},
//         {label:'金堂县',value:5},
//         {label:'锦江区',value:10},
//         {label:'龙泉驿区',value:7},
//         {label:'彭州市',value:5},
//         {label:'郫都区',value:5},
//         {label:'蒲江县',value:4},
//         {label:'青白江区',value:7},
//         {label:'青羊区',value:10},
//         {label:'邛崃市',value:5},
//         {label:'双流区',value:10},
//         {label:'天新区',value:9},
//         {label:'温江区',value:5},
//         {label:'武侯区',value:12},
//         {label:'新都区',value:5},
//         {label:'新津县',value:5}
// ];

let regionAreaData = {"all":14400597321.78711,"成华区":109020487.94335938,"金牛区":107859363.52929688,"崇州市":1091635970.1230469,"大邑县":1287141674.5253906,"都江堰市":1212556342.1386719,"高新区":82011140.01367188,"简阳市":2240291221.7773438,"金堂县":1159488166.6445312,"锦江区":60926241.59375,"龙泉驿区":557268820.84375,"彭州市":1425592072.0253906,"郫都区":438236857.4042969,"蒲江县":582034699.46875,"青白江区":379850332.2246094,"青羊区":66508220.1015625,"邛崃市":1381518788.8378906,"双流区":472090219.5488281,"天府新区":563952465.3320312,"温江区":277693927.59765625,"武侯区":75993511.81835938,"新都区":498851600.50390625,"新津县":330075197.7910156};
/* 
    获取元数据并处理，indexedDB有则直接读取
    param fromDB{Boolean} 是否从数据库获取数据
    param callBackFn{Function} 回调函数（从文件读取数据后更新数据库数据）
 */
async function getData (fromDB, callBackFn) {
    // if (dataGetting) {
    //     return;
    // }
    // dataGetting = true;
    if (fromDB && idxDb) {
        let dataNameList = ['regionData','resourceData','pollutionData','regions','convexHull'];

        // let regionDataReq = idxDb.transaction(['allData']).objectStore('allData').index(name).get('regionData'),
        // resourceDataReq = idxDb.transaction(['allData']).objectStore('allData').index(name).get('resourceData'),
        // pollutionDataReq = idxDb.transaction(['allData']).objectStore('allData').index(name).get('pollutionData'),
        // complaintsDataReq = idxDb.transaction(['allData']).objectStore('allData').index(name).get('complaintsData');

        // regionDataReq.onsuccess = function () {

        // }
        let reqModel = {},
            reqPromiseArr = [];
        dataNameList.forEach(item => {
            reqModel[item+'Req'] = idxDb.transaction(['allData']).objectStore('allData').index('name').get(item);

            reqPromiseArr.push(new Promise((resolve, reject)=>{
                reqModel[item+'Req'].onsuccess = function (event) {
                    dataModel[item] = event.target.result ? event.target.result.value : [];
                    if (item == 'regions') {
                        regionModule.setRegions(dataModel.regions);
                    }
                    if (item == 'convexHull') {
                        regionModule.setConvexHull(dataModel.convexHull);
                    }
                    resolve();
                }
            }));
        });
        await Promise.all(reqPromiseArr).then(()=>{
            dataGetting = false;
            if (waitingQueue.length != 0) {
                waitingQueue.forEach(function(item){
                    item();
                });
                waitingQueue = [];
            }
            // if (!callBackFn) {
            //     idxDb.close();
            // } else {
            //     callBackFn();
            // }
            // resolve();
        });
    } else {

        // 从文件读取元数据
        // complaintsDataO = await require.ensure([],function(require){return require('@/data/complaints.json')});
        // regionDataO =  await require.ensure([],function(require){return require('@/data/mmmm_manager_resource.json')});
        // resourceDataO =  await require.ensure([],function(require){return require('@/data/mmmm_resource.json')});
        // pollutionDataO =  await require.ensure([],function(require){return require('@/data/mmmm_water_pollution.json')});
        // regionsO = await require.ensure([],function(require){return require('@/data/region.json')});
        // convexHullO = await require.ensure([],function(require){return require('@/data/convex_hull.json')});
        if (indexedDBused) {
            await Promise.all([
                // import('@/data/complaints.json').then(function(result){
                //     complaintsDataO = result;
                // }),
                import('@/data/mmmm_manager_resource.json').then(function(result){
                    regionDataO = result;
                }),
                import('@/data/mmmm_resource.json').then(function(result){
                    resourceDataO = result;
                }),
                import('@/data/mmmm_water_pollution.json').then(function(result){
                    pollutionDataO = result;
                }),
                import('@/data/region.json').then(function(result){
                    regionsO = result;
                }),
                import('@/data/convex_hull.json').then(function(result){
                    convexHullO = result;
                })
            ])
            // complaintsDataO = await import('@/data/complaints.json');
            // regionDataO =  await import('@/data/mmmm_manager_resource.json');
            // resourceDataO =  await import('@/data/mmmm_resource.json');
            // pollutionDataO =  await import('@/data/mmmm_water_pollution.json');
            // regionsO = await import('@/data/region.json');
            // convexHullO = await import('@/data/convex_hull.json');
        } else {
            // complaintsDataO = require('@/data/complaints.json');
            // regionDataO =  require('@/data/mmmm_manager_resource.json');
            // resourceDataO =  require('@/data/mmmm_resource.json');
            // pollutionDataO =  require('@/data/mmmm_water_pollution.json');
            // regionsO = require('@/data/region.json');
            // convexHullO = require('@/data/convex_hull.json');
        }

        dataModel.regions = regionsO;
        dataModel.convexHull = convexHullO;
        regionModule.setRegions(dataModel.regions);
        regionModule.setConvexHull(dataModel.convexHull);

        regionData = _.cloneDeep(_.map(regionDataO.result, (item, key) =>{
            item.name = key;
            return item
        }));
        dataModel.regionData = regionData;

        resourceData = resourceDataO.result.map((item,index) => {
            if (!item.name || item.name == 'null') {
                item.name = item.type == 'T' ? `riv${index}` : `lak${index}`;
            }
            return item;
        }).sort((a, b )=> b.area - a.area);
        dataModel.resourceData = resourceData;

        pollutionData = pollutionDataO.result.map((item,index) => {
            if (typeof item.name == 'string') {
                item.name = item.name.trim();
            } else {
                item.name == '';
            }

            if (!item.name || item.name == 'null') {
                item.name = resourceData.find(i => i.id == item.id).name;
            }
            for (var i in item) {
                if (i.includes('_norm')) {
                    item[i.split('_norm')[0]] = item[i];
                }
            }
            item.waterId = item.id;
            item.id = index;
            item.pollution_typeO = item.pollution_type;
            item.pollution_type = [item.pollution_type];
            item.yoy = ['+','-'][Math.random()>=0.5 ? 1 : 0] + (Math.random() * 5).toFixed(2) + '%';
            item.qoq = ['+','-'][Math.random()>=0.5 ? 1 : 0] + (Math.random() * 5).toFixed(2) + '%';
            return item;
        }).sort((a, b )=> b.polution_score - a.polution_score);
        dataModel.pollutionData = pollutionData;
        // complaintsData = complaintsDataO;
        // dataModel.complaintsData = complaintsData;
        
        if (callBackFn && typeof callBackFn == 'function') {
            callBackFn();
        }
        dataGetting = false;
        if (waitingQueue.length != 0) {
            waitingQueue.forEach(function(item){
                item();
            });
            waitingQueue = [];
        }
    }
    
}


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

let mockModel = {};

mockModel.getWaterResourceData = function (params) {
    return getWaterResourceCommon(params);
}

// Mock.mock(/.{0}\/getWaterResourceData.{0}/,'get', mockModel.getWaterResourceData);

function getWaterResourceCommon (params) {
    var filterObj = extractParams(params.url);

    var filteredData,pagedData;
    if (filterObj.id) {
        filteredData = [_.find(dataModel.resourceData ,(item)=>{return item.id == filterObj.id})]
    } else {
        filteredData = _.filter(dataModel.resourceData, function (item, index) {
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
}
mockModel.getPollutionData = function (params) {
    return getPollutionCommomn(params);
    
}
// Mock.mock(/.{0}\/getPollutionData.{0}/,'get',mockModel.getPollutionData);
// 查询污染统计
mockModel.pollutionStatistics = function (params) {
    let tempData, filterData;

    filterData = getPollutionCommomn(params).data;
    let lzData = filterData.filter(item => item.pollution_type[0] == 'lvzao'),
        hcData = filterData.filter(item => item.pollution_type[0] == 'heichou'),
        nsData = filterData.filter(item => item.pollution_type[0] == 'nisha');
    tempData = {
        lvzao: {
            count : lzData.length,
            area : _.sumBy(lzData,item => item.area),
            data: lzData
        },
        heichou:{
            count : hcData.length,
            area : _.sumBy(hcData,item => item.area),
            data: hcData
        },
        nisha:{
            count : nsData.length,
            area : _.sumBy(nsData,item => item.area),
            data: nsData
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
    }

}
// Mock.mock(/.{0}\/pollutionStatistics.{0}/,'get',mockModel.pollutionStatistics);

function getPollutionCommomn(params){
    var filterObj = extractParams(params.url);

    var filteredData,pagedData;
    if (filterObj.waterId) {
        filteredData = _.filter(dataModel.pollutionData,(item)=>{return item.waterId == filterObj.waterId})
    } else {
        filteredData = _.filter(dataModel.pollutionData, function (item, index) {
            if (filterObj.region && filterObj.region != 'all') {
                item.area = item.area_list[filterObj.region] || 0;
            } else {
                item.area = item.ares;
            }
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
}
mockModel.regions = function (params) {

    return {
        code:0,
        data:dataModel.regions,
        totalCount:dataModel.regions.length
    }

}
// Mock.mock(/.{0}\/regions$/,'get',mockModel.regions);

mockModel.introData = function (params) {
    let tempData={};
    let filter = extractParams(params.url);
    let gisDataNum = 205;
    if (filter && dataModel.regionData.filter(item => item.name == filter.county).length != 0) {
        tempData = _.cloneDeep(dataModel.regionData.filter(item => item.name == filter.county)[0]);
        // tempData.monitoringPoint_num = monitoringPointData.find(item=>item.label == filter.county).value;
        // tempData.complaints_num = dataModel.complaintsData.filter(item => item['来电区域'] == filter.county).length;
        tempData.gisdata_num = `${Math.round(gisDataNum * regionAreaData[filter.county] / regionAreaData.all)}G`;
        tempData.areaSortList = {
            '湖泊': getWaterResourceCommon({url:`?region=${filter.county}&rType=lake`}).data.sort((a, b) => b.area - a.area).slice(0,3),
            '江河': getWaterResourceCommon({url:`?region=${filter.county}&rType=river`}).data.sort((a, b) => b.area - a.area).slice(0,3)
        };
    } else {
        tempData = {
            name : '成都',
            water_quality:_.meanBy(dataModel.regionData,'water_quality'),
            water_index:_.meanBy(dataModel.regionData,'water_index'),
            rivers_num:_.sumBy(dataModel.regionData,'rivers_num'),
            rivers_area:_.sumBy(dataModel.regionData,'rivers_area'),
            // others_num: _.sumBy(dataModel.regionData,'others_num'),
            // others_area: _.sumBy(dataModel.regionData,'others_area'),
            lakes_num:_.sumBy(dataModel.regionData,'lakes_num'),
            lakes_area:_.sumBy(dataModel.regionData,'lakes_area'),
            pollution_area: _.sumBy(dataModel.regionData, 'pollution_area'),
            pollution_num: _.sumBy(dataModel.regionData, 'pollution_num'),
            // monitoringPoint_num : _.sumBy(monitoringPointData, item => item.value),
            // complaints_num : dataModel.complaintsData.length,
            gisdata_num : `${gisDataNum}G`,
            areaSortList: {
                '湖泊' : dataModel.regionData.sort((a, b) => (b.lakes_area) - (a.lakes_area)).slice(0,3).map(item => ({name: item.name, area : item.lakes_area})),
                '江河' : dataModel.regionData.sort((a, b) => (b.rivers_area) - (a.rivers_area)).slice(0,3).map(item => ({name: item.name, area : item.rivers_area}))
            }
        }
    }
    // tempData.cd_area = regionAreaData.all;
    // tempData.rivers_num += tempData.others_num;
    // tempData.rivers_area += tempData.others_area;
    tempData.total_num = tempData.rivers_num + tempData.lakes_num;
    tempData.total_area = tempData.rivers_area + tempData.lakes_area;
    return {
        code:0,
        data:tempData,
        // totalCount:globalData.length
    }

}
// Mock.mock(/.{0}\/introData.{0}/,'get',mockModel.introData);

mockModel.regionsData = function (params) {
    var data = dataModel.regionData;
    return {
        code:0,
        data,
        totalCount: data.length
    }
}
// Mock.mock(/.{0}\/regionsData.{0}/,'get',mockModel.regionsData);

// mockModel.monitoringData = function (params) {
//     let filter = extractParams(params.url);
//     let data = [];
//     let counties = filter.county.split(',');
//     for (let county of counties) {
//         for (let i =0; i< monitoringPointData.find(item => item.label == county).value; i++) {
//             data.push({
//                 name : county + '模拟水体监测站点' + (i+1),
//                 date : `2018年10月${Math.floor(1 + Math.random() * 31)}日`,
//                 indexs :[
//                     {label:'溶解氧',value: Math.floor(2 + Math.random() * 5),unit:'mg/L', colorRGB: '82,13,240'},
//                     {label:'高锰酸盐指数',value: Math.floor(6 + Math.random() * 10), colorRGB: '234,85,4'},
//                     {label:'化学需氧量(COD)',value: Math.floor(15 + Math.random() * 26), colorRGB: '13,182,240'},
//                     {label:'氨氮(NH3-N)',value: Math.floor(15 + Math.random() * 1986) / 1000, colorRGB: '138,101,74'},
//                     {label:'总磷',value: Math.floor(1 + Math.random() * 20) / 10, colorRGB: '131,195,44'}
//                 ]
//             });
//         }
//     }

//     data.sort((a,b) => b.date.split('月')[1].split('日')[0] * 1 - a.date.split('月')[1].split('日')[0] * 1)

//     return {
//         code:0,
//         data,
//         totalCount: data.length
//     }
// }
// Mock.mock(/.{0}\/monitoringData.{0}/,'get',mockModel.monitoringData);

// mockModel.complaints = function (params) {
//     let filter = extractParams(params.url);
//     let data = [];
//     let counties = filter.county.split(',');
    
//     data = dataModel.complaintsData.filter(item => {
//         return counties.includes(item['来电区域'])
//     });
//     data.sort((a,b) => new Date(b['来电时间'].split(' ')[0]) - new Date(a['来电时间'].split(' ')[0]))

//     return {
//         code:0,
//         data,
//         totalCount: data.length
//     }
// }
// Mock.mock(/.{0}\/complaints.{0}/,'get',mockModel.complaints);

function httpMock(type, url, params, content){
    function resolveFn(resolve, idx, u) {
        setTimeout(function(){
            if (dataGetting) {
                waitingQueue.push(function(){
                    resolve(mockModel[idx]({url:u}));
                });
            } else {
                resolve(mockModel[idx]({url:u}));
            }
        }, 0);
    }
    return new Promise(function(resolve, reject){
        if (url.includes('?')) {
            for (let i in mockModel) {
                if (url.split('?')[0].includes(i) && url.split('?')[0].split(i)[1].length == 0) {
                    resolveFn(resolve, i, url);
                }
            }
        } else {
            for (let i in mockModel) {
                if (url.includes(i) && url.split(i)[1].length == 0) {
                    resolveFn(resolve, i, url);
                }
            }
        }
        // resolve({code: 0,data:[]});
        
    });
    // if (url.includes('?')) {
    //     for (var i in mockModel) {
    //         if (url.split('?')[0].includes(i) && url.split('?')[0].split(i)[1].length == 0) {
    //             // resolve(mockModel[i]({url}));
    //             return mockModel[i]({url});
    //         }
    //     }
    // } else {
    //     for (var i in mockModel) {
    //         if (url.includes(i) && url.split(i)[1].length == 0) {
    //             // resolve(mockModel[i]({url}));
    //             return mockModel[i]({url});
    //         }
    //     }
    // }
}

// Mock.setup({
//     timeout: "100-200"
// })

export default httpMock