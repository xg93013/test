<template>
  <div id="pro" class="r">
    <el-row style="height:20%">
      <el-col :span="12" class="txt-20">{{datas.category}}</el-col>
      <el-col v-show="datas.category" :span="12" align="right">
        <timeSlot ref="timeSlot" @timeChange="timeChange" :isPro="true" :currentTime="currentTime"/>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" style="height:10%">
      <el-col :span="4" class="txt-28" align="right">抽检批次</el-col>
      <el-col
        v-for="(item,index) in datas.content"
        :key="index"
        :offset="index==0?1:0"
        :span="5"
        class="txt-40"
        align="center"
      >
        <span @click="goDetails(1,index,item.inspectionBatch)">{{item.inspectionBatch}}</span>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" style="height:10%">
      <el-col :span="4" class="txt-28" align="right">不合格批次</el-col>
      <el-col
        v-for="(item,index) in datas.content"
        :key="index"
        :offset="index==0?1:0"
        :span="5"
        class="txt-40"
        align="center"
      >
        <span @click="goDetails(2,index,item.disqualifiedBatch)">{{item.disqualifiedBatch}}</span>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" style="height:10%">
      <el-col :span="4" class="txt-28" align="right">不合格率</el-col>
      <el-col
        v-for="(item,index) in datas.content"
        :key="index"
        :offset="index==0?1:0"
        :span="5"
        class="txt-40"
        align="center"
      >
        <span style="cursor:default" :class="{'list-rotate': item.disqualifiedRate>=50}">
          {{item.disqualifiedRate.toFixed(2)}}%
          <span v-if="item.disqualifiedRate>=50">建议重点关注</span>
        </span>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" style="height:30%">
      <el-col :offset="5" :span="5" align="center" style="z-index:2">
        <div class="d-1">
          <img :src="require('./images/yz.png')" alt> 种养殖环节
        </div>
      </el-col>
      <el-col :span="5" align="center" style="z-index:1">
        <div class="d-2">
          <img :src="require('./images/lt.png')" alt> 流通环节
        </div>
      </el-col>
      <el-col :span="5" align="center">
        <div class="d-3">
          <img :src="require('./images/cy.png')" alt> 餐饮环节
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" style="height:10%">
      <el-col :span="4" class="txt-28" align="right">企业数量</el-col>
      <el-col
        v-for="(item,index) in datas.content"
        :key="index"
        :offset="index==0?1:0"
        :span="5"
        class="txt-40"
        align="center"
      >
        <span @click="goDetails(3,index,item.enterpriseTotal)">
          {{item.enterpriseTotal}}
          <span class="txt-26">家</span>
        </span>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" style="height:10%">
      <el-col :span="4" class="txt-28" align="right">抽检不合格企业数量</el-col>
      <el-col
        v-for="(item,index) in datas.content"
        :key="index"
        :offset="index==0?1:0"
        :span="5"
        class="txt-40"
        align="center"
      >
        <span @click="goDetails(4,index,item.enterpriseDisqualified)">
          {{item.enterpriseDisqualified}}
          <span class="txt-26">家</span>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import timeSlot from "@/components/timeSlot";
import http from "@/unit/http";
import apis from "@/unit/apis";
const { FOOD_SUMMARY } = apis;
export default {
  data() {
    return {
      datas: {
        category: "",
        content: []
      },
      times: "",
      id: "",
      currentTime: {},
      isTime: false
    };
  },
  components: {
    timeSlot
  },
  methods: {
    async getDatas(time) {
      let res = await http.get(
        FOOD_SUMMARY + this.id + "?dateValue=" + time.year + "年" + time.msg
      );
      if (res) {
        if (res.data.hasData) {
          this.datas = { ...res.data };
          this.times = time.year + "年" + time.msg;
          this.currentTime = { ...time };

          this.$emit("setPage", this.id);

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
    goDetails(a, b, c) {
      //				if(c > 0) {
      this.$emit("goDetails", {
        num: a,
        types: b + 1,
        id: this.id,
        times: this.times
      });
      //				}
    },
    timeChange(e) {
      this.times = e.year + "年" + e.msg;
      this.getDatas(e);
    },
    init(e) {
      this.id = e;
      let time = new Date();
      let y = time.getFullYear() + "年";
      let m = time.getMonth() + 1;
      m = m > 9 ? m + "月" : "0" + m + "月"; ///默认本年本月
      let obj = {};
      if (!this.isTime) {
        obj = {
          year: time.getFullYear(),
          msg: m
        };
      } else {
        obj = this.currentTime;
      }
      this.$nextTick(() => {
        this.getDatas(obj);
      });
    }
  }
};
</script>

<style lang="scss">
#pro.r {
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  .el-select--small {
    width: 120px;
  }
  .el-input__inner {
    background-color: #0099ff;
    border: 1px solid #0099ff;
    color: #fff;
  }
  .el-col {
    position: relative;
  }
  .txt-20 {
    font-size: 20px;
    color: #aad7ff;
  }
  .txt-28 {
    font-size: 28px;
    color: #80b4ff;
  }
  .txt-40 {
    font-size: 40px;
    font-weight: bold;
    color: #fff;
    > span {
      cursor: pointer;
      font-size: 40px;
    }
    .list-rotate {
      position: relative;
      color: #df5a76;
      > span {
        display: none;
        position: absolute;
        left: 100%;
        width: 100px;
        top: 25px;
        font-weight: normal;
        color: #df5a76;
      }
      &:hover {
        > span {
          display: block;
        }
      }
    }
    .txt-26 {
      font-size: 26px;
    }
  }
  .d-1,
  .d-2,
  .d-3 {
    position: relative;
    display: inline-block;
    height: 110px;
    line-height: 110px;
    font-size: 24px;
    color: #fff;
    background-size: 100% 100%;
    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  @media screen and (min-width: 1300px) and (max-width: 1400px) {
    .d-2 {
      img {
        margin-right: -7px;
      }
    }
  }
  @media screen and (max-width: 1300px) {
    .d-1,
    .d-2,
    .d-3 {
      font-size: 18px;
      img {
        margin-right: -1px;
      }
    }
  }
  .d-1 {
    width: 116%;
    padding-right: 20%;
    background-image: url(images/a.png);
  }
  .d-2 {
    width: 119%;
    left: -2%;
    padding-left: 20px;
    background-image: url(images/b.png);
  }
  .d-3 {
    width: 120%;
    background-image: url(images/c.png);
  }
}
</style>