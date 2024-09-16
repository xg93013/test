<template>
	<div class='inspect-result' id='inspectResult'>

		<div class="content">
			<div class="left-nav">
				<div class="timeSelect">
					<!-- 各平台时间独立 -->
					<DateSelect @timeChange="getNetfoodTime" :currentTime="time" :platFormType="platform.netfood" v-show="platFormType == 'netfood'" ref="netfoodTime"/>
					<DateSelect @timeChange="getfoodWasteTime" :currentTime="foodWasetTime" :platFormType="platform.foodWaste" v-show="platFormType == 'foodWaste'" ref="foodWasteTime"/>
				</div>
				
				<div class="btns">
					<router-link to="/netfood" tag="span">网络餐饮</router-link>
					<router-link to="/foodWaste" tag="span">餐厨垃圾</router-link>
				</div>
				<div class="bot">
					<div class="download">
						<div class="icon"><Icon type="archive"></Icon></div>
						<div class="text">模板下载</div>
					</div>
					<div class="download">
						<a class="item" :href='uploadBase+netfoodUrl' :download="netfoodUrl">网络餐饮模板</a>
						<a class="item" :href='uploadBase+foodWasteUrl' :download="foodWasteUrl">餐厨垃圾模板</a>
					</div>
					<div class="download uploadmodel" @click="uploadResult">
						<div class="icon"><i class="el-icon-upload2"></i></div>
						<div class="text">上传结果</div>
					</div>
				</div>
			</div>
			<div class="main-content">
				<router-view :time="time" :foodWasetTime="foodWasetTime" :updateData="updateData" @closeLoadingParent="closeLoadingParent"/>
			</div>
			<Modal
				v-model="showModel"
				title="导入核查结果"
				width="400"
				class-name="uploadModal"
				>
				<div class="uploadList">
					<div class="btns" @click="exportIn('netfood')">导入网络餐饮</div>
					<div class="btns" @click="exportIn('foodWaste')">导入餐厨垃圾</div>
					<input type="file" @change="changeFile" style="display:none;" id="uploadFile"/>
				</div>
			</Modal>
			<!-- 显示上传提示-->
			<Modal
				v-model="showResultModel"
				title="核查结果"
				width="500"
				class-name="uploadResultModal"
				@on-cancel="cancelShowModel">
				<div class="uploadResultList">
					<p class="resultTitleModal">核查结果数据确认</p>
					<p>您目前要上传的是：</p>
					<p class="filename">{{ fileName }}</p>
					<p class="tips">温馨提示：上传文件会清空上传月份的历史数据，并进行覆盖处理</p>
					<div class="result-btns">
						<span class="btns" @click="cancelShowModel">取消上传</span>
						<span class="btns" @click="confirmUpload">确定上传</span>
					</div>
				</div>
			</Modal>

			<!-- 上传结果提示 -->
			<Modal
				v-model="showTipsModel"
				title="导入数据"
				width="300"
				:closable="false"
				:mask-closable="false"
				class-name="uploadTips"
				@on-cancel="cancelShowModel">
				<div class="tipscon">
					{{uploadText}}
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
//	import TimeBox from '../../components/timeSlot'
	import DateSelect from '../../components/DateSelect/DateSelect.vue'
	import axios from 'axios'
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	const baseUrl = process.env.NODE_ENV == 'development' ? '/api' : ''
	const uploadBase = '/static/'
	const {
		UPLOAD_NETFOOD,
		UPLOAD_FOODWASTE
	} = apis
	export default {
		components: {
			DateSelect
		},
		data() {
			return {
				baseUrl: window.location.href.slice(0, "#") + "frontchannel_logout",
				uploadBase: '/static/',
				height: 0,
				newBaseUrl: "",
				userInfo: {},
				time: {},
				foodWasetTime: {},
				exportType: '',
				fileName: '',
				fileParam: '',
				updateData: false,
				showModel: false,
				showTipsModel: false,
				showResultModel: false,
				netfoodUrl: 'xxxx年x月网络餐饮预警商家核查结果.xlsx',
				foodWasteUrl: 'xxxx年x月餐厨垃圾预警商家核查结果.xlsx',
				platFormType: 'netfood',
				uploadText: '上传中...',
				fileNameModel: {
					netfood: '网络餐饮预警商家核查结果',
					foodWaste: '餐厨垃圾预警商家核查结果'
				},
				platform: {
					netfood: 'netfood',
					foodWaste: 'foodWaste'
				}
            }
		},
		created () {
			this.platFormType = 'netfood';
		},
		watch:{
			showResultModel(newV){
				if(!newV){
					document.getElementById('uploadFile').value = '';
				}
			},
			$route(to, from){
				let path = to.path;
				if(path == '/netfood'){
					this.platFormType = 'netfood'
				}
				if(path == '/foodWaste'){
					this.platFormType = 'foodWaste'
				}
				// 更新数据
				// this.updateData = true
			}
		},
		methods:{
			getNetfoodTime(e){
				this.time = e;
				// console.log(e);
			},
			getfoodWasteTime(e){
				this.foodWasetTime = e;
			},
			// 下载模板
			downModel(type){
				// console.log(type);
			},
			// 上传结果弹窗
			uploadResult(){
				this.showModel = true;
				document.getElementById('uploadFile').value = '';
			},
			exportIn(type){
				this.updateData = false;
				this.exportType = type;
				document.getElementById('uploadFile').value = '';
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
					let fileNameTypeArr = this.fileName.split('.')[0].split('月');
					let yearIndex = this.fileName.indexOf('年');
					let monthIndex = this.fileName.indexOf('月');
					let modeName = this.fileNameModel[this.exportType]
					// 判断文件名规范
					if(yearIndex != -1 && monthIndex != -1){
						let year = fileNameTypeArr[0].split('年')[0];
						let month = fileNameTypeArr[0].split('年')[1];
						let nameType = fileNameTypeArr[1];
						let regYear = /^\d{4}$/;
						if(regYear.test(year) && month > 0 && month <= 12 && nameType == modeName){
							this.showResultModel = true;
						} else {
							this.$Modal.error({
								title: '提示',
								content: '请确保文件名格式为xxxx年x月' + modeName
							})
						}
					} else {
						this.$Modal.error({
							title: '提示',
							content: '请确保文件名格式为xxxx年x月' + modeName
						})
					}
				} else {
					this.$Modal.error({
						title: '提示',
						content: '请选择正确的excel文件'
					})
				}
			},
			confirmUpload(){
				let url = '';
				this.showTipsModel = true;
				this.showModel = false;
				this.showResultModel = false;
				this.uploadText = '导入中...';

				if(this.exportType == 'netfood'){
					url = UPLOAD_NETFOOD
				}
				if(this.exportType == 'foodWaste'){
					url = UPLOAD_FOODWASTE
				}
				
				let config = {
					headers:{'Content-Type':'multipart/form-data'}
				};
				axios.post(baseUrl + url,this.fileParam,config)
				.then(response=>{
					if(response.data.code == -1){
						this.uploadText = '';
						this.showTipsModel = false;
						this.$Modal.error({
							title: '提示',
							content: response.data.msg
						})
					}
					else if(response.data.code == 0){
						// 上传成功
						this.updateData = true;
						if(this.exportType == 'netfood'){
							this.$refs.netfoodTime.init('time');
						}
						if(this.exportType == 'foodWaste'){
							this.$refs.foodWasteTime.init('time');
						}
						this.uploadText = '导入成功！';
						setTimeout(()=>{
							this.showTipsModel = false;
						}, 1100)
					} else {
						this.uploadText = '';
						this.showTipsModel = false;
					}
				})
			},
			cancelShowModel(){
				this.showResultModel = false;
				document.getElementById('uploadFile').value = '';
			},
			closeLoadingParent(e){
				console.log(e);
				// this.$emit('closeLoading', e);
			}
		},

		mounted(){
//			this.getBaseUrl();
//			this.getUserInfo();
			this.$emit('closeLoading', false);
		}
	}
