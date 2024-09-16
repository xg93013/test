<template>
  <div id="sort" class="sort">
    <div class="title">
      <span class="sort-tab" :class="{'active':tabIndex===0}" @click="changeTab(0)">业态风险词频排序</span>
      <span
        v-if="!isZone"
        class="sort-tab"
        :class="{'active':tabIndex===1}"
        @click="changeTab(1)"
      >区域风险词频排序</span>
    </div>
    <div id="sortBox"></div>
    <comScrollModal
      :pageUrl="tableModal.pageUrl"
      :pageUrla="tableModal.pageUrla"
      :commonTitle="tableModal.commonTitle"
      :commonTitlea="tableModal.commonTitlea"
      :tableColumns="tableModal.tableColumns"
      :tableColumnsa="tableModal.tableColumnsa"
      ref="sortModalRefs"
    />
    <div class="emptys" v-show="isEmpty">暂无数据</div>
  </div>
</template>

<script>
import echarts from "echarts";
import comScrollModal from "@/components/com-scroll-modal.vue";
import apis from "@/unit/apis";
import { throttle } from "@/unit/pub";
const {
  RISKWORD_BUSMODESORT_DETAIL,
  RISKWORD_ZONESORT_DETAIL,
  COMMENT_DETAIL
} = apis;
export default {
  components: {
    comScrollModal
  },
  data() {
    return {
      isZone: false,
      myChart: null,
      tabIndex: 0,
      xdata: [],
      ydata: [],
      dataa: [],
      datab: [],
      regionCodes: [],
      isEmpty: false,
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
            label: "风险词出现次数",
            align: "center"
          },
          {
            prop: "shopAddress",
            label: "商家地址"
          },
          {
            prop: "operation",
            label: "相关评论",
            align: "center"
          }
        ],
        tableColumnsa: [
          {
            prop: "index",
            label: "",
            width: "50"
          },
          {
            prop: "commentAt",
            label: "评论时间",
            width: "180"
          },
          {
            prop: "platform",
            label: "平台",
            width: "120"
          },
          {
            prop: "content",
            label: "评论内容"
          }
        ]
      }
    };
  },
  props: {
    wordSort: {
      type: Array,
      default: []
    },
    areaSort: {
      type: Array,
      default: []
    }
  },
  watch: {
    wordSort(a) {
      this.dataa = a;
      this.isEmpty = this.dataa.length === 0;
      if (this.tabIndex == 0) {
        this.getData(this.dataa);
      } else {
        this.getData(this.datab);
      }
      // this.getData(a);
    },
    areaSort(a) {
      this.datab = a;
    },

    tabIndex(index) {
      this.$nextTick(() => {
        if (index == 0) {
          this.getData(this.dataa);
        } else {
          this.getData(this.datab);
        }
        this.getChart();
      });
    }
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
    },
    getData(data) {
      this.isEmpty = data.length === 0;
      this.xdata = [];
      this.ydata = [];
      this.regionCodes = [];
      if (this.tabIndex === 0) {
        data.forEach(item => {
          this.xdata.push(item.businessMode);
          this.ydata.push(item.value);
        });
      } else {
        data.forEach(item => {
          this.xdata.push(item.region);
          this.ydata.push(item.value);
          this.regionCodes.push(item.regionCode);
        });
      }
      this.getChart();
    },
    init() {
      this.myChart = echarts.init(document.getElementById("sortBox"));
      this.myChart.off("click");
      this.myChart.on("click", e => {
        this.tableModal.commonTitlea = "风险词相关评论";
        if (this.tabIndex === 0) {
          this.tableModal.pageUrl = RISKWORD_BUSMODESORT_DETAIL;
          this.tableModal.pageUrla = COMMENT_DETAIL;
          this.$refs.sortModalRefs.showDialog(e.name, e.name, true);
        } else {
          this.tableModal.pageUrl = RISKWORD_ZONESORT_DETAIL;
          this.tableModal.pageUrla = COMMENT_DETAIL;
          this.$refs.sortModalRefs.showDialog(
            e.name,
            this.regionCodes[e.dataIndex],
            true
          );
        }
      });
      window.addEventListener("resize", throttle(this.myChart.resize));
    },
    getChart() {
      let rotates = this.tabIndex == 0 ? 0 : 45;
      let xdata = this.xdata,
        ydata = this.ydata;
      let option = {
        color: ["#3B8AD9"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 16,
          top: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: xdata,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              rotate: rotates
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#eee"
              }
            }
          }
        ],
        series: [
          {
            name: "风险词频",
            type: "bar",
            barWidth: "18",
            data: ydata
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  beforeDestroy() {
    this.myChart.clear();
  },
  mounted() {
    this.isZone = this.$store.state.userMsg.regionType === "ZONE";
    this.init();
  }
};
</script>

<style lang="scss">
#sort {
  position: relative;
  .title {
    .sort-tab {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      padding: 0 10px;
      cursor: pointer;

      &.active {
        color: #2769b0;
        border-bottom: 3px solid #2769b0;
      }
    }
  }
  #sortBox {
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .emptys {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
  }
}
</style>