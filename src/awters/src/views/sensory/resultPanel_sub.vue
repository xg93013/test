<template>
    <div>
        <div id="result_panel">
            <div class="section_common style_common clearFloat stat">
                <div class="title">水污染分析</div>
                <div class="outline">
                    <div class="floatL total_item">
                        <p>污染面积</p>
                        <p><span class="num" v-text="convertArea(resultData.pArea || 0)"></span><span>km</span><sup>2</sup></p>
                    </div>
                    <div class="floatL total_item">
                        <p>占比</p>
                        <p><span class="num" v-text="convertRate(resultData.pRate || 0)"></span></p>
                    </div>
                </div>
                <div class="pollutionTypes">
                    <div class="style_common">
                        <div class="title">黑臭水体</div>
                        <!-- <p><span>数量：</span><span>6个</span></p> -->
                        <p><span>数量：</span><span v-text="resultData.hcNumber"></span></p>
                        <p><span>面积：</span><span v-html="convertArea(resultData.hcArea,true)"></span></p>
                        <p><span>占比：</span><span v-text="convertRate(resultData.hcArea/(resultData.pArea))"></span></p>
                    </div>
                    <div class="style_common">
                        <div class="title">藻类污染</div>
                        <!-- <p><span>数量：</span><span>6个</span></p> -->
                        <p><span>数量：</span><span v-text="resultData.zlNumber"></span></p>
                        <p><span>面积：</span><span v-html="convertArea(resultData.zlArea,true)"></span></p>
                        <p><span>占比：</span><span v-text="convertRate(resultData.zlArea/(resultData.pArea))"></span></p>
                    </div>
                    <div class="style_common">
                        <div class="title">泥沙污染</div>
                        <!-- <p><span>数量：</span><span>6个</span></p> -->
                        <p><span>数量：</span><span v-text="resultData.nsNumber"></span></p>
                        <p><span>面积：</span><span v-html="convertArea(resultData.nsArea,true)"></span></p>
                        <p><span>占比：</span><span v-text="convertRate(resultData.nsArea/(resultData.pArea))"></span></p>
                    </div>
                </div>
            </div>
            <div class="section_common style_common list">
                <div class="title">水质感官指数排名</div>
                <el-popover placement="bottom" content="没有更多内容了" trigger="manual" ref="noTip" :visible-arrow="false">
                </el-popover>
                <div class="tableCommon">
                    <el-table :data="listData" style="width: 100%" :max-height="410" :stripe="false" ref="pollutionTable" v-loading="riverTableloading" v-popover:noTip
                    @row-click="rowClick" :row-style="{cursor:'pointer'}" :highlight-current-row="true">
                        <template v-for="item in columnsList">
                            <el-table-column :show-overflow-tooltip="true" :key="item.id" :prop="item.key" :label="item.label" :width="item.width" :render-header="headerRender"></el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="detail_float"  v-show="detailDisplay">
            <div class="detail_area">
                <h3>污染详情<div class="closeDetailBtn" @click="detailClose">关闭</div></h3>
                <div class="content" v-loading="pollutionDetailloading">

                    <div v-text="selectedPollution.name"></div>
                    <div><span>水系名称：</span><span v-text="selectedPollution.system"></span></div>
                    <div><span>水资源类型：</span><span v-text="selectedPollution.type"></span></div>
                    <div><span>河长：</span><span v-text="selectedPollution.owner"></span></div>
                    <div class="borderBottom"><span>区域：</span><span v-text="selectedPollution.district"></span></div>
                    <!-- <div class="borderBottom"><span>区域：</span><span></span></div> -->
                    <div :class="exponentLevel(selectedPollution.exponent)"><span>水质感官指数：</span><span v-text="selectedPollution.exponent"></span></div>
                    <div><span>污染类型：</span><span v-text="pTypeDisplay"></span></div>
                    <div class="borderBottom"><span>污染面积：</span><span v-text="selectedPollution.pArea"></span><span> m</span><sup>2</sup></div>
                    <div class="radarArea">
                        <div class="pollutionIndicators">
                            <template v-for="item in pollutionIndicators">
                                <div class="item" v-text="item.name" :key="item.name" @mousemove="radarLabelMousemove(item.name)" @mouseout="radarLabelMouseout"></div>
                            </template>
                        </div>
                        <div id="pollutionSensor"></div>
                        <div ref="pollutionTip" :class="['pollutionTip',pollutionTipVis?'show':'hide']">
                            <div><span>水温：</span><span>23.8℃</span></div>
                            <div><span>PH值：</span><span>8.46</span></div>
                            <div><span>溶解氧：</span><span>9.3</span></div>
                            <div><span>高锰酸盐：</span><span>4.4</span></div>
                            <div><span>氨氮：</span><span>0.25</span></div>
                            <div><span>总磷：</span><span>0.04</span></div>
                        </div>
                    </div>
                    <div class="tendencyChartsArea">
                        <div class="head">
                            <span>趋势变化</span>
                            <span class="detailBtn" @click="showTendencyDetail">查看详情<i class="arrow el-icon-arrow-right"></i></span>
                        </div>
                        <div id="tendencyCharts"></div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="selectedPollution.name+'污染水体变化趋势'" :visible.sync="tendencyDetailDisplay" width="1500px" :close-on-click-modal="false" custom-class="tendency_dialog" top="0">
            <tendencyMinMap :config="tendencyMapConfig" class="tendencyMinMap" :map-show="tendencyDetailDisplay"></tendencyMinMap>
            <span lot="footer" class="dialog-footer">
                <!-- <el-button @click="tendencyDetailDisplay = false">取 消</el-button>
                <el-button type="primary" @click="tendencyDetailDisplay = false">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import riverDataO from '@/data/data.js';
