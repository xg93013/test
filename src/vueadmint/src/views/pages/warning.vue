<template>
  <div id="containers">
    <div class="filter">
      <!-- <time-slot /> -->
      <!-- <i-select v-model="province" style="width:200px" >
				<i-option v-for="item in provinceList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
			</i-select>
			<i-select v-model="province" style="width:200px">
				<i-option v-for="item in provinceList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
			</i-select>
			<i-select v-model="province" style="width:200px">
				<i-option v-for="item in provinceList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>-->
      <!-- <el-select v-model="province" placeholder="">
				<el-option
				v-for="item in provinceList"
				:key="item.value"
				:label="item.label"
				:value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="city" placeholder="">
				<el-option
				v-for="item in cityList"
				:key="item.value"
				:label="item.label"
				:value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="district" placeholder="">
				<el-option
				v-for="item in districtList"
				:key="item.value"
				:label="item.label"
				:value="item.value">
				</el-option>
      </el-select>-->
      <!-- <anchored-heading :level="1">htmls</anchored-heading>
			<div class="names" id="doms">myDOM</div>
      <div v-for="item in newsList">{{item}}</div>-->
      <!-- <div class="chart-box" id="chart-box"></div>
      <div class="chart-box" id="links-chart"></div>
      <div class="chart-box" id="hot-chart"></div> -->
      <div class="wrapper">
        <div class="out-box" ref="scrollTable" id="scrollTable">
          <div class="tables" id="inTable">
            <div class="item tableitem" v-for="(item, index) in tableData" :key="item+index">{{item}}</div>
          </div>
          <!-- <div class="tables2" id="inTable2"></div> -->
        </div>
        <div @click="scrollTop" class="tops">top</div>
      </div>
      <div class="chart-bar">
        <div class="xAxis">
          <div
            class="item"
            v-for="(item, index) in chartData"
            :style="{width:1/chartData.length.toFixed(2)*100+'%'}"
            :key="index"
          >{{item.name}}</div>
        </div>
        <div class="yAxis">
          <div
            class="item"
            v-for="(item,index) in yData"
            :key="index"
            :style="{height: 1/yData.length.toFixed(2)*100+'%',lineHeight: 1/yData.length.toFixed(2)*100+'%'}"
          >{{item}}</div>
        </div>
        <div class="barPos">
          <div
            class="item"
            :style="{width:1/chartData.length.toFixed(2)*100+'%'}"
            v-for="(item, index) in chartData"
            :key="index"
          >
            <div class="bar-out">
              <div class="bars" v-for="(itema, indexa) in item.data" :key="indexa">
                <p class="name">{{itema.name}}</p>
                <div class="inner">
                  <div class="l-bar" :style="{height: itema.xData+'%'}"></div>
                  <div class="r-bar" :style="{height: itema.xData+'%'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button v-reclick="clickBtns" id="btns">点击</el-button>
    <el-button @click="changeArr" id="btns">点击</el-button>
    <el-button @click="changeTime" id="btns">点击</el-button>
  </div>
</template>

