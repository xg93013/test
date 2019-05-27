import React from "react";
import echarts from "echarts"
import { throttle } from "../../../unit/pub";
import chengdu from "../../../unit/chengdu.json";

import PotencyModal from "./PotencyModal";

echarts.registerMap('chengdu', chengdu);

const color = ["#0F6CD4", "#2C8FEC", "#71C2FA", "#A8DDFF"];

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    getCharts(data) {
        let chart = echarts.init(document.getElementById('potency-map'));
        let arr = data.sort((a, b) => {
            return b.value - a.value
        })
        let max = arr[0].value;
        let piecesData = [{
            lte: max,
            gte: parseInt(max * 3 / 4),
            label: '等级：高'
        }, {
            gt: parseInt(max * 2 / 4),
            lt: parseInt(max * 3 / 4),
            label: '等级：较高'
        }, {
            gt: parseInt(max * 1 / 4),
            lte: parseInt(max * 2 / 4),
            label: '等级：一般'
        }, {
            gte: 0,
            lte: parseInt(max * 1 / 4),
            label: '等级：低'
        }];
        let option = {
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
                    var name = params.name;
                    var seriesName = params.seriesName;
                    var value = params.value;
                    if (isNaN(value)) {
                        return name + "<br />暂无";
                    } else {
                        return name + "<br />" + seriesName + ":" + value;
                    }
                }
            },
            visualMap: {
                type: "piecewise",
                min: 0,
                max: max,
                bottom: 10,
                right: 10,
                align: 'left',
                showLabel: true,
                color: color,
                itemWidth: 14,
                itemHeight: 14,
                textGap: 5,
                selectedMode: false,
                pieces: piecesData,
                textStyle: {
                    color: "#323232"
                }
            },
            series: [
                {
                    name: "风险指数",
                    type: "map",
                    mapType: "chengdu",
                    roam: false,
                    itemStyle: {
                        normal: { borderColor: 'rgba(0,0,0,0)', label: { show: true }, areaColor: "#A8DDFF" },
                        emphasis: { label: { show: true }, areaColor: "#b5d5ff" }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    data: data,
                    color: color
                }
            ]
        }
        chart.setOption(option);
        window.addEventListener("resize", throttle(chart.resize));
        chart.on('click', (e) => {
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
