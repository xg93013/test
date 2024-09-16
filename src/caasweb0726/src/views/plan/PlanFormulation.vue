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
          <el-button type="primary" @click="addPlan">
            <svg-icon iconClass="add"></svg-icon>
            <span>新增计划</span>
          </el-button>
          <el-button slot="reference" @click="exportTable">
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
            <!-- <svg-icon iconClass="down"></svg-icon> -->
          </el-button>
        </div>
        <div class="fr sort">
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
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="sortTable"
        :default-sort="defaultSort"
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
              <span v-if="scope.row[item.prop] == 'APPROVE_NOT_PASS'">
                <label class="noPass"></label>审核未通过
              </span>
              <span v-if="scope.row[item.prop] == 'UNAPPROVED'">
                <label class="approval"></label>待审批
              </span>
              <span v-if="scope.row[item.prop] == 'EDIT'">
                <label class="inApproval"></label>编制中
              </span>
              <span v-if="scope.row[item.prop] == 'APPROVE_PASS'">
                <label class="pass"></label>审核通过
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
                  @click="handleEdit(scope.$index, scope.row)"
                  style="color:#3a8ee6"
                  v-if="scope.row['planStatus'] == 'APPROVE_NOT_PASS' || scope.row['planStatus'] == 'EDIT'"
                >
                  <svg-icon iconClass="edit"></svg-icon>编辑
                </span>
                <span
                  @click="approvalDetail(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'APPROVE_NOT_PASS' || scope.row['planStatus'] == 'UNAPPROVED'"
                >
                  <svg-icon iconClass="edit"></svg-icon>审批详情
                </span>
                <span
                  @click="handleDelete(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'EDIT'"
                >
                  <svg-icon iconClass="delete"></svg-icon>删除
                </span>
                <span
                  @click="handleCopyAdd(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'APPROVE_PASS'"
                >
                  <svg-icon iconClass="copy"></svg-icon>复制并新增
                </span>
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <div class="sum fl">
          <!-- APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS -->
          <span v-show="statusCount.TOTAL!=0">
            共
            <label>{{statusCount.TOTAL}}</label>个计划
          </span>
          <span v-show="statusCount.EDIT!=0">
            ，编制中
            <label class="edit">{{statusCount.EDIT}}</label>个
          </span>
          <span v-show="statusCount.UNAPPROVED!=0">
            ，待审批
            <label class="wait">{{statusCount.UNAPPROVED}}</label>个
          </span>
          <span v-show="statusCount.APPROVE_PASS!=0">
            ，审批通过
            <label class="pass">{{statusCount.APPROVE_PASS}}</label>个
          </span>
          <span v-show="statusCount.APPROVE_NOT_PASS!=0">
            ，审批未通过
            <label class="nopass">{{statusCount.APPROVE_NOT_PASS}}</label>个
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
const { PLAN } = apis;
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
      planStatusList: [
        {
          value: "TOTAL",
          label: "全部"
        },
        {
          value: "EDIT",
          label: "编制中"
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
          // finishBatch: "AAA",
          planImplOrg: "组织实施单位",
          planImplOrgId: "",
          planMemo: "备注",
          judgementStandard: "",
          judgementStandardId: "",
          planStatus: "EDIT",
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
          width: 220,
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
      defaultSort: {
        prop: "lastUpdateAt",
        order: "descending"
      },
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },
      dialogVisible: false,
      deletePlanName: "",
      deletePlanNo: "",
      // APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS
      statusCount: {
        APPROVE_NOT_PASS: 0,
        UNAPPROVED: 0,
        EDIT: 0,
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
    // for (let i = 0; i < 15; i++) {
    //   this.tableData.push({
    //     planNo: "20191" + i,
    //     lastUpdateAt: "2016-05-02",
    //     planBeginDate: "2016-05-02",
    //     planEndDate: "2016-05-02",
    //     leadOrg: "牵头单位",
    //     planName: "计划名称",
    //     planType: "计划类型",
    //     planImplOrg: "承担单位",
    //     planAdminOrg: "管理单位",
    //     planMemo: "备注",
    //     planStatus: "EDIT"
    //   });
    //   this.planNameList.push({
    //     label: "a",
    //     value: "ba"
    //   });
    // }
    // this.page.totalElements = this.tableData.length;
    this.getDatas();
  },
  computed: {},
  methods: {
    async getDatas() {
      console.log("getdata");
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
      let res = await http.get(PLAN, params);
      if (res) {
        console.log(res);
        this.tableData = res.content;
        this.page.totalElements = res.totalElements;
        this.statusCount.APPROVE_NOT_PASS = res.statusCount.APPROVE_NOT_PASS
          ? res.statusCount.APPROVE_NOT_PASS
          : 0;
        this.statusCount.UNAPPROVED = res.statusCount.UNAPPROVED
          ? res.statusCount.UNAPPROVED
          : 0;
        this.statusCount.EDIT = res.statusCount.EDIT ? res.statusCount.EDIT : 0;
        this.statusCount.APPROVE_PASS = res.statusCount.APPROVE_PASS
          ? res.statusCount.APPROVE_PASS
          : 0;
        this.statusCount.TOTAL = res.statusCount.TOTAL
          ? res.statusCount.TOTAL
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
    handleCopyAdd(index, row) {
      this.$router.push({
        name: "复制并新增",
        params: { planNo: row.planNo, planType: "copy" }
      });
    },
    handleDelete(index, row) {
      this.dialogVisible = true;
      this.deletePlanName = row.planName;
      this.deletePlanNo = row.planNo;
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
    },
    sizeChange() {
      this.getDatas();
    },
    // 导出选择
    exportTable() {
      let uri = "";
      let fileName = "";
      this.$refs.exportRefs.export(fileName, uri);
    },
    searchResult() {
      this.getDatas();
    },
    resetSearch() {
      this.keyWord = "";
      this.planName = "";
      this.planStatus = "";
    },
    addPlan() {
      this.$router.push({
        name: "新增计划",
        params: { planNo: 0, planType: "add" }
      });
    },
    async deletePlan() {
      this.$router.replace({
        path: "/refresh"
      });
    }
  },
  mounted() {
    this.selectProp = this.defaultSort.prop;
    this.selectOrder = this.defaultSort.order;
  }
};
</script>

<style lang="scss" scope>
</style>
