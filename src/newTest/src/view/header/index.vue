<template>
	<div id="header">
		<div class="left" id="headerLeft" @click.self="imgRotate?imgRotate=false:imgRotate=true">
			<img class="logo-img" @click.self="imgRotate?imgRotate=false:imgRotate=true" :src="require('./images/head.png')" alt="" />药品领域预警分析
			<img class="arr-img" @click.self="imgRotate?imgRotate=false:imgRotate=true" :class="{'arr-img-rotate': imgRotate}" :src="require('./images/arrow.png')" alt="" />
			<div class="pops" v-show="imgRotate">
				<div class="pop pop-arr">
					<img class="logo-img" :src="require('./images/bigdata.png')" alt="" /> 大数据关联分析
					<div class="pop-child">
						<!-- <div>企业全息档案</div> -->
						<div>食品（农产品）监管分析</div>
						<div>医药卫生监管分析</div>
					</div>
				</div>
				<div class="pop pop-arr">
					<img class="logo-img" :src="require('./images/risk.png')" alt="" /> 风险预警分析
					<div class="pop-child">
						<!-- <div class="pop-arr">
							食品领域预警
							<div class="pop-child">
								<div>问题食品风险预警</div>
								<div>网络舆情风险预警</div>
								<div>食品生产与销售风险预警</div>
								<div>网络餐饮风险地图</div>
							</div>
						</div> -->
						<div>药品领域预警</div>
						<div>风险预警信息发布</div>
					</div>
				</div>

				<div class="pop pop-arr pop-c">
					<img class="logo-img" :src="require('./images/setting.png')" alt="" /> 
					系统管理
					<div class="pop-child">
						<div>人员机构设置</div>
						<div>角色分配</div>
						<div>任务管理</div>
						<div>菜单资源</div>
						<div>公告管理</div>
						<div>参数设置</div>
						<div>权限设置</div>
					</div>
				</div>
			</div>
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
			<div class="r2"></div>
			<div class="r3"></div>
			<div class="r4"></div>
		</div>
	</div>
</template>

<script>
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
				imgRotate: false
			}
		},
		methods: {
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
			domNode(e) {
				if(e.id == "headerLeft") {
					return false;
				}
				if(e.parentNode) {
					this.domNode(e.parentNode)
				} else {
					if(this.imgRotate) {
						this.imgRotate = false;
					}
				}
			}
		},
		mounted() {
			this.getTime();
			document.getElementsByTagName("body")[0].onclick = (e) => {
				this.domNode(e.target)
			}
		}
	}
</script>

<style lang="scss">
	#header {
		z-index: 100;
		position: fixed;
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
			.pops,
			.pop-child {
				position: absolute;
				width: 200px;
				background: #1248A7;
			}
			.pops {
				left: 10px;
				width: 200px;
				top: 67px;
				.pop {
					width: 100%;
					height: 36px;
					line-height: 36px;
					text-align: left;
					padding-left: 10px;
					transition: all .3s;
					&:hover {
						background-color: #0E62C0;
					}
				}
				.pop-arr {
					position: relative;
					background-image: url(images/arrmore.png);
					background-repeat: no-repeat;
					background-position: 180px;
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
					height: 36px;
					line-height: 36px;
					transition: all .3s;
					&:hover {
						background-color: #0E62C0;
					}
				}
			}
		}
		.middle {
			display: inline-block;
			height: 100%;
			padding: 0;
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
			>div {
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
				overflow: hidden;
			}
			.r1 {
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
</style>