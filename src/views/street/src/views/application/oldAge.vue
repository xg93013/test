<template>
	<div class="szl-old-age">
		<Row v-for="item in conditions">
			<i-col span="2" align="right">{{item.name}}：</i-col>
			<i-col span="22">
				<template v-for="(itema,index) in item.lists">
					<template v-if="itema.children">
						<Dropdown trigger="click" v-if="itema.children.length">
							<span class="con-list" :class="{'con-list-active':index==(item.active||0)}" v-text="itema.name" @click="conChange(item,index,1)"></span>
							<Dropdown-menu slot="list">
								<div class="nets">
									<CheckboxGroup v-model="fruit" @on-change="search">
										<Checkbox class="net" v-for="i in itema.children" :label="i.name"></Checkbox>
									</CheckboxGroup>
								</div>
							</Dropdown-menu>
						</Dropdown>
						<span v-else class="con-list" :class="{'con-list-active':index==(item.active||0)}" v-text="itema.name" @click="conChange(item,index,1)"></span>
					</template>
					<span v-else class="con-list" :class="{'con-list-active':index==(item.active||0)}" v-text="itema.name" @click="conChange(item,index)"></span>
				</template>
			</i-col>
		</Row>
		<Row style="margin-bottom:10px;">
			<i-col span="2" align="right">关键词：</i-col>
			<i-col span="12">
				<Input class="input" @input="keyWordChange" @keyup.enter.native="search" v-model="datas.keyWord" placeholder="姓名、身份证号码、联系电话或现住址" style="width: 240px" size="small">
				</Input>
				<Button class="szl-btn" type="primary" @click="search">查询</Button>
			</i-col>
			<i-col span="10" align="right">
				<Button class="szl-btn" type="primary" :class="{'szl-btn-right':(pagenum==2||!userRights.pension_audit_sms)}" @click="confirm(1)" v-if="(pagenum==1&&userRights.pension_audit_sms)||(pagenum==2&&userRights.senile_cert_sms)">重新生成名单</Button>
				<Button v-if="pagenum==1&&userRights.pension_audit_sms" class="szl-btn" type="primary" style="margin-right:30px" @click="confirm(2)">初始化名单</Button>
			</i-col>
		</Row>
		<div style="padding:0 30px 30px 30px;position:relative">
			<Table border ref="selection" :columns="columns" :data="dataLists" @on-selection-change="onSelectChange"></Table>
			<Row style="margin-top:10px">
				<i-col align="right">
					<Button class="szl-btn" type="primary" @click="sendMsg" v-if="(pagenum==1&&userRights.pension_audit_sms)||(pagenum==2&&userRights.senile_cert_sms)">发送短信</Button>
					<Button class="szl-btn" type="primary" v-if="(pagenum==1&&userRights.pension_audit_download)||(pagenum==2&&userRights.senile_cert_download)">
						<a :href="pagenum==1?downLists:downListsa" style="color:#fff">导出名单</a>
					</Button>
				</i-col>
			</Row>
			<Row style="margin-top:20px">
				<i-col align="right">
					<Page :total="totalPage" size="small" :current.sync="datas.pageNo" placement="top" :show-total="true" @on-change="onChange" show-elevator></Page>
				</i-col>
			</Row>
			<Spin size="large" fix v-show="loading"></Spin>
		</div>
		<Modal v-model="deleteConfirmModel.show" :title="deleteConfirmModel.title" @on-ok="confirmOk" :mask-closable="false" width="300px" class-name="customConfirmModal">
			<Icon type="android-alert" color="#f90" size="30" />
			<span>{{deleteConfirmModel.content}}</span>
		</Modal>
		<Modal v-model="mobileMsg.show" title="短信模板" @on-ok="sendMobileMsg" width="400px" :loading="modelLoading">
			<Row>
				<i-col align="center">
					请选择短信模板&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<Select v-model="mobileMsg.tem" style="width:160px">
						<Option v-for="item in mobileMsg.template" :value="item.content" :key="item.id">{{ item.name }}</Option>
					</Select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				</i-col>
			</Row>
			<Row style="margin-top:10px">
				<i-col offset="2" span="20" style="line-height:30px">
					<template v-if="mobileMsg.tem.split('【变量】').length>1">
						{{mobileMsg.tem.split("【变量】")[0]}}
						<span v-show="mobileMsg.tem"><Input :maxlength="2" v-model="mobileMsg.startMonth" size="small" style="width:40px"></Input> 月 <Input :maxlength="2" v-model="mobileMsg.startDay" size="small" style="width:40px"></Input> 日 </span> {{mobileMsg.tem.split("【变量】")[1]}}
						<span v-show="mobileMsg.tem"><Input :maxlength="2" v-model="mobileMsg.endMonth" size="small" style="width:40px"></Input> 月 <Input :maxlength="2" v-model="mobileMsg.endDay" size="small" style="width:40px"></Input> 日 </span> {{mobileMsg.tem.split("【变量】")[2]}}
					</template>
					<template v-if="mobileMsg.tem.split('【变量】').length==1">
						{{mobileMsg.tem}}
					</template>
				</i-col>
			</Row>
		</Modal>
		<Modal class='msg-modal' width='400px' v-model='msgShow' title='短信内容'>
			{{msgText}}
		</Modal>	
	</div>
