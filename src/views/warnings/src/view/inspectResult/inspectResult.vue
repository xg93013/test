<template>
	<div class='inspect-result' id='inspectResult'>
		<div id='header'>
            <!-- <div class='left'></div> -->
			<router-link to="/" tag="div" class="left"><Icon type="arrow-left-c"></Icon>核查结果</router-link>
            <div class='user-msg' @mouseover="height=80" @mouseout="height=0">
                欢迎回来！{{userInfo.name}}
                <img :src="require('../../images/user.png')" alt="" />
                <div class='pop-lists' :style='{height: height+"px"}'>
                    <div class='pop-list' @click="editPassWord">修改密码</div>
                    <a class='pop-list' :href="baseUrl">退出登录</a>
                </div>
            </div>

        </div>
		<div class="content">
			<div class="left-nav">
				<div class="timeSelect">
					<TimeBox @timeChange="getTime" :currentTime="time" :platFormType="platFormType"/>
				</div>
				
				<div class="btns">
					<router-link to="/resultNetfood" tag="span">网络餐饮</router-link>
					<router-link to="/foodWaste" tag="span">餐厨垃圾</router-link>
				</div>
				<div class="bot">
					<div class="download">
						<div class="icon"><Icon type="archive"></Icon></div>
						<div class="text">模板下载</div>
					</div>
					<div class="download">
						<!-- <div class="item" @click="downModel('netfood')">网络餐饮模板</div>
						<div class="item" @click="downModel('foodWaste')">餐厨垃圾模板</div> -->
						<a class="item" :href='netfoodUrl'>网络餐饮模板</a>
						<a class="item" :href='foodWasteUrl'>餐厨垃圾模板</a>
					</div>
					<div class="download" @click="uploadResult">
						<div class="icon"><i class="el-icon-upload2"></i></div>
						<div class="text">上传结果</div>
					</div>
				</div>
			</div>
			<div class="main-content">
				<router-view :time="time" :updateData="updateData"/>
			</div>
			<Modal
				v-model="showModel"
				title=""
				width="500"
				class-name="uploadModal"
				>
				<div class="uploadList">
					<div class="btns" @click="exportIn('netfood')">导入网络餐饮</div>
					<div class="btns" @click="exportIn('foodWaste')">导入餐厨垃圾</div>
					<input type="file" @change="changeFile" style="display:none;" id="uploadFile"/>
				</div>
			</Modal>
			<!-- 显示上传结果提示 -->
			<Modal
				v-model="showResultModel"
				title=""
				width="500"
				class-name="uploadResultModal"
				@on-cancel="cancelShowModel">
				<div class="uploadResultList">
					<p class="resultTitleModal">核查结果数据确认</p>
					<p>您目前要上传的是：</p>
					<p class="filename">{{ fileName }}</p>
					<p class="tips">温馨提示：上传文件会对历史数据进行覆盖处理</p>
					<div class="result-btns">
						<span class="btns" @click="cancelShowModel">取消上传</span>
						<span class="btns" @click="confirmUpload">确定上传</span>
					</div>
				</div>
			</Modal>

		</div>
	</div>
</template>

