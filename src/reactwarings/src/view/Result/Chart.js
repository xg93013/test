import React from "react";
import echarts from "echarts";
import { throttle } from "../../unit/pub";

class Chart extends React.Component {

    getCharts(datas) {
        let xData = [],
            seriesData = [];
        datas.forEach(item => {
            xData.push(item.area);
            seriesData.push(item.count)
        })
        let chart = echarts.init(document.getElementById("chart"));
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: 60,
                top: 40,
                bottom: 60,
                right: 40
            },
            xAxis: {
                data: xData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#ccc"
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 15,
                        color: "#666"
                    },
                    rotate: 45
                }
            },
            yAxis: {
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#ccc"
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 16,
                        color: "#666"
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ccc',
                        type: "dashed",
                        width: 1,
                    }
                }
            },
            series: [{
                type: "bar",
                barWidth: 26,
                data: seriesData,
                itemStyle: {
                    normal: {
                        barBorderRadius: [13, 13, 0, 0],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#21ACFB' },
                                // { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#1A6EDA' }
                            ]
                        )
                    }
                }
            }]
        }
        chart.setOption(option, true);
        window.addEventListener("resize", throttle(chart.resize))
    }

    render() {
        return (
            <div className="chart">
                <div id="chart"></div>
            </div>
        )
    }
}

export default Chart