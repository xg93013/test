<template>
  <div id="detailBottom" :class="{bottom:isFullScreen,shrink: isShrink}">
    <div>
      <div class="top-options">
        <div :class="{'is-one':riskId}">
          <div
            v-show="!riskId"
            :class="{'top-option-active':optionNum===0&&!riskId}"
            @click="optionNum=0"
          >风险分析</div>
          <div
            :class="{'top-option-active':optionNum===1||riskId,'top-option-a':riskId}"
            @click="optionNum=1"
          >变化趋势</div>
        </div>
      </div>
      <div id="riskChart" v-show="optionNum===0&&!riskId"></div>
      <div id="riskLineChart" v-show="optionNum===1||riskId">
        <div class="l">
          <img :src="require('../../images/rp.png')" alt />
          {{riskId?obj[riskId]+"商家数量":"风险指数"}}
        </div>
        <div class="r">
          <img :src="require('../../images/bp.png')" alt />
          监测商家总数
        </div>
        <div id="riskLineChartBox"></div>
      </div>
      <div
        v-show="optionNum===0&&!riskId"
        class="risk-box"
        :style="{borderRadius: '4px',color: 'rgb('+color.join(',')+')',border:'1px solid rgb('+color.join(',')+')',background:'rgba('+color.join(',')+',.1)'}"
      >{{areaName}} 风险指数是{{riskNum}}</div>
    </div>
    <div :style="{paddingBottom: (total>10?'40px':0)}">
      <div>
        <div>餐饮主体列表</div>
        <div>
          <div class="w1">序号</div>
          <div class="w2">商家名称</div>
          <div class="w3">区域</div>
          <div class="w3">风险指数</div>
          <div class="w3">入驻平台</div>
        </div>
      </div>
      <div class="org-lists">
        <div
          style="color:#999;text-align:center;margin-top:10px;font-weight:bold"
          v-if="total==0"
        >暂无数据</div>
        <div :key="index" v-for="(item,index) in orgDatas" @click="goDetails(item.id)">
          <div class="w1">
            <span style="left:6px">{{index+1}}</span>
          </div>
          <div class="w2">
            <el-tooltip
              :disabled="disabled"
              class="item"
              effect="dark"
              :content="item.name"
              :open-delay="500"
              placement="left"
            >
              <span
                :ref="'name'+index"
                @mouseenter="overEnter('name'+index)"
                @mouseleave="overLeave"
              >{{item.name}}</span>
            </el-tooltip>
          </div>
          <div class="w3">
            <el-tooltip
              :disabled="disabled"
              class="item"
              effect="dark"
              :content="item.region"
              :open-delay="500"
              placement="left"
            >
              <span
                :ref="'region'+index"
                @mouseenter="overEnter('region'+index)"
                @mouseleave="overLeave"
              >{{item.region}}</span>
            </el-tooltip>
          </div>
          <div class="w3">
            <span>{{item.riskValue}}</span>
          </div>
          <div class="w3">
            <span>
              <img
                v-if="item.platforms.indexOf('MEI_TUAN_WM')>-1"
                :src="require('../../images/mt.png')"
                alt
              />
              <img
                v-if="item.platforms.indexOf('ELE_ME_WM')>-1"
                :src="require('../../images/elm.png')"
                alt
              />
              <img
                v-if="item.platforms.indexOf('BAIDU_WM')>-1"
                :src="require('../../images/elmxxa.png')"
                alt
              />
            </span>
          </div>
        </div>
      </div>
      <div class="org-pag" v-if="total>10">
        <comPageBox
          @changePage="changePage"
          :currentPageNum="Number(page)"
          :totalElements="total"
          :totalPage="totalPage"
        />
      </div>
    </div>
  </div>
