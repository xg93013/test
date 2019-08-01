<template>
  <el-popover
    popper-class="szl-time-pop"
    @after-leave="cancel"
    v-model="show"
    width="340"
    trigger="click"
  >
    <div class="time-slot">
      <el-row>
        <el-col
          class="time-range"
          @click.native="timeRange('monthly')"
          :class="{active: active=='monthly'}"
          align="center"
          :span="8"
        >月度</el-col>
        <el-col
          class="time-range"
          @click.native="timeRange('quarter')"
          :class="{active: active=='quarter'}"
          align="center"
          :span="8"
        >季度</el-col>
        <!--<el-col class="time-range" @click.native="timeRange('halfYear')" :class="{active: active=='halfYear'}" align="center" :span="6">半年</el-col>-->
        <el-col
          class="time-range"
          @click.native="timeRange('year')"
          :class="{active: active=='year'}"
          align="center"
          :span="8"
        >年度</el-col>
      </el-row>
      <el-row style="margin-top:10px;background: #2E4354;">
        <el-col
          align="center"
          @click.native="prev"
          class="time-year"
          :class="{'time-year-disable': !isPrev}"
          :span="6"
        >上一年</el-col>
        <el-col
          class="time-year"
          style="font-size:16px;color:#C5E6FE"
          :span="12"
          align="center"
        >{{chooseMsg.year}}</el-col>
        <el-col
          align="center"
          @click.native="next"
          class="time-year"
          :class="{'time-year-disable': !isNext}"
          :span="6"
        >下一年</el-col>
      </el-row>
      <el-row style="margin-top:10px">
        <el-col v-show="active=='monthly'">
          <div
            class="mons"
            :class="{active:active=='monthly'&&num==index,'time-disable':chooseMsg.year==currentYear&&index>currentMonth}"
            @click="timeClick(item,index)"
            v-for="(item,index) in monthly"
            :key="index"
          >{{item}}</div>
        </el-col>
        <el-col v-show="active=='quarter'">
          <div
            class="quarters"
            :class="{active:active=='quarter'&&num==index,'time-disable':chooseMsg.year==currentYear&&index>currentQuarter}"
            @click="timeClick(item,index)"
            v-for="(item,index) in quarter"
            :key="index"
          >{{item}}</div>
        </el-col>
        <el-col v-show="active=='halfYear'">
          <div
            class="halfYear"
            :class="{active:active=='halfYear'&&num==index}"
            @click="timeClick(item,index)"
            v-for="(item,index) in halfYear"
            :key="index"
          >{{item}}</div>
        </el-col>
        <el-col v-show="active=='year'">
          <div
            class="year"
            :class="{active:active=='year'&&num==index}"
            @click="timeClick(item,index)"
            v-for="(item,index) in year"
            :key="index"
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
      <img :src="require('./images/arrow.png')" alt>
    </div>
  </el-popover>
</template>

<script>
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
      halfYear: ["上半年", "下半年"],
      year: ["全年"],
      chooseMsg: {
        year: 2017,
        msg: ""
      },
      activeMsg: {
        year: "",
        msg: ""
      },
      isPrev: true,
      isNext: false,
      currentYear: "",
      currentMonth: "",
      currentQuarter: ""
    };
  },
  methods: {
    timeClick(item, index) {
      if (
        this.active == "monthly" &&
        this.currentYear == this.chooseMsg.year &&
        index > this.currentMonth
      ) {
        return false;
      }
      if (
        this.active == "quarter" &&
        this.currentYear == this.chooseMsg.year &&
        index > this.currentQuarter
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
    init() {
      let time = new Date();
      this.currentYear = time.getFullYear();
      this.currentMonth = time.getMonth();
      if (time.getMonth() >= 0 && time.getMonth() < 3) {
        this.currentQuarter = 0;
      } else if (time.getMonth() >= 3 && time.getMonth() < 6) {
        this.currentQuarter = 1;
      } else if (time.getMonth() >= 6 && time.getMonth() < 9) {
        this.currentQuarter = 2;
      } else if (time.getMonth() >= 9 && time.getMonth() < 11) {
        this.currentQuarter = 3;
      }
      this.chooseMsg.year = time.getFullYear();
      this.activeMsg = {
        year: time.getFullYear(),
        msg:
          time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1) + "月"
            : time.getMonth() + 1 + "月"
      };
      for (let i = 1; i < 13; i++) {
        let mon = i < 10 ? "0" + i + "月" : i + "月";
        this.monthly.push(mon);
      }
    },
    prev() {
      if (this.chooseMsg.year > 2016) {
        this.chooseMsg.year--;
        this.num = -1;
        this.chooseMsg.msg = "";
        if (!this.isNext) {
          this.isNext = true;
        }
        if (this.chooseMsg.year == 2016) {
          this.isPrev = false;
        }
      }
    },
    next() {
      if (this.chooseMsg.year < this.currentYear) {
        this.chooseMsg.year++;
        this.num = -1;
        this.chooseMsg.msg = "";
        if (!this.isPrev) {
          this.isPrev = true;
        }
        if (this.chooseMsg.year == this.currentYear) {
          this.isNext = false;
        }
      }
    },
    cancel() {
      this.show = false;
      this.num = this.numa;
      this.active = this.activea;
      this.chooseMsg = { ...this.activeMsg };
      this.btnFun(this.chooseMsg.year);
    },
    cancela() {
      this.show = false;
      if (this.chooseMsg.msg) {
        this.numa = this.num;
        this.activea = this.active;
      } else {
        this.numa = 0;
        this.activea = "year";
      }
      this.activeMsg = {
        ...this.chooseMsg
      };
      this.btnFun(this.chooseMsg.year);
    },
    isOk() {
      if (
        this.activeMsg.year != this.chooseMsg.year ||
        this.activeMsg.msg != this.chooseMsg.msg
      ) {
        this.$emit("timeChange", this.chooseMsg);
      }
      if (!this.isPro) {
        this.cancela();
      }
    },
    btnFun(year) {
      let time = new Date();
      let y = time.getFullYear();
      if (year == y) {
        this.isNext = false;
      } else {
        this.isNext = true;
      }

      if (year > 2016) {
        this.isPrev = true;
      } else {
        this.isPrev = false;
      }
    }
  },
  created() {
    this.init();
  },
  props: ["currentTime", "isPro"],
  watch: {
    currentTime(a, b) {
      this.activeMsg = { ...a };
      this.chooseMsg = { ...a };
      this.num = a.msg ? parseInt(a.msg) - 1 : 0;
      this.numa = a.msg ? parseInt(a.msg) - 1 : 0;
      this.btnFun(a.year);
    }
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