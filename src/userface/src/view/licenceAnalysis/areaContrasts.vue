<template>
	<div id="areaContrasts">
		<div class="title">违规商家数量区域对比</div>
		<div class="charts">
			<div class="t" id="areaContrastsChart"></div>
			<div class="b">
				<div>
					<span class="ille-title">
						<span>监测商<br />家总数</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count._COUNT}}</span>
					</div>
				</div>
				<div>
					<span class="ille-title">
						<span>违规商<br />家总数</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count._TOTAL}}</span>
					</div>
				</div>
				<div>
					<span class="ille-title">
						<span>许可证<br />未公示</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count.UN_PUBLICIZED}}</span>
					</div>
				</div>
				<div>
					<span class="ille-title">
						<span>证件<br />模糊</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count.VAGUE}}</span>
					</div>
				</div>
				<div>
					<span class="ille-title">
						<span>证件<br />过期</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count.EXPIRED}}</span>
					</div>
				</div>
				<div>
					<span class="ille-title">
						<span>超范围<br />经营</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count.OVER_RAGE}}</span>
					</div>
				</div>
				<div>
					<span class="ille-title">
						<span>疑似<br />假证</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count.FORGERY}}</span>
					</div>
				</div>
				<div>
					<span class="ille-title">
						<span>一证<br />多用</span>
					</span>
					<div v-for="(item,index) in xdatas" :key="index" :style="{width:(100/xdatas.length)+'%'}">
						<span>{{datas[index].count.MULTI_PURPOSE}}</span>
					</div>
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
				lengData: ['许可证未公示', '证件模糊', '证件过期', '超范围经营', '疑似假证', '一证多用'],
				xdatas: [],
				ydatas: [],
				datas: [],
				myChart: null,
				selected: {
					'许可证未公示': true,
					'证件模糊': false,
					'证件过期': false,
					'超范围经营': false,
					'疑似假证': false,
					'一证多用': false
				}
			}
		},
		methods: {
			init() {
				this.myChart = echarts.init(document.getElementById('areaContrastsChart'));
				this.myChart.on("legendselectchanged", (e) => {
					this.selected = { ...e.selected
					}
				})
				window.addEventListener("resize", throttle(this.myChart.resize));
			},
			getData(res) {
				this.datas = [...res];
				this.ydatas = [];
				this.lengData.forEach(item=>{
					this.ydatas.push([])
				});
				this.xdatas = [];
				res.forEach((item,index) => {
					this.xdatas.push(item.region);
					this.ydatas[0].push(item.count.UN_PUBLICIZED);
					this.ydatas[1].push(item.count.VAGUE);
					this.ydatas[2].push(item.count.EXPIRED);
					this.ydatas[3].push(item.count.OVER_RAGE);
					this.ydatas[4].push(item.count.FORGERY);
					this.ydatas[5].push(item.count.MULTI_PURPOSE);
				});
				this.$nextTick(()=>{
					this.getCharts();
				});
			},
			getCharts() {
				let option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						top: 10,
						right: 20,
						itemWidth: 12,
						itemHeight: 12,
						textStyle: { //图例文字的样式
							color: "#999",
							fontSize: 13
						},
						data: this.lengeData,
						selected: this.selected
					},
					color: ["#276AB0", "#37b6e2", "#40A42B", "#f0c131", "#D9534F", "#7D55CB"],
					grid: {
						left: 60,
						right: 20,
						bottom: '80',
						top: "40"
					},
					xAxis: [{
						type: 'category',
						data: this.xdatas,
						axisLabel: {
							show: true,
							// rotate:-90,
							textStyle: {
								color: "#666",
                                fontSize: "13"
                            },
                            rich:{
								a:{
									lineHeight: "6"
								}
							},
							formatter(value){
                                let txt =  ""
                                value.split("").forEach((item,index)=>{
                                        if(index<3){
                                            if(index == 0){
                                                txt += item
                                            }else{
                                                txt +="\n"+item
                                            }
                                        }
                                })
								if(value.length>3){
									txt +="\n"+"{a|.\n.\n.}"
                                }
                                return txt
							}
						},
						axisLine: {
							lineStyle: {
								color: "#eee"
							}
						},
					}],
					yAxis: [{
						type: 'value',
						splitLine: {
							show: true,
							lineStyle: {
								color: '#eee',
								width: 1
							},
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#666",
								fontSize: "12"
							},
							//							formatter(value) {
							//								return value + "%";
							//							}
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: "#666"
							}
						},
						axisTick: {
							show: false
						}
					}],
					series: [{
							name: '许可证未公示',
							type: 'bar',
							barWidth: 22,
							stack: '广告',
							data: this.ydatas[0]
						},

						{
							name: '证件模糊',
							type: 'bar',
							barWidth: 22,
							stack: '广告',
							data: this.ydatas[1]
						},
						{
							name: '证件过期',
							type: 'bar',
							barWidth: 22,
							stack: '广告',
							data: this.ydatas[2]
						},
						{
							name: '超范围经营',
							type: 'bar',
							barWidth: 22,
							stack: '广告',
							data: this.ydatas[3]
						},
						{
							name: '疑似假证',
							type: 'bar',
							barWidth: 22,
							stack: '广告',
							data: this.ydatas[4]
						},
						{
							name: '一证多用',
							type: 'bar',
							barWidth: 22,
							stack: '广告',
							data: this.ydatas[5]
						},

					]
				};
				this.myChart.setOption(option);
			}
		},
		beforeDestroy () {
			this.myChart.clear()
		},
		mounted() {
			this.init();
		},
		props: {
			areaContrasts: {
				type: Array,
				default: []
			}
		},
		watch: {
			areaContrasts(a, b) {
				this.getData(a);
			},
			$route(to, from) {
				this.selected = {
					'许可证未公示': true,
					'证件模糊': false,
					'证件过期': false,
					'超范围经营': false,
					'疑似假证': false,
					'一证多用': false
				}
			}
		}
	}
</script>

<style lang="scss">
	#areaContrasts {
		.t,
		.b {
			width: 100%;
		}
		.t {
			height: 45%;
		}
		.b {
			height: 55%;
			>div {
				position: relative;
				width: 100%;
				height: 12.5%;
				padding: 0 20px 0 60px;
				&:nth-child(odd) {
					background: #F6F6F6;
				}
				>div {
					position: relative;
					float: left;
					height: 100%;
					>span {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						color: #666;
					}
				}
				.ille-title {
					position: absolute;
					left: 0;
					top: 0;
					width: 80px;
					height: 100%;
					padding-top: 6px;
					>span {
						position: absolute;
						left: 20px;
						top: 50%;
						transform: translate(0, -50%);
					}
				}
			}
		}
	}
</style>