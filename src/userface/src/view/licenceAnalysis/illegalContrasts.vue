<template>
	<div id="illegalContrasts">
		<div class="title">违规类型对比</div>
		<div class="charts" id="illegalContrastsCharts"></div>
		<div class="table" v-if="isArea">
			<div>
				<div>
					<div>违规类型</div>
					<div v-for="(item,index) in xdatas" :key="index">{{item}}</div>
					<!--<div>合计</div>-->
				</div>
				<div>
					<div>商家数</div>
					<div v-for="(item,index) in datas" :key="index" v-if="index<6">{{item.value}}</div>
				</div>
				<div>
					<div>占比</div>
					<div v-for="(item,index) in datas" :key="index" v-if="index<6">{{item.percent}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import echarts from "echarts";
    import { throttle } from "@/unit/pub";
	import apis from "@/unit/apis"
	const {
		CARD_CODE
	} = apis
	export default {
		data() {
			return {
				xdatas: ['许可证未公示', '证件模糊', '证件过期', '超范围经营', '疑似假证', '一证多用'],
				ydatas: [],
				center: ["50%", "60%"],
				radius: ['45%', '70%'],
				lenged: {},
				right: "",
				isArea: false,
				myChart: null,
				datas: [],
				num: -1,
				isHover: false
			}
		},
		methods: {
			resetNum() {
				this.num = -1
			},
			init() {
				this.isArea = this.$store.state.userMsg.regionType == "ZONE" ? true : false;
				this.xdatas.forEach(item => {
					this.ydatas.push({
						name: item
					});
					this.datas.push({
						name: item,
						value: "—",
						percent: "—"
					});
				});
				this.datas.push({
					name: "合计",
					value: "—",
					percent: "—"
				})
				if(this.isArea) {
					this.center = ["12%", "50%"];
					this.radius = ['45%', '70%'];
					this.right = 20;
					this.lenged = {
						top: 10,
						right: this.right,
						itemWidth: 12,
						itemHeight: 12,
						textStyle: { //图例文字的样式
							color: "#999",
							fontSize: 13
						},
						data: this.xdatas,
						selectedMode: false
					}
				} else {
					this.center = ["55%", "48%"];
					this.right = "10%";
					this.radius = ['55%', '80%'];
					this.lenged = {
						x: 'left',
						top: 10,
						left: 10,
						orient: 'vertical',
						itemWidth: 12,
						itemHeight: 12,
						textStyle: { //图例文字的样式
							color: "#999",
							fontSize: 13
						},
						data: this.xdatas,
						selectedMode: false
					}
				}
				this.myChart = echarts.init(document.getElementById('illegalContrastsCharts'));
				this.myChart.on('mouseover', (v) => {
					this.isHover = true;
					if(v.dataIndex != this.num) {
						this.myChart.dispatchAction({
							type: 'downplay',
							seriesIndex: 0,
							dataIndex: this.num
						});
						this.num = v.dataIndex
					}
				});
				this.myChart.on('mouseout', () => {
					this.isHover = false;
					this.myChart.dispatchAction({
						type: 'highlight',
						seriesIndex: 0,
						dataIndex: this.num
					});
				});
				window.addEventListener("resize", throttle(this.myChart.resize));
			},
			getDatas(res) {
				this.myChart.dispatchAction({
					type: 'downplay',
					seriesIndex: 0,
					dataIndex: this.num
				});
				if(this.num >= 5) {
					this.num = 0
				} else {
					this.num++
				}
				res.forEach(item => {
					if(CARD_CODE[item.illegalType] || CARD_CODE[item.illegalType] == 0) {
						this.ydatas[CARD_CODE[item.illegalType]].value = item.count;
						this.ydatas[CARD_CODE[item.illegalType]].percent = item.percent;
						this.datas[CARD_CODE[item.illegalType]].value = item.count;
						this.datas[CARD_CODE[item.illegalType]].percent = item.percent;
					}
					if(item.illegalType == "_TOTAL") {
						this.datas[6].value = item.count;
						this.datas[6].percent = item.percent;
					}
				})
				this.$nextTick(() => {
					this.getCharts();
				});
			},
			getCharts() {
				let option = {
					tooltip: {
						show: false,
						trigger: 'item',
					},
					legend: this.lenged,
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: this.radius,
						center: this.center,
						color: ["#276AB0", "#37b6e2", "#40A42B", "#f0c131", "#D9534F", "#7D55CB"],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								formatter(value) {
									return '{a|'+value.name+'\n'+value.data.percent+'}'
								},
								rich:{
									a:{
										lineHeight: 24
									}
								},
								textStyle: {
									fontSize: '18',
									fontWeight: 'bold',
//									color: this.color
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.ydatas
					}]
				};
				this.myChart.setOption(option, true);
				this.myChart.dispatchAction({
					type: 'highlight',
					seriesIndex: 0,
					dataIndex: this.num
				});
			}
		},
		beforeDestroy () {
			this.myChart.clear()
		},
		mounted() {
			this.init();
		},
		props: {
			illegalContrasts: {
				type: Array,
				default: []
			}
		},
		watch: {
			illegalContrasts(a, b) {
				if(!this.isHover) {
					this.getDatas(a)
				}
			}
		}
	}
</script>

<style lang="scss">
	#illegalContrasts {
		position: relative;
		#illegalContrastsCharts {
			position: relative;
			z-index: 10;
		}
		.table {
			position: absolute;
			width: 100%;
			left: 0;
			top: 40px;
			bottom: 0;
			>div {
				position: absolute;
				width: 75%;
				height: 150px;
				right: 20px;
				top: 50%;
				transform: translate(0, -50%);
				>div {
					width: 100%;
					height: 50px;
					padding-left: 10px;
					&:first-child {
						background: #F5F8FD;
						border-top: 1px solid #E2ECF6;
						border-bottom: 1px solid #E2ECF6;
						>div {
							color: #333;
						}
					}
					&:last-child {
						background: #f6f6f6;
					}
					>div {
						float: left;
						width: 14.2%;
						height: 100%;
						color: #666;
						line-height: 50px;
						/*&:last-child {
							width: 6%;
						}*/
					}
				}
			}
		}
	}
</style>