<template>
  <div id="DocStepthree">
    <el-table :data="tableData" style="width: 100%;margin-top:20px;" ref="historyTableRefs" border>
      <el-table-column label="动态风险因素不符情况描述" align="center">
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
        ></el-table-column>
      </el-table-column>
    </el-table>
    <!-- 企业先进性不符情况描述 -->
    <el-table
      :data="adTableData"
      style="width: 100%;margin-top:20px;"
      ref="historyTableRefs"
      border
    >
      <el-table-column label="企业先进性不符情况描述" align="center">
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'nextcloum'"
        ></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      adTableData: [],
      tableHeader: [
        {
          prop: "project",
          label: "检查项目序号",
          width: "",
          align: "left",
          sortable: false
        },
        {
          prop: "details",
          label: "问题描述",
          width: "",
          align: "center",
          sortable: false
        }
      ]
    };
  },
  props: {
    taskId: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.tableData = [
      {
        project: "a",
        details: "a"
      }
    ];
    this.adTableData = [
      {
        project: "a",
        details: "a"
      }
    ];
  }
};
</script>
<style lang="scss" scoped>
#DocStepthree {
  padding: 30px 20px;
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