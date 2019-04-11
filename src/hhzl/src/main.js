// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import 'lodash'
import vuex from 'vuex'
import http from './util/http.js'
import tools from './util/tools.js'
import App from './App'
/* 提前import，使模块打包进vendor，减小0.js体积 */
// import echarts from 'echarts';
// import {Polygon,Map,LineString,Coordinate,VectorLayer,ui,MultiPolygon,GeometryCollection} from 'maptalks';
// import {transform} from 'ol/proj.js';
// import {Polygon as olPolygon} from 'ol/geom';
// import { STATUS_CODES } from 'http';

// if (process.env.NODE_ENV=='development') {
//     require('./util/fakeDatabase.js') 
// }
Vue.config.productionTip = false

Vue.use(vuex);

const store = new vuex.Store({
    state: {
        dynamicArgs: {
            // videoSrc: 'http://172.24.59.39:8081/river_video.mp4',
            videoSrc: process.integration ? `${process.dataHost}/river_video.mp4` : 'http://172.27.2.107/river_video.mp4',
        },
        view : {
            bigScreen : true,
            multiple : 4
        },
        situation : {
            
        },
        // 污染类型
        sensoryLegend : {
            heichou : {
                label : "黑臭水体"
            },
            nisha : {
                label : "泥沙污染"
            },
            lvzao : {
                label : "水体富营养"
            },
        },
        pTypeRender(typeStr){
            var tempTypeStr = "无";
            if (typeStr && typeStr.length > 0) {
                // tempTypeStr = typeStr.map(item => _this.$store.state.sensoryLegend[item].label).toString();
                tempTypeStr = this.sensoryLegend[typeStr].label;
            }
            return tempTypeStr;
        },
        pollutionLegendOptions: [
            {
                label:'黑臭水体',
                value: 'heichou',
                colorRGB:'0, 0, 0'
            },
            {
                label:'泥沙污染',
                value: 'nisha',
                colorRGB:'229, 212, 126'
            },
            {
                label:'水体富营养',
                value: 'lvzao',
                colorRGB:'67, 226, 100'
            }
        ],
        qualitiesLegendOptions: [
            {
                label:'Ⅰ类',
                value: '1',
                colorRGB:'124, 240, 103'
            },
            {
                label:'Ⅱ类',
                value: '2',
                colorRGB:'1, 102, 255'
            },
            {
                label:'Ⅲ类',
                value: '3',
                colorRGB:'245, 203, 37'
            },
            {
                label:'Ⅳ类',
                value: '4',
                colorRGB:'251, 136, 89'
            },
            {
                label:'Ⅴ类',
                value: '5',
                colorRGB:'181, 0, 0'
            }
        ],
        sensoryMapFeatureSelected : "",
        sensoryFilter : {},
        // 水质感官分析
        sensoryFirstAnalyzed:true,
        sensoryFilterBus:{
            resourceType : ["江河","湖泊"],
            pollutionType:["hc","ns","zl"],
            district:{
                province:"",
                city:"",
                county:""
            }
        },
        stastistics:{
            detail : {
                data : {}
            }
        },
        tendencyData : {
            exponent : []
        }
    },
    mutations: {
        mapRiverSelect (state) {
            state.count++
        },
        refreshTendencyData (state, param) {
            state.tendencyData[param.type] = param.value;
        },
        statisticsRowClick(state){
            
        },
        refreshSensoryLegend(state, param){
            state.sensoryLegend = param;
        },
        refreshSensoryFilter(state, param){
            state.sensoryFilter = param;
        },
        refreshFirstAnalyzed(state, param){
            state.sensoryFirstAnalyzed = param;
        },
        updateSensoryFilterBus(state, param){
            if (param.resourceType) {
                state.sensoryFilterBus.resourceType = param.resourceType;
            }

            if (param.pollutionType) {
                state.sensoryFilterBus.pollutionType = param.pollutionType;
            }
        }
    }
})


/* eslint-disable no-new */
Vue.prototype.$http = http;
Vue.prototype.$tools = tools;
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store
})  


// window.requestAnimFrame = (function(){
//     return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
// })();