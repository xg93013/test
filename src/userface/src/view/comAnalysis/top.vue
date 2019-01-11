<template>
	<el-row id="homeTop">
		<el-col :span="8" style="padding-right:13px">
			<div class="nav total">
				<div>
					<div>
						<span>总监测商家（个）</span> <br />
						<span>{{topData.total.toFixed(0)}}</span>
					</div>
					<div>
						<img src="../../images/a.gif" alt="" />
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="8" style="padding: 0 7px">
			<div class="nav against">
				<div>
					<div>
						<span>违规商家（个）</span> <br />
						<span>{{topData.illegal.toFixed(0)}}</span>
					</div>
					<div>
						<img src="../../images/c.gif" alt="" />
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="8" style="padding-left:13px">
			<div class="nav percent">
				<div>
					<div>
						<span>违规率</span> <br />
						<span>{{topData.illRate==100?100:topData.illRate.toFixed(2)}}%</span>
					</div>
					<div>
						<img src="../../images/b.gif" alt="" />
					</div>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	import { TweenMax } from "gsap"
	export default {
		data() {
			return {
				topData: {
					total: 0,
					illegal: 0,
					illRate: 0
				},
			};
		},
		methods: {
			getDatas(res) {
				TweenLite.to(this.topData, 0.5, {
					...res
				});
			},
		},
		props:{
			top: {
				type: Object,
				default:{
					
				}
			}
		},
		watch:{
			top(a,b){
				this.getDatas(a)
			}
		}
	};
</script>

<style lang="scss">
	#homeTop {
		position: absolute;
		overflow: hidden;
		left: 20px;
		right: 20px;
		top: 20px;
		.nav {
			width: 100%;
			height: 140px;
			>div {
				position: relative;
				background: rgba(250, 250, 250, .1);
				width: 100%;
				height: 120px;
				>div:first-child {
					position: absolute;
					left: 60px;
					top: 50%;
					transform: translate(0, -50%);
					line-height: 40px;
					span {
						color: #fff;
						font-size: 20px;
						&:last-child {
							font-weight: bold;
							font-size: 48px;
						}
					}
				}
				>div:last-child {
					position: absolute;
					width: 161px;
					height: 90px;
					right: 20px;
					bottom: 0;
					/*transform: rotate(180deg);*/
					
					>img{
						position: absolute;
						width: 100%;
						left: 0;
						bottom: 0;
					}
				}
			}
		}
		.total {
			background: #308D1C;
		}
		.percent {
			background: #5B35A4;
		}
		.against {
			background: #CB4512;
		}
	}
</style>