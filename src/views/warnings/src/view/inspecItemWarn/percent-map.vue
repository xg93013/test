<template>
    <div id='percentMap'>
        <span v-show='xdata.length==0'>暂无数据</span>
    </div>
</template>

<script>
import echarts from "echarts";
import http from "../../unit/http";
import apis from "../../unit/apis";
const { I_CAUSERATIO, TIMING } = apis;
export default {
    data() {
        return {
            xdata: [],
            ydata: [],
            datas: [],
            colorData: []
        };
    },
    methods: {
        listWarnMap() {
            let xdata = this.xdata,
                ydata = this.ydata,
                datas = this.datas,
                cdata = this.colorData;
            let myChart = echarts.init(document.getElementById("percentMap"));

            let option = {
                tooltip: {
                    formatter(params) {
                        return (
                            "检出次数：" +
                            params.data +
                            "次<br />占比：" +
                            parseInt(datas[params.dataIndex].zb * 10000) / 100 +
                            "%"
                        );
                    }
                },
                angleAxis: {
                    show: false,
                    max(value) {
                        return value.max * 1.5;
                    }
                },
                radiusAxis: {
                    axisLine: false,
                    type: "category",
                    data: xdata,
                    z: 0,
                    axisLabel: {
                        textStyle: {
                            color: "#DAE6FF",
                            fontSize: "12"
                        }
                    },
                    splitArea: {
                        //坐标轴在 grid 区域中的分隔区域，默认不显示。
                        show: true, //是否显示分隔区域
                        areaStyle: {
                            color: cdata
                            //								color: ['#21304D', '#1D2B46', '#21304D', '#1D2B46', '#21304D', '#1D2B46', '#21304D'],
                        }
                    }
                },
                polar: {},
                series: [
                    {
                        type: "bar",
                        data: ydata,
                        coordinateSystem: "polar",
                        itemStyle: {
                            color: "#DB4141"
                        }
                    }
                ]
            };
            myChart.setOption(option);
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
        async getPercent() {
            let res = await http.get(I_CAUSERATIO);
            this.$emit("closeShowPercent");
            if (res) {
                let data = res.data.reverse();
                this.xdata = [];
                this.ydata = [];
                this.datas = data;
                for (let i = 0; i < data.length; i++) {
                    this.xdata.push(data[i].jyfl);
                    this.ydata.push(data[i].jcs);
                    if (i % 2 == 0) {
                        this.colorData.push("#21304D");
                    } else {
                        this.colorData.push("#1D2B46");
                    }
                }
            }

            if (this.xdata.length > 0) {
                this.listWarnMap();
            }
        }
    },
    mounted() {
        this.getPercent();
        setInterval(() => {
            this.getPercent();
        }, TIMING);
    }
};
</script>

<style lang='scss'>
#percentMap {
    position: relative;
    height: 420px;

    span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>