import React from "react";
import echarts from "echarts"
import { throttle } from "../../../unit/pub";
import PotencyModal from "./PotencyModal";

const color = ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    getCharts() {
        let chart = echarts.init(document.getElementById('potency-sort'));
        let data = [{
            name: '本期综合效能值',
            type: 'bar',
            barWidth: "15%",
            data: [{
                name: '高新区',
                value: 1000
            }, {
                name: '青羊区',
                value: 600
            }, {
                name: '武侯区',
                value: 10
            }, {
                name: '双流区',
                value: 10
            }, {
                name: '成华区',
                value: 10
            }, {
                name: 'a区',
                value: 10
            }, {
                name: 'b区',
                value: 10
            }, {
                name: 'c区',
                value: 10
            }, {
                name: 'd区',
                value: 10
            }],
            itemStyle: {
                color: color[0]
            }
        }, {
            name: '上期综合效能值',
            type: 'bar',
            barWidth: "15%",
            barGap: 0,
            data: [{
                name: '高新区',
                value: 20
            }, {
                name: '青羊区',
                value: 800
            }, {
                name: '武侯区',
                value: 10
            }, {
                name: '双流区',
                value: 10
            }, {
                name: '成华区',
                value: 30
            }, {
                name: 'a区',
                value: 10
            }, {
                name: 'b区',
                value: 10
            }, {
                name: 'c区',
                value: 10
            }, {
                name: 'd区',
                value: 10
            }],
            itemStyle: {
                color: color[1]
            }
        }];
        let xData = ['高新区', '青羊区', '武侯区', '双流区', '成华区', 'a', 'b', 'c', 'd'];
        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    let html = `<span>${params[0].name}</span><br/>`;
                    html += `<span>本期效能综合：90&emsp;排名：10</span><br/>`;
                    html += `<span>上期效能综合：90&emsp;排名：10</span><br/>`;
                    return html;
                }
            },
            color: color,
            grid: {
                left: 15,
                right: 120,
                bottom: 15,
                top: 15,
                containLabel: true
            },
            legend: {
                right: 15,
                top: 0,
                orient: 'vertical',
                show: true,
                data: ['本期综合效能值', '上期综合效能值'],
                color: color
            },
            toolbox: {
                show: false
            },
            xAxis: {
                type: 'category',
                boundaryGap: [10, 20],
                data: xData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: '',
                position: 'left',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                }
            },

            series: data,
        };
        chart.setOption(option);
        window.addEventListener("resize", throttle(chart.resize));
        chart.on('click', (e) => {
            this.refs.modalRefs.showModal(e.name);
        })
    }
    componentDidMount() {
        // this.getCharts();
    }
    hideModal() {
        this.setState({
            visible: false
        })
    }
    render() {
        return (
            <div className="chart">
                <div className="title">各区县监管效能排序</div>
                <div className="box" id="potency-sort"></div>
                <PotencyModal ref="modalRefs" />
            </div>
        )
    }

}

export default Index
