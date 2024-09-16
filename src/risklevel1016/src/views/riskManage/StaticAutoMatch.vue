<template>
  <div id="TaskAllocation">
    <div class="commonWidth top-search">
      <div class="common-title">
        选择检查计划
        <el-select
          v-model="search.planName"
          placeholder="请选择检查计划"
          style="width:500px;height:40px;margin-left:20px;"
          @change="changePlan"
        >
          <el-option
            v-for="(item,index) in allPlanList"
            :key="index+'allplan'"
            :label="item.label"
            :value="item"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="commonWidth top-search">
      <div class="fl">
        <!-- <el-input v-model="search.keyWord" placeholder="搜索关键字" style="width: 200px;"></el-input> -->
        <el-select v-model="search.checkArea" placeholder="检查区域">
          <el-option
            v-for="(item,index) in checkAreaList"
            :key="index+'checkAreaList'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.entName" placeholder="企业名称">
          <el-option
            v-for="(item,index) in entNameList"
            :key="index+'enterpriseStatus'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.proClass" placeholder="产品类别">
          <el-option
            v-for="(item,index) in proClassList"
            :key="index+'proClass'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select v-model="search.taskStatus" placeholder="任务分配状态">
          <el-option
            v-for="(item,index) in taskStatusList"
            :key="index+'taskStatus'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="fr">
        <el-button type="primary" @click="searchResult">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="commonWidth formulation-main">
      <div class="table-top">
        <div class="fl">
          <el-button @click="exportStatic" type="primary">
            <svg-icon iconClass="add"></svg-icon>
            <span>导出</span>
          </el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="sortTable"
        border
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column type="index" width="60" label="序号"></el-table-column> -->
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.selected"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'taskStatus'" class="status">
              <!-- <span v-if="scope.row[item.prop] == 'APPROVE_NOT_PASS'">
                <label class="noPass"></label>审批未通过
              </span>-->
              <span>
                <label class="pass"></label>待分配
              </span>
              <!-- <span>
                <label class="pass"></label>已分配
              </span>-->
            </div>
            <div v-else-if="item.prop === 'enterpriseStatus'">
              <span>
                <label class="pass"></label>正常
              </span>
              <!-- <span>
                <label class="pass"></label>异常
              </span>-->
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <!-- <span
                  @click="handleAproval(scope.$index, scope.row)"
                  v-if="scope.row['taskStatus'] == 'UNAPPROVED'"
                >
                  <svg-icon iconClass="delete"></svg-icon>审批
                </span>-->
                <span @click="handleSetting(scope.$index, scope.row)">
                  <svg-icon iconClass="edit"></svg-icon>
                  <label>配置</label>
                </span>
                <span @click="handleDetail(scope.$index, scope.row)">
                  <svg-icon iconClass="detail"></svg-icon>
                  <label>得分详情</label>
                </span>
                <span @click="handleExport(scope.$index, scope.row)">
                  <svg-icon iconClass="export"></svg-icon>
                  <label>导出</label>
                </span>
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <div class="sum fl">
          <span v-show="statusCount.TOTAL!=0">
            共
            <label>{{statusCount.TOTAL}}</label>家企业，已自动匹配静态风险因素得分。
          </span>
        </div>
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          class="fr"
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { PLAN, TASKS_ITEM, TASKS_STATUS, TASKS_SELECTITEM } = apis;
export default {
  data() {
    return {
      search: {
        keyWord: "",
        entName: "",
        checkArea: "",
        proClass: "",
        taskStatus: "",
        planName: "",
        planNo: ""
      },
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
      entNameList: [
        {
          label: "全部",
          value: "total"
        }
      ],
      allPlanList: [],
      checkAreaList: [
        {
          label: "全部",
          value: "total"
        }
      ],
      proClassList: [
        {
          label: "全部",
          value: "total"
        }
      ],
      taskStatusList: [
        {
          label: "全部",
          value: "total"
        }
      ],
      tableData: [],
      tableHeader: [
        {
          prop: "taskNo",
          label: "任务编号",
          width: 150,
          notSort: true,
          sortable: true,
          selected: true
        },
        {
          prop: "year",
          label: "评级年度",
          width: 120,
          align: "center",
          notSort: true,
          sortable: true,
          selected: true
        },
        {
          prop: "enterpriseName",
          label: "企业名称",
          width: 220,
          notSort: false,
          sortable: true,
          selected: true
        },
        // {
        //   prop: "enterpriseStatus",
        //   label: "企业状态",
        //   // width: 120,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        {
          prop: "proClass",
          label: "产品类别",
          width: 120,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskBeginDate",
          label: "任务分配日期",
          width: 140,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "staticRiskScore",
          label: "静态风险得分",
          width: 150,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskStatus",
          label: "任务状态",
          width: 150,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "operation",
          label: "操作",
          width: 240,
          align: "center",
          notSort: true,
          sortable: false,
          selected: true
        }
      ],

      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },

      statusCount: {
        TOTAL: 0
      },
      selectRow: ""
    };
  },
  components: {},
  created() {
    this.getDefaultData();
  },
  computed: {},
  methods: {
    async getDefaultData() {
      let allplan = await http.get(PLAN);
      if (allplan) {
        let plans = allplan.data.data;
        for (let i = 0; i < plans.length; i++) {
          this.allPlanList.push({
            value: plans[i].planNo,
            label: plans[i].planName
          });
        }
      }
      let res = await http.get(TASKS_SELECTITEM);
      if (res) {
        let areas = res.data.data.districtList;
        let categories = res.data.data.categoryList;
        let entName = res.data.data.enterpriseStatusEnum;
        let taskStatus = res.data.data.taskStatusEnum;
        for (let i = 0; i < areas.length; i++) {
          this.checkAreaList.push({
            value: areas[i].districtName,
            label: areas[i].districtName
          });
        }
        for (let i = 0; i < categories.length; i++) {
          this.proClassList.push({
            value: categories[i],
            label: categories[i]
          });
        }
        for (let i = 0; i < entName.length; i++) {
          this.entNameList.push({
            value: entName[i].code,
            label: entName[i].msg
          });
        }
        for (let i = 0; i < taskStatus.length; i++) {
          this.taskStatusList.push({
            value: taskStatus[i].code,
            label: taskStatus[i].msg
          });
        }
      }
    },
    changePlan(item) {
      console.log(item);
      this.search.planName = item.label;
      this.search.planNo = item.value;
    },
    async getDatas() {
      this.tableData = [];
      let params = {};
      if (this.search.planNo != "" && this.search.planNo != "total") {
        params.planNo = this.search.planNo;
      }
      if (this.search.keyWord != "") {
        params.enterpriseName = this.search.keyWord;
      }
      // if (this.search.entName != "" && this.search.entName != "total") {
      //   params.enterpriseStatus = this.search.entName;
      // }
      if (this.search.checkArea != "" && this.search.checkArea != "total") {
        params.district = this.search.checkArea;
      }
      if (this.search.proClass != "" && this.search.proClass != "total") {
        params.productCategory = this.search.proClass;
      }
      // if (this.search.taskStatus != "" && this.search.taskStatus != "total") {
      //   params.taskStatus = this.search.taskStatus;
      // }

      let res = await http.get(
        TASKS_ITEM + "/" + this.page.currentPage + "/" + this.page.pageSize,
        params
      );
      if (res) {
        let data = res.data.data.content;
        this.tableData = [];
        for (let i = 0; i < data.length; i++) {
          this.tableData.push({
            taskNo: data[i].taskNo,
            taskId: data[i].id,
            year: data[i].year,
            enterpriseName: data[i].enterpriseName,
            enterpriseStatus: data[i].enterpriseStatus,
            enterpriseId: data[i].enterprise.id,
            proClass: data[i].productCategory,
            staticRiskScore: data[i].staticRisk,
            taskBeginDate: data[i].assignDate
            // planBeginDate: data[i].plan.planBeginDate,
            // planEndDate: data[i].plan.planEndDate
          });
        }
        this.page.totalElements = res.data.data.totalElements;
        this.statusCount.TOTAL = res.data.data.totalElements;
      }
    },
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    handleExport(index, row) {
      // this.$router.push({
      //   name: "分配任务",
      //   params: { taskNo: row.taskNo, taskType: "add" }
      // });
    },
    handleSetting(index, row) {
      console.log(row);
      this.$router.push({
        name: "配置匹配得分",
        params: {
          matchType: "manual",
          planNo: this.search.planNo,
          taskId: row.taskId,
          taskNo: row.taskNo
        }
      });
    },
    handleDetail(index, row) {
      this.$router.push({
        name: "得分详情",
        params: {
          matchType: "auto",
          planNo: this.search.planNo,
          taskId: row.taskId
        }
      });
    },
    changeHeader(arr) {
      this.tableHeader = [...arr];
    },
    sortChange(obj) {
      // this.selectProp = obj.prop;
      // this.selectOrder = obj.order;
    },
    handleSelectionChange(val) {
      this.selectRow = val;
      console.log(this.selectRow);
    },
    // 恢复默认排序
    resetSort() {
      this.$refs.sortTable.clearSort();
    },
    // 下拉排序
    tableSort(prop, order) {
      this.$refs.sortTable.sort(prop, order);
      this.getDatas();
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.getDatas();
    },
    sizeChange() {
      this.getDatas();
    },
    // 导出选择
    exportStatic() {},
    searchResult() {
      this.page.currentPage = 1;
      if (this.search.planNo == "") {
        this.$message.error("请选择检查计划！");
      } else {
        this.getDatas();
      }
    },
    resetSearch() {
      this.keyWord = "";
      this.planName = "";
      this.taskStatus = "";
    },
    submitPlan() {
      this.$router.replace({
        path: "/refresh"
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scope>
</style>
