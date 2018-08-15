import * as _ from 'lodash';

const toolTipCssText = 'padding: 5px 10px;box-shadow: 0px 0px 10px rgba(4,52,76,0.59);';

let commonConfig = {
    // 单条折线图
    lineChart: (data) => {
        let yMax = _.max(data.seriesData) + 20;
        let toolTipName = '';
        if(data.toolTipName){
            toolTipName = data.toolTipName;
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
                formatter: '{b0}<br />'+toolTipName+':{c0}',
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: toolTipCssText
            },
            grid: {
                left: 20,
                right: 25,
                top: 20,
                bottom: 20,
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
        let yMax = _.max(data.seriesData);
        let xAxisName = '';
        let toolTipName = '';
        if(data.xAxisName){
            xAxisName = data.xAxisName;
        }
        if(data.toolTipName){
            toolTipName = data.toolTipName;
        }
        let dataShadow = [];
        for(let i=0;i < data.yData.length;i++){
            dataShadow.push(yMax);
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
                formatter: '{b}<br />'+toolTipName+':{c1}',
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: toolTipCssText
            },
            grid: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                containLabel: true
            },
            xAxis: {
                name: xAxisName,
                nameLocation: 'end',
                max: yMax,
                nameGap: 0,
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
        let yMax = _.max(data.seriesData) + 20;
        let dataShadow = [];
        let toolTipName = '';
        if(data.toolTipName){
            toolTipName = data.toolTipName;
        }
        // 柱状背景
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
                formatter: '{b0} <br />'+toolTipName+':{c1}',
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: toolTipCssText
            },
            grid: {
                left: 20,
                right: 20,
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
                data: data.xData
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
                        color: '#2B60A2',
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
        let roseType = false;
        let radius = ['10%', '55%'];
        let showLabel = false;
        let labelPadding = [];
        // 半径
        if(data.radius){
            radius = data.radius;
        }
        // pie类型
        if(data.roseType){
            roseType = data.roseType;
        }
        // 颜色
        if(data.colors){
            colors = data.colors;
        }
        // 显示标签
        if(data.showLabel){
            showLabel = data.showLabel;
        }
        // label显示位置
        if(data.labelPadding){
            labelPadding = data.labelPadding;
        }
        let option = {        
            tooltip : {
                trigger: 'item',
                formatter: "数量：{c} <br/>比例：{d}%",
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: toolTipCssText
            },
            color:colors,
            grid: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                containLabel: true
            },
            series: [
                {
                    name:'',
                    type:'pie',
                    radius : radius,
                    selectedMode: false,
                    selectedOffset: 0,
                    center: ['50%', '40%'],
                    // data:data.seriesData.sort(function (a, b) { return a.value - b.value; }),
                    data: data.seriesData,
                    roseType: roseType,
                    // hoverAnimation: false, 
                    label: {
                        show: showLabel,
                        align: 'left',
                        position: 'inner',
                        padding: labelPadding,
                        // formatter: function (params) {
                        //     return params.name
                        // }
                        formatter: [
                            '{a|}',
                            '{b|{b}}'
                        ].join(' '),
                        rich: {
                            a : {
                                display: 'inline-block',
                                width: 4,
                                height: 4,
                                color: 'red',
                                borderWidth: 1,
                                borderColor: '#fff',
                                borderRadius: 1
                            },
                            b : {
                                color: 'fff'
                            }
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            // borderWidth: 4,
                            // borderColor: 'rgba(1,33,122, 0.4)'
                            // selectedOffset: 10
                        },
                        emphasis: {}
                    },
                    datasetIndex: 1,
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
    // 多条折线图
    moreLinesChart: (data) => {
        let colors = ["#00A5E7","#1CE4A2","#46BEFF","#5787E9","#0078FF"];
        let borderColors = ["#0190EE","#165E79","#46BEFF","#5787E9","#0078FF"];
        let areaColors = ["#0190EE","#165E79","#46BEFF","#5787E9","#0078FF"];
        let toolTipName = '';
        let yMax = _.max(data.seriesData[0].data);
        let seriesData = data.seriesData;
        let seriesArr = [];
        let legendName = [];
        if(data.toolTipName){
            toolTipName = data.toolTipName;
        }
        for (let i = 0;i < seriesData.length; i++) {
            let max = _.max(data.seriesData[i].data);
            if ( max > yMax) {
                yMax = max;
            }
            let option = {
                name: seriesData[i].name,
                type: 'line',
                data: seriesData[i].data,
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                showSymbol: false,
                // color: colors[i],
                itemStyle: {
                    borderWidth: 2,
                    borderColor: borderColors[i],
                },
                lineStyle: {
                    width: 3,
                    shadowOffsetY: 2
                },
                areaStyle: {
                    color: areaColors[i]
                }
            }
            seriesArr.push(option);
            legendName.push(seriesData[i].name);
        }
        yMax = yMax + 20;
        let option = {
            color: colors,
            legend: {
                top: 0,
                right: 20,
                textStyle: {
                    color: '#A0D2FF'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#00AAFF'
                    }
                },
                formatter: '{b0}<br />'+toolTipName+':{c0}',
                backgroundColor: "rgba(142,253,255,0.7)",
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                extraCssText: toolTipCssText
            },
            grid: {
                left: 20,
                right: 25,
                top: 35,
                bottom: 20,
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
            series: seriesArr
        }
        return option
    } 
 }

export default commonConfig