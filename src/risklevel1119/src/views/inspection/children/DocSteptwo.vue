<template>
  <div id="DocSteptwo">
    <el-table :data="tableData" border v-if="enterpriseType==='FOOD_PRODUCTION'">
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span>
            动态风险得分（
            <label class="cColor">{{dynamicRiskScore}}</label>分）
          </span>
        </template>
        <el-table-column
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          v-for="(item, index) in tableHeader"
          :key="'table'+index"
        ></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="adTableData" border class="ad-table" v-if="enterpriseType==='FOOD_PRODUCTION'">
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span>
            体系先进性检查得分 （
            <label class="cColor">{{advancementScore}}</label> 分）
          </span>
        </template>
        <el-table-column
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          v-for="(item, index) in tableHeader"
          :key="'tablea'+index"
        ></el-table-column>
      </el-table-column>
    </el-table>
    <el-table :data="tableData" border v-if="enterpriseType!=='FOOD_PRODUCTION'">
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        :align="item.align"
        v-for="(item, index) in tableHeader"
        :key="'table'+index"
      ></el-table-column>
    </el-table>
    <p class="remarks" v-if="enterpriseType==='FOOD_PRODUCTION'">备注：对于普通食品生产企业，无须检查第9项《食品添加剂生产者管理》</p>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { TASKS_PREVIEW } = apis;
export default {
  data() {
    return {
      dynamicRiskScore: 0,
      advancementScore: 0,
      tableData: [],
      adTableData: [],

      tableHeader: [
        {
          label: "序号",
          prop: "nums",
          align: "center"
        },
        {
          label: "检查项目",
          prop: "item",
          align: "center"
        },
        {
          label: "分值（分）",
          prop: "totalScore",
          align: "center"
        },
        {
          label: "得分（分）",
          prop: "acquiredScore",
          align: "center"
        }
      ]
    };
  },
  props: {
    taskId: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ""
    },
    enterpriseType: {
      type: String,
      default: ""
    }
  },
  created() {
    this.tableData = [];
    this.adTableData = [];
    this.getData();
  },
  methods: {
    async getData() {
      let res = await http.get(TASKS_PREVIEW + "/" + this.taskId + "/2");
      if (res && res.data && res.data.code === 0) {
        let data = res.data.data;
        this.dynamicRiskScore = data.dynamicRiskScore;
        this.advancementScore = data.advancementScore;
        if (data.dynamicScoreList && data.dynamicScoreList.length > 0) {
          data.dynamicScoreList.forEach((value, i) => {
            this.tableData.push({ ...value, nums: i + 1 });
          });
        }

        if (data.advancementScoreList && data.advancementScoreList.length > 0) {
          data.advancementScoreList.forEach((value, i) => {
            this.adTableData.push({ ...value, nums: i + 1 });
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#DocSteptwo {
  padding: 30px 20px;
  .remarks {
    margin: 30px 0;
  }
}
</style>
<style lang="scss">
.ad-table {
  border-top: none;
}
.ad-table .is-group {
  tr {
    &:last-child {
      display: none;
    }
  }
}
</style>
