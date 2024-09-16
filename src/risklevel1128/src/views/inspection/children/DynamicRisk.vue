<template>
  <div id="DynamicRisk">
    <div class="commonWidth first" style="padding:10px;">
      <div class="top-dynamic">
        <div class="fl">
          <svg-icon iconClass="tips"></svg-icon>
          <span>检查项目填报（{{enterpriseType == 'FOOD_PRODUCTION' ? '普通食品生产企业类型':'食品餐饮经营企业'}}）</span>
          <el-popover placement="right" width="auto" trigger="click" popper-class="tipCon">
            <span>{{tipContent}}</span>
            <span slot="reference">
              <svg-icon iconClass="error" class="tips-icon"></svg-icon>
            </span>
          </el-popover>
        </div>
        <div class="fr">
          <el-button type="primary" plain @click="view">
            <svg-icon iconClass="view"></svg-icon>
            <span>预览</span>
          </el-button>
        </div>
      </div>
      <div class="match-score">
        <span>
          动态风险因素分值：
          <el-popover placement="bottom" trigger="hover" popper-class="score-pop">
            <div class="score-tips">
              <div class="common-title">计算规则</div>
              <div class="big-title">动态风险因素分值 = 不符项总分值</div>
              <div class="score-box">
                <div class="left">
                  <div class="box-item">
                    <span>动态风险因素分值：</span>
                    <el-input type="text" v-model="score.riskScore" class="inputs" disabled></el-input>&emsp;分
                  </div>
                  <div class="box-item">
                    <span>不符项总分值：</span>
                    <el-input type="text" v-model="score.disagreeScore" class="inputs" disabled></el-input>&emsp;分
                  </div>
                  <div class="box-item">
                    <span>合理缺项分值：</span>
                    <el-input type="text" v-model="score.missTotal" class="inputs" disabled></el-input>&emsp;分
                  </div>
                  <div class="box-item">
                    <span>合理缺项数：</span>
                    <el-input type="text" v-model="score.missScore" class="inputs" disabled></el-input>&emsp;个
                  </div>

                  <!-- <label>总分：</label>
                      <label>不符项总分值：</label>
                  <label>合理缺项总分值：</label>-->
                </div>
                <div class="right">
                  <p class="tips-remark">说明：</p>
                  <p
                    class="tips-remark"
                    v-show="enterpriseType=='FOOD_PRODUCTION'"
                  >1．不符项总分值超过60分时，动态风险因素分值只计算60分</p>
                  <p
                    class="tips-remark"
                  >{{enterpriseType=='FOOD_PRODUCTION' ? '2': '1' }}. 检查项目的结果判定为不合格的，扣除该项评定内容全部分值，并在备注中说明。</p>
                  <p
                    class="tips-remark"
                  >{{enterpriseType=='FOOD_PRODUCTION' ? '3': '2' }}．如果检查项目存在合理缺项，该项在备注中说明，不计入不符合项数。</p>
                  <p
                    class="tips-remark"
                  >{{enterpriseType=='FOOD_PRODUCTION' ? '4': '3' }}．扣分栏目的合计分数，即为该企业的动态风险因素分值。</p>
                </div>
              </div>
            </div>
            <label
              slot="reference"
              size="small"
              class="score-num cColor"
              style="cursor:pointer;"
            >&nbsp;{{score.riskScore}}&nbsp;</label>
          </el-popover>分&emsp;&emsp;
          合理缺项数：
          <label
            class="score-num bColor"
          >&nbsp;{{score.missScore}}&nbsp;</label>个
        </span>
      </div>
      <DynamicTable
        :moreCheck="false"
        :enterpriseType="enterpriseType"
        :taskId="taskId"
        @getScore="getScore"
        @getRemarks="getRemarks"
        ref="dynamicTableRefs"
        :type="disabled?'detail':'edit'"
        :title="title"
      />

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
            :disabled="disabled"
          ></el-input>
        </div>
      </div>
    </div>
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
        "只需填写不符合、合理缺失项的检查项目，系统将自动补齐符合的检查项目。点击“预览”按钮，获得完整结果。",
      score: {
        riskScore: 0,
        missScore: 0
      },
      scoreList: [],
      others: "",
      originOthers: "",
      validateFlag: -1, // -1 未填写完整  1 填写完整  2指定项填写不完整
      disabled: false
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
    },
    inspectionType: {
      type: String,
      default: ""
    }
  },
  created() {
    if (this.inspectionType == "view") {
      this.disabled = true;
    }
  },
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
      if (this.inspectionType != "view") {
        this.validateData();
        let type = "SAVE";
        let resultForm = this.getResult();
        this.submitData(type, resultForm, changeType, page);
      } else {
        this.$emit("handleResult", true, changeType, page);
      }
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
        this.validateFlag = 2; // 未选择检查项目
      } else {
        let flag = -1;
        for (let i = 0; i < result.length; i++) {
          if (result[i].remark == "") {
            flag = 3; // 未填写不符合项备注
            break;
          }
          flag = 1; // 配置完成
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