import statisticsData from '@/data/json_result.json';
import echarts from 'echarts';
import tendencyMinMap from './tendency_map_3d_4_dialog.vue';
var vm;

// var riverData = _.sortBy(_.clone(riverDataO), function(item){
//     return -(item.area*1);
// })

var riverData1 = _.cloneDeep(riverDataO),
    filteredRiverData,
    vm,
    pollutionRadarCharts,
    tendencyCharts;
var pollutionList = ["lak_960","lak_363","lak_792","lak_215","lak_201","lak_605","riv_361"];
var riverData = _.sortBy(_.filter(_.clone(riverData1), function(item, index){
            return item.pType.length > 0 && _.indexOf(pollutionList, item.id) != -1;
        }), function(item){
    return -(item.exponent*1);
})

var opacity = '1',selectedOpacity = '.5';
var colors = {
    hc:`rgba(25,23,43,${opacity})`,
    hc_s:`rgba(25,23,43,${selectedOpacity})`,
    ns:`rgba(154,97,74,${opacity})`,
    ns_s:`rgba(154,97,74,${selectedOpacity})`,
    zl:`rgba(67,226,100,${opacity})`,
    zl_s:`rgba(67,226,100,${selectedOpacity})`,
},vm;

export default {
    data () {
        return {
            tendencyMapConfig:{
                colors,
                list:{},
                data:[],
                other:[]
            },
            // 趋势详情是否展示
            tendencyDetailDisplay:false,
            pollutionTipVis:false,
            listData : [],
            pagination : {
                current : 0,
                total:0,
                size:20
            },
            resultData:{},
            riverTableloading:false,
            columnsList:[{
                    key:"name",
                    label:"名称",
                    // width:"82px"
                },
                {
                    key:"type",
                    label:"类型",
                    // width:"72px"
                },
                {
                    key:"area",
                    label:"污染面积",
                    // width:"57px"
                },
                {
                    key:"exponent", 
                    label:"感官指数",
                    // width:"50px"
                }],
            statisticsData,
            filter:{},
            detailDisplay:false,
            pollutionDetailloading:false,
            selectedPollution:{},
            pollutionIndicators:[
                { name: '黑臭水体污染指数', max: 100},
                { name: '泥沙污染指数', max: 100,
                    nameTextStyle:{
                        formatter(){
                            alert(1)
                        }
                    }
                },
                { name: '藻类污染指数', max: 100},
            ]
        }
    },
    // props:["filter"],
    components : {
        tendencyMinMap
    },
    methods:{
        rowClick(row, event, column){
            this.$emit("rowClick",row);
            this.getPolllutionDetail(row.id);
        },
        getPolllutionDetail(id,fromMap){
            if (!fromMap) {
                this.$root.$emit("sensoryResultPanelListClick",{id:id},true);
            }
            this.detailDisplay = true;
            this.pollutionDetailloading = true;

            setTimeout(()=>{
                vm.selectedPollution = _.find(filteredRiverData,{id:id});
                refreshCharts(vm.selectedPollution);
                this.pollutionDetailloading = false;
            },500);
            // initCharts();
        },
        headerRender(h, param){
            if (param.column.label == "污染面积") {
                return h("span",[param.column.label,h('span',["(m"]),h('sup',["2"]),")"],{
                    // attrs : {
                    //     class : "cell"
                    // }
                });
            }
            return param.column.label;
        },
        convertArea(num, needUnits){
            num = num || 0;
            if (needUnits) {
                var temp = 0,
                    unit = 'km';
                // if (num>10E5) {
                    temp = (num/1000000).toFixed(2);
                    unit = 'km';
                // } else {
                //     temp = num;
                //     unit = 'm';
                // }
                return '<span>'+temp+'</span><span>'+unit+'</span><sup>2</sup>'
            } else {
                return (num/1000000).toFixed(2);
            }
        },
        convertRate(rate){
            rate = rate || 0;
            return (rate*100).toFixed(2)+" "+"%";
        },
        exponentLevel(num){
            var tempLevel = "";
            tempLevel = Math.floor((num*1)/(25));
            return "exponentLevelCommon level"+tempLevel;
        },
        exponentLabel(num){
            var tempLevel = "";
            var labelArr = ["无污染","轻度污染","中度污染","重度污染"]
            tempLevel = Math.floor((num*1)/(25));
            return labelArr[tempLevel];
        },
        radarLabelMouseout(){

        },
        radarLabelMousemove(){

        },
        showTendencyDetail(){
            // tendencyCharts.getOption().series[0].data
            // selectedPollution
            vm.tendencyDetailDisplay = true;
            vm.tendencyMapConfig.data = [vm.selectedPollution];
            vm.tendencyMapConfig.other = [tendencyCharts.getOption().series[0].data];
        },
        detailClose(){
            this.detailDisplay = false
        }
    },
    created(){
        // console.log()
        vm = this;
        // this.filter = this.$store.state.sensoryFilter;
        // refreshData(true);

    },
    mounted(){
        bindTableScroll(this);
        initCharts();

        this.$root.$on("sensoryMapRiverClick",(row)=>{
            this.getPolllutionDetail(row.id,true);
        });
    },
    watch:{
        "$store.state.sensoryFilter":{
            handler(n,o){
                this.filter = n;
                refreshData(true);
            },
            deep:true
        }
    },
    computed:{
        pollutionLabel(){
            if(this.pollutionListType){
                return this.$store.state.sensoryLegend[this.pollutionListType].label;
            } else {
                return "";
            }
        },
        pTypeDisplay(){
            if (this.selectedPollution.pType) {
                return this.$store.state.sensoryLegend[this.selectedPollution.pType[0]].label
            }
            return ""
        }
    }

}
var lastScrollTop = 0;
function bindTableScroll(vm){
    var tableDom = vm.$refs.pollutionTable.$el.querySelector(".el-table__body");
    vm.$refs.pollutionTable.$el.querySelector(".el-table__body-wrapper.is-scrolling-none").addEventListener("scroll", function(){
        if (lastScrollTop < event.target.scrollTop && event.target.scrollTop + parseInt(getComputedStyle(event.target).height) >= parseInt(getComputedStyle(tableDom).height) - 20) {
            refreshData();
        }
        lastScrollTop = event.target.scrollTop;
    });
}
// 刷新数据
var ajaxing = false;

