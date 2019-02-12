<template>
    <div id="situation_statistics">
        <div class="panel_common left_panel" v-show="!showTendency">
            <div v-show="!detailPanelDisplay">
                <!-- 水资源概况 -->
                <div class="section_common style_common clearFloat stat">
                    <div class="title">水资源智能提取</div>
                    <div class="outline">
                        <div class="floatL total_item">
                            <div class="numArea">
                                <div class="floatL num_item" v-for="item in $tools.fitDigit(statisticsData.total_num, 4)" :key="item.id" v-text="item"></div>
                                <div class="floatL unit">个</div>
                            </div>
                            <p>水资源数量</p>
                        </div>
                        <div class="floatL total_item">
                            <div class="numArea">
                                <div class="floatL num_item" v-for="item in $tools.fitDigit($tools.convertArea(statisticsData.total_area, 0), 4)" :key="item.id" v-text="item"></div>
                                <div class="floatL unit"><span class="child">km</span><sup class="child">2</sup></div>
                            </div>
                            <p>水资源面积</p>
                        </div>
                    </div>
                    <div class="river_lake">
                        <div class="style_common">
                            <div id="resourceTypeRatio">

                            </div>
                        </div>
                        <div class="style_common">
                            <div v-show="currentRType=='湖泊'">
                                <div class="sub_title">湖泊</div>
                                <p><span>数量：</span><span v-text="statisticsData.lakes_num">6个</span></p>
                                <p><span>面积：</span><span v-text="$tools.convertArea(statisticsData.lakes_area)"></span><span> km</span><sup>2</sup></p>
                                <p><span>占比：</span><span v-text="$tools.convertRate((statisticsData.lakes_area)/(statisticsData.total_area), true)">0.00%</span></p>
                            </div>
                            <div v-show="currentRType=='江河'">
                                <div class="sub_title">江河</div>
                                <p><span>数量：</span><span v-text="statisticsData.rivers_num">6个</span></p>
                                <p><span>面积：</span><span v-text="$tools.convertArea(statisticsData.rivers_area)"></span><span> km</span><sup>2</sup></p>
                                <p><span>占比：</span><span v-text="$tools.convertRate((statisticsData.rivers_area)/(statisticsData.total_area), true)">0.00%</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 区域水资源指数排名TOP10 -->
                <!-- <barList class="section_common small_bt" :config="regionConfig" v-show="currentStatisticsView === 'total'" @itemClick="barClick"></barList> -->
                <div class="section_common small_st multi_data">
                    <div class="title">多源异构数据融合</div>
                    <div class="content">
                        <template v-for="item in multiDataModel.list">
                            <div class="multi_data_item" :key="item.label">
                                <div class="imgArea">
                                    <img :src="require(`@/image/${item.icon}.png`)" alt="">
                                </div>
                                <div v-text="item.label"></div>
                                <div v-text="item.icon=='web_internet' ? statisticsData.monitoringPoint_num + '个' : (item.icon=='governance_complaints' ? statisticsData.complaints_num + '条' : statisticsData.gisdata_num)"></div>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- 水资源列表-小 -->
                <!-- <div :class="['section_common','style_common','itemList', currentStatisticsView === 'county'?'middle_st':'']">
                    <g-table :options="waterResourceTableOptions"></g-table>
                </div> -->
                <div :class="['section_common','style_common','itemList']" v-show="currentStatisticsView === 'county'">
                    <g-table :options="waterResourceTableOptions"></g-table>
                </div>
                <!-- 数据处理流程 -->
                <div class="section_common style_common video_area" v-show="currentStatisticsView === 'total'">
                    <div class="title">
                        数据处理流程
                    </div>
                    <div class="video_content">
                        <video src="/river_video.mp4" class="video_box" controls="controls">此处有视频</video>
                        <!-- <div>此处有视频</div> -->
                    </div>
                </div>
            </div>
            <div v-show="detailPanelDisplay">
                <!-- 物联网监测数据分析 -->
                <div class="section_common style_common half_st internetMonitoring collapseCommon">
                    <div class="title">物联网监测数据分析</div>
                    <div class="data_list">
                        <el-collapse v-model="internetMonitoringModel.value" :accordion="true">
                            <template v-for="(item, index) in internetMonitoringModel.data">
                                <el-collapse-item :title="item.name" :name="index" :key="index">
                                    <template slot="title">
                                        <div class="prefix" v-text="item.name"></div>
                                        <div class="suffix" v-text="item.date"></div>
                                    </template>
                                    <div class="index_area">
                                        <template v-for="(i,ind) in item.indexs" class="">
                                            <div :key="ind" class="index_item">
                                                <div class="label" v-text="i.label"></div>
                                                <div class="value" v-text="i.value"></div>
                                            </div>
                                        </template>
                                    </div>
                                </el-collapse-item>
                            </template>
                        </el-collapse>
                    </div>
                </div>
                <!-- 网络理政诉求分析 -->
                <div class="section_common style_common half_bt netWorkAppeal collapseCommon">
                    <div class="title">网络理政诉求分析<span v-text='`(未处理${netWorkAppealModel.data.filter(i=>i[`诉求是否解决`].indexOf(`未`) != -1).length}件/全部${netWorkAppealModel.data.length}件)`'></span></div>
                    <div class="data_list">
                        <el-collapse v-model="netWorkAppealModel.value" :accordion="true">
                            <template v-for="(item, index) in netWorkAppealModel.data">
                                <el-collapse-item :title="item['来电内容']" :name="index" :key="index">
                                    <template slot="title">
                                        <div class="prefix" :title="item['来电内容']" v-text="item['来电内容']"></div>
                                        <div class="suffix"><span v-text="item['来电时间']"></span>&nbsp;&nbsp;&nbsp;<span :style="{'color': item['诉求是否解决'] == '未解决' ? 'red' : ''}" v-text="item['诉求是否解决']"></span></div>
                                    </template>
                                    <div class="index_area" v-text="item['来电内容']">
                                        
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
            <div class="section_common small_bt">
                <div class="title" v-text="'水质感官污染指数趋势变化'"></div>
                <div id="exponentTendencyCharts" class="tendency_charts"></div>
            </div>
            <div class="section_common small_st">
                <div class="title" v-text="'水污染面积趋势变化'"></div>
                <div id="areaTendencyCharts" class="tendency_charts"></div>
            </div>
            <div class="section_common small_st">
                <div class="title" v-text="'水污染数量趋势变化'"></div>
                <div id="countTendencyCharts" class="tendency_charts"></div>
            </div>
            
        </div>
        <div class="panel_common right_panel" v-show="!showTendency">
            <div v-show="!detailPanelDisplay">
                <!-- 水质感官污染指数 -->
                <exponentCharts class="exponentChartsOut section_common" :config="statisticsData"></exponentCharts>
                <!-- 污染类型智能识别分类 -->
                <pollutionStatistics class="section_common small_bt" :config="pollutionStatisticsConfig"></pollutionStatistics>
                <!-- 区县水质感官指数TOP10 -->
                <barList class="section_common small_bt" :config="regionExponentConfig" v-show="currentStatisticsView === 'total'" @itemClick="barClick"></barList>
                <!-- 水污染水质感官指数TOP10 -->
                <barList class="section_common small_bt" :config="specificExponentConfig" v-show="currentStatisticsView === 'county'" @itemClick="barClick"></barList>
            </div>
            <waterDetail v-show="detailPanelDisplay" class="detailPanel section_common big_st"></waterDetail>
        </div>
        <div class="reset_btn" @click="resetMap" :class="{'tendency':showTendency}" >
            <!-- 重置 -->
        </div>
    </div>
