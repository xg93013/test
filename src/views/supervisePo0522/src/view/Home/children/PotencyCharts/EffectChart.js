import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCharts() {
        // let data = []; 
        let option = {
            radar: {
                indicator: [
                    { text: '舆情满意度', max: 300 },
                    { text: '行政处罚力度', max: 300 },
                    { text: '抽检效果指标', max: 300 },
                    { text: '日常巡检力度', max: 300 }
                ],

                // shape: 'polygon',
                // splitNumber: 5,
                // triggerEvent: true,
                // name: {
                //     textStyle: {
                //         color: '#111'
                //     }
                // },
                // splitLine: {
                //     lineStyle: {
                //         color: "#656F81",
                //         opacity: 0.1
                //     }
                // },
                // splitArea: {
                //     show: false
                // },
                // axisLine: {
                //     lineStyle: {
                //         color: '#656F81',
                //         opacity: 0.2
                //     }
                // }
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                formatter: function (params) {
                    console.log(params);
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
                            value: [200, 240, 30, 140, 250],

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
                            color: '#0794FF'
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
        return (
            <div className="modal-chart">
                <div className="title">监管效果指标（本期排名：10，较上期下降1位）</div>
                <div className="main-chart" id="effect-chart"></div>
            </div>
        )
    }



}

export default Index
