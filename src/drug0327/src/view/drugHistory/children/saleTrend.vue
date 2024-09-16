<template>
  <div id="drugSafe">
    <div class="title">
      <div class="left">销量及库存趋势</div>
      <div class="right tab-nav">
        <!-- <el-button>销量</el-button>
        <el-button>库存</el-button>-->
        <span
          class="tab-item leftTab"
          :class="{'active' : tabIndex ===0}"
          @click="changeTabIndex(0)"
        >销量</span>
        <span
          class="tab-item rightTab"
          :class="{'active' : tabIndex ===1}"
          @click="changeTabIndex(1)"
        >库存</span>
      </div>
    </div>
    <div class="chart-box">
      <div class="chart" id="sale-line"></div>
    </div>
  </div>
</template>
<script>
import commonConfig from "@/js/common.js";
import { throttle } from "@/unit/pub.js";

const color = ["#9FE05D", "#51E4C1", "#0FC5F4", "#19A0FF", "#805CCA"];

export default {
  data() {
    return {
      pieChart: "",
      tabIndex: 0,
      mainData: {
        seriesData: [],
        xData: ["2019-01", "2018-01", "2018-02", "2018-02", "2018-03"],
        xAxisName: "(件)",
        interval: "no",
        toolTipName: "销量"
      }
    };
  },
  props: {
    saletrend: {
      type: Array,
      default: []
    }
  },
  watch: {
    saletrend(a) {
      // console.log(a);
      this.mainData.xData = [];
      this.mainData.seriesData = [];
      for (let i = 0; i < a.length; i++) {
        this.mainData.seriesData.push(a[i].TOTAL);
        this.mainData.xData.push(a[i].BILLDATE);
      }
      this.$nextTick(() => {
        this.initLineChart();
      });
    }
  },
  methods: {
    init() {
      this.mapChart = this.$echarts.init(document.getElementById("sale-line"));
      window.addEventListener("resize", throttle(this.mapChart.resize));
    },
    changeTabIndex(index) {
      this.tabIndex = index;
    },
    initLineChart() {
      // let data = {};

      // for (let i = 0; i < arr.length; i++) {
      //   aSeries.data.push(arr[i].ACOUNT);
      //   rSeries.data.push(arr[i].RCOUNT);
      //   this.mainData.xData.push(arr[i].DATEVALUE);
      // }

      // data.seriesData = [aSeries, rSeries];

      this.mapChart.setOption(commonConfig.lineChart(this.mainData));
    }
  },
  mounted() {
    this.init();
    // this.initLineChart();
  }
};
</script>
<style lang="scss" scoped>
#drugSafe {
  .tab-nav {
    width: 135px;
    float: right;
    margin: 20px 30px 0 0;
    .tab-item {
      display: block;
      width: 65px;
      height: 30px;
      float: left;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      border: 1px solid #0099ff;
      &.active {
        background: #0099ff;
        color: #fff;
      }
    }
    .leftTab {
      border-radius: 4px 0 0 4px;
    }
    .rightTab {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>



