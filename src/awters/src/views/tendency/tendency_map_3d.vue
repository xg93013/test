<template>
    <div id="mapContainer_sensory">
        <div id="mapTalks_sensory">

        </div>
        <div id="detailBox_sensory" class="detailbox_common" ref="detailBox">
            <div class="title" v-text="currentRiverData.name"></div>
            <p><span>水质感官指数：</span><span v-text="currentRiverData.exponent"></span></p>
            <p><span>污染类型：</span><span v-text="renderPtype(currentRiverData.pType)"></span></p>
            <p><span>负责河长：</span><span v-text="currentRiverData.owner"></span></p>
            <div class="thumbImg" ref='thumbImg'>

            </div>
            <i class="arrow"></i>
        </div>
        <div class="timeline" ref="timeline">
            <div class="slider_wrap">
                <el-slider v-model="current" :step="1" :show-stops="true" :min="1" :max="6" label="ddd" :format-tooltip="timeLineFormat" @change="currentClick"></el-slider>
            </div>
            <div class="label_area">
                <span v-for="(item,key) in 6" v-text="'2018年'+item+'月'" :key="item" :class="{selected:item==current}" @click="currentClick(item)"></span>
            </div>
        </div>
    </div>
</template>

<script>
import gisMapApi from '@/util/gisMapApi.js';

import hcIco from '@/image/hc_ico.png'
import nsIco from '@/image/ns_ico.png'
import zlIco from '@/image/zl_ico.png'

import * as maptalks from 'maptalks/dist/maptalks';
import * as maptalksE3 from 'maptalks.e3/dist/maptalks.e3';


import lak_215 from '@/image/lak_215.jpg';
import lak_960 from '@/image/lak_960.jpg';
import lak_363 from '@/image/lak_363.jpg';
import lak_792 from '@/image/lak_792.jpg';
import lak_201 from '@/image/lak_201.jpg';
import lak_605 from '@/image/lak_605.jpg';
import riv_361 from '@/image/riv_361.jpg';



// 绘制工具
var webGis = {},
    originZoom = 8,
    mapCenter = [104.06868, 30.56122],
    vm,
    icons = {
        hc:hcIco,
        ns:nsIco,
        zl:zlIco
    },
    pollutionImgs={
        lak_215,
        lak_960,
        lak_363,
        lak_792,
        lak_201,
        lak_605,
        riv_361,
    },
    timer = 0;
export default {
    data () {
        return {
            currentRiverData:{},
            lastHoveredFeature:"",
            reserveOverlay:false,
            current:1,
            timelineArr:[{
                label:"2018年"
            }],
        }
    },
    props:["config"],
    components : {

    },
    methods:{
        manualSelect(param){
            this.reserveOverlay = true;
            vm.currentRiverData = webGis.rivers[param.id].getProperties().data;
            setTimeout(() => {
                // webGis.detailOverlay.setContent('<div id="detailBoxIn3d" class="detailbox_common">'+vm.$refs.detailBox.innerHTML+'</div>');
                // webGis.detailOverlay.show(webGis.rivers[param.id].getCenter());
            });
            vm.$refs.thumbImg.style.backgroundImage = 'url('+pollutionImgs[param.id]+')';
            selectFeature(webGis.rivers[param.id], webGis.rivers[param.id].getProperties().data.coo[0][0]);
        },
        renderPtype(value){
            if (value) {
                return _.find(this.$store.state.sensoryLegend, function(item,key){
                    return value[0] == key;
                }).label;
            }
        },
        timeLineFormat(value){
            return value+"月";
        },
        currentClick(value){
                this.current = value;
        }
    },
    computed:{
        
    },
    created(){
        vm=this;
        vm.$root.$on("sensoryResultPanelListClick", function(param, fromResultPanel){
            vm.manualSelect(param);
        })
    },
    
    mounted () {
        initMT(this);

        timer = setInterval(()=>{
            if(this.current<6){
                this.current++
            }else{
                this.current=1
            }
        },3000);

        this.$refs.timeline.onmouseenter=()=>{
            clearInterval(timer);
            timer = 0;
        };
        this.$refs.timeline.onmouseleave=()=>{
            clearInterval(timer);
            timer = setInterval(()=>{
                if(this.current<6){
                    this.current++
                }else{
                    this.current=1
                }
            },3000);
        };
    },
    watch:{
        "config.data":{
            handler(n,o){
                refreshFeature(n);
            },
            deep:true
        },
        "current":(nValue,oValue)=>{
            if (nValue != oValue) {
                refreshFeature(vm.config.data, true);
            }
        }
    },
    beforeDestroy(){
        clearInterval(timer)
    }

}


