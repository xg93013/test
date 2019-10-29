<template>
  <div id="AdvanceInspection">
    <div class="commonWidth first" style="padding:10px;">
      <div class="top-dynamic">
        <div class="fl">
          <svg-icon iconClass="tips"></svg-icon>
          <span>
            检查项目填报（普通食品生产企业类型）
            <!-- <svg-icon iconClass="error" class="tips-icon" @click.native="showTips"></svg-icon> -->
          </span>
        </div>
        <div class="fr">
          <el-button type="primary" plain @click="view">
            <svg-icon iconClass="view"></svg-icon>
            <span>预览</span>
          </el-button>
        </div>
      </div>
      <tips ref="tipsRefs" :contents="tipContent" />
      <div class="match-score">
        <div class="score-list" v-for="(item, index) in scoreList" :key="'scores'+index">
          <div class="score-name fl">{{item.checkProject == '' ? '-' : item.checkProject}}</div>
          <div class="score-item fr">
            <span class="item">
              得分比(%)：
              <label>{{item.percent}}</label>%
            </span>
            <span class="item">
              总分(去除合理缺项)：
              <label>{{item.totalScore}}</label>分
            </span>
            <span class="item">
              不符项总分值：
              <label>{{item.disagreeScore}}</label>分
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

const { TASK_TASKADVANCEMENT } = apis;

export default {
  data() {
    return {
      title: "企业体系先进性",
      showtip: false,
      tipContent:
        "可以只填写存在合理缺失项、扣分项的检测项目，系统将自动补齐剩余的检测项目。点击“填报预览”按钮，获得完整的报表结果。",
      score: {
        riskScore: 0,
        missScore: 0
      },
      scoreList: [
        // {
        //   checkProject: "",
        //   percent: 0,
        //   totalScore: 0,
        //   disagreeScore: 0,
        //   missTotal: 0
        // }
      ],
      others: "",
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
          totalScore: score[i].totalScore,
          disagreeScore: score[i].disagreeScore,
          riskScore: score[i].riskScore,
          missTotal: score[i].missTotal
        });
      }
      this.scoreList = arr;
    },
    getRemarks(txt) {
      this.others = txt;
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
      let result = this.$refs.advanceTableRefs.getResult();
      let total = 0;
      for (let i = 0; i < this.scoreList.length; i++) {
        total += this.scoreList[i].totalScore;
      }
      let form = {
        items: result,
        remark: this.others,
        advancementScore: total
      };
      return form;
    },
    validateData() {
      let result = this.$refs.advanceTableRefs.getResult();
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