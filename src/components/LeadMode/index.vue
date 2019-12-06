<template>
  <div id="lead-box">
    <div class="wrapper">
      <div class="filter">
        <div class="left">基于食品链条的风险传导专题分析</div>
        <div class="right">
          <RadioPop
            class="filter-item"
            @getFood="getFood"
            :data="allFoodType"
            :defaultData="foodType"
            :placeholder="foodType != '' ? '点击查看选择食品品类':'选择食品品类(单选)'"
          />
          <down-tree
            class="filter-item"
            @downTree="selectDown"
            :isLeaf="checkType.isLeaf"
            :backLeaf="checkType.backLeaf"
            :splitStr="checkType.splitStr"
            :showFullName="checkType.showFullName"
            :datas="checkType.originData"
            :defaultData="checkType.defaultData"
            :modeType="checkType.prop"
            :allSelect="true"
            icon="down"
            :ref="checkType.prop+'TreeRefs'"
            :placeholder="checkType.showSelectTips ? ('点击查看'+checkType.name+'筛选数据') : ('选择'+checkType.name+'(复选)')"
          ></down-tree>
          <el-select
            placeholder="请选择统计指标"
            class="filter-item"
            v-model="standard"
            @change="changeStandard"
          >
            <el-option value="合格率">合格率</el-option>
            <el-option value="不合格率">不合格率</el-option>
          </el-select>
          <el-date-picker
            class="filter-item"
            v-model="dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeTime"
            align="right"
          ></el-date-picker>
        </div>
      </div>
      <div class="contents">
        <p class="risk-title">{{foodType}}的风险传导分析</p>
        <div class="nav-change">
          <div
            class="nav-item"
            @click="changeBar(item.id, index)"
            v-for="(item, index) in allPages"
            :key="index+'name'"
          >
            <span
              class="inline"
              :style="currentId==item.id?`background:${colors[index]};color:#fff;border:1px solid ${colors[index]}`:''"
            >{{item.name}}</span>
          </div>
        </div>
        <div class="bar-box">
          <div
            :id="item.id"
            class="bar-chart"
            v-for="(item, index) in allPages"
            :key="index+'key'"
            :style="{'height':item.height+'px'}"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioPop from "@/components/base/DownTree/RadioPop.vue";
