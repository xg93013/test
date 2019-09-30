<template>
  <div id="AdvanceInspection">
    <div class="commonWidth first" style="padding:10px;">
      <div class="top-dynamic">
        <div class="fl">
          <svg-icon iconClass="tips"></svg-icon>
          <span>
            检查项目填报（普通食品生产企业类型）
            <svg-icon iconClass="error" class="tips-icon" @click.native="showTips"></svg-icon>
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
              <label>{{item.riskTotal}}</label>分
            </span>
            <span class="item">
              合理缺项总分值：
              <label>{{item.missTotal}}</label>分
            </span>
          </div>
        </div>
      </div>
      <DynamicTable
        :moreCheck="true"
        @getScore="getScore"
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
    <div class="commonWidth bot">
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
    </div>
  </div>
</template>
<script>
import { setStorage } from "@/utils/index.js";
import Tips from "@/components/Tips/index";
import DynamicTable from "@/components/DynamicTable/index";
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
        {
          checkProject: "",
          percent: 0,
          totalScore: 0,
          riskTotal: 0,
          missTotal: 0
        }
      ],
      others: ""
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
    }
  },
  methods: {
    showTips() {
      this.$refs.tipsRefs.show();
    },
    getScore(score) {
      let arr = [];
      for (let i = 0; i < score.length; i++) {
        let total = score[i].totalScore;
        arr.push({
          checkProject: score[i].checkProject,
          percent: Math.floor(
            (score[i].riskScore / (total - score[i].missScore)) * 100
          ),
          totalScore: total - score[i].missScore,
          riskTotal: score[i].disagreeScore,
          missTotal: score[i].missScore
        });
      }
      this.scoreList = arr;
    },
    save() {
      let result = this.$refs.dynamicTableRefs.getResult();
      console.log(result);
    },
    reset() {
      this.$refs.dynamicTableRefs.reset();
      this.others = "";
    },
    view() {
      setStorage("advanceView", {
        scoreList: this.scoreList
      });
      let routeUrl = this.$router.resolve({
        name: "预览企业体系先进性得分",
        params: {
          viewType: "viewAdvance",
          enterpriseName: this.enterpriseName
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
      width: 100%;
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
          width: 25%;
          label {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>