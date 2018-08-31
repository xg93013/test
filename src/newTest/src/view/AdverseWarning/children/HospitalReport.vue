<template>
    <div id="hospital-report">
        <my-title :title="title" />
        <div class="chart-box" id="hospitalChart"></div>
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
            title: '医院上报TOP10',
            hospitalChart: '',
            mainData: '',
            resizeTimer: ''
        }
    },
    created () {
        // this.getData();
    },
    props: {
        reportUnitTop10: {
            type: Array,
            default: []
        }
    },
    watch: {
        reportUnitTop10 (newV, oldV) {
            let arr = newV;
            let seriesData = [];
            let yData = [];
            for (let i = 0; i< arr.length; i++) {
                seriesData.unshift(arr[i].COUNT);
                yData.unshift(arr[i].UNIT);
            }
            this.mainData = {
                seriesData: seriesData,
                yData: yData,
                xAxisName: '(件)',
                toolTipName: '上报事件数'
            }
            // console.log(this.mainData);
            this.initChart();
        }
    },
    methods: {
        getData () {
            let seriesData = [50,20,23,345,346];
            let yData = ['医院1医院1医院1','医院2','医院3','医院4','医院5','医院6','医院7'];
            this.mainData = {
                seriesData: seriesData,
                yData: yData
            }
        },
        initChart () {
            if (this.hospitalChart !== '') {
                this.hospitalChart.clear();
            }
            this.hospitalChart = this.$echarts.init(document.getElementById('hospitalChart'));
            this.hospitalChart.setOption(commonConfig.horBar(this.mainData));
            window.addEventListener('resize', () => {
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                this.resizeTimer = setTimeout(() => {
                    this.hospitalChart.resize();
                }, 300)
            })
        }
    },
    mounted () {
        // this.initChart();
    },
    beforeDestroy () {
        if (this.hospitalChart) {
            this.hospitalChart.clear();
        }
    }
}
</script>
<style lang="scss" scoped>
#hospital-report{
    .chart-box{
        position: absolute;
        top: 32px;
        bottom: 0;
        left: 0;
        right: 0;
    }
}
</style>


