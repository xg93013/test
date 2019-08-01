<template>
  <div id="proDetailsa">
    <el-row>
      <el-col :span="10">
        <span class="back" @click="back">返回</span>
        <span class="name">{{name}}</span>
      </el-col>
      <el-col :span="14" align="right">
        <div class="lists">
          <div
            v-for="(item,index) in lista"
            :key="index"
            :class="{'list-active':types==index}"
            @click="listaChange(index)"
          >{{item}}</div>
        </div>
        <div class="lists">
          <div
            v-for="(item,index) in listb"
            :key="index"
            :class="{'list-active':result==index}"
            @click="listbChange(index)"
          >{{item}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="table-heads">
          <div class="table-head" :key="index" v-for="(item,index) in head">
            {{item}}
            <div class="div-sort" v-if="index==1||index==2||index==3">
              <i :class="{'i-activea':sortNum==index+'-'+1}" @click="sortChange(index,1)"></i>
              <i :class="{'i-activeb':sortNum==index+'-'+2}" @click="sortChange(index,2)"></i>
            </div>
          </div>
        </div>
        <div v-show="datas.length==0" class="nodata">暂无数据</div>
        <div v-show="datas.length>0" class="table-bodys" v-for="(item,index) in datas" :key="index">
          <div>{{index+1}}</div>
          <div>{{item.productName}}</div>
          <div>{{item.samplingNumber}}</div>
          <div>{{item.inspectionDate}}</div>
          <div
            style="cursor:pointer;text-decoration:underline"
            @click="goModal(item)"
          >{{item.batchNumber}}</div>
          <div>{{item.inspectionPerson}}</div>
          <div
            style="cursor:pointer;text-decoration:underline"
            @click="goBusiness(item.sampledUnitId)"
          >{{item.sampledUnit}}</div>
          <div
            style="cursor:pointer;text-decoration:underline"
            @click="goBusiness(item.productEnterpriseId)"
          >{{item.productEnterprise}}</div>
          <div>{{item.inspectionResult==1?"合格":"不合格"}}</div>
          <div>{{item.dataSource}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px" v-show="datas.length>0">
      <el-col align="right">
        <el-pagination
          :goto="pages.gotoTxt"
          class="szl-page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.page"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pages.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      close-on-click-modal
      append-to-body
      :visible.sync="dialogVisible"
      width="1000px"
      custom-class="pro-modal"
    >
      <modal ref="proModal"/>
    </el-dialog>
  </div>
</template>

<script>
import modal from "./modal";
import http from "@/unit/http";
import apis from "@/unit/apis";
const { FOOD_DETAILS } = apis;
export default {
  data() {
    return {
      title: "",
      dialogVisible: false,
      head: [
        "序号",
        "样品名称",
        "抽检编号",
        "抽检日期",
        "批次号",
        "抽检人员",
        "被抽样单位",
        "标称生产企业",
        "检验结果",
        "数据来源"
      ],
      lista: ["种养殖环节", "流通环节", "餐饮环节"],
      listb: ["全部结果", "合格", "不合格"],
      types: 0,
      result: 0,
      datas: [],
      pages: {
        page: 1,
        pageSize: 10,
        total: 0,
        gotoTxt: "调至"
      },
      id: "",
      proMsg: {},
      name: "",
      sortNum: "",
      sortKey: "",
      desc: true,
      fromBusiness: false
    };
  },
  components: {
    modal
  },
  methods: {
    goModal(e) {
      let { productId, batchNumber, link, productName } = e;
      this.dialogVisible = true;
      this.title = productName;
      this.$nextTick(() => {
        this.$refs.proModal.getDatas({
          productId,
          batchNumber,
          link
        });
      });
    },
    goBusiness(id) {
      if (id) {
        this.$emit("goBusiness", {
          type: 2,
          id: id
        });
      }
    },
    sortChange(e, n) {
      let num = e + "-" + n;
      if (this.sortNum != num) {
        this.sortNum = num;
        if (e == 1) {
          this.sortKey = "productName";
        } else if (e == 2) {
          this.sortKey = "samplingNumber";
        } else {
          this.sortKey = "inspectionDate";
        }
        if (n == 1) {
          this.desc = false;
        } else {
          this.desc = true;
        }

        this.$nextTick(() => {
          this.getDatas();
        });
      }
    },
    init(e) {
      this.fromBusiness = e.fromBusiness ? e.fromBusiness : false;
      this.result = 0;
      this.types = e.types - 1;
      this.proMsg = { ...e };
      this.sortNum = "";
      this.sortKey = "";
      this.desc = true;
      this.$nextTick(() => {
        this.getDatas();
      });
    },
    timeChange(e) {
      this.proMsg.times = e.year + "年" + e.msg;
      this.$nextTick(() => {
        this.getDatas();
      });
    },
    async getDatas() {
      let inspectionResult;
      if (this.result == 0) {
        inspectionResult = "";
      } else if (this.result == 1) {
        inspectionResult = 1;
      } else {
        inspectionResult = -1;
      }
      let txt =
        "?link=" +
        (this.types + 1) +
        "&batchNumber=" +
        this.proMsg.batch +
        "&productId=" +
        this.proMsg.productId +
        "&page=" +
        this.pages.page +
        "&size=" +
        this.pages.pageSize;
      if (inspectionResult) {
        txt += "&inspectionResult=" + inspectionResult;
      }
      if (this.sortKey) {
        txt += "&sortKey=" + this.sortKey + "&desc=" + this.desc;
      }
      let res = await http.get(FOOD_DETAILS + this.proMsg.id + txt);
      if (res) {
        this.name = res.data.category;
        this.pages.total = res.data.content.total;
        this.datas = [...res.data.content.list];
      }
    },
    handleSizeChange(e) {
      this.pages.pageSize = e;
      this.pages.page = 1;
      this.$nextTick(() => {
        this.getDatas();
      });
    },
    handleCurrentChange(e) {
      this.pages.page = e;
      this.$nextTick(() => {
        this.getDatas();
      });
    },
    listaChange(e) {
      if (this.types != e) {
        this.types = e;
        this.pages.page = 1;
        this.$nextTick(() => {
          this.getDatas();
        });
      }
    },
    listbChange(e) {
      if (this.result != e) {
        this.result = e;
        this.pages.page = 1;
        this.$nextTick(() => {
          this.getDatas();
        });
      }
    },
    back() {
      if (this.fromBusiness) {
        this.$emit("back", { details: true, num: this.fromBusiness.num });
      } else {
        this.$emit("back", { details: false });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
#proDetailsa {
  width: 100%;
  .back,
  .name {
    font-size: 16px;
  }
  .back {
    position: relative;
    color: #3fb2ff;
    cursor: pointer;
    margin-right: 14px;
    &:after {
      position: absolute;
      right: -10px;
      top: 4px;
      bottom: 2px;
      width: 1px;
      content: "";
      background: #87b3d1;
    }
  }
  .name {
    color: #aad7ff;
  }
  .lists {
    display: inline-block;
    width: 270px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid #2681dc;
    overflow: hidden;
    margin-right: 10px;
    box-sizing: content-box;
    > div {
      float: left;
      width: 33.33%;
      height: 100%;
      text-align: center;
      line-height: 32px;
      color: #fff;
      font-size: 13px;
      cursor: pointer;
      &:nth-child(2) {
        border-right: 1px solid #2681dc;
        border-left: 1px solid #2681dc;
      }
    }
    .list-active {
      background: #2681dc;
    }
  }
  .times {
    display: inline-block;
    overflow: hidden;
  }
  .table-heads {
    width: 100%;
    height: 48px;
    line-height: 48px;
  }
  .table-head {
    float: left;
    width: 10%;
    color: #fff;
    font-weight: bold;
    &:first-child {
      width: 9%;
      padding-left: 40px;
    }
    &:nth-child(9) {
      padding-left: 20px;
    }
    .div-sort {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 30px;
      line-height: 10px;
      left: 0;
      top: 7px;
      i {
        display: block;
        width: 0;
        height: 0;
        cursor: pointer;
        &:first-child {
          border-left: 8px solid transparent;
          border-top: 9px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 9px solid #fff;
          margin-bottom: 3px;
        }
        &:last-child {
          border-left: 8px solid transparent;
          border-top: 9px solid #fff;
          border-right: 8px solid transparent;
          border-bottom: 9px solid transparent;
        }
      }
      .i-activea {
        border-bottom: 9px solid #e38621 !important;
      }
      .i-activeb {
        border-top: 9px solid #e38621 !important;
      }
    }
  }
  .nodata {
    margin-top: 10px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
  .table-bodys {
    width: 100%;
    margin-top: 10px;
    height: 80px;
    line-height: 80px;
    background: rgba(25, 160, 255, 0.1);
    > div {
      float: left;
      width: 10%;
      height: 100%;
      color: #fff;
      font-size: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &:first-child {
        width: 9%;
        padding-left: 40px;
        border-left: 8px solid #0080ff;
      }
      &:nth-child(9) {
        padding-left: 20px;
      }
    }
  }
  .szl-page {
    .el-pagination__total,
    .el-pagination__jump {
      color: #fff;
    }
    .el-input__inner {
      background-color: rgba(0, 0, 0, 0);
      border: 1px solid #fff;
      color: #fff;
    }
    .btn-next,
    .btn-prev,
    .el-pager li {
      background-color: rgba(0, 0, 0, 0);
      color: #fff;
      border: 1px solid #fff;
      min-width: 28px;
      border-radius: 4px;
      font-weight: normal;
      margin-right: 10px;
    }
    .btn-next,
    .btn-prev {
      padding: 0;
    }
    .btn-next {
      margin-right: 0;
    }
    .el-pagination__editor.el-input .el-input__inner {
      height: 26px;
    }
    .el-pager .active {
      background-color: #0099ff;
      border-color: #0099ff;
    }
    button:disabled {
      background-color: #fff;
      border-color: #fff;
      color: #666;
    }
  }
}
.pro-modal {
  border-radius: 6px;
  overflow: hidden;
  * {
    color: #fff;
  }
  .el-dialog__header {
    background: #2681dc;
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
  .el-dialog__body {
    padding: 20px;
    overflow-y: auto;
    background: #052e88;
  }
}
</style>