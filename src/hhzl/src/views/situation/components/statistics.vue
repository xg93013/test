<template>
    <div id="situation_statistics">
        <div class="panel_common left_panel animation" :class="{initial:loaded}" v-show="!showTendency">
            <div v-show="!detailPanelDisplay" style="height:100%;">
                <!-- 水资源智能提取 -->
                <div class="section_common style_common clearFloat stat">
                    <div class="title">水资源智能提取</div>
                    <div class="outline">
                        <div class="floatL total_item">
                            <div class="numArea">
                                <div class="floatL num_item" v-for="item in $tools.fitDigit(statisticsData.total_num, 4)" :key="item.id"><span v-text="item"></span></div>
                                <div class="floatL unit">个</div>
                            </div>
                            <p>水资源数量</p>
                        </div>
                        <div class="floatL total_item">
                            <div class="numArea">
                                <div class="floatL num_item" :class="{'dot':item =='.'}" v-for="item in $tools.fitDigit($tools.convertArea(statisticsData.total_area, true, 4), 4)" :key="item.id"><span v-text="item"></span></div>
                                <div class="floatL unit"><span class="child">{{statisticsData.total_area > 1e4 ? `km` : 'm'}}</span><sup class="child">2</sup></div>
                            </div>
                            <p>水资源面积</p>
                        </div>
                    </div>
                    <div class="river_lake">
                        <div class="style_common">
                            <div id="resourceTypeRatio">

                            </div>
                        </div>
                        <div class="style_common info">
                            <div :class="{statis_panel:true,show:currentRType=='湖泊'}">
                                <div class="sub_title">湖泊</div>
                                <p><span>数量：</span><span v-text="statisticsData.lakes_num">6个</span></p>
                                <p><span>面积：</span><span v-text="$tools.convertArea(statisticsData.lakes_area)"></span><span> km</span><sup>2</sup></p>
                                <p><span>占比：</span><span v-text="$tools.convertRate((statisticsData.lakes_area)/(statisticsData.total_area), true)">0.00%</span></p>
                            </div>
                            <div :class="{statis_panel:true,show:currentRType=='江河'}">
                                <div class="sub_title">江河</div>
                                <p><span>数量：</span><span v-text="statisticsData.rivers_num">6个</span></p>
                                <p><span>面积：</span><span v-text="$tools.convertArea(statisticsData.rivers_area)"></span><span> km</span><sup>2</sup></p>
                                <p><span>占比：</span><span v-text="$tools.convertRate((statisticsData.rivers_area)/(statisticsData.total_area), true)">0.00%</span></p>
                            </div>
                        </div>
                        <div class="style_common sortList" v-if="$store.state.view.bigScreen">
                            <div class="sub_title" v-text="`面积排名前3的${currentStatisticsView == 'total' ? '区县' : '河流/湖泊'}`"></div>
                            <p v-for="(item, index) in statisticsData.areaSortList ? statisticsData.areaSortList[currentRType] : []" :key="index">
                                <span v-text="`${index+1}.`"></span><span class="nameLabel" v-text="item.name"></span><span v-text="$tools.convertArea(item.area)"></span><span> km</span><sup>2</sup>
                            </p>
                        </div>
                    </div>
                </div>
                <!-- 区县水资源丰富指数 -->
                <barList class="section_common style_common small_bt semi_width floatL marginR" :config="regionConfig" v-if="$store.state.view.bigScreen && currentStatisticsView === 'total'" @itemClick="barClick"></barList>
                <!-- 水资源列表 -->
                <div class="section_common style_common semi_width flex" :class="currentStatisticsView === 'county'?'floatR':'floatL'" v-if="$store.state.view.bigScreen">
                    <div class="title">水资源列表</div>
                    <div class="content">
                        <g-table :options="waterResourceTableOptions"></g-table>
                    </div>
                </div>
                <div class="section_common small_st multi_data" :class="[$store.state.view.bigScreen?'semi_width marginR':'',currentStatisticsView === 'county'?'floatR':'floatL']">
                    <div class="title">多源异构数据融合</div>
                    <div class="content">
                        <template v-for="item in multiDataModel.list">
                            <div class="multi_data_item" :key="item.label">
                                <div class="imgArea">
                                    <img :src="require(`@/image/${item.icon}.png`)" alt="">
                                </div>
                                <div v-text="item.label"></div>
                                <div v-text="item.icon=='web_internet' ? monitoringModel.value + '个' : (item.icon=='governance_complaints' ? netWorkAppealModel.data.length + '条' : statisticsData.gisdata_num)"></div>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- 水资源列表-小 -->
                <!-- <div :class="['section_common','style_common','itemList', currentStatisticsView === 'county'?'middle_st':'']">
                    <g-table :options="waterResourceTableOptions"></g-table>
                </div> -->
                <!-- <div :class="['section_common','style_common','itemList']" v-show="currentStatisticsView === 'county'">
                    <g-table :options="waterResourceTableOptions"></g-table>
                </div> -->
                <!-- 网络理政诉求分析 -->
                <div class="section_common style_common small_bt netWorkAppeal collapseCommon" :class="[$store.state.view.bigScreen?'semi_width floatL marginR':'']" v-show="currentStatisticsView === 'county'">
                    <div class="title">网络理政诉求分析<span v-text='`(全部${netWorkAppealModel.data.length}件)`'></span></div>
                    <div class="data_list">
                        <el-collapse v-model="netWorkAppealModel.value" :accordion="true">
                            <template v-for="(item, index) in netWorkAppealModel.data">
                                <el-collapse-item :title="item['FmContent']" :name="index" :key="index">
                                    <template slot="title">
                                        <div class="prefix" :title="item['fromtopic'] || '--'" v-text="item['fromtopic'] || '--'"></div>
                                        <div class="suffix"><span v-text="item['FromTime'] ? item['FromTime'].split('T')[0] : '--'"></span>&nbsp;&nbsp;&nbsp;<span :style="{'color': item['CrtStepName'] == '未解决' ? 'red' : ''}" v-text="item['CrtStepName']"></span></div>
                                    </template>
                                    <div class="index_area" v-text="item['FmContent']">
                                        
                                    </div>
                                </el-collapse-item>
                            </template>
                        </el-collapse>
                    </div>
                </div>
                <!-- 网络理政诉求数量趋势分析 -->
                <div class="section_common style_common small_bt netWorkAppealTendency floatL flex" :class="[$store.state.view.bigScreen?'semi_width':'']" v-show="currentStatisticsView === 'county' && $store.state.view.bigScreen">
                    <div class="title">网络理政诉求数量趋势分析</div>
                    <div class="content">
                        <div id="netWorkAppealTendencyCharts"></div>
                    </div>
                </div>
                <!-- 数据处理流程 -->
                <div class="section_common style_common video_area flex" :class="[$store.state.view.bigScreen?'semi_width floatL':'' ]" v-show="currentStatisticsView === 'total'">
                    <div class="title">
                        数据处理流程
                    </div>
                    <div class="video_content content">
                        <video :src="$store.state.dynamicArgs.videoSrc" class="video_box" controls="controls" controlslist="nodownload">此处有视频</video>
                        <!-- <div>此处有视频</div> -->
                    </div>
                </div>
            </div>
            <div v-show="detailPanelDisplay" style="height:100%;">
                <!-- 物联网监测数据分析 -->
                <div class="section_common style_common big_st internetMonitoring collapseCommon">
                    <div class="title">物联网监测数据分析</div>
                    <div class="data_list">
                        <el-collapse v-model="internetMonitoringModel.value" :accordion="true" @change="collaChange()">
                            
                            <template v-for="(item, index) in internetMonitoringModel.data">
                                <el-collapse-item :title="item.dmName" :name="index" :key="index">
                                    <template slot="title">
                                        <div class="prefix" v-text="item.dmName"></div>
                                        <div class="suffix" v-text="item.updatetime"></div>
                                    </template>
                                    <div class="index_area">
                                        <div class="dataArea bigScreen" v-if="$store.state.view.bigScreen">
                                            <div class="internetMonitoring section">
                                                <div class="subtitle">
                                                    指标含量
                                                </div>
                                                <div class="listarea">
                                                    <template v-for="(i,ind) in internetMonitoringModel.indexs" class="">
                                                        <div :key="ind" class="index_item">
                                                            <div class="label" v-text="i.label"></div>
                                                            <div class="value" v-text="item[i.key] + (i.unit ? i.unit : '')"></div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                            <div class="internetMonitoring section">
                                                <div class="subtitle">
                                                    指标含量趋势分析
                                                </div>
                                                <div class="tendencyarea">
                                                    <div :id="`indexTendencyCharts_${index}`" class="indexTendencyCharts"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="$store.state.view.bigScreen">
                                            <template v-for="(i,ind) in item.indexs" class="">
                                                <div :key="ind" class="index_item">
                                                    <div class="label" v-text="i.label"></div>
                                                    <div class="value" v-text="i.value + (i.unit ? i.unit : '')"></div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </el-collapse-item>
                            </template>
                        </el-collapse>
                    </div>
                </div>
                
            </div>
            <div class="backBtn" @click="backToLastView" v-show="detailPanelDisplay || currentStatisticsView === 'county'">
                <span>&lt;&nbsp;</span><span v-text="detailPanelDisplay? $store.state.stastistics.detail.data.name:filter.region"></span>
            </div>
        </div>
        <!-- 趋势分析左边panel -->
        <div class="panel_common left_panel tendenty_panel" v-show="showTendency">
            <div class="section_common small_bt flex">
                <div class="title" v-text="'水质感官污染指数趋势变化'"></div>
                <div id="exponentTendencyCharts" class="tendency_charts"></div>
            </div>
            <div class="section_common small_st flex">
                <div class="title" v-text="'水污染面积趋势变化'"></div>
                <div id="areaTendencyCharts" class="tendency_charts"></div>
            </div>
            <div class="section_common small_st flex">
                <div class="title" v-text="'水污染数量趋势变化'"></div>
                <div id="countTendencyCharts" class="tendency_charts"></div>
            </div>
            
        </div>
        <div class="panel_common right_panel animation" :class="{initial:loaded}" v-show="!showTendency">
            <div v-show="!detailPanelDisplay" style="height:100%;">
                <!-- 水质感官污染指数 -->
                <exponentCharts class="exponentChartsOut section_common" :class="[$store.state.view.bigScreen?'semi_width floatL marginR':'']" :config="statisticsData"></exponentCharts>
                <!-- 水质感官污染指数趋势变化 -->
                <div class="section_common semi_width floatL flex" v-if="$store.state.view.bigScreen">
                    <div class="title">
                        水质感官污染指数趋势变化
                    </div>
                    <div class="content">
                        <div id="sensorTendencyCharts"></div>
                    </div>
                </div>
                <!-- 污染类型智能识别分类 -->
                <pollutionStatistics ref="pollutionStatistics" class="section_common small_bt" :class="[$store.state.view.bigScreen?'semi_width floatL marginR':'']" :config="pollutionStatisticsConfig" @itemClick="barClick"></pollutionStatistics>
                <!-- 区县水质感官指数TOP10 -->
                <barList class="section_common small_bt" :class="[$store.state.view.bigScreen?'semi_width floatR middle_st':'']" :config="regionExponentConfig" v-show="currentStatisticsView === 'total'" @itemClick="barClick"></barList>
                <!-- 水污染水质感官指数TOP10 -->
                <barList class="section_common small_bt" :class="[$store.state.view.bigScreen?'semi_width floatR middle_st':'']" :config="specificExponentConfig" v-show="currentStatisticsView === 'county'" @itemClick="barClick"></barList>
                <!-- 黑臭水体污染列表 -->
                <div class="section_common semi_width floatL marginR flex" v-if="$store.state.view.bigScreen">
                    <div class="title" v-text="`${$refs.pollutionStatistics && $refs.pollutionStatistics.currentKey ? $store.state.sensoryLegend[$refs.pollutionStatistics.currentKey].label :''}污染列表`">
                        
                    </div>
                    <div style="flex:1;display:flex;">
                        <g-table :options="$refs.pollutionStatistics ? $refs.pollutionStatistics.tableConfig : {rowClick:function(){}}"></g-table>
                    </div>
                </div>
            </div>
            <waterDetail v-show="detailPanelDisplay" :display="detailPanelDisplay" class="detailPanel section_common big_st"></waterDetail>
        </div>
        <div class="reset_btn" @click="resetMap" :class="{'tendency':showTendency}">
            <div class="reset_btn_pointer_area" :style="{transform:`rotate(${-resetModel.bearing - 90}deg) rotateY(${resetModel.pitch}deg)`}">
                <div class="pointer"></div>
            </div>
        </div>
    </div>
