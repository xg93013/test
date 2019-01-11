<template>
	<div id="home">
		<div id="header" :class="{'is-full-screen': leftSize==0}">
			<span>网络餐饮风险地图</span>
			<!--<img v-show="leftSize==0" src="../images/namea.png" alt="" />-->
			<div class="userName" v-show="leftSize>0">
				<span v-if="userMsg.orgName">{{userMsg.orgName}}<br /></span> {{userMsg.loginName}}
			</div>
			<el-dropdown class="userMsg" v-show="leftSize>0">
				<div class="el-dropdown-link">
					<div></div>
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="resetPsd.dialogShow=true">修改密码</el-dropdown-item>
					<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<div class="out-full" v-show="leftSize==0" @click="outFullScreen">退出全屏</div>
		</div>
		<div id="sidebar" v-show="leftSize>0">
			<div class="lists">
				<template v-for="(item,index) in sideBars">
					<router-link v-if="!item.children&&userMsg.permissions.includes(item.jur)" :key="index" :to="{path: item.path}" class="list" :class="path==item.path?item.path+'a':item.path">
						{{item.name}}
						<span class="full-screen" v-if="item.home&&path=='comAnalysis'" @click="fullScreen">全屏</span>
					</router-link>
					<div v-if="item.children&&userMsg.permissions.includes(item.jur)" class="list" :class="['mt','elm','bd'].includes(path)?item.path+'a':item.path" :key="index" @click="sideClick(item)">
						{{item.name}}
						<i class="arrow el-icon-arrow-right" :class="{'arrow-rotate': item.height>0}"></i>
					</div>
					<div :style="{height:item.height+'px'}" class="list-box" v-if="item.children&&userMsg.permissions.includes(item.jur)">
						<router-link :to="{path: itema.path}" class="list-child" v-for="(itema,indexa) in item.children" :key="indexa">{{itema.name}}</router-link>
					</div>
				</template>
			</div>
		</div>
		<div id="content" :style="{left: leftSize+'px'}" :class="{'is-full-screen': leftSize==0}">
			<router-view v-if="conShow" @outFullScreen="outFullScreen" @init="init" />
		</div>

		<el-dialog :close-on-click-modal=false title="修改密码" id="changePassword" :visible.sync="resetPsd.dialogShow" width="600px" :before-close="psdClose">
			<el-form v-loading="resetPsd.loading" element-loading-text="保存中..." :model="resetPsd" :rules="resetRules" ref="resetRuleForm" label-width="80px">
				<el-form-item style="margin-top:20px" label="旧密码" prop="oldPassword">
					<el-input size="small" type="password" placeholder="请输入旧密码" @keyup.enter.native="psdConfirm" v-model="resetPsd.oldPassword" />
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input size="small" type="password" placeholder="请输入新密码" @keyup.enter.native="psdConfirm" v-model="resetPsd.password" />
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input size="small" type="password" placeholder="请确认新密码" @keyup.enter.native="psdConfirm" v-model="resetPsd.confirmPassword" />
				</el-form-item>
				<el-row style="background:#f6f6f6;height:60px;line-height:60px">
					<el-col align="center">
						<div class="form-btn" @click="psdConfirm">确定</div>
						<div class="form-btn" @click="psdClose">取消</div>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>

		<div id="loadingBox" v-show="loading" v-loading="loading" element-loading-text="加载中..."></div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import http from "@/unit/http"
	import apis from "@/unit/apis"
	const {
		LOGOUT,
		ACL,
		PASSWORD,
		REGION_JSON
	} = apis
	export default {
		data() {
			const passwordFun = (rule, value, callback) => {
				let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$/;
				if(!value) {
					return callback(new Error('新密码不能为空'));
				}
				if(!reg.test(value)) {
					return callback(new Error('密码为8-16位，同时包含数字和字母'));
				}
				return callback();
			};
			const confirmPassword = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('确认密码不能为空'));
				}
				if(value != this.resetPsd.password) {
					return callback(new Error('两次输入的密码不一致'));
				}
				return callback();
			};
			return {
				resetPsd: {
					dialogShow: false,
					oldPassword: "",
					password: "",
					confirmPassword: ""
				},
				resetRules: {
					oldPassword: [{
						required: true,
						message: "旧密码不能为空",
						trigger: 'change'
					}],
					password: [{
						required: true,
						validator: passwordFun,
						trigger: 'change'
					}],
					confirmPassword: [{
						required: true,
						validator: confirmPassword,
						trigger: 'change'
					}]
				},
				conShow: false,
				path: "",
				childHight: 50,
				leftSize: 220,
				sideBars: [{
						name: "首页",
						home: true,
						path: "comAnalysis",
						jur: "COMPREHENSIVE_ANALYSIS",
					},
					{
						name: "证照分析",
						height: 0,
						path: "cardAbalysis",
						children: [{
								name: "美团外卖",
								path: "mt"
							},
							{
								name: "饿了么",
								path: "elm"
							},
							{
								name: "饿了么星选",
								path: "bd"
							}
						],
						jur: "CERT_ANALYSIS",
					},
					{
						name: "评论分析",
						path: "evaluateAnalysis",
						jur: "COMMENT_ANALYSIS",
					},
					{
						name: "风险分析",
						path: "riskAnalysis",
						jur: "RISK_ANALYSIS",
					},
					{
						name: "数据报表",
						path: "dataReport",
						jur: "DATA_REPORT"
					},
					{
						name: "账户管理",
						path: "account",
						jur: "ACCOUNT_MANAGEMENT"
					},
				],
				userMsg: {
					permissions: []
				},
			};
		},
		computed: {
			...mapState({
				loading: state => state.loading
			}),
		},
		methods: {
			async getUserMsg() { //获取用户信息，设置用户页面访问权限
				let [res, resa] = await Promise.all([
					http.get(ACL),
					http.get(REGION_JSON)
				]);
				if(res) {
					this.userMsg = { ...res.result
					}
					this.$store.commit("getUserMsg", { ...res.result
					});
					let permissions = [...res.result.permissions]
					let pages = ["error"];
					if(permissions.includes("COMPREHENSIVE_ANALYSIS")) { //如果有首页权限
						pages.push("comAnalysis")
					}
					if(permissions.includes("CERT_ANALYSIS")) { //如果有证照分析权限
						pages.push("mt");
						pages.push("elm");
						pages.push("bd");
					}
					if(permissions.includes("COMMENT_ANALYSIS")) { //如果有评论分析权限
						pages.push("evaluateAnalysis")
					}
					if(permissions.includes("RISK_ANALYSIS")) { //如果有风险分析权限
						pages.push("riskAnalysis")
					}
					if(permissions.includes("DATA_REPORT")) { //如果有数据报表权限
						pages.push("dataReport")
					}
					if(permissions.includes("ACCOUNT_MANAGEMENT")) { //如果有数据报表权限
						pages.push("account")
					}
					this.$store.commit("getPages", pages); ///确定用户可以访问的页面
				}
				
				if(resa){
					this.$store.commit("getMapJson", JSON.parse(resa.result))
				}
				
				this.$nextTick(() => { ///当用户信息获取完毕之后，再加载其他页面
					this.conShow = true;
				})
			},
			sideClick(item) {
				if(item.children) {
					if(item.height == 0) {
						item.height = item.children.length * this.childHight;
					} else {
						item.height = 0;
					}
				}
			},
			init(path) {
				this.path = path;
				if(["bd", "mt", "elm"].includes(path)) {
					this.sideBars[1].height =
						this.sideBars[1].children.length * this.childHight;
				}
			},
			fullScreen() { //全屏
				this.leftSize = 0;
				this.$store.commit("changeScreen", true);
				setTimeout(() => {
					let el = document.documentElement;
					let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
					if(typeof rfs != "undefined" && rfs) {
						rfs.call(el);
					};
				})
			},
			outFullScreen() {
				this.leftSize = 220;
				this.$store.commit("changeScreen", false);
				this.$nextTick(() => {
					if(document.exitFullscreen) {
						document.exitFullscreen();
					} else if(document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if(document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					} else if(document.msExitFullscreen) {
						document.msExitFullscreen();
					}
				})
			},
			logout() { //退出登录
				this.$confirm('确定要退出登录吗？', '退出登录', {
					type: "warning"
				}).then(_ => {
					this.out();
				}).catch(_ => {

				});
			},
			async out() {
				let res = await http.get(LOGOUT);
				if(res) {
					if(res.result) {
						this.$message.success("退出登录成功");
						this.$router.replace("/");
					}
				}
			},
			psdClose() {
				this.resetPsd = {
					loading: false,
					dialogShow: false,
					oldPassword: "",
					password: "",
					confirmPassword: ""
				}
				this.$nextTick(() => {
					this.$refs["resetRuleForm"].clearValidate();
				});
			},
			async newPassword() {
				this.resetPsd.loading = true;
				let res = await http.put(PASSWORD, {
					oldPassword: this.resetPsd.oldPassword,
					password: this.resetPsd.password
				});
				this.resetPsd.loading = false;
				if(res) {
					if(res) {
						this.$message.success("修改密码成功");
						this.psdClose();
					}
				}
			},
			psdConfirm() {
				this.$refs["resetRuleForm"].validate(valid => {
					if(!valid) {
						return false
					}
					this.newPassword();
				})
			}
		},
		created() {
			if(this.$route.name != "account") {
				this.$store.commit("changeLoading", true);
			} else {
				this.$store.commit("changeLoading", false);
			}
			this.init(this.$route.name);
			this.getUserMsg();
		},
		watch: {
			$route(to, from) {
				this.path = to.name;
				if(this.path != "account") {
					this.$store.commit("changeLoading", true);
				} else {
					this.$store.commit("changeLoading", false);
				}
			}
		}
	};
