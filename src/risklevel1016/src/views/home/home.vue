<template>
  <div class="home">
    <div class="header">
      <div class="logo">成都食品生产企业风险评定分级系统</div>
      <div class="header-nav">
        <div
          class="nav-item"
          v-for="(item, index) in headerNav"
          :key="index+'header'"
          :class="{'active':index === headerIndex}"
          @click="changeHeaderNav(index, item)"
        >
          <!-- v-show="item.allRoles.includes(currentRole)" -->
          <svg-icon :iconClass="PathIcon[item.path].iconClass"></svg-icon>
          <span class="name">{{item.name}}</span>
        </div>
      </div>
      <div class="right">
        <!-- <div class="item">
          <svg-icon iconClass="message"></svg-icon>
          <span class="name">消息</span>
        </div>-->
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
              <!-- <el-dropdown-item>修改资料</el-dropdown-item> -->
              <!-- <el-dropdown-item>修改头像</el-dropdown-item> -->
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="left-nav" v-for="(item, index) in leftNav" :key="index+'leftnav'">
        <!-- v-show="item.allRoles.includes(currentRole)" -->
        <p class="sec-title">
          <svg-icon iconClass="list"></svg-icon>
          <span class="name">{{item.name}}</span>
        </p>
        <p
          v-for="(itema, indexa) in item.list"
          :key="indexa+'leftin'"
          @click="changeLeft('key'+index+''+indexa)"
          :class="{'active':itema.path===$route.path}"
        >
          <!-- v-show="itema.allRoles.includes(currentRole)" -->
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
          <el-breadcrumb-item
            v-for="(item, index) in $route.matched"
            :key="index+'berads'"
          >{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="right">
        <svg-icon iconClass="back" class="router-icon" @click.native="$router.go(-1)"></svg-icon>
        <svg-icon iconClass="refresh" class="router-icon" @click.native="refreshRoute"></svg-icon>
      </div>
    </div>
    <div class="content">
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
    <!-- <div class="loadings" v-loading="loading" :style="{display: loading ? 'block': 'none'}"></div> -->
  </div>
</template>
<script>
import { setCookie, getCookie } from "@/utils/index.js";
import pathIcon from "@/assets/pathIcon.js";
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      PathIcon: {},
      headerNav: [],
      headerIndex: 0,
      leftKey: "",
      currentRole: ""
    };
  },
  created() {
    this.CHANGE_LOADING(true);
    this.PathIcon = pathIcon;
    this.headerNav = [
      {
        name: "计划管理",
        icon: "guide",
        path: "/plan",
        list: [
          {
            name: "计划制定",
            list: [
              // {
              //   name: "计划编制",
              //   path: "/PlanFormulation"
              // },
              // {
              //   name: "计划审批",
              //   path: "/PlanApproval"
              // },
              {
                name: "任务分配",
                path: "/TaskAllocation"
              }
            ]
          }
          // {
          //   allRoles: ["PlanAdmin", "admin"],
          //   name: "计划列表",
          //   list: [
          //     {
          //       name: "计划概览",
          //       path: "/PlanOverview"
          //     },
          //     {
          //       name: "管理分析",
          //       path: "/ManagementAnalysis"
          //     }
          //   ]
          // }
        ]
      },
      {
        name: "风险评定",
        icon: "guide",
        path: "/riskManage",
        list: [
          {
            name: "静态风险因素评定",
            list: [
              {
                name: "企业列表",
                path: "/StaticAutoMatch"
              }
              // {
              //   name: "手动匹配列表",
              //   path: "/StaticManualMatch"
              // }
            ]
          },
          {
            name: "动态风险因素管理",
            list: [
              {
                name: "现场检查",
                path: "/Inspection"
              }
            ]
          }
        ]
      }
    ];
    let index = getCookie("headerIndex");
    if (index) {
      this.headerIndex = parseInt(index);
    } else {
      setCookie("headerIndex", 0);
      this.headerIndex = 0;
    }
    if (this.$route.path == "/home") {
      console.log(this.headerNav[this.headerIndex].list[0].list[0].path);
      this.$router.push(this.headerNav[this.headerIndex].list[0].list[0].path);
    }
    setTimeout(() => {
      this.CHANGE_LOADING(false);
    }, 3000);
    // this.currentRole = "admin"; // 当前角色
    // // let allRole = [
    // //   "admin",
    // //   "PlanFormulation",
    // //   "PlanApproval",
    // //   "PlanAdmin",
    // //   "ProgramFormulation",
    // //   "ProgramAdmin",
    // //   "ProgramOverview"
    // // ];
    // for (let i = 0; i < this.headerNav.length; i++) {
    //   if (this.headerNav[i].allRoles.includes(this.currentRole)) {
    //     this.headerIndex = i;
    //     if (this.$route.path == "/") {
    //       this.$router.push(this.headerNav[this.headerIndex].path);
    //     } else {
    //       this.$router.push(this.headerNav[this.headerIndex].path);
    //     }
    //   }
    // }
  },
  computed: {
    ...mapGetters(["loading"]),
    leftNav() {
      return this.headerNav[this.headerIndex].list;
    }
  },
  methods: {
    ...mapMutations(["CHANGE_LOADING"]),
    changeHeaderNav(index, item) {
      this.headerIndex = index;
      this.$router.push(this.headerNav[this.headerIndex].list[0].list[0].path);
      setCookie("headerIndex", index);
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
  mounted() {}
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  .header {
    position: absolute;
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
    position: absolute;
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
          background: #f5f5f5;
        }
      }
    }
  }
  .content {
    position: absolute;
    top: 100px;
    left: 240px;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    overflow: auto;
    .wrapper {
      // width: 100%;
      // height: 100%;
      min-width: 1300px;
      min-height: 600px;
      overflow: hidden;
    }
  }

  .loadings {
    position: absolute;
    top: 100px;
    left: 240px;
    right: 0;
    bottom: 0;
  }
}
</style>

