<template>
  <div id="Rectification">
    <div class="commonWidth top-search">
      <div class="common-title">
        选择检查计划
        <el-select
          v-model="search.planName"
          placeholder="请选择检查计划"
          class="plan-list"
          @change="changePlan"
        >
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
        <!-- <el-select class="search-items" v-model="search.checkArea" placeholder="检查区域">
          <el-option
            v-for="(item,index) in checkAreaList"
            :key="index+'checkAreaList'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->
        <el-select v-model="search.proClass" placeholder="产品类别" class="search-items">
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
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- <MoreCheckbox
          :title="search.taskStatus.length>0 ?'点击查看选择任务分配状态':'任务分配状态'"
          :allData="taskStatusList"
          :defaultData="[]"
          @backLinks="backCheck"
          class="search-items"
          style="width:210px;"
          placement="bottom-start"
        />-->
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
              <!-- NO_MATCH  PERSON_MATCH  AUTO_MATCH待整改复查 整改复查完成 -->
              <span v-if="scope.row[item.prop] == 'CHECKED'" class="normal">待{{ currPgName }}</span>
              <span v-if="scope.row[item.prop] == 'VERIFIED'" class="pass">{{ currPgName }}完成</span>
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
                  v-if="scope.row['taskStatus'] == 'CHECKED'"
                >
                  <svg-icon iconClass="addData"></svg-icon>
                  <label>数据填报</label>
                </span>
                <span
                  @click="handleDetail(scope.$index, scope.row)"
                  v-if="scope.row['taskStatus'] == 'VERIFIED'"
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
          <!-- <span v-show="statusCount.allNum!=0">
            共
            <label>{{statusCount.allNum}}</label>家企业，已自动匹配静态风险因素得分。
          </span>-->
          <!-- 共 57家企业，待配置 23家，自动配置 34 家，手工配置 34 家 -->
          <!-- <span v-show="statusCount.allNum!=0">
            共
            <label>{{statusCount.allNum}}</label>家企业
          </span>
          <span v-show="statusCount.noNum!=0">
            ，待配置
            <label class="nopass">{{statusCount.noNum}}</label>家
          </span>
          <span v-show="statusCount.autoNum!=0">
            ，自动配置
            <label class="nopass">{{statusCount.autoNum}}</label>家
          </span>
          <span v-show="statusCount.personNum!=0">
            ，手工配置
            <label class="nopass">{{statusCount.personNum}}</label>家
          </span>-->
          <span v-show="statusCount.allNum!=0">
            共
            <label>{{statusCount.allNum}}</label>家企业
          </span>
          <span v-show="statusCount.noNum!=0">
            ，待复查
            <label class="nopass">{{statusCount.noNum}}</label>家
          </span>
          <span v-show="statusCount.okNum!=0">
            ，已复查
            <label class="wait">{{statusCount.okNum}}</label>家
          </span>
        </div>
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[10, 20, 30, 40, 50]"
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
import { getTimeStr } from "@/utils/index.js";

