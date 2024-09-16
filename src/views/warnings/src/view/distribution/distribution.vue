<template>
    <div class='warn-list'>
        <div class='warn-list-box'>
            <div class='list-title'></div>
            <div class='list-content'>
                <div style='line-height:30px;padding:5px 20px 0 20px'>成都流出不合格食品分布</div>
                <div id='distribution'>
                </div>
            </div>
        </div>
        <distributionModal ref='distributionModal' />
    </div>
</template>

<script>
import echarts from "echarts";
import "echarts/map/js/china.js";
import distributionModal from "./distribution-modal.vue";
import cityJson from "../../unit/cityInfo.json";
import http from "../../unit/http";
import apis from "../../unit/apis";
const { OUTFLOW_LIST, TIMING } = apis;
export default {
    data() {
        return {
            CDData: [],
            citys: []
        };
    },
    components: {
        distributionModal
    },
    methods: {
        getDistributData(e) {
            this.$refs.distributionModal.modalShow(e);
        },
        getDatas() {
            let myChart = echarts.init(document.getElementById("distribution"));
            var geoCoordMap = cityJson;

            var CDData = this.CDData;

            var planePath =
                "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

            var convertData = function(data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var fromCoord = geoCoordMap[dataItem[0].name];
                    var toCoord = geoCoordMap[dataItem[1].name];
                    if (fromCoord && toCoord) {
                        res.push({
                            fromName: dataItem[0].name,
                            toName: dataItem[1].name,
                            coords: [fromCoord, toCoord]
                        });
                    }
                }
                return res;
            };

            var color = ["#0598FF"];
            var series = [];
            [["成都", CDData]].forEach(function(item, i) {
                series.push(
                    {
                        name: item[0] + " Top10",
                        type: "lines",
                        zlevel: 1,
                        effect: {
                            show: false,
                            period: 6,
                            trailLength: 0.7,
                            color: "#0598FF",
                            symbolSize: 3
                        },
                        lineStyle: {
                            normal: {
                                color: "#05D7FD",
                                width: 3,
                                curveness: 0.2
                            }
                        },
                        data: convertData(item[1])
                    },
                    {
                        name: item[0] + " Top10",
                        type: "lines",
                        zlevel: 2,
                        symbol: ["none", "arrow"],
                        symbolSize: 10,
                        effect: {
                            show: false,
                            period: 6,
                            trailLength: 0,
                            symbol: "none",
                            symbolSize: 15
                        },
                        lineStyle: {
                            normal: {
                                color: color[i],
                                width: 1,
                                opacity: 0.6,
                                curveness: 0.2
                            }
                        },
                        data: convertData(item[1])
                    },
                    {
                        name: item[0] + " Top10",
                        type: "effectScatter",
                        coordinateSystem: "geo",
                        zlevel: 2,
                        rippleEffect: {
                            brushType: "stroke"
                        },
                        label: {
                            normal: {
                                show: true,
                                position: "right",
                                formatter: "{b}"
                            }
                        },
                        symbolSize: function(val) {
                            return val[2] / 8;
                        },
                        itemStyle: {
                            normal: {
                                color: color[i]
                            }
                        },
                        data: item[1].map(function(dataItem) {
                            return {
                                name: dataItem[1].name,
                                value: geoCoordMap[dataItem[1].name].concat([
                                    dataItem[1].value
                                ])
                            };
                        })
                    }
                );
            });

            let option = {
                formatter(value) {},
                backgroundColor: "#1B223E",
                title: {
                    left: "center",
                    textStyle: {
                        color: "#fff"
                    }
                },
                tooltip: {
                    trigger: "item"
                },
                geo: {
                    map: "china",
                    // zoom: 7,
                    // center:[103.9526,30.7617],
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: "#233857",
                            borderColor: "#2A4268"
                        },
                        emphasis: {
                            areaColor: "#404864"
                        }
                    }
                },
                series: series
            };
            myChart.setOption(option);
            myChart.on("click", params => {
                let data = this.citys[params.dataIndex].qySq;
                if (params.componentType == "series" && params.name) {
                    this.getDistributData(data);
                }
            });
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
        async getFlowOut() {
            let res = await http.get(OUTFLOW_LIST);
            if (res) {
                this.citys = [...res.data];
                this.CDData = [];
                for (let i of res.data) {
                    this.CDData.push([
                        {
                            name: "成都市"
                        },
                        {
                            name: i.qySq,
                            value: 50
                        }
                    ]);
                }
            }
            this.getDatas();
        }
    },
    mounted() {
        this.getFlowOut();
        setInterval(() => {
            this.getFlowOut();
        }, TIMING);
    }
};
</script>

<style lang='scss' scoped>
.list-title {
    position: relative;
    &:after {
        position: absolute;
        left: -10px;
        top: 0;
        bottom: 0;
        width: 10px;
        content: "";
        background: #11162a;
    }
}

#distribution {
    height: 420px;
}
</style>