</template>

<script>
	import { communicationService, utilService, modalService } from '@/libs/uBase';
	export default {
		data() {
			return {
				msgShow: false,
				msgText: '',
				userRights: JSON.parse(sessionStorage.getItem("szlUserRights")),
				modelLoading: true,
				mobileMsg: {
					show: false,
					template: [],
					tem: "",
					startMonth: "",
					startDay: "",
					endMonth: "",
					endDay: ""
				},
				downLists: utilService.getResourceUrl('/application/auth-pension-download'),
				downListsa: utilService.getResourceUrl('/application/old-cert-download'),
				deleteConfirmModel: {
					type: 1,
					show: false,
					title: "确认",
					content: ""
				},
				choiceLists: [],
				loading: false,
				fruit: [],
				keyWord: "",
				conditions: [{
					name: "所属网格",
					lists: [{
						name: "不限",
						children: []
					}]
				}, {
					name: "目前状态",
					lists: [{
						name: "不限"
					}, {
						name: "健康"
					}, {
						name: "重病"
					}, {
						name: "独居"
					}, {
						name: "残疾"
					}, {
						name: "年老"
					}, {
						name: "重症"
					}, {
						name: "精神病"
					}]
				}, {
					name: "建议办理方式",
					lists: [{
						name: "不限"
					}, {
						name: "上门服务"
					}, {
						name: "自主办理"
					}]
				}, {
					name: "短信发送状态",
					lists: [{
						name: "不限",
					}, {
						name: "未发送"
					}, {
						name: "已发送"
					}]
				}],
				columns: [{
						type: 'selection',
						width: 60,
						align: 'center'
					}, {
						title: "姓名",
						key: "name",
						align: "center",
					},
					{
						title: "身份证号码",
						key: "idNo",
						align: "center",
					}, {
						title: "联系电话",
						key: "mobile",
						align: "center",
					}, {
						title: "年龄",
						key: "age",
						align: "center",
						width: 80,
					}, {
						title: "户籍地",
						align: "center",
						key: "registerAddress",
					}, {
						title: "现住址",
						align: "center",
						key: "nowLivePlace",
					}, {
						title: "所属网格",
						key: "gridName",
						align: "center"
					}, {
						title: "目前状态",
						key: "currentStatus",
						align: "center",
					}, {
						title: "建议年审方式",
						key: "adviceWay",
						align: "center",
					}, {
						title: "短信发送状态",
						align: "center",
						render:(h, params)=>{
							return h('div',{
								on:{
									click:()=>{
										if(params.row.smsStatus=='已发送'){
											this.onMsgShow(params.row.smsContent)
										}
									}
								}
							},params.row.smsStatus)
						}
					}
				],
				dataLists: [],
				datas: {
					fruit: [],
					currentStatus: "",
					adviceWay: "",
					smsStatus: "",
					keyWord: "",
					pageNo: 1,
					pageSize: 10
				},
				totalPage: 0
			}
		},
		props: ["pagenum"],
		mounted() {
			if(this.pagenum == 1) {
				this.conditions[2].name = "建议年审方式";
				this.columns[9].title = "建议年审方式"
			} else {
				this.conditions[2].name = "建议办理方式";
				this.columns[9].title = "建议办理方式"
			}
		},
		methods: {
			onMsgShow(e){
				this.msgShow=true;
				this.msgText=e;
			},
			clearCheck(){
				this.$refs.selection.selectAll(false);
			},
			init() {
				this.getNetWorks();
				this.getOldAgeLists();
			},
			conChange(item, index, e) {
				if(typeof item.active == "undefined") {
					this.$set(item, "active", index);
					if(e) {
						this.fruit = [];
					}
				} else {
					if(item.active != index) {
						if(e) {
							this.fruit = [];
						}
						item.active = index;
					}
				}
				switch(item.name) {
					case "所属网格":
						this.datas.fruit = item.lists[index].name == "不限" ? "" : item.lists[index].children;
						break;
					case "目前状态":
						this.datas.currentStatus = item.lists[index].name == "不限" ? "" : item.lists[index].name;
						break;
					case "建议年审方式":
						this.datas.adviceWay = item.lists[index].name == "不限" ? "" : item.lists[index].name;
						break;
					case "建议办理方式":
						this.datas.adviceWay = item.lists[index].name == "不限" ? "" : item.lists[index].name;
						break;	
					case "短信发送状态":
						this.datas.smsStatus = item.lists[index].name == "不限" ? "" : item.lists[index].name;
						break;
					default:
						break;
				}
				this.$nextTick(() => {
					this.search();
				})
			},
			getNetWorks() { //获取网格列表

				communicationService.get(utilService.getResourceUrl("/map/community-grid"), result => {
					if(result.state.code == 0 && result.data) {
						this.conditions[0].lists = [this.conditions[0].lists[0], ...result.data]
					}
				}, result => {
					utilService.handleException(result);
				});
			},
			getOldAgeLists() { ///获取养老金列表
				if(this.loading) { //防止重复提交
					return false;
				}
				let data = [];
				if(this.fruit.length) {
					this.fruit.forEach(item => {
						data.push("gridName=" + item)
					});
				} else {
					if(this.datas.fruit) {
						this.datas.fruit.forEach(item => {
							data.push("gridName=" + item.name);
						});
					}
				};
				for(let i in this.datas) {
					if(this.datas[i] && i != "fruit") {
						data.push(i + "=" + this.datas[i])
					}
				};
				this.keyWord = this.datas.keyWord ? this.datas.keyWord : ""; //处理关键词搜索
				this.loading = true;
				let url = this.pagenum == 1 ? "/application/auth-pension-page-list?" : "/application/old-cert-page-list?";
				communicationService.get(utilService.getResourceUrl(url + data.join("&")), result => {
					this.loading = false;
					if(result.state.code == 0) {
						if(result.data.resultDatas) {
							this.dataLists = [...result.data.resultDatas];
							this.totalPage = result.data.totalCount;
						} else {
							this.dataLists = [];
							this.totalPage = 0;
						}
						this.choiceLists = []; ///切换页面，发送短信接收人置空
					}
				}, result => {
					this.loading = false;
					utilService.handleException(result);
				});
			},
			search() {
				this.datas.pageNo = 1;
				this.$nextTick(() => {
					this.getOldAgeLists();
				})
			},
			keyWordChange() { ///如果当前关键词被搜过过一次，关键词全部删除完之后自动查询一次
				if(!this.datas.keyWord && this.keyWord) {
					this.getOldAgeLists();
				}
			},
			onChange(e) {
				this.datas.pageNo = e;
				this.$nextTick(() => {
					this.getOldAgeLists();
				});
			},
			confirm(e) { //重新生成名单
				this.deleteConfirmModel.show = true;
				this.deleteConfirmModel.type = e;
				switch(e) {
					case 1:
						this.deleteConfirmModel.content = "确定重新生成名单吗？重新生成名单内容，但“短信发送状态”将保持不变";
						break;
					case 2:
						this.deleteConfirmModel.content = "确定初始化名单吗？重新生成名单内容，且所有“短信发送状态”将变为“未发送”";
						break;
					default:
						break;
				};

			},
			confirmOk() {
				this.loading = true;
				let url = this.pagenum == 1 ? "/application/create-auth-pension" : "/application/create-old-cert";
				let data = {};
				if(this.pagenum == 1) {
					data.type = this.deleteConfirmModel.type
				}
				communicationService.post(utilService.getResourceUrl(url), data, result => {
					this.loading = false;
					if(result.state.code == 0) {
						if(this.deleteConfirmModel.type == 1) {
							this.$Message.info('重新生成名单成功');
						} else {
							this.$Message.info('初始化名单成功');
						}
					} else {
						utilService.handleException(result);
					}
				}, result => {
					this.loading = false;
					utilService.handleException(result);
				});
			},
			sendMsg() { ///发送短信
				if(!this.choiceLists.length) {
					this.$Modal.error({
						title: "提示",
						content: "请选择短信接收人"
					});
				} else {
					this.mobileMsg.show = true;
					let obj = {
						tem: "",
						startMonth: "",
						startDay: "",
						endMonth: "",
						endDay: ""
					}
					Object.assign(this.mobileMsg, obj);
					if(!this.mobileMsg.template.length) {
						this.mobileMsgTemplate();
					}
				}
			},
			sendMobileMsg() {
				if(!this.mobileMsg.tem) {
					this.$Message.error({
						title: "提示",
						content: "请选择短信模板"
					})
					this.modelLoading = false;
					setTimeout(() => {
						this.modelLoading = true;
					})
					return false;
				}
				let ids = [];
				this.choiceLists.forEach(item => {
					ids.push(item.id);
				});
				let sendText;
				if(this.mobileMsg.tem.split("【变量】").length > 1) {
					sendText = this.mobileMsg.tem.split("【变量】")[0] +
						this.mobileMsg.startMonth + "月" + this.mobileMsg.startDay + "日" +
						this.mobileMsg.tem.split("【变量】")[1] +
						this.mobileMsg.endMonth + "月" + this.mobileMsg.endDay + "日" +
						this.mobileMsg.tem.split("【变量】")[2]
				} else {
					sendText = this.mobileMsg.tem
				}
				communicationService.post(utilService.getResourceUrl("/application/sms-send"), {
					busType: "pension",
					content: sendText,
					ids: ids
				}, result => {
					this.mobileMsg.show = false;
					console.log(result);
					if(result.state.code == 0) {
						this.$Message.success({
							title: "提示",
							content: "发送成功"
						})
					} else {
						utilService.handleException(result);
					}
				}, result => {
					this.mobileMsg.show = false;
					utilService.handleException(result);
				});

			},
			mobileMsgTemplate() { //获取短信模板
				let busType = this.pagenum == 1 ? "pension" : "old_cert";
				communicationService.get(utilService.getResourceUrl("/application/sms-template-list?busType=" + busType), result => {
					console.log(result)
					if(result.state.code == 0) {
						if(result.data.length) {
							this.mobileMsg.template = [...result.data];
						}
					}
				}, result => {
					utilService.handleException(result);
				});
			},
			onSelectChange(e) {
				this.choiceLists = [...e];
			}
		}
	}
</script>

<style lang="scss">
	
	.msg-modal .ivu-modal-footer{
		display: none;
	}
	.szl-old-age {
		/**{font-size: 14px};*/
		.ivu-row {
			line-height: 30px;
		}
		.con-list {
			display: inline-block;
			padding: 0 6px;
			line-height: 20px;
			cursor: pointer;
			&:first-child {
				margin-right: 14px;
			}
		}
		.con-list-active {
			background: #1673D5;
			color: #fff;
		}
		.nets {
			width: 300px;
			overflow: hidden;
			border-radius: 4px;
			padding-left: 10px;
			box-sizing: border-box;
		}
		.net {
			margin-left: 10px;
		}
		.szl-btn-right {
			margin-right: 30px;
		}
	}
</style>