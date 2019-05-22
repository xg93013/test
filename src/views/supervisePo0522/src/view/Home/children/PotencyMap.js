import React from "react";
import echarts from "echarts"
import { throttle } from "../../../unit/pub";
import chengdu from "../../../unit/chengdu.json";

import PotencyModal from "./PotencyModal";

echarts.registerMap('chengdu', chengdu);

const color = ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    getCharts(data) {
        let chart = echarts.init(document.getElementById('potency-map'));
        // let seriesData = [{
        //     name: '高新区',
        //     value: 20
        // }];
        let seriesData = data;
        let option = {
            // backgroundColor: "#1F2F3C",
            title: {
                text: "",
                top: 10,
                left: 10,
                textStyle: {
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 400
                }
            },
            tooltip: {
                trigger: "item",
                formatter: function (params, ticket, callback) {
                    //x轴名称
                    var name = params.name;
                    //图表title名称
                    var seriesName = params.seriesName;
                    //值
                    var value = params.value;
                    if (isNaN(value)) {
                        return name + "<br />暂无";
                    } else {
                        return name + "<br />" + seriesName + ":" + value;
                    }
                    // var valueFliter = formatter(value)
                }
            },
            visualMap: {
                type: "piecewise",
                min: 0,
                max: 500,
                right: 10,
                top: 10,
                align: 'left',
                showLabel: true,
                color: color,
                itemWidth: 10,
                itemHeight: 10,
                textGap: 5,
                pieces: [{
                    min: 300,
                    label: '等级：高'
                }, {
                    min: 200,
                    max: 300,
                    label: '等级：较高'
                }, {
                    min: 100,
                    max: 200,
                    label: '等级：一般'
                }, {
                    min: 0,
                    max: 100,
                    label: '等级：低'
                }],
                textStyle: {
                    color: "#111"
                }
            },
            series: [
                {
                    name: "风险指数",
                    type: "map",
                    mapType: "chengdu",
                    roam: false,
                    itemStyle: {
                        normal: { label: { show: true } },
                        emphasis: { label: { show: true }, areaColor: "#b5d5ff" }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        }
        chart.setOption(option);
        window.addEventListener("resize", throttle(chart.resize));
        chart.on('click', (e) => {
            console.log(e);
            this.refs.modalRefs.showModal(e.name);
        })
    }
    componentDidMount() {
        // this.getCharts();
    }

    render() {
        return (
            <div className="chart">
                <div className="title">监管效能地图</div>
                <div className="box" id="potency-map"></div>
                <PotencyModal ref="modalRefs" />
            </div>
        )
    }

}

export default Index
