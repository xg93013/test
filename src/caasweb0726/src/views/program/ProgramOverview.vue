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
          <el-button>
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
          </el-button>
        </div>
        <div class="fr sort">
          <el-popover placement="bottom-start" width="60" trigger="click" popper-class="sort">
            <div>
              <p
                v-for="(item, index) in tableHeader"
                :key="index"
                class="list"
                :class="{'active':item.prop===selectProp}"
                @click="changeProp(item.prop)"
              >
                <span class="icon">
                  <svg-icon iconClass="radio"></svg-icon>
                </span>
                {{item.label}}
              </p>
            </div>
            <div class="ways">
              <p
                v-for="(item, index) in sortList"
                :key="index"
                class="list"
                :class="{'active':item.key===selectOrder}"
                @click="changeOrder(item.key)"
              >
                <span class="icon">
                  <svg-icon iconClass="radio"></svg-icon>
                </span>
                {{item.label}}
              </p>
            </div>
            <el-button slot="reference">
              <svg-icon iconClass="sort"></svg-icon>
              <span>排序</span>
            </el-button>
          </el-popover>
          <el-button @click="openDialog">
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
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.show"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.$index, scope.row)" v-show="permission.includes('add')">
              <svg-icon iconClass="edit"></svg-icon>编辑
            </span>
            <span
              @click="handleDelete(scope.$index, scope.row)"
              v-show="permission.includes('delete')"
            >
              <svg-icon iconClass="delete"></svg-icon>删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span v-for="item in permission">{{item}}</span>
      <div class="page-box">
        <el-pagination background layout="prev, pager, next" :total="1000" class="fr"></el-pagination>
      </div>
    </div>
    <SortHeader ref="sortRefs" :list="tableHeader" @changeHeader="changeHeader" />
  </div>
</template>

<script>
import SortHeader from "@/components/SortHeader/index.vue";
import { mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address:
            "上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      tableHeader: [
        {
          prop: "address",
          label: "地址",
          width: "",
          notSort: true,
          sortable: true,
          show: true
        },
        {
          prop: "date",
          label: "日期",
          width: "",
          notSort: false,
          sortable: true,
          show: true,
          change: false
        },
        {
          prop: "name",
          label: "姓名",
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
      headerIndex: "",
      selectProp: "",
      selectOrder: "",
      // sortIndex: "",
      sortList: [
        {
          label: "正序排序",
          key: "ascending"
        },
        {
          label: "倒序排序",
          key: "descending"
        },
        {
          label: "恢复默认",
          key: null
        }
      ]
    };
  },
  components: {
    SortHeader
  },
  created() {
    // for (let i = 0; i < 10; i++) {
    //   this.tableHeader.push({
    //     prop: "add" + i,
    //     label: "add" + i,
    //     width: "",
    //     notSort: false,
    //     sortable: true,
    //     show: true
    //   });
    // }
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    openDialog() {
      this.$refs.sortRefs.openDialog();
      // this.visible = true;
    },
    handleSelectionChange() {},
    handleEdit(index, row) {},
    handleDelete(index, row) {},
    changeHeader(arr) {
      this.tableHeader = [...arr];
    },
    changeProp(prop) {
      this.selectProp = prop;
      this.tableSort();
      // order: ascending, descending
    },
    changeOrder(order) {
      this.selectOrder = order;
      if (!order) {
        this.selectProp = "";
        this.selectOrder = "";
        this.$refs.sortTable.clearSort();
      } else {
        this.tableSort();
      }
    },
    sortChange(obj) {
      this.selectProp = obj.prop;
      this.selectOrder = obj.order;
    },
    tableSort() {
      this.$refs.sortTable.sort(this.selectProp, this.selectOrder);
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
