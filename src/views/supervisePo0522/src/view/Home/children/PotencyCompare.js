import React from "react";
import echarts from "echarts";
import { throttle } from "../../../unit/pub";
import { Modal } from "antd";

import "./PotencyModal.scss";

const color = ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            index: 0,
            tabNav: [{ 
                key: 'ability',
                name: '监管能力'
            }, { 
                key: 'actions',
                name: '监管行为'
            },{ 
                key: 'effect',
                name: '监管效果'
            },{ 
                key: 'others',
                name: '其他指标'
            }],
            originData: [],
            yAxisName: "监管能力值",
            modalData: {}
        }
    }
    getCharts(data) {
        let yAxisName = this.state.tabNav[this.state.index].name + '值';
        let key = this.state.tabNav[this.state.index].key;
        let abilityData = [];
        let percentData = [];
        let xData = [];
        let shadowData = [];
        data[key].forEach(item => {
            abilityData.push(item.account);
            percentData.push(item.percent);
            xData.push(item.name);
        })
        let arr = [...abilityData].sort((a, b) => {
            return b - a
        })
        let arr1 = [...percentData].sort((a, b) => {
            return a - b
        })
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
                    html += `<span>较上期${ (params[1].data > 0 ? '提升：' : '下降：') + Math.abs(params[1].data) + '%' }</span>`;
                    return html;
                }
            },
            // legend: [{
            //     type: 'plain',
            //     data: ['a'],
            //     top: 'middle',
            //     width: 20,
            //     height: 100,
            //     left: 0,
            //     align: 'left',
            //     orient: 'vertical',
            //     // pageButtonPosition: 'start',
            //     formatter: (params) => {
            //         return params
            //     }
            // }],
            // color: color,
            grid: {
                left: 30,
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
                nameLocation: 'middle',
                nameTextStyle: {},
                position: 'left',
                axisTick: {
                    show: false,
                },
                min: arr1[0],
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
                }
            }, {
                type: 'value',
                nameLocation: 'middle',
                nameGap: 0,
                nameTextStyle: {},
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
        let chart = echarts.init(document.getElementById('potency-compare'));
        chart.setOption(option);
        window.addEventListener("resize", throttle(chart.resize));
        chart.on('click', (e) => {
            this.showModal(e.name);
        })
        this.setState({
            originData: data,
            yAxisName: yAxisName
        })
    }
    showModal(name){
        let modalData = {};
        this.setState({
            visible: true,
            modalData: {
                effect: 30,
                effectDesc: -10,
                rank: 10,
                rankDesc: -10,
                people: 20,
                percent: "30%",
                peopleMain: 100,
                area: 30,
                perLength: 40
            },
            currentArea: name
        })
    }
    hideModal() {
        this.setState({
            visible: false
        })
    }

    componentDidMount() {
        // this.getCharts();
    }

    changeNav(index) {
        this.setState({
            index: index
        }, () => {
            this.getCharts(this.state.originData);
        })
    }

    render() {
        let { index, tabNav, currentArea, yAxisName, modalData} = this.state;
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
                    width={560}
                    title={currentArea + "监管能力"}
                    bodyStyle={{ background: '#f5f5f5' }}
                    visible={this.state.visible}
                    onOk={() => { this.hideModal() }}
                    onCancel={() => { this.hideModal() }}
                    destroyOnClose="true"
                    footer={null}
                >
                    <div className="modal-compare">
                        <div className="top">
                            <div className="top-item">
                                <p>监管能力值</p>
                                <div>
                                    <span className="num">{ modalData.effect }</span>
                                    <span className="tips"><label className={ modalData.effectDesc < 0 ? 'up' : '' }>较上期{ (modalData.effectDesc > 0 ? '上升：' : '下降：') + Math.abs(modalData.effectDesc)}</label></span>
                                </div>
                            </div>
                                
                            <div className="top-item">
                                <p>本期排名</p>
                                <div>
                                    <span className="num">{ modalData.rank }</span>
                                    <span className="tips"><label className={ modalData.rankDesc < 0 ? 'up' : '' }>较上期排名{ (modalData.rankDesc > 0 ? '上升：' : '下降：') + Math.abs(modalData.rankDesc) }</label></span>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <div>
                                <p>监管能力值：</p>
                                <p>监管人员数量：{ modalData.people }<br/>监管人员持证占比：{ modalData.percent }</p>
                            </div>
                            <div>
                                <p>人员配比指标：</p>
                                <p>人均监管主体数：{ modalData.peopleMain }<br/>人均监管辖区面积：{ modalData.effect }30km2<br/>人均巡检路程长度：{ modalData.perLength }21KM</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

}

export default Index
