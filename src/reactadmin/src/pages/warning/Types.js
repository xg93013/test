import React, { Component } from "react";
import echarts from "echarts";
import { Button } from "antd";
import * as screenfull from "screenfull";
import { throttle } from "../../unit/pub";
import emitter from "./ev";

const color = ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"];

class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      msg: "a",
      index: 0
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
    let target = document.getElementById("targetC");
    if (screenfull.enabled) {
      screenfull.request(target);
      screenfull.on("change", () => {
        console.log(screenfull.isFullscreen);
      });
    }
  }
  // 组件从dom中移除之前
  componentWillUnmount() {
    if (screenfull.enabled) {
      screenfull.off("change", () => { });
    }
    emitter.removeListener(this.emmitEvent);
  }
  exitOutFullScreen() {
    if (screenfull.enabled) {
      screenfull.exit();
    }
  }
  getCharts() {
    let data = [
      {
        name: "a",
        value: "20"
      },
      {
        name: "b",
        value: "20"
      },
      {
        name: "c",
        value: "30"
      }
    ];
    let myChart = echarts.init(document.getElementById("type-chart"));
    let option = {
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
      legend: {
        textStyle: {
          color: "#999"
        }
      },
      series: [
        {
          type: "pie",
          radius: ["30%", "60%"],
          center: ["50%", "50%"],
          data: data,
          color: color,
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      ]
    };
    myChart.setOption(option, true);
    window.addEventListener("resize", throttle(myChart.resize));
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
