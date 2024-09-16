<template>
  <div id="TaskStatic">
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
      :enterpriseType="enterpriseType"
      :taskId="taskId"
      :showNum="true"
      @getScore="getScore"
      @getRemarks="getRemarks"
      type="view"
      :title="title"
      ref="detailTableRefs"
    />
  </div>
</template>
<script>
import DynamicTable from "@/components/DynamicTable/index";

export default {
  data() {
    return {
      score: {
        riskScore: 0,
        missScore: 0
      },
      scoreList: [],
      title: ""
    };
  },
  components: {
    DynamicTable
  },
  props: {
    taskId: {
      type: Number,
      default: 0
    },
    enterpriseType: {
      type: String,
      default: ""
    }
  },
  methods: {
    getScore(score, scoreList) {
      this.score = score;
      this.scoreList = [...scoreList];
    },
    getRemarks(txt) {}
  },
  mounted() {
    console.log(this.taskId);
    this.$refs.detailTableRefs.getDatas();
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/DynamicRisk.scss";
#TaskStatic {
  .match-score {
    text-align: center;
  }
}
</style>