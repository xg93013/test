<template>
    <div id="gismap">
        <statistics class="display_area" @rowClick="tableRowClick" :filter="filter" @barClick="barClick" @countyReset="countyReset" :diaplyType="statisticsType"></statistics>
        <webMap3d class="webMap" ref="webmap" :config="mapConfig"></webMap3d>
        <legends :class="['qualityLegend',showTendency?'tendency_view':'']" type="pollution"></legends>
        <!-- 切换应用 -->
        <div class="filterArea" :class="{'tendency': showTendency}">
            <!-- 水资源搜索 -->
            <div :class="['appSelectArea', showTendency?'quality':'']" @click="toggleType">
                <span>趋势分析</span>
            </div>
            <!-- <router-link class="selectItem" to="/situation">水资源</router-link>
            <router-link class="selectItem" to="/sensory_sub">水污染</router-link> -->
            <el-select v-model="currentRegion" placeholder="选择区县"  class="regionSelectArea" @change="regionChanged" :popper-append-to-body="false" v-show="!showTendency">
                <el-option v-for="item in regionsOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- 水资源筛选 -->
            <el-select v-model="currentResourceType" placeholder="水资源类型"  class="waterTypeSelect" @change="resourceTypeChanged" v-show="!showTendency" :popper-append-to-body="false">
                <el-option v-for="item in reourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- 污染类型筛选 -->
            <el-select v-model="currentpollutionType" placeholder="污染类型" class="pollutionTypeSelect" :multiple='true' :collapse-tags='true' @change="pollutionTypeChanged"  v-show="!showTendency" :popper-append-to-body="false">
                <div class="pTypeSelectPrefix" slot="prefix" v-text="currentPollutionTypeRender(currentpollutionType)"></div>
                <el-option v-for="item in pollutionTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <auto-search class="riverSearch" @search="nameSearch" :value.sync="searchValue" v-show="!showTendency"></auto-search>
        </div>
        <autoSlider class="auto_slider main" :labelList="sliderDateArr" @valueChanged="sliderChange" :display="showTendency"></autoSlider>
        <div class="bottomArea">
            <div></div>
            <div class="dataFrom" v-text="'Data © 高分二号  &  Company © 高分辨率对地观测系统四川数据与应用中心'"></div>
        </div>
    </div>
</template>

<script>
import statistics from "./components/statistics.vue";
import autoSearch from '@/components/autoSearch.vue';
import webMap3d from "./components/3dMap.vue"
import legends from "./components/legend.vue"
import autoSlider from '@/components/autoSlider.vue';
// console.time('a')
var colors = {
    l1:'rgba(124, 240, 103,1)',
    l1_s:'rgba(124, 240, 103,1)',
    l2:'rgba(1, 102, 255,1)',
    l2_s:'rgba(1, 102, 255,1)',
    l3:'rgba(245, 203, 37,1)',
    l3_s:'rgba(245, 203, 37,1)',
    l4:'rgba(251, 136, 89,1)',
    l4_s:'rgba(251, 136, 89,1)',
    l5:'rgba(181, 0, 0,1)',
    l5_s:'rgba(181, 0, 0,1)',
    lo:'rgba(181, 0, 0,1)',
    lo_s:'rgba(181, 0, 0,1)'
};
var qualities = {
    l1 :{
        name:"Ⅰ类",
        selected:false
    },
    l2 :{
        name:"Ⅱ类",
        selected:false
    },
    l3 :{
        name:"Ⅲ类",
        selected:false
    },
    l4 :{
        name:"Ⅳ类",
        selected:false
    },
    l5 :{
        name:"Ⅴ类",
        selected:false
    }
};
var vm;

