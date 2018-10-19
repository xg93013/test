<template>
	<Modal id='foodWarnModal' v-model="modal" :title="modalMsg.mc">
		<div style="width:100%;max-height:500px;overflow-y:auto">
			<div style='position:relative;width:100%;overflow:hidden'>
				<Spin v-show='show' fix>
					<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
					<div>加载中...</div>
				</Spin>
				<div class='modal-box'>
					<Row>
						<Col> 报告编号：{{modalMsg.bh}}</Col>
					</Row>
					<Row>
						<Col> 食品名称：{{modalMsg.mc}}</Col>
					</Row>
					<Row>
						<Col span='14'> 被抽样单位：{{modalMsg.qyMc}}</Col>
						<Col span='10' align='right'> 所属区域：{{modalMsg.qyQx}}</Col>
					</Row>
					<Row>
						<Col span='14'> 标称生产企业：{{modalMsg.sczMc?modalMsg.sczMc:'无'}}</Col>
						<Col span='10' align='right'> 所属区域：{{modalMsg.sczSq?modalMsg.sczSq:'无'}}</Col>
					</Row>
					<Row>
						<Col> 委托单位：{{modalMsg.cydwMc}}
						</Col>
					</Row>
				</div>
				<div class='modal-box' v-for = "(item,index) in dataList" :key="index">
					<Row>
						<Col> 检验项目：{{item.jyXm}}</Col>
					</Row>
					<Row>
						<Col span='12'> 检测值：{{item.scz}}</Col>
						<Col span='12' align='right'> 标准值：{{item.bzxz}}</Col>
					</Row>
					<Row>
						<Col> 检测结果：{{item.jg}}</Col>
					</Row>
					<Row>
						<Col> 报告日期：{{item.rq}}</Col>
					</Row>
				</div>
				<div class='modal-box' style="border:none">
					<Row>
						<Col> 后处理结果：{{modalMsg.hcl}}</Col>
					</Row>
				</div>
			</div>
		</div>
	</Modal>
</template>

<script>
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const {
		UN_C
	} = apis
	export default {
		data() {
			return {
				show: false,
				modal: false,
				modalMsg: {},
				dataList: {}
			}
		},

		methods: {
			modalShow(e) {
				this.modal = true;
				this.getModalMsg(e);
			},
			async getModalMsg(e) {
				this.show = true;
				let res = await http.get(UN_C + '/' + e[0].bh);
				this.show = false;
				if(res) {
					this.modalMsg = res.data;
					this.dataList = res.data.dataList
				}
			}
		}
	}
</script>

<style lang='scss'>
	#foodWarnModal {
		.modal-box {
			padding: 16px 30px;
			border-bottom: 2px solid #131A36;
		}
		.ivu-col {
			line-height: 26px;
		}
	}
</style>