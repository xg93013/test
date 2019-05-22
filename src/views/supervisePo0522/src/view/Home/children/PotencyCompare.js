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
            tabNav: ['监管能力', '监管行为', '监管效果', '其他指标']
        }
    }
    getCharts(data) {
        let yAxisName = this.state.tabNav[this.state.index] + '值';
        let seriesData = [{
            name: 'a',
            type: 'bar',
            // stack: 'a',
            yAxisIndex: 0,
            data: [1, 3, 4, 5, 2],
            barWidth: 20
        }, {
            name: 'b',
            type: 'line',
            // stack: 'a',
            yAxisIndex: 1,
            data: [-5, 3, 4, 5, 4],
            areaStyle: {
                color: color[1],
                opacity: 0.1,
            },
            smooth: true,
        }];
        let xData = ['青羊区', '武侯区', '高新区', '金牛区', '双流区'];

        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    let html = `<span>${params[0].name}</span><br/>`;
                    html += `<span>${yAxisName}：${params[0].data}</span><br/>`;
                    html += `<span>较上期提升：${params[1].data}</span>`;
                    return html;
                },
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
            color: color,
            grid: {
                left: 50,
                right: 50,
                bottom: 50,
                top: 50,
                containLabel: true,
            },
            toolbox: {
                show: false,
            },
            xAxis: {
                type: 'category',
                boundaryGap: [10, 20],
                data: xData,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisPointer: {
                    lineStyle: {
                        color: "#eee"
                    }
                }
            },
            yAxis: [{
                type: 'value',
                name: `{b|${yAxisName}}{a|}`,
                nameLocation: 'middle',
                nameTextStyle: {
                    rich: {
                        a: {
                            display: 'inline-block',
                            width: 14,
                            height: 14,
                            // backgroundColor: {
                            //     image: require('./images/export.png')
                            // },
                            backgroundColor: color[0],
                            color: 'red',
                            lineHeight: 14,
                        },
                        b: {
                            height: 14
                        }
                    }
                },
                nameGap: 30,
                position: 'left',
                axisTick: {
                    show: false,
                },
                min: -2,
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee',
                    },
                },
            }, {
                type: 'value',
                name: '较上期变化率',
                nameLocation: 'middle',
                nameGap: 30,
                position: 'right',
                nameRotate: -90,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#eee',
                    },
                },
                axisLabel: {
                    show: true,
                    // formatter: '{value}%'
                }
            }],

            series: seriesData,
        };
        let chart = echarts.init(document.getElementById('potency-compare'));
        chart.setOption(option);
        window.addEventListener("resize", throttle(chart.resize));
        chart.on('click', (e) => {
            this.setState({
                visible: true
            })
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
            this.getCharts();
        })
    }

    render() {
        let index = this.state.index;
        let tabNav = this.state.tabNav;
        return (
            <div className="chart">
                <div className="title">各区县监管指标对比</div>
                <div className="tab-nav">
                    {
                        tabNav.map((item, i) => (
                            (
                                <span className={i === index ? 'current' : ''} onClick={() => { this.changeNav(i) }} key={i}>监管能力</span>
                            )
                        ))
                    }
                </div>
                <div className="box" id="potency-compare"></div>
                <Modal
                    width={500}
                    title="青羊区监管能力"
                    bodyStyle={{ background: '#f5f5f5' }}
                    visible={this.state.visible}
                    onOk={() => { this.hideModal() }}
                    onCancel={() => { this.hideModal() }}
                    destroyOnClose="true"
                    footer={null}
                >
                    <div className="modal-compare">
                        <div className="top">
                            <span>监管能力值：10</span>
                            <span>较上期下降5%</span>
                            <span>本期排名：10</span>
                            <span> 较上期排名下降：1位</span>
                        </div>
                        <div className="bottom">
                            <p>①基础人力指标</p>
                            <p>监管人员数量：45</p>
                            <p>监管人员持证占比：30%</p>
                            <br />
                            <p>①基础人力指标</p>
                            <p>监管人员数量：45</p>
                            <p>监管人员持证占比：30%</p>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

}

export default Index
