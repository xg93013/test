<template>
  <div class="out" id="full-charts"></div>
</template>
<script>
import echarts from "echarts";
import "echarts-gl";
import { throttle } from "@/unit/pub.js";
export default {
  data() {
    return {
      myChart: "",
      datas: []
    };
  },
  props: {
    gldatas: {
      type: Array,
      default: []
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    gldatas(a) {
      if (a) {
        this.datas = a;
      }
    },
    fullscreen(a) {
      this.clearChart();
      this.fullscreen = a;
      if (a) {
        setTimeout(() => {
          this.initChart(this.datas);
          this.myChart.resize();
        }, 200);
      }
    }
  },
  created() {},
  methods: {
    init() {
      this.myChart = echarts.init(document.getElementById("full-charts"));
      window.addEventListener("resize", throttle(this.myChart.resize));
    },
    initChart(arr) {
      if (this.myChart) {
        this.myChart.clear();
      }
      let [interval, showLabel, margin, len] = [0, true, 2, arr.length];
      // 区域
      let areas = [];
      // 巡查时间
      let times = [];
      // 巡查频次
      let data = [];
      let frequency = [];
      for (let key in arr[0]) {
        arr[0][key].forEach(itema => {
          areas.push(itema.district);
        });
      }
      arr.forEach((itemb, indexb) => {
        if (indexb <= len) {
          for (let key in itemb) {
            times.push(key);
            itemb[key].forEach((itemc, indexc) => {
              data.push([indexb, indexc, itemc.frequency]);
              frequency.push(itemc.frequency);
            });
          }
        }
      });
      let maxArr = frequency.sort((a, b) => {
        return b - a;
      });

      let options = {
        title: {
          text: "网格员巡查频次对比",
          textStyle: {
            color: "#13fcff",
            fontWeight: "lighter"
          },
          top: 50,
          left: "center"
        },
        tooltip: {
          confine: true,
          formatter: params => {
            let data = params.data;
            return (
              areas[data[0]] +
              "：" +
              times[data[1]] +
              "<br/>巡查频次：" +
              data[2]
            );
          }
        },
        visualMap: {
          max: maxArr[0],
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
          // nameGap: 30,
          axisLabel: {
            interval: interval,
            margin: margin,
            textStyle: {
              color: "#ccc",
              fontSize: 10
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
            show: showLabel,
            interval: 0,
            margin: margin,
            textStyle: {
              color: "#ccc",
              fontSize: 10
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
            interval: "auto",
            margin: margin,
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
          boxWidth: 170,
          boxHeight: 60,
          boxDepth: 80,
          viewControl: {
            // projection: "orthographic"
            alpha: 15,
            beta: -30
          },
          axisLabel: {},
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
            // bevelSize: 0.2,
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
    clearChart() {
      if (this.myChart) {
        this.myChart.clear();
      }
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
}
</style>