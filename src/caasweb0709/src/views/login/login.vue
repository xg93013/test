<template>
  <div class="login">
    <div class="bg">
      <!-- <el-carousel indicator-position="none" height="100%">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>-->
    </div>
    <div class="bot">
      <p class="text">
        Copyright © www.UnionBigData.com, All Rights Reserved.
        <br />服务于中国农产品检验检测业务的统一化、标准化、权威的监测要素基础库
        <br />请联系 010-12345678
      </p>
    </div>
    <div class="login-box">
      <div class="top">
        <div class="logo">
          <svg-icon iconClass="links" class="logo-icon"></svg-icon>
        </div>
        <div class="text">
          <p class="big">国家农产品质量安全监测信息平台</p>
          <p>Chinese Agriculture Product Test Management Platform</p>
        </div>
      </div>
      <div class="login-form">
        <div class="login-item">
          <el-input v-model="userName" placeholder="请输入用户名">
            <template slot="prepend">
              <svg-icon iconClass="user" class="input-icon"></svg-icon>
            </template>
          </el-input>
        </div>
        <div class="login-item">
          <el-input v-model="userPwd" placeholder="请输入密码" show-password>
            <template slot="prepend">
              <svg-icon iconClass="password" class="input-icon"></svg-icon>
            </template>
          </el-input>
        </div>

        <div class="login-item short">
          <svg-icon iconClass="right" class="right-icon" @click.native="login"></svg-icon>
        </div>
      </div>
      <div class="error">
        <div v-show="errorMsg!=''">
          <svg-icon iconClass="error" class="error-icon"></svg-icon>
          <span>{{errorMsg}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      errorMsg: "",
      userName: "",
      userPwd: ""
    };
  },
  methods: {
    login() {
      if (this.userName == "") {
        this.errorMsg = "请输入用户名！";
        return;
      }
      if (this.userPwd == "") {
        this.errorMsg = "请输入密码！";
        return;
      }
      let res = "";
      this.$router.push("/guide");
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 100px;
    background: #f5f5f5;
  }
  .bot {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100px;
    text-align: center;
    color: #ccc;
    .text {
      margin-top: 20px;
    }
  }
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    padding: 30px;
    overflow: hidden;
    z-index: 999;
    transform: translate(-50%, -50%);
    background: rgba($color: #000000, $alpha: 0.3);
    .top {
      // width: 100%;
      margin: 20px 0;
      display: flex;
      .logo {
        flex: 0 0 50px;
      }
      .logo-icon {
        font-size: 50px;
        fill: #fff;
        margin: 4px 10px 0 10px;
      }
      .text {
        flex: 1;
        p {
          text-align: left;
          font-size: 14px;
          color: #fff;
          line-height: 34px;
          &.big {
            font-size: 30px;
            font-weight: bold;
          }
        }
      }
    }
    .login-form {
      margin: 30px 10px 5px;
      display: flex;
      .login-item {
        flex: 1;
        margin: 0 5px;
        .input-icon {
          color: #999;
          font-size: 18px;
        }
      }
      .short {
        flex: 0 0 60px;
        color: #fff;
        .right-icon {
          cursor: pointer;
          font-size: 24px;
          margin: 10px auto;
        }
      }
    }
    .error {
      height: 50px;
      margin: 0px 15px;
      color: orange;
      .error-icon {
        color: orange;
        font-size: 14px;
      }
    }
  }
}
</style>
<style>
.el-carousel {
  height: 100%;
}
.el-input-group--prepend .el-input__inner,
.el-input-group__append {
  border: none;
}
.el-input-group__append,
.el-input-group__prepend {
  background-color: #fff;
  padding: 0 8px;
}
.el-input__inner {
  padding: 0 4px;
}
</style>

