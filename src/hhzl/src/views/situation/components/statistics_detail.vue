<template>
    <div id="situation_statistics_detail" class="">
        <div class="title">卫星遥感智能分析</div>
        <div class="content">
            <div class="intro part_common box">
                <div class="sub_title" v-if="$store.state.view.bigScreen">污染指数</div>
                <div class="exponentCircleBox">
                    <div class="exponentCircleArea">
                        <!-- <el-progress type="circle" :width='$store.state.view.bigScreen ? 100 * $store.state.view.multiple: 100' color="rgba(1, 255, 255,1)" :show-text="false" :percentage="currentData.polution_score ? $tools.convertExponent(currentData.polution_score) : 0" class="exponentCircle"></el-progress> -->
                        <el-progress type="circle" :width='100' color="rgba(1, 255, 255,1)" :show-text="false" :percentage="currentData.polution_score ? $tools.convertExponent(currentData.polution_score) : 0" class="exponentCircle"></el-progress>
                        <div class="displayBox">
                            <div v-text="$tools.convertExponent(currentData.polution_score)" class="score"></div>
                            <div class="label">污染指数</div>
                        </div>
                    </div>
                    <div class="pTypeLabel" v-if="!$store.state.view.bigScreen" v-text="currentData.pollution_type ? $store.state.sensoryLegend[currentData.pollution_type[0]].label : '--'"></div>
                    <div class="comparison" v-if="$store.state.view.bigScreen">
                        <div class="pTypeLabel_b" v-text="currentData.pollution_type ? $store.state.sensoryLegend[currentData.pollution_type[0]].label : '--'"></div>
                        <p><span>环比：</span><span v-text="currentData.yoy" class="comparison_value" :class="[currentData.yoy && currentData.yoy.includes('+') ? 'pNum' : 'nNum']"></span></p>
                        <p><span>同比：</span><span v-text="currentData.qoq" class="comparison_value" :class="[currentData.qoq && currentData.qoq.includes('+') ? 'pNum' : 'nNum']"></span></p>
                    </div>
                </div>
                <!-- 大屏隐藏 -->
                <div v-if="!$store.state.view.bigScreen">
                    <p class="inline"><span>污染位置</span><span v-text="currentData.possition || '--'" :title="currentData.possition"></span></p>
                    <p><span>水资源名称</span><span v-text="currentData.name || '--'"></span></p>
                    <p><span>区域</span><span :title="currentData.through? currentData.through.toString():'--'" v-text="currentData.through? currentData.through.toString():'--'"></span></p>
                    <p><span>水资源类型</span><span v-text="$tools.renderCollection.waterType(currentData.river)"></span></p>
                    <p><span>污染面积</span><span v-text="$tools.convertArea(currentData.area)"></span><span>&nbsp;km</span><sup>2</sup></p>
                </div>
            </div>
            <!-- 大屏展示 基本信息 -->
            <div class="intro_base part_common" v-if="$store.state.view.bigScreen">
                <div class="sub_title">基本信息</div>
                <div class="content">
                    <p><span>水资源名称</span><span v-text="currentData.name || '--'"></span></p>
                    <p class="inline"><span>污染位置</span><span v-text="currentData.possition || '--'" :title="currentData.possition"></span></p>
                    <p><span>所属区域</span><span :title="currentData.through? currentData.through.toString():'--'" v-text="currentData.through? currentData.through.toString():'--'"></span></p>
                    <p><span>水资源类型</span><span v-text="$tools.renderCollection.waterType(currentData.river)"></span></p>
                    <p><span>污染面积</span><span v-text="$tools.convertArea(currentData.area)"></span><span>&nbsp;km</span><sup>2</sup></p>
                </div>
            </div>
            <div class="part_common">
                <div class="sub_title">特征指标</div>
                <div class="feature_index_area">
                    <div class="index_items big" v-if="$store.state.view.bigScreen">
                        <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='lvzao'">
                            <img :src="require(`@/image/index_chlorophyll.gif`)" alt="">
                            <div class="index_content">
                                <div>叶绿素a</div>
                                <div v-text="`(${currentData.lvzao_true ? currentData.lvzao_true.toFixed(2) : 0}mg/L)`"></div>
                            </div>
                        </div>
                        <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='heichou'">
                            <img :src="require(`@/image/index_cdom.gif`)" alt="">
                            <div class="index_content">
                                <div>CDOM</div>
                                <div v-text="`(${currentData.heichou_true ? currentData.heichou_true.toFixed(2) : 0}mg/L)`"></div>
                            </div>
                        </div>
                        <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='nisha'">
                            <img :src="require(`@/image/index_sssc.gif`)" alt="">
                            <div class="index_content">
                                <div>SSSC</div>
                                <div v-text="`(${currentData.nisha_true ? currentData.nisha_true.toFixed(2) : 0}mg/L)`"></div>
                            </div>
                        </div>
                    </div>
                    <div class="index_items" v-else-if="$store.state.view.bigScreen">
                        <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='lvzao'">
                            <img :src="require(`@/image/index_chlorophyll.gif`)" alt="">
                            <div>叶绿素a</div>
                            <div v-text="`(${currentData.lvzao_true ? currentData.lvzao_true.toFixed(2) : 0}mg/L)`"></div>
                        </div>
                        <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='heichou'">
                            <img :src="require(`@/image/index_cdom.gif`)" alt="">
                            <div>CDOM</div>
                            <div v-text="`(${currentData.heichou_true ? currentData.heichou_true.toFixed(2) : 0}mg/L)`"></div>
                        </div>
                        <div class="index_item" v-show="currentData.pollution_type && currentData.pollution_type[0]=='nisha'">
                            <img :src="require(`@/image/index_sssc.gif`)" alt="">
                            <div>SSSC</div>
                            <div v-text="`(${currentData.nisha_true ? currentData.nisha_true.toFixed(2) : 0}mg/L)`"></div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="part_common charts_area">
                <div class="sub_title">算法模型</div>
                <div class="radarArea">
                    <!-- <div class="pollutionIndicators"> -->
                        <template v-for="item in pollutionIndicators">
                            <div class="item" v-text="item.name" :key="item.name" @mousemove="radarLabelMousemove(item.name)" @mouseout="radarLabelMouseout"></div>
                        </template>
                    <!-- </div> -->
                    <div id="pollutionSensor"></div>
                    <!-- <div ref="pollutionTip" :class="['pollutionTip',pollutionTipVis?'show':'hide']">
                        <div><span>水温：</span><span>23.8℃</span></div>
                        <div><span>PH值：</span><span>8.46</span></div>
                        <div><span>溶解氧：</span><span>9.3</span></div>
                        <div><span>高锰酸盐：</span><span>4.4</span></div>
                        <div><span>氨氮：</span><span>0.25</span></div>
                        <div><span>总磷：</span><span>0.04</span></div>
                    </div> -->
                </div>
            </div>
            <div class="part_common charts_area " :class="{fullWidth: $store.state.view.bigScreen}">
                <div class="tendencyChartsArea">
                    <div class="head">
                        <span class="sub_title">趋势变化</span>
                        <span class="detailBtn" @click="showTendencyDetail">查看详情<i class="arrow el-icon-arrow-right"></i></span>
                    </div>
                    <div id="tendencyCharts"></div>
                </div>
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