</template>

<script>

import exponentCharts from './exponentCharts.vue';

import regionDensity from "./regionWaterDensity.vue"
import pollutionStatistics from "./pollutionStatistics.vue"
import barList from "./barChartsList.vue"
import waterDetail from './statistics_detail.vue';
import gTable from "@/components/gTable.vue";

import echarts from 'echarts';

let _this,radarCharts,tendencyModel={};

export default {
    data () {
        return {
            pollutionStatisticsConfig:{data:{}},
            currentStatisticsView : "total",//'total','county'
            detailPanelDisplay : false,
            // 总资源类型占比当前类型
            currentRType:'江河',
            listData : [],
            waterResourceTableOptions:{
                url:'/getWaterResourceData',
                title:"水资源列表",
                maxHeight: 230,
                columns:[{
                        key:"name",
                        label:"名称",
                        // width:"82px",
                    },{
                        key:"type",
                        label:"类型",
                        width:"50px",
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
                        label:"区域",
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
                value:0,
                data:[]
            },
            netWorkAppealModel :{
                value:0,
                data:[]
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
                    // width:"82px"
                },{
                    key:"type",
                    label:"类型",
                    width:"50px"
                },{
                    key:"area",
                    label:"面积",
                    // width:"70px"
                },{
                    key:"owner",
                    label:"负责河长",
                    // width:"70px"
            }],
            regionConfig:{data:[],title:'区县水资源指数排名TOP10',type:'region'},
            regionExponentConfig:{data:[],title:'区县水质感官指数排名TOP10',type:'region'},
            specificExponentConfig:{data:[],title:'水质感官指数排名TOP10',type:'pollution'},
            statisticsData:{}
        }
    },
    props:["filter",'diaplyType'],
    computed:{
        showTendency(){
            if (!tendencyModel.exponentTendencyCharts) {
                this.$nextTick(()=>{
                    initTendencyCharts();
                });
            }
            return this.diaplyType == 'tendency';
        },
    },
    components : {
        regionDensity,
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
                }).slice(0,9).map(item => ({value:this.$tools.convertExponent(item.polution_score),id:item.id,label:item.name}));
            }
        },
        registEvent(){
            this.$root.$on('showDetail',(params)=>{
                this.detailPanelDisplay = params !== false;
                getMonitoringData();
                getComplaintsData();
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
        }
    },
    created(){
        _this = this;
        this.waterResourceTableOptions.maxHeight = 230;
        this.registEvent();
    },
    mounted(){
        radarCharts = initRadarCharts();
        
        refreshSortData();
        refreshIntroData();
        refreshPollutionStatistics();
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

async function getMonitoringData(){
    // internetMonitoringModel
    var monitoringResult = await _this.$http.get('/monitoringData?county=' + _this.$store.state.stastistics.detail.data.through.toString());
    if (monitoringResult.code == 0) {
        _this.internetMonitoringModel.data = monitoringResult.data;
    }
    
}

async function getComplaintsData(){
    var complaintsResult = await _this.$http.get('/complaints?county=' + _this.$store.state.stastistics.detail.data.through.toString());
    if (complaintsResult.code == 0) {
        _this.netWorkAppealModel.data = complaintsResult.data;
    }
    
}

function getRandomData(){
    var randomData = new Array(6);
    randomData = _.map(randomData, function(i,index){
        return {
            value:Math.floor(Math.random()*(100-60+1)+60),
            label:"2018."+(index+1),
            // name:_this.exponentLabel(_this.$tools.convertExponent(item.polution_score))
        }
    });
    return randomData;
}
function initTendencyCharts () {
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
                    color : 'rgba(0,80,115,1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: _.map(getRandomData(),(i)=>i.label),
            axisLabel:{
                color:"white",
                rotate:45
            },
            boundaryGap: false,
            splitLine:{
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(0,80,115,1)"
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
        series: [{
            data: getRandomData(),
            type: 'line',
            smooth: true,
            lineStyle : {
                color : `rgba(1,157,255,1)`
            },
            itemStyle : {
                color : `rgba(1,157,255,1)`
            }
        }],
        grid:{
            top:10,
            bottom:0,
            left:0,
            right:10,
            containLabel:true
        }
    }

    tendencyModel.exponentTendencyCharts = echarts.init(document.getElementById('exponentTendencyCharts'));
    tendencyModel.exponentTendencyCharts.setOption(_.cloneDeep(lineChartsOption));
    tendencyModel.areaTendencyCharts = echarts.init(document.getElementById('areaTendencyCharts'));
    tendencyModel.areaTendencyCharts.setOption(_.cloneDeep(lineChartsOption));
    tendencyModel.countTendencyCharts = echarts.init(document.getElementById('countTendencyCharts'));
    tendencyModel.countTendencyCharts.setOption(Object.assign(_.cloneDeep(lineChartsOption),{
        series : [{
            data: getRandomData(),
            type: 'bar',
            smooth: true,
            lineStyle : {
                color : `rgba(1,157,255,1)`
            },
            itemStyle : {
                color : `rgba(1,157,255,1)`,
                barBorderRadius : [10,10,0,0]
            },
            barWidth : 10
        }],
        xAxis: {
            type: 'category',
            data: _.map(getRandomData(),(i)=>i.label),
            axisLabel:{
                color:"white",
                rotate:45
            },
            splitLine:{
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:"rgba(0,80,115,1)"
                }
            }
        }
    }));
}

// 查询基础数据
async function refreshSortData(){
    
    var regionDataPro = _this.$http.get('/regionsData');
    let regionData = [];


    regionData = (await regionDataPro).data.map(item => item);

    _this.regionConfig.data  = regionData.sort(function(a,b){
        return b.water_index - a.water_index 
    }).slice(0,9).map(item => ({value:item.water_index,id:item.name,label:item.name}));

    _this.regionExponentConfig.data = regionData.sort(function(a,b){
        return b.water_quality - a.water_quality
    }).slice(0,9).map(item => ({id:item.name,label:item.name,value:_this.$tools.convertExponent(item.water_quality)}));

}

function initRadarCharts(){
    var originData = [
            // {value:335, name:'江河',selected:true},
            {value:335, name:'江河',itemStyle:{color:'rgba(111,240,154,1)'}},
            {value:30, name:'湖泊',itemStyle:{color:'rgba(1,157,255,1)'}},
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
        clearTimeout(timer);
        riverLakeLoop(params.name,true);
    });
    charts.on('mouseout', function(params){
        riverLakeLoop(_this.currentRType, true);
    });
    charts.on('globalout', function(params){
        riverLakeLoop(_this.currentRType);
    });
    function riverLakeLoop (current, once) {
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
    } else {
        for(let i in _this.filter){
            if (_this.filter[i] && _this.filter[i] != 'all') {
                filterArr.push(i+'='+_this.filter[i]);
            }
        }
        var filterStr = filterArr.length > 0 ? '?' + filterArr.join('&'):"";
        tempWaterUrl += filterStr;
        pollutionUrl += filterStr;
        refreshPollutionStatistics(filterStr);
        _this.countyPollutionTop10(pollutionUrl);
    }
    _this.waterResourceTableOptions.url = tempWaterUrl;
    
    // 区县change改变出发的事件
    if (_this.filter.region && nv.region != ov.region) {
        refreshIntroData(nv.region);
        if (_this.filter.region != 'all' ) {
            _this.currentStatisticsView = 'county';
        } else {
            _this.currentStatisticsView = 'total';
        }
    }
}

