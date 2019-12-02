<template>
  <div id="login" v-show="pageShow">
    <div class="login-box-bg">
      <div class="login-box" v-loading="loading" element-loading-text="登录中...">
        <el-form :model="loginData" class="login-form" :rules="rules" ref="ruleForm">
          <el-row style="margin-bottom:20px">
            <el-col align="center">
              <span
                style="font-size:28px;color:#276AB0;font-weight:bold;"
                :style="{'letter-spacing':urlMsg.orgName.length>10?'1px':'4px'}"
              >{{urlMsg.orgName}}</span>
            </el-col>
          </el-row>
          <el-form-item prop="username">
            <el-input
              clearable
              size="small"
              placeholder="用户名"
              v-model="loginData.username"
              @focus="focusFun"
              @keyup.enter.native="login"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              clearable
              size="small"
              type="password"
              placeholder="密码"
              v-model="loginData.password"
              @focus="focusFun"
              @keyup.enter.native="login"
            />
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-row>
              <el-col :span="14">
                <el-input
                  clearable
                  size="small"
                  v-model="loginData.verifyCode"
                  placeholder="验证码"
                  @focus="focusFun"
                  @keyup.enter.native="login"
                />
              </el-col>
              <el-col :offset="1" :span="9">
                <div class="code" @click="getCode">
                  <img v-show="codeUrl" :src="codeUrl" />
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-row style="margin-top: 30px">
            <el-col align="center" style="position:relative">
              <div
                v-show="loginerr"
                style="position:absolute;left:0;top:-30px;color:#f56c6c;font-size:12px"
              >{{loginerrTxt}}</div>
              <el-button class="login-btn" style="width:300px" size="small" @click="login">登录</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col align="center">
              <el-button class="forget" size="small" type="text" @click="show=true">忘记密码</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="footer" v-if="urlMsg.supportContact">技术支持：&nbsp;&nbsp;{{urlMsg.supportContact}}</div>
    <el-dialog title="忘记密码" :visible.sync="show" width="300px">
      <el-row>
        <el-col align="center">请联系系统管理员。</el-col>
      </el-row>
      <el-row style="margin-top:20px">
        <el-col align="center">
          <el-button size="small" type="primary" @click="show=false">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/unit/http";
import apis from "@/unit/apis";
import axios from "axios";
const { LOGIN, VERIFY_CODE, ACL, AUTH_LOGO } = apis;
export default {
  data() {
    return {
      urlMsg: {
        orgName: "",
        supportContact: ""
      },
      pageShow: false,
      codeUrl: "",
      loginerr: false,
      loginerrTxt: "",
      codeLoading: false,
      show: false,
      loading: false,
      loginData: {
        backend: false,
        password: "",
        username: "",
        verifyCode: "",
        dbCode: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change"
          }
        ],
        verifyCode: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "change"
          }
        ]
      },
      baseUrl: process.env.NODE_ENV == "development" ? "/apis" : ""
    };
  },
  methods: {
    focusFun() {
      if (this.loginerr) {
        this.loginerr = false;
      }
    },
    urlIsError() {
      let pathName = location.pathname.replace(/(^\/*)|(\/*$)/g, "");
      let pathArr = pathName ? pathName.split("/") : ["", ""];
      if (pathArr.length !== 2) {
        this.$router.replace("errora");
      } else {
        this.loginData.dbCode = pathArr[1];
        axios
          .get(
            this.baseUrl +
              AUTH_LOGO +
              (pathName
                ? "?" + "midUrl=" + pathArr[0] + "&dbcode=" + pathArr[1]
                : "")
          )
          .then(res => {
            let { result } = res.data;
            if (result) {
              this.urlMsg = result;
              document.getElementsByTagName("title")[0].innerText =
                result.orgName;
              this.isLogin();
            } else {
              this.$router.replace("errora");
            }
          });
      }
    },
    isLogin() {
      axios
        .get(this.baseUrl + ACL)
        .then(res => {
          let permissions = [...res.data.result.permissions];
          this.goPage(permissions);
        })
        .catch(res => {
          this.pageShow = true;
          this.getCode();
        });
    },
    login() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        this.getLogin();
      });
    },
    async getCode() {
      if (this.codeLoading) {
        return false;
      }
      this.codeLoading = true;
      let res = await axios({
        method: "get",
        url: this.baseUrl + VERIFY_CODE + Date.parse(new Date()) + ".jpg",
        responseType: "blob"
      });
      axios({
        method: "get",
        url: this.baseUrl + VERIFY_CODE + Date.parse(new Date()) + ".jpg",
        responseType: "blob"
      })
        .then(res => {
          this.codeLoading = false;
          this.codeUrl = window.URL.createObjectURL(new Blob([res.data]));
        })
        .catch(res => {
          this.codeLoading = false;
          this.$msgbox({
            title: "提示",
            message: res,
            type: "error"
          }).catch(_ => {});
        });
    },
    getLogin() {
      if (this.loading) {
        return false;
      }
      this.loading = true;
      axios
        .post(this.baseUrl + LOGIN, this.loginData)
        .then(ref => {
          let res = ref.data;
          let permissions = [...res.result.permissions];
          this.goPage(permissions);
        })
        .catch(err => {
          this.loading = false;
          this.getCode();
          if (err.response) {
            if (err.response.status == 500) {
              this.loginerrTxt = err.response.statusText;
            } else {
              if (err.response.data.message) {
                this.loginerrTxt = err.response.data.message;
              } else {
                this.loginerrTxt = err.response.data;
              }
            }
          } else {
            this.loginerrTxt = err;
          }
          this.loginerr = true;
        });
    },
    goPage(permissions) {
      if (permissions.includes("COMPREHENSIVE_ANALYSIS")) {
        //如果有首页权限
        this.$router.replace("index");
        return false;
      }
      if (permissions.includes("CERT_ANALYSIS")) {
        //如果有证照分析权限
        this.$router.replace("mt");
        return false;
      }
      if (permissions.includes("COMMENT_ANALYSIS")) {
        //如果有评论分析权限
        this.$router.replace("evaluateAnalysis");
        return false;
      }
      if (permissions.includes("RISK_ANALYSIS")) {
        //如果有风险分析权限
        this.$router.replace("riskAnalysis");
        return false;
      }
      if (permissions.includes("DATA_REPORT")) {
        //如果有数据报表权限
        this.$router.replace("dataReport");
        return false;
      }
      if (permissions.includes("ACCOUNT_MANAGEMENT")) {
        //如果有账户管理权限
        this.$router.replace("account");
        return false;
      }
    }
  },
  mounted() {
    this.urlIsError();
  }
};
</script>

<style lang="scss" scoped>
#login {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 140px 0;
  min-height: 700px;
  min-width: 1200px;
  /*overflow: auto;*/
  .login-box-bg {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../images/bgn.png);
    background-size: cover;
    background-position: center;
    .login-box {
      position: absolute;
      height: 60%;
      min-height: 400px;
      max-height: 450px;
      width: 370px;
      top: 50%;
      left: 60%;
      transform: translate(0, -50%);
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      .code {
        width: 100%;
        height: 32px;
        margin-top: 4px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .login-form {
      position: absolute;
      width: 300px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .login-btn {
      background: #276ab0;
      color: #fff;
      transition: all 0.3s;
      border-radius: 4px;
      &:hover {
        background: #1a5086;
      }
    }
    .forget {
      color: #888888;
      text-decoration: underline;
    }
  }
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 130px;
    text-align: center;
    font-size: 14px;
    color: #666;
  }
}
</style>