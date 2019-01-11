<template>
  <div id="analysis" class="charts">
    <div class="charts-title">商家分析动态
      <div class="export" @click="downLoad">{{downTxt}}</div>
    </div>
    <div class="table-nav">
      <el-tooltip class="item" effect="dark" content="商家名称" placement="top">
        <div>商家名称</div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="所属平台" placement="top">
        <div>所属平台</div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="所属区域" placement="top">
        <div>所属区域</div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="经营状态" placement="top">
        <div>经营状态</div>
      </el-tooltip>
    </div>
    <div class="table-con">
      <div
        v-if="prevColor"
        v-for="(item,index) in datas"
        :key="index"
        :class="{tran:isTran}"
        :style="{marginTop: index==0?tenHeight+'px':'',background:index%2==0?'': color.color}"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <div>{{item.name}}</div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="wm[item.platform]" placement="top">
          <div>{{wm[item.platform]}}</div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="item.region" placement="top">
          <div>{{item.region}}</div>
        </el-tooltip>
        <div :class="{illegal:item.status=='ILLEGAL'}">{{item.status=="ILLEGAL"?"违规":"正常"}}</div>
      </div>
      <div
        v-if="!prevColor"
        v-for="(item,index) in datas"
        :key="index"
        :class="{tran:isTran}"
        :style="{marginTop: index==0?tenHeight+'px':'',background:index%2==0?color.color:''}"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
          <div>{{item.name}}</div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="wm[item.platform]" placement="top">
          <div>{{wm[item.platform]}}</div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="item.region" placement="top">
          <div>{{item.region}}</div>
        </el-tooltip>
        <div :class="{illegal:item.status=='ILLEGAL'}">{{item.status=="ILLEGAL"?"违规":"正常"}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import apis from "@/unit/apis";
const { EXPORT_ANALYSIS } = apis;
export default {
  data() {
    return {
      datas: [],
      tenHeight: 0,
      isTran: false,
      color: {
        color: "#f6f6f6"
      },
      prevColor: "",
      wm: {
        ELE_ME_WM: "饿了么",
        BAIDU_WM: "饿了么星选",
        MEI_TUAN_WM: "美团外卖"
      },
      isDown: false,
      downTxt: "导出名单",
      baseUrl: process.env.NODE_ENV == "development" ? "/apis" : ""
    };
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.isFullScreen
    })
  },
  methods: {
    downLoad() {
      ///下载excel表格
      if (this.isDown) {
        return false;
      }
      this.isDown = true;
      this.downTxt = "正在导出";
      let url = this.baseUrl + EXPORT_ANALYSIS;
      axios({
        method: "get",
        url: url,
        responseType: "blob"
      })
        .then(response => {
          this.isDown = false;
          this.downTxt = "导出名单";
          this.startDownload(response);
        })
        .catch(error => {
          this.isDown = false;
          this.downTxt = "导出名单";
          this.$msgbox({
            title: "提示",
            message: error,
            type: "error"
          }).catch(_ => {});
        });
    },
    startDownload(data) {
      let fileName = decodeURI(
        data.headers["content-disposition"].split("fileName=")[1]
      );
      if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(new Blob([data.data]), fileName);
      } else {
        let url = window.URL.createObjectURL(new Blob([data.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    getData(res) {
      let listNum = 16;
      let num =
        document.getElementsByClassName("table-con")[0].offsetHeight / listNum;
      if (this.datas.length) {
        if (res.length) {
          if (this.prevColor) {
            if (res.length % 2 != 0) {
              this.prevColor = "";
            }
          } else {
            if (res.length % 2 != 0) {
              this.prevColor = "#f6f6f6";
            }
          }
          this.datas = [...res, ...this.datas];
          this.tenHeight = -res.length * num;
          this.$nextTick(() => {
            setTimeout(() => {
              ///过渡动画
              this.isTran = true;
              this.tenHeight = 0;
              setTimeout(() => {
                this.isTran = false;
                this.datas = [...this.datas.slice(0, listNum)];
              }, 2000);
            }, 100);
          });
        }
      } else {
        this.datas = [...res];
        if (res.length % 2 == 0) {
          this.prevColor = "#f6f6f6";
        } else {
          this.prevColor = "";
        }
      }
    }
  },
  props: {
    analysis: {
      type: Array,
      default: []
    }
  },
  watch: {
    isFullScreen(a, b) {
      if (a) {
        this.color.color = "#58608E";
      } else {
        this.color.color = "#F6F6F6";
      }
    },
    analysis(a, b) {
      this.getData(a);
    }
  }
};
</script>

<style lang="scss">
#content.is-full-screen #analysis {
  .table-nav {
    background: #7b82a7;
    border-bottom: none;
    div {
      color: #fff;
    }
  }
  .table-con {
    > div {
      > div {
        color: #fff;
      }
      .illegal {
        color: #fd0202;
      }
    }
  }
}

#analysis {
  .table-nav {
    width: 100%;
    height: 48px;
    background: #f5f8fd;
    border-bottom: 1px solid #e8f0f8;
    div {
      float: left;
      width: 25%;
      height: 100%;
      line-height: 48px;
      padding-left: 20px;
      padding-right: 10px;
      color: #276ab0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      cursor: default;
    }
  }
  .table-con {
    position: absolute;
    width: 100%;
    left: 0;
    top: 88px;
    bottom: 0;
    overflow: hidden;
    .tran {
      transition: all 2s;
    }
    > div {
      width: 100%;
      height: 16.66%;
      margin-top: 0;
      > div {
        position: relative;
        float: left;
        width: 25%;
        top: 50%;
        color: #666;
        transform: translate(0, -50%);
        cursor: default;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding-left: 20px;
      }
      .illegal {
        color: #fd0202;
      }
    }
  }
  .export {
    position: absolute;
    width: 80px;
    height: 24px;
    border-radius: 12px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    background: #276ab0;
    cursor: pointer;
    right: 10px;
    top: 6px;
  }
}
</style>