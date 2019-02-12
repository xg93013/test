<template>
    <div id="mapContainer_tendency">
        <div class="mapItem">
            <el-date-picker v-model="leftData" type="month" placeholder="选择日期" class="datePick" size="small" @change="leftDateChange" 
                :default-value="defaultDate" :value-format="valueFormat" :clearable="false" v-show="dateShow"></el-date-picker>
            <div id="leftMap">
            </div>
        </div>
        <div class="mapItem">
            <el-date-picker v-model="rightData" type="month" placeholder="选择日期" class="datePick" size="small" @change="rightDateChange" 
                :default-value="defaultDate" :value-format="valueFormat" :clearable="false" v-show="dateShow"></el-date-picker>
            <div id="rightMap">
        </div>
        </div>
    </div>
</template>

<script>
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
// import VectorSource from 'ol/source/Vector';
import soruceOSM from 'ol/source/OSM';
import {OSM, Vector as VectorSource,Raster as RasterSource,TileArcGISRest,ImageArcGISRest} from 'ol/source.js';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import {Style,Fill,Stroke} from 'ol/style';
import {Select,Draw} from 'ol/interaction';
import Overlay from 'ol/Overlay.js';

import gisMapApi from '@/util/gisMapApi.js'

// 绘制工具
var webGis = {},
    originZoom = 8,
    mapCenter = [119.296494, 26.074507],
    vm;
export default {
    data () {
        return {
            dateShow:false,
            selectedRiver:{},
            leftData:new Date(),
            rightData:new Date(),
            valueFormat:"yyyy-MM",
            defaultDate:new Date()
        }
    },
    props:["config"],
    components : {

    },
    methods:{
        manualSelect(param){
            selectFeature(webGis.rivers.left[param.id], webGis.rivers.left[param.id].getProperties().data.coo[0][0]);
        },
        leftDateChange(value){
            // console.log(value)
            refreshLeftMap();
        },
        rightDateChange(value){
            refreshRightMap();
        }
    },
    created(){
        vm=this;
    },
    mounted () {
        initOL(this);
    }

}
// 江河Feature渲染函数
function featureStyled(feature){
    var level = feature.getProperties().data.level;
    var tempStyle = new Style({
        fill : new Fill({
            color:vm.config.colors[level],
        }),
        stroke : new Stroke({
            color:[255, 0, 0, 1]
        })
    })
    return tempStyle
}

function initOL (vm) {

    // 已抽检图层
    webGis.riverLayer = {
            left : new VectorLayer({
                source: new VectorSource(),
                style : featureStyled,
                zIndex:2
            }),
            right:new VectorLayer({
                source: new VectorSource(),
                style : featureStyled,
                zIndex:2
            })
    }

    webGis.drawVector = new VectorSource({wrapX: false});

    // 江河feature图层
    webGis.rivers = {
        left : {},
        right: {}
    }
    // 点击江河详情弹窗
    webGis.detailOverlay = new Overlay({
        // position: mapCenter,
        positioning: 'center-center',
        element: document.getElementById('detailBox'),
        stopEvent: true,
        autoPan:true,
        offset:[0,-25],
        autoPanAnimation: {
            duration: 2500,
            // easing : ol.easing.inAndOut
        },
    });

    // 基础地图
    webGis.leftMap = new Map({
        target: 'leftMap',
        layers: [
            // 背景地图图层
            // new TileLayer({source: new soruceOSM()}),
            // webGis.chengduSensingLayer,
            webGis.riverLayer.left,
        ],
        overlays: [webGis.detailOverlay],
        view: gisMapApi.commonView()
    });
    webGis.rightMap = new Map({
        target: 'rightMap',
        layers: [
            // 背景地图图层
            // new TileLayer({source: new soruceOSM()}),
            // webGis.chengduSensingLayer,
            webGis.riverLayer.right,
        ],
        overlays: [webGis.detailOverlay],
        view: webGis.leftMap.getView()
    });

    bindWebgisEvents();
    refreshFeature();
    gisMapApi.addGisLayer(webGis.leftMap);
    gisMapApi.addGisLayer(webGis.rightMap);
}

