<style scoped lang="sass">
    /* common */
    
    // {cover} 覆盖样式
    // 引入公共变量及mixin
    @import "../styles/common.scss";
    .index {
        height: 100%;
        .ivu-dropdown-menu {
            text-align: center;
        }
    }
    
    .header {
        // width: 100%;
        @include normalStyle(100%, $topHeight, $topHeight);
        // height: $topHeight;
        // line-height: $topHeight;
        background-color: $defaultBgColor;
        position: absolute;
        top: 0px;
        left: 0px;
        min-width: 1600px;
        color: $defaultTextColor;
        .welcomeArea {
            font-size:16px;
        }
        // 导航背景色
        .ivu-menu-primary {
            background-color: transparent;
        }
        .logoTitle {
            h2 {
                font-size:20px;
                img {
                    @include edgeStyle(0px 15px);
                }
            }
        }
    }
    
    .body {
        background-color: transparent;
        padding-top: $topHeight;
        height: 100%;
    }
    
    .routeArea {
        @include normalStyle(100%, 100%);
        @include edgeStyle(null, 20px);
        position:relative;
    }
    
    .szl-router-link {
        font-size:$smallTitle;
        display: inline-block;
        width: 100px;
        height: 50px;
        color: #fff;
        margin-top: 9px;
        text-align: center;
        line-height: 50px;
        margin-right: 10px;
        &:hover {
            background: #2D8CF0;
            border-radius: 4px;
        }
    }
    
    .szl-router-link.router-link-active {
        background: #2D8CF0;
        border-radius: 4px;
    }
    
    .user-icon {
        position: relative;
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 1px solid #fff;
        line-height: 34px;
        border-radius: 50%;
        text-align: center;
        top: 4px;
        margin-left: 6px;
        cursor: pointer;
    }
</style>
<style lang="sass">
    @import "../styles/global.scss";
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle" class="header">
            <Col span="4" class="logoTitle">
                <h2>
                    <img src="../images/logo.png" alt="" style="vertical-align: middle;cursor:pointer;" @click="logoClick">
                    <span style="cursor:pointer;" @click="logoClick">政务基础大数据平台</span>
                </h2>
            </Col>
            <Col span="15">
                <router-link class="szl-router-link" v-for="item in menuModel" :to='{path: item.name}' v-if="(item.name=='work-table-menu'&&userRights.work_table_menu)||(item.name=='resource-dir-menu'&&userRights.resource_dir_menu)||(item.name=='application'&&userRights.application)||(item.name=='account-manage-menu'&&userRights.account_manage_menu)">
                    {{item.label}}
                </router-link>
            </Col>
            <Col span="5" align="right" class="welcomeArea"> 欢迎回来，{{loginName.userName}}
            <Dropdown trigger="click" placement="bottom-end" style="margin-right:10px" @on-click="dropClick">
                <div class="user-icon" style="margin-right:10px">
                    <icon name="user" scale="2"></icon>
                </div>
                <DropdownMenu slot="list">
                    <DropdownItem name="psd" v-if="userRights.modify_password">修改密码</DropdownItem>
                    <DropdownItem name="loginout">退出登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            </Col>
        </Row>
        <Row type="flex" justify="center" align="middle" class="body">
            <div class="routeArea">
                <router-view ref="childPage"></router-view>
                <Spin size="large" fix v-if="spinShow" style="color:white;background-color:rgba(0,0,0,.7);font-size:33px;" ref="globalSpin">
                    <Icon type="load-c" size=54 class="demo-spin-icon-load"></Icon>
                    <div style="margin-top:30px;" class="load-c-text">文件上传中，请勿刷新或离开此页面，否则可能导致上传失败...</div>
                </Spin>
            </div>
        </Row>
        <Row type="flex" justify="center" align="middle" class="footer"></Row>
    </div>
</template>
<script>
    import { communicationService, utilService, modalService } from '@/libs/uBase';

    export default {
        data() {
            return {
                userRights: JSON.parse(sessionStorage.getItem("szlUserRights")),
                loginName: {},
                menuModel: [{
                    name: "work-table-menu",
                    label: "工作表"
                }, {
                    name: "resource-dir-menu",
                    label: "资源目录"
                }, {
                    name: "application",
                    label: "数据应用"
                }, {
                    name: "account-manage-menu",
                    label: "账户管理"
                }]
            }
        },
        computed : {
            spinShow(){
                return this.$store.state.routerSpinShow;
            }
        },
        methods: {
            logoClick : function (argument) {
                this.$router.push({
                    path: "work-table-menu"
                })
            },
            getUserMsg() { //获取用户信息，当前项目页面比较少，所以采用prop传值，不采用vuex
                communicationService.get(utilService.getResourceUrl("/user/login-info"), result => {
                    if(result.state.code == 0) {
                    	this.loginName = result.data;
                    }
                }, result => {
                    utilService.handleException(result);
                });
            },
            dropClick(e) {
                if(e == "psd") { //修改密码
                    if(this.$route.name == "accountManageMenu") {
                        this.$router.replace({
                            path: "account-manage-menu",
                            query: {
                                from: 1
                            }
                        })
                        this.$refs.childPage.currentTab();
                    } else {
                        this.$router.push({
                            path: "account-manage-menu",
                            query: {
                                from: 1
                            }
                        })
                    }
                } else { //退出登录
                    this.$router.push("/");
                    communicationService.post(utilService.getResourceUrl("/logout"), result => {
                    });
                }
            }
        },
        created() {
            this.getUserMsg();
        }
    }
    //  code=1///用户需登录
</script>