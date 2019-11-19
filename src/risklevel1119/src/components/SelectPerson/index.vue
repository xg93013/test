<template>
  <div>
    <div class="content">
      <div class="dialog-title">
        <div class="fl">
          <svg-icon iconClass="filter" class="title-icon"></svg-icon>人员筛选
        </div>
        <div class="fr">
          <el-button type="primary" @click="search">
            <svg-icon iconClass="search" class="title-icon"></svg-icon>查询
          </el-button>
          <el-button @click="resetSearch">
            <svg-icon iconClass="reset" class="title-icon"></svg-icon>重置
          </el-button>
        </div>
      </div>
      <div class="mid">
        <div class="fl mid-left">
          <Search :list="searchList" :multiple="true" ref="rearchRefs" @searchResult="searchResult"></Search>
          <div class="m20">
            关键词搜索：
            <el-input v-model="keyWord" style="width:240px;"></el-input>
          </div>
        </div>
        <div class="fl mid-right">
          <!-- <NormalTree
            :data="treeData"
            @getResult="getTreeResult"
            ref="normalTreeRefs"
            :single="true"
            :level="3"
          />-->
          <el-tree
            :data="treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            ref="treeRefs"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <el-radio
                v-model="radioValue"
                :label="node.data.id"
                class="radios"
                v-if="node.level!=1"
                @change="changeRadio"
              >{{node.label}}</el-radio>
              <span v-else>{{node.label}}</span>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="bot">
        <div class="m20">
          <svg-icon iconClass="filter" class="title-icon"></svg-icon>筛选清单
        </div>

        <el-table :data.sync="tableData" border style="margin-top: 20px;">
          <el-table-column label="序号" prop="nums" width="100" align="center"></el-table-column>
          <el-table-column label="姓名" prop="name" sortable align="center"></el-table-column>
          <el-table-column label="工作单位" prop="enterpriseNum" sortable align="center"></el-table-column>
          <el-table-column label="执法资格证名称" prop="certificateName" sortable align="center"></el-table-column>
          <el-table-column label="执法资格编号" prop="certificateNum" sortable align="center"></el-table-column>
          <el-table-column label="所属专业" prop="certificateNum" width="350" sortable align="center"></el-table-column>
          <!-- <el-table-column label="操作" prop="operation" align="center" width="100">
            <template slot-scope="scope">
              <div @click="remove(scope.row)" style="cursor:pointer;">
                <svg-icon iconClass="edit"></svg-icon>
                <span>移除</span>
              </div>
            </template>
          </el-table-column>-->
        </el-table>
        <!-- <div class="page-box">
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
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import Search from "@/components/Search/index.vue";
import NormalTree from "@/components/DownTree/normalTree.vue";
export default {
  data() {
    return {
      tableData: [],
      treeData: [],
      searchList: [],
      keyWord: "",
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },
      currentNode: "",
      radioValue: ""
    };
  },
  components: {
    Search,
    NormalTree
  },
  props: {
    personType: {
      type: String,
      default: ""
    }
  },
  created() {
    this.searchList = [
      {
        type: "sampleSources",
        label: "样品来源",
        list: ["全部", "加工", "自制", "外购", "其他"]
      }
    ];
  },
  methods: {
    getDatas() {},
    search() {
      // nums,name,enterpriseNum,certificateName,certificateNum
      this.treeData = [
        {
          id: "0",
          label: "全部",
          children: [
            {
              id: "1",
              label: "aa",
              children: []
            },
            {
              id: "2",
              label: "ab",
              children: []
            }
          ]
        }
      ];

      console.log(this.tableData);
    },
    resetSearch() {
      this.keyWord = "";
      this.$refs.rearchRefs.reset();
      this.radioValue = "";
      // this.$refs.normalTreeRefs.reset();
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.getDatas();
    },
    sizeChange() {
      this.getDatas();
    },
    remove() {},
    searchResult(obj) {
      console.log(obj);
    },
    getTreeResult(arr) {
      console.log(arr);
    },
    changeRadio() {
      // let data = this.data[0].children;
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].id == this.radioValue) {
      //     this.currentNode = data[i];
      //   }
      // }
      this.tableData = [
        {
          nums: "a",
          name: "人员a",
          enterpriseNum: "abc",
          certificateName: "名称a",
          certificateNum: "证"
        }
      ];
      console.log(this.radioValue);
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  .top {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
  }
  .mid {
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    padding: 20px 0;
    .mid-left,
    .mid-right {
      height: 240px;
      overflow: auto;
    }
    .mid-left {
      width: 800px;
    }
    .mid-right {
      width: calc(100% - 800px);
    }
  }
}
</style>