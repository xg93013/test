
var regions = [],
countyQueueQuest,
jianyangQueueQuest,
convexHull = {},
convexHullQueueQuest;
function setRegions (target) {
    regions = [...target];
    if (countyQueueQuest && typeof countyQueueQuest == 'function') {
        countyQueueQuest([...target]);
    }
    if (jianyangQueueQuest && typeof jianyangQueueQuest == 'function') {
        jianyangQueueQuest([...target]);
    }
};
function setConvexHull (target) {
    convexHull = target;
    if (convexHullQueueQuest && typeof convexHullQueueQuest == 'function') {
        convexHullQueueQuest(target);
    }
};
function getConvexHull (){
    // let getCon = function() {
        if (Object.keys(convexHull).length != 0) {
            // return new Promise(function(resolve, reject){
            //     setTimeout(function(){
            //         resolve(convexHull);
            //     },10);
            // })
            return convexHull;
        } else {
            return new Promise(function(resolve, reject){
                convexHullQueueQuest = (data)=> {
                    resolve(data);
                    convexHullQueueQuest = void 0;
                }
            });
            return temp;
        }
    // }
    // return getCon();
};
function getCounty (county) {
    if (regions) {
        return (!county || county =='all') ? regions : regions.find(item => item.name == county);
    } else {
        return  new Promise((resolve, reject)=>{
            // window.addEventListener('dataLoaded', ()=>{
            //     resolve(convexHull);
            // });
            countyQueueQuest = (data)=> {
                resolve((!county || county =='all') ? data : data.find(item => item.name == county));
                countyQueueQuest = void 0;
            }
        })
    }
};
function getJianyang () {
    if (regions) {
        return regions.find(item => item.name =='简阳市');
    } else {
        return  new Promise((resolve, reject)=>{
            jianyangQueueQuest = (data)=> {
                resolve(data.find(item => item.name =='简阳市'));
                jianyangQueueQuest = void 0;
            }
        })
    }
};
let regionsModel = {
    regions,getJianyang,getCounty,setRegions,getConvexHull,setConvexHull
}
export default regionsModel