<template>
    <div class="result_panel" v-show="operated">
        <div class="result_area" v-show="currentTab=='result'">
            <h3>水污染分析结果</h3>
            <div class="result_item">
                <p><span>区域：</span><span v-text="resultData.district"></span></p>
                <p><span>水资源类型：</span><span v-text="resultData.resourceType"></span></p>
                <p><span>污染类型：</span><span v-text="resultData.pType"></span></p>
            </div>
            <div class="result_item">
                <p><span>水资源总面积：</span><span v-text="resultData.totalArea"></span><span> m</span><sup>2</sup></p>
                <p><span>水污染面积：</span><span v-text="resultData.pArea"></span><span> m</span><sup>2</sup></p>
                <p><span>水污染占比：</span><span v-text="resultData.pRate"></span></p>
            </div>
            <div class="pollution_statistics result_item">
                <p @click="viewList('hc')"><span>黑臭水体：</span><span v-text="resultData.hcNumber"></span><i class="arrow el-icon-arrow-right"></i></p>
                <p @click="viewList('ns')"><span>泥沙污染：</span><span v-text="resultData.nsNumber"></span><i class="arrow el-icon-arrow-right"></i></p>
                <p @click="viewList('zl')"><span>藻类污染：</span><span v-text="resultData.zlNumber"></span><i class="arrow el-icon-arrow-right"></i></p>
            </div>
        </div>
        <div class="list_area" v-show="currentTab=='list'">
            <h3><span v-text="pollutionLabel"></span>污染列表<div class="listBackBtn" @click="listGoback">返回<i class="arrow el-icon-arrow-right"></i></div></h3>
            
            <el-popover placement="bottom" content="没有更多内容了" trigger="manual" ref="noTip" :visible-arrow="false">
            </el-popover>
            <div class="tableCommon">
                <el-table :data="listData" style="width: 100%" :max-height="400" :stripe="false" ref="pollutionList" v-loading="pollutionListloading" v-popover:noTip
                @row-click="rowClick" :row-style="{cursor:'pointer'}" :highlight-current-row="true">
                    <template v-for="item in columnsList">
                        <el-table-column :show-overflow-tooltip="true" :key="item.id" :prop="item.key" :label="item.label" :width="item.width"></el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
        <div class="detail_area" v-show="currentTab=='detail'">
            <h3>污染详情<div class="listBackBtn" @click="listGoback">返回<i class="arrow el-icon-arrow-right"></i></div></h3>
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
            </div>
        </div>
    </div>
</template>

<script>
import riverDataO from '@/data/data.js';
import echarts from 'echarts';
import totalData from '@/data/json_result.json';

var riverData1 = _.cloneDeep(riverDataO),
    filteredRiverData,
    vm,
    pollutionRadarCharts;
var pollutionList = ["lak_960","lak_363","lak_792","lak_215","lak_201","lak_605","riv_361"];
var riverData = _.filter(_.clone(riverData1), function(item, index){
            return item.pType.length > 0 && _.indexOf(pollutionList, item.id) != -1;
            // return item.pType.length > 0;
        })