</template>

<script>

import exponentCharts from './exponentCharts.vue';
import pollutionStatistics from "./pollutionStatistics.vue"
import barList from "./barChartsList.vue"
import waterDetail from './statistics_detail.vue';
import gTable from "@/components/gTable.vue";

import echarts from 'echarts';

let _this,radarCharts,tendencyModel={}, commonTendencyModel = {};

export default {
    data () {
        return {
            loaded: false,
            pollutionStatisticsConfig:{data:{}},
            currentStatisticsView : "total",//'total','county'
            detailPanelDisplay : false,
            // 总资源类型占比当前类型
            currentRType:'江河',
            listData : [],
            waterResourceTableOptions:{
                url:'/getWaterResourceData',
                title:"水资源列表",
                maxHeight: 215,
                columns:[{
                        key:"name",
                        label:"名称",
                        // width:"82px",
                    },{
                        key:"type",
                        label:"类型",
                        // width:"50px",
                        formatter(row, column, cellValue, index){
                            return _this.$tools.renderCollection.waterType(cellValue);
                        }
                    },{
                        key:"area",
                        label:"面积",
                        // width:"70px"
                        formatter(row, column, cellValue, index){
                            return _this.$tools.convertArea(cellValue);
                        }
                    },{
                        key:"region",
                        label:"流经区域",
                        formatter(row, column, cellValue, index){
                            return cellValue ? cellValue.toString() : "--";
                        }
                        // width:"70px"
                }],
                rowClick:(row, event, column) => {
                    this.$emit("rowClick",row);
                    this.detailPanelDisplay = false;
                },
                renderHeader(h, param){
                    if (param.column.label == "面积") {
                        return h("span",[param.column.label,h('span',["(km"]),h('sup',["2"]),")"],{
                            // attrs : {
                            //     class : "cell"
                            // }
                        });
                    }
                    return param.column.label;
                },
            },
            currentAreaModel : {
                count:0,
            },
            internetMonitoringModel :{
                indexs:[{label:'溶解氧',value: Math.floor(2 + Math.random() * 5),unit:'mg/L', colorRGB: '82,13,240', key:'RongJieYang'},
                    {label:'高锰酸盐指数',value: Math.floor(6 + Math.random() * 10), colorRGB: '234,85,4', key:'CODMn'},
                    {label:'化学需氧量(COD)',value: Math.floor(15 + Math.random() * 26), colorRGB: '13,182,240', key:'CODCR'},
                    {label:'氨氮(NH3-N)',value: Math.floor(15 + Math.random() * 1986) / 1000, colorRGB: '138,101,74', key:'AnDan'},
                    {label:'总磷',value: Math.floor(1 + Math.random() * 20) / 10, colorRGB: '131,195,44', key:'ZongLin'}],
                value:0,
                data:[]
            },
            netWorkAppealModel :{
                value:0,
                data:[]
            },
            monitoringModel : {
                value : 0
            },
            multiDataModel:{
                list : [{
                    label:'卫星遥感数据',
                    value:'203G',
                    icon:'remote_sensing'
                },{
                    label:'理政投诉数据',
                    value:'15条',
                    icon:'governance_complaints'
                },{
                    label:'物联网监测点',
                    value:'153个',
                    icon:'web_internet'
                }]
            },
            columnsList:[{
                    key:"name",
                    label:"名称",
                    // width:this.$tools.fitViewPx(80)
                },{
                    key:"type",
                    label:"类型",
                    // width : (function() {
                    //     _this.$tools.fitViewPx(50)
                    // }())
                },{
                    key:"area",
                    label:"面积",
                    // width:this.$tools.fitViewPx(70)
                },{
                    key:"owner",
                    label:"负责河长",
                    // width:"70px"
            }],
            regionConfig:{data:[],title:'区县水资源丰富指数',type:'region_index'},
            regionExponentConfig:{data:[],title:`区县水质感官污染指数排名TOP10`,type:'region'},
            specificExponentConfig:{data:[],title:`水质感官污染指数排名TOP10`,type:'pollution'},
            statisticsData:{},
            resetModel: {
                pitch: 0,
                bearing: 0,
            }
        }
    },
    props:["filter",'diaplyType'],
    computed:{
        showTendency(){
            if (this.diaplyType == 'tendency') {
                this.$nextTick(()=>{
                    resizeCharts();
                });
                
                this.$nextTick(()=>{
                    refreshTendencyCharts();
                });
            }
            return this.diaplyType == 'tendency';
        },
    },
    components : {
        exponentCharts,
        barList,
        pollutionStatistics,
        gTable,
        waterDetail,
        
    },
    methods:{
        barClick(params){
            this.$emit("barClick",params);
        },
        headerRender(h, param){
            if (param.column.label == "面积") {
                return h("span",[param.column.label,h('span',["(m"]),h('sup',["2"]),")"],{
                    // attrs : {
                    //     class : "cell"
                    // }
                });
            }
            return param.column.label;
        },
        async countyPollutionTop10 (url) {
            let result = await this.$http.get(url);
            if (result.code == 0) {
                _this.specificExponentConfig.data = result.data.concat([]).sort(function(a,b){
                    return b.polution_score - a.polution_score
                }).slice(0, _this.$store.state.view.bigScreen ? result.data.length : 10).map(item => ({value:this.$tools.convertExponent(item.polution_score),id:item.id,label:item.name,type:item.pollution_type[0],loca:item.possition}));
            }
        },
        registEvent(){
            this.$root.$on('showDetail',(params)=>{
                this.detailPanelDisplay = params !== false;
                getMonitoringData(params.coordinate[0]);
                
            })

            this.$root.$on('mapPitchRotate', (params)=>{
                this.resetModel.bearing = params.bearing;
                this.resetModel.pitch = params.pitch;
                
            })
        },
        backToLastView(){
            if (this.detailPanelDisplay) {
                this.detailPanelDisplay = false;
            } else if (this.filter.region != '成都市') {
                // this.filter.region = '成都市'
                this.$emit('countyReset','成都市')
            }
        },
        resetMap(){
            this.$root.$emit('resetMap');
        },
        collaChange () {
            this.$nextTick(()=>{
                tendencyModel.internetMonitCharts[this.internetMonitoringModel.value] && tendencyModel.internetMonitCharts[this.internetMonitoringModel.value].resize()
            });
        }
    },
    created(){
        _this = this;
        this.waterResourceTableOptions.maxHeight = 230;
        this.regionExponentConfig.title = `区县水质感官污染指数排名${_this.$store.state.view.bigScreen?'':'TOP10'}`;
        this.specificExponentConfig.title = `水质感官污染指数排名${_this.$store.state.view.bigScreen?'':'TOP10'}`;
        this.registEvent();
        refreshSortData();
        refreshPollutionStatistics();
    },
    mounted(){
        // console.timeEnd('a')
        setTimeout(()=>{
            radarCharts = initRadarCharts();
            refreshIntroData();
            getComplaintsData();
        }, 0);
        this.$root.$on('windowResize', () => {
            if (this.showTendency) {
                resizeCharts();
            }
        });
        this.loaded = true;
    },
    watch:{
        "filter":{
            handler:function(nv, ov){
                refreshData(nv, ov);
            },
            deep:true
        },
        // 'filter.county'(nv, ov){
        //     this.countyPollutionTop10();
        // },
        currentStatisticsView:(nv, ov)=>{
            switch (nv) {
                case 'total' : {
                    // _this.waterResourceTableOptions.maxHeight = 230;
                    break;
                }
                case 'county' : {
                    // _this.waterResourceTableOptions.maxHeight = 536;
                    break;
                }
            }
        }
    }
}

