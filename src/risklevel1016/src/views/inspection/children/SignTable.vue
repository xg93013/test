<template>
  <div id="SignTable">
    <div class="commonWidth first">
      <div class="top-img">
        <svg-icon iconClass="tips"></svg-icon>
        <span>首末次签到表</span>
      </div>
      <div class="view">
        <input type="file" id="upload" @change="upload" style="display:none;" />
        <div class="avatar-uploader" v-show="imageUrl==''" @click="clickFile">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <p class="doc-upload">点击上传文件</p>
          <div slot="tip" class="upload-tips">
            <p>上传附件单个文件不能超过20MB</p>
            <p>支持格式：.jpg .jpeg .png .pdf，单个文件不能超过20MB</p>
          </div>
        </div>
        <div class="view-box" v-show="imageType=='img'&&imageUrl!=''">
          <img v-if="imageUrl" :src="imageUrl" class="imgs" />
        </div>
        <pdf
          :src="imageUrl"
          class="view-box"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @page-loaded="currentPage = $event"
          v-if="imageType=='pdf'"
        ></pdf>
      </div>
    </div>
    <div class="commonWidth bot">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button @click="reset">
            <svg-icon iconClass="reset"></svg-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { EXPORT_BASE, TASKS_ATTENDANCEFILE } = apis;
import pdf from "vue-pdf";
import axios from "axios";
export default {
  data() {
    return {
      actionUrl: "",
      imageUrl: "",
      currentPage: 1,
      pageCount: 0,
      imageType: "img",
      params: {}
    };
  },
  created() {
    // let base = "http://liyc.iok.la:29851";
    // this.actionUrl = base + TASKS_ATTENDANCEFILE + "/" + this.taskId;
    // console.log(this.actionUrl);
    // console.log(this.taskId);
    // setTimeout(() => {});
    this.getFileUrl();
  },
  props: {
    taskId: {
      type: Number,
      default: ""
    }
  },
  methods: {
    async getFileUrl() {
      let res = await http.get(TASKS_ATTENDANCEFILE + "/" + this.taskId);
      if (res) {
        console.log(res);
        if (res.data.code != -1) {
          this.imageUrl = EXPORT_BASE + res.data.data;
          let arr = this.imageUrl.split(".");
          let fileType = arr[arr.length - 1];
          if (["jpg", "jpeg", "png"].includes(fileType)) {
            this.imageType = "img";
          }
          if (fileType == "pdf") {
            this.imageType = "pdf";
          }
        } else {
          this.imageUrl = "";
          this.imageType = "img";
        }
        // let base = "http://liyc.iok.la:29851";
        // console.log(EXPORT_BASE + res.data.data);
      }
    },
    reset() {
      this.imageUrl = "";
      this.imageType = "";
      document.getElementById("upload").value = "";
    },
    save() {
      this.submitImg();
    },
    clickFile() {
      let dom = document.getElementById("upload");
      dom.click();
    },
    upload(e) {
      var self = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.imgPreview(files[0]);
      let params = new FormData();
      params.append("file", files[0]);
      // params.append("taskId", this.taskId);
      this.params = params;
    },
    submitImg() {
      let params = this.params;
      axios
        .post(EXPORT_BASE + TASKS_ATTENDANCEFILE + "/" + this.taskId, params, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          if (res) {
            if (res.data.code == 0) {
              this.$message.success("上传成功！");
            }
            // this.imageUrl = res.data.data[0].url;
          }
        });
    },
    imgPreview(file) {
      // console.log(file);
      let self = this;
      let allTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
      ];
      if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        this.imageType = "img";
      }
      if (file.type == "application/pdf") {
        this.imageType = "pdf";
      }
      let isInType = allTypes.includes(file.type);
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isInType) {
        this.$message.error("上传图片格式不允许！");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async function() {
        //判断图片是否大于20M
        if (this.result.length <= 20 * 1024 * 1024) {
          self.imageUrl = this.result;
        } else {
          self.$message.error("上传头像图片大小不能超过20MB!");
        }
      };
    }
  },
  components: {
    pdf
  }
};
</script>
<style lang="scss" scoped>
#SignTable {
  .top-img {
    overflow: hidden;
  }
  .avatar-uploader {
    width: 600px;
    // height: 300px;
    margin: 100px auto;
    border: 1px solid #eee;
    background: #f5f5f5;
    text-align: center;
    border-radius: 4px;
    &:hover {
      border: 1px solid #409eff;
      .doc-upload,
      .avatar-uploader-icon {
        color: #409eff;
      }
    }
  }
  .view {
    width: 100%;
    .doc-upload {
      font-size: 20px;
      margin: 10px auto 30px;
      color: #ccc;
    }
    .upload-tips {
      font-size: 12px;
      color: rgb(175, 175, 175);
      margin: 0 auto 50px;
    }
    .pdf-con {
      width: 100%;
      // height: 600px;
    }
    .view-box {
      width: 90%;
      margin: 30px auto;
      img {
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
#SignTable {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    margin-top: 80px;
    // height: 200px;
    // line-height: 200px;
    text-align: center;
  }
}
</style>