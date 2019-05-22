import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";

const color = ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"];

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCharts() {
        let data = [{
            name: '数据录入完整性',
            value: 10
        }, {
            name: '处置率',
            value: 10
        }, {
            name: '后处理数据未录入数量',
            value: 20
        }, {
            name: '后处理数据未录入率',
            value: 20
        }];
        let option = {
            title: {
                text: "数据异常指标",
                left: "center",
                top: "center",
                fontWeight: "lighter",
                textStyle: {
                    fontSize: 12
                }
            },
            tooltip: {
                // position: ["50%", "50%"],
                // formatter: "{b}<br/>{d}",
                // textStyle: {
                //     color: "#999"
                // },
                // extraCssText: "background:none;transform:translate(-50%,-50%)"
            },
            series: [
                {
                    type: "pie",
                    radius: ["40%", "60%"],
                    center: ["50%", "50%"],
                    data: data,
                    color: color,
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            ]
        }
        let chart = echarts.init(document.getElementById('other-chart'));
        chart.setOption(option);
        window.addEventListener('resize', throttle(chart.resize));
    }

    componentDidMount() {
        // this.getCharts();
    }

    render() {
        return (
            <div className="modal-chart">
                <div className="title">其他类指标（本期排名：10，较上期下降1位）</div>
                <div className="main-chart" id="other-chart"></div>
            </div>
        )
    }



}

export default Index