function resizeCharts() {
    for(let i in tendencyModel){
        tendencyModel[i].resize();
    }
}
function refreshMonitorCharts (data, index) {
    var tendencyCharts = echarts.init(document.getElementById('indexTendencyCharts_' + index));
    tendencyModel.internetMonitCharts[index] = tendencyCharts;
    var tendencyOption = {
        legend: {
            align:"right",
            right: _this.$store.state.view.bigScreen ? 40: 10,
            textStyle : {
                color : "white"
            },
            inactiveColor : 'grey',
            selected : (()=>{
                var tempO = {};
                _this.internetMonitoringModel.indexs.forEach((item, iind) => {
                    tempO[item.label] = iind == 0
                });
                return tempO;
            })()
            
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {
                lineStyle : {
                    color : 'rgba(1,255,255,1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: _.map(data.tendencies,(i)=>`${i.year}.${i.month}`),
            axisLabel:{
                color:"white",
                rotate: _this.$store.state.view.bigScreen ?0: 45
            },
            boundaryGap: false,
            splitLine:{
                show:true,
                lineStyle : {
                    color : 'rgba(43, 85, 146, 1)',
                    type : 'dashed'
                }
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(43, 85, 146, 1)"
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                color:"white"
            },
            splitLine:{
                show:true,
                lineStyle : {
                    color : 'rgba(43, 85, 146, 1)',
                    type : 'dashed'
                }
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(43, 85, 146, 1)"
                }
            }
        },
        series: _.map(_this.internetMonitoringModel.indexs, item => {
            var tempColor = item.colorRGB;
            return {
                type:'line',
                name : item.label,
                data : (() => {
                    var randomData = [];
                    _.forEach(data.tendencies, function(i,sindex){
                        // if (sindex != randomData.length - 1) {
                        //     i.value = (Math.random()*(10)).toFixed(2);
                        // } else {
                        //     i.value = item.value;
                        // }
                        randomData.push({value:data.tendencies[sindex].indicator[item.key] || 0});
                        // i.value = ;
                        // return i;
                    });
                    return randomData;
                })(),
                smooth: true,
                lineStyle : {
                    color : `rgba(${tempColor},1)`
                },
                itemStyle : {
                    color : `rgba(${tempColor},1)`
                }
            }
        }),
        grid:{
            top:30,
            bottom:0,
            left:30,
            right:_this.$store.state.view.bigScreen ? 40: 10,
            containLabel:true
        }
    }
    tendencyCharts.setOption(tendencyOption);
}

async function getMonitoringData(coordinates){
    // internetMonitoringModel
    var monitoringResult = await _this.$http.post('MONITORINGDATA', {coordinates});
    // county=' + _this.$store.state.stastistics.detail.data.through.toString())
    if (monitoringResult.status.code == 0) {
        _this.internetMonitoringModel.data = monitoringResult.data;
        tendencyModel.internetMonitCharts = {};
        _this.$nextTick(function () {
            monitoringResult.data.forEach((item, index) => {
                refreshMonitorCharts(item, index);
            });
        });
    }
    
}

async function getComplaintsData(){
    let complaintsparams = {},
        monitoringparams = {};
    if (_this.filter.region && _this.filter.region !== 'all') {
        complaintsparams.fmAreaName = _this.filter.region;
        monitoringparams.regionName = _this.filter.region;
    }
    var complaintsResult = await _this.$http.get('COMPLAINTS', complaintsparams);
    if (complaintsResult.status.code == 0) {
        _this.netWorkAppealModel.data = complaintsResult.data.content;
        if (complaintsparams.fmAreaName) {
            refresCommonTendencyCharts('netWorkAppealTendencyCharts', getRandomData({alldata:complaintsResult.data.content, lastValue:complaintsResult.data.content.length, max:30,min:5}),'理政诉求数量');
        }
    }

    var monitoringNumberResult = await _this.$http.get('MONITORINGSTATIONNUMBER', monitoringparams);
    if (monitoringNumberResult.status.code == 0) {
        _this.monitoringModel.value = monitoringNumberResult.data;
    }
}

function getRandomData (data){
    var randomData = _this.$tools.getDateRange(6);
    randomData = _.map(randomData, function(i,index){
        if (data && data.alldata) {
            i.value = 0;
            data.alldata.forEach((comItem) => {
                let splitDate = comItem.FromTime.split('-');
                if (splitDate[0] == i.year && splitDate[1] == i.month) {
                    i.value++;
                }
            });
        } else if (data && data.lastValue != void(0) && index == randomData.length - 1) {
            i.value = data.lastValue;
        } else if (data && data.data) {
            i.value = data.data[index];
        } else {
            if (data) {
                let randomNum = Math.random()*((data.max || 100) - (data.min || 60) + 1) + (data.min || 60);
                i.value = data.digit ? randomNum.toFixed(data.digit) : Math.floor(randomNum);
            } else {
                i.value = Math.floor(Math.random()*(100 - 60 + 1) + 60);
            }
        }
        return i;
    });
    return randomData;
}

function refresCommonTendencyCharts(id,data,seriesName) {
    let option = {
        legend: {
            show: false,
            align:"left",
            textStyle : {
                color : "white"
            },
            inactiveColor : 'grey',
            
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {
                lineStyle : {
                    color : 'rgba(1,255,255,1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: _.map(_this.$tools.getDateRange(6), item => item.label),
            axisLabel:{
                color:"white",
                rotate: 0
            },
            boundaryGap: false,
            splitLine:{
                show:true,
                lineStyle : {
                    color : 'rgba(43, 85, 146, 1)',
                    type : 'dashed'
                }
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(43, 85, 146, 1)"
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                color:"white"
            },
            splitLine:{
                show:true,
                lineStyle : {
                    color : 'rgba(43, 85, 146, 1)',
                    type : 'dashed'
                }
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(43, 85, 146, 1)"
                }
            }
        },
        series: [{
            name: seriesName || '',
            data: data,
            
            type: 'line',
            smooth: true,
            lineStyle : {
                color : `rgba(1,255,255,1)`
            },
            itemStyle : {
                color : `rgba(1,255,255,1)`
            }
        }],
        grid:{
            top:30,
            bottom:10,
            left:10,
            right:35,
            containLabel:true
        }
    }
    if (!commonTendencyModel[id]) {
        commonTendencyModel[id] = echarts.init(document.getElementById(id));
    }
    commonTendencyModel[id].setOption(option);
}

function refreshTendencyCharts () {
    let lineChartsOption = {
        legend: {
            show:false,
            // orient:"vertical",
            align:"left",
            // right: 0,
            textStyle : {
                color : "white"
            },
            inactiveColor : 'grey',
            
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                lineStyle : {
                    color : 'rgba(1,255,255,1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: _.map(getRandomData(),(i)=>i.label),
            axisLabel:{
                color:"white",
                rotate: _this.$store.state.view.bigScreen ?0: 45
            },
            boundaryGap: false,
            splitLine:{
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(0,80,115,1)"
                }
            },
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                color:"white"
            },
            splitLine:{
                show:true,
                lineStyle : {
                    color : 'rgba(0,80,115,1)',
                    type : 'dashed'
                }
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(0,80,115,1)"
                }
            }
        },
        // series: [{
        //     data: getRandomData({lastValue:(_this.$tools.convertExponent(_this.statisticsData.water_quality))}),
        //     type: 'line',
        //     smooth: true,
        //     lineStyle : {
        //         color : `rgba(1,255,255,1)`
        //     },
        //     itemStyle : {
        //         color : `rgba(1,255,255,1)`
        //     }
        // }],
        grid:{
            top:10,
            bottom:0,
            left:15,
            right:40,
            containLabel:true
        }
    }
    if (!tendencyModel.exponentTendencyCharts) {
        tendencyModel.exponentTendencyCharts = echarts.init(document.getElementById('exponentTendencyCharts'));
        tendencyModel.exponentTendencyCharts.setOption(_.cloneDeep(lineChartsOption));
    }
    let exponentTendency = getRandomData({lastValue:(_this.$tools.convertExponent(_this.statisticsData.water_quality))});
    _this.$store.commit('refreshTendencyData', {type:'exponent',value: exponentTendency});
    tendencyModel.exponentTendencyCharts.setOption({
        series: [{
            data: exponentTendency,
            type: 'line',
            smooth: true,
            lineStyle : {
                color : `rgba(1,255,255,1)`
            },
            itemStyle : {
                color : `rgba(1,255,255,1)`
            }
        }]
    });
    if (!tendencyModel.areaTendencyCharts) {
        tendencyModel.areaTendencyCharts = echarts.init(document.getElementById('areaTendencyCharts'));
        tendencyModel.areaTendencyCharts.setOption(_.cloneDeep(lineChartsOption));
    }
    tendencyModel.areaTendencyCharts.setOption({
        series : [{
            data: getRandomData({
                lastValue:(_this.$tools.convertArea(_this.statisticsData.pollution_area)),
                max:_this.$tools.convertArea(_this.statisticsData.pollution_area) + 3,
                min:_this.$tools.convertArea(_this.statisticsData.pollution_area) - 2 > 0 ? _this.$tools.convertArea(_this.statisticsData.pollution_area) - 2 : 1,
                digit:3
            }),
            // data: getRandomData({data:(_this.$tools.convertArea(_this.statisticsData.pollution_area))}),
            type: 'line',
            areaStyle: {},
            smooth: true,
            lineStyle : {
                color : `rgba(1,255,255,1)`
            },
            itemStyle : {
                color : `rgba(1,255,255,1)`
            }
        }]
    });
    if (!tendencyModel.countTendencyCharts) {
        tendencyModel.countTendencyCharts = echarts.init(document.getElementById('countTendencyCharts'));
        tendencyModel.countTendencyCharts.setOption(Object.assign(_.cloneDeep(lineChartsOption),{
            tooltip: {
                trigger: 'item',
                axisPointer : {
                }
            },
            xAxis: {
                type: 'category',
                data: _.map(getRandomData(),(i)=>i.label),
                axisLabel:{
                    color:"white",
                    rotate: _this.$store.state.view.bigScreen ?0: 45
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:"rgba(0,80,115,1)"
                    }
                }
            },
            grid:{
                top:10,
                bottom:0,
                left:0,
                right:10,
                containLabel:true
            }
        }));
    }
    tendencyModel.countTendencyCharts.setOption({
        series : [{
            data: getRandomData({
                lastValue:(_this.pollutionStatisticsConfig.data.total.count),
                max:_this.pollutionStatisticsConfig.data.total.count + 10,
                min:_this.pollutionStatisticsConfig.data.total.count - 10 > 0 ? _this.pollutionStatisticsConfig.data.total.count - 10 :  0}
            ),
            type: 'bar',
            smooth: true,
            lineStyle : {
                color : `rgba(1,255,255,1)`
            },
            itemStyle : {
                color : `rgba(1,255,255,1)`,
                barBorderRadius : [10,10,0,0]
            },
            barWidth : 10
        }],
    });
}

