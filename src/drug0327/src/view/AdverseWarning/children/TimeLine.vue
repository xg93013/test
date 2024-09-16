<template>
    <div id="time-line">
        <my-title :title="title" :tips="tips"/>
        <div class="names">(件)</div>
        <div class="chart-box" id="timeChart"></div>
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
            title: '时间趋势',
            tips: '数据统计时间：近3个月',
            timeChart: '',
            mainData: '',
            resizeTimer: ''
        }
    },
    props: {
        timeLineData: {
            type: Array,
            default: []
        }
    },
    watch: {
        timeLineData (newV, oldV) {
            let arr = newV;
            let seriesData = [];
            let xData = [];
            for (let i = 0; i< arr.length; i++) {
                seriesData.push(arr[i].COUNT);
                xData.push(arr[i].ADRDATE);
            }
            this.mainData = {
                seriesData: seriesData,
                xData: xData,
                xAxisName: '(件)',
                toolTipName: '事件数'
            }
            this.initChart();
        }
    },
    created () {},
    methods: {
        initChart () {
            if (this.timeChart !== '') {
                this.timeChart.clear();
            }
            let option = commonConfig.lineChart(this.mainData);
            this.timeChart = this.$echarts.init(document.getElementById('timeChart'));
            this.timeChart.setOption(option);
            window.addEventListener('resize', () => {                
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                this.resizeTimer = setTimeout(() => {
                    this.timeChart.resize();
                }, 300)
            })
        },
        defaultChart () {
            this.mainData = {
                seriesData: [],
                xData: [],
                xAxisName: '(件)',
                toolTipName: '事件数'
            }
            this.initChart();
        }
    },
    mounted () {
        this.defaultChart();
    },
    beforeDestroy () {
        if (this.timeChart) {
            this.timeChart.clear();
        }
    }
}
</script>
<style lang="scss" scoped>
#time-line{
    .chart-box{
        position: absolute;
        top: 32px;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .names{
        position: absolute;
        right: 10px;
        top: 32px;
        font-size: 10px;
    }
}
</style>


