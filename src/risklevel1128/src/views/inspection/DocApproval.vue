<template>
  <div id="DocApproval">
    <div class="commonWidth top-search">
      <div class="common-title">
        选择检查计划
        <el-select v-model="search.planName" placeholder="请选择检查计划" class="plan-list">
          <el-option
            v-for="(item,index) in allPlanList"
            :key="index+'allplan'"
            :label="item.planName"
            :value="item.planName"
            @click.native="changePlan(item,index)"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.keyWord" placeholder="企业名称" class="search-items" />
        <el-select v-model="search.checkArea" placeholder="检查区域" class="search-items">
          <el-option
            v-for="(item,index) in checkAreaList"
            :key="index+'checkArea'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.proClass" placeholder="产品类别" class="search-items">
          <el-option
            v-for="(item,index) in proClassList"
            :key="index+'proClass'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.taskStatus" placeholder="任务分配状态" class="search-items">
          <el-option
            v-for="(item,index) in taskStatusList"
            :key="index+'taskStatus'"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="fr">
        <el-button type="primary" @click="searchResult">
          <svg-icon iconClass="search"></svg-icon>
          <span>查询</span>
        </el-button>
        <el-button @click="resetSearch">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    <div class="commonWidth formulation-main">
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
              <!-- UNCHECK CHECKED  VERIFIED   审批未通过 待编制 待审批 审批通过-->
              <span v-if="scope.row[item.prop] == constant.UNAPPROVE" class="blue">待审批</span>
              <span v-if="scope.row[item.prop] == constant.APPROVED" class="normal">审批通过</span>
              <span v-if="scope.row[item.prop] == constant.APPROVEFAILED" class="anomaly">审批未通过</span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <!-- v-if="scope.row['taskStatus'] === constant.UNAPPROVE" -->
                <span
                  @click="handleEdit(scope.$index, scope.row)"
                  class="edit-data"
                  v-if="scope.row['taskStatus'] === constant.UNAPPROVE"
                >
                  <svg-icon iconClass="edit"></svg-icon>
                  <label>审批</label>
                </span>
                <span v-else @click="handleDetail(scope.$index, scope.row)">
                  <svg-icon iconClass="view"></svg-icon>
                  <label>预览</label>
                </span>
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <div class="sum fl">
          <!-- 共100份报告，待审核 2 份，审批未通过 5 份报告，审批通过 64 份报告 -->
          <!-- ，待检查 23 家，已检查 45 家企业 -->
          <span v-show="statusCount.allNum!=0">
            共
            <label>{{statusCount.allNum}}</label>份报告
          </span>
          <span v-show="statusCount.noNum!=0">
            ，待审核
            <label style="color: #0079FE">{{statusCount.noNum}}</label>份
          </span>
          <span v-show="statusCount.okNum!=0">
            审批未通过
            <label class="nopass">{{statusCount.failNum}}</label>份报告
          </span>
          <span v-show="statusCount.okNum!=0">
            审批通过
            <label class="wait">{{statusCount.okNum}}</label>份报告
          </span>
        </div>
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          class="fr"
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
    <export-excel ref="exportRefs"></export-excel>
  </div>
</template>

<script>
import ExportExcel from "@/components/ExportExcel/index.vue";
import MoreCheckbox from "@/components/MoreCheckbox/index.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { setStorage, getStorage, deepClone } from "@/utils/index.js";

