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
                                <div class="floatL num_item" v-for="item in $tools.fitDigit(statisticsTotalData.sum.totalCount, 4)" :key="item.id"><span v-text="item"></span></div>
                                <div class="floatL unit">个</div>
                            </div>
                            <p>水资源数量</p>
                        </div>
                        <div class="floatL total_item">
                            <div class="numArea">
                                <div class="floatL num_item" :class="{'dot':item =='.'}" v-for="item in $tools.fitDigit($tools.convertArea(statisticsTotalData.sum.totalArea, true, 4), 4)" :key="item.id"><span v-text="item"></span></div>
                                <div class="floatL unit"><span class="child">{{statisticsTotalData.sum.totalArea > 1e4 ? `km` : 'm'}}</span><sup class="child">2</sup></div>
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
                                <p><span>数量：</span><span v-text="statisticsTotalData.lake.waterSum.totalCount">6个</span></p>
                                <p><span>面积：</span><span v-text="$tools.convertArea(statisticsTotalData.lake.waterSum.totalArea)"></span><span> km</span><sup>2</sup></p>
                                <p><span>占比：</span><span v-text="$tools.convertRate((statisticsTotalData.lake.waterSum.totalArea)/(statisticsTotalData.lake.waterSum.totalArea+statisticsTotalData.river.waterSum.totalArea), true)">0.00%</span></p>
                            </div>
                            <div :class="{statis_panel:true,show:currentRType=='江河'}">
                                <div class="sub_title">江河</div>
                                <p><span>数量：</span><span v-text="statisticsTotalData.river.waterSum.totalCount">6个</span></p>
                                <p><span>面积：</span><span v-text="$tools.convertArea(statisticsTotalData.river.waterSum.totalArea)"></span><span> km</span><sup>2</sup></p>
                                <p><span>占比：</span><span v-text="$tools.convertRate((statisticsTotalData.river.waterSum.totalArea)/(statisticsTotalData.lake.waterSum.totalArea+statisticsTotalData.river.waterSum.totalArea), true)">0.00%</span></p>
                            </div>
                        </div>
                        <div class="style_common sortList" v-if="$store.state.view.bigScreen">
                            <div class="sub_title" v-text="`面积排名前3的${currentStatisticsView == 'total' ? '区县' : '河流/湖泊'}`"></div>
                            <p v-for="(item, index) in (statisticsTotalData[currentRType=='江河'?'river':'lake'].areaTop3 && statisticsTotalData[currentRType=='江河'?'river':'lake'].areaTop3.length>0) ? statisticsTotalData[currentRType=='江河'?'river':'lake'].areaTop3 : []" :key="index">
                                <span v-text="`${index+1}.`"></span><span class="nameLabel" v-text="`${currentStatisticsView == 'total' ? item.region : item.name}`"></span><span v-text="$tools.convertArea(item.totalArea)"></span><span> km</span><sup>2</sup>
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
                                <div v-text="item.icon=='web_internet' ? monitoringModel.value + '个' : (item.icon=='governance_complaints' ? netWorkAppealModel.data.length + '条' : item.value + 'G')"></div>
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
                <exponentCharts class="exponentChartsOut section_common" :class="[$store.state.view.bigScreen?'semi_width floatL marginR':'']" :config="statisticsTotalData.pollutionIndex"></exponentCharts>
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
            <waterDetail v-show="detailPanelDisplay" :currentData="statisticsDetail" :display="detailPanelDisplay" class="detailPanel section_common big_st"></waterDetail>
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

import apis from "@/util/apis.js";

const {
    WATER_RESOURCE,
    WATER_POLLUTION,
    COMPLAINTS,
    MONITORINGSTATIONNUMBER,
    POLLUTION_INDEX_TREND,
    POLLUTION_INDEX,
    TOTAL_NUM,
    TOTAL_DETAIL,
    STATELLITEDATASIZE,
    POLLUTION_CLASSIFY,
    POLLUTION_INDEX_RANK,
    RICH_INDEX,
    COMPLAINTS_TREND,
    MONITORINGDATA
} = apis

import echarts from 'echarts';

let _this,radarCharts,tendencyModel={}, commonTendencyModel = {};

