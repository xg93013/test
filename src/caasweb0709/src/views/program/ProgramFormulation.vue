<template>
  <div class="wrapper">
    <div class="top-search">
      <div class="fl">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="fr">
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </div>
    </div>
    <div class="mains">
      <div class="table-top">
        <div class="fl">
          <el-button type="primary">
            <svg-icon iconClass="add"></svg-icon>
            <span>新增项目计划</span>
          </el-button>
          <el-button @click="exportTable">
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
          </el-button>
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
          <template slot="header" slot-scope="scope">
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
                <label></label>审核未通过
              </span>
              <span v-if="scope.row[item.prop] == 2">
                <label></label>待审批
              </span>
              <span v-if="scope.row[item.prop] == 3">
                <label></label>编制中
              </span>
              <span v-if="scope.row[item.prop] == 4">
                <label></label>审核通过
              </span>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="计划详情" align="center">
          <template slot-scope="scope">
            <span @click="handleDetail(scope.$index, scope.row)">
              <svg-icon iconClass="view"></svg-icon>预览
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <div style="white-space: nowrap;">
              <span @click="handleEdit(scope.$index, scope.row)" style="color:#3a8ee6">
                <svg-icon iconClass="edit"></svg-icon>编辑
              </span>
              <!-- <span @click="handleDelete(scope.$index, scope.row)">
                <svg-icon iconClass="delete"></svg-icon>提交审批
              </span>
              <span @click="handleEdit(scope.$index, scope.row)">
                <svg-icon iconClass="edit"></svg-icon>审批详情
              </span>-->
              <span @click="handleDelete(scope.$index, scope.row)">
                <svg-icon iconClass="delete"></svg-icon>删除
              </span>
              <span @click="handleDelete(scope.$index, scope.row)">
                <svg-icon iconClass="delete"></svg-icon>复制并新增
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <span v-for="item in permission">{{item}}</span> -->
      <div class="page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="page.totalElements"
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
  name: "",
  data() {
    return {
      selected: [],
      tableData: [
        {
          id: 0,
          num: 1,
          date: "2016-05-02",
          unit: "单位",
          name: "王小虎",
          state: 1,
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
      options: [
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
      value: "",
      selectProp: "",
      selectOrder: "",
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },
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
    handleDetail(index, row) {},
    handleEdit(index, row) {},
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
    }
  },
  mounted() {
    // this.sortHeader = [...this.tableHeader];
    // console.log(this.permission);
  }
};
</script>

<style lang="scss" scope>
.top-search,
.mains {
  width: 1260px;
  margin: 20px auto 0;
  padding: 20px;
  overflow: hidden;
  background: #fff;
}
.top-search {
  overflow: hidden;
  .left {
    float: left;
  }
  .right {
    float: right;
  }
}
.mains {
  margin: 1px auto 20px;
  .table-top {
    width: 100%;
    overflow: hidden;
    margin: 10px 0;
  }
  .page-box {
    overflow: hidden;
    margin: 20px 0;
  }
  .status {
    span:nth-child(1) {
      label {
        display: inline-block;
      }
    }
  }
}
</style>
