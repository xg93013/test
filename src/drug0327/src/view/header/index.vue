<template>
	<div id="header">
		<div class="left" id="headerLeft">
			<el-popover popper-class="left-pop" v-model="imgRotate">
				<div class="pops">
					<div class="pop pop-arr" v-for="(item,index) in systemDatas.resources" :key="index" @click="goPage(item)">
						<img class="logo-img" :src="item.iconPath?require('./images/'+getIcon(item.iconPath)+'.png'):''" alt="" /> {{item.resName}}
						<sideLists v-if="item.children" @goPage="goPage" :lists="item.children" />
					</div>
				</div>
				<div class="list" slot="reference">
					<img class="logo-img" @click.self="imgRotate?imgRotate=false:imgRotate=true" :src="require('./images/head.png')" alt="" /> {{systemDatas.resName}}
					<img class="arr-img" @click.self="imgRotate?imgRotate=false:imgRotate=true" :class="{'arr-img-rotate': imgRotate}" :src="require('./images/arrow.png')" alt="" />
				</div>
			</el-popover>
		</div>
		<div class="middle">
			<img :src="require('./images/text.png')" alt="" />
			<div>
				<span>{{y}} {{m}} {{d}}  星期{{week}}</span> <br />
				<span>
					<span>{{h}}</span>
				<span>:</span>
				<span>{{min}}</span>
				<span>:</span>
				<span>{{s}}</span>
				</span>
			</div>
		</div>
		<div class="right">
			<a class="r3" :href="homeUrl"></a>
			<a class="r4" @click="loginOut"></a>
		</div>
	</div>
</template>

<script>
	import http from '@/unit/http'
	import apis from '@/unit/apis'
	const {
		ENTERPRISE_SEARCH,
		SYSTEM_POWER,
		OIDC_LOGOUT,
		HOME_PAGE
	} = apis
	export default {
		data() {
			return {
				y: "",
				m: "",
				d: "",
				week: "",
				h: "",
				min: "",
				s: "",
				imgRotate: false,
				path: "home",
				searchWord: "",
				searchLists: [],
				systemDatas: {},
				homeUrl: ""
			}
		},
		components: {
			sideLists: {
				name: "sideLists",
				props: ["lists"],
				methods: {
					goPage(e) {
						if(e.children&&e.children.length) {
							return false
						}
						this.$emit("goPage", e)
					}
				},
				template: `<div class="pop-child">
								<div :class="{'pop-arr': item.children}" v-for="(item,index) in lists" :key="index" @click="goPage(item)">
									{{item.resName}}
									<sideLists @goPage="goPage" v-if="item.children" :lists="item.children" />
								</div>
						  </div>`
			}
		},
		methods: {
			getIcon(e) {
				return e.replace(/\s+/g, "")
			},
			async getSystem() {
				let res = await http.get(SYSTEM_POWER);
				if(res) {
					this.systemDatas = { ...res.data
					}
				}
			},
			async getHomeUrl(){
				let res = await http.get(HOME_PAGE);
				if(res){
					this.homeUrl = res.data;
				}
			},
			getTime() {
				let time = new Date();
				this.y = time.getFullYear();
				this.m = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
				this.d = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
				this.h = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
				this.min = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
				this.s = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
				switch(time.getDay()) {
					case 0:
						this.week = "日";
						break;
					case 1:
						this.week = "一";
						break;
					case 2:
						this.week = "二";
						break;
					case 3:
						this.week = "三";
						break;
					case 4:
						this.week = "四";
						break;
					case 5:
						this.week = "五";
						break;
					case 6:
						this.week = "六";
						break;
					default:
						break;
				}

				setTimeout(() => {
					this.getTime();
				}, 1000)
			},
			goPage(e) {
				if(e.children&&e.children.length) {
					return false
				}
				this.imgRotate = false;
				if((e.resId != this.systemDatas.resId)&&e.resUrl) {
					window.open(e.resUrl);
				}
			},
			async loginOut() {
				let res = await http.get(OIDC_LOGOUT);
				if(res) {
					window.location.replace(res.data);
				}
			}
		},
		mounted() {
			this.getTime();
			this.getSystem();
			this.getHomeUrl();
		},
		watch: {
			$route(to, from) {
				this.path = to.name
			}
		}
	}
