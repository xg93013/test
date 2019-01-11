<template>
  <div class="com-scroll-modal">
    <el-dialog :visible.sync="visible" custom-class="scrollModal" @close="handleClose">
      <div class="com-table-box" ref="comTableBoxRefs">
        <div class="com-table">
          <el-table :data="tableData" stripe width="100%" height="485">
            <el-table-column
              v-for="(item, index) in tableColumns"
              :label="item.label"
              :width="item.width"
              :prop="item.prop"
              :align="item.align"
              :key="index"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span v-if="item.prop=='operation'" @click="goDetail(scope.row)" class="details">查看</span>
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
        <div class="com-table">
          <el-table :data="tableDataa" stripe width="100%" height="485">
            <el-table-column
              v-for="(item, index) in tableColumnsa"
              :label="item.label"
              :width="item.width"
              :prop="item.prop"
              :align="item.align"
              :key="index"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <!-- <span v-if="item.prop=='platform'">{{switchPlatForm(scope.row[item.prop])}}</span> -->
                <span>{{scope.row[item.prop]}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="com-footer">
            <comPageBox
              :totalElements="totalElementsa"
              :totalPage="totalPagea"
              :currentPageNum="currentPagea"
              @changePage="changePagea"
              class="pagebox"
            />
          </div>
          <div class="loadings" v-show="showLoadinga" v-loading="showLoadinga"></div>
        </div>
      </div>

      <div class="com-header" slot="title">
        <div class="header-title">
          <span v-show="showBack" @click="back" class="backs">返回</span>
          <span>{{titlea}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import comPageBox from "@/components/com-page-box.vue";
import http from "@/unit/http";
export default {
  components: {
    comPageBox
  },
  data() {
    return {
      visible: false,
      title: "",
      titlea: "",
      showTableIndex: 0,
      showLoading: false,
      showLoadinga: false,
      showBack: false,
      tableData: [],
      tableDataa: [],
      totalElements: 0,
      totalElementsa: 0,
      totalPage: 0,
      totalPagea: 0,
      currentPage: 1,
      currentPagea: 1,
      params: "",
      paramsa: "",
      noSecondParams: false // 评论列表是否需第二参数
    };
  },
  props: {
    pageUrl: {
      type: String,
      default: ""
    },
    pageUrla: {
      type: String,
      default: ""
    },
    commonTitle: {
      type: String,
      default: ""
    },
    commonTitlea: {
      type: String,
      default: ""
    },
    tableColumns: {
      type: Array,
      default: []
    },
    tableColumnsa: {
      type: Array,
      default: []
    }
  },
  watch: {
    pageUrl(url) {
      this.pageUrl = url;
    },
    pageUrla(url) {
      this.pageUrla = url;
    },
    commonTitle(title) {
      this.commonTitle = title;
    },
    commonTitlea(title) {
      this.commonTitlea = title;
    },
    showTableIndex(index) {
      if (index == 0) {
        this.showBack = false;
        this.$refs.comTableBoxRefs.style.marginLeft = 0;
      } else {
        this.showBack = true;
        this.$refs.comTableBoxRefs.style.marginLeft = -800 + "px";
      }
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
    goDetail(row) {
      this.showTableIndex = 1;
      this.titlea = row.shopName + "-" + this.commonTitlea;
      this.paramsa = row.shopId;
      // this.paramsa = "s001";
      this.getTotalDataa();
    },
    back() {
      this.showTableIndex = 0;
      this.titlea = this.title + "-" + this.commonTitle;
    },
    // a 标题名称,b 商家列表参数, c 评论列表参数
    showDialog(a, b, c) {
      this.visible = true;
      this.title = a;
      this.titlea = a + "-" + this.commonTitle;
      this.params = b;
      this.noSecondParams = c;
      this.$nextTick(() => {
        this.getTotalData();
      });
    },
    hideDialog() {
      this.visible = false;
    },
    changePage(page) {
      this.currentPage = Number(page);
      this.getTableData();
    },
    changePagea(page) {
      this.currentPagea = Number(page);
      this.getTableDataa();
    },
    // 左侧表格
    getTotalData() {
      this.currentPage = 1;
      this.getTableData();
    },
    // 右侧表格
    getTotalDataa() {
      this.currentPagea = 1;
      this.getTableDataa();
    },
    async getTableData() {
      this.showLoading = true;
      let params = this.params;
      let res = await http.get(
        this.pageUrl +
          this.params +
          "?pageNo=" +
          this.currentPage +
          "&pageSize=10"
      );
      if (res) {
        this.showLoading = false;
        this.tableData = [...res.result.data];
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
    async getTableDataa() {
      let url = "";
      this.tableDataa = [];
      this.showLoadinga = true;
      if (!this.noSecondParams) {
        url =
          this.pageUrla +
          this.paramsa +
          "/" +
          this.params +
          "?pageNo=" +
          this.currentPagea +
          "&pageSize=10";
      } else {
        url =
          this.pageUrla +
          this.paramsa +
          "?pageNo=" +
          this.currentPagea +
          "&pageSize=10";
      }
      let res = await http.get(url);
      if (res) {
        this.showLoadinga = false;
        let data = [...res.result.data];
        data.forEach(item => {
          this.tableDataa.push({
            platform: this.switchPlatForm(item.platform),
            commentAt: item.commentAt.substr(0, 10),
            content: item.content
          });
        });
        this.totalElementsa = res.result.total;
        if (res.result.total > 10) {
          this.totalPagea =
            res.result.total % 10 == 0
              ? Math.floor(res.result.total / 10)
              : Math.floor(res.result.total / 10) + 1;
        } else {
          this.totalPagea = 1;
        }
      } else {
        this.showLoadinga = false;
      }
    },
    handleClose() {
      setTimeout(() => {
        this.showTableIndex = 0;
      }, 200);
    }
  }
};
</script>
<style lang="scss">
.com-scroll-modal {
  .scrollModal {
    width: 800px;
    overflow: hidden;
    .com-table-box {
      width: 1600px;
      overflow: hidden;
      transition: margin 0.4s;
      .com-table {
        overflow: hidden;
        width: 800px;
        float: left;
        // height: 600px;
        position: relative;
        .details {
          color: #2769b0;
          cursor: pointer;
        }
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
    }

    .com-header {
      .header-title {
        span {
          font-size: 16px;
          margin-right: 10px;
          height: 30px;
          line-height: 30px;
          display: inline-block;
          &.backs {
            position: relative;
            padding-right: 10px;
            color: #2769b0;
            cursor: pointer;
            &:after {
              position: absolute;
              top: 8px;
              bottom: 7px;
              right: 0;
              width: 4px;
              content: "";
              background: #2769b0;
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
    background: #f5f9fd;
    font-weight: normal;
    color: #333;
    border-bottom: none;
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