import React from "react";
import echarts from "echarts";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            titleData: {
                rank: 0,
                desc: 0
            }
        }
    }

    getCharts(originData) {
        let data = [];
        let color = ['#1F9CF9', '#547CAC', '#547CAC', '#67C1FD'];
        let origins = [{
            name: '人员配比指标',
            // value: 80,
            children: [{
                name: '人均监管主体数',
                value: originData['person'].avgEtpSupScore,
                texts: originData['person'].avgEtpSup
            }, {
                name: '人均监管辖区面积(km2)',
                value: originData['person'].avgAreaSupScore,
                texts: originData['person'].avgAreaSup
            }]
        }, {
            name: '基础人力指标',
            // value: 80,
            children: [{
                name: '监管人员数量',
                value: originData['basic'].supNumScore,
                texts: originData['basic'].supNum
            }, {
                name: '监管人员持证占比(%)',
                value: originData['basic'].supLicRatioScore,
                texts: (originData['basic'].supLicRatio * 100).toFixed(2)
            }]
        }];
        this.setState({
            titleData: {
                rank: originData.top,
                desc: (!originData.topChange && originData.topChange !== 0) ? '-' : originData.topChange
            }
        })
        origins.forEach((item, index) => {
            let obj = {
                name: item.name,
                itemStyle: {
                    color: color[index],
                }
            }
            if (!item.children) {
                obj.value = item.value
            }
            if (item.children && item.children.length > 0) {
                let inArr = [];
                item.children.forEach(itema => {
                    let inner = {
                        name: itema.name,
                        texts: itema.texts,
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
            tooltip: {
                confine: true,
                textStyle: {
                    color: '#eee',
                },
                formatter: (params) => {
                    // console.log(params);
                    let htmls = "";
                    if (params.data) {
                        if (params.data.name) {
                            htmls += `${params.data.name}`;
                            if (params.data.children) {
                                params.data.children.forEach(item => {
                                    htmls += `<br/>${item.name}：${item.texts}`;
                                })
                            } else {
                                htmls += '：' + params.data.texts
                            }
                        }

                    }
                    return htmls
                }
            },
            series: {
                type: 'sunburst',
                highlightPolicy: 'ancestor',
                data: data,
                radius: [0, '90%'],
                sort: null,
                levels: [{
                    r0: '0%',
                    r: '8%',
                    itemStyle: {
                        color: color[2]
                    }
                }, {
                    r0: '10%',
                    r: '43%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        fontSize: 12,
                        rotate: 'tangential'
                    }
                }, {
                    r0: '48%',
                    r: '63%',
                    label: {
                        position: 'outside',
                        fontSize: 12,
                        distance: 1,
                        // offset: [10, 10],
                        rotate: 0,
                        color: '#999'
                    }
                }]
            }
        };
        let chart = echarts.init(document.getElementById('ability-chart'));
        chart.setOption(option);
    }
    componentDidMount() {
        // this.getCharts();
    }

    render() {
        let titleData = this.state.titleData;
        return (
            <div className="modal-chart">
                <div className="title">监管能力指标<span>（本期排名：{titleData.rank}，较上期{titleData.desc === '-' ? '--' : (titleData.desc !== 0 ? (titleData.desc > 0 ? '上升' : '下降') + Math.abs(titleData.desc) + '位' : '持平')}）</span></div>
                <div className="main-chart" id="ability-chart"></div>
            </div>
        )
    }



}

export default Index
