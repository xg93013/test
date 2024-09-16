<template>
  <div
    id="wordCloud"
    class="charts"
    style="overflow:hidden"
    :class="{'chartsa':open,'chartsb':open&&isFullScreen}"
  >
    <div class="charts-title" style="position:relative">
      风险词云
      <span
        @click="openChange"
        class="zksq"
        :class="{imga:!open&&!isFullScreen,imgb:open&&!isFullScreen,imgc:!open&&isFullScreen,imgd:open&&isFullScreen}"
      ></span>
    </div>
    <div id="wordClouds" :class="{'chart-show': !show}"></div>
    <div class="empty" v-show="wordData.length==0">暂无数据</div>
  </div>
</template>
<script>
import echarts from "echarts";
import "echarts-wordcloud";
import { mapState } from "vuex";
import { throttle } from "@/unit/pub";
export default {
  data() {
    return {
      wordData: [],
      show: false,
      myChart: null,
      colorNum: 160,
      open: false
    };
  },
  props: {
    wordCloud: {
      type: Array,
      default: []
    }
  },
  watch: {
    wordCloud(a) {
      if (!this.myChart) {
        this.getChart();
      }
      if (a.length != this.wordData.length) {
        this.wordData = [...a];
        this.getData();
      } else {
        for (let i = 0, n = a.length; i < n; i++) {
          if (
            a[i].riskWord != this.wordData[i].riskWord ||
            a[i].frequency != this.wordData[i].frequency
          ) {
            this.wordData = [...a];
            this.getData();
            break;
          }
        }
      }
    },
    isFullScreen(a) {
      if (a) {
        this.colorNum = 300;
      } else {
        this.colorNum = 160;
      }
      this.$nextTick(() => {
        this.getData();
        setTimeout(() => {
          this.myChart.resize();
        }, 200);
      });
    }
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.isFullScreen
    })
  },
  methods: {
    openChange() {
      this.open = !this.open;
      this.$nextTick(() => {
        this.myChart.resize();
      });
    },
    getChart() {
      this.myChart = echarts.init(document.getElementById("wordClouds"));
      window.addEventListener("resize", () => {
        if (!this.open) {
          throttle(this.myChart.resize);
        }
      });
    },
    getData() {
      this.show = false;
      let JosnList = [...this.wordData];
      let colorNum = this.colorNum;
      let data = [];
      let m = JosnList.length > 1 ? 24 / JosnList[1].frequency : 0;
      for (let i = 0, n = JosnList.length; i < n; i++) {
        let num = JosnList[i].frequency * m;
        if (num < 14) {
          num = 14;
        }
        if (num > 24) {
          num = 24;
        }
        if (i == 0) {
          num = 34;
        }
        let obj = {
          textSize: num
        };
        if (i == 0) {
          obj.color = this.colorNum == 160 ? "#379BE7" : "#42E265";
        }
        data.push({
          name: JosnList[i].riskWord,
          value: JosnList[i].frequency,
          textStyle: {
            normal: obj
          }
        });
      }
      let option = {
        tooltip: {
          show: false
        },
        toolbox: {
          show: false
        },
        series: [
          {
            name: "热点分析",
            type: "wordCloud",
            size: ["100%", "100%"],
            sizeRange: [6, 66],
            // textRotation: [0, 0, 0, 0],
            rotationRange: [-90, 90],
            rotationStep: 90,
            shape: "square",
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6
            },
            // shape: "circle",
            textStyle: {
              normal: {
                color: function() {
                  return (
                    "rgb(" +
                    [
                      colorNum == 160
                        ? Math.round(Math.random() * colorNum)
                        : Math.round(
                            (colorNum * parseInt(Math.random() * 500 + 500)) /
                              1000
                          ),
                      colorNum == 160
                        ? Math.round(Math.random() * colorNum)
                        : Math.round(
                            (colorNum * parseInt(Math.random() * 500 + 500)) /
                              1000
                          ),
                      colorNum == 160
                        ? Math.round(Math.random() * colorNum)
                        : Math.round(
                            (colorNum * parseInt(Math.random() * 500 + 500)) /
                              1000
                          )
                    ].join(",") +
                    ")"
                  );
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            data
          }
        ]
      };
      this.myChart.setOption(option, true);
      setTimeout(() => {
        this.show = true;
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
#wordCloud {
  position: relative;
  padding-bottom: 40px;
  #wordClouds {
    position: relative;
    width: 130%;
    height: 100%;
    margin-left: -15%;
  }
  #wordClouds.chart-show {
    visibility: hidden;
  }
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
    display: none;
  }
  .imga {
    background-image: url(../../images/zka.png);
  }
  .imgb {
    background-image: url(../../images/sqa.png);
  }
  .imgc {
    background-image: url(../../images/zkb.png);
  }
  .imgd {
    background-image: url(../../images/sqb.png);
  }
  .zksq {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 10px;
    top: 10px;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
  }
}
#content #comAnalysis {
  .chartsa {
    position: absolute;
    border: 1px solid #e6e6e6;
    right: 0;
    bottom: 0;
    width: 600px;
    height: 500px;
    box-shadow: 0 0px 6px 2px #eee;
  }

  .chartsb {
    border: 1px solid #4562a2;
    box-shadow: 0 0px 6px 2px #6490c5;
  }
}
</style>


