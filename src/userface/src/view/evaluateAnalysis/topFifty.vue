<template>
  <div id="topFifty" class="topFifty">
    <div class="title">风险词频TOP 50商家
      <div class="select-box">
        <el-popover
          placement="bottom"
          width="100"
          trigger="click"
          popper-class="select-list"
          @show="iconClass = 'el-icon-caret-top'"
          @hide="iconClass = 'el-icon-caret-bottom'"
        >
          <template>
            <el-checkbox
              :indeterminate="isIndeterminate"
              :v-model="checkAll"
              @change="handleChangeAll"
            >全部</el-checkbox>
            <el-checkbox-group v-model="checkList" @change="changeCheck">
              <el-checkbox v-for="item in allCheckList" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <el-button slot="reference" class="select-result">
            <span style="font-size:12px;">风险类型{{checkList.length+'/'+allCheckList.length}}</span>
            <i :class="iconClass"></i>
          </el-button>
        </el-popover>
      </div>
    </div>
    <div class="con-box">
      <el-table :data="tableData" stripe style="width: 100%" height="100%" @row-click="rowClick">
        <el-table-column
          prop="index"
          label=" "
          width="50"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="shopName" label="商家名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="wordFrequency" label="风险词频" :show-overflow-tooltip="true"></el-table-column>
        <!-- <el-table-column prop="type" label="风险类型"></el-table-column> -->
        <el-table-column prop="shopAddress" label="地址" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </div>
    <comModalTable
      :title="tableModal.title"
      :tableColumns="tableModal.tableColumns"
      :pageUrl="tableModal.pageUrl"
      ref="tableModalRefs"
    />
  </div>
</template>

<script>
import comModalTable from "@/components/com-modal-table.vue";
import comScrollModal from "@/components/com-scroll-modal.vue";
import apis from "@/unit/apis";
const { TOP_COMMENT_DETAIL } = apis;
export default {
  components: {
    comModalTable,
    comScrollModal
  },
  data() {
    return {
      iconClass: "el-icon-caret-bottom",
      tableData: [],
      tableModal: {
        title: "",
        pageUrl: "",
        tableColumns: [
          {
            prop: "index",
            label: "",
            width: "50",
            align: "center"
          },
          {
            prop: "commentAt",
            label: "评论时间"
          },
          {
            prop: "platform",
            label: "平台"
          },
          {
            prop: "content",
            label: "评论内容"
          }
        ]
      },
      checkList: [], // 选择项
      allCheckList: [], // 所有项
      isIndeterminate: true,
      checkAll: false
    };
  },
  created() {},
  props: {
    topFifty: {
      type: Array,
      default: []
    },
    allRiskTypes: {
      type: Array,
      default: []
    }
  },
  watch: {
    topFifty(a) {
      this.getData(a);
    },
    allRiskTypes(a) {
      this.allCheckList = [];
      a.forEach(item => {
        this.allCheckList.push(item);
      });
    }
  },
  computed: {},
  methods: {
    getData(data) {
      this.tableData = [];
      data.forEach((item, index) => {
        this.tableData.push({
          index: index + 1,
          shopId: item.shopId,
          shopName: item.shopName,
          wordFrequency: item.wordFrequency,
          shopAddress: item.shopAddress
        });
      });
    },
    rowClick(e) {
      let paramsa = "";
      this.tableModal.title = e.shopName + "-风险词相关评论";
      this.tableModal.pageUrl = TOP_COMMENT_DETAIL;
      this.checkList.forEach((item, index) => {
        if (index != this.checkList.length - 1) {
          paramsa += item + ",";
        } else {
          paramsa += item;
        }
      });
      this.$refs.tableModalRefs.showDialog(e.shopId, paramsa);
    },
    changeCheck(item) {
      let count = item.length;
      this.checkAll = count === this.allCheckList.length;
      this.isIndeterminate = count > 0 && count < this.allCheckList.length;
      this.$emit("filterTop", this.checkList);
    },
    handleChangeAll(val) {
      this.checkList = val ? [...this.allCheckList] : [];
      this.isIndeterminate = false;
      this.$emit("filterTop", this.checkList);
    }
  }
};
</script>

<style lang="scss">
#topFifty {
  .title {
    position: relative;
    .select-box {
      float: right;
      position: relative;
      .el-checkbox {
        display: block;
      }
      .select-result {
        width: 100px;
        height: 34px;
        font-size: 12px;
        line-height: 34px;
        margin: 8px 10px 0 0;
        padding: 0;
        text-overflow: ellipsis;
        overflow: hidden;
        span {
          float: left;
          margin-left: 4px;
        }
        .iconClass {
          float: left;
          margin-left: 2px;
        }
      }
    }
  }
  .con-box {
    position: relative;
    .loadings {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .el-table th {
    background: #f5f9fd;
    font-weight: normal;
    color: #333;
    border-bottom: none;
  }
  .el-table td {
    border-bottom: none;
  }
}
.select-list {
  min-width: 100px;
  .el-checkbox {
    height: 36px;
    line-height: 36px;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
    height: 36px;
    // width: 120px;
  }
}
</style>