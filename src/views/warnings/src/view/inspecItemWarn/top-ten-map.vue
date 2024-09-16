<template>
	<div id='topTen'>
		<span v-show='xdata.length==0'>暂无数据</span>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const { I_HIGHRISK,I_TOP_TEN,TIMING } = apis
	export default {
		data() {
			return {
				xdata:[],
				ydata:[]
			}
		},
		methods: {
			getTopTen() {
				let xdata=this.xdata,ydata=this.ydata;
				let myChart = echarts.init(document.getElementById('topTen'));
				let option = {
					formatter(value) {
						return value[0].name+'<br />检出次数：' + value[0].data + '次';
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						left: '0',
						right: '0',
						top: '10',
						bottom: '10',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01],
						axisLine: {
							lineStyle: {
								color: '#373F70'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							formatter() {
								return "";
							},
						},
						splitLine: {　　　　
							show: false　　
						}
					},
					yAxis: {
						type: 'category',
						data: xdata,
						axisLabel: {
							textStyle: {
								color: '#DAE6FF',
								fontSize: '12'
							},
							formatter(e){
								if(e.length>4){
									return e.substr(0,4)+"..."
								}else{
									return e
								}
							},
						},
						axisLine: {
							lineStyle: {
								color: '#373F70'
							}
						},
						axisTick: {
							show: false
						}
					},
					series: [{
						type: 'bar',
						barWidth: '8',
						data: ydata,
						itemStyle: {
							normal: {
								barBorderRadius: [0, 8, 8, 0],
								color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
									offset: 0,
									color: '#0598FF'
								}, {
									offset: 1,
									color: '#0A68DD'
								}])
							}
						}
					}]
				};

				myChart.setOption(option);
				window.addEventListener('resize',() => {
					myChart.resize();
				});
			},
			async topTen(){
				let res = await http.get(I_TOP_TEN);
				this.$emit('closeTenPercent')
				if(res){
					this.xdata=[];
					this.ydata=[];
					for(let i of res.data){
						this.xdata.push(i.jyxm);
						this.ydata.push(i.count);
					}
					this.xdata.reverse();
					this.ydata.reverse();
				}
				if(this.xdata.length>0){
					this.getTopTen();
				}
			},
		},
		mounted() {
			this.topTen();
			setInterval(()=>{
				this.topTen();
			},TIMING)
		}
	}
</script>

<style lang='scss'>
	#topTen {
		height: 260px;
		
		span {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>