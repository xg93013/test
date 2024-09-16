<template>
  <div id="TaskAllocation">
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
        <el-select class="search-items" v-model="search.checkArea" placeholder="检查区域">
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

        <el-select v-model="search.taskStatus" placeholder="任务分配状态">
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
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.selected"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'taskStatus'" class="status">
              <!-- NO_MATCH  PERSON_MATCH  AUTO_MATCH -->
              <span v-if="scope.row[item.prop] == 'NO_MATCH'" class="normal">待配置</span>
              <span v-if="scope.row[item.prop] == 'PERSON_MATCH'" class="pass">手工配置完成</span>
              <span v-if="scope.row[item.prop] == 'AUTO_MATCH'" class="blue">自动匹配</span>
            </div>
            <div v-else-if="item.prop === 'enterpriseStatus'">
              <span v-if="scope.row[item.prop] == 'NORMAL'" class="normal">正常生产</span>
              <span v-if="scope.row[item.prop] == 'SEMI_SHUTDOWN'" class="blue">半停产</span>
              <span v-if="scope.row[item.prop] == 'SEASON_SHUTDOWN'" class="orange">季节性停产</span>
              <span v-if="scope.row[item.prop] == 'SHUTDOWN'" class="anomaly">停产</span>
            </div>
            <div v-else-if="item.prop === 'staticRiskScore'">
              <span>{{scope.row[item.prop] == '' ? 0 : scope.row[item.prop]}} 分</span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <span
                  @click="handleSetting(scope.$index, scope.row)"
                  v-if="scope.row['taskStatus'] == 'NO_MATCH'"
                >
                  <svg-icon iconClass="staticRisk"></svg-icon>
                  <label>配置</label>
                </span>
                <span @click="handleDetail(scope.$index, scope.row)">
                  <svg-icon iconClass="detail"></svg-icon>
                  <label>得分详情</label>
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
  EXPORT_STATICRISKFACTOR
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
          prop: "taskFinishDate",
          label: "任务完成日期",
          width: 140,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "staticRiskScore",
          label: "静态风险得分",
          width: 150,
          align: "center",
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
        pageSize: 10
      },

      statusCount: {
        personNum: 0,
        autoNum: 0,
        noNum: 0,
        allNum: 0
      },
      selectRow: [],
      pageEnum: "STATIC",
      originTree: {},
      treeId: 1
    };
  },
  components: {
    ExportExcel,
    MoreCheckbox
  },
  created() {
    this.getDefaultData();
    this.formateTree();
  },
  computed: {},
  methods: {
    setId() {
      return this.treeId++;
    },
    formateTree() {
      this.originTree = { id: "0", name: "start", children: [] };
      let arr = [
        "大类1/亚类1/次类1/细类1",
        "大类2/亚类2/次类2/细类2",
        "大类1/亚类2/次类3/细类4",
        "大类1/亚类2/次类4/细类5"
      ];
      let allLevels = [
        {
          name: "level1",
          data: []
        },
        {
          name: "level2",
          data: []
        },
        {
          name: "level3",
          data: []
        },
        {
          name: "level4",
          data: []
        }
      ];
      for (let i = 0; i < arr.length; i++) {
        let levels = arr[i].split("/");
        let [flag1, flag2, flag3, flag4] = [false, false, false, false];
        for (let j = 0; j < allLevels[0].length; j++) {
          if (allLevels[j].name == levels[0]) {
            flag1 = true;
            break;
          } else {
            continue;
          }
        }
        if (!flag1) {
          allLevels[0].data.push({
            id: this.setId(),
            parent: "start",
            name: levels[0]
          });
        }

        allLevels[1].data.push({
          id: this.setId(),
          parent: levels[0],
          name: levels[1]
        });
        allLevels[2].data.push({
          id: this.setId(),
          parent: levels[1],
          name: levels[2]
        });
        allLevels[3].data.push({
          id: this.setId(),
          parent: levels[2],
          name: levels[3]
        });
      }
      console.log(allLevels);
      for (let i = 0; i < allLevels.length; i++) {
        this.setTree(this.originTree, allLevels[i].data);
      }
      console.log(this.originTree);
    },
    setTree(node, children) {
      if (!node) {
        return;
      }
      if (node.children && node.children.length != 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.setTree(node.children[i], children);
        }
      } else {
        let origin = children;
        let arr = [];
        for (let j = 0; j < origin.length; j++) {
          if (node.name == origin[j].parent) {
            arr.push({ ...origin[j] });
          }
        }

        node.children = arr;
        console.log(arr);
      }
    },
    async getDefaultData() {
      let allplan = await http.get(PLAN);
      if (allplan) {
        let plans = allplan.data.data;
        let noMatchList = [];
        let matchList = [];
        for (let i = 0; i < plans.length; i++) {
          if (plans[i].staticNoMatch > 0) {
            noMatchList.push(plans[i]);
          } else {
            matchList.push(plans[i]);
          }
        }
        this.allPlanList = noMatchList.concat(matchList);
        if (matchList.length == this.allPlanList.length) {
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
        pageEnum: this.pageEnum
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
      this.search.planName = item.planName;
      this.search.planNo = item.planNo;
      this.search.planId = item.id;
      this.getTotalCount(item);
    },
    getTotalCount(item) {
      this.statusCount.allNum =
        item.staticAutoMatch + item.staticNoMatch + item.staticPersonMatch;
      this.statusCount.noNum = item.staticNoMatch;
      this.statusCount.personNum = item.staticPersonMatch;
      this.statusCount.autoNum = item.staticAutoMatch;
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
      if (this.search.checkArea != "" && this.search.checkArea != "total") {
        params.district = this.search.checkArea;
      }
      if (this.search.proClass != "" && this.search.proClass != "total") {
        params.productCategory = this.search.proClass;
      }
      if (this.search.taskStatus != "" && this.search.taskStatus != "total") {
        params.staticType = this.search.taskStatus;
      }

      let res = await http.get(TASKS, params);
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
            taskBeginDate: "",
            taskEndData: "",
            taskStatus: data[i].type
            // planBeginDate: data[i].plan.planBeginDate,
            // planEndDate: data[i].plan.planEndDate
          });
        }
        this.page.totalElements = res.data.data.totalElements;
        this.statusCount.allNum = res.data.data.totalElements;
      }
    },
    handleSetting(index, row) {
      // console.log(row);
      this.$router.push({
        name: "配置匹配得分",
        params: {
          matchType: "manual",
          planNo: this.search.planNo,
          taskId: row.taskId,
          taskStatus: row.taskStatus
        }
      });
    },
    handleDetail(index, row) {
      let routeUrl = this.$router.resolve({
        name: "得分详情",
        params: {
          matchType: "view",
          planNo: this.search.planNo,
          taskId: row.taskId,
          taskStatus: row.taskStatus
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
      let url = EXPORT_BASE + EXPORT_STATICRISKFACTOR;
      if (this.selectRow.length == 0) {
        this.$message.error("请先选择一条数据！");
      } else {
        if (this.selectRow.length == 1) {
          fileName = `静态风险因素评分-${this.selectRow[0].enterpriseName}-${timeStr}.zip`;
        } else {
          fileName = `静态风险因素评分-${timeStr}.zip`;
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
  },
  mounted() {}
};
</script>

<style lang="scss" scope>
</style>
