<template>
  <div></div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      visible: false,
      percent: 0,
      title: ""
    };
  },
  methods: {
    export(data, url) {
      this.visible = true;
      this.title = "";
      // export
      axios({
        method: "get",
        url: url,
        responseType: "blob",
        data: {
          // 参数
          firstName: ""
        },
        // `onDownloadProgress` 允许为下载处理进度事件
        onDownloadProgress: function(progressEvent) {}
      })
        .then(result => {
          let fileName = "xxx.xlsx";
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
        })
        .catch(result => {});
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
