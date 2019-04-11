<template>
    <div style="width:100%;height:100%;">
        <div id="mapContainer_tendency">
            <div id="mapTalks_tendency">

            </div>
            <div id="detailBox_tendency" class="detailbox_common" ref="detailBox">
                <div class="title" v-text="currentRiverData.name"></div>
                <p><span>水质感官指数：</span><span v-text="currentRiverData.exponent"></span></p>
                <p><span>污染类型：</span><span v-text="renderPtype(currentRiverData.pType)"></span></p>
                <!-- <p><span>负责河长：</span><span v-text="currentRiverData.owner"></span></p> -->
                <i class="arrow"></i>
            </div>
            <autoSlider :labelList="sliderDateArr" @valueChanged="refreshFeature" class="auto_slider" :display="autoSliderShow">

            </autoSlider>
        </div>
    </div>
</template>

<script>
import gisMapApi from '@/util/gisMapApi.js';

import hcIco from '@/image/hc_ico.png'
import nsIco from '@/image/ns_ico.png'
import zlIco from '@/image/zl_ico.png'

import {GeometryCollection, VectorLayer, Polygon, Map} from 'maptalks';
// import * as maptalksE3 from 'e3/dist/e3';

import autoSlider from '@/components/autoSlider.vue';

// 绘制工具
var webGis = {},
    originZoom = 8,
    mapCenter = [104.06868, 30.56122],
    _this,
    icons = {
        hc:hcIco,
        ns:nsIco,
        zl:zlIco
    },
    timer = 0;
export default {
    data () {
        return {
            currentRiverData:{},
            lastHoveredFeature:"",
            reserveOverlay:false,
            sliderDateArr:[],
            autoSliderShow: true
        }
    },
    props:["config","mapShow"],
    components : {
        autoSlider
    },
    methods:{
        manualSelect(param){
            this.reserveOverlay = true;
            _this.currentRiverData = webGis.rivers[param.id].getProperties().data;
            // setTimeout(() => {
            //     // webGis.detailOverlay.setContent('<div id="detailBoxIn3d" class="detailbox_common">'+_this.$refs.detailBox.innerHTML+'</div>');
            //     // webGis.detailOverlay.show(webGis.rivers[param.id].getCenter());
            // });
            selectFeature(webGis.rivers[param.id], webGis.rivers[param.id].getProperties().data.coo[0][0]);
        },
        renderPtype(value){
            if (value) {
                return _.find(this.$store.state.sensoryLegend, function(item,key){
                    return value == key;
                }).label;
            }
        },
        refreshFeature (a, init) {
            refreshFeature(_this.config.data, !init);
        }
    },
    computed:{
        
    },
    created(){
        _this=this;
        this.sliderDateArr = this.$tools.getDateRange(6, this.renderPtype(this.config.data[0].pollution_type[0]));
        // _this.$root.$on("sensoryResultPanelListClick", function(param, fromResultPanel){
        //     _this.manualSelect(param);
        // })
    },
    mounted () {
        initMT(_this);
        if (_this.config.data) {
            refreshFeature(_this.config.data, false);
        }
    },
    watch:{
        // "config.data":{
        //     handler(n,o){
        //         refreshFeature(n);
        //     },
        //     deep:true
        // },
        mapShow(nValue,oValue){
            if (nValue) {
                if (webGis.webMap.getSize().height == 0 || webGis.webMap.getSize().width == 0) {
                    webGis.webMap.once("resize", ()=>{
                        var collection = new GeometryCollection(webGis.riverLayer.getGeometries());
                        webGis.webMap.fitExtent(collection.getExtent());
                        _this.autoSliderShow = true;
                    });
                } else {
                    var collection = new GeometryCollection(webGis.riverLayer.getGeometries());
                    webGis.webMap.fitExtent(collection.getExtent());
                    _this.autoSliderShow = true;
                }
                // webGis.webMap.setZoom(16);
            } else {
                _this.autoSliderShow = false;
            }
        }
    },

}

