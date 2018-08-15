import Echarts from 'echarts';
import * as _ from 'lodash';
import 'echarts/map/js/china.js';

import fujian from '../fuJianMapJson/fujian.json';

Echarts.registerMap('fujian', fujian);

let areaMapConfig = {
    // 地图经纬度数据
    getProvinceGeo: () => {
        let arr = fujian.features;
        let jsonObj = {};
        for(let i = 0; i < arr.length; i++) {
            jsonObj[arr[i].properties.name] = arr[i].properties.cp;
        }
        return jsonObj;
    },

    // lines data
    /**
     * data  地图连线起始终点信息
     * originData  地图经纬度信息
     */
    convertMapData: (data, originData) => {
        let arr = [...data];
        let outData = [];
        for (let i = 0;i < arr.length; i++) {
            let fromName = arr[i][0].name;
            let toName = arr[i][1].name;
            let  oneLines = {
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
        let colors = ['#4FD7F3', '#6AD0FE', '#1F9EFF', '#1F91FB', '#6AD0FE'];
        let areaColors = [];
        let mapName = data.mapName;
        let seriesArr = [];
        let legendName = [];
        let toolTipName = '';
        let seriesData = data.seriesData;
        if (data.mapName) {
            mapName = data.mapName;
        }
        if(data.toolTipName){
            toolTipName = data.toolTipName;
        }
        for (let i = 0;i < seriesData.length; i++) {
            let lineOp = {};
            let scatterOp = {};
            let mapOp = {};
            if(seriesData[i].lineData && seriesData[i].lineData.length != 0){
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
                    tooltip: {
                        show: false
                    }
                }
                seriesArr.push(lineOp);
            }
            if(seriesData[i].areaData && seriesData[i].areaData.length != 0){
                scatterOp = {
                    id: 'scatter' + i,
                    name: seriesData[i].name,
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: seriesData[i].areaData,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    // zlevel: i + 10,
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            // color: colors[i],
                            shadowBlur: 8,
                            shadowColor: '#333'
                        }
                    },
                    tooltip: {
                        show: false
                    }
                };
                mapOp = {
                    id: 'map' + i,
                    name: seriesData[i].name,
                    type: 'map',
                    map: mapName,
                    showLegendSymbol: false,
                    // geoIndex: 0,
                    // zlevel: i + 100,
                    data: seriesData[i].areaData,
                    itemStyle: {
                        normal: {
                            areaColor: 'rgba(1, 33, 122, 0.4)',
                            borderWidth: 1,
                            borderColor: 'rgba(1, 33, 122, 0.2)'
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
                }
                seriesArr.push(scatterOp);
                seriesArr.push(mapOp);
            }
            
            legendName.push(seriesData[i].name);
        }
        let option = {
            tooltip: {
                formatter: (params) => {
                    if (params.data != undefined) {
                        if (params.data.value != NaN) {
                            let str = new String(params.data.value);
                            if (params.data.name == '' || str.split(",")[2] == undefined) {
                                return ''
                            } else {
                                return params.data.name + '<br/>' + params.seriesName + '：' + str.split(",")[2]
                            }
                        } else {
                            return ''
                        }
                    } else {
                        return ''
                    }
                },
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: 'padding: 5px 10px;box-shadow: 0px 0px 10px rgba(4,52,76,0.59);'
            },
            // visualMap: {
            //     min: 0,
            //     max: 500,
            //     color: colors
            // },
            legend: {
                type: 'scroll',
                orient: 'vertival',
                left: 80,
                bottom: 50,
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
            color: colors,
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
                        areaColor: 'rgba(1, 33, 122, 0.4)',
                        borderWidth: 1,
                        borderColor: 'rgba(1, 33, 122, 0.2)',
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowBlur: 8
                    },
                    emphasis: {
                        areaColor: 'rgba(1, 33, 122, 0.4)',
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
        for (let i = 0;i < seriesData.length;i++) {
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
                        areaColor: 'rgba(1, 33, 122, 0.4)',
                        borderWidth: 1,
                        borderColor: 'rgba(1, 33, 122, 0.2)'
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
                // color: colors,
                // text: [visualMapMax, 0],
                textGap: 2,
                // range: [0, visualMapMax],
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
                top: 10,
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
                // color: colors[1],
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
                        areaColor: 'rgba(1, 33, 122, 0.4)',
                        borderWidth: 1,
                        borderColor: 'rgba(1, 33, 122, 0.2)',
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        shadowBlur: 8
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