</script>
<style lang='scss' scoped>
#inspectResult{
	position: relative;
	width: 100%;
	height: 100%;
	overflow: auto;
	background: #1e253d;
	.content{
		top: 20px;
		bottom: 0;
		left: 0;
		right: 0;
		// min-height: 600px;
		// min-width: 1150px;
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
				margin-top: 35px;
				span{
					display: block;
					width: 150px;
					height: 40px;
					line-height: 40px;
					font-size: 16px;
					transition: all 0.2s;
					background: #252D4A;
					color: #D7E9FF;
					cursor: pointer;
					border-radius: 4px;
					text-align: center;
					margin: 20px auto;
					&:hover{
						background: #404c77;
					}
					&.router-link-active{
						background: #404c77;
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
					.item{
						display: block;
						font-size: 16px;
						margin-left: 10px;
						color: #2b85e4;
						cursor: pointer;
					}
					.icon{
						float: left;
						width: 30px;
						text-align: center;
					}
					.text{
						float: left;
					}
				}
				.uploadmodel{
					cursor: pointer;
				}
			}
		}
		.main-content{
			position: absolute;
			top: 20px;
			left: 200px;
			right: 20px;
			bottom: 20px;
		}
	}
}
.uploadList{
	width: 100%;
	.btns{
		width: 200px;
		height: 50px;
		font-size: 16px;
		transition: all 0.2s;
		text-align: center;
		line-height: 50px;
		border-radius: 4px;
		background: #323d65;
		color: #D7E9FF;
		margin: 22px auto;
		cursor: pointer;
		&:hover{
			background: #404c77;
		}
	}
}
.uploadResultList{
	width: 100%;
	padding: 0 20px;
	font-size: 14px;
	.resultTitleModal{
		width: 100%;
		padding: 24px 0;
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
}
.tipscon{
	padding: 24px 0;
	text-align: center;
	font-size: 14px;
}
</style>
<style>
.ivu-tooltip-inner {
  max-width: 300px;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
</style>