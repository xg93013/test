<template>
  <div id="main">
    <div class="header">
      <p>
        网格化监管数据分析系统
        <button @click="clearTimer()" id="clickBtn" style="display:none;">清除定时器</button>
      </p>
    </div>
    <div class="content" v-loading="loading">
      <div class="maps" id="maps"></div>
      <div class="left">
        <div class="time">
          <DateSelect @timeChange="timeChange"/>
        </div>
        <div class="filter">
          <div class="item">
            <span @click="selectProvince()">成都市-</span>
            <el-select v-model="selectCity" placeholder="请选择" @change="changeCity">
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="selectSupervision" placeholder="请选择" @change="changeSupervision">
              <el-option
                v-for="item in supervisionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="wrapper">
          <div class="item">
            <div class="sum">
              <p>
                <span class="title">网格数量</span>
                <span>1200</span>
              </p>
            </div>
          </div>
          <div class="item">
            <div class="sum">
              <p>
                <span class="title">网格数量</span>
                <span>1200</span>
              </p>
            </div>
          </div>
          <div class="item">
            <div class="sum">
              <p>
                <span class="title">网格数量</span>
                <span>1200</span>
              </p>
            </div>
          </div>
          <div class="item">
            <div class="sum">
              <p>
                <span class="title">网格数量</span>
                <span>1200</span>
              </p>
            </div>
          </div>
          <div class="item chart">
            <div class="box" :class="{'fullscreens': fullscreen}" id="targetC">
              <div class="titles">网格员巡查频次对比</div>
              <span @click="openScreen()" v-show="!fullscreen">screen</span>
              <span @click="exitOutFullScreen()" v-show="fullscreen">exit</span>
              <!-- <div class="3dchart"></div> -->
              <bar-chart ref="barChartRefs" :gldatas="gldatas"></bar-chart>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="wrapper">
          <div class="item warning">
            <div>
              <div class="titles">事件预警</div>
              <div class="pages">
                <i
                  class="el-icon-caret-left"
                  :class="{'disabled' : currentWarning === 0}"
                  @click="prevWarning()"
                  id="prevBtn"
                ></i>
                <i
                  class="el-icon-caret-right"
                  :class="{'disabled' : currentWarning === warningList.length-1 || warningList.length === 0}"
                  id="nextBtn"
                  @click="nextWarning('click')"
                ></i>
              </div>
              <div class="out-box" id="pageBox">
                <div
                  class="page-box"
                  :style="{width: warningList.length*boxWidth + 'px',marginLeft: -boxWidth*currentWarning + 'px'}"
                >
                  <div
                    class="page-item"
                    v-for="(item, index) in warningList"
                    :key="item.name+index"
                  >
                    <div class="inner">
                      <div class="icon">img</div>
                      <div class="text">
                        <div class="des">
                          事件名称：{{item.name}}经营食品标签、说明书是否涉及疾病预防、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。
                          <span
                            v-show="'事件名称：经营食品标签、说明书是否涉及疾病预防、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。'.length > 40"
                          >...</span>
                        </div>
                        <br>
                        <p>涉及区域：14个区县</p>
                      </div>
                    </div>
                    <p class="detail" @click="goDetail()">详情》</p>
                  </div>
                  <!-- <div class="page-item">b</div>
                  <div class="page-item">c</div>-->
                  <div class="page-item" v-show="warningList.length ==0">
                    <div class="inner">
                      <div class="icon">empty</div>
                      <div class="empty">本月暂无预警数据</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item rank">
            <div>
              <div class="titles">高频事件TOP10</div>
              <div class="table-box">
                <el-table
                  :data="listData"
                  style="width: 100%;height: 100%"
                  height="100%"
                  show-overflow-tooltip="true"
                  @row-click="rowClick"
                >
                  <el-table-column prop="num" label="序号" width="50"></el-table-column>
                  <el-table-column prop="name" label="事件"></el-table-column>
                  <el-table-column prop="per" label="频次" width="50"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <p>事件名称：3.8 经营食品标签、说明书是否涉及疾病预防、治疗功能。</p>
        <p>所属类别：3.食品标签等外观质量状况</p>
        <p>涉及区域：武侯区、青羊区、金牛区、锦江区、成华区、双流区、郫都区、青白江区、简阳市、温江区、彭州市、金堂县、大邑县、崇州市</p>
        <p>发生频次：1109</p>
      </div>
    </el-dialog>
    <el-dialog
      :title="listTitle"
      :visible.sync="listDialog"
      width="1200px"
      custom-class="listDialog"
      :before-close="handleListClose"
    >
      <div>
        <el-table
          :data="allList"
          style="width: 100%"
          show-overflow-tooltip="true"
          @row-click="listClick"
          height="500"
        >
          <el-table-column prop="num" label="序号" width="50"></el-table-column>
          <el-table-column prop="companyName" label="企业名称"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="area" label="区域"></el-table-column>
          <el-table-column prop="checkType" label="检查类型"></el-table-column>
          <el-table-column prop="circle" label="环节"></el-table-column>
          <el-table-column prop="checkPerson" label="检查人员"></el-table-column>
          <el-table-column prop="checkDate" label="检查日期"></el-table-column>
          <el-table-column prop="checkCaseType" label="检查事项大类"></el-table-column>
          <el-table-column prop="checkCaseClass" label="检查事项细类"></el-table-column>
          <el-table-column prop="isPass" label="是否符合"></el-table-column>
        </el-table>
        <div class="page">
          <el-pagination layout="prev, pager, next" :total="1000"></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chengdu from "@/unit/chengdu.json";
