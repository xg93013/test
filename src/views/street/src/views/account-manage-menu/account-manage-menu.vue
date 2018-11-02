<style scoped lang="sass">
	@import "../../styles/common.scss";
	.account-management {
		min-height: 100%;
		background: #fff;
		.ivu-tabs {
			background-color: rgba(255, 255, 255, 1);
			@include normalStyle(null, 100%);
			.ivu-tabs-bar {
				background-color: rgba(237, 241, 242, 1);
				border: none;
				.ivu-tabs-tab {
					border: none !important;
				}
			}
		}
	}
</style>
<template>
	<div class="account-management tabpane-common">
		<Tabs type="card" :animated="false" v-model="tabModel.value" @on-click="tabClick">
			<TabPane v-if="userRights.role_manage" class="ivu-tabs-tabpane-map" :label="tabModel.tabs.roleManagement.label" :name="tabModel.tabs.roleManagement.name">
				<roleManagement></roleManagement>
			</TabPane>
			<TabPane v-if="userRights.user_manage_menu" class="ivu-tabs-tabpane-map" :label="tabModel.tabs.userManagement.label" :name="tabModel.tabs.userManagement.name">
				<userManagement ref="userManage"></userManagement>
			</TabPane>
			<TabPane v-if="userRights.system_log" :label="tabModel.tabs.systemLog.label" :name="tabModel.tabs.systemLog.name">
				<systemLog ref="systemlog"></systemLog>
			</TabPane>
			<TabPane v-if="userRights.modify_password" :label="tabModel.tabs.modifyPassword.label" :name="tabModel.tabs.modifyPassword.name">
				<modifyPassword></modifyPassword>
			</TabPane>
		</Tabs>
	</div>
</template>
<script>
	import roleManagement from './menus/roleManagement.vue'
	import userManagement from './menus/userManagement.vue'
	import systemLog from './menus/systemLog.vue'
	import modifyPassword from './menus/modifyPassword.vue'
	export default {
		data() {
			return {
				userRights:JSON.parse(sessionStorage.getItem("szlUserRights")),
				userManagement: false,
				systemLog: false,
				modifyPassword: false,
				tabModel: {
					value:"",
					tabs: {
						roleManagement: {
							name: "roleManagement",
							label: "角色管理"
						},
						userManagement: {
							name: "userManagement",
							label: "用户管理"
						},
						systemLog: {
							name: "systemLog",
							label: "系统日志"
						},
						modifyPassword: {
							name: "modifyPassword",
							label: "修改密码"
						}

					}
				},
			}
		},
		components:{
			roleManagement,
			userManagement,
			systemLog,
			modifyPassword
		},
		created(){
			this.loginUserName=this.userMsg;
			this.currentTab();
		},
		methods: {
			tabClick(e){
				if(this.$route.query.from){
					this.$router.replace("account-manage-menu");
				}
				switch (e){
					case "userManagement":
						if(!this.userManagement){
							this.userManagement=true;
							this.$refs.userManage.getUserLists();
						}
						break;
					case "systemLog":
						if(!this.systemLog){
							this.systemLog=true;
							this.$refs.systemlog.getLogLists();
						}
						break;	
					default:
						break;
				}
			},
			currentTab() {
				if(this.$route.query.from){//如果是从右上角修改密码进来
					this.tabModel.value="modifyPassword"
					return false;
				}
				let rights = JSON.parse(sessionStorage.getItem("szlUserRights"));
				if(rights.role_manage) {
					this.tabModel.value = "roleManagement";
					return false;
				};
				if(rights.user_manage_menu) {
					this.tabModel.value = "userManagement";
					this.$nextTick(()=>{
						this.userManagement=true;
						this.$refs.userManage.getUserLists();
					});
					return false;
				};
				if(rights.system_log) {
					this.tabModel.value = "systemLog";
					this.$nextTick(()=>{
						this.systemLog=true;
						this.$refs.systemlog.getLogLists();
					})
					return false;
				};
				if(rights.modify_password) {
					this.tabModel.value = "modifyPassword";
					return false;
				};
			}
		}
	}
</script>