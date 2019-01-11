<template>
	<div class="charts">
		<div class="charts-title">
			违规类型对比
		</div>
		<div id="against"></div>
	</div>
</template>

<script>
    import echarts from "echarts";
    import { throttle } from "@/unit/pub";
	import { mapState } from 'vuex';
	import apis from "@/unit/apis";
	const {
		CARD_CODE
	} = apis
	export default {
		data() {
			return {
				color: "#999",
				xdatas: ['许可证未公示', '证件模糊', '证件过期', '超范围经营', '疑似假证', '一证多用'],
				ydatas: [],
				myChart: null,
				num: -1,
				isHover: false
			}
		},
		computed: {
			...mapState({
				isFullScreen: state => state.isFullScreen
			}),
		},
		methods: {
			init() {
				this.xdatas.forEach(item => {
					this.ydatas.push({
						name: item
					})
				})
				this.myChart = echarts.init(document.getElementById('against'));
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
				window.addEventListener('resize', throttle(this.myChart.resize));
			},
			getData(res) {
				this.myChart.dispatchAction({
					type: 'downplay',
					seriesIndex: 0,
					dataIndex: this.num
				});
				if(this.num>=5){
					this.num = 0
				}else{
					this.num++
				}
				res.forEach(item => {
					if(CARD_CODE[item.illegalType]||CARD_CODE[item.illegalType]==0){
						this.ydatas[CARD_CODE[item.illegalType]].value = item.count;
						this.ydatas[CARD_CODE[item.illegalType]].percent = item.percent;
					}
				})
				this.$nextTick(() => {
					this.getCharts();
				})
			},
			getCharts() {
				let option = {
					tooltip: {
						show: false,
						trigger: 'item',
					},
					legend: {
						x: 'left',
						left: 10,
						orient: 'vertical',
						itemWidth: 12,
						itemHeight: 12,
						textStyle: { //图例文字的样式
							color: this.color,
							fontSize: 13
						},
						data: this.xdatas,
						selectedMode: false
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: ['55%', '80%'],
						center: ["55%", "48%"],
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
									return '{a|'+value.name+'\n'+value.data.percent+'%}'
								},
								rich:{
									a:{
										lineHeight: 24
									}
								},
								textStyle: {
									fontSize: '18',
									fontWeight: 'bold'
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
				this.myChart.setOption(option,true);
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
			against: {
				type: Array,
				default: []
			}
		},
		watch: {
			isFullScreen(a, b) {
				if(a) {
					this.color = "#fff";
				} else {
					this.color = "#999";
				}
				this.$nextTick(() => {
					this.getCharts();
					setTimeout(() => {
						this.myChart.resize();
					}, 100)
				})
			},
			against(a, b) {
				if(!this.isHover) {
					this.getData(a)
				}
			}
		}
	}
</script>

<style lang="scss">
	#against {
		position: absolute;
		width: 100%;
		left: 0;
		top: 50px;
		bottom: 0;
	}
</style>