<template>
    <div id="mapContainer">
        <div id="mapTalks">
        </div>
        <div id="detailBoxTemplate" ref="detailBox" class="detail_box">
            <div class="leftTopCorner"></div>
            <div class="detailbox_common">
                <div v-show="!isPollution && !config.tendencyView">
                    <!-- 水资源详情 -->
                    <div class="title" v-text="selectedRiver.name"></div>
                    <p><span>水资源类型：</span><span v-text="$tools.renderCollection.waterType(selectedRiver.type)"></span></p>
                    <p><span>流经区域：</span><span v-text="selectedRiver.region && selectedRiver.region.toString()"></span></p>
                    <p><span>水域面积：</span><span v-text="$tools.convertArea(selectedRiver.area)"></span><span>&nbsp;km</span><sup>2</sup></p>
                </div>
                <div v-show="isPollution">
                    <!-- 水污染 -->
                    <div class="title" v-text="selectedRiver.name"></div>
                    <!-- <p><span>水资源名称：</span><span v-text="selectedRiver.name || '--'"></span></p> -->
                    <p><span>污染位置：</span><span v-text="selectedRiver.possition || '--'"></span></p>
                    <p><span>水资源类型：</span><span v-text="$tools.renderCollection.waterType(selectedRiver.river)"></span></p>
                    <p><span>污染指数：</span><span v-text="$tools.convertExponent(selectedRiver.polution_score)"></span><img v-if="selectedRiver.polution_score" :src="getpLevelIcon($tools.convertExponent(selectedRiver.polution_score))"></p>
                    <p><span>污染类型：</span><span v-text="renderModel.pType(selectedRiver.pollution_type && selectedRiver.pollution_type[0])"></span></p>
                    <p><span>污染面积：</span><span v-text="$tools.convertArea(selectedRiver.ares)"></span><span>&nbsp;km</span><sup>2</sup></p>
                    <div class="feature_index_area">
                        <p>特征指标</p>
                        <div class="index_items">
                            <div class="index_item" v-show="selectedRiver.pollution_type && selectedRiver.pollution_type[0]=='lvzao'">
                                <img :src="require(`@/image/index_chlorophyll.gif`)" alt="">
                                <div>叶绿素A含量</div>
                                <div v-text="`(${selectedRiver.lvzao_true ? selectedRiver.lvzao_true.toFixed(2) : 0}mg/m³)`"></div>
                            </div>
                            <div class="index_item" v-show="selectedRiver.pollution_type && selectedRiver.pollution_type[0]=='heichou'">
                                <img :src="require(`@/image/index_cdom.gif`)" alt="">
                                <div>CDOM</div>
                                <div v-text="`(${selectedRiver.heichou_true ? selectedRiver.heichou_true.toFixed(2) : 0}mg/m³)`">(18cm)</div>
                            </div>
                            <div class="index_item" v-show="selectedRiver.pollution_type && selectedRiver.pollution_type[0]=='nisha'">
                                <img :src="require(`@/image/index_sssc.gif`)" alt="">
                                <div>SSSC</div>
                                <div v-text="`(${selectedRiver.nisha_true ? selectedRiver.nisha_true.toFixed(2) : 0}mg/L)`">(12mg/L)</div>
                            </div>
                        </div>
                    </div>
                    <div class="detailBtn" v-show="!config.tendencyView" @click="showDetail(selectedRiver.id)">查看详情</div>
                </div>
                <i class="arrow"></i>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import gisMapApii from '@/util/gisMapApi.js'
import {Polygon,Map,LineString,Coordinate,VectorLayer,ui,MultiPolygon,GeometryCollection} from 'maptalks/dist/maptalks';
// import * as maptalksE3 from 'e3/dist/e3';
import regionLabelEleO from './3dMap_regionLabel.vue';
import echarts from 'echarts';
import extentMerge from '@/data/convex_hull.json';
var gisMapApi = gisMapApii;
var regionLabelEle = regionLabelEleO;
// 绘制工具
var webGis = {},
    originZoom = 8,
    mapCenter = [119.296494, 26.074507],
    _this,
    flag = {
        region : {
            hover:'',
            selected:''
        }
    };