async function initMT (vm) {
    // 河流图层
    webGis.riverLayer = new maptalks.VectorLayer('vector',[],{
        zIndex:3,
        enableAltitude : true,        // enable altitude
        altitudeProperty : 'altitude',
        drawAltitude : {
            polygonFill : function(){
            },
            polygonOpacity : 0.3,
            lineWidth : 0
        }
    });

    // 动态图层
    var ecOption = {
        'series': [{
            'type': 'lines',
            'polyline': true,
            'data': [],
            'lineStyle': {
                'normal': {
                    'width': 0
                }
            },
            'effect': {
                'constantSpeed': 20,
                'show': true,
                'trailLength': 0.5,
                'symbolSize': 5,
                symbol:'arrow'
            },
            'zlevel': 1
        },{
            'type': 'lines',
            'polyline': true,
            'data': [],
            'lineStyle': {
                'normal': {
                    'width': 0
                }
            },
            'effect': {
                delay:1000,
                'constantSpeed': 20,
                'show': true,
                'trailLength': 0.5,
                'symbolSize': 5,
                symbol:'arrow'
            },
            'zlevel': 1
        },{
            'type': 'lines',
            'polyline': true,
            'data': [],
            'lineStyle': {
                'normal': {
                    'width': 0
                }
            },
            'effect': {
                delay:2000,
                'constantSpeed': 20,
                'show': true,
                'trailLength': 0.5,
                'symbolSize': 5,
                symbol:'arrow'
            },
            'zlevel': 1
        }]
    };
    // webGis.e3Layer = new maptalksE3.E3Layer('e3',ecOption,{ hideOnZooming : true, hideOnRotating : true, hideOnMoving : true ,zIndex:2});

    // 江河feature图层
    webGis.rivers = {};
    // 点击江河详情弹窗
    var infoWindowOptions = {
        autoOpenOn :false,
        properties:{
            altitude : 150
        },
        dy:-10,
        dx:5
    }
    // webGis.detailOverlay = new maptalks.ui.InfoWindow(infoWindowOptions);
    webGis.baseLayer = new maptalks.TileLayer('gis', {
        zIndex:1,
        minZoom:5,
        minZoom:0,
        maxAvailableZoom :5,
        urlTemplate:gisMapApi.mapstalkOption.config.url,
        tileSystem:gisMapApi.mapstalkOption.config.tileSystem,
        tileSize:[256,256],
        crossOrigin:true,
        spatialReference:{
            projection : 'EPSG:4326',
            resolutions:gisMapApi.mapstalkOption.config.resolutions,
            fullExtent:gisMapApi.mapstalkOption.config.fullExtent,
        },
        repeatWorld:false
    });
    // 基础地图
    webGis.webMap = new maptalks.Map("mapTalks_sensory",{
        attribution: false,
        hitDetect :false,
        center: [104.06868, 30.56122],
        zoom:  14,
        // crossOrigin:true,
        spatialReference:{
            projection : 'EPSG:4326',
            resolutions:gisMapApi.mapstalkOption.config.resolutions,
            fullExtent:gisMapApi.mapstalkOption.config.fullExtent,
            minZoom:0,
            maxZoom:4
        },
        baseLayer : new maptalks.GroupTileLayer('base',[
            // new maptalks.TileLayer("osm",{
            //     spatialReference:{
            //         projection:'EPSG:4326'
            //         // other properties necessary for spatial reference
            //     },
            //     urlTemplate:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            //     subdomains:['a','b','c']
            // }),
            webGis.baseLayer
        ]),
        layers : [
            // webGis.e3Layer,
            webGis.riverLayer
        ]
    });

    // webGis.detailOverlay.addTo(webGis.webMap);
    
    // bindWebgisEvents();
    
    webGis.webMap.setCenterAndZoom([104.1538415,30.578686], 15);
    // webGis.webMap.on("mousemove", ()=>{
    //     // console.log(event)
    // });
}

function changePolygonStatus (feature, style) {
    // 先把所有江河取消高亮
    _.each(webGis.rivers, function(item){
        if(item.getProperties().selected){
            return;
        }
        if (item.getProperties().hovered) {
            item.updateSymbol({
                'polygonFill': vm.config.colors[item.getProperties().data.pType[0]],
                lineColor:vm.config.colors[pType],
                lineOpacity:0
            });
        }
    });

    var pType = feature.getProperties().data.pType[0];
    if(style){
        // feature.setStyle(new Style({
        //     fill : new Fill({
        //         color:vm.config.colors[pType+"_s"]
        //     }),
        //     stroke : new Stroke({
        //         color:vm.config.colors[pType],
        //         width:2
        //     })
        // }));
        feature.updateSymbol({
            'polygonFill': vm.config.colors[pType+"_s"],
            lineColor:vm.config.colors[pType],
            lineOpacity:1
        });
    } else {
        feature.updateSymbol({
            'polygonFill': vm.config.colors[pType],
            lineColor:vm.config.colors[pType],
            lineOpacity:0
        });
    }
}


