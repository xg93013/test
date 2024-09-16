<template>
  <div id="drugSafe">
    <div class="title">药品安全形势分布</div>
    <div class="chart-box">
      <div class="left" id="left-map"></div>
      <div class="right" id="hor-bar"></div>
    </div>
  </div>
</template>
<script>
import commonConfig from "@/js/common.js";
import { throttle } from "@/unit/pub.js";
import echarts from "echarts";
import fujian from "@/fuJianMapJson/fujian.json";
echarts.registerMap("fujian", fujian);

const colors = ["#69CFFE", "#1F9EFF", "#1F91FB", "#0C73FF", "#0D54E3"];

export default {
  data() {
    return {
      mapChart: "",
      barChart: "",
      radarChart: "",
      mapData: [],
      barSeriesData: [],
      baryData: [
        "南平市",
        "三明市",
        "龙岩市",
        "宁德市",
        "福州市",
        "漳州市",
        "泉州市",
        "莆田市",
        "厦门市"
      ],
      radarData: [],
      radarName: "",
      resizeTimer: "",
      totalData: {}
    };
  },
  created() {},
  props: {
    saleinfo: {
      type: Array,
      default: []
    }
  },
  watch: {
    saleinfo(a) {
      // console.log(a);
      if (a.length !== 0) {
        this.totalData = {};
        this.mapData = [];
        this.baryData = [];
        this.barSeriesData = [];
      }

      for (let i = 0; i < a.length; i++) {
        this.baryData.push(a[i].location);
        this.barSeriesData.push(a[i].range);
        this.mapData.push({
          name: a[i].location,
          value: a[i].range
        });
        this.totalData[a[i].location] = [
          a[i].registrationReview,
          a[i].inspection,
          a[i].untowardEffect,
          a[i].medicationSupport,
          a[i].standard
        ];
      }
      this.$nextTick(() => {
        this.initMapChart();
        this.initBarChart();
      });
    }
  },
  methods: {
    init() {
      this.mapChart = this.$echarts.init(document.getElementById("left-map"));
      this.barChart = this.$echarts.init(document.getElementById("hor-bar"));
      window.addEventListener("resize", throttle(this.mapChart.resize));
      window.addEventListener("resize", throttle(this.barChart.resize));
    },
    initMapChart() {
      let max = 100;
      let dataArr = [];
      for (let i = 0; i < this.mapData.length; i++) {
        dataArr.push(this.mapData[i].value);
      }
      dataArr.sort((a, b) => {
        return b - a;
      });
      if (dataArr.length > 0) {
        max = dataArr[0];
      }
      let option = {
        title: {},
        tooltip: {
          trigger: "item",
          confine: true,
          padding: 0,
          formatter: (params, ticket, callback) => {
            // console.log(params);
            if (params.data != undefined) {
              callback(ticket, this.initRadarChart(params.name));
              return `<div style='overflow:hidden;background:#fff;opacity:0.85;border-radius:4px;color:#333;font-size:14px;'><p style='margin:20px 0 0 20px;font-weight:bold;'>${
                params.data.name
              }</p><p style='margin:5px 0 0 20px;'>安全指数：${
                params.data.value
              }</p><p style='margin:20px 0 0 20px;font-weight:bold;'>指数详情：</p><br/><div id='radar-chart' style='width:260px;height:160px;'></div></div>`;
            }
          }
        },
        visualMap: {
          type: "continuous",
          min: 0,
          max: max,
          left: "10",
          bottom: "10",
          color: colors,
          text: [max, 0],
          calculable: false,
          itemWidth: 12,
          itemHeight: 70,
          orient: "horizontal",
          textGap: 5,
          textStyle: {
            color: "#ffffff"
          }
        },
        series: [
          {
            name: "风险指数",
            type: "map",
            mapType: "fujian",
            itemStyle: {
              normal: {
                areaColor: "rgba(1, 33, 122, 0.6)",
                borderWidth: 1,
                borderColor: "rgba(1, 33, 122, 0.6)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#AAD7FF"
                  }
                }
              },
              emphasis: {
                areaColor: "rgba(1, 33, 122, 0.6)",
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowBlur: 8,
                label: {
                  show: true,
                  textStyle: {
                    color: "#AAD7FF"
                  }
                }
              }
            },
            data: this.mapData
          }
        ]
      };

      this.mapChart.setOption(option);
    },
    initBarChart() {
      let mainData = {
        seriesData: this.barSeriesData,
        yData: this.baryData,
        xAxisName: "",
        toolTipName: "安全指数"
      };

      this.barChart.setOption(commonConfig.horBar(mainData, false));
    },
    initRadarChart(name) {
      let max = 300;
      if (this.radarName != name) {
        // 不同区域才请求数据
        this.radarName = name;
        // 各维度
        // this.radarData = [[202, 202, 202, 202, 202]];
        this.radarData = [this.totalData[name]];
      }
      let arr = [...this.totalData[name]];
      arr.sort((a, b) => {
        return b - a;
      });
      max = arr[0];
      let option = {
        radar: {
          radius: "50%",
          nameGap: 4,
          indicator: [
            { name: "注册评审", max: max },
            { name: "检测检验", max: max },
            { name: "不良反应监测", max: max },
            { name: "公众用药保障", max: max },
            { name: "标准制定", max: max }
          ],
          shape: "polygon",
          splitNumber: 5,
          name: {
            textStyle: {
              color: "#666"
            }
          },
          grid: {
            // top: 80,
            left: 80,
            right: 80
            // bottom: 80
          },
          label: {
            show: true,
            textStyle: {
              color: "#666"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#656F81",
              opacity: 0.1
            }
          },
          splitArea: {
            show: false
            // color: "#656F81"
          },
          axisLine: {
            lineStyle: {
              color: "#656F81",
              opacity: 0.1
            }
          }
        },
        series: [
          {
            name: "系列",
            type: "radar",
            lineStyle: {
              normal: {
                width: 1,
                opacity: 0.5,
                color: "#656F81"
              }
            },
            data: this.radarData,
            symbol: "none",

            itemStyle: {
              normal: {
                color: "#0794FF"
              }
            },
            areaStyle: {
              normal: {
                // opacity: 0.1,
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#05D7FD" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#0024FF" // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            }
          }
        ]
      };
      this.$nextTick(() => {
        this.radarChart = this.$echarts.init(
          document.getElementById("radar-chart")
        );
        this.radarChart.setOption(option);
      });
    }
  },
  mounted() {
    this.init();
    // this.initMapChart();
    // this.initBarChart();
  }
};
</script>
<style lang="scss" scoped>
.radar-chart {
  p {
    margin: 10px 0 0 20px;
  }
}
</style>



