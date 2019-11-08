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
          <svg-icon :iconClass="PathIcon[item.name].iconClass"></svg-icon>
          <span class="name">{{item.name}}</span>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <el-dropdown>
            <span class="el-dropdown-link">
              admin
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>基本信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="left-nav" v-for="(item, index) in leftNav" :key="index+'leftnav'">
        <p class="sec-title">
          <svg-icon :iconClass="PathIcon[item.name].iconClass"></svg-icon>
          <span class="name">{{item.name}}</span>
        </p>
        <p
          v-for="(itema, indexa) in item.children"
          :key="indexa+'leftin'"
          :class="{'active':itema.path===$route.path}"
        >
          <router-link :to="{path: itema.path}">{{itema.name}}</router-link>
        </p>
      </div>
    </div>
    <div class="breads">
      <div class="left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">
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
import { setStorage, getStorage, deepClone } from "@/utils/index.js";
import pathIcon from "@/assets/pathIcon.js";
import { mapMutations, mapGetters } from "vuex";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { PERMISSIONS, USERINFO, EXPORT_BASE } = apis;

export default {
  data() {
    return {
      PathIcon: {},
      originNav: [],
      headerNav: [],
      headerIndex: 0,
      enterpriseType: "FOOD_PRODUCTION",
      leftNav: []
    };
  },
  created() {
    // this.CHANGE_LOADING(true);
    this.PathIcon = pathIcon;
    this.getUserInfo();
    setStorage("enterpriseType", "FOOD_PRODUCTION");
    // let originArr = [
    //   {
    //     name: "风险评定管理",
    //     code: "risk",
    //     canSelect: true,
    //     children: [
    //       {
    //         name: "普通食品生产企业",
    //         code: "GEN_FOOD_PRODUCT",
    //         canSelect: true,
    //         children: [
    //           {
    //             name: "跟踪指导",
    //             code: "TRACK_GUIDE_GFP",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "报告审批",
    //             code: "REPORT_APPROVAL_GPF",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "现场检查",
    //             code: "SPOT_RECORD_GFP",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "整改复查",
    //             code: "SPOT_REVIEW_GFP",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "静态风险因素评定",
    //             code: "STATIC_RISK_GFP",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "报告编制",
    //             code: "REPORT_EDIT_GPF",
    //             canSelect: true,
    //             children: []
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     name: "体系检查计划管理",
    //     code: "plan",
    //     canSelect: true,
    //     children: [
    //       {
    //         name: "计划制定",
    //         code: "PLAN_MADE",
    //         canSelect: true,
    //         children: [
    //           {
    //             name: "计划编制",
    //             code: "PLAN_EDIT",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "任务分配",
    //             code: "TASK_DISPATCH",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "计划概览",
    //             code: "PLAN_OVERVIEW",
    //             canSelect: true,
    //             children: []
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     name: "体系检查模板管理",
    //     code: "template",
    //     canSelect: true,
    //     children: [
    //       {
    //         name: "体系检查模板",
    //         code: "TEMPLATE",
    //         canSelect: true,
    //         children: [
    //           {
    //             name: "模板编辑",
    //             code: "TEMPLATE_EDIT",
    //             canSelect: true,
    //             children: []
    //           },
    //           {
    //             name: "模板查询",
    //             code: "TEMPLATE_VIEW",
    //             canSelect: true,
    //             children: []
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ];
    // this.setMenu(originArr);
  },
  computed: {},
  methods: {
    async getUserInfo() {
      let res = await http.get(USERINFO);
      if (res) {
        let originArr = res.data.data.permissions;
        this.setMenu(originArr);
      }
    },
    setMenu(originArr) {
      console.log(this.$route);
      for (let i = 0; i < originArr.length; i++) {
        originArr[i].path = this.PathIcon[originArr[i].name].path;
        if (originArr[i].children != null) {
          for (let j = 0; j < originArr[i].children.length; j++) {
            originArr[i].children[j].path = this.PathIcon[
              originArr[i].children[j].name
            ].path;
            if (originArr[i].children[j].children != null) {
              for (
                let k = 0;
                k < originArr[i].children[j].children.length;
                k++
              ) {
                originArr[i].children[j].children[k].path = this.PathIcon[
                  originArr[i].children[j].children[k].name
                ].path;
              }
            }
          }
        }
      }
      this.headerNav = originArr;
      if (this.$route.path == "/home") {
        this.headerIndex = 0;
        console.log(this.headerIndex);
        setStorage("headerIndex", {
          index: 0,
          name: this.headerNav[0].name
        });
        this.$router.push(
          this.headerNav[this.headerIndex].children[0].children[0].path
        );
      } else {
        let pageStorage = getStorage("headerIndex")[0];
        let index = 0;
        for (let i = 0; i < this.headerNav.length; i++) {
          if (pageStorage.name == this.headerNav[i].name) {
            index = i;
            break;
          } else {
            continue;
          }
        }
        this.headerIndex = index;
      }
      this.leftNav = deepClone(this.headerNav[this.headerIndex].children);
    },
    changeHeaderNav(index, item) {
      if (index != this.headerIndex) {
        this.headerIndex = index;
        this.leftNav = deepClone(this.headerNav[index].children);
        this.$router.push(
          this.headerNav[this.headerIndex].children[0].children[0].path
        );
        setStorage("headerIndex", {
          index: index,
          name: this.headerNav[index].name
        });
      }
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

