<template>
  <div id="PlanFormulation">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.keyWord" placeholder="搜索关键字" class="search-items"></el-input>
        <el-select v-model="search.planStatus" placeholder="计划状态" class="search-items">
          <el-option
            v-for="(item,index) in planStatusList"
            :key="index+'planstatus'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          type="daterange"
          placeholder="请选择计划执行时间"
          v-model="search.planStartTime"
          value-format="yyyy-MM-dd"
          class="search-items"
          style="width:240px;"
        ></el-date-picker>
      </div>
      <div class="fr">
        <el-button type="primary" @click="searchResult">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="commonWidth formulation-main">
      <div class="table-top">
        <div class="fl">
          <el-button type="primary" @click="addPlan">
            <svg-icon iconClass="addPlan"></svg-icon>
            <span>新增计划</span>
          </el-button>
        </div>
        <div class="fr sort"></div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="sortTable"
        :default-sort="defaultSort"
        border
        @sort-change="sortChange"
      >
        <el-table-column prop="nums" width="50" label="序号"></el-table-column>
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
              <span v-if="scope.row[item.prop] == 'INIT'" class="inApproval">编制中</span>
              <span v-if="scope.row[item.prop] != 'INIT'" class="pass">已发布</span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <span
                  @click="handleEdit(scope.$index, scope.row)"
                  style="color:#3a8ee6"
                  v-if="scope.row['planStatus'] == 'INIT'"
                >
                  <svg-icon iconClass="edit"></svg-icon>编辑
                </span>
                <span
                  @click="handleDelete(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'INIT'"
                >
                  <svg-icon iconClass="delete"></svg-icon>删除
                </span>
                <span
                  @click="handleView(scope.$index, scope.row)"
                  class="view"
                  v-if="scope.row['planStatus'] != 'INIT'"
                >
                  <svg-icon iconClass="view"></svg-icon>
                  <span>预览</span>
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
            ，编制中
            <label class="edit">{{statusCount.noNum}}</label>个
          </span>
          <span v-show="statusCount.okNum!=0">
            ，已发布
            <label class="wait">{{statusCount.okNum}}</label>个
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
    <SortHeader
      ref="sortRefs"
      :list="tableHeader"
      @changeHeader="changeHeader"
      :defaultHeader="defaultHeader"
    />
    <export-excel ref="exportRefs"></export-excel>
    <el-dialog
      title="确认提示"
      :visible.sync="dialogVisible"
      width="470px"
      custom-class="dialogVisible"
    >
      <div class="contents">
        <div class="icons">
          <svg-icon iconClass="question" class="question"></svg-icon>
        </div>
        <div class="texts">
          <p class="big">是否确认删除计划</p>
          <p>{{deletePlanName}}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SortHeader from "@/components/SortHeader/index.vue";
import SortDown from "@/components/SortDown/index.vue";
import ExportExcel from "@/components/ExportExcel/index.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone } from "@/utils/index.js";

const { PLAN_AUTHORIZED, PLAN, PLAN_STATUS } = apis;

export default {
  data() {
    return {
      search: {
        keyWord: "",
        // planName: "",
        planStatus: "",
        planStartTime: [],
        planNo: "",
        planId: ""
      },

      allPlanList: [],
      planStatusList: [
        {
          value: "total",
          label: "全部"
        },
        {
          value: "INIT",
          label: "编制中"
        },
        {
          value: "AUTHORIZED",
          label: "已发布"
        }
      ],
      entNameList: [],
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
          width: 260,
          notSort: true,
          sortable: true,
          selected: true
        },
        {
          prop: "planAdminOrg",
          label: "管理单位",
          width: 180,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planBeginDate",
          label: "开始日期",
          width: 110,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planEndDate",
          label: "结束日期",
          width: 110,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planStatus",
          label: "计划状态",
          width: 110,
          notSort: false,
          sortable: true,
          align: "center",
          selected: true
        },
        {
          prop: "operation",
          label: "操作",
          width: 190,
          align: "center",
          notSort: true,
          sortable: false,
          selected: true
        }
      ],
      defaultHeader: [],
      selectProp: "",
      selectOrder: "",
      defaultSort: {
        // prop: "lastUpdateAt",
        // order: "descending"
        prop: "",
        order: ""
      },
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 10
      },
      dialogVisible: false,
      deletePlanName: "",
      deletePlanId: "",
      statusCount: {
        okNum: 0,
        noNum: 0,
        allNum: 0
      },
      statusText: {}
    };
  },
  components: {
    SortHeader,
    SortDown,
    ExportExcel
  },
  created() {
    this.defaultHeader = deepClone(this.tableHeader);
    this.getDefaultData();
    this.getDatas();
  },
  computed: {},
  methods: {
    async getDefaultData() {
      let res = await http.get(PLAN_STATUS);
      if (res) {
        let datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].planStatus == "INIT") {
            this.statusCount.noNum = datas[i].count;
          }
          if (datas[i].planStatus == "AUTHORIZED") {
            this.statusCount.okNum = datas[i].count;
          }
        }
        this.statusCount.allNum =
          this.statusCount.noNum + this.statusCount.okNum;
      }
    },
    async getDatas() {
      this.tableData = [];
      let params = {};
      params.pageNo = this.page.currentPage;
      params.pageSize = this.page.pageSize;

      if (this.search.planStatus != "" && this.search.planStatus != "total") {
        params.planStatus = this.search.planStatus;
      }
      if (this.search.keyWord != "") {
        params.enterpriseName = this.search.keyWord;
      }
      if (this.search.planStartTime && this.search.planStartTime != []) {
        params.beginDate = this.search.planStartTime[0];
        params.endDate = this.search.planStartTime[1];
      }

      let res = await http.get(PLAN_AUTHORIZED, params);
      if (res) {
        let data = res.data.data.content;
        this.tableData = [];
        for (let i = 0; i < data.length; i++) {
          this.tableData.push({
            nums: (this.page.currentPage - 1) * this.page.pageSize + i + 1,
            planNo: data[i].planNo,
            planId: data[i].id,
            planBeginDate: data[i].planBeginDate,
            planEndDate: data[i].planEndDate,
            planName: data[i].planName,
            planType: data[i].planType,
            planAdminOrg: data[i].planAdminOrg,
            planStatus: data[i].planStatus
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
    handleEdit(index, row) {
      this.$router.push({
        name: "编辑计划",
        params: { planNo: row.planNo, planType: "edit" }
      });
    },
    handleDelete(index, row) {
      this.dialogVisible = true;
      this.deletePlanName = row.planName;
      this.deletePlanId = row.planId;
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
    pageChange(page) {
      this.page.currentPage = page;
      this.getDatas();
    },
    sizeChange() {
      this.getDatas();
    },
    searchResult() {
      this.getDatas();
    },
    resetSearch() {
      this.search = {
        planName: "",
        planStatus: "",
        planStartTime: "",
        planNo: "",
        planId: ""
      };
    },
    addPlan() {
      this.$router.push({
        name: "新增计划",
        params: { planNo: 0, planType: "add" }
      });
    },
    async deletePlan() {
      let res = await http.delete(PLAN + "/" + this.deletePlanId);
      if (res.status == 200) {
        this.$message.success("删除计划成功！");
        this.$router.replace({
          path: "/refresh"
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scope>
</style>
