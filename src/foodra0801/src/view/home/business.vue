<template>
  <div id="business">
    <el-row style="height:40px">
      <el-col :span="12" class="txt-20">{{name}}</el-col>
      <el-col v-show="name" :span="12" align="right">
        <timeSlot @timeChange="timeChange" :currentTime="currentTime"/>
      </el-col>
    </el-row>
    <div id="businessBox"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import timeSlot from "@/components/timeSlot";
//	import  'echarts/theme/macarons.js'
import http from "@/unit/http";
import apis from "@/unit/apis";
const { ENTERPRISE_RELATION, FOOD_DETAILS } = apis;
export default {
  data() {
    return {
      myChart: null,
      datas: [],
      links: [],
      name: "",
      id: "",
      currentTime: {}
    };
  },
  components: {
    timeSlot
  },
  methods: {
    init(id, times) {
      this.id = id;
      let curtime;
      if (times) {
        curtime = times;
        this.currentTime = {
          year: times.split("年")[0],
          msg: times.split("年")[1]
        };
      } else {
        let time = new Date();
        let y = time.getFullYear() + "年";
        let m = time.getMonth() + 1;
        m = m > 9 ? m + "月" : "0" + m + "月"; ///默认本年本月
        curtime = y + m;
        this.currentTime = {
          year: time.getFullYear(),
          msg: m
        };
      }
      this.$nextTick(() => {
        this.getDatas(curtime);
      });
    },
    timeChange(e) {
      this.getDatas(e.year + "年" + e.msg);
    },
    async getDatas(time) {
      let res = await http.get(
        ENTERPRISE_RELATION + this.id + "?dateValue=" + time
        // ENTERPRISE_RELATION +
        //   "eaada14d3c32442abfc96748324a26cf" +
        //   "?dateValue=" +
        //   time
      );
      if (res) {
        if (res.data.link == 1) {
          this.name = "生产企业-" + res.data.enterpriseName;
        } else if (res.data.link == 2) {
          this.name = "流通企业-" + res.data.enterpriseName;
        } else if (res.data.link == 3) {
          this.name = "餐饮企业-" + res.data.enterpriseName;
        }
        let links = [],
          datas = [],
          color = [
            "#2ec7c9",
            "#b6a2de",
            "#5ab1ef",
            "#ffb980",
            "#d87a80",
            "#8d98b3",
            "#e5cf0d",
            "#97b552",
            "#95706d",
            "#dc69aa",
            "#07a2a4",
            "#9a7fd1",
            "#588dd5",
            "#f5994e",
            "#c05050",
            "#59678c",
            "#c9ab00",
            "#7eb00a",
            "#6f5553",
            "#c14089",
            "#2ec7c9",
            "#b6a2de",
            "#5ab1ef",
            "#ffb980",
            "#d87a80",
            "#8d98b3",
            "#e5cf0d",
            "#97b552",
            "#95706d",
            "#dc69aa",
            "#07a2a4",
            "#9a7fd1",
            "#588dd5",
            "#f5994e",
            "#c05050",
            "#59678c",
            "#c9ab00",
            "#7eb00a",
            "#6f5553",
            "#c14089"
          ];
        datas.push({
          name: res.data.enterpriseName,
          category: res.data.enterpriseName,
          symbolSize: 40,
          link: res.data.link,
          punishments: res.data.punishments,
          enterpriseAddr: res.data.enterpriseAddr,
          enterpriseUnifiedCode: res.data.enterpriseUnifiedCode,
          itemStyle: {
            normal: {
              borderColor:
                res.data.punishments && res.data.punishments.length
                  ? "#7E1524"
                  : "#1767C6",
              borderWidth: 4,
              color:
                res.data.punishments && res.data.punishments.length
                  ? "#C92940"
                  : "#158AF4"
            }
          }
        });
        let obj = {};
        obj[res.data.enterpriseName] = "\n";
        if (res.data.products && res.data.products.length) {
          res.data.products.forEach((item, index) => {
            let productName;
            if (obj[item.productName]) {
              productName = obj[item.productName];
            } else {
              productName = item.productName;
            }
            obj[item.productName] = "\n";
            links.push({
              source: res.data.enterpriseName,
              target: productName
            });

            datas.push({
              name: productName,
              symbolSize: 18,
              category: productName,
              foodCategories: item.foodCategories,
              salesVolume: item.salesVolume,
              details: item.details,
              foodId: item.foodId,
              productId: item.productId,
              itemStyle: {
                color: color[index]
              }
            });

            if (item.enterprises && item.enterprises.length) {
              item.enterprises.forEach(itema => {
                let target;
                if (obj[itema.enterpriseName]) {
                  target = itema.enterpriseName + obj[itema.enterpriseName];
                  obj[itema.enterpriseName] += "\n";
                } else {
                  target = itema.enterpriseName;
                  obj[itema.enterpriseName] = "\n";
                }
                links.push({
                  source: item.productName,
                  target
                });

                datas.push({
                  name: target,
                  symbolSize: 18,
                  category: item.productName,
                  link: itema.link,
                  enterpriseAddr: itema.enterpriseAddr,
                  punishments: itema.punishments,
                  enterpriseUnifiedCode: itema.enterpriseUnifiedCode,
                  itemStyle: {
                    color: color[index]
                  }
                });

                if (itema.relations && itema.relations.length) {
                  itema.relations.forEach(itemb => {
                    let targetb;
                    if (obj[itemb.enterpriseName]) {
                      targetb =
                        itemb.enterpriseName + obj[itemb.enterpriseName];
                      obj[itemb.enterpriseName] += "\n";
                    } else {
                      targetb = itemb.enterpriseName;
                      obj[itemb.enterpriseName] = "\n";
                    }
                    links.push({
                      source: itema.enterpriseName,
                      target: targetb
                    });

                    datas.push({
                      name: targetb,
                      symbolSize: 18,
                      category: itema.enterpriseName,
                      link: itemb.link,
                      enterpriseAddr: itemb.enterpriseAddr,
                      punishments: itemb.punishments,
                      enterpriseUnifiedCode: itemb.enterpriseUnifiedCode,
                      itemStyle: {
                        color: color[index]
                      }
                    });
                  });
                }
              });
            }
          });
        }
        this.links = [...links];
        this.datas = [...datas];
        this.$nextTick(() => {
          this.getCharts();
        });
      }
    },
    closeTip() {
      this.myChart.dispatchAction({
        type: "hideTip"
      });
    },
    getCharts() {
      let datas = this.datas,
        links = this.links,
        num = 30000 / datas.length;
      num = num < 1000 ? 1000 : num;
      this.myChart = echarts.init(document.getElementById("businessBox"));
      let option = {
        tooltip: {
          triggerOn: "click",
          enterable: true,
          confine: true,
          //						alwaysShowContent: true,
          backgroundColor: "rgba(255,255,255,.9)",
          textStyle: {
            color: "#666"
          },
          padding: [10, 10],
          formatter(e) {
            if (e.dataType !== "node") {
              return;
            }
            let data = datas[e.dataIndex];
            if (data.foodCategories) {
              let tables = "",
                trs = "",
                details = data.details;
              if (details.length) {
                for (let i = 0, n = details.length; i < n; i++) {
                  trs += `<tr>
                      <td>${details[i].orderDate}</td>
                      <td>${details[i].type}</td>
                      <td class="batch-number" id=${data.foodId} name = ${
                    data.productId
                  } style="text-decoration:underline;cursor:pointer">${
                    details[i].batchNumber
                  }</td>
                      <td>${details[i].trader}</td>
                      <td>${details[i].volumeValue}</td>
                      <td>${details[i].inventory}</td>
                  </tr>`;
                }
                tables = `<table>
                  <tr>
                      <th>时间</th>
                      <th>类型</th>
                      <th>批次号</th>
                      <th width="300px">对象</th>
                      <th>数量</th>
                      <th>库存总量</th>
                  </tr>
                  ${trs}
                </table>`;
              }

              let div = `<div class="pro-box" style="width:800px">
              食品名称：${data.category} <br />
              食品分类：${data.foodCategories} <br />
              食品规格： 散装称重 <br />
              ${tables}
              </div>`;
              return div;
            }
            if (data.link) {
              let name = "生产企业";
              if (data.link == 1) {
                name = "生产企业";
              } else if (data.link == 2) {
                name = "流通企业";
              } else if (data.link == 3) {
                name = "餐饮企业";
              }
              let tables = "",
                trs = "",
                datas = [],
                spans = "",
                divs = "",
                punishments = data.punishments;
              if (punishments.length) {
                divs = `<div class="pro-box-bottom">`;
                for (let i = 0, n = punishments.length; i < n; i++) {
                  trs += `<tr>
                      <td>${punishments[i].punishmentDate}</td>
                      <td>${punishments[i].punishmentReason}</td>
                      <td>${punishments[i].punishmentUnit}</td>
                  </tr>`;
                  if (datas.indexOf(punishments[i].punishmentReason) == -1) {
                    datas.push(punishments[i].punishmentReason);
                    spans += `<div style="white-space: pre-line;line-height:24px">${
                      punishments[i].punishmentReason
                    }</div>`;
                  }
                }
                tables = `<table style="margin-top:5px">
                  <tr>
                      <th width="130px">处罚日期</th>
                      <th>处罚事由</th>
                      <th>处罚单位</th>
                  </tr>
                  ${trs}
                </table>`;
              } else {
                divs = `<div class="pro-box-bottom" style="display:none">`;
              }
              let div = `<div class="pro-box" style="width:600px">
                <div class="pro-box-top">
                  <div class="pro-circel">
                    <span>80</span> <br />
                    综合评分
                  </div>
                  企业名称：${data.name} <br />
                  企业分类：${name} <br />
                  统一社会信用代码：${data.enterpriseUnifiedCode}
                  <div style="white-space: pre-line;">企业地址：${
                    data.enterpriseAddr
                  }</div>
                </div>
                ${divs}
                  <div>
                    <span style="font-size:15px;color:#ffd60e">异常行为特征标签</span>
                    ${spans}
                  </div>
                  <div>
                    <span style="font-size:15px;color:#ffd60e">异常行为特征记录</span> <br />
                    ${tables}
                  </div>
                </div>
              </div>`;
              return div;
            }
          }
        },
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
            circular: {
              rotateLabel: true
            },
            label: {
              show: true,
              position: "top",
              color: "#fff",
              fontSize: 14,
              formatter(value) {
                return value.name;
              }
            },
            lineStyle: {
              color: "#94BCFF",
              curveness: 0.3,
              width: 2
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
        }
      });
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
    async getData(proMsg) {
      let txt =
        "?link=" +
        proMsg.types +
        "&batchNumber=" +
        proMsg.batch +
        "&productId=" +
        proMsg.productId +
        "&page=" +
        1 +
        "&size=" +
        10;
      let res = await http.get(FOOD_DETAILS + proMsg.id + txt);
      if (res) {
        if (res.data.content.list.length) {
          document.getElementById("businessBox").children[1].style.display =
            "none";
          this.$emit("goDetails", proMsg);
        } else {
          if (proMsg.types < 3) {
            proMsg.types++;
            this.$nextTick(() => {
              this.getData(proMsg);
            });
          } else {
            this.$message.warning("暂无数据");
          }
        }
      }
    }
  },
  mounted() {
    document.getElementById("businessBox").addEventListener("click", e => {
      if (e.target.className == "batch-number") {
        let proMsg = {
          num: 5,
          types: 1,
          id: e.target.id,
          productId: e.target.getAttribute("name"),
          batch: e.target.innerText
        };
        this.getData(proMsg);
        // this.$emit("goDetails", {
        //   num: 5,
        //   types: 1,
        //   id: e.target.id,
        //   productId: e.target.getAttribute("name"),
        //   batch: e.target.innerText
        // });
      }
    });
  }
};
</script>

