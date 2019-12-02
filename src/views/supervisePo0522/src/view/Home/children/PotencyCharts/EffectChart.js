import React from "react";
import echarts from "echarts";
import { Popover } from "antd";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pointData: [],
            maxData: 300,
            tooltipData: {
                complaintsNum: 0, // 投诉数量
                complaintsPeople: 0, // 投诉人数
                unqualified: 0, // 监督抽检样品不合格率
                excellent: 0, // 优良率
                coincidence: 0, // 符合率
                simpleCoincidence: 0, // 基本符合率
                pass: 0 // 通过率
            },
            titleData: {
                rank: 0,
                desc: 0
            }
        }
    }

    getCharts(originData) {
        let max = 0;
        let data = [originData.punish.score, originData.check.score, originData.ins.score];
        let arr = [...data].sort((a, b) => {
            return b - a
        });
        max = arr[0];
        this.setState({
            maxData: max,
            pointData: data,
            tooltipData: {
                punishMoneyAmount: originData.punish.punishMoneyAmount, // 
                punishEtpAmount: originData.punish.punishEtpAmount, // 
                unqualified: originData.check.checkNoRatio, // 监督抽检样品不合格率
                excellent: originData.ins.excellentRatio, // 优良率
                coincidence: originData.ins.conformityRatio, // 符合率
                simpleCoincidence: originData.ins.basicConformityRatio, // 基本符合率
                pass: originData.ins.passRatio // 通过率
            },
            titleData: {
                rank: originData.top,
                desc: (!originData.topChange && originData.topChange !== 0) ? '-' : originData.topChange
            }
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
    }

    componentDidMount() {
        // this.getCharts();
    }

    render() {
        let {
            pointData,
            maxData,
            tooltipData,
            titleData
        } = this.state;
        return (
            <div className="modal-chart">
                <div className="title">监管效果指标<span>（本期排名：{titleData.rank}，较上期{titleData.desc === '-' ? '--' : (titleData.desc !== 0 ? (titleData.desc > 0 ? '上升' : '下降') + Math.abs(titleData.desc) + '位' : '持平')}）</span></div>
                <div className="main-chart" id="effect-chart"></div>
                <div className="out-box">
                    <div className="in-box">
                        <Popover overlayClassName="potencyContainer" content={(
                            <div className="radar-tip">
                                <p>罚没金额（万元）：{tooltipData.punishMoneyAmount}</p>
                                <p>罚没企业数（个）：{tooltipData.punishEtpAmount}</p>
                            </div>
                        )} placement="bottom" title="" trigger="hover" mouseEnterDelay={0} mouseLeaveDelay={0} >
                            <div className="point" style={{ top: (maxData - pointData[0]) / (maxData * 2) * 100 + '%', left: '50%' }}></div>
                        </Popover>
                        <Popover overlayClassName="potencyContainer" content={(
                            <div className="radar-tip">
                                <p>监督抽检样品不合格率：{(tooltipData.unqualified * 100).toFixed(2)}%</p>
                            </div>
                        )} placement="bottom" title="" trigger="hover" mouseEnterDelay={0} mouseLeaveDelay={0}>
                            <div className="point" style={{ top: (maxData + pointData[1] * Math.sin(2 * Math.PI / 360 * 30).toFixed(2)) / (maxData * 2) * 100 + '%', left: (maxData - (pointData[1] * Math.cos(2 * Math.PI / 360 * 30).toFixed(2))) / (maxData * 2) * 100 + '%' }}></div>
                        </Popover>
                        <Popover overlayClassName="potencyContainer" content={(
                            <div className="radar-tip">
                                <p>优良率：{(tooltipData.excellent * 100).toFixed(2)}%</p>
                                <p>符合率：{(tooltipData.coincidence * 100).toFixed(2)}%</p>
                                <p>基本符合率：{(tooltipData.simpleCoincidence * 100).toFixed(2)}%</p>
                                <p>通过率：{(tooltipData.pass * 100).toFixed(2)}%</p>
                            </div>
                        )} placement="bottom" title="" trigger="hover" mouseEnterDelay={0} mouseLeaveDelay={0}>
                            <div className="point" style={{ top: (maxData + pointData[2] * Math.sin(2 * Math.PI / 360 * 30).toFixed(2)) / (maxData * 2) * 100 + '%', left: (maxData + (pointData[2] * Math.cos(2 * Math.PI / 360 * 30).toFixed(2))) / (maxData * 2) * 100 + '%' }}></div>
                        </Popover>
                    </div>

                </div>
            </div>
        )
    }



}

export default Index
