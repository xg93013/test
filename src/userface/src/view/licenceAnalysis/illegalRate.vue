<template>
  <div id="illegalRate">
    <div class="title">违规率变化趋势</div>
    <div class="charts" id="illegalRateChart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { throttle } from "@/unit/pub";
import apis from "@/unit/apis";
const { CARD_CODE } = apis;
export default {
  data() {
    return {
      lengData: [
        "全部",
        "许可证未公示",
        "证件模糊",
        "证件过期",
        "超范围经营",
        "疑似假证",
        "一证多用"
      ],
      xdatas: [],
      ydatas: [],
      color: [
        "#FF00FF",
        "#276AB0",
        "#37b6e2",
        "#40A42B",
        "#f0c131",
        "#D9534F",
        "#7D55CB"
      ],
      datas: [],
      selected: {
        全部: true,
        许可证未公示: true,
        证件模糊: false,
        证件过期: false,
        超范围经营: false,
        疑似假证: false,
        一证多用: false
      }
    };
  },
  methods: {
    init() {
      this.lengData.forEach(item => {
        this.ydatas.push([0, 0, 0, 0, 0, 0]);
        this.datas.push([{}, {}, {}, {}, {}, {}]);
      });
      this.myChart = echarts.init(document.getElementById("illegalRateChart"));
      this.myChart.on("legendselectchanged", e => {
        this.selected = {
          ...e.selected
        };
      });
      window.addEventListener("resize", throttle(this.myChart.resize));
    },
    getDatas(res) {
      let num = 0;
      this.xdatas = [];
      for (let i in res) {
        this.xdatas.push(i.replace("-", "."));
        res[i].forEach(item => {
          if (CARD_CODE[item.illegalType] || CARD_CODE[item.illegalType] == 0) {
            this.ydatas[CARD_CODE[item.illegalType] + 1][
              num
            ] = item.percent.replace("%", "");
            this.datas[CARD_CODE[item.illegalType] + 1][
              num
            ].value = item.percent.replace("%", "");
            this.datas[CARD_CODE[item.illegalType] + 1][num].count = item.count;
          }
          if (item.illegalType == "_TOTAL") {
            this.ydatas[0][num] = item.percent.replace("%", "");
            this.datas[0][num].value = item.percent.replace("%", "");
            this.datas[0][num].count = item.count;
          }
        });
        num++;
      }
      this.$nextTick(() => {
        this.getCharts();
      });
    },
    getCharts() {
      let datas = this.datas;
      let color = this.color;
      let option = {
        tooltip: {
          trigger: "axis",
          formatter(value) {
            let html = `${value[0].name}`;
            if (value[0].value == 0) {
              html += `<br /> 暂无数据<span style="margin: 0 20px"></span>`;
              return html;
            }
            value.forEach(item => {
              let index = item.dataIndex;
              if (item.seriesName == "全部") {
                html += `<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[0]
                };"></span>${item.seriesName} ${datas[0][index].value}% (${
                  datas[0][index].count
                })`;
              }
              if (item.seriesName == "许可证未公示") {
                html += `<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[1]
                };"></span>${item.seriesName} ${datas[1][index].value}% (${
                  datas[1][index].count
                })`;
              }
              if (item.seriesName == "证件模糊") {
                html += `<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[2]
                };"></span>${item.seriesName} ${datas[2][index].value}% (${
                  datas[2][index].count
                })`;
              }
              if (item.seriesName == "证件过期") {
                html += `<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[3]
                };"></span>${item.seriesName} ${datas[3][index].value}% (${
                  datas[3][index].count
                })`;
              }
              if (item.seriesName == "超范围经营") {
                html += `<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[4]
                };"></span>${item.seriesName} ${datas[4][index].value}% (${
                  datas[4][index].count
                })`;
              }
              if (item.seriesName == "疑似假证") {
                html += `<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[5]
                };"></span>${item.seriesName} ${datas[5][index].value}% (${
                  datas[5][index].count
                })`;
              }
              if (item.seriesName == "一证多用") {
                html += `<br /><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  color[6]
                };"></span>${item.seriesName} ${datas[6][index].value}% (${
                  datas[6][index].count
                })`;
              }
            });
            return html;
          }
        },
        legend: {
          data: this.lengData,
          top: "10",
          right: 20,
          selected: this.selected,
          textStyle: {
            //图例文字的样式
            color: "#999",
            fontSize: 13
          }
        },
        grid: {
          left: 60,
          right: 40,
          bottom: 40,
          top: 40
        },
        color: this.color,
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666",
              fontSize: "13"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#eee"
            }
          },
          data: this.xdatas,
          offset: 6
        },
        yAxis: {
          type: "value",
          max: e => {
            return 100;
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#eee",
              width: 1
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666",
              fontSize: "13"
            },
            formatter(value) {
              if (value == 0) {
                return 0;
              } else {
                return value + "%";
              }
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#666"
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: "全部",
            type: "line",
            data: this.ydatas[0]
          },
          {
            name: "许可证未公示",
            type: "line",
            data: this.ydatas[1]
          },
          {
            name: "证件模糊",
            type: "line",
            data: this.ydatas[2]
          },
          {
            name: "证件过期",
            type: "line",
            data: this.ydatas[3]
          },
          {
            name: "超范围经营",
            type: "line",
            data: this.ydatas[4]
          },
          {
            name: "疑似假证",
            type: "line",
            data: this.ydatas[5]
          },
          {
            name: "一证多用",
            type: "line",
            data: this.ydatas[6]
          }
        ]
      };
      this.myChart.setOption(option, true);
    }
  },
  beforeDestroy() {
    this.myChart.clear();
  },
  mounted() {
    this.init();
  },
  props: {
    illegalRate: {
      type: Object,
      default: {}
    }
  },
  watch: {
    illegalRate(a, b) {
      this.$nextTick(() => {
        this.getDatas(a);
      });
    },
    $route(to, from) {
      this.selected = {
        全部: true,
        许可证未公示: true,
        证件模糊: false,
        证件过期: false,
        超范围经营: false,
        疑似假证: false,
        一证多用: false
      };
    }
  }
};
</script>

<style lang="scss">
</style>