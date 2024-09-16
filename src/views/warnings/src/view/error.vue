<template>
	<div id='error'>
		<div class='error-box'>
			<div class='error'>
				<img :src='require("../images/image-404.png")' alt='' />
				<span style='font-size:16px;color:#1E9CF9;margin-bottom:6px;'>很遗憾，您访问的页面找不到了...</span> <br />
				<span style='color:#777;font-size:12px;margin-bottom:40px;'>
					建议： 1.检查您的网址拼写是否正确； <br />
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					2.检查您是否使用了错误的网址链接
				</span> <br />
				<span style='color:#777;font-size:12px'>
					<span style='color:#1E9CF9'>{{num}}</span> 秒后跳转到上一页，如果没有跳转，请 <span @click='goPrevPage' style='color:#1E9CF9;text-decoration: underline;cursor:pointer'>点击这里</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				num: 6
			}
		},
		methods: {
			goPrevPage() {
				this.$router.go(-1);
			},
			changeNum(){
				if(this.num>0){
					if(this.num==1){
						this.goPrevPage();
					}
					this.num--;
				}
			}
		},
		mounted(){
			let inter=setInterval(()=>{
				if(this.num>0){
					this.changeNum();
				}else{
					clearInterval(inter);
				}
			},1000);
		}
	}
</script>

<style lang='scss' scoped>
	#error {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		overflow: auto;
		.error-box {
			position: relative;
			width: 100%;
			height: 100%;
			min-width: 1200px;
			min-height: 600px;
			background-color: #E5E7EA;
			background-image: url(../images/BG.png);
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: left bottom;
			.error {
				position: absolute;
				width: 400px;
				text-align: center;
				overflow: hidden;
				left: 50%;
				top: 40%;
				transform: translate(-50%, -50%);
				span {
					display: inline-block;
				}
			}
		}
	}
</style>