export default {
    data () {
        return {
            loaded: false,
            pollutionStatisticsConfig:{params:{},data:{}},
            currentStatisticsView : "total",//'total','county'
            detailPanelDisplay : false,
            // 总资源类型占比当前类型
            currentRType:'江河',
            listData : [],
            waterResourceTableOptions:{
                url:WATER_RESOURCE,
                params: {},
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
                        // formatter(row, column, cellValue, index){
                        //     return _this.$tools.renderCollection.waterType(cellValue);
                        // }
                    },{
                        key:"area",
                        label:"面积",
                        // width:"70px"
                        formatter(row, column, cellValue, index){
                            return _this.$tools.convertArea(cellValue);
                        }
                    },{
                        key:"regions",
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
                    // {label:'化学需氧量(COD)',value: Math.floor(15 + Math.random() * 26), colorRGB: '13,182,240', key:'CODCR'},
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
                    value:'203',
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
            },
            statisticsTotalData: {
                lake: {
                    waterSum: {
                        totalCount: 0,
                        totalArea: 0
                    },
                    areaTop3: []
                },
                river: {
                    waterSum: {
                        totalCount: 0,
                        totalArea: 0
                    },
                    areaTop3: []
                },
                sum: {
                    totalCount: 0,
                    totalArea: 0
                },
                pollutionIndex: {
                    pollution_area: 0,
                    water_quality: 0,
                    ratio: '0.00'
                },
                trendData: []
            },
            statisticsDetail: {}
        }
    },
    props:["filter",'diaplyType'],
    computed:{
        showTendency(){
            if (this.diaplyType == 'tendency') {
                this.$nextTick(()=>{
                    refreshTendencyCharts();
                });
            }
            this.$nextTick(()=>{
                resizeCharts();
            });
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
        async countyPollutionTop10 (params) {
            _this.specificExponentConfig.data = [];
             // 水污染水质感官指数TOP10
            let res = await _this.$http.get(POLLUTION_INDEX_RANK, params);
            // console.log(res);
            if (res) {
                let pollutionType = {
                    '黑臭水体': 'heichou',
                    '泥沙污染': 'nisha',
                    '水体富营养': 'lvzao'
                }
                _this.specificExponentConfig.data = res.data.slice(0, _this.$store.state.view.bigScreen ? res.data.length : 10).map(item => ({
                        value:item.pollutionIndex ? item.pollutionIndex: 0,
                        id:item.id,
                        label:item.name,
                        type:item.pollution_type ? pollutionType[item.pollution_type] : '',
                        loca:item.position ? item.position : ''
                    })
                );
            }
        },
        registEvent(){
            this.$root.$on('showDetail',(params)=>{
                this.detailPanelDisplay = params !== false;
                // this.getStatisticsDetailData('9293');
                if(this.detailPanelDisplay){
                    this.getStatisticsDetailData(params);
                    // let coordinate = [];
                    // params.coordinate[0].forEach((itema, indexa) => {
                    //     coordinate.push([Number(10+''+itema[0]), Number('3'+''+itema[1])]);
                    // })
                    getMonitoringData(params.coordinate[0]);
                }
                
            })

            this.$root.$on('mapPitchRotate', (params)=>{
                this.resetModel.bearing = params.bearing;
                this.resetModel.pitch = params.pitch;
                
            })
        },
        async getStatisticsDetailData(params){
            let res = await this.$http.get(WATER_POLLUTION + '/' + params.id, {
                month: this.filter.month,
                pType: params.pollution_type,
                position: params.position
            });
            if(res){
                // console.log(res);
                this.statisticsDetail = res.data;
            }
        },
        backToLastView(){
            if (this.detailPanelDisplay) {
                this.detailPanelDisplay = false;
                this.$root.$emit('showDetail', false)
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
        // getCommonParams();
        // refreshSortData();
        // refreshPollutionStatistics({});
        
    },
    mounted(){
        // console.timeEnd('a')
        setTimeout(()=>{
            radarCharts = initRadarCharts();
            // refreshIntroData();
            // getRegionChangeDatas();
            // getComplaintsData();
            this.detailPanelDisplay = false;
            // this.getStatisticsDetailData('9293')
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
                getCommonParams();
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
        if(i == 'internetMonitCharts'){
            if(_this.diaplyType != 'tendency'){
                for(let j in tendencyModel[i]){
                    tendencyModel[i][j].resize();
                }
            }
        } else {
            if(_this.diaplyType == 'tendency'){
                tendencyModel[i].resize();
            }
        }
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
            },
            textStyle : {
                fontSize : 18
            },
            padding: [10]
        },
        xAxis: {
            type: 'category',
            data: _.map(data.tendencies,(i)=>`${i.year}年${i.month>9?i.month:0+''+i.month}月`),
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
    var monitoringResult = await _this.$http.post(MONITORINGDATA + '?month=' + _this.filter.month, {coordinates});
    // county=' + _this.$store.state.stastistics.detail.data.through.toString())
    if (monitoringResult&&monitoringResult.status.code == 0) {
        _this.internetMonitoringModel.value = 0;
        _this.internetMonitoringModel.data = monitoringResult.data;
        tendencyModel.internetMonitCharts = {};
        _this.$nextTick(function () {
            monitoringResult.data.forEach((item, index) => {
                refreshMonitorCharts(item, index);
            });
            resizeCharts();
        });
    }
    
}

async function getComplaintsData(){
    let complaintsparams = {},
        monitoringparams = {},
        xData = [],
        data = [];
    if (_this.filter.region && _this.filter.region !== 'all') {
        complaintsparams.fmAreaName = _this.filter.region;
        monitoringparams.regionName = _this.filter.region;
    }
    complaintsparams.month = _this.filter.month;
    var complaintsResult = await _this.$http.get(COMPLAINTS, complaintsparams);
    if (complaintsResult.status.code == 0) {
        _this.netWorkAppealModel.data = complaintsResult.data.content;
        if (complaintsparams.fmAreaName) {
            // refresCommonTendencyCharts('netWorkAppealTendencyCharts', getRandomData({alldata:complaintsResult.data.content, lastValue:complaintsResult.data.content.length, max:30,min:5}),'理政诉求数量');
            let trendData = await _this.$http.get(COMPLAINTS_TREND, {
                district: _this.filter.region ? ( _this.filter.region == 'all' ? '成都市' : _this.filter.region ) : '成都市',
                month: _this.filter.month
            })
            
            if(trendData.status.code == 0) {
                trendData.data.trend.forEach(item => {
                    xData.push(item.year + '年' + item.month + '月');
                    data.push(item.num)
                })
                refresCommonTendencyCharts('netWorkAppealTendencyCharts', xData, data,'理政诉求数量');
            }
        }
    }

    
    

    var monitoringNumberResult = await _this.$http.get(MONITORINGSTATIONNUMBER, monitoringparams);
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

function refresCommonTendencyCharts(id,xData,data,seriesName) {
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
            data: xData,
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

async function refreshTendencyCharts () {
    let region = _this.filter.region == 'all' ? '' : _this.filter.region;
    let xData = [],
        exponentTendency = [],
        seriesIndex = [],
        seriesArea = [],
        seriesNum = [];

    let [indexData, areaData, numData] = await Promise.all([
        _this.$http.get(POLLUTION_INDEX_TREND, {
            district: region,
            type: 'index',
            month: _this.filter.month
        }),
        _this.$http.get(POLLUTION_INDEX_TREND, {
            district: region,
            type: 'area',
            month: _this.filter.month
        }),
        _this.$http.get(POLLUTION_INDEX_TREND, {
            district: region,
            type: 'num',
            month: _this.filter.month
        })
    ])
    
    if(indexData){
        indexData.data.forEach(item => {
            xData.push(item.year + '年' + item.month + '月');
            seriesIndex.push(item.index);
            exponentTendency.push({
                year: item.year,
                month: item.month,
                value: item.index,
                toolTip: [{
                    label: '污染指数',
                    value: item.index
                }],
                label: item.year + '年' + item.month + '月'
            })
        })
    }
    if(areaData){
        areaData.data.forEach(item => {
            seriesArea.push(item.area)
        })
    }
    if(numData){
        numData.data.forEach(item => {
            seriesNum.push(item.num)
        })
    }
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
            data: xData,
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
    // exponentTendency = getRandomData({lastValue:(_this.$tools.convertExponent(_this.statisticsData.water_quality))});
    _this.$store.commit('refreshTendencyData', {type:'exponent',value: exponentTendency});
    // console.log(exponentTendency)
    tendencyModel.exponentTendencyCharts.setOption({
        xAxis: {
            type: 'category',
            data: xData,
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
        xAxis: {
            type: 'category',
            data: xData,
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
        series : [{
            data: seriesArea,
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
                data: xData,
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
        xAxis: {
            type: 'category',
            data: xData,
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
        series : [{
            data: seriesNum,
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
    // var regionDataPro = _this.$http.get('/regionsData');

    // let regionData = [];
    // let regionDataProR = await regionDataPro;
    
    // if (regionDataProR) {
    //     regionData = regionDataProR.data.map(item => item);
    // }

    // _this.regionConfig.data  = regionData.sort(function(a,b){
    //     return b.water_index - a.water_index 
    // }).slice(0,10).map(item => ({value:_this.$tools.convertExponent(item.water_index),id:item.name,label:item.name}));

    // _this.regionExponentConfig.data = regionData.sort(function(a,b){
    //     return b.water_quality - a.water_quality
    // }).slice(0, _this.$store.state.view.bigScreen ? regionData.length : 10).map(item => ({id:item.name,label:item.name,value:_this.$tools.convertExponent(item.water_quality)}));

    // 区县水资源丰富指数
    // let res = await _this.$http.get('RICH_INDEX')
    // if(res){
    //     _this.regionConfig.data = res.data.map(item => ({value:item.richIndex,id:item.district,label:item.district}));
    // }
    let region = _this.filter.region == 'all' ? '' : _this.filter.region;
    
    let params = {
        district: region,
        month: _this.filter.month
    };

    
    let [res, resa] = await Promise.all([
        _this.$http.get(RICH_INDEX, params),
        _this.$http.get(POLLUTION_INDEX_RANK, params)
    ])
    if (res) {
        _this.regionConfig.data = res.data.map(item => ({value:item.richIndex,id:item.district,label:item.district}));
    }
    if (resa) {
        _this.regionExponentConfig.data = resa.data.map(item => ({id:item.district,label:item.district,value:item.pollutionIndex}));
    }
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




// function refreshData (nv, ov) {
//     var tempWaterUrl = '/getWaterResourceData',
//         pollutionUrl = '/getPollutionData',
//         filterArr = [];
//     _this.detailPanelDisplay = false;
    
//     if (_this.filter.id) {
//         // tempWaterUrl += "?id=" + _this.filter.id;
//         let params = {
//             waterId: _this.filter.id
//         }
//         refreshPollutionStatistics(params);
//     } else {
//         let params = {};

//         let promiseArr = [];
//         for(let i in _this.filter){
//             // if (_this.filter[i] && _this.filter[i] != 'all') {
//             //     filterArr.push(i+'='+_this.filter[i]);
//             // }
//             params[i] = _this.filter[i]
//         }
//         // var filterStr = filterArr.length > 0 ? '?' + filterArr.join('&'):"";
//         // tempWaterUrl += filterStr;
//         // pollutionUrl += filterStr;
//         // promiseArr.push(refreshPollutionStatistics(filterStr));
//         // _this.countyPollutionTop10(pollutionUrl);

//         // _this.waterResourceTableOptions.url = tempWaterUrl;
//         refreshPollutionStatistics(params);
//         _this.waterResourceTableOptions.params = params;
        
//         // 区县change改变出发的事件
//         if (_this.filter.region && nv.region != ov.region) {
//             // promiseArr.push(refreshIntroData(nv.region));
//             getRegionChangeDatas(nv.region);
//             getComplaintsData();
//             if (_this.filter.region != 'all' ) {
//                 _this.currentStatisticsView = 'county';
//                 _this.waterResourceTableOptions.columns = [{
//                             key:"name",
//                             label:"名称",
//                             // width:"82px",
//                         },{
//                             key:"type",
//                             label:"类型",
//                             // width:"50px",
//                             formatter(row, column, cellValue, index){
//                                 return _this.$tools.renderCollection.waterType(cellValue);
//                             }
//                         },{
//                             key:"area",
//                             label:"面积",
//                             // width:"70px"
//                             formatter(row, column, cellValue, index){
//                                 return _this.$tools.convertArea(cellValue);
//                             }
//                         }]
//             } else {
//                 _this.waterResourceTableOptions.columns = [{
//                             key:"name",
//                             label:"名称",
//                             // width:"82px",
//                         },{
//                             key:"type",
//                             label:"类型",
//                             // width:"50px",
//                             formatter(row, column, cellValue, index){
//                                 return _this.$tools.renderCollection.waterType(cellValue);
//                             }
//                         },{
//                             key:"area",
//                             label:"面积",
//                             // width:"70px"
//                             formatter(row, column, cellValue, index){
//                                 return _this.$tools.convertArea(cellValue);
//                             }
//                         },{
//                         key:"region",
//                         label:"流经区域",
//                         formatter(row, column, cellValue, index){
//                             return cellValue ? cellValue.toString() : "--";
//                         }}]
//                         // width:"70px"
//                 _this.currentStatisticsView = 'total';
//             }
            
//         }
//         Promise.all(promiseArr).then(()=>{
//             if (_this.showTendency) {
//                 refreshTendencyCharts();
//             }
//         });
//     }
    
// }

function getCommonParams(){
    let params = {};
    for(let i in _this.filter){
        // if(i != 'id'){
        if(_this.filter[i] == 'all'){
            if(i == 'region'){
                params.district = ""
            } else {
                params[i] = '';
            }
        } else {
            if(i == 'pType'){
                params[i] = _this.filter[i].join(',');
            } else {
                if(i == 'region'){
                    params.district = _this.filter[i];
                } else {
                    params[i] = _this.filter[i];
                }
            }
        }
        // }
        
    }
    _this.commonParams = params;
}
function refreshData (nv, ov) {
    _this.detailPanelDisplay = false;
    let promiseArr = [];
    if (_this.filter.id) {
        let params = {
            id: _this.filter.id,
            month: _this.filter.month
        }
        refreshPollutionStatistics(params);
    } else {
        promiseArr.push(refreshPollutionStatistics(_this.commonParams));
        _this.countyPollutionTop10(_this.commonParams);
        _this.waterResourceTableOptions.url = WATER_RESOURCE;
        _this.waterResourceTableOptions.params = _this.commonParams;
    }

    // 区县change改变出发的事件
    if ((_this.filter.region && nv.region != ov.region) || (_this.filter.month && nv.month != ov.month)) {
        // promiseArr.push(refreshIntroData(nv.region));
        setTimeout(() => {
            getRegionChangeDatas(nv.region);
            getComplaintsData();
            refreshSortData();
        }, 30)
        
        
        if (_this.filter.region != 'all' && _this.filter.region != '') {
            _this.currentStatisticsView = 'county';
            _this.waterResourceTableOptions.columns = [{
                        key:"name",
                        label:"名称",
                        // width:"82px",
                    },{
                        key:"type",
                        label:"类型",
                        // width:"50px",
                        // formatter(row, column, cellValue, index){
                        //     return _this.$tools.renderCollection.waterType(cellValue);
                        // }
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
                        // formatter(row, column, cellValue, index){
                        //     return _this.$tools.renderCollection.waterType(cellValue);
                        // }
                    },{
                        key:"area",
                        label:"面积",
                        // width:"70px"
                        formatter(row, column, cellValue, index){
                            return _this.$tools.convertArea(cellValue);
                        }
                    },{
                    key:"regions",
                    label:"流经区域",
                    formatter(row, column, cellValue, index){
                        return cellValue ? cellValue.toString() : "--";
                    }}]
                    // width:"70px"
            _this.currentStatisticsView = 'total';
        }
        
    } else {
        Promise.all(promiseArr).then(()=>{
            if (_this.showTendency) {
                refreshTendencyCharts();
            }
        });
    }
    
}

// 查询统计数据（水资源以及水污染）
// async function refreshIntroData (county) {
//     return new Promise(async (resolve, reject)=> {
//         var statisticsDataPro = _this.$http.get('/introData'+ (county ? "?county=" + county : ''));
//         let statisticsDataProR = await statisticsDataPro;
//         if (statisticsDataProR) {
//             _this.statisticsData = statisticsDataProR.data;
//         } else {
//             return;
//         }

//         let tempOption = {
//             series:[{
//                 data:[
//                     {value:_this.statisticsData.rivers_area, name:'江河',itemStyle:{color:'rgba(110, 238, 151,1)'}},
//                     {value:_this.statisticsData.lakes_area, name:'湖泊',itemStyle:{color:'rgba(1, 255, 255,1)'}},
//                 ]
//             }]
//         };
//         radarCharts.setOption(tempOption);
//         refresCommonTendencyCharts('sensorTendencyCharts', getRandomData({lastValue:(_this.$tools.convertExponent(_this.statisticsData.water_quality))}), '污染指数');
//         resolve();
//     });
// }

async function getRegionChangeDatas(country){
    let params = {};
    let paramTrend = {}
    if(country){
        if(country == 'all'){
            params.district = "";
            paramTrend.district = "";
        }else{
            params.district = country;
            paramTrend.district = country;
        }
    }
    paramTrend.type = 'index';
    params.month = _this.filter.month;
    paramTrend.month = _this.filter.month;
    let [totalDetail, totalNum, pollutionIndex, pollutionTrend, satelliteDataSize] = await Promise.all([
        _this.$http.get(TOTAL_DETAIL, params),
        _this.$http.get(TOTAL_NUM, params),
        _this.$http.get(POLLUTION_INDEX, params),
        _this.$http.get(POLLUTION_INDEX_TREND, paramTrend),
        _this.$http.get(STATELLITEDATASIZE, {
            regionName: country == 'all' ? '成都市' : country
        })
    ])
    // 水资源智能提取
    if(totalDetail){
        _this.statisticsTotalData.lake = totalDetail.data.lake;
        _this.statisticsTotalData.river = totalDetail.data.river;
        if(!totalDetail.data.lake.waterSum){
            _this.statisticsTotalData.lake.waterSum = {
                totalArea: 0,
                totalCount: 0
            }
        }
        if(!totalDetail.data.river.waterSum){
            _this.statisticsTotalData.river.waterSum = {
                totalArea: 0,
                totalCount: 0
            }
        }
        let tempOption = {
            series:[{
                data:[
                    {value:_this.statisticsTotalData.river.waterSum.totalArea, name:'江河',itemStyle:{color:'rgba(110, 238, 151,1)'}},
                    {value:_this.statisticsTotalData.lake.waterSum.totalArea, name:'湖泊',itemStyle:{color:'rgba(1, 255, 255,1)'}},
                ]
            }]
        };
        // _this.$nextTick(()=>{
            // if(!radarCharts){
            //     radarCharts = initRadarCharts();
            // }
            radarCharts.setOption(tempOption);
            
        // })
        
    }
    // 水资源智能提取总数
    if(totalNum){
        _this.statisticsTotalData.sum = totalNum.data;
    }
    // 水质感官污染指数
    if(pollutionIndex){
        _this.statisticsTotalData.pollutionIndex = pollutionIndex.data;
        _this.statisticsTotalData.pollutionIndex.ratio = _this.statisticsTotalData.pollutionIndex.ratio.replace('%', '');
    }
    if(pollutionTrend){
        // let res =
        let xData = [];
        let data = [];
        pollutionTrend.data.forEach(item => {
            xData.push(item.year + '年' + item.month + '月');
            data.push(item.index)
        })
        // 水质感官污染指数趋势
        refresCommonTendencyCharts('sensorTendencyCharts', xData, data, '污染指数');
    }
    if (_this.showTendency) {
        refreshTendencyCharts();
    }
    // 
    if(satelliteDataSize){
        _this.multiDataModel.list[0].value = satelliteDataSize.data;
    }
}

// 查询水污染统计
async function refreshPollutionStatistics (params) {
    return new Promise(async (resolve, reject)=>{
        // let pollutionStatisticsUrl = '/pollutionStatistics' + (url ? url : '');
        // // let result = await _this.$http.get('/pollutionStatistics'+ (county ? "?county=" + county : ''));
        // let result = await _this.$http.get(pollutionStatisticsUrl);
        // if (result && result.code == 0) {
        //     _this.pollutionStatisticsConfig.data = result.data;
        // }
        let res = await _this.$http.get(POLLUTION_CLASSIFY, params);
        if (res && res.data) {
            _this.pollutionStatisticsConfig.data = res.data;
            _this.pollutionStatisticsConfig.params = params;
        } else {
            _this.pollutionStatisticsConfig.data = {
                heichou: {
                    area: 0,
                    num: 0,
                    ratio: "0.00%"
                },
                lvzao: {
                    area: 0,
                    num: 0,
                    ratio: "0.00%"
                },
                nisha: {
                    area: 0,
                    num: 0,
                    ratio: "0.00%"
                }
            }
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
