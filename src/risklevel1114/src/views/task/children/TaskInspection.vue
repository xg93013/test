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
      @getScore="getScore"
      @getRemarks="getRemarks"
      type="view"
      :title="title"
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
      taskId: 10,
      title: "",
      enterpriseType: "FOOD_PRODUCTION"
    };
  },
  components: {
    DynamicTable
  },
  methods: {
    getScore(score, scoreList) {
      this.score = score;
      this.scoreList = [...scoreList];
    },
    getRemarks(txt) {}
  }
};
</script>
<style lang="scss" scoped>
#TaskStatic {
  .match-score {
    text-align: center;
  }
}
</style>