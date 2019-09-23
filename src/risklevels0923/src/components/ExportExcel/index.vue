<template>
  <div class="progress" v-show="visible">
    <div class="header">
      <div class="fl">{{title}}</div>
      <div class="fr" style="color:#999;">
        <svg-icon iconClass="close" @click.native="closePro"></svg-icon>
      </div>
    </div>
    <div class="box">
      <el-progress :percentage="percent" class="percent"></el-progress>
      <p class="txt">正在导出报告</p>
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
      title: "导出处理中"
    };
  },
  methods: {
    closePro() {
      this.visible = false;
    },
    export(fileName, url) {
      this.visible = true;
      this.title = "导出报告";
      // export
      axios({
        method: "get",
        url: url,
        responseType: "blob",
        data: {
          // 参数
          firstName: "Fred"
        },
        // `onDownloadProgress` 允许为下载处理进度事件
        onDownloadProgress: function(progressEvent) {
          // 对原生进度事件的处理
          this.percent = "";
          console.log(
            Math.round((progressEvent.loaded / progressEvent.total) * 100) + "%"
          );
        }
      })
        .then(result => {
          if ("msSaveOrOpenBlob" in navigator) {
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
  background: #fff;
  box-shadow: 0 0 2px #888888;
  .header {
    width: 100%;
    padding: 15px 20px;
    overflow: hidden;
    background: #eee;
  }
  .box {
    width: 100%;
    margin: 40px auto;
    .percent {
      width: 80%;
      margin: 0 auto;
    }
    .txt {
      font-size: 12px;
      text-align: center;
      margin: 6px auto;
      color: #666;
    }
  }
}
</style>