export default {
    data () {
        return {
            isPollution:true,
            selectedRiver:{},
            currentZoom:10,
            renderModel:{
                pType:typeArray => {
                    var tempTypeStr = "无";
                    if (typeArray && typeArray.length > 0) {
                        // tempTypeStr = typeArray.map(item => _this.$store.state.sensoryLegend[item].label).toString();
                        tempTypeStr = _this.$store.state.sensoryLegend[typeArray].label;
                    }
                    return tempTypeStr;
                }
            },
            getpLevelIcon(num){
                if (!num || num < 25) {
                    return;
                }
                var pLevel = Math.floor(num / 25);
                return require('@/image/l' + pLevel + '_label.png');
            }
        }
    },
    props:["config"],
    components : {
        regionLabelEle
    },
    created(){
        _this=this;
    },
    mounted () {
        initMT(this);
        this.$root.$on('resetMap', function(){
            webGis.webMap.animateTo(
                {
                    center: [104.06868, 30.56122],
                    // zoom: 13,
                    pitch: 0,
                    bearing: 0
                }, {
                    duration: 1000
                    }
                );
        });
    },
    route:{
        data(){
            console.log(arguments)
        }
    },
    watch:{
        "config.pollution.data":{
            handler(n,o){
                refreshFeature(n, 'pollution');
            },
            deep:true
        },
        "config.water.data":{
            handler(n,o){
                refreshFeature(n, 'rivers');
            },
            deep:true
        },
        'config.selectedCounty':function(nv, ov){
            this.selectRegion(nv || 'all', ov);
            webGis.detailOverlay.hide();
        },
        'config.tendencyView'(nV, oV){
            if (nV) {
                webGis.riversLayer.hide()
            } else {
                webGis.riversLayer.show()
            }
        }
    },
    beforeDestroy(){
        _.each(webGis.players, function(item){
            item.finish()
        });
        // webGis.e3Layer.setEChartsOption({});
    },
    methods:{
        manualSelect(param, type){
            var dataCollection = type == 'pollution' ? webGis.pollution : webGis.rivers;
            var centerCoo = (type == 'pollution' || param.name == 'null') ? dataCollection[param.id].getProperties().data.coordinate : dataCollection[param.id].getProperties().data.coordinate[0];
            var extent = dataCollection[param.id].getExtent();

            webGis.webMap.once("moveend",()=>{
                // maptalks的getCenter方法找到的中心可能不在多边形内，使用ol的方法
                // selectFeature(dataCollection[param.id], dataCollection[param.id].getCenter());
                selectFeature(dataCollection[param.id], new Coordinate(gisMapApi.getFlatInteriorPoint(centerCoo)));
                
            });
            webGis.webMap.fitExtent(extent);
        },
        selectRegion(region, lastRegion){
            // if (lastRegion && webGis.regions.polygons[lastRegion]) {
            //     webGis.regions.polygons[lastRegion].updateSymbol({
            //         'polygonFill': 'transparent',
            //         // 'lineWidth': 1,
            //     });
            // }

            for (var i in webGis.regions.polygons) {
                webGis.regions.polygons[i].updateSymbol({
                    'polygonFill': region == 'all' ? 'transparent' : 'white',
                    // 'lineWidth': 1,
                });
            }
            
            if (region !== 'all' && webGis.regions.polygons[region]) {
                webGis.regions.polygons[region].updateSymbol({
                    'polygonFill': 'transparent',
                    // 'lineWidth': 2,
                });
                webGis.webMap.fitExtent(webGis.regions.polygons[region].getExtent());
            } else {
                webGis.webMap.fitExtent(webGis.regionsLayer.getExtent());
            }
        },
        showDetail(id){
            this.$root.$emit('showDetail', id);
        }
    },
}

