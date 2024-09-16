<template>
  <div id="PlanFormulation">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.planName" placeholder="搜索计划名称/编号" class="search-items" clearable></el-input>
        <el-select v-model="search.planType" placeholder="计划类型" class="search-items" clearable>
          <el-option
            v-for="(item,index) in planTypeList"
            :key="index+'plantype'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.planStatus" placeholder="计划类型状态" class="search-items" clearable>
          <el-option
            v-for="(item,index) in planStatusList"
            :key="index+'planstatus'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="fr">
        <el-button type="primary" @click="searchPlan">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="commonWidth formulation-main">
      <div class="table-top">
        <div class="fr sort">
          <!-- <sort-down
            :tableHeader="tableHeader"
            :selectProp="selectProp"
            :selectOrder="selectOrder"
            @tableSort="tableSort"
            @resetSort="resetSort"
          ></sort-down>-->
          <!-- <el-button @click="openDialog" style="margin-left:10px;">
            <svg-icon iconClass="list"></svg-icon>
            <span>列表</span>
          </el-button>-->
        </div>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        style="width: 100%;min-height:280px;"
        ref="sortTable"
        border
        @sort-change="sortChange"
      >
        <!-- <el-table-column type="index" width="60" label="序号"></el-table-column> -->
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.selected"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'planStatus'" class="status">
              <!-- 待分配任务 计划执行 计划完成 -->
              <span v-if="scope.row[item.prop] == 'AUTHORIZED'" class="pass">待分配任务</span>
              <span v-if="scope.row[item.prop] == 'ACTION'" class="inApproval">计划执行</span>
              <span v-if="scope.row[item.prop] == 'APPROVE'" class="approval">计划完成</span>
            </div>
            <div v-else-if="item.prop === 'planDetail'">
              <span
                @click="handleView(scope.$index, scope.row)"
                v-show="scope.row.planDetail"
                class="view"
              >
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'programDetail'">
              <span
                @click="handleProgram(scope.$index, scope.row)"
                v-show="scope.row.programDetail"
                class="view"
              >
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'taskDetail'">
              <span
                @click="openTaskList(scope.$index, scope.row)"
                v-show="scope.row.taskDetail"
                class="view"
              >
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'dataQuery'">
              <span
                @click="handleMode(scope.$index, scope.row)"
                v-show="scope.row.dataQuery"
                class="view"
              >
                <svg-icon iconClass="search"></svg-icon>
                <span>查询</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'analysis'">
              <span
                @click="handleAnalysis(scope.$index, scope.row)"
                v-show="scope.row.analysis"
                class="view"
              >
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'analysisReport'">
              <span
                @click="handleReport(scope.$index, scope.row)"
                v-show="scope.row.analysisReport"
                class="view"
              >
                <svg-icon iconClass="downLoad"></svg-icon>
                <span>下载</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <!-- <span
                  @click="handleArchive(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'EXECUTE_PLAN'"
                >
                  <svg-icon iconClass="document"></svg-icon>归档计划
                </span>-->
                <span
                  @click="archiveDetail(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'APPROVE_NOT_PASS' || scope.row['planStatus'] == 'UNAPPROVED'"
                >
                  <svg-icon iconClass="view" style="color:#3a8ee6"></svg-icon>归档详情
                </span>
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <!-- <div class="sum fl">
          <span v-show="statusCount.TOTAL!=0">
            共
            <label>{{statusCount.TOTAL}}</label>个计划
          </span>

          <span v-show="statusCount.UNAPPROVED!=0">
            ，待审批
            <label class="wait">{{statusCount.UNAPPROVED}}</label>个
          </span>
          <span v-show="statusCount.APPROVE_NOT_PASS!=0">
            ，审批未通过
            <label class="nopass">{{statusCount.APPROVE_NOT_PASS}}</label>个
          </span>
          <span v-show="statusCount.APPROVE_PASS!=0">
            ，审批通过
            <label class="pass">{{statusCount.APPROVE_PASS}}</label>个
          </span>
          <span v-show="statusCount.EXECUTE_PLAN!=0">
            ，计划执行
            <label class="edit">{{statusCount.EDIT}}</label>个
          </span>
        </div>-->
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          class="fr"
          :current-page.sync="page.currentPage"
          @current-change="getListData"
          @size-change="getListData"
        ></el-pagination>
      </div>
    </div>
    <!-- <SortHeader
      ref="sortRefs"
      :list="tableHeader"
      @changeHeader="changeHeader"
      :defaultHeader="defaultHeader"
    />-->
    <export-excel ref="exportRefs"></export-excel>
    <el-dialog title="选择任务" :visible.sync="taskVisible">
      <div class="header-search">
        <div class="search">
          <span>任务名称：</span>
          <el-input placeholder="请输入任务名称" v-model="taskNameSearch" clearable></el-input>
          <el-button type="primary" @click="getTaskList">查询</el-button>
        </div>
      </div>
      <div>
        <el-checkbox-group v-model="taskSel" class="taskSel" @change="taskSelChange">
          <el-table
            ref="taskTable"
            v-loading="isTaskLoading"
            :data="taskData"
            border
            highlight-current-row
            @row-dblclick="toTaskDetail"
            @current-change="taskRowChange"
            max-height="500"
          >
            <el-table-column label="#" width="50">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row.id"></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column label="任务编号" prop="taskCode" width="200"></el-table-column> -->
            <el-table-column label="任务名称" prop="enterpriseName"></el-table-column>
          </el-table>
        </el-checkbox-group>
        <div style="margin-top:20px;">
          <el-pagination
            background
            layout="prev, pager, next, sizes"
            :total="page1.totalElements"
            :page-size.sync="page1.pageSize"
            :page-sizes="[10, 20, 30, 40, 50]"
            class="fr"
            :current-page.sync="page1.currentPage"
            @current-change="getTaskList"
            @size-change="getTaskList"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="taskVisible = false">取 消</el-button>
        <el-button type="primary" @click="toTaskSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确认提示" :visible.sync="dialogVisible" width="450px" top="240px">
      <div>
        <p>该计划发布后，所有牵头单位将收到指派的项目。</p>
        <p>是否确定发布计划？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import SortHeader from "@/components/SortHeader/index.vue";
