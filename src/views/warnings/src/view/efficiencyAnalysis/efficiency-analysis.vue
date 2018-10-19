<template>
	<div class='warn-list' id='efficiency'>
		<div class='warn-list-box'>
			<div class='list-title'>监管效能分析</div>
			<div class='list-content'>
				<div>
					<div style='line-height: 30px'>各区县监管能力对比</div>
					<div class='title'>
						<div v-for='(item,i) in circelTxt' :class='{active: circel==i}'  @click='changeCircel(i)'>
							{{item}}
						</div>
					</div>
					<div style='position:relative'>
						<contrastMap ref='cirMap' @showLoad='showLoad' @closeLoad='closeLoad' />
						<Spin v-show='show' fix>
							<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
							<div>加载中...</div>
						</Spin>
					</div>
				</div>
				<div>
					<div class='title'>
						<div :class='{active: index==1}' @click='index=1'>生产企业抽检覆盖率</div>
						<div :class='{active: index==2}' @click='index=2'>抽检不合格率</div>
						<div :class='{active: index==3}' @click='index=3'>风险分级率</div>
						<div :class='{active: index==4}' @click='index=4'>整改数据异常</div>
					</div>
					<szlWarnTable v-show='index==1' ref='tablea' :tableMsg='foodTableMsga' />
					<szlWarnTable v-show='index==2' ref='tableb' :tableMsg='foodTableMsgb' />
					<szlWarnTable v-show='index==3' ref='tablec' :tableMsg='foodTableMsgc' />
					<szlWarnTable v-show='index==4' ref='tabled' :tableMsg='foodTableMsgd' />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import szlWarnTable from '../../components/szl-warn-table.vue'	
	import contrastMap from './contrast-map.vue'
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const {
		SAMPLE_COVERAGE,
		SAMPLE_UNQUALIFIED_RATIO,
		ENTERPRISE_GRADE,
		REEXAMING_PROBLEM,
		TIMING
	} = apis
	const toFixed2=e=>{
				return parseInt(Number(e)*10000)/100+'%'
			}
	export default {
		data() {
			return {
				show: false,
				index: 1,
				circel: 0,
				circelTxt: ['一圈层各区县对比','二圈层各区县对比','三圈层各区县对比'],
				foodTableMsga: {
					height: 160,
					datas: [],
					columns: [{
						title: '区/县',
						key: 'dname'
					}, {
						title: '抽检数量/总数量',
						render(h,params){
							return h('div',{
								
							},params.row.ecount+'/'+params.row.acount)
						}
					}, {
						title: '抽检覆盖率',
						key: 'cjl',
						render(h,params){
							return h('div',{
								
							},toFixed2(params.row.cjl))
						}
					}]
				},
				foodTableMsgb: {
					height: 160,
					datas: [],
					columns: [{
						title: '区/县',
						key: 'qx'
					}, {
						title: '不合格批次/抽检批次',
						render(h,params){
							return h('div',{
								
							},params.row.bhgs+'/'+params.row.sl)
						}
					}, {
						title: '不合格率',
						key: 'bhgl',
						render(h,params){
							return h('div',{
								
							},toFixed2(params.row.bhgl))
						}
					}]
				},
				foodTableMsgc: {
					height: 160,
					datas: [],
					columns: [{
						title: '区/县',
						key: 'qy'
					}, {
						title: '企业总数量',
						key: 'count'
					}, {
						title: '未分级数量',
						key: 'unGradeCount'
					},{
						title: '分级率',
						render(h,params){
							return h('div',{
								
							},toFixed2(params.row.gradeRatio))
						}
					}]
				},
				foodTableMsgd: {
					height: 160,
					datas: [],
					columns: [{
						title: '区/县',
						key: 'qy'
					}, {
						title: '数据总量',
						key: 'count'
					}, {
						title: '异常数据',
						key: 'problemCount'
					},{
						title: '问题率',
						render(h,params){
							return h('div',{
								
							},toFixed2(params.row.problemRatio))
						}
					}]
				}
			}
		},
		components:{
			szlWarnTable,
			contrastMap
		},
		methods:{
			async getDataa(){///抽检覆盖率
				let res = await http.get(SAMPLE_COVERAGE);
				this.$refs.tablea.closeLoading();
				if(res){
					this.foodTableMsga.datas=[...res.data]
				}
			},
			async getDatab(){///抽检不合格率
				let res = await http.get(SAMPLE_UNQUALIFIED_RATIO);
				this.$refs.tableb.closeLoading();
				if(res){
					this.foodTableMsgb.datas=[...res.data]
				}
			},
			async getDatac(){///抽检不合格率
				let res = await http.get(ENTERPRISE_GRADE);
				this.$refs.tablec.closeLoading();
				if(res){
					this.foodTableMsgc.datas=[...res.data]
				}
			},
			async getDatad(){///抽检不合格率
				let res = await http.get(REEXAMING_PROBLEM);
				this.$refs.tabled.closeLoading();
				if(res){
					this.foodTableMsgd.datas=[...res.data]
				}
			},
			changeCircel(e){
				if(this.circel!=e){
					this.circel=e;
					this.$refs.cirMap.getDatas(e,1)
				}
			},
			closeLoad(){
				this.show=false;
			},
			showLoad(){
				this.show=true;
			},
			init(){
				this.getDataa();
				this.getDatab();
				this.getDatac();
				this.getDatad();
				this.$refs.cirMap.getDatas(this.circel)
			}
		},
		mounted(){
			this.init();
			setInterval(()=>{
				this.init();
			},TIMING)
		}
	}
</script>

<style>
	#efficiency td{
		height: 26px;
	}
</style>
<style lang='scss' scoped>
	.list-content>div{
		padding: 5px 20px 10px 20px;
		
		&:first-child{
			height: 54%;
			border-bottom: 2px solid #131A36;
		}
		
		&:last-child{
			height: 46%;
		}
		
		.title{
			height: 40px;
			text-align: center;
			padding-top: 5px;
			
			div{
				float: left;
				width: 25%;
				height: 26px;
				line-height: 26px;
				background: #2B3558;
				border: 1px solid #353C72;
				border-right: none;
				cursor: pointer;
				transition: all .3s;
				
				&:last-child{
					border-right: 1px solid #353C72;
				}
				
				&:not(.active):hover{
					background: #404864;
				}
				
			}
			
			.active{
				background: #0A67DE;
			}
		}
		
	}
</style>