async function getRegions(){
    var regions = await _this.$http.get("/regions");
    var regionsData = await _this.$http.get("/regionsData");

    var geoJsonTmp = {
        "type": "FeatureCollection",
        "features": []
    }
    webGis.regions = {polygons:{},labels:{}};
    var regionLabelCon = Vue.extend(regionLabelEle);

    if (regionsData.code === 0) {
        refreshRegionLabels(regions,regionsData,regionLabelCon);
    }
    if(regions.code === 0){
        regions.data.forEach(function(item){
            var geoJson = {
                "type": "Feature",
                "properties": {name:item.name,introduction:item.introduction,shape_leng:item.shape_leng,areaResult:item.areaResult},
                "geometry": {
                    "type": "Polygon",
                    "coordinates":JSON.parse(item.shape.Shape).coordinates[0]
                }
            }
            geoJsonTmp.features.push(geoJson);
            var borderColor = '#014fff';
            var regionPolygon = new Polygon(JSON.parse(item.shape.Shape).coordinates[0],{
                'symbol': {
                    'lineColor': borderColor,
                    'lineWidth': 2,
                    'polygonOpacity': .3,
                    'lineDasharray':[10],
                    // 'opacity': 1
                },
                properties : {
                    data:item
                },
            });

            


            // 管理区划事件
            regionPolygon.on("click", function(evt){
                // alert(evt.target.getProperties().data.name)
                // evt.target.updateSymbol({
                //     'polygonFill': 'red',
                // });
                // evt.target.updateSymbol({
                //     'polygonFill': borderColor,
                //     'polygonOpacity':.1
                // });
            }).on('mouseenter',(evt)=>{
                flag.region.hover = evt.target.getProperties().data.name;
                // evt.target.updateSymbol({
                //     'polygonFill': 'red',
                // });
            }).on('mouseout',(evt)=>{
                // if(evt.target.getProperties().data.name != flag.region.hover){
                //     evt.target.updateSymbol({
                //         'polygonFill': 'transparent'
                //     });
                // }
            });
            webGis.regions.polygons[item.name] = regionPolygon;
        });
        // region geojson
        // (function downloadGeoJson(fileName,content){
        //     if(!fileName || !content){
        //         alert("请先选择行政区")
        //     }
        //     var aDom = document.createElement('a');
        //     aDom.download = fileName;
        //     aDom.style.color = 'black';
        //     aDom.innerHTML = "xiazairegions";
        //     var blob = new Blob([content]);
        //     aDom.href= URL.createObjectURL(blob);
        //     document.body.appendChild(aDom);
            
        // })("cd.json",JSON.stringify(geoJsonTmp));

        webGis.regionsLayer.addGeometry(_.map(webGis.regions.polygons,function(item){
            return item;
        }));
    }
    // 监听地图缩放
    webGis.webMap.on('zoomend',arg=>{
        _this.currentZoom = arg.to;
    });
}

function refreshRegionLabels(regions,regionsData,regionLabelCon){
    if (!_.isEmpty(webGis.regions.labels)) {
        for (let i in webGis.regions.labels) {
            webGis.regions.labels[i].remove();
        }
        webGis.regions.labels = {};
    }
    regions.data.forEach(function(item){
        var tempRegion = regionsData.data.find(i => i.name == item.name) || {name:item.name,water_quality:'??'};
        var pLevel = isNaN(_this.$tools.convertExponent(tempRegion.water_quality)) ? '' : 'l'+Math.floor((_this.$tools.convertExponent(tempRegion.water_quality)*1)/(25));
        // 图形标注区域信息
        var regionLabel = new ui.UIMarker(gisMapApi.getFlatInteriorPoint(JSON.parse(item.shape.Shape).coordinates[0]), {
            'draggable'     : false,
            'single'        : false,
            // 'content'       : '<div class="text_marker"><p>'+ item.name + '</p><p>水质感官指数：<span class='+ pLevel +'>' + tempRegion.exponent + '</span></p></div>'
            'content'       : (new regionLabelCon({
                el:window.document.createElement('div'),
                computed:{
                    currentZoom(){
                        return _this.currentZoom
                    },
                    name(){
                        return item.name
                    },
                    exponent(){
                        return _this.$tools.convertExponent(tempRegion.water_quality)
                    },
                    type(){
                        return this.currentZoom >= 11 ? 'completion' : 'simple'
                    }
                },
                created(){
                    this
                },
                parent:_this
            })).$el
            
        });

        regionLabel.addTo(webGis.webMap).show();
        webGis.regions.labels[item.name] = regionLabel;
        
        
    });
}

