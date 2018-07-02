<template>
	<div id="amap-box">
		<div class="left">
			<div id="amap"></div>
			<div class="search">
				<el-input v-model="search.keyWord" placeholder="请输入内容" class="search-item" @blur="keySearch" id="searchId"></el-input>
				<el-select v-model="search.selectValue" placeholder="请选择" class="search-item" @change="selectSearch">
				    <el-option
				      v-for="item in selectOption"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				  <el-button @click="keySearch">清除点</el-button>
			</div>
		</div>
		<div class="right">
			<div class="info" >
				<p>{{ storeInfo.name }}</p>
				<p>{{ storeInfo.Address }}</p>
				<p>{{ storeInfo.region }}</p>
			</div>
		</div>
		<!--<Amap></Amap>
	    <Amapui></Amapui>-->
	</div>
</template>

<script>
	import { myDOM } from '@/assets/js/myUtils.js'
	import originData from '../mapJson/home-json.js'
	export default {
		components: {},
		data() {
			return {
				mapObj: "",
				keyTimer: "",
				mapCenter: [116.397428, 39.90923],
				currentIndex: 0,
				changeTimer: 0,
				markIcon: [{
					iconImg: require("../../assets/images/red.png")
				},{
					iconImg: require("../../assets/images/red.png")
				}],
				markerData: [],
				storeInfo: "",
				search: {
					keyWord: "",
					selectValue: ""
				},
				selectOption: [{
		          value: '选项1',
		          label: '选项1'
		        }, {
		          value: '选项2',
		          label: '选项2'
		        }, {
		          value: '选项3',
		          label: '选项3'
		        }, {
		          value: '选项4',
		          label: '选项4'
		        }, {
		          value: '选项5',
		          label: '选项5'
		        }],
		        markerObj: []
			}
		},
		created() {
//			console.log(originData)
			this.getMarkerData()
		},
		methods: {
			initMap () {
				let _self = this
				this.mapObj = new AMap.Map('amap', {
					resizeEnable: true,
					zoom: 13,
					mapStyle : 'amap://styles/0557538bad9e76aba4f4027e0ef5dea4',
					center: _self.mapCenter,
					animateEnable: true
				});
			},
			getMarkerData () {
				let _self = this
				let oldArr = []
				let outArr = []
				oldArr = originData.slice(0)
//				let oneStore = {}
				for (let i = 0, len = oldArr.length ; i < len; i++) {
					let LngLatX = oldArr[i].location.split(',')[0]
					let LngLatY = oldArr[i].location.split(',')[1]
					oldArr[i].LngLatX = oldArr[i].location.split(',')[0]
					oldArr[i].LngLatY = oldArr[i].location.split(',')[1]
					oldArr[i].status = 0
					let oneObj = oldArr[i]
					outArr.push(oneObj)
				}
				_self.mapCenter = [outArr[0].LngLatX, outArr[0].LngLatY]
				_self.markerData = outArr
			},
			addMarker(data) {
//				console.log(data)
				let _self = this
				if(!_self.mapObj ){
					return
				}
				_self.clearMarker()
//				_self.mapObj.remove(_self.markerData)
				for (let i = 0, len = data.length ; i < len; i++) {
					let iconStatus = 0
					if (data[i].status) {
						iconStatus = data[i].status
					}
					if (!data[i].LngLatX || !data[i].LngLatY) {
						return
					}
					let marker = new AMap.Marker({
						map: _self.mapObj,
						position: [data[i].LngLatX, data[i].LngLatY],
						icon: _self.markIcon[iconStatus].iconImg,
						title: data[i].name
					});
					marker.content = data[i].name
					// marker节流点击
					marker.on('click',myDOM.debounce(function(){
						_self.currentIndex = i
						_self.setMapCenter()
					}, 200))
					_self.markerObj.push(marker)
				}
//				_self.mapObj.panTo([data[0].LngLatX, data[0].LngLatY])
			},
			clearMarker () {
				let _self = this
				_self.currentIndex = 0
				window.clearTimeout(_self.changeTimer)
//				for (let i = 0, len = _self.markerObj.length; i < len; i++) {
//					_self.mapObj.remove(_self.markerObj[i])
//				}
				_.forEach(_self.markerObj, function(value){
					_self.mapObj.remove(value)
				})
				_self.setMapCenter()
			},
			setMapCenter () {
				let _self = this
				if (_self.changeTimer){
					window.clearTimeout(_self.changeTimer)
				}
				if (_self.markerData.length > 0) {
					if (_self.markerData[_self.currentIndex].LngLatX &&  _self.markerData[_self.currentIndex].LngLatY) {
						_self.mapObj.panTo([_self.markerData[_self.currentIndex].LngLatX, _self.markerData[_self.currentIndex].LngLatY])
					}
					_self.mapObj.setZoom(13)
					_self.storeInfo = _self.markerData[_self.currentIndex]
					_self.changeTimer = setTimeout(function(){
						_self.currentIndex++
						if (_self.currentIndex === _self.markerData.length) {
							_self.currentIndex = 0
						}
						setTimeout(_self.setMapCenter,3000)
					}, 3000)
				}
			},
			keySearch () {
				let key = this.search.keyWord
				let originMarker = this.markerData.splice(0)
				if (key !== "") {
					let searchMarker = originMarker.filter(function(item ,index){
						return item.name.indexOf(key) > -1
					})
//					let searchMarker = _.filter(originMarker, _.negate((n) => {
//						return n.indexOf(key) > -1
//					}))
					this.markerData = searchMarker
					this.addMarker(searchMarker)
					
				} else {
					this.markerData = originMarker
				}
			},
			selectSearch () {
				
			}
		},
		mounted() {
			this.initMap()
			this.addMarker(this.markerData)
			this.setMapCenter()
		}
	}
</script>

<style lang="scss" scoped="scoped">
	#amap-box {
		display: flex;
		.left {
			flex: 0 0 500px;
			width: 500px;
			position: relative;
			#amap {
				position: absolute;
				top: 0;
				right: 0;
				width: 450px;
				height: 450px;
			}
			.search{
				position: absolute;
				top: 10px;
				right: 10px;
				.search-item{
					width: 160px;
				}
			}
		}
		.right {
			flex: 1;
			margin-left: 20px;
		}
	}
</style>