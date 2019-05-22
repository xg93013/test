import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCharts() {
        let data = [];
        data = [{
            name: '1级a',
            itemStyle: {
                color: '#da0d68'
            },
            children: [{
                name: '2bla',
                value: 10,
                itemStyle: {
                    color: '#975e6d'
                }
            }, {
                name: '2blaa',
                value: 20,
                itemStyle: {
                    color: '#e0719c'
                }
            }]
        }, {
            name: '1级a',
            itemStyle: {
                color: '#da0d68'
            },
            children: [{
                name: '2bla',
                value: 10,
                itemStyle: {
                    color: '#975e6d'
                }
            }, {
                name: '2blaa',
                value: 20,
                itemStyle: {
                    color: '#e0719c'
                }
            }]
        }];

        let option = {
            title: {
                text: '',
                subtext: '',
                textStyle: {
                    fontSize: 14,
                    align: 'center'
                },
                subtextStyle: {
                    align: 'center'
                },
                sublink: ''
            },
            series: {
                type: 'sunburst',
                highlightPolicy: 'ancestor',
                data: data,
                radius: [0, '100%'],
                sort: null,
                levels: [{}, {
                    r0: '20%',
                    r: '60%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        fontSize: 12,
                        rotate: 'tangential'
                    }
                }, {
                    r0: '60%',
                    r: '90%',
                    label: {
                        fontSize: 12,
                        rotate: 'tangential'
                    }
                }]
            }
        };
        let chart = echarts.init(document.getElementById('ability-chart'));
        chart.setOption(option);
        window.addEventListener('resize', throttle(chart.resize));
    }

    componentDidMount() {
        // this.getCharts();
    }

    render() {
        return (
            <div className="modal-chart">
                <div className="title">监管能力指标（本期排名：10，较上期下降1位）</div>
                <div className="main-chart" id="ability-chart"></div>
            </div>
        )
    }



}

export default Index
