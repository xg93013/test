<template>
  <div class="view">
    <div class="breads">
      <div class="left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            <svg-icon iconClass="home"></svg-icon>首页
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in $route.matched"
            :key="index+'berads'"
          >{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="right">
        <!-- <svg-icon iconClass="back" class="router-icon" @click.native="$router.go(-1)"></svg-icon> -->
        <svg-icon iconClass="refresh" class="router-icon" @click.native="refreshRoute"></svg-icon>
      </div>
    </div>
    <div class="view-content">
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    refreshRoute() {
      const { fullPath } = this.$route;
      this.$router.replace({
        path: "/refresh"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  position: relative;
  .view-content {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
  .breads {
    left: 0;
    top: 0;
  }
}
</style>
