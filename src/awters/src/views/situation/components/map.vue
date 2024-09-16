<template>
    <div id="mapContainer">
        <div id="olMap">

        </div>
        <div id="detailBox" class="detailbox_common">
            <div class="title" v-text="selectedRiver.name"></div>
            <p><span>水系名称：</span><span v-text="selectedRiver.parentName || '--'"></span></p>
            <p><span>水资源类型：</span><span v-text="selectedRiver.type"></span></p>
            <p><span>水域面积：</span><span v-text="$tools.convertArea(selectedRiver.area)"></span><span> m</span><sup>2</sup></p>
            <p><span>负责河长：</span><span v-text="selectedRiver.owner"></span></p>
            <p><span>河长电话：</span><span v-text="selectedRiver.phone || '--'"></span></p>
            <i class="arrow"></i>
        </div>
    </div>
</template>

<script>
import Map from 'ol/Map';

import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

// import VectorSource from 'ol/source/Vector';
import soruceOSM from 'ol/source/OSM';
import TileWMSSource from "ol/source/TileWMS";
import {OSM, Vector as VectorSource,Raster as RasterSource,TileArcGISRest,ImageArcGISRest} from 'ol/source.js';

import WMTS from 'ol/source/WMTS.js';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import {Style,Fill,Stroke} from 'ol/style';
import {Select,Draw} from 'ol/interaction';
import Overlay from 'ol/Overlay.js';

import WMTSTileGrid from 'ol/tilegrid/WMTS.js';



// import riverData from '@/data/data.js';

import gisMapApi from '@/util/gisMapApi.js'

// var convertRiverData = riverData;

// 绘制工具
var webGis = {},
    originZoom = 8,
    mapCenter = [119.296494, 26.074507],
    vm;
export default {
    data () {
        return {
            selectedRiver:{}
        }
    },
    props:["config"],
    components : {

    },
    methods:{
        manualSelect(param){
            // webGis.interactionSelect.dispatchEvent({
            //     type:"select",
            //     target:this,
            //     selected:[],
            //     deselected: [],
            //     // mapBrowserEvent : webGis.selectMapEvent,
            //     manual : true
            // });
            // this.selectedRiver = webGis.rivers[param.id].getProperties().data;
            // webGis.detailOverlay.setPosition(webGis.rivers[param.id].getProperties().data.coo[0][0]);
            var extent = webGis.rivers[param.id].getGeometry().getExtent();
            webGis.webMap.getView().fit(extent,{
                easing:gisMapApi.easing.inAndOut,
                duration:1000,
                maxZoom:15,
                callback:function(){
                    // webGis.webMap.getView().setCenter([extent[0],extent[1]])
                    selectFeature(webGis.rivers[param.id], webGis.rivers[param.id].getGeometry().getFlatInteriorPoint());
                }
            });
            
            // selectFeature(webGis.rivers[param.id]);
        }
    },
    created(){
        vm=this;
    },
    mounted () {
        initOL(this);
    },
    watch:{
        "config.data":{
            handler(n,o){
                refreshFeature(n);
            },
            deep:true
        }
    }

}
// 江河Feature渲染函数
function featureStyled(feature){
    var level = feature.getProperties().data.level;
    // console.log(level)
    var tempStyle = new Style({
        fill : new Fill({
            color:vm.config.colors[level],
        }),
        // stroke : new Stroke({
        //     color:[255, 0, 0, 1]
        // })
    })
    return tempStyle
}

async function initOL (vm) {

    webGis.vm = vm;
    // 已抽检图层
    webGis.riverLayer = new VectorLayer({
        source: new VectorSource(),
        style : featureStyled,
        zIndex:2
    });

    webGis.drawVector = new VectorSource({wrapX: false});

    webGis.drawLayer = new VectorLayer({
        source: webGis.drawVector
    });
    // 江河feature图层
    webGis.rivers = {};
    // 点击江河详情弹窗
    webGis.detailOverlay = new Overlay({
        // position: mapCenter,
        positioning: 'bottom-center',
        element: document.getElementById('detailBox'),
        stopEvent: true,
        autoPan:true,
        offset:[0,-10],
        autoPanMargin:70,
        // autoPan:true,
        // autoPanAnimation: {
        //     // duration: 2500,
        //     easing : gisMapApi.easing.inAndOut
        // },
    });

    // 基础地图
    webGis.webMap = new Map({
        target: 'olMap',
        layers: [
            // 背景地图图层
            new TileLayer({source: new soruceOSM(),opacity:.2}),
            // webGis.chengduSensingLayer,
            webGis.riverLayer,
            webGis.drawLayer,
        ],
        overlays: [webGis.detailOverlay],
        view: gisMapApi.commonView()
    });

    bindWebgisEvents();
    // refreshFeature();
    gisMapApi.addGisLayer(webGis.webMap);

    
}

function changePolygonStatus (feature) {
    // 先把所有江河取消高亮
    _.each(webGis.rivers, function(item){
        // item.set("selected",false);
        if(item.getProperties().selected){
            return;
        }
        item.setStyle(null);
    });

    if (feature) {

        var coordinate = feature.getGeometry().getCoordinates();
        var level = feature.getProperties().data.level;
        feature.setStyle(new Style({
            fill : new Fill({
                color:vm.config.colors[level+"_s"]
                })
        }));
    }
}


