<template>
  <div id="drugSafe">
    <div class="title">流通环节分布</div>
    <div class="chart-box">
      <div class="chart" id="pie-chart"></div>
      <div class="empty" v-show="showEmpty">暂无数据</div>
    </div>
  </div>
</template>
<script>
import commonConfig from "@/js/common.js";
import { throttle } from "@/unit/pub.js";

const color = ["#805CCA", "#1589F4", "#23CDAB", "#DF5A76", "#008AFF"];

export default {
  data() {
    return {
      pieChart: "",
      pieData: [],
      showEmpty: true
    };
  },
  created() {},
  props: {
    circulationlink: {
      type: Array,
      default: []
    }
  },
  watch: {
    circulationlink(a) {
      this.showEmpty = false;
      this.pieData = [];
      if (a.length === 0) {
        this.showEmpty = true;
      }

      for (let i = 0; i < a.length; i++) {
        this.pieData.push({
          name: a[i].entTypeName,
          value: a[i].total
          // percent: a[i].percent
        });
      }
      this.$nextTick(() => {
        this.initPieChart();
      });
    }
  },
  methods: {
    init() {
      this.mapChart = this.$echarts.init(document.getElementById("pie-chart"));
      window.addEventListener("resize", throttle(this.mapChart.resize));
    },
    initPieChart() {
      let option = {
        title: {
          text: "",
          left: 20,
          top: 10,
          fontWeight: "lighter"
        },
        series: [
          {
            type: "pie",
            roseType: "radius",
            radius: ["35%", "60%"],
            center: ["50%", "50%"],
            data: this.pieData,
            color: color,
            label: {
              show: true,
              color: "#CEE8FF",
              fontSize: 12,
              lineHeight: 16,
              textAlign: "left",
              formatter: ["{c|{d}%\n{b}：{c}}"].join(""),
              rich: {
                c: {
                  padding: [2, 4],
                  align: "left",
                  color: "#CEE8FF"
                }
              }
            },
            labelLine: {
              show: true,
              type: "dotted",
              length: 7,
              length2: 15,
              lineStyle: {
                // color: "#fff"
              }
            }
          }
        ]
      };

      this.mapChart.setOption(option);
    }
  },
  mounted() {
    this.init();
    // this.initPieChart();
  }
};
</script>
<style lang="scss" scoped>
</style>