// import SortDown from "@/components/SortDown/index.vue";
import ExportExcel from "@/components/ExportExcel/index.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone, setStorage } from "@/utils/index.js";

const { TASKS, PLAN_OVERVIEW, PLAN_OVERVIEW_STATUS, PLAN_ALL } = apis;

export default {
  data() {
    return {
      isTaskLoading: false,
      hasPlanId: "",
      taskSel: [],
      taskData: [],
      taskNameSearch: "",
      taskVisible: false,
      isLoading: false,
      search: {
        planName: "",
        planType: "",
        planStatus: ""
      },
      planTypeList: [
        {
          label: "所有",
          value: "total"
        },
        {
          label: "生产企业检查",
          value: "FOOD_PRODUCTION"
        },
        {
          label: "餐饮企业检查",
          value: "CATERING_BUSINESS"
        }
      ],
      planStatusList: [
        {
          label: "所有",
          value: "total"
        },
        { label: "待分配任务", value: "AUTHORIZED" },
        { label: "计划执行", value: "ACTION" },
        { label: "计划完成", value: "APPROVE" }
      ],
      leadOrgList: [],
      planImplOrgList: [],
      tableData: [],
      tableHeader: [
        {
          prop: "planNo",
          label: "计划编号",
          width: 80,
          notSort: true,
          sortable: true,
          selected: true
        },
        {
          prop: "planName",
          label: "计划名称",
          width: 250,
          notSort: true,
          sortable: true,
          selected: true
        },
        {
          prop: "planStatus",
          label: "计划状态",
          width: 120,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planDetail",
          label: "计划详情",
          width: 90,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "taskDetail",
          label: "任务详情",
          width: 90,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "dataQuery",
          label: "数据查询",
          width: 90,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        },
        // {
        //   prop: "analysis",
        //   label: "统计分析",
        //   width: 90,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        {
          prop: "analysisReport",
          label: "分析报告",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        }
        // {
        //   prop: "operation",
        //   label: "操作",
        //   width: 180,
        //   align: "center",
        //   notSort: true,
        //   sortable: false,
        //   selected: true
        // }
      ],
      defaultHeader: [],
      defaultSort: {
        prop: "lastUpdateAt",
        order: "descending"
      },
      selectProp: "",
      selectOrder: "",
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 10
      },
      page1: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 10
      },
      dialogVisible: false,
      deletePlanName: "",
      planNo: ""
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
      // statusCount: {
      //   APPROVE_NOT_PASS: 0,
      //   UNAPPROVED: 0,
      //   EXECUTE_PLAN: 0,
      //   APPROVE_PASS: 0,
      //   TOTAL: 0
      // }
    };
  },
  components: {
    ExportExcel
  },
  created() {
    // for (let i = 0; i < 1; i++) {
    //   this.tableData.push({
    //     taskId: "1215",
    //     planNo: "201901-TXJC",
    //     lastUpdateAt: "2016-05-02",
    //     planBeginDate: "2016-05-02",
    //     planEndDate: "2016-05-02",
    //     leadOrg: "牵头单位",
    //     planName: "计划名称",
    //     planType: "计划类型",
    //     planImplOrg: "承担单位",
    //     planAdminOrg: "管理单位",
    //     planMemo: "备注",
    //     planStatus: "AUTHORIZED"
    //   });
    // }
    // this.page.totalElements = 10;
    this.defaultHeader = deepClone(this.tableHeader);
    // this.getDefaultData();
    // this.getDatas();
  },
  mounted() {
    this.getListData();
  },
  computed: {},
  methods: {
    taskSelChange(val) {
      if (!val.length) {
        this.$refs.taskTable.setCurrentRow(null);
      }
    },
    toTaskSure() {
      if (!this.taskSel.length) {
        this.$message.warning("请选择任务");
        return;
      }
      this.handleTask(this.taskSel[0]);
      this.taskVisible = false;
    },
    toTaskDetail(row) {
      this.handleTask(row.id);
      this.taskVisible = false;
    },
    taskRowChange(row) {
      if (!row) {
        return;
      }
      setTimeout(() => {
        this.taskSel = [row.id];
      }, 300);
    },
    // 获取任务列表
    getTaskList() {
      this.isTaskLoading = true;
      this.taskSel = [];
      let params = {
        pageNo: this.page1.currentPage,
        pageSize: this.page1.pageSize
      };
      if (this.taskNameSearch !== "") {
        params.enterpriseName = this.taskNameSearch;
      }
      params.planId = this.hasPlanId;
      http.get(TASKS, params).then(res => {
        if (res) {
          this.taskData = res.data.data.content;
          this.page1.totalElements = res.data.data.totalElements;
          this.isTaskLoading = false;
        }
      });
    },
    // 获取计划列表
    getListData() {
      this.isLoading = true;
      let params = this.getParams();
      http.get(PLAN_ALL, params).then(res => {
        if (res) {
          let data = res.data.data;
          this.page.totalElements = data.totalElements;
          // let tableData = data.content;
          let dataArr = [];
          for (let item of data.content) {
            dataArr.push({ ...item, ...this.retOperStatus(item.planStatus) });
          }
          this.tableData = dataArr;
        }

        this.isLoading = false;
      });
    },
    getParams() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      };
      if (this.search.planName != "") {
        params.planName = this.search.planName;
      }
      if (this.search.planType != "" && this.search.planType != "total") {
        params.planType = this.search.planType;
      }
      if (this.search.planStatus != "" && this.search.planStatus != "total") {
        params.planStatus = this.search.planStatus;
      }
      return params;
    },
    // 返回table后的可选按钮的状态
    retOperStatus(status) {
      let obj = {};
      switch (status) {
        case "AUTHORIZED":
          obj = { planDetail: true };
          break; // 待分配
        case "ACTION":
          obj = { planDetail: true, taskDetail: true, dataQuery: true };
          break; // 计划执行
        case "APPROVE":
          obj = {
            planDetail: true,
            taskDetail: true,
            dataQuery: true,
            analysisReport: true
          };
          break; // 计划完成
      }
      return obj;
    },
    async getDefaultData() {
      this.planStatusList = [];
      let planStatus = await http.get(PLAN_OVERVIEW_STATUS);
      if (planStatus) {
        for (let i = 0; i < planStatus.data.length; i++) {
          this.planStatusList.push({
            label: planStatus.data[i].message,
            value: planStatus.data[i].code
          });
        }
      }
    },
    async getDatas() {
      this.tableData = [];
      let params = {};
      params.pageEnum = this.pageEnum;
      params.pageNo = this.page.currentPage;
      params.pageSize = this.page.pageSize;
      if (this.search.keyWord != "") {
        params.keyWord = this.search.keyWord;
      }
      if (this.search.planType != "" && this.search.planType != "total") {
        params.planType = this.search.planType;
      }
      if (this.search.planStatus != "" && this.search.planStatus != "total") {
        params.planStatus = this.search.planStatus;
      }

      let res = await http.get(TASKS, params);
      if (res) {
        let data = res.data.data.content;
        this.tableData = [];
        for (let i = 0; i < data.length; i++) {
          this.tableData.push({
            year: data[i].year,
            enterpriseName: data[i].enterpriseName,
            enterpriseStatus: data[i].enterpriseStatus,
            enterpriseId: data[i].enterprise.id,
            taskStatus: data[i].type,
            taskBeginDate: "",
            taskEndDate: "",
            taskId: data[i].id
          });
        }
        this.page.totalElements = res.data.data.totalElements;
      }
    },
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    handleView(index, row) {
      let routeUrl = this.$router.resolve({
        name: "预览计划",
        params: { planNo: row.planNo, planType: "planListView" }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleProgram(index, row) {},
    openTaskList(index, row) {
      this.hasPlanId = row.id;
      this.planNo = row.planNo;
      this.getTaskList();
      this.taskVisible = true;
    },
    handleTask(id) {
      // setStorage("taskIdList", row.id);
      let data = this.taskData.filter(item => item.id === id)[0];
      let routeUrl = this.$router.resolve({
        name: "任务详情",
        params: {
          taskId: id,
          enterpriseName: data.enterpriseName,
          taskStatus: data.taskStatus,
          enterpriseType: data.enterpriseType,
          planNo: this.planNo
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleMode(index, row) {
      let routeUrl = this.$router.resolve({
        name: "数据查询",
        params: {
          name: row.planName,
          planNo: row.planNo,
          planId: row.id,
          planType: row.planType
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleAnalysis(index, row) {},
    handleReport(index, row) {},
    // handleArchive(index, row) {
    //   this.$router.push({
    //     name: "归档计划",
    //     params: { planNo: row.planNo, planType: "archive" }
    //   });
    // },

    archiveDetail(index, row) {
      this.$router.push({
        name: "归档计划",
        params: { planNo: row.planNo, planType: "detail" }
      });
    },
    handleSubmit(index, row) {
      this.dialogVisible = true;
    },
    changeHeader(arr) {
      this.tableHeader = [...arr];
    },
    sortChange(obj) {
      this.selectProp = obj.prop;
      this.selectOrder = obj.order;
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
      // this.page.currentPage = page;
      // console.log(this.page.currentPage)
      this.getDatas();
    },
    sizeChange() {
      this.getDatas();
    },
    // 导出选择
    exportTable() {
      let uri = "";
      this.$refs.exportRefs.export({}, "url");
    },
    searchPlan() {
      this.page.currentPage = 1;
      this.getListData();
    },
    resetSearch() {
      this.search = {
        planName: "",
        planType: "",
        planStatus: ""
      };

      // this.page = {
      //   currentPage: 1,
      //   totalElements: 0,
      //   pageSize: 10
      // };
      // this.getListData();
    },
    submitPlan() {
      this.$router.replace({
        path: "/refresh"
      });
    }
  }
};
</script>

<style lang="scss" scope>
.header-search {
  width: 100%;
  margin-bottom: 20px;
  .search > div {
    display: inline-block;
    width: 400px;
    margin-right: 20px;
  }
}
</style>
<style lang="scss">
#PlanFormulation {
  .taskSel {
    .el-checkbox__label {
      display: none;
    }
    .el-checkbox__input {
      z-index: 999999;
    }
  }
}
</style>
