<template>
  <div id="a"></div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {
    init() {
      let data = [];
      // 多系列柱状图
      const option = {
        color: ["#0066ff", "#20f2ff"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              type: "dashed"
            }
          }
        },
        legend: {
          top: 0,
          right: 40,
          selectedMode: false,
          textStyle: {
            color: "#72B5E6"
          },
          data: ["legend1", "legend2", "legend3"]
        },
        grid: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: data,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#00A5E7"
            }
          },
          axisLabel: {
            color: "#AAD7FF",
            fontSize: 12
          },
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#2B60A2"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#00A5E7"
            }
          },
          axisLabel: {
            color: "#AAD7FF",
            fontSize: 12,
            interval: 0
          },
          axisTick: {
            alignWithLabel: true,
            length: 0
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "#2B60A2"
            }
          }
        },
        series: [
          {
            name: "legend1",
            type: "bar",
            stack: "common",
            data: data,
            barMaxWidth: 20,
            barGap: "-100%",
            barCategoryGap: "55%",
            itemStyle: {
              normal: {
                color: "#1E73FF",
                label: {
                  show: false
                }
              }
            }
          },
          {
            name: "legend2",
            type: "bar",
            stack: "common",
            data: data,
            barMaxWidth: 20,
            barGap: "-100%",
            barCategoryGap: "55%",
            itemStyle: {
              normal: {
                color: "#1E73FF",
                label: {
                  show: false
                }
              }
            }
          }
        ]
      };

      // 极坐标柱状
      const polarOption = {
        tooltip: {
          formatter(params) {
            return (
              "" +
              params.data +
              "：" +
              parseInt(datas[params.dataIndex].zb * 10000) / 100 +
              "%"
            );
          }
        },
        angleAxis: {
          show: false,
          max(value) {
            return value.max * 1.5;
          }
        },
        radiusAxis: {
          axisLine: false,
          type: "category",
          data: data,
          z: 0,
          axisLabel: {
            textStyle: {
              color: "#DAE6FF",
              fontSize: "12"
            }
          },
          splitArea: {
            //坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true, //是否显示分隔区域
            areaStyle: {
              //color: ['#21304D', '#1D2B46', '#21304D', '#1D2B46', '#21304D', '#1D2B46', '#21304D'],
            }
          }
        },
        polar: {},
        series: [
          {
            type: "bar",
            data: data,
            coordinateSystem: "polar",
            itemStyle: {
              color: "#DB4141"
            }
          }
        ]
      };
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped="scoped">
</style>