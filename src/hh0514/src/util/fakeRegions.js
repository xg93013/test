// import {regionModule.setRegions,regionModule.setConvexHull} from '@/data/region.js';
import regionModule from '@/data/region.js';

let regionsO, convexHullO
let dataModel = {}

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

function createStores() {
    var timestampStore, allDataStore;
    if (!idxDb.objectStoreNames.contains('timeStamp')) {
        timestampStore = idxDb.createObjectStore('timeStamp', { autoIncrement: true });
    }
    if (!idxDb.objectStoreNames.contains('allData')) {
        allDataStore = idxDb.createObjectStore('allData', { autoIncrement: true });
        allDataStore.createIndex('name', 'name', { unique: true });
    }
}
/* 
    成功打开遥感数据库（通过数据库表中时间戳与打包时间戳对比，不一致则刷新）
 */
function yaoganDBSuccess() {
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
                var timeStampReq = idxDb.transaction(['timeStamp'], 'readwrite').objectStore('timeStamp').put({ value: process.env.timeStampHash }, 1)
                timeStampReq.onsuccess = function () {
                    console.log(`yaoganDB：更新${timeStampReadReq.result.value}(${new Date(timeStampReadReq.result.value)}) to ${process.env.timeStampHash}(${new Date(process.env.timeStampHash)})`);
                    // 更新数据
                };
            }
        } else {
            // 首次增加数据
            var timeStampReq = idxDb.transaction(['timeStamp'], 'readwrite').objectStore('timeStamp').add({ value: process.env.timeStampHash });
            timeStampReq.onsuccess = function (e) {
                console.log(`yaoganDB：数据库初始化:${process.env.timeStampHash}(${new Date(process.env.timeStampHash)})`)
                // 更新数据
            }
            timeStampReq.onerror = function (e) {
                console.log('yaoganDB：数据库初始化失败')
            }
            getData(false, updateDataBaseData);
        }
    }
}

/* 
    数据更新
 */
function updateDataBaseData() {
    let dataNameList = ['regions', 'convexHull'];
    // let item = 'regions'
    let allDataStore = idxDb.transaction(['allData'], 'readwrite').objectStore('allData');
    let storeModel = {};
    dataNameList.forEach(item => {
        storeModel[item + 'Req'] = allDataStore.index('name').getKey(item);
        storeModel[item + 'Req'].onsuccess = function (event) {
            if (event.target.result) {
                let putTrans = allDataStore.put({ value: dataModel[item], name: item }, event.target.result);
                putTrans.onsuccess = function (event) {
                    console.log(`更新${item}成功`);
                }
                putTrans.onerror = function (event) {
                    console.log(`更新${item}失败`)
                }
            } else {
                let addTrans = allDataStore.add({ value: dataModel[item], name: item });
                addTrans.onsuccess = function (event) {
                    console.log(`增加${item}成功`);
                }
            }
        }
    });
    //idxDb.close();
}

// 模拟使用数据

let regionAreaData = { "all": 14400597321.78711, "成华区": 109020487.94335938, "金牛区": 107859363.52929688, "崇州市": 1091635970.1230469, "大邑县": 1287141674.5253906, "都江堰市": 1212556342.1386719, "高新区": 82011140.01367188, "简阳市": 2240291221.7773438, "金堂县": 1159488166.6445312, "锦江区": 60926241.59375, "龙泉驿区": 557268820.84375, "彭州市": 1425592072.0253906, "郫都区": 438236857.4042969, "蒲江县": 582034699.46875, "青白江区": 379850332.2246094, "青羊区": 66508220.1015625, "邛崃市": 1381518788.8378906, "双流区": 472090219.5488281, "天府新区": 563952465.3320312, "温江区": 277693927.59765625, "武侯区": 75993511.81835938, "新都区": 498851600.50390625, "新津县": 330075197.7910156 };
/* 
    获取元数据并处理，indexedDB有则直接读取
    param fromDB{Boolean} 是否从数据库获取数据
    param callBackFn{Function} 回调函数（从文件读取数据后更新数据库数据）
 */
async function getData(fromDB, callBackFn) {
    // if (dataGetting) {
    //     return;
    // }
    // dataGetting = true;
    if (fromDB && idxDb) {
        // let item = 'regions';
        let dataNameList = ['regions', 'convexHull'];
        let reqModel = {},
            reqPromiseArr = [];
        dataNameList.forEach(item => {
            reqModel[item + 'Req'] = idxDb.transaction(['allData']).objectStore('allData').index('name').get(item);

            reqPromiseArr.push(new Promise((resolve, reject) => {
                reqModel[item + 'Req'].onsuccess = function (event) {
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
        await Promise.all(reqPromiseArr).then(() => {
            dataGetting = false;
            if (waitingQueue.length != 0) {
                waitingQueue.forEach(function (item) {
                    item();
                });
                waitingQueue = [];
            }
        });
    } else {

        // 从文件读取元数据
        if (indexedDBused) {
            await Promise.all([
                import('@/data/region.json').then(function (result) {
                    
                    regionsO = result;
                }),
                import('@/data/convex_hull.json').then(function (result) {
                    convexHullO = result;
                })
            ])
        }

        dataModel.regions = regionsO;
        dataModel.convexHull = convexHullO;
        regionModule.setRegions(dataModel.regions);
        regionModule.setConvexHull(dataModel.convexHull);

        if (callBackFn && typeof callBackFn == 'function') {
            callBackFn();
        }
        dataGetting = false;
        if (waitingQueue.length != 0) {
            waitingQueue.forEach(function (item) {
                item();
            });
            waitingQueue = [];
        }
    }

}

let mockModel = {};

mockModel.regions = function (params) {

    return {
        code: 0,
        data: dataModel.regions,
        totalCount: dataModel.regions.length
    }

}

// mockModel.regionsData = function (params) {
//     var data = dataModel.regionData;
//     return {
//         code: 0,
//         data,
//         totalCount: data.length
//     }
// }

function httpMock(type, url, params, content) {
    function resolveFn(resolve, idx, u) {
        setTimeout(function () {
            if (dataGetting) {
                waitingQueue.push(function () {
                    resolve(mockModel[idx]({ url: u }));
                });
            } else {
                resolve(mockModel[idx]({ url: u }));
            }
        }, 0);
    }
    return new Promise(function (resolve, reject) {
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
}

export default httpMock