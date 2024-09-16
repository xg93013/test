<template>
  <div id="TaskAllocation">
    <div class="commonWidth top-search">
      <div class="common-title">
        选择检查计划
        <el-select v-model="search.planName" placeholder="请选择检查计划" class="plan-list">
          <el-option
            v-for="(item,index) in allPlanList"
            :key="index+'allplan'"
            :label="item.planName"
            :value="item.planName"
            @click.native="changePlan(item)"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.keyWord" placeholder="企业名称" class="search-items"></el-input>
        <el-select v-model="search.checkArea" placeholder="检查区域" class="search-items">
          <el-option
            v-for="(item,index) in checkAreaList"
            :key="index+'checkAreaList'"
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
      <div class="table-top">
        <div class="fl">
          <el-button @click="exportStatic" type="primary">
            <svg-icon iconClass="export"></svg-icon>
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
          :min-width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.selected"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'taskStatus'" class="status">
              <!-- UNCHECK CHECKED  VERIFIED-->
              <span v-if="scope.row[item.prop] == 'UNCHECK'" class="normal">待现场检查</span>
              <span v-if="scope.row[item.prop] == 'CHECKED'" class="blue">{{waitName}}</span>
              <span v-if="scope.row[item.prop] == 'VERIFIED'" class="pass">{{finishName}}</span>
            </div>
            <div v-else-if="item.prop === 'enterpriseStatus'" class="status">
              <span v-if="scope.row[item.prop] == 'NORMAL'" class="normal">正常生产</span>
              <span v-if="scope.row[item.prop] == 'SEMI_SHUTDOWN'" class="blue">半停产</span>
              <span v-if="scope.row[item.prop] == 'SEASON_SHUTDOWN'" class="orange">季节性停产</span>
              <span v-if="scope.row[item.prop] == 'SHUTDOWN'" class="anomaly">停产</span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <span
                  @click="handleData(scope.$index, scope.row)"
                  v-if="scope.row['taskStatus'] == 'UNCHECK'"
                  class="edit-data"
                >
                  <svg-icon iconClass="addData"></svg-icon>
                  <label>数据填报</label>
                </span>
                <span
                  @click="handleDetail(scope.$index, scope.row)"
                  v-if="scope.row['taskStatus'] != 'UNCHECK'"
                >
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
          <span v-show="statusCount.allNum!=0">
            共
            <label>{{statusCount.allNum}}</label>家企业
          </span>
          <span v-show="statusCount.noNum!=0">
            ，待检查
            <label class="nopass">{{statusCount.noNum}}</label>家
          </span>
          <span v-show="statusCount.okNum!=0">
            ，已检查
            <label class="wait">{{statusCount.okNum}}</label>家
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
import { setStorage, getTimeStr, deepClone } from "@/utils/index.js";

const {
  PLAN,
  TASKS,
  TASKS_STATUS,
  TASKS_SELECTITEM,
  EXPORT_BASE,
  EXPORT_SPOTCHECK
} = apis;

