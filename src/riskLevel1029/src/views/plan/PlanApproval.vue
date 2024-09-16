<template>
  <div id="PlanFormulation">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="keyWord" placeholder="搜索关键字" style="width: 200px;"></el-input>
        <el-select v-model="planName" placeholder="计划名称">
          <el-option
            v-for="(item,index) in planNameList"
            :key="index+'planname'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="planStatus" placeholder="计划状态">
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
        <div class="fl">
          <el-button slot="reference" @click="exportTable">
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
            <!-- <svg-icon iconClass="down"></svg-icon> -->
          </el-button>
        </div>
        <!-- <div class="fr sort">
          <sort-down
            :tableHeader="tableHeader"
            :selectProp="selectProp"
            :selectOrder="selectOrder"
            @tableSort="tableSort"
            @resetSort="resetSort"
          ></sort-down>
          <el-button @click="openDialog" style="margin-left:10px;">
            <svg-icon iconClass="list"></svg-icon>
            <span>列表</span>
          </el-button>
        </div>-->
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
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.selected"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'planStatus'" class="status">
              <span v-if="scope.row[item.prop] == 'APPROVE_NOT_PASS'">
                <label class="noPass"></label>审批未通过
              </span>
              <span v-if="scope.row[item.prop] == 'UNAPPROVED'">
                <label class="approval"></label>待审批
              </span>
              <span v-if="scope.row[item.prop] == 'EXECUTE_PLAN'">
                <label class="inApproval"></label>计划执行
              </span>
              <span v-if="scope.row[item.prop] == 'APPROVE_PASS'">
                <label class="pass"></label>审批通过
              </span>
              <!-- APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS -->
            </div>
            <div v-else-if="item.prop === 'planDetail'">
              <span @click="handleView(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <span
                  @click="handleAproval(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'UNAPPROVED'"
                >
                  <svg-icon iconClass="delete"></svg-icon>审批
                </span>
                <span
                  @click="handleEdit(scope.$index, scope.row)"
                  style="color:#3a8ee6"
                  v-if="scope.row['planStatus'] == 'APPROVE_NOT_PASS' || scope.row['planStatus'] == 'UNAPPROVED'"
                >
                  <svg-icon iconClass="edit"></svg-icon>编辑
                </span>
                <span
                  @click="approvalDetail(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'APPROVE_NOT_PASS' || scope.row['planStatus'] == 'APPROVE_PASS' || scope.row['planStatus'] == 'EXECUTE_PLAN'"
                >
                  <svg-icon iconClass="edit"></svg-icon>审批详情
                </span>
                <span
                  @click="handleSubmit(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'APPROVE_PASS'"
                >
                  <svg-icon iconClass="copy"></svg-icon>发布
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
            <label class="edit">{{statusCount.EXECUTE_PLAN}}</label>个
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
    <SortHeader ref="sortRefs" :list="tableHeader" @changeHeader="changeHeader" />
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
import SortHeader from "@/components/SortHeader/index.vue";
import SortDown from "@/components/SortDown/index.vue";
import ExportExcel from "@/components/ExportExcel/index.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { PLAN_APPROVE, PLANAPPROVAL_STATUS, PLANAPPROVAL_NAME } = apis;
export default {
  data() {
    return {
      keyWord: "",
      planName: "",
      planStatus: "",
      planNameList: [
        {
          value: "计划名称",
          label: "计划名称"
        }
      ],
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
      planStatusList: [
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
          planStatus: "UNAPPROVED",
          year: ""
        }
      ],
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
          prop: "leadOrg",
          label: "牵头单位",
          width: 180,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planImplOrg",
          label: "组织实施单位",
          width: 180,
          notSort: false,
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
          prop: "planStatus",
          label: "计划状态",
          width: 120,
          notSort: false,
          sortable: true,
          selected: true
        },
        // {
        //   prop: "planBatch",
        //   label: "计划批次",
        //   width: 120,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        // {
        //   prop: "finishBatch",
        //   label: "已完成批次",
        //   width: 120,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        // {
        //   prop: "processDetail",
        //   label: "进度详情",
        //   width: 90,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "finishProgress",
        //   label: "已完成进度",
        //   width: 120,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        // {
        //   prop: "notFinishProgress",
        //   label: "未完成进度",
        //   width: 120,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        // {
        //   prop: "resultAnalize",
        //   label: "结果分析",
        //   width: 100,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        {
          prop: "planType",
          label: "计划类型",
          width: 140,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "planMemo",
          label: "备注信息",
          width: 130,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "lastUpdateAt",
          label: "最后更新时间",
          width: 140,
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
          prop: "planDetail",
          label: "计划详情",
          width: 90,
          notSort: false,
          sortable: false,
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
      selectProp: "",
      selectOrder: "",
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },
      dialogVisible: false,
      deletePlanName: "",
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
      statusCount: {
        APPROVE_NOT_PASS: 0,
        UNAPPROVED: 0,
        EXECUTE_PLAN: 0,
        APPROVE_PASS: 0,
        TOTAL: 0
      }
    };
  },
  components: {
    SortHeader,
    SortDown,
    ExportExcel
  },
  created() {
    for (let i = 0; i < 15; i++) {
      this.tableData.push({
        planNo: "20191" + i,
        lastUpdateAt: "2016-05-02",
        planBeginDate: "2016-05-02",
        planEndDate: "2016-05-02",
        leadOrg: "牵头单位",
        planName: "计划名称",
        planType: "计划类型",
        planImplOrg: "承担单位",
        planAdminOrg: "管理单位",
        planMemo: "备注",
        planStatus: "EXECUTE_PLAN"
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
      let planStatus = await http.get(PLANAPPROVAL_STATUS);
      if (planStatus) {
        // this.planStatusList = planStatus;
        for (let i = 0; i < planStatus.data.length; i++) {
          this.planStatusList.push({
            label: planStatus.data[i].message,
            value: planStatus.data[i].code
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
        planStatus: this.planStatus
      };
      let res = await http.get(PLAN_APPROVE, params);
      if (res) {
        this.tableData = res.data.content;
        this.page.totalElements = res.data.totalElements;
        this.statusCount.APPROVE_NOT_PASS = res.data.statusCount
          .APPROVE_NOT_PASS
          ? res.data.statusCount.APPROVE_NOT_PASS
          : 0;
        this.statusCount.UNAPPROVED = res.data.statusCount.UNAPPROVED
          ? res.data.statusCount.UNAPPROVED
          : 0;
        this.statusCount.EDIT = res.data.statusCount.EDIT
          ? res.data.statusCount.EDIT
          : 0;
        this.statusCount.APPROVE_PASS = res.data.statusCount.APPROVE_PASS
          ? res.data.statusCount.APPROVE_PASS
          : 0;
        this.statusCount.TOTAL = res.data.statusCount.TOTAL
          ? res.data.statusCount.TOTAL
          : 0;
        this.statusCount.EXECUTE_PLAN = res.data.statusCount.EXECUTE_PLAN
          ? res.data.statusCount.EXECUTE_PLAN
          : 0;
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
    handleAproval(index, row) {
      this.$router.push({
        name: "审批计划",
        params: {
          planNo: row.planNo,
          planType: "approval"
        }
      });
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
