<template>
    <div id="situation_statistics_detail" class="">
        <div class="title">卫星遥感智能分析</div>
        <div class="intro part_common box">
            <div class="exponentCircleBox">
                <div class="exponentCircleArea">
                    <el-progress type="circle" :width='100' :show-text="false" :percentage="currentData.polution_score ? $tools.convertExponent(currentData.polution_score) : 0" class="exponentCircle"></el-progress>
                    <div class="displayBox">
                        <div v-text="$tools.convertExponent(currentData.polution_score)" class="score"></div>
                        <div class="label">污染指数</div>
                    </div>
                </div>
                <div class="pTypeLabel" v-text="currentData.pollution_type ? $store.state.sensoryLegend[currentData.pollution_type[0]].label : '--'"></div>
            </div>
            <p class="inline"><span>污染位置</span><span v-text="currentData.possition || '--'" :title="currentData.possition"></span></p>
            <p><span>水资源名称</span><span v-text="currentData.name || '--'"></span></p>
            <p><span>区域</span><span :title="currentData.through? currentData.through.toString():'--'" v-text="currentData.through? currentData.through.toString():'--'"></span></p>
            <p><span>水资源类型</span><span v-text="$tools.renderCollection.waterType(currentData.river)"></span></p>
            <p><span>污染面积</span><span v-text="$tools.convertArea(currentData.ares)"></span><span>&nbsp;km</span><sup>2</sup></p>
        </div>
        <div class="part_common">
            <div class="sub_title">特征指标</div>
            <div class="feature_index_area">
                <div class="index_items">
                    <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='lvzao'">
                        <img :src="require(`@/image/index_chlorophyll.gif`)" alt="">
                        <div>叶绿素A含量</div>
                        <div v-text="`(${currentData.lvzao_true ? currentData.lvzao_true.toFixed(2) : 0}mg/m³)`"></div>
                    </div>
                    <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='heichou'">
                        <img :src="require(`@/image/index_cdom.gif`)" alt="">
                        <div>CDOM</div>
                        <div v-text="`(${currentData.heichou_true ? currentData.heichou_true.toFixed(2) : 0}mg/m³)`"></div>
                    </div>
                    <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='nisha'">
                        <img :src="require(`@/image/index_sssc.gif`)" alt="">
                        <div>SSSC</div>
                        <div v-text="`(${currentData.nisha_true ? currentData.nisha_true.toFixed(2) : 0}mg/L)`"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="part_common">
            <div class="sub_title">算法模型</div>
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
        <div class="part_common">
            <div class="tendencyChartsArea">
                <div class="head">
                    <span class="sub_title">趋势对比</span>
                    <span class="detailBtn" @click="showTendencyDetail">查看详情<i class="arrow el-icon-arrow-right"></i></span>
                </div>
                <div id="tendencyCharts"></div>
            </div>
        </div>
        <el-dialog :title="currentData.name+'污染水体变化趋势'" :visible.sync="tendencyDetailDisplay" width="1500px" :close-on-click-modal="false" custom-class="tendency_dialog" top="0" :modal-append-to-body='false'>
            <tendencyMinMap :config="tendencyMapConfig" class="tendencyMinMap" :map-show="tendencyDetailDisplay"></tendencyMinMap>
            <span lot="footer" class="dialog-footer">
                <!-- <el-button @click="tendencyDetailDisplay = false">取 消</el-button>
                <el-button type="primary" @click="tendencyDetailDisplay = false">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import echarts from 'echarts';
import tendencyMinMap from './tendency_map_3d_4_dialog.vue';