// 查询基础数据
async function refreshSortData(){
    
    var regionDataPro = _this.$http.get('/regionsData');

    let regionData = [];
    let regionDataProR = await regionDataPro;
    
    if (regionDataProR) {
        regionData = regionDataProR.data.map(item => item);
    }

    _this.regionConfig.data  = regionData.sort(function(a,b){
        return b.water_index - a.water_index 
    }).slice(0,10).map(item => ({value:_this.$tools.convertExponent(item.water_index),id:item.name,label:item.name}));

    _this.regionExponentConfig.data = regionData.sort(function(a,b){
        return b.water_quality - a.water_quality
    }).slice(0, _this.$store.state.view.bigScreen ? regionData.length : 10).map(item => ({id:item.name,label:item.name,value:_this.$tools.convertExponent(item.water_quality)}));

}

function initRadarCharts(){
    var originData = [
            // {value:335, name:'江河',selected:true},
            {value:335, name:'江河',itemStyle:{color:'rgba(110, 238, 151,1)'}},
            {value:30, name:'湖泊',itemStyle:{color:'rgba(1, 255, 255,1)'}},
        ];
    var option = {
        tooltip: {
            confine:true
        },
        grid:{
            // containLabel:true,
        },
        legend:{
            show:false
        },
        tooltip:{
            show:false
        },
        series: [{
            // selectedMode: 'single',
            // hover动画效果
            hoverAnimation:true,
            type: 'pie',
            radius: ['55%', '80%'],
            // hoverOffset:10,
            avoidLabelOverlap:false,
            label:{
                normal: {
                    show: false,
                    position: 'center',
                    // formatter:'{d} %'
                    formatter: params => parseInt(params.percent) + " %"
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data : originData,
        }]
    };

    var charts = echarts.init(document.getElementById('resourceTypeRatio'));
    var types=['江河','湖泊'];
    var outCharts = false;
    charts.setOption(option);
    var timer;

    charts.on('mouseover', function(params){
        // clearTimeout(timer);
        riverLakeLoop(params.name,true);
    });
    charts.on('mouseout', function(params){
        // clearTimeout(timer);
        riverLakeLoop(_this.currentRType, true);
    });
    charts.on('globalout', function(params){
        riverLakeLoop(_this.currentRType);
    });

    function riverLakeLoop (current, once) {
        clearTimeout(timer);
        // 先把当前高亮的取消
        if(current !== _this.currentRType){
            charts.dispatchAction({
                type : 'downplay',
                seriesIndex:0,
                name:_this.currentRType
            });
        }
        // 设置为下一个
        _this.currentRType = current || types.find(item=> item != _this.currentRType);

        // 高亮
        // charts.setOption({series:[{data:_.cloneDeep(originData).map(item=>{
        //     if (item.name == _this.currentRType) {
        //         item.selected = true;
        //     }
        //     return item;
        // })}]});
        charts.dispatchAction({
            type : 'highlight',
            seriesIndex:0,
            name:_this.currentRType
        });
        if(once){
            return;
        }
        timer = setTimeout(riverLakeLoop, 3000);
    }

    riverLakeLoop();
    return charts;
}




function refreshData (nv, ov) {
    var tempWaterUrl = '/getWaterResourceData',
        pollutionUrl = '/getPollutionData',
        filterArr = [];
    _this.detailPanelDisplay = false;
    
    if (_this.filter.id) {
        tempWaterUrl += "?id=" + _this.filter.id;
        refreshPollutionStatistics("?waterId=" + _this.filter.id);
    } else {
        let promiseArr = [];
        for(let i in _this.filter){
            if (_this.filter[i] && _this.filter[i] != 'all') {
                filterArr.push(i+'='+_this.filter[i]);
            }
        }
        var filterStr = filterArr.length > 0 ? '?' + filterArr.join('&'):"";
        tempWaterUrl += filterStr;
        pollutionUrl += filterStr;
        promiseArr.push(refreshPollutionStatistics(filterStr));
        _this.countyPollutionTop10(pollutionUrl);

        _this.waterResourceTableOptions.url = tempWaterUrl;
        
        // 区县change改变出发的事件
        if (_this.filter.region && nv.region != ov.region) {
            promiseArr.push(refreshIntroData(nv.region));
            getComplaintsData();
            if (_this.filter.region != 'all' ) {
                _this.currentStatisticsView = 'county';
                _this.waterResourceTableOptions.columns = [{
                            key:"name",
                            label:"名称",
                            // width:"82px",
                        },{
                            key:"type",
                            label:"类型",
                            // width:"50px",
                            formatter(row, column, cellValue, index){
                                return _this.$tools.renderCollection.waterType(cellValue);
                            }
                        },{
                            key:"area",
                            label:"面积",
                            // width:"70px"
                            formatter(row, column, cellValue, index){
                                return _this.$tools.convertArea(cellValue);
                            }
                        }]
            } else {
                _this.waterResourceTableOptions.columns = [{
                            key:"name",
                            label:"名称",
                            // width:"82px",
                        },{
                            key:"type",
                            label:"类型",
                            // width:"50px",
                            formatter(row, column, cellValue, index){
                                return _this.$tools.renderCollection.waterType(cellValue);
                            }
                        },{
                            key:"area",
                            label:"面积",
                            // width:"70px"
                            formatter(row, column, cellValue, index){
                                return _this.$tools.convertArea(cellValue);
                            }
                        },{
                        key:"region",
                        label:"流经区域",
                        formatter(row, column, cellValue, index){
                            return cellValue ? cellValue.toString() : "--";
                        }}]
                        // width:"70px"
                _this.currentStatisticsView = 'total';
            }
            
        }
        Promise.all(promiseArr).then(()=>{
            if (_this.showTendency) {
                refreshTendencyCharts();
            }
        });
    }
    
}

// 查询统计数据（水资源以及水污染）
async function refreshIntroData (county) {
    return new Promise(async (resolve, reject)=> {
        var statisticsDataPro = _this.$http.get('/introData'+ (county ? "?county=" + county : ''));
        let statisticsDataProR = await statisticsDataPro;
        if (statisticsDataProR) {
            _this.statisticsData = statisticsDataProR.data;
        } else {
            return;
        }

        let tempOption = {
            series:[{
                data:[
                    {value:_this.statisticsData.rivers_area, name:'江河',itemStyle:{color:'rgba(110, 238, 151,1)'}},
                    {value:_this.statisticsData.lakes_area, name:'湖泊',itemStyle:{color:'rgba(1, 255, 255,1)'}},
                ]
            }]
        };
        radarCharts.setOption(tempOption);
        refresCommonTendencyCharts('sensorTendencyCharts', getRandomData({lastValue:(_this.$tools.convertExponent(_this.statisticsData.water_quality))}), '污染指数');
        resolve();
    });
}

// 查询水污染统计
async function refreshPollutionStatistics (url) {
    return new Promise(async (resolve, reject)=>{
        let pollutionStatisticsUrl = '/pollutionStatistics' + (url ? url : '');
        // let result = await _this.$http.get('/pollutionStatistics'+ (county ? "?county=" + county : ''));
        let result = await _this.$http.get(pollutionStatisticsUrl);
        if (result && result.code == 0) {
            _this.pollutionStatisticsConfig.data = result.data;
        }
        resolve();
    });
}
</script>
<style lang="stylus" scoped>
    @import "~@/common/common.styl"
    #situation_statistics{
        overflow hidden
        position relative
        // 重置按钮
        .reset_btn {
            padding fitPx(15px)
            trans()
            position absolute
            top $headerH + fitPx(80px)
            right fitPx(20px) + $panelCommonWidth + fitPx(20px)
            cursor pointer
            z-index 1
            base(fitPx(60px), fitPx(60px))
            background url('~@/image/reset_btn_background.png') no-repeat
            background-size 100%
            border fitPx(1px) solid transparent
            border-radius fitPx(80px)
            &.tendency {
                right fitPx(20px)
            }
            .reset_btn_pointer_area {
                position relative
                background-color rgba(255,255,255,.2)
                base(100%,100%)
                border-radius 50%
                .pointer{
                    base(95%, fitPx(10px))
                    background url('~@/image/reset_btn_pointer.png') no-repeat
                    position absolute
                    background-size 100% 100%
                    // top calc(50% - fitPx(10px) / 2)
                    calcM(top, 50%, fitPx(10px) / 2)
                    left calc(50% - 47.5%)
                    // transform rotate(-90deg)
                    transform-origin center
                }
            }
        }
        .panel_common{
            $animaTime = 3s;
            width 430px
            calcM(height, 100%, fitPx(40px)) 
            position absolute
            // top $headerH
            top fitPx(20px)
            z-index 2
            trans(all, $animaTime)
            &.left_panel{
                left fitPx(20px)
                &.animation {
                    transform translateX(fitPx(-430px) * 2)
                }
            }
            &.right_panel{
                right fitPx(20px)
                &.animation {
                    transform translateX(fitPx(430px) * 2)
                }
                #sensorTendencyCharts {
                    base(25%)
                    flex .25
                    transfS(0,0)
                }
            }
            &.initial.animation {
                // &.left_panel{
                //     animation removeTransformL $animaTime
                // }
                // &.right_panel{
                //     animation removeTransformR $animaTime
                // }
                // animation-fill-mode forwards !important
                transform initial
                
                // animation-delay 5s
                // animation-duration: 5s;
            }
            // @keyframes removeTransformL {
            //     from {transform: translateX(fitPx(-430px) * 2);}
            //     to {transform: translateX(0px);}
            // }
            // @keyframes removeTransformR {
            //     from {transform: translateX(fitPx(430px) * 2);}
            //     to {transform: initial;}
            // }
        }
        .tendenty_panel {
            .section_common{
                // display flex
                // flex-direction column
                .tendency_charts {
                    transfS(0,0)
                    base(25%)
                    flex-grow .25
                }
            }
        }
        .backBtn {
            // z-index 1
            white-space nowrap
            top fitPx(15px)
            position absolute
            left fitPx(20px) + $panelCommonWidth
            cursor pointer
        }

        .section_common{
            $commonMargin = fitPx(15px);
            
            base(100%)
            // calcDivision(height, $minHeight, fitPx(20px) * 4, 3)
            calcDivision(height, 100%, $commonMargin * 2, 3)
            
            padding fitPx(16px)
            // padding-top fitPx(20px)
            // background url('~@/image/section-small-st.png') no-repeat
            background-repeat round
            background-size 100% 100%
            // background-color rgba(23, 31, 32, .6)
            background-color rgba(5, 15, 36, .8)
            // border fitPx(1px) solid rgba($mainColor, 1)
            border 2px solid #59deee
            border-radius fitPx(4px)
            &.flex {
                display flex
                flex-direction column
                .content {
                    flex 1
                    display flex
                    flex-direction column
                }
            }
            &.semi_width {
                calcM(width, 50%, $commonMargin / 2)
            }
            &.marginR {
                margin-right $commonMargin
            }


            &.half_st{
                calcDivision(height, $minHeight, $commonMargin * 3, 2)
            }
            &.half_bt{
                calcDivision(height, $minHeight, $commonMargin * 3, 2)
            }
            &.middle_st{
                // calcDivision(height, 100%, $commonMargin, 3 / 2)
                calcDivisionP(height, 100%, $commonMargin * 2, 3 / 2, $commonMargin)
            }
            &.small_bt{
            }
            &.big_st {
                // calcDivision(height, $minHeight, $commonMargin * 2, 1)
                height 100%
            }
            &:not(:last-child){
                margin-bottom $commonMargin
            }
            >>> .title{
                base(100%) 
                // text-align center
                font-size fitPx(18px)
                margin-bottom fitPx(15px)
                // font-weight bold
                // color rgba(1,255,255,1)
                position relative !important
                left 0px !important
                top 0px !important
                padding-left fitPx(15px)
                &:before {
                    content ''
                    position absolute
                    left fitPx(0px)
                    top 50%
                    transform translateY(-50%)
                    base(fitPx(9px), 80%)
                    // background-color rgba($mainColor,1)
                    background-color #0ff
                    border-radius 8px
                }
            }
            &.stat{
                display flex
                flex-direction column
                .outline{
                    clf()
                    padding-bottom fitPx(2px)
                    margin-bottom fitPx(10px)
                    border-bottom fitPx(1px) solid rgba($mainColor, .2)
                    // padding-bottom fitPx(10px)
                    .total_item {
                        p{
                            margin-bottom fitPx(10px)
                        }
                        .numArea {
                            clf();
                            color rgba($mainColor,1)
                            // font-weight bold
                            position relative
                            margin-bottom fitPx(5px)
                            .unit{
                                position absolute
                                bottom fitPx(0px)
                                font-size fitPx(20px)
                                color inherit
                                display inline-block
                                .child {
                                    color inherit
                                }
                            }
                            .num_item{
                                font-size fitPx(42px)
                                color inherit
                                text-align center
                                position relative
                                >span {
                                    position relative
                                    z-index 1
                                    color inherit
                                }
                                &:not(.dot) {
                                    margin-right fitPx(5px)
                                    &:after, &:before {
                                        position absolute
                                        left 0
                                        content ''
                                        base(100%)
                                        calcM(height, 50%, @margin-right / 2)
                                        background rgba(27, 39, 53, 1)
                                        z-index 0
                                    }
                                    &:before {
                                        top 0
                                    }
                                    &:after {
                                        bottom 0
                                    }
                                    base(fitPx(33px),fitPx(58px),fitPx(58px))
                                    background-size 100% 100%
                                    // background url('~@/image/num-bg.png') round
                                }
                                &.dot {
                                    margin-left -fitPx(5px)
                                }
                            }
                        }
                    }
                    
                }
                .river_lake{
                    flex-grow 1
                    align-items center
                    display flex
                    flex-direction row
                    margin-top fitPx(6px)
                    justify-content space-around
                    // padding-top fitPx(20px)
                    // clf()
                    #resourceTypeRatio{
                        height 120px
                        width 120px
                        // margin-left 47px
                        
                    }
                    .style_common{
                        position relative
                        &:first-child {
                            transfS(-50%, 50%)
                        }
                        &.info {
                            width fitPx(0px)
                        }
                        &.sortList {
                            width fitPx(220px)
                            .nameLabel {
                                display inline-block
                                width fitPx(100px)
                            }
                        }
                        // base(49%,100%)
                        // calcM(width, 50%, fitPx(2.5px))
                        // float left
                        // &:first-child{
                        //     margin-right fitPx(5px)
                        // }

                        .sub_title {
                            font-size fitPx(18px)
                            color rgba(166, 180, 209, 1)
                            font-weight bold
                            margin-bottom fitPx(10px)
                        }
                        p{
                            margin-bottom fitPx(5px)
                            white-space nowrap
                            >span{
                                &:not(:first-child) {
                                    font-weight bold
                                }
                            }
                        }
                    }
                    .statis_panel {
                        // position absolute
                        float left
                        top 0
                        trans()
                        opacity 0
                        // display none
                        // visibility hidden
                        &.show {
                            position absolute
                            opacity 1
                            // display block
                            // visibility visible
                        }
                    }
                }
                
            }
            &.itemList{
                .title{
                    font-size fitPx(20px)
                    // margin-bottom fitPx(20px)
                }
            }

            &.multi_data{
                display flex
                flex-direction column
                .content{
                    display flex
                    flex-direction row
                    justify-content space-evenly
                    flex-grow 1
                    width 100%
                    .multi_data_item{
                        display flex
                        flex-direction column
                        align-items center
                        justify-content center
                        .imgArea {
                            base(fitPx(77px), fitPx(82px), fitPx(82px))
                            text-align center
                            >img{
                                transfS()
                                // margin-bottom 15px
                                vertical-align middle
                            }
                        }
                        >div{
                            font-size fitPx(14px)
                            base(, fitPx(40px), fitPx(40px))
                            &:nth-of-type(2){
                                margin-bottom fitPx(10px)
                            }
                            &:last-child{
                                font-size fitPx(30px)
                                // font-weight bold
                            }
                        }
                    }
                }
            }
            &.video_area {
                display flex
                flex-direction column
                .video_content{
                    // height calc(100% - 38px - 15px);
                    // calcM(height, 100%, fitPx(38px) + fitPx(15px))
                    // transform scale(1, 4);
                    // transform-origin 0 0
                    width 100%
                    text-align center
                    .video_box{
                        base(25%, 25%)
                        transfS(0,0)
                    }
                }
            }

            &.netWorkAppeal {
                .title{
                    >span{
                        font-size fitPx(14px)
                        color inherit
                    }
                }
            }
            &.netWorkAppealTendency {
                .content {
                    #netWorkAppealTendencyCharts {
                        base(25%)
                        flex .25
                        transfS(0,0)
                    }
                }
            }
            &.internetMonitoring{
                .index_item{
                    width 50%
                    float left
                    clf()
                    .label {
                        color rgba(166, 180, 209, 1)
                    }
                    >div {
                        float left
                        &:first-child {
                            margin-right fitPx(10px)
                        }
                    }
                }
            }
            &.collapseCommon {
                display flex
                flex-direction column
                .data_list{
                    flex-grow 1
                    overflow-y scroll
                    overflow-x hidden
                }
                .index_area{
                    // display flex
                    padding fitPx(25px)
                    background-color rgba(0, 0, 0, .4)
                    clf()
                    .dataArea {
                        .section {
                            margin-bottom fitPx(20px)
                            .subtitle {
                                color rgba(1, 255, 255, 1)
                                font-size fitPx(16px)
                            }
                            .listarea {
                                clf()
                            }
                            .tendencyarea {
                                base(25%, fitPx(300px))
                                display flex
                                flex-direction column
                                .indexTendencyCharts {
                                    transfS(0,0)
                                    flex-grow .25
                                }
                            }

                        }
                    }
                }
            }
        }
        .style_common{
            // padding fitPx(20px)
            // background-color rgba(255, 255, 255, 0.8)
            // background-color #999999
        }

        .total_item {
            base(50%)
            // text-align center
        }
        .regionDensityOut{
            height 100%
            display flex
            flex-direction column
            // position absolute
            // right fitPx(20px)
            // top $headerH + fitPx(20px) + fitPx(60px)
        }
        .exponentChartsOut{
            // position absolute
            // top $headerH + fitPx(20px) + fitPx(60px)
            // // @extend $regionDensityOut
            // right fitPx(400px)
        }
    }
</style>