import DownTree from "@/components/base/DownTree/index1.vue";
import foodOne from "@/assets/linkData/food_one.json";
import foodTwo from "@/assets/linkData/food_two.json";
import foodThree from "@/assets/linkData/food_three.json";
import foodFour from "@/assets/linkData/food_four.json";
import echarts from "echarts";
export default {
  components: {},
  data() {
    return {
      allFoodType: [],
      checkType: {
        name: "检查项目",
        prop: "checkProject",
        type: "",
        isLeaf: false,
        backLeaf: true,
        checked: true,
        showFullName: true,
        originData: [],
        icon: "down",
        defaultData: [],
        showSelectTips: false,
        filterData: []
      },
      allChart: {},
      currentId: "",
      keyWord: "",
      allPages: [],
      originData: {},
      hignColor: {
        select: "rgb(31, 180, 98)",
        shadow: "rgb(173, 255, 210)"
      },
      selectIndex: -1,
      myChart: "",
      colors: [
        "#FFDB5C",
        "#E69D87",
        "#EA7E53",
        "#DD6B66",
        "#32C5E9",
        "#37A2DA",
        "#67E0E3",
        "#8DC1A9",
        "#91C7AE",
        "#9FE6B8",
        "#2F4554",
        "#61A0A8",
        "#759AA0"
      ],
      yData: [],
      standard: "合格率",
      dateRange: "",
      foodType: "小麦粉制品",
      linkFood: "",
      allData: []
    };
  },
  components: {
    RadioPop,
    DownTree
  },
  computed: {},
  watch: {},
  created() {
    this.getDefaultData();
  },
  mounted() {},
  methods: {
    getDefaultData() {
      this.allData = [
        {
          name: "小麦粉",
          data: foodTwo
        },
        {
          name: "小麦粉制品",
          data: foodOne
          // data: [
          //   {
          //     itemName: "检查项目1",
          //     qualifiedRate: 6
          //   },
          //   {
          //     itemName: "检查项目2",
          //     qualifiedRate: 10
          //   }
          // ]
        },

        {
          name: "挂面",
          data: foodThree
        },
        {
          name: "饼干",
          data: foodFour
        }
      ];
      this.allFoodType = [
        {
          id: "0",
          label: "小麦粉制品",
          children: []
          //     {
          //       id: 1,
          //       label: "大类2",
          //       children: [
          //         {
          //           id: 3,
          //           label: "亚类1"
          //         },
          //         {
          //           id: 4,
          //           label: "亚类2"
          //         }
          //       ]
          //     },
          //     {
          //       id: 2,
          //       label: "大类3"
          //     }
          //   ]
        }
      ];

      let projects = [];
      this.allData[0].data = this.allData[0].data.sort((a, b) => {
        return Number(a.qualifiedRate) - Number(b.qualifiedRate);
      });
      for (let i = 0; i < this.allData[0].data.length; i++) {
        projects.push({
          id: (i + 1).toString(),
          label: this.allData[0].data[i].itemName
        });
      }
      this.checkType.originData = [
        {
          id: "0",
          label: "全部",
          children: projects
        }
      ];
    },
    getDatas() {
      this.allPages = [];
      this.yData = [];

      for (let i = 0; i < this.allData.length; i++) {
        let data = [];
        let len = this.checkType.filterData.length;
        let height = len == 1 ? 120 : len <= 3 ? len * 80 : len * 45;
        this.allPages.push({
          id: "chart" + (i + 1),
          name: this.allData[i].name,
          height: height
        });
        for (let j = 0; j < this.checkType.filterData.length; j++) {
          let index = this.getCheckTypeIndex(
            this.allData[i].data,
            this.checkType.filterData[j].label
          );
          let rate = "";
          let qualifiedRate = this.allData[i].data[index].qualifiedRate;
          if (qualifiedRate == null) {
            rate = null;
          } else {
            rate =
              index != -1
                ? (this.allData[i].data[index].qualifiedRate * 100).toFixed(2)
                  ? (this.allData[i].data[index].qualifiedRate * 100).toFixed(2)
                  : 0
                : 0;
          }

          data.push(
            this.standard == "合格率"
              ? rate
              : rate == null
              ? null
              : (100 - rate).toFixed(2)
          );
          // data.push(null);
        }
        this.originData["chart" + (i + 1)] = data;
      }
      for (let i = 0; i < this.checkType.filterData.length; i++) {
        this.yData.push(this.checkType.filterData[i].label);
      }
      // this.originData = {
      //   "parent-one": [10, 20, 15],
      //   "parent-two": [15, 45, 80],
      //   "parent-three": [15, 45, 80],
      //   "parent-four": [15, 45, 50],
      //   "parent-five": [15, 45, 30]
      // };
      this.currentId = this.allPages[0].id;

      this.$nextTick(() => {
        if (this.checkType.filterData.length > 0 && this.foodType != "") {
          this.initAllChart();
        }
      });
    },
    getCheckTypeIndex(arr, name) {
      let index = -1;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].itemName == name) {
          index = i;
          break;
        } else {
          continue;
        }
      }
      return index;
    },
    getFood(food) {
      this.selectIndex = -1;
      this.getDatas();
    },
    selectDown(arr, modeType, filterArr, selectAll) {
      let out = [];
      if (arr.length > 0) {
        this.checkType.showSelectTips = true;
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].level == 1) {
          out.push(arr[i]);
        }
      }
      this.checkType.filterData = out;
      // console.log(this.checkType.filterData);
      this.selectIndex = -1;
      this.getDatas();
    },
    changeStandard() {
      // console.log(this.standard);
      this.selectIndex = -1;
      this.getDatas();
    },
    changeTime() {
      this.selectIndex = -1;
      // console.log(this.dateRange);
      this.getDatas();
    },
    initAllChart() {
      for (let i = 0; i < this.allPages.length; i++) {
        if (i == 0) {
          this.initHorBar(this.allPages[i].id, this.colors[i]);
        } else {
          this.initHorBar(this.allPages[i].id);
        }
      }
    },
    initHorBar(id, color) {
      if (this.allChart[id]) {
        this.allChart[id].clear();
      }
      let myChart = echarts.init(document.getElementById(id));
      let data = this.originData[id];
      let yData = this.yData;
      let shadowData = [];
      let arr = [...data].sort((a, b) => {
        return b - a;
      });
      yData.forEach(item => {
        shadowData.push(100);
      });
      let option = {
        grid: {
          top: 10,
          left: id == this.allPages[0].id ? 100 : 70,
          right: 10
        },
        legend: {
          textStyle: {
            color: "#999"
          }
        },
        tooltip: {
          confine: true,
          formatter: params => {
            // console.log(params);
            if (params.seriesIndex == 0) {
              return (
                params.name + "<br/>" + this.standard + ":" + params.data + "%"
              );
            }
          }
        },
        xAxis: {
          type: "value",
          show: false,
          axisLine: {
            show: false,
            lineStyle: {
              // color: "#eee"
            }
          },
          nameTextStyle: {
            color: "#333"
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#eee"
            }
          }
        },
        yAxis: {
          type: "category",
          data: yData,
          show: id == this.allPages[0].id ? true : false,
          // triggerEvent: true,
          nameTextStyle: {
            color: "#333"
          },
          axisLine: {
            show: false,
            lineStyle: {
              // color: "#eee"
            }
          },
          axisLabel: {
            // rotate: -30
            formatter: params => {
              if (params.length > 6) {
                return params.substr(0, 6) + "...";
              } else {
                return params;
              }
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#eee"
            }
          }
        },
        series: [
          {
            type: "bar",
            data: data,
            barWidth: 15,
            z: 3,
            // barGap: '30%',
            label: {
              normal: {
                show: true,
                position: "insideLeft",
                formatter: params => {
                  return params.data + "%";
                }
              }
            },
            itemStyle: {
              normal: {
                color: params => {
                  let index = params.dataIndex;
                  if (index == this.selectIndex) {
                    return this.hignColor.select;
                  } else {
                    if (color) {
                      return color;
                    } else {
                      return "#ccc";
                    }
                  }
                }
              }
            }
          },
          {
            type: "bar",
            z: 2,
            data: shadowData,
            barWidth: 15,
            barGap: "-100%",
            label: {
              normal: {
                show: true,
                position: "insideLeft",
                formatter: params => {
                  if (data[params.dataIndex] == null) {
                    return "(空)";
                  }
                }
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 1,
                color: params => {
                  let index = params.dataIndex;
                  if (index == this.selectIndex) {
                    return this.hignColor.shadow;
                  } else {
                    return "#eee";
                  }
                }
              },
              emphasis: {
                color: "#eee"
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      this.allChart[id] = myChart;
      this.allChart[id].off("click");
      this.allChart[id].on("click", e => {
        this.selectIndex = e.dataIndex;
        for (let i = 0; i < this.allPages.length; i++) {
          if (this.currentId == this.allPages[i].id) {
            this.initHorBar(this.allPages[i].id, this.colors[i]);
          } else {
            this.initHorBar(this.allPages[i].id);
          }
        }
      });
      this.allChart[id].resize();
    },
    changeBar(id, index) {
      this.initHorBar(this.currentId);
      this.currentId = id;
      this.initHorBar(id, this.colors[index]);
    }
  },
  beforeDestroy() {
    for (let i = 0; i < this.allPages.length; i++) {
      if (this.allChart[this.allPages[i].id]) {
        this.allChart[this.allPages[i].id].dispose();
      }
    }
  },
  destroyed() {}
};
</script>
<style lang='scss' scoped>
#lead-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  // margin: 10px auto;
  position: relative;
  .wrapper {
    width: 1200px;
    min-height: 700px;
    margin: 20px auto;
    border: 1px solid #f5f5f5;
    padding: 20px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    .filter {
      width: 100%;
      height: 100px;
      .left {
        float: left;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        // font-weight: bold;
      }
      .right {
        float: right;
        .filter-item {
          width: 200px;
          float: left;
          margin-right: 15px;
        }
      }
    }
    .contents {
      width: 100%;
      overflow-y: auto;
      .risk-title {
        width: 100%;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        height: 40px;
      }
      .nav-change {
        width: 100%;
        // height: 100px;
        overflow: hidden;
        .nav-item {
          width: 240px;
          text-align: center;
          float: left;
          overflow: hidden;
          .inline {
            display: block;
            // padding: 4px 6px;
            width: 100px;
            height: 36px;
            line-height: 36px;
            border-radius: 4px;
            text-align: center;
            margin-top: 10px;
            cursor: pointer;
            border: 1px solid #eee;
            // margin: 0 auto;
            float: left;
            margin-left: 70px;
          }
          &:first-child {
            width: 260px;
            margin-left: 40px;
            .inline {
              margin-left: 100px;
            }
          }
        }
      }
      .bar-box {
        width: 100%;
        .bar-chart {
          width: 240px;
          // height: 1500px;
          float: left;
          overflow: hidden;
          color: rgb(173, 255, 210);
          &:first-child {
            width: 260px;
            margin-left: 40px;
          }
          // margin-left: 20px;
        }
      }
    }
  }
}
</style>