const {
  PLAN,
  TASKS,
  TASKS_STATUS,
  TASKS_ITEM,
  TASKS_SELECTITEM,
  EXPORT_BASE,
  EXPORT_SPOTCHECK
} = apis;
const UNAPPROVE = "UNAPPROVE"; //待审批
const APPROVEFAILED = "APPROVEFAILED"; //审批未通过
const APPROVED = "APPROVED"; //审批通过
export default {
  data() {
    return {
      constant: {
        UNAPPROVE,
        APPROVED,
        APPROVEFAILED
      },
      search: {
        keyWord: "",
        entStatus: "",
        checkArea: "",
        proClass: "",
        taskStatus: "",
        planName: "",
        planNo: ""
      },
      // UNCHECK 待现场检查  CHECKED  待跟踪指导  VERIFIED  跟踪指导完成
      entStatusList: [
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
          id: "total"
        }
      ],
      tableData: [],
      tableHeader: [
        // {
        //   prop: "taskNo",
        //   label: "任务编号",
        //   width: 150,
        //   notSort: true,
        //   sortable: true,
        //   selected: true
        // },
        {
          prop: "enterpriseName",
          label: "企业名称",
          // width: 120,
          notSort: false,
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
          prop: "taskBeginDate",
          label: "任务开始日期",
          width: 140,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskEndDate",
          label: "任务完成日期",
          width: 140,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskStatus",
          label: "任务状态",
          width: 150,
          align: "center",
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
        pageSize: 10
      },

      statusCount: {
        okNum: 0,
        failNum: 0,
        noNum: 0,
        allNum: 0
      },
      selectRow: [],
      pageEnum: "APPROVE",
      planType: ""
    };
  },
  components: {
    ExportExcel,
    MoreCheckbox
  },
  created() {
    // this.search.planNo = "899";
    // for (let i = 0; i < 1; i++) {
    //   this.tableData.push({
    //     taskId: 990,
    //     enterpriseId: "24",
    //     taskNo: "20191" + i,
    //     lastUpdateAt: "2016-05-02",
    //     planBeginDate: "2016-05-02",
    //     planEndDate: "2016-05-02",
    //     leadOrg: "牵头单位",
    //     planName: "计划名称",
    //     planType: "计划类型",
    //     planImplOrg: "承担单位",
    //     planAdminOrg: "管理单位",
    //     planMemo: "备注",
    //     taskStatus: "EXECUTE_PLAN"
    //   });
    // }
    // this.page.totalElements = this.tableData.length;
    this.planType = this.$route.query.code;
    this.getDefaultData();
    setStorage("riskNavIndex", 0);
  },
  watch: {
    $route() {
      this.planType = this.$route.query.code;
      this.getDefaultData();
    }
  },
  computed: {},
  methods: {
    async getDefaultData() {
      this.resetSearch();
      this.checkAreaList = [
        {
          label: "全部",
          value: "total"
        }
      ];
      this.proClassList = deepClone(this.checkAreaList);
      this.taskStatusList = deepClone(this.checkAreaList);
      let allplan = await http.get(PLAN, {
        planType:
          this.planType === "FOOD_PRODUCTION"
            ? "FOOD_PRODUCTION"
            : "CATERING_BUSINESS"
      });
      if (allplan) {
        let plans = allplan.data.data;
        let uncheckedList = [];
        let checkedList = [];
        for (let i = 0; i < plans.length; i++) {
          // 待现场检查和待跟踪指导计划
          if (plans[i].unApproved > 0) {
            // this.allPlanList.push(plans[i]);
            uncheckedList.push(plans[i]);
          } else {
            checkedList.push(plans[i]);
          }
        }
        this.allPlanList = uncheckedList.concat(checkedList);
        if (checkedList.length == this.allPlanList.length) {
          this.allPlanList.sort((a, b) => {
            return b.planBeginDate - a.planBeginDate;
          });
        }

        if (this.allPlanList.length > 0) {
          let index = 0;
          this.search.planNo = this.allPlanList[index].planNo;
          this.search.planName = this.allPlanList[index].planName;
          this.search.planId = this.allPlanList[index].id;
          this.getDatas();
          this.getTotalCount(this.allPlanList[index]);
        }
      }
      let res = await http.get(TASKS_SELECTITEM, {
        pageEnum: this.pageEnum,
        enterpriseTypeEnum: this.planType
      });
      if (res) {
        let areas = res.data.data.districtList;
        let categories = res.data.data.categoryList;
        let entStatus = res.data.data.enterpriseStatusEnum;
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
        debugger
        for (let i = 0; i < taskStatus.length; i++) {
          this.taskStatusList.push({
            id: taskStatus[i].code,
            label: taskStatus[i].msg
          });
        }
      }
    },
    changePlan(item, index) {
      // console.log(item);
      // setStorage("planIndex", index);
      this.page.currentPage = 1;
      this.search = {
        keyWord: "",
        entStatus: "",
        checkArea: "",
        proClass: "",
        taskStatus: "",
        planName: item.planName,
        planNo: item.planNo,
        planId: item.id
      };
      this.getDatas();
      this.getTotalCount(item);
    },
    getTotalCount(item) {
      this.statusCount.allNum = item.approve;
      this.statusCount.noNum = item.unApproved;
      this.statusCount.failNum = item.approveFailed;
      this.statusCount.okNum = item.approved;
    },
    async getDatas() {
      this.tableData = [];
      let params = {};
      params.pageEnum = this.pageEnum;
      params.pageNo = this.page.currentPage;
      params.pageSize = this.page.pageSize;
      params.taskStatus = [];
      if (this.search.planId != "") {
        params.planId = this.search.planId;
      }
      if (this.search.keyWord != "") {
        params.enterpriseName = this.search.keyWord;
      }
      if (this.search.entStatus != "" && this.search.entStatus != "total") {
        params.enterpriseStatus = this.search.entStatus;
      }
      if (this.search.checkArea != "" && this.search.checkArea != "total") {
        params.district = this.search.checkArea;
      }
      if (this.search.proClass != "" && this.search.proClass != "total") {
        params.productCategory = this.search.proClass;
      }
      if (this.search.taskStatus != "" && this.search.taskStatus != "total") {
        params.type = this.search.taskStatus;
      }
      // if (this.search.taskStatus.length > 0) {
      //   if (this.search.taskStatus.length == this.taskStatusList.length) {
      //     params.taskStatus = [];
      //   } else {
      //     for (let i = 0; i < this.search.taskStatus.length; i++) {
      //       params.taskStatus.push(this.search.taskStatus[i].id);
      //     }
      //   }
      // }

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
            taskBeginDate: data[i].beginDate,
            taskEndDate: data[i].endDate,
            taskId: data[i].id,
            enterpriseType: data[i].enterpriseType
          });
        }
        this.page.totalElements = res.data.data.totalElements;
      }
    },
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    handleEdit(index, row) {
      this.$router.push({
        name: "审批报告",
        params: {
          taskId: Number(row.taskId),
          type: "edit"
        }
      });
    },
    handleDetail(index, row) {
      this.$router.push({
        name: "报告审批详情",
        params: {
          planNo: this.search.planNo,

          taskId: Number(row.taskId),
          type: "view"
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
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.getDatas();
    },
    sizeChange() {
      this.getDatas();
    },
    searchResult() {
      this.page.currentPage = 1;
      if (this.search.planNo == "") {
        this.$message.error("请选择检查计划！");
      } else {
        this.getDatas();
      }
    },
    resetSearch() {
      this.search = {
        keyWord: "",
        entStatus: "",
        checkArea: "",
        proClass: "",
        taskStatus: "",
        planName: "",
        planNo: ""
      };
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scope>
</style>
