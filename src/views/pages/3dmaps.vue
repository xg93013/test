<template>
	<div class="map-box" id="maptalks"></div>
</template>

<script>
	import maptalks from 'maptalks';
	export default {
		name: '',
		data() {
			return {
				msg: '',
				maptalks: ''
			}
		},
		created () {
		},
		computed: {

		},
		methods: {
			initMap () {
				let _self = this;
				_self.maptalks = new maptalks.Map('maptalks', {
					center: [30.5702000000,104.0647600000],
					room: 10,
					baseLayer: new maptalks.TileLayer('base', {
						urlTemplate: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
						subdomains: ['a','b','c'],
						attribution: ''
					})
				})
			},
			cancelSelect () {
				let _self = this;
			},
			addMarkers () {
				let _self = this;
			},
			addEvents () {
				var that = this;
			}
		},
		mounted () {
			// this.initMap()
		}
	}
</script>

<style lang="scss" scoped>
.map-box{
	width: 200px;
	height: 200px;
}
</style>
