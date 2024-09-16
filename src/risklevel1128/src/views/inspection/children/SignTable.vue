<template>
  <div id="SignTable">
    <div class="commonWidth first">
      <div class="top-img">
        <svg-icon iconClass="tips"></svg-icon>
        <span>首末次签到表</span>
      </div>
      <div class="view" id="viewBox">
        <input type="file" id="upload" @change="upload" style="display:none;" />
        <el-button
          v-show="showUpload&&imageUrl!=''&&!disabled"
          class="re-upload"
          @click="clickFile"
        >
          <svg-icon iconClass="submit"></svg-icon>
          <span>选择附件</span>
        </el-button>
        <div class="avatar-uploader" v-show="imageUrl==''&&!disabled" @click="clickFile">
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
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { EXPORT_BASE, TASKS_ATTENDANCEFILE } = apis;
import pdf from "vue-pdf";
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      actionUrl: "",
      imageUrl: "",
      originUrl: "",
      currentPage: 1,
      pageCount: 0,
      imageType: "img",
      originType: "",
      params: "",
      currentStatus: "NO_SAVE",
      validateFlag: 1,
      disabled: false,
      showUpload: false
    };
  },
  created() {
    this.disabled = this.inspectionType == "view";
    // this.getDefaultData();
  },
  props: {
    taskId: {
      type: Number,
      default: ""
    },
    inspectionType: {
      type: String,
      default: ""
    }
  },
  methods: {
    ...mapMutations(["CHANGE_LOADING"]),
    async getDefaultData() {
      this.CHANGE_LOADING(true);
      let res = await http.get("/" + TASKS_ATTENDANCEFILE + "/" + this.taskId);
      if (res) {
        if (res.data.code != -1) {
          // EXPORT_BASE  dev
          let base = "http://"; // localhost
          if (res.data.data.dataUrl) {
            this.imageUrl = EXPORT_BASE + res.data.data.dataUrl;
            this.currentStatus = res.data.data.status;
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
        } else {
          this.imageUrl = "";
          this.imageType = "img";
        }
        this.originUrl = this.imageUrl;
        this.originType = this.imageType;
      }
      this.CHANGE_LOADING(false);
    },
    reset() {
      if (this.currentStatus != "COMMIT") {
        this.imageUrl = "";
        this.imageType = "";
        document.getElementById("upload").value = "";
      } else {
        this.$message.warning("附件已提交不可更改！");
      }
    },
    save(changeType, page) {
      let type = "SAVE";
      // 预览不保存
      if (this.inspectionType != "view") {
        if (this.currentStatus != "COMMIT") {
          this.validateData();
          let params = this.params;
          // params.append("status", type);
          if (params == "" && this.imageUrl != "") {
            this.$emit("handleResult", true, changeType, page);
          } else {
            this.submitData(type, changeType, page);
          }
        } else {
          if (changeType == "current") {
            this.$message.warning("附件已提交不可更改！");
          }
          this.$emit("handleResult", true, changeType, page);
        }
      } else {
        this.$emit("handleResult", true, changeType, page);
      }
    },
    submit() {
      let type = "COMMIT";
      if (this.currentStatus != "COMMIT") {
        this.submitData(type);
      } else {
        this.$message.warning("附件已提交不可更改！");
      }
    },
    // 验证通过后才能提交
    validateData() {
      let params = this.params;
      if (params == "" && this.imageUrl == "") {
        // this.$message.error("请先选择上传文件！");
        this.validateFlag = -1;
        return false;
      }
      if (params == "" && this.imageUrl != "") {
        // this.$emit("handleResult", true, changeType, page);
        this.validateFlag = 1;
      }
      if (params != "") {
        this.validateFlag = 1;
      }
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
      this.params = params;
    },
    submitData(type, changeType, page) {
      let params = this.params;
      if (params != "") {
        let status = params.get("status");
        if (!status) {
          params.append("status", type);
        } else {
          params.set("status", type);
        }
      } else {
        params = new FormData();
        params.append("status", type);
        // params.append("file", null);
      }
      axios
        .post(EXPORT_BASE + TASKS_ATTENDANCEFILE + "/" + this.taskId, params, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          if (res) {
            let msg = type == "SAVE" ? "保存首末次签到表成功！" : "提交成功！";
            this.params = "";
            if (type == "SAVE") {
              this.$emit("handleResult", true, changeType, page);
              this.$message.success(msg);
            } else {
              this.$emit("handleSubmitResult", true);
            }
          } else {
            this.$message.error("上传失败！");
          }
        });
    },
    imgPreview(file) {
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
          self.$message.error("上传附件大小不能超过20MB!");
        }
      };
    }
  },
  components: {
    pdf
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementById("viewBox").addEventListener("mouseover", e => {
        this.showUpload = true;
      });
      document.getElementById("viewBox").addEventListener("mouseout", e => {
        this.showUpload = false;
      });
    });
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
    position: relative;
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
      width: 70%;
      margin: 30px auto;
      img {
        width: 100%;
      }
    }
    .re-upload {
      position: absolute;
      top: 0;
      right: 20px;
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