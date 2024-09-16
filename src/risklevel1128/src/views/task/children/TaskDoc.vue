<template>
  <div id="DocStepone">
    <div class="table-box">
      <div class="ent-info" v-show="enterpriseType=='FOOD_PRODUCTION'">
        <div class="left level">企业风险等级评定</div>
        <div class="mid">
          <div class="item level">企业风险等级评定</div>
          <div class="item">风险等级</div>
        </div>
        <div class="right">
          <div class="right-item">
            <div class="item">静态风险因素量化风险分值</div>
            <div class="item">动态风险因素量化风险分值</div>
            <div class="item">总分</div>
          </div>
          <div class="right-item">
            <div class="item">{{mark.staticRiskScore}}</div>
            <div class="item">{{mark.dynamicRiskScore}}</div>
            <div class="item">{{mark.totalScore}}</div>
          </div>
          <div class="right-item long">
            <el-checkbox-group v-model="riskLevel">
              <el-checkbox label="A" disabled></el-checkbox>
              <el-checkbox label="B" disabled></el-checkbox>
              <el-checkbox label="C" disabled></el-checkbox>
              <el-checkbox label="D" disabled></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="ent-info caterer-left" v-show="enterpriseType=='CATERING_BUSINESS'">
        <div class="left">企业风险等级评定</div>
        <div class="mid">
          <div class="item caterer">风险评定分值</div>
          <div class="item">风险等级</div>
        </div>
        <div class="right">
          <div class="right-item">
            <div class="item">{{mark.dynamicRiskScore}}</div>
          </div>
          <div class="right-item long">
            <el-checkbox-group v-model="riskLevel">
              <el-checkbox label="1" disabled></el-checkbox>
              <el-checkbox label="2" disabled></el-checkbox>
              <el-checkbox label="3" disabled></el-checkbox>
              <el-checkbox label="4" disabled></el-checkbox>
              <el-checkbox label="5" disabled></el-checkbox>
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
              v-model="suggest"
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
            <el-input type="text" :disabled="disabled" v-model="remark"></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { TASKS_PREVIEW } = apis;

export default {
  data() {
    return {
      preRiskLevel: ["A级"],
      riskLevel: ["A级"],
      suggest: "",
      remark: "",
      disabled: true,
      mark: {
        dynamicRiskScore: "",
        staticRiskScore: "",
        totalScore: ""
      }
    };
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
  created() {
    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let res = await http.get(TASKS_PREVIEW + "/" + this.taskId + "/1");
      if (res) {
        this.mark.dynamicRiskScore = res.data.data.dynamicRiskScore;
        this.mark.staticRiskScore = res.data.data.staticRiskScore;
        this.mark.totalScore = res.data.data.totalScore;
        this.riskLevel = [res.data.data.currentRiskLevel];
        this.suggest = res.data.data.suggest;
        this.remark = res.data.data.remark;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/DocDetail.scss";
#DocStepone {
  padding: 20px;
  .ent-info {
    &.caterer-left {
      .left {
        height: 80px;
        line-height: 80px;
      }
    }
    .mid {
      .caterer {
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>