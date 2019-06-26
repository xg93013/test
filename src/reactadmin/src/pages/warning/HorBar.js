import React, { Component } from 'react'
import echarts from "echarts";
import { throttle } from "../../unit/pub";

export default class HorBar extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    this.initChart()
  }
  initChart() {
    let data = [10, 20, 15];
    let yData = ['a', 'b', 'c'];
    let shadowData = [];
    let arr = [...data].sort((a, b) => {
      return b - a
    })
    yData.forEach(item => {
      shadowData.push(arr[0])
    })
    let myChart = echarts.init(document.getElementById("bar-chart"));
    let option = {
      title: {
        text: "",
        left: 20,
        top: 10,
        fontWeight: "lighter"
      },
      legend: {
        textStyle: {
          color: "#999"
        }
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#eee'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: {
          lineStyle: {
            color: '#eee'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#eee'
          }
        }
      },
      series: [
        {
          type: 'bar',
          data: data,
          barWidth: '20%',
          z: 3,
          // barGap: '30%',
          itemStyle: {
            color: '#eee'
          },
          emphasis: {
            color: '#eee'
          }
        },
        {
          type: 'bar',
          z: 2,
          data: shadowData,
          barWidth: '20%',
          barGap: '-100%',
          itemStyle: {
            color: '#ccc'
          },
          emphasis: {
            color: '#ccc'
          }
        }
      ]
    };
    myChart.setOption(option, true);
    window.addEventListener("resize", throttle(myChart.resize));
  }
  render() {
    return (
      <div>
        <div className="title">bars</div>
        <div className="chart" id="bar-chart" />
      </div>
    )
  }
}
