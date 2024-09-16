<template>
  <div id="tips" class="tips">
    <div class="title">近期监管提示</div>
    <div class="con-box">
      <div class="tab-list">
        <span @click="changeTab(0)" :class="{'active':tabIndex===0}">高风险业态预测</span>
        <span @click="changeTab(1)" class="bars" :class="{'active':tabIndex===1}">风险词频环比异常</span>
      </div>
      <div class="content" v-show="tabIndex==0">
        <div class="items">
          <div class="lefts">
            <img src="../../images/dp.png">
          </div>
          <div class="rights">
            <p class="texts">
              根据历史评论数据预测，未来{{days}}天，
              <span v-html="hignWaringHtmls"></span>
            </p>
          </div>
        </div>
        <div class="items">
          <div class="lefts">
            <img src="../../images/jl.png">
          </div>
          <div class="rights">
            <div class="tables">
              <div class="item head">
                <span>业态</span>
                <span>风险词top3</span>
              </div>
              <div class="item" v-for="(item, index) in highWarning" :key="index+'tipsa'">
                <span>{{item.businessMode}}</span>
                <span>{{item.riskWords}}</span>
              </div>
              <div class="empty" v-show="highWarning.length===0">暂无高风险业态</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content" v-show="tabIndex==1">
        <div class="items">
          <div class="lefts">
            <img src="../../images/dp.png">
          </div>
          <div class="rights">
            <p class="texts">
              近30天，
              <span v-html="waringHtmls"></span>
            </p>
          </div>
        </div>
        <div class="items alltypes">
          <div class="lefts">业态</div>
          <div class="rights">
            <div class="percent" v-for="(item, index) in statusList" :key="index+'tipsb'">
              <el-progress
                type="circle"
                :percentage="item.sPercent"
                :show-text="false"
                :stroke-width="10"
                :width="60"
              ></el-progress>
              <p class="innerTxt">{{item.percent}}%</p>
              <p>{{item.type}}</p>
            </div>
            <div class="empty" v-show="statusList.length===0">暂无异常</div>
          </div>
        </div>
        <div class="items alltypes">
          <div class="lefts">区域</div>
          <div class="rights">
            <div class="percent" v-for="(item, index) in areaList" :key="index+'tipsc'">
              <el-progress
                type="circle"
                :percentage="item.sPercent"
                :show-text="false"
                :stroke-width="10"
                :width="60"
              ></el-progress>
              <p class="innerTxt">{{item.percent}}%</p>
              <p>{{item.type}}</p>
            </div>
            <div class="empty" v-show="areaList.length===0">暂无异常</div>
          </div>
        </div>
        <div class="items alltypes noborder">
          <div class="lefts">风险类型</div>
          <div class="rights">
            <div class="percent" v-for="(item, index) in warnTypeList" :key="index+'tipsd'">
              <el-progress
                type="circle"
                :percentage="item.sPercent"
                :show-text="false"
                :stroke-width="10"
                :width="60"
              ></el-progress>
              <p class="innerTxt">{{item.percent}}%</p>
              <p>{{item.type}}</p>
            </div>
            <span v-show="warnTypeList.length==0" class="empty">暂无异常</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: 30,
      tabIndex: 0,
      highWarning: [
        {
          type: "海鲜水产",
          des: "描述"
        }
      ],
      statusList: [],
      areaList: [],
      warnTypeList: [],
      totalWords: [],
      hignWaringHtmls: "",
      waringHtmls: ""
    };
  },
  props: {
    tipsa: {
      type: Array,
      default: []
    },
    tipsb: {
      type: Object,
      default: []
    }
  },
  watch: {
    tipsa(a) {
      this.highWarning = a;
      this.formatHtmlsa();
    },
    tipsb(a) {
      let res = { ...a };
      this.totalData = res;
      if (res != {}) {
        this.getData(res);
      }
    }
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
    },
    getData(data) {
      this.statusList = [];
      this.areaList = [];
      this.warnTypeList = [];
      this.totalWords = [];
      if (data.BUSINESS_MODE) {
        data.BUSINESS_MODE.forEach(item => {
          this.statusList.push({
            type: item.item,
            percent: Number(item.ratio),
            sPercent: Number(item.ratio) > 100 ? 100 : Number(item.ratio)
          });
        });
        if (data.BUSINESS_MODE.length > 0) {
          this.totalWords.push("业态");
        }
      }
      if (data.ZONE) {
        data.ZONE.forEach(item => {
          this.areaList.push({
            type: item.item,
            percent: Number(item.ratio),
            sPercent: Number(item.ratio) > 100 ? 100 : Number(item.ratio)
          });
        });
        if (data.ZONE.length > 0) {
          this.totalWords.push("区域");
        }
      }
      if (data.RISK_TYPE) {
        data.RISK_TYPE.forEach(item => {
          this.warnTypeList.push({
            type: item.item,
            percent: Number(item.ratio),
            sPercent: Number(item.ratio) > 100 ? 100 : Number(item.ratio)
          });
        });
        if (data.RISK_TYPE.length > 0) {
          this.totalWords.push("风险类型");
        }
      }
      this.formatHtmls();
    },
    formatHtmls() {
      let htmls = "";
      if (this.statusList.length > 0) {
        for (let i = 0; i < this.statusList.length; i++) {
          htmls += this.statusList[i].type;
          if (this.statusList.length > 2 && i < this.statusList.length - 2) {
            htmls += "、";
          }
          if (this.statusList.length > 1 && i == this.statusList.length - 2) {
            htmls += "及";
          }
        }
        htmls += "类的网络订餐商家风险词频增长大于5%";
        if (this.areaList.length != 0 || this.warnTypeList.length != 0) {
          htmls += "；";
        } else {
          htmls += "。";
        }
      }
      if (this.areaList.length > 0) {
        for (let i = 0; i < this.areaList.length; i++) {
          htmls += this.areaList[i].type;
          if (this.areaList.length > 2 && i < this.areaList.length - 2) {
            htmls += "、";
          }
          if (this.areaList.length > 1 && i == this.areaList.length - 2) {
            htmls += "及";
          }
        }
        htmls += "的网络订餐商家风险词频增长大于5%";
        if (this.warnTypeList.length != 0) {
          htmls += "；";
        } else {
          htmls += "。";
        }
      }
      if (this.warnTypeList.length > 0) {
        for (let i = 0; i < this.warnTypeList.length; i++) {
          htmls += this.warnTypeList[i].type;
          if (
            this.warnTypeList.length > 2 &&
            i < this.warnTypeList.length - 2
          ) {
            htmls += "、";
          }
          if (
            this.warnTypeList.length > 1 &&
            i == this.warnTypeList.length - 2
          ) {
            htmls += "及";
          }
        }
        htmls += "相关的风险词频增长大于5%。";
      }
      if (this.totalWords.length > 0) {
        htmls += "针对以上风险词频增长异常的";
        for (let i = 0; i < this.totalWords.length; i++) {
          htmls += this.totalWords[i];
          if (this.totalWords.length > 2 && i < this.totalWords.length - 2) {
            htmls += "、";
          }
          if (this.totalWords.length > 1 && i == this.totalWords.length - 2) {
            htmls += "及";
          }
        }
        htmls += "，建议加强监管。";
      }
      if (this.totalWords.length == 0) {
        htmls += "暂无风险词频环比异常数据。";
      }
      this.waringHtmls = htmls;
    },
    formatHtmlsa() {
      let htmls = "";
      if (this.highWarning.length > 0) {
        for (let i = 0; i < this.highWarning.length; i++) {
          htmls += this.highWarning[i].businessMode;
          if (this.highWarning.length > 2 && i < this.highWarning.length - 2) {
            htmls += "、";
          }
          if (this.highWarning.length > 1 && i == this.highWarning.length - 2) {
            htmls += "及";
          }
        }
        htmls += "类的网络订餐商家风险较高，建议加强监管。";
      } else {
        htmls += "暂无风险值较高的网络订餐商家。";
      }
      this.hignWaringHtmls = htmls;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
#tips {
  .con-box {
    width: 100%;
    position: relative;
    overflow: hidden;
    .tab-list {
      width: 100%;
      margin-top: 4px;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        padding: 0 12px 0 20px;
        cursor: pointer;
        &.bars {
          position: relative;
          &:after {
            position: absolute;
            top: 13px;
            left: 0;
            bottom: 13px;
            width: 4px;
            content: "";
            background: #2769b0;
          }
        }
      }
    }
    .content {
      // width: 100%;
      position: absolute;
      top: 40px;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 20px;
      overflow: auto;
      color: rgb(83, 83, 83);
      .items {
        width: 100%;
        display: flex;
        margin: 18px 0 0 0;
        .lefts {
          flex: 0 0 74px;
          img {
            margin-top: 4px;
          }
        }
        &.alltypes {
          border-bottom: 1px solid #f5f5f5;
          .lefts {
            line-height: 100px;
            color: #333;
            font-weight: bold;
          }
          .empty {
            line-height: 100px;
            color: #999;
          }
          .rights {
            overflow: hidden;
            .percent {
              width: 33.3%;
              float: left;
              text-align: center;
              margin: 5px 0;
              position: relative;
              p {
                line-height: 24px;
              }
              .innerTxt {
                position: absolute;
                top: 19px;
                left: 50%;
                font-size: 12px;
                transform: translateX(-50%);
              }
            }
            .warnTypes {
              margin-right: 10px;
            }
          }
        }
        &.noborder {
          border-bottom: none;
          margin: 15px 0;
          // .lefts,
          // .rights,
          // .empty {
          //   line-height: 30px;
          // }
        }

        .rights {
          flex: 1;
          .texts {
            line-height: 26px;
            color: #666;
            span {
              display: inline;
            }
          }
          .tables {
            width: 100%;
            position: relative;
            .item {
              height: 40px;
              line-height: 40px;
              overflow: hidden;
              display: flex;
              // color: #999;
              border-top: 1px solid #f5f5f5;
              span {
                display: inline-block;
                flex: 1;
                &:first-child {
                  flex: 0 0 100px;
                }
              }
              &.head {
                color: #333;
                font-weight: bold;
                border-top: none;
              }
            }
            .empty {
              border-top: 1px solid #f5f5f5;
              border-bottom: 1px solid #f5f5f5;
              width: 100%;
              line-height: 50px;
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>