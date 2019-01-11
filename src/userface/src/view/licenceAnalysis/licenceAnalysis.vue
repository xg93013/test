<template>
	<div id="licenceAnalysis" :style="isArea?{minHeight:'800px'}:{minHeight:'1200px'}">
		<div class="top">
			{{pathMsg[path].title}}
			<el-select size="mini" @change="timeChange" style="width:140px;margin-left:10px;position:relative;top:-1px;" v-model="value" placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="charts">
			<div class="left">
				<div class="left-top" :style="isArea?{height:'60%'}:{height:'30%'}">
					<illegalRate :illegalRate="illegalRate" />
				</div>
				<div class="left-bottom" :style="isArea?{height:'40%'}:{height:'70%'}">
					<areaContrasts v-if="!isArea" :areaContrasts="areaContrasts" />
					<illegalContrasts v-if="isArea" ref="contrasts" :illegalContrasts="illegalContrasts" />
				</div>
			</div>
			<div class="right">
				<div class="right-top" :style="isArea?{height: 0,paddingBottom: 0}:{height:'30%'}">
					<illegalContrasts v-if="!isArea" ref="contrasts" :illegalContrasts="illegalContrasts" />
				</div>
				<div class="right-bottom" :style="isArea?{height: '100%'}:{height:'70%'}">
					<shopLists ref="shopList" :shopLists="shopLists" :path="pathMsg[path].platform" :downTime="value" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import illegalRate from "./illegalRate.vue" //违规率变化趋势
	import areaContrasts from "./areaContrasts.vue" //违规商家名单
	import illegalContrasts from "./illegalContrasts.vue" //违规类型对比
	import shopLists from "./shopLists.vue" //违规商家数量区域对比
	import http from "@/unit/http"
	import apis from "@/unit/apis"
	const {
		ILLEGAL_RATIO_TREND, //违规率变化趋势
		ILLEGAL_COMPARE, //违规类型对比
		ILLEGAL_ZONE_COMPARE, //违规商家数量区域对比
		ILLEGAL_SHOP_DETAIL, //违规商家列表
		UPDATE_TIME
	} = apis
	export default {
		data() {
			return {
				loading: true,
				options: [],
				value: '',
				timeStamp: 0,
				pathMsg: {
					mt: {
						title: "美团外卖",
						platform: "MEI_TUAN_WM"
					},
					elm: {
						title: "饿了么",
						platform: "ELE_ME_WM"
					},
					bd: {
						title: "饿了么星选",
						platform: "BAIDU_WM"
					}
				},
				path: "",
				isArea: false,
				illegalContrasts: [],
				illegalRate: {},
				areaContrasts: [],
				shopLists: [],
                myInter: null, //轮询,
                cancels:[]
			};
		},
		components: {
			illegalRate,
			areaContrasts,
			illegalContrasts,
			shopLists
		},
		beforeRouteLeave(to, from, next) { //离开页面前先清除轮询
            clearInterval(this.myInter);
            this.cancelAjax("CLOSE_AJAX");
			next();
		},
		methods: {
            cancelAjax(){//关闭ajax请求
                this.cancels.forEach(item=>{
                    item();
                })
            },
			init() {
				this.isArea = this.$store.state.userMsg.regionType == "ZONE" ? true : false;
				this.path = this.$route.name;
				this.getDate();
			},
			getDate() {
				let step = 24; //只能获取最近24个月的数据
				let time = new Date();
				let y = time.getFullYear();
				let m = time.getMonth() + 1;
				this.value = y + "-" + (m > 9 ? m : "0" + m);
				this.timeStamp = Date.parse(y + "-" + (m > 9 ? m : "0" + m));
				this.options.push({
					value: y + "-" + (m > 9 ? m : "0" + m),
					label: y + "年" + (m > 9 ? m : "0" + m) + "月"
				})
				for(let i = 0; i < step; i++) {
					y = m - 1 == 0 ? y - 1 : y;
                    m = m - 1 == 0 ? 12 : m - 1;
                    if(Date.parse("2018-08")<=Date.parse(y + "-" + (m > 9 ? m : "0" + m))){//只显示2018-08月以后的数据
                        this.options.push({
						    value: y + "-" + (m > 9 ? m : "0" + m),
						    label: y + "年" + (m > 9 ? m : "0" + m) + "月"
					    })
                    }
				}

				this.getData();
			},
			setDate() {
				let time = new Date();
				let y = time.getFullYear();
				let m = time.getMonth() + 1;
				this.value = y + "-" + (m > 9 ? m : "0" + m)
			},
			async getData() {
                this.cancels = [];
				let [illegalRatioTrend, illegalCompare, illegalZoneCompare, illegalShopDetail] = await Promise.all([
					http.get(ILLEGAL_RATIO_TREND + this.pathMsg[this.path].platform + "/" + this.value,{},this.cancels),
					http.get(ILLEGAL_COMPARE + this.pathMsg[this.path].platform + "/" + this.value,{},this.cancels),
					http.get(ILLEGAL_ZONE_COMPARE + this.pathMsg[this.path].platform + "/" + this.value,{},this.cancels),
					http.get(ILLEGAL_SHOP_DETAIL + this.pathMsg[this.path].platform + "/" + this.value,{},this.cancels)
				])
				if(illegalRatioTrend) {
					this.illegalRate = { ...illegalRatioTrend.result
					};
				}
				if(illegalCompare) {
					this.illegalContrasts = [...illegalCompare.result];
				}
				if(illegalZoneCompare) {
					this.areaContrasts = [...illegalZoneCompare.result];
				}
				if(illegalShopDetail) {
					this.shopLists = [...illegalShopDetail.result];
				}
				if(this.$store.state.loading) {
					this.$store.commit("changeLoading", false)
				}
			},
			timeChange() {
				this.$store.commit("changeLoading", true);
				clearInterval(this.myInter)
				this.getData();
				this.$refs.contrasts.resetNum();
				this.$refs.shopList.resetData();
				if(Date.parse(this.value) == this.timeStamp) {
					this.setMyIntera();
				} else {
					this.setMyInterb();
				}
			},
			setMyIntera() {
				this.myInter = setInterval(() => {
					this.$nextTick(() => {
						this.getData()
					})
				}, UPDATE_TIME)
			},
			setMyInterb() { //控制违规类型对比轮播展示
				this.myInter = setInterval(() => {
					this.illegalContrasts = [...this.illegalContrasts]
				}, UPDATE_TIME)
			}
		},
		created() {
			this.init();
		},
		mounted() {
			this.setMyIntera();
		},
		watch: {
			$route(to, from) {
				clearInterval(this.myInter);
				this.$refs.contrasts.resetNum();
				this.$refs.shopList.resetData();
				this.path = to.name;
				this.setDate();
				this.$nextTick(() => {
					this.getData();
					this.setMyIntera();
				})
			}
		}
	};
