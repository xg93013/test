<template>
  <div id="drugHistory">
    <div class="search">
      <el-input
        placeholder="请输入药品追溯码或产品批号"
        style="width:300px;height:37px;"
        v-model="keyWord"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          style="background:#0099FF;height:36px;border-radius:0 4px 4px 0;color:#fff;border-color:transparent;"
          @click="goResult"
        ></el-button>
      </el-input>
    </div>
    <div class="top">
      <div class="left">药品追溯分析</div>
      <div class="right">
        <el-dropdown trigger="click" @command="selectDown" placement="bottom-start">
          <div class="down-btn">
            {{ drugType }}
            <span v-show="this.drugType==''">请选择药品类型</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="item"
              v-for="(item, index) in drugTypeList"
              :key="index"
            >{{item}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="time-outbox">
          <TimeBox
            :dateUrl="dateUrl"
            @timeChange="timeChangea"
            :defaultTime="true"
            :quarterShow="quarterShow"
          />
          <span>~</span>
          <TimeBox :dateUrl="dateUrl" @timeChange="timeChangeb" :quarterShow="quarterShow"/>
          <i class="el-icon-date" style="margin-right:10px;"></i>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="box left">
        <div class="box-in">
          <drugSafe :saleinfo="saleinfo"/>
        </div>
      </div>
      <div class="right">
        <div class="box right-top">
          <div class="box-in">
            <districtArea :circulationlink="circulationlink"/>
          </div>
        </div>
        <div class="box right-bot">
          <div class="box-in">
            <saleTrend :saletrend="saletrend"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import drugSafe from "./children/drugSafe";
import districtArea from "./children/districtArea";
import saleTrend from "./children/saleTrend";
import TimeBox from "@/components/timeSlot/index";
import apis from "@/unit/apis.js";
import http from "@/unit/http.js";
const {
  DRUG_SALEINFO,
  DRUG_CIRCULATIONLINK,
  DRUG_SALESTREND,
  DRUG_TYPELIST,
  DRUG_DATELIST,
  DRUG_BASEINFO
} = apis;
export default {
  components: {
    drugSafe,
    districtArea,
    saleTrend,
    TimeBox
  },
  data() {
    return {
      keyWord: "",
      drugTypeList: [
        // "全部类别",
        // "化学药品",
        // "中成药",
      ],
      drugType: "",
      dateUrl: DRUG_DATELIST,
      timea: { year: "", msg: "" },
      timeb: { year: "", msg: "" },
      quarterShow: false,
      saleinfo: [],
      circulationlink: [],
      saletrend: [],
      baseinfo: {}
    };
  },
  created() {
    this.getdrugTypeList();
  },
  mounted() {},
  methods: {
    goResult() {
      if (this.keyWord != "") {
        this.getBaseInfos();
      } else {
        this.$message({
          message: "请输入药品追溯码或产品批号",
          type: "warning"
        });
      }
    },
    async getBaseInfos() {
      let res = await http.get(DRUG_BASEINFO + "?batchNo=" + this.keyWord);
      if (res) {
        if (res.data != null) {
          let params = { batchNo: this.keyWord, baseinfo: res.data };
          window.sessionStorage.setItem("baseinfo", JSON.stringify(params));
          this.$router.push({
            name: "searchResult"
            // params: { keyWord: this.keyWord, baseinfo: res.data }
          });
        } else {
          this.$message({
            message: "暂无相关信息",
            type: "warning"
          });
        }
      }
    },
    async getDatas(type) {
      this.$emit("closeLoading", true);
      let montha =
        this.timea.msg.indexOf("月") !== -1
          ? this.timea.msg.split("月")[0]
          : this.timea.msg;
      let monthb =
        this.timeb.msg.indexOf("月") !== -1
          ? this.timeb.msg.split("月")[0]
          : this.timeb.msg;
      let timea = this.timea.year + "-" + montha;
      let timeb = this.timeb.year + "-" + monthb;

      let typeUrl = "";
      if (type) {
        typeUrl = "&type=" + type;
      }
      let [saleinfo, circulationlink, saletrend] = await Promise.all([
        http.get(DRUG_SALEINFO + "?start=" + timea + "&end=" + timeb + typeUrl),
        http.get(
          DRUG_CIRCULATIONLINK + "?start=" + timea + "&end=" + timeb + typeUrl
        ),
        http.get(
          DRUG_SALESTREND + "?start=" + timea + "&end=" + timeb + typeUrl
        )
      ]);
      if (saleinfo) {
        this.saleinfo = [...saleinfo.data];
      }
      if (circulationlink) {
        this.circulationlink = [...circulationlink.data];
      }
      if (saletrend) {
        this.saletrend = [...saletrend.data];
      }
      this.$emit("closeLoading", false);
    },
    async getdrugTypeList() {
      let res = await http.get(DRUG_TYPELIST);
      if (res) {
        this.drugTypeList = [...res.data];
      }
    },
    selectDown(item) {
      this.drugType = item;
      this.getDatas(item);
    },
    timeChangea(time, defaultTime) {
      this.timea = time;
      this.getRangeData(defaultTime);
    },
    timeChangeb(time, defaultTime) {
      this.timeb = time;
      this.getRangeData(defaultTime);
    },
    getRangeData(defaultTime) {
      setTimeout(() => {
        let [flag, yeara, yearb, montha, monthb] = [
          false,
          this.timea.year,
          this.timeb.year,
          this.timea.msg.split("月")[0],
          this.timeb.msg.split("月")[0]
        ];
        if (yearb < yeara) {
          flag = false;
        } else {
          if (yeara === yearb) {
            if (montha > monthb) {
              flag = false;
            } else {
              flag = true;
            }
          } else {
            flag = true;
          }
        }
        if (!defaultTime) {
          if (flag) {
            this.getDatas(this.drugType);
          } else {
            this.$message({
              message: "结束日期不能小于开始日期",
              type: "warning"
            });
          }
        }
      }, 20);
    }
  }
};
</script>
<style lang="scss">
#drugHistory {
  position: relative;
  width: 100%;
  height: 100%;
  color: #a0d2ff;
  .search {
    position: absolute;
    top: 0;
    left: 5px;
    right: 5px;
    // width: 100%;
    height: 50px;
  }
  .top {
    position: absolute;
    left: 5px;
    right: 5px;
    top: 47px;
    height: 50px;
    line-height: 50px;
    background: rgba($color: #19a0ff, $alpha: 0.1);
    overflow: hidden;
    .left {
      float: left;
      font-size: 18px;
      overflow: hidden;
      margin-left: 10px;
    }
    .right {
      float: right;
      margin-right: 5px;
      overflow: hidden;
      .el-dropdown {
        float: left;
        margin: 10px 5px 0 0;
      }
      .down-btn {
        display: block;
        padding: 0 10px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #0099ff;
        border-radius: 6px;
        color: #c5e6fe;
        font-size: 14px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        transition: all 0.3s;
        cursor: pointer;
      }
      .time-outbox {
        float: left;
        height: 32px;
        margin: 10px 10px 0 0;
        line-height: 32px;
        border-radius: 6px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        background: #0099ff;
        overflow: hidden;
      }
    }
  }
  .content {
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    .box {
      height: 100%;
      position: relative;
      .box-in {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        background: rgba($color: #19a0ff, $alpha: 0.1);
        .title {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          line-height: 40px;
          // width: 100%;
          padding-left: 15px;
          &::before {
            content: "";
            position: absolute;
            top: 10px;
            left: 0;
            bottom: 0;
            width: 4px;
            height: 20px;
            background: #67b7ff;
          }
        }
        .chart-box {
          position: absolute;
          top: 40px;
          left: 0;
          right: 0;
          width: 100%;
          height: calc(100%-40px);
          bottom: 0;
          .left,
          .right {
            width: 50%;
            height: 100%;
          }
          .chart {
            width: 100%;
            height: 100%;
          }
          .empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
    .left {
      width: 60%;
      float: left;
    }
    .right {
      width: 40%;
      height: 100%;
      float: left;
      .right-top {
        width: 100%;
        height: 50%;
      }
      .right-bot {
        width: 100%;
        height: 50%;
      }
    }
  }
}
</style>
<style lang="scss">
.el-input__inner {
  background: #3f7ecd;
  border: none;
  height: 36px;
  line-height: 36px;
  color: #fff;
}
.el-range-input {
  // background: rgba($color: #19a0ff, $alpha: 0.1);
  background: #0099ff;
  color: #fff;
  font-size: 12px;
}
.el-input-group__append,
.el-input-group__prepend {
  background-color: transparent;
  border-color: transparent;
  color: #fff;
  margin-left: 4px;
}
.el-date-editor .el-range-input {
  color: #fff;
  height: 32px;
  font-size: 12px;
  line-height: 32px;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
}
.el-date-editor .el-range-separator {
  width: 10px;
}
.date-range.el-popper .popper__arrow {
  border-bottom-color: #fff !important;
}

.date-range.el-popper .popper__arrow::after {
  border-bottom-color: #fff !important;
}
</style>


