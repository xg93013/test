<template>
	<Modal v-model="modal" width='1000' :title="title">
		<div style='padding:20px'>
			<szlModalTable ref='modal' :tableMsg='modalTableMsg' />
		</div>
	</Modal>
</template>

<script>
	import szlModalTable from '../../components/szl-modal-table.vue'
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const {
		OUTFLOW_DETAIL
	} = apis 
	export default {
		data() {
			return {
				title: '',
				modal: false,
				modalTableMsg: {
					columns: [{
						title: '抽样时间',
						key: 'cySj'
					}, {
						title: '食品名称',
						key: 'ypMc',
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.ypMc,
									placement: 'top-start'
								}
							},params.row.ypMc)
						}
					}, {
						title: '被抽样单位',
						key: 'qyMc',
						width: 160,
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.qyMc,
									placement: 'top-start'
								}
							},params.row.qyMc)
						}
					},{
						title: '标称生产企业',
						key: 'sczMc',
						width: 160,
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.sczMc,
									placement: 'top-start'
								}
							},params.row.sczMc)
						}
					},{
						title: '所属区域',
						key: 'sczSq',
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.area,
									placement: 'top-start'
								}
							},params.row.area)
						}
					},{
						title: '检验项目',
						key: 'jyXm',
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.jyXm,
									placement: 'top-start'
								}
							},params.row.jyXm)
						}
					},{
						title: '检测值',
						key: 'jcz',
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.jcz,
									placement: 'top-start'
								}
							},params.row.jcz)
						}
					},{
						title: '标准值',
						key: 'bzz',
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.bzz,
									placement: 'top-start'
								}
							},params.row.bzz)
						}
					}]
				}
			}
		},
		components:{
			szlModalTable
		},
		methods: {
			modalShow(e) {
				this.modal = true;
				this.title='成都流出到'+e+'的不合格食品抽检信息';
				this.modal = true;
				this.$refs.modal.getTableMsg(OUTFLOW_DETAIL+'/'+e)
			}
		},
		mounted(){
		}
	}
</script>

<style lang='scss'>
	.ivu-tooltip {
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
		
	.ivu-tooltip-inner {
		max-width: 1000px;
	}
		
	.ivu-table {
		.ivu-tooltip-rel {
			position: relative;
			top: 4px;
		}
	}
</style>