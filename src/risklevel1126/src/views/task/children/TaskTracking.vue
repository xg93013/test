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
            <span>{{scope.row['verification']}}</span>
          </div>
          <div v-else-if="item.prop == 'verificationResult'">
            <el-radio-group v-model="scope.row['verificationResult']">
              <el-radio label="NO" class="cColor">
                <template>
                  <span class="cColor">未完成</span>
                </template>
              </el-radio>
              <el-radio label="CONTINUE">持续改进</el-radio>
              <el-radio label="YES">已完成</el-radio>
            </el-radio-group>
          </div>
          <div v-else>{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { TASKS_VERIFICATION } = apis;

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
          prop: "remark",
          label: "不符情况描述",
          width: "",
          align: "center",
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
  },
  props: {
    taskId: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let recordList = await http.get(TASKS_VERIFICATION + "/" + this.taskId);
      if (recordList) {
        let data = recordList.data.data.items;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type == "DYNAMIC_RISK") {
            this.tableData.push({
              recordId: data[i].recordId,
              type: data[i].type,
              item: data[i].item,
              remark: data[i].remark,
              verification: data[i].verification,
              verificationResult: data[i].verificationResult
            });
          }
          // if (data[i].type == "ADVANCEMENT") {
          //   this.adTableData.push({
          //     recordId: data[i].recordId,
          //     type: data[i].type,
          //     item: data[i].item,
          //     remark: data[i].remark,
          //     verification: data[i].verification,
          //     verificationResult: data[i].verificationResult
          //   });
          // }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#TaskTracking {
  padding: 20px;
}
</style>