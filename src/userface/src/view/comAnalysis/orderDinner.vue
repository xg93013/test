<template>
    <div class="charts">
        <div class="charts-title">
            网络订餐平台对比
        </div>
        <div id="orderDinner">

        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import { throttle } from "@/unit/pub";
import { mapState } from "vuex";
export default {
    data() {
        return {
            color: "#666",
            lineColor: "#eee",
            lengedData: [],
            totalDatas: [],
            illegalDatas: [],
            myChart: null,
            selected: {
                监测商家数: true,
                违规商家数: true
            }
        };
    },
    computed: {
        ...mapState({
            isFullScreen: state => state.isFullScreen
        })
    },
    methods: {
        init() {
            this.myChart = echarts.init(document.getElementById("orderDinner"));
            this.myChart.on("legendselectchanged", e => {
                this.selected = { ...e.selected };
            });
            this.myChart.on("click", e => {
                if (
                    this.$store.state.userMsg.permissions.includes(
                        "CERT_ANALYSIS"
                    )
                ) {
                    //如果有证照分析权限
                    if (this.isFullScreen) {
                        this.$emit("outFullScreen");
                    }
                    this.$nextTick(() => {
                        if (e.name == "饿了么星选") {
                            this.$emit("init", "bd");
                            this.$router.push("bd");
                        } else if (e.name == "美团外卖") {
                            this.$emit("init", "mt");
                            this.$router.push("mt");
                        } else if (e.name == "饿了么") {
                            this.$emit("init", "elm");
                            this.$router.push("elm");
                        }
                    });
                }
            });
            window.addEventListener("resize", throttle(this.myChart.resize));
        },
        getData(res) {
            this.lengedData = [];
            this.totalDatas = [];
            this.illegalDatas = [];
            res.forEach(item => {
                if (item.platformType == "MEI_TUAN_WM") {
                    this.lengedData.push("美团外卖");
                }
                if (item.platformType == "ELE_ME_WM") {
                    this.lengedData.push("饿了么");
                }
                if (item.platformType == "BAIDU_WM") {
                    this.lengedData.push("饿了么星选");
                }
                this.totalDatas.push(item.totalCount);
                this.illegalDatas.push(item.illegalCount);
            });
            this.$nextTick(() => {
                this.getCharts();
            });
        },
        getCharts() {
            let option = {
                tooltip: {
                    trigger: "axis"
                },
                grid: {
                    left: "10",
                    right: "10",
                    bottom: "10",
                    top: "34",
                    containLabel: true
                },
                legend: {
                    data: ["监测商家数", "违规商家数"],
                    itemWidth: 12,
                    itemHeight: 12,
                    right: "10%",
                    textStyle: {
                        //图例文字的样式
                        color: this.color,
                        fontSize: 13
                    },
                    selected: this.selected
                },
                xAxis: [
                    {
                        type: "category",
                        data: this.lengedData,
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: this.lineColor
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: this.color,
                                fontSize: "12"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: this.color,
                                fontSize: "12"
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: this.lineColor
                            }
                        },
                        splitLine: {
                            show: true, // 网格线是否显示
                            //  改变样式
                            lineStyle: {
                                color: this.lineColor // 修改网格线颜色
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: "监测商家数",
                        type: "bar",
                        barWidth: 30,
                        data: this.totalDatas,
                        itemStyle: {
                            normal: {
                                color: "#40A42B",
                                label: {
                                    show: true,
                                    position: "top"
                                }
                            }
                        }
                    },
                    {
                        name: "违规商家数",
                        type: "bar",
                        barWidth: 30,
                        data: this.illegalDatas,
                        itemStyle: {
                            normal: {
                                color: "#CB4512",
                                label: {
                                    show: true,
                                    position: "top"
                                }
                            }
                        }
                    }
                ]
            };
            this.myChart.setOption(option, true);
        }
    },
    beforeDestroy() {
        this.myChart.clear();
    },
    mounted() {
        this.init();
    },
    props: {
        orderDinner: {
            type: Array,
            default: []
        }
    },
    watch: {
        isFullScreen(a, b) {
            if (a) {
                this.color = "#fff";
                this.lineColor = "#333969";
            } else {
                this.color = "#666";
                this.lineColor = "#eee";
            }
            this.$nextTick(() => {
                this.getCharts();
                setTimeout(() => {
                    this.myChart.resize();
                }, 100);
            });
        },
        orderDinner(a, b) {
            this.getData(a);
        }
    }
};
</script>

<style lang="scss">
#orderDinner {
    position: absolute;
    width: 100%;
    left: 0;
    top: 50px;
    bottom: 0;
}
</style>