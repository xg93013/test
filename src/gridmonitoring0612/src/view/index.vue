<template>
  <div id="main">
    <div class="header">
      <p>
        <button @click="clearTimer()" id="clickBtn" style="display:none;">清除定时器</button>
      </p>
    </div>
    <div class="content" v-loading="loading">
      <div class="maps" id="maps"></div>
      <div class="left">
        <div class="time">
          <div>
            <DateSelect @timeChange="timeChange" class="time-box"/>
            <div class="icon">
              <img :src="require('../images/calendar.png')" alt>
            </div>
          </div>
        </div>
        <div class="filter">
          <div class="item">
            <span @click="selectProvince()" class="province">
              成都市
              <i class="el-icon-arrow-right"></i>
            </span>
            <span class="line"></span>
            <el-select v-model="selectCity" placeholder="请选择区域" @change="changeCity">
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="line"></span>
            <el-select v-model="selectSupervision" placeholder="请选择监管所" @change="changeSupervision">
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
          <div class="item navtit">
            <div class="sum">
              <div class="top">
                <div class="tit">网格数量</div>
              </div>
              <div class="middle">
                <div class="nums">
                  <span class="big">{{statistics.gridNum}}</span>
                  <span class="unit">个</span>
                </div>
              </div>
              <div class="bottom"></div>
            </div>
          </div>
          <div class="item navtit">
            <div class="sum">
              <div class="top">
                <div class="tit">网格员数量</div>
              </div>
              <div class="middle">
                <div class="nums">
                  <span class="big">{{statistics.inspectorNum}}</span>
                  <span class="unit">人</span>
                </div>
              </div>
              <div class="bottom"></div>
            </div>
          </div>
          <div class="item navtit">
            <div class="sum">
              <div class="top">
                <div class="tit">区域巡查次数</div>
              </div>
              <div class="middle">
                <div class="nums">
                  <span class="big">{{statistics.regulatoryCount}}</span>
                  <span class="unit">次</span>
                </div>
              </div>
              <div class="bottom"></div>
            </div>
          </div>
          <div class="item navtit">
            <div class="sum">
              <div class="top">
                <div class="tit">巡查频次</div>
              </div>
              <div class="middle">
                <div class="nums">
                  <span class="big">{{statistics.regulatoryFrequency}}</span>
                  <span class="unit">次/月</span>
                </div>
              </div>
              <div class="bottom"></div>
            </div>
          </div>
          <div class="item chart">
            <div class="box" :class="{'fullscreens': fullscreen}" id="targetC">
              <div class="top">
                <div class="tit">网格员巡查频次对比</div>
              </div>
              <div class="middle">
                <bar-chart ref="barChartRefs" :gldatas="gldatas"></bar-chart>
                <span @click="openScreen()" v-show="!fullscreen"></span>
                <span @click="exitOutFullScreen()" v-show="fullscreen" class="exit-full"></span>
              </div>
              <div class="bottom"></div>
              <!-- <div class="titles">网格员巡查频次对比</div>
              <span @click="exitOutFullScreen()" v-show="fullscreen">exit</span>
              <bar-chart ref="barChartRefs" :gldatas="gldatas"></bar-chart>-->
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="wrapper">
          <div class="item warning">
            <div>
              <div class="top">
                <div class="tit">事件预警</div>
              </div>
              <div class="middle">
                <div class="pages">
                  <!-- <i class="el-icon-caret-left" id="prevBtn"></i> -->
                  <!-- <i class="el-icon-caret-right"></i> -->
                  <span
                    class="icon lefticon"
                    :class="{'disabled' : currentWarning === 0}"
                    @click="prevWarning()"
                    prevBtn
                  ></span>
                  <span
                    class="icon righticon"
                    :class="{'disabled' : currentWarning === warningList.length-1 || warningList.length === 0}"
                    id="nextBtn"
                    @click="nextWarning('click')"
                  ></span>
                </div>
                <div class="out-box" id="pageBox">
                  <div
                    class="page-box"
                    :style="{width: warningList.length*boxWidth + 'px',marginLeft: -boxWidth*currentWarning + 'px'}"
                  >
                    <div
                      class="page-item"
                      v-for="(item, index) in warningList"
                      :key="index+'warns'"
                    >
                      <div class="inner">
                        <!-- <div class="icon">img</div> -->
                        <div class="text">
                          <div class="des">
                            <label class="left-title">事件名称：</label>
                            {{item.event}}经营食品标签、说明书是否涉及疾病预防、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。、治疗功能。事件名称：经营食品标签。
                            <span
                              v-show="item.event.length > 40"
                            >...</span>
                          </div>
                          <br>
                          <p>
                            <label class="left-title">涉及区域：</label>
                            {{item.relatedDistrictCount}}个区县
                          </p>
                        </div>
                      </div>
                      <p class="detail" @click="goDetail(item)">详情》</p>
                    </div>
                    <!-- <div class="page-item">b</div>
                    <div class="page-item">c</div>-->
                    <div class="page-item" v-show="warningList.length ==0">
                      <div class="inner">
                        <!-- <div class="icon">empty</div> -->
                        <div class="empty">本月暂无预警数据</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom"></div>

              <!-- <div class="titles">事件预警</div> -->
            </div>
          </div>
          <div class="item rank">
            <div>
              <div class="titles">高频事件TOP10</div>
              <div class="table-box">
                <!-- <el-table
                  :data="topData"
                  style="width: 100%"
                  :height="tableHeight"
                  show-overflow-tooltip="true"
                  @row-click="rowClick"
                >
                  <el-table-column prop="num" label="序号" width="50"></el-table-column>
                  <el-table-column prop="name" label="事件"></el-table-column>
                  <el-table-column prop="per" label="频次" width="50"></el-table-column>
                </el-table>-->
                <div class="row header">
                  <div>
                    <span>序号</span>
                    <span>事件</span>
                    <span>频次</span>
                  </div>
                </div>
                <div class="row body" v-show="topData.length>0">
                  <div v-for="(item, index) in topData" @click="rowClick(item)" :key="index+'top'">
                    <span>{{index+1}}</span>
                    <span>{{item.event}}</span>
                    <span>{{item.eventCount}}</span>
                  </div>
                </div>
                <div class="empty" v-show="topData.length==0">暂无数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <p>事件名称：{{warningDetail.event}}</p>
        <p>所属类别：{{warningDetail.eventClassify}}</p>
        <p>涉及区域：{{warningDetail.relatedDistrict}}</p>
        <p>发生频次：{{warningDetail.eventCount}}</p>
      </div>
    </el-dialog>
    <el-dialog
      :title="listTitle"
      :visible.sync="listDialog"
      width="1300px"
      custom-class="listDialog"
      :before-close="handleListClose"
    >
      <div>
        <el-table
          :data="allEventlList"
          style="width: 100%"
          show-overflow-tooltip="true"
          height="500"
          v-loading="loadingList"
        >
          <!-- <el-table-column prop="num" label="序号" width="50"></el-table-column> -->
          <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
          <el-table-column prop="name" label="企业名称"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="district" label="区域" width="80"></el-table-column>
          <el-table-column prop="regulatoryType" label="检查类型" width="80"></el-table-column>
          <el-table-column prop="drawlink" label="环节" width="80"></el-table-column>
          <el-table-column prop="inspector" label="检查人员"></el-table-column>
          <el-table-column prop="date" label="检查日期" width="100"></el-table-column>
          <el-table-column prop="eventClassify" label="检查事项大类"></el-table-column>
          <el-table-column prop="event" label="检查事项细类" width="240"></el-table-column>
          <el-table-column prop="isFit" label="是否符合" width="80"></el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            layout="prev, pager, next"
            :total.sync="totalPage"
            :page-size="pageSize"
            :current-page="pageNo"
            @current-change="pageChange"
          ></el-pagination>
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
import http from "@/unit/http";
import apis from "@/unit/apis";
const {
  DISTRICTS,
  ORGS,
  STATISTICS,
  WARNINGS,
  TOPTEN,
  FREQUENCYCMP,
  GRID_DETAIL
} = apis;

