<template>
	<div id="exportTem">
		<div class="title">监管分析报表</div>
		<div class="lists">
			<div class="exportBox" @click="dataExport">
				<div>
					<img :src="require('./images/export.png')" alt="" /> <br /> 生成报表
				</div>
			</div>
			<el-popover v-model="popa" popper-class="szl-export-pop" placement="bottom" width="550" trigger="click">
				<div class="pop-lists">
					<div class="pop-list" v-for="(item,index) in lists" :class="{'active':index==popanum}" :key="index" @click="popaChange(index)">{{item}}</div>
				</div>
				<div class="list" slot="reference">
					{{lists[popanum]}}
					<img :class="{'img-rotate': popa}" :src="require('./images/arr.png')" alt="" />
				</div>
			</el-popover>

			<el-popover v-model="popb" popper-class="szl-export-pop" placement="bottom" width="550" trigger="click">
				<div class="pop-lists" v-if="show">
					<div class="pop-lists-left" :class="{'pop-lists-lefta':popanum==2}">
						<div v-for="(item,index) in years" :key="index" class="pop-list" :class="{'active':index==popbnum,'list-disable':!timeDatas[index].data.allYear[0].mark}" @click="yearChange(index)">
							{{item}}
						</div>
					</div>
					<div class="pop-lists-right" v-show="popanum==0">
						<div class="pop-lists-mons">
							<div v-for="(item,index) in months" :class="{'active':index==timenum,'list-disable':!timeDatas[popbnum].data.month[index].mark}" :key="index" v-if="index<6" @click="timeChange(index)">{{item}}</div>
						</div>
						<div class="pop-lists-mons pop-lists-monsa">
							<div v-for="(item,index) in months" :key="index" :class="{'active':index==timenum,'list-disable':!timeDatas[popbnum].data.month[index].mark}" v-if="index>5" @click="timeChange(index)">{{item}}</div>
						</div>
					</div>
					<div class="pop-lists-right" v-show="popanum==1">
						<div class="pop-lists-quarters" v-for="(item,index) in quarters" :class="{'active':index==timenum,'list-disable':!timeDatas[popbnum].data.season[index].mark}" :key="index" @click="timeChange(index)">{{item}}</div>
					</div>
				</div>
				<div class="list" slot="reference">
					<span v-show="popanum==0">
						{{years[popbnum]}}{{months[timenum]}}
					</span>
					<span v-show="popanum==1">
						{{years[popbnum]}}{{quarters[timenum]}}
					</span>
					<span v-show="popanum==2">
						{{years[popbnum]}}
					</span>
					<img :class="{'img-rotate': popb}" :src="require('./images/arr.png')" alt="" />
				</div>
			</el-popover>
		</div>
	</div>
</template>

<script>
	import http from '@/unit/http'
	import apis from '@/unit/apis'
	const {
		UREPORT_PREVIEW,
		FOOD_DATE
	} = apis
	export default {
		data() {
			return {
				lists: ["月度", "季度", "年度"],
				popa: false,
				popanum: -1,
				popb: false,
				popbnum: 0,
				timenum: 0,
				years: [],
				months: [],
				quarters: ["1季度", "2季度", "3季度", "4季度"],
				timeDatas: [],
				show: false
			}
		},
		methods: {
			popaChange(e, b) {
				if(this.popanum != e || b) {
					for(let i = 0, n = this.timeDatas.length; i < n; i++) {
						if(this.timeDatas[i].data.allYear[0].mark) {

							if(e == 0) {
								let newMonths = [...this.timeDatas[i].data.month].reverse();
								for(let a = 0; a < 12; a++) {
									if(newMonths[a].mark) {
										this.timenum = 11 - a;
										break;
									}
								}
							} else if(e == 1) {
								let newMonths = [...this.timeDatas[i].data.season].reverse();
								for(let a = 0; a < 4; a++) {
									if(newMonths[a].mark) {
										this.timenum = 3 - a;
										break;
									}
								}
							}
							this.popbnum = i;
							break;
						}
					}
					this.popanum = e;
				}
				this.popa = false;
			},
			yearChange(e) {
				if(!this.timeDatas[e].data.allYear[0].mark) {
					return false
				}
				if(this.popbnum != e) {
					this.popbnum = e;
					if(this.popanum == 2) {
						this.popb = false;
					} else {
						if(this.popanum == 0) {
							let newMonths = [...this.timeDatas[e].data.month].reverse();
							for(let a = 0; a < 12; a++) {
								if(newMonths[a].mark) {
									this.timenum = 11 - a;
									break;
								}
							}
						} else if(this.popanum == 1) {
							let newMonths = [...this.timeDatas[e].data.season].reverse();
							for(let a = 0; a < 4; a++) {
								if(newMonths[a].mark) {
									this.timenum = 3 - a;
									break;
								}
							}
						}
					}
				}
			},
			timeChange(e) {
				if(this.popanum == 0 && !this.timeDatas[this.popbnum].data.month[e].mark) {
					return false
				}
				if(this.popanum == 1 && !this.timeDatas[this.popbnum].data.season[e].mark) {
					return false
				}
				this.timenum = e;
				this.popb = false;
			},
			async getYears() {
				let res = await http.get(FOOD_DATE);
				if(res) {
					res.data.forEach(item => {
						this.years.push(item.years + "年");
					});
					this.timeDatas = [...res.data];
					this.popaChange(0, true);
					this.show = true;
				}
			},
			getMonths() {
				for(let i = 1; i < 13; i++) {
					let m = i > 9 ? i + "月" : "0" + i + "月"
					this.months.push(m)
				}
			},
			init() {
				this.getYears();
				this.getMonths();
			},
			dataExport() {
				const baseUrl = process.env.NODE_ENV == 'development' ? '/apis' : ''
				let dateType, dateValue;
				if(this.popanum == 0) {
					dateType = 3;
					dateValue = this.years[this.popbnum] + this.months[this.timenum];
				} else if(this.popanum == 1) {
					dateType = 2;
					dateValue = this.years[this.popbnum] + this.quarters[this.timenum];
				} else {
					dateType = 1;
					dateValue = this.years[this.popbnum]
				}
				let url = baseUrl + UREPORT_PREVIEW + "&dateType=" + dateType + "&dateValue=" + dateValue + "&_n=" + dateValue + "福建省食品（农产品）监管分析报告&_title=" + dateValue + "福建省食品（农产品）监管分析报告"
				window.open(encodeURI(url))
			}
		},
		created() {
			this.init();
		}
	}
</script>

<style lang="scss">
	#exportTem {
		display: inline-block;
		width: 700px;
		.title {
			font-size: 26px;
			color: #fff;
			padding-right: 150px;
		}
		.lists {
			position: relative;
			width: 100%;
			padding-right: 150px;
			margin-top: 30px;
			overflow: hidden;
			.list {
				position: relative;
				width: 100%;
				height: 46px;
				line-height: 46px;
				padding-left: 20px;
				text-align: left;
				background: #0A308C;
				color: #E1E9FF;
				font-size: 18px;
				border: 1px solid #276ADF;
				cursor: pointer;
				margin-bottom: 20px;
				span {
					color: #E1E9FF;
					font-size: 18px;
				}
				img {
					position: absolute;
					right: 10px;
					top: 18px;
					transition: all .3s;
					transform: rotate(-90deg);
				}
				.img-rotate {
					transform: rotate(0deg);
				}
			}
			.exportBox {
				position: absolute;
				width: 130px;
				top: 0;
				right: 0;
				bottom: 20px;
				background: #007DF0;
				cursor: pointer;
				>div {
					position: absolute;
					width: 100%;
					text-align: center;
					left: 0;
					top: 50%;
					color: #fff;
					font-size: 20px;
					transform: translate(0, -50%);
					img {
						width: 50px;
						margin-left: 10px;
					}
				}
			}
		}
	}
	
	.szl-export-pop.el-popper {
		margin-top: 1px !important;
		border-radius: 2px;
		background: #0A308C;
		padding: 0;
		border: none;
	}
	
	.szl-export-pop.el-popper {
		.popper__arrow {
			display: none;
		}
		.pop-lists {
			width: 100%;
			.pop-lists-left,
			.pop-lists-right {
				float: left;
				width: 275px;
				height: 275px;
			}
			.pop-lists-left {
				border-right: 3px solid #05277E;
				overflow-y: auto;
			}
			.pop-lists-lefta {
				width: 100%;
				border: none;
			}
			.pop-lists-right {
				.pop-lists-mons {
					float: left;
					width: 50%;
					height: 100%;
					>div {
						width: 100%;
						height: 16.6%;
						line-height: 45.8px;
						text-align: center;
						font-size: 18px;
						color: #8FBDDD;
						border-bottom: 3px solid #05277E;
						border-right: 3px solid #05277E;
						cursor: pointer;
						&:last-child {
							border-bottom: none;
						}
					}
					&:last-child {
						.pop-lists-mons {
							border-right: none;
						}
					}
				}
				.pop-lists-monsa {
					>div {
						border-right: none;
					}
				}
				.pop-lists-quarters {
					float: left;
					width: 50%;
					height: 50%;
					line-height: 137.5px;
					text-align: center;
					font-size: 18px;
					color: #8FBDDD;
					border-bottom: 3px solid #05277E;
					border-right: 3px solid #05277E;
					cursor: pointer;
					&:nth-child(even) {
						border-right: none;
					}
					&:nth-child(3),
					&:nth-child(4) {
						border-bottom: none;
					}
				}
				.pop-lists-halfyears {
					width: 100%;
					height: 50%;
					line-height: 137.5px;
					text-align: center;
					font-size: 18px;
					color: #8FBDDD;
					border-bottom: 3px solid #05277E;
					cursor: pointer;
					&:last-child {
						border-bottom: none;
					}
				}
			}
			.pop-list {
				width: 100%;
				height: 46px;
				line-height: 46px;
				text-align: center;
				border-bottom: 3px solid #05277E;
				color: #8FBDDD;
				font-size: 18px;
				cursor: pointer;
				transition: all .3s;
				background: #0A308C;
				&:last-child {
					border: none;
				}
			}
			.active {
				background: #007DF0;
				color: #fff;
			}
			.list-disable {
				background: #7E8E98;
				color: #87b3d1;
				cursor: not-allowed !important;
			}
		}
	}
</style>