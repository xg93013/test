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
          <!-- <el-popover placement="right" width="400" trigger="click">
            <div>{{tipContent}}</div>
            <div slot="reference">a</div>
          </el-popover>-->
        </div>
        <div class="fr">
          <el-button type="primary" plain @click="view">
            <svg-icon iconClass="view"></svg-icon>
            <span>预览</span>
          </el-button>
        </div>
      </div>
      <!-- <tips ref="tipsRefs" :contents="tipContent">
        <slot name="contents">
          <p>{{tipContent}}</p>
        </slot>
      </tips>-->
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
    <!-- <div class="commonWidth bot">
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
    </div>-->
  </div>
</template>
<script>
import { setStorage } from "@/utils/index.js";
import Tips from "@/components/Tips/index";
import DynamicTable from "@/components/DynamicTable/index";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { TASK_TASKDYNAMIC } = apis;
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
      others: "",
      originOthers: "",
      validateFlag: false
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
    },
    enterpriseType: {
      type: String,
      default: ""
    }
  },
  created() {},
  methods: {
    getDefaultData() {
      this.$refs.dynamicTableRefs.getTreeData();
    },
    showTips() {
      this.$refs.tipsRefs.show();
    },
    getScore(score, scoreList) {
      this.score = score;
      this.scoreList = [...scoreList];
    },
    getRemarks(txt) {
      this.others = txt;
      this.originOthers = txt;
    },
    save(changeType, page) {
      this.validateData();
      let type = "SAVE";
      let resultForm = this.getResult();
      this.submitData(type, resultForm, changeType, page);
    },
    submit() {
      let type = "COMMIT";
      let resultForm = this.getResult();
      this.submitData(type, resultForm);
    },
    getResult() {
      let result = this.$refs.dynamicTableRefs.getResult();
      let form = {
        items: result,
        remark: this.others,
        score: this.score.riskScore
      };
      return form;
    },
    validateData() {
      let result = this.$refs.dynamicTableRefs.getResult();
      if (result.length == 0) {
        this.validateFlag = false;
      } else {
        let flag = false;
        for (let i = 0; i < result.length; i++) {
          if (result[i].result == "INCONFORMITY" && result[i].remark == "") {
            flag = false;
            return false;
          }
          flag = true;
        }
        this.validateFlag = flag;
      }
    },
    async submitData(type, resultForm, changeType, page) {
      let res = await http.put(
        TASK_TASKDYNAMIC + "/" + this.taskId + "/" + type,
        resultForm
      );
      if (res) {
        let msg =
          type == "SAVE" ? "保存动态风险因素检查记录成功！" : "提交成功！";
        if (type == "SAVE") {
          this.$emit("handleResult", true, changeType, page);
          this.$message.success(msg);
        } else {
          this.$emit("handleSubmitResult", true);
        }
      }
    },
    reset() {
      this.$refs.dynamicTableRefs.reset();
      this.others = this.originOthers;
    },
    view() {
      this.$refs.dynamicTableRefs.setStorageData();
      let routeUrl = this.$router.resolve({
        name: "预览动态风险因素分值",
        params: {
          viewType: "viewDynamic",
          enterpriseName: this.enterpriseName,
          taskId: this.taskId,
          enterpriseType: this.enterpriseType
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