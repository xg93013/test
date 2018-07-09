<template>
	<div>
		{{ $t("home.title") }}
		<span @click="changeLang">切换</span>
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
				map: ''
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
				this.map = new ol.Map({
					target: 'map',
					layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM()
						})
					],
					view: new ol.View({
						projection: 'EPSG:4326',
						center: [119.296494, 26.074507],
						zoom: 6
					})
				});
				console.log(this.map)

				// document.getElementById('zoom-out').onclick = function() {
				// 	const view = this.map.getView();
				// 	const zoom = view.getZoom();
				// 	view.setZoom(zoom - 1);
				// };

				// document.getElementById('zoom-in').onclick = function() {
				// 	const view = this.map.getView();
				// 	const zoom = view.getZoom();
				// 	view.setZoom(zoom + 1);
				// };
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
