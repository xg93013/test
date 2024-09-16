<template>
  <div id="SignTable">
    <div class="commonWidth first">
      <div class="top-img">
        <svg-icon iconClass="tips"></svg-icon>
        <span>首末次签到表</span>
      </div>
      <div class="view">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          v-show="imageUrl==''"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <p class="doc-upload">点击上传文件</p>
          <div slot="tip" class="upload-tips">
            <p>上传附件单个文件不能超过20MB</p>
            <p>支持格式：.jpg .jpeg .png .pdf，单个文件不能超过20MB</p>
          </div>
        </el-upload>
        <div class="view-box" v-show="imageType=='img'&&imageUrl!=''">
          <img v-if="imageUrl" :src="imageUrl" class="imgs" />
        </div>
        <pdf
          :src="imageUrl"
          class="view-box"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @page-loaded="currentPage = $event"
          v-show="imageType=='pdf'"
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
import pdf from "vue-pdf";
export default {
  data() {
    return {
      imageUrl: "",
      currentPage: 1,
      pageCount: 0,
      imageType: "img"
    };
  },
  created() {
    setTimeout(() => {});
  },
  methods: {
    showResult(url) {
      // this.imageUrl = "http://172.27.13.165:99/test.pdf";
      this.imageUrl = url;
      let arr = this.imageUrl.split(".");
      let fileType = arr[arr.length - 1];
      if (["jpg", "jpeg", "png"].includes(fileType)) {
        this.imageType = "img";
      }
      if (fileType == "pdf") {
        this.imageType = "pdf";
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(URL.createObjectURL(file.raw));
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.showResult(URL.createObjectURL(file.raw));
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      let allTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
      ];
      let isInType = allTypes.includes(file.type);
      const isJPG = file.type === "image/jpeg";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isInType) {
        this.$message.error("上传图片格式不允许！");
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      return isInType && isLt20M;
    },
    reset() {
      this.imageUrl = "";
      this.imageType = "";
    },
    save() {}
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