// 查询统计数据（水资源以及水污染）
async function refreshIntroData (county) {
    var statisticsDataPro = _this.$http.get('/introData'+ (county ? "?county=" + county : ''));
    _this.statisticsData = (await statisticsDataPro).data;

    let tempOption = {
        series:[{
            data:[
                {value:_this.statisticsData.rivers_area, name:'江河',itemStyle:{color:'rgba(111,240,154,1)'}},
                {value:_this.statisticsData.lakes_area, name:'湖泊',itemStyle:{color:'rgba(1,157,255,1)'}},
            ]
        }]
    };
    radarCharts.setOption(tempOption);
}

// 查询水污染统计
async function refreshPollutionStatistics (url) {
    let pollutionStatisticsUrl = '/pollutionStatistics' + (url ? url : '');
    // let result = await _this.$http.get('/pollutionStatistics'+ (county ? "?county=" + county : ''));
    let result = await _this.$http.get(pollutionStatisticsUrl);
    if (result.code == 0) {
        _this.pollutionStatisticsConfig.data = result.data;
    }
}
</script>
<style lang="stylus">
    @import "~@/common/common.styl"
    #situation_statistics {
        // 重置按钮
        .reset_btn {
            &.tendency {
                right 20px
            }
            trans()
            position absolute
            top $headerH + 80px
            right 20px + 430px + 20px
            cursor pointer
            z-index 1
            base(80px,80px)
            background url('~@/image/reset_btn.png')
            border 1px solid #019dff
            border-radius 80px
        }
        .panel_common{
            position absolute
            // top $headerH
            top 20px
            z-index 1
            &.left_panel{
                left 20px
            }
            &.right_panel{
                right 20px
            }
        }
        .tendenty_panel {
            .tendency_charts {
                base(390px,250px)
            }
        }
        .backBtn {
            // z-index 1
            white-space nowrap
            top 15px
            position absolute
            left 20px + 430px
            cursor pointer
        }

        .section_common{
            base(430px, 100%)
            calcDivision(height, $minHeight, 20px * 4, 3)
            padding 20px
            padding-top 20px
            // background url('~@/image/section-small-st.png') no-repeat
            background-repeat round
            background-size 100% 100%
            background-color rgba(23, 31, 32, .6)
            border 2px solid #019dff
            border-radius 4px
            &.half_st{
                // height calc(100% / 2 - 20px * 3)
                calcDivision(height, $minHeight, 20px * 3, 2)
                // background-image url('~@/image/section-half-st.png')
            }
            &.half_bt{
                // height calc(100% / 2 - 20px * 3)
                calcDivision(height, $minHeight, 20px * 3, 2)
                // background-image url('~@/image/section-half-bt.png')
            }
            &.middle_st{
                // height calc(100% / 3 * 2 - 20px * 3)
                calcDivision(height, $minHeight, 20px * 3, 2 / 3)
                // background-image url('~@/image/section-normal-st.png')
            }
            &.small_bt{
                // background-image url('~@/image/section-small-bt.png')
            }
            &.big_st {
                // height calc(100% - 20px * 2)
                calcDivision(height, $minHeight, 20px * 2, 1)
                // background-image url('~@/image/section-big-st.png')
            }
            &:not(:last-child){
                margin-bottom 15px
            }
            .title{
                base(100%) 
                // text-align center
                font-size 18px
                margin-bottom 15px
                // font-weight bold
                // color rgba(1,157,255,1)
                position relative
                padding-left 15px
                &:before {
                    content ''
                    position absolute
                    left 0px
                    top 50%
                    transform translateY(-50%)
                    base(4px, 80%)
                    background-color rgba(7,156,248,1)
                }
            }
            &.stat{
                .outline{
                    clf()
                    padding-bottom 10px
                    margin-bottom 10px
                    border-bottom 1px solid rgba(89, 222, 237,1)
                    // padding-bottom 10px
                    .total_item {
                        p{
                            margin-bottom 10px
                        }
                        .numArea {
                            clf();
                            color rgba(1,157,255,1)
                            // font-weight bold
                            position relative
                            margin-bottom 5px
                            .unit{
                                position absolute
                                bottom 0px
                                font-size 20px
                                color inherit
                                display inline-block
                                .child {
                                    color inherit
                                }
                            }
                            .num_item{
                                font-size 42px
                                color inherit
                                margin-right 5px
                                background url('~@/image/num-bg.png') round
                                background-size 100% 100%
                                base(33px,58px,58px)
                                text-align center
                                // display inline-block
                            }
                        }
                    }
                    
                }
                .river_lake{
                    padding-top 20px
                    clf()
                    #resourceTypeRatio{
                        height 120px
                        width 120px
                        margin-left 47px
                    }
                    .style_common{
                        base(49%,100%)
                        calcM(width, 50%, 2.5px)
                        // width '-webkit-calc(50% - %s)' % 2.5px
                        float left
                        &:first-child{
                            margin-right 5px
                        }

                        .sub_title {
                            font-size 18px
                            // text-align center
                            font-weight bold
                            margin-bottom 10px
                        }
                        p{
                            margin-bottom 5px
                            >span{
                                &:not(:first-child) {
                                    font-weight bold
                                }
                            }
                        }
                    }
                }
                
            }
            &.itemList{
                .title{
                    font-size 20px
                    // margin-bottom 20px
                }
            }

            &.multi_data{
                display flex
                flex-direction column
                .content{
                    display flex
                    flex-direction row
                    justify-content space-around
                    flex-grow 1
                    width 100%
                    .multi_data_item{
                        display flex
                        flex-direction column
                        align-items center
                        justify-content center
                        .imgArea {
                            base(77px, 82px, 82px)
                            text-align center
                            >img{
                                // margin-bottom 15px
                                vertical-align middle
                            }
                        }
                        >div{
                            font-size 14px
                            base(, 40px, 40px)
                            &:nth-of-type(2){
                                margin-bottom 10px
                            }
                            &:last-child{
                                font-size 30px
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
                    height calc(100% - 38px - 15px)
                    width 100%
                    text-align center
                    .video_box{
                        base(100%, 100%)
                    }
                }
            }

            &.netWorkAppeal {
                .title{
                    >span{
                        font-size 14px
                        color inherit
                    }
                }
            }
            &.internetMonitoring{
                .index_item{
                    width 50%
                    float left
                    clf()
                    >div {
                        float left
                        &:first-child {
                            margin-right 10px
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
                    padding 25px
                    background-color rgba(0, 0, 0, .4)
                    clf()
                }
            }
        }
        .style_common{
            // padding 20px
            // background-color rgba(255, 255, 255, 0.8)
            // background-color #999999
        }

        .total_item {
            base(50%)
            // text-align center
        }
        .regionDensityOut{
            // position absolute
            // right 20px
            // top $headerH + 20px + 60px
        }
        .exponentChartsOut{
            // position absolute
            // top $headerH + 20px + 60px
            // // @extend $regionDensityOut
            // right 400px
        }
    }
</style>