async function initMT (_this) {
    // 行政区图层
    webGis.regionsLayer = new VectorLayer('region',[],{
        zIndex:3,
        enableAltitude : true,
        altitudeProperty : 'altitude',
        drawAltitude : {
            polygonFill : function(){
                console.log(1)
            },
            polygonOpacity : 0.3,
            lineWidth : 0
        }
    });
    getRegions();
    // 江河湖泊图层
    webGis.riversLayer = new VectorLayer('riverVector',[],{
        zIndex:4,
        enableAltitude : true,        // enable altitude
        altitudeProperty : 'altitude',
        drawAltitude : {
            polygonFill : function(){
                console.log(1)
            },
            polygonOpacity : 0.3,
            lineWidth : 0
        }
    });

    // 污染图层
    webGis.pollutionLayer = new VectorLayer('pollutionVector',[],{
        zIndex:5,
        enableAltitude : true,        // enable altitude
        altitudeProperty : 'altitude',
        drawAltitude : {
            polygonFill : function(){
                console.log(1)
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
        }
        ]
    };
    // webGis.e3Layer = new maptalksE3.E3Layer('e3',ecOption,{ hideOnZooming : true, hideOnRotating : true, hideOnMoving : true ,zIndex:2});
    
    webGis.webMap = new Map("mapTalks",{
        // center: gisMapApi.transformProjection([104.06868, 30.56122]),
        center: [104.06868, 30.56122],
        attribution: false,
        hitDetect :false,
        // center: [104.123877,30.71688],
        zoom:  _this.currentZoom,
        maxZoom : 17,
        minZoom : 9,
        // 最大倾斜角度，默认为80，会导致地图远景虚化，但是河流即动效不虚化，可能产生歧义，调整最大倾斜角
        maxPitch:65, 
        // maxVisualPitch:80,
        // crossOrigin:true,
        spatialReference:{

        },
        // baseLayer : 
        // // new WMSTileLayer('wms', {
        // //     'urlTemplate' : 'https://demo.boundlessgeo.com/geoserver/ows',
        // //     'crs' : 'EPSG:3857',
        // //     'layers' : 'ne:ne',
        // //     'styles' : '',
        // //     'version' : '1.3.0',
        // //     'format': 'image/png',
        // //     'transparent' : true,
        // //     'uppercase' : true
        // // }),
        // new WMSTileLayer('wms', {
        //     'urlTemplate' : 'http://10.190.239.132:8008/dsjbs234basemapraster/arcgis/services/BASEMAP/Raster/MapServer/WmsServer',
        //     'crs' : 'EPSG:4326',
        //     'layers' : '0',
        //     'styles' : '',
        //     'version' : '1.3.0',
        //     'format': 'image/png',
        //     // 'transparent' : true,
        //     // 'uppercase' : true
        // }),
        layers : [
            gisMapApi.getGisLayer(),
            webGis.riversLayer.setMask(gisMapApi.getGisLayer('mask')),
            webGis.pollutionLayer.setMask(gisMapApi.getGisLayer('mask')),
            webGis.regionsLayer
            // webGis.e3Layer,
        ],
        fogColor:[0,127,255]
    });
    var infoWindowOptions = {
        // eventsPropagation:true,
        autoOpenOn :null,
        autoCloseOn :null,
        content: '<div id="detailBoxIn3d" class="detail_box">test</div>',
        // single:true,
        // custom:true
    }
    webGis.detailOverlay = new ui.InfoWindow(infoWindowOptions,{
        properties:{
            // altitude : 150,
        },
        
    });
    webGis.detailOverlay.addTo(webGis.webMap);
    // webGis.detailOverlay.on('showend',() => {
    //     // webGis.detailOverlay.setContent('<div id="detailBoxIn3d" class="detail_box">'+_this.$refs.detailBox.innerHTML+'</div>');
    //     // webGis.detailOverlay.setContent(_this.$refs.detailBox);
    //     document.getElementById("detailBoxIn3d").appendChild(_this.$refs.detailBox);
    // });
   
    // webGis.e3Layer.addTo(webGis.webMap);
    // webGis.riversLayer.addTo(webGis.webMap);
    bindWebgisEvents();
}

function changePolygonStatus (feature, type) {
    // 先把所有江河取消高亮，并给selected属性赋值
    _.each(webGis.rivers, function(item){
        // 设置selected
        if (type == 'select') {
            var tempProperties = item.getProperties();
            if (feature && feature.getProperties().data.id == item.getProperties().data.id) {
                tempProperties.data.selected = true;
            } else {
                tempProperties.data.selected = false;
            }
            item.setProperties(tempProperties);
        }

        // 当高亮时
        if(item.getSymbol().polygonOpacity == '1'){
            if (item.getProperties().data.selected) {
                return;
            }

            item.updateSymbol({
                'lineColor':item.getSymbol().polygonFill,
                'polygonOpacity':'.9'
            });
        }
    });

    _.each(webGis.pollution, function(item){
        // 设置selected
        if (type == 'select') {
            var tempProperties = item.getProperties();
            if (feature && feature.getProperties().data.id == item.getProperties().data.id) {
                tempProperties.data.selected = true;
            } else {
                tempProperties.data.selected = false;
            }
            item.setProperties(tempProperties);
        }

        // 当高亮时
        if(item.getSymbol().polygonOpacity == '1'){
            if (item.getProperties().data.selected) {
                return;
            }

            item.updateSymbol({
                'lineColor':item.getSymbol().polygonFill,
                'polygonOpacity':'.9'
            });
        }
    });

    if (feature) {
        var property = feature.getProperties().data, colorStr;
        if (feature.getSymbol().polygonOpacity == 1) {
            return;
        }
        if (property.pollution_type) {
            colorStr = _this.$store.state.pollutionLegendOptions.find(option => option.value == property.pollution_type[0]).colorRGB;
        } else {
            colorStr = '1,157,255';
        }
        setTimeout(()=>{
            feature.updateSymbol({
                'lineColor':'white',
                'polygonOpacity':'1'
            });
        });
    }
}


// 绑定webgis地图事件
function bindWebgisEvents () {

    // 监听点击地图事件
    webGis.webMap.on("click", function (e) {
        if (webGis.detailOverlay.isVisible()) {
            webGis.detailOverlay.hide();
        }
        changePolygonStatus(void(0), 'select');
        // _this.$root.$emit('showDetail', false);
    })
}

function selectFeature(feature,coo) {
    // webGis.detailOverlay.hide();
    
    if (feature) {
        _this.isPollution = feature.getProperties().data.isPollution;
        changePolygonStatus(feature, 'select');
        _this.selectedRiver = feature.getProperties().data;
        if (coo) {
            // webGis.detailOverlay.setContent(_this.$refs.detailBox);
            // webGis.detailOverlay.setContent('<div id="detailBoxIn3d" class="detail_box">'+_this.$refs.detailBox.innerHTML+'</div>');
            webGis.detailOverlay.show(coo);
            setTimeout(() => {
                // webGis.detailOverlay.setContent(_this.$refs.detailBox);
                webGis.detailOverlay.setContent('<div id="detailBoxIn3d" class="detail_box">'+_this.$refs.detailBox.innerHTML+'</div>');
                document.querySelector("#detailBoxIn3d .detailBtn").onclick = function () {
                    // 全局保存，供详情页使用
                    _this.$store.state.stastistics.detail.data = feature.getProperties().data;
                    _this.$root.$emit('showDetail', _this.selectedRiver.id);
                };
            });
        }
    }
}

var count = 0;

/* 
    刷新河流及污染
 */
function refreshFeature (data, type, needAni) {
    // if(_this.config.tendencyView){
    if(false){
        var layerOpacity = webGis.pollutionLayer.getOpacity(),
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
                webGis.pollutionLayer.setOpacity(layerOpacity);
                requestAnimFrame(layerAniO[direction]);
            } else if(layerOpacity<=0) {
                webGis.pollutionLayer.setOpacity(0);
                direction = "show";
                // 隐藏动画完成后刷新河流数据
                // console.log('刷新数据' + new Date().getSeconds() + new Date().getMilliseconds())
                console.time('消失结束' + count)
                updateView(data, type);
                requestAnimFrame(layerAniO[direction]);
            } else if (layerOpacity>=1) {
                webGis.pollutionLayer.setOpacity(1);
            }
        }
        console.time('消失开始' + count)
        layerAni(direction)
    } else {
        updateView(data, type);
    }
}

