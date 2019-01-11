<template>
	<div id="shopLists">
		<div class="title">
			违规商家名单
			<div class="export" @click="downLoad">{{downTxt}}</div>
		</div>
		<div class="table-nav">
			<div>商家名称</div>
			<div>区域</div>
			<div>违规类型</div>
		</div>
		<div class="table-con">
			<div @click="openUrl(item.url)" v-for="(item,index) in datas" :key="index">
				<el-tooltip class="item" effect="dark" :content="item.name" placement="top">
					<div>{{item.name}}</div>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" :content="item.region" placement="top">
					<div>{{item.region}}</div>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" :content="item.illegalTypes" placement="top">
					<div>{{item.illegalTypes}}</div>
				</el-tooltip>
			</div>
			<div v-show="datas.length" style="text-align:center;line-height: 40px;color:#276AB0">
				导出以获得完整名单
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios"
	import apis from "@/unit/apis"
	const {
		EXPORT //违规商家导出
	} = apis
	export default {
		data() {
			return {
				isTran: false,
				datas: [],
				prevColor: "",
				tenHeight: 0,
				isDown: false,
				downTxt: "导出名单",
				baseUrl: process.env.NODE_ENV == 'development' ? '/apis' : '',
				urlw: 356,
				urlwa: 0,
				urlh: 537,
				urlha: 0
			}
		},
		methods: {
			openUrl(e) {
				if(e) {
					window.open(
						e,
						"newwindow",
						"height=" + this.urlh + ", width=" + this.urlw + ",left=" + this.urlwa + ",top=" + this.urlha + ", toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"
					);
				} else {
					this.$message.warning("暂无链接");
				}
			},
			resetData() {
				this.datas = [];
			},
			getData(res) {
				this.datas = [...res];
			},
			downLoad() { ///下载excel表格
				if(this.isDown) {
					return false;
				}
				this.isDown = true;
				this.downTxt = "正在导出"
				let url = this.baseUrl + EXPORT + this.path + "/" + this.downTime
				axios({
					method: 'get',
					url: url,
					responseType: 'blob'
				}).then(response => {
					this.isDown = false;
					this.downTxt = "导出名单"
					this.startDownload(response)
				}).catch((error) => {
					this.isDown = false;
					this.downTxt = "导出名单"
					this.$msgbox({
						title: "提示",
						message: error,
						type: "error"
					}).catch(_ => {

					})
				})
			},
			startDownload(data) {
				let fileName = decodeURI(data.headers["content-disposition"].split('fileName=')[1]);
				if('msSaveOrOpenBlob' in navigator) {
					window.navigator.msSaveOrOpenBlob(new Blob([data.data]), fileName);
				} else {
					let url = window.URL.createObjectURL(new Blob([data.data]));
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					link.setAttribute('download', fileName);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			},
		},
		created() {
			this.urlwa = (screen.width - this.urlw) / 2;
			this.urlha = (screen.height - this.urlh) / 2;
		},
		props: {
			shopLists: {
				type: Array,
				default: []
			},
			path: {
				type: String,
				default: ""
			},
			downTime: {
				type: String,
				default: ""
			},
		},
		watch: {
			shopLists(a, b) {
				this.getData(a)
			}
		}
	}
</script>

<style lang="scss">
	#shopLists {
		.table-nav {
			width: 100%;
			height: 48px;
			background: #F5F8FD;
			border-bottom: 1px solid #E2ECF6;
			div {
				float: left;
				width: 36%;
				height: 100%;
				line-height: 48px;
				padding-left: 20px;
				padding-right: 10px;
				color: #333;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				cursor: default;
				&:nth-child(2) {
					width: 28%;
				}
			}
		}
		.table-con {
			position: absolute;
			width: 100%;
			left: 0;
			top: 98px;
			bottom: 0;
			overflow-y: auto;
			>div {
				width: 100%;
				height: 40px;
				&:nth-child(even) {
					background: #f6f6f6;
				}
				>div {
					position: relative;
					float: left;
					width: 36%;
					top: 50%;
					color: #666;
					transform: translate(0, -50%);
					cursor: default;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					padding-left: 20px;
					padding-right: 10px;
					&:nth-child(2) {
						width: 28%;
					}
				}
			}
		}
		.export {
			position: absolute;
			width: 80px;
			height: 24px;
			border-radius: 12px;
			line-height: 24px;
			text-align: center;
			color: #fff;
			background: #276AB0;
			cursor: pointer;
			right: 10px;
			top: 13px;
		}
	}
</style>