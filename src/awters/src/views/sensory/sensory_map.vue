<template>
    <div id="mapContainer_sensory">
        <!-- <div class="mask"></div> -->
        <div id="olMap_sensory">

        </div>
        <div id="detailBox_sensory" class="detailbox_common">
            <div class="title" v-text="selectedRiver.name"></div>
            <!-- <p><span>水资源名称：</span><span v-text="selectedRiver.name"></span></p> -->
            <p><span>水质感官指数：</span><span v-text="selectedRiver.exponent"></span></p>
            <p><span>污染类型：</span><span v-text="renderPtype(selectedRiver.pType)"></span></p>
            <p><span>负责河长：</span><span v-text="selectedRiver.owner"></span></p>
            <div class="thumbImg" ref='thumbImg'>

            </div>
            <i class="arrow"></i>
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
import {Polygon,Point} from 'ol/geom';
import {Style,Fill,Stroke,Icon} from 'ol/style';
import {Select,Draw} from 'ol/interaction';
import Overlay from 'ol/Overlay.js';
// import Draw from 'ol/interaction/Draw';
import {mouseOnly,noModifierKeys} from 'ol/events/condition';
import DragPan from "ol/interaction/DragPan";
import DragZoom from 'ol/interaction/DragZoom';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import PinchZoom from 'ol/interaction/PinchZoom';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';

import Zoom from 'ol/control/Zoom';
import gisMapApi from '@/util/gisMapApi.js';

import hcIco from '@/image/hc_ico.png'
import nsIco from '@/image/ns_ico.png'
import zlIco from '@/image/zl_ico.png'



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
    };
