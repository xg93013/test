<template>
  <div id="area-distribute">
    <!-- <my-title :title="title" />
    <div class="chart-box" id="area-chart"></div>-->
    <my-table :tableConfig="areaTable" @exportClick="exportClick" ref="areaTableRefs"/>
  </div>
</template>
<script>
import MyTitle from "@/components/MyTitle";
import MyTable from "@/components/MyTable";
import * as _ from "lodash";
import areaMapConfig from "@/js/areaMap.js";
import apis from '@/unit/apis';
import utils from '@/js/utils';
const { BASE, EXPORT_DDRISK } = apis;
export default {
  components: {
    MyTitle,
    MyTable
  },
  data() {
    return {
      title: "区域分布",
      areaChart: "",
      mainData: "",
      resizeTimer: "",
      areaTable: ""
    };
  },
  created() {
    this.areaTable = {
      title: "药物申报办件风险值",
      exportUrl: EXPORT_DDRISK,
      refName: "areaTableRefs",
      tableColumn: [
        {
          prop: "BJNAME",
          label: "办件名称"
        },
        {
          prop: "SBUNIT",
          label: "申报单位"
        },
        {
          prop: "SBDATE",
          label: "申报日期",
          width: "100"
        },
        {
          prop: "RISKVALUE",
          label: "申报办件风险值",
          align: 'center',
          width: "120"
        }
      ],
      tableData: []
    };
  },
  props: {
    distributeData: {
      type: Array,
      default: []
    }
  },
  watch: {
    distributeData(newV) {
      // this.getData(newV);
      // this.initAreaChart();
      this.areaTable.tableData = newV;
    }
  },
  methods: {
    getData(arr) {
      // max arr
      let inMaxArr = [];
      this.mainData = {
        mapName: "fujian",
        toolTipName: "",
        visualMapMax: 0,
        seriesData: [
          {
            name: "收件",
            data: []
          },
          {
            name: "办结",
            data: []
          }
        ]
      };
      for (let i = 0; i < arr.length; i++) {
        let oneAMap = {};
        let oneRMap = {};
        oneAMap.name = arr[i].CITY;
        oneAMap.value = arr[i].ACOUNT;
        oneRMap.name = arr[i].CITY;
        oneRMap.value = arr[i].RCOUNT;
        this.mainData.seriesData[0].data.push(oneRMap);
        this.mainData.seriesData[1].data.push(oneAMap);
      }
      for (let i = 0; i < this.mainData.seriesData.length; i++) {
        let inData = this.mainData.seriesData[i].data;
        for (let i = 0; i < inData.length; i++) {
          inMaxArr.push(inData[i].value);
        }
      }
      this.mainData.visualMapMax = _.max(inMaxArr);
    },
    initAreaChart() {
      if (this.areaChart !== "") {
        this.areaChart.clear();
      }
      let option = areaMapConfig.normalMap(this.mainData);
      this.areaChart = this.$echarts.init(
        document.getElementById("area-chart")
      );
      this.areaChart.setOption(option);
      window.addEventListener("resize", () => {
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(() => {
          this.areaChart.resize();
        }, 300);
      });
    },
    defaultChart() {
      this.mainData = {
        mapName: "fujian",
        toolTipName: "",
        visualMapMax: 0,
        seriesData: [
          {
            name: "收件",
            data: []
          },
          {
            name: "办结",
            data: []
          }
        ]
      };
      this.initAreaChart();
    },
    exportClick(data) {
      if (data.length > 0) {
        // window.open(BASE_URL + data.url);
        let urls = BASE + data.url;
        utils.exportExport(this, data, urls);
      } else {
      }
    }
  },
  mounted() {
    // this.defaultChart();
  },
  beforeDestroy() {
    if (this.areaChart) {
      this.areaChart.clear();
    }
  }
};
</script>
<style lang="scss" scoped>
#area-distribute {
  width: 100%;
  .chart-box {
    position: absolute;
    top: 32px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>

