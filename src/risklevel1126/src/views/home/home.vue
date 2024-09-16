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
          <svg-icon :iconClass="PathIcon[item.name].iconClass" class="left-icon"></svg-icon>
          <span class="name">{{item.name}}</span>
          <span class="nav-icon">
            <svg-icon iconClass="nav-icon" v-show="index === headerIndex" class="in-icon"></svg-icon>
          </span>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{userMsg}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>基本信息</el-dropdown-item> -->
              <el-dropdown-item @click.native="editPassWord()">修改密码</el-dropdown-item>
              <el-dropdown-item>
                <a :href="baseUrl" class="exit-login">退出登录</a>
              </el-dropdown-item>
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
          class="sec-item"
          :class="{'active':itema.path===$route.path && item.code == currentCode}"
        >
          <!-- <router-link :to="{path: itema.path,query:{code:item.code}}">{{itema.name}}</router-link> -->
          <span @click="changePage(itema.path, item.code)">{{itema.name}}</span>
        </p>
      </div>
    </div>
    <div class="breads">
      <div class="left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <svg-icon iconClass="home" style="color:#c2c2c2"></svg-icon>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in $route.matched"
            :key="index+'berads'"
            style="color:#c2c2c2"
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
    <div class="loadings" v-loading="loading" :style="{display: loading ? 'block': 'none'}"></div>
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
      leftNav: [],
      currentCode: "",
      baseUrl: "",
      newBaseUrl: "",
      userMsg: ""
    };
  },
  created() {
    //this.CHANGE_LOADING(true);
    this.PathIcon = pathIcon;
    this.getUserInfo();
    // this.getUserMsg();
  },
  computed: {
    ...mapGetters(["loading"])
  },
  methods: {
    async getUserInfo() {
      let res = await http.get(USERINFO);
      if (res) {
        let originArr = res.data.data.permissions;
        this.setMenu(originArr);
      }
    },
    setMenu(originArr) {
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
        let code = this.headerNav[this.headerIndex].children[0].code;
        setStorage("headerIndex", {
          index: 0,
          name: this.headerNav[0].name
        });
        setStorage("currentCode", code);
        this.$router.push({
          path: this.headerNav[this.headerIndex].children[0].children[0].path,
          query: {
            code: code
          }
        });
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
        // this.leftNav = deepClone(this.headerNav[this.headerIndex].children);
      }
      this.leftNav = deepClone(this.headerNav[this.headerIndex].children);
      if (getStorage("currentCode")) {
        let code = getStorage("currentCode")[0];
        this.currentCode = code;
      } else {
        this.currentCode = this.headerNav[this.headerIndex].children[0].code;
      }
      this.leftNav = deepClone(this.headerNav[this.headerIndex].children);
    },
    changeHeaderNav(index, item) {
      if (index != this.headerIndex) {
        this.headerIndex = index;
        this.leftNav = deepClone(this.headerNav[index].children);
        this.currentCode = this.headerNav[this.headerIndex].children[0].code;
        this.$router.push({
          path: this.headerNav[this.headerIndex].children[0].children[0].path,
          query: {
            code: this.currentCode
          }
        });
        setStorage("headerIndex", {
          index: index,
          name: this.headerNav[index].name
        });
        setStorage("currentCode", this.currentCode);
      }
    },
    refreshRoute() {
      const { fullPath } = this.$route;
      this.$router.replace({
        path: "/refresh"
      });
    },
    toHome() {
      this.headerIndex = 0;
      setStorage("headerIndex", {
        index: 0,
        name: this.headerNav[0].name
      });
      this.$router.push(
        this.headerNav[this.headerIndex].children[0].children[0].path
      );
    },
    changePage(path, code) {
      setStorage("currentCode", code);
      this.$router.push({
        path: path,
        query: {
          code: code
        }
      });
      this.currentCode = code;
    },
    async getUserMsg() {
      let [userInfo, outUrl] = await Promise.all([
        http.get("/oidc/user/base-info"),
        http.get("/oidc/app-info")
      ]);
      if (userInfo) {
        this.userMsg = userInfo.data.data.name;
      }
      if (outUrl) {
        this.newBaseUrl = outUrl.data.data.indexUrl;
        this.baseUrl =
          window.location.href.slice(0, "#") + "frontchannel_logout";
        sessionStorage.setItem("newBaseUrl", this.newBaseUrl);
      }
    },

    editPassWord() {
      window.open(
        this.newBaseUrl + "#/modifyPassword",
        "newwindow",
        "height=400, width=800,left=400,top=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"
      );
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
      font-weight: bold;
      font-size: 16px;
    }
    .header-nav {
      float: left;
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      .nav-item {
        float: left;
        margin: 0 15px;
        cursor: pointer;
        overflow: hidden;
        .name,
        .left-icon,
        .nav-icon {
          float: left;
          height: 50px;
          line-height: 50px;
        }
        .name {
          margin: 0 2px;
        }
        .left-icon {
          float: left;
        }
        &.active {
          font-weight: bold;
        }
        &:hover {
          font-weight: bold;
        }
        .nav-icon {
          display: block;
          width: 20px;
          text-align: center;
          overflow: hidden;
          .in-icon {
            font-size: 20px;
            margin-top: 15px;
            margin-left: -8px;
          }
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
    border-right: 1px solid #ebebeb;
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
          font-weight: bold;
          color: rgb(63, 63, 63);
          .name {
            font-size: 16px;
            margin: 0 4px;
          }
        }
        &.sec-item {
          cursor: pointer;
          span {
            display: inline-block;
            width: 100%;
            height: 50px;
            line-height: 50px;
          }
          &.active {
            background: #f5f5f5;
            border-right: 4px solid #79bcff;
          }
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
.el-dropdown-menu__item {
  &:hover {
    color: #0079fe;
  }
}
.exit-login {
  color: #606266;
  &:hover {
    color: #0079fe;
  }
}
</style>

