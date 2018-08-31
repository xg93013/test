<template>
    <div id="moreline-box">
        <my-title :title="title" />
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
    created () {
        // this.getData();
    },
    methods: {
        getData (arr) {
            this.mainData = {
                toolTipName: '事件',
                seriesData: [],
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
            // this.mainData.seriesData = [{
            //     name: '积极',
            //     data: [20, 30, 50, 0, 0]
            // },{
            //     name: '消极',
            //     data: [30, 50, 80, 0, 0]
            // }]
            this.mainData.seriesData = [aSeries, rSeries];
            // this.mainData.xData = ['2016.10', '2016.11', '2016.12', '2016.13', '2018.11']
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
        }
    },
    mounted () {
        // this.initChart();
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
}
</style>


