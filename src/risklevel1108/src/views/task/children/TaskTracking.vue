<template>
  <div id="TaskTracking">
    <el-table :data="tableData" style="width: 100%;margin-top:20px;" border>
      <el-table-column type="index" width="60" label="序号"></el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        :sortable="item.sortable"
        v-for="(item, index) in tableHeader"
        :key="index+'cloum'"
      >
        <template slot-scope="scope">
          <div v-if="item.prop == 'verification'">
            <el-input v-model="scope.row['verification']"></el-input>
          </div>
          <div v-else-if="item.prop == 'verificationResult'">
            <el-checkbox v-model="scope.row['verificationResult']">
              <span v-if="scope.row['verificationResult']">完成</span>
              <span v-if="!scope.row['verificationResult']">未完成</span>
            </el-checkbox>
          </div>
          <div v-else>{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableHeader: [
        {
          prop: "item",
          label: "检查项目序号",
          width: "",
          align: "left",
          sortable: false
        },
        {
          prop: "verification",
          label: "验证情况",
          width: "",
          align: "center",
          sortable: false
        },
        {
          prop: "verificationResult",
          label: "是否完成",
          width: "",
          align: "center",
          sortable: false
        }
      ],
      tableData: []
    };
  }
};
</script>
<style lang="scss" scoped>
#TaskTracking {
  padding: 20px;
}
</style>