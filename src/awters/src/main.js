// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import 'lodash'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vuex from 'vuex'
import http from './util/http.js'
import tools from './util/tools.js'
import App from './App'

// if (process.env.NODE_ENV=='development') {
require('./util/fakeDatabase.js') 
// }

Vue.config.productionTip = false

Vue.use(Element, { zIndex: 3000 });
Vue.use(vuex);

const store = new vuex.Store({
    state: {
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
        pollutionLegendOptions: [
            {
                label:'黑臭水体',
                value: 'heichou',
                colorRGB:'25, 23, 43'
            },
            {
                label:'泥沙污染',
                value: 'nisha',
                colorRGB:'154,97,74'
            },
            {
                label:'水体富营养',
                value: 'lvzao',
                colorRGB:'67,226,100'
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
        }
    },
    mutations: {
        mapRiverSelect (state) {
            state.count++
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


window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
})();