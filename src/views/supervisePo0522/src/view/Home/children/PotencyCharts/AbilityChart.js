import React from "react";
import echarts from "echarts";
import { throttle } from "../../../../unit/pub";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCharts(originData) {
        let color = ['#F9BE0C', '#BEDC46', '#547CAC', '#67C1FD'];
        let data = [];
        originData.forEach((item, index) => {
            let obj = {
                name: item.name,
                itemStyle: {
                    color: color[index],
                }
            }
            if(!item.children) {
                obj.value = item.value
            }
            if(item.children && item.children.length > 0) {
                let inArr = [];
                item.children.forEach(itema => {
                    let inner = {
                        name: itema.name,
                        value: itema.value,
                        itemStyle: {
                            color: color[index]
                        }
                    }
                    inArr.push(inner);
                })
                obj.children = inArr;
            }
            data.push(obj);
        })

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
            // tooltip: {
            //     formatter: (params) => {
            //         console.log(params);
            //     }
            // },
            series: {
                type: 'sunburst',
                highlightPolicy: 'ancestor',
                data: data,
                radius: [0, '100%'],
                sort: null,
                levels: [{
                    r0: '0%',
                    r: '8%',
                    itemStyle: {
                        color: color[2]
                    }
                }, {
                    r0: '10%',
                    r: '50%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        fontSize: 12,
                        rotate: 'tangential'
                    }
                }, {
                    r0: '55%',
                    r: '70%',
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
        let titleData = this.props.titleData;
        return (
            <div className="modal-chart">
                <div className="title">监管能力指标<span>（本期排名：{titleData.rank}，较上期{ (titleData.desc > 0 ? '上升' : '下降') + Math.abs(titleData.desc) }位）</span></div>
                <div className="main-chart" id="ability-chart"></div>
            </div>
        )
    }



}

export default Index