let vm,pollutionRadarCharts,tendencyCharts;
let opacity = '1',selectedOpacity = '.5';
let colors = {
    hc:`rgba(25,23,43,${opacity})`,
    hc_s:`rgba(25,23,43,${selectedOpacity})`,
    ns:`rgba(154,97,74,${opacity})`,
    ns_s:`rgba(154,97,74,${selectedOpacity})`,
    zl:`rgba(67,226,100,${opacity})`,
    zl_s:`rgba(67,226,100,${selectedOpacity})`,
};
export default {
    data () {
        return {
            props:['display'],
            renderModel:{
                pType:typeArray => {
                    var tempTypeStr = "无";
                    // if (typeArray && typeArray.length > 0) {
                    //     tempTypeStr = typeArray.map(item => vm.$store.state.sensoryLegend[item].label).toString();
                    // }
                    return tempTypeStr;
                }
            },
            pollutionIndicators:[
                { name: '黑臭水体污染指数', max: 100},
                { name: '泥沙污染指数', max: 100,
                    nameTextStyle:{
                        formatter(){
                            alert(1)
                        }
                    }
                },
                { name: '水体富营养指数', max: 100},
            ],
            pollutionTipVis:false,
            selectedPollution:{},
            tendencyDetailDisplay:false,
            tendencyMapConfig:{
                colors,
                list:{},
                data:[],
                other:[]
            },
        }
    },
    computed:{
        currentData(){
            return this.$store.state.stastistics.detail.data || {};
        }
    },
    components : {
        tendencyMinMap
    },
    methods:{
        getpLevelIcon(num){
            if (!num || num < 25) {
                return;
            }
            var pLevel = Math.floor(num / 25);
            return require('@/image/l' + pLevel + '_label.png');
        },
        radarLabelMousemove(){

        },
        radarLabelMouseout(){

        },
        showTendencyDetail(){
            vm.tendencyDetailDisplay = true;
            vm.tendencyMapConfig.data = [vm.currentData];
            vm.tendencyMapConfig.other = [tendencyCharts.getOption().series[0].data];
        },
        exponentLabel(num){
            var tempLevel = "";
            var labelArr = ["无污染","轻度污染","中度污染","重度污染"]
            tempLevel = Math.floor((num*1)/(25));
            return labelArr[tempLevel];
        },
    },
    created(){
        vm = this;

    },
    mounted(){
        initCharts();
    },
    watch:{
        currentData:{
            deep:true,
            handler(data){
                refreshCharts(data);
            }
        },
    }
}