export default {
    props:{
        
    },
    data () {
        return {
            pollutionTipVis:false,
            resultData:{},
            operated:false,
            selectedPollution:{},
            pagination : {
                current : 0,
                total:0,
                size:20
            },
            pollutionListloading:false,
            pollutionDetailloading:false,
            pollutionListType:"",
            currentTab :"result",
            lastTab : "",
            columnsList:[
                {
                    key:"name",
                    label:"名称",
                    width:"82px"
                },
                {
                    key:"district",
                    label:"区域",
                    width:"72px"
                },
                {
                    key:"owner",
                    label:"河长",
                    width:"57px"
                },
                {
                    key:"exponent", 
                    label:"指数",
                    width:"50px"
                }
            ],
            listData:[],
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
    methods:{
        rowClick(row, event, column){
            
            this.getPolllutionDetail(row.id);

        },
        getPolllutionDetail(id,fromMap){
            if (!fromMap) {
                this.$root.$emit("sensoryResultPanelListClick",{id:id},true);
            }
            vm.currentTab = "detail";
            this.pollutionDetailloading = true;
            setTimeout(()=>{
                vm.selectedPollution = _.find(filteredRiverData,{id:id});
                refreshRadar(vm.selectedPollution);
                this.pollutionDetailloading = false;
            },500);
            // initRadar();
        },
        viewList(type){
            getListWithType(type);
            
        },
        listGoback(){
            this.currentTab = this.currentTab == "detail" ? this.lastTab:"result";
        },
        radarLabelMousemove(name){

            // if (!vm.pollutionTipVis) {
            //     vm.pollutionTipVis = true;
            // }

            // vm.$refs.pollutionTip.style.left = parseInt(getComputedStyle(event.target).left)+event.layerX-parseInt(vm.$refs.pollutionTip.clientWidth/2)+"px"; 
            // vm.$refs.pollutionTip.style.top = parseInt(getComputedStyle(event.target).top)+event.layerY-parseInt(vm.$refs.pollutionTip.clientHeight)-20+"px";

        },
        radarLabelMouseout(){
            // vm.pollutionTipVis = false;
        },
        exponentLevel(num){
            var tempLevel = "";
            tempLevel = Math.floor((num*1)/(25));
            return "exponentLevelCommon level"+tempLevel;
        }
    },
    watch:{
        currentTab(n,o){
            if (n == o) {
                return;
            } else {
                this.lastTab = o;
            }
        },
        "$store.state.sensoryFilter":{
            handler(n,o){
                refreshResultData(n);
            },
            deep:true
        }
    },
    components : {
    },
    created(){
        vm = this;
        // refreshListData();
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
    },
    mounted () {
        bindTableScroll(this);
        // refreshResultData({id:1});
        // this.getPolllutionDetail({id:1});
        initRadar();
    }
}

function refreshRadar(item){
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
}

function initRadar(){
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
}



function refreshResultData(filter){
    // 刷新筛选条件回到统计页
    vm.currentTab = "result";
    vm.operated = true;
    var tempdistrict = "",
        tempPtype = [],
        tempRtype = [];

    if (filter.id) {
            filteredRiverData = [_.find(riverData, function(item){
                return item.id == filter.id;
            })];
            tempdistrict = filteredRiverData[0].district || "";
            tempPtype = ['hc','ns','zl'];
            tempRtype = ["湖泊","江河"];
    } else {
        filteredRiverData = _.filter(riverData, function(item){
            // return filter.pollutionType.keys.indexOf(item.pType) != -1 && filter.resourceType.value.indexOf(item.type) != -1;
            // return new Set([...(new Set(filter.pollutionType.keys))].filter(x => new Set(item.pType).has(x))) != 0  && filter.resourceType.value.indexOf(item.type) != -1;
            return _.indexOf(filter.pollutionType.value,item.pType[0]) != -1 && filter.resourceType.value.indexOf(item.type) != -1;
        })
        tempdistrict = (filter.province.value||"**")+"省"+(filter.city.value||"**")+"市"+(filter.county.value||"**")+"区";
        tempPtype = filter.pollutionType.value;
        tempRtype = filter.resourceType.value;
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
        nsNumber:_.filter(filteredRiverData,function(item){
            return _.indexOf(item.pType,"ns") !==-1
        }).length,
        zlNumber:_.filter(filteredRiverData,function(item){
            return _.indexOf(item.pType,"zl") !==-1
        }).length

    }



    vm.resultData.pArea = _.sumBy(filteredRiverData, function(item){
        return item.area*1;
    });
    vm.resultData.totalArea = totalData.all_river_area+totalData.all_lake_area;
    vm.resultData.pRate = (vm.resultData.pArea/vm.resultData.totalArea*100).toFixed(2)+"%";
}

// 根据污染类型查询列表数据
function getListWithType(type){
    
    setTimeout(function(){
        // 切换污染类型需要重置数据
        vm.pollutionListType = type;
        vm.pagination.total = 0;
        vm.pagination.current = 0;
        vm.currentTab = "list";
        vm.listData=[];
        // 加入栈顶等待dom渲染完再执行，否则找不到对应dom
        setTimeout(function (params) {
            vm.$refs.pollutionList.$el.querySelector(".el-table__body-wrapper.is-scrolling-none").style.scrollTop = 0;
        },0);
        refreshListData();
    },500);
}
var lastScrollTop = 0;
function bindTableScroll(vm){
    var tableDom = vm.$refs.pollutionList.$el.querySelector(".el-table__body");
    vm.$refs.pollutionList.$el.querySelector(".el-table__body-wrapper.is-scrolling-none").addEventListener("scroll", function(){
        if (lastScrollTop < event.target.scrollTop && event.target.scrollTop + parseInt(getComputedStyle(event.target).height) >= parseInt(getComputedStyle(tableDom).height) - 20) {
            refreshListData();
        }
        lastScrollTop = event.target.scrollTop;
    });
}

// 刷新数据
var ajaxing = false;
function refreshListData(){
    // scroll可能触发多次刷新，保证每次只触发一次查询
    if (ajaxing) {
        return;
    }

    if (vm.pagination.total && vm.pagination.current * vm.pagination.size > vm.pagination.total) {

        vm.$refs.noTip.doShow();
        setTimeout(function(){
            vm.$refs.noTip.doClose();
        }, 2000);
        return;
    }
    vm.pollutionListloading = true;
    ajaxing = true;
    var ajaxP = new Promise(resolve=>{
        var that = this;
        setTimeout(function (params) {
            resolve();
        }, 500);
    });
    ajaxP.then(function(){
        var typedRiverData = _.filter(filteredRiverData, function(item){
            return item.pType.indexOf(vm.pollutionListType) != -1;
        });
        ajaxing = false;
        vm.pagination.total = typedRiverData.length;
        vm.pollutionListloading = false;
        var newData = _.clone(typedRiverData).splice((vm.pagination.current)*vm.pagination.size, vm.pagination.size);
        vm.listData = vm.listData.concat(newData);
        vm.pagination.current++;
    })
}
</script>
<style scoped lang="stylus">
    @import "../../common/common.styl"
    .result_panel{
        width 317px
        position absolute
        left 20px
        top 20px + $headerH
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
        .result_area{
            font-size: 14px;
            .result_item{
                &:not(:last-child){
                    border-bottom 1px solid rgba(255,255,255,.2)
                    margin-bottom 15px
                    padding-bottom 15px
                }
                p{
                    &:not(:last-child){
                        margin-bottom 15px
                    }
                }
                &.pollution_statistics{
                    p{
                        
                        &:hover{
                            cursor pointer
                            span {
                                trans()
                                color RGBA(130, 215, 255, 1)
                            }
                            .arrow{
                                trans()
                                color RGBA(130, 215, 255, 1)
                            }
                        }
                        .arrow{
                            float right
                            color RGBA(75, 173, 220, 1)
                        }
                    }
                }
            }
        }
        .listBackBtn {
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
        .list_area{
            
        }
        .detail_area{
            font-size 14px
            position relative
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
            }
        }
        .listBackBtn{
            float right
        }
    }
</style>
