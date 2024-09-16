<template>
  <div id="DocStepone">
    <div class="table-box">
      <div class="ent-info">
        <div class="left">企业信息</div>
        <div class="mid">
          <div class="item">企业名称</div>
          <div class="item">企业地址</div>
          <div class="item">营业制制造编号或信用编号</div>
          <div class="item">联系人及联系方式</div>
          <div class="item">食品经营许可证经营范围</div>
          <div class="item">企业上年度风险等级（2018）</div>
        </div>
        <div class="right">
          <div class="item back">{{data.enterpriseName}}</div>
          <div class="item back">{{data.enterpriseAddress}}</div>
          <div class="item back">{{data.enterpriseNo}}</div>
          <div class="item back">{{data.person}}</div>
          <div class="item back">{{data.productCategory}}</div>
          <div class="item back">
            <el-checkbox-group v-model="preRiskLevel">
              <el-checkbox label="A" disabled>A级</el-checkbox>
              <el-checkbox label="B" disabled>B级</el-checkbox>
              <el-checkbox label="C" disabled>C级</el-checkbox>
              <el-checkbox label="D" disabled>D级</el-checkbox>
              <el-checkbox label disabled>未注明</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="ent-info">
        <div class="left ins">现场检查日期</div>
        <div class="mid">
          <div class="item ins-item back">2019-10-01</div>
          <div class="item ins-item titles">跟踪指导日期</div>
        </div>
        <div class="right">
          <div class="item insr-item back">2018-09-01</div>
          <div class="item insr-item titles">报告签发日期</div>
          <div class="item insr-item back">2018-09-01</div>
        </div>
      </div>
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
            <div class="item back">234</div>
            <div class="item back">10</div>
            <div class="item back">10</div>
          </div>
          <div class="right-item long back">
            <el-checkbox-group v-model="riskLevel">
              <el-checkbox label="A" disabled>A级</el-checkbox>
              <el-checkbox label="B" disabled>B级</el-checkbox>
              <el-checkbox label="C" disabled>C级</el-checkbox>
              <el-checkbox label="D" disabled>D级</el-checkbox>
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
    <div class="res" v-show="!disabled">
      <div class="item">
        <span>核查：</span>
        <el-input type="text" v-model="checkPerson" :disabled="disabled"></el-input>
      </div>
      <div class="item">
        <span>复查：</span>
        <el-input type="text" v-model="repeatPerson" :disabled="disabled"></el-input>
      </div>
      <div class="item">
        <span>编制：</span>
        <el-input type="text" v-model="formulationPerson" :disabled="disabled"></el-input>
      </div>
      <div class="item">
        <span>批准：</span>
        <el-input type="text" v-model="approvalPerson" :disabled="disabled"></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone, getStorage } from "@/utils/index.js";

const {} = apis;

export default {
  data() {
    return {
      preRiskLevel: [],
      riskLevel: [],
      enterpriseType: "",
      disabled: false,
      form: {
        riskRemarks: "",
        checkPerson: "aa",
        repeatPerson: "",
        formulationPerson: "",
        approvalPerson: ""
      },
      originData: {
        riskRemarks: "",
        checkPerson: "",
        repeatPerson: "",
        formulationPerson: "",
        approvalPerson: ""
      }
    };
  },
  created() {
    this.enterpriseType = getStorage("enterpriseType")[0];
    this.disabled = this.type == "view" ? true : false;
    this.preRiskLevel = [this.data.preRiskLevel];
    this.riskLevel = [this.data.riskLevel];
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      default: ""
    }
  },
  methods: {
    async getDatas() {},
    reset() {
      this.data = deepClone(this.originData);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/DocDetail.scss";
</style>
<style lang="scss">
#DocStepone {
  .el-textarea__inner {
    border-color: none;
    border: none;
  }
  .last {
    .el-input__inner {
      border: none;
    }
  }
}
</style>