<script>
import * as echarts from "echarts";
import TimeSlot from "@/components/timeSlot";
// import temps from '@/components/header.vue'
import { mapActions, mapGetters } from "vuex";
import { myDOM, myArray, myTime, throttles } from "@/assets/js/myUtils.js";
const colors = ["#4472C4", "#FFC000", "#E18149", "#A5A5A5"];
export default {
  name: "",
  components: {
    TimeSlot
    // temps
  },
  data() {
    return {
      myChart: "",
      provinceList: [
        {
          value: "sichuan",
          label: "四川"
        }
      ],
      cityList: [
        {
          value: "chengdu",
          label: "成都市"
        }
      ],
      districtList: [
        {
          value: "gaoxin",
          label: "高新区"
        }
      ],
      newObj: Object.seal({
        title: "",
        name: ""
      }),
      province: "",
      city: "",
      district: "",
      selected: {},
      tableData: [],
      showLoading: false,
      clickBtns: () => {},
      getAsycData: () => {},
      timer: "",
      scrollTimer: "",
      chartData: [],
      yData: [],
      scrollTops: 0
    };
  },
  created() {
    this.clickBtns = throttles(this.changeArr);
    this.getAsycData = throttles(this.getTableData);
  },
  computed: {
    ...mapGetters(["newsList"])
  },
  methods: {
    ...mapActions(["saveNewsList"]),
    changeArr() {
      let arr = [1, 23, 38, 90, 90];
      this.newObj.title = "changetitle";
      Object.isFrozen(this.newObj);
    },
    changeTime() {
      console.log(myDOM.hasClass(document.getElementById("doms"), "sss"));
      this.saveNewsList(["news", "newsone"]);
    },
    getChartData() {
      this.chartData = [
        {
          name: "x1",
          data: [
            {
              name: "a1",
              xData: "30",
              xData2: "30"
            },
            {
              name: "a2",
              xData: "50",
              xData2: "50"
            }
          ]
        },
        {
          name: "x1",
          data: [
            {
              name: "a1",
              xData: "50",
              xData2: "50"
            },
            {
              name: "a2",
              xData: "50",
              xData2: "50"
            }
          ]
        },
        {
          name: "x1",
          data: [
            {
              name: "a1",
              xData: "50",
              xData2: "50"
            },
            {
              name: "a2",
              xData: "50",
              xData2: "50"
            }
          ]
        }
      ];
      for (let i = 0; i <= 100; i += 10) {
        this.yData.unshift(i);
      }
    },
    initChart() {
      let _self = this;
      this.myChart = echarts.init(document.getElementById("chart-box"));
      // let colors = ["#4472C4", "#FFC000", "#E18149", "#A5A5A5"];
      let legend = [];
      let series = [];
      // let series = [{
      // 	name: 'name',
      // 	value: '100'
      // }];
      let data = [
        {
          name: "a1",
          data: [1, 2, 3]
        },
        {
          name: "a2",
          data: [2, 3, 2]
        }
      ];
      let xData = ["a", "b", "c"];
      for (let i = 0; i < data.length; i++) {
        // let oneSeries = {
        //   name: data[i].name,
        //   type: "bar",
        //   stack: "common",
        //   data: data[i].data,
        //   barMaxWidth: 10,
        //   barGap: "-100%",
        //   barCategoryGap: "55%",
        //   itemStyle: {
        //     normal: {
        //       color: colors[i],
        //       label: {
        //         show: false
        //       }
        //     }
        //   }
        // };
        legend.push(data[i].name);
        let oneSeries = {
          name: data[i].name,
          type: "line",
          data: data[i].data,
          itemStyle: {
            normal: {
              color: colors[i],
              label: {
                show: false
              }
            }
          }
        };
        series.push(oneSeries);
      }
      let option = {
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              type: "dashed"
            }
          }
        },
        legend: {
          top: 10,
          left: "center",
          orient: "horizontal",
          itemWidth: 10,
          itemHeight: 8,
          selectedMode: "multiple",
          selected: _self.selected,
          textStyle: {
            color: "#333",
            // color: '#72B5E6',
            fontSize: 8
          },
          data: legend
        },
        grid: {
          left: 15,
          right: 15,
          top: 50,
          bottom: 10,
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: xData,
          boundaryGap: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#eee"
            }
          },
          axisLabel: {
            show: true,
            color: "#666",
            fontSize: 12,
            rotate: 45
          },
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#666"
            }
          },
          axisLabel: {
            color: "#666",
            fontSize: 12,
            interval: 0
          },
          axisTick: {
            alignWithLabel: true,
            length: 0
          },
          splitLine: {
            show: false
          }
        },
        series: series
      };
      this.myChart.setOption(option);
    },
    getHotMap() {
      let chart = echarts.init(document.getElementById("hot-chart"));
      let series = [];
      let polyline = [[["a", 20], ["b", 20], ["c", 30]]];
      let lineX = [10, 20, 30];
      let option = {
        xAxis: {
          type: "category",
          data: ["a", "b", "c"],
          // data: this.lineX,
          axisLine: {
            lineStyle: {
              color: "#eee"
            }
          },
          axisLabel: {
            color: "#eee"
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#eee"
            }
          },
          axisLabel: {
            color: "#eee"
          }
        },
        series: {
          type: "custom",
          name: "maps",
          color: colors,
          renderItem: (params, api) => {
            // var categoryIndex = api.value(0);
            // var start = api.coord([api.value(1), categoryIndex]);
            // var end = api.coord([api.value(2), categoryIndex]);
            // var height = api.size([0, 1])[1] * 0.6;

            // var rectShape = echarts.graphic.clipRectByRect(
            //   {
            //     x: start[0],
            //     y: start[1] - height / 2,
            //     width: end[0] - start[0],
            //     height: height
            //   },
            //   {
            //     x: params.coordSys.x,
            //     y: params.coordSys.y,
            //     width: params.coordSys.width,
            //     height: params.coordSys.height
            //   }
            // );

            // return (
            //   rectShape && {
            //     type: "rect",
            //     shape: rectShape,
            //     style: api.style()
            //   }
            // );
            // circle
            let point = api.coord([api.value(0), api.value(1)]);
            let cx = api.value(0);
            let cy = api.value(1);
            let r = api.value(2);
            let circleShape = {
              cx: point[0],
              cy: point[1],
              r: r
            };
            let linepoints = polyline[0];
            // console.log(linepoints);
            // return {
            //   type: "circle",
            //   shape: circleShape,
            //   style: {
            //     fill: colors[0]
            //   }
            // };
            let points = [["a", 10], ["b", 14], ["c", 20], ["c", 20]];
            for (let i = 0; i < points.length; i++) {
              points[i] = api.coord(points[i]);
            }
            return {
              type: "polyline",
              position: [0, 0],
              shape: {
                points: points,
                smooth: 0.2
              },
              style: {
                fill: colors[0]
              }
            };
          },
          // data: [["a", 1, 6], ["b", 1, 5]] // circle
          data: [["a", 10], ["b", 14], ["c", 20], ["c", 20]] // polyline
        }
      };
      chart.setOption(option);
    },
    nodeLinks() {
      let chart = echarts.init(document.getElementById("links-chart"));
      let data = [
        {
          name: "a1",
          category: "a1",
          value: 100
        },
        {
          name: "a2",
          category: "a2",
          value: 100
        },
        {
          name: "a4",
          category: "a4",
          value: 100
        },
        {
          name: "a3",
          category: "a3",
          value: 100
        },
        {
          name: "a5",
          category: "a5",
          value: 100
        }
      ];
      let links = [
        {
          source: "a1",
          target: "a2",
          lineStyle: {
            curveness: 0.4,
            color: colors[0]
          },
          value: 100
        },
        {
          source: "a1",
          target: "a3",
          lineStyle: {
            curveness: 0.4,
            color: colors[0]
          }
          // value: 20
        },
        {
          source: "a1",
          target: "a4",
          lineStyle: {
            curveness: 0.4,
            color: colors[0]
          }
          // value: 20
        },
        {
          source: "a3",
          target: "a5",
          lineStyle: {
            curveness: 0.4,
            color: colors[0]
          }
          // value: 20
        }
      ];
      let option = {
        series: {
          type: "graph",
          name: "graphs",
          // color: colors,
          data: data,
          layout: "force",
          force: {
            initLayout: "",
            repulsion: 80,
            gravity: 0.1,
            edgeLength: 240
          },
          links: links
        }
      };
      chart.setOption(option);
    },
    getTableData() {
      this.showLoading = true;
      for (let i = 0; i < 10; i++) {
        this.tableData.push("data" + i);
      }
      setTimeout(() => {
        this.showLoading = false;
      }, 2000);
    },
    addScroll() {
      this.$refs.scrollTable.addEventListener(
        "scroll",
        e => {
          window.clearInterval(this.scrollTimer);
          let outbox = document.getElementById("scrollTable");
          let height =
            document.getElementById("inTable").clientHeight -
            document.getElementById("scrollTable").clientHeight;
            let height1 = document.getElementsByClassName("tableitem")[0].offsetHeight;
          if (e.target.scrollTop >= height - 5) {
            this.getAsycData();
          }
          this.scrollTimer = setTimeout(()=>{
            this.scrollTops = (parseInt(e.target.scrollTop/height1))*height1;
          },300)
        },
        true
      );
    },
    scrollUp() {
      let outbox = document.getElementById("scrollTable");
      let box1 = document.getElementById("inTable");
      // let box2 = document.getElementById("inTable2");
      let height = document.getElementsByClassName("tableitem")[0].offsetHeight;
      this.scrollTops += height;
      console.log(box1.offsetHeight)
      // box2.innerHTML = box1.innerHTML;
      if (outbox.scrollTop >= box1.offsetHeight) {
        outbox.scrollTop = 0;
      } else {
        outbox.scrollTop = this.scrollTops;
      }
    },
    addEvents() {
      let outbox = document.getElementById("scrollTable");
      // this.timer = window.setInterval(this.scrollUp, 2000);
      outbox.addEventListener("mouseenter", e => {
        window.clearInterval(this.timer);
      });
      outbox.addEventListener("mouseleave", e => {
        if (this.timer) {
          window.clearInterval(this.timer);
        }
        this.timer = window.setInterval(this.scrollUp, 2000);
      });
    },
    scrollTop() {
      document.getElementById("scrollTable").scrollTop = 0;
    },
    initMoreBar() {}
  },
  mounted() {
    // this.getChartData();
    // this.initChart();
    // this.getHotMap();
    // this.nodeLinks();
    this.getTableData();
    this.addScroll();
    this.addEvents();
    let res = "身体不适123";
    let item = "身体不适";
    console.log(res.replace(eval("/" + item + "/g"), "xxxx"));
  }
};
function showdata() {
  let arr = [1, 23, 38, 90, 90];
}
</script>