function updateView (data, type) {
    
    webGis[type] = {};
    webGis[type+'Layer'].clear();
    let geoJsonTmp = {
        "type": "FeatureCollection",
        "features": []
    },
    tempLayer = webGis[type+'Layer'],
    tempData = webGis[type];

    webGis.players = {};
    webGis.detailOverlay.hide();

    if (data.length == 0) {
        // var tempEchartsOption = _.cloneDeep(webGis.e3Layer.getEChartsOption());
        // tempEchartsOption.series[0].data = [];
        // webGis.e3Layer.setEChartsOption(tempEchartsOption);
    } else {

        _.each(data, function(item,index){
            // // 无污染的不打点
            // if (item.pType.length <= 0) {
            //     return;
            // }
            if (!item) {
                return;
            }
            item.isPollution = type == 'pollution';
            var geoJson = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates":item.coo
                }
            }
            geoJsonTmp.features.push(geoJson);
            if (type == 'rivers') {
                var polygonFeature = new MultiPolygon(item.name == 'null'?[item.coordinate]:item.coordinate,{
                    // cursor:"pointer",
                    'symbol': {
                        'lineColor': 'rgba(1,157,255,1)',
                        'lineWidth': 3,
                        'lineOpacity': 1,
                        'polygonFill': `rgba(1,157,255,1)`,//_this.config.colors[item.level], //default color in cartoCSS
                        'polygonOpacity': .9
                    },
                    properties : {
                        // altitude : 150,
                        data:item
                    },
                });
            } else {
                // var pType = ([{label:'heichou',value:item.heichou == 'null'?0:item.heichou},{label:'lvzao',value:item.lvzao == 'null'?0:item.lvzao},{label:'nisha',value:item.nisha == 'null'?0:item.nisha}].sort((a,b)=>b.value - a.value))[0].label;
                // item.pType = pType;
                var polygonFeature = new Polygon(item.coordinate ,{
                    // cursor:"pointer",
                    'symbol': {
                        'lineColor': `rgba(${_this.$store.state.pollutionLegendOptions.find(option => option.value == item.pollution_type[0]).colorRGB},1)`,
                        'lineWidth': 2,
                        'lineOpacity': 1,
                        'polygonFill': `rgba(${_this.$store.state.pollutionLegendOptions.find(option => option.value == item.pollution_type[0]).colorRGB},1)`,//_this.config.colors[item.level], //default color in cartoCSS
                        'polygonOpacity': .9,
                    },
                    properties : {
                        // altitude : 150,
                        data:item
                    },
                });
            }

            polygonFeature.on("click", function(evt){
                event.stopPropagation();
                selectFeature(evt.target,evt.coordinate);
            });
            polygonFeature.on("mouseenter", function(evt){
                // debugger;
                // evt.target,evt.coordinate
                changePolygonStatus(this, 'hover');
                if (evt.domEvent.target.style.cursor != "pointer") {
                    evt.domEvent.target.style.cursor = "pointer";
                }
            }).on("mouseout", function(evt){
                // debugger;
                // evt.target,evt.coordinate
                changePolygonStatus(void(0), 'hover');
                if(evt.domEvent.target.style.cursor != "default"){
                    evt.domEvent.target.style.cursor = "default";
                }
            });
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

            tempData[item.id] = polygonFeature;
            // var pLine = new LineString(item.coo[0],{
            //     cursor:"pointer",
            //     symbol:{
            //         // 'lineColor' : '#1bbc9b',
            //         lineOpacity:0,
            //         // polygonFill : _this.config.colors[item.level],
            //         // polygonOpacity : .3,
            //     },
            //     properties : {
            //         'altitude' : 150
            //     }
            // });
            // // webGis.rivers[item.id+"_pline"] = pLine;
        });

        // (function downloadGeoJson(fileName,content){
        //     if(!fileName || !content){
        //         alert("请先选择行政区")
        //     }
        //     var aDom = document.createElement('a');
        //     aDom.download = fileName;
        //     aDom.innerHTML = "xiazai";
        //     var blob = new Blob([content]);
        //     aDom.href= URL.createObjectURL(blob);
        //     document.body.appendChild(aDom);
            
        // })("TEST.json",JSON.stringify(geoJsonTmp));

        // var tempEchartsOption = _.cloneDeep(webGis.e3Layer.getEChartsOption());

        var riveData = _.filter(data,{type:"江河"});

        // var effectData = _.map(riveData, function(item,idx){
        //     var hStep = 300 / (riveData.length - 1);
        //     return {
        //         'coords': item.coo[0],
        //         'lineStyle': {
        //             'normal': {
        //                 'color': echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx)),
        //                 // 'color': "red",
        //                 // width:5
        //             }
        //         }
        //     }
        // });

        tempLayer.addGeometry(_.map(tempData),function(item){
            return item;
        });
        if (type == 'rivers') {
            // 必须深拷贝过后才行，否则会使Geometries的事件失效（河流的交互事件）
            // var collection = new GeometryCollection(_.cloneDeep(webGis.riversLayer).getGeometries());
            // webGis.webMap.fitExtent(collection.getExtent())
        }
    }

}

</script>
<style scoped lang="stylus">
    @import "~@/common/common.styl";
    #mapContainer {
        base(100%,100%);
        #mapTalks {
            base(100%,100%);
            }
        #detailBoxTemplate{
            display none
        }
        .detailbox_common{
            p{
                margin-bottom 5px
                display flex
                flex-direction row
                height 22px
                line-height 22px
                >span{
                    &:first-child{
                        color rgba(0,146,254, 1)
                        width 90px
                        justify-content flex-end
                        display flex
                    }
                    &:last-child{
                        // flex-grow 1
                        width calc(100% - 90px)
                        overflow hidden
                        text-overflow ellipsis
                        white-space nowrap
                    }
                }
                >img {
                    margin-left 10px
                }
            }
            .detailBtn{
                color rgba(1,157,255,1)
                cursor pointer
                text-decoration underline
                text-underline-position under
            }
            .feature_index_area {
                display flex 
                flex-direction column
                margin-bottom 10px
                .index_items {
                    display flex 
                    flex-direction row
                    justify-content space-around
                    .index_item {
                        text-align center
                        >div{
                            &:first-of-type {
                                height 19px
                                line-height 19px
                            }
                            text-align center
                        }
                    }
                }
            }
        }
        
    }
</style>
