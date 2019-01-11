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
              <span v-if="highWarning.length>0">
                <span v-for="(item,indexg) in highWarning">
                  {{item.businessMode}}
                  <label
                    v-if="highWarning.length>0&&indexg!=highWarning.length-1"
                  >、</label>
                </span>类的网络订餐商家风险较高，建议加强监管。
              </span>
              <span v-else>暂无风险值较高的网络订餐商家。</span>
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
              <div class="item" v-for="(item, indexh) in highWarning">
                <span>{{item.businessMode}}</span>
                <span>{{item.riskWords}}</span>
              </div>
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
              <span v-if="statusList.length>0">
                <span v-for="(item,index) in statusList">
                  {{item.type}}
                  <label v-if="statusList.length>0&&index!=statusList.length-1">、</label>
                </span>类的网络订餐商家风险词频增长大于5%；
              </span>
              <span v-if="areaList.length>0">
                <span v-for="(item,indexa) in areaList">
                  {{item.type}}
                  <label v-if="areaList.length>0&&indexa!=areaList.length-1">、</label>
                </span>的网络订餐商家风险词频增长大于5%；
              </span>
              <span v-if="warnTypeList.length>0">
                <span v-for="(item,indexb) in warnTypeList">
                  {{item.type}}
                  <label v-if="warnTypeList.length>0&&indexb!=warnTypeList.length-1">、</label>
                </span>相关的风险词频增长大于5%。
              </span>
              针对以上风险词频增长异常的
              <span v-for="(item, indexc) in totalWords">
                {{item}}
                <label v-if="totalWords.length>0&&indexc<totalWords.length-2">、</label>
                <label v-if="indexc==totalWords.length-2">及</label>
              </span>，建议加强监管。
            </p>
          </div>
        </div>
        <div class="items alltypes">
          <div class="lefts">业态</div>
          <div class="rights">
            <div class="percent" v-for="(item, indexd) in statusList">
              <el-progress type="circle" :percentage="item.percent" :stroke-width="10" :width="60"></el-progress>
              <p>{{item.type}}</p>
            </div>
            <div class="empty" v-show="statusList.length===0">暂无风险</div>
          </div>
        </div>
        <div class="items alltypes">
          <div class="lefts">区域</div>
          <div class="rights">
            <div class="percent" v-for="(item, indexe) in areaList">
              <el-progress type="circle" :percentage="item.percent" :stroke-width="10" :width="60"></el-progress>
              <p>{{item.type}}</p>
            </div>
            <div class="empty" v-show="areaList.length===0">暂无风险</div>
          </div>
        </div>
        <div class="items alltypes noborder">
          <div class="lefts">风险类型</div>
          <div class="rights">
            <span v-for="(item, indexf) in warnTypeList" class="warnTypes">{{item}}</span>
            <span v-show="warnTypeList.length==0" class="empty">暂无风险</span>
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
      totalWords: []
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
            percent: Number(item.ratio)
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
            percent: Number(item.ratio)
          });
        });
        if (data.ZONE.length > 0) {
          this.totalWords.push("区域");
        }
      }
      if (data.RISK_TYPE) {
        data.RISK_TYPE.forEach(item => {
          this.warnTypeList.push(item);
        });
        if (data.RISK_TYPE.length > 0) {
          this.totalWords.push("风险类型");
        }
      }
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
      height: 20px;
      margin-top: 4px;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        padding: 0 10px 0 20px;
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
              p {
                line-height: 24px;
              }
            }
            .warnTypes {
              margin-right: 10px;
            }
          }
        }
        &.noborder {
          border-bottom: none;
          .rights {
            line-height: 100px;
          }
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
          }
        }
      }
    }
  }
}
</style>