export default {
  data() {
    return {
      loading: true,
      loadingList: false,
      fullscreen: false,
      mapObj: "",
      polygonObj: "",
      mapCenter: [104.10194, 30.65984],
      boxWidth: 290,
      time: "",
      warningList: [],
      warningDetail: {},
      currentWarning: 0,
      cityList: [
        {
          value: "天府新区",
          label: "天府新区"
        },
        {
          value: "高新区",
          label: "高新区"
        },
        {
          value: "锦江区",
          label: "锦江区"
        },
        {
          value: "青羊区",
          label: "青羊区"
        },
        {
          value: "金牛区",
          label: "金牛区"
        },
        {
          value: "武侯区",
          label: "武侯区"
        },
        {
          value: "成华区",
          label: "成华区"
        },
        {
          value: "龙泉驿区",
          label: "龙泉驿区"
        },
        {
          value: "青白江区",
          label: "青白江区"
        },
        {
          value: "新都区",
          label: "新都区"
        },
        {
          value: "温江区",
          label: "温江区"
        },
        {
          value: "双流区",
          label: "双流区"
        },
        {
          value: "郫都区",
          label: "郫都区"
        },
        {
          value: "简阳市",
          label: "简阳市"
        },
        {
          value: "都江堰市",
          label: "都江堰市"
        },
        {
          value: "彭州市",
          label: "彭州市"
        },
        {
          value: "邛崃市",
          label: "邛崃市"
        },
        {
          value: "崇州市",
          label: "崇州市"
        },
        {
          value: "金堂县",
          label: "金堂县"
        },
        {
          value: "新津县",
          label: "新津县"
        },
        {
          value: "大邑县",
          label: "大邑县"
        },
        {
          value: "蒲江县",
          label: "蒲江县"
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
      topData: [],
      allEventlList: [
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
      gldatas: [],
      statistics: {
        gridNum: "",
        inspectorNum: "",
        regulatoryCount: "",
        regulatoryFrequency: ""
      },
      selectName: "",
      selectLevel: "",
      pageNo: 1,
      pageSize: 100,
      totalPage: 1,
      currentEvent: ""
    };
  },
  components: {
    barChart,
    DateSelect
  },
  created() {
    this.getDistricts();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    async getDistricts() {
      let res = await http.get(DISTRICTS);
      if (res) {
        this.cityList = [];
        res.data.forEach(item => {
          this.cityList.push({
            value: item,
            label: item
          });
        });
      }
    },
    async getOrgs(district) {
      let res = await http.get(ORGS + "/" + district);
      if (res) {
        this.supervisionList = [];
        res.data.forEach(item => {
          this.supervisionList.push({
            value: item,
            label: item
          });
        });
      }
    },
    pageChange(page) {
      this.pageNo = page;
      this.getGridDetail(true);
    },
    async getGridDetail(flag) {
      if (!flag) {
        this.pageNo = 0;
      }
      this.loadingList = true;
      let params = {};
      let year = this.time.year;
      let month = this.time.msg.split("月")[0];
      params.level = this.selectLevel;
      if (this.selectLevel === 1) {
        params.name = "成都市";
      } else if (this.selectLevel === 2) {
        params.name = this.selectCity;
      } else {
        params.name = this.selectSupervision;
        params.district = this.selectCity;
      }
      let res = await http.get(
        GRID_DETAIL +
          "/" +
          year +
          "/" +
          month +
          "/" +
          this.listTitle +
          "/" +
          this.pageNo +
          "/" +
          this.pageSize,
        params
      );
      if (res) {
        this.allEventlList = res.data.content;
        if (!flag) {
          this.totalPage = res.data.totalElements;
        }
        this.loadingList = false;
      }
    },
    async getData(level) {
      document.getElementById("clickBtn").click();
      this.currentWarning = 0;
      this.loading = true;
      let params = {};
      let year = this.time.year;
      let month = this.time.msg.split("月")[0];
      let urls = "/" + year + "/" + month;
      params.level = level;
      if (level === 1) {
        params.name = "成都市";
      } else if (level === 2) {
        params.name = this.selectCity;
      } else {
        params.name = this.selectSupervision;
        params.district = this.selectCity;
      }
      this.selectName = params.name;
      this.selectLevel = level;

      let [statistics, topTen] = await Promise.all([
        http.get(STATISTICS + urls, params),
        http.get(TOPTEN + urls, params)
      ]);
      if (statistics) {
        if (statistics.data) {
          this.statistics = statistics.data;
        } else {
          this.statistics = {
            gridNum: "--",
            inspectorNum: "--",
            regulatoryCount: "--",
            regulatoryFrequency: "--"
          };
        }
      }

      if (topTen) {
        this.topData = topTen.data;
      }

      this.loading = false;
      this.setTimer();
    },
    async getTimeData() {
      let year = this.time.year;
      let month = this.time.msg.split("月")[0];
      let [frequencyCmp, warns] = await Promise.all([
        http.get(FREQUENCYCMP + "/" + year + "/" + month),
        http.get(WARNINGS + "/" + year + "/" + month)
      ]);
      if (frequencyCmp) {
        this.gldatas = frequencyCmp.data;
      }
      if (warns) {
        this.warningList = warns.data;
      }
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
      this.getData(1);
    },
    changeCity(item) {
      this.getOrgs(item);
      this.selectRegion(item);
      this.getData(2);
      this.selectSupervision = "";
    },
    changeSupervision(item) {
      this.getData(3);
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
    goDetail(item) {
      this.warningDetail = item;
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
      clearInterval(this.timer);
      this.listTitle = row.event;
      this.listDialog = true;
      this.getGridDetail();
    },
    timeChange(time) {
      this.time = time;
      this.supervisionList = [];
      this.$nextTick(() => {
        this.getTimeData();
        this.getData(1);
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
    height: 83px;
    line-height: 83px;
    background: url("../images/top.png") center no-repeat;
    p {
      font-size: 20px;
      margin-left: 10px;
    }
  }
  .loading {
    position: fixed;
    top: 83px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  .content {
    position: absolute;
    top: 83px;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 1366px;
    min-height: 800px;
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
      width: 299px;
      bottom: 0;
      z-index: 12;
      .time {
        width: 100%;
        // height: 42px;
        padding: 10px;
        > div {
          height: 42px;
          background: rgba(17, 39, 105, 0.8);
          border: 1px solid rgba(7, 187, 189, 0.36);
          box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.14),
            0px 0px 1px 0px rgba(0, 0, 0, 0.15);
          border-radius: 2px;
          position: relative;
          .time-box {
            display: block;
            width: 200px;
            text-align: center;
            margin: 0 auto;
          }
          .icon {
            position: absolute;
            right: 10px;
            top: 10px;
          }
        }
      }
      .filter {
        position: absolute;
        width: 100%;
        // height: 50px;
        top: 44px;
        padding: 10px;
        font-size: 14px;
        color: #03b7b8;
        overflow: hidden;
        .province {
          margin: 10px 0 0 10px;
          float: left;
        }
        .line {
          width: 1px;
          height: 14px;
          float: left;
          display: block;
          margin: 12px 10px 0 10px;
          background: rgba(32, 253, 250, 1);
          opacity: 0.1;
        }
        > div {
          width: 100%;
          height: 42px;
          background: rgba(17, 39, 105, 0.8);
          border: 1px solid rgba(7, 187, 189, 0.36);
          box-shadow: 0px 0px 13px 0px rgba(0, 0, 0, 0.14),
            0px 0px 1px 0px rgba(0, 0, 0, 0.15);
          border-radius: 2px;
        }
        .el-select {
          width: 80px;
          height: 30px;
          margin-top: 4px;
          line-height: 30px;
          float: left;
          // border-left: 1px solid #20fdfa;
          input::-webkit-input-placeholder {
            color: #03b7b8;
          }
          .el-input__inner {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            background-color: transparent;
            border-color: transparent;
            color: #03b7b8;
            padding: 0 20px 0 0;
          }
          .el-input__icon {
            line-height: 30px;
            width: 15px;
            transform: rotate(90deg);
            color: #03b7b8;
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
          padding: 4px 10px;

          > div {
            width: 100%;
            height: 100%;
            // background: rgba($color: #fff, $alpha: 0.8);
            // background: url("../images/grid.png");
            background-size: 100% 100%;
            position: relative;
            .top {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 52px;
              line-height: 52px;
              color: #fff;
              background: url(../images/toptitle.png) center no-repeat;
              background-size: 100%;
              .tit {
                width: 100%;
                height: 100%;
                color: #13fcff;
                font-size: 16px;
                text-align: center;
                // background: url(../images/tit.png) center no-repeat;
              }
            }
            .middle {
              position: absolute;
              top: 52px;
              left: 0;
              right: 0;
              bottom: 20px;
              background: url(../images/middle.png) center repeat-y;
              background-size: 100%;
              .big {
                font-size: 40px;
                font-style: italic;
                font-family: LcdD;
                // transform: skewX(-60deg);
                font-weight: bold;
                color: #20fdfa;
              }
              .unit {
                font-style: italic;
                color: #20fdfa;
              }
            }
            .bottom {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 20px;
              background: url(../images/bot.png) center no-repeat;
              background-size: 100%;
            }

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

            .tit {
              text-align: center;
              background: url(../images/tit_05.png) center no-repeat;
            }
            span {
              display: inline-block;
              width: 22px;
              height: 22px;
              position: absolute;
              right: 10px;
              top: 10px;
              z-index: 20;
              cursor: pointer;
              background: url(../images/fullscreen.png) center no-repeat;
              &.exit-full {
                width: 48px;
                height: 48px;
                background: url(../images/exit.png) center no-repeat;
              }
            }
            .box {
              width: 100%;
              height: 100%;
            }
            .fullscreens {
              .top,
              .middle,
              .bottom {
                background: #151320;
              }
            }
          }

          &.warning {
            height: 30%;
            overflow: hidden;
            > div {
              .top {
                .tit {
                  text-align: center;
                  color: #fede2c;
                  background: url(../images/tit_06.png) center no-repeat;
                }
              }
            }
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
                      width: 100%;
                      p {
                        line-height: 32px;
                        color: #fede2c;
                      }
                      .des {
                        width: 100%;
                        height: 60px;
                        line-height: 20px;
                        position: relative;
                        overflow: hidden;
                        color: #fede2c;
                        .left-title {
                          font-weight: bold;
                        }
                        span {
                          display: inline-block;
                          height: 30px;
                          line-height: 30px;
                          position: absolute;
                          bottom: 0;
                          right: 0;
                          // color: #fede2c;
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
              bottom: 0;
              left: 50%;
              overflow: hidden;
              transform: translateX(-50%);
              .disabled {
                cursor: not-allowed;
                color: #eee;
              }
              // .el-icon-caret-left {
              //   background: url(../images/left.png) center no-repeat;
              // }
              .icon {
                display: block;
                float: left;
                width: 22px;
                height: 22px;
                margin: 0 10px;
                cursor: pointer;
                background: url(../images/left.png) center no-repeat;
                &.righticon {
                  background: url(../images/right.png) center no-repeat;
                }
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
              .row {
                width: 100%;

                > div {
                  overflow: hidden;
                  width: 100%;
                  span {
                    display: inline-block;
                    height: auto;
                    float: left;
                    text-align: center;
                    &:nth-child(1) {
                      width: 20%;
                    }
                    &:nth-child(2) {
                      width: 60%;
                      text-align: left;
                    }
                    &:nth-child(3) {
                      width: 20%;
                    }
                  }
                }
              }
              .header {
                height: 50px;
                background: #eee;
              }
              .body {
                position: absolute;
                top: 50px;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: auto;
                > div {
                  margin: 10px 0;
                }
              }
              .empty {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #ccc;
                font-size: 12px;
              }
            }
          }
        }
        .navtit {
          &:nth-child(1) {
            .tit {
              background: url(../images/tit_01.png) center no-repeat;
            }
          }
          &:nth-child(2) {
            .tit {
              background: url(../images/tit_02.png) center no-repeat;
            }
          }
          &:nth-child(3) {
            .tit {
              background: url(../images/tit_03.png) center no-repeat;
            }
          }
          &:nth-child(4) {
            .tit {
              background: url(../images/tit_03.png) center no-repeat;
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
    .el-dialog__header {
      padding: 20px 50px 20px 20px;
    }
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
.el-select-dropdown {
  background: #0f2155;
  border: none;
}
.el-select-dropdown__item {
  color: #03b7b8;
  font-size: 14px;
}
.el-select-dropdown__item.selected {
  color: #03b7b8;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #153c6f;
}
.el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #0f2155;
}
.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #0f2155;
}
</style>
