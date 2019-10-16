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
        <el-input v-model="search.keyWord" placeholder="搜索关键字" style="width: 200px;"></el-input>
        <el-select v-model="search.checkArea" placeholder="检查区域">
          <el-option
            v-for="(item,index) in checkAreaList"
            :key="index+'checkAreaList'"
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
        <!-- <down-tree
          @downTree="selectDown"
          :isLeaf="categoryTree.isLeaf"
          :backLeaf="categoryTree.backLeaf"
          :splitStr="categoryTree.splitStr"
          :showFullName="categoryTree.showFullName"
          :datas="categoryTree.originData"
          :defaultData="categoryTree.defaultData"
          :modeType="categoryTree.prop"
          icon="down"
          :ref="categoryTree.prop+'TreeRefs'"
          :placeholder="categoryTree.showSelectTips ? ('点击查看'+categoryTree.name+'筛选数据') : ('选择'+categoryTree.name+'(复选)')"
          style="width:230px;float:left;margin-right:10px;"
        ></down-tree>-->
        <el-select v-model="search.entStatus" placeholder="企业状态">
          <el-option
            v-for="(item,index) in entStatusList"
            :key="index+'enterpriseStatus'"
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
          <el-button @click="addTask" type="primary">
            <svg-icon iconClass="add"></svg-icon>
            <span>分配任务</span>
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
        <el-table-column type="index" width="60" label="序号"></el-table-column>
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
              <span class="inApproval" v-if="scope.row[item.prop] == 'INIT'">待分配</span>
              <span class="pass" v-if="scope.row[item.prop] == 'ON_SITE_INSPECTION'">已分配</span>
              <span class="anomaly" v-if="scope.row[item.prop] == 'REVIEW'">跟踪指导</span>
              <span class="approval" v-if="scope.row[item.prop] == 'APPROVE'">审批报告</span>
              <span class="orange" v-if="scope.row[item.prop] == 'ARCHIVE'">归档</span>
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
                  @click="handleSubmit(scope.$index, scope.row)"
                  v-if="scope.row['taskStatus'] == 'INIT'"
                >
                  <svg-icon iconClass="copy"></svg-icon>
                  <label>分配</label>
                </span>
                <span
                  @click="handleDetail(scope.$index, scope.row)"
                  v-if="scope.row['taskStatus'] == 'INIT'"
                >
                  <svg-icon iconClass="detail"></svg-icon>
                  <label>分配详情</label>
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
            <label>{{statusCount.allNum}}</label>个计划
          </span>

          <span v-show="statusCount.noNum!=0">
            ，待分配
            <label class="wait">{{statusCount.noNum}}</label>个
          </span>
          <span v-show="statusCount.okNum!=0">
            ，已分配
            <label class="nopass">{{statusCount.okNum}}</label>个
          </span>
          <!-- <span v-show="statusCount.APPROVE_PASS!=0">
            ，无须分配
            <label class="pass">{{statusCount.APPROVE_PASS}}</label>个
          </span>-->
        </div>
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :current-page.sync="page.currentPage"
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
// import DownTree from "@/DownTree/"
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { setStorage } from "@/utils/index.js";
const { PLAN, TASKS_ITEM, TASKS_STATUS, TASKS_SELECTITEM } = apis;
export default {
  data() {
    return {
      search: {
        keyWord: "",
        entStatus: "",
        checkArea: "",
        proClass: "",
        taskStatus: "",
        planName: "",
        planNo: ""
      },
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
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
        {
          prop: "enterpriseStatus",
          label: "企业状态",
          align: "center",
          width: 120,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskStatus",
          label: "任务状态",
          align: "center",
          width: 120,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planBeginDate",
          label: "开始日期",
          width: 120,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planEndDate",
          label: "结束日期",
          width: 120,
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
        allNum: 0,
        noNum: 0,
        okNum: 0
      },
      // enterpriseStatus: {},
      selectRow: "",
      // categoryTree: {
      //   name: "请选择食品品类",
      //   prop: "category",
      //   isLeaf: false,
      //   backLeaf: false,
      //   showFullName: true,
      //   defaultData: [],
      //   originData: [],
      //   showSelectTips: false
      // },
      enterpriseStatus: {}
    };
  },
  components: {},
  created() {
    // for (let i = 0; i < 15; i++) {
    //   this.tableData.push({
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
    this.getDefaultData();
    // this.getDatas();
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
        for (let i = 0; i < entStatus.length; i++) {
          this.entStatusList.push({
            value: entStatus[i].code,
            label: entStatus[i].msg
          });
        }
        for (let i = 0; i < taskStatus.length; i++) {
          this.taskStatusList.push({
            value: taskStatus[i].code,
            label: taskStatus[i].msg
          });
        }
      }
      // this.entStatusList = [
      //   {
      //     value: "NORMAL",
      //     label: "正常生产"
      //   },
      //   {
      //     value: "SEMI_SHUTDOWN",
      //     label: "半停产"
      //   },
      //   {
      //     value: "SEASON_SHUTDOWN",
      //     label: "季节性停产"
      //   },
      //   {
      //     value: "SHUTDOWN",
      //     label: "停产"
      //   }
      // ];
      // this.allPlanList.push({
      //   value: "201901-TXJC",
      //   label: "计划1"
      // });

      // this.proClassList = [
      //   {
      //     value: "id1",
      //     label: "品类1"
      //   }
      // ];
      // this.taskStatusList = [
      //   {
      //     value: "TOTAL",
      //     label: "全部"
      //   },
      //   {
      //     value: "UNAPPROVED",
      //     label: "待审批"
      //   },
      //   {
      //     value: "APPROVE_PASS",
      //     label: "审批通过"
      //   },
      //   {
      //     value: "APPROVE_NOT_PASS",
      //     label: "审批未通过"
      //   },
      //   {
      //     value: "EXECUTE_PLAN",
      //     label: "计划执行"
      //   }
      // ];
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
        params.taskStatus = this.search.taskStatus;
      }

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
            year: data[i].year,
            enterpriseName: data[i].enterpriseName,
            enterpriseStatus: data[i].enterpriseStatus,
            taskStatus: data[i].taskStatus,
            planBeginDate: data[i].plan.planBeginDate,
            planEndDate: data[i].plan.planEndDate
          });
        }
        this.page.totalElements = res.data.data.totalElements;
      }

      let status = await http.get(TASKS_STATUS + "/" + this.search.planNo);
      if (status) {
        console.log(status);
        this.statusCount = { ...status.data.data };
      }
    },
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    approvalDetail(index, row) {
      let routeUrl = this.$router.resolve({
        name: "审批详情",
        params: {
          planNo: row.planNo,
          planType: "approvalDetail"
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleSubmit(index, row) {
      let taskNoList = [];
      taskNoList.push(row.taskNo);
      setStorage("taskNoList", taskNoList);
      this.$router.push({
        name: "分配任务",
        params: {
          // taskNo: row.taskNo,
          planNo: this.search.planNo,
          taskType: "add"
          // planName: this.search.planName
        }
      });
    },
    handleDetail(index, row) {
      let taskNoList = [];
      taskNoList.push(row.taskNo);
      let routeUrl = this.$router.resolve({
        name: "任务预览",
        params: {
          taskType: "detail",
          planNo: this.search.planNo
          // planName: this.search.planName
        }
      });
      window.open(routeUrl.href, "_blank");
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
      this.page.currentPage = 1;
      this.getDatas();
    },
    // 批量分配
    addTask() {
      let taskNoList = [];
      if (this.selectRow != "" && this.search.planNo != "") {
        for (let i = 0; i < this.selectRow.length; i++) {
          taskNoList.push(this.selectRow[i].taskNo);
        }
        setStorage("taskNoList", taskNoList);
        this.$router.push({
          name: "分配任务",
          params: {
            // taskNo: row.taskNo,
            planNo: this.search.planNo,
            taskType: "add",
            planName: this.search.planName
          }
        });
      } else {
        this.$message.error("请先选择任务或检查计划！");
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
    selectDown() {}
  },
  mounted() {}
};
</script>

<style lang="scss" scope>
</style>
