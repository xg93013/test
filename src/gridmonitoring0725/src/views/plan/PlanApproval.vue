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
              <span v-if="scope.row[item.prop] == 1">
                <label class="noPass"></label>审核未通过
              </span>
              <span v-if="scope.row[item.prop] == 2">
                <label class="approval"></label>待审批
              </span>
              <span v-if="scope.row[item.prop] == 3">
                <label class="inApproval"></label>编制中
              </span>
              <span v-if="scope.row[item.prop] == 4">
                <label class="pass"></label>审核通过
              </span>
              <span v-if="scope.row[item.prop] == 5">
                <label class="pass"></label>计划执行
              </span>
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
                  v-if="scope.row['planStatus'] == 2"
                >
                  <svg-icon iconClass="delete"></svg-icon>审批
                </span>
                <span
                  @click="handleEdit(scope.$index, scope.row)"
                  style="color:#3a8ee6"
                  v-if="scope.row['planStatus'] == 1 || scope.row['planStatus'] == 2"
                >
                  <svg-icon iconClass="edit"></svg-icon>编辑
                </span>
                <span
                  @click="approvalDetail(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 1 || scope.row['planStatus'] == 3 || scope.row['planStatus'] == 5"
                >
                  <svg-icon iconClass="edit"></svg-icon>审批详情
                </span>
                <span
                  @click="handleSubmit(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 4"
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
          共
          <span>9</span> 个计划，编制中 3 个，待审批 1 个，审批通过 1 个， 审批未通过 1 个
        </div>
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          class="fr"
          @current-change="pageChange"
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
        <el-button type="primary" @click="deletePlan">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SortHeader from "@/components/SortHeader/index.vue";
import SortDown from "@/components/SortDown/index.vue";
import ExportExcel from "@/components/ExportExcel/index.vue";
export default {
  data() {
    return {
      keyWord: "",
      planName: "",
      planStatus: "",
      planNameList: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      planStatusList: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      //   "groupedProjectInfos": [
      //   [
      //     {
      //       "categoryLv1": "string",
      //       "categoryLv1Id": "string",
      //       "leadOrg": "string",
      //       "leadOrgId": "string",
      //       "projectName": "string",
      //       "type": "string"
      //     }
      //   ]
      // ],
      // "judgementStandard": "string",
      // "judgementStandartId": "string",
      // "planAdminOrg": "string",
      // "planAdminOrgId": "string",
      // "planBeginDate": "2019-07-24T08:59:24.976Z",
      // "planDocNo": "string",
      // "planEndDate": "2019-07-24T08:59:24.976Z",
      // "planImplOrg": "string",
      // "planImplOrgId": "string",
      // "planMemo": "string",
      // "planName": "string",
      // "planNo": "string",
      // "planType": "string",
      // "projectInfos": [
      //   {
      //     "categoryLv1": "string",
      //     "categoryLv1Id": "string",
      //     "leadOrg": "string",
      //     "leadOrgId": "string",
      //     "projectName": "string",
      //     "type": "string"
      //   }
      // ],
      // "year": 0
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
          planStatus: 2,
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
          width: 180,
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
      deletePlanName: ""
    };
  },
  components: {
    SortHeader,
    SortDown,
    ExportExcel
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.tableData.push({
        planNo: "20191" + i,
        lastUpdateAt: "2016-05-02",
        planBeginDate: "2016-05-02",
        planEndDate: "2016-05-02",
        leadOrg: "牵头单位",
        planName: "计划名称",
        planType: "计划类型",
        planImplOrg: "承担单位",
        planBatch: "计划批次",
        finishBatch: "AAA",
        planAdminOrg: "管理单位",
        planMemo: "备注",
        planStatus: 1
      });
    }
    this.page.totalElements = this.tableData.length;
  },
  computed: {},
  methods: {
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    handleView(index, row) {
      let routeUrl = this.$router.resolve({
        name: "预览计划",
        params: { planNo: row.planNo, planType: "planView" }
      });
      window.open(routeUrl.href, "_blank");
    },
    handleEdit(index, row) {
      this.$router.push({
        name: "编辑计划",
        params: { planNo: row.planNo, planType: "edit" }
      });
    },
    handleSubmit(index, row) {
      this.dialogVisible = true;
      // this.$router.push({
      //   name: "复制并新增",
      //   params: { planNo: row.planNo, planType: "copy" }
      // });
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
    },
    pageChange(page) {
      this.page.currentPage = page;
    },
    // 导出选择
    exportTable() {
      let uri = "";
      this.$refs.exportRefs.export({}, "url");
    },
    searchResult() {},
    resetSearch() {
      this.keyWord = "";
      this.planName = "";
      this.planStatus = "";
    },
    deletePlan() {
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
