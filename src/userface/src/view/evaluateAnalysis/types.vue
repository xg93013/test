<template>
  <div id="types" class="types">
    <div class="title">风险类型对比</div>
    <div id="typesBox">
      <div>
        <div class="tit">风险类型占比</div>
        <div id="ratio"></div>
        <div class="empty" v-show="seriesDataa.length==0">暂无数据</div>
      </div>
      <div>
        <div class="tit">{{lableName}}-风险词频TOP 10</div>
        <div id="wordTop"></div>
        <div class="empty" v-show="seriesDatab.length==0">暂无数据</div>
      </div>
    </div>
    <comScrollModal
      :pageUrl="tableModal.pageUrl"
      :pageUrla="tableModal.pageUrla"
      :commonTitle="tableModal.commonTitle"
      :commonTitlea="tableModal.commonTitlea"
      :tableColumns="tableModal.tableColumns"
      :tableColumnsa="tableModal.tableColumnsa"
      ref="wordTopModalRefs"
    />
  </div>
</template>

<script>
import echarts from "echarts";
import comScrollModal from "@/components/com-scroll-modal.vue";
import apis from "@/unit/apis";
import { throttle } from "@/unit/pub";
const { RISKTYPE_ANALYSIS_DETAIL, COMMENT_DETAIL } = apis;
export default {
  components: {
    comScrollModal
  },
  data() {
    return {
      lableName: "",
      ydatab: [],
      totalData: [],
      seriesDataa: [],
      seriesDatab: [],
      tableModal: {
        pageUrl: "",
        pageUrla: "",
        commonTitle: "风险词详情",
        commonTitlea: "风险词相关评论",
        tableColumns: [
          {
            prop: "index",
            label: "",
            width: "50"
          },
          {
            prop: "shopName",
            label: "商家名称"
          },
          {
            prop: "frequency",
            label: "风险词出现次数"
          },
          {
            prop: "shopAddress",
            label: "商家地址"
          },
          {
            prop: "operation",
            label: "相关评论"
          }
        ],
        tableColumnsa: [
          {
            prop: "commentAt",
            label: "评论时间",
            align: "center"
          },
          {
            prop: "platform",
            label: "平台"
          },
          {
            prop: "content",
            label: "评论内容"
          }
        ]
      },
      myChart: null,
      wordChart: null,
      isHover: false,
      num: -1
    };
  },
  props: {
    types: {
      type: Array,
      default: []
    }
  },
  watch: {
    types(a) {
      this.totalData = a;
      if (!this.isHover) {
        this.getDataa();
      }
    }
  },
  methods: {
    init() {
      this.myChart = echarts.init(document.getElementById("ratio"));
      this.myChart.on("mouseover", v => {
        this.isHover = true;
        if (v.dataIndex != this.num) {
          this.myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: this.num
          });
          this.num = v.dataIndex;
          this.lableName = v.name;
          this.getDatab(v.name);
        }
      });
      this.myChart.on("mouseout", () => {
        this.isHover = false;
        this.myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: this.num
        });
      });
      window.addEventListener("resize", throttle(this.myChart.resize));
    },
    getDataa() {
      this.seriesDataa = [];
      this.myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: this.num
      });

      if (this.num >= this.totalData.length - 1) {
        this.num = 0;
      } else {
        this.num++;
      }
      this.totalData.forEach(item => {
        this.seriesDataa.push({
          value: item.count,
          percent: item.percent,
          name: item.riskType
        });
      });
      if (this.totalData.length > 0) {
        this.lableName = this.totalData[this.num].riskType;
        this.$nextTick(() => {
          this.ratioChart();
          this.getDatab(this.lableName);
        });
      }
    },
    getDatab(name) {
      this.ydatab = [];
      this.seriesDatab = [];
      this.totalData.forEach(item => {
        if (name === item.riskType) {
          item.riskWordCount.forEach(itema => {
            this.seriesDatab.push(itema.value);
            this.ydatab.push(itema.riskWord);
          });
          return;
        }
      });
      this.wordTopChart();
    },
    ratioChart() {
      // console.log(this.seriesDataa);
      // this.seriesDataa = [];
      // for (let i = 0; i < 4; i++) {
      //   this.seriesDataa.push({
      //     value: 0,
      //     percent: "0%",
      //     name: "身体不适不适" + i
      //   });
      // }

      let option = {
        tooltip: {
          trigger: "item",
          formatter() {}
        },
        series: [
          {
            type: "pie",
            radius: ["55%", "80%"],
            center: ["50%", "50%"],
            color: ["#DF6562", "#EFC235", "#4EA739", "#2A6BAF", "#805CCA"],
            data: this.seriesDataa,
            labelLine: {
              normal: {
                show: true,
                length: 20,
                length2: 20
              }
            },
            label: {
              normal: {
                formatter(value) {
                  return (
                    "{d|" +
                    " " +
                    value.name +
                    "}" +
                    "{c|\n词频：" +
                    value.data.value +
                    "\n占比：" +
                    value.data.percent +
                    "}"
                  );
                },
                rich: {
                  c: {
                    fontSize: 14,
                    align: "left",
                    padding: 4,
                    lineHeight: 20,
                    align: "left"
                  },
                  d: {
                    fontWeight: "bold",
                    fontSize: 14,
                    align: "left",
                    lineHeight: 20
                  }
                }
              }
            }
          }
        ]
      };
      this.myChart.setOption(option, true);
      this.myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: this.num
      });
    },
    wordTopChart() {
      this.wordChart = echarts.init(document.getElementById("wordTop"));
      let option = {
        formatter(value) {
          return `${value[0].name}:${value[0].value}次`;
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "20",
          right: "30",
          bottom: "20",
          top: "30",
          containLabel: true
        },
        xAxis: {
          position: "top",
          offset: 6,
          //						name: "(人)",
          nameLocation: "end",
          max: "dataMax",
          nameTextStyle: {
            color: "#AAD7FF"
          },
          type: "value",
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "category",
          data: this.ydatab.reverse(),
          boundaryGap: false,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#666",
              fontSize: "12"
            }
            //							formatter(value) {
            //								return value + "%";
            //							}
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#2A5FA1"
            }
          }
        },
        series: [
          {
            type: "bar",
            barWidth: "13",
            barGap: "-100%",
            data: this.seriesDatab.reverse(),
            itemStyle: {
              normal: {
                //								barBorderRadius: [0, 8, 8, 0],
                color: "#3B8AD9"
              }
            }
          }
        ]
      };

      this.wordChart.setOption(option);
      this.wordChart.off("click");
      this.wordChart.on("click", e => {
        this.tableModal.commonTitlea = e.name;
        this.tableModal.pageUrl = RISKTYPE_ANALYSIS_DETAIL;
        this.tableModal.pageUrla = COMMENT_DETAIL;
        this.$refs.wordTopModalRefs.showDialog(e.name, e.name);
      });
      window.addEventListener("resize", throttle(this.wordChart.resize));
    }
  },
  beforeDestroy() {
    this.myChart.clear();
    this.wordChart.clear();
  },
  mounted() {
    this.init();
    this.wordTopChart();
  }
};
</script>

<style lang="scss">
#types {
  #typesBox {
    width: 100%;
    height: 100%;
    background: #fff;
    > div {
      position: relative;
      float: left;
      width: 50%;
      height: 100%;
      padding-top: 40px;
      #ratio,
      #wordTop {
        width: 100%;
        height: 100%;
      }
      .tit {
        position: absolute;
        width: 100%;
        height: 40px;
        left: 0;
        top: 0;
        line-height: 40px;
        padding-left: 32px;
        font-size: 15px;
        &:after {
          position: absolute;
          top: 13px;
          bottom: 13px;
          left: 20px;
          width: 4px;
          content: "";
          background: #2769b0;
        }
      }
      .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
      }
    }
  }
}
</style>