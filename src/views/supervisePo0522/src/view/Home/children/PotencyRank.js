import React from "react";
import echarts from "echarts"
import { throttle } from "../../../unit/pub";

const color = ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    getCharts() {
        let chart = echarts.init(document.getElementById('potency-rank'));
        let data = [{
            name: '高',
            value: 20,
            props: [{
                name: '高新区',
                value: 10
            }]
        }, {
            name: '较高',
            value: 20,
            props: [{
                name: '高新区',
                value: 10
            }]
        }, {
            name: '一般',
            value: 20,
            props: [{
                name: '高新区',
                value: 10
            }]
        }, {
            name: '低',
            value: 20,
            props: [{
                name: '高新区',
                value: 10
            }]
        }];
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    let html = `综合效能等级：<span>${params.name}</span><br/>`;
                    html += `区县数量：<span>${params.value}</span><br/>`;
                    if (params.data.props && params.data.props.length > 0) {
                        params.data.props.forEach((item, index) => {
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
