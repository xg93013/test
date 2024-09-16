<template>
  <div id="businessDetails">
    <el-row>
      <el-col :span="10">
        <span class="back" @click="back">返回</span>
        <span class="name">{{name}}</span>
      </el-col>
      <el-col v-show="name" :span="14" align="right">
        <div class="lists">
          <div
            v-for="(item,index) in lista"
            :key="index"
            :class="{'list-active':types==index}"
            @click="listaChange(index)"
          >{{item}}</div>
        </div>
        <div class="lists">
          <div
            v-for="(item,index) in listb"
            :key="index"
            :class="{'list-active':result==index}"
            @click="listbChange(index)"
          >{{item}}</div>
        </div>
        <div class="times">
          <timeSlot @timeChange="timeChange" :currentTime="currentTime"/>
        </div>
      </el-col>
    </el-row>
    <div class="charts" id="businessCharts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import timeSlot from "@/components/timeSlot";
import http from "@/unit/http";
import apis from "@/unit/apis";
const { ENTERPRISE_INSPECTION } = apis;
export default {
  data() {
    return {
      lista: ["种养殖环节", "流通环节", "餐饮环节"],
      listb: ["全部结果", "合格", "不合格"],
      types: 0,
      result: 0,
      myChart: null,
      datas: [],
      links: [],
      id: "",
      proMsg: {},
      currentTime: {},
      name: ""
    };
  },
  components: {
    timeSlot
  },
  methods: {
    init(e) {
      if (e.num == 3) {
        this.result = 0;
      } else {
        this.result = 2;
      }
      this.types = e.types - 1;
      if (e.times) {
        this.currentTime = {
          year: e.times.split("年")[0],
          msg: e.times.split("年")[1]
        };
      }
      this.proMsg = { ...e };
      this.$nextTick(() => {
        this.getDatas(e);
      });
    },
    listaChange(e) {
      if (this.types != e) {
        this.types = e;
        this.$nextTick(() => {
          this.getDatas();
        });
      }
    },
    listbChange(e) {
      if (this.result != e) {
        this.result = e;
        this.$nextTick(() => {
          this.getDatas();
        });
      }
    },
    timeChange(e) {
      this.proMsg.times = e.year + "年" + e.msg;
      this.$nextTick(() => {
        this.getDatas();
      });
    },
    back() {
      this.$emit("back", { details: false });
    },
    async getDatas() {
      let inspectionResult;
      if (this.result == 0) {
        inspectionResult = "";
      } else if (this.result == 1) {
        inspectionResult = 1;
      } else {
        inspectionResult = -1;
      }
      let res = await http.get(
        ENTERPRISE_INSPECTION +
          this.proMsg.id +
          "?link=" +
          (this.types + 1) +
          "&dateValue=" +
          this.proMsg.times +
          "&inspectionResult=" +
          inspectionResult
      );
      if (res) {
        this.name = res.data.category;
        let links = [],
          datas = [],
          typesName;
        if (res.data.link == 1) {
          typesName = "种养殖环节";
        } else if (res.data.link == 2) {
          typesName = "流通环节";
        } else if (res.data.link == 3) {
          typesName = "餐饮环节";
        }
        datas.push({
          name: typesName,
          label: {
            position: "inside",
            offset: [0, 0]
          },
          symbolSize: 100,
          itemStyle: {
            color: "#00AAFF"
          }
        });
        if (res.data.content && res.data.content.length) {
          res.data.content.forEach(item => {
            links.push({
              source: item.enterpriseName,
              target: typesName
            });
            datas.push({
              name: item.enterpriseName,
              symbolSize: 56,
              label: {
                offset: item.disqualifiedBatch ? [0, 52] : [0, 44]
              },
              ids: item.enterpriseId,
              qualified: item.disqualifiedBatch,
              itemStyle: {
                color: item.disqualifiedBatch ? "#DF5A76" : "#34D169"
              }
            });
          });
        }
        this.links = [...links];
        this.datas = [...datas];
        this.$nextTick(() => {
          this.getCharts();
        });
      }
    },
    getCharts() {
      let datas = this.datas,
        links = this.links;
      this.myChart = echarts.init(document.getElementById("businessCharts"));
      let num = 60000 / datas.length;
      let imgRich;
      if (this.types == 0) {
        //种养殖
        imgRich = require("./images/yz.png");
      } else if (this.types == 1) {
        //流通
        imgRich = require("./images/lt.png");
      } else {
        //餐饮
        imgRich = require("./images/cy.png");
      }
      let option = {
        series: [
          {
            type: "graph",
            layout: "none",
            hoverAnimation: false,
            data: datas,
            links: links,
            roam: true,
            focusNodeAdjacency: false,
            layout: "force",
            force: {
              repulsion: num,
              initLayout: "circular"
            },
            nodeScaleRatio: 0,
            itemStyle: {
              normal: {
                show: false,
                borderColor: "#fff",
                borderWidth: 0
              }
            },
            circular: {
              rotateLabel: true
            },
            label: {
              show: true,
              position: "top",
              color: "#fff",
              fontSize: 14,
              formatter(value) {
                if (value.dataIndex == 0) {
                  return "{a|}\n" + "{b|" + value.name + "}";
                } else {
                  if (datas[value.dataIndex].qualified) {
                    return (
                      "{c|" +
                      value.name +
                      "}" +
                      "\n" +
                      "{d|" +
                      datas[value.dataIndex].qualified +
                      "}" +
                      " {e|次\n不合格}"
                    );
                  } else {
                    return "{c1|" + value.name + "}" + "{e|\n合格}";
                  }
                }
              },
              rich: {
                a: {
                  backgroundColor: {
                    image: imgRich
                  },
                  height: 40,
                  align: "center"
                },
                b: {
                  lineHeight: 30,
                  color: "#fff",
                  align: "center",
                  fontSize: 13
                },
                c: {
                  lineHeight: 46,
                  color: "#fff",
                  align: "center",
                  fontSize: 14
                },
                c1: {
                  lineHeight: 70,
                  color: "#fff",
                  align: "center",
                  fontSize: 14
                },
                d: {
                  color: "#fff",
                  align: "center",
                  fontSize: 18
                },
                e: {
                  lineHeight: 20,
                  color: "#fff",
                  align: "center",
                  fontSize: 13
                }
              }
            },
            lineStyle: {
              color: "#94BCFF",
              curveness: 0.1,
              width: 4
            },
            emphasis: {
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      this.myChart.setOption(option, true);
      this.myChart.on("click", e => {
        if (e.dataType == "node") {
          if (e.data.ids) {
            if (e.data.qualified) {
              this.$emit("goDetails", {
                num: 2,
                types: this.types + 1,
                id: this.proMsg.id,
                times: this.proMsg.times,
                fromBusiness: {
                  num: this.result == 0 ? 3 : 4,
                  ids: e.data.ids
                }
              });
            } else {
              this.$emit("goBusiness", {
                type: 2,
                id: e.data.ids,
                times: this.proMsg.times
              });
            }
          }
        }
      });
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
#businessDetails {
  position: relative;
  width: 100%;
  height: 100%;
  .back,
  .name {
    font-size: 16px;
  }
  .back {
    position: relative;
    color: #3fb2ff;
    cursor: pointer;
    margin-right: 14px;
    &:after {
      position: absolute;
      right: -10px;
      top: 4px;
      bottom: 2px;
      width: 1px;
      content: "";
      background: #87b3d1;
    }
  }
  .name {
    color: #aad7ff;
  }
  .lists {
    display: inline-block;
    width: 270px;
    height: 32px;
    border-radius: 6px;
    overflow: hidden;
    margin-right: 10px;
    border: 1px solid #2681dc;
    box-sizing: content-box;
    > div {
      float: left;
      width: 33.33%;
      height: 100%;
      text-align: center;
      line-height: 32px;
      color: #fff;
      font-size: 13px;
      cursor: pointer;
      &:nth-child(2) {
        border-right: 1px solid #2681dc;
        border-left: 1px solid #2681dc;
      }
    }
    .list-active {
      background: #2681dc;
    }
  }
  .times {
    display: inline-block;
    overflow: hidden;
  }
  .charts {
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    bottom: 0;
  }
}
</style>