<template>
	<div class='warn-list' id='efficiency'>
		<div class='warn-list-box'>
			<div class='list-title'>
				<span class="titleName">餐饮智慧监管平台预警</span>
                <Tooltip :content="tipsContent" placement="right" class="helpicon" v-show="!district"><Icon type="help"></Icon></Tooltip>
			</div>
			<div class='list-content'>
				<div>
					<!-- 市级 -->
					<div class="visibleShow city-bar" id="city-bar" :class="{'visible' : type === 1}"></div>
					<!-- 区县级 -->
					<div class="visibleShow area-pie" :class="{'visible' : type === 2}">
						<div class="pie-box" id="left-pie"></div>
						<div class="pie-box" id="right-pie"></div>
					</div>
				</div>
				<div>
					<div class='title'>
						<div :class='{active: index==1}' @click='index=1'>网络餐饮违规商家预警</div>
						<div :class='{active: index==2}' @click='index=2'>餐厨垃圾预警</div>
						<div :class='{active: index==3}' @click='index=3'>重点关注</div>
						<router-link to="/resultNetfood" tag="div" class="resultNetfood">核查结果</router-link>
					</div>
					<div class="see-more">
						<!-- 更多按钮 -->
						<szlDropdown class="dropdown">
							<div>
								<szlDialog class="pop-list" :config="moreTableConfig" @item-click="modalShow"></szlDialog>
								<a class="szl-export pop-list" :href='exportUrl'>导出名单</a>
							</div>
						</szlDropdown>
					</div>
					<szlWarnTable v-show='index==1' ref='tablea' :tableMsg='foodTableMsga' />
					<szlWarnTable v-show='index==2' ref='tableb' :tableMsg='foodTableMsgb' />
					<szlWarnTable v-show='index==3' ref='tablec' :tableMsg='foodTableMsgc' />

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import szlWarnTable from '../../components/szl-warn-table.vue'	
	import szlDropdown from '../../components/szl-dropdown.vue'
	import szlDialog from '../../components/szl-dialog.vue'
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const {
		TIMING,
		GRAPH_CATERING,
		ILLEGALSHOPEW,
		FOODWASTE,
		ATTENTION
	} = apis
	const toFixed2=e=>{
		return parseInt(Number(e)*10000)/100+'%'
	}
	export default {
		data() {
			return {
				index: 1,
				type: 1,
				district: '', // 当前角色区域权限true区县级false市级
				tipsContent: '默认按总数降序排列，单击筛选图例则只显示选择的图例，按降序排列',
				cityBarChart: '',
				areaLeftPie: '',
				areaRightPie: '',
				cityBarData: [],
				leftPieData: [],
				rightPieData: [],
				exportUrl: '',
				selected: {},
				sortAllData: [],
				allPlatForm: ['netfood', 'foodWaste'],
				foodTableMsga: {
					height: 180,
					datas: [],
					columns: [{
						title: '更新时间',
						key: 'updateTime',
						width: 90
						
					},{
						title: '商家名称',
						key: 'name',
						ellipsis: true,
						// width: 120,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.name,
                                        placement: "top-start"
                                    }
                                },
                                params.row.name
                            );
                        }
					},{
						title: '商家地址',
						key: 'address',
						ellipsis: true,
						// width: 120,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.address,
                                        placement: "top-start"
                                    }
                                },
                                params.row.address
                            );
                        }
					},{
						title: '区域',
						key: 'area'
					},{
						title: '风险评级',
						key: 'riskType',
						ellipsis: true,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.riskType,
                                        placement: "top-start"
                                    }
                                },
                                params.row.riskType
                            );
                        }
					}]
				},
				foodTableMsgb: {
					height: 180,
					datas: [],
					columns: [{
						title: '更新时间',
						key: 'updateTime',
						width: 90
						
					},{
						title: '商家名称',
						key: 'name',
						ellipsis: true,
						// width: 120,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.name,
                                        placement: "top-start"
                                    }
                                },
                                params.row.name
                            );
                        }
					},{
						title: '商家地址',
						key: 'address',
						ellipsis: true,
						// width: 120,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.address,
                                        placement: "top-start"
                                    }
                                },
                                params.row.address
                            );
                        }
					},{
						title: '区域',
						key: 'area'
					},{
						title: '风险评级',
						key: 'riskType',
						ellipsis: true,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.riskType,
                                        placement: "top-start"
                                    }
                                },
                                params.row.riskType
                            );
                        }
					}]
				},
				foodTableMsgc: {
					height: 180,
					datas: [],
					columns: [{
						title: '更新时间',
						key: 'updateTime'
					},{
						title: '商家名称',
						key: 'name',
						ellipsis: true,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.name,
                                        placement: "top-start"
                                    }
                                },
                                params.row.name
                            );
                        }
					},{
						title: '区域',
						key: 'area'
					},{
						title: '预警事件',
						key: 'event',
						ellipsis: true,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.name,
                                        placement: "top-start"
                                    }
                                },
                                params.row.name
                            );
                        }
					},{
						title: '风险等级',
						key: 'riskLevel',
						ellipsis: true,
						render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.riskType,
                                        placement: "top-start"
                                    }
                                },
                                params.row.riskType
                            );
                        }
					}]
				},
				moreTableConfig:{
					name:'',
					modalWidth: 1200,
					url:'',
					columns: '',
					itemClick : function (){}
				}
			}
		},
		components:{
			szlWarnTable,
			szlDropdown,
			szlDialog
		},
		watch: {
			index (newV) {
				this.setMoreTableConfig();
			}
		},
		created () {
			this.setMoreTableConfig();
		},
		methods:{
			async getDataa(){
				let res = await http.get(ILLEGALSHOPEW);
				this.$refs.tablea.closeLoading();
				if(res.data){
					this.foodTableMsga.datas=[...res.data.slice(0,5)]
				}
			},
			async getDatab(){
				let res = await http.get(FOODWASTE);
				this.$refs.tableb.closeLoading();
				if(res.data){
					this.foodTableMsgb.datas=[...res.data.slice(0,5)]
				}
			},
			async getDatac(){
				let res = await http.get(ATTENTION);
				this.$refs.tablec.closeLoading();
				if(res.data){
					this.foodTableMsgc.datas=[...res.data.slice(0,5)]
				}
			},
			closeLoad(){
				this.show=false;
			},
			showLoad(){
				this.show=true;
			},
			init(){
				this.getChartData();
				this.getDataa();
				this.getDatab();
				this.getDatac();
			},
			initCityBar(){
				let arr = this.cityBarData;
				let colors = ['#4472C4','#FFC000','#E18149','#A5A5A5'];
				let series = [];
				let legend = [];
				let xData = [];
				let yMax = 100;
				let _self = this;

				this.cityBarChart = echarts.init(document.getElementById('city-bar'));

				series = this.getOptionData().series;
				legend = this.getOptionData().legend;
				xData = this.getOptionData().xData;

				let option = {
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        lineStyle: {
                            type: 'dashed'
                        }
						},
						// formatter: function(params){
						// 	// console.log(params);
						// 	let htmls = '';
						// 	for(let i=0;i<params.length;i++){
						// 		htmls += params[i].data.name + '(' + params[i].seriesName + ')：' + params[i].value + '<br />'
						// 	}
						// 	return htmls
						// }
                    },
                    legend: {
                        top: 10,
						right: 0,
						orient: 'vertical',
						itemWidth: 10,
						itemHeight: 8,
						selectedMode: 'multiple',
						selected: _self.selected,
                        textStyle: {
							color: '#72B5E6',
							fontSize: 8
                        },
                        data: legend
                    },
                    grid: {
                        left: 15,
                        right: 15,
                        top: 50,
                        bottom: 10,
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
						data: xData,
						boundaryGap: true,
                        axisLine: {
							show: true,
                            lineStyle: {
                                color: '#373F70'
                            }
                        },
                        axisLabel: {
							show: true,
                            color: '#AAD7FF',
							fontSize: 12,
							rotate: 45
                        },
                        axisTick: {
                            alignWithLabel: true
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
							show: false,
                            lineStyle: {
                                color: '#373F70'
                            }
                        },
                        axisLabel: {
                            color: '#AAD7FF',
                            fontSize: 12,
                            interval: 0
                        },
                        axisTick: {
                            alignWithLabel: true,
                            length: 0
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    series: series
				};
				this.cityBarChart.setOption(option);
				window.addEventListener('resize', () => {
					this.cityBarChart.resize();
				})
				this.cityBarChart.on('legendselectchanged', (params) => {
					let filterArr = [];
					this.selected = params.selected;
					for(let item in params.selected){
						if(params.selected[item] == true){
							filterArr.push(this.switchNameToKey(item));						
						}
					}
					this.sortAllDatas = this.sortAllArr(this.sortAllData,filterArr);
					this.cityBarData = this.formatterArr(this.sortAllDatas,this.allPlatForm);
					this.cityBarChart.clear();
					this.cityBarChart.off('legendselectchanged');
					this.initCityBar();
				});
			},
			async getChartData(){
				let res = await http.get(GRAPH_CATERING);
				this.district = res.data.district;
				let totalData = res.data.datalist;
				if(res.data){
					if(res.data.district){
						// 区县级
						this.type = 2;
						let netfood = totalData.netfood;
						let foodWaste = totalData.foodWaste;
						this.leftPieData = [];
						this.rightPieData = [];
						for	(let i = 0; i < netfood.length; i++) {
							this.leftPieData.push({
								name: netfood[i].status,
								value: netfood[i].percent,
							})
						}
						for	(let j = 0; j < foodWaste.length; j++) {
							this.rightPieData.push({
								name: foodWaste[j].status,
								value: foodWaste[j].percent,
							})
						}
						this.initLeftPie();
						this.initRightPie();
						
					} else {
						// 市级
						this.type = 1;
						this.sortAllData = this.sortAllArr(totalData,this.allPlatForm);
						let originData = this.formatterArr(this.sortAllData,this.allPlatForm);
						this.cityBarData = [...originData];
						this.initCityBar();
					}
				}
			},
			modalShow(){
				// this.setMoreTableConfig();
			},
			setMoreTableConfig(){
				let index = this.index;
				if(index === 1){
					this.exportUrl = '1';
					this.moreTableConfig.name = '网络餐饮违规商家预警';
					this.moreTableConfig.columns = [...this.foodTableMsga.columns];
					// this.moreTableConfig.columns.concat({
					// 	title: '额外',
					// 	key: 'other'
					// });
					this.moreTableConfig.url = ILLEGALSHOPEW;
				} else if(index === 2){
					this.exportUrl = '2';
					this.moreTableConfig.name = '餐厨垃圾预警';
					this.moreTableConfig.columns = [...this.foodTableMsgb.columns];
					this.moreTableConfig.columns.push({
						title: '预警类别',
						key: 'type'
					},{
						title: '商家类别',
						key: 'shoptype'
					},{
						title: '商家规模',
						key: 'shoparea'
					});
					this.moreTableConfig.url = FOODWASTE;
				} else {
					this.exportUrl = '3';
					this.moreTableConfig.name = '重点关注';
					this.moreTableConfig.columns = this.foodTableMsgc.columns;
					this.moreTableConfig.url = ATTENTION;
				}
				console.log(this.exportUrl)
			},
			initLeftPie(){				
				let data = this.leftPieData;
				this.areaLeftPie = echarts.init(document.getElementById('left-pie'));
				this.areaLeftPie.setOption(this.initPieOption('网络餐饮', data));
				window.addEventListener('resize', () => {
					this.areaLeftPie.resize();
				})
			},
			initRightPie(){
				let data = this.rightPieData;
				this.areaRightPie = echarts.init(document.getElementById('right-pie'));
				this.areaRightPie.setOption(this.initPieOption('餐厨垃圾', data));
				window.addEventListener('resize', () => {
					this.areaRightPie.resize();
				})
			},
			initPieOption(title, data){
				let colors = ['#4472C4','#FFC000','#E18149','#A5A5A5'];
				let option = {  
					title: {
						text: title,
						top: 10,
						left: 'center',
						textStyle:{
							color: '#fff',
							fontSize: 12,
							align: 'center'
						}
					},      
					tooltip : {
						trigger: 'item',
						formatter: "",
						textStyle: {
							color: '#fff',
							fontSize: 12
						},
						formatter: (params)=>{
							return params.name + '：' + params.value + '%'
						}
					},
					color:colors,
					grid: {
						left: 20,
						right: 20,
						top: 20,
						bottom: 20,
						containLabel: true
					},
					itemStyle: {
						borderColor: '#fff',
						borderWidth: 3
					},
					series: [
						{
							name:'',
							type:'pie',
							radius : [0, '55%'],
							selectedMode: false,
							selectedOffset: 0,
							center: ['50%', '50%'],	
							data: data,
							roseType: false,
							label: {
								show: true,
								position: 'outside',
							},
							labelLine: {
								show: true,
								length: 8,
								length2: 8
							},
							datasetIndex: 1,
							animationType: 'scale',
							animationEasing: 'elasticOut',
							animationDelay: function (idx) {
								return Math.random() * 200;
							}
						}
					]
				}
				return option
			},
			sortAllArr(arr, filterArr){
				let len = arr.length;
				let minIndex, temp;
				for (let i = 0; i < len - 1; i++) {
					minIndex = i;
					for (let j = i + 1; j < len; j++) {
						let prevSum = 0;
						let nextSum = 0;
						for (let k = 0; k < filterArr.length; k++) {
							prevSum += arr[j][filterArr[k]];
							nextSum += arr[minIndex][filterArr[k]];
						}
						if (prevSum > nextSum) {
							minIndex = j;
						}
					}
					temp = arr[i];
					arr[i] = arr[minIndex];
					arr[minIndex] = temp;
				}
				return arr;
			},
			switchKeyToName(key){
				let name = '';
				switch(key){
					case 'netfood':
						name =  '网络餐饮';
						break;
					case 'foodWaste':
						name = '餐厨垃圾';
						break;
					default:
						break;
				}
				return name
				
			},
			switchNameToKey(name){
				let key = '';
				switch(name){
					case '网络餐饮':
						key =  'netfood';
						break;
					case '餐厨垃圾':
						key = 'foodWaste';
						break;
					default:
						break;
				}
				return key
			},
			formatterArr(arr, filterArr){
				let dataArr = [];
				let _self = this;
				for (let i = 0; i < filterArr.length; i++) {
					let oneJson = {
						name: _self.switchKeyToName(filterArr[i]),
						data: []
					}
					for (let j = 0; j < arr.length; j++) {
						oneJson.data.push({
							name: arr[j].area,
							value: arr[j][filterArr[i]]
						})
					}
					dataArr.push(oneJson)
				}
				return dataArr
			},
			getOptionData(){
				let arr = this.cityBarData;
				let colors = ['#4472C4','#FFC000','#E18149','#A5A5A5'];
				let optionData = {
					legend: [],
					series: [],
					xData: []
				};
				for (let i=0; i<arr[0].data.length; i++) {
					optionData.xData.push(arr[0].data[i].name)
				}
				for (let i=0; i< arr.length; i++) {
					let oneSeries = {
                        name: arr[i].name,
                        type: 'bar',
                        stack: 'common',
                        data: arr[i].data,
                        barMaxWidth: 10,
                        barGap: '-100%',
                        barCategoryGap: '55%',
                        itemStyle: {
                            normal: {
                                color: colors[i],
                                label: {
                                    show: false
                                }
                            }
                        }
					}
					optionData.legend.push(arr[i].name);
					optionData.series.push(oneSeries);
				}
				return optionData
			}
		},
		mounted(){
			this.init();
			setInterval(() => {
				this.init();
			}, TIMING);
		}
	}
