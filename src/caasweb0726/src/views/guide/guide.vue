<template>
  <div class="guide">
    <div class="top">
      <div class="logo">
        <div class="fl">
          <svg-icon iconClass="links" class="logo-icon"></svg-icon>
        </div>
        <div class="fl text">
          <p class="big">国家农产品质量安全监测信息平台</p>
          <p>Chinese Agriculture Product Test Management Platform</p>
        </div>
      </div>
      <div class="item-box">
        <div class="item">
          <div class="img-box">
            <el-carousel indicator-position="none" height="180px">
              <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="item">
          <div class="img-box">
            <el-carousel indicator-position="none" height="180px">
              <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="item">
          <div class="img-box">
            <el-carousel indicator-position="none" height="180px">
              <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="item">
          <div class="img-box">
            <el-carousel indicator-position="none" height="180px">
              <el-carousel-item v-for="item in 4" :key="item">
                <h3>{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
    </div>
    <div class="bot">
      <div class="item-box">
        <div class="item">
          <p class="big">国家农产品质量安全监测信息系统</p>
          <p>无缝对接我国国抽平台</p>
          <!-- <el-button type="primary" class="inner-btn"></el-button> -->
          <router-link to="/home" class="inner-btn">点击进入</router-link>
        </div>
        <div class="item">
          <p class="big">农产品质量安全多维分析系统</p>
          <p>支持自定义查询、多维查询、统计分析</p>
          <router-link to="/home" class="inner-btn">点击进入</router-link>
        </div>
        <div class="item">
          <p class="big">农产品质量安全大屏展示中心</p>
          <p>一张图实现数据互联，随时把控现场</p>
          <router-link to="/home" class="inner-btn">点击进入</router-link>
        </div>
        <div class="item">
          <p class="big">监测要素管理系统</p>
          <p>监测要素标准化管理、数据源统一管理</p>
          <router-link to="/home" class="inner-btn">点击进入</router-link>
        </div>
      </div>
    </div>
    <div class="login" @click="login">
      <svg-icon iconClass="home"></svg-icon>
      <span>登录</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    login() {
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="scss" scoped>
.guide {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  .login {
    position: absolute;
    top: 50px;
    right: 50px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
  }
  .item-box {
    position: absolute;
    width: 1300px;
    left: 50%;
    display: flex;
    transform: translateX(-50%);
    .item {
      flex: 1;
      height: 180px;
      margin: 0 20px;
      background: #fff;
      p {
        text-align: center;
        font-size: 14px;
        color: #999;
        line-height: 24px;
        &.big {
          font-size: 16px;
          color: #333;
          font-weight: bold;
          margin-top: 30px;
        }
      }
      .inner-btn {
        display: block;
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #fff;
        background: #0079fe;
        margin: 10px auto;
      }
    }
  }
  .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 300px;
    background: #0079fe;
    .item-box {
      bottom: 0;
      .item {
        height: 200px;
        background: #f9f9f9;
        position: relative;
        border-radius: 5px 5px 0 0;
        .img-box {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
        }
      }
    }
    .logo {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      overflow: hidden;
      .logo-icon {
        font-size: 50px;
        fill: #fff;
        margin: 10px 10px 0 0;
      }
      .text {
        p {
          text-align: center;
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
  }
  .bot {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 300px;
    background: #f5f5f5;
    .item-box {
      top: 0;
      .item {
        border-radius: 0 0 5px 5px;
      }
    }
  }
}
</style>

