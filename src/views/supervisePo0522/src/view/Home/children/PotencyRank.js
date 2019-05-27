import React from "react";
import echarts from "echarts"
import { throttle } from "../../../unit/pub";

const color = ["#0F6CD4", "#2C8FEC", "#71C2FA", "#A8DDFF"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    getCharts(data) {
        let chart = echarts.init(document.getElementById('potency-rank'));
        data[0].label = {
            show: true,
            formatter: "等级：{b}\n占比：{c}%"
        }
        data[0].labelLine = {
            show: true
        }
        data[0].emphasis = {
            label: {
                show: true
            },
            labelLine: {
                show: true,
            }
        }
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    let html = `综合效能等级：<span>${params.name}</span><br/>`;
                    html += `区县数量：<span>${params.value}</span><br/>`;
                    if (params.data.areas && params.data.areas.length > 0) {
                        params.data.areas.forEach((item, index) => {
                            html += `<span>${item.name}：${item.value}</span><br/>`;
                        })
                    }
                    return html;
                }
            },
            color: color,
            grid: {
                left: 50,
                right: 50,
                bottom: 50,
                top: 60,
                containLabel: true
            },
            legend: {
                right: 10,
                top: 0,
                orient: 'vertical',
                show: true,
                color: color,
                formatter: (params) => {
                    let html = "";
                    html += '等级：' + params
                    return html
                },
                itemWidth: 14,
                itemHeight: 14,
                textStyle: {
                    color: "#323232"
                }
            },
            toolbox: {
                show: false
            },
            series: [{
                type: "pie",
                center: ['50%', '50%'],
                radius: ['55%', '80%'],
                data: data,
                label: {
                    show: false
                },
                labelLine: {
                    show: false,
                }
            }]
        };
        chart.setOption(option);
        window.addEventListener("resize", throttle(chart.resize));
    }
    componentDidMount() {
        // this.getCharts();
    }

    render() {
        return (
            <div className="chart">
                <div className="title">各区县综合效能等级分布</div>
                <div className="box" id="potency-rank"></div>
            </div>
        )
    }

}

export default Index