function refreshData (isRefreshFilter) {
    // scroll可能触发多次刷新，保证每次只触发一次查询
    if (ajaxing) {
        return;
    }
    // 判断是否已经到查询完所有数据，在列表底部
    if (!isRefreshFilter && vm.pagination.total && vm.pagination.current * vm.pagination.size > vm.pagination.total) {

        vm.$refs.noTip.doShow();
        setTimeout(function(){
            vm.$refs.noTip.doClose();
        }, 2000);
        return;
    }
    // 查询数据忙等框
    vm.riverTableloading = true;
    // 节流标识
    ajaxing = true;

    var ajaxP = new Promise(resolve=>{
        var that = this;
        setTimeout(function (params) {
            resolve();
        }, 500);
    });

    ajaxP.then(function(){
        filteredRiverData=[];
        var tempdistrict = "",
            tempPtype = [],
            tempRtype = [];

        if (vm.filter.id) {
            filteredRiverData = [_.find(riverData, function(item){
                return item.id == vm.filter.id;
            })];
            tempdistrict = filteredRiverData[0].district || "";
            tempPtype = ['hc','ns','zl'];
            tempRtype = ["湖泊","江河"];
        } else {
            filteredRiverData = _.filter(riverData, function(item){
                return _.indexOf(vm.filter.pollutionType.value,item.pType[0]) != -1 && vm.filter.resourceType.value.indexOf(item.type) != -1;
            })
            tempdistrict = (vm.filter.province.value||"**")+"省"+(vm.filter.city.value||"**")+"市"+(vm.filter.county.value||"**")+"区";
            tempPtype = vm.filter.pollutionType.value;
            tempRtype = vm.filter.resourceType.value;
        }

        vm.resultData = {
            district:tempdistrict,
            resourceType:tempRtype.join(","),
            pType:(function(){
                return (_.map(tempPtype, function(item){
                        return vm.$store.state.sensoryLegend[item].label;
                    })).join(",");
            })(),
            hcNumber:_.filter(filteredRiverData,function(item){
                return _.indexOf(item.pType,"hc") !==-1
            }).length,
            hcArea:_.sumBy(filteredRiverData,function(item){
                if(_.includes(item.pType,"hc")){
                    return item.area;
                }
                return 0;
            }),
            nsNumber:_.filter(filteredRiverData,function(item){
                return _.indexOf(item.pType,"ns") !==-1
            }).length,
            nsArea:_.sumBy(filteredRiverData,function(item){
                if(_.includes(item.pType,"ns")){
                    return item.area;
                }
                return 0;
            }),
            zlNumber:_.filter(filteredRiverData,function(item){
                return _.indexOf(item.pType,"zl") !==-1
            }).length,
            zlArea:_.sumBy(filteredRiverData,function(item){
                if(_.includes(item.pType,"zl")){
                    return item.area;
                }
                return 0;
            }),

        }

        if (isRefreshFilter) {
            vm.pagination.current = 0;
            vm.listData = [];
            vm.pagination.total = 0;
        }
        
        ajaxing = false;
        vm.pagination.total = filteredRiverData.length;
        vm.riverTableloading = false;
        // 水污染总面积
        vm.resultData.pArea = _.sumBy(filteredRiverData, function(item){
            return item.area*1;
        });
        // 水资源总面积
        vm.resultData.totalArea = statisticsData.all_river_area+statisticsData.all_lake_area;
        // 水污染占比
        vm.resultData.pRate = vm.resultData.pArea/vm.resultData.totalArea;


        var newData = _.clone(filteredRiverData).splice((vm.pagination.current)*vm.pagination.size, vm.pagination.size);
        vm.listData = vm.listData.concat(newData);
        
        vm.pagination.current++;
    })
    
}

