import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";
import { Popover } from "antd";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pointData: [],
            maxData: 300
        }
    }

    getCharts(data) {
        let max = 0;
        let arr = [...data].sort((a, b) => {
            return b - a
        });
        max = arr[0];
        this.setState({
            maxData: max,
            pointData: data
        })
        let option = {
            radar: {
                indicator: [
                    { text: '行政处罚力度', max: max },
                    { text: '抽检效果指标', max: max },
                    { text: '日常巡检力度', max: max },
                    // { text: '日常巡检力度', max: max }
                ],
                shape: 'circle',
                splitNumber: 5,
                triggerEvent: true,
                silent: false,
                name: {
                    textStyle: {
                        color: '#666666'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#656F81",
                        opacity: 0.1
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#656F81',
                        opacity: 0.2
                    }
                }
            },
            tooltip: {
                show: false
            },
            series: [
                {
                    name: 'radar',
                    type: 'radar',
                    lineStyle: {
                        normal: {
                            width: 1,
                            opacity: 1
                        }
                    },

                    data: [data],
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#6B8693'
                        },
                        label: {
                            color: '#666'
                        }
                    },
                    areaStyle: {
                        normal: {
                            // opacity: 0.1,
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: "#05D7FD" // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: "#0024FF" // 100% 处的颜色
                                    }
                                ],
                                global: false // 缺省为 false
                            }
                        }
                    }
                }
            ]
        }
        let chart = echarts.init(document.getElementById('effect-chart'));
        chart.setOption(option);
        window.addEventListener('resize', throttle(chart.resize));
    }

    componentDidMount() {
        // this.getCharts();
    }

    render() {
        let {
            pointData,
            maxData
        } = this.state;
        let {
            titleData,
            tooltipData
        }
        = this.props;
        return (
            <div className="modal-chart">
                <div className="title">监管效果指标<span>（本期排名：{titleData.rank}，较上期{ (titleData.desc > 0 ? '上升' : '下降') + Math.abs(titleData.desc) }位）</span></div>
                <div className="main-chart" id="effect-chart"></div>
                <div className="out-box">
                    <div className="in-box">
                        <Popover overlayClassName="potencyContainer" content={(
                            <div className="radar-tip">
                                <p>投诉数量：{ tooltipData.complaintsNum }</p>
                                <p>投诉人数：{ tooltipData.complaintsPeople }</p>
                            </div>
                        )} placement="bottom" title="" trigger="hover">
                            <div className="point" style={{ top: (maxData - pointData[0]) / (maxData * 2) * 100 + '%', left: '50%'}}></div>
                        </Popover>
                        <Popover overlayClassName="potencyContainer" content={(
                            <div className="radar-tip">
                                <p>监督抽检样品不合格率：{ tooltipData.unqualified }</p>
                            </div>
                        )} placement="bottom" title="" trigger="hover">
                            <div className="point" style={{ top: (maxData + pointData[1] * Math.sin(2*Math.PI/360*30).toFixed(2)) / (maxData * 2) * 100 + '%', left: (maxData - (pointData[1]*Math.cos(2*Math.PI/360*30).toFixed(2))) / (maxData * 2) * 100 + '%' }}></div>
                        </Popover>
                        <Popover overlayClassName="potencyContainer" content={(
                            <div className="radar-tip">
                                <p>优良率：{ tooltipData.excellent }</p>
                                <p>符合率：{ tooltipData.coincidence }</p>
                                <p>基本符合率：{ tooltipData.simpleCoincidence }</p>
                                <p>通过率：{ tooltipData.pass }</p>
                            </div>
                        )} placement="bottom" title="" trigger="hover">
                            <div className="point" style={{ top: (maxData + pointData[2] * Math.sin(2*Math.PI/360*30).toFixed(2)) / (maxData * 2) * 100 + '%', left: (maxData + (pointData[2]*Math.cos(2*Math.PI/360*30).toFixed(2))) / (maxData * 2) * 100 + '%' }}></div>
                        </Popover>
                    </div>

                </div>
            </div>
        )
    }



}

export default Index
