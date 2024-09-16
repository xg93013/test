import React from "react";
import echarts from "echarts"
import { throttle } from "../../../unit/pub";
import PotencyModal from "./PotencyModal";

const color = ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            myChart: '',
            selected: {
                上期综合效能值: true,
                本期综合效能值: true
            }
        }
    }
    getCharts(originData) {
        let selected = this.state.selected;
        let arr = [{
            type: 'current',
            data: [],
        }, {
            type: 'prev',
            data: []
        }]
        originData.forEach(item => {
            let current = {
                name: item.area,
                value: item.score,
                others: {
                    sum: item.score,
                    rank: item.top
                }
            }
            let prev = {
                name: item.area,
                value: item.preScore,
                others: {
                    sum: item.preScore,
                    rank: item.preTop
                }
            }
            arr[0].data.push(current);
            arr[1].data.push(prev);
        })
        let chart = this.state.myChart;
        let sorta = [...arr[0].data].sort((a, b) => {
            return b.value - a.value
        })
        let sortb = [...arr[1].data].sort((a, b) => {
            return b.value - a.value
        })
        let max = 0;
        if (sorta.length > 0 && sortb.length > 0) {
            max = sorta[0].value > sortb[0].value ? sorta[0].value : sortb[0].value;
        }
        let xData = [];
        let maxArr = [];
        arr[0].data.forEach(item => {
            maxArr.push(max);
            xData.push(item.name);
        })
        if (selected['上期综合效能值'] === true && selected['本期综合效能值'] === false) {
            xData = [];
            arr[1].data = [];
            let sortArr = [...originData].sort((a, b) => {
                return b.preScore - a.preScore
            })
            sortArr.forEach(itemd => {
                xData.push(itemd.area);
                arr[1].data.push({
                    name: itemd.area,
                    value: itemd.preScore,
                    others: {
                        sum: itemd.preScore,
                        rank: itemd.preTop
                    }
                });
            })
        }
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
            barGap: "0%",
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
            barGap: "0%",
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
                    if (params.length === 2) {
                        html += `<span>${params[0].seriesName}：${params[0].data.others ? (!params[0].data.others.sum && params[0].data.others.sum !== 0 ? '--' : params[0].data.others.sum) : '--'}&emsp;排名：${params[0].data.others ? (!params[0].data.others.rank && params[0].data.others.rank !== 0 ? '--' : params[0].data.others.rank) : '--'}</span><br/>`;
                    } else {
                        if (params[0]) {
                            html += `<span>本期效能综合：${params[0].data.others ? (!params[0].data.others.sum && params[0].data.others.sum !== 0 ? '--' : params[0].data.others.sum) : '--'}&emsp;排名：${params[0].data.others ? (!params[0].data.others.rank && params[0].data.others.rank !== 0) ? '--' : params[0].data.others.rank : '--'}</span><br/>`;
                        }
                        if (params[1]) {
                            html += `<span>上期效能综合：${params[1].data.others ? (!params[1].data.others.sum && params[1].data.others.sum !== 0 ? '--' : params[1].data.others.sum) : '--'}&emsp;排名：${params[1].data.others ? !params[1].data.others.rank && params[1].data.others.rank !== 0 ? '--' : params[1].data.others.rank : '--'}</span><br/>`;
                        }
                    }
                    return html;
                }
            },
            color: color,
            grid: {
                left: 15,
                right: 15,
                bottom: 5,
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
                },
                selected: selected
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
                    color: "#333",
                    rotate: 30
                }
            }, {
                type: 'category',
                // show: true,
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
                    show: false,
                    // align: 'right'
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
        chart.off('click');
        chart.on('click', (e) => {
            let year = this.props.currentTime.year;
            let month = this.props.currentTime.month;
            if (selected['上期综合效能值'] === true && selected['本期综合效能值'] === false) {
                if (month !== 0) {
                    if (month > 1) {
                        month--;
                    } else {
                        month = 12;
                        year--;
                    }
                } else {
                    year--;
                }

                if (arr[1].data[e.dataIndex].value !== 0) {
                    this.refs.modalRefs.showModal(e.name, {
                        year: year,
                        month: month
                    });
                }
            } else {
                this.refs.modalRefs.showModal(e.name, {
                    year: year,
                    month: month
                });
            }
        })
        chart.on('legendselectchanged', (params) => {
            let filterArr = [];
            for (let item in params.selected) {
                if (params.selected[item] === true) {
                    filterArr.push(item);
                }
            }
            // 至少选择一项
            if (filterArr.length > 0) {
                selected = params.selected;

            }
            this.setState({
                selected: selected
            })
            chart.clear();
            chart.off('legendselectchanged');
            this.getCharts(originData);
        });

    }
    init() {
        let chart = echarts.init(document.getElementById('potency-sort'));
        window.addEventListener("resize", throttle(chart.resize));
        this.setState({
            myChart: chart
        })
    }
    componentDidMount() {
        // this.getCharts();
        this.init();
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