async function initMT (_this) {
    // 河流图层
    webGis.riverLayer = new VectorLayer('vector',[],{
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
    // webGis.detailOverlay = new ui.InfoWindow(infoWindowOptions);
    // 基础地图
    webGis.webMap = new Map("mapTalks_tendency",{
        attribution: false,
        hitDetect :false,
        center: [104.06868, 30.56122],
        zoom:  14,
        maxZoom : 17,
        minZoom : 9,
        // 最大倾斜角度，默认为80，会导致地图远景虚化，但是河流即动效不虚化，可能产生歧义，调整最大倾斜角
        maxPitch:65, 
        layers : [],
        fogColor:[0,127,255]
    });
    let gisLayer = await gisMapApi.getGisLayer();
    let gisLayerJY = await gisMapApi.getGisLayerJY();
    webGis.webMap.addLayer([
        gisLayer,
        gisLayerJY,
        webGis.riverLayer
        ]
    );
    // webGis.detailOverlay.addTo(webGis.webMap);
    
    // bindWebgisEvents();
    
    // webGis.webMap.setCenterAndZoom([104.1538415,30.578686], 15);
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
                // `rgba(${_this.$store.state.pollutionLegendOptions.find(option => option.value == item.pType[0]).colorRGB},1)`
                // 'polygonFill': `rgba(${_this.$store.state.pollutionLegendOptions.find(option => option.value ==item.getProperties().data.pType[0]).colorRGB},1)`,
                // lineColor:`rgba(${_this.$store.state.pollutionLegendOptions.find(option => option.value ==item.getProperties().data.pType[0]).colorRGB},1)`,
                polygonOpacity: 0,
                lineOpacity:0
            });
        }
    });

    // var pType = feature.getProperties().data.pType[0];
    if(style){
        // feature.setStyle(new Style({
        //     fill : new Fill({
        //         color:_this.config.colors[pType+"_s"]
        //     }),
        //     stroke : new Stroke({
        //         color:_this.config.colors[pType],
        //         width:2
        //     })
        // }));
        feature.updateSymbol({
            // 'polygonFill': _this.config.colors[pType+"_s"],
            polygonOpacity: 1,
            // lineColor:_this.config.colors[pType],
            lineOpacity:1
        });
    } else {
        feature.updateSymbol({
            // 'polygonFill': _this.config.colors[pType],
            polygonOpacity: .5,
            // lineColor:_this.config.colors[pType],
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
    if (!webGis.riverLayer) {
        return;
    }
    _this.sliderDateArr = _this.$tools.getDateRange(6, _this.renderPtype(_this.config.data[0].pollution_type[0]));
    if(needAni){
        var layerOpacity = webGis.riverLayer.getOpacity(),
            aniTime = .7,
            step = 1/60/aniTime * 2;

        // function layerAniDisappear() {
        //     layerOpacity -= step;
        //     if(layerOpacity<=0) {
        //         webGis.riverLayer.setOpacity(0);
        //         // 隐藏动画完成后刷新河流数据
        //         updateFeature();
        //         layerAniDisplay();
        //     } else {
        //         requestAnimFrame(layerAniDisappear);
        //         webGis.riverLayer.setOpacity(layerOpacity);
        //     }
        // }
        // function layerAniDisplay() {
        //     layerOpacity += step;
        //     if(layerOpacity < 1){
        //         webGis.riverLayer.setOpacity(layerOpacity);
        //         requestAnimFrame(layerAniDisplay);
        //     } else {
        //         webGis.riverLayer.setOpacity(1);
        //     }
        // }

        // layerAniDisappear()
        Object.values(webGis.rivers).forEach((item, index, arr)=>{
            item.animate({
                'symbol': {
                    'opacity': 0
                }
            }, {
                'duration': 1000
            }, function (frame) {
                if (frame.state.playState === 'finished') {
                    // console.log('animation finished');
                    if (index == arr.length - 1) {
                        // updateView(data, type);
                        updateFeature();
                        Object.values(webGis.rivers).forEach((item, index, arr)=>{
                            item.updateSymbol({
                                'opacity': 0
                            });
                            item.animate({
                                'symbol': {
                                    'opacity': 1
                                }
                            }, {
                                'duration': 1000
                            })
                        })
                    }
                }
            });
        });
    } else {
        updateFeature();
    }

    function updateFeature () {
        webGis.rivers = {};
        // webGis.riverIcons = {};
        // webGis.players = {};
        if (webGis.riverLayer) {
            webGis.riverLayer.clear();
        }
        // webGis.riverIconsLayer.clear();
        // webGis.detailOverlay.hide();
        var convertRiverData = data;
        if (convertRiverData.length == 0) {
            // var tempEchartsOption = _.cloneDeep(webGis.e3Layer.getEChartsOption());
            // tempEchartsOption.series[0].data = [];
            // webGis.e3Layer.setEChartsOption(tempEchartsOption);
        } else {
            _.each(convertRiverData, function(item){
                var polygonFeature = new Polygon(item.coordinate,{
                    'symbol': {
                        'lineColor': 'white',
                        'lineWidth': 2,
                        // 'lineOpacity': 0,
                        'polygonFill': `rgba(${_this.$store.state.pollutionLegendOptions.find(option => option.value == item.pollution_type[0]).colorRGB},1)`, //default color in cartoCSS
                        'polygonOpacity': 1,
                        'opacity': 1
                    },
                    properties : {
                        // altitude : 150,
                        data:item
                    },
                });

                webGis.rivers[item.id] = polygonFeature;
            });
            // var riveData = _.filter(convertRiverData,{type:"江河"});

            // var effectData = _.map(riveData, function(item,idx){
            //     var hStep = 300 / (riveData.length - 1);
            //     return {
            //         'coords': item.coo[0],
            //         'lineStyle': {
            //             'normal': {
            //                 'color': "green",
            //                 // 'color': "red",
            //                 // width:5
            //             }
            //         }
            //     }
            // });

            webGis.riverLayer.addGeometry(_.map(webGis.rivers,function(item){
                return item;
            }), true);
            // var collection = new GeometryCollection(webGis.riverLayer.getGeometries());
            // webGis.webMap.fitExtent(collection.getExtent());
        }
    }

    function animationControl(){

    }

}
</script>
<style scoped lang="stylus">
    @import "~@/common/common.styl";
    #mapContainer_tendency {
        base(100%,100%);
        position relative
        .mask{
            base(100%,100%);
            position absolute
            left 0
            top 0
            z-index 1
        }
        #mapTalks_tendency {
            base(100%,100%);
            }
        #detailBox_tendency{
            // @extend .detailbox_common
            display none
        }
        .auto_slider {
            position absolute
            left 50%
            transform translate(-50%)
        }
        // .timeline{
        //     background rgba(0,0,0,.8)
        //     border-radius 50px

        //     base(1000px)
        //     position absolute
        //     left 50%
        //     transform translate(-50%)
        //     bottom 20px
        //     padding 15px 0
        //     // box-shadow 0px 0px 40px 10px rgba(0,0,0,1)
        //     .slider_wrap>>>{
        //         padding 0px 78px
        //         // position absolute
        //         // transform translate(0,-50%)
        //         // top 50%
        //         width 100%
        //         .el-slider__stop{
        //             background rgba(65,158,255,1)
        //         }
        //     }
        //     .label_area{
        //         >span{
        //             width (100%/6)
        //             display inline-block
        //             text-align center
        //             trans()
        //             &:hover,&.selected{
        //                 cursor pointer
        //                 color rgba(65,158,255,1)
        //                 transform scale(1.5)
        //             }
        //         }
        //     }
        // }
    }
</style>
