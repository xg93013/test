<template>
    <div id="area-distribute">
        <my-title :title="title" />
        <div class="chart-box" id="area-chart"></div>
    </div>
</template>
<script>
import MyTitle from '@/components/MyTitle';
import * as _ from 'lodash';
import areaMapConfig from '@/js/areaMap.js';
export default {
    components: {
        MyTitle
    },
    data () {
        return {
            title: '区域分布',
            areaChart: '',
            mainData: '',
            resizeTimer: ''
        }
    },
    created () {},
    props: {
        distributeData: {
            type: Array,
            default: []
        }
    },
    watch: {
        distributeData (newV) {
            this.getData(newV);
            this.initAreaChart();
        }
    },
    methods: {
        getData (arr) {
            // max arr
            let inMaxArr = [];
            this.mainData = {
                mapName: 'fujian',
                toolTipName: '',
                visualMapMax: 0,
                seriesData: [{
                    name: '已审',
                    data: []
                },{
                    name: '收件',
                    data: []
                }]
            }
            for (let i = 0; i < arr.length; i++) {
                let oneAMap = {};
                let oneRMap = {};
                oneAMap.name = arr[i].CITY;
                oneAMap.value = arr[i].ACOUNT;
                oneRMap.name = arr[i].CITY;
                oneRMap.value = arr[i].RCOUNT;
                this.mainData.seriesData[0].data.push(oneAMap);
                this.mainData.seriesData[1].data.push(oneRMap);
            }
            for (let i = 0; i < this.mainData.seriesData.length; i++) {
                let inData = this.mainData.seriesData[i].data;
                for (let i = 0; i< inData.length; i++) {
                    inMaxArr.push(inData[i].value);
                }
            }
            this.mainData.visualMapMax = _.max(inMaxArr);
        },
        initAreaChart () {
            if (this.areaChart !== '') {
                this.areaChart.clear();
            }
            let option = areaMapConfig.normalMap(this.mainData);
            this.areaChart = this.$echarts.init(document.getElementById('area-chart'));
            this.areaChart.setOption(option);
            window.addEventListener('resize', ()=>{
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                this.resizeTimer = setTimeout(() => {
                    this.areaChart.resize();
                }, 300)
            })
        }
    },
    mounted () {
        // this.initAreaChart();
    },
    beforeDestroy () {
        if (this.areaChart) {
            this.areaChart.clear();
        }
    }
}
</script>
<style lang="scss" scoped>
#area-distribute{
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

