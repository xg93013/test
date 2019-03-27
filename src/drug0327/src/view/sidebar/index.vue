<template>
	<div id="side">
		<el-tooltip v-for="(item,index) in links" class="item" effect="dark" :content="item.name" placement="right-start" :key="index">
			<div>
				<router-link @mouseover.native = "mouseHover(item,1)" @mouseout.native = "mouseHover(item)" :to="{path: item.path}" :style='{backgroundImage:path.includes(item.path)?"url("+require("./images/"+item.path+"a.png")+")":"url("+require("./images/"+item.path+".png")+")"}'></router-link>
			</div>
		</el-tooltip>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				links:[{
					path: "adverseWarning",
					name: "不良反应预警分析"
				},{
					path: "specialWarning",
					name: "特殊药品预警分析"
				},{
					path: "rearchWarning",
					name: "药物研发预警分析"
				},{
					path: "drugHistory",
					name: "药品追溯展示分析"
				}],
				path: []
			}
		},
		methods:{
			mouseHover(e,b){
				if(!this.path.includes(e.path)||this.path.length>1){
					if(b){
						this.path.push(e.path)
					}else{
						this.path.pop()
					}
				}
			},
			
		},
		created(){
			this.path = [this.$route.name];
		},
		watch:{
			$route(to, from) {
				this.path = [to.name];
			}
		}
	}
</script>

<style lang="scss">
	#side{
		position: fixed;
		left: 0;
		top: 66px;
		bottom: 0;
		width: 48px;
		background: #02267C;
		
		a{
			width: 48px;
			height: 50px;
			display: block;
			background-repeat: no-repeat;
			background-position: center;
			background-color: #02267C;
			margin-bottom: 10px;
			transition: background-color .3s;
			
			&:first-child{
				margin-top: 24px;
			}
			
			&:hover{
				background-color: #0099FF;
			}
		}
		
		.router-link-active{
			background-color: #0099FF;
		}
	}
</style>