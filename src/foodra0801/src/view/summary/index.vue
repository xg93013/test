<template>
  <div id="summary">
    <el-row>
      <el-col :span="12">
        <div class="top">食品（农产品）监管指数汇总</div>
      </el-col>
      <el-col :span="12" align="right">
        <timeSlot @timeChange="timeChange" ref="timeSlot" :isPro="true" :currentTime="currentTime"/>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col>
        <div id="sumChart"></div>
      </el-col>
    </el-row>
    <el-row style="margin-top:30px">
      <el-col class="el-col-table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="foodCategory" label="食品大类"></el-table-column>
          <el-table-column align="center" prop="foodSubcategory" label="食品亚类"></el-table-column>
          <el-table-column align="center" prop="foodName" label="食品品种"></el-table-column>
          <el-table-column align="center" prop="breeding" label="种养殖环节指数"></el-table-column>
          <el-table-column align="center" prop="sales" label="流通环节指数"></el-table-column>
          <el-table-column align="center" prop="catering" label="餐饮环节指数"></el-table-column>
          <el-table-column align="center" prop="total" label="综合指数"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from "echarts";
import timeSlot from "@/components/timeSlot";
import http from "@/unit/http";
import apis from "@/unit/apis";
const { FOOD_INDEX } = apis;
export default {
  data() {
    return {
      isTime: false,
      currentTime: {},
      xDatas: [],
      yDatas: [],
      tableData: []
    };
  },
  components: {
    timeSlot
  },
  methods: {
    timeChange(e) {
      this.getDatas(e);
    },
    init() {
      let time = new Date();
      let y = time.getFullYear() + "年";
      let m = time.getMonth() + 1;
      m = m > 9 ? m + "月" : "0" + m + "月"; ///默认本年本月
      this.$nextTick(() => {
        this.getDatas({
          year: time.getFullYear(),
          msg: m
        });
      });
    },
    async getDatas(time) {
      let res = await http.get(FOOD_INDEX + time.year + "年" + time.msg);
      if (res) {
        if (res.data && res.data.length) {
          this.currentTime = { ...time };
          this.tableData = [...res.data];
          let xDatas = [],
            yDatas = [];
          res.data.forEach(item => {
            xDatas.push(item.foodName);
            yDatas.push(item.total);
          });
          for (let i = 0; i < yDatas.length; i++) {
            for (let n = i + 1; n < yDatas.length; n++) {
              let a = yDatas[i];
              let b = yDatas[n];
              let c = xDatas[i];
              let d = xDatas[n];
              if (a < b) {
                yDatas[i] = b;
                yDatas[n] = a;
                xDatas[i] = d;
                xDatas[n] = c;
              }
            }
          }
          this.xDatas = xDatas;
          this.yDatas = yDatas;
          this.$nextTick(() => {
            this.getChart();
          });
          if (this.isTime) {
            this.$refs.timeSlot.cancela();
          }
          if (!this.isTime) {
            this.isTime = true;
          }
        } else {
          if (this.isTime) {
            this.$message.warning("暂无数据");
          } else {
            let year, msg;
            if (parseInt(time.msg) > 1) {
              msg = parseInt(time.msg) - 1;
              year = time.year;
            } else {
              msg = 12;
              if (time.year > 2016) {
                year = time.year - 1;
              }
            }
            msg = msg > 9 ? msg + "月" : "0" + msg + "月";

            this.getDatas({
              year,
              msg
            });
          }
        }
      }
    },
    getChart() {
      let xDatas = this.xDatas,
        yDatas = this.yDatas;
      let myChart = echarts.init(document.getElementById("sumChart"));
      let option = {
        toolbox: {
          //   show: false
        },
        color: ["#0099FF"],
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 10,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          formatter(value) {
            let data = value[0];
            return `${data.name}<br />综合指数：${data.data}`;
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff",
              fontSize: "15"
            },
            formatter(value) {
              let txt = "";
              value.split("").forEach((item, index) => {
                if (index < 5) {
                  if (index == 0) {
                    txt += item;
                  } else {
                    txt += item;
                  }
                }
              });
              if (value.length > 5) {
                txt += "...";
              }
              return txt;
            },
            rotate: 45
          },
          axisLine: {
            lineStyle: {
              color: "#2A5FA1"
            }
          },
          data: xDatas
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff",
              fontSize: "15"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#2A5FA1",
              type: "dashed"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#2A5FA1"
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: "",
            data: yDatas,
            barWidth: 20,
            type: "bar",
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0]
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss">
#summary {
  min-height: 400px !important;
  .el-col-table {
    * {
      background: transparent;
      color: #fff;
      font-size: 15px;
      border-color: #2a5fa1;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #2a5fa1;
    }
  }
  .top {
    width: 100%;
    height: 30px;
    font-size: 20px;
    color: #d7e9ff;
  }
  #sumChart {
    width: 100%;
    height: 300px;
  }
}
</style>


