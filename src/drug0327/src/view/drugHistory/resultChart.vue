<template>
  <div id="resultChart">
    <div class="tree-chart" id="tree-chart"></div>
  </div>
</template>
<script>
import { throttle } from "@/unit/pub.js";

const symbolSize = {
  startSize: [19, 16],
  levelSize: [18, 17],
  hospitalSize: [20, 17],
  storeSize: [13, 19]
};

export default {
  data() {
    return {
      treeChart: "",
      treeData: [],
      symbolExpand: false
    };
  },
  created() {
    this.treeData = [
      {
        name: "生产厂家",
        collapsed: false,
        symbol: `image://${require("./images/start.png")}`,
        normalSymbol: `image://${require("./images/start.png")}`,
        lightSymbol: `image://${require("./images/start-a.png")}`,
        symbolSize: [19, 16],
        value: ["生产厂家名称", 100, 200, 300],
        children: [
          {
            name: "一级分销",
            collapsed: false,
            symbol: `image://${require("./images/level.png")}`,
            normalSymbol: `image://${require("./images/level.png")}`,
            lightSymbol: `image://${require("./images/level-a.png")}`,
            symbolSize: [18, 17],
            value: [],
            children: [
              {
                name: "二级分销",
                collapsed: false,
                lastChild: false,
                symbol: `image://${require("./images/level.png")}`,
                normalSymbol: `image://${require("./images/level.png")}`,
                lightSymbol: `image://${require("./images/level-a.png")}`,
                symbolSize: [18, 17],
                value: ["二级分销名称", 100, 200, 300],
                children: [
                  {
                    name: "医疗机构",
                    collapsed: false,
                    lastChild: true,
                    symbol: "circle",
                    symbol: `image://${require("./images/hospital.png")}`,
                    normalSymbol: `image://${require("./images/hospital.png")}`,
                    lightSymbol: `image://${require("./images/hospital-a.png")}`,
                    symbolSize: [20, 17],
                    value: ["二级分销名称", 100, 200, 300]
                  },
                  {
                    name: "终端药店",
                    collapsed: false,
                    lastChild: true,
                    symbol: "circle",
                    symbol: `image://${require("./images/store.png")}`,
                    normalSymbol: `image://${require("./images/store.png")}`,
                    lightSymbol: `image://${require("./images/store-a.png")}`,
                    symbolSize: [13, 19],
                    value: ["二级分销名称", 100, 200, 300]
                  }
                ]
              },
              {
                name: "二级分销",
                collapsed: false,
                lastChild: true,
                symbol: `image://${require("./images/level.png")}`,
                normalSymbol: `image://${require("./images/level.png")}`,
                lightSymbol: `image://${require("./images/level-a.png")}`,
                symbolSize: [18, 17],
                value: ["二级分销名称", 100, 200, 300]
              }
            ]
          },
          {
            name: "一级分销",
            collapsed: false,
            symbol: `image://${require("./images/level.png")}`,
            normalSymbol: `image://${require("./images/level.png")}`,
            lightSymbol: `image://${require("./images/level-a.png")}`,
            symbolSize: [18, 17],
            value: ["一级分销名称", 100, 200, 300],
            children: [
              {
                name: "医疗机构",
                symbol: `image://${require("./images/hospital.png")}`,
                normalSymbol: `image://${require("./images/hospital.png")}`,
                lightSymbol: `image://${require("./images/hospital-a.png")}`,
                symbolSize: [20, 17],
                collapsed: false,
                value: ["二级分销名称", 100, 200, 300],
                lastChild: true
              }
            ]
          }
        ]
      }
    ];
    // for (let i = 0; i < 2; i++) {
    //   this.treeData[0].children.push({
    //     name: "一级分销",
    //     collapsed: false,
    //     symbol: `image://${require("./images/level11.png")}`,
    //     normalSymbol: `image://${require("./images/level1.png")}`,
    //     lightSymbol: `image://${require("./images/level11.png")}`,
    //     symbolSize: [20, 17],
    //     value: [],
    //     children: [
    //       {
    //         name: "二级分销",
    //         collapsed: false,
    //         lastChild: true,
    //         symbol: "circle",
    //         symbol: `image://${require("./images/level11.png")}`,
    //         normalSymbol: `image://${require("./images/level1.png")}`,
    //         lightSymbol: `image://${require("./images/level11.png")}`,
    //         symbolSize: [20, 17],
    //         value: ["二级分销名称", 100, 200, 300]
    //       }
    //     ]
    //   });
    // }
  },
  methods: {
    init() {
      this.treeChart = this.$echarts.init(
        document.getElementById("tree-chart")
      );
      window.addEventListener("resize", throttle(this.treeChart.resize));
    },
    initTreeChart() {
      let option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          padding: 0,
          formatter: params => {
            // console.log(params);
            return `<div style="padding:10px;background:#69CFFE;color:#fff;border:none;border-radius:4px;"><p style="font-size:14px;margin-bottom:10px;">${
              params.data.value[0] === undefined ? "暂无" : params.data.value[0]
            }</p><p style="font-size:12px;">入库数量：${
              params.data.value[1] === undefined ? "暂无" : params.data.value[1]
            }</p><p style="font-size:12px;">出库数量：${
              params.data.value[2] === undefined ? "暂无" : params.data.value[2]
            }</p><p style="font-size:12px;">库存数量：${
              params.data.value[3] === undefined ? "暂无" : params.data.value[3]
            }</p></div>`;
          }
        },
        series: [
          {
            type: "tree",
            data: this.treeData,
            label: {
              normal: {
                show: true,
                position: "bottom",
                color: "#fff",
                offset: [0, 0],
                formatter: ["{a|}", "{b|{b}}"].join(" "),
                rich: {
                  a: {
                    display: "block",
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: "#fff"
                  }
                }
              }
            },
            symbol: "emptyCircle",
            // symbolOffset: [0, -50],
            expandAndCollapse: true, // 折叠
            animationDuration: 20
            // initialTreeDepth: 2
            // leaves: {
            //   label: {
            //     normal: {
            //       show: true,
            //       position: [50, 50]
            //     }
            //   },
            //   itemStyle: {},
            //   emphasis: {}
            // }
          }
        ]
      };

      this.treeChart.setOption(option, false);
      this.treeChart.on("click", e => {
        // console.log(e);
        if (!e.data.lastChild) {
          setTimeout(() => {
            if (!e.data.collapsed) {
              e.data.symbol = e.data.lightSymbol;
            } else {
              e.data.symbol = e.data.normalSymbol;
            }
            e.data.collapsed = !e.data.collapsed;
            let option = this.treeChart.getOption();
            this.treeChart.setOption(option, false);
          }, 50);
        }
      });
    }
  },
  mounted() {
    this.init();
    this.initTreeChart();
  }
};
</script>
<style lang="scss" scoped>
#resultChart {
  width: 100%;
  height: 100%;
  .tree-chart {
    width: 100%;
    height: 100%;
  }
}
</style>



