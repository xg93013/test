import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCharts(data) {
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
            polar: {},
            series: [{
                type: 'bar',
                data: data,
                barWidth: 15,
                coordinateSystem: 'polar',
                name: 'A',
                z: 2,
                itemStyle: {
                    color: "#1F9CF9",
                    barBorderRadius: [5, 5, 0, 0]
                },
                label: {
                    show: true,
                    color: "#333"
                }
            }, {
                type: 'bar',
                data: [100, 100],
                coordinateSystem: 'polar',
                name: 'B',
                z: 1,
                barWidth: 15,
                barGap: "-100%",
                itemStyle: {
                    color: '#E4E7EC'
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
        window.addEventListener('resize', throttle(chart.resize));
    }

    componentDidMount() {
        // this.getCharts();
    }

    render() {
        let titleData = this.props.titleData;
        return (
            <div className="modal-chart">
                <div className="title">各区县综合效能等级分布<span>（本期排名：{titleData.rank}，较上期{ (titleData.desc > 0 ? '上升' : '下降') + Math.abs(titleData.desc) }位）</span></div>
                <div className="main-chart" id="actions-chart">
                    {/* <div className="circle-box">
                        <div className="cirleft">
                            <div className="bar leftbar" style={{ height: '20%' }}><span title="日常巡检指标">日常巡检指标</span></div>
                        </div>
                        <div className="cirright">
                            <div className="bar rightbar" style={{ height: '30%' }}><span title="抽样巡检指标">抽样巡检指标</span></div>
                        </div>
                        <div className="lines"></div>
                    </div> */}
                </div>
                <span className="bar-name">日常巡检指标</span>
            </div>
        )
    }



}

export default Index
