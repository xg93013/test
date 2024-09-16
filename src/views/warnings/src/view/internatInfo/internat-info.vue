<template>
	<div class='warn-list'>
		<div class='warn-list-box'>
			<div class='list-title'>国际食品安全预警资讯</div>
			<div class='list-content'>
				<Spin v-show='show' fix>
					<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
					<div>加载中...</div>
				</Spin>
				<ul v-for='itema in datas'>
					<li v-for='item in itema' @click='goPage(item.link)'>
						{{item.title}}
						<span class='time'>{{item.date}}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const {
		NEWS,
		TIMING
	} = apis
	export default {
		data() {
			return {
				show:true,
				datas: []
			}
		},
		methods: {
			async getNews() {
				let res = await http.get(NEWS);
				this.show=false;
				if(res) {
					this.datas=[];
					let data = res.data;
					let num = 5; //5条数据展示一页
					let length = Math.ceil(data.length / num);
					let index = 0;
					for(let i = 0; i < length; i++) {
						if(i < 3) {
							let arr = [];
							for(let i = 0; i < num; i++) {
								if(data[index + i]) {
									arr.push(data[index + i])
								}
							}
							this.datas.push(arr)
							index += num
						}
					}
				}
			},
			goPage(e) {
				window.open(e);
			}
		},
		mounted() {
			this.getNews();
			setInterval(()=>{
				this.getNews();
			},TIMING)
		}
	}
</script>

<style lang='scss' scoped>
	.list-content{
		position: relative;
	}
	.list-content>ul {
		height: 33.3%;
		border-bottom: 2px solid #131A36;
		padding-top: 10px;
		&:last-child {
			border: none;
		}
		li {
			position: relative;
			list-style: none;
			height: 26px;
			line-height: 26px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			padding: 0 150px 0 20px;
			cursor: pointer;
			transition: all .3s;
			&:hover {
				background: #404864;
			}
			span {
				position: absolute;
				height: 100%;
				right: 20px;
				top: 0;
			}
		}
	}
</style>