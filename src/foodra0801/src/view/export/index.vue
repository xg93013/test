<template>
	<div id="export">
		<div class="box"> 
			<exportTem /> <br />
			<div class="txt">
				备注： <br />
				1.本报告为医药卫生的监管分析报告；<br />
				2.本报告数据来源有省卫计委居民健康档案数据、省食药监局药品认证审评数据、药品追溯监管数据、药品不良事件报告数据；<br />
				3.数据分析输出结果颗粒度将根据现有数据字段情况不断完善。
			</div>
		</div>
	</div>
</template>

<script>
	import exportTem from '@/components/exportTem'
	export default{
		data(){
			return {
				
			}
		},
		components:{
			exportTem
		}
	}
</script>

<style lang="scss">
	#export{
		height: 100%;
		.box{
			width: 100%;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translate(0,-50%);
			text-align: center;
		}
		.txt{
			display: inline-block;
			color: #87B3D1;
			line-height: 28px;
			text-align: left;
			width: 800px;
			margin-top: 40px;
		}
	}
</style>