<template>
	<div class='warn-list'>
		<div class='warn-list-box'>
			<div class='list-title'>食品品类风险预警</div>
			<div class='list-content'>
				<div class='unqualified-food'>
					<!-- <div class='unqualified-food-title'>
						<div>不合格食品实时检测动态</div>
						<szlDialog :config="foodTableConfig" @item-click="modalShow"></szlDialog>
						<a v-show='foodTableMsg.datas.length' :href='exportUrl' class='szl-export'>
							导出名单
						</a>
					</div> -->
					<div class='unqualified-food-title'>
						<div>不合格食品实时检测动态</div>
						<szlDropdown class="dropdown">
							<div>
								<!-- <szlWarnTable class="pop-list" @modalAction='modalShow' ref='unc' :tableMsg='foodTableMsg' /> -->
								<!-- <span class="pop-list" @click="viewMore">查看更多</span> -->
								<szlDialog class="pop-list" :config="foodTableConfig" @item-click="modalShow"></szlDialog>
								<a class="szl-export pop-list" :href='exportUrl'>导出名单</a>
							</div>
						</szlDropdown>
					</div>
					<szlWarnTable @modalAction='modalShow' ref='unc' :tableMsg='foodTableMsg' />
				</div>
				<div class='unqualified-food-map'>
					<div class='unqualified-food-map-title'>
						<div :class='{active:index==1}' @click='changeNav(1)'>当月食品大类不合格率排行</div>
						<div :class='{active:index==2}' @click='changeNav(2)'>当月全国重点抽检食品</div>
					</div>
					<div class='unqualified-food-map-con'>
						<foodWarnMap ref='foodWarnMap' @closeShow='closeShow' @mapModalShow='mapModalShow' />
						<Spin v-show='show' fix>
							<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
							<div>加载中...</div>
						</Spin>
					</div>
				</div>
			</div>
		</div>
		<foodWarnModal ref='foodWarnModal' style="z-index:9999"/>
		<foodWarnMapModal ref='foodWarnMapModal' />
	</div>
</template>

