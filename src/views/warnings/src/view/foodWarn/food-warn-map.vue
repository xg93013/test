<template>
	<div id='foodMap'>
		<div v-show='index==1' id='foodMapa'>
			<span>暂无数据</span>
		</div>
		<div v-show='index==2' id='foodMapb'>
			<span>暂无数据</span>
		</div>
	</div>
</template>

<script>
	import echarts from "echarts";
	import http from "../../unit/http";
	import apis from "../../unit/apis";
	const {
		C_RANK,
		C_KEYFOOD,
		TIMING
	} = apis;
	export default {
		data() {
			return {
				index: 1,
				myCharta: null,
				detailsa: [],
				xdata: [],
				xdataa: [],
				ydata: [],
				myChartb: null,
				detailsb: [],
				xdatab: [],
				xdatabb: [],
				ydatab: [],
				ymax: 0
			};
		},
		methods: {
			optionData(xdata, ydata, index) {
				let xdataa = this.xdataa,xdatabb =this.xdatabb;
				return {
					color: ["#3398DB"],
					tooltip: {
						trigger: "axis",
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter(value) {
							if(index == 1) {
								return(
									xdataa[value[0].dataIndex] +
									"<br />不合格率：" +
									parseInt(value[0].data*100)/100 +
									"%"
								);
							} else {
								return(
									xdatabb[value[0].dataIndex] +
									"<br />抽检数量：" +
									value[0].data
								);
							}
						}
					},
					grid: {
						left: "0",
						right: "0",
						bottom: "4",
						top: "10",
						containLabel: true
					},
					xAxis: [{
						type: "category",
						data: xdata,
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#DAE6FF",
								fontSize: "12"
							},
							rotate: -90
						},
						axisLine: {
							lineStyle: {
								color: "#373F70"
							}
						}
					}],
					yAxis: [{
						type: "value",
						max: (e) => {
							if(index == 1) {
								return 100;
							} else{
								return this.ymax;
							}
						},
						splitLine: {
							show: true, // 网格线是否显示
							//  改变样式
							lineStyle: {
								color: "#373F70", // 修改网格线颜色
								type: "dotted"
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#DAE6FF",
								fontSize: "12"
							},
							formatter(value) {
								if(index == 1) {
									return value + "%";
								} else {
									return value;
								}
							}
						},
						axisLine: {
							lineStyle: {
								color: "#373F70"
							}
						}
					}],
					series: [{
						name: "不合格率",
						type: "bar",
						barWidth: "16",
						data: ydata,
						itemStyle: {
							normal: {
								barBorderRadius: [16, 16, 0, 0],
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1, [{
											offset: 0,
											color: "#0598FF"
										},
										{
											offset: 1,
											color: "#0A68DD"
										}
									]
								)
							}
						}
					}]
				};
			},
			foodMapa() {
				let xdata = this.xdata,
					ydata = this.ydata;
				let option = this.optionData(xdata, ydata, 1);
				this.myCharta = echarts.init(document.getElementById("foodMapa"));
				this.myCharta.setOption(option);
				this.myCharta.on("click", e => {
					let data = { ...this.detailsa[e.dataIndex]
					};
					data.i = 1;

					this.$emit("mapModalShow", data);
				});
				window.addEventListener("resize", () => {
					this.myCharta.resize();
				});
			},
			foodMapb() {
				let xdata = this.xdatab,
					ydata = this.ydatab;
				let option = this.optionData(xdata, ydata, 2);
				this.myChartb = echarts.init(document.getElementById("foodMapb"));
				this.myChartb.setOption(option);
				this.myChartb.on("click", e => {
					let data = { ...this.detailsb[e.dataIndex]
					};
					data.i = 2;
					this.$emit("mapModalShow", data);
				});
				window.addEventListener("resize", () => {
					this.myChartb.resize();
				});
			},
			async unqualified() {
				let res = await http.get(C_RANK);
				this.$emit("closeShow"); //关闭等待
				if(res) {
					this.detailsa = res.data;
					this.xdata = [];
					this.ydata = [];
					for(let i of res.data) {
						if(i.fldl.length>4){
							this.xdata.push(i.fldl.substr(0,3)+"...");
						}else{
							this.xdata.push(i.fldl);
						}
						this.xdataa.push(i.fldl);
						this.ydata.push(i.bhgl * 100); 
					}
					if(this.xdata.length && this.ydata.length) {
						this.$nextTick(() => {
							this.foodMapa();
						});
					}
				}
			},
			async keySampling() {
				let res = await http.get(C_KEYFOOD);
				if(res) {
					this.detailsb = res.data;
					this.xdatab = [];
					this.ydatab = [];

					for(let i of res.data) {
						if(i.fldl.length>4){
							this.xdatab.push(i.fldl.substr(0,3)+"...");
						}else{
							this.xdatab.push(i.fldl);
						}
						this.xdatabb.push(i.fldl);
						this.ydatab.push(i.cydsl); 
						if(i.cydsl>this.ymax){
							this.ymax = i.cydsl;
						}
					}
					if(this.xdatab.length && this.ydatab.length) {
						this.$nextTick(() => {
							this.foodMapb();
						});
					}
				}
			},
			getMsga() {
				//当月食品大类不合格排行
				this.index = 1;
				this.$nextTick(() => {
					this.myCharta.resize();
				});
			},
			getMsgb() {
				//当月全国重点抽检食品
				this.index = 2;
				this.$nextTick(() => {
					this.myChartb.resize();
				});
			},
			init() {
				this.unqualified();
				this.keySampling();
			}
		},
		mounted() {
			this.init();
			setInterval(() => {
				this.init();
			}, TIMING);
		}
	};
</script>

<style lang='scss'>
	#foodMap {
		width: 100%;
		height: 170px;
		#foodMapa,
		#foodMapb {
			position: relative;
			width: 100%;
			height: 170px;
			span {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
</style>