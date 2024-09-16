<template>
	<div class="szl-role">
		<Row>
			<i-col span="12">
				<Input @input="keyWordChange" @keyup.enter.native="search" placeholder="角色名称" v-model="datas.roleName" style="width: 240px" size="small"></Input>
				<Button class="szl-btn" type="primary" @click="search">查询</Button>
			</i-col>
			<i-col span="12" align="right">
				<Button class="szl-btn" type="primary" @click="addRole">新增角色</Button>
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
		<Modal class="szl-add-role" v-model="roleListShow" :cancel-text="modal.cancelText" @on-ok="confirmAddRole" @on-visible-change="addRoleCancel" :title="modal.title" width="430px" :loading="treeLoading">
			<Row v-if="modal.type!=2" style="margin-bottom:-10px">
				<i-col>
					<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="104">
						<FormItem label="角色名称：" prop="roleName">
							<Input style="width:240px" v-model="formValidate.roleName" placeholder="角色名称" size="small"></Input>
							<!--<Input v-model="formValidate.name" placeholder="Enter your name"></Input>-->
						</FormItem>
					</Form>
				</i-col>
			</Row>
			<Row>
				<i-col offset="2">
					功能权限：
				</i-col>
			</Row>
			<Row style="margin-top:10px">
				<i-col offset="2">
					<Tree ref="tree" :data="treeData" show-checkbox></Tree>
				</i-col>
			</Row>
		</Modal>
		<Modal v-model="deleteConfirmModel.show" :title="deleteConfirmModel.title" @on-ok="confirmOk" width="300px" class-name="customConfirmModal">
			<Icon type="android-alert" color="#f90" size="30" />
			<span>{{deleteConfirmModel.content}}</span>
		</Modal>
	</div>
</template>

