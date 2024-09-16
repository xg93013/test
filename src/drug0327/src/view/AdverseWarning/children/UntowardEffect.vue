<template>
    <div id="untoward-effect">
        <my-title :title="title">
            <div slot="leftDown">
                <el-dropdown trigger="click" @command="selectDown" placement="bottom-start">
                    <div class="down-btn">
                        {{ dropDownSelect }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item" v-for="(item, index) in dropDownList" :key="index">{{item}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </my-title>
        <div class="out-box">
            <div class="left" id="untowardChart"></div>
            <div class="right">
                <div class="info-item sex-info">
                    <div class="title sex-title">性别分布</div>
                    <div class="sex-bar">
                        <span class="bar-item left">男</span>
                        <el-tooltip placement="top" popper-class="popperClass" v-if="genderBarData.male.name && genderBarData.female.name">
                            <div class="bar-item main-bar">
                                <div class="progressBar male" :style="{width:genderBarData.male.percent}"></div>
                                <div class="progressBar female" :style="{width:genderBarData.female.percent}"></div>                 
                            </div>
                            <div slot="content" class="tooltip-text">
                                <p style="font-size:12px;">{{ genderBarData.male.content }}</p>
                                <p style="font-size:12px;">{{ genderBarData.female.content }}</p>
                            </div>
                        </el-tooltip>
                        <div class="bar-item main-bar" v-else></div>
                        <span class="bar-item right">女</span>
                    </div>
                </div>
                <div class="info-item age-info">
                    <div class="title age-title">年龄分布</div>
                    <div class="info-chart" id="ageBar"></div>
                </div>
                <div class="info-item other-info">
                    <div class="title other-title">相关重要信息</div>
                    <div class="info-chart" id="otherPie"></div>
                    <div class="empty-msg">暂无相关重要信息</div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import MyTitle from '@/components/MyTitle';
import commonConfig from '@/js/common.js';
export default {
    components:{
        MyTitle
    },
    data () {
        return {
            title: '不良反应事件累计分析',
            mainChart: '',
            ageBar: '',
            otherPie: '',
            mainData: '',
            genderBarData: {
                male: {
                    name: '',
                    percent: '',
                    content: ''
                },
                female: {
                    name: '',
                    percent: '',
                    content: ''
                }
            },
            ageBarData: '',
            importantBarData: '',
            dropDownList: [],
            dropDownSelect: '请选择类型',
            resizeTimer: ''
        }
    },
    created () {},
    props: ['dropDownData', 'analysisData', 'genderData', 'ageData', 'importantData'],
    watch: {
        dropDownData(newV){
            this.dropDownList = newV;
            this.dropDownSelect = this.dropDownList[0];
        },
        analysisData (newV) {
            let arr = newV;
            this.mainData = {
                seriesData: [],
                yData: [],
                xAxisName: '(件)',
                toolTipName: '事件数'
            }
            for (let i = 0;i< arr.length; i++) {
                this.mainData.seriesData.unshift(arr[i].COUNT);
                this.mainData.yData.unshift(arr[i].DRUGNAME);
            }
            this.initChart();
            this.addResize();
        },
        genderData (newV) {
            // console.log(newV);
            let arr = newV;
            let sum = arr[0].COUNT + arr[1].COUNT;
            if (arr[0].COUNT && arr[0].GENDER) {
                for (let i = 0;i< arr.length; i++) {
                    let keyName = ''
                    if (i === 0) {
                        keyName = 'male';
                    } 
                    if (i === 1) {
                        keyName = 'female';
                    }
                    this.genderBarData[keyName].name = arr[i].GENDER;
                    this.genderBarData[keyName].percent = (arr[i].COUNT / sum * 100).toFixed(2) + '%';
                    this.genderBarData[keyName].content = arr[i].GENDER + '：' + arr[i].COUNT + '件，' + this.genderBarData[keyName].percent;
                }
            } else {
                this.genderBarData =  {
                    male: {
                        name: '',
                        percent: '',
                        content: ''
                    },
                    female: {
                        name: '',
                        percent: '',
                        content: ''
                    }
                }
            }
        },
        ageData (newV) {
            let arr = newV;
            this.ageBarData = {
                seriesData: [],
                xData: [],
                toolTipName: '人数'
            };
            for (let i = 0; i< arr.length;i++) {
                this.ageBarData.xData.push(arr[i].AGEZONE);
                this.ageBarData.seriesData.push(arr[i].COUNT);
            }
            // console.log(this.ageBarData);
            this.initAgeBar();
            this.addResize();
        },
        importantData (newV) {
            let arr = newV;
            this.importantBarData = {
                roseType: 'radius',
                toolTipName: '事件数',
                seriesData: []
            };
            for (let i = 0;i < arr.length; i++) {
                let oneJson = {}
                oneJson.name = arr[i].IMPORTANT;
                oneJson.value = arr[i].COUNT;
                this.importantBarData.seriesData.push(oneJson);
            }
            this.initOtherPie();
            this.addResize();
        }
    },
    methods: {
        selectDown (item) {
            this.dropDownSelect = item;
            this.$emit('selectDropDown', item);
        },
        // 主要药品分布
        initChart () {
            if (this.mainChart !== '') {
                this.mainChart.clear();
            }
            let option = commonConfig.horBar(this.mainData);
            this.mainChart = this.$echarts.init(document.getElementById('untowardChart'));
            this.mainChart.setOption(option);
            this.mainChart.on('click', (params)=>{
                // console.log(params)
                this.$emit('selectDrug', params.name);
            })
        },
        initAgeBar () {
            if (this.ageBar !== '') {
                this.ageBar.clear();
            }
            let option = commonConfig.normalBar(this.ageBarData);
            this.ageBar = this.$echarts.init(document.getElementById('ageBar'));
            this.ageBar.setOption(option);
        },
        initOtherPie () {
            if (this.otherPie !== '') {
                this.otherPie.clear();
            }
            let option = commonConfig.normalPie(this.importantBarData);
            this.otherPie = this.$echarts.init(document.getElementById('otherPie'));
            this.otherPie.setOption(option);
        },
        addResize () {
            if (this.mainChart && this.ageBar && this.otherPie) {
                window.addEventListener('resize', () => {
                    if (this.resizeTimer) {
                        clearTimeout(this.resizeTimer);
                    }
                    this.resizeTimer = setTimeout(() => {
                        this.mainChart.resize();
                        this.ageBar.resize();
                        this.otherPie.resize();
                    }, 300)
                    
                })
            }
        },
        initAllChart () {
            this.initChart();
            this.initAgeBar();
            this.initOtherPie();
            this.addResize();
        },
        defaultChart () {
            this.mainData = {
                seriesData: [],
                yData: [],
                xAxisName: '(件)',
                toolTipName: '事件数'
            }
            this.ageBarData = {
                seriesData: [],
                xData: [],
                toolTipName: '人数'
            }
            this.importantBarData = {
                roseType: 'radius',
                toolTipName: '事件数',
                seriesData: []
            }
            this.initAllChart();
        }
    },
    mounted () {
        this.defaultChart();
    },
    beforeDestroy () {
        if (this.mainChart && this.ageBar && this.otherPie) {
            this.mainChart.clear();
            this.ageBar.clear();
            this.otherPie.clear();
        }
    }
}
</script>
<style lang="scss" scoped>
#untoward-effect{
    .down-btn{
        display: block;
        // width: 120px;
        padding: 0 8px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #0099FF;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        transition: all 0.3s;
        cursor: pointer;
        &:hover{
            background: #1E73FF;
        }
    }
    .out-box{
        position: absolute;
        top: 32px;
        bottom: 0;
        left: 0;
        right: 0;
        .left{
            width: 60%;
            height: 100%;
            float: left;
        }
        .right {
            width: 40%;
            height: 100%;
            padding: 0 20px;
            float: left;
            .info-item{
                width: 100%;
                position: relative;
                .title{
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    padding-left: 30px;
                    font-size: 16px;
                    color: #A0D2FF;
                    &.sex-title{
                        background: url(../../../images/sex.png) 8px 8px no-repeat;
                    }
                    &.age-title{
                        background: url(../../../images/age.png) 6px 8px no-repeat;
                    }
                    &.other-title{
                        background: url(../../../images/other.png) 6px 8px no-repeat;
                    }
                }
                .info-chart{
                    width: 100%;
                    height: 100%;
                }
            }
            .sex-info{
                height: 20%;
                .sex-bar{
                    width: 100%;
                    margin-top: 20px;
                    height: 18px;
                    position: relative;
                    font-size: 12px;
                    .bar-item{
                        display: block;
                        height: 18px;
                        line-height: 18px;
                        position: absolute;
                        top: 0;
                        text-align: center;
                    }
                    .left{
                        width: 30px;
                        left: 0;
                    }
                    .right{
                        width: 30px;
                        right: 0;
                    }
                    .main-bar{
                        left: 30px;
                        right: 30px;
                        height: 18px;
                        overflow: hidden;
                        background: #01217A;
                        border-radius: 2px;
                        .progressBar{
                            height: 18px;
                            float: left;
                            transition: all 0.5s;
                            cursor: pointer;
                        }
                        .male{
                            background: #1E73FF;
                            border-radius: 2px 0 0 2px;
                        }
                        .female{
                            background: #4BE330;
                            border-radius: 0 2px 2px 0;
                        }
                    }
                }
            }
            .age-info{
                height: 35%;
            }
            .other-info{
                height: 45%;
            }
        }
    }
    .popperClass{
        background: "rgba(142,253,255,0.7)";
        color: #fff;
        font-size: 12px;
    }
}
</style>



