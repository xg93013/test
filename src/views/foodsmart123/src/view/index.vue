<template>
    <div id="container-warp">
        <div id='header'>
            <!-- <div class='logo'></div> -->
            <!-- <img style="position:relative;height:30px;top:6px;margin-right:10px" :src="require('./logo_icon.png')" alt=""> -->
            智慧餐饮监管平台
            <div class='user-msg' @mouseover="height=80" @mouseout="height=0">
                欢迎回来！{{userInfo.name}}
                <img :src="require('../images/user.png')" alt="" />
                <div class='pop-lists' :style='{height: height+"px"}'>
                    <div class='pop-list' @click="editPassWord">修改密码</div>
                    <a class='pop-list' :href="baseUrl">退出登录</a>
                </div>
            </div>

        </div>
        <Sidebar />
        <div class="main-container">
            <div class="pad-con" >
                <router-view @closeLoading = "closeLoading" />
            </div>
        </div>
        <!-- <div v-show="isLoading" v-loading.lock="isLoading" :element-loading-text="loadingText" element-loading-background="rgba(15,33,80,0.6)" class="backLoading">
        </div> -->
    </div>
</template>
<script>
import Sidebar from './sidebar';
import http from "@/unit/http";
import apis from "@/unit/apis";
export default {
    components: {
        Sidebar
    },
    data (){
        return {
            isLoading: true,
            loadingText: '加载中...',
            baseUrl: window.location.href.slice(0, "#") + "frontchannel_logout",
            height: 0,
            newBaseUrl: "",
            userInfo: {},
            areas: '',
        }
    },
    created () {
        
    },
    methods: {
        closeLoading(e){
            this.isLoading = e;
        },
        async getUserInfo() {
            let res = await http.get("/oidc/user/base-info");
            if (res) {
                this.userInfo = res.data;
                this.areas = res.data.apps[0].area;
            }
        },
        async getBaseUrl() {
            let res = await http.get("/oidc/app-info");
            this.show = true;
            if (res) {
                this.newBaseUrl = res.data.indexUrl;
                sessionStorage.setItem("newBaseUrl", res.data.indexUrl);
            }
        },
        editPassWord() {
            let baseUrl = this.newBaseUrl;
            window.open(
                baseUrl + "#/modifyPassword",
                "newwindow",
                "height=400, width=800,left=400,top=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"
            );
        }
    },
    mounted () {},
    watch:{
        $route(){
            this.isLoading = true;
        }
    }
}
</script>
<style lang='scss'>
#container-warp{
    #header{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #1b223e;
        text-align: center;
        line-height: 60px;
        font-size: 28px;
        color: #fff;
        border-bottom: 1px solid #27375f;
        z-index: 100;
        .user-msg {
            position: absolute;
            padding: 0 20px;
            height: 100%;
            right: 0;
            top: 0;
            color: #7481a4;
            font-size: 16px;
            cursor: pointer;
            z-index:999;

            img {
                position: relative;
                width: 28px;
                height: 28px;
                top: 7px;
            }
            .pop-lists {
                position: absolute;
                top: 60px;
                background: #27375f;
                right: 20px;
                transition: all 0.3s;
                overflow: hidden;
                .pop-list {
                    display: block;
                    color: #dae6ff;
                    height: 30px;
                    line-height: 30px;
                    width: 100px;
                    text-align: center;
                    cursor: pointer;
                    background: #27375f;
                    transition: all 0.3s;
                    margin: 5px 0;
                    &:hover {
                        background: #1b223e;
                    }
                }
            }
        }
    }
    .main-container{
        position: fixed;
        left: 48px;
        right: 0;
        top: 60px;
        bottom: 0;
        background: #f5f5f5;
        overflow: auto;
        .pad-con{
            min-height: 400px;
            min-width: 1000px;
            // padding: 25px 15px 15px 15px;
            width: 100%;
            height: 100%;
        }
    }
    .backLoading{
        position: fixed;
        top: 60px;
        left: 48px;
        right: 0;
        bottom: 0;
        z-index: 999;
        .el-loading-spinner .path{
            stroke: #fff;
        }
        .el-loading-text{
            color: #fff;
        }
    }
}
</style>
