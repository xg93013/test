import React from "react";
import "./Customers.scss";
import echarts from "echarts";
import 'echarts/map/js/china.js';
import CustomerDetail from "./CustomerDetail"
import { get } from "http";

const colors = [
    "#FBC02D",
    "#F9A825",
    "#FFEE58",
    "#FFF9C4",
]

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myChart: "",
            modalVisible: false,
            projectName: "",
            mapData: [{
                name: "四川",
                value: 10,
                projectName: "成都市食品安全监测预警数据中心",
                coordS: [104.06476, 30.57020],
                coordM: [70.404355, 47.409178],
                coordR: [70.404355, 47.409178],
                coordL: [63.904355, 47.409178],
                imgWidth: 201,
                imgHeight: 69,
                imgUrl: "links01",
                showDetail: true,
                areaColor: "#FF973B"
            },
            {
                name: "福建",
                value: 13,
                projectName: "福建省食品药品安全监管大数据",
                coordS: [119.29659, 26.09982],
                coordM: [126.29659, 26.09982],
                coordR: [128.29659, 28.09982],
                coordL: [134.59659, 28.09982],
                imgWidth: 199,
                imgHeight: 69,
                imgUrl: "links02",
                showDetail: true,
                areaColor: "#22FFFC"
            },
            {
                name: "山东",
                value: 20,
                projectName: "山东食药监食品安全风险分析系统",
                coordS: [117.126327, 36.657488],
                coordM: [126.126327, 36.657488],
                coordR: [126.126327, 36.657488],
                coordL: [132.426327, 36.657488],
                imgWidth: 196,
                imgHeight: 69,
                imgUrl: "links03",
                showDetail: true,
                areaColor: "#37FF87"
            },
            {
                name: "广西",
                value: 5,
                projectName: "广西省食药监局",
                coordS: [108.372466, 22.821002],
                coordM: [99.372466, 22.821002],
                coordR: [97.372466, 20.821002],
                coordL: [90.872466, 20.821002],
                imgWidth: 200,
                imgHeight: 67,
                imgUrl: "links04",
                showDetail: true,
                areaColor: "#F1D61D"
            },
            {
                name: "北京",
                value: 50,
                projectName: "中国农业科学院农业质量标准与检测技术研究所",
                coordS: [116.414537, 39.91513],
                coordM: [127.414537, 39.91513],
                coordR: [129.414537, 41.91513],
                coordL: [140.114537, 41.91513],
                imgWidth: 334,
                imgHeight: 90,
                imgUrl: "links05",
                showDetail: true,
                areaColor: "#C158FE"
            },
            {
                name: "四川",
                value: 10,
                projectName: "合作街道政务基础大数据平台",
                coordS: [104.06476, 30.57020],
                coordM: [70.06476, 30.57020],
                coordR: [68.06476, 28.57020],
                coordL: [59.46476, 28.57020],
                imgWidth: 268,
                imgHeight: 69,
                imgUrl: "links06",
                showDetail: true
            },
            {
                name: "四川",
                value: 10,
                projectName: "宜宾数字经济发展规划",
                coordS: [104.06476, 30.57020],
                coordM: [77.06476, 26.57020],
                coordR: [75.06476, 24.57020],
                coordL: [69.86476, 24.57020],
                imgWidth: 159,
                imgHeight: 70,
                imgUrl: "links07",
                showDetail: true
            },
            {
                name: "四川",
                value: 10,
                projectName: "雅安大数据发展规划",
                coordS: [104.06476, 30.57020],
                coordM: [80.06476, 21.57020],
                coordR: [78.06476, 19.57020],
                coordL: [72.86476, 19.57020],
                imgWidth: 157,
                imgHeight: 70,
                imgUrl: "links08",
                showDetail: true
            },
            {
                name: "四川",
                value: 10,
                projectName: "新经济委蓉创e平台",
                coordS: [104.06476, 30.57020],
                coordM: [73.300517, 38.382873],
                coordR: [73.300517, 38.382873],
                coordL: [66.96476, 38.382873],
                imgWidth: 197,
                imgHeight: 70,
                imgUrl: "links09",
                showDetail: true
            },
            {
                name: "四川",
                value: 10,
                projectName: "成都市智能大数据招投标审计平台",
                coordS: [104.06476, 30.57020],
                coordM: [70.458306, 42.458518],
                coordR: [70.458306, 42.458518],
                coordL: [64.558306, 42.458518],
                imgWidth: 180,
                imgHeight: 70,
                imgUrl: "links10",
                showDetail: true
            },
            {
                name: "四川",
                value: 10,
                projectName: "成都市智慧治理中心河湖遥感大数据分析系统",
                coordS: [104.06476, 30.57020],
                coordM: [99.926711, 48.384307],
                coordR: [98.926711, 48.384307],
                coordL: [91.226711, 48.384307],
                imgWidth: 241,
                imgHeight: 73,
                imgUrl: "links11",
                showDetail: true
            },
                // {
                //     name: "山西",
                //     value: 10,
                //     projectName: "华为高峰论坛",
                //     coordS: [112.559027, 37.87778],
                //     coordM: [100.926711, 30.384307],
                //     coordR: [100.926711, 30.384307],
                //     coordL: [92.926711, 30.384307],
                //     imgWidth: 265,
                //     imgHeight: 76,
                //     imgUrl: "links11",
                //     showDetail: true
                // },
                // {
                //     name: "安徽",
                //     value: 10,
                //     projectName: "安徽省食药监局",
                //     coordS: [117.270173, 31.916658],
                //     coordM: [130.270173, 31.916658],
                //     coordR: [130.270173, 31.916658],
                //     coordL: [137.270173, 31.916658],
                //     imgWidth: 209,
                //     imgHeight: 67,
                //     imgUrl: "links12",
                //     showDetail: false
                // }
            ]

        };
    }
    convertData(data, last) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
            let geoCoord = last ? data[i].coordR : data[i].coordS;
            if (geoCoord) {
                res.push({
                    // name: data[i].name,
                    // value: [geoCoord, data[i].value, data[i].projectName]
                    value: geoCoord.concat(data[i].value),
                    projectName: data[i].projectName
                });
            }
        }
        return res;
    }
    convertLineData(data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
            res.push({
                name: data[i].name,
                coords: [data[i].coordS, data[i].coordM, data[i].coordR]
            })
        }
        return res
    }
    convertMapData(data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
            if (res.length === 0) {
                res.push({
                    name: data[i].name,
                    value: data[i].value,
                    itemStyle: {
                        areaColor: data[i].areaColor
                    }
                })
            } else {
                for (let j = 0; j < res.length; j++) {
                    if (res[j].name === data[i].name) {
                        res[j].value += data[i].value;
                        break
                    } else {
                        res.push({
                            name: data[i].name,
                            value: data[i].value,
                            itemStyle: {
                                areaColor: data[i].areaColor
                            }
                        })
                        break
                    }
                }
            }
        }
        return res
    }

    initCenterMap() {
        let getData = this.state.mapData;
        let myChart = echarts.init(document.getElementById('center-map'));
        let series = [{
            id: 'lines',
            name: "lines",
            type: 'lines',
            polyline: true,
            data: this.convertLineData(getData),
            lineStyle: {
                width: 1.5,
                curveness: 0,
                type: 'solid',
                color: "#fff",
                shadowColor: "#fff",
                shadowBlur: 8
            },
            zlevel: 2,
            effect: {
                show: false,
            }
        }, {
            id: 'scatter',
            name: 'maparea',
            type: 'scatter',
            silent: true,
            animation: false,
            hoverAnimation: false,
            coordinateSystem: 'geo',
            // symbol: "circle",
            symbol: "image://" + require(`./images/slot.png`),
            data: this.convertData(getData),
            zlevel: 5,
            symbolSize: [8, 7],
            itemStyle: {
                normal: {
                    color: "#fff",
                    shadowColor: '#fff',
                    shadowBlur: 8
                },
                emphasis: {
                    color: "#fff"
                }
            },
            markArea: {
                itemStyle: {
                    color: "#fff"
                }
            }
        }
        ]
        for (let i = 0; i < getData.length; i++) {
            let oneScatter = {
                id: 'scatter' + i,
                name: 'mapareb' + i,
                type: 'scatter',
                silent: false,
                animation: false,
                hoverAnimation: false,
                coordinateSystem: 'geo',
                symbolKeepAspect: false,
                symbol: "image://" + require(`./images/${getData[i].imgUrl}.png`),
                data: [{
                    name: getData[i].projectName,
                    showDetail: getData[i].showDetail,
                    imgWidth: getData[i].imgWidth,
                    imgHeight: getData[i].imgHeight,
                    value: getData[i].coordL.concat(getData[i].value)
                }],
                zlevel: 10 + i,
                symbolSize: (value, param) => {
                    return [param.data.imgWidth, param.data.imgHeight]
                },
                itemStyle: {
                    normal: {
                        color: "#fff",
                        shadowColor: 'rgba(255,255,255,0.8)',
                        shadowBlur: 0
                    }
                },
                label: {
                    show: false,
                    position: 'inside',
                    // formatter: `{a|${getData[i].projectName}}`,
                    formatter: `{a|}`,
                    rich: {
                        a: {
                            width: 300,
                            height: 70,
                            fontSize: 20,
                            color: "#fff",
                            textShadowColor: '#fff',
                            textShadowBlur: 20,
                            shadowColor: '#fff',
                            shadowBlur: 50
                        }
                    }
                }
            }
            series.push(oneScatter);
            series.push({
                type: "map",
                map: "china",
                data: this.convertMapData(getData),
                label: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        areaColor: '#0F64EF',
                        borderWidth: 1.4,
                        borderColor: 'rgba(255,255,255,0.4)',
                        // borderColor: "transparent",
                        opacity: 0.9,
                        label: {
                            show: false
                        }
                    },
                    emphasis: {
                        areaColor: '#0F64EF',
                        label: {
                            show: true,
                            color: "#fff"
                        }
                    }
                }
            })
        }
        let option = {
            geo: {
                map: 'china',
                itemStyle: {
                    normal: {
                        areaColor: 'transparent',
                        borderWidth: 1.2,
                        borderColor: 'rgba(255,255,255,0.9)',
                        label: {
                            show: false
                        },
                        // borderWidth: 1.5,
                        shadowBlur: 10,
                        opacity: 0.9,
                        shadowColor: 'rgba(0,0,0,0.6)'
                    },
                    emphasis: {
                        areaColor: '#2583FF',
                        label: {
                            show: false
                        }
                    }
                }
            },
            series: series
        }
        myChart.setOption(option);

        myChart.on('click', (e) => {
            if (e.componentSubType === 'scatter') {
                this.showModal(e);
            }
        })
        this.setState({
            myChart: myChart
        })
    }
    componentDidMount() {
        this.initCenterMap();
    }
    showModal(e) {
        if (e.data.showDetail) {
            this.setState({
                modalVisible: true,
                projectName: e.data.name
            });
        }
    }

    closeModal() {
        this.setState({
            modalVisible: false,
        });
    }
    componentWillUnmount() {
        this.state.myChart.dispose()
    }
    render() {
        let { modalVisible, projectName } = this.state
        return (
            <div className='system-area'>
                <div className='center-map' id="center-map"></div>
                <div className="detail-box" style={{ display: modalVisible === true ? 'block' : 'none' }}>
                    <CustomerDetail closeModal={() => { this.closeModal() }} projectName={projectName} />
                </div>
            </div>
        )
    }

}

export default Index
