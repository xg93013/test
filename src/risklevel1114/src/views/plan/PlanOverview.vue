<template>
  <div id="PlanFormulation">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.keyWord" placeholder="搜索计划名称/编号" class="search-items"></el-input>
        <el-select v-model="search.planType" placeholder="计划类型" class="search-items">
          <el-option
            v-for="(item,index) in planTypeList"
            :key="index+'plantype'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.planStatus" placeholder="计划类型状态" class="search-items">
          <el-option
            v-for="(item,index) in planStatusList"
            :key="index+'planstatus'"
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
        :data="tableData"
        style="width: 100%"
        ref="sortTable"
        border
        @sort-change="sortChange"
      >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
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
              <span v-if="scope.row[item.prop] == 'WAIT'" class="pass">待分配任务</span>
              <span v-if="scope.row[item.prop] == 'EXECUTE_PLAN'" class="inApproval">计划执行</span>
              <span v-if="scope.row[item.prop] == 'FINISH'" class="approval">计划完成</span>
            </div>
            <div v-else-if="item.prop === 'planDetail'">
              <span @click="handleView(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'programDetail'">
              <span @click="handleProgram(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'taskDetail'">
              <span @click="handleTask(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'modeView'">
              <span @click="handleMode(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'analysis'">
              <span @click="handleAnalysis(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'analysisReport'">
              <span @click="handleReport(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
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
          @current-change="pageChange"
          @size-change="sizeChange"
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

const { PLAN_OVERVIEW, PLAN_OVERVIEW_STATUS } = apis;

export default {
  data() {
    return {
      search: {
        keyWord: "",
        planType: "",
        planStatus: ""
      },
      planTypeList: [],
      planStatusList: [],
      leadOrgList: [],
      planImplOrgList: [],
      tableData: [],
      tableHeader: [
        {
          prop: "planNo",
          label: "计划编号",
          width: 150,
          notSort: true,
          sortable: true,
          selected: true
        },
        {
          prop: "planName",
          label: "计划名称",
          width: 180,
          notSort: true,
          sortable: true,
          selected: true
        },
        {
          prop: "planStatus",
          label: "计划状态",
          width: 120,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planDetail",
          label: "计划详情",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "taskDetail",
          label: "任务详情",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "modeView",
          label: "数据查询",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "analysis",
          label: "统计分析",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
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
        pageSize: 5
      },
      dialogVisible: false,
      deletePlanName: ""
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
    //     planStatus: "WAIT"
    //   });
    // }
    // this.page.totalElements = this.tableData.length;
    // this.defaultHeader = deepClone(this.tableHeader);
    // this.getDefaultData();
    // this.getDatas();
  },
  computed: {},
  methods: {
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
    handleTask(index, row) {
      setStorage("taskIdList", row.taskId);
      let routeUrl = this.$router.resolve({
        name: "任务详情",
        params: { taskId: row.taskId }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleMode(index, row) {
      let routeUrl = this.$router.resolve({
        name: "数据查询",
        params: { name: row.planName, planNo: row.planNo }
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
      this.page.currentPage = page;
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
    searchResult() {
      this.getDatas();
    },
    resetSearch() {
      this.keyWord = "";
      this.planName = "";
      this.planStatus = "";
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
