import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCharts() {
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
                data: [1, 1],
                barWidth: 15,
                coordinateSystem: 'polar',
                name: 'A',
                z: 2,
                itemStyle: {
                    color: "#1F9CF9",
                    barBorderRadius: [5, 5, 0, 0]
                }
                // stack: 'a'
            }, {
                type: 'bar',
                data: [2, 2],
                coordinateSystem: 'polar',
                name: 'B',
                z: 1,
                barWidth: 15,
                barGap: "-100%",
                itemStyle: {
                    color: '#E4E7EC'
                }
                // stack: 'a'
            }]
        }
        let chart = echarts.init(document.getElementById('actions-chart'));
        chart.setOption(option);
        window.addEventListener('resize', throttle(chart.resize));
    }

    componentDidMount() {
        this.getCharts();
    }

    render() {
        return (
            <div className="modal-chart">
                <div className="title">各区县综合效能等级分布</div>
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
            </div>
        )
    }



}

export default Index
