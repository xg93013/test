<template>
  <div class="more-dimension">
    <div class="commonWidth dimension-top">
      <div class="left">
        <div class="search-item">
          <div class="label common-title">计划</div>
          <div class="list">
            <el-input v-model="name" class="list-t" style="width:470px;" disabled></el-input>
          </div>
        </div>
        <div class="search-item">
          <div class="label common-title">筛选条件</div>
          <div class="list">
            <div class="list-box">
              <div class="list-item">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width:100%;"
                ></el-date-picker>
              </div>
              <div class="list-item">
                <!-- <MoreCheckbox
                  :title="search.taskStatus.length>0?'点击查看选择任务':'请选择任务阶段'"
                  :allData="taskStepOpt"
                  placement="bottom-start"
                  @backLinks="getTaskStep"
                  :defaultData="[]"
                />-->
                <el-select
                  style="width:100%;"
                  multiple
                  collapse-tags
                  placeholder="请选择任务阶段"
                  v-model="search.taskStatus"
                  clearable
                >
                  <el-option
                    v-for="(item, idx) in taskStepOpt"
                    :key="idx"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div class="list-item">
                <!-- <down-tree
                  @downTree="selectArea"
                  :isLeaf="false"
                  :data="areaTree"
                  :defaultData="[]"
                  ref="areaTreeRefs"
                  icon="list"
                  placeholder="选择区域（复选）"
                  placement="bottom-end"
                ></down-tree>-->
                <el-select
                  style="width:100%;"
                  multiple
                  collapse-tags
                  placeholder="请选择区域"
                  @change="districtChange"
                  v-model="search.districts"
                  clearable
                >
                  <el-option
                    v-for="(item, idx) in districtOpt"
                    :key="idx"
                    :label="item.districtName"
                    :value="item.districtId"
                  ></el-option>
                </el-select>
              </div>
              <div class="list-item">
                <!-- <el-input v-model="person" placeholder="选择人员" @click.native="selectPerson">
                  <svg-icon iconClass="list" slot="suffix"></svg-icon>
                </el-input>-->
                <el-select
                  style="width:100%;"
                  multiple
                  collapse-tags
                  placeholder="请选择人员"
                  @change="personChange"
                  v-model="search.persons"
                  clearable
                >
                  <el-option
                    v-for="(item, idx) in personsOpt"
                    :key="idx"
                    :label="item.name"
                    :value="item.account"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="list-box">
              <div class="list-item"></div>
            </div>
          </div>
        </div>
        <div class="search-item">
          <div class="label common-title">风险等级</div>
          <div class="list">
            <!-- <el-checkbox
              v-for="(item, index) in riskLevel"
              @click="selectRisk(item)"
              :key="'risklevel'+index"
              v-model="item.checked"
            >{{item.label}}</el-checkbox>-->
            <el-checkbox
              class="mar-r50"
              :indeterminate="isIndeterminate"
              v-model="levelCheckAll"
              @change="handleCheckAllChange"
            >全部</el-checkbox>
            <el-checkbox-group
              v-model="search.levels"
              @change="handleCheckChange"
              style="display: inline-block;"
            >
              <el-checkbox
                class="mar-r50"
                v-for="(item,idx) in levelOpt"
                :key="idx"
                :label="item"
              >{{ item || '（空）' }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" class="btns" @click="getData">
          <svg-icon iconClass="search"></svg-icon>
          <span>查询</span>
        </el-button>
        <el-button class="btns" @click="resetSearch">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    <div class="commonWidth dimension-table">
      <div class="table-top">
        <div class="fl">
          <el-button slot="reference" type="primary" @click="exportTable">
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
          </el-button>
        </div>
        <div class="fr sort">
          <sort-down
            :tableHeader="tableHeader"
            :selectProp="selectProp"
            :selectOrder="selectOrder"
            :defaultSort="defaultSort"
            @tableSort="tableSort"
            @resetSort="resetSort"
            style="float:right;"
          ></sort-down>
          <!-- <el-button @click="openDialog" style="margin-left:10px;">
            <svg-icon iconClass="list"></svg-icon>
            <span>列表</span>
          </el-button>-->
        </div>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        style="width: 100%;"
        ref="sortTable"
        :default-sort="defaultSort"
        border
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          type="index"
          :index="(page.currentPage - 1) * page.pageSize + 1"
          width="60"
          label="序号"
        ></el-table-column>
        <template v-for="(item, index) in tableHeader">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align"
            :sortable="item.sortable"
            :key="index"
            v-if="item.selected"
          >
            <template slot-scope="scope">
              <div
                v-if="item.prop === 'taskStatus'"
                class="status"
              >{{ toTaskStatus(scope.row.taskStatus) }}</div>
              <div
                v-else-if="['staticRiskDetail', 'sceneDetail', 'guideDetail', 'formulationDetail', 'approovalDetail'].includes(item.prop)"
              >
                <!-- <span @click="handleView(scope.$index, scope.row, item.prop)" class="view">
                  <svg-icon iconClass="downLoad"></svg-icon>
                  <span>下载</span>
                </span>-->
                <el-button type="text" @click="handleView(scope.$index, scope.row, item.prop)">查看</el-button>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="page-box">
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :current-page.sync="page.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          class="fr"
          @current-change="getData"
          @size-change="getData"
        ></el-pagination>
      </div>
    </div>
    <SortHeader
      ref="sortRefs"
      :list="tableHeader"
      :defaultHeader="defaultHeader"
      @changeHeader="changeHeader"
    />
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="1200px"
      custom-class="allocation-dialog"
    >
      <select-person ref="selectPersonRefs"></select-person>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </span>
    </el-dialog>
    <export-excel ref="exportRefs"></export-excel>
  </div>
</template>
<script>
import SortHeader from "@/components/SortHeader/index.vue";
import SortDown from "@/components/SortDown/index.vue";
import DownTree from "@/components/DownTree/index.vue";
import SelectPerson from "@/components/SelectPerson/index.vue";
import MoreCheckbox from "@/components/MoreCheckbox/index.vue";
import ExportExcel from "@/components/ExportExcel/index.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone, setStorage, getTimeStr } from "@/utils/index.js";

const {
  TASKS_ALL,
  PLAN_DISTRICT,
  ACCOUNTS_ALL,
  EXPORT_BASE,
  EXPORT_ALL
} = apis;

export default {
  data() {
    return {
      isLoading: false,
      isIndeterminate: false,
      levelCheckAll: false,
      districts: [],
      persons: [],
      search: {
        levels: [],
        districts: [],
        persons: [],
        taskStatus: []
      },
      name: "",
      categoryName: "",
      linkName: "",
      areaName: "",
      dateRange: "",
      person: "",
      dialogVisible: false,
      linksVisible: false,
      checkPass: true,
      checkNotPass: false,
      tableHeader: [
        // {
        //   prop: "taskNo",
        //   label: "任务编号",
        //   width: 150,
        //   notSort: true,
        //   sortable: false,
        //   selected: true
        // },
        {
          prop: "enterpriseName",
          label: "企业名称",
          width: 220,
          notSort: true,
          sortable: false,
          selected: true
        },
        {
          prop: "riskLevel",
          label: "风险等级",
          width: 180,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "dynamicRiskScore",
          label: "动态风险得分",
          width: 180,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "staticRiskScore",
          label: "静态风险得分",
          width: 180,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskEndDate",
          label: "完成时间",
          width: 120,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskStatus",
          label: "任务阶段",
          width: 140,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "remark",
          label: "备注",
          width: 130,
          notSort: false,
          sortable: false,
          selected: true
        },
        // {
        //   prop: "checkDetail",
        //   label: "体系检查记录详情",
        //   width: 150,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        {
          prop: "staticRiskDetail",
          label: "静态风险因素详情",
          width: 150,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "sceneDetail",
          label: "现场检查详情",
          width: 130,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "guideDetail",
          label: "跟踪指导详情",
          width: 130,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "formulationDetail",
          label: "报告编制详情",
          width: 130,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "approovalDetail",
          label: "报告审批详情",
          width: 130,
          align: "center",
          notSort: false,
          sortable: false,
          selected: true
        }
      ],
      defaultHeader: [],
      tableData: [],
      selectProp: "",
      selectOrder: "",
      defaultSort: {
        prop: null,
        order: "descending"
      },
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 10
      },
      // areaTree: [],
      taskStepResult: [],
      dialogTitle: "",
      // riskLevel: [],
      selectRow: "",
      taskStepOpt: [
        { label: "待分配", id: "INIT" },
        { label: "现场检查", id: "ON_SITE_INSPECTION" },
        { label: "跟踪指导", id: "REVIEW" },
        { label: "报告编制", id: "REPORT" },
        { label: "报告审批", id: "APPROVE" },
        { label: "任务完成", id: "ARCHIVE" }
      ],
      levelOpt: [],
      districtOpt: [],
      personsOpt: [],
      hasSort: "",
      planNo: ""
    };
  },
  components: {
    SortHeader,
    SortDown,
    DownTree,
    SelectPerson,
    MoreCheckbox,
    ExportExcel
  },
  created() {
    this.name = this.$route.params.name;
    this.planNo = this.$route.params.planNo;
    this.defaultHeader = deepClone(this.tableHeader);
    // this.areaTree = [
    //   {
    //     id: "0",
    //     label: "全部",
    //     children: [
    //       {
    //         id: 1,
    //         label: "四川省",
    //         children: [
    //           {
    //             id: 2,
    //             label: "成都市",
    //             children: []
    //           },
    //           {
    //             id: 3,
    //             label: "绵阳市",
    //             children: []
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ];
    this.planType = this.$route.params.planType;
    if (/FOOD_PRODUCTION/g.test(this.planType)) {
      this.levelOpt = ["A", "B", "C", "D", ""];
    } else if (/CATERING_BUSINESS/g.test(this.planType)) {
      this.levelOpt = ["1", "2", "3", "4", "5", ""];
      this.tableHeader.filter(
        item => item.prop === "staticRiskScore"
      )[0].selected = false; // 省去静态风险展示
      this.tableHeader.filter(
        item => item.prop === "staticRiskDetail"
      )[0].selected = false; // 省去静态风险展示
    }
    // this.getDefaulDatas(planNo);
    // this.sortList = [];
  },
  mounted() {
    this.getData();
    this.getDistrict();
    this.getPerson();
  },
  methods: {
    districtChange(val) {
      if (val.some(item => item === "-1")) {
        if (val[val.length - 1] === "-1") {
          // 当前选择的是全选时
          let tmpData = this.districtOpt;
          let tmpArr = [];
          for (let item of tmpData) {
            tmpArr.push(item.districtId);
          }
          this.$nextTick(() => {
            this.search.districts = tmpArr;
          });
        } else {
          this.search.districts.splice(this.districts.indexOf("-1"), 1); // 去除全选状态
        }
      } else {
        if (val.length === this.districtOpt.length - 1) {
          // 手动选择全部后
          if (this.districts.indexOf("-1") === -1) {
            // 上次change存放的没有全选状态 默认添加全选状态
            this.search.districts.unshift("-1");
          } else {
            // 则当前选择的是全选
            this.search.districts = []; // 取消全选
          }
        }
      }
      this.districts = val;
    },
    personChange(val) {
      if (val.some(item => item === "-1")) {
        if (val[val.length - 1] === "-1") {
          // 当前选择的是全选时
          let tmpData = this.personsOpt;
          let tmpArr = [];
          for (let item of tmpData) {
            tmpArr.push(item.account);
          }
          this.$nextTick(() => {
            this.search.persons = tmpArr;
          });
        } else {
          this.search.persons.splice(this.persons.indexOf("-1"), 1); // 去除全选状态
        }
      } else {
        if (val.length === this.personsOpt.length - 1) {
          // 手动选择全部后
          if (this.persons.indexOf("-1") === -1) {
            // 上次change存放的没有全选状态 默认添加全选状态
            this.search.persons.unshift("-1");
          } else {
            // 则当前选择的是全选
            this.search.persons = []; // 取消全选
          }
        }
      }
      this.persons = val;
    },
    getPerson() {
      this.personsOpt = [];
      http.get(ACCOUNTS_ALL).then(res => {
        let data = { account: "-1", name: "全部" };
        this.personsOpt = [data, ...res.data.data];
      });
    },
    getDistrict() {
      this.districtOpt = [];
      http.get(PLAN_DISTRICT).then(res => {
        let data = { districtId: "-1", districtName: "全部" };
        this.districtOpt = [data, ...res.data.data];
      });
    },
    // 转换任务阶段的显示
    toTaskStatus(val) {
      let item = this.taskStepOpt.filter(i => i.id === val);
      if (item.length) {
        return item[0].label;
      } else {
        return "";
      }
    },
    // 风险等级的change
    handleCheckChange(val) {
      if (val.length === this.levelOpt.length) {
        this.isIndeterminate = false;
        this.levelCheckAll = true;
      } else if (val.length === 0) {
        this.isIndeterminate = false;
        this.levelCheckAll = false;
      } else {
        this.levelCheckAll = false;
        this.isIndeterminate = true;
      }
    },
    // 风险等级的'全选'与否
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
      this.search.levels = val ? this.levelOpt : [];
    },
    getData() {
      this.isLoading = true;
      let params = this.getParams();
      params.planId = this.$route.params.planId;
      http.get(TASKS_ALL, params).then(res => {
        this.page.totalElements = res.data.data.totalElements;
        this.tableData = res.data.data.content;
        this.isLoading = false;
      });
    },
    getParams() {
      let obj = { pageNo: this.page.currentPage, pageSize: this.page.pageSize };
      if (this.dateRange) {
        obj.beginDate = this.dateRange[0];
        obj.endDate = this.dateRange[1];
      }
      if (this.search.levels.length) {
        obj.levels = JSON.stringify(this.search.levels);
      }
      if (
        this.search.districts.length &&
        this.search.districts.length !== this.districtOpt.length
      ) {
        obj.districts = JSON.stringify(this.search.districts);
      }
      if (
        this.search.persons.length &&
        this.search.persons.length !== this.personsOpt.length
      ) {
        obj.persons = JSON.stringify(this.search.persons);
      }
      if (this.search.taskStatus.length) {
        obj.taskStatus = this.search.taskStatus.join(",");
      }
      if (this.hasSort) {
        obj.sortString = this.hasSort;
      }
      // if (this.sortList.length) {
      //   obj.sortList = JSON.stringify(this.sortList);
      // }
      return obj;
    },
    // async getDefaulDatas(planNo) {
    //   let res = await http.get(OVERVIEW_PRODUCT, {
    //     planNo: planNo
    //   });
    // },
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    // 恢复默认排序
    resetSort() {
      this.hasSort = "";
      this.$refs.sortTable.clearSort();
    },
    // 下拉排序
    tableSort(item, order) {
      if (item.prop) {
        this.hasSort =
          item.prop + ":" + (order.key === "descending" ? "DESC" : "ASCE");
      } else {
        this.hasSort = "";
      }
      this.getData();
      this.$refs.sortTable.sort(item, order);
      // this.getDatas();
    },
    sortChange(obj) {
      this.selectProp = obj.prop;
      this.selectOrder = obj.order;
    },
    handleSelectionChange(val) {
      this.selectRow = val;
    },
    changeHeader(arr) {
      this.tableHeader = [...arr];
    },
    selectArea() {},
    resetSearch() {
      this.search = {
        levels: [],
        districts: [],
        persons: [],
        taskStatus: []
      };
      this.isIndeterminate = false;
      this.levelCheckAll = false;
      // this.$refs.areaTreeRefs.reset();
    },
    exportTable() {
      let params = {
        taskList: []
      };
      let fileName = "";
      let timeStr = getTimeStr();
      let url = EXPORT_BASE + EXPORT_ALL;
      if (this.selectRow.length == 0) {
        this.$message.error("请先选择一条数据！");
      } else {
        if (this.selectRow.length == 1) {
          fileName = `体系检查完整报告-${this.selectRow[0].enterpriseName}-${timeStr}.zip`;
        } else {
          fileName = `体系检查完整报告-${timeStr}.zip`;
        }
        for (let i = 0; i < this.selectRow.length; i++) {
          params.taskList.push({
            taskId: this.selectRow[i].id,
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
    handleView(index, row, prop) {
      let name = "";
      let params = {};
      // 查看详情，下载
      if (prop == "sceneDetail") {
        setStorage("viewIndex", 0);
        setStorage("enterpriseType", row.enterpriseType);
        name = "现场检查详情";
        params = {
          taskId: Number(row.id),
          inspectionType: "view"
        };
      }
      if (prop == "staticRiskDetail") {
        name = "得分详情";
        params = {
          matchType: "view",
          planNo: this.planNo,
          taskId: Number(row.id),
          taskStatus: row.taskStatus
        };
      }
      if (prop == "guideDetail") {
        name = "跟踪指导填报详情";
        params = {
          taskId: Number(row.id),
          type: "view"
        };
      }
      if (prop == "formulationDetail") {
        setStorage("enterpriseName", row.enterpriseName);
        setStorage("enterpriseType", row.enterpriseType);
        name = "预览报告";
        params = {
          taskId: Number(row.id),
          type: "view"
        };
      }
      if (prop == "approovalDetail") {
        name = "报告审批详情";
        params = {
          planNo: this.planNo,
          taskId: Number(row.id),
          type: "view"
        };
      }

      let routeUrl = this.$router.resolve({
        name: name,
        params: params
      });
      window.open(routeUrl.href, "_blank");
    },
    selectPerson() {
      this.dialogVisible = true;
    },
    confirmSelect() {
      this.dialogVisible = false;
      let tableData = this.$refs.selectPersonRefs.tableData;
      // this.person = [tableData[0].name];
    },
    // selectRisk(item) {
    //   for (let i = 0; i < this.riskLevel.length; i++) {
    //     if (item.id == this.riskLevel[i].id) {
    //       this.riskLevel[i].checked = item.checked;
    //     }
    //   }
    // },
    getTaskStep(arr) {
      let tmp = [];
      for (let item of arr) {
        tmp.push(item.id);
      }
      this.search.taskStatus = tmp;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/MoreDimension.scss";
.more-dimension {
  .mar-r50 {
    margin-right: 50px;
  }
}
</style>

