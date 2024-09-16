<template>
  <div id="TaskAllocation">
    <div class="commonWidth top-search">
      <div class="common-title">
        选择检查计划
        <el-input type="text" v-model="planName" style="width:500px;height:40px;margin-left:20px;">
          <span slot="suffix" class="suffix-icon">
            <svg-icon iconClass="down"></svg-icon>
          </span>
        </el-input>
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
        <el-select v-model="search.entName" placeholder="企业名称">
          <el-option
            v-for="(item,index) in entNameList"
            :key="index+'entName'"
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

        <el-select v-model="search.matchStatus" placeholder="匹配状态">
          <el-option
            v-for="(item,index) in matchStatusList"
            :key="index+'matchStatus'"
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
          <!-- 共 57家企业，已配置 23家，待配置 34 家 -->
          <span v-show="statusCount.TOTAL!=0">
            共
            <label>{{statusCount.TOTAL}}</label>家企业
          </span>
          <span v-show="statusCount.TOTAL!=0">
            ，已配置
            <label>{{statusCount.TOTAL}}</label>家
          </span>
          <span v-show="statusCount.TOTAL!=0">
            ，待配置
            <label>{{statusCount.TOTAL}}</label>家。
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
const { PLAN_APPROVE, PLANAPPROVAL_STATUS, PLANAPPROVAL_NAME } = apis;
export default {
  data() {
    return {
      planName: "2019年成都市食品生产经营主体食品安全风险体系检查工作",
      search: {
        keyWord: "",
        entName: "",
        checkArea: "",
        proClass: "",
        taskStatus: "",
        matchStatus: ""
      },

      planNameList: [
        {
          value: "计划名称",
          label: "计划名称"
        }
      ],
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
      entNameList: [
        {
          value: "TOTAL",
          label: "全部"
        },
        {
          value: "UNAPPROVED",
          label: "待审批"
        },
        {
          value: "APPROVE_PASS",
          label: "审批通过"
        },
        {
          value: "APPROVE_NOT_PASS",
          label: "审批未通过"
        },
        {
          value: "EXECUTE_PLAN",
          label: "计划执行"
        }
      ],
      checkAreaList: [
        {
          value: "TOTAL",
          label: "全部"
        },
        {
          value: "UNAPPROVED",
          label: "待审批"
        },
        {
          value: "APPROVE_PASS",
          label: "审批通过"
        },
        {
          value: "APPROVE_NOT_PASS",
          label: "审批未通过"
        },
        {
          value: "EXECUTE_PLAN",
          label: "计划执行"
        }
      ],
      proClassList: [
        {
          value: "TOTAL",
          label: "全部"
        },
        {
          value: "UNAPPROVED",
          label: "待审批"
        },
        {
          value: "APPROVE_PASS",
          label: "审批通过"
        },
        {
          value: "APPROVE_NOT_PASS",
          label: "审批未通过"
        },
        {
          value: "EXECUTE_PLAN",
          label: "计划执行"
        }
      ],
      taskStatusList: [
        {
          value: "TOTAL",
          label: "全部"
        },
        {
          value: "UNAPPROVED",
          label: "待审批"
        },
        {
          value: "APPROVE_PASS",
          label: "审批通过"
        },
        {
          value: "APPROVE_NOT_PASS",
          label: "审批未通过"
        },
        {
          value: "EXECUTE_PLAN",
          label: "计划执行"
        }
      ],
      matchStatusList: [
        {
          value: "TOTAL",
          label: "全部"
        },
        {
          value: "UNAPPROVED",
          label: "待审批"
        },
        {
          value: "APPROVE_PASS",
          label: "审批通过"
        },
        {
          value: "APPROVE_NOT_PASS",
          label: "审批未通过"
        },
        {
          value: "EXECUTE_PLAN",
          label: "计划执行"
        }
      ],
      tableData: [
        {
          planNo: "201901",
          planDocNo: "",
          lastUpdateAt: "2016-05-02",
          planBeginDate: "2016-05-02",
          planEndDate: "2016-05-02",
          leadOrg: "牵头单位",
          planAdminOrg: "管理单位",
          planAdminOrgId: "",
          planName: "计划名称",
          planType: "计划类型",
          planImplOrg: "组织实施单位",
          planImplOrgId: "",
          planMemo: "备注",
          judgementStandard: "",
          judgementStandardId: "",
          taskStatus: "UNAPPROVED",
          year: ""
        }
      ],
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
          // width: 120,
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
        APPROVE_NOT_PASS: 0,
        UNAPPROVED: 0,
        EXECUTE_PLAN: 0,
        APPROVE_PASS: 0,
        TOTAL: 10
      },
      selectRow: ""
    };
  },
  components: {},
  created() {
    for (let i = 0; i < 15; i++) {
      this.tableData.push({
        taskNo: "20191" + i,
        lastUpdateAt: "2016-05-02",
        planBeginDate: "2016-05-02",
        planEndDate: "2016-05-02",
        leadOrg: "牵头单位",
        planName: "计划名称",
        planType: "计划类型",
        planImplOrg: "承担单位",
        planAdminOrg: "管理单位",
        planMemo: "备注",
        taskStatus: "EXECUTE_PLAN"
      });
      this.planNameList.push({
        label: "a",
        value: "ba"
      });
    }
    this.page.totalElements = this.tableData.length;
    // this.getDefaultData();
    // this.getDatas();
  },
  computed: {},
  methods: {
    async getDefaultData() {
      this.planNameList = [];
      this.planStatusList = [];
      let taskStatus = await http.get(PLANAPPROVAL_STATUS);
      if (taskStatus) {
        // this.planStatusList = taskStatus;
        for (let i = 0; i < taskStatus.data.length; i++) {
          this.planStatusList.push({
            label: taskStatus.data[i].message,
            value: taskStatus.data[i].code
          });
        }
      }
      let planName = await http.get(PLANAPPROVAL_NAME);
      if (planName) {
        for (let i = 0; i < planName.data.length; i++) {
          this.planNameList.push({
            label: planName.data[i],
            value: planName.data[i]
          });
        }
      }
    },
    async getDatas() {
      this.tableData = [];
      let params = {
        direction: this.selectOrder == "ascending" ? "asc" : "desc",
        key: this.keyWord,
        orderField: this.selectProp,
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        planName: this.planName,
        taskStatus: this.taskStatus
      };
      let res = await http.get(PLAN_APPROVE, params);
      if (res) {
        this.tableData = res.data.content;
        this.page.totalElements = res.data.totalElements;
        // this.statusCount.APPROVE_NOT_PASS = res.data.statusCount
        //   .APPROVE_NOT_PASS
        //   ? res.data.statusCount.APPROVE_NOT_PASS
        //   : 0;
        // this.statusCount.UNAPPROVED = res.data.statusCount.UNAPPROVED
        //   ? res.data.statusCount.UNAPPROVED
        //   : 0;
        // this.statusCount.EDIT = res.data.statusCount.EDIT
        //   ? res.data.statusCount.EDIT
        //   : 0;
        // this.statusCount.APPROVE_PASS = res.data.statusCount.APPROVE_PASS
        //   ? res.data.statusCount.APPROVE_PASS
        //   : 0;
        // this.statusCount.TOTAL = res.data.statusCount.TOTAL
        //   ? res.data.statusCount.TOTAL
        //   : 0;
        // this.statusCount.EXECUTE_PLAN = res.data.statusCount.EXECUTE_PLAN
        //   ? res.data.statusCount.EXECUTE_PLAN
        //   : 0;
      }
    },
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    // approvalDetail(index, row) {
    //   let routeUrl = this.$router.resolve({
    //     name: "审批详情",
    //     params: {
    //       planNo: row.planNo,
    //       planType: "approvalDetail"
    //     }
    //   });
    //   window.open(routeUrl.href, "_blank");
    // },
    handleExport(index, row) {
      // this.$router.push({
      //   name: "分配任务",
      //   params: { taskNo: row.taskNo, taskType: "add" }
      // });
    },
    handleDetail(index, row) {
      this.$router.push({
        name: "配置匹配得分",
        params: {
          matchType: "auto"
        }
      });
    },
    handleSetting(index, row) {
      this.$router.push({
        name: "配置匹配得分",
        params: {
          matchType: "manual"
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
      this.getDatas();
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
