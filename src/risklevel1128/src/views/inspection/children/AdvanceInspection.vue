<template>
  <div id="AdvanceInspection">
    <div class="commonWidth first" style="padding:10px;">
      <div class="top-dynamic">
        <div class="fl">
          <svg-icon iconClass="tips"></svg-icon>
          <span>检查项目填报（普通食品生产企业类型）</span>
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
        <div class="score-list" v-for="(item, index) in scoreList" :key="'scores'+index">
          <div
            class="score-name fl"
            :title="item.checkProject"
          >{{item.checkProject == '' ? '-' : item.checkProject}}</div>
          <div class="score-item fr">
            <span class="item">
              得分比(%)：
              <el-popover placement="bottom" trigger="hover" popper-class="score-pop">
                <div class="score-tips">
                  <div class="common-title">计算规则</div>
                  <div class="big-title">企业管理体系得分比 = 符合、基本符和项和系统自动补齐符合项总分值 / （总分 - 合理缺项总分）</div>
                  <div class="score-box">
                    <div class="left">
                      <div class="box-item">
                        <span>得分比：</span>
                        <el-input type="text" v-model="item.percent" class="inputs" disabled></el-input>&emsp;%
                      </div>
                      <div class="box-item">
                        <span>总分：</span>
                        <el-input type="text" v-model="item.total" class="inputs" disabled></el-input>&emsp;分
                      </div>
                      <div class="box-item">
                        <span>符合、基本符合项的总分值：</span>
                        <el-input type="text" v-model="item.riskScore" class="inputs" disabled></el-input>&emsp;分
                      </div>
                      <div class="box-item">
                        <span>系统自动补齐符合项总分值：</span>
                        <el-input type="text" v-model="item.addTotal" class="inputs" disabled></el-input>&emsp;分
                      </div>
                      <div class="box-item">
                        <span>合理缺项总分值：</span>
                        <el-input type="text" v-model="item.missTotal" class="inputs" disabled></el-input>&emsp;分
                      </div>
                    </div>
                    <div class="right">
                      <p class="tips-remark">说明：</p>
                      <p class="tips-remark">1.评价结果为符合，关键项记10分，一般项记5分；评价结果为基本符合，计3分；评价结论为不符合，计0分；</p>
                      <p class="tips-remark">2.如果检查项目存在合理缺项，该项需勾选“合理缺项”，并在备注中说明，合理缺项不计分。</p>
                      <p class="tips-remark">3.得分比的数值取值规则：精确到整数，并向下取整。</p>
                    </div>
                  </div>
                </div>
                <span
                  slot="reference"
                  size="small"
                  class="bColor"
                  style="cursor:pointer;"
                >{{item.percent}}</span>
              </el-popover>%
            </span>
            <span class="item">
              总分(去除合理缺项)：
              <label>{{item.totalScore}}</label>分
            </span>
            <span class="item">
              合理缺项数：
              <label>{{item.missNum}}</label>个
            </span>
            <!-- <span class="item">
              合理缺项总分值：
              <label>{{item.missTotal}}</label>分
            </span>-->
          </div>
        </div>
      </div>
      <DynamicTable
        :moreCheck="true"
        :taskId="taskId"
        :enterpriseType="enterpriseType"
        @getScore="getScore"
        @getRemarks="getRemarks"
        ref="advanceTableRefs"
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

const { TASK_TASKADVANCEMENT } = apis;

export default {
  data() {
    return {
      title: "企业体系先进性",
      showtip: false,
      tipContent:
        "只需填写基本符合、不符合、合理缺失项的检查项目，系统将自动补齐符合的检查项目。点击“预览”按钮，获得完整结果",
      score: {
        riskScore: 0,
        missScore: 0
      },
      scoreList: [],
      others: "",
      validateFlag: -1,
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
      this.$refs.advanceTableRefs.getTreeData();
    },
    showTips() {
      this.$refs.tipsRefs.show();
    },
    getScore(score, scoreList) {
      let arr = [];
      for (let i = 0; i < score.length; i++) {
        arr.push({
          checkProject: score[i].checkProject,
          percent: score[i].percent,
          total: score[i].total,
          totalScore: score[i].totalScore,
          disagreeScore: score[i].disagreeScore,
          riskScore: score[i].riskScore,
          missTotal: score[i].missTotal,
          missNum: score[i].missNum,
          addTotal: score[i].total - score[i].selectTotal
        });
      }
      this.scoreList = arr;
    },
    getRemarks(txt) {
      this.others = txt;
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
      let result = this.$refs.advanceTableRefs.getResult();
      let total = 0;
      // if (this.scoreList.length > 0) {
      //   total = this.scoreList[0].totalScore;
      // }
      for (let i = 0; i < this.scoreList.length; i++) {
        total += this.scoreList[i].totalScore;
      }
      let form = {
        items: result,
        remark: this.others ? this.others.trim() : "",
        advancementScore: total
      };
      return form;
    },
    validateData() {
      let result = this.$refs.advanceTableRefs.getResult();
      if (result.length == 0) {
        this.validateFlag = 2;
      } else {
        let flag = -1;
        for (let i = 0; i < result.length; i++) {
          if (result[i].remark == "") {
            flag = 3;
            break;
          }
          flag = 1;
        }
        this.validateFlag = flag;
      }
    },
    async submitData(type, resultForm, changeType, page) {
      let res = await http.put(
        TASK_TASKADVANCEMENT + "/" + this.taskId + "/" + type,
        resultForm
      );
      if (res) {
        let msg =
          type == "SAVE" ? "保存企业体系先进性检查记录成功！" : "提交成功！";
        if (type == "SAVE") {
          this.$emit("handleResult", true, changeType, page);
          this.$message.success(msg);
        } else {
          this.$emit("handleSubmitResult", true);
        }
      }
    },
    reset() {
      this.$refs.advanceTableRefs.reset();
      this.others = "";
    },
    view() {
      this.$refs.advanceTableRefs.setStorageData();
      let routeUrl = this.$router.resolve({
        name: "预览企业体系先进性得分",
        params: {
          viewType: "viewAdvance",
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
#AdvanceInspection {
  .match-score {
    .score-list {
      width: calc(100% - 100px);
      margin: 10px 50px;
      overflow: hidden;
      height: 40px;
      line-height: 40px;
      .score-name {
        width: 200px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-weight: bold;
        color: #666;
      }
      .score-item {
        width: calc(100% - 200px);
        overflow: hidden;
        .item {
          display: block;
          float: left;
          width: 33.3%;
          label {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
</style>