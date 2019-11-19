<template>
  <div id="InspectionDetail">
    <div class="commonWidth">
      <div class="fl top-title">
        <svg-icon iconClass="view"></svg-icon>
        <span>{{'预览' + title + '分值'}}</span>
      </div>
      <span class="ent-name">{{enterpriseName}}</span>
      <div class="fr">
        <span
          class="top-t"
          @click="showTotal"
          :class="{'default-top':showAll}"
        >{{showAll?'恢复未补齐状态':'自动补齐数据'}}</span>
      </div>
    </div>
    <div class="commonWidth bot">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>量化分值</span>
      </div>
      <div class="view-score">
        <span v-show="!list&&viewType=='viewDynamic'">
          动态风险因素分值：
          <label class="aColor">{{score.riskScore}}</label>
          分&emsp;
          合理缺项数：
          <label class="cColor">{{score.missScore}}</label>
        </span>
        <span v-show="list&&viewType=='viewDynamic'">
          动态风险因素分值：
          <label class="aColor">{{score.riskScore}}</label>
          分
        </span>
        <el-button class="tab-btn" @click="list=!list">
          <svg-icon iconClass="list" v-show="list"></svg-icon>
          <svg-icon iconClass="total" v-show="!list"></svg-icon>
          <span>{{list?'详细':'汇总'}}</span>
        </el-button>
      </div>
      <div class="view-table">
        <el-table :data="tableData" style="width: 100%;" border v-show="list">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            v-for="(item, index) in tableColumn"
            :key="'column'+index"
            sortable
          >
            <template slot-scope="scope">
              <div v-if="scope.column.property == 'score'">
                <span>{{scope.row.score}}</span>
              </div>
              <span v-else>{{scope.row[scope.column.property]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <DynamicTable v-show="!list" :moreCheck="moreCheck" :showNum="true" type="view" /> -->
      <DynamicTable
        :moreCheck="moreCheck"
        :enterpriseType="enterpriseType"
        :taskId="taskId"
        :showNum="true"
        @getScore="getScore"
        @getRemarks="getRemarks"
        @getViewTotal="getViewTotal"
        type="view"
        ref="tableDetailRefs"
        v-show="!list"
        :title="title"
      />
    </div>
  </div>
</template>
<script>
import { getStorage } from "@/utils/index.js";
import DynamicTable from "@/components/DynamicTable/index";
export default {
  data() {
    return {
      list: true,
      tableData: [],
      tableColumn: [],
      enterpriseName: "",
      moreCheck: false,
      viewType: "",
      title: "",
      score: "",
      scoreList: "",
      showAll: false
    };
  },
  components: {
    DynamicTable
  },
  props: {},
  created() {
    let type = this.$route.params.viewType;
    this.enterpriseName = this.$route.params.enterpriseName;
    this.taskId = Number(this.$route.params.taskId);
    this.enterpriseType = this.$route.params.enterpriseType;
    this.viewType = type;
    if (type == "viewDynamic") {
      this.moreCheck = false;
      this.title = "动态风险因素";
      this.tableColumn = [
        {
          id: "a",
          label: "检查项目",
          width: 240,
          prop: "checkProject"
        },
        {
          id: "b",
          label: "总分",
          align: "center",
          prop: "totalScore"
        },
        {
          id: "c",
          label: "得分",
          align: "center",
          prop: "riskScore"
        }
      ];
      // let score = getStorage("dynamicView")[0];
      // console.log(score);
      // if (score) {
      //   this.tableData = score.scoreList;
      // }
    }
    if (type == "viewAdvance") {
      this.moreCheck = true;
      this.title = "企业体系先进性";
      this.tableColumn = [
        {
          id: "a",
          label: "检查项目",
          width: 260,
          prop: "checkProject"
        },
        {
          id: "b",
          label: "得分比",
          align: "center",
          prop: "percent"
        },
        {
          id: "c",
          label: "总分（去除合理缺项）",
          align: "center",
          prop: "totalScore"
        },
        {
          id: "d",
          label: "不符项总分值",
          align: "center",
          prop: "disagreeScore"
        },
        {
          id: "e",
          label: "合理缺项总分值",
          align: "center",
          prop: "missTotal"
        }
      ];
      // let score = getStorage("advanceView")[0];
      // if (score) {
      //   this.tableData = score.scoreList;
      // }
    }
  },
  methods: {
    getScore(score, scoreList) {
      this.score = score;
      this.scoreList = [...scoreList];
    },
    getViewTotal(data) {
      this.tableData = data;
    },
    getRemarks(data) {
      this.tableData = data;
    },
    showTotal() {
      this.showAll = !this.showAll;
      if (this.showAll) {
        this.$refs.tableDetailRefs.setViewTotalData();
      } else {
        this.$refs.tableDetailRefs.setViewData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#InspectionDetail {
  .top-t {
    display: inline-block;
    padding: 6px 0;
    width: 100px;
    border-radius: 4px;
    text-align: center;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    background: #409eff;
    &.default-top {
      background: #f5f5f5;
      color: #666;
    }
  }
  .view-score {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: relative;
    font-weight: bold;

    span {
      font-size: 16px;
      color: #666;
    }
    .tab-btn {
      position: absolute;
      top: 0;
      right: 20px;
    }
  }
  .view-table {
    margin: 20px;
  }
}
</style>