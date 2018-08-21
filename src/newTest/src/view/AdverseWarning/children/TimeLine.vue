<template>
    <div id="time-line">
        <my-title :title="title" />
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
                toolTipName: '事件数'
            }
            this.initChart();
        }
    },
    created () {},
    methods: {
        // getData () {
        //     this.mainData = {
        //         seriesData: [30, 40, 40, 100, 60, 90,40],
        //         xData: [2016.5,2016.6,2016.7,2016.8,2016.9,2016.10]
        //     }
        // },
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
        }
    },
    mounted () {},
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
}
</style>


