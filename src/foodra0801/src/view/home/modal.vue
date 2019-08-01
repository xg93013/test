<template>
  <div id="proDetail" :class="{'pro-hide':!show}">
    <el-row>
      <el-col :span="12">批次号：{{baseDatas.batchNumber}}</el-col>
      <el-col :span="12">抽检人：{{baseDatas.inspectionPerson}}</el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col :span="12">抽样编号：{{baseDatas.samplingNumber}}</el-col>
      <el-col :span="12">被抽样单位：{{baseDatas.sampledUnit}}</el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col :span="12">抽检日期：{{baseDatas.inspectionDate}}</el-col>
      <el-col :span="12">抽检结果：{{baseDatas.inspectionResult==1?"合格":"不合格"}}</el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col :span="12">标称生产企业：{{baseDatas.productEnterprise}}</el-col>
      <el-col :span="12">数据来源：{{baseDatas.dataSource}}</el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col>
        <div class="classifys">
          <div :class="{active:num==1}" @click="handle(1)">种养殖环节</div>
          <div :class="{active:num==2}" @click="handle(2)">流通环节</div>
          <div :class="{active:num==3}" @click="handle(3)">餐饮环节</div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col class="col-tabs">
        <div class="col-tab-zyz" v-show="num==1">
          通用名称： {{baseDatas.productName}}
          <br>
          规格型号：{{baseDatas.specification}}
          <br>
          标称生产企业名称：{{baseDatas.productEnterprise}}
          <br>
          标称生产企业地址：{{baseDatas.productEnterpriseAddr}}
          <br>
          生产日期：{{baseDatas.productDate}}
          <br>
          有效日期：{{baseDatas.validDate}}
        </div>
        <div class="col-tab-lt" v-show="num==2">
          <span class="no-data" v-show="!cateringDetails.length">暂无数据</span>
          <div v-for="(item,index) in cateringDetails" :key="index">
            <i></i>
            <span style="font-size:15px;font-weight:bold">{{item.enterpriseName}}</span>
            <br>
            批次号：{{baseDatas.batchNumber}}
            <br>
            <span
              v-for="(itema,indexa) in item.details"
              :key="'a'+indexa"
            >{{itema.type}}：{{itema.orderDate}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div class="col-tab-lt" v-show="num==3">
          <span class="no-data" v-show="!salesDetails.length">暂无数据</span>
          <div v-for="(item,index) in salesDetails" :key="index">
            <i></i>
            <span style="font-size:15px;font-weight:bold">{{item.enterpriseName}}</span>
            <br>
            批次号：{{baseDatas.batchNumber}}
            <br>
            <span
              v-for="(itema,indexa) in item.details"
              :key="'a'+indexa"
            >{{itema.type}}：{{itema.orderDate}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from "echarts";
import http from "@/unit/http";
import apis from "@/unit/apis";
const { PRODUCT_ORDER } = apis;
export default {
  data() {
    return {
      num: 1,
      show: false,
      baseDatas: {},
      cateringDetails: [],
      salesDetails: []
    };
  },
  methods: {
    async getDatas(e) {
      this.show = false;
      let { productId, batchNumber, link } = e;
      this.num = link;
      let res = await http.get(
        PRODUCT_ORDER + productId + "?batchNumber=" + batchNumber
      );
      if (res) {
        this.show = true;
        this.baseDatas = res.data;
        this.cateringDetails = res.data.cateringDetails;
        this.salesDetails = res.data.salesDetails;
      }
    },
    handle(e) {
      if (this.num != e) {
        this.num = e;
      }
    }
  }
};
</script>
<style lang="scss">
.pro-hide {
  visibility: hidden;
}
#proDetail {
  .el-col {
    font-size: 16px;
  }
  .classifys {
    width: 362px;
    border: 1px solid #2681dc;
    overflow: hidden;
    border-radius: 4px;

    div {
      float: left;
      width: 120px;
      text-align: center;
      padding: 10px 0;
      font-size: 16px;
      cursor: pointer;

      &:nth-child(2) {
        border-left: 1px solid #2681dc;
        border-right: 1px solid #2681dc;
      }
    }
    .active {
      background: #2681dc;
    }
  }
  .col-tabs {
    width: 100%;
    height: 260px;
    overflow-y: auto;
    background: #1c46a2;
    border-radius: 4px;
    padding: 20px;
    .col-tab-zyz {
      line-height: 36px;
      font-size: 15px;
    }
    .col-tab-lt {
      .no-data {
        display: block;
        margin-top: 60px;
        font-size: 16px;
        text-align: center;
      }
      > div {
        position: relative;
        line-height: 26px;
        padding: 0 20px 20px 20px;
        &:after {
          position: absolute;
          left: 0;
          top: 4px;
          width: 1px;
          bottom: -4px;
          content: "";
          background: #fff;
        }
        i {
          position: absolute;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          left: -8px;
          top: 4px;
        }
        &:last-child {
          padding-bottom: 0;
          &:after {
            width: 0;
          }
        }
      }
    }
  }
}
</style>


