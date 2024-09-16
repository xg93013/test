import React, { Component } from 'react';
import echarts from 'echarts';
import { Modal } from 'antd';
import { throttle } from '../../unit/pub';
import chengdu from "../../datas/chengduArea.json";
import Trend from "./Trend";
echarts.registerMap('chengdu', chengdu);

const color = ['#DF6562', '#EFC235', '#4EA739', '#2A6BAF', '#805CCA'];

class EchartMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      visible: false
    };

  }
  componentDidMount() {
    this.getCharts();
  }
  getCharts() {
    let seriesData = [
      { name: '高新区', value: Math.round(Math.random() * 1000) },
      { name: '天府新区', value: Math.round(Math.random() * 1000) },
    ];
    let myChart = echarts.init(document.getElementById('map-chart'));
    let option = {
      // backgroundColor: "#1F2F3C",
      title: {
        text: "",
        top: 10,
        left: 10,
        textStyle: {
          color: "#fff",
          fontSize: 16,
          fontWeight: 400
        }
      },
      tooltip: {
        trigger: "item",
        formatter: function (params, ticket, callback) {
          //x轴名称
          var name = params.name;
          //图表title名称
          var seriesName = params.seriesName;
          //值
          var value = params.value;
          if (isNaN(value)) {
            return name + "<br />暂无";
          } else {
            return name + "<br />" + seriesName + ":" + value;
          }
          // var valueFliter = formatter(value)
        }
      },
      visualMap: {
        type: "continuous",
        min: 0,
        max: 1000,
        right: "10",
        bottom: "2",
        color: ["#039bd8", "#a5def6"],
        text: ["高", "低"],
        calculable: true,
        itemWidth: 12,
        itemHeight: 70,
        textGap: 5,
        textStyle: {
          color: "#ffffff"
        }
      },
      series: [
        {
          name: "风险指数",
          type: "map",
          mapType: "chengdu",
          roam: true,
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true }, areaColor: "#b5d5ff" }
          },
          data: seriesData
        }
      ]
    }
    myChart.setOption(option, true);
    myChart.on('click', (e) => {
      this.setState({
        visible: true
      })
    })
    window.addEventListener("resize", throttle(myChart.resize));
  }
  hideModal() {
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <div className="trend">
        <div className="title">地图</div>
        <div className="chart" id="map-chart" />
        <Modal
          title="Modal"
          bodyStyle={{ background: '#f5f5f5' }}
          visible={this.state.visible}
          onOk={() => { this.hideModal() }}
          onCancel={() => { this.hideModal() }}
          okText="确认"
          destroyOnClose="true"
          cancelText="取消"
        >
          <div><Trend /></div>
        </Modal>
      </div>
    );
  }
}

export default EchartMap;