function refreshCharts(item){
    var option = {
        series: [{
            // name: '污染指数',
            // type: 'radar',
            // areaStyle: {normal: {}},
            data : [
                {
                    value : [item.index_black, item.index_silt, item.index_green],
                    name : '污染指数',
                    lineStyle: {
                        normal: {
                            color:'RGBA(69, 103, 204, 1)',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'RGBA(69, 103, 204, .5)'
                        }
                    },
                    itemStyle:{
                        opacity:0
                    }
                },
            ],
        }]
    }
    pollutionRadarCharts.setOption(option);


    var randomData = new Array(6);
    randomData = _.map(randomData, function(i,index){
        return {
            value:Math.floor(Math.random()*(100-60+1)+60),
            label:"2018."+(index+1),
            exponentLabel:vm.exponentLabel(item.exponent)
        }
    });
    var tendencyChartsOption = {
        xAxis:{
            data:_.map(randomData,(i)=>i.label)
        },
        series: [{
            data : randomData
        }]
    }
    tendencyCharts.setOption(tendencyChartsOption);
    
}

function initCharts(){
    var baseSplitColorOpacity = 1;

    var option = {
        tooltip: {
            confine:true
        },
        grid:{
            containLabel:true,
        },
        radar: {
            radius:"75%",
            name: {
                show:true,
                textStyle: {
                    color: 'transparent',
                },
                // formatter(value){
                //     return value.replace("指数","")
                // },
                rich:{
                    '黑臭水体污染指数':{
                        color:"red"
                    }
                }
            },
            // triggerEvent:true,
            indicator: vm.pollutionIndicators,
            shape: 'circle',
            splitNumber:5,
            splitLine:{
                show:false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['RGBA(49, 49, 122, .9)',
                    'RGBA(49, 49, 122, .8)', 'RGBA(49, 49, 122, .6)',
                    'RGBA(49, 49, 122, .4)', 'RGBA(49, 49, 122, .2)'],
                    // shadowColor: 'rgba(0, 0, 0, 0.3)',
                    // shadowBlur: 10
                }
            }
        },
        series: [{
            name: '污染指数',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
                {
                    value : [50, 60, 70],
                    name : '污染指数',
                    lineStyle: {
                        normal: {
                            color:'RGBA(69, 103, 204, .5)',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'RGBA(69, 103, 204, .5)'
                        }
                    },
                    itemStyle:{
                        opacity:0
                    }
                },
            ],
        }]
    };

    pollutionRadarCharts = echarts.init(document.getElementById('pollutionSensor'));
    pollutionRadarCharts.setOption(option);
    
    pollutionRadarCharts.on("mousemove", function(){
        if (arguments[0].name == "污染指数") {
            return
        }
        if (!vm.pollutionTipVis) {
            vm.pollutionTipVis = true;
        }
        vm.$refs.pollutionTip.style.left = event.layerX-75+"px"; 
        vm.$refs.pollutionTip.style.top = event.layerY-200+"px";
        // console.log(event.clientX+"\s"+event.clientY)
        // console.log(arguments[0].name)
    });
    pollutionRadarCharts.on("mouseout", function(){
        vm.pollutionTipVis = false;
    });

    
    // 趋势图
    var tendencyOption = {
        tooltip: {
            trigger: 'item',
            formatter :function(params){
                return params.data.label+'<br/>水质感官指数：'+params.data.value+'<br/>污染等级：'+params.data.exponentLabel
            }
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLabel:{
                color:"white",
                rotate:45
            },
            axisLine:{
                lineStyle:{
                    color:"white"
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                color:"white"
            },
            axisLine:{
                lineStyle:{
                    color:"white"
                }
            }
        },
        series: [{
            data: [],
            type: 'line'
        }],
        grid:{
            top:20,
            bottom:0,
            left:0,
            right:0,
            containLabel:true
        }
    }
    tendencyCharts = echarts.init(document.getElementById('tendencyCharts'));
    tendencyCharts.setOption(tendencyOption);
}
</script>
<style lang="stylus">
    @import "../../common/common.styl"
    #result_panel {
        position absolute
        left 20px
        z-index 1
        top 20px + $headerH
        .section_common{
            base(430px)
            &:not(:last-child){
                margin-bottom 15px
            }
            padding 20px
            clf()
            border 1px solid rgba(49, 49, 122, 1)
            // gradientStyle(top,rgba(27, 27, 38, .9) 50%,rgba(49, 49, 122, .8));
            background-color rgba(27, 27, 38, .9)
            &.stat{
                .title{
                    font-size 20px
                    margin-bottom 15px
                }
                .outline{
                    clf()
                    border-bottom 1px solid rgba(255,255,255,.2)
                    padding-bottom 10px
                    .total_item {
                        p{
                            margin-bottom 10px
                        }
                        .num {
                            font-weight bold
                            font-size 30px
                            color rgba(75, 173, 220, 1)
                            margin-right 5px
                        }
                    }
                    
                }
                .pollutionTypes{
                    padding-top 20px
                    clf()
                    .style_common{
                        base(49%,100%)
                        calcM(width, 100%/3, 2.5px)
                        float left
                        &:first-child{
                            margin-right 5px
                        }

                        .title {
                            font-size 18px
                            // text-align center
                            margin-bottom 10px
                        }
                        p{
                            margin-bottom 5px
                        }
                    }
                }
                
            }
            &.list{
                .title{
                    font-size 20px
                    margin-bottom 20px
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

    }
    .detail_float {
        width 317px
        position absolute
        right 20px
        top 20px + $headerH + 60
        padding 20px
        background-color grey
        // gradientStyle(bottom,rgba(49, 49, 122, .8) 1%,rgba(27, 27, 38, 1) 30%)
        background-color rgba(27, 27, 38, .9)
        border-radius 4px
        h3{
            font-size 20px
            font-weight 400
            margin-bottom 18px
            clf()
        }
        .detail_area{
            font-size 14px
            position relative
            .closeDetailBtn {
                float right
                color RGBA(75, 173, 220, 1)
                font-size 14px
                trans()
                .arrow{
                    trans()
                    color RGBA(75, 173, 220, 1)
                }
                &:hover{
                    cursor pointer
                    color RGBA(130, 215, 255, 1)
                    .arrow{
                        color RGBA(130, 215, 255, 1)
                    }
                }
            }
            .content{
                .exponentLevelCommon{
                    background-repeat no-repeat
                    background-position 68%
                    &.level1{
                        background-image url('');
                    }
                    &.level2{
                        background-image url('../../image/exponent-m.png');
                    }
                    &.level3{
                        background-image url('../../image/exponent-h.png');
                    }
                }
                >div {
                    &.borderBottom{
                        border-bottom 1px solid rgba(255,255,255,.2)
                        padding-bottom 20px
                        margin-bottom 20px
                    }
                    &:first-of-type{
                        // font-weight 
                        font-size 18px
                    }
                    // font-size 14px
                    margin-bottom 15px
                    // padding-bottom 15px
                }
                .radarArea{
                    position relative
                    #pollutionSensor{
                        base(270px,270px)
                    }
                    .pollutionIndicators{
                        position relative
                        .item{
                            position absolute
                            z-index 1
                            // cursor pointer
                            &:nth-child(1){
                                top 10px
                                left 78px
                            }
                            &:nth-child(2){
                                top 196px
                                left 4px
                            }
                            &:nth-child(3){
                                top 196px
                                left 185px
                            }
                        }
                    }
                    .pollutionTip{
                        trans(opacity);
                        &.show{
                            opacity 1
                            visibility visible
                        }
                        &.hide{
                            opacity 0
                            visibility hidden
                        }
                        min-width 130px
                        background-color rgba(50, 50, 50, 0.7)
                        border-radius 4px
                        padding 8px 5px
                        position absolute
                        z-index 2
                        div{
                            &:not(:last-child){
                                margin-bottom 5px
                            }
                        }
                    }
                }
                .tendencyChartsArea{
                    #tendencyCharts{
                        base(270px,150px)
                    }
                    .detailBtn{
                        float right
                        color RGBA(75, 173, 220, 1)
                        font-size 14px
                        trans()
                        .arrow{
                            trans()
                            color RGBA(75, 173, 220, 1)
                        }
                        &:hover{
                            cursor pointer
                            color RGBA(130, 215, 255, 1)
                            .arrow{
                                color RGBA(130, 215, 255, 1)
                            }
                        }
                    }
                }
            }
        }
    }

    .tendencyMinMap{
        background white
        width 100% !important
        height 800px !important
        background rgba(27,27,38,.9)
    }
    .el-dialog.tendency_dialog{
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
        margin 0
    }
</style>
