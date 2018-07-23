<template>
	<div>
		{{ $t("home.title") }}
		<span @click="changeLang">切换</span>
		<span @click="cancelSelect">取消选中</span>
		<!-- <div @click="login">登录</div>
		<div @click="getUser">获取用户</div> -->
		<div id="map"></div>
	</div>
</template>

<script>
	import { mapMutations, mapGetters } from 'vuex';
	import { setStorage } from '@/utils';
	import Cookies from 'js-cookie';
	import ol from 'openlayers';
	export default {
		name: 'HelloWorld',
		data() {
			return {
				msg: '',
				map: '',
				clickSelect: ""
			}
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
				var layer = new ol.layer.Vector({
					source: new ol.source.Vector(),
					style: new ol.style.Style({
						image: new ol.style.Circle({
							radius: 10,
							fill: new ol.style.Fill({
								color: 'red'
							})
						})
					})
				});
				// 在地图上添加一个圆
				var circle = new ol.Feature({
					geometry: new ol.geom.Point([104, 30])
				})
				layer.getSource().addFeature(circle);
				that.map = new ol.Map({
					target: 'map',
					layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM()
						}),
						layer
					],
					view: new ol.View({
						projection: 'EPSG:4326',
						center: [104.064760,30.570200],
						zoom: 6
					})
				});
				
				// 添加绘图的交互类
				// that.map.addInteraction(new ol.interaction.Draw({
				// 	type: 'LineString' // 设置绘制线
				// }));
				// 监听singleclick事件
				// that.map.on('singleclick', function(event){
				// 	console.log(event.coordinate)
				// 	// 通过getEventCoordinate方法获取地理位置，再转换为wgs84坐标，并弹出对话框显示
				// 	alert(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
				// })
				console.log(this.map)

				// 异步加载
				// 添加一个用于选择Feature的交互方式
				that.clickSelect = new ol.interaction.Select({
					style: new ol.style.Style({
						image: new ol.style.Circle({
							radius: 10,
							fill: new ol.style.Fill({
								color: 'blue'
							})
						})
					})
				});
				that.map.addInteraction(that.clickSelect);

				// var vectorSource = new Vector({
				// 	format: new GeoJSON(),
				// 	loader: function(extent, resolution, projection) {
				// 		var proj = projection.getCode();
				// 		var url = 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
				// 			'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
				// 			'outputFormat=application/json&srsname=' + proj + '&' +
				// 			'bbox=' + extent.join(',') + ',' + proj;
				// 		var xhr = new XMLHttpRequest();
				// 		xhr.open('GET', url);
				// 		var onError = function() {
				// 		vectorSource.removeLoadedExtent(extent);
				// 		}
				// 		xhr.onerror = onError;
				// 		xhr.onload = function() {
				// 		if (xhr.status == 200) {
				// 			vectorSource.addFeatures(
				// 				vectorSource.getFormat().readFeatures(xhr.responseText));
				// 		} else {
				// 			onError();
				// 		}
				// 		}
				// 		xhr.send();
				// 	},
				// 		strategy: bbox
				// });
			},
			cancelSelect () {
				this.clickSelect.getFeatures().clear()
			}
		},
		mounted () {
			this.initMap()
		}
	}
</script>

<style lang="scss" scoped>
#map{
	width: 200px;
	height: 200px;
}
</style>
