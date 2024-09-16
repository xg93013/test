<template>
  <div id="PlanFormulation">
    <div class="commonWidth top-search">
      <div class="fl">
        <!-- <el-input v-model="keyWord" placeholder="搜索关键字" style="width: 200px;"></el-input> -->
        <el-select v-model="search.planName" placeholder="计划名称">
          <el-option
            v-for="(item,index) in planNameList"
            :key="index+'planname'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.planStatus" placeholder="计划状态">
          <el-option
            v-for="(item,index) in planStatusList"
            :key="index+'planstatus'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          type="date"
          placeholder="请选择计划执行时间"
          v-model="search.planStartTime"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-select v-model="search.entName" placeholder="检查企业名称">
          <el-option
            v-for="(item,index) in entNameList"
            :key="index+'entName'"
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
            <svg-icon iconClass="addPlan"></svg-icon>
            <span>新增计划</span>
          </el-button>
          <!-- <el-button slot="reference" @click="exportTable">
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
          </el-button>-->
        </div>
        <div class="fr sort">
          <!-- <sort-down
            :tableHeader="tableHeader"
            :selectProp="selectProp"
            :selectOrder="selectOrder"
            @tableSort="tableSort"
            @resetSort="resetSort"
          ></sort-down>
          <el-button @click="openDialog" style="margin-left:10px;">
            <svg-icon iconClass="list"></svg-icon>
            <span>列表</span>
          </el-button>-->
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
                <label class="noPass"></label>审批未通过
              </span>
              <span v-if="scope.row[item.prop] == 'UNAPPROVED'">
                <label class="approval"></label>待审批
              </span>
              <span v-if="scope.row[item.prop] == 'EDIT'">
                <label class="inApproval"></label>编制中
              </span>
              <span v-if="scope.row[item.prop] == 'APPROVE_PASS'">
                <label class="pass"></label>审批通过
              </span>
              <!-- APPROVE_NOT_PASS UNAPPROVED EDIT APPROVE_PASS -->
            </div>
            <div v-else-if="item.prop === 'planDetail'"></div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <span
                  @click="handleEdit(scope.$index, scope.row)"
                  style="color:#3a8ee6"
                  v-if="scope.row['planStatus'] == 'EDIT'"
                >
                  <svg-icon iconClass="edit"></svg-icon>编辑
                </span>
                <!-- <span
                  @click="approvalDetail(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'APPROVE_NOT_PASS' || scope.row['planStatus'] == 'UNAPPROVED'"
                >
                  <svg-icon iconClass="edit"></svg-icon>审批详情
                </span>-->
                <span
                  @click="handleDelete(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'EDIT'"
                >
                  <svg-icon iconClass="delete"></svg-icon>删除
                </span>
                <span
                  @click="handleView(scope.$index, scope.row)"
                  class="view"
                  v-if="scope.row['planStatus'] == 'APPROVE_PASS'"
                >
                  <svg-icon iconClass="view"></svg-icon>
                  <span>预览</span>
                </span>
                <!-- <span
                  @click="handleCopyAdd(scope.$index, scope.row)"
                  v-if="scope.row['planStatus'] == 'APPROVE_PASS'"
                >
                  <svg-icon iconClass="copy"></svg-icon>复制并新增
                </span>-->
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
          :page-sizes="[10, 20, 30, 40, 50]"
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
const { PLAN, PLAN_STATUS, PLAN_NAME } = apis;
export default {
  data() {
    return {
      search: {
        keyWord: "",
        planName: "",
        planStatus: "",
        planStartTime: ""
      },

      planNameList: [],
      planStatusList: [
        // {
        //   value: "TOTAL",
        //   label: "全部"
        // },
        // {
        //   value: "EDIT",
        //   label: "编制中"
        // },
        // {
        //   value: "UNAPPROVED",
        //   label: "待审批"
        // },
        // {
        //   value: "APPROVE_PASS",
        //   label: "审批通过"
        // },
        // {
        //   value: "APPROVE_NOT_PASS",
        //   label: "审批未通过"
        // }
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
        // {
        //   prop: "leadOrg",
        //   label: "牵头单位",
        //   width: 180,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        // {
        //   prop: "planImplOrg",
        //   label: "组织实施单位",
        //   width: 180,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        {
          prop: "planAdminOrg",
          label: "管理单位",
          width: 180,
          notSort: false,
          sortable: true,
          selected: true
        },

        // {
        //   prop: "planType",
        //   label: "计划类型",
        //   width: 140,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
        // {
        //   prop: "planMemo",
        //   label: "备注信息",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "lastUpdateAt",
        //   label: "最后更新时间",
        //   width: 140,
        //   notSort: false,
        //   sortable: true,
        //   selected: true
        // },
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
          prop: "planStatus",
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
        // prop: "lastUpdateAt",
        // order: "descending"
        prop: "",
        order: ""
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
    // this.getDefaultData();
    // this.getDatas();
  },
  computed: {},
  methods: {
    async getDefaultData() {
      this.planNameList = [];
      this.planStatusList = [];
      let planStatus = await http.get(PLAN_STATUS);
      if (planStatus) {
        console.log(planStatus);
        // this.planStatusList = planStatus;
        for (let i = 0; i < planStatus.data.length; i++) {
          this.planStatusList.push({
            label: planStatus.data[i].message,
            value: planStatus.data[i].code
          });
        }
      }
      let allplan = await http.get(PLAN);
      if (allplan) {
        let plans = allplan.data.data;
        for (let i = 0; i < plans.length; i++) {
          this.planNameList.push({
            value: plans[i].planNo,
            label: plans[i].planName
          });
          // this.allPlanList.push({
          //   value: plans[i].planNo,
          //   label: plans[i].planName
          // });
        }
      }
      // let planName = await http.get(PLAN_NAME);
      // if (planName) {
      //   for (let i = 0; i < planName.data.length; i++) {
      //     this.planNameList.push({
      //       label: planName.data[i],
      //       value: planName.data[i]
      //     });
      //   }
      // }
    },
    async getDatas() {
      // console.log("getdata");
      this.tableData = [];
      let params = {
        direction: this.selectOrder == "ascending" ? "asc" : "desc",
        // key: this.keyWord,
        // orderField: this.selectProp,
        pageNo: this.page.currentPage,
        pageNum: this.page.pageSize
        // planName: this.search.planName
        // planStatus: this.planStatus
      };
      if (this.search.planName != "") {
        params.planName = this.search.planName;
      }
      if (this.search.planStatus != "") {
        params.planStatus = this.search.planStatus;
      }
      let res = await http.get(PLAN, params);
      if (res) {
        console.log(res.data);
        this.tableData = res.data.data;
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
      this.getDatas();
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
      let res = await http.delete(PLAN + "/" + this.deletePlanNo);
      if (res.status == 200) {
        this.$message.success("删除计划成功！");
        this.$router.replace({
          path: "/refresh"
        });
      }
    }
  },
  mounted() {
    // this.selectProp = this.defaultSort.prop;
    // this.selectOrder = this.defaultSort.order;
  }
};
</script>

<style lang="scss" scope>
</style>