function initCharts(){
    var baseSplitColorOpacity = 1;
    let baseColorStr = '1,157,255';
    var option = {
        tooltip: {
            confine:true
        },
        grid:{
            containLabel:true,
        },
        radar: {
            radius:"90%",
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
                    color: ((color) => {
                        let tempArr = [`rgba(${color},.9)`]
                        for(var i=4;i>0;i--){
                            tempArr.push(`rgba(${color},.${i*2})`)
                        }
                        return tempArr;
                    })('2, 142, 232'),
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
                            color:`RGBA(${baseColorStr}, 1)`,
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: `RGBA(${baseColorStr}, 1)`
                        }
                    },
                    symbolSize:10,
                    itemStyle:{
                        // opacity:0
                        normal: {
                            color: `RGBA(${baseColorStr}, 1)`,
                            borderWidth:2,
                        }
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
        legend: {
            // show:true,
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
            // formatter :function(params){
            //     return params.data.label+'<br/>水质感官指数：'+params.data.value+'<br/>污染等级：'+params.data.exponentLabel
            // }
            axisPointer : {
                lineStyle : {
                    color : 'rgba(0,80,115,1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: [],
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
            data: [],
            type: 'line'
        }],
        grid:{
            top:30,
            bottom:0,
            left:0,
            right:10,
            containLabel:true
        }
    }
    tendencyCharts = echarts.init(document.getElementById('tendencyCharts'));
    tendencyCharts.setOption(tendencyOption);
}
function refreshCharts(item){
    let temp = _.cloneDeep(pollutionRadarCharts.getOption().series[0].data[0]);
    temp.value = [item.heichou, item.nisha, item.lvzao].map(num => vm.$tools.convertExponent(num));
    var option = {
        series: [{
            data : [temp],
        }]
    }
    pollutionRadarCharts.setOption(option);


    function getRandomData(){
        var randomData = new Array(6);
        randomData = _.map(randomData, function(i,index){
            return {
                value:Math.floor(Math.random()*(100-60+1)+60),
                label:"2018."+(index+1),
                name:vm.exponentLabel(vm.$tools.convertExponent(item.polution_score))
            }
        });
        return randomData;
    }

    var seriesOprigin = _.cloneDeep(vm.$store.state.pollutionLegendOptions.filter(i=>i.value == item.pollution_type[0]));
    seriesOprigin.unshift({label:'水质感官指数',colorRGB:'255, 255, 255'});
    var tendencyChartsOption = {
        legend : {
            // selected: (() => {
            //     let temp = {};
            //     for (let i of seriesOprigin) {
            //         if (i.label != '水质感官指数') {
            //             temp[i.label] = false;
            //         } else {
            //             temp[i.label] = true;
            //         }
            //     }
            //     return temp
            // })()
        },
        xAxis:{
            data:_.map(getRandomData(),(i)=>i.label)
        },
        series: _.map(seriesOprigin, item => {
            var tempColor = item.label == "黑臭水体" ? "0,146,254" : item.colorRGB
            return {
                type:'line',
                name : item.label,
                data : getRandomData(),
                smooth: true,
                lineStyle : {
                    color : `rgba(${tempColor},1)`
                },
                itemStyle : {
                    color : `rgba(${tempColor},1)`
                }
            }
        })

    }
    tendencyCharts.setOption(tendencyChartsOption);
    
}
</script>
<style lang="stylus">
    @import "~@/common/common.styl"
    #situation_statistics_detail {
        .part_common{
            padding 10px 20px
            font-size 14px
            clf()
            margin-bottom 8px
            // &.box {
            //     border 1px dashed rgba(0,146,254, 1)
            //     background-color rgba(6,8,18,.9)
            //     border-radius 5px
                
            // }
            .sub_title {
                color rgba(0,146,254, 1)
                font-size 16px
                font-weight bold
                margin-bottom 15px
            }
            >p{
                float left
                display flex
                height 22px
                line-height 22px
                &:not(.inline){
                    width 50%
                }
                >span{
                    display flex
                    &:first-child {
                        // flex-grow 1
                        width 95px
                        padding-right 10px
                        display flex
                        justify-content flex-end
                        color rgba(113, 168, 224,1)
                    }
                    &:last-child {
                        // flex-grow 1
                        width calc(100% - 95px)
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        display inline-block
                    }
                }
                >img {
                    margin-left 10px
                }
            }
            .radarArea{
                $radarWidth = 190px;
                position relative
                #pollutionSensor{
                    margin 0 auto
                    base($radarWidth, $radarWidth)
                }
                .pollutionIndicators{
                    position relative
                    .item{
                        position absolute
                        z-index 1
                        // cursor pointer
                        &:nth-child(1){
                            top -10px
                            // left (($radarWidth - 112) / 2)
                            left 50%
                            transform translate(-50%)
                        }
                        $bottomLabel = .7;
                        &:nth-child(2){
                            top $bottomLabel * $radarWidth
                            left 15px
                        }
                        &:nth-child(3){
                            top $bottomLabel * $radarWidth
                            right 15px
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
                    base(350px,280px)
                }
                .detailBtn{
                    float right
                    color rgba(1,157,255,1)
                    font-size 14px
                    trans()
                    .arrow{
                        trans()
                        color rgba(1,157,255,1)
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
                    >img {
                        base(54px, 54px)
                        transform scale(1.5,1.5)
                    }
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
        .intro {
            .exponentCircleBox {
                clf()
                margin-bottom 15px
            }
            .exponentCircleArea{
                width 50%
                position relative
                .exponentCircle {
                    left 50%
                    transform translateX(-50%)
                }
                float left
                .displayBox{
                    position absolute
                    top 50%
                    left 50%
                    transform translate(-50%,-50%)
                    >div{
                        color rgba(0,146,254, 1)
                        text-align center
                    }
                    .score {
                        font-size 36px
                        // font-weight bold
                    }
                    .label{
                        font-size 14px
                        
                    }
                }
            }
            .pTypeLabel {
                base(50%, 100%, 100%)
                color rgba(0,146,254, 1)
                font-size 26px
                // text-align center
                margin 5px 0 10px
                // font-weight bold
                float left
                padding-top 31px
            }
            >p {
                &:not(:last-of-type) {
                    margin-bottom 5px
                }
            }
        }
        .tendencyMinMap{
            width 100% !important
            height 600px !important
            // background rgba(27,27,38,.9)
        }
        .el-dialog.tendency_dialog{
            position absolute
            top 50%
            left 50%
            transform translate(-50%,-50%)
            margin 0
            gradientStyle(bottom,rgba(9,43,120,1),rgba(11,12,33,1));
            border 1px solid rgba(0,146,254, 1)
            .el-dialog__header{
                padding-top 30px
                padding-left 30px
                .el-dialog__title{
                    color white
                    font-size 20px
                    font-weight bold
                }
            }
        }
        // .el-progress-circle__path {
        //     stroke linear-gradient(right, rgba(20, 162, 236,1),rgba(37, 235, 209,1))
        // }
    }
</style>
