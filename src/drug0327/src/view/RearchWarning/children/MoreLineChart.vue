<template>
    <div id="moreline-box">
        <my-title :title="title" />
        <div class="names">(件)</div>
        <div class="chart-box" id="morelineChart"></div>
    </div>
</template>
<script>
import MyTitle from '@/components/MyTitle';
import commonConfig from '@/js/common.js';
export default {
    components: {
        MyTitle
    },
    data () {
        return {
            title: '时间趋势',
            moreLineChart: '',
            mainData: '',
            resizeTimer: ''
        }
    },
    props: {
        moreLineData: {
            type: Array,
            default: []
        }
    },
    watch: {
        moreLineData (newV) {
            // console.log(newV);
            this.getData(newV);
            this.initChart();
        }
    },
    created () {},
    methods: {
        getData (arr) {
            this.mainData = {
                toolTipName: '事件',
                seriesData: [],
                xAxisName: '(件)',
                xData: []
            }
            let aSeries = {
                name: '收件',
                data: []
            };
            let rSeries = {
                name: '办结',
                data: []
            };
            for (let i = 0; i < arr.length; i++) {
                aSeries.data.push(arr[i].ACOUNT);
                rSeries.data.push(arr[i].RCOUNT);
                this.mainData.xData.push(arr[i].DATEVALUE);
            }

            this.mainData.seriesData = [aSeries, rSeries];
        },
        initChart () {
            if (this.moreLineChart !== '') {
                this.moreLineChart.clear();
            }
            let option = commonConfig.moreLinesChart(this.mainData);
            this.moreLineChart = this.$echarts.init(document.getElementById('morelineChart'));
            this.moreLineChart.setOption(option);
            window.addEventListener('resize', () => {
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                this.resizeTimer = setTimeout(() => {
                    this.moreLineChart.resize();
                }, 300)
            })
        },
        defaultChart () {
            this.mainData = {
                toolTipName: '事件',
                seriesData: [],
                xAxisName: '(件)',
                xData: []
            }
            this.initChart();
        }
    },
    mounted () {
        this.defaultChart();
    },
    beforeDestroy () {
        if (this.moreLineChart) {
            this.moreLineChart.clear();
        }
    }
}
</script>
<style lang="scss" scoped>
#moreline-box{
    width: 100%;
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


