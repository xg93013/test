<template>
  <div id="evaluateAnalysis">
    <div class="top">
      <div class="left">
        <trend :trend="trend" :allRiskTypes="allRiskTypes"/>
        <types :types="types"/>
      </div>
      <div class="right">
        <tips :tipsa="tipsa" :tipsb="tipsb"/>
        <evalua :evalua="evalua"/>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <sort :wordSort="wordSort" :areaSort="areaSort"/>
      </div>
      <div class="right">
        <topFifty
          :topFifty="topFifty"
          :allRiskTypes="allRiskTypes"
          @filterTop="filterTop"
          v-loading="showTopLoading"
        />
      </div>
    </div>
  </div>
</template>
<script>
import trend from "./trend";
import types from "./types";
import tips from "./tips";
import sort from "./sort";
import evalua from "./evalua";
import topFifty from "./topFifty";
import http from "@/unit/http";
import apis from "@/unit/apis";
const {
  ALL_RISKTYPES, // 所有风险类型
  RISKTYPE_TRENDS, // 风险趋势变化
  RISKTYPE_ANALYSISRATIOS, // 风险类型对比
  RISKWORDBUSMODE_PREDICTION, // 高风险业态预测
  RISKWORD_ABNORMAL, // 风险词频环比异常
  DYNAMIC_COMMENTS, // 评论分析动态
  RISKWORD_BUSMODESORT, // 业态风险词频排序
  RISKWORD_ZONESORT, // 区域风险词频排序
  RISKWORD_SHOPTOP50, // top50商家
  UPDATE_TIME
} = apis;
export default {
  data() {
    return {
      defaultRiskTypes: ["身体不适", "食物变质", "有异物", "配送不当", "其他"],
      allRiskTypes: [],
      trend: [],
      types: [],
      tipsa: [],
      tipsb: {},
      evalua: [],
      wordSort: [],
      areaSort: [],
      topFifty: [],
      myInter: null,
      riskTypes: "",
      cancels: [],
      showTopLoading: false
    };
  },
  components: {
    trend,
    types,
    tips,
    sort,
    topFifty,
    evalua
  },
  beforeRouteLeave(to, from, next) {
    //离开页面前先清除轮询
    if (this.myInter) {
      clearInterval(this.myInter);
      this.cancelAjax("CLOSE_AJAX");
    }
    next();
  },

  methods: {
    cancelAjax() {
      //关闭ajax请求
      this.cancels.forEach(item => {
        item();
      });
    },
    async getData() {
      let [
        allRiskTypes,
        trend,
        types,
        tipsa,
        tipsb,
        evalua,
        wordSort,
        areaSort,
        topFifty
      ] = await Promise.all([
        http.get(ALL_RISKTYPES, {}, this.cancels),
        http.get(RISKTYPE_TRENDS, {}, this.cancels),
        http.get(RISKTYPE_ANALYSISRATIOS, {}, this.cancels),
        http.get(RISKWORDBUSMODE_PREDICTION, {}, this.cancels),
        http.get(RISKWORD_ABNORMAL, {}, this.cancels),
        http.get(DYNAMIC_COMMENTS, {}, this.cancels),
        http.get(RISKWORD_BUSMODESORT, {}, this.cancels),
        http.get(RISKWORD_ZONESORT, {}, this.cancels),
        http.get(RISKWORD_SHOPTOP50 + "/" + "全部", {}, this.cancels)
      ]);
      if (allRiskTypes) {
        if (allRiskTypes.result.length != 0) {
          this.allRiskTypes = [...allRiskTypes.result];
        } else {
          this.allRiskTypes = [...this.defaultRiskTypes];
        }
      }
      if (trend) {
        this.trend = [...trend.result];
      }
      if (types) {
        this.types = [...types.result];
      }
      if (tipsa) {
        this.tipsa = [...tipsa.result];
      }
      if (tipsb) {
        this.tipsb = { ...tipsb.result };
      }
      if (evalua) {
        this.evalua = [...evalua.result];
      }
      if (wordSort) {
        this.wordSort = [...wordSort.result];
      }
      if (areaSort) {
        this.areaSort = [...areaSort.result];
      }
      if (topFifty) {
        this.topFifty = [...topFifty.result];
      }
      if (this.$store.state.loading) {
        this.$store.commit("changeLoading", false);
      }
    },
    filterTop(list) {
      this.getTopList(list);
    },
    async getTopList(list) {
      this.showTopLoading = true;
      let params = "";
      if (list.length !== this.allRiskTypes.length && list.length != 0) {
        list.forEach((item, index) => {
          if (index != list.length - 1) {
            params += item + ",";
          } else {
            params += item;
          }
        });
        params = "/" + params;
      } else {
        params = "/" + "全部";
      }
      let res = await http.get(RISKWORD_SHOPTOP50 + params);
      if (res) {
        this.showTopLoading = false;
        this.topFifty = [...res.result];
      }
    }
  },
  mounted() {},
  created() {
    this.getData();
    this.myInter = setInterval(() => {
      this.getData();
    }, UPDATE_TIME);
  }
};
</script>
<style lang="scss">
#evaluateAnalysis {
  min-height: 1400px;
  .top {
    width: 100%;
    height: 65%;
  }
  .bottom {
    width: 100%;
    height: 35%;
  }

  .left,
  .right {
    float: left;
    height: 100%;
    > div {
      padding-top: 50px;
      width: 100%;
      position: relative;

      .title {
        position: absolute;
        width: 100%;
        height: 50px;
        line-height: 50px;
        left: 0;
        top: 0;
        border-bottom: 1px solid #e6e6e6;
        font-size: 18px;
        padding-left: 20px;
        background: #fff;
      }
    }
  }

  .left {
    width: 74%;
    padding-right: 20px;
  }

  .right {
    width: 26%;
  }

  .trend,
  .tips {
    width: 100%;
    height: 55%;
    padding-bottom: 20px;
  }

  .types,
  .evalua {
    width: 100%;
    height: 45%;
  }

  .sort,
  .topFifty {
    width: 100%;
    height: 100%;
    padding-top: 70px !important;
    .title {
      top: 20px !important;
    }
  }
  .con-box {
    width: 100%;
    height: 100%;
    background: #fff;
  }
}
</style>