export default {
    data () {
        return {
            selectedRiver:{},
            reserveOverlay:false,
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

            this.reserveOverlay = true;
            vm.selectedRiver = webGis.rivers[param.id].getProperties().data;
            webGis.detailOverlay.setPosition(webGis.rivers[param.id].getGeometry().getFlatInteriorPoint());
            vm.$refs.thumbImg.style.backgroundImage = 'url('+pollutionImgs[param.id]+')';
            selectFeature(webGis.rivers[param.id], webGis.rivers[param.id].getProperties().data.coo[0][0]);
            var extent = webGis.rivers[param.id].getGeometry().getExtent();
            // webGis.webMap.getView().fit(extent,{
            //     easing:gisMapApi.easing.inAndOut,
            //     duration:1000,
            //     maxZoom:16,
            //     callback:function(){
            //         // webGis.webMap.getView().setCenter([extent[0],extent[1]])
            //     }
            // });
        },
        renderPtype(value){
            if (value) {
                return _.find(this.$store.state.sensoryLegend, function(item,key){
                    return value[0] == key;
                }).label;
            }
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


async function initOL (vm) {

    // 河流图层
    webGis.riverLayer = new VectorLayer({
        source: new VectorSource(),
        style : featureStyled,
        zIndex:2
    });

    // 标记图层
    webGis.riverIconsLayer = new VectorLayer({
        source: new VectorSource(),
        // style : featureStyled,
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
        element: document.getElementById('detailBox_sensory'),
        stopEvent: true,
        autoPan:true,
        offset:[0,-20],
        autoPanAnimation: {
            duration: 2500,
            // easing : ol.easing.inAndOut
        },
        autoPanMargin:70,
    });
    webGis.baseLayer = new TileLayer({source: new soruceOSM()})
    // 基础地图
    webGis.webMap = new Map({
        target: 'olMap_sensory',
        layers: [
            // 背景地图图层
            // webGis.baseLayer,
            webGis.riverLayer,
            webGis.riverIconsLayer,
            webGis.drawLayer,
        ],
        overlays: [webGis.detailOverlay],
        view:gisMapApi.commonView()
    });

    addInteraction();
    
    bindWebgisEvents();
    gisMapApi.addGisLayer(webGis.webMap);
    
    webGis.webMap.getView().setCenter([104.1538415,30.578686]);
    webGis.webMap.getView().setZoom(15);
    // 104.1542415,30.574686 15
    // webGis.webMap.getView().setZoom([104.103877,30.73688]);
    // Rotation animation takes the shortest arc, so animate in two parts
    setTimeout(function(){
        var view = webGis.webMap.getView();
        var center = view.getCenter();
        var rotation = view.getRotation();
        // view.animate({
        //     // duration:1000,
        //     rotation: rotation + Math.PI,
        //     anchor: view.getCenter(),
        //     easing: gisMapApi.easing.easeIn
        // }, {
        //     // duration:1000,
        //     rotation: rotation + 2 * Math.PI,
        //     anchor: view.getCenter(),
        //     easing: gisMapApi.easing.easeOut
        // });

        // view.animate({
        //     center: [104.06868, 30.56122],
        //     rotation: Math.PI,
        //     easing: gisMapApi.easing.easeIn
        // }, {
        //     center: center,
        //     rotation: 2 * Math.PI,
        //     easing: gisMapApi.easing.easeOut
        // });
    },0);

    // 江河Feature渲染函数
    function featureStyled(feature){
        if (feature.getProperties().data) {
            var pType = feature.getProperties().data.pType[0];
            var tempStyle = new Style({
                fill : new Fill({
                    color:vm.config.colors[pType],
                }),
                image : new Icon({
                    src:icons[pType],
                    // anchor: [0.5, 46],
                })
                // stroke : new Stroke({
                //     color:[255, 0, 0, 1]
                // })
            })
            return tempStyle
        }
    }
}
function addInteraction(){
    getPan();
    // pan.setActive(false);//false：当前地图不可拖动。true：可拖动

    function getPan() {
        let pan;
        let limtedList = [DragPan, DragZoom,MouseWheelZoom,DoubleClickZoom,PinchZoom,KeyboardZoom];
        webGis.webMap.getInteractions().forEach(function(element, index, array) {
            // if( element instanceof DragPan || element instanceof DragZoom || element instanceof MouseWheelZoom || element instanceof DoubleClickZoom ||
            //     element instanceof PinchZoom || element instanceof KeyboardZoom) {
            //     pan = element;
            //     pan.setActive(false);
            // }
            limtedList.forEach(function(iItem){
                if (element instanceof iItem) {
                    pan = element;
                    pan.setActive(false);
                }
            });
        })
    }
}

function changePolygonStatus (feature) {
    // 先把所有江河取消高亮
    _.each(webGis.rivers, function(item){
        if(item.getProperties().selected){
            return;
        }
        item.setStyle(null);
    });

    if (feature) {

        var coordinate = feature.getGeometry().getCoordinates();
        var pType = feature.getProperties().data.pType[0];
        feature.setStyle(new Style({
            fill : new Fill({
                color:vm.config.colors[pType+"_s"]
            }),
            stroke : new Stroke({
                color:vm.config.colors[pType],
                width:2
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
            var eventFeature = webGis.rivers[webGis.webMap.getFeaturesAtPixel(evt.pixel)[0].getProperties().id];
            vm.selectedRiver = eventFeature.getProperties().data;
            webGis.detailOverlay.setPosition(evt.coordinate);
            vm.reserveOverlay = false;
            vm.$refs.thumbImg.style.backgroundImage = 'url('+pollutionImgs[eventFeature.getProperties().id]+')';
            changePolygonStatus(eventFeature);
        } else {
            if (!vm.reserveOverlay) {
                webGis.detailOverlay.setPosition();
            }
            vm.selectedRiver = {};
            changePolygonStatus();
        }
    });

    // 监听点击地图事件
    webGis.webMap.on("click", function (e) {
        if (webGis.webMap.hasFeatureAtPixel(e.pixel)) {

            var tempFeature = webGis.rivers[webGis.webMap.getFeaturesAtPixel(e.pixel)[0].getProperties().id];
            // webGis.detailOverlay.setPosition(e.coordinate);
            selectFeature(tempFeature, e.coordinate);
            vm.$emit("featureClick", tempFeature.getProperties().data);
        } else {
            // webGis.detailOverlay.setPosition();
            selectFeature();
            // changePolygonStatus();
        }
    })
}

function selectFeature(feature,coo) {
    if (feature) {
        _.each(webGis.rivers, function(item){
            item.set("selected",false);
        });
        feature.set("selected",true);
        changePolygonStatus(feature);
        
    }
}

function refreshFeature (data) {
    webGis.rivers = {};
    webGis.riverIcons = {};
    webGis.riverLayer.getSource().clear();
    webGis.riverIconsLayer.getSource().clear();
    webGis.detailOverlay.setPosition();
    var convertRiverData = data;
    _.each(convertRiverData, function(item){
        var polygonFeature = new Feature(
            {
                geometry:new Polygon(item.coo),
                data : item,
                id:item.id
            }
        )
        var iconFeature = new Feature({
            geometry:new Point(polygonFeature.getGeometry().getFlatInteriorPoint()),
            id:item.id
        });

        iconFeature.setStyle(new Style({
            image : new Icon({
                src:icons[item.pType[0]],
                anchor: [0.5, 1],
            })
        }));
        iconFeature.setId(item.id);
        webGis.rivers[item.id] = polygonFeature;
        webGis.riverIcons[item.id] = iconFeature;
    });
    webGis.riverLayer.getSource().addFeatures(_.map(webGis.rivers,function(item){
        return item;
    }));
    webGis.riverIconsLayer.getSource().addFeatures(_.map(webGis.riverIcons, function(item){
        return item;
    }))

        
    var count = 0;
    // 动画一个周期
    var interval = 1.5,
        distence = 0.4,
        step = distence/interval/60,
        direction = "top",
        diffStartTime = [0,900,230,610,350,500,420];

    setTimeout(function(){
        (function iconShaking(){
            if (count<=60) {
                count++
            }else{
                count=0
            }

            _.each(_.map(webGis.riverIcons,ritem=>ritem), function(item, index){
                // setTimeout(()=>{
                    if (vm.selectedRiver.id == item.getId()) {
                        return;
                    }
                    item.setStyle(new Style({
                        image : new Icon({
                            src:icons[webGis.rivers[item.getId()].getProperties().data.pType[0]],
                            // anchor: [0.5, (10+Math.random().toFixed(1)*10)/10],
                            anchor: (function(){
                                var base = 0.9,
                                    tempY = item.getStyle().getImage().anchor_[1];

                                if(direction == "top" && item.getStyle().getImage().anchor_[1]>=(base+distence/4)){
                                    direction = "bot"
                                }
                                if(direction == "bot" && item.getStyle().getImage().anchor_[1]<=(base-distence/4)){
                                    direction = "top"
                                }

                                tempY+= direction=="top"?step:-step;

                                return [0.5,tempY]
                            })(),
                            // opacity:Math.random().toFixed(1)
                        })
                    }));
                // }, diffStartTime[index]);
            });
            // webGis.webMap.render();
            
            // requestAnimFrame(iconShaking);
        })();
    },0);

    
    // webGis.riverIconsLayer.on('postcompose', function(event){
    //     var vectorContext = event.vectorContext;
    //     var frameState = event.frameState;
    //     if (count<=60) {
    //         count++
    //     }else{count=0}

    //     _.each(webGis.riverIcons, function(item, key){
    //         if(count%60==0){
    //             item.getStyle().getImage().setAnchor([0.5,1+Math.random()]);

    //             // console.log(count)
    //             // item.getStyle().getImage().setOpacity(Math.random());
    //             vectorContext.drawFeature(item,item.getStyle());
    //         }
    //     });

    //     webGis.webMap.render();
    // });
    // webGis.webMap.render();

    // webGis.webMap.getView().fit(webGis.riverLayer.getSource().getExtent(),{
    //     easing:gisMapApi.easing.inAndOut,
    //     duration:1000,
    //     callback:function(){
    //         console.log(webGis.webMap.getView().getCenter()+" "+webGis.webMap.getView().getZoom())
    //     }
    // });
    
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
        #olMap_sensory {
            base(100%,100%);
            }
        #detailBox_sensory{
            // @extend .detailbox_common
            .thumbImg{
                base(100%, 170px);
                background-repeat round
                // background-size cover
            }
        }
    }
</style>
