<template>
  <div id="InspectionDetail">
    <div class="commonWidth">
      <div class="fl top-title">
        <svg-icon iconClass="view"></svg-icon>
        <span>{{enterpriseName + '-' + title + '-' + '量化分值表'}}</span>
      </div>
      <div class="fr">
        <span class="top-t">自动补齐数据</span>
      </div>
    </div>
    <div class="commonWidth bot">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>量化分值</span>
      </div>
      <div class="view-score">
        <span v-show="viewType == 'viewDynamic'">
          实际得分：
          <label class="aColor">95.2</label>
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
      <DynamicTable v-show="!list" :moreCheck="moreCheck" :showNum="true" type="view" />
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
      title: ""
    };
  },
  components: {
    DynamicTable
  },
  props: {
    // title: {
    //   type: String,
    //   default: ""
    // }
  },
  created() {
    let type = this.$route.params.viewType;
    this.enterpriseName = this.$route.params.enterpriseName;
    this.viewType = type;
    if (type == "viewDynamic") {
      this.moreCheck = false;
      this.title = "动态风险因素";
      this.tableColumn = [
        {
          id: "a",
          label: "检查项目",
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
      let score = getStorage("dynamicView")[0];
      console.log(score);
      if (score) {
        this.tableData = score.scoreList;
      }
    }
    if (type == "viewAdvance") {
      this.moreCheck = true;
      this.title = "企业体系先进性";
      this.tableColumn = [
        {
          id: "a",
          label: "检查项目",
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
          prop: "riskTotal"
        },
        {
          id: "e",
          label: "合理缺项总分值",
          align: "center",
          prop: "missTotal"
        }
      ];
      let score = getStorage("advanceView")[0];
      if (score) {
        this.tableData = score.scoreList;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#InspectionDetail {
  .top-t {
    display: inline-block;
    padding: 4px 10px;
    font-size: 12px;
    color: #999;
    background: rgb(180, 231, 255);
  }
  .view-score {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: relative;
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