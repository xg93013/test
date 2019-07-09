<template>
  <div class="home">
    <div class="header">
      <div class="logo">国家农产品质量安全监测信息平台</div>
      <div class="header-nav">
        <div
          class="nav-item"
          v-for="(item, index) in headerNav"
          :key="index+'header'"
          :class="{'active':index ===headerIndex}"
          @click="changeHeaderNav(index)"
        >
          <svg-icon :iconClass="item.icon"></svg-icon>
          <span class="name">{{item.name}}</span>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <svg-icon iconClass="message"></svg-icon>
          <span class="name">消息</span>
        </div>
        <div class="item">
          <svg-icon iconClass="lock"></svg-icon>
          <span class="name">锁屏</span>
        </div>
        <div class="item">
          <el-dropdown>
            <span class="el-dropdown-link">
              admin
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>基本信息</el-dropdown-item>
              <el-dropdown-item>修改资料</el-dropdown-item>
              <el-dropdown-item>修改头像</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="nav">
      <div
        class="left-nav"
        v-for="(item, index) in leftNav"
        :key="index+'leftnav'"
        v-show="permission.includes(item.key)"
      >
        <p class="sec-title">
          <svg-icon iconClass="list"></svg-icon>
          <span class="name">{{item.name}}</span>
        </p>
        <p
          v-for="(itema, indexa) in item.list"
          :key="indexa+'leftin'"
          @click="changeLeft('key'+index+''+indexa)"
          :class="{'active':itema.path===$route.path}"
          v-show="permission.includes(itema.key)"
        >
          <router-link :to="{path: itema.path}">{{itema.name}}</router-link>
        </p>
      </div>
    </div>
    <div class="breads">
      <div class="left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            <svg-icon iconClass="home"></svg-icon>首页
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index+'berads'">
            <!-- <router-link :to="{path:item.path}"> -->
            {{item.name}}
            <!-- </router-link> -->
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="right">
        <svg-icon iconClass="back" class="router-icon" @click.native="$router.go(-1)"></svg-icon>
        <svg-icon iconClass="refresh" class="router-icon" @click.native="refreshRoute"></svg-icon>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      headerNav: [
        {
          name: "计划管理",
          icon: "guide",
          type: "planMan",
          list: [
            {
              name: "计划制定",
              key: "plan",
              list: [
                {
                  name: "计划编制",
                  path: "/plan/PlanFormulation",
                  key: "PlanFormulation"
                },
                {
                  name: "计划审批",
                  path: "/plan/PlanApproval",
                  key: "PlanApproval"
                }
              ]
            },
            {
              name: "计划列表",
              key: "list",
              list: [
                {
                  name: "计划概览",
                  path: "/plan/PlanOverview",
                  key: "PlanOverview"
                },
                {
                  name: "管理分析",
                  path: "/plan/ManagementAnalysis",
                  key: "ManagementAnalysis"
                }
              ]
            }
          ]
        },
        {
          name: "项目管理",
          icon: "chart"
        },
        {
          name: "任务管理",
          icon: "email"
        }
      ],
      // leftNav: [],
      headerIndex: 0,
      leftKey: ""
    };
  },
  created() {
    this.SET_PERMISSION(["PlanFormulation", "PlanApproval", "PlanOverview"]);
    console.log(this.$route);
  },
  computed: {
    ...mapGetters(["permission"]),
    leftNav() {
      return this.headerNav[this.headerIndex].list;
    }
  },
  methods: {
    ...mapMutations(["SET_PERMISSION"]),
    changeHeaderNav(index) {
      this.headerIndex = index;
    },
    changeLeft(key) {
      this.leftKey = key;
    },
    refreshRoute() {
      const { fullPath } = this.$route;
      this.$router.replace({
        path: "/refresh"
      });
    }
  },
  mounted() {
    if (
      this.permission.includes("PlanFormulation") ||
      this.permission.includes("PlanApproval")
    ) {
      this.permission.push("plan");
    }
    if (
      this.permission.includes("PlanOverview") ||
      this.permission.includes("ManagementAnalysis")
    ) {
      this.permission.push("list");
    }
    // console.log(this.$store.state);
  }
};
</script>
<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #333744;
  overflow: hidden;
  color: #fff;
  .logo {
    float: left;
    line-height: 50px;
    margin: 0 20px;
  }
  .header-nav {
    float: left;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    .nav-item {
      float: left;
      margin: 0 5px;
      cursor: pointer;
      .name {
        margin: 0 2px;
      }
      &.active {
        font-weight: bold;
      }
      &:hover {
        font-weight: bold;
      }
    }
  }
  .right {
    float: right;
    height: 50px;
    overflow: hidden;
    line-height: 50px;
    .item {
      float: left;
      margin: 0 10px;
      .el-dropdown-link {
        color: #fff;
      }
    }
  }
}
.nav {
  position: fixed;
  top: 50px;
  left: 0;
  width: 240px;
  bottom: 0;
  background: #fff;
  .left-nav {
    width: 100%;
    p {
      width: 100%;
      padding-left: 20px;
      margin: 0;
      font-size: 14px;
      a {
        display: block;
        width: 100%;
        height: 45px;
        line-height: 45px;
        color: #333;
      }
      // text-align: center;
      &.sec-title {
        height: 50px;
        line-height: 50px;
        background: #eee;
        .name {
          font-size: 16px;
          margin: 0 4px;
        }
      }
      &.active {
        background: #ccc;
      }
    }
  }
}
.content {
  position: fixed;
  top: 100px;
  left: 240px;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  overflow: auto;
  .wrapper {
    min-width: 1300px;
    min-height: 700px;
  }
}
.breads {
  position: fixed;
  left: 240px;
  right: 0;
  top: 50px;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background: #fff;
  .left {
    height: 50px;
    // line-height: 50px;
    float: left;
    .el-breadcrumb {
      line-height: 50px;
    }
  }
  .right {
    float: right;
    .router-icon {
      margin: 0 10px;
      cursor: pointer;
    }
  }
}
</style>