</template>
<script>
import comPageBox from "@/components/com-page-box.vue";
import ColorRangeMaker from "./color";
import echarts from "echarts";
import { mapState } from "vuex";
import http from "@/unit/http";
import apis from "@/unit/apis";
const { VENTURE_INDEX, VENTURE_DYNAMIC, VENTYRE_TREND } = apis;
export default {
  data() {
    return {
      obj: {
        _CERT_VALID: "证照合规",
        UN_PUBLICIZED: "证照缺失",
        NON_PERMIT: "证照不符",
        VAGUE: "证件模糊",
        FORGERY: "疑似假证",
        MULTI_PURPOSE: "一证多用",
        OVER_RAGE: "超范围经营",
        EXPIRED: "证件过期",
        ADDRESS: "地址不符",
        COMMENT: "风险评论"
      },
      cm: new ColorRangeMaker({
        // color: [[105,203,4], [242, 245, 26], [227, 122, 53]],
        color: [[105, 203, 4], [250, 175, 10], [185, 8, 8]],
        value: [0, 100]
      }),
      color: [0, 0, 0],
      disabled: true,
      orgDatas: [],
      page: 1,
      total: 0,
      totalPage: 0,
      areaName: "",
      riskNum: 0,
      id: "",
      riskId: "",
      isShrink: false,
      optionNum: 0,
      riskChart: null,
      trendChart: null,
      defaulName: ""
    };
  },
  components: {
    comPageBox
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.isFullScreen
    })
  },
  props: {
    areaLng: {
      type: Object,
      default: {}
    }
  },
  watch: {
    isFullScreen(a, b) {
      if (this.$route.name === "riskAnalysis") {
        this.getChart();
      }
    },
    optionNum(a, b) {
      this.$nextTick(() => {
        if (a === 0) {
          this.riskChart.resize();
        } else {
          this.trendChart.resize();
        }
      });
    },
    riskId(a, b) {
      this.$nextTick(() => {
        if (a === 0) {
          this.riskChart.resize();
        } else {
          this.trendChart.resize();
        }
      });
    }
  },
  methods: {
    shrinkChange(e) {
      this.isShrink = e;
    },
    goDetails(id) {
      this.$emit("getBaseMsg", id);
      this.$emit("goDetail", id);
    },
    overEnter(id) {
      let el =
        this.$refs[id] instanceof Array ? this.$refs[id][0] : this.$refs[id];
      if (el.scrollWidth > el.clientWidth) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    overLeave(key) {
      this.disabled = true;
    },
    pageChange(e) {
      this.page = e;
      this.getTableList();
    },
    init(obj, areaName = "", isBack) {
      if (areaName) {
        this.areaName = areaName;
      } else {
        let { regionType, province, city, zone } = this.$store.state.userMsg;
        if (regionType === "CITY") {
          this.areaName = city;
        }
        if (regionType === "ZONE") {
          this.areaName = zone;
        }
        if (regionType === "PROVINCE") {
          this.areaName = province;
        }
      }
      this.id = obj ? obj.area : "";
      this.riskId = obj ? obj.risk : "";
      if (!isBack) {
        this.page = 1;
      }
      this.$nextTick(() => {
        this.getRiskNum();
        this.getTableList();
        this.getCharta();
      });
    },
    async getRiskNum() {
      let res = await http.get(VENTURE_INDEX + "?region=" + this.id);
      if (res) {
        this.riskNum = res.result;
        this.color = this.cm.make(res.result);
        this.getChart();
      }
    },
    changePage(e) {
      this.page = e;
      this.getTableList();
    },
    async getTableList() {
      let res = await http.get(
        VENTURE_DYNAMIC +
          "/" +
          this.page +
          "/10" +
          "?region=" +
          this.id +
          (this.riskId ? "&ventureType=" + this.riskId : "")
      );
      if (res) {
        this.total = res.result.totalSize;
        this.totalPage = res.result.totalPage;
        this.orgDatas = [...res.result.content];
      }
    },
    getChart() {
      let riskNum = this.riskNum;
      let txtColor = this.isFullScreen ? "#fff" : "#666";
      let txtColora = this.isFullScreen ? "#fff" : "#999";
      let splintColor = this.isFullScreen ? "#0b141b" : "#fff";
      let axislineColor = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: "#69cb04"
        },

        {
          offset: 0.5,
          color: "#faaf0a"
        },

        {
          offset: 1,
          color: "#b90808"
        }
      ]);

      this.riskChart = echarts.init(document.getElementById("riskChart"));
      let option = {
        series: [
          {
            type: "gauge",
            radius: "90%", //大小
            splitNumber: 100,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 14, //粗细
                color: [[1, axislineColor]]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              // 分隔线
              length: 14,
              show: true,
              lineStyle: {
                color: splintColor,
                width: 2
              }
            },
            axisLabel: {
              fontSize: 12,
              distance: 4,
              color: txtColor,
              formatter: e => {
                if (e % 25 === 0) {
                  return e;
                }
              }
            },
            detail: {
              //百分比颜色
              offsetCenter: [0, 70], //字体百分比位置
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: txtColor,
                fontSize: 26,
                fontWeight: 500
              },
              formatter: function(value) {
                return value.toFixed(2) + "\n" + "{a|实时风险指数}";
              },
              rich: {
                a: {
                  fontSize: 12,
                  color: txtColora,
                  lineHeight: 26
                }
              }
            },
            itemStyle: {
              //指针颜色
              normal: {
                color: {
                  x: "0.00",
                  y: "0.00",
                  x2: "1.00",
                  y2: "1.00",
                  type: "linear",
                  global: false,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#3DE753"
                    },
                    {
                      offset: 1,
                      color: "#F2F51A"
                    }
                  ]
                },
                borderWidth: 0
              }
            },
            data: [
              {
                value: riskNum
              }
            ]
          }
        ]
      };
      this.riskChart.setOption(option);
    },
    async getCharta() {
      let defaulName = this.defaulName;
      let id = this.id;
      let areaLng = this.areaLng;
      let riskId = this.riskId;
      let obj = this.obj;
      let arg = "?region=" + this.id;
      if (riskId) {
        arg += "&ventureType=" + this.riskId;
      }
      let res = await http.get(VENTYRE_TREND + arg);
      if (res) {
        let xData = [],
          yData = [],
          yDataa = [];
        res.result.reverse().forEach(item => {
          let { trendOn, riskValue, shopCount, riskCount } = item;
          xData.push(trendOn);
          yData.push(riskId ? riskCount : riskValue);
          yDataa.push(shopCount);
        });
        this.trendChart = echarts.init(
          document.getElementById("riskLineChartBox")
        );
        let option = {
          grid: {
            right: 60,
            left: 60
          },
          tooltip: {
            trigger: "axis",
            formatter(e) {
              let areaName = id ? areaLng[id][2] : defaulName;
              let txt = `<div style="text-align:left">${
                e[0].axisValue
              } ${areaName}<br/><span style="display:inline-block;width:10px;height:10px;border-radius:5px;margin-right:4px;background:${
                e[1].color
              }"></span>${e[1].seriesName}: ${
                e[1].value
              }<br/><span style="display:inline-block;width:10px;height:10px;border-radius:5px;margin-right:4px;background:${
                e[0].color
              }"></span>${e[0].seriesName}: ${
                riskId ? e[0].value : e[0].value.toFixed(2)
              }</div>`;
              return txt;
            }
          },

          xAxis: {
            data: xData,
            boundaryGap: false,
            axisLine: {
              show: true //隐藏X轴轴线
            },
            axisTick: {
              show: false //隐藏X轴刻度
            },
            axisLabel: {
              show: true,
              margin: 10,
              textStyle: {
                color: "#999" //X轴文字颜色
              },
              rotate: -40,
              interval: e => {
                if (e === 0 || (e + 1) % 5 === 0) {
                  return xData[e];
                }
              }
            },
            axisLine: {
              lineStyle: {
                color: "#ddd"
              }
            }
          },
          yAxis: [
            {
              max: riskId ? null : 100,
              min: 0,
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: true
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#999"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#ddd"
                }
              }
            },
            {
              position: "right",
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: "#ddd"
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#999"
                }
              }
            }
          ],
          series: [
            {
              name: riskId ? obj[riskId] + "商家数量" : "风险指数",
              type: "line",
              smooth: true, //平滑曲线显示
              symbolSize: 6, //标记的大小
              itemStyle: {
                //折线拐点标志的样式
                color: "#F48385"
              },
              lineStyle: {
                color: "#F48385"
              },
              data: yData
            },
            {
              name: "监测商家总数",
              type: "line",
              itemStyle: {
                //折线拐点标志的样式
                color: "#29BBEC"
              },
              lineStyle: {
                color: "#29BBEC"
              },
              yAxisIndex: 1,
              smooth: true, //平滑曲线显示
              symbolSize: 6, //标记的大小
              data: yDataa
            }
          ]
        };
        this.trendChart.setOption(option);
      }
    }
  },
  mounted() {
    let { city, province, zone, regionType } = this.$store.state.userMsg;
    if (regionType == "PROVINCE") {
      this.defaulName = province;
    }
    if (regionType == "CITY") {
      this.defaulName = city;
    }
    if (regionType == "ZONE") {
      this.defaulName = zone;
    }
    this.init();
  }
};
</script>
<style lang="scss">
#detailBottom {
  position: relative;
  // width: 100%;
  width: 400px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  padding-top: 310px;
  transition: all 0.3s;
  overflow: hidden;
  > div {
    &:first-child {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 310px;
      text-align: center;
      .top-options {
        width: 100%;
        height: 40px;
        padding-top: 12px;
        .is-one {
          width: 80px;
        }
        > div {
          width: 160px;
          height: 26px;
          border-radius: 26px;
          background: #eff2f4;
          margin: 0 auto;
          overflow: hidden;

          > div {
            float: left;
            width: 50%;
            height: 100%;
            line-height: 26px;
            text-align: center;
            color: #333;
            cursor: pointer;
          }
          .top-option-a {
            width: 100%;
          }
          .top-option-active {
            background: #5288c0;
            color: #fff;
          }
        }
      }
      #riskChart {
        width: 100%;
        height: 240px;
      }
      #riskLineChart {
        position: relative;
        width: 100%;
        height: 270px;
        #riskLineChartBox {
          width: 100%;
          height: 100%;
        }
        .l,
        .r {
          position: absolute;
          top: 26px;
          background: #eff2f4;
          padding: 4px 6px;
          font-size: 12px;
          img {
            position: relative;
            top: 1px;
          }
        }
        .l {
          left: 58px;
          color: #f48385;
          border-top-right-radius: 8px;
        }
        .r {
          right: 60px;
          color: #29bbec;
          border-top-left-radius: 8px;
        }
      }

      .risk-box {
        display: inline-block;
        padding: 0 20px;
        height: 24px;
        // border: 1px solid #da4804;
        // background: rgba(218, 72, 4, 0.25);
        text-align: center;
        // color: #da4804;
        line-height: 24px;
      }
    }
    &:last-child {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 80px 10px 40px;
      > div:first-child {
        position: absolute;
        height: 60px;
        left: 10px;
        right: 10px;
        top: 20px;
        > div:first-child {
          font-size: 16px;
          font-weight: bold;
          height: 30px;
          line-height: 30px;
        }

        > div:last-child {
          height: 30px;
          line-height: 30px;

          > div {
            float: left;
            font-weight: bold;
            color: #999;
          }
        }
      }
      .org-lists {
        width: 100%;
        height: 100%;
        > div {
          cursor: pointer;
          height: 10%;
          border-bottom: 1px solid #f0f3f3;
          > div {
            position: relative;
            height: 100%;
            float: left;
            span {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              position: absolute;
              top: 50%;
              left: 0;
              right: 6px;
              transform: translate(0, -50%);
            }
          }

          &:last-child {
            border: none !important;
          }
        }
      }
      .org-pag {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 40px;
        padding-top: 6px;
        text-align: center;
        .el-pagination.is-background .btn-next,
        .el-pagination.is-background .btn-prev,
        .el-pagination.is-background .el-pager li {
          background: rgba(0, 0, 0, 0);
          border: 1px solid #999;
        }
        .el-pagination.is-background .el-pager li {
          &:hover {
            color: #da4804;
          }
        }
        .el-pagination.is-background .el-pager li:not(.disabled).active {
          background: #da4804;
          border: none;
          &:hover {
            color: #fff;
          }
        }
      }
      .w1 {
        width: 10%;
      }
      .w2 {
        width: 30%;
      }
      .w3 {
        width: 20%;

        img {
          width: 20px;
          height: 20px;
          margin-top: 4px;
        }
      }
    }
  }
}
#detailBottom.bottom {
  background: #0b141b;
  box-shadow: 0px 0px 0px 0px #313c46;
  > div:last-child {
    background-image: url(../../images/sg.png);
    background-repeat: no-repeat;
    background-position: -22px -6px;
  }

  .org-lists {
    > div {
      border-bottom: 1px solid rgba(113, 147, 169, 0.1) !important;
    }
  }
  > div {
    &:first-child {
      .top-options {
        > div {
          background: #2b3743;
          > div {
            color: #fff;
          }
        }
      }
      #riskLineChart {
        .l,
        .r {
          background: #20303e;
        }
      }
    }
  }
}
#detailBottom.shrink {
  width: 0;
  padding: 0;
}
</style>

