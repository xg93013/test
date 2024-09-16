<template>
	<div class='finish_room'>
		<div class='finish_room2'>
			<div v-for='(item ,index ) in imgs' class='room_img'>
				<img :src="item">
			</div>
			<div class='room_add_btn'>
				<span v-text="text"></span>
				<input @change='add_img' type="file" id="user_img" ref="imgInput">
			</div>
			<div>请您上传个人照片，以便在会议现场更好地体验我们的人脸识别技术服务。</div>
		</div>
	</div>
</template>
<script>
	import { communicationService, utilService } from "@/libs/uBase.js";

	export default {
		data: function() {
			return {
				imgs: [],
				text: "上传图片"
			}
		},
		props: ["value"],
		methods: {
			// 防抖动函数
			function debounce(func, wait, immediate) {
			    var timeout;
			    return function() {
			        var context = this, args = arguments;
			        var later = function() {
			            timeout = null;
			            if (!immediate) func.apply(context, args);
			        };
			        var callNow = immediate && !timeout;
			        clearTimeout(timeout);
			        timeout = setTimeout(later, wait);
			        if (callNow) func.apply(context, args);
			    };
			};
			
			var myEfficientFn = debounce(function() {
			    // 滚动中的真正的操作
			}, 250);
			
			// 绑定监听
			window.addEventListener('resize', myEfficientFn);
			
			
			add_img(event) {
				this.text = "更新照片";
				this.imgs = [];
				var reader = new FileReader();
				var img1 = event.target.files[0];
				reader.readAsDataURL(img1);
				var that = this;
				reader.onloadend = function() {
					that.imgs.push(reader.result)
				}
				// this.imgs = [];
				var formData = new FormData();
				formData.append("image", img1);
				formData.append("folder", "userInfo");
				utilService.openWaitingBox(true);
				communicationService.post(utilService.getResourceUrl("/fileSave/upload"), formData, function(result) {
					utilService.openWaitingBox(false);
					// console.log(result);
					// that.$emit("", );
					// utilService.handleResult(result, function (res) {
					if(result.status == 1) {
						// document.getElementById('user_img').reset()
						that.$Modal.success({
							title: result.msg,
							content: "上传图片成功",
							onOk: function() {
								// callBack();
								that.$emit("uploaded", result.data[0].url);
							}
						});
					} else {
						that.imgs = [];
						that.$refs.imgInput.value = "";
						that.$Modal.error({
							title: result.msg,
							content: result.desc,
						});
						that.$emit("uploaded", '');
					}
					// }, function (res) {
					//     utilService.handleException(res);
					// });
				}, function(result) {
					utilService.openWaitingBox(false);
					that.imgs = [];
					that.$refs.imgInput.value = "";
					// utilService.handleException(result);
					that.$Modal.error({
						title: result.msg,
						content: result.desc,
					});
					that.$emit("uploaded", '');
				}, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				});
			}
		},
		watch: {
			value: function(newV, oldV) {
				if(newV == "") {
					this.imgs = [];
					this.$refs.imgInput.value = "";
				}
			},
			imgs: function(newV) {
				if(newV.length == 0) {
					this.text = "上传图片"
				} else {
					this.text = "更新图片"
				}
			}
		}
	}
</script>
<style scoped type="stylesheet/sass" lang="sass">
	@import "../../styles/common.scss"; .finish_room{ width: auto; height: auto; } .finish_room2{ width: 100%; height: auto; // padding-top: 15px; padding-bottom: 15px; display: flex; align-items: center; /*border-bottom: 2px solid #e1e1e1;*/ } .finish_room2 .room_img{ width: 150px; height: 100px; margin-right: 10px; position: relative; overflow: hidden; } .finish_room2 .room_img img{ width: 100%; height: 100%; } .finish_room2>.room_img span{ position: absolute; width: auto; height: auto; right: 5px; bottom:3px; } .room_add_btn{ width: 80px; height: 40px; border: 1px solid #e1e1e1; position: relative; line-height: 40px; text-align: center; background: #0089FF; color: #fff; border-radius: 4px; } .room_add_btn input{ position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 99999; opacity: 0; font-size: 0; cursor: pointer; } .finish_room2 { @include clearFloat; div { float: left; margin-right: 20px; &:last-child { position: relative; top: 10px; color: #0089FF; font-size: 14px; } } }

</style>