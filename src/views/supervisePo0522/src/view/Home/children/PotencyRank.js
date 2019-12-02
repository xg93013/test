import React from "react";
import echarts from "echarts"
import { throttle } from "../../../unit/pub";

const color = ["#0F6CD4", "#2C8FEC", "#71C2FA", "#A8DDFF"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isHover: false
        }
    }
    getCharts(originData) {
        let data = [{
            name: '高',
            value: originData['1'].num,
            areas: originData['1'].list
        }, {
            name: '较高',
            value: originData['2'].num,
            areas: originData['2'].list
        }, {
            name: '一般',
            value: originData['3'].num,
            areas: originData['3'].list
        }, {
            name: '低',
            value: originData['4'].num,
            areas: originData['4'].list
        }];

        let option = {
            tooltip: {
                confine: false,
                trigger: 'item',
                hideDelay: 0,
                transitionDuration: 0,
                formatter: params => {
                    let html = `综合效能等级：<span>${params.name}</span><br/>`;
                    html += `区县数量：<span>${params.data.areas.length}</span><br/>`;
                    if (params.data.areas && params.data.areas.length > 0) {
                        params.data.areas.forEach((item) => {
                            html += `<span>${item.area}：${item.total_score}</span><br/>`;
                        })
                    }
                    return html;
                }
            },
            color: color,
            grid: {
                left: 50,
                right: 50,
                bottom: 50,
                top: 60,
                containLabel: true
            },
            legend: {
                right: 10,
                top: 0,
                orient: 'vertical',
                show: true,
                color: color,
                formatter: (params) => {
                    let html = "";
                    html += '等级：' + params
                    return html
                },
                itemWidth: 14,
                itemHeight: 14,
                textStyle: {
                    color: "#323232"
                }
            },
            toolbox: {
                show: false
            },
            series: [{
                type: "pie",
                center: ['50%', '50%'],
                radius: ['40%', '68%'],
                data: data,
                label: {
                    show: true,
                    formatter: "占比：{d}%"
                },
                // emphasis: {
                //     label: {
                //         show: true
                //     }
                // },
                labelLine: {
                    show: true
                }
            }]
        };
        let chart = this.state.myChart;
        chart.setOption(option);
        // chart.on('mouseover', () => {
        //     this.setState({
        //         isHover: true
        //     })
        // })
        // let index = -1;
        // if (!this.state.isHover) {

        //     let timer = setInterval(() => {
        //         chart.dispatchAction({
        //             type: 'downplay',
        //             dataIndex: index,
        //             seriesIndex: 0
        //         })
        //         if (index < data.length - 1) {
        //             index++;
        //         } else {
        //             index = 0;
        //         }
        //         chart.dispatchAction({
        //             type: 'highlight',
        //             dataIndex: index,
        //             seriesIndex: 0
        //         })
        //     }, 3000)
        // }
    }
    init() {
        let chart = echarts.init(document.getElementById('potency-rank'));
        window.addEventListener("resize", throttle(chart.resize));
        this.setState({
            myChart: chart
        })
    }
    componentDidMount() {
        // this.getCharts();
        this.init();
    }

    render() {
        return (
            <div className="chart">
                <div className="title">各区县综合效能等级分布</div>
                <div className="box" id="potency-rank"></div>
            </div>
        )
    }

}

export default Index