export default {
  data() {
    return {
      search: {
        keyWord: "",
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
        {
          prop: "enterpriseName",
          label: "企业名称",
          width: 220,
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
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskEndDate",
          label: "任务完成日期",
          align: "center",
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
          width: 200,
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
        noNum: 0,
        allNum: 0
      },
      selectRow: [],
      pageEnum: "SPOT",
      pathCode: "",
      waitName: "",
      finishName: "",
      planType: ""
    };
  },
  components: {
    ExportExcel,
    MoreCheckbox
  },
  created() {
    this.pathCode = this.$route.query.code;
    this.getDefaultData();
  },
  watch: {
    $route() {
      this.pathCode = this.$route.query.code;
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
      // 生产企业检查 PRODUCTION  餐饮企业检查 CATERING_BUSINESS
      // pathCode GEN_FOOD_PRODUCT 普通食品生产企业
      this.planType = "";
      if (this.pathCode == "FOOD_PRODUCTION") {
        this.planType = "FOOD_PRODUCTION";
        this.waitName = "待跟踪指导";
        this.finishName = "跟踪指导完成";
      }
      if (this.pathCode == "CATERING_BUSINESS") {
        this.planType = "CATERING_BUSINESS";
        this.waitName = "待整改复查";
        this.finishName = "整改复查完成";
      }
      let allplan = await http.get(PLAN, {
        planType: this.planType
      });
      if (allplan) {
        let plans = allplan.data.data;

        let uncheckedList = [];
        let checkedList = [];
        for (let i = 0; i < plans.length; i++) {
          // 待现场检查和待跟踪指导计划
          if (plans[i].unchecked > 0) {
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
          this.search.planNo = this.allPlanList[0].planNo;
          this.search.planName = this.allPlanList[0].planName;
          this.search.planId = this.allPlanList[0].id;
          this.getDatas();
          this.getTotalCount(this.allPlanList[0]);
        }
      }
      let res = await http.get(TASKS_SELECTITEM, {
        pageEnum: this.pageEnum,
        enterpriseTypeEnum: this.planType
      });
      if (res) {
        let areas = res.data.data.districtList;
        let categories = res.data.data.categoryList;
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

        for (let i = 0; i < taskStatus.length; i++) {
          this.taskStatusList.push({
            id: taskStatus[i].code,
            label: taskStatus[i].msg
          });
        }
      }
    },
    changePlan(item) {
      // console.log(item);
      this.resetSearch();
      this.page.currentPage = 1;
      this.search.planName = item.planName;
      this.search.planNo = item.planNo;
      this.search.planId = item.id;
      this.getTotalCount(item);
      this.getDatas();
    },
    getTotalCount(item) {
      this.statusCount.allNum = item.unchecked + item.checked;
      this.statusCount.noNum = item.unchecked;
      this.statusCount.okNum = item.checked;
    },
    async getDatas() {
      this.tableData = [];
      let params = {};
      params.pageEnum = this.pageEnum;
      params.pageNo = this.page.currentPage;
      params.pageSize = this.page.pageSize;
      if (this.search.keyWord != "") {
        params.enterpriseName = this.search.keyWord;
      }
      if (this.search.planId != "") {
        params.planId = this.search.planId;
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
    handleData(index, row) {
      setStorage("riskNavIndex", 0);
      setStorage("enterpriseType", row.enterpriseType);
      this.$router.push({
        name: "结果填报",
        params: {
          taskId: Number(row.taskId),
          inspectionType: "edit"
        }
      });
    },
    handleDetail(index, row) {
      setStorage("viewIndex", 0);
      setStorage("enterpriseType", row.enterpriseType);
      let routeUrl = this.$router.resolve({
        name: "现场检查详情",
        params: {
          taskId: Number(row.taskId),
          inspectionType: "view"
        }
      });
      window.open(routeUrl.href, "_blank");
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
    // 导出选择
    exportStatic() {
      let params = {
        taskList: []
      };
      let fileName = "";
      let timeStr = getTimeStr();
      let url = EXPORT_BASE + EXPORT_SPOTCHECK;
      if (this.selectRow.length == 0) {
        this.$message.error("请先选择一条数据！");
      } else {
        if (this.selectRow.length == 1) {
          fileName = `现场检查记录-${this.selectRow[0].enterpriseName}-${timeStr}.zip`;
        } else {
          fileName = `现场检查记录-${timeStr}.zip`;
        }
        for (let i = 0; i < this.selectRow.length; i++) {
          params.taskList.push({
            taskId: this.selectRow[i].taskId,
            enterpriseName: this.selectRow[i].enterpriseName
          });
        }
        this.$refs.exportRefs.export(
          fileName,
          url,
          params,
          params.taskList.length
        );
      }
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
        checkArea: "",
        proClass: "",
        taskStatus: "",
        planName: "",
        planNo: ""
      };
    }
  },
  mounted() {
    setStorage("riskNavIndex", 0);
  }
};
</script>

<style lang="scss" scope>
</style>