let _this,pollutionRadarCharts,tendencyCharts;
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
    props:['display'],
    data () {
        return {
            renderModel:{
                pType:typeArray => {
                    var tempTypeStr = "无";
                    // if (typeArray && typeArray.length > 0) {
                    //     tempTypeStr = typeArray.map(item => _this.$store.state.sensoryLegend[item].label).toString();
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
            _this.tendencyDetailDisplay = true;
            _this.tendencyMapConfig.data = [_this.currentData];
            _this.tendencyMapConfig.other = [tendencyCharts.getOption().series[0].data];
        },
        exponentLabel(num){
            var tempLevel = "";
            var labelArr = ["无污染","轻度污染","中度污染","重度污染"]
            tempLevel = Math.floor((num*1)/(25));
            return labelArr[tempLevel];
        },
    },
    created(){
        _this = this;

    },
    mounted(){
        setTimeout(()=>{
            initCharts();
        });
        this.$root.$on('windowResize', () => {
            if (this.display) {
                pollutionRadarCharts.resize();
                tendencyCharts.resize();
            }
        });
    },
    watch:{
        currentData:{
            deep:true,
            handler(data){
                refreshCharts(data);
            }
        },
        display: function(nV, oV){
            if (nV) {
                this.$nextTick(()=>{
                    pollutionRadarCharts.resize();
                    tendencyCharts.resize();
                });
            }
        }
    },
}

function initCharts(){
    var baseSplitColorOpacity = 1;
    let baseColorStr = '1, 255, 255';
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
            indicator: _this.pollutionIndicators,
            shape: 'circle',
            splitNumber:5,
            splitLine:{
                // show:false
                lineStyle : {
                    color : `rgba(1, 255, 255,.5)`
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(1, 255, 255,.6)'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ((color) => {
                        // let tempArr = [`rgba(${color},.9)`]
                        let tempArr = []
                        for(var i=5;i>0;i--){
                            tempArr.push(`rgba(${color},.${i})`)
                        }
                        return tempArr;
                    })('1, 255, 255'),
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
        if (!_this.pollutionTipVis) {
            _this.pollutionTipVis = true;
        }
        // console.log(event.clientX+"\s"+event.clientY)
        // console.log(arguments[0].name)
    });
    pollutionRadarCharts.on("mouseout", function(){
        _this.pollutionTipVis = false;
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
                    color : 'rgba(1,255,255,1)'
                }
            }
        },
        xAxis: {
            type: 'category',
            data: [],
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
        series: [{
            data: [],
            type: 'line'
        }],
        grid:{
            top:30,
            bottom:0,
            left:0,
            right:_this.$store.state.view.bigScreen ? 40: 10,
            containLabel:true
        }
    }
    tendencyCharts = echarts.init(document.getElementById('tendencyCharts'));
    tendencyCharts.setOption(tendencyOption);
}
function refreshCharts(item){
    let temp = _.cloneDeep(pollutionRadarCharts.getOption().series[0].data[0]);
    temp.value = [item.heichou, item.nisha, item.lvzao].map(num => _this.$tools.convertExponent(num));
    var option = {
        series: [{
            data : [temp],
        }]
    }
    pollutionRadarCharts.setOption(option);


    function getRandomData(){
        var randomData = _this.$tools.getDateRange(6);
        randomData = _.map(randomData, function(i,index){
            i.value = Math.floor(Math.random()*(100-60+1)+60);
            return i;
        });
        return randomData;
    }

    var seriesOprigin = _.cloneDeep(_this.$store.state.pollutionLegendOptions.filter(i=>i.value == item.pollution_type[0]));
    seriesOprigin.unshift({label:'水质感官指数',colorRGB:'255, 255, 255'});
    var tendencyChartsOption = {
        legend : {

        },
        xAxis:{
            data:_.map(getRandomData(),(i)=>i.label)
        },
        series: _.map(seriesOprigin, item => {
            // var tempColor = item.label == "黑臭水体" ? "$mainColor" : item.colorRGB
            var tempColor = item.colorRGB
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
        }),
        grid : {
            left : 15
        }

    }
    tendencyCharts.setOption(tendencyChartsOption);
    
}
</script>
<style lang="stylus">
    @import "~@/common/common.styl"
    #situation_statistics_detail {
        &.section_common {
            display flex
            flex-direction column
        }
        .part_common{
            padding fitPx(10px) fitPx(20px)
            font-size fitPx(14px)
            clf()
            margin-bottom fitPx(8px)
            // &.box {
            //     border fitPx(1px) dashed rgba($mainColor, 1)
            //     background-color rgba(6,8,18,.9)
            //     border-radius fitPx(5px)
                
            // }
            &.charts_area{
                flex 1 0 0
                display flex
                flex-direction column
                padding-top fitPx(0px)
                padding-bottom fitPx(0px)
                // margin-bottom fitPx(0px)
            }
            .sub_title {
                color rgba($mainColor, 1)
                font-size fitPx(16px)
                font-weight bold
                margin-bottom fitPx(15px)
            }
            
            .radarArea{
                flex 1 0 0
                display flex
                flex-direction column
                $radarWidth = 190px;
                position relative
                #pollutionSensor{
                    flex 1
                    margin 0 auto
                    base($radarWidth)
                    transfS()
                }
                // .pollutionIndicators{
                //     position relative
                    .item{
                        position absolute
                        z-index 1
                        // cursor pointer
                        &:nth-child(1){
                            top calc(15% - 40px)
                            // left (($radarWidth - 112) / 2)
                            left 50%
                            transform translate(-50%)
                        }
                        $bottomLabel = .7;
                        &:nth-child(2){
                            // top $bottomLabel * $radarWidth
                            top 64%
                            calcM(left, 50%, fitPx(190px) / 2)
                            transform translate(-90%)
                        }
                        &:nth-child(3){
                            // top $bottomLabel * $radarWidth
                            top 64%
                            calcM(right, 50%, fitPx(190px) / 2)
                            transform translate(90%)
                        }
                    }
                // }
                // .pollutionTip{
                //     trans(opacity);
                //     &.show{
                //         opacity 1
                //         visibility visible
                //     }
                //     &.hide{
                //         opacity 0
                //         visibility hidden
                //     }
                //     min-width fitPx(130px)
                //     background-color rgba(50, 50, 50, 0.7)
                //     border-radius fitPx(4px)
                //     padding fitPx(8px) fitPx(5px)
                //     position absolute
                //     z-index 2
                //     div{
                //         &:not(:last-child){
                //             margin-bottom fitPx(5px)
                //         }
                //     }
                // }
            }

            .tendencyChartsArea{
                height 100%
                display flex
                flex-direction column
                #tendencyCharts{
                    base(fitPx(350px))
                    flex .25
                }
                .detailBtn{
                    float right
                    color rgba($mainColor,1)
                    font-size fitPx(14px)
                    trans()
                    .arrow{
                        trans()
                        color rgba($mainColor,1)
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
            flex-grow 1
            display flex
            flex-direction column
            justify-content center
            // margin-bottom fitPx(10px)
            .index_items {
                display flex 
                flex-direction row
                justify-content space-around
                .index_item {
                    text-align center
                    >img {
                        base(fitPx(81px), fitPx(81px))
                        // transform scale(1.5,1.5)
                    }
                    >div{
                        &:first-of-type {
                            height fitPx(19px)
                            line-height fitPx(19px)
                        }
                        text-align center
                    }
                }
                &.big {
                    .index_item {
                        display flex
                        flex-direction row
                        flex-grow 1
                        justify-content center
                        >img {
                            // margin-right 5%
                            base(fitPx(150px), fitPx(150px))
                        }
                        .index_content {
                            base(,initial,initial)
                            display flex
                            flex-direction column
                            justify-content space-evenly
                            font-size fitPx(20px)
                            // >div{
                            //     &:first-child{
                            //         margin
                            //     }
                            // }
                        }
                    }
                }
            }
        }
        .intro {
            .exponentCircleBox {
                clf()
                margin-bottom fitPx(15px)
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
                        color rgba($mainColor, 1)
                        text-align center
                    }
                    .score {
                        font-size fitPx(36px)
                        // font-weight bold
                    }
                    .label{
                        font-size fitPx(14px)
                        
                    }
                }
            }
            .pTypeLabel {
                base(50%, 100%, 100%)
                color rgba($mainColor, 1)
                font-size fitPx(26px)
                // text-align center
                margin fitPx(5px) 0 fitPx(10px)
                // font-weight bold
                float left
                padding-top fitPx(31px)
            }
            .comparison {
                height 100px * $multiNum
                display flex
                flex-direction column
                justify-content space-around
                padding-left 200px
                .pTypeLabel_b {
                    font-size fitPx(20px)
                    color rgba($mainColor, 1)
                }
                .comparison_value {
                    &.pNum {
                        color rgba(0, 252, 107, 1)
                    }
                    &.nNum {
                        color rgba(232, 27, 27, 1)
                    }
                }
            }
            >p{
                float left
                display flex
                height fitPx(22px)
                line-height fitPx(22px)
                &:not(.inline){
                    width 50%
                }
                >span{
                    display flex
                    &:first-child {
                        // flex-grow 1
                        width fitPx(95px)
                        padding-right fitPx(10px)
                        display flex
                        justify-content flex-end
                        color rgba(113, 168, 224,1)
                    }
                    &:last-child {
                        // flex-grow 1
                        width calc(100% - fitPx(95px))
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        display inline-block
                    }
                }
                >img {
                    margin-left fitPx(10px)
                }
                &:not(:last-of-type) {
                    margin-bottom fitPx(5px)
                }
            }

        }
        .intro_base {
            display flex
            flex-direction column
            .content {
                padding-left 20%
                flex-grow 1
                display flex
                flex-direction column
                justify-content center
                p {
                    margin-bottom fitPx(10px)
                    span {
                        &:first-child {
                            color rgba(166, 180, 209, 1)
                            display inline-block
                            width fitPx(130px)
                            padding-left fitPx(30px)
                            background-size 12% 100%
                            background-repeat no-repeat
                        }
                    }
                    &:nth-of-type(1) {
                        span:first-child {
                            background-image url('~@/image/rname_ico.png')
                            
                        }
                    }
                    &:nth-of-type(2) {
                        span:first-child {
                            background-image url('~@/image/posi_ico.png')
                        }
                    }
                    &:nth-of-type(3) {
                        span:first-child {
                            background-image url('~@/image/region_ico.png')
                        }
                    }
                    &:nth-of-type(4) {
                        span:first-child {
                            background-image url('~@/image/rtype_ico.png')
                        }
                    }
                    &:nth-of-type(5) {
                        span:first-child {
                            background-image url('~@/image/parea_ico.png')
                        }
                    }
                }
            }
        }
        .tendencyMinMap{
            width 100% !important
            height 800px !important
            // background rgba(27,27,38,.9)
        }
        .el-dialog.tendency_dialog{
            position absolute
            top 50%
            left 50%
            transform translate(-50%,-50%)
            margin 0
            gradientStyle(bottom,rgba(9,43,120,1),rgba(11,12,33,1));
            border fitPx(1px) solid rgba($mainColor, 1)
            .el-dialog__header{
                padding-top 15px
                padding-left 30px
                font-size 16px
                .el-dialog__title{
                    color white
                    font-size 20px
                    font-weight bold
                }
            }
            .el-dialog__body {
                padding-top 5px
            }
        }
        // .el-progress-circle__path {
        //     stroke linear-gradient(right, rgba(20, 162, 236,1),rgba(37, 235, 209,1))
        // }
    }
</style>
