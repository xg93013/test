<template>
	<Modal v-model="modal" width='1200' :title="title">
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
		E_PUNISH
	} = apis
	export default {
		data() {
			return {
				title: '',
				modal: false,
				modalTableMsg: {
					type: 'punish',
					columns: [{
						title: '处罚决定书日期',
						key: 'cfjdrq'
					}, {
						title: '违法行为类型',
						key: 'wfxw',
						width: 200
					}, {
						title: '处罚决定文书号',
						key: 'cfjd'
					},{
						title: '处罚依据',
						key: 'cfjdyj'
					},{
						title: '处罚内容',
						key: 'cfnr'
					},{
						title: '行政处罚决定机关名称',
						key: 'cfjdjgmc',
						width: 160
					},{
						title: '案结日期',
						width: 116,
						key: 'ajrq'
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
				this.$refs.modal.getTableMsg(E_PUNISH+'/'+e[0].qymc,e.period)
			}
		},
		mounted(){
		}
	}
</script>

<style lang='scss'>
</style>