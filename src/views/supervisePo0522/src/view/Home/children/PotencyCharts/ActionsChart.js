import React from "react";
import echarts from "echarts";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            titleData: {
                rank: 0,
                desc: 0
            }
        }
    }

    getCharts(originData) {
        //             "score": 25,
        //   "insNumEtp": 0, 人均年巡检次数得分
        //   "avgInsNum": 1,平均巡检参与人数(人/次)
        //   "okCheckRatio": 0.5,未延期整改复查率
        //   "maxOpDays": 198,最长经办时长
        //   "insNum": 9, 巡检次数
        //   "checkRatio": 0.5, 整改复查率（包括延期、未延期）
        //   "insNumSup": 0, 人均巡检次数
        //   "avgOpDays": 98 平均经办时长
        // 抽样检验指标
        // "check": {
        //     "score": 14,
        //     "checkNum": 66, 抽检次数
        //     "avgCheckNumEtp": 4.2, 主体年平均抽检次数
        //     "avgCheckSup": 1, 平均抽检参与人数
        //     "avgCheckNumSup": 0.3 人均抽检次数
        //   },
        let data = [{
            name: '日常巡检指标',
            value: originData.ins.score,
            children: [{
                name: '日常巡检次数',
                value: originData.ins.insNum
            }, {
                name: '人均日常巡检次数(次/年)',
                value: originData.ins.insNumSup
            }, {
                name: '主体年平均巡检次数(次/年)',
                value: originData.ins.insNumEtp
            }, {
                name: '平均经办时长(天)',
                value: originData.ins.avgOpDays
            }, {
                name: '最长经办时长(天)',
                value: originData.ins.maxOpDays
            }, {
                name: '平均巡检参与人数(人/次)',
                value: originData.ins.avgInsNum
            }, {
                name: '整改复查率(包括延期、未延期)(%)',
                value: (originData.ins.checkRatio * 100).toFixed(2)
            }, {
                name: '未延期整改复查率(%)',
                value: (originData.ins.okCheckRatio * 100).toFixed(2)
            }]
        }, {
            name: '抽样巡检指标',
            value: originData.check.score,
            children: [{
                name: '抽检次数',
                value: originData.check.checkNum
            }, {
                name: '人均日常抽检次数(次/年)',
                value: originData.check.avgCheckNumSup
            }, {
                name: '主体年平均抽检次数(次/年)',
                value: originData.check.avgCheckNumEtp
            }, {
                name: '平均抽检参与人数(人/次)',
                value: originData.check.avgCheckSup
            }]
        }];
        this.setState({
            titleData: {
                rank: originData.top,
                desc: (!originData.topChange && originData.topChange !== 0) ? '-' : originData.topChange
            }
        })
        let option = {
            angleAxis: {
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                min: -2,
                boundaryGap: ["50%", 0],
            },
            radiusAxis: {
                type: 'category',
                nameLocation: 'start',
                nameGap: 0,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                // data: ['日常巡检指标', '抽样巡检指标'],
                data: ['日常巡检指标', '抽样巡检指标'],
                z: 10
            },
            polar: {
                radius: '85%'
            },
            tooltip: {
                show: true,
                confine: true,
                textStyle: {
                    color: '#eee',
                },
                formatter: (params) => {
                    // console.log(params)
                    let htmls = "";
                    if (params.data.children) {
                        params.data.children.forEach(item => {
                            htmls += `${item.name}：${item.value}<br/>`
                        })
                    }
                    return htmls
                }
            },
            series: [{
                type: 'bar',
                data: data,
                barWidth: 15,
                coordinateSystem: 'polar',
                name: 'A',
                z: 2,
                itemStyle: {
                    color: "#1F9CF9",
                    barBorderRadius: 7
                },
                label: {
                    show: true,
                    color: "#333"
                }
            }, {
                type: 'bar',
                data: [20, 20],
                coordinateSystem: 'polar',
                name: 'B',
                z: 1,
                barWidth: 15,
                barGap: "-100%",
                itemStyle: {
                    color: '#E4E7EC',
                    barBorderRadius: 7
                },
                emphasis: {
                    itemStyle: {
                        color: '#E4E7EC'
                    }
                }
            }]
        }
        let chart = echarts.init(document.getElementById('actions-chart'));
        chart.setOption(option);
    }

    componentDidMount() {
        // this.getCharts();
    }

    render() {
        let titleData = this.state.titleData;
        return (
            <div className="modal-chart">
                <div className="title">监管行为指标<span>（本期排名：{titleData.rank}，较上期{titleData.desc === '-' ? '--' : (titleData.desc !== 0 ? (titleData.desc > 0 ? '上升' : '下降') + Math.abs(titleData.desc) + '位' : '持平')}）</span></div>
                <div className="main-chart" id="actions-chart"></div>
                <span className="bar-name">抽样检验指标</span>
            </div>
        )
    }



}

export default Index
