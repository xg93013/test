import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";
import { Popover } from "antd";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pointData: [200, 240, 140],
            maxData: 300
        }
    }

    getCharts() {
        // let data = []; 
        let max = this.state.maxData;
        let pointData = this.state.pointData;
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
                trigger: 'item',
                confine: true,
                formatter: function (params) {
                    // console.log(params);
                    let html = "";
                    params.data.others.forEach(item => {
                        html += `<span>${item.name}：${item.value}</span><br />`
                    })
                    return html
                }
            },

            series: [
                {
                    name: '2018',
                    type: 'radar',
                    lineStyle: {
                        normal: {
                            width: 1,
                            opacity: 1
                        }
                    },

                    data:
                        [{
                            name: '2018',
                            value: pointData,

                            others: [{
                                name: '投诉数量',
                                value: 30
                            }, {
                                name: '投诉人数',
                                value: 20
                            }, {
                                name: '罚没金额（万元）',
                                value: 30
                            }, {
                                name: '罚没企业数（个）',
                                value: 20
                            }, {
                                name: '监督抽检样品不合格率',
                                value: 30
                            }, {
                                name: '优良率',
                                value: 30
                            }, {
                                name: '符合率',
                                value: 30
                            }, {
                                name: '基本符合率',
                                value: 30
                            }, {
                                name: '通过率',
                                value: 30
                            }]
                        }]
                    ,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#6B8693'
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
        console.log(Math.sin(2*Math.PI/360*30).toFixed(2))
        // this.getCharts();
    }

    render() {
        let {
            pointData,
            maxData
        } = this.state;
        return (
            <div className="modal-chart">
                <div className="title">监管效果指标（本期排名：10，较上期下降1位）</div>
                <div className="main-chart" id="effect-chart"></div>
                <div className="out-box">
                    <div className="in-box">
                        <Popover content={(
                            <div></div>
                        )} placement="bottom" title="" trigger="hover">
                            <div className="point one" style={{ top: (maxData - pointData[0]) / (maxData * 2) * 100 + '%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                        </Popover>
                        <Popover content={(
                            <div></div>
                        )} placement="bottom" title="" trigger="hover">
                            <div className="point one" style={{ top: (maxData + pointData[1] * Math.sin(2*Math.PI/360*30).toFixed(2)) / (maxData * 2) * 100 + '%', left: (maxData - (pointData[1]*Math.cos(2*Math.PI/360*30).toFixed(2))) / (maxData * 2) * 100 + '%', transform: 'translate(-50%, -50%)' }}></div>
                        </Popover>
                        <Popover content={(
                            <div></div>
                        )} placement="bottom" title="" trigger="hover">
                            <div className="point one" style={{ top: (maxData + pointData[2] * Math.sin(2*Math.PI/360*30).toFixed(2)) / (maxData * 2) * 100 + '%', left: (maxData + (pointData[2]*Math.cos(2*Math.PI/360*30).toFixed(2))) / (maxData * 2) * 100 + '%', transform: 'translate(-50%, -50%)' }}></div>
                        </Popover>
                    </div>

                </div>
            </div>
        )
    }



}

export default Index
