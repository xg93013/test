<template>
	<div class="szl-log">
		<div style="width:1200px;margin:0 auto;margin-top:60px">
			<Table border :columns="columns" :data="dataLists"></Table>
			<Row style="margin-top:20px">
				<i-col align="right">
					<Page :total="totalPage" :show-total="true" size="small" :current.sync="datas.pageNo" placement="top" @on-change="onChange" show-elevator></Page>
				</i-col>
			</Row>
			<Spin size="large" fix v-show="loading"></Spin>
		</div>
	</div>
</template>

<script>
	import { communicationService, utilService, modalService } from '@/libs/uBase';
	export default {
		data() {
			return {
				loading: false,
				columns: [{
					title: "时间",
					key: "addTime",
					width: "240",
					align: "center",
				}, {
					title: "用户",
					width: "240",
					key: "userName",
					align: "center",
				}, {
					title: "操作",
					key: "operationContent",
					align: "center",
				}],
				datas: {
					pageNo: 1,
					pageSize: 10
				},
				dataLists: [],
				totalPage: 0
			}
		},
		methods: {
			getLogLists() { //获取系统日志列表
				if(this.loading) {
					return false;
				}
				let data = [];
				for(let i in this.datas) {
					data.push(i + "=" + this.datas[i])
				};
				this.loading = true;
				communicationService.get(utilService.getResourceUrl("/log/operate-list?" + data.join("&")), result => {
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
				this.datas.pageNo=e;
				this.$nextTick(()=>{
					this.getLogLists();
				});
			}
		}
	}
</script>

<style lang="scss">
	.szl-log {
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 40px 20px 40px;
	}
</style>