<template>
  <div id="PlanFormulation">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="keyWord" placeholder="搜索关键字" style="width: 200px;"></el-input>
        <!-- <el-select v-model="planName" placeholder="计划名称">
          <el-option
            v-for="item in planNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="planStatus" placeholder="计划状态">
          <el-option
            v-for="item in planStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->
      </div>
      <div class="fr">
        <el-button type="primary" @click="searchResult">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="commonWidth formulation-main">
      <div class="table-top">
        <div class="fl">
          <!-- <el-button type="primary" @click="addPlan">
            <svg-icon iconClass="add"></svg-icon>
            <span>新增计划</span>
          </el-button>-->
          <el-popover placement="bottom-start" width="60" trigger="hover" popper-class="sort">
            <div>
              <p>
                <el-radio v-model="exportRadio" label="1">当前分类</el-radio>
              </p>
              <p>
                <el-radio v-model="exportRadio" label="2">选中数据</el-radio>
              </p>
            </div>
            <el-button slot="reference" @click="exportTable">
              <svg-icon iconClass="export"></svg-icon>
              <span>导出</span>
              <svg-icon iconClass="down"></svg-icon>
            </el-button>
          </el-popover>
          <!-- <el-button type="primary" @click="reverseCheck">反选</el-button> -->
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
        :data="currentData"
        style="width: 100%"
        ref="sortTable"
        border
        @sort-change="sortChange"
      >
        <el-table-column width="55">
          <template slot="header">
            <el-checkbox v-model="checkAll" @change="changeCheckAll"></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" @change="changeCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.show"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'state'" class="status">
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
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="计划详情" align="center">
          <template slot-scope="scope">
            <span @click="handleDetail(scope.$index, scope.row)" class="view">
              <svg-icon iconClass="view"></svg-icon>
              <span>预览</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <div class="operation">
              <span @click="handleEdit(scope.$index, scope.row)" style="color:#3a8ee6">
                <svg-icon iconClass="view"></svg-icon>分配
              </span>
              <!-- <span @click="handleDelete(scope.$index, scope.row)">
                <svg-icon iconClass="delete"></svg-icon>提交审批
              </span>
              <span @click="handleEdit(scope.$index, scope.row)">
                <svg-icon iconClass="edit"></svg-icon>审批详情
              </span>-->
            </div>
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
  </div>
</template>

<script>
import SortHeader from "@/components/SortHeader/index.vue";
import SortDown from "@/components/SortDown/index.vue";
import ExportExcel from "@/components/ExportExcel/index.vue";
import axios from "axios";
// import { mapGetters } from "vuex";
export default {
  // name: "MonitoringManage",
  data() {
    return {
      selected: [],
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
      tableData: [
        {
          id: 0,
          num: 1,
          date: "2016-05-02",
          unit: "单位",
          name: "王小虎",
          state: 1,
          checked: true
        },
        {
          id: 12000000,
          num: 12000000,
          date: "2016-05-02",
          unit: "单位",
          name: "王小虎",
          state: 2,
          checked: true
        },
        {
          id: 12000001,
          num: 12000001,
          date: "2016-05-02",
          unit: "单位",
          name: "王小虎",
          state: 3,
          checked: true
        }
      ],
      tableHeader: [
        {
          prop: "num",
          label: "计划编号",
          width: "",
          notSort: true,
          sortable: true,
          show: true
        },
        {
          prop: "name",
          label: "计划名称",
          width: "",
          notSort: false,
          sortable: true,
          show: true,
          change: false
        },
        {
          prop: "unit",
          label: "编制单位",
          width: "",
          notSort: false,
          sortable: true,
          show: true
        },
        {
          prop: "date",
          label: "发布时间",
          width: "",
          notSort: false,
          sortable: true,
          show: true
        },
        {
          prop: "state",
          label: "计划状态",
          width: "",
          notSort: false,
          sortable: true,
          show: true
        }
      ],
      selectProp: "",
      selectOrder: "",
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },
      exportRadio: "",
      checkAll: false,
      multipleSelection: []
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
        id: i + 1,
        num: i,
        date: "2016-05-02",
        unit: "单位",
        name: "王小虎",
        state: 1,
        checked: false
      });
    }
    this.page.totalElements = this.tableData.length;
  },
  computed: {
    // ...mapGetters(["permission"])
    currentData() {
      return this.tableData.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      );
    }
  },
  methods: {
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    handleSelectionChange(val) {
      this.selected = val;
      console.log(this.selected);
    },
    handleDetail(index, row) {
      this.$router.push({
        name: "预览",
        // path: "/AddPlan",
        params: { planId: -1, planType: "view" }
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        name: "检测任务分配",
        // path: "/AddPlan",
        params: { planId: -1, planType: "applocation" }
      });
    },
    handleDelete(index, row) {},
    changeHeader(arr) {
      this.tableHeader = [...arr];
    },
    sortChange(obj) {
      this.selectProp = obj.prop;
      this.selectOrder = obj.order;
    },
    resetSort() {
      this.$refs.sortTable.clearSort();
    },
    tableSort(prop, order) {
      this.$refs.sortTable.sort(prop, order);
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.selectChange();
    },
    changeCheck() {
      // console.log(this.tableData);
      this.selectChange();
    },
    // 所有数据全选
    changeCheckAll() {
      if (this.checkAll) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].checked = true;
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].checked = false;
        }
      }
    },
    selectChange() {
      let len = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].checked) {
          len++;
        }
      }
      this.checkAll = len == this.tableData.length;
      console.log(this.tableData);
    },
    //反选
    reverseCheck() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].checked = !this.tableData[i].checked;
      }
      this.selectChange();
    },
    // 导出选择
    exportTable() {
      let arr = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].checked) {
          arr.push(this.tableData[i]);
        }
      }
      let uri = "";
      this.$refs.exportRefs.export({}, "url");
    },
    searchResult() {},
    resetSearch() {
      this.keyWord = "";
      this.planName = "";
      this.planStatus = "";
    },
    addPlan() {
      this.$router.push({
        name: "新增计划",
        // path: "/AddPlan",
        params: { planId: 0, planType: "add" }
      });
    }
  },
  mounted() {
    // this.sortHeader = [...this.tableHeader];
    // console.log(this.permission);
  }
};
</script>

<style lang="scss" scope>
</style>
