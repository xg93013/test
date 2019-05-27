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
    getCharts(arr) {
        let chart = echarts.init(document.getElementById('potency-sort'));
        let sorta = [...arr[0].data].sort((a, b) => {
            return b.value - a.value
        })
        let sortb = [...arr[1].data].sort((a, b) => {
            return b.value - a.value
        })
        let max = sorta[0].value > sortb[0].value ? sorta[0].value : sortb[0].value;
        let xData = [];
        let maxArr = [];
        arr[0].data.forEach(item => {
            maxArr.push(max);
            xData.push(item.name);
        })
        let data = [{
            name: '本期综合效能值',
            type: 'bar',
            barWidth: 10,
            xAxisIndex: 0,
            data: arr[0].data,
            z: 3,
            itemStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: "#6ACBF6" // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: "#1282FF" // 100% 处的颜色
                        }
                    ]
                },
                barBorderRadius: [5, 5, 0, 0]
            }
        }, {
            name: '上期综合效能值',
            type: 'bar',
            barWidth: 10,
            xAxisIndex: 0,
            z: 4,
            barGap: "100%",
            data: arr[1].data,
            itemStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: "#FFD050" // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: "#FD973C" // 100% 处的颜色
                        }
                    ]
                },
                barBorderRadius: [5, 5, 0, 0]
            }
        }, {
            name: '本期综合效能值',
            type: 'bar',
            data: maxArr,
            barWidth: 10,
            xAxisIndex: 1,
            z: 2,
            itemStyle: {
                color: '#E7EBEE',
                barBorderRadius: [5, 5, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    color: '#E7EBEE'
                }
            }
        }, {
            name: '上期综合效能值',
            type: 'bar',
            color: '#E7EBEE',
            xAxisIndex: 1,
            data: maxArr,
            barWidth: 10,
            barGap: "100%",
            z: 2,
            itemStyle: {
                color: '#E7EBEE',
                barBorderRadius: [5, 5, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    color: '#E7EBEE'
                }
            }
        }];
        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    let html = `<span>${params[0].name}</span><br/>`;
                    if(params.length == 2) {
                        html += `<span>${params[0].seriesName}：${params[0].data.others ? params[0].data.others.sum : 0}&emsp;排名：${params[0].data.others ? params[0].data.others.rank : 0}</span><br/>`;
                    } else {
                        html += `<span>本期效能综合：${params[0].data.others ? params[0].data.others.sum : 0}&emsp;排名：${params[0].data.others ? params[0].data.others.rank : 0}</span><br/>`;
                        html += `<span>上期效能综合：${params[1].data.others ? params[1].data.others.sum : 0}&emsp;排名：${params[1].data.others ? params[1].data.others.rank : 0}</span><br/>`;
                    }
                    return html;
                }
            },
            color: color,
            grid: {
                left: 15,
                right: 15,
                bottom: 15,
                top: 50,
                containLabel: true
            },
            legend: {
                right: 15,
                top: 15,
                orient: 'horizontal',
                show: true,
                data: ['本期综合效能值', '上期综合效能值'],
                color: color,
                // selectedMode: false,
                itemWidth: 14,
                itemHeight: 14,
                textStyle: {
                    color: "#323232"
                }
            },
            toolbox: {
                show: false
            },
            xAxis: [{
                type: 'category',
                boundaryGap: [10, 20],
                data: xData,
                xAxisIndex: 0,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#BDBDBD'
                    }
                },
                axisLabel: {
                    color: "#333"
                }
            }, {
                type: 'category',
                boundaryGap: [10, 20],
                data: xData,
                xAxisIndex: 1,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }],
            yAxis: {
                type: 'value',
                name: '',
                position: 'left',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#BDBDBD'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: '#DEDEDE'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#323232'
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
                <div className="box potency-sort" id="potency-sort"></div>
                <PotencyModal ref="modalRefs" />
            </div>
        )
    }

}

export default Index