</script>

<style lang="scss">
	#header {
		z-index: 100;
		position: relative;
		left: 0;
		right: 0;
		top: 0;
		height: 80px;
		color: #fff;
		min-width: 1000px;
		text-align: center;
		background: url(./images/headbg.png) no-repeat center;
		* {
			color: #fff;
			font-size: 14px;
			font-family: 'microsoft yahei';
		}
		.left {
			position: absolute;
			left: 0;
			top: 0;
			height: 70px;
			padding-left: 20px;
			line-height: 70px;
			font-size: 16px;
			cursor: pointer;
			.logo-img {
				position: relative;
				vertical-align: middle;
				height: 20px;
				top: -2px;
				margin-right: 6px;
			}
			.arr-img {
				vertical-align: middle;
				transition: all .3s;
				opacity: .5;
				transform: rotate(90deg);
				margin-left: 6px;
			}
			.arr-img-rotate {
				transform: rotate(0);
			}
		}
		.middle {
			display: inline-block;
			height: 100%;
			padding: 0;
			margin: 0 auto;
			>img {
				margin-top: 19px;
				margin-right: 10px;
			}
			>div {
				display: inline-block;
				margin-top: 17px;
				vertical-align: top;
				line-height: 20px;
				padding-left: 10px;
				border-left: 1px solid rgba(255, 255, 255, 0.1);
				>span:last-child {
					span {
						font-size: 18px;
						margin-right: 7px;
					}
				}
			}
		}
		.right {
			position: absolute;
			right: 0;
			top: 0;
			height: 70px;
			padding: 0;
			>div,
			>a {
				width: 36px;
				height: 36px;
				margin-right: 20px;
				margin-top: 17px;
				float: left;
				border-radius: 50%;
				background-color: rgba(240, 247, 255, .1);
				background-repeat: no-repeat;
				background-position: center;
				cursor: pointer;
			}
			.r1 {
				position: relative;
				background-image: url(images/search.png);
			}
			.r1:hover {
				background-position: 1px 1px;
				background-image: url(images/searcha.png);
			}
			.r2 {
				background-image: url(images/settings.png);
			}
			.r2:hover {
				background-image: url(images/settingsa.png);
			}
			.r3 {
				background-image: url(images/home.png);
			}
			.r3:hover {
				background-image: url(images/homea.png);
			}
			.r4 {
				background-image: url(images/exit.png);
			}
			.r4:hover {
				background-position: 0 0;
				background-image: url(images/exita.png);
			}
		}
	}
	
	.left-pop.el-popper {
		margin-top: -3px !important;
		border-radius: 2px;
		padding: 0;
		border: none;
		background: #1248A7;
		* {
			color: #D7E9FF;
		}
	}
	
	.left-pop.el-popper {
		.popper__arrow {
			display: none;
		}
		.pop-child {
			position: absolute;
			width: 200px;
			background: #1248A7;
		}
		.pops {
			width: 200px;
			.pop {
				width: 100%;
				height: 40px;
				line-height: 40px;
				text-align: left;
				padding-left: 10px;
				transition: all .3s;
				&:hover {
					background-color: #0E62C0;
				}
				>img {
					position: relative;
					width: 24px;
					height: 24px;
					top: 7px;
				}
			}
			.pop-arr {
				position: relative;
				background-image: url(images/arrmore.png);
				background-repeat: no-repeat;
				background-position: 180px;
				cursor: default !important;
			}
			.pop-arr {
				&:hover {
					>.pop-child {
						display: block;
					}
				}
			}
		}
		.pop-child {
			display: none;
			left: 200px;
			top: 0;
			>div {
				padding-left: 20px;
				height: 40px;
				line-height: 40px;
				transition: all .3s;
				cursor: pointer;
				&:hover {
					background-color: #0E62C0;
				}
			}
		}
	}
</style>