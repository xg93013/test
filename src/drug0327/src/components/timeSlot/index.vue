<template>
  <el-popover
    popper-class="szl-time-pop"
    @after-leave="cancel"
    v-model="show"
    width="340"
    trigger="click"
  >
    <div class="time-slot" v-if="timeDatas.length">
      <el-row>
        <el-col
          class="time-range"
          @click.native="timeRange('monthly')"
          :class="{active: active=='monthly'}"
          align="center"
          :span="quarterShow==true?8:24"
        >月度</el-col>
        <el-col
          class="time-range"
          @click.native="timeRange('quarter')"
          :class="{active: active=='quarter'}"
          align="center"
          :span="8"
          v-show="quarterShow"
        >季度</el-col>
        <!--<el-col class="time-range" @click.native="timeRange('halfYear')" :class="{active: active=='halfYear'}" align="center" :span="6">半年</el-col>-->
        <el-col
          class="time-range"
          @click.native="timeRange('year')"
          :class="{active: active=='year'}"
          align="center"
          :span="quarterShow==true?8:12"
          v-show="quarterShow"
        >年度</el-col>
      </el-row>
      <el-row style="margin-top:10px;background: #2E4354;">
        <el-col
          align="center"
          @click.native="prev"
          class="time-year"
          :class="{'time-year-disable': timeNum==(timeDatas.length-1)}"
          :span="6"
        >上一年</el-col>
        <el-col
          class="time-year"
          style="font-size:16px;color:#C5E6FE"
          :span="12"
          align="center"
        >{{timeDatas[timeNum].years}}</el-col>
        <el-col
          align="center"
          @click.native="next"
          class="time-year"
          :class="{'time-year-disable': timeNum==0}"
          :span="6"
        >下一年</el-col>
      </el-row>
      <el-row style="margin-top:10px">
        <el-col v-show="active=='monthly'">
          <div
            class="mons"
            :class="{active:active=='monthly'&&num==index,'time-disable':!timeDatas[timeNum].data.month[index].mark}"
            @click="timeClick(item,index)"
            v-for="(item,index) in monthly"
          >{{item}}</div>
        </el-col>
        <el-col v-show="active=='quarter'">
          <div
            class="quarters"
            :class="{active:active=='quarter'&&num==index,'time-disable':!timeDatas[timeNum].data.season[index].mark}"
            @click="timeClick(item,index)"
            v-for="(item,index) in quarter"
            v-if="quarterShow"
          >{{item}}</div>
        </el-col>
        <el-col v-show="active=='year'">
          <div
            class="year"
            :class="{active:active=='year'&&num==index}"
            @click="timeClick(item,index)"
            v-for="(item,index) in year"
            v-if="quarterShow"
          >{{item}}</div>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px">
        <el-col
          class="time-confirm"
          style="font-size:16px"
          :span="12"
        >{{chooseMsg.year}}年{{chooseMsg.msg}}</el-col>
        <el-col class="time-confirm" align="right" :span="12">
          <div @click="cancel">取消</div>
          <div @click="isOk">确定</div>
        </el-col>
      </el-row>
    </div>
    <div slot="reference" size="small" class="szl-time">
      {{activeMsg.year}}年{{activeMsg.msg}}
      <img
        :src="require('./images/arrow.png')"
        v-show="quarterShow"
        alt
      >
    </div>
  </el-popover>
</template>

<script>
import http from "@/unit/http";
import apis from "@/unit/apis";
const { FOOD_DATE } = apis;
export default {
  data() {
    return {
      active: "monthly",
      activea: "monthly",
      num: -1,
      numa: -1,
      show: false,
      monthly: [],
      quarter: ["1季度", "2季度", "3季度", "4季度"],
      year: ["全年"],
      chooseMsg: {
        year: "",
        msg: ""
      },
      activeMsg: {
        year: "",
        msg: ""
      },
      isPrev: true,
      isNext: false,
      timeDatas: [],
      timeNum: 0,
      timeNuma: 0,
      showQuarter: true
    };
  },
  props: {
    dateUrl: {
      default: "",
      type: String
    },
    defaultTime: {
      type: Boolean,
      default: false
    },
    quarterShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    quarterShow(a) {
      this.showQuarter = a;
    },
    yearShow(a) {
      this.yearShow = a;
    }
  },
  methods: {
    timeClick(item, index) {
      if (
        this.active == "monthly" &&
        !this.timeDatas[this.timeNum].data.month[index].mark
      ) {
        return false;
      }
      if (
        this.active == "quarter" &&
        !this.timeDatas[this.timeNum].data.season[index].mark
      ) {
        return false;
      }
      if (item != "全年") {
        this.chooseMsg.msg = item;
      } else {
        this.chooseMsg.msg = "";
      }
      this.num = index;
    },
    timeRange(e) {
      if (e == this.active) {
        return false;
      }
      (this.chooseMsg.msg = ""), (this.num = -1);
      this.active = e;
    },
    async init() {
      let res = "";
      if (this.dateUrl == "") {
        res = await http.get(FOOD_DATE);
      } else {
        res = await http.get(this.dateUrl);
      }
      if (res) {
        this.timeDatas = [...res.data];
        this.chooseMsg.year = res.data[0].years;
        for (let i = 11; i > -1; i--) {
          if (res.data[0].data.month[i].mark) {
            this.chooseMsg.msg = res.data[0].data.month[i].date;
            this.num = i;
            this.numa = i;
            break;
          }
        }
        this.activea = "monthly";
        this.activeMsg = {
          ...this.chooseMsg
        };
        if (this.defaultTime) {
          let year = this.chooseMsg.year;
          let month = parseInt(this.chooseMsg.msg);
          year = this.chooseMsg.year;
          this.activeMsg.year = month - 6 < 0 ? year - 1 : year;
          this.activeMsg.msg =
            month > 6
              ? "0" + (month - 6)
              : 12 + (month - 6) > 9 + "月"
              ? 12 + (month - 6)
              : "0" + (12 + month - 6) + "月";
          this.num = this.num - 6 < 0 ? 11 + this.num - 6 : this.num - 6;
          // this.chooseMsg.msg = { ...this.activeMsg };
        }
        this.$emit("timeChange", this.activeMsg, this.defaultTime);
      }
      for (let i = 1; i < 13; i++) {
        let mon = i < 10 ? "0" + i + "月" : i + "月";
        this.monthly.push(mon);
      }
    },
    prev() {
      if (this.timeNum < this.timeDatas.length - 1) {
        this.timeNum++;
        this.num = -1;
        this.chooseMsg = {
          year: this.timeDatas[this.timeNum].years,
          msg: ""
        };
      }
    },
    next() {
      if (this.timeNum > 0) {
        this.timeNum--;
        this.num = -1;
        this.chooseMsg = {
          year: this.timeDatas[this.timeNum].years,
          msg: ""
        };
      }
    },
    cancel() {
      this.show = false;
      this.num = this.numa;
      this.active = this.activea;
      this.timeNum = this.timeNuma;
    },
    isOk() {
      this.show = false;
      this.$nextTick(() => {
        if (
          this.activeMsg.year != this.chooseMsg.year ||
          this.activeMsg.msg != this.chooseMsg.msg
        ) {
          this.activeMsg = {
            ...this.chooseMsg
          };
          this.$emit("timeChange", this.activeMsg, false);
          this.timeNuma = this.timeNum;
          if (this.activeMsg.msg) {
            this.numa = this.num;
            this.activea = this.active;
          } else {
            this.numa = 0;
            this.activea = "year";
          }
        }
      });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss">
.szl-time-pop.el-popper {
  background: #253745;
  border: 1px solid #253745;
  padding: 20px;
  * {
    color: #87b3d1;
  }
}

.szl-time {
  display: inline-block;
  background: #0099ff;
  border: 1px solid #0099ff;
  color: #c5e6fe;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  border-radius: 6px;
  img {
    position: relative;
    top: -1px;
    vertical-align: middle;
    opacity: 0.8;
  }
}

.szl-time-pop.el-popper .popper__arrow {
  border-bottom-color: #253745 !important;
  &:after {
    border-bottom-color: #253745 !important;
  }
}

.time-slot {
  .time-range {
    height: 30px;
    line-height: 30px;
    border-right: 2px solid #253745;
    background: #2e4354;
    cursor: pointer;
  }
  .time-year {
    height: 30px;
    line-height: 30px;
    &:first-child,
    &:last-child {
      cursor: pointer;
    }
    img {
      cursor: pointer;
    }
  }
  .time-year-disable {
    cursor: not-allowed !important;
    color: #889ba9;
    opacity: 0.5;
  }
  .mons,
  .quarters,
  .halfYear,
  .year {
    float: left;
    text-align: center;
    background: #2e4354;
    border-right: 2px solid #253745;
    border-bottom: 2px solid #253745;
    cursor: pointer;
  }
  .mons {
    width: 25%;
    height: 30px;
    line-height: 30px;
  }
  .quarters {
    width: 50%;
    height: 45px;
    line-height: 45px;
  }
  .halfYear {
    width: 50%;
    height: 90px;
    line-height: 90px;
  }
  .year {
    width: 100%;
    height: 90px;
    line-height: 90px;
  }
  .time-confirm {
    height: 30px;
    line-height: 30px;
    > div {
      display: inline-block;
      width: 62px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background: #2e4354;
      cursor: pointer;
      &:last-child {
        background: #0fa063;
        color: #fff;
      }
    }
  }
  .active {
    background: #0099ff;
    color: #c5e6fe;
  }
  .time-disable {
    background: #7e8e98;
    color: #87b3d1;
    &:hover {
      cursor: not-allowed !important;
    }
  }
}
</style>