export default {
    data () {
        return {
            // statisticsType :'tendency',
            // 过滤的名称
            searchValue: '',
            // 水资源类型
            currentResourceType:'',
            reourceOptions:[{
                    value:"all",
                    label:'全部'
                },
                {
                    value:"river",
                    label:'江河'
                },
                {
                    value:"lake",
                    label:'湖泊'
                }
            ],
            // 当前区县
            currentRegion:'',
            // 区县列表
            regionsOptions:[{value:'all',label:'成都市',id:"0"}],
            currentpollutionType:[],
            pollutionTypeOptions:[{value:'all',label:'全部'},{value:'hc',label:'黑臭水体'}, {value:'ns',label:'泥沙污染'}, {value:'zl',label:'水体富营养'}],
            accurateId:"",
            showTendency: false,
            mapConfig:{
                pollution:{
                    colors:colors,
                    data:[],
                },
                water:{
                    colors:colors,
                    data:[],
                },
                selectedCounty:'',
                get tendencyView(){
                    return vm.showTendency
                },
                accurate:false
            },
            legend:{
                list :qualities,
                colors:colors
            },
            types : {
                river : {
                    name : "江河",
                    selected:false
                },
                lake : {
                    name : "湖泊",
                    selected:false
                }
            },
            showSituationFilter:false,
            // sliderDateArr:this.$tools.getDateRange(6)
        }
    },
    computed:{
        filter(){
            // var id = this.accurateId,
            //     // qualityTypes = this.qualityTypes,
            //     currentResourceType = this.currentResourceType;
            return {
                // qualityTypes,
                id : this.accurateId,
                rType:this.currentResourceType,
                region: this.currentRegion,
                pType:this.currentpollutionType
            }
        },
        statisticsType(){
            return this.showTendency ? 'tendency' : 'normal';
        },
        sliderDateArr() {
            return this.$store.state.tendencyData.exponent.length ? this.$store.state.tendencyData.exponent : this.$tools.getDateRange(6);
        }
    },
    watch : {
    },
    components : {
        // "webMap":webMap,
        statistics,
        autoSearch,
        webMap3d,
        legends,
        autoSlider
    },
    created(){
        // this.qualityTypes = ["l1","l2","l3","l4","l5"];
        this.pollutionTypeOptions = [{value:'all',label:'全部'}, ...this.$store.state.pollutionLegendOptions]
        this.currentResourceType = '';
        vm = this;
        let regionData = [
                {label:'成华区',value:9},
                {label:'金牛区',value:10},
                {label:'崇州市',value:5},
                {label:'大邑县',value:5},
                {label:'都江堰市',value:8},
                {label:'高新区',value:9},
                {label:'简阳市',value:3},
                {label:'金堂县',value:5},
                {label:'锦江区',value:10},
                {label:'龙泉驿区',value:7},
                {label:'彭州市',value:5},
                {label:'郫都区',value:5},
                {label:'蒲江县',value:4},
                {label:'青白江区',value:7},
                {label:'青羊区',value:10},
                {label:'邛崃市',value:5},
                {label:'双流区',value:10},
                {label:'天府新区',value:9},
                {label:'温江区',value:5},
                {label:'武侯区',value:12},
                {label:'新都区',value:5},
                {label:'新津县',value:5}
        ];
        // var regionDataPro = await this.$http.get('/regions');
        this.regionsOptions = this.regionsOptions.concat(regionData.map(item => ({value:item.label,id:item.label,label:item.label})));
        refreshData(void 0, true);
    },
    mounted () {
        // console.timeEnd('a')
    },
    methods:{
        toggleType(){
            this.showTendency = !this.showTendency;
            if (this.showTendency) {
                refreshData('tendency');
            } else {
                refreshData();
            }
        },
        tableRowClick:function(param, type){
            this.$refs.webmap.manualSelect(param, type);
        },
        barClick(param){
            if (param.type.includes('region')) {
                // this.$refs.webmap.manualSelect(param);
                this.mapConfig.selectedCounty = param.data.label;
                this.currentRegion = param.data.label;
                refreshData();
            } else if (param.type == 'pollution') {
                this.tableRowClick(param.data, param.type);
            }
        },
        // 精确搜索-过滤
        nameSearch(item){
            if (item.type == 'all') {
                refreshData();
            } else {
                this.accurateId = item.id;
                this.mapConfig.selectedCounty = 'all';
                refreshData('accurate');
            }
        },
        // 污染类型-过滤
        pollutionTypeChanged(params){
            if (this.currentpollutionType.length > 1) {
                if (this.currentpollutionType.indexOf('all') != -1) {
                    if (this.currentpollutionType.indexOf('all') == 0) {
                        this.currentpollutionType.splice(this.currentpollutionType.indexOf('all'), 1);
                    } else {
                        this.currentpollutionType = this.currentpollutionType.splice(this.currentpollutionType.indexOf('all'), 1);
                    }
                }
            }
            refreshData();
        },
        // 区县切换-过滤
        regionChanged(params){
            this.mapConfig.selectedCounty = params;
            refreshData();
        },
        // 水资源类型-过滤
        resourceTypeChanged(params){
            refreshData();
        },
        countyReset () {
            this.currentRegion = 'all';
            this.regionChanged('all');
            // refreshData();
        },
        sliderChange(dateObj){
            refreshData('tendency', true);
        },
        currentPollutionTypeRender(pArr){
            if (pArr.length) {
                return pArr.map((item)=>{
                    if (item == 'all') {
                        return '全部';
                    }
                    return this.$store.state.pTypeRender(item);
                }).toString();
            }
            return '';
        }
    }
}

