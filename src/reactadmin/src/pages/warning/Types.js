import React, { Component } from "react";
import echarts from "echarts";
import { Button } from "antd";
import { throttle, screenUtil } from "../../unit/pub";
import emitter from "./ev";

const color = ["#805CCA", "#fff", "#EFC235", "#4EA739", "#2A6BAF"];

class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      msg: "a",
      index: 0,
      myTimer: ""
    };
  }
  componentDidMount() {
    this.getCharts();
    this.emmitEvent = emitter.addListener("changeMsg", msg => {
      this.setState({
        msg: msg
      });
    });
  }
  fullScreen() {
    screenUtil.open('targetC')
  }
  exitOutFullScreen() {
    screenUtil.exit()
  }
  getCharts() {
    // let color = ["#FFFFFF","#DF6562"];
    let index = 0;
    let isHover = false;
    let data = [
      {
        name: "a",
        value: 70,
        percent: 20
      },
      {
        name: "b",
        value: 60,
        percent: 20
      }
    ];
    let myChart = echarts.init(document.getElementById("type-chart"));
    let option = {
      color: color,
      title: {
        text: "",
        left: 20,
        top: 10,
        fontWeight: "lighter"
      },
      tooltip: {
        position: ["50%", "50%"],
        formatter: "{b}<br/>{d}",
        textStyle: {
          color: "#999"
        },
        extraCssText: "background:none;transform:translate(-50%,-50%)"
      },
      // legend: {
      //   textStyle: {
      //     color: "#999"
      //   }
      // },
      series: [
        {
          type: "pie",
          radius: ["30%", "60%"],
          center: ["50%", "50%"],
          data: data,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            
          }
        }
      ]
    };
    // data = [{
    //   name: 'Flora',
    //   itemStyle: {
    //       color: '#da0d68'
    //   },
    //   children: [{
    //       name: 'Black Tea',
    //       value: 1,
    //       itemStyle: {
    //           color: '#975e6d'
    //       }
    //   }, {
    //       name: 'Floral',
    //       itemStyle: {
    //           color: '#e0719c'
    //       },
    //       children: [{
    //           name: 'Chamomile',
    //           value: 1,
    //           itemStyle: {
    //               color: '#f99e1c'
    //           }
    //       }, {
    //           name: 'Rose',
    //           value: 1,
    //           itemStyle: {
    //               color: '#ef5a78'
    //           }
    //       }, {
    //           name: 'Jasmine',
    //           value: 1,
    //           itemStyle: {
    //               color: '#f7f1bd'
    //           }
    //       }]
    //   }]
    // }, {
    //     name: 'Fruity',
    //     itemStyle: {
    //         color: '#da1d23'
    //     },
    //     children: [{
    //         name: 'Berry',
    //         itemStyle: {
    //             color: '#dd4c51'
    //         },
    //         children: [{
    //             name: 'Blackberry',
    //             value: 1,
    //             itemStyle: {
    //                 color: '#3e0317'
    //             }
    //         }]
    //     }, {
    //         name: 'Dried Fruit',
    //         itemStyle: {
    //             color: '#c94a44'
    //         },
    //         children: [{
    //             name: 'Raisin',
    //             value: 1,
    //             itemStyle: {
    //                 color: '#b53b54'
    //             }
    //         }]
    //     }, {
    //         name: 'Other Fruit',
    //         itemStyle: {
    //             color: '#dd4c51'
    //         },
    //         children: [{
    //             name: 'Coconut',
    //             value: 1,
    //             itemStyle: {
    //                 color: '#f2684b'
    //             }
    //         }]
    //     }]
    // }];
    
    // option = {
    //     title: {
    //         text: '',
    //         subtext: '',
    //         textStyle: {
    //             fontSize: 14,
    //             align: 'center'
    //         },
    //         subtextStyle: {
    //             align: 'center'
    //         },
    //         sublink: ''
    //     },
    //     series: {
    //         type: 'sunburst',
    //         highlightPolicy: 'ancestor',
    //         data: data,
    //         radius: [0, '100%'],
    //         sort: null,
    //         levels: [{}, {
    //             r0: '15%',
    //             r: '40%',
    //             itemStyle: {
    //                 borderWidth: 2
    //             },
    //             label: {
    //                 fontSize: 12,
    //                 rotate: 'tangential'
    //             }
    //         }, {
    //             r0: '40%',
    //             r: '70%',
    //             label: {
    //                 fontSize: 12,
    //                 align: 'right'
    //             }
    //         }, {
    //             r0: '88%',
    //             r: '90%',
    //             label: {
    //                 show: false,
    //                 position: 'outside',
    //                 padding: 3,
    //                 silent: false
    //             },
    //             itemStyle: {
    //                 fontSize: 12,
    //                 borderWidth: 3
    //             }
    //         }]
    //     }
    // };
  
    myChart.setOption(option, true);
    // myChart.on('mouseover', (v) => {
    //   isHover = true;
    //   if (v.dataIndex !== index) {
    //     myChart.dispatchAction({
    //       type: 'downplay',
    //       dataIndex: index,
    //       seriesIndex: 0
    //     })
    //     index = v.dataIndex;
    //   }
    // })
    // myChart.on('mouseout', (v) => {
    //   isHover = false;
    // })
    // let timer = setInterval(() => {
    //   // 鼠标移开轮循
    //   if (!isHover) {
    //     myChart.dispatchAction({
    //       type: 'downplay',
    //       dataIndex: index,
    //       seriesIndex: 0
    //     })
    //     if (index < data.length - 1) {
    //       index++
    //     } else {
    //       index = 0
    //     }
    //     myChart.dispatchAction({
    //       type: 'highlight',
    //       dataIndex: index,
    //       seriesIndex: 0
    //     })
    //   }
    // }, 3000)
    // this.setState({
    //   myTimer: timer
    // })
    window.addEventListener("resize", throttle(myChart.resize));
  }
  // 组件从dom中移除之前
  componentWillUnmount() {
    screenUtil.cancelListen()
    emitter.removeListener(this.emmitEvent);
  }
  render() {
    return (
      <div className="trend" id="targetC">
        <div className="title">
          对比{this.state.msg}
          <Button onClick={this.fullScreen.bind(this)}>full</Button>
          <Button onClick={this.exitOutFullScreen.bind(this)}>exit</Button>
        </div>
        <div className="chart" id="type-chart" />
      </div>
    );
  }
}

export default Trend;
