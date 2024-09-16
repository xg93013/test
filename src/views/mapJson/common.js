import Echarts from 'echarts';
import * as _ from 'lodash';

import fujian from '../fuJianMapJson/fujian.json';
import fuzhou from '../fuJianMapJson/fuzhou.json';
import longyan from '../fuJianMapJson/longyan.json';
import nanping from '../fuJianMapJson/nanping.json';
import ningde from '../fuJianMapJson/ningde.json';
import putian from '../fuJianMapJson/putian.json';
import quanzhou from '../fuJianMapJson/quanzhou.json';
import sanming from '../fuJianMapJson/sanming.json';
import xiamen from '../fuJianMapJson/xiamen.json';
import zhangzhou from '../fuJianMapJson/zhangzhou.json';

Echarts.registerMap('fujian', fujian);
Echarts.registerMap('fuzhou', fuzhou);
Echarts.registerMap('longyan', longyan);
Echarts.registerMap('nanping', nanping);
Echarts.registerMap('ningde', ningde);
Echarts.registerMap('putian', putian);
Echarts.registerMap('quanzhou', quanzhou);
Echarts.registerMap('sanming', sanming);
Echarts.registerMap('xiamen', xiamen);
Echarts.registerMap('zhangzhou', zhangzhou);

let commonConfig = {
    fujianMapDataMapping:{
        "三明市":"sanming",
        "福州市":"fuzhou",
        "宁德市":"ningde",
        "南平市":"nanping",
        "龙岩市":"longyan",
        "莆田市":"putian",
        "泉州市":"quanzhou",
        "厦门市":"xiamen",
        "漳州市":"zhangzhou"     
    },
    // 单条折线图
    lineChart: (data) => {
        let yMax = _.max(data.seriesData) + 20
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#00AAFF'
                    }
                },
                formatter: '{b0}: <br />事件数:{c0}',
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: 'padding: 5px 10px;box-shadow: 0px 0px 10px rgba(4,52,76,0.59);'
            },
            grid: {
                left: 15,
                right: 40,
                top: 15,
                bottom: 15,
                containLabel: true
            },
            xAxis: {
                data: data.xData,
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                splitLine:{
                    show: true,
                    symbol: 'circle',
                    lineStyle: {
                        color: ['#2B60A2'],
                        width: 1,
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#2B60A2'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#AAD7FF'
                }
            },
            yAxis: {
                type: 'value',
                max: yMax,
                min: 0,
                nameGap: 20,
                nameLocation: 'middle',
                nameRotate: 90,
                nameTextStyle: {
                    color: '#BCE1FF'
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#2B60A2',
                    }
                },
                axisLabel: {
                    color: '#AAD7FF'
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#2B60A2'],
                        opacity: 0.5,
                        width: 1,
                        type: 'dashed'
                    }
                }
            },
            series: {
                // name: '',
                type: 'line',
                data: data.seriesData,
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                showSymbol: false,
                color: '#00A5E7',
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#82C9FF',
                },
                lineStyle: {
                    color: '#00A5E7',
                    width: 3,
                    shadowOffsetY: 2
                },
                areaStyle: {
                    color: '#0190EE'
                }
            }
        }
        return option
    },
    // 水平柱状图
    horBar: (data) => {
        let yMax = _.max(data.seriesData)
        let dataShadow = []
        for(let i=0;i < data.yData.length;i++){
            dataShadow.push(yMax)
        }
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#00AAFF'
                    }
                },
                formatter: '{b0}: <br />事件数:{c0}',
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: 'padding: 5px 10px;box-shadow: 0px 0px 10px rgba(4,52,76,0.59);'
            },
            grid: {
                left: 15,
                right: 40,
                top: 15,
                bottom: 15,
                containLabel: true
            },
            xAxis: {
                name: "(件)",
                nameLocation: 'end',
                nameTextStyle: {
                    color: '#AAD7FF'
                },
                type: 'value',
                position: 'top',
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                splitLine:{
                    show: true,
                    lineStyle: {
                        color: ['#2B60A2'],
                        width: 1,
                        type: 'dashed'
                    },
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#2B60A2'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#AAD7FF'
                }
            },
            yAxis: {
                type: 'category',
                data: data.yData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#2B60A2'
                    }
                },
                axisLabel: {
                    color: '#AAD7FF',
                    formatter: function(params, ticket, callback) {
                        var sliceLen = self.isFullScreen ? 15 : 5;
                        if (params.length > sliceLen) {
                            return params.slice(0, sliceLen) + "..."
                        } else {
                            return params;
                        }
                    }
                },
            },
            series: [
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#01217A',
                            barBorderRadius: [0, 5, 5, 0],
                            label: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: '#01217A',
                            barBorderRadius: [0, 5, 5, 0],
                            label: {
                                show: false
                            }
                        }
                    },
                    barGap: '-100%',
                    barCategoryGap: '40%',
                    barWidth: "30%",
                    data: dataShadow,
                    z: 2,
                    animation: false
                },
                {
                    type: 'bar',
                    data: data.seriesData,
                    barWidth: "30%",
                    barCategoryGap: '40%',
                    z: 3,
                    itemStyle: {
                        normal: {
                            color: '#1E73FF',
                            barBorderRadius: [0, 5, 5, 0],
                            label: {
                                show: false
                            }
                        },
                        emphasis: {
                            color: '#1DC0E2',
                            barBorderRadius: [0, 5, 5, 0],
                            label: {
                                show: false
                            }
                        }
                    },
                }
            ]
        }
        return option
    },
    // 垂直柱状图
    normalBar: (data) => {
        let yMax = _.max(data.seriesData)
        let dataShadow = []
        for(let i=0;i < data.seriesData.length;i++){
            dataShadow.push(yMax)
        }
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#00AAFF'
                    }
                },
                formatter: '{b0}: <br />人数:{c0}',
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: 'padding: 5px 10px;box-shadow: 0px 0px 10px rgba(4,52,76,0.59);'
            },
            grid: {
                left: 15,
                right: 40,
                top: 20,
                bottom: 35,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#2B60A2'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine:{
                    show: true,
                    lineStyle: {
                        color: ['#2B60A2'],
                        width: 1,
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#2B60A2'
                    }
                }
            },
            series: [{
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#01217A',
                        barBorderRadius: [0, 5, 5, 0],
                        label: {
                            show: false
                        }
                    },
                    emphasis: {
                        color: '#01217A',
                        barBorderRadius: [0, 5, 5, 0],
                        label: {
                            show: false
                        }
                    }
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                barWidth: "30%",
                data: dataShadow,
                z: 2,
                animation: false
            },{
                data: data.seriesData,
                type: 'bar',
                barWidth: "30%",
                barCategoryGap: '40%',
                itemStyle: {
                    normal: {
                        color: '#1E73FF',
                        barBorderRadius: [2, 2, 0, 0],
                        label: {
                            show: false
                        }
                    },
                    emphasis: {
                        color: '#1DC0E2',
                        barBorderRadius: [2, 2, 0, 0],
                        label: {
                            show: false

                        }
                    }
                }
            }]
        };
        return option;
    },
    // 饼状图
    normalPie: (data) => {
        let colors = ["#C9B544","#4366FD","#46BEFF","#5787E9","#0078FF","#0099FF","#17DE87","#75c5ff"];
        let option = {        
            tooltip : {
                trigger: 'item',
                formatter: "{b}<br/>{c} ({d}%)",
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: 'padding: 5px 10px;box-shadow: 0px 0px 10px rgba(4,52,76,0.59);'
            },
            color:colors,
            grid: {
                left: 15,
                right: 40,
                top: 10,
                bottom: 15,
                containLabel: true
            },
            series : [
                {
                    name:'',
                    type:'pie',
                    radius : '65%',
                    center: ['50%', '50%'],
                    data:data.seriesData.sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'area',
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        }
        return option
    },
    provinceMap: (data) => {
        let colors = ['#4FD7F3', '#6AD0FE', '#1F9EFF', '#1F91FB', '#6AD0FE']
        let visualMapArr = []
        let option = {
            visualMap: {
                type: 'piecewise',
                left: 80,
                bottom: 50,
                // min: 0,
                // max: 200,
                // pieces: [
                //     {value: 100, label: '药品1'},
                //     {value: 300, label: '药品2'}],
                // categories: ['药品1', '药品2'],
                itemGap: 18,
                // dimension: 1,
                showLabel: true,
                // target: {
                //     inRange: {
                //         color: ['#121122', 'rgba(3,4,5,0.4)', 'red'],
                //         symbolSize: [20, 100]
                //     }
                // },
                textStyle: {
                    color: '#C5E6FE',
                    fontSize: 12
                }
            },
            series: [{
                type: 'map',
                map: 'fujian',
                itemStyle: {
                    normal: {
                        areaColor: 'rgba(128, 128, 128, 0)',
                        borderColor: '#FFFFFF',
                        color: '#fff'
                    },
                    emphasis: {
                        areaColor: 'rgba(128, 128, 128, 0)',
                        color: '#fff'
                    },
                    opacity: 0
                },
                data: data.seriesData
            }]
        }
        return option
    }
}

export default commonConfig