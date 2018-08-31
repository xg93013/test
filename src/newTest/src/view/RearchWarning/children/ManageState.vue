<template>
    <div id="manage-state">
        <my-title :title="title" />
        <div class="chart-box">
            <div class="pie-box" id="left-pie"></div>
            <div class="pie-box" id="right-pie"></div>
        </div>
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
            title: '办理状态',
            leftPie: '',
            rightPie: '',
            leftPieData: '',
            rightPieData: '',
            resizeTimer: ''
        }
    },
    props: {
        manageStateData: {
            type: Array,
            default: []
        }
    },
    watch: {
        manageStateData (newV) {
            this.getData(newV);
            this.initAllChart();
        }
    },
    created () {},
    methods: {
        getData (arr) {
            if (arr.length > 0) {
                this.leftPieData = {
                    radius: ['22%', '42%'],
                    colors: ["#1589F4", "#23CDAB"],
                    showLabel: true,
                    labelPadding: [0, 0, 0, 40],
                    seriesData: [{
                        name: '已办理',
                        value: arr[0].APPROVEDCOUNT,
                        selected: true
                    },{
                        name: '办理中',
                        value: arr[0].UNAPPROVECOUNT
                    }]
                }
                this.rightPieData = {
                    radius: ['35%', '60%'],
                    colors: ["#DF5A76", "#1589F4"],
                    showLabel: true,
                    labelPadding: [0, 0, 0, 45],
                    seriesData: [{
                        name: '审核不通过',
                        value: arr[0].UNPASSCOUNT
                    },{
                        name: '审核通过',
                        value: arr[0].PASSCOUNT
                    }]
                }
            }       
        },
        initLeftPie () {
            if (this.leftPie !== '') {
                this.leftPie.clear();
            }
            let option = commonConfig.normalPie(this.leftPieData);
            this.leftPie = this.$echarts.init(document.getElementById('left-pie'));
            this.leftPie.setOption(option);
            this.leftPie.dispatchAction({
                type: 'highlight',
                seriesIndex: '0',
                dataIndex: 0
            })
            // this.leftPie.dispatchAction({
            //     type: 'showTip',
            //     seriesIndex: '0',
            //     dataIndex: 0
            // })
            this.leftPie.on('mouseout', () => {
                this.leftPie.dispatchAction({
                    type: 'highlight',
                    seriesIndex: '0',
                    dataIndex: 0
                })
                // this.leftPie.dispatchAction({
                //     type: 'showTip',
                //     seriesIndex: '0',
                //     dataIndex: 0
                // })
            })
            this.leftPie.on('click', (params) => {
                // console.log(params);
                // this.initRightPie();
            })
        },
        initRightPie () {
            if (this.rightPie !== '') {
                this.rightPie.clear();
            }
            let option = commonConfig.normalPie(this.rightPieData);
            this.rightPie = this.$echarts.init(document.getElementById('right-pie'));
            this.rightPie.setOption(option);
        },
        initAllChart () {
            this.initLeftPie();
            this.initRightPie();
            this.addReise();
        },
        addReise () {
            if (this.leftPie && this.rightPie) {
                window.addEventListener('resize', () => {
                    if (this.resizeTimer) {
                        clearTimeout(this.resizeTimer);
                    }
                    this.resizeTimer = setTimeout(() => {
                        this.leftPie.resize();
                        this.rightPie.resize();
                    }, 300)
                })
            }
        }
    },
    mounted () {},
    beforeDestroy () {
        if (this.leftPie && this.rightPie) {
            this.leftPie.clear();
            this.rightPie.clear();
        }
    }
}
</script>
<style lang="scss" scoped>
#manage-state{
    width: 100%;
    .chart-box{
        position: absolute;
        top: 70px;
        bottom: 0;
        left: 20px;
        right: 20px;
        overflow: hidden;
        .pie-box{
            width: 50%;
            height: 100%;
            float: left;
        }
    }
}
</style>