<script>
	import szlWarnTable from '../../components/szl-warn-table.vue'
	import szlDialog from '../../components/szl-dialog.vue'
	import szlDropdown from '../../components/szl-dropdown.vue'
	import foodWarnMap from './food-warn-map.vue'
	import foodWarnModal from './food-warn-modal'
	import foodWarnMapModal from './food-warn-map-modal'
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const {
		UN_C,
		UREPORT_EXCEL_UNQUALIFIED,
		TIMING
	} = apis

	function addTotalListColumns(originColumns,mapObj){
		var temp = originColumns;
		_.forEach(temp, function(item, index) {
			if (_.has(mapObj, item.key)) {
				item.key = mapObj[item.key];
			}
		});
		temp.unshift({
			title: '报告编号',
			key: 'bh',
			width:100
			// render(h, params) {
			// 	return h('Tooltip', {
			// 		props: {
			// 			content: params.row.mc,
			// 			placement: 'top-start'
			// 		}
			// 	}, params.row.mc)
			// }
		});
		temp.splice(3,0,{
				title: '所属区域',
				key: 'qyQx',
				// width:100,
				render(h, params) {
					return h('Tooltip', {
						props: {
							content: params.row[params.column.key],
							placement: 'top-start'
						}
					}, params.row[params.column.key])
				}
			},{
				title: '标称生产企业',
				key: 'sczMc',
				// width:100,
				render(h, params) {
					return h('Tooltip', {
						props: {
							content: params.row[params.column.key],
							placement: 'top-start'
						}
					}, params.row[params.column.key])
				}
			},{
				title: '所属区域',
				key: 'szcSq',
				// width:100,
				render(h, params) {
					return h('Tooltip', {
						props: {
							content: params.row[params.column.key],
							placement: 'top-start'
						}
					}, params.row[params.column.key])
				}
			}
		)
		temp.splice(7,0,{
				title: '检测值 || 标准值',
				// width:100,
				// render(h, params) {
				// 	var text = params.row.scz+" | "+(params.row.bzxz||"无");
				// 	return h('Tooltip', {
				// 		props: {
				// 			content: text,
				// 			placement: 'top-start'
				// 		}
				// 	}, text)
				// }
				render(h, params) {
					var text = (params.row.scz || "- -")+" || "+(params.row.bzxz || "- -");
					var sczArr = (params.row.scz||"").split("，");
					var bzxzArr = (params.row.bzxz||"").split("，");
					var convertArr = _.map(sczArr, function(item, index){
						return item + " || " + (bzxzArr[index] || "- -")
					});

					text = convertArr.join("，");
					return h('Tooltip', {
							props: {
								// content: text,
								placement: 'top-start'
							}
						}, [text, h('div', {slot: 'content',style: {whiteSpace: 'normal'}}, text)]
					)
				}
			}
		)

		return temp;
	}
	export default {
		data() {
			// 属性key映射
			const mapping = {
				qy:"qyMc",
				xm:"jyXm"
			}
			let img = require('../../images/disabled.png')
			const columnsCommon = [{
						title: '食品名称',
						key: 'mc',
						render(h, params) {
							return h('Tooltip', {
								props: {
									content: params.row.mc,
                                    placement: 'top-start'
								}
							}, params.row.mc)
						}
					}, {
						title: '被抽样单位',
						key: 'qy',
						width: 160,
						render(h, params) {
							return h('Tooltip', {
								props: {
									content: params.row[params.column.key],
									placement: 'top-start'
								}
							}, params.row[params.column.key])
						}

					}, {
						title: '不合格检验项目',
						key: 'xm',
						width: 130,
						ellipsis: true,
						className: 'no-success',
						render(h, params) {
							
							let disableStyle = {}
							if(params.row.ifJy == '是') {
								disableStyle = {
									backgroundImage: `url(${img})`,
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'right 7px'
								}
							}
							var text = params.row[params.column.key];
							// return h('Tooltip', {
							// 	props: {
							// 		content: text,
							// 		placement: 'top-start',
							// 	},
							// 	style: {
							// 		maxWidth: '110px',
							// 		paddingRight: '24px',
							// 		...disableStyle
							// 	}
							// }, text)
							return h('Tooltip', {
								props: {
									// content: text,
									placement: 'top-start',
								},
								style: {
									maxWidth: '110px',
									paddingRight: '24px',
									...disableStyle
								}
							}, [text, h('div', {slot: 'content',style: {whiteSpace: 'normal',wordWrap: 'break-word',wordBreak: 'normal'}}, text)])
						}
					}, {
						title: '报告日期',
						key: 'rq'
					}, {
						title: '处理结果',
						key: 'hcl',
						render(h, params) {
							if(params.row.hcl == '未处理') {
								return h('div', {
									style: {
										color: '#D23A3A'
									}
								}, '未处理')
							} else {
								return h('div', {

								}, '已处理')
							}
						}
					}]
			const totalListColumns = addTotalListColumns(_.cloneDeep(columnsCommon),mapping);
			
			return {
				exportUrl: UREPORT_EXCEL_UNQUALIFIED,
				index: 1,
				show: true,
				foodTableConfig:{
					name:"不合格食品实时检测动态",
					modalWidth: 1200,
					url:UN_C+"/list",
					columns: totalListColumns,
					itemClick : function (){}
				},
				foodTableMsg: {
					datas: [],
					columns: columnsCommon
				}
			}
		},
		components: {
			szlWarnTable,
			foodWarnMap,
			foodWarnModal,
			foodWarnMapModal,
			szlDialog,
			szlDropdown
		},
		methods: {
			modalShow(e) {
				this.$refs.foodWarnModal.modalShow(e);
			},
			mapModalShow(e){
				this.$refs.foodWarnMapModal.modalShow(e);
			},
			async getUnc(){//不合格食品实时监测动态
				let res = await http.get(UN_C);
				this.$refs.unc.closeLoading();
				if(res){
					this.foodTableMsg.datas=[...res.data]
				}
			},
			closeShow(){
				this.show=false;
			},
			changeNav(e){
				if(e!=this.index){
					this.index=e;
					if(e==1){
						this.$refs.foodWarnMap.getMsga()
					}else{
						this.$refs.foodWarnMap.getMsgb()
					}
				}
			}
		},
		mounted() {
			this.getUnc();
			setInterval(()=>{
				this.getUnc();
			},TIMING)
		}
	}
</script>

<style lang='scss'>
	.unqualified-food {
		width: 100%;
		height: 220px;
		padding: 5px 20px 10px 20px;
		border-bottom: 2px solid #131A36;
		.unqualified-food-title {
			height: 30px;
			line-height: 30px;
			>div{
				float: left;
			}
			// >a {
			// 	display: block;
			// 	float: right;
			// 	cursor: pointer;
			// }
			.dropdown{
				float: right;
			}
		}
	}
	
	.unqualified-food-map {
		width: 100%;
		height: 280px;
		padding: 5px 20px 10px 20px;
		.unqualified-food-map-title {
			height: 50px;
			padding-top: 10px;
			div {
				float: left;
				width: 180px;
				background: #2B3558;
				text-align: center;
				height: 26px;
				line-height: 26px;
				cursor: pointer;
				transition: all .3s;
				&:not(.active):hover {
					background: #404864;
				}
			}
			.active {
				background: #0968DF;
			}
		}
		.unqualified-food-map-con {
			position: relative;
			width: 100%;
			height: 170px;
		}
	}
</style>