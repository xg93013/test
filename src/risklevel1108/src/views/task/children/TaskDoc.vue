<template>
  <div id="DocStepone">
    <div class="table-box">
      <div class="ent-info" v-show="enterpriseType=='FOOD_PRODUCTION'">
        <div class="left level">企业风险等级评定</div>
        <div class="mid">
          <div class="item level">企业风险等级评定</div>
          <div class="item">风险等级（2019）</div>
        </div>
        <div class="right">
          <div class="right-item">
            <div class="item">静态风险因素量化风险分值</div>
            <div class="item">动态风险因素量化风险分值</div>
            <div class="item">总分</div>
          </div>
          <div class="right-item">
            <div class="item">234</div>
            <div class="item">10</div>
            <div class="item">10</div>
          </div>
          <div class="right-item long">
            <el-checkbox-group v-model="riskLevel">
              <el-checkbox label="A级" disabled></el-checkbox>
              <el-checkbox label="B级" disabled></el-checkbox>
              <el-checkbox label="C级" disabled></el-checkbox>
              <el-checkbox label="D级" disabled></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="ent-info">
        <div class="left risk">风险评估及防控建议</div>
        <div class="right long">
          <div class="item">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="风险评估及防控建议"
              v-model="riskRemarks"
              maxlength="300"
              show-word-limit
              style="width:100%;margin-top: 10px;"
              :disabled="disabled"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="ent-info">
        <div class="left remark">备注</div>
        <div class="right long">
          <div class="item last">
            <el-input type="text" :disabled="disabled"></el-input>
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
      preRiskLevel: ["A级"],
      riskLevel: ["A级"],
      riskRemarks: "",
      enterpriseType: "FOOD_PRODUCTION",
      disabled: true
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/DocDetail.scss";
#DocStepone {
  padding: 20px;
}
</style>