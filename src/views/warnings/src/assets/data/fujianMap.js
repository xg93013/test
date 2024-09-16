import Echarts from 'echarts';
import * as _ from 'lodash';
import 'echarts/map/js/china.js';

import fujian from '../fuJianMapJson/fujian.json';
// import fuzhou from '../fuJianMapJson/fuzhou.json';
// import longyan from '../fuJianMapJson/longyan.json';
// import nanping from '../fuJianMapJson/nanping.json';
// import ningde from '../fuJianMapJson/ningde.json';
// import putian from '../fuJianMapJson/putian.json';
// import quanzhou from '../fuJianMapJson/quanzhou.json';
// import sanming from '../fuJianMapJson/sanming.json';
// import xiamen from '../fuJianMapJson/xiamen.json';
// import zhangzhou from '../fuJianMapJson/zhangzhou.json';

Echarts.registerMap('fujian', fujian);
// Echarts.registerMap('fuzhou', fuzhou);
// Echarts.registerMap('longyan', longyan);
// Echarts.registerMap('nanping', nanping);
// Echarts.registerMap('ningde', ningde);
// Echarts.registerMap('putian', putian);
// Echarts.registerMap('quanzhou', quanzhou);
// Echarts.registerMap('sanming', sanming);
// Echarts.registerMap('xiamen', xiamen);
// Echarts.registerMap('zhangzhou', zhangzhou);

let areaMapConfig = {
    // fujianMapDataMapping:{
    //     "三明市":"sanming",
    //     "福州市":"fuzhou",
    //     "宁德市":"ningde",
    //     "南平市":"nanping",
    //     "龙岩市":"longyan",
    //     "莆田市":"putian",
    //     "泉州市":"quanzhou",
    //     "厦门市":"xiamen",
    //     "漳州市":"zhangzhou"     
    // },
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
                            shadowBlur: 10,
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
                            borderColor: 'rgba(1, 33, 122, 0.2)',
                        },
                        emphasis: {
                            areaColor: 'rgba(1, 33, 122, 0.4)',
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowBlur: 12,
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
                    if (params.data !== undefined) {
                        if (params.data.value !== NaN) {
                            let str = new String(params.data.value);
                            if (params.data.name === '' || str.split(",")[2] == undefined) {
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
                        // shadowColor: 'rgba(0, 0, 0, 0.6)',
                    },
                    emphasis: {
                        areaColor: 'rgba(1, 33, 122, 0.4)',
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowBlur: 12
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
        let mapName = data.mapName;
        let seriesData = data.seriesData;
        let seriesArr = [];
        let legendName = [];
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
                        shadowBlur: 12,
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
            // tooltip: {

            // },
            grid: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10
            },
            visualMap: {
                type: 'continuous',
                min: 0,
                right: 10,
                bottom: 10,
                align: 'top',
                max: data.visualMapMax,
                // color: colors,
                text: [0, data.visualMapMax],
                textGap: 2,
                range: [0, data.visualMapMax],
                inRange: {
                    color: ['#69CFFE', '#1F9EFF', '#1F91FB', '#0C73FF', '#0D54E3']
                },
                textStyle: {
                    color: '#C5E6FE'
                }
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                right: 10,
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
            // geo: {
            //     map: mapName,
            //     label: {
            //         normal: {
            //             show: false
            //         },
            //         emphasis: {
            //             show: false
            //         }
            //     },
            //     itemStyle: {
            //         normal: {
            //             areaColor: 'rgba(1, 33, 122, 0.4)',
            //             borderWidth: 1,
            //             borderColor: 'rgba(1, 33, 122, 0.2)',
            //             // shadowColor: 'rgba(0, 0, 0, 0.6)',
            //         },
            //         emphasis: {
            //             show: false,
            //             areaColor: 'rgba(1, 33, 122, 0.4)',
            //             // borderWidth: 4,
            //             // borderColor: 'rgba(1, 33, 122, 0)',
            //             shadowColor: 'rgba(0, 0, 0, 0.6)',
            //             shadowOffsetX: 4,
            //             shadowOffsetY: 4,
            //             shadowBlur: 12
            //         }
            //     }
            // },
            series: seriesArr
        }
        return option
    }
}
export default areaMapConfig