</script>

<style>
	#efficiency td{
		height: 26px;
	}
</style>
<style lang='scss' scoped>
	.list-title{
		// overflow: hidden;
		.titleName{
			float: left;
		}
		.helpicon{
			float: left;
			margin-left: 4px;
			cursor: pointer;
		}
	}
	.list-content>div{
		padding: 5px 20px 10px 20px;
		
		&:first-child{
			width: 100%;
			height: 50%;
			position: relative;
			border-bottom: 2px solid #131A36;
		}
		
		&:last-child{
			width: 100%;
			height: 50%;
			position: relative;
		}
		.visibleShow{
			visibility: hidden;
			position: absolute;
			left: 0;
			top: 0;
		}
		.visible{
			visibility: visible;
		}
		.city-bar{
			width: 100%;
			height: 100%;
		}
		.area-pie{
			width: 100%;
			height: 100%;
			overflow: hidden;
			.pie-box{
				width: 50%;
				height: 100%;
				float: left;
			}
		}
		.title{
			height: 30px;
			text-align: center;
			padding-top: 0;
			padding-right: 50px;
			div{
				float: left;
				// width: 30%;
				padding: 0 10px;
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
			.resultNetfood{
				border-radius: 4px;
				margin-left: 10px;
			}

			.active{
				background: #0A67DE;
			}
		}
		.see-more{
			position: absolute;
			z-index: 999;
			top: 40px;
			right: 20px;
		}
		
	}
</style>