function changePolygonStatus (feature) {
    // 先把所有江河取消高亮
    _.each(webGis.rivers.left, function(item){
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
    webGis.leftMap.on("pointermove", function (evt) {
        webGis.leftMap.getTargetElement().style.cursor = webGis.leftMap.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
        // 存在江河即高亮

        if (webGis.leftMap.hasFeatureAtPixel(evt.pixel)) {
            // businessRiskVM.$refs.toolTip.innerHTML = webGis.leftMap.getFeaturesAtPixel(evt.pixel)[0].getProperties().name;
            // businessRiskVM.$refs.toolTip.style.opacity = 1;
            // webGis.toolTip.setPosition(coordinate);
            changePolygonStatus(webGis.leftMap.getFeaturesAtPixel(evt.pixel)[0]);
        } else {
            changePolygonStatus();
        }
    });

    // 监听点击地图事件
    webGis.leftMap.on("click", function (e) {
        if (webGis.leftMap.hasFeatureAtPixel(e.pixel)) {
            // businessRiskVM.$refs.toolTip.innerHTML = webGis.leftMap.getFeaturesAtPixel(evt.pixel)[0].getProperties().name;
            // businessRiskVM.$refs.toolTip.style.opacity = 1;
            // webGis.toolTip.setPosition(coordinate);
            var tempFeature = webGis.leftMap.getFeaturesAtPixel(e.pixel)[0];
            // tempFeature.set("selected",true);
            // changePolygonStatus(tempFeature);
            // webGis.vm.selectedRiver = tempFeature.getProperties().data;
            // webGis.detailOverlay.setPosition(e.coordinate);
            selectFeature(tempFeature, e.coordinate);
        } else {
            // _.each(webGis.rivers.left, function(item){
            //     item.set("selected",false);
            // });
            selectFeature();
            changePolygonStatus();
            webGis.detailOverlay.setPosition(undefined);
        }
    })
}

function selectFeature(feature,coo) {
    _.each(webGis.rivers.left, function(item){
        item.set("selected",false);
    });
    if (feature) {
        feature.set("selected",true);
        changePolygonStatus(feature);
        webGis.vm.selectedRiver = feature.getProperties().data;
        webGis.detailOverlay.setPosition(coo);
    }
}

function refreshFeature () {
    // refreshSideMap("left");
    // refreshSideMap("right");
    // // refreshRightMap();
    

    // webGis.rivers.right = {};
    // webGis.riverLayer.right.getSource().clear();
    // _.each(vm.config.data, function(item){
    //     var polygonFeature = new Feature(
    //         {
    //             geometry:new Polygon(item.coo),
    //             // style : tempStyle
    //             data : item,
    //             // labelPoint : 
    //         }
    //     )
    //     webGis.rivers.right[item.id] = polygonFeature;
    //     // polygonFeature.setStyle(tempStyle);
    //     webGis.riverLayer.right.getSource().addFeature(polygonFeature);
    // });
}

function refreshSideMap(side){
    webGis.rivers[side] = {};
    webGis.riverLayer[side].getSource().clear();
    _.each(vm.config.data, function(item){
        var polygonFeature = new Feature(
            {
                geometry:new Polygon(item.coo),
                // style : tempStyle
                data : item,
                // labelPoint : 
            }
        )
        webGis.rivers[side][item.id] = polygonFeature;
        // polygonFeature.setStyle(tempStyle);
        webGis.riverLayer[side].getSource().addFeature(polygonFeature);
    });
}

function refreshRightMap(){

}
</script>
<style scoped lang="stylus">
    @import "../../common/common.styl";
    #mapContainer_tendency {
        base(100%,100%);
        clf()
        .mapItem {
            float left
            base(50%,100%);
            // height 100%
            calcM(width, 50%,5px);
            &:first-child{
                padding-right 10px
                box-sizing content-box
            }
            background #31317a
            position relative
            .datePick{
                left 20px
                top 20px
                position absolute
                z-index 1
            }
            #leftMap,#rightMap {
                base(100%,100%);
            }
        }

    }
</style>
