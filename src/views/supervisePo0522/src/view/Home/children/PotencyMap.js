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
            visible: false,
            selected: {
                0: true,
                1: true,
                2: true,
                3: true
            },
            myChart: ''
        }
    }
    getCharts(originData) {
        let data = [];
        originData.forEach(item => {
            data.push({
                name: item.area,
                value: item.score,
                current: {
                    sum: item.score,
                    rank: item.top
                },
                prev: {
                    sum: item.preScore,
                    rank: item.preTop
                }
            })
        })
        let chart = this.state.myChart;
        // 高（x≥90）、较高（75≤x＜90）、一般（60≤x＜75）、低（x＜60）
        let piecesData = [{
            // lte: max,
            gte: 90,
            label: '等级：高'
        }, {
            gte: 75,
            lt: 90,
            label: '等级：较高'
        }, {
            gte: 60,
            lt: 75,
            label: '等级：一般'
        }, {
            gte: 0,
            lt: 60,
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
                formatter: (params, ticket, callback) => {
                    let isInlevel = this.getIsInLevel(params.value);
                    let name = params.name;
                    let value = params.value;
                    let htmls = '';
                    if (isInlevel === true) {
                        if (isNaN(value)) {
                            htmls = name + "<br/>暂无";
                            return htmls;
                        } else {
                            htmls = `${name}<br/>`;
                            if (params.data) {
                                if (params.data.current) {
                                    htmls += `本期综合效能值：${params.data.current.sum}&emsp;本期排名：${params.data.current.rank}<br/>`;
                                }
                                if (params.data.prev) {
                                    htmls += `上期综合效能值：${!params.data.prev.sum && params.data.prev.sum !== 0 ? '--' : params.data.prev.sum}&emsp;上期排名：${!params.data.prev.rank && params.data.prev.rank !== 0 ? '--' : params.data.prev.rank}`;
                                }
                            }
                            return htmls
                        }
                    }
                }
            },
            visualMap: {
                type: "piecewise",
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
                },
                selected: this.state.selected
            },
            series: [
                {
                    name: "风险指数",
                    type: "map",
                    mapType: "chengdu",
                    aspectScale: 0.9,
                    roam: false,
                    itemStyle: {
                        normal: { borderColor: 'rgba(255,255,255, 0.1)', borderWidth: 2, label: { show: true }, areaColor: 'rgb(195, 232, 255)' },
                        emphasis: { label: { show: true, color: '#666' }, areaColor: 'rgba(195, 232, 255)' }
                    },
                    label: {
                        normal: {
                            show: true,
                            color: '#666',
                            fontSize: 10
                        }
                    },
                    top: 10,
                    bottom: 10,
                    data: data,
                    color: color
                }
            ],
            geo: {
                type: "map",
                map: "chengdu",
                aspectScale: 0.9,
                silent: true,
                top: 10,
                bottom: 10,
                itemStyle: {
                    borderColor: 'rgba(255,255,255, 0.1)', borderWidth: 2, areaColor: '#f5f5f5',
                },
                label: {
                    normal: {
                        show: true,
                        color: '#666',
                        fontSize: 10
                    }
                }
            }
        }
        chart.setOption(option);

        chart.off('click');
        chart.on('click', (e) => {
            let isInlevel = this.getIsInLevel(e.value);
            if (isInlevel) {
                this.refs.modalRefs.showModal(e.name, this.props.currentTime);
            }
        })
        chart.on('datarangeselected', (e) => {
            this.setState({
                selected: e.selected
            })
            chart.clear();
            chart.off('datarangeselected');
            this.getCharts(originData);
        })
    }
    init() {
        let chart = echarts.init(document.getElementById('potency-map'));
        window.addEventListener("resize", throttle(chart.resize));
        this.setState({
            myChart: chart
        })
    }
    componentDidMount() {
        // this.getCharts();
        this.init();
    }

    getIsInLevel(score) {
        let level = 0;
        if (score >= 90) {
            level = 0;
        } else if (score >= 75 && score < 90) {
            level = 1;
        } else if (score >= 60 && score < 75) {
            level = 2;
        } else {
            level = 3;
        }
        let flag = this.state.selected[level];
        return flag
    }

    render() {
        return (
            <div className="chart">
                <div className="title">监管效能地图</div>
                <div className="box potency-map" id="potency-map"></div>
                <PotencyModal ref="modalRefs" />
            </div>
        )
    }

}

export default Index
