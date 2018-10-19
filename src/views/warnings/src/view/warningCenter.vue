<template>
    <div id='warnCenter'>
        <div id='header'>
            <!-- <div class='logo'></div> -->
            <img style="position:relative;height:30px;top:6px;margin-right:10px" :src="require('./logo_icon.png')" alt="">成都市食品安全监测预警数据中心
            <div class='user-msg' @mouseover="height=80" @mouseout="height=0">
                欢迎回来！{{userInfo.name}}
                <img :src="require('../images/user.png')" alt="" />
                <div class='pop-lists' :style='{height: height+"px"}'>
                    <div class='pop-list' @click="editPassWord">修改密码</div>
                    <a class='pop-list' :href="baseUrl">退出登录</a>
                </div>
            </div>

        </div>
        <div id='content'>
            <div class='con-box'>
                <foodWarn v-if='show' />
                <inspecItemWarn v-if='show' />
                <distribution v-if='show' />            
                <componyWarn v-if='show' />
                <!-- <efficiencyAnalysis v-if='show' /> -->
                <efficiencyPlatform v-if='show' />
                <internatInfo v-if='show' />
            </div>
        </div>
    </div>
</template>

<script>
import foodWarn from "./foodWarn/food-warn.vue";
import inspecItemWarn from "./inspecItemWarn/inspec-item-warn.vue";
import internatInfo from "./internatInfo/internat-info.vue";
import componyWarn from "./componyWarn/compony-warn.vue";
import distribution from "./distribution/distribution.vue";
import efficiencyAnalysis from "./efficiencyAnalysis/efficiency-analysis.vue";
import efficiencyPlatform from "./efficiencyPlatform/efficiency-platform.vue";
import http from "../unit/http";
export default {
    data() {
        return {
            baseUrl: window.location.href.slice(0, "#") + "frontchannel_logout",
            height: 0,
            newBaseUrl: "",
            userInfo: {},
            show: true
        };
    },
    methods: {
        async getUserInfo() {
            let res = await http.get("/oidc/user/base-info");
            if (res) {
                this.userInfo = res.data;
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
    components: {
        foodWarn,
        inspecItemWarn,
        internatInfo,
        componyWarn,
        distribution,
        // efficiencyAnalysis
        efficiencyPlatform
    },
    mounted() {
        // this.getBaseUrl();
        // this.getUserInfo();
    }
};
</script>

<style scoped>
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #333;
}
/*滚动条的轨道*/

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
    background-color: #1b223e;
}
/*滚动条的滑块按钮*/

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #363e5d;
    box-shadow: inset 0 0 5px #000;
}
/*滚动条的上下两端的按钮*/

::-webkit-scrollbar-button {
    height: 10px;
    background-color: #1b223e;
}
</style>
<style lang='scss'>
#warnCenter {
    color: #dae6ff;
    font-family: simhei;
    font-size: 14px;
    * {
        box-sizing: border-box;
    }
    #header,
    #content {
        position: fixed;
        left: 0;
        right: 0;
    }
    #header {
        top: 0;
        height: 50px;
        background: #1b223e;
        text-align: center;
        line-height: 50px;
        font-size: 28px;
        border-bottom: 1px solid #27375f;
        z-index: 100;
        .logo {
            position: absolute;
            left: 0;
            width: 50px;
            height: 100%;
            background: url(../images/logo.png) no-repeat 12px 14px;
            background-color: #2681dc;
        }
        .user-msg {
            position: absolute;
            padding: 0 20px;
            height: 100%;
            right: 0;
            top: 0;
            color: #7481a4;
            font-size: 16px;
            cursor: pointer;

            img {
                position: relative;
                width: 28px;
                height: 28px;
                top: 7px;
            }
            .pop-lists {
                position: absolute;
                top: 50px;
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
    #content {
        top: 50px;
        bottom: 0;
        overflow: auto;
        background: #151b2f;
        padding: 15px;
        .con-box {
            width: 100%;
            min-width: 1800px;
            height: 100%;
        }
        .warn-list {
            float: left;
            width: 33.3%;
            height: 500px;
            /*height: 50%;
				min-height: 480px;*/
            padding: 5px;
        }
        .warn-list-box {
            position: relative;
            width: 100%;
            height: 100%;
            background: #1b223e;
            .list-title,
            .list-content {
                position: absolute;
                width: 100%;
            }
            .list-title {
                top: 0;
                height: 34px;
                line-height: 34px;
                background: #11162a;
                padding: 0 20px;
                font-size: 16px;
            }
            .list-content {
                top: 34px;
                bottom: 0;
            }
        }
    }
    /*
		 ** 公用部分的样式 
		 */
    .szl-export {
        padding: 0 4px 0 24px;
        background: url(../images/export.png) no-repeat 8px 7px;
        border-radius: 2px;
        transition: all 0.3s;
        color: #dae6ff;
        &:hover {
            background-color: #1b223e;
        }
    }
}
</style>