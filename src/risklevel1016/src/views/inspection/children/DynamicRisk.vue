<template>
  <div id="DynamicRisk">
    <div class="commonWidth first" style="padding:10px;">
      <div class="top-dynamic">
        <div class="fl">
          <svg-icon iconClass="tips"></svg-icon>
          <span>
            检查项目填报（普通食品生产企业类型）
            <svg-icon iconClass="error" class="tips-icon" @click.native="showTips"></svg-icon>
          </span>
        </div>
        <div class="fr">
          <el-button type="primary" plain @click="view">
            <svg-icon iconClass="view"></svg-icon>
            <span>预览</span>
          </el-button>
        </div>
      </div>
      <tips ref="tipsRefs" :contents="tipContent">
        <slot name="contents">
          <p>{{tipContent}}</p>
        </slot>
      </tips>
      <div class="match-score">
        <span>
          动态风险因素分值：
          <label class="aColor">{{score.riskScore}}</label>
          分&emsp;
          合理缺项数：
          <label class="cColor">{{score.missScore}}</label>
        </span>
      </div>
      <DynamicTable
        :moreCheck="false"
        :taskId="taskId"
        @getScore="getScore"
        ref="dynamicTableRefs"
        type="edit"
        :title="title"
      />
    </div>
    <div class="commonWidth">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>其他问题备注</span>
      </div>
      <div class="other-text">
        <div class="label fl">其他问题：</div>
        <div class="content fl">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="others"
            maxlength="300"
            show-word-limit
          ></el-input>
        </div>
      </div>
    </div>
    <div class="commonWidth bot">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button @click="reset">
            <svg-icon iconClass="reset"></svg-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setStorage } from "@/utils/index.js";
import Tips from "@/components/Tips/index";
import DynamicTable from "@/components/DynamicTable/index";
export default {
  data() {
    return {
      title: "动态风险因素",
      showtip: false,
      tipContent:
        "可以只填写存在合理缺失项、扣分项的检测项目，系统将自动补齐剩余的检测项目。点击“填报预览”按钮，获得完整的报表结果。",
      score: {
        riskScore: 0,
        missScore: 0
      },
      scoreList: [],
      others: ""
    };
  },
  components: {
    Tips,
    DynamicTable
  },
  props: {
    enterpriseName: {
      type: String,
      default: ""
    },
    taskId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    showTips() {
      this.$refs.tipsRefs.show();
    },
    getScore(score, scoreList) {
      this.score = score;
      this.scoreList = [...scoreList];
    },
    save() {
      let result = this.$refs.dynamicTableRefs.getResult();
      console.log(result);
    },
    reset() {
      this.$refs.dynamicTableRefs.reset();
      this.others = "";
    },
    view() {
      setStorage("dynamicView", {
        score: this.score,
        scoreList: this.scoreList
      });
      let routeUrl = this.$router.resolve({
        name: "预览动态风险因素分值",
        params: {
          viewType: "viewDynamic",
          enterpriseName: this.enterpriseName
        }
      });
      window.open(routeUrl.href, "_blank");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/DynamicRisk.scss";
</style>