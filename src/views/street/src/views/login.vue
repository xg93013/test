<template>
	<div class="szl-login">
		<div class="bg"></div>
		<div class="content">
			<div class="head">政务基础大数据平台</div>
			<div class="login-msg">
				<Row>
					<i-col style="font-size:18px;color:#2d8cf0;font-weight:bold;letter-spacing: 2px;">用户登录</i-col>
				</Row>
				<Form ref="loginForm" :model="formData" :rules="rules">
					<Row style="margin-top: 20px">
						<i-col span="19" style="margin-left: 42px">
							<FormItem prop="username">
								<Input placeholder="请输入账号" @keyup.enter.native="login" v-model="formData.username" class="szl-login-input">
								<span slot="prepend">
										<Icon type="person" style="color:#BBC8D6;font-size:20px"></Icon>
									</span>
								</Input>
							</FormItem>
						</i-col>
					</Row>
					<Row>
						<i-col span="19"  style="margin-left: 42px">
							<FormItem prop="password">
								<Input placeholder="请输入密码" @keyup.enter.native="login" v-model="formData.password" type="password" class="szl-login-input">
								<span slot="prepend">
										<Icon type="locked" style="color:#BBC8D6;font-size:18px"></Icon>
									</span>
								</Input>
							</FormItem>
						</i-col>
					</Row>
				</Form>
				<Row>
					<i-col>
						<Button type="primary" style="width:318px;margin-left:2px"  @click="login">
							<span style="letter-spacing: 6px;">确认登录</span>
						</Button>
					</i-col>
				</Row>
				<Row style="margin-top: 10px">
					<i-col>
						<span style="color:#2d8cf0;cursor:pointer" @click="forget">
							忘记密码？
						</span>
					</i-col>
				</Row>
				<Spin size="large" fix v-show="loading"></Spin>
			</div>
			<div class="foot">
				<div class="t">
					<img src="../images/logo.png" alt="" /> 成都高新区·国家自主创新示范区
				</div>
				<div class="b">
					<span style="font-size: 12px">
						CHENGDU HI-TECH INDUSTRIAL DEVELOPMENT ZONE
					</span>
				</div>
			</div>
		</div>
		<Modal v-model="deleteConfirmModel.show" cancel-text="" :title="deleteConfirmModel.title" width="300px" class-name="customConfirmModal">
			<Icon type="android-alert" color="#f90" size="30" />
			<span>{{deleteConfirmModel.content}}</span>
		</Modal>
	</div>
</template>

<script>
	import { communicationService, utilService, modalService } from '@/libs/uBase';
	export default {
		data() {
			return {
				loading: false,
				deleteConfirmModel:{
					show: false,
					title: "提示",
					content: "请联系管理员"
				},
				formData: {
					username: "",
					password: ""
				},
				rules: {
					username: [{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur|change'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur|change'
					}]
				}
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm=>{
				sessionStorage.clear();
			})
		},
		methods: {
			login() {
				this.$refs["loginForm"].validate(valid=>{
					if(!valid){
						return false
					}
					this.loading = true;
					communicationService.post(utilService.getResourceUrl("/login?username="+this.formData.username+"&password="+this.formData.password),{}, result => {
						if(result.state.code == 0) {
							this.getUserRights();
						}else{
							this.loading=false;
							this.$Message.error({
								title: "提示",
								content: result.state.description,
								duration: 2
							})
						}
					});
				})
			},
			forget(){
				this.deleteConfirmModel.show=true;
			},
			getUserRights(){//获取用户权限,判断用户该跳转到哪一个页面
				communicationService.get(utilService.getResourceUrl("/permission/list"), result => {
					this.loading = false;
					if(result.state.code == 0) {
						if(result.data){
							let data={};
							result.data.forEach(item=>{
								data[item.code]=item.name;
							})
							sessionStorage.setItem("szlUserRights",JSON.stringify(data));
							if(data.work_table_menu){
								this.$router.push("main/work-table-menu");
								return false;
							};
							if(data.resource_dir_menu){
								this.$router.push("main/resource-dir-menu");
								return false;
							};
							if(data.application){
								this.$router.push("main/application");
								return false;
							};
							if(data.account_manage_menu){
								this.$router.push("main/account-manage-menu");
								return false;
							};
						}else{
							sessionStorage.setItem("szlUserRights","");
						}
					}
				}, result => {
					this.loading = false;
					utilService.handleException(result);
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "../styles/common.scss";
	@import "../styles/global.scss";
	.szl-login-input .ivu-input {
		background: #ECECEC;
	}
	
	.szl-login {
		*,input{
			font-size: 14px;
		}
		position: relative;
		width: 100%;
		min-width: 1200px;
		height: 100%;
		min-height: 600px;
		.bg,
		.content {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}
		.bg {
			background-image: url(../images/login_bg.jpg);
			background-size: 100% auto;
			filter: blur(5px);
		}
		.content {
			box-sizing: border-box;
			padding: 40px 0;
			background: rgba(0, 0, 0, .5);
			.head {
				position: absolute;
				width: 100%;
				top: 22%;
				color: #fff;
				font-size: 46px;
				text-align: center;
				font-weight: bold;
				letter-spacing: 6px;
			}
			.foot {
				font-family: "宋体";
				position: absolute;
				width: 100%;
				bottom: 40px;
				color: #fff;
				text-shadow: 0px 1px 1px #fff;
			}
			.t,
			.b {
				width: 300px;
				margin: 0 auto;
				text-align: left;
				padding-left: 18px;
			}
			.t {
				position: relative;
				font-size: 18px;
				img {
					position: absolute;
					width: 36px;
					left: -22px;
				}
			}
			.b {
				font-size: 12px;
				span {
					position: relative;
					display: inline-block;
					transform: scale(.9);
					left: -12px;
					top: -6px;
				}
			}
			.login-msg {
				position: absolute;
				width: 400px;
				padding: 20px 0 30px 0;
				text-align: center;
				border-radius: 6px;
				background: rgba(255,255,255,1);
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
</style>