// 刷新数据
async function refreshData (searchType, noLoading){
    let loading;
    // console.time('b')
    if (!noLoading) {
        loading = vm.$loading({
            lock: true,
            text: '数据加载中...',
            background: 'rgba(0, 0, 0, 0.8)'
        });
    }

    let waterTempUrl, pollutionTempUrl, waterResult, pollutionResult;
    // 请求并发
    if (searchType == 'accurate') {
        waterTempUrl = "/getWaterResourceData?id=" + vm.filter.id;
        pollutionTempUrl = '/getPollutionData?waterId=' + vm.filter.id;
        vm.currentResourceType = '';
        vm.currentpollutionType = [];
        vm.currentRegion = 'all';
        vm.mapConfig.accurate = true;
    } else if (searchType == 'tendency') {
        pollutionTempUrl = '/getPollutionData?region=' + vm.filter.region;
    } else {
        pollutionTempUrl = '/getPollutionData?pType=' + vm.filter.pType + '&rType=' + vm.filter.rType + '&region=' + vm.filter.region;
        waterTempUrl = '/getWaterResourceData?rType=' + vm.filter.rType + '&region=' + vm.filter.region;
        vm.mapConfig.accurate = false;
        vm.searchValue = '';
        vm.accurateId = '';
    }
    // 请求响应

    pollutionResult = vm.$http.get(pollutionTempUrl);
    pollutionResult = await pollutionResult;
    if (searchType != 'tendency') {
        waterResult = vm.$http.get(waterTempUrl);
        waterResult = await waterResult;
    }
    if (!noLoading) {
        loading.close();
    }
    // console.timeEnd('b')
    // 赋值
    if (pollutionResult && pollutionResult.code == 0) {
        vm.mapConfig.pollution.data = pollutionResult.data;
    }
    if (waterResult && waterResult.code == 0) {
        vm.mapConfig.water.data = waterResult.data;
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../common/common.styl"
    #gismap >>> {
        // padding:$headerH
        height: 100%;
        width: 100%;
        position relative
        .webMap{
            // padding-top $toolBarH + $headerH
            position absolute
            top 0
            left 0
        }
        .display_area{
            height 100%
            // position absolute
            // left 20px
            // top 20px + $headerH
            // z-index 1
        }

        .qualityLegend{
            &.tendency_view {
                right fitPx(40px)
            }
            position absolute
            right $panelCommonWidth + fitPx(20px + 20px)
            bottom fitPx(30px)
        }
        $searchWidth = 200px;
        

        .filterArea {
            trans()
            &.tendency {
                right fitPx(20px)
                // left auto
            }
            position absolute
            right fitPx(20px*2) + $panelCommonWidth
            // left calc(100% - 470px - 735px)
            // transform translate(-100%)
            top fitPx(20px) + $headerH
            .riverSearch{
                float left
                // position absolute
                // right 20px + $panelCommonWidth
                // top 20px + $headerH
                base($searchWidth)
                // margin-right fitPx(5px)
            }
            
            $btnHeight = 40px;
            $filterPanelWidth = fitPx(100px)
            .regionSelectArea {
                base(110px)
                float left
                margin-right 5px
            }
            .waterTypeSelect{
                base(120px)
                position relative
                float left
                margin-right 5px
            }
            .pollutionTypeSelect{
                base(129px)
                margin-right 5px
                position relative
                float left
                &.el-select {
                    .el-tag {
                        display none
                    }
                    .el-input__prefix {
                        base(100%)
                        .pTypeSelectPrefix {
                            base(100%, 40px, 40px)
                            overflow hidden
                            text-overflow ellipsis
                            white-space nowrap
                            text-align left
                            padding-left 10px
                            padding-right 32px
                        }
                    }
                    .el-input__inner {
                        padding-left 15px
                    }
                }
            }

            .appSelectArea{
                cursor pointer
                // font-size fitPx(14px)
                font-size 14px
                base(110px,$btnHeight,$btnHeight)
                text-align center
                border-radius 4px
                float left
                padding 0px 10px
                background-color rgba(7, 14, 32, .85)
                margin-right 5px
                >span {
                    opacity .8
                }
                &.quality{
                    background-color rgba(1,255,255,0.85)
                    >span {
                        opacity 1
                    }
                }
                clf()
                // .selectItem{
                //     text-decoration none
                //     outline none
                //     base(100px,$btnHeight,$btnHeight)
                //     float left
                //     // padding 20px
                //     text-align center
                //     cursor pointer
                //     background-color RGBA(57, 89, 166, 1)
                //     trans()
                //     // border-radius 4px
                //     &:first-child{
                //         border-radius 4px 0px 0px 4px
                //     }
                //     &:last-child{
                //         border-radius 0px 4px 4px 0px
                //     }
                //     &:hover,&.active{
                //         background-color rgba(69, 103, 204, 1)
                //     }
                // }
                span {
                    // background url('~@/image/water_ico.png') no-repeat 0px 10px
                    // padding-left 21px
                    // display inline-block
                    // height 100%
                }
            }
        }
        .bottomArea {
            position absolute
            bottom fitPx(20px)
            left $panelCommonWidth + fitPx(160px)
            // transform translate(-50%)
        }
        .auto_slider {
            &.main {
                position absolute
                left 50%
                // left $panelCommonWidth + fitPx(40px)
                transfS(0, 100%)
                bottom fitPx(20px + 35px)
            }
            font-size 16px
            bottom 20px
        }
        .maptalks-control {
            >div {
                &:first-child {
                    left ($panelCommonWidth / 4) + 40px !important
                    >div {
                        >div {
                            color white !important
                            border-color white !important
                        }
                    }
                }
            }
        }
        
    }
</style>