// 绑定webgis地图事件
function bindWebgisEvents () {
    // 监听点击地图事件
    webGis.webMap.on("click", function (e) {
        // if(webGis.detailOverlay.isVisible()){
            // webGis.detailOverlay.hide();
        // }
    })
}

function selectFeature(feature,coo) {
    if (feature) {
        _.each(webGis.rivers, function(item){
            item.getProperties().selected=false;
        });
        feature.getProperties().selected=true;
        changePolygonStatus(feature,"selected");
        
    }
}

function refreshFeature (data, needAni) {
    if(needAni){
        var layerOpacity = webGis.riverLayer.getOpacity(),
            aniTime = 1,
            step = 1/60/aniTime,
            direction = "none";
        var layerAniO = {
            none : layerAni.bind(this,"none"),
            show:layerAni.bind(this,"show"),
        }
        function layerAni(dir){
            layerOpacity = (dir=="none"?layerOpacity-step:layerOpacity+step).toFixed(2)*1;
            // console.log(layerOpacity)
            if(layerOpacity>0&&layerOpacity<1){
                webGis.riverLayer.setOpacity(layerOpacity);
                // requestAnimFrame(layerAniO[direction]);
            } else if(layerOpacity<=0) {
                webGis.riverLayer.setOpacity(0);
                direction = "show";
                updateFeature();
                // requestAnimFrame(layerAniO[direction]);
            } else if (layerOpacity>=1) {
                webGis.riverLayer.setOpacity(1);
            }
        }
        layerAni(direction)
    } else {
        updateFeature();
    }

    function updateFeature () {
        webGis.rivers = {};
        webGis.riverIcons = {};
        webGis.players = {};
        webGis.riverLayer.clear();
        // webGis.riverIconsLayer.clear();
        // webGis.detailOverlay.hide();
        var convertRiverData = data;
        if (convertRiverData.length == 0) {
            // var tempEchartsOption = _.cloneDeep(webGis.e3Layer.getEChartsOption());
            // tempEchartsOption.series[0].data = [];
            // webGis.e3Layer.setEChartsOption(tempEchartsOption);
        } else {
            _.each(convertRiverData, function(item){
                var polygonFeature = new maptalks.Polygon(item.coo,{
                    'symbol': {
                        'lineColor': 'white',
                        'lineWidth': 2,
                        'lineOpacity': 0,
                        'polygonFill': vm.config.colors[item.pType[0]], //default color in cartoCSS
                        'polygonOpacity': 1,
                        'opacity': 1
                    },
                    properties : {
                        // altitude : 150,
                        data:item
                    },
                });
                // 多边形绑定事件
                polygonFeature.on("click", function(evt){
                    selectFeature(evt.target,evt.coordinate);
                }).on("mousemove", function(evt){
                    // debugger;
                    
                    featureMousemove(evt);
                }).on("mouseenter",(evt)=>{
                    featureMouseenter(evt.target,evt.domEvent,evt.target);
                }).on("mouseout", function(evt){
                    featureMouseout(evt.target,evt.domEvent,evt.target);
                    
                }).setId(item.id);

                // 调用openlayers方法获取多边形内部的中心点（非线性）
                var iconFeature = new maptalks.Marker(gisMapApi.getFlatInteriorPoint(item.coo),{
                    symbol:{
                        markerFile:icons[item.pType[0]],
                        markerDy:0
                    },
                    properties:{
                        altitude : 50
                    },
                }).on("mousemove", function(evt){
                    // debugger;
                    featureMousemove(evt);
                }).on("mouseenter",(evt)=>{
                    featureMouseenter(webGis.rivers[evt.target.getId().split("_icon")[0]],evt.domEvent,evt.target);
                }).on("mouseout",(evt)=>{
                    featureMouseout(webGis.rivers[evt.target.getId().split("_icon")[0]],evt.domEvent,evt.target);
                }).setId(item.id + "_icon");

                webGis.rivers[item.id] = polygonFeature;
                webGis.riverIcons[item.id] = iconFeature;

                // webGis.players[item.id + "_icon"] = iconFeature.animate(
                //     {
                //         'symbol': {
                //             markerDy:10
                //         },
                //     },{
                //         duration:2000,
                //         repeat:true,
                //         easing:"upAndDown",
                //         // startTime:index*3
                //     },function(frame){

                //     }
                // );

                // if(item.type == "湖泊"){
                //     webGis.players[item.id] = polygonFeature.animate(
                //         {
                //             'symbol': {
                //                 'polygonOpacity': .5,
                //                 'lineOpacity':1
                //             }
                //         },{
                //             duration:4000,
                //             repeat:true,
                //             easing:"upAndDown",
                //             // startTime:index*3
                //         },function(frame){

                //         }
                //     );
                // }
            });

            // var tempEchartsOption = _.cloneDeep(webGis.e3Layer.getEChartsOption());

            var riveData = _.filter(convertRiverData,{type:"江河"});

            var effectData = _.map(riveData, function(item,idx){
                var hStep = 300 / (riveData.length - 1);
                return {
                    'coords': item.coo[0],
                    'lineStyle': {
                        'normal': {
                            'color': "green",
                            // 'color': "red",
                            // width:5
                        }
                    }
                }
            });
            // tempEchartsOption.series[0].data = _.cloneDeep(effectData);
            // tempEchartsOption.series[1].data = _.cloneDeep(effectData);
            // tempEchartsOption.series[2].data = _.cloneDeep(effectData);
            // webGis.e3Layer.setEChartsOption(tempEchartsOption);

            webGis.riverLayer.addGeometry(_.map(webGis.rivers),function(item){
                return item;
            });
            // webGis.riverLayer.addGeometry(_.map(webGis.riverIcons),function(item){
            //     return item;
            // });
    }
    }

    function animationControl(){

    }

    function featureMouseenter (feature,domEvent,originFeature) {
        // if (domEvent.target.style.cursor != "pointer") {
        //     domEvent.target.style.cursor = "pointer";
        // }
        _.each(vm.rivers, function(item){
            item.getProperties().hovered = false;
        });
        var eventFeature = feature;
        eventFeature.getProperties().hovered = true;
        
        vm.lastHoveredFeature = originFeature.getId();
        
        if(vm.currentRiverData.id != eventFeature.getId()){
            vm.$refs.thumbImg.style.backgroundImage = 'url('+pollutionImgs[eventFeature.getProperties().data.id]+')';
            vm.currentRiverData = eventFeature.getProperties().data;
            setTimeout(() => {
                // webGis.detailOverlay.setContent('<div id="detailBoxIn3d" class="detailbox_common">'+vm.$refs.detailBox.innerHTML+'</div>');
            });
            // 将湖泊的动画暂时停止
            if(eventFeature.getProperties().data.type == "湖泊"){
                // webGis.players[eventFeature.getProperties().data.id].pause();
            }
            // ICON动画暂停
            // webGis.players[eventFeature.getId()+"_icon"].pause();

            vm.reserveOverlay = false;
            changePolygonStatus(eventFeature,"hover");
        }
    }

    function featureMouseout(feature,domEvent,originFeature){
        if(vm.lastHoveredFeature != originFeature.getId() && (originFeature.getId().indexOf(vm.lastHoveredFeature) != -1 || vm.lastHoveredFeature.indexOf(originFeature.getId()) != -1)){
            return;
        }
        // if(domEvent.target.style.cursor == "pointer"){
        //     domEvent.target.style.cursor = "default";
        // }
        if(feature.getProperties().data.type == "湖泊"){
            // webGis.players[feature.getProperties().data.id].play();
        }

        // ICON动画继续播放
        // webGis.players[feature.getId()+"_icon"].play();

        feature.getProperties().hovered = false;

        // webGis.detailOverlay.hide();

        vm.currentRiverData = {};
        vm.lastHoveredFeature = "";

        changePolygonStatus(feature);
    }

    function featureMousemove(evt){
        // webGis.detailOverlay.show(evt.coordinate);
    }
}
</script>
<style scoped lang="stylus">
    @import "../../common/common.styl";
    #mapContainer_sensory {
        base(100%,100%);
        position relative
        .mask{
            base(100%,100%);
            position absolute
            left 0
            top 0
            z-index 1
        }
        #mapTalks_sensory {
            base(100%,100%);
            }
            .thumbImg{
                base(100%, 170px);
                background-repeat round
                // background-size cover
            }
        #detailBox_sensory{
            // @extend .detailbox_common
            display none
        }
        .timeline{
            background rgba(0,0,0,.8)
            border-radius 50px

            base(1000px)
            position absolute
            left 50%
            transform translate(-50%)
            bottom 20px
            padding 15px 0
            // box-shadow 0px 0px 40px 10px rgba(0,0,0,1)
            .slider_wrap>>>{
                padding 0px 78px
                // position absolute
                // transform translate(0,-50%)
                // top 50%
                width 100%
                .el-slider__stop{
                    background rgba(65,158,255,1)
                }
            }
            .label_area{
                >span{
                    width (100%/6)
                    display inline-block
                    text-align center
                    trans()
                    &:hover,&.selected{
                        cursor pointer
                        color rgba(65,158,255,1)
                        transform scale(1.5)
                    }
                }
            }
        }
    }
</style>
