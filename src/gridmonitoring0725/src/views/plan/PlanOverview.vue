<template>
  <div id="PlanFormulation">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="keyWord" placeholder="计划名称/编号" style="width: 200px;"></el-input>
        <el-select v-model="planName" placeholder="计划类型">
          <el-option
            v-for="(item,index) in planTypeList"
            :key="index+'plantype'"
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
        <el-select v-model="leadOrg" placeholder="牵头单位">
          <el-option
            v-for="(item,index) in leadOrgList"
            :key="index+'leadorg'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="planImplOrg" placeholder="承担单位">
          <el-option
            v-for="(item,index) in planImplOrgList"
            :key="index+'planimpl'"
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
            <div v-if="item.prop === 'status'" class="status">
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
            </div>
            <div v-else-if="item.prop === 'planDetail'">
              <span @click="handleView(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'programDetail'">
              <span
                @click="handleView(scope.$index, scope.row)"
                class="view"
                v-if="scope.row['status'] == 2"
              >
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'taskDetail'">
              <span @click="handleView(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'modeView'">
              <span @click="handleView(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'analysis'">
              <span @click="handleView(scope.$index, scope.row)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>预览</span>
              </span>
            </div>
            <div v-else-if="item.prop === 'analysisReport'">
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
                  v-if="scope.row['status'] == 1 || scope.row['status'] == 3"
                >
                  <svg-icon iconClass="edit"></svg-icon>编辑
                </span>
                <span
                  @click="approvalDetail(scope.$index, scope.row)"
                  v-if="scope.row['status'] == 1 || scope.row['status'] == 2"
                >
                  <svg-icon iconClass="edit"></svg-icon>审批详情
                </span>
                <span
                  @click="handleDelete(scope.$index, scope.row)"
                  v-if="scope.row['status'] == 3"
                >
                  <svg-icon iconClass="delete"></svg-icon>删除
                </span>
                <span
                  @click="handleCopyAdd(scope.$index, scope.row)"
                  v-if="scope.row['status'] == 4"
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
    <el-dialog title="确认提示" :visible.sync="dialogVisible" width="450px">
      <div>
        <p>是否确认删除计划</p>
        <p>{{deletePlanName}}</p>
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
      leadOrg: "",
      planImplOrg: "",
      planTypeList: [
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
      leadOrgList: [
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
      planImplOrgList: [
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
          status: 1,
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
          prop: "status",
          label: "计划状态",
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
          prop: "programDetail",
          label: "项目详情",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "taskDetail",
          label: "任务详情",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "modeView",
          label: "多维查询",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "analysis",
          label: "统计分析",
          width: 90,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "analysisReport",
          label: "分析报告",
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
        status: 1
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
    handleCopyAdd(index, row) {
      this.$router.push({
        name: "复制并新增",
        params: { planNo: row.planNo, planType: "copy" }
      });
    },
    handleDelete(index, row) {
      this.dialogVisible = true;
      this.deletePlanName = row.planName;
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
