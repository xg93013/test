import React, { Component } from "react";
import "../../styles/warningAnalysis.scss";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/chart/bar";
import axios from "axios";

import Header from "../header/header";
import Nav from "../nav/nav";
import WarningTable from "./warningTable";

export default class WarningAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topData: [],
      cityBarData: "",
      myChart: "",
      selected: {},
      sortAllData: [],
      filterArr: ["netfood", "foodWaste"],
      allPlatForm: ["netfood", "foodWaste"]
    };
  }
  async getData() {
    // this.topData = ;
    this.setState({
      topData: [
        {
          name: "累计预警",
          label: "total",
          value: "20"
        },
        {
          name: "本月预警",
          label: "month",
          value: "30"
        },
        {
          name: "今日预警",
          label: "day",
          value: "50"
        }
      ]
    });
    let res = await axios.get("/api/barDatas");
    console.log(res);
    let totalData = res.data.data;
    if (totalData.length > 0) {
      // this.sortAllData = this.sortAllArr(totalData,this.state.filterArr);
      // let originData = this.formatterArr(this.sortAllData,this.allPlatForm);
      // this.cityBarData = [...originData];
      // this.initCityBar();
      let sortAllData = this.sortAllArr(totalData, this.state.filterArr);
      let originData = this.formatterArr(sortAllData, this.state.allPlatForm);
      this.setState({
        sortAllData: sortAllData,
        cityBarData: [...originData]
      });
      this.initCityBar();
    }
  }
  initCityBar() {
    let chart = echarts.init(document.getElementById("city-bar"));
    let arr = this.state.cityBarData;
    let colors = ["#4472C4", "#FFC000", "#E18149", "#A5A5A5"];
    let series = [];
    let legend = [];
    let xData = [];
    let yMax = 100;
    let _self = this;

    series = this.getOptionData(arr).series;
    legend = this.getOptionData(arr).legend;
    xData = this.getOptionData(arr).xData;

    let option = {
      color: colors,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            type: "dashed"
          }
        }
        // formatter: function(params){
        // 	// console.log(params);
        // 	let htmls = params[0].data.name + '预警信息数量:'+ '<br/>';
        // 	for(let i=0;i<params.length;i++){
        // 		htmls +=   params[i].seriesName + '：' + params[i].value + '条<br />'
        // 	}
        // 	return htmls
        // }
      },
      legend: {
        top: 10,
        left: "center",
        orient: "horizontal",
        itemWidth: 10,
        itemHeight: 8,
        selectedMode: "multiple",
        selected: _self.state.selected,
        textStyle: {
          color: "#333",
          // color: '#72B5E6',
          fontSize: 8
        },
        data: legend
      },
      grid: {
        left: 15,
        right: 15,
        top: 50,
        bottom: 10,
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: xData,
        boundaryGap: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#eee"
          }
        },
        axisLabel: {
          show: true,
          color: "#666",
          fontSize: 12,
          rotate: 45
        },
        axisTick: {
          alignWithLabel: true
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false,
          lineStyle: {
            color: "#666"
          }
        },
        axisLabel: {
          color: "#666",
          fontSize: 12,
          interval: 0
        },
        axisTick: {
          alignWithLabel: true,
          length: 0
        },
        splitLine: {
          show: false
        }
      },
      series: series
    };
    chart.setOption(option);

    chart.on("legendselectchanged", params => {
      window.addEventListener("resize", () => {
        chart.resize();
      });
      // this.filterArr = [];
      let filterArr = [];

      for (let item in params.selected) {
        if (params.selected[item] === true) {
          filterArr.push(this.switchNameToKey(item));
        }
      }
      // 至少选择一项
      if (filterArr.length > 0) {
        // this.selected = params.selected;
        // this.sortAllDatas = this.sortAllArr(this.state.sortAllData,filterArr);
        // this.cityBarData = this.formatterArr(this.sortAllDatas,this.allPlatForm);
        let sortAllDatas = this.sortAllArr(this.state.sortAllData, filterArr);
        this.setState({
          selected: params.selected,
          sortAllDatas: this.sortAllArr(this.state.sortAllData, filterArr),
          cityBarData: this.formatterArr(sortAllDatas, this.state.allPlatForm)
        });
      }

      chart.clear();
      chart.off("legendselectchanged");
      this.initCityBar();
    });
    // chart.setOptions(option);
    this.setState({
      myChart: chart
    });
  }
  switchKeyToName(key) {
    let name = "";
    switch (key) {
      case "netfood":
        name = "网络餐饮";
        break;
      case "foodWaste":
        name = "餐厨垃圾";
        break;
      default:
        break;
    }
    return name;
  }
  switchNameToKey(name) {
    let key = "";
    switch (name) {
      case "网络餐饮":
        key = "netfood";
        break;
      case "餐厨垃圾":
        key = "foodWaste";
        break;
      default:
        break;
    }
    return key;
  }
  sortAllArr(arr, filterArr) {
    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
      minIndex = i;
      for (let j = i + 1; j < len; j++) {
        let prevSum = 0;
        let nextSum = 0;
        for (let k = 0; k < filterArr.length; k++) {
          prevSum += arr[j][filterArr[k]];
          nextSum += arr[minIndex][filterArr[k]];
        }
        if (prevSum > nextSum) {
          minIndex = j;
        }
      }
      temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
    return arr;
  }
  formatterArr(arr, filterArr) {
    let dataArr = [];
    let _self = this;
    for (let i = 0; i < filterArr.length; i++) {
      let oneJson = {
        name: _self.switchKeyToName(filterArr[i]),
        data: []
      };
      for (let j = 0; j < arr.length; j++) {
        oneJson.data.push({
          name: arr[j].area,
          value: arr[j][filterArr[i]]
        });
      }
      dataArr.push(oneJson);
    }
    return dataArr;
  }
  getOptionData(data) {
    let arr = data;
    let colors = ["#4472C4", "#FFC000", "#E18149", "#A5A5A5"];
    let optionData = {
      legend: [],
      series: [],
      xData: []
    };
    for (let i = 0; i < arr[0].data.length; i++) {
      optionData.xData.push(arr[0].data[i].name);
    }
    for (let i = 0; i < arr.length; i++) {
      let oneSeries = {
        name: arr[i].name,
        type: "bar",
        stack: "common",
        data: arr[i].data,
        barMaxWidth: 10,
        barGap: "-100%",
        barCategoryGap: "55%",
        itemStyle: {
          normal: {
            color: colors[i],
            label: {
              show: false
            }
          }
        }
      };
      optionData.legend.push(arr[i].name);
      optionData.series.push(oneSeries);
    }
    return optionData;
  }
  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <div className="containers">
        <Header headTitle={this.state.headTitle} />
        <Nav {...this.props} />
        <div className="main">
          <div className="mainWrapper warningAnalysis">
            <div className="wrapper">
              <div className="topA">
                <div className="a-left">
                  {/* <div className="item" v-for="(item, index) in topData" :key="index" @click="filterWarning(item)">
                                        <span className="title">{{item.name}}</span>
                                        <span className="num">{{item.value}}</span>
                                    </div> */}
                  {this.state.topData.map((item, index) => (
                    <div className="item" key={index}>
                      <span className="title">{item.name}</span>
                      <span className="num">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="a-right">
                  <div className="city-bar" id="city-bar" />
                </div>
              </div>
              <WarningTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