</script>

<style lang="scss">
	.el-message-box__btns .el-button {
		border: 1px solid #276AB0;
		color: #276AB0;
	}
	
	.el-message-box__btns .el-button--primary {
		color: #fff;
		background-color: #2E6DB4;
		border-color: #2E6DB4;
	}
	
	.el-button--small,
	.el-button--small.is-round {
		padding: 7px 20px;
	}
	
	.el-button--mini,
	.el-button--small {
		border-radius: 15px;
	}
	
	.el-popper {
		.popper__arrow {
			display: none !important;
		}
		margin: 0 !important;
	}
	
	#header.is-full-screen {
		text-align: center;
		color: #fff;
		background: #464F82;
		height: 100px;
		line-height: 100px;
		padding-left: 0;
		text-align: center;
		>span {
			color: #fff;
			font-size: 48px;
			font-weight: bold;
			letter-spacing: 6px;
		}
		.out-full {
			top: 30px;
		}
	}
	
	#header {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 65px;
		line-height: 65px;
		padding-left: 20px;
		background: #fff;
		>span {
			color: #276AB0;
			font-size: 24px;
		}
		>img {
			margin-top: 26px;
		}
		.out-full {
			position: absolute;
			width: 120px;
			height: 40px;
			background: #276AB0;
			border-radius: 40px;
			line-height: 40px;
			text-align: center;
			color: #fff;
			top: 20px;
			right: 20px;
			font-size: 18px;
			cursor: pointer;
		}
		.userName {
			position: absolute;
			text-align: right;
			line-height: 20px;
			right: 80px;
			top: 50%;
			transform: translate(0, -50%);
		}
		.userMsg {
			position: absolute;
			right: 20px;
			top: 0;
			.el-dropdown-link {
				position: relative;
				box-sizing: content-box;
				cursor: pointer;
				height: 40px;
				padding: 13px 0;
				line-height: 20px;
				font-size: 14px;
				text-align: right;
				padding-right: 50px;
				>div {
					position: absolute;
					width: 44px;
					height: 44px;
					right: 0;
					top: 10px;
					border-radius: 50%;
					background: url(../images/head.png);
					background-size: cover;
				}
			}
		}
	}
	
	#sidebar {
		position: absolute;
		left: 0;
		top: 65px;
		bottom: 0;
		width: 220px;
		background: #EBEBEB;
		overflow-y: auto;
		.comAnalysis {
			background-image: url(../images/comAnalysis.png);
		}
		.comAnalysisa {
			background-image: url(../images/comAnalysisa.png);
		}
		.cardAbalysis {
			background-image: url(../images/cardAbalysis.png);
		}
		.cardAbalysisa {
			background-image: url(../images/cardAbalysisa.png);
			color: #276AB0 !important;
			i {
				color: #276AB0 !important;
			}
		}
		.evaluateAnalysis {
			background-image: url(../images/evaluateAnalysis.png);
		}
		.evaluateAnalysisa {
			background-image: url(../images/evaluateAnalysisa.png);
		}
		.riskAnalysis {
			background-image: url(../images/riskAnalysis.png);
		}
		.riskAnalysisa {
			background-image: url(../images/riskAnalysisa.png);
		}
		.dataReport {
			background-image: url(../images/dataReport.png);
		}
		.dataReporta {
			background-image: url(../images/dataReporta.png);
		}
		.account {
			background-image: url(../images/account.png);
		}
		.accounta {
			background-image: url(../images/accounta.png);
		}
		.lists {
			width: 100%;
			padding-top: 20px;
			overflow: hidden;
			.list {
				position: relative;
				display: block;
				width: 100%;
				height: 60px;
				line-height: 60px;
				padding-left: 50px;
				color: #080808;
				font-size: 20px;
				cursor: pointer;
				transition: all 0.3s;
				margin-bottom: 2px;
				background-size: 20px 20px;
				background-position: 20px 20px;
				background-repeat: no-repeat;
				&:hover {
					background-color: #fff;
				}
				.full-screen {
					position: absolute;
					width: 60px;
					height: 24px;
					text-align: center;
					line-height: 24px;
					font-size: 14px;
					color: #fff;
					background: #276AB0;
					border-radius: 24px;
					right: 20px;
					top: 18px;
					transition: all .3s;
					&:hover {
						background-color: #1C5A9D;
					}
				}
				.arrow {
					position: absolute;
					font-size: 20px;
					right: 20px;
					top: 20px;
					color: #BABABA;
					transform: rotate(0);
					transition: all .3s;
				}
				.arrow-rotate {
					transform: rotate(90deg);
				}
			}
			.list-box {
				width: 100%;
				overflow: hidden;
				transition: all 0.3s;
				margin-bottom: 2px;
				.list-child {
					display: block;
					width: 100%;
					height: 50px;
					line-height: 50px;
					text-align: left;
					font-size: 16px;
					color: #666666;
					padding-left: 50px;
					cursor: pointer;
					transition: all 0.3s;
					margin-bottom: 2px;
					&:hover {
						background: #fff;
						color: #276AB0;
					}
				}
			}
		}
		.router-link-active {
			background-color: #fff !important;
			color: #276AB0 !important;
		}
	}
	
	#content {
		position: absolute;
		top: 65px;
		right: 0;
		bottom: 0;
		overflow: auto;
		background: #F5F5F5;
		>div {
			position: relative;
			width: 100%;
			min-width: 1200px;
			height: 100%;
			padding: 20px;
		}
	}
	
	#content.is-full-screen {
		top: 100px;
		background: #333969;
		* {
			color: #fff;
		}
	}
	
	.el-message-box__wrapper .el-message-box__title span {
		font-size: 16px;
	}
	
	#changePassword {
		.el-dialog__header {
			border-bottom: 1px solid #E6E6E6;
		}
		.el-dialog__body {
			padding: 0;
		}
		.el-form-item {
			padding: 0 60px;
		}
		.form-btn {
			display: inline-block;
			width: 80px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			border-radius: 30px;
			border: 1px solid #2E6DB4;
			color: #2E6DB4;
			cursor: pointer;
			&:first-child {
				background: #2E6DB4;
				color: #fff;
				margin-right: 6px;
			}
			&:last-child {
				margin-left: 6px;
			}
		}
	}
	
	#loadingBox {
		position: fixed;
		left: 220px;
		top: 65px;
		bottom: 0;
		right: 0;
		z-index: 1000;
	}
</style>