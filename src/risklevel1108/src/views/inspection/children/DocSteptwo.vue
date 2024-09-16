<template>
  <div id="DocSteptwo">
    <el-table :data="tableData" border v-show="type=='edit'">
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span>
            动态风险得分（
            <label class="cColor">{{riskTotal}}</label>分）
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
    <el-table :data="adTableData" border v-show="type=='edit'" class="ad-table">
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span>
            体系先进性检查得分 （
            <label class="cColor">{{adRiskTotal}}</label> 分）
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
    <el-table :data="tableData" border v-show="type=='view'">
      <el-table-column
        :label="item.label"
        :prop="item.prop"
        :align="item.align"
        v-for="(item, index) in tableHeader"
        :key="'table'+index"
      ></el-table-column>
    </el-table>
    <p class="remarks">备注：对于普通食品生产企业，无须添加第9项《食品添加剂生产者管理》</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      riskTotal: 0,
      adRiskTotal: 0,
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
          prop: "checkProject",
          align: "center"
        },
        {
          label: "分值（分）",
          prop: "score",
          align: "center"
        },
        {
          label: "得分（分）",
          prop: "riskScore",
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
    }
  },
  created() {
    this.tableData = [];
    this.adTableData = [];
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