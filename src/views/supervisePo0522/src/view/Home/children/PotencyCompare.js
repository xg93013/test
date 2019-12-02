import React from "react";
import echarts from "echarts";
import { throttle } from "../../../unit/pub";
import http from "../../../unit/http.js";
import apis from "../../../unit/apis.js";
import { Modal } from "antd";

import "./PotencyModal.scss";

const {
    AREA_GRADE
} = apis;

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myChart: '',
            visible: false,
            index: 0,
            tabNav: [{
                key: 'ability',
                name: '监管能力'
            }, {
                key: 'actions',
                name: '监管行为'
            }, {
                key: 'effect',
                name: '监管效果'
            }, {
                key: 'others',
                name: '其他指标'
            }],
            originData: [],
            yAxisName: "监管能力值",
            modalData: {
                effect: {},
                check: {
                    score: 0,
                    checkNum: 0, // 抽检次数
                    avgCheckNumEtp: 0, // 主体年平均抽检次数
                    avgCheckSup: 0, // 平均抽检参与人数
                    avgCheckNumSup: 0 // 人均抽检次数
                },
                ins: {
                    score: 0,
                    insNumEtp: 0, // 人均年巡检次数得分
                    avgInsNum: 0, // 平均巡检参与人数(人/次)
                    okCheckRatio: 0, // 未延期整改复查率
                    maxOpDays: 0, // 最长经办时长
                    insNum: 0, // 巡检次数
                    checkRatio: 0, // 整改复查率（包括延期、未延期）
                    insNumSup: 0, // 人均巡检次数
                    avgOpDays: 0 // 平均经办时长
                },
                insEffect: {
                    score: 0,
                    excellentRatio: 0, // 优良率
                    conformityRatio: 0, // 符合率
                    basicConformityRatio: 0, // 基本符合率
                    passRatio: 0 // 通过率
                },
                insCheck: {
                    checkNoRatio: 0
                },
                punish: {
                    punishMoneyAmount: 0,
                    punishEtpAmount: 0
                },
                others: {
                    dataOkRatio: 0,
                    punishOkRatio: 0
                }
            }
        }
    }
    getCharts(originData) {
        let data = {
            'ability': originData['1'],
            'actions': originData['2'],
            'effect': originData['3'],
            'others': originData['4'],
        }
        let yAxisName = this.state.tabNav[this.state.index].name + '值';
        let key = this.state.tabNav[this.state.index].key;
        let abilityData = [];
        let percentData = [];
        let xData = [];
        let shadowData = [];
        data[key].forEach(item => {
            abilityData.push(item.score);
            percentData.push(item.ratio);
            xData.push(item.area);
        })
        let arr = [...abilityData].sort((a, b) => {
            return b - a
        })
        // let arr1 = [...percentData].sort((a, b) => {
        //     return a - b
        // })
        data[key].forEach(itema => {
            shadowData.push(arr[0]);
        })
        let seriesData = [{
            name: 'a',
            type: 'bar',
            // stack: 'a',
            yAxisIndex: 0,
            data: abilityData,
            barWidth: 10,
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
            },
            emphasis: {}
        }, {
            name: 'b',
            type: 'line',
            color: '#FABD0D',
            z: 4,
            yAxisIndex: 1,
            data: percentData,
            smooth: false,
        }, {
            name: 'c',
            type: 'bar',
            color: '#E7EBEE',
            yAxisIndex: 0,
            data: shadowData,
            barWidth: 10,
            z: 2,
            barGap: "-100%",
            itemStyle: {
                color: "#E7EBEE",
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
                    html += `<span>${yAxisName}：${params[0].data}</span><br/>`;
                    html += `<span>较上期${!percentData[params[0].dataIndex] && percentData[params[0].dataIndex] !== 0 ? '--' : percentData[params[0].dataIndex] === 0 ? '持平' : (params[1].data > 0 ? '提升：' : '下降：') + Math.abs(params[1].data).toFixed(2) + '%'}</span>`;
                    return html;
                }
            },
            grid: {
                left: 32,
                right: 30,
                bottom: 15,
                top: 15,
                containLabel: true,
            },
            toolbox: {
                show: false,
            },
            xAxis: {
                type: 'category',
                boundaryGap: [10, 10],
                data: xData,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#BDBDBD'
                    }
                },
                axisPointer: {
                    lineStyle: {
                        color: "#eee"
                    }
                },
                axisLabel: {
                    rotate: -90,
                    color: "#111",
                    fontSize: 12
                }
            },
            yAxis: [{
                type: 'value',
                position: 'left',
                axisTick: {
                    show: false,
                },
                min: 0,
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
                    color: '#323232',
                    showMinLabel: true,

                }
            }, {
                type: 'value',
                position: 'right',
                nameRotate: -90,
                axisTick: {
                    show: false,
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
                    color: '#323232',
                    formatter: '{value}%'
                }
            }],

            series: seriesData,
        };
        let chart = this.state.myChart;
        chart.setOption(option);
        chart.off('click');
        chart.on('click', (e) => {
            this.showModal(e.name);
        })
        this.setState({
            originData: originData,
            yAxisName: yAxisName
        })
    }
    async showModal(name) {
        let time = this.props.currentTime;
        let index = this.state.index;
        let res = await http.get(AREA_GRADE + '/' + (this.state.index + 1) + '/' + time.year + '/' + time.month + '/' + name);
        if (res) {
            let modalData = this.state.modalData;
            if (index === 0) {
                modalData.effect = {
                    people: res.data.basic.supNum,
                    percent: res.data.basic.supLicRatio,
                    peopleMain: res.data.person.avgEtpSup,
                    area: res.data.person.avgAreaSup
                }
            }
            if (index === 1) {
                modalData.ins = res.data.ins;
                modalData.check = res.data.check;
            }
            if (index === 2) {
                modalData.insEffect = res.data.ins;
                modalData.insCheck.checkNoRatio = res.data.check.checkNoRatio;
                modalData.punish = res.data.punish;
            }
            if (index === 3) {
                modalData.others.dataOkRatio = res.data.dataOkRatio;
                modalData.others.punishOkRatio = res.data.punishOkRatio;
            }
            modalData.score = res.data.score;
            modalData.scoreChange = res.data.scoreChange;
            if (!res.data.scoreChange && res.data.scoreChange !== 0) {
                if (res.data.score === 0) {
                    modalData.scoreChange = 0;
                } else {
                    modalData.scoreChange = '-';
                }
            }
            modalData.top = res.data.top;
            modalData.topChange = res.data.topChange;
            if (!res.data.topChange && res.data.topChange !== 0) {
                modalData.topChange = '-';
            }
            this.setState({
                visible: true,
                modalData: modalData,
                currentArea: name
            })
        }
    }
    hideModal() {
        this.setState({
            visible: false
        })
    }
    init() {
        let chart = echarts.init(document.getElementById('potency-compare'));
        window.addEventListener("resize", throttle(chart.resize));
        this.setState({
            myChart: chart
        })
    }
    componentDidMount() {
        // this.getCharts();
        this.init();
    }

    changeNav(index) {
        this.setState({
            index: index
        }, () => {
            if (JSON.stringify(this.state.originData) !== '{}' && this.state.originData !== '') {
                this.getCharts(this.state.originData);
            }
        })
    }

    render() {
        let { index, tabNav, currentArea, yAxisName, modalData } = this.state;
        return (
            <div className="chart">
                <div className="title">各区县监管指标对比</div>
                <div className="tab-nav">
                    {
                        tabNav.map((item, i) => (
                            (
                                <span className={i === index ? 'current' : ''} onClick={() => { this.changeNav(i) }} key={item.key}>{item.name}</span>
                            )
                        ))
                    }
                </div>
                <div className="leftTitle">{yAxisName}<span></span></div>
                <div className="rightTitle">较上期变化率%<span></span></div>
                <div className="box" id="potency-compare"></div>
                <Modal
                    width={680}
                    title={currentArea + tabNav[index].name}
                    bodyStyle={{ background: '#f5f5f5' }}
                    visible={this.state.visible}
                    onOk={() => { this.hideModal() }}
                    onCancel={() => { this.hideModal() }}
                    destroyOnClose="true"
                    footer={null}
                >
                    <div className="modal-compare" style={{ display: index === 0 ? 'block' : 'none' }}>
                        <div className="top">
                            <div className="top-item">
                                <p>监管能力值</p>
                                <div>
                                    <span className="num">{modalData.score}</span>
                                    <span className="tips">
                                        <label className={modalData.scoreChange === 0 || modalData.scoreChange === '-' ? 'normal' : modalData.scoreChange > 0 ? 'up' : ''}>
                                            较上期{modalData.scoreChange === '-' ? '--' : (modalData.scoreChange === 0 ? '持平' : (modalData.scoreChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.scoreChange).toFixed(2) + '%')}
                                        </label>
                                    </span>
                                </div>
                            </div>

                            <div className="top-item">
                                <p>本期排名</p>
                                <div>
                                    <span className="num">{modalData.top}</span>
                                    <span className="tips"><label className={modalData.topChange === 0 || modalData.topChange === '-' ? 'normal' : modalData.topChange > 0 ? 'up' : ''}>较上期排名{modalData.topChange === '-' ? '--' : modalData.topChange === 0 ? '持平' : (modalData.topChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.topChange)}</label></span>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div>
                                <p>基础人力指标：</p>
                                <p>监管人员数量：{modalData.effect.people}<br />监管人员持证占比：{(modalData.effect.percent * 100).toFixed(2)}%</p>
                            </div>
                            <div>
                                <p>人员配比指标：</p>
                                <p>人均监管主体数：{modalData.effect.peopleMain}<br />人均监管辖区面积：{modalData.effect.area}km<sup>2</sup><br /></p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-compare" style={{ display: index === 1 ? 'block' : 'none' }}>
                        <div className="top">
                            <div className="top-item">
                                <p>监管行为值</p>
                                <div>
                                    <span className="num">{modalData.score}</span>
                                    <span className="tips">
                                        <label className={modalData.scoreChange === 0 || modalData.scoreChange === '-' ? 'normal' : modalData.scoreChange > 0 ? 'up' : ''}>
                                            较上期{modalData.scoreChange === '-' ? '--' : (modalData.scoreChange === 0 ? '持平' : (modalData.scoreChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.scoreChange).toFixed(2) + '%')}
                                        </label>
                                    </span>
                                </div>
                            </div>

                            <div className="top-item">
                                <p>本期排名</p>
                                <div>
                                    <span className="num">{modalData.top}</span>
                                    <span className="tips"><label className={modalData.topChange === 0 || modalData.topChange === '-' ? 'normal' : modalData.topChange > 0 ? 'up' : ''}>较上期排名{modalData.topChange === '-' ? '--' : modalData.topChange === 0 ? '持平' : (modalData.topChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.topChange)}</label></span>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div>
                                <p>日常巡检指标：</p>
                                <p>
                                    <span>日常巡检次数：{modalData.ins.insNum}</span>
                                    <span>人均日常巡检次数(次/年)：{modalData.ins.insNumSup}</span>
                                    <span>主体年平均巡检次数(次/年)：{modalData.ins.insNumEtp}</span>
                                    <span>平均经办时长(天)：{modalData.ins.avgOpDays}</span>
                                    <span>最长经办时长(天)：{modalData.ins.maxOpDays}</span>
                                    <span>平均巡检参与人数(人/次)：{modalData.ins.avgInsNum}</span>
                                    <span>整改复查率(包括延期、未延期)：{(modalData.ins.checkRatio * 100).toFixed(2)}%</span>
                                    <span>未延期整改复查率：{(modalData.ins.okCheckRatio * 100).toFixed(2)}%</span>
                                </p>
                            </div>
                            <div>
                                <p>抽样检验指标：</p>
                                <p>
                                    抽检次数：{modalData.check.checkNum}<br />
                                    人均日常抽检次数(次/年)：{modalData.check.avgCheckNumSup}<br />
                                    主体年平均抽检次数：{modalData.check.avgCheckNumEtp}<br />
                                    平均抽检参与人数(人/次)：{modalData.check.avgCheckSup}<br />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-compare" style={{ display: index === 2 ? 'block' : 'none' }}>
                        <div className="top">
                            <div className="top-item">
                                <p>监管效果值</p>
                                <div>
                                    <span className="num">{modalData.score}</span>
                                    <span className="tips">
                                        <label className={modalData.scoreChange === 0 || modalData.scoreChange === '-' ? 'normal' : modalData.scoreChange > 0 ? 'up' : ''}>
                                            较上期{modalData.scoreChange === '-' ? '--' : (modalData.scoreChange === 0 ? '持平' : (modalData.scoreChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.scoreChange).toFixed(2) + '%')}
                                        </label>
                                    </span>
                                </div>
                            </div>

                            <div className="top-item">
                                <p>本期排名</p>
                                <div>
                                    <span className="num">{modalData.top}</span>
                                    <span className="tips"><label className={modalData.topChange === 0 || modalData.topChange === '-' ? 'normal' : modalData.topChange > 0 ? 'up' : ''}>较上期排名{modalData.topChange === '-' ? '--' : modalData.topChange === 0 ? '持平' : (modalData.topChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.topChange)}</label></span>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="long">
                                <p>日常巡检效果指标：</p>
                                <p>
                                    优良率：{(modalData.insEffect.excellentRatio * 100).toFixed(2)}%<br />
                                    符合率：{(modalData.insEffect.conformityRatio * 100).toFixed(2)}%<br />
                                    基本符合率：{(modalData.insEffect.basicConformityRatio * 100).toFixed(2)}%<br />
                                    通过率：{(modalData.insEffect.passRatio * 100).toFixed(2)}%<br />
                                </p>
                            </div>
                            <div className="long">
                                <p>抽检效果指标：</p>
                                <p>
                                    监督抽检样品不合格率：{(modalData.insCheck.checkNoRatio * 100).toFixed(2)}%<br />
                                </p>
                            </div>
                            <div className="long">
                                <p>行政处罚：</p>
                                <p>
                                    罚没金额(万元)：{modalData.punish.punishMoneyAmount}<br />
                                    罚没企业数(个)：{modalData.punish.punishEtpAmount}<br />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-compare" style={{ display: index === 3 ? 'block' : 'none' }}>
                        <div className="top">
                            <div className="top-item">
                                <p>其它类指标值</p>
                                <div>
                                    <span className="num">{modalData.score}</span>
                                    <span className="tips">
                                        <label className={modalData.scoreChange === 0 || modalData.scoreChange === '-' ? 'normal' : modalData.scoreChange > 0 ? 'up' : ''}>
                                            较上期{modalData.scoreChange === '-' ? '--' : (modalData.scoreChange === 0 ? '持平' : (modalData.scoreChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.scoreChange).toFixed(2) + '%')}
                                        </label>
                                    </span>
                                </div>
                            </div>

                            <div className="top-item">
                                <p>本期排名</p>
                                <div>
                                    <span className="num">{modalData.top}</span>
                                    <span className="tips"><label className={modalData.topChange === 0 || modalData.topChange === '-' ? 'normal' : modalData.topChange > 0 ? 'up' : ''}>较上期排名{modalData.topChange === '-' ? '--' : modalData.topChange === 0 ? '持平' : (modalData.topChange > 0 ? '上升：' : '下降：') + Math.abs(modalData.topChange)}</label></span>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div>
                                <p>数据异常指标：</p>
                                <p>
                                    数据录入完整性：{(modalData.others.dataOkRatio * 100).toFixed(2)}%<br />
                                    处罚结案完整比例：{(modalData.others.punishOkRatio * 100).toFixed(2)}%<br />
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

}

export default Index
