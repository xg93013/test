<template>
	<div class="szl-modify-password">
		<div class="psd-box">
			<Form ref="form" :model="formData" :rules="rules" :label-width="100" label-position="right">
				<FormItem label="旧密码：" prop="oldPsd">
					<Input @keyup.enter.native="confirm" v-model="formData.oldPsd" placeholder="请输入旧密码" style="width:260px"></Input>
				</FormItem>
				<FormItem label="新密码：" prop="newPsd">
					<Input @keyup.enter.native="confirm" v-model="formData.newPsd" placeholder="请输入新密码" style="width:260px"></Input>
				</FormItem>
				<FormItem label="确认密码：" prop="confirmPsd">
					<Input @keyup.enter.native="confirm" v-model="formData.confirmPsd" placeholder="请再次输入新密码" style="width:260px"></Input>
				</FormItem>
				<Row>
					<i-col offset="6">
						<Button type="primary" @click="confirm" style="width:120px;margin-left:60px" >确认修改</Button>
					</i-col>
				</Row>
			</Form>
			<Spin size="large" fix v-show="loading"></Spin>
		</div>
	</div>
</template>

<script>
	import { communicationService, utilService, modalService } from '@/libs/uBase';
	export default {
		data() {
			const psd = (rule, value, callback) => {
				let reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/
				if(!value.length) {
					return callback(new Error('密码不能为空'));
				}
				if(!reg.test(value)) {
					return callback(new Error('密码为8-16个字符，需同时包含字母和数字，不得包含其他特殊字符'));
				}
				return callback();
			};
			const conPsd = (rule, value, callback) => {
				if(!value.length){
					return callback(new Error('确认密码不能为空'));
				}
				if(value != this.formData.newPsd) {
					return callback(new Error('两次密码不一致'));
				}
				return callback();
			};
			return {
				szlUserMsg:{},
				loading: false,
				formData: {
					oldPsd: "",
					newPsd: "",
					confirmPsd: ""
				},
				rules: {
					oldPsd: [{
						required: true,
						message: '旧密码不能为空',
						trigger: 'blur|change'
					}],
					newPsd: [{
						required: true,
						validator: psd,
						trigger: 'blur|change'
					}],
					confirmPsd: [{
						required: true,
						validator: conPsd,
						trigger: 'blur|change'
					}]
				}
			}
		},
		created(){
			this.getUserMsg()
		},
		methods: {
			getUserMsg() { //获取用户信息，当前项目页面比较少，所以采用prop传值，不采用vuex
                communicationService.get(utilService.getResourceUrl("/user/login-info"), result => {
                    if(result.state.code == 0) {
                    	this.szlUserMsg = result.data;
                    }
                }, result => {
                    utilService.handleException(result);
                });
            },
			confirm() {
				this.$refs["form"].validate((valid) => {
					if(!valid) {
						return false;
					}
					let userMsg = this.szlUserMsg;
					let data ={
						id: userMsg.id,
						oldPassword: this.formData.oldPsd,
						newPassword: this.formData.newPsd
					};
					this.loading = true;
					communicationService.post(utilService.getResourceUrl("/user/user-password-update" ),data, result => {
						console.log(result)
						this.loading = false;
						if(result.state.code == 0) {
							this.$Message.success({
								title: "提示",
								content: "密码修改成功"
							})
						}else{
							this.$Message.error({
								title: "提示",
								content: result.state.description
							})
						}
					}, result => {
						this.loading = false;
						utilService.handleException(result);
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	.szl-modify-password {
		* {
			font-size: 14px !important;
		}
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 40px 20px 40px;
		.psd-box{
			display: inline-block;
			padding: 40px;
			/*width:600px;*/
			margin:0 auto;
			overflow:hidden;
			position:relative;
			margin-left: 50%;
			transform: translate(-50%,0);
			margin-top: 10%;
			border-radius: 4px;
			.ivu-form-item{
				margin-bottom: 38px;
			}
		}
	}
</style>