<template>
  <div class="progress" v-show="visible">
    <div class="header">
      <div class="fl">{{title}}</div>
      <div class="fr" style="color:#999;">
        <svg-icon iconClass="close" @click.native="closePro"></svg-icon>
      </div>
    </div>
    <div class="boxs" v-show="percent<100&&percent>=0">
      <div class="in-box">
        <el-progress :percentage="percent" class="percent"></el-progress>
        <p class="txt">正在导出报告</p>
      </div>
    </div>
    <div class="boxs" v-show="percent==100">
      <div class="in-box">
        <p class="txt">成功导出{{totalLen}}条数据！</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      visible: false,
      percent: 0,
      totalLen: 0,
      title: "导出处理中",
      timer: ""
    };
  },
  methods: {
    closePro() {
      this.visible = false;
    },
    export(fileName, url, params, totalLen) {
      // url = "https://172.27.13.115:1443/cj/cyd/query";
      this.visible = true;
      this.percent = 0;
      this.totalLen = totalLen;
      this.title = "导出报告";
      // export
      this.timer = setInterval(() => {
        if (this.percent <= 99) {
          this.percent = 99;
        } else {
          this.percent = 99;
        }
      }, 500);
      axios({
        method: "post",
        url: url,
        responseType: "blob",
        data: params,
        // `onDownloadProgress` 允许为下载处理进度事件
        onDownloadProgress: progressEvent => {
          // 对原生进度事件的处理
          // console.log(
          //   Math.round((progressEvent.loaded / progressEvent.total) * 100) + "%"
          // );
          // this.percent = (progressEvent.loaded / progressEvent.total) * 100;
        }
      })
        .then(result => {
          clearInterval(this.timer);
          this.percent = 100;
          if ("msSaveOrOpenBlob" in navigator) {
            setTimeout(() => {
              this.visible = false;
            }, 1000);
            window.navigator.msSaveOrOpenBlob(
              new Blob([result.data]),
              fileName
            );
          } else {
            let url = window.URL.createObjectURL(new Blob([result.data]));
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => {
              this.visible = false;
            }, 1000);
          }
        })
        .catch(result => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.progress {
  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 300px;
  z-index: 99;
  background: #fff;
  box-shadow: 0 0 2px #888888;
  .header {
    width: 100%;
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    overflow: hidden;
    background: #eee;
  }
  .boxs {
    width: 100%;
    height: 150px;
    position: relative;
    overflow: hidden;
    .in-box {
      display: block;
      overflow: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      .percent {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
      }
      .txt {
        font-size: 12px;
        text-align: center;
        margin: 6px auto;
        color: #666;
      }
    }
  }
}
</style>
