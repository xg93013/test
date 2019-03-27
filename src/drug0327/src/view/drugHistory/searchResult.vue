<template>
  <div id="searchResult">
    <div class="search-top">
      <div class="company-box">
        <div class="left">
          <img src alt>
        </div>
        <div class="right">
          <p class="name">马来酸噻吗洛尔滴眼液</p>
          <p>追溯码: 81542653835163120993</p>
          <p>生产厂家: 广东宏盈科技有限公司</p>
          <p>生产日期: 2018-05-31</p>
          <p>有效日期: 2021-04-30</p>
        </div>
      </div>
    </div>
    <div class="search-tab">
      <div class="tab-nav">
        <span :class="{'current':tabIndex==0}" @click="changeTab(0)">生产信息</span>
        <span :class="{'current':tabIndex==1}" @click="changeTab(1)">流通信息</span>
        <span :class="{'current':tabIndex==2}" @click="changeTab(2)">分销图谱</span>
      </div>
      <div class="tab-box" :class="tabIndex===0?'visible':'hidden'">
        <div class="drug-info">
          <p>
            <span>通用名称：</span>
            {{baseinfo.PHYSIC_NAME}}
          </p>
          <p>
            <span>药品规格：</span>
          </p>
          <p>
            <span>药品批次：</span>
            {{baseinfo.APPROVE_NO}}
          </p>
          <p>
            <span>剂型：</span>
            {{baseinfo.PREPN_DESC}}
          </p>
          <p>
            <span>制剂规格：</span>
            {{baseinfo.PREPN_SPEC}}
          </p>
          <p>
            <span>生产厂家：</span>
          </p>
          <p>
            <span>生产日期：</span>
          </p>
          <p>
            <span>有效日期：</span>
          </p>
        </div>
      </div>
      <div class="tab-box" :class="tabIndex===1?'visible':'hidden'">
        <div class="start-line"></div>
        <div
          class="flow-info"
          v-for="(item,index) in transform"
          :key="item.BILL_ID"
          :class="{'first':index===0}"
        >
          <div class="left">
            <div class="circle"></div>
            <div class="line"></div>
          </div>
          <div class="right">
            <p class="name">通用名称：{{item.ENT_NAME}}</p>
            <p>ID：{{item.BILL_ID}}</p>
            <p>{{item.BILL_TYPE === '102' ? '采购入库': '销售出库'}}：{{item.BILL_TIME}}</p>
          </div>
        </div>
      </div>
      <div class="tab-box" :class="tabIndex===2?'visible':'hidden'">
        <resultChart/>
      </div>
    </div>
  </div>
</template>
<script>
import resultChart from "./resultChart.vue";
import apis from "@/unit/apis.js";
import http from "@/unit/http.js";
const { DRUG_BASEINFO, DRUG_TRANSFORM } = apis;
export default {
  components: {
    resultChart
  },
  data() {
    return {
      pieChart: "",
      tabIndex: 0,
      batchNo: "",
      topInfo: {},
      baseinfo: {},
      transform: []
    };
  },
  created() {
    let base = JSON.parse(window.sessionStorage.getItem("baseinfo"));
    this.batchNo = base.batchNo;
    this.baseinfo = base.baseinfo;
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
    },
    async getDatas() {
      let [transform] = await Promise.all([
        // http.get(DRUG_BASEINFO + "?batchNo=" + this.batchNo),
        http.get(DRUG_TRANSFORM + "?batchNo=" + this.batchNo)
      ]);
      // if (baseinfo) {
      //   this.baseinfo = { ...baseinfo.data };
      // }
      if (transform) {
        this.transform = [...transform.data];
      }
      this.$emit("closeLoading", false);
    }
  },
  mounted() {
    this.getDatas();
  }
};
</script>
<style lang="scss" scoped>
#searchResult {
  width: 100%;
  height: 100%;

  color: #fff;
  position: relative;
  .search-top {
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: rgba($color: #19a0ff, $alpha: 0.1);
    .company-box {
      overflow: hidden;
      margin: 40px;
      .left {
        width: 160px;
        height: 160px;
        background: rgba(255, 255, 255, 0.1);
        float: left;
        img {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
        }
      }
      .right {
        float: left;
        margin-left: 20px;
        p {
          height: 28px;
          line-height: 28px;
          color: #7faaea;
          font-size: 16px;
          &.name {
            color: #fff;
            font-size: 20px;
            margin-bottom: 18px;
          }
        }
      }
    }
  }
  .search-tab {
    width: 100%;
    position: absolute;
    top: 260px;
    left: 0;
    bottom: 0;
    background: rgba($color: #19a0ff, $alpha: 0.1);
    .tab-nav {
      position: absolute;
      top: 0;
      left: 10px;
      right: 10px;
      border-bottom: 3px solid #2b60a2;
      span {
        display: inline-block;
        width: 160px;
        height: 50px;
        font-size: 16px;
        color: #e1e9ff;
        text-align: center;
        line-height: 50px;
        margin-bottom: -3px;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        &.current {
          background: transparent;
          color: #fff;
          border-bottom: 3px solid #1070e7;
        }
      }
    }
    .tab-box {
      position: absolute;
      top: 50px;
      left: 0;
      bottom: 0;
      width: 100%;
      overflow: auto;
      .start-line {
        display: inline-block;
        width: 100%;
        height: 30px;
        margin-top: 30px;
        position: relative;
        &::before {
          content: " ";
          position: absolute;
          top: 10px;
          left: 42px;
          bottom: 0;
          width: 2px;
          height: 26px;
          background: #1070e7;
        }
      }
      .drug-info {
        margin: 30px 0 50px 50px;
        p {
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          span {
            display: inline-block;
            width: 100px;
            font-size: 16px;
            text-align: right;
            margin-right: 20px;
            color: #7faaea;
          }
        }
      }
      .flow-info {
        overflow: hidden;
        .left {
          width: 25px;
          height: 126px;
          float: left;
          margin-left: 30px;
          position: relative;
          .circle {
            width: 16px;
            height: 16px;
            border-radius: 8px;
            position: absolute;
            top: 1px;
            left: 50%;
            transform: translateX(-50%);
            border: 2px solid #18499a;
            &::before {
              display: inline-block;
              content: "";
              width: 8px;
              height: 8px;
              border-radius: 8px;
              background: #18499a;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .line {
            width: 1px;
            height: 120px;
            background: #18499a;
            position: absolute;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .right {
          margin-left: 10px;
          margin-top: -7px;
          float: left;
          p {
            height: 30px;
            line-height: 30px;
            margin-left: 10px;
            color: #7faaea;
            font-size: 16px;
            &.name {
              margin-bottom: 16px;
              color: #fff;
            }
          }
        }
        &.first {
          // margin-top: 20px;
          .circle {
            width: 14px;
            height: 14px;
            border-radius: 7px;
            border: 2px solid #c5dfff;
            &::before {
              background: #1070e7;
            }
          }
        }
      }
    }
    .visible {
      visibility: visible;
    }
    .hidden {
      visibility: hidden;
    }
  }
}
</style>