<script>
	import TimeBox from '../../components/timeSlot'
	import axios from 'axios'
	import apis from '../../unit/apis'
	const baseUrl = process.env.NODE_ENV == 'development' ? '/api' : ''
	const {
		UPLOAD_NETFOOD
	} = apis
	export default {
		components: {
			TimeBox
		},
		data() {
			return {
				baseUrl: window.location.href.slice(0, "#") + "frontchannel_logout",
				height: 0,
				newBaseUrl: "",
				userInfo: {},
				time: {},
				exportType: '',
				fileName: '',
				fileParam: '',
				updateData: false,
				showModel: false,
				showResultModel: false,
				netfoodUrl: '',
				foodWasteUrl: '',
				platFormType: ''
            }
		},
		created () {
			this.platFormType = 'resultNetfood';
		},
		watch:{
			showResultModel(newV){
				if(!newV){
					document.getElementById('uploadFile').value = '';
				}
			},
			$route(to, from){
				let path = to.path;
				if(path == '/resultNetfood'){
					this.platFormType = 'resultNetfood'
				}
				if(path == '/foodWaste'){
					this.platFormType = 'foodWaste'
				}
				console.log(this.platFormType);
			}
		},
		methods:{
			async getUserInfo() {
				let res = await http.get("/oidc/user/base-info");
				if (res) {
					this.userInfo = res.data;
				}
			},
        	async getBaseUrl() {
            	let res = await http.get("/oidc/app-info");
				this.show = true;
				if (res) {
					this.newBaseUrl = res.data.indexUrl;
					sessionStorage.setItem("newBaseUrl", res.data.indexUrl);
				}
			},
			editPassWord() {
				let baseUrl = this.newBaseUrl;
				window.open(
					baseUrl + "#/modifyPassword",
					"newwindow",
					"height=400, width=800,left=400,top=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"
				);
			},
			getTime(e){
				this.time = e
			},
			// 下载模板
			downModel(type){
				// console.log(type);
			},
			// 上传结果弹窗
			uploadResult(){
				this.showModel = true;
			},
			exportIn(type){
				this.updateData = false;
				this.exportType = type;
				document.getElementById('uploadFile').click();
			},
			changeFile(e){
				let file = e.target.files[0];
				let type = '';
				this.fileParam = new FormData();
				this.fileParam.append('file',file);
				this.fileName = file.name;
				if(this.fileName){
					type = this.fileName.split('.')[1];
				}
				if(type == 'xlsx' || type == 'xls'){
					this.showResultModel = true;
				} else {
					this.$Modal.error({
						title: '提示',
						content: '请选择正确的excel文件'
					})
				}
			},
			confirmUpload(){
				let url = '';
				if(this.exportType == 'netfood'){
					url = UPLOAD_NETFOOD
				}
				if(this.exportType == 'foodWaste'){
					url = UPLOAD_FOODWASTE
				}
				console.log(url);
				
				let config = {
					headers:{'Content-Type':'multipart/form-data'}
				};
				// 上传成功
				this.updateData = true;
				this.showModel = false;
				this.showResultModel = false;
				// axios.post(baseUrl + url,this.fileParam,config)
				// .then(response=>{
				// 	// console.log(response.data);
				// 	// if(response.code == -1){
				// 	// 	$Modal.error({
				// 	// 		title: '提示',
				// 	// 		content: response.msg
				// 	// 	})
				// 	// }
				// })
			},
			cancelShowModel(){
				this.showResultModel = false;
				document.getElementById('uploadFile').value = '';
			}
		},
		mounted(){
			// this.getBaseUrl();
			// this.getUserInfo();
		}
	}
</script>
<style lang='scss' scoped>
#inspectResult{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	font-family: simhei;
	overflow: auto;
	background: #1e253d;
	#header{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
        height: 50px;
        background: #1b223e;
        text-align: center;
        line-height: 50px;
		font-size: 28px;
		box-sizing: border-box;
		// position: relative;
        border-bottom: 1px solid #27375f;
        z-index: 100;
		.left{
			float: left;
			font-size: 20px;
			margin-left: 20px;
			color: #eee;
			cursor: pointer;
		}
		.user-msg {
            position: absolute;
            padding: 0 20px;
            height: 100%;
            right: 0;
            top: 0;
            color: #7481a4;
			font-size: 16px;
			img{
				position: relative;
				width: 28px;
				height: 28px;
				top: 7px;
			}
            cursor: pointer;

            .pop-lists {
                position: absolute;
                top: 50px;
                background: #27375f;
                right: 20px;
                transition: all 0.3s;
                overflow: hidden;
                .pop-list {
                    display: block;
                    color: #dae6ff;
                    height: 30px;
                    line-height: 30px;
                    width: 100px;
                    text-align: center;
                    cursor: pointer;
                    background: #27375f;
                    transition: all 0.3s;
                    margin: 5px 0;
                    &:hover {
                        background: #1b223e;
                    }
                }
            }
        }
	}
	.content{
		top: 50px;
		bottom: 0;
		left: 0;
		right: 0;
		min-height: 600px;
		min-width: 1550px;
		font-family: "Microsoft YaHei";
		background: #1e253d;
		position: absolute;
		.left-nav{
			width: 200px;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;	
			// overflow: hidden;
			.timeSelect{
				font-size: 14px;
				margin: 20px 0 0 38px;
			}
			.btns{
				width: 100%;
				span{
					display: block;
					width: 150px;
					height: 40px;
					line-height: 40px;
					font-size: 16px;
					transition: all 0.2s;
					background: #2D3759;
					color: #D7E9FF;
					cursor: pointer;
					border-radius: 4px;
					text-align: center;
					margin: 20px auto;
					&:hover{
						background: #252D4A;
					}
					&.router-link-active{
						background: #252D4A;
					}
				}
			}
			.bot{
				position: absolute;
				width: 100%;
				bottom: 20px;
				left: 0;
				.download{
					width: 108px;
					overflow: hidden;
					font-size: 18px;
					color: #D7E9FF;
					margin: 10px auto;
					cursor: pointer;
					.item{
						display: block;
						font-size: 16px;
						margin-left: 10px;
						color: #2b85e4;
					}
					.icon{
						float: left;
					}
					.text{
						float: left;
					}
				}
			}
		}
		.main-content{
			position: absolute;
			top: 20px;
			left: 200px;
			right: 20px;
			bottom: 20px;
			.resultPage{
				width: 100%;
				height: 100%;
				position: relative;
				overflow: auto;
				.top-nav{
					width: 100%;
					height: 100px;
					margin-top: 10px;
					position: absolute;
					top: 0;
					overflow: hidden;
					.items{
						float: left;
						width: 20%;
						box-sizing: border-box;
						padding-left: 40px;
						font-size: 24px;
						color: #fff;
						font-weight: bold;
						// margin-left: 40px;
						span{
							font-size: 30px;
							color: #e25371;
							margin: 0 15px;
							cursor: pointer;
						}
					}
				}
				.tables{
					position: absolute;
					width: 100%;
					top: 100px;
					background: rgba(45, 55, 89, 0.5);
					.title{
						padding: 0px 0px 0px 10px;
						margin-top: 20px;
						color: #D7E9FF;
						border-left: 5px solid #1070E7;
						font-size: 18px;
						.helpicon{
							margin-left: 10px;
						}
					}
					.list{
						margin: 20px;
					}
				}
			}
		}
	}
}
.uploadList{
	width: 100%;
	.btns{
		width: 200px;
		height: 50px;
		transition: all 0.2s;
		text-align: center;
		line-height: 50px;
		border-radius: 4px;
		background: #2D3759;
		color: #D7E9FF;
		margin: 10px auto;
		cursor: pointer;
		&:hover{
			background: #252D4A;
		}
	}
}
.uploadResultList{
	width: 100%;
	padding: 0 20px;
	font-size: 14px;
	.resultTitleModal{
		width: 100%;
		padding: 30px 0;
		font-size: 22px;
		text-align: center;
	}
	.filename{
		padding: 10px 0;
		margin-left: 10px;
		color: #e25371;
	}
	.tips{
		font-size: 12px;
		padding: 5px 0;
	}
	.result-btns{
		width: 220px;
		margin: 20px auto;
		overflow: hidden;
		.btns{
			display: block;
			width: 100px;
			height: 40px;
			float: left;
			line-height: 40px;
			font-size: 12px;
			transition: all 0.2s;
			background: #2D3759;
			color: #D7E9FF;
			border: none;
			cursor: pointer;
			border-radius: 4px;
			text-align: center;
			&:hover{
				background: #252D4A;
			}
			&:last-child{
				background: #0FA063;
				margin-left: 10px;
			}
		}
	}
	// text-align: center;
}
</style>