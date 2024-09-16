<template>
  <div class="archive-detail">
    <div class="commonWidth top-title">
      <svg-icon iconClass="list" class="title-icon"></svg-icon>
      <span>{{title}}：-《》</span>
    </div>
    <div class="commonWidth">
      <div class="common-title">项目执行情况</div>
      <div class="archive-table m20 noSortTable">
        <el-table :data="tableData" border :span-method="objectSpanMethod">
          <el-table-column label="牵头单位" prop="leadOrg"></el-table-column>
          <el-table-column label="业态" prop="type"></el-table-column>
          <el-table-column label="农产品" prop="category"></el-table-column>
          <el-table-column label="项目名称" prop="planName"></el-table-column>
          <el-table-column label="状态" prop="planStatus">
            <template slot-scope="scope">
              <div class="status">
                <span v-if="scope.row['planStatus'] == 'APPROVE_NOT_PASS'">
                  <label class="noPass"></label>审批未通过
                </span>
                <span v-else-if="scope.row['planStatus'] == 'UNAPPROVED'">
                  <label class="inApproval"></label>待审批
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态说明" prop="planStatusDes"></el-table-column>
        </el-table>
      </div>
      <div class="operation">
        <div class="inline">
          <el-button type="primary" @click="agreeArchive">
            <svg-icon iconClass="pass"></svg-icon>
            <span>同意归档</span>
          </el-button>
          <el-button @click="back">
            <svg-icon iconClass="back"></svg-icon>
            <span>返回</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { PLAN_OVERVIEW_FILE } = apis;
export default {
  data() {
    return {
      title: "",
      tableTreeData: [],
      planTypeShow: "",
      tableData: [
        {
          leadOrg: "牵头单位",
          type: "业态",
          categoryLv1: "农产品",
          projectName: "项目名称",
          planStatus: "UNAPPROVED",
          planStatusDes: "详情"
        },
        {
          leadOrg: "牵头单位",
          type: "业态",
          categoryLv1: "农产品a",
          projectName: "项目名称",
          planStatus: "UNAPPROVED",
          planStatusDes: "详情"
        },
        {
          leadOrg: "牵头单位1",
          type: "业态",
          categoryLv1: "农产品b",
          projectName: "项目名称",
          planStatus: "UNAPPROVED",
          planStatusDes: "详情"
        }
      ],
      colObj: {}
    };
  },
  created() {
    this.formatTable();
    let type = this.$route.params.planType;
    this.planTypeShow = type;
    if (type == "archive") {
      this.title = "归档计划";
    }
    if (type == "detail") {
      this.title = "归档详情";
    }
  },
  methods: {
    formatTable() {
      this.tableTreeData = [];
      this.tableData.forEach((item, indexc) => {
        if (this.tableTreeData.length > 0) {
          let flag = false;
          let index = 0;
          for (let i = 0; i < this.tableTreeData.length; i++) {
            if (this.tableData[indexc].leadOrg == this.tableTreeData[i].name) {
              flag = true;
              index = i;
              break;
            }
          }
          if (flag) {
            this.tableTreeData[index].children.push({
              type: item.type,
              categoryLv1: item.categoryLv1,
              planStatus: item.planStatus,
              planStatusDes: item.planStatusDes,
              projectName: item.projectName
            });
          } else {
            this.tableTreeData.push({
              name: item.leadOrg,
              children: [
                {
                  type: item.type,
                  categoryLv1: item.categoryLv1,
                  planStatus: item.planStatus,
                  planStatusDes: item.planStatusDes,
                  projectName: item.projectName
                }
              ]
            });
          }
        } else {
          this.tableTreeData.push({
            name: item.leadOrg,
            children: [
              {
                type: item.type,
                categoryLv1: item.categoryLv1,
                planStatus: item.planStatus,
                planStatusDes: item.planStatusDes,
                projectName: item.projectName
              }
            ]
          });
        }
      });
      let numa = 0;
      this.colObj = {};
      this.tableTreeData.forEach((item, index) => {
        let num = 0;
        item.children.forEach((itema, indexa) => {
          num++;
        });
        this.colObj[numa] = num;
        numa = numa + num;
      });
      console.log(this.tableData);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.colObj[rowIndex]) {
          return {
            rowspan: this.colObj[rowIndex],
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    async agreeArchive() {
      let res = await http.get(PLAN_OVERVIEW_FILE, {
        planNo: this.$route.params.planNo
      });
      if (res.status == 200) {
        this.$message("操作成功！");
      } else {
        this.$message("操作失败！");
      }
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.archive-detail {
  .operation {
    width: 100%;
    border-top: 1px solid #eee;
    padding: 20px 0 0;
    text-align: center;
    .inline {
      display: inline;
    }
  }
}
</style>

