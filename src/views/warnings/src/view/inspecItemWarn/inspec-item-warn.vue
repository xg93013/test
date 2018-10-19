<template>
	<div class='warn-list'>
		<div class='warn-list-box'>
			<div class='list-title'>检验项目风险预警</div>
			<div class='list-content list-warn'>
				<div style='position:relative'>
					<div>检出不合格原因占比</div>
					<percentMap @closeShowPercent="closeShowPercent" />
					<Spin v-show='showPercnet' fix>
						<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
						<div>加载中...</div>
					</Spin>
				</div>
				<div>
					<div>
						<div style="position:relative">
							高危检验项预警
							<div class="circle" v-if="dataList.length">
								<span :class="{'active-circle': index==i}" v-for="(item,i) in dataList" @click="circleClick(i)"></span>
							</div>
						</div>
						<div class='warn-detail is-warn' v-if='success==1' @mouseenter="mouseEnter" @mouseleave="mouseLeave">
							<Tooltip :content="datas.ypMc" placement="top-end">
								食品名称:{{datas.ypMc}}
							</Tooltip><br />
							<Tooltip :content="datas.jyXm" placement="top-end">
								不合格项目:{{datas.jyXm}}
							</Tooltip><br />
							<Tooltip :content="datas.jcz+'||'+datas.bzz" placement="top-end">
								检测值||标准值:{{datas.jcz}}||{{datas.bzz}}
							</Tooltip><br />
							<Tooltip :content="datas.qyMc" placement="top-end">
								被抽样单位:{{datas.qyMc}}
							</Tooltip><br />
							<Tooltip style='margin-top:-4px' :content="datas.sczMc" placement="top-end">
								生产企业:{{datas.sczMc}}
							</Tooltip>
							<div style="text-align:right">
								<span style="cursor:pointer" @click="goDetails">详情>></span>
							</div>
						</div>
						<div class='warn-detail no-warn' v-if='success==0'>
							<span>{{day
                                <10? "0"+day:day}}</span> <br />
							<span>连续{{day}}天未出现高危检验项预警</span>
						</div>
					</div>
					<div style='position: relative'>
						<div>检验项目检出次数TOP10预警</div>
						<topTenMap @closeTenPercent='closeTenPercent' />
						<Spin v-show='tenPercnet' fix>
							<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
							<div>加载中...</div>
						</Spin>
					</div>
				</div>
			</div>
		</div>
		<warnDetails ref="warnDetails" />
	</div>
</template>

<script>
	import percentMap from "./percent-map.vue";
	import topTenMap from "./top-ten-map.vue";
	import warnDetails from './warn-details.vue'
	import http from "../../unit/http";
	import apis from "../../unit/apis";
	const {
		I_HIGHRISK,
		TIMING
	} = apis;
	export default {
		data() {
			return {
				showPercnet: true,
				tenPercnet: true,
				success: -1,
				day: 0,
				datas: {},
				dataList: [],
				index: 0,
				riskInter: null
			};
		},
		components: {
			percentMap,
			topTenMap,
			warnDetails
		},
		methods: {
			goDetails() {
				this.$refs.warnDetails.modalShow(this.datas);
			},
			async getHighrisk() {
				if(this.dataList.length > 1&&this.riskInter) {
					clearInterval(this.riskInter);
				}
				let res = await http.get(I_HIGHRISK);
				if(res) {
					if(res.data.aqTs > 0) {
						this.day = res.data.aqTs;
						this.success = 0;
					} else {
						this.dataList = res.data.dataList;
						this.datas = res.data.dataList[0];
						this.success = 1;
						if(this.dataList.length > 1) {
							this.riskInter = setInterval(() => {
								this.setInterHisk()
							}, 4000)
						}
					}
				}
			},
			closeShowPercent() {
				this.showPercnet = false;
			},
			closeTenPercent() {
				this.tenPercnet = false;
			},
			circleClick(e) {
				clearInterval(this.riskInter);
				this.index = e;
				this.datas = this.dataList[e];
				this.$nextTick(() => {
					this.riskInter = setInterval(() => {
						this.setInterHisk()
					}, 4000)
				})
			},
			setInterHisk() {
				if(this.index < (this.dataList.length - 1)) {
					this.index++
				} else {
					this.index = 0
				}
				this.datas = this.dataList[this.index];
			},
			mouseEnter() {
				if(this.dataList.length > 1) {
					clearInterval(this.riskInter);
				}
			},
			mouseLeave() {
				if(this.dataList.length > 1) {
					this.riskInter = setInterval(() => {
						this.setInterHisk()
					}, 5000)
				}
			}
		},
		mounted() {
			this.getHighrisk();
			setInterval(() => {
				this.getHighrisk();
			}, TIMING);
		}
	};
</script>

<style lang='scss'>
	.list-warn>div {
		float: left;
		height: 100%;
		&:first-child {
			padding: 10px 20px;
			width: 46%;
			border-right: 2px solid #131a36;
		}
		&:last-child {
			width: 54%;
			&>div:first-child {
				padding: 10px 20px;
				height: 160px;
				border-bottom: 2px solid #131a36;
			}
			&>div:last-child {
				padding: 10px 20px;
				height: 290px;
			}
		}
		.warn-detail {
			position: relative;
			height: 120px;
			padding-left: 70px;
			padding-top: 4px;
			font-size: 12px;
			background-repeat: no-repeat;
			background-position: 0 28px;
			.ivu-tooltip {
				height: 15px;
				.ivu-tooltip-rel {
					max-width: 100%;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
		.is-warn {
			background-image: url(../../images/warn.png);
		}
		.no-warn {
			background-image: url(../../images/success.png);
			span {
				display: inline-block;
				&:first-child {
					color: #1bd85d;
					font-size: 40px;
					margin-top: 10px;
				}
				&:last-child {
					font-size: 14px;
				}
			}
		}
		.circle {
			position: absolute;
			right: 0;
			top: 0;
			span {
				display: inline-block;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background: #fff;
				margin-left: 4px;
				transition: all .3s;
				cursor: pointer;
			}
			.active-circle {
				background: #0968DF;
			}
		}
	}
</style>