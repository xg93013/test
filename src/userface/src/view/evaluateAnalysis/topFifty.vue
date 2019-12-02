<template>
  <div id="topFifty" class="topFifty">
    <div class="title">
      风险词频TOP 50商家
      <div class="select-box">
        <!-- <el-popover
          placement="bottom"
          width="100"
          trigger="click"
          popper-class="select-list"
          @show="iconClass = 'el-icon-caret-top'"
          @hide="iconClass = 'el-icon-caret-bottom'"
        >
          <template>
            <el-radio-group v-model="checkValue" @change="changeCheck">
              <el-radio :label="item" v-for="item in allCheckList" :key="item">{{item}}</el-radio>
            </el-radio-group>
            <el-select v-model="checkValue" placeholder="风险类型">
              <el-option v-for="item in allCheckList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </template>
          <el-button slot="reference" class="select-result">
            <span style="font-size:14px;">风险类型</span>
            <i :class="iconClass"></i>
          </el-button>
        </el-popover>-->
        <el-select v-model="checkValue" placeholder="风险类型" @change="changeCheck">
          <el-option key="allitem" label="全部" value="全部"></el-option>
          <el-option v-for="item in allCheckList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
    </div>
    <div class="con-box">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        height="100%"
        @row-click="rowClick"
        v-loading="showTopLoading"
      >
        <el-table-column
          prop="index"
          label=" "
          width="40"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="shopName" label="商家名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="wordFrequency"
          label="风险词频"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
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
            label: "评论时间",
            width: "180"
          },
          {
            prop: "platform",
            label: "平台",
            width: "120"
          },
          {
            prop: "content",
            label: "评论内容"
          }
        ]
      },
      checkList: [], // 选择项
      checkValue: "全部", // 单选项
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
    },
    showTopLoading: {
      type: Boolean,
      default: false
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
          shopCode: item.shopCode,
          shopName: item.shopName,
          wordFrequency: item.wordFrequency,
          shopAddress: item.shopAddress
        });
      });
    },
    rowClick(e) {
      this.tableModal.title = e.shopName + "-风险词相关评论";
      this.tableModal.pageUrl = TOP_COMMENT_DETAIL;
      this.$refs.tableModalRefs.showDialog(e.shopCode, this.checkValue);
    },
    changeCheck(item) {
      this.$store.commit("changeTopFifty", this.checkValue);
      this.$emit("filterTop", this.checkValue);
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
      width: 102px;
      margin-right: 4px;
      .el-input__inner {
        width: 102px;
        height: 36px;
        // margin-right: 10px;
      }
    }
  }
  .con-box {
    position: relative;

    > div {
      height: 100% !important;
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
</style>