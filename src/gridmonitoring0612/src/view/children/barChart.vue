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
      interval: "auto",
      datas: []
    };
  },
  props: {
    gldatas: {
      type: Array,
      default: []
    }
  },
  watch: {
    gldatas(a) {
      if (a) {
        this.datas = a;
        this.$nextTick(() => {
          this.initChart(a);
        });
      }
    }
  },
  created() {},
  methods: {
    init() {
      this.myChart = echarts.init(document.getElementById("3d-chart"));
    },
    initChart(arr) {
      // 区域
      let areas = [
        // "高新区",
        // "青羊区",
        // "青羊区a",
        // "青羊区b",
        // "青羊区v",
        // "青羊区c",
        // "青羊区e",
        // "青羊区f",
        // "青羊区g",
        // "青羊区h",
        // "青羊区k",
        // "青羊区e",
        // "青羊区f",
        // "青羊区g",
        // "青羊区h",
        // "青羊区k",
        // "青羊区e",
        // "青羊区f",
        // "青羊区g",
        // "青羊区h",
        // "青羊区k"
      ];

      // ["a", "b", "c", "d", "e", "f", "g", "h", "f", "k"];
      // 巡查时间
      let times = [
        // "2019.01.02",
        // "2019.01.03",
        // "2019.01.04",
        // "2019.01.05",
        // "2019.01.06",
        // "2019.01.07",
        // "2019.01.08",
        // "2019.01.09",
        // "2019.01.10",
        // "2019.01.11",
        // "2019.01.12",
        // "2019.01.12"
      ];
      let data = [];
      for (let key in arr[0]) {
        arr[0][key].forEach(itema => {
          areas.push(itema.district);
        });
      }
      arr.forEach((itemb, indexb) => {
        for (let key in itemb) {
          times.push(key);
          itemb[key].forEach((itemc, indexc) => {
            data.push([indexb, indexc, itemc.frequency]);
          });
        }
      });
      // 巡查频次
      // let data = [
      // [0, 0, 5],
      // [0, 1, 1],
      // [1, 2, 5],
      // [2, 3, 5],
      // [3, 4, 5],
      // [4, 5, 5],
      // [5, 4, 5],
      // [6, 5, 5],
      // [7, 5, 5],
      // [8, 5, 5],
      // [6, 4, 5],
      // [7, 3, 5],
      // [8, 2, 5],
      // [6, 1, 5],
      // [7, 2, 5],
      // [2, 3, 5],
      // [5, 5, 5],
      // [3, 2, 5],
      // [4, 5, 5],
      // [7, 5, 5],
      // [5, 1, 5],
      // [6, 6, 5],
      // [8, 5, 5],
      // [9, 3, 5],
      // [10, 2, 5],
      // [11, 2, 5],
      // [12, 2, 5],
      // [13, 2, 5],
      // [14, 2, 5],
      // [15, 2, 5],
      // [16, 2, 5],
      // [17, 2, 5],
      // [18, 2, 5],
      // [19, 2, 5],
      // [20, 2, 5],
      // [21, 2, 5]
      // ];
      let options = {
        tooltip: {
          formatter: params => {
            let data = params.data;
            return areas[data[0]] + ":" + times[data[1]] + ":" + data[2];
          }
        },
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
            interval: this.interval,
            textStyle: {
              color: "#ccc"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#0C1941"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0, 150, 229, 0.2)"
            }
          }
        },
        yAxis3D: {
          type: "category",
          data: times,
          name: "",
          axisLabel: {
            interval: this.interval,
            textStyle: {
              color: "#ccc"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#0C1941"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0, 150, 229, 0.2)"
            }
          }
        },
        zAxis3D: {
          type: "value",
          name: "",
          axisLabel: {
            textStyle: {
              color: "#ccc"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#0C1941"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0, 150, 229, 0.2)"
            }
          }
        },
        grid3D: {
          boxWidth: 180,
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
            data: data.map(item => {
              return [item[1], item[0], item[2]];
            }),
            shading: "lambert",
            bevelSize: 0.2,
            label: {
              distance: 1,
              textStyle: {
                fontSize: 16,
                borderWidth: 1,
                color: "#eee"
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
      this.initChart(this.datas);
      this.myChart.resize();
    },
    serDefaultChart() {
      this.interval = "auto";
      this.initChart(this.datas);
      this.myChart.resize();
    },
    clearChart() {
      this.myChart.clear();
    }
  },
  mounted() {
    this.init();
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

