<template>
	<div id='contrast'>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const {
		REGULATORY_CAPACITIES
	} = apis
	export default {
		data() {
			return {
				index: 0,
				indicator: [],
				value: [],
				seriesTitle: '一圈层各区县对比'
			}
		},
		methods: {
			getContrastMsg() {
				let seriesTitle=this.seriesTitle;
				let indicator=this.indicator,value=this.value;
				let myChart = echarts.init(document.getElementById('contrast'));
				let option = {
					tooltip: {
					},
					radar: {
						splitArea: {
							areaStyle: {
								color: ['#1D2B46',
									'#283A5C', '#1D2B46',
									'#283A5C', '#1D2B46'
								],
								shadowColor: 'rgba(0, 0, 0, 0.3)',
								shadowBlur: 10
							}
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: '#2A3958'
							}
						},
						splitLine: {
							lineStyle: {
								color: '#2A3958'
							}
						},
						// shape: 'circle',
						name: {
							textStyle: {
								color: '#DAE6FF',
								padding: [-8, 0]
							}
						},

						indicator: indicator,
						triggerEvent: true
					},
					series: [{
						name: seriesTitle,
						symbol:'emptyCircle',  /*曲线圆点*/
           				symbolSize:6,
						type: 'radar',
						 itemStyle: {
                            normal: {
                                color : "#0794FF", // 图表中各个图区域的边框线拐点颜色
                                lineStyle: {
                                    color:"#0794FF" // 图表中各个图区域的边框线颜色
                                },
                                areaStyle: {
                                    type: 'default'
                                }
                            }
                        },
						areaStyle: {
							normal: {
								color: new echarts.graphic.RadialGradient(0, 0.5, 1, [{
										color: '#0024FF',
										offset: 1
									},
									{
										color: '#05D7FD',
										offset: 0
									}
								])
							}
						},
						data:[{
							value: value,
						}]
					}]
				};
				myChart.setOption(option);
				window.addEventListener('resize', () => {
					myChart.resize();
				});
			},
			async getDatas(e,b){
				if(b){
					this.$emit('showLoad');
				}
				let res = await http.get(REGULATORY_CAPACITIES);
				this.$emit('closeLoad');
				if(res){
					switch(e){
						case 0:
							this.seriesTitle='一圈层各区县对比'
							break;
						case 1:
							this.seriesTitle='二圈层各区县对比'
							break;	
						case 2:
							this.seriesTitle='三圈层各区县对比'
							break;	
						default:
							break;	
					}
					let data = [];
					if (res.data[e]) {
						data=res.data[e].values;
					} else {
						return;
					}
					this.indicator=[];
					this.value=[];
					for(let item in data){
						this.indicator.push({
							name: item,
							max: data[item]+100
						});
						this.value.push(data[item])
					}
					this.getContrastMsg();
				}
			}
		},
		mounted() {
			this.getDatas(0);
		}
	}
</script>

<style lang='scss' scoped>
	#contrast {
		height: 170px;
	}
</style>