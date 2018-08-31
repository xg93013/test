<template>
	<div id="side">
		<router-link v-for="(item,index) in links" @mouseover.native = "mouseHover(item,1)" @mouseout.native = "mouseHover(item)"  :key="index" :to="{path: item.path}" :style='{backgroundImage:path.includes(item.path)?"url("+require("./images/"+item.path+"a.png")+")":"url("+require("./images/"+item.path+".png")+")"}'></router-link>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				links:[{
					path: "adverseWarning"
				},{
					path: "specialWarning"
				},{
					path: "rearchWarning"
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