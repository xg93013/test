<template>
	<div class="szl-user">
		<Row>
			<i-col span="12">
				<Input @input="keyWordChange" @keyup.enter.native="search" placeholder="角色名称" v-model="datas.userName" style="width: 240px" size="small"></Input>
				<Button class="szl-btn" type="primary" @click="search">查询</Button>
			</i-col>
			<i-col span="12" align="right">
				<Button class="szl-btn" type="primary" @click="addUser">新增用户</Button>
			</i-col>
		</Row>
		<div style="margin-top:10px;position:relative" class="tableArea">
			<Table border :columns="columns" :data="dataLists"></Table>
			<Row style="margin-top:20px">
				<i-col align="right">
					<Page :total="totalPage" :show-total="true" size="small" :current.sync="datas.pageNo" placement="top" @on-change="onChange" show-elevator></Page>
				</i-col>
			</Row>
			<Spin size="large" fix v-show="loading"></Spin>
		</div>
		<Modal v-model="modal.show" @on-ok="confirmAddUser" @on-visible-change="addUserCancel" :title="modal.title" width="570px" :loading="modalLoading">
			<Form ref="userForm" :model="userForm" :rules="userRules" :label-width="90" label-position="right">
				<Row>
					<i-col span="12">
						<FormItem label="用户名：" prop="userName">
							<Input style="width:180px" v-model="userForm.userName" placeholder="用户名" size="small"></Input>
						</FormItem>
					</i-col>
					<i-col span="12" v-if="!userForm.id">
						<FormItem label="密码：" prop="password">
							<Input style="width:180px" v-model="userForm.password" placeholder="密码" size="small"></Input>
						</FormItem>
					</i-col>
				</Row>
				<Row>
					<i-col span="12">
						<FormItem label="角色：" prop="roleId">
							<Select v-model="userForm.roleId" style="width:180px" size="small">
								<Option v-for="item in roleLists" :value="item.id" :key="item.id">{{item.roleName}}</Option>
							</Select>
						</FormItem>
					</i-col>
					<i-col span="12">
						<FormItem label="真实姓名：">
							<Input style="width:180px" v-model="userForm.realName" placeholder="真实姓名" size="small"></Input>
						</FormItem>
					</i-col>
				</Row>
				<Row>
					<i-col span="12">
						<FormItem label="联系电话：">
							<Input style="width:180px" v-model="userForm.mobile" placeholder="联系电话" size="small"></Input>
						</FormItem>
					</i-col>
					<i-col span="12">
						<FormItem label="工作岗位：">
							<Input style="width:180px" v-model="userForm.position" placeholder="工作岗位" size="small"></Input>
						</FormItem>
					</i-col>
				</Row>
				<Row>
					<i-col>
						<FormItem label="数据权限：" prop="business">
							<Select v-model="userForm.business" style="width:446px" multiple size="small">
								<Option v-for="item in rights" :value="item.name" :key="item.name"></Option>
							</Select>
						</FormItem>
					</i-col>
				</Row>
				<Row>
					<i-col>
						<FormItem label="备注：">
							<Input style="width:446px" v-model="userForm.memo" size="small"></Input>
						</FormItem>
					</i-col>
				</Row>
			</Form>
		</Modal>
		<Modal class="szl-data-rights" v-model="seeModal.show" cancel-text="" :title="seeModal.title" width="300px">
			<Row v-for="item in seeRights" v-if="item.selected==1">
				<i-col>
					<Checkbox v-model="item.selected==1?true:false" disabled>{{item.name}}</Checkbox>
				</i-col>
			</Row>
		</Modal>
		<Modal v-model="resetModal.show" @on-ok="confirmReset" @on-visible-change="resetCancel" :title="resetModal.title" width="400px" :loading="resetModal.loading">
			<Form ref="resetPassword" :model="resetModal" :rules="userRules">
				<FormItem label="重置密码：" prop="password" :label-width="120">
					<Input v-model="resetModal.password" size="small" style="width:200px"></Input>
				</FormItem>
			</Form>
		</Modal>
		<Modal v-model="deleteConfirmModel.show" :title="deleteConfirmModel.title" @on-ok="confirmOk" width="300px" class-name="customConfirmModal">
			<Icon type="android-alert" color="#f90" size="30" />
			<span>{{deleteConfirmModel.content}}</span>
		</Modal>
	</div>
</template>

<script>
	import { communicationService, utilService, modalService } from '@/libs/uBase';
	export default {
		data() {
			const checkRights = (rule, value, callback) => {
				if(value.length == 0) {
					return callback(new Error('请选择数据权限'));
				}
				return callback();
			};
			const checkRoleId = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请选择角色'));
				}
				return callback();
			};
			return {
				resetModal: { ///重置密码
					loading: true,
					password: "",
					show: false,
					id: "",
					title: "",
				},
				deleteConfirmModel: {
					type: 1,
					id: "",
					show: false,
					title: "确认",
					content: ""
				},
				seeModal: { //查看数据权限
					show: false,
					title: ""
				},
				roleLists: [],
				rights: [],
				seeRights: [],
				modalLoading: true,
				modal: {
					id: "",
					show: false,
					title: ""
				},
				userForm: {
					userName: "",
					password: "",
					realName: "",
					memo: "",
					position: "",
					mobile: "",
					roleId: "",
					business: []

				},
				userRules: {
					userName: [{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur|change'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur|change'
					}],
					roleId: [{
						required: true,
						validator: checkRoleId,
						trigger: 'change'
					}],
					business: [{
						required: true,
						validator: checkRights,
						trigger: 'change'
					}]
				},
				loading: false,
				keyWord: "",
				columns: [{
					title: "序号",
					type: 'index',
					align: "center",
					width: "80"
				}, {
					title: "用户名",
					key: "userName",
					align: "center",
				}, {
					title: "角色",
					key: "roleName",
					align: "center",
				}, {
					title: "数据权限",
					align: "center",
					width: "140",
					className: "columnsCommon operte",
					render: (h, params) => {
						return h('Button', {
							props: {
								type: 'text',
								size: 'small'
							},
							on: {
								click: () => {
									this.getDatasRights(1, params.row);
								}
							}
						}, '查看')
					}
				}, {
					title: "创建时间",
					key: "addTime",
					align: "center",
				}, {
					title: "真实姓名",
					key: "realName",
					align: "center",
				}, {
					title: "联系电话",
					key: "mobile",
					align: "center",
				}, {
					title: "工作岗位",
					key: "position",
					align: "center",
				}, {
					title: "备注",
					key: "memo",
					align: "center",
				}, {
					title: "操作",
					align: "center",
					width: "210",
					className: "columnsCommon operte",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.addUser(params.row)
									}
								}
							}, '修改'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								on: {
									click: () => {
										this.userDel(params.row.id)
									}
								}
							}, '删除'),
							h('Button', {
								props: {
									type: 'text',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.resetPassword(params.row)
									}
								}
							}, '重置密码'),
						]);
					}
				}],
				datas: {
					userName: "",
					pageNo: 1,
					pageSize: 10
				},
				dataLists: [],
				totalPage: 0
			}
		},
		methods: {
			getUserLists() { //获取用户列表
				if(this.loading) {
					return false;
				}
				let data = [];
				for(let i in this.datas) {
					data.push(i + "=" + this.datas[i])
				};
				this.keyWord = this.datas.userName ? this.datas.userName : ""; //处理关键词搜索
				this.loading = true;
				communicationService.get(utilService.getResourceUrl("/user/page-list?" + data.join("&")), result => {
					this.loading = false;
					if(result.state.code == 0) {
						if(result.data.resultDatas) {
							this.dataLists = [...result.data.resultDatas];
						} else {
							this.dataLists = [];
						}
						this.totalPage = result.data.totalCount
					}
				}, result => {
					this.loading = false;
					utilService.handleException(result);
				});
			},
			addUser(param = {}) {
				this.modal = {
					id: param.id ? param.id : "",
					show: true
				};
				if(param.id) {
					this.modal.title = param.userName
				} else {
					this.modal.title = "新增用户"
				}
				if(!this.roleLists.length) {
					this.getUserRole();
				};
				this.getDatasRights(2, param);
			},
			search() {
				this.datas.pageNo = 1;
				this.$nextTick(() => {
					this.getUserLists();
				});
			},
			keyWordChange() {
				if(!this.datas.userName && this.keyWord) {
					this.getUserLists();
				};
			},
			onChange(e) {
				this.datas.pageNo = e;
				this.$nextTick(() => {
					this.getUserLists();
				});
			},
			confirmAddUser() {
				this.$refs["userForm"].validate((valid) => {
					if(!valid) {
						this.modalLoading = false;
						setTimeout(() => {
							this.modalLoading = true;
						})
						return false;
					}
					let getUrl = this.userForm.id ? "/user/update" : "/user/create";
					communicationService.post(utilService.getResourceUrl(getUrl), this.userForm, result => {
						if(result.state.code == 0) {
							this.$Message.success({
								title: "提示",
								content: this.userForm.id ? "用户修改成功" : "用户创建成功"
							});
							this.modal.show = false;
							this.getUserLists();
						}
					}, result => {
						utilService.handleException(result);
					});
				});
			},
			addUserCancel(e) {
				if(!e) {
					setTimeout(() => {
						this.userForm = {
							userName: "",
							password: "",
							realName: "",
							memo: "",
							position: "",
							mobile: "",
							roleId: "",
							business: []
						}
						this.$refs["userForm"].resetFields();
					});
				}
			},
			getUserRole() { //获取角色列表
				let data = ["roleName=", "pageNo=1", "pageSize=10000"]
				communicationService.get(utilService.getResourceUrl("/role/page-list?" + data.join("&")), result => {
					if(result.state.code == 0) {
						if(result.data.resultDatas) {
							this.roleLists = [...result.data.resultDatas]
						}
					}
				}, result => {
					utilService.handleException(result);
				});
			},
			getDatasRights(type = 1, param = {}) { //获取数据权限
				if(type == 1) { //查看数据权限
					this.seeModal = {
						show: true,
						title: '"' + param.userName + '"' + " 数据权限"
					}
				}
				let id = param.id ? param.id : "";
				communicationService.get(utilService.getResourceUrl("/user/user-business?id=" + id), result => {
					if(result.state.code == 0) {
						if(result.data) {
							if(type == 1) {
								this.seeRights = [...result.data];
							} else {
								if(param.id) { //如果是修改
									this.userForm = {
										id: param.id,
										userName: param.userName,
										realName: param.realName,
										memo: param.memo,
										position: param.position,
										mobile: param.mobile,
										roleId: param.roleId,
										business: []
									};
									result.data.forEach(item => {
										if(item.selected) {
											this.userForm.business.push(item.name);
										}
									})
								}
								this.rights = [...result.data];
							}
						}
					}
				}, result => {
					utilService.handleException(result);
				});
			},
			userDel(id) { //删除用户
				this.deleteConfirmModel.show = true;
				this.deleteConfirmModel.id = id;
				this.deleteConfirmModel.content = "确定删除该用户？";
			},
			confirmOk() {
				communicationService.post(utilService.getResourceUrl("/user/delete"), {
					id: this.deleteConfirmModel.id
				}, result => {
					if(result.state.code == 0) {
						this.$Message.success({
							title: "提示",
							content: "用户删除成功"
						});
						this.getUserLists();
					}
				}, result => {
					utilService.handleException(result);
				});
			},
			resetPassword(param) {
				this.resetModal.show = true;
				this.resetModal.id = param.id;
				this.resetModal.title = param.userName;
			},
			confirmReset() { //重置密码
				this.$refs["resetPassword"].validate((valid) => {
					if(!valid) {
						this.resetModal.loading = false;
						setTimeout(() => {
							this.resetModal.loading = true;
						})
						return false;
					}
					communicationService.post(utilService.getResourceUrl("/user/reset-password"), {
						id: this.resetModal.id,
						password: this.resetModal.password
					}, result => {
						if(result.state.code == 0) {
							this.$Message.success({
								title: "提示",
								content: "密码重置成功"
							});
							this.resetModal.show = false;
						}
					}, result => {
						utilService.handleException(result);
					});
				})
			},
			resetCancel(e) {
				if(!e) {
					setTimeout(() => {
						this.resetModal.password = "";
						this.$refs["resetPassword"].resetFields();
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.szl-user {
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 40px 20px 40px;
	}
	
	.szl-data-rights .ivu-modal-body {
		max-height: 500px;
		overflow-y: auto;
	}
</style>