<style lang="scss" scoped>
#containers {
  height: 900px;
  .chart-box {
    width: 500px;
    height: 400px;
  }
  .wrapper {
    width: 400px;
    height: 200px;
    position: relative;

    .out-box {
      transition: all 0.5s;
      width: 400px;
      height: 200px;
      top: 0;
      left: 0;
      overflow: auto;
      position: absolute;
      .tables {
        .item {
          padding: 20px;
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .tops {
      position: absolute;
      right: 20px;
      bottom: 0;
      z-index: 999;
      cursor: pointer;
    }
  }
  .chart-bar {
    width: 600px;
    height: 500px;
    position: relative;
    .xAxis {
      position: absolute;
      bottom: 0;
      left: 50px;
      right: 50px;
      height: 50px;
      overflow: hidden;
      text-align: center;
      .item {
        text-align: center;
        float: left;
        white-space: pre-wrap;
      }
    }
    .yAxis {
      position: absolute;
      top: 50px;
      bottom: 0;
      left: 0;
      width: 50px;
      // height: 100%;
      .item {
        width: 100%;
        text-align: right;
        vertical-align: bottom;
      }
    }
    .barPos {
      position: absolute;
      top: 0;
      left: 50px;
      right: 50px;
      bottom: 50px;
      overflow: hidden;
      .item {
        height: 100%;
        // margin: 0 5px;
        text-align: center;
        float: left;
        .bar-out {
          display: inline;
          .bars {
            display: inline-block;
            margin: 0 4px;
            height: 100%;
            text-align: center;
            position: relative;
            .inner {
              position: absolute;
              top: 30px;
              left: 0;
              right: 0;
              bottom: 0;
              .name {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                text-align: center;
              }
              .l-bar {
                background: #ccc;
                width: 20px;
              }
              .r-bar {
                background: #ccc;
                width: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
