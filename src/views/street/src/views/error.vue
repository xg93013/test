<template>
	<div id="error">
		<div class="error">
			<div style="font-size:24px;margin-bottom:10px;">抱歉，禁止访问您要的页面……</div>
			<div>
				非常的抱歉，您访问的页面被禁止了。最可能的原因是：
				<ul>
					<li>1、地址栏的地址可能是错误的。</li>
					<li>2、您没有权限访问该页面。</li>
					<li>3、您的点击链接存在错误，请联系管理员解决。</li>
				</ul>
				<div style="font-size:24px;margin:10px 0;">请点击下面链接返回登录页或者继续浏览上一页面：</div>
				<ul>
					<li>
						<a title="返回网站首页" href="/">返回登录页</a>
					</li>
					<li>
						<a title="返回上一个页面" href="javascript:history.back(-1)">返回上一页</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "error",
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	#error {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		min-width: 1200px;
		background: #2d8cf0;
		background: -ms-linear-gradient(top, #2d8cf0, #f6f6f8);
		background: gradient(linear, 0% 0%, 0% 100%, from(#2d8cf0), to(#f6f6f8));
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#2d8cf0), to(#f6f6f8));
		background: -moz-gradient(linear, 0% 0%, 0% 100%, from(#2d8cf0), to(#f6f6f8));
	}

	#error * {
		color: #fff;
		font-size: 18px;
	}
	#error ul *{
		font-size: 16px;
	}
	.error{
		position: absolute;
		display: inline-block;
		left: 50%;
		top: 40%;
		transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
	}
	a{
		color: #036476 !important;
	}
	a:hover{
		text-decoration: underline;
	}
</style>