const {
  PLAN,
  TASKS,
  TASKS_STATUS,
  TASKS_SELECTITEM,
  EXPORT_BASE,
  EXPORT_TRACKGUIDANCE
} = apis;

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
        planNo: "",
        planId: ""
      },
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
      // entNameList: [
      //   {
      //     label: "全部",
      //     value: "total"
      //   }
      // ],
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
      // NO_MATCH  PERSON_MATCH  AUTO_MATCH
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
        // {
        //   prop: "enterpriseStatus",
        //   label: "企业状态",
        //   // width: 120,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        // {
        //   prop: "proClass",
        //   label: "产品类别",
        //   width: 120,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
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
          width: 140,
          align: "center",
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
        personNum: 0,
        autoNum: 0,
        noNum: 0,
        allNum: 0
      },
      selectRow: [],
      pageEnum: "REVIEW",
      planType: "CATERING_BUSINESS"
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
    //     taskStatus: "UNCHECK"
    //   });
    // }
    // this.page.totalElements = this.tableData.length;
  },
  mounted() {
    this.currPgName = "整改复查";
    this.getDefaultData();
  },
  computed: {},
  methods: {
    async getDefaultData() {
      let allplan = await http.get(PLAN, { planType: this.planType });
      if (allplan) {
        let plans = allplan.data.data;
        let unverifiedList = [];
        let verifiedList = [];
        for (let i = 0; i < plans.length; i++) {
          // 待跟踪指导计划
          if (plans[i].unverified > 0) {
            unverifiedList.push(plans[i]);
          } else {
            verifiedList.push(plans[i]);
          }
        }
        this.allPlanList = unverifiedList.concat(verifiedList);
        if (verifiedList.length == this.allPlanList.length) {
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
        // let entName = res.data.data.enterpriseStatusEnum;
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
        // for (let i = 0; i < entName.length; i++) {
        //   this.entNameList.push({
        //     value: entName[i].code,
        //     label: entName[i].msg
        //   });
        // }
        // this.taskStatusList = [];
        for (let i = 0; i < taskStatus.length; i++) {
          this.taskStatusList.push({
            id: taskStatus[i].code,
            label: this.toCurrPgChange(taskStatus[i].msg)
          });
        }
      }
    },
    // 修改为当前页的名字命名
    toCurrPgChange(msg) {
      if (!msg) {
        return;
      }
      return msg.replace(/跟踪指导/, this.currPgName);
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
      this.statusCount.allNum = item.verified + item.unverified;
      this.statusCount.noNum = item.unverified;
      this.statusCount.okNum = item.verified;
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
      // if (this.search.entName != "" && this.search.entName != "total") {
      //   params.enterpriseStatus = this.search.entName;
      // }
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
      // console.log(params.taskStatus);

      let res = await http.get(TASKS, params);
      // console.log(res);
      if (res) {
        let data = res.data.data.content;
        this.tableData = [];
        for (let i = 0; i < data.length; i++) {
          this.tableData.push({
            taskId: data[i].id,
            year: data[i].year,
            enterpriseName: data[i].enterpriseName,
            enterpriseStatus: data[i].enterpriseStatus,
            enterpriseId: data[i].enterprise.id,
            staticRiskScore: data[i].staticRiskScore
              ? data[i].staticRiskScore
              : "-",
            taskBeginDate: data[i].beginDate,
            taskEndDate: data[i].endDate,
            taskStatus: data[i].type
            // planBeginDate: data[i].plan.planBeginDate,
            // planEndDate: data[i].plan.planEndDate
          });
        }
        this.page.totalElements = res.data.data.totalElements;
        // this.statusCount.allNum = res.data.data.totalElements;
      }
    },
    handleSetting(index, row) {
      // console.log(row);
      this.$router.push({
        name: "整改复查结果填报",
        params: {
          taskId: row.taskId,
          type: "rectification"
        }
      });
    },
    handleData(index, row) {
      this.$router.push({
        name: "整改复查结果填报",
        params: {
          taskId: Number(row.taskId),
          type: "rectification"
        }
      });
    },
    handleDetail(index, row) {
      let routeUrl = this.$router.resolve({
        name: "整改复查任务详情",
        params: {
          taskId: Number(row.taskId),
          type: "rectificationView"
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
    // 恢复默认排序
    resetSort() {
      this.$refs.sortTable.clearSort();
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
      let url = EXPORT_BASE + EXPORT_TRACKGUIDANCE;
      if (this.selectRow.length == 0) {
        this.$message.error("请先选择一条数据！");
      } else {
        if (this.selectRow.length == 1) {
          fileName = `整改复查-${this.selectRow[0].enterpriseName}-${timeStr}.zip`;
        } else {
          fileName = `整改复查-${timeStr}.zip`;
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
        entStatus: "",
        checkArea: "",
        proClass: "",
        taskStatus: "",
        planName: "",
        planNo: ""
      };
    },
    submitPlan() {
      this.$router.replace({
        path: "/refresh"
      });
    },
    backCheck(arr) {
      this.search.taskStatus = arr;
    }
  }
};
</script>

<style lang="scss" scope>
</style>
