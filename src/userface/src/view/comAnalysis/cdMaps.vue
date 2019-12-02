<template>
  <div class="charts">
    <div id="cdMaps"></div>
    <div class="cdmaps-lenged">
      <span class="a" :class="{'lenged-color': isFullScreen}">{{hasHisk?"风险值高":"违规率高"}}</span>
      <span class="b" :class="{'lenged-color': isFullScreen}">{{hasHisk?"风险值低":"违规率低"}}</span>
      <div v-for="(item,index) in lengedColor" :key="index" :style="{background: item}"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { throttle } from "@/unit/pub";
//import cd from './mapJson/chengdu.json'
import { mapState } from "vuex";
import http from "@/unit/http";
import apis from "@/unit/apis";
import ColorRangeMaker from "@/unit/color";
const { REGION_JSON } = apis;
export default {
  data() {
    return {
      borderColor: "#90B2D5",
      areaColor: "#E4EBF3",
      hoverAreaColor: "#CBD6E5",
      textColor: "#666",
      lengedColor: ["#D9534F", "#F4CB25", "#7D55CB", "#276AB0", "#40A42B"],
      areaPoint: {},
      areaDatas: [],
      myChart: null,
      myOption: {},
      mapMsg: null,
      isHover: false,
      imgs: ["c1", "c2", "c3", "c4", "c5"],
      hasHisk: true,
      cm: new ColorRangeMaker({
        // color: [[105,203,4], [242, 245, 26], [227, 122, 53]],
        color: [[105, 203, 4], [250, 175, 10], [185, 8, 8]],
        value: [0, 100]
      })
    };
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.isFullScreen
    })
  },
  methods: {
    getAreaPoint() {
      this.hasHisk = this.$store.state.pages.includes("riskAnalysis")
        ? true
        : false;
      let cd = this.$store.state.mapJson;
      this.mapMsg = {
        ...cd
      };
      this.areaPoint = [];
      cd.features.forEach((item, index) => {
        this.areaPoint[item.properties.name] = item.properties.cp;
      });
      echarts.registerMap("chengdu", this.mapMsg);
      this.myChart = echarts.init(document.getElementById("cdMaps"));
      this.myChart.on("mouseover", v => {
        this.isHover = true;
        // if (v.data.value != undefined) {
        //   this.myChart.dispatchAction({
        //     type: "downplay"
        //   });
        // }
      });
      this.myChart.on("mouseout", () => {
        this.isHover = false;
      });
      this.myChart.on("click", () => {
        if (this.hasHisk) {
          this.$router.push("riskAnalysis");
        }
      });
      window.addEventListener("resize", throttle(this.myChart.resize));
      this.getCharts();
    },
    getData(res) {
      this.areaDatas = [];
      res.forEach(item => {
        let areaPoint = this.areaPoint[item.region];
        let illRate = item.value > 100 ? "100.00" : item.value;
        if (areaPoint) {
          this.areaDatas.push({
            name: item.region,
            value: [...areaPoint, illRate]
          });
        }
      });
      this.$nextTick(() => {
        this.getCharts();
        this.changeData();
      });
    },
    getCharts() {
      let hasHisk = this.hasHisk;
      let txt = this.hasHisk ? "风险值" : "违规率";
      let cityDatas = this.areaDatas;
      this.myOption = {
        tooltip: {
          trigger: "item",
          formatter(value) {
            if (typeof value.value == "object") {
              return (
                `${value.name}<br />${txt}:${value.value[2]}` +
                (hasHisk ? "" : "%")
              );
            } else {
              if (value.data) {
                return (
                  `${value.name}<br />${txt}:${value.data.value[2]}` +
                  (hasHisk ? "" : "%")
                );
              }
            }
          }
        },
        geo: {
          map: "chengdu",
          roam: false,
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              borderWidth: 2,
              borderColor: this.borderColor,
              areaColor: this.areaColor
            },
            emphasis: {
              areaColor: this.hoverAreaColor
            }
          },
          label: {
            normal: {
              show: false,
              color: this.textColor
            },
            emphasis: {
              show: true,
              color: this.textColor
            }
          }
        }
        // visualMap: {
        //   min: 0,
        //   max: 100,
        //   realtime: false,
        //   calculable: true,
        //   inRange: {
        //     color: ["rgb(105, 203, 4)", "rgb(250, 175, 10)", "rgb(185, 8, 8)"]
        //   },
        //   textStyle: {
        //     color: "#333"
        //   },
        //   itemWidth: 20,
        //   itemHeight: 160,
        //   top: 10,
        //   right: 10
        // }
        // series: [
        //   {
        //     name: "",
        //     type: "map",
        //     mapType: "chengdu",
        //     itemStyle: {
        //       normal: {
        //         borderColor: "#276DB1", //省市边界线
        //         borderWidth: 2
        //       },
        //       emphasis: {
        //         show: "true",
        //         color: "rgba(255, 43, 61, .9)" //悬浮背景
        //       }
        //     },
        //     label: {
        //       normal: {
        //         show: true
        //       },
        //       emphasis: {
        //         show: true,
        //         color: "#333"
        //       }
        //     },
        //     data: cityDatas
        //   }
        // ]
      };
      this.myChart.setOption(this.myOption, true);
    },
    changeData() {
      let cityDatas = this.areaDatas,
        lengedColor = this.lengedColor,
        cm = this.cm,
        imgs = this.imgs;
      this.myOption.series = [
        {
          type: "map",
          geoIndex: 0,
          aspectScale: 1,
          data: cityDatas
        },
        {
          //										type: "scatter",
          // type: "effectScatter",
          type: "custom",
          //					symbol:'pin',
          coordinateSystem: "geo",
          symbolSize: 6,
          geoIndex: 0,
          // rippleEffect: {
          //   period: 5,
          //   scale: 5
          // },
          // itemStyle: {
          //   normal: {
          //     color: e => {
          //       let num = e.value[2];
          //       console.log(num);
          //       return "rgb(" + cm.make(num).join(",") + ")";
          //     }
          //   }
          // },
          renderItem(params, api) {
            let img;
            let num = cityDatas[params.dataIndex].value[2];
            if (num >= 0 && num <= 20) {
              img = imgs[4];
            } else if (num > 20 && num <= 40) {
              img = imgs[3];
            } else if (num > 40 && num <= 60) {
              img = imgs[2];
            } else if (num > 60 && num <= 80) {
              img = imgs[1];
            } else if (num > 80 && num <= 100) {
              img = imgs[0];
            }
            return {
              type: "image",
              style: {
                image: require("../../images/" + img + ".png"),
                x:
                  api.coord([
                    cityDatas[params.dataIndex].value[0],
                    cityDatas[params.dataIndex].value[1]
                  ])[0] - 12,
                y:
                  api.coord([
                    cityDatas[params.dataIndex].value[0],
                    cityDatas[params.dataIndex].value[1]
                  ])[1] - 12
              }
            };
          },
          data: cityDatas
        }
      ];
      this.myChart.setOption(this.myOption, true);
    },

    async mapJson() {
      let res = await http.get(REGION_JSON);
      if (res) {
        console.log(JSON.parse(res.result));
      }
    }
  },
  beforeDestroy() {
    this.myChart.clear();
  },
  mounted() {
    this.getAreaPoint();
    //			this.mapJson();
  },
  props: {
    cdMaps: {
      type: Array,
      default: []
    }
  },
  watch: {
    isFullScreen(a, b) {
      if (a) {
        [
          this.borderColor,
          this.areaColor,
          this.hoverAreaColor,
          this.textColor
        ] = [
          "#01C0DD",
          {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: "#366997" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#2A7CA7" // 100% 处的颜色
              }
            ]
          },
          "#1C5A8B",
          "#fff"
        ];
        this.lengedColor = [
          "#FA8858",
          "#F4E925",
          "#0066FF",
          "#00C1DE",
          "#42E265"
        ];
        this.imgs = ["b1", "b2", "b3", "b4", "b5"];
      } else {
        [
          this.borderColor,
          this.areaColor,
          this.hoverAreaColor,
          this.textColor
        ] = ["#90B2D5", "#E4EBF3", "#CBD6E5", "#666"];
        this.lengedColor = [
          "#D9534F",
          "#F4CB25",
          "#7D55CB",
          "#276AB0",
          "#40A42B"
        ];
        this.imgs = ["c1", "c2", "c3", "c4", "c5"];
      }
      this.$nextTick(() => {
        this.getCharts();
        this.changeData();
        setTimeout(() => {
          this.myChart.resize();
        }, 100);
      });
    },
    cdMaps(a, b) {
      //				if(!this.isHover) {
      this.getData(a);
      //				}
    }
  }
};
</script>

<style lang="scss">
#cdMaps {
  width: 100%;
  height: 100%;
}

.cdmaps-lenged {
  position: absolute;
  padding-left: 66px;
  z-index: 100;
  top: 30px;
  right: 30px;
  div {
    width: 26px;
    height: 14px;
    border-radius: 3px;
    margin-bottom: 4px;
  }
  .a,
  .b {
    position: absolute;
    left: 0;
  }
  .a {
    top: -3px;
  }
  .b {
    bottom: 3px;
  }
  .lenged-color {
    color: #fff;
  }
}
</style>