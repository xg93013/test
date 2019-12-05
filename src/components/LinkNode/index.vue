<template>
  <div id="link-node">
    <div id="parent-box" :class="{'show':!showDetail}"></div>
    <div class="back" v-show="showDetail" @click="backTotal">
      <svg-icon iconClass="back"></svg-icon>返回
    </div>
    <div id="children-box" :class="{'show':showDetail}"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import allNodes from "@/assets/linkData/qy_all.json";
import allLinks from "@/assets/linkData/relation.json";
export default {
  components: {},
  data() {
    return {
      allChart: {},
      currentId: "parent-one",
      allPages: [
        {
          id: "parent-one",
          name: "aaa"
        },
        {
          id: "parent-two",
          name: "aaa"
        },
        {
          id: "parent-three",
          name: "aaa"
        },
        {
          id: "parent-four",
          name: "aaa"
        },
        {
          id: "parent-five",
          name: "aaa"
        }
      ],
      color: {
        "parent-one": "orange",
        "parent-two": "red",
        "parent-three": "red",
        "parent-four": "red",
        "parent-five": "red"
      },
      originData: {
        "parent-one": [10, 20, 15],
        "parent-two": [15, 45, 80],
        "parent-three": [15, 45, 80],
        "parent-four": [15, 45, 50],
        "parent-five": [15, 45, 30]
      },
      showDetail: false,
      myChart: "",
      typeColor: {
        "01": "#FFDB5C",
        "02": "#CC6666",
        "03": "#EA7E53",
        "04": "#DD6B66"
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log(allNodes);
    this.initChart();
  },
  methods: {
    backTotal() {
      this.showDetail = false;
      this.initChart();
    },
    initChart(detail) {
      let colors = [
        "#FFDB5C",
        "#E69D87",
        "#EA7E53",
        "#DD6B66",
        "#37A2DA",
        "#32C5E9",
        "#67E0E3",
        "#8DC1A9",
        "#91C7AE",
        "#9FE6B8",
        "#2F4554",
        "#61A0A8",
        "#759AA0"
      ];
      let myChart = "";
      if (this.myChart) {
        this.myChart.clear();
      }
      if (!detail) {
        myChart = echarts.init(document.getElementById("parent-box"));
      } else {
        myChart = echarts.init(document.getElementById("children-box"));
      }
      let nodes = [];
      let links = [];
      for (let i = 0; i < allLinks.length; i++) {
        for (let j = 0; j < allLinks[i].length; j++) {
          let flag = this.getOneNodeFlag(nodes, allLinks[i][j]);
          if (!flag) {
            let value = this.getNodeValue(allLinks[i][j]);
            if (detail) {
              if (detail == allLinks[i][0]) {
                nodes.push({
                  name: allLinks[i][j],
                  value: value.value,
                  symbolSize: 10,
                  itemStyle: {
                    // color: colors[Math.floor(value / 50)]
                    normal: {
                      color: this.typeColor[value.type]
                    }
                  }
                });
              }
            } else {
              nodes.push({
                name: allLinks[i][j],
                value: value.value,
                symbolSize: 10,
                itemStyle: {
                  // color: colors[Math.floor(value / 50)]
                  normal: {
                    color: this.typeColor[value.type]
                  }
                }
              });
            }
          }
        }
        let linkflag = this.getLinksFlag(links, allLinks[i]);
        if (!linkflag) {
          if (detail) {
            if (detail == allLinks[i][0]) {
              links.push({
                source: allLinks[i][0],
                target: allLinks[i][1]
              });
            }
          } else {
            links.push({
              source: allLinks[i][0],
              target: allLinks[i][1]
            });
          }
        }
      }
      // for (let i = 0; i < allNodes.length; i++) {
      //   nodes.push({
      //     name: allNodes[i].name,
      //     value: allNodes[i].value,
      //     symbolSize: allNodes[i].value,
      //     itemStyle: {
      //       color: colors[0]
      //     }
      //   });
      // }
      // for (let i = 0; i < allLinks.length; i++) {
      //   links.push({
      //     source: allLinks[i][0],
      //     target: allLinks[i][1]
      //   });
      // }
      let option = {
        title: {
          text: "",
          subtext: "",
          top: "center",
          left: "left"
        },
        tooltip: {
          triggerOn: "mousemove",
          formatter: params => {
            if (params.dataType == "node") {
              return params.data.name + "<br />" + params.data.value;
            }
          }
        },
        // grid: {
        //   top: 100,
        //   bottom: 100,
        //   left: 100,
        //   right: 100
        // },
        animation: false,
        series: [
          {
            name: "",
            type: "graph",
            layout: "force",
            data: nodes,
            color: colors,
            links: links,
            roam: true,
            draggable: true,
            top: 300,
            bottom: 300,
            focusNodeAdjacency: true,
            label: {
              normal: {
                show: true,
                position: "bottom",
                formatter: params => {
                  if (parseInt(params.data.value) > 20) {
                    return params.data.name;
                  }
                }
              }
            },
            // itemStyle: {
            //   color: colors
            // },
            force: {
              // initLayout: "circular",
              edgeLength: [30, 50],
              repulsion: detail ? 180 : 80
            },
            animationDuration: 90
          }
        ]
      };
      myChart.setOption(option);
      myChart.off("dblclick");
      myChart.on("dblclick", e => {
        let flag = this.getOneLinkFlag(e.data.name);
        if (!detail && flag) {
          this.showDetail = true;
          this.$nextTick(() => {
            this.initChart(e.data.name);
          });
        }
      });
      this.myChart = myChart;
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
    getNodeValue(label) {
      let value = 0;
      let type = "";
      for (let i = 0; i < allNodes.length; i++) {
        if (label == allNodes[i].name) {
          value = allNodes[i].value;
          type = allNodes[i].linkId;
          break;
        } else {
          continue;
        }
      }
      return { value: value, type: type };
    },
    getOneNodeFlag(arr, label) {
      let flag = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == label) {
          flag = true;
          break;
        } else {
          continue;
        }
      }
      return flag;
    },
    getOneLinkFlag(label) {
      let arr = allLinks;
      let flag = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] == label) {
          flag = true;
          break;
        } else {
          continue;
        }
      }
      return flag;
    },
    getLinksFlag(arr, oneArr) {
      let flag = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].source == oneArr[0] && arr[i].target == oneArr[1]) {
          flag = true;
          break;
        } else {
          continue;
        }
      }
      return flag;
    }
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  destroyed() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
#link-node {
  width: 100%;
  height: 100%;
  // background: #fff;
  position: relative;
  .back {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 999;
    cursor: pointer;
    color: #fff;
  }
  #parent-box,
  #children-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    &.show {
      visibility: visible;
    }
  }
}
</style>