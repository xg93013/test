<template>
	<div id="szlRegione">
		<el-select clearable v-model="provinceId" :disabled="pdisable" size="small" placeholder="选择省" @change="provChange(provinceId)">
			<el-option v-for="item in provinces" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-select clearable v-model="cityId" :disabled="!provinceId||cdisable" size="small" placeholder="选择市" @change="cityChange(cityId)">
			<el-option v-for="item in citys" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-select clearable v-model="zoneId" :disabled="!provinceId||!cityId||adisable" size="small" placeholder="选择区" @change="zoneChange">
			<el-option v-for="item in zones" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import http from "@/unit/http";
	import apis from "@/unit/apis";
	const {
		REGION
	} = apis
	export default {
		data() {
			return {
				provinces: [],
				citys: [],
				zones: [],
				provinceId: "",
				cityId: "",
				zoneId: ""
			}
		},
		methods: {
			async getProvince() {
				let res = await http.get(REGION + "PROVINCE");
				if(res) {
					this.provinces = [...res.result];
				}
			},
			async getCitys(id) {
				let res = await http.get(REGION + "CITY?parentId=" + id);
				if(res) {
					this.citys = [...res.result];
				}
			},
			async getZones(id) {
				let res = await http.get(REGION + "ZONE?parentId=" + id);
				if(res) {
					this.zones = [...res.result];
				}
			},
			provChange(e) {
				console.log(e)
				this.cityId = "";
				this.zoneId = "";
				if(e) {
					this.getCitys(e);
				} else {
					this.citys = [];
					this.zones = [];
				}
				this.$emit("regChange", {
					provinceId: this.provinceId,
					cityId: this.cityId,
					districtId: this.zoneId
				})
			},
			cityChange(e) {
				this.zoneId = "";
				if(e) {
					this.getZones(e);
				} else {
					this.zones = [];
				}
				this.$emit("regChange", {
					provinceId: this.provinceId,
					cityId: this.cityId,
					districtId: this.zoneId
				})
			},
			zoneChange() {
				this.$emit("regChange", {
					provinceId: this.provinceId,
					cityId: this.cityId,
					districtId: this.zoneId
				})
			},
			init() {
				this.provinceId = this.regioneIds.provinceId;
				this.cityId = this.regioneIds.cityId;
				this.zoneId = this.regioneIds.districtId;
				if(this.provinceId) {
					this.getCitys(this.provinceId)
				}
				if(this.cityId) {
					this.getZones(this.cityId)
				}
			}
		},
		created() {
			this.getProvince();
		},
		props: {
			regioneIds: {
				type: Object,
				default: {

				}
			},
			pdisable: {
				type: Boolean,
				default: false
			},
			cdisable: {
				type: Boolean,
				default: false
			},
			adisable: {
				type: Boolean,
				default: false
			}
		}
		/*
		 ** 参数说明 
		  regioneIds//默认省市区信息
		  regioneIds: {
			provinceId: "", //省id
			cityId： "", //市id
			districtId: "" //区id
		  }
		  
		  disable: false//ture或者false，表示省市区能否被编辑
		*/
	}
</script>

<style lang="scss">
	#szlRegione {
		.el-select {
			display: block;
			float: left;
			width: 32%;
			margin-left: 2%;
			&:first-child {
				margin-left: 0;
			}
		}
		
		.el-input--small .el-input__inner{
			height: 32px !important;
		}
	}
</style>