// 绑定webgis地图事件
function bindWebgisEvents () {
     // 绑定在地图上鼠标移动事件
    webGis.webMap.on("pointermove", function (evt) {
        webGis.webMap.getTargetElement().style.cursor = webGis.webMap.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
        // 存在江河即高亮

        if (webGis.webMap.hasFeatureAtPixel(evt.pixel)) {
            // businessRiskVM.$refs.toolTip.innerHTML = webGis.webMap.getFeaturesAtPixel(evt.pixel)[0].getProperties().name;
            // businessRiskVM.$refs.toolTip.style.opacity = 1;
            // webGis.toolTip.setPosition(coordinate);
            changePolygonStatus(webGis.webMap.getFeaturesAtPixel(evt.pixel)[0]);
        } else {
            changePolygonStatus();
        }
    });

    // 监听点击地图事件
    webGis.webMap.on("click", function (e) {
        if (webGis.webMap.hasFeatureAtPixel(e.pixel)) {
            // businessRiskVM.$refs.toolTip.innerHTML = webGis.webMap.getFeaturesAtPixel(evt.pixel)[0].getProperties().name;
            // businessRiskVM.$refs.toolTip.style.opacity = 1;
            // webGis.toolTip.setPosition(coordinate);
            var tempFeature = webGis.webMap.getFeaturesAtPixel(e.pixel)[0];
            // tempFeature.set("selected",true);
            // changePolygonStatus(tempFeature);
            // webGis.vm.selectedRiver = tempFeature.getProperties().data;
            // webGis.detailOverlay.setPosition(e.coordinate);
            selectFeature(tempFeature, e.coordinate);
        } else {
            // _.each(webGis.rivers, function(item){
            //     item.set("selected",false);
            // });
            selectFeature();
            changePolygonStatus();
            webGis.detailOverlay.setPosition(undefined);
        }
    })
}

function selectFeature(feature,coo) {
    _.each(webGis.rivers, function(item){
        item.set("selected",false);
    });
    webGis.detailOverlay.setPosition(undefined);
    if (feature) {
        feature.set("selected",true);
        changePolygonStatus(feature);
        webGis.vm.selectedRiver = feature.getProperties().data;
        if (coo) {
            // setTimeout(function(){
                
                webGis.detailOverlay.setPosition(coo);
            // },2000);
        }
    }
}


function addInteraction() {
    webGis.interactionSelect = new Select();
    webGis.interactionSelect.on('select', selectFn);
    webGis.webMap.addInteraction(webGis.interactionSelect);

    function selectFn (e) {
        if (e.selected[0]) {
            e.selected[0].set("selected",true);
            webGis.vm.selectedRiver = e.selected[0].getProperties().data;
            webGis.detailOverlay.setPosition(e.mapBrowserEvent.coordinate);
        }else {
            webGis.detailOverlay.setPosition(undefined);
        }
        if (e.deselected[0]) {
            e.deselected[0].set("selected",false);
            // webGis.detailOverlay.setPosition(undefined);
        }
        // webGis.manualSelect = e.manual;
    }


    /* webGis.drawTool = new Draw({
        source: webGis.drawVector,
        type: "Polygon"
    });
    webGis.drawTool.on("drawend",function(event){
        console.log(event.feature.getGeometry().getCoordinates());
        var coo = event.feature.getGeometry().getCoordinates();
        // for(var i=0;i<100;i++){
        //     var temp = _.map(coo[0],function(arr){
        //         // console.log(coo);
        //         return [(arr[0]*10e10+i*10e15)/10e10,(arr[1]*10e10+i*10e8)/10e10]
        //     });
        //     var polygonFeature = new Feature(
        //         new Polygon([temp]));
        //     webGis.riverLayer.getSource().addFeature(polygonFeature);
        // }
        console.log(coo);
        var polygonFeature = new Feature(
                new Polygon(coo));
        webGis.riverLayer.getSource().addFeature(polygonFeature);
    }); */

}
var count = 0;
function refreshFeature (data) {
    // data.splice(1,10000000)
    webGis.rivers = {};
    webGis.riverLayer.getSource().clear();
    webGis.detailOverlay.setPosition(undefined);
    if (data.length == 0) {
        return;
    }
    _.each(data, function(item){
        // console.log(item.coo)
        var polygonFeature = new Feature(
            {
                geometry:new Polygon(item.coo),
                // style : tempStyle
                data : item,
                // labelPoint : 
            }
        )
        webGis.rivers[item.id] = polygonFeature;
        // polygonFeature.setStyle(tempStyle);
        // webGis.riverLayer.getSource().addFeature(polygonFeature);
    });

    webGis.riverLayer.getSource().addFeatures(_.map(webGis.rivers),function(item){
        return item;
    });

    // if (count>0) {
    //     // 调整到合适的视图
    //     webGis.webMap.getView().fit(webGis.riverLayer.getSource().getExtent(),{
    //         easing:gisMapApi.easing.inAndOut,
    //         duration:1000
    //     });
    // } else {
    //     count++;
    // }
}

</script>
<style scoped lang="stylus">
    @import "../../common/common.styl";
    #mapContainer {
        base(100%,100%);
        #olMap {
            base(100%,100%);
            }
        #detailBox{
            
        }
    }
</style>