<style lang="scss">
#business {
  position: relative;
  width: 100%;
  height: 100%;
  .txt-20 {
    font-size: 20px;
    color: #aad7ff;
  }
  #businessBox {
    position: absolute;
    width: 100%;
    left: 0;
    top: 40px;
    bottom: 0;
    > div {
      padding: 0 !important;
      border-radius: 6px !important;
    }
    .pro-box {
      padding: 15px;
      border-radius: 5px;
      line-height: 26px;
      background: #0e62c0;
      overflow: hidden;
      color: #fff;

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        th {
          background: #0e3e9f;
        }
        th,
        td {
          padding: 6px;
          border: 1px solid #7894cc;
          color: #fff;
        }
        th {
          text-align: left;
        }
        td {
          white-space: pre-line;
        }
      }

      .pro-box-top {
        position: relative;
        width: 100%;
        padding-left: 140px;
        line-height: 26px;

        .pro-circel {
          position: absolute;
          width: 100px;
          height: 100px;
          line-height: 26px;
          font-size: 16px;
          left: 20px;
          text-align: center;
          overflow: hidden;
          top: 45%;
          transform: translate(0, -50%);
          span {
            display: inline-block;
            width: 80px;
            height: 80px;
            border: 4px solid #d5e2f7;
            border-radius: 50%;
            line-height: 70px;
            text-align: center;
            font-size: 28px;
          }
        }
      }

      .pro-box-bottom {
        width: 100%;
        overflow: hidden;
        padding-top: 10px;
        margin-top: 10px;
        border-top: 2px solid #fff;

        > div {
          float: left;
          min-height: 100px;
          overflow: hidden;
          padding: 0 10px;

          &:first-child {
            width: 34%;
            text-align: center;
            line-height: 26px;
          }

          &:last-child {
            width: 66%;
            max-height: 300px;
            overflow-y: auto;
            border-left: 2px solid #fff;
          }
        }
      }
    }
  }
}
</style>