import city from "@/unit/city.json";
import barChart from "./children/barChart.vue";
import DateSelect from "@/components/DateSelect/DateSelect.vue";
import * as screenfull from "screenfull";
import { throttle } from "@/unit/pub.js";

export default {
  data() {
    return {
      loading: true,
      fullscreen: false,
      mapObj: "",
      polygonObj: "",
      mapCenter: [104.10194, 30.65984],
      boxWidth: 290,
      warningList: [
        {
          name: "a",
          area: ""
        }
      ],
      currentWarning: 0,
      cityList: [
        {
          value: "高新区",
          label: "高新区"
        },
        {
          value: "成华区",
          label: "成华区"
        }
      ],
      supervisionList: [
        {
          value: "aaa",
          label: "aaa"
        },
        {
          value: "bbb",
          label: "bbb"
        }
      ],
      selectCity: "",
      selectSupervision: "",
      dialogVisible: false,
      listDialog: false,
      listData: [
        {
          num: 1,
          name:
            "5.3 在岗从事接触直接入口食品工作的食品经营人员是否存在患有国务院卫生行政部门规定的有碍食品安全疾病的情况。",
          per: 100
        },
        {
          num: 2,
          name:
            "5.3 在岗从事接触直接入口食品工作的食品经营人员是否存在患有国务院卫生行政部门规定的有碍食品安全疾病的情况。",
          per: 100
        }
      ],
      allList: [
        // {
        //   num: 1,
        //   companyName: "企业名称",
        //   address: "地址",
        //   area: "区域",
        //   checkType: "检查类型",
        //   circle: "环节",
        //   checkPerson: "检查人员",
        //   checkDate: "检查日期",
        //   checkCaseType: "检查事项大类",
        //   checkCaseClass: "检查事项细类",
        //   isPass: "是否符合"
        // }
      ],
      listTitle: "",
      timer: "",
      gldatas: []
    };
  },
  components: {
    barChart,
    DateSelect
  },
  created() {},
  methods: {
    clearTimer() {
      clearInterval(this.timer);
    },
    getData(time) {
      document.getElementById("clickBtn").click();
      this.timer = "";
      this.currentWarning = 0;
      this.allList = [];
      this.warningList = [];
      this.loading = true;
      for (let i = 0; i < 10; i++) {
        this.allList.push({
          num: 1,
          companyName: "企业名称",
          address: "地址",
          area: "区域",
          checkType: "检查类型",
          circle: "环节",
          checkPerson: "检查人员",
          checkDate: "检查日期",
          checkCaseType: "检查事项大类",
          checkCaseClass: "检查事项细类",
          isPass: "是否符合"
        });
        this.warningList.push({
          name: "ab" + i,
          area: ""
        });
        this.listData.push({
          num: 2,
          name:
            "5.3 在岗从事接触直接入口食品工作的食品经营人员是否存在患有国务院卫生行政部门规定的有碍食品安全疾病的情况。",
          per: 100
        });
      }
      this.gldatas = ["2019.01.14", "2019.01.13", "2019.01.12"];
      if (time.msg == "12月") {
        this.gldatas = ["2019.01.24"];
      }
      setTimeout(() => {
        this.loading = false;
        this.setTimer();
      }, 3000);
    },
    openScreen() {
      let target = document.getElementById("targetC");
      this.fullscreen = true;
      if (screenfull.enabled) {
        screenfull.request(target);
        // this.$refs.barChartRefs.resizeChart();
      }
    },
    exitOutFullScreen() {
      this.fullscreen = false;
      if (screenfull.enabled) {
        screenfull.exit();
      }
    },
    exitFull() {
      this.fullscreen = false;
      this.$refs.barChartRefs.serDefaultChart();
    },
    initMap() {
      this.mapObj = new AMap.Map("maps", {
        resizeEnable: true,
        zoom: 8,
        mapStyle: "amap://styles/0557538bad9e76aba4f4027e0ef5dea4",
        center: this.mapCenter,
        animateEnable: true
      });
      this.polygonObj = new AMap.Polygon({
        map: this.mapObj,
        strokeWeight: 1,
        strokeColor: "#0091ea",
        fillColor: "#80d8ff",
        fillOpacity: 0.2,
        path: chengdu.features[0].geometry.coordinates[0]
      });
    },
    selectProvince() {
      this.selectRegion("成都市");
    },
    changeCity(item) {
      this.selectRegion(item);
      this.selectSupervision = "";
    },
    changeSupervision(item) {
      console.log(item);
      // this.mapObj.setCenter(polygonData.features[i].properties.cp);
    },
    selectRegion(region) {
      let path = "";
      if (region !== "成都市") {
        for (let i = 0; i < city.features.length; i++) {
          if (city.features[i].properties.name === region) {
            path = city.features[i].geometry.coordinates[0];
            this.polygonObj.setPath(path);
            this.mapObj.setFitView();
            return;
          }
        }
      } else {
        this.selectCity = "";
        this.selectSupervision = "";
        path = chengdu.features[0].geometry.coordinates[0];
        this.polygonObj.setPath(path);
        this.mapObj.setFitView();
      }
    },
    prevWarning() {
      if (this.currentWarning > 0) {
        this.currentWarning--;
      }
    },
    nextWarning(flag) {
      if (this.currentWarning < this.warningList.length - 1) {
        this.currentWarning++;
      } else {
        if (!flag) {
          this.currentWarning = 0;
        }
      }
    },
    goDetail() {
      console.log("details");
      clearInterval(this.timer);
      this.dialogVisible = true;
    },
    handleClose() {
      this.setTimer();
      this.dialogVisible = false;
    },
    handleListClose() {
      this.setTimer();
      this.listDialog = false;
    },
    rowClick(row) {
      console.log(row);
      clearInterval(this.timer);
      this.listTitle =
        "2019年4月事件明细：5.3 在岗从事接触直接入口食品工作的食品经营人员是否存在患有国务院卫生行政部门规定的有碍食品安全疾病的情况";
      this.listDialog = true;
    },
    listClick(row) {
      console.log(row);
    },
    timeChange(time) {
      console.log(time);
      this.$nextTick(() => {
        this.getData(time);
        this.selectRegion("成都市");
      });
    },
    addScreenListen() {
      if (screenfull.enabled) {
        screenfull.on("change", () => {
          this.$refs.barChartRefs.clearChart();
          let timer = "";
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (!screenfull.isFullscreen) {
              this.exitFull();
            } else {
              this.$refs.barChartRefs.resizeChart();
            }
          }, 10);
        });
      }
    },
    setTimer() {
      if (this.warningList.length > 1) {
        this.timer = setInterval(() => {
          this.nextWarning();
        }, 3000);
      }
    }
  },
  mounted() {
    this.initMap();
    this.addScreenListen();
    document.getElementById("pageBox").addEventListener("mouseover", () => {
      clearInterval(this.timer);
    });
    document.getElementById("pageBox").addEventListener("mouseleave", () => {
      if (!this.listDialog && !this.dialogVisible) {
        this.setTimer();
      }
    });
    document.getElementById("prevBtn").addEventListener("mouseover", () => {
      clearInterval(this.timer);
    });
    document.getElementById("nextBtn").addEventListener("mouseover", () => {
      clearInterval(this.timer);
    });
    document.getElementById("prevBtn").addEventListener("mouseleave", () => {
      this.setTimer();
    });
    document.getElementById("nextBtn").addEventListener("mouseleave", () => {
      this.setTimer();
    });
  },
  destroyed() {
    if (screenfull.enabled) {
      screenfull.off("change", () => {});
    }
  }
};
</script>

<style lang='scss'>
$boxWidth: 290px;
#main {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow: auto;
  position: relative;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    background: #eee;
    p {
      font-size: 20px;
      margin-left: 10px;
    }
  }
  .loading {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  .content {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 1366px;
    min-height: 768px;
    .maps {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
    .left,
    .right {
      position: absolute;
      top: 10px;
      width: 350px;
      bottom: 0;
      z-index: 12;
      .filter {
        position: absolute;
        width: 100%;
        height: 70px;
        top: 30px;
        padding: 10px;
        > div {
          width: 100%;
          height: 100%;
          background: rgba($color: #fff, $alpha: 0.8);
        }
        .el-select {
          width: 120px;
          height: 30px;
          margin-top: 10px;
          line-height: 30px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
          .el-input__icon {
            line-height: 30px;
          }
        }
      }
      .wrapper {
        position: absolute;
        left: 0;
        top: 100px;
        width: 100%;
        bottom: 10px;
        .item {
          width: 100%;
          height: 16%;
          padding: 10px;

          > div {
            width: 100%;
            height: 100%;
            background: rgba($color: #fff, $alpha: 0.8);
            position: relative;
            &.sum {
              text-align: center;
              position: relative;
              p {
                // display: inline;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                span {
                  display: block;
                  font-size: 24px;
                }
              }
            }
            .titles {
              position: absolute;
              left: 10px;
              top: 10px;
            }
          }
          &.chart {
            height: 36%;
            span {
              position: absolute;
              right: 10px;
              top: 10px;
              z-index: 20;
            }
            .box {
              width: 100%;
              height: 100%;
            }
            .fullscreens {
              background: #fff;
            }
          }

          &.warning {
            height: 30%;
            overflow: hidden;
            .out-box {
              position: absolute;
              top: 30px;
              left: 20px;
              right: 20px;
              bottom: 10px;
              overflow: hidden;
              .page-box {
                transition: all 0.4s;
                height: 100%;

                .page-item {
                  float: left;
                  width: $boxWidth;
                  height: 100%;
                  position: relative;
                  overflow: hidden;
                  .inner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    //   display: flex;
                    width: 100%;

                    .icon {
                      // flex: 0 0 100px;
                      float: left;
                      width: 100px;
                      height: 100px;
                      background: #eee;
                      text-align: center;
                    }
                    .text {
                      // flex: 1;
                      float: left;
                      width: 190px;
                      p {
                        line-height: 28px;
                      }
                      .des {
                        width: 100%;
                        height: 60px;
                        line-height: 20px;
                        position: relative;
                        overflow: hidden;
                        span {
                          display: inline-block;
                          height: 30px;
                          line-height: 30px;
                          position: absolute;
                          bottom: 0;
                          right: 0;
                          padding-left: 20px;
                          background: -webkit-linear-gradient(
                            left,
                            transparent,
                            #fff 55%
                          );
                          background: -o-linear-gradient(
                            right,
                            transparent,
                            #fff 55%
                          );
                          background: -moz-linear-gradient(
                            right,
                            transparent,
                            #fff 55%
                          );
                          background: linear-gradient(
                            to right,
                            transparent,
                            #fff 55%
                          );
                        }
                      }
                    }
                    .empty {
                      width: 190px;
                      height: 100px;
                      line-height: 100px;
                      text-align: center;
                      float: left;
                    }
                  }
                }
                .detail {
                  position: absolute;
                  right: 10px;
                  bottom: 10px;
                }
              }
            }
            .pages {
              position: absolute;
              right: 10px;
              top: 10px;
              .disabled {
                cursor: not-allowed;
                color: #eee;
              }
            }
          }
          &.rank {
            height: 70%;
            .table-box {
              position: absolute;
              top: 40px;
              left: 0;
              right: 0;
              bottom: 0;
            }
          }
        }
      }
    }
    .left {
      left: 10px;
    }
    .right {
      right: 10px;
      .wrapper {
        top: 0;
      }
    }
  }
  .listDialog {
    .el-dialog__body {
      overflow: hidden;
      .title {
        font-size: 18px;
      }
      .page {
        float: right;
        margin: 20px 0;
        overflow: hidden;
      }
    }
  }
}
</style>
