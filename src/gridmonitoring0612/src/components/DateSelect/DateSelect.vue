<template>
  <el-popover
    popper-class="szl-time-pop"
    @after-leave="cancel"
    v-model="show"
    width="340"
    trigger="click"
  >
    <div class="date-container">
      <div class="date-box">
        <!-- <div class="date-type">
          <span class="item" @click="changeDateType(1)" :class="{'active' : dateType === 1}">月度</span>
          <span class="item" @click="changeDateType(4)" :class="{'active' : dateType === 4}">年</span>
        </div>-->
        <div class="date-year">
          <span
            class="item prev-year"
            @click="changeYear('prev')"
            :class="{'disabled' : currentIndex >= (originDate.length-1)}"
          >上一年</span>
          <span class="item current-year">{{ currentYear }}</span>
          <span
            class="item next-year"
            @click="changeYear('next')"
            :class="{'disabled' : currentIndex <= 0}"
          >下一年</span>
        </div>
        <div class="date-item-box" v-show="currentDate.data">
          <!-- 日期类型 -->
          <div class="type-month" v-show="dateType === 1">
            <span
              class="item"
              v-for="(item, index) in currentDate.data.month"
              :key="index"
              :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}"
              @click="changeItemStatus(item,index)"
            >{{ item.date }}</span>
          </div>
          <!-- <div class="type-allyear" v-show="dateType === 4">
            <span
              class="item"
              v-for="(item, index) in currentDate.data.allYear"
              :key="index"
              :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}"
              @click="changeItemStatus(item,index)"
            >{{ item.date }}</span>
          </div>-->
        </div>
        <div class="date-footer">
          <div class="left">{{ currentTime }}</div>
          <div class="right">
            <span class="btn cancel" @click="cancel()">取消</span>
            <span class="btn ok" @click="confirmDate()">确定</span>
          </div>
        </div>
      </div>
    </div>
    <div slot="reference" size="small" class="szl-time">
      {{ currentTime }}
      <!-- <img :src="require('../../images/calendar.png')" alt> -->
    </div>
  </el-popover>
