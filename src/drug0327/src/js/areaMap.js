import Echarts from 'echarts';
import * as _ from 'lodash';
import 'echarts/map/js/china.js';

import fujian from '../fuJianMapJson/fujian.json';

Echarts.registerMap('fujian', fujian);

const toolTipCssText = 'padding:2px 5px;box-shadow: 0px 0px 10px rgba(4,52,76,0.59);background:rgba(142,253,255,0.7);';

let areaMapConfig = {
    // 地图经纬度数据
    getProvinceGeo: () => {
        let arr = fujian.features;
        let jsonObj = {};
        for (let i = 0; i < arr.length; i++) {
            jsonObj[arr[i].properties.name] = arr[i].properties.cp;
        }
        return jsonObj;
    },
    // 地图中心点经纬度
    getProvinceCenter: () => {
        return fujian.cp;
    },
    // lines data
    /**
     * data  地图连线起始终点信息
     * originData  地图经纬度信息
     */
    convertMapData: (data, originData) => {
        let arr = [...data];
        let outData = [];
        for (let i = 0; i < arr.length; i++) {
            let fromName = arr[i][0].name;
            let toName = arr[i][1].name;
            let oneLines = {
                fromName: fromName,
                toName: toName,
                coords: [originData[fromName], originData[toName]]
            }
            outData.push(oneLines);
        }
        return outData
    },
    // 地图
    mapConfig: (data) => {
        let colors = ["#c9b544", "#28bcc6", "#75c5ff", "#eb995c", "#66cc66", "#1db7e0", "#348ece", "#0f7b1f", "#1deba5", "#50a42c"];
        let areaColors = [];
        let mapName = data.mapName;
        let seriesArr = [];
        let legendName = [];
        let legendSelect = {};
        let toolTipName = '';
        let isFirst = true;
        let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        let seriesData = data.seriesData;
        if (data.mapName) {
            mapName = data.mapName;
        }
        if (data.toolTipName) {
            toolTipName = data.toolTipName;
        }
        for (let i = 0; i < seriesData.length; i++) {
            let lineOp = {};
            let scatterOp = {};
            let mapOp = {};
            // if(seriesData[i].lineData && seriesData[i].lineData.length != 0){
            lineOp = {
                id: 'line' + i,
                name: seriesData[i].name,
                type: 'lines',
                polyline: false,
                data: seriesData[i].lineData,
                lineStyle: {
                    curveness: 0.5,
                    type: 'dashed',
                    color: colors[i]
                },
                zlevel: 1000 + i,
                symbol: ['none', 'arrow'],
                // effect: {
                //     show: true,
                //     symbol: 'triangle',
                //     symbolSize: 10,
                //     period: 10,
                //     trailLength: 0.1                    
                // }
            }
            seriesArr.push(lineOp);
            // }
            if (seriesData[i].areaData && seriesData[i].areaData.length != 0) {
                scatterOp = {
                    id: 'scatter' + i,
                    name: seriesData[i].name,
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: seriesData[i].areaData,
                    showEffectOn: 'render',
                    // rippleEffect: {
                    //     brushType: 'stroke'
                    // },
                    zlevel: i + 100,
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: colors[i],
                            shadowBlur: 8,
                            shadowColor: '#333'
                        }
                    },
                    tooltip: {
                        show: true
                    }
                };
                mapOp = {
                    id: 'map' + i,
                    name: seriesData[i].name,
                    type: 'map',
                    map: mapName,
                    showLegendSymbol: false,
                    // geoIndex: 0,
                    zlevel: i,
                    data: seriesData[i].areaData,
                    itemStyle: {
                        normal: {
                            areaColor: 'rgba(1, 33, 122, 0)',
                            borderWidth: 1,
                            borderColor: 'rgba(1, 33, 122, 0)'
                        },
                        emphasis: {
                            areaColor: 'rgba(1, 33, 122, 0.6)',
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowBlur: 8,
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    },
                    tooltip: {
                        show: true
                    }
                }
                seriesArr.push(scatterOp);
                seriesArr.push(mapOp);
            }
            if (isFirst) {
                if (seriesData[i].lineData.length != 0) {
                    legendSelect[seriesData[i].name] = true;
                    isFirst = false;
                } else {
                    legendSelect[seriesData[i].name] = false;
                }
            } else {
                legendSelect[seriesData[i].name] = false;
            }
            legendName.push(seriesData[i].name);
        }
        let option = {
            tooltip: {
                formatter: (params) => {
                    if (params.data != undefined) {
                        if (params.data.name == '') {
                            return ''
                        } else {
                            if (params.data.value != NaN) {
                                let str = new String(params.data.value);
                                if (str.split(",")[2] != undefined && str.split(",")[2] != NaN) {
                                    return params.data.name + '<br/>' + params.seriesName + '：' + str.split(",")[2]
                                } else {
                                    return ''
                                }
                            } else {
                                return params.data.name + '<br/>' + params.seriesName + '：' + '暂无'
                            }
                        }
                    } else {
                        return ''
                    }
                },
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: toolTipCssText
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 80,
                bottom: 50,
                data: legendName,
                pageButtonPosition: 'start',
                pageIconColor: '#fff',
                pageIconInactiveColor: '#bbb',
                pageIconSize: 12,
                pageTextStyle: {
                    color: '#ccc'
                },
                selected: legendSelect,
                itemWidth: 12,
                selectedMode: 'single',
                itemHeight: 12,
                textStyle: {
                    color: '#C5E6FE',
                    fontSize: 12
                },
                tooltip: {
                    show: false
                }
            },
            geo: {
                map: mapName,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(1, 33, 122, 0.6)',
                        borderWidth: 2,
                        borderColor: 'rgba(1, 33, 122, 0.3)',
                        // shadowColor: 'rgba(0, 0, 0, 0.6)',
                        // shadowBlur: 8
                    },
                    emphasis: {
                        areaColor: 'rgba(1, 33, 122, 0.7)',
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowBlur: 8
                    }
                }
            },
            series: seriesArr
        }
        return option
    },
    // 正常省内地图
    normalMap: (data) => {
        let colors = ['#69CFFE', '#1F9EFF', '#1F91FB', '#0C73FF', '#0D54E3'];
        let mapName = '';
        let visualMapMax = 10;
        let seriesData = [];
        let seriesArr = [];
        let legendName = [];
        if (data.mapName) {
            mapName = data.mapName;
        }
        if (data.seriesData) {
            seriesData = data.seriesData;
        }
        if (data.visualMapMax) {
            visualMapMax = data.visualMapMax;
        }
        for (let i = 0; i < seriesData.length; i++) {
            let series = {
                name: seriesData[i].name,
                type: 'map',
                map: mapName,
                z: i,
                label: {
                    show: false,
                    color: '#fff'
                },
                showLegendSymbol: false,
                // geoIndex: 0,
                data: seriesData[i].data,
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(1, 33, 122, 0)',
                        borderWidth: 1,
                        borderColor: 'rgba(1, 33, 122, 0)'
                    },
                    emphasis: {
                        areaColor: 'rgba(1, 33, 122, 0.4)',
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowBlur: 8,
                        label: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                }
            }
            seriesArr.push(series);
            legendName.push(seriesData[i].name);
        }
        let option = {
            color: colors,
            grid: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10
            },
            tooltip: {
                formatter: (params) => {
                    let toolHtmls = '';
                    if (params.name != '') {
                        let seriesName = '';
                        let value = 0;
                        if (params.seriesName && params.seriesName != NaN) {
                            seriesName = params.seriesName;
                        }
                        if (params.value && params.value != NaN && params.value != undefined) {
                            value = params.value;
                        }
                        toolHtmls = params.name + '<br />' + seriesName + '：' + value + '<br />'
                    }
                    return toolHtmls
                },
                extraCssText: toolTipCssText
            },
            visualMap: {
                type: 'continuous',
                min: 0,
                right: 20,
                bottom: 20,
                align: 'top',
                itemWidth: 12,
                itemHeight: 90,
                max: visualMapMax,
                calculable: true,
                textGap: 2,
                inRange: {
                    color: colors
                },
                textStyle: {
                    color: '#72B5E6',
                    fontSize: 12
                }
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                right: 20,
                top: 0,
                data: legendName,
                itemWidth: 12,
                selectedMode: 'single',
                itemHeight: 12,
                textStyle: {
                    color: '#C5E6FE',
                    fontSize: 12
                },
                tooltip: {
                    show: false
                }
            },
            geo: {
                map: mapName,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(1, 33, 122, 0.3)',
                        borderWidth: 1,
                        borderColor: 'rgba(1, 33, 122, 0.2)',
                        // shadowColor: 'rgba(0, 0, 0, 0.4)',
                        // shadowBlur: 8
                    },
                    emphasis: {
                        areaColor: 'rgba(1, 33, 122, 0.4)',
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowBlur: 8,
                        label: {
                            show: false
                        }
                    }
                }
            },
            series: seriesArr
        }
        return option
    }
}
export default areaMapConfig