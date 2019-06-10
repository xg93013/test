<template>
  <div class="out" id="3d-chart"></div>
</template>
<script>
import echarts from "echarts";
import "echarts-gl";
import { throttle } from "@/unit/pub.js";
export default {
  data() {
    return {
      myChart: "",
      interval: "auto"
    };
  },
  created() {},
  methods: {
    init() {
      this.myChart = echarts.init(document.getElementById("3d-chart"));
      // window.addEventListener("resize", () => {
      //   setTimeout(() => {
      //     this.myChart.resize();
      //   }, 20);
      // });
    },
    initChart() {
      // 区域
      var areas = [
        "高新区",
        "青羊区",
        "青羊区a",
        "青羊区b",
        "青羊区v",
        "青羊区c",
        "青羊区e",
        "青羊区f",
        "青羊区g",
        "青羊区h",
        "青羊区k",
        "青羊区e",
        "青羊区f",
        "青羊区g",
        "青羊区h",
        "青羊区k",
        "青羊区e",
        "青羊区f",
        "青羊区g",
        "青羊区h",
        "青羊区k"
      ];
      // ["a", "b", "c", "d", "e", "f", "g", "h", "f", "k"];
      // 巡查时间
      var times = [
        "2019.01.02",
        "2019.01.03",
        "2019.01.04",
        "2019.01.05",
        "2019.01.06",
        "2019.01.07",
        "2019.01.08",
        "2019.01.09",
        "2019.01.10",
        "2019.01.11",
        "2019.01.12",
        "2019.01.12"
      ];

      // 巡查频次
      var data = [
        [0, 0, 5],
        [0, 1, 1],
        [1, 2, 5],
        [2, 3, 5],
        [3, 4, 5],
        [4, 5, 5],
        [5, 4, 5],
        [6, 5, 5],
        [7, 5, 5],
        [8, 5, 5]
      ];
      let options = {
        tooltip: {},
        visualMap: {
          max: 20,
          show: false,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026"
            ]
          }
        },
        xAxis3D: {
          type: "category",
          data: areas,
          name: "",
          axisLabel: {
            interval: this.interval
          }
        },
        yAxis3D: {
          type: "category",
          data: times,
          name: "",
          axisLabel: {
            interval: this.interval
          }
        },
        zAxis3D: {
          type: "value",
          name: ""
        },
        grid3D: {
          boxWidth: 190,
          boxDepth: 50,
          viewControl: {
            // projection: 'orthographic'
          },
          light: {
            main: {
              intensity: 1.2,
              shadow: true
            },
            ambient: {
              intensity: 0.3
            }
          }
        },
        series: [
          {
            type: "bar3D",
            data: data,
            shading: "lambert",
            bevelSize: 0.2,
            label: {
              distance: 1,
              textStyle: {
                fontSize: 16,
                borderWidth: 1
              }
            },

            emphasis: {
              label: {
                textStyle: {
                  fontSize: 20,
                  color: "#900"
                }
              },
              itemStyle: {
                color: "#900"
              }
            }
          }
        ]
      };
      this.myChart.setOption(options);
    },
    resizeChart() {
      this.interval = 0;
      this.initChart();
      this.myChart.resize();
    },
    serDefaultChart() {
      this.interval = "auto";
      this.initChart();
      this.myChart.resize();
    }
  },
  mounted() {
    this.init();
    this.initChart();
  }
};
</script>
<style lang="scss">
.out {
  width: 100%;
  height: 100%;
  // position: absolute;
}
</style>

