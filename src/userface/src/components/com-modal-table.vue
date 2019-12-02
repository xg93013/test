<template>
  <div id="com-modal">
    <el-dialog :visible.sync="visible" width="800" custom-class="comModal">
      <div class="com-table">
        <el-table :data="tableData" stripe width="100%" height="485">
          <el-table-column
            v-for="(item, index) in tableColumns"
            :label="item.label"
            :width="item.width"
            :prop="item.prop"
            :align="item.align"
            :key="index"
            :show-overflow-tooltip="false"
          >
            <template slot-scope="scope">
              <span
                v-if="item.prop=='content'"
                v-html="formatContents(scope.row['riskWords'], scope.row[item.prop])"
              ></span>
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="com-footer">
          <comPageBox
            :totalElements="totalElements"
            :totalPage="totalPage"
            :currentPageNum="currentPage"
            @changePage="changePage"
            class="pagebox"
          />
        </div>
        <div class="loadings" v-show="showLoading" v-loading="showLoading"></div>
      </div>
      <div class="com-header" slot="title">
        <div class="header-title">
          <span>{{title}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import comPageBox from "@/components/com-page-box.vue";
import http from "@/unit/http";
import { formatContent } from "@/unit/pub";
export default {
  components: {
    comPageBox
  },
  data() {
    return {
      visible: false,
      showLoading: false,
      tableData: [],
      totalElements: 0,
      totalPage: 0,
      currentPage: 1,
      params: "",
      paramsa: ""
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    tableColumns: {
      type: Array,
      default: []
    },
    pageUrl: {
      type: String,
      default: []
    }
  },
  watch: {
    pageUrl(page) {
      this.pageUrl = page;
    }
  },
  methods: {
    switchPlatForm(name) {
      let result = "";
      switch (name) {
        case "MEI_TUAN_WM":
          result = "美团外卖";
          break;
        case "ELE_ME_WM":
          result = "饿了么";
          break;
        case "BAIDU_WM":
          result = "饿了么星选";
          break;
        default:
          break;
      }
      return result;
    },
    showDialog(a, b) {
      this.visible = true;
      this.params = a;
      this.paramsa = b;
      this.$nextTick(() => {
        this.getTotalData();
      });
    },
    hideDialog() {
      this.visible = false;
    },
    changePage(page) {
      this.currentPage = page;
      this.getTableData();
    },
    getTotalData() {
      this.currentPage = 1;
      this.getTableData();
    },
    async getTableData() {
      let url = "";
      this.tableData = [];
      this.showLoading = true;
      if (this.paramsa === "全部" || this.paramsa === "") {
        url =
          this.pageUrl +
          "?shopCode=" +
          this.params +
          "&pageNo=" +
          this.currentPage +
          "&pageSize=10";
      } else {
        url =
          this.pageUrl +
          "?shopCode=" +
          this.params +
          "&riskType=" +
          this.paramsa +
          "&pageNo=" +
          this.currentPage +
          "&pageSize=10";
      }
      let res = await http.get(url);
      if (res) {
        this.showLoading = false;
        let data = [...res.result.data];
        data.forEach((item, index) => {
          this.tableData.push({
            index: index + 1,
            commentAt: item.commentAt,
            platform: this.switchPlatForm(item.platform),
            riskWords: item.riskWords,
            content: item.content
          });
        });
        this.totalElements = res.result.total;
        if (res.result.total > 10) {
          this.totalPage =
            res.result.total % 10 == 0
              ? Math.floor(res.result.total / 10)
              : Math.floor(res.result.total / 10) + 1;
        } else {
          this.totalPage = 1;
        }
      } else {
        this.showLoading = false;
      }
    },
    formatContents(riskWords, content) {
      return formatContent(riskWords, content);
    },
    handleClose() {}
  }
};
</script>
<style lang="scss">
#com-modal {
  .comModal {
    .com-table {
      overflow: hidden;
      width: 100%;
      // height: 600px;
      position: relative;
      .com-footer {
        width: 100%;
        overflow: hidden;
        padding: 20px 0px;
        .pagebox {
          float: right;
          margin-right: 20px;
        }
      }
      .loadings {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
    .com-header {
      .header-title {
        span {
          font-size: 16px;
          margin-right: 15px;
          display: inline-block;

          &.backs {
            position: relative;
            &:after {
              position: absolute;
              top: 10px;
            }
          }
        }
      }
    }

    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__header {
      padding: 15px 20px;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .el-table th {
    border-bottom: none;
    color: #2769b0;
  }
  .el-table__header {
    color: #2769b0;
  }
  .el-table td,
  .el-table th {
    padding: 10px 0;
  }
}
</style>


