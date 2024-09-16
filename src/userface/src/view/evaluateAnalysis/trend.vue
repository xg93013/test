<template>
  <div id="trend" class="trend">
    <div class="title">风险词频变化趋势</div>
    <div id="trendBox"></div>
    <!-- <div class="empty" v-show="seriesDatab.length==0">暂无数据</div> -->
  </div>
</template>

<script>
import echarts from "echarts";
import { throttle } from "@/unit/pub";
export default {
  data() {
    return {
      myChart: null,
      color: ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"],
      allData: [],
      legendData: [],
      selected: {},
      xData: [],
      seriesData: []
    };
  },
  props: {
    trend: {
      type: Array,
      default: []
    },
    allRiskTypes: {
      type: Array,
      default: []
    }
  },
  watch: {
    trend(a) {
      // console.log(a);
      this.allData = [...a];
      this.$nextTick(() => {
        this.getDatas(this.allData);
      });
    },
    allRiskTypes(a) {
      this.legendData = [...a];
      a.forEach(item => {
        if (!this.selected.hasOwnProperty(item)) {
          this.selected[item] = true;
        }
      });
    }
  },
  methods: {
    getDatas(data) {
      this.xData = [];
      this.seriesData = [];
      // if (this.legendData.length != 0) {
      data.forEach(item => {
        this.xData.push(item.collectOn);
      });
      // }

      this.legendData.forEach((itema, index) => {
        let oneSeries = {
          name: itema,
          type: "line",
          stack: "a",
          data: [],
          areaStyle: {
            color: this.color[index],
            opacity: 0.1
          },
          smooth: true
        };
        data.forEach(itemb => {
          let isKey = false; // 存在该类型
          let isIndex = 0;
          if (itemb.counts.length != 0) {
            for (let i = 0; i < itemb.counts.length; i++) {
              if (itemb.counts[i].riskType === itema) {
                isKey = true;
                isIndex = i;
                break;
              } else {
                isKey = false;
                continue;
              }
            }
          }

          if (isKey) {
            oneSeries.data.push(itemb.counts[isIndex].value);
          } else {
            oneSeries.data.push(0);
          }
        });
        this.seriesData.push(oneSeries);
      });
      this.getCharts();
    },
    init() {
      this.myChart = echarts.init(document.getElementById("trendBox"));
      this.myChart.on("legendselectchanged", e => {
        this.selected = {
          ...e.selected
        };
      });
      window.addEventListener("resize", throttle(this.myChart.resize));
    },
    getCharts() {
      let color = this.color;
      let data = this.allData;
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: params => {
            let total = 0;
            let addHtml = "";
            params.forEach((item, index) => {
              addHtml += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                color[item.seriesIndex]
              }"></span>
              <span>${item.seriesName}：</span><span>${item.value}</span><br/>`;
              total += item.value;
            });
            let html = `${
              params[0].name
            }<span style="margin-left:10px">${total}</span><br/>`;

            html = html + addHtml;
            return html;
          }
        },
        color: this.color,
        legend: {
          top: 10,
          right: 20,
          data: this.legendData,
          selected: this.selected
        },
        grid: {
          left: 30,
          right: 30,
          bottom: 16,
          top: 40,
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#eee"
            }
          }
        },
        series: this.seriesData
      };
      this.myChart.setOption(option, true);
    }
  },
  beforeDestroy() {
    this.myChart.clear();
  },
  mounted() {
    // this.getCharts();
    this.init();
  }
};
</script>

<style lang="scss">
#trend {
  #trendBox {
    width: 100%;
    height: 100%;
    background: #fff;
  }
}
</style>