<template>
  <div id="DocView">
    <div class="commonWidth">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>预览报告</span>
      </div>
      <span class="ent-name">{{enterprise.enterpriseName}}</span>
    </div>
    <div class="commonWidth">
      <DocStepone :taskId="taskId"  type="view" />
    </div>
    <div class="commonWidth">
      <DocSteptwo :taskId="taskId" type="view" />
    </div>
    <div class="commonWidth bot">
      <DocStepthree :taskId="taskId" />
      <div class="res">
        <div class="item">
          <span>核查：</span>
          <el-input type="text" v-model="groupPerson" disabled></el-input>
        </div>
        <div class="item">
          <span>复查：</span>
          <el-input type="text" disabled></el-input>
        </div>
        <div class="item">
          <span>编制：</span>
          <el-input type="text" disabled></el-input>
        </div>
        <div class="item">
          <span>批准：</span>
          <el-input type="text" disabled></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DocStepone from "./DocStepone.vue";
import DocSteptwo from "./DocSteptwo.vue";
import DocStepthree from "./DocStepthree.vue";

export default {
  data() {
    return {
      taskId: 10,
      groupPerson: "",
      enterprise: {}
    };
  },
  components: {
    DocStepone,
    DocSteptwo,
    DocStepthree
  },
  created() {
    debugger
    this.taskId = Number(this.$route.params.taskId);
    // this.enterprise = {
    //   enterpriseName: "AAB",
    //   enterpriseAddress: "BB",
    //   enterpriseNo: "aaa",
    //   person: "asds,1000",
    //   productCategory: "",
    //   preRiskLevel: "A",
    //   riskLevel: "B",
    //   enterpriseStatus: "SHUT-down",
    //   checkDate: "",
    //   stopDate: "",
    //   category: ""
    // };
  }
};
</script>
<style lang="scss" scoped>
.res {
  width: 100%;
  overflow: hidden;
  margin-top: 30px;
  .item {
    width: 25%;
    height: 40px;
    line-height: 40px;
    float: left;
    span {
      margin-left: 20px;
    }
    .el-input {
      width: 200px;
    }
  }
}
</style>
