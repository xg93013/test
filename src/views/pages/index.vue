<template>
	<div class="map-box">
		<!-- {{ $t("home.title") }}
		<span @click="changeLang">切换</span>
		<span @click="cancelSelect">取消选中</span> -->
		<!-- <div @click="login">登录</div>
		<div @click="getUser">获取用户</div> -->
		<span @click="cancelSelect">取消选中</span>
		<div id="map" class="map-area"></div>
		<div class="dataList"></div>
		<div class="date-select">
			<DateSelect></DateSelect>
		</div>
	</div>
</template>

<script>
	import { mapMutations, mapGetters } from 'vuex';
	import { setStorage } from '@/utils';
	import Cookies from 'js-cookie';
	import ol from 'openlayers';
	import originData from '@/assets/data/area.js';
	import DateSelect from '@/components/DateSelect/DateSelect.vue';
	export default {
		name: 'index',
		components: {
			DateSelect
		},
		data() {
			return {
				msg: '',
				map: '',
				markerLayers: '', // 坐标点
				markerArr: '',
				clickSelect: '',
				selectMarkerId: ''
			}
		},
		created () {
			console.log(originData)
		},
		computed: {
			...mapGetters(['loginUser'])
		},
		methods: {
			...mapMutations(['SET_USER']),
			login () {
				this.SET_USER({
					loginUser: {
						userName: 'xg',
						userPwd: '123456'
					}
				})
				let loginUser = {
					userName: 'xg',
					userPwd: '123456'
				}
				// console.log(loginUser instanceof Object)
				setStorage(loginUser, loginUser)
			},
			getUser () {
				console.log(this.loginUser.userName)
			},
			changeLang () {
				// Cookies.set('language', 'zh')
				this.$i18n.locale = 'en'
			},
			initMap () {
				let that = this
				that.markerLayers = new ol.layer.Vector({
					source: new ol.source.Vector()
				});
				
				that.map = new ol.Map({
					target: 'map',
					layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM()
						}),
						that.markerLayers
					],
					view: new ol.View({
						projection: 'EPSG:4326',
						center: [104.064760,30.570200],
						zoom: 6
					})
				});

				that.addMarkers()
				that.addEvents()
			},
			cancelSelect () {
				if(this.selectMarkerId){
					this.markerArr[this.selectMarkerId].setStyle(new ol.style.Style({
						image: new ol.style.Circle({
							radius: 4,
							fill: new ol.style.Fill({
								color: 'gray'
							})
						})
					}))
				}
				
			},
			addMarkers () {
				this.markerArr = {}
				// 在地图上添加一个圆
				let circle = new ol.Feature({
					geometry: new ol.geom.Point([104, 30]),
					id: 1
				})
				circle.setStyle(new ol.style.Style({
					image: new ol.style.Circle({
						radius: 4,
						fill: new ol.style.Fill({
							color: 'gray'
						})
					})
				}))
				let circle1 = new ol.Feature({
					geometry: new ol.geom.Point([104, 30.12]),
					id: 2
				})
				circle1.setStyle(new ol.style.Style({
					image: new ol.style.Circle({
						radius: 4,
						fill: new ol.style.Fill({
							color: 'gray'
						})
					})
				}))
				this.markerArr['1'] = circle
				this.markerArr['2'] = circle1
				this.markerLayers.getSource().addFeature(circle);
				this.markerLayers.getSource().addFeature(circle1);
			},
			addEvents () {
				var that = this
				that.clickSelect = new ol.interaction.Select();
				that.clickSelect.on('select', function(event){
					that.cancelSelect()
					if(event.selected[0]){
						// console.log(event.selected[0].getGeometry().getCoordinates())
						that.selectMarkerId = event.selected[0].getProperties().id
						event.selected[0].setStyle(new ol.style.Style({
							image: new ol.style.Circle({
								radius: 5,
								fill: new ol.style.Fill({
									color: 'black'
								})
							})
						}));
					} else {

					}
				})
				that.map.addInteraction(that.clickSelect);
				that.map.on('pointermove', function(event){
					that.map.getTargetElement().style.cursor = that.map.hasFeatureAtPixel(event.pixel) ? 'pointer' : '';
				})
			}
		},
		mounted () {
			this.initMap()
		}
	}
</script>

<style lang="scss" scoped>
.map-box{
	position: relative;
	width: 500px;
	height: 500px;
	.map-area{
		position: absolute;
	}
	.date-select{
		position: absolute;
		top: 10px;
		right: 10px;
	}
}
#map{
	width: 500px;
	height: 500px;
}
</style>