<script>
	import axios from "axios";
	import { communicationService, utilService, modalService } from '@/libs/uBase';
	export default {
		data() {
			return {
				delId: "",
				deleteConfirmModel: {
					type: 1,
					show: false,
					title: "确认",
					content: ""
				},
				modal: {
					id: "",
					type: "", //新增角色，2查看角色权限，3修改角色
					cancelText: "",
					title: "",
				},
				formValidate: {
					roleName: ""
				},
				ruleValidate: {
					roleName: [{
						required: true,
						message: '角色名称不能为空',
						trigger: 'blur|change'
					}]
				},
				treeData: [],
				rightsIds: [], ///所有选中的权限id，包括其所有父级
				roleListShow: false,
				treeLoading: true,
				loading: false,
				keyWord: "",
				columns: [{
					title: "序号",
					type: 'index',
					align: "center",
					width: "80"
				}, {
					title: "角色名称",
					key: "roleName",
					align: "center",
				}, {
					title: "创建时间",
					key: "addTime",
					align: "center",
				}, {
					title: "功能权限",
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
									this.getRoleRights(params.row.id, params.row.roleName, 2);
								}
							}
						}, '查看')
					}
				}, {
					title: "操作",
					align: "center",
					width: "140",
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
										this.getRoleRights(params.row.id, params.row.roleName, 3);
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
										this.delRole(params.row.id);
									}
								}
							}, '删除')
						]);
					}
				}],
				dataLists: [],
				datas: {
					roleName: "",
					pageNo: 1,
					pageSize: 10
				},
				totalPage: 0
			}
		},
		created() {
			this.getRoleLists();
		},
		methods: {
			getRoleLists() { //获取角色列表
				if(this.loading) {
					return false;
				}
				let data = [];
				for(let i in this.datas) {
					if(this.datas[i]) {
						data.push(i + "=" + this.datas[i])
					}
				};
				this.keyWord = this.datas.roleName ? this.datas.roleName : ""; //处理关键词搜索
				this.loading = true;
				communicationService.get(utilService.getResourceUrl("/role/page-list?" + data.join("&")), result => {
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
			onChange(e) {
				this.datas.pageNo = e;
				this.$nextTick(() => {
					this.getRoleLists();
				});
			},
			keyWordChange() { ///如果当前关键词被搜过过一次，关键词全部删除完之后自动查询一次
				if(!this.datas.roleName && this.keyWord) {
					this.getRoleLists();
				}
			},
			search() {
				this.datas.pageNo = 1;
				this.$nextTick(() => {
					this.getRoleLists();
				})
			},
			addRole() {
				this.modal = {
					id: "",
					type: 1,
					cancelText: "取消",
					title: "新增角色",
				};
				this.roleListShow = true;
				this.treeData = [];
				this.getRights();
			},
			addRoleCancel(e) {
				if(!e) {
					if(this.modal.type == 2) {
						this.roleListShow = false;
						return false;
					}
					this.$refs["formValidate"].resetFields();
				}
			},
			getRights() { //获取权限列表--新增
				communicationService.get(utilService.getResourceUrl("/role/tree-permissions-add"), result => {
					if(result.state.code == 0) {
						if(result.data) {
							this.getTreeDatas(result.data, this.treeData);
						}
					}
				}, result => {
					utilService.handleException(result);
				});
			},
			getTreeDatas(e, i, ids = [], type = 1) { ///整理返回的数据格式
				e.forEach(item => {
					let data = {
						title: item.name,
						expand: true,
						ids: [item.id],
						id: item.id
					}
					if(type == 2) {
						data.disabled = true;
					}
					if(!item.children){
						data.checked=item.selected==0?false:true;
					}
					data.ids = [...data.ids, ...ids] //用来查询子菜单所有父级的ID
					i.push(data)
					if(item.children) {
						data.children = [];
						this.getTreeDatas(item.children, data.children, data.ids, type)
					}
				});
			},
			confirmAddRole() {
				if(this.modal.type == 2) {
					this.roleListShow = false;
					return false;
				}
				this.$refs["formValidate"].validate((valid) => {
					if(!valid) {
						this.treeLoading = false;
						setTimeout(() => {
							this.treeLoading = true;
						})
						return false;
					}
					let data = this.$refs.tree.getCheckedNodes();
					this.rightsIds = [];
					this.getChoiceIds(data);
					let param = {
						roleName: this.formValidate.roleName,
						permissionIds: this.rightsIds
					};
					if(this.modal.type == 3) {
						param.id = this.modal.id;
					}
					let getUrl = this.modal.type == 1 ? "/role/create" : "/role/update";
					communicationService.post(utilService.getResourceUrl(getUrl), param, result => {
						if(result.state.code == 0) {
							this.$Message.success({
								title: "提示",
								content: this.modal.type == 1 ? "角色添加成功" : "角色修改成功"
							});
							this.roleListShow = false;
							this.search();
						}
					}, result => {
						this.treeLoading = false;
						setTimeout(() => {
							this.treeLoading = true;
						});
						utilService.handleException(result);
					});
				})
			},
			getChoiceIds(e) { ///获取已选中的权限节点以及其所有父节点的ID
				e.forEach(item => {
					if(item.children) {
						this.getChoiceIds(item.children);
					} else {
						item.ids.forEach(i => {
							if(!this.rightsIds.includes(i)) {
								this.rightsIds.push(i)
							}
						})
					}
				})
			},
			getRoleRights(id, name, type) { //查看/修改角色权限
				this.modal = {
					id: type == 2 ? "" : id,
					type: type,
					cancelText: type == 2 ? "" : "取消",
					title: '"' + name + '"' + " 功能权限"
				};
				this.roleListShow = true;
				this.treeData = [];
				if(type == 3) {
					this.formValidate.roleName = name;
				}
				communicationService.get(utilService.getResourceUrl("/role/tree-permissions-modify?roleId=" + id), result => {
					if(result.state.code == 0) {
						this.getTreeDatas(result.data, this.treeData, [], type);
					}
				}, result => {
					utilService.handleException(result);
				});
			},
			delRole(id) { //删除角色
				this.delId = id;
				this.deleteConfirmModel.show = true;
				this.deleteConfirmModel.content = "确定要删除该角色？"
			},
			confirmOk() {
				this.loading = true;
				let param = {
					id: this.delId
				}
				communicationService.post(utilService.getResourceUrl("/role/delete"), param, result => {
					if(result.state.code == 0) {
						this.$Message.success({
							title: "提示",
							content: "角色删除成功"
						});
						this.loading = false;
						this.search();
					}
				}, result => {
					utilService.handleException(result);
					this.loading = false;
				});
			}
		}
	}
</script>

<style lang="scss">
	.szl-role {
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 40px 20px 40px;
	}
	
	.szl-add-role .ivu-modal-body {
		max-height: 500px;
		overflow-y: auto;
	}
</style>