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
		E_OVERSAMPLING
	} = apis
	export default {
		data() {
			return {
				title: '',
				modal: false,
				modalTableMsg: {
					columns: [{
						title: '报告编号',
						key: 'bh'
					},{
						title: '抽样时间',
						key: 'cysj'
					}, {
						title: '食品名称',
						key: 'ypmc',
						render(h,params){
							return h('Tooltip',{
								props: {
									content: params.row.ypmc,
									placement: 'top-start'
								}
							},params.row.ypmc)
						}
					}, {
						title: '食品大类',
						key: 'dl'
					},{
						title: '标称生产企业',
						width: 220,
						key: 'sczMc',
						render(h,params){
							var temp = params.row.sczMc;
							return h('Tooltip',{
								props: {
									content: temp,
									placement: 'top-start'
								}
							},temp)
						}
					},{
						title: '所属区域',
						key: 'sczSq',
						render(h,params){
							var temp = params.row.sczSq;
							return h('Tooltip',{
								props: {
									content: temp,
									placement: 'top-start'
								}
							},temp)
						}
					},{
					// 	title: '检验项目',
					// 	width: 140,
					// 	key: 'jyxm',
					// 	render(h,params){
					// 		return h('Tooltip',{
					// 			props: {
					// 				content: params.row.jyxm,
					// 				placement: 'top-start'
					// 			}
					// 		},params.row.jyxm)
					// 	}
					// },{
					// 	title: '检测值',
					// 	key: 'jcz',
					// 	render(h,params){
					// 		return h('Tooltip',{
					// 			props: {
					// 				content: params.row.jcz,
					// 				placement: 'top-start'
					// 			}
					// 		},params.row.jcz)
					// 	}
					// },{
					// 	title: '标准值',
					// 	key: 'bzz',
					// 	render(h,params){
					// 		return h('Tooltip',{
					// 			props: {
					// 				content: params.row.bzz,
					// 				placement: 'top-start'
					// 			}
					// 		},params.row.bzz)
					// 	}
					// },{
						title: '检测结果',
						key: 'jcJg',
						width: 80,
					}]
				}
			}
		},
		components:{
			szlModalTable
		},
		methods: {
			modalShow(e) {
				this.title=e[0].qymc;
				this.modal = true;
				this.$refs.modal.getTableMsg(E_OVERSAMPLING+'/'+e[0].qymc)
			}
		},
		mounted(){
		}
	}
</script>

<style lang='scss'>
</style>