</template>
<script>
import http from "@/unit/http";
import apis from "@/unit/apis";
const { LISTDATE } = apis;
import originD from "./originDate.js";
export default {
  data() {
    return {
      show: false,
      currentTime: "", // 当前时间
      currentIndex: 0,
      dateType: 1,
      originDate: "",
      selectItemIndex: -1
    };
  },
  watch: {},
  created() {
    this.originDate = originD.data;
    this.init();
  },
  computed: {
    currentYear() {
      return this.originDate[this.currentIndex].years;
    },
    currentDate() {
      return this.originDate[this.currentIndex];
    }
  },
  methods: {
    async init() {
      let urls = "";
      let res = "";
      this.dateType = 1;
      res = await http.get(LISTDATE);
      if (res) {
        if (res.data && res.data.length > 0) {
          this.currentIndex = 0;
          this.originDate = res.data.reverse();
          let month = "";
          for (let j = 0; j < this.originDate.length; j++) {
            for (let i = 11; i > -1; i--) {
              if (this.originDate[j].data.month[i].mark) {
                month = this.originDate[j].data.month[i].date;
                this.currentTime = this.currentYear + "年" + month;
                this.selectItemIndex = i;
                let emitTime = {
                  year: this.currentYear,
                  msg: month
                };
                this.$emit("timeChange", emitTime);
                return false;
              }
            }
          }
        }
      } else {
        this.$emit("timeChange", "");
      }
    },
    changeYear(flag) {
      let index = this.currentIndex;
      if (flag === "prev") {
        if (index < this.originDate.length - 1) {
          this.selectItemIndex = -1;
          index++;
        }
      } else {
        if (index > 0) {
          this.selectItemIndex = -1;
          index--;
        }
      }
      this.currentIndex = index;
    },
    changeDateType(type) {
      this.dateType = type;
      this.selectItemIndex = -1;
    },
    changeItemStatus(item, index) {
      if (item.mark) {
        this.selectItemIndex = index;
      }
    },
    cancel() {
      this.show = false;
    },
    switchTypeName(i) {
      let name = "";
      switch (i) {
        case 1:
          name = "month";
          break;
        case 2:
          name = "season";
          break;
        case 3:
          name = "halfYear";
          break;
        case 4:
          name = "allYear";
          break;
      }
      return name;
    },
    showDateSelect() {
      this.showSelect = !this.showSelect;
    },
    confirmDate() {
      this.show = false;
      if (this.selectItemIndex == -1) {
        this.dateType = 4;
        this.selectItemIndex = 0;
      }
      let typeName = this.switchTypeName(this.dateType);
      let dates = this.currentDate.data[typeName][this.selectItemIndex].date;
      this.currentTime = this.currentYear + "年" + dates;
      let emitTime = {
        year: this.currentYear,
        msg: dates == "全年" ? "" : dates
      };
      this.$emit("timeChange", emitTime);
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
$dateThemeBack: rgba(0, 150, 229, 0.15);

$dateItemBack: rgba(0, 150, 229, 0.5);

$dateActiveBack: #1ad6d8;

$disableBack: #4b697c;

$topBack: #29445a;

$btnOk: #0fa063;

@mixin spanItem($w, $h, $color) {
  display: inline-block;
  height: $h;
  width: $w;
  font-size: 12px;
  color: #ccc;
  line-height: $h;
  box-sizing: border-box;
  text-align: center;
  /*padding-right: 2px;*/
  background: $color;
  margin-top: 2px;
  background-clip: content-box;
  cursor: pointer;
  &.disabled {
    background: $disableBack;
    background-clip: content-box;
    cursor: default;
    color: #ccc;
    &:hover {
      cursor: not-allowed !important;
    }
  }
  &.active {
    background: $dateActiveBack;
    color: #fff;
    background-clip: content-box;
  }
}
.szl-time-pop.el-popper {
  width: 450px;
  background: #0a153a;
  border: 1px solid rgba(0, 120, 253, 0.2);
  margin-left: 10px;
  border-radius: 6px;
  padding: 15px;
  * {
    color: #87b3d1;
  }
}

.szl-time {
  width: 100%;
  display: inline-block;
  // background: #0099ff;
  // border: 1px solid #0099ff;
  color: #1ad6d8;
  padding: 0 16px;
  height: 42px;
  line-height: 42px;
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
  border-bottom-color: rgba(0, 120, 253, 0.5) !important;
  &:after {
    border-bottom-color: #0a153a !important;
  }
}
.date-container {
  /*    position: relative;*/
  z-index: 999;
  .date-select {
    width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .date-box {
    background: $dateThemeBack;
    /*width: 400px;*/
    height: auto;
    padding: 10px;
    /*position: absolute;*/
    left: 0;
    top: 50px;
    right: 0;
    border-radius: 5px;
    overflow: hidden;
    .date-type {
      width: 100%;
      overflow: hidden;
      background: $topBack;
      margin-right: -2px;
      .item {
        @include spanItem(50%, 32px, $topBack);
        margin-top: 0;
        float: left;
      }
    }
    .date-year {
      width: 100%;
      overflow: hidden;
      margin-top: 8px;
      background: $topBack;
      /*margin-right: -2px;*/
      // margin-top: 6px;
      .item {
        @include spanItem(25%, 32px, $topBack);
        margin-top: 0;
        float: left;
      }
      .current-year {
        @include spanItem(50%, 32px, $topBack);
        margin-top: 0;
        font-size: 14px;
        color: #fff;
        float: left;
      }
    }
    .date-item-box {
      /*width: 100%;*/
      margin-top: 6px;
      margin-right: -2px;
      .item {
        padding-right: 2px;
      }
      .type-month {
        width: 100%;
        overflow: hidden;

        .item {
          @include spanItem(25%, 32px, $dateItemBack);
          float: left;
        }
      }
      .type-season {
        width: 100%;
        overflow: hidden;
        /*margin-right: -2px;*/
        .item {
          @include spanItem(50%, 49px, $dateItemBack);
          float: left;
        }
      }
      .type-halfyear {
        width: 100%;
        overflow: hidden;
        /*margin-right: -2px;*/
        .item {
          @include spanItem(50%, 100px, $dateItemBack);
          float: left;
        }
      }
      .type-allyear {
        width: 100%;
        overflow: hidden;
        /*margin-right: -2px;*/
        .item {
          @include spanItem(100%, 100px, $dateItemBack);
          float: left;
        }
      }
    }
    .date-footer {
      width: 100%;
      overflow: hidden;
      margin-top: 6px;
      .left {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        float: left;
        color: #1ad6d8;
      }
      .right {
        float: right;
        overflow: hidden;
        .btn {
          @include spanItem(70px, 32px, $dateItemBack);
          float: left;
        }
        .ok {
          background: $btnOk;
        }
      }
    }
  }
}
</style>