</script>
<style lang="scss">
	#content #licenceAnalysis {
		padding-top: 60px;
		.top {
			position: absolute;
			height: 30px;
			left: 20px;
			top: 20px;
			right: 20px;
			color: #666;
			font-size: 18px;
		}
		.charts {
			width: 100%;
			height: 100%;
			.left,
			.right {
				float: left;
				height: 100%;
			}
			.left {
				width: 75%;
				padding-right: 20px;
				.left-top,
				.left-bottom {
					width: 100%;
					>div {
						width: 100%;
						height: 100%;
						background: #fff;
					}
				}
				.left-top {
					padding-bottom: 20px;
				}
			}
			.right {
				width: 25%;
				.right-top,
				.right-bottom {
					width: 100%;
					>div {
						width: 100%;
						height: 100%;
						background: #fff;
					}
				}
				.right-top {
					padding-bottom: 20px;
				}
			}
		}
		.left-top,
		.left-bottom,
		.right-top,
		.right-bottom {
			>div {
				position: relative;
				padding-top: 50px;
				.title {
					position: absolute;
					width: 100%;
					height: 50px;
					left: 0;
					top: 0;
					padding-left: 20px;
					font-size: 18px;
					line-height: 50px;
					border-bottom: 1px solid #e6e6e6;
				}
				.charts {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>