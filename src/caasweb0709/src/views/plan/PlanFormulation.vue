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
            <span>新增计划</span>
          </el-button>
          <el-button>
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
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
        <el-table-column type="selection" width="55">
          <template slot="header" slot-scope="scope">
            <el-checkbox></el-checkbox>
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
            <div v-if="item.prop === 'state'">
              <span v-if="scope.row[item.prop] == 1">审核未通过</span>
              <span v-if="scope.row[item.prop] == 2">待审核</span>
              <span v-if="scope.row[item.prop] == 3">编制中</span>
              <span v-if="scope.row[item.prop] == 4">审核通过</span>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="计划详情" align="center">
          <template slot-scope="scope">
            <span @click="handleDetail(scope.$index, scope.row)">
              <svg-icon iconClass="view"></svg-icon>编辑
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.$index, scope.row)">
              <svg-icon iconClass="edit"></svg-icon>编辑
            </span>
            <span @click="handleDelete(scope.$index, scope.row)">
              <svg-icon iconClass="delete"></svg-icon>删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <span v-for="item in permission">{{item}}</span> -->
      <div class="page-box">
        <el-pagination background layout="prev, pager, next" :total="1000" class="fr"></el-pagination>
      </div>
    </div>
    <SortHeader ref="sortRefs" :list="tableHeader" @changeHeader="changeHeader" />
  </div>
</template>

<script>
import SortHeader from "@/components/SortHeader/index.vue";
import SortDown from "@/components/SortDown/index.vue";
// import { mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      selected: [],
      tableData: [
        {
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
      selectOrder: ""
    };
  },
  components: {
    SortHeader,
    SortDown
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.tableData.push({
        num: 1,
        date: "2016-05-02",
        unit: "单位",
        name: "王小虎",
        state: 1,
        checked: true
      });
    }
  },
  computed: {
    // ...mapGetters(["permission"])
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
    changeCheck() {
      console.log(this.tableData);
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
}
</style>
