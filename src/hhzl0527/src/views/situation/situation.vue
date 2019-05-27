<template>
    <div id="gismap">
        <statistics class="display_area" @rowClick="tableRowClick" :filter="filter" @barClick="barClick" @countyReset="countyReset" :diaplyType="statisticsType" @showTimeList="showTimeList"></statistics>
        <webMap3d class="webMap" ref="webmap" :config="mapConfig" :filter="filter" @zoomChange="zoomChange"></webMap3d>
        <legends :class="['qualityLegend',showTendency?'tendency_view':'']" type="pollution"></legends>
        <!-- 切换应用 -->
        <div class="filterArea" :class="{'tendency': showTendency}">
            <!-- 水资源搜索 -->
            <div :class="['appSelectArea', showTendency?'quality':'']" @click="toggleType" v-show="showTime">
                <span>趋势分析</span>
            </div>
            <div :class="['appSelectArea', mapConfig.monitoring.show?'quality':'']" @click="showMonitoring" v-show="!showTendency">
                <span>监测站点</span>
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
            <el-select v-model="currentpollutionType" placeholder="污染类型" class="pollutionTypeSelect" :multiple='true' :collapse-tags='true' @visible-change="visibleChanged" @change="pollutionTypeChanged" v-show="!showTendency" :popper-append-to-body="false">
                <div class="pTypeSelectPrefix" slot="prefix" v-text="currentPollutionTypeRender(currentpollutionType)"></div>
                <el-option v-for="item in pollutionTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <auto-search class="riverSearch" @search="nameSearch" :value.sync="searchValue" v-show="!showTendency" :month="currentMonth"></auto-search>
        </div>
        <div class="filterMonth" v-show="showTime&&!showTendency">
            <my-scroll ref="scrollRefs" class="scroll-box" :data="monthData" :listenScroll="true" @scrollEnd="scrollEnd">
                <div class="month-list">
                    <p v-for="(item, index) in monthData" :key="item.key" :id="'listRefs'+index" >
                        <label @click="scrollToEle('listRefs'+index, item.mark)" :class="{'grayTime' : !item.mark, 'grayTimeRegion' : (!item.mark&&currentRegion!='')&&(!item.mark&&currentRegion!='all'), 'yearCss' : item.showYear ,'current' : index==currentMonthIndex&&!item.showYear}">{{ item.month == 1 ? item.year + '年' : (item.month > 9 ? item.month : 0 + '' + item.month) + '月'}}</label>
                        <span v-show="!item.mark&&index==currentMonthIndex&&!item.showYear" class="empty" :class="{'grayTimeRegion' : (!item.mark&&currentRegion!='')&&(!item.mark&&currentRegion!='all')}">(暂无数据)</span>
                        <span class="short">-</span>
                    </p>
                </div>
            </my-scroll>
            <div class="lines"></div>
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
import apis from "@/util/apis.js";
import MyScroll from '@/components/MyScroll.vue';

const {
    WATER_RESOURCE,
    WATER_POLLUTION,
    AVAILABLE_MONTH,
    MONITORINGSTATION
} = apis

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
            selectPollutionType: [],
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
                accurate:false,
                monitoring:{
                    data: [],
                    show: false
                }
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
            currentMonth: '',
            currentMonthIndex: 0,
            monthData: [],
            showTime: true,
            originDate: [],
            timeLength: 9,
            curYear: 0,
            curMonth: 0
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
                pType:this.selectPollutionType,
                month: this.currentMonth
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
        currentMonth(n, o){
            if(n != o){
                refreshData();
            }
        },
        currentRegion(n, o){
            if(n != o){
                this.getMonitoring();
            }
        },
        "filter":{
            handler:function(nv, ov){
                if(this.showTendency){
                    this.showTime = false
                } else {
                    this.showTime = true
                }
                
            },
            deep:true
        }
    },
    components : {
        // "webMap":webMap,
        statistics,
        autoSearch,
        webMap3d,
        legends,
        autoSlider,
        MyScroll
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
        // refreshData(void 0, true);
        this.$root.$on('showDetail',(params)=>{
            this.showTime = params == false;
        })
    },
    mounted () { 
        this.getAllMonth();
        this.getMonitoring();
    },
    methods:{
        async getAllMonth(){
            let res = await this.$http.get(AVAILABLE_MONTH);
            let curYear = 0, curMonth = 0;
            
            if(res && res.data){
                this.originDate = [...res.data].reverse();
                // 获取当前有数据月份
                for(let i = 0; i < res.data.length; i++){
                    for(let j = res.data[i].list.length - 1;  j > 0 ; j--){
                        if(res.data[i].list[j].mark){
                            curYear = parseInt(res.data[i].year);
                            curMonth = parseInt(res.data[i].list[j].month);
                            break;
                        }
                    }
                    if(curYear != 0){
                        break;
                    }
                }
                this.currentMonth = curYear + '' + (curMonth > 9 ? curMonth : 0 + '' + curMonth);
                this.curYear = curYear;
                this.curMonth = curMonth;
                this.formatMonth();
            } else {
                this.showTime = false;
                this.$message.error('暂无数据!')
            }
        },
        showMonitoring(){
            this.mapConfig.monitoring.show = !this.mapConfig.monitoring.show;
        },
        showTimeList(flag){
            this.showTime = flag;
        },
        formatMonth() {
            let montha, 
                monthb,
                yeara,
                yearb = ''
            let arr = [];
            let originDate = [...this.originDate];
            if(originDate.length > 0){
                for(let k = 0; k < originDate.length; k++){
                    // let yearObj = {
                    //     key: 'year'+k,
                    //     year: originDate[k].year + '年',
                    //     showYear: true,
                    //     mark: false
                    // }
                    // arr.push(yearObj)
                    
                    if(k == 0){
                        let mark = false;
                        for (let h = 0; h < originDate[k].list.length; h++){
                            if(originDate[k].list[h].mark || mark){
                                arr.push({
                                    key: 'month' + k + '' + h,
                                    month: parseInt(originDate[k].list[h].month),
                                    year: originDate[k].year,
                                    mark: originDate[k].list[h].mark
                                })
                                mark = true;
                            }
                        }
                        for (let f = 0; f < originDate[k].list.length; f++){
                            if(originDate[k].list[f].mark){
                                montha = originDate[k].list[f].month;
                                break;
                            }
                        }
                    } else {
                        originDate[k].list.forEach((item, index) => {
                            arr.push({
                                key: 'month' + k + '' + index,
                                month: parseInt(item.month),
                                year: originDate[k].year,
                                mark: item.mark
                            })
                        })
                    }
                }

                yeara = originDate[0].year;
                monthb = originDate[originDate.length-1].list[originDate[originDate.length-1].list.length-1].month;
                yearb = originDate[originDate.length-1].year;
                
                // 添加时间轴上下默认数据
                for(let j = 0; j < (this.timeLength-1)/2; j++){
                    if (montha == 1) {
                        montha = 12;
                        yeara++;
                        arr.unshift({
                            key: 'tempa'+j,
                            month: montha,
                            year: yeara,
                            mark: false
                        })
                        // if(!arr[0].showYear){
                        //     arr.unshift({
                        //         key: 'tempa'+j,
                        //         year: yeara + '年',
                        //         showYear: true,
                        //         mark: false
                        //     })
                        // }
                    } else {
                        montha--;
                        arr.unshift({
                            key: 'tempa'+j,
                            month: montha,
                            year: yeara,
                            mark: false
                        })
                    }
                    if (monthb == 12) {
                        monthb = 1;
                        yearb--;
                        // if(!arr[arr.length-1].showYear){
                        //     arr.push({
                        //         key: 'tempb'+j,
                        //         showYear: true,
                        //         year: yearb + '年',
                        //         mark: false
                        //     })
                        // }
                        arr.push({
                            key: 'tempb'+j,
                            month: monthb,
                            year: yearb,
                            mark: false
                        })
                    } else {
                        monthb++;
                        arr.push({
                            key: 'tempb'+j,
                            month: monthb,
                            year: yearb,
                            mark: false
                        })
                    }                  
                }
                this.monthData = arr;
                setTimeout(()=>{
                    this.refreshDate();
                },30)
            } else {
                refreshData(void 0, true)
            }
            
        },
        refreshDate(){
            let index = 0, year = 0, month = 0;
            for(let i = 0; i < this.monthData.length-1;i++){
                if(this.monthData[i].year == this.curYear && this.monthData[i].month == this.curMonth){
                    index = i;
                    month = this.monthData[i].month;
                    year = this.monthData[i].year;
                    break;
                }
            }
            month = month > 9 ? month : 0 + '' + month;
            this.currentMonth = year + '' + month;
            this.scrollToEle('listRefs'+index, true);
        },
        scrollToEle(id, mark){
            if(mark){
                let dom = document.getElementById(id);
                this.$refs.scrollRefs.scrollToElement(dom, 300, true, true, {});
            }
        },
        scrollEnd(pos){
            let timeH = 140;
            let index = Math.abs(parseInt((pos.y - timeH/2)/timeH)) + ((this.timeLength-1) / 2);
            let item = this.monthData[index];
            this.currentMonthIndex = index;
            this.scrollToEle('listRefs'+index, true);
            if(item.mark){
                let month = item.month > 9 ? item.month : 0 + '' + item.month;
                this.currentMonth = item.year + '' + month;
            }
        },
        toggleType(){
            this.showTendency = !this.showTendency;
            if (this.showTendency) {
                refreshData('tendency');
                this.mapConfig.monitoring.data = [];
            } else {
                refreshData();
                this.getMonitoring();
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
                this.accurateId = '';
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
        },
        visibleChanged(params){
            if(!params && JSON.stringify(this.selectPollutionType) != JSON.stringify(this.currentpollutionType)){
                this.selectPollutionType = [...this.currentpollutionType];
                refreshData();
            }
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
            this.showTime = true;
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
        },
        async getMonitoring(){
            let res = await this.$http.get(MONITORINGSTATION, {
                district: this.currentRegion == 'all' ? '' : this.currentRegion
            })
            if(res){
                this.mapConfig.monitoring.data = res.data;
                // vm.mapConfig.monitoring.data = [{
                //     id: 1,
                //     coordinate: [104.123999,30.752463],
                //     name: 'name'
                // },{
                //     id: 2,
                //     coordinate: [103.958975,30.667053],
                //     name: 'name2'
                // }]
            }
        },
        async zoomChange(level){
            let params = {};
            let vm = this;
            for(let i in vm.filter){
                if(vm.filter[i] == 'all'){
                    params[i] = ''
                } else {
                    if(i == 'pType'){
                        params[i] = vm.filter[i].join(',');
                    } else {
                        params[i] = vm.filter[i];
                    }
                }
            }
            let res = await vm.$http.get(WATER_RESOURCE, {
                district: vm.filter.region == 'all' ? '' : vm.filter.region,
                month: vm.filter.month,
                rType: vm.filter.rType == 'all' ? '' : vm.filter.rType,
                queryType: 'map',
                level: level
            });
            // console.log(resourceRes);
            if(res){
                vm.mapConfig.water.data = res.data.list;
            }
        } 
    }
}

// 刷新数据
async function refreshData (searchType, noLoading){
    let loading;
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
        // waterTempUrl = "/getWaterResourceData?id=" + vm.filter.id;
        // pollutionTempUrl = '/getPollutionData?waterId=' + vm.filter.id;
        vm.currentResourceType = '';
        vm.currentpollutionType = [];
        vm.selectPollutionType = [];
        vm.currentRegion = 'all';
        vm.mapConfig.accurate = true;
        let pollutionRes = await vm.$http.get(WATER_POLLUTION + '/' + vm.filter.id, {
            month: vm.filter.month
        });
        let resourceRes = await vm.$http.get(WATER_RESOURCE + '/' + vm.filter.id, {
            month: vm.filter.month
        });
        if(pollutionRes){
            vm.mapConfig.pollution.data = [pollutionRes.data];
        }
        if(resourceRes){
            vm.mapConfig.water.data = [resourceRes.data];
        }
    } else if (searchType == 'tendency') {
        // pollutionTempUrl = '/getPollutionData?region=' + vm.filter.region;
        let pollutionRes = await vm.$http.get(WATER_POLLUTION, {
            district: vm.filter.region == 'all' ? '' : vm.filter.region,
            month: vm.filter.month
        });
        if(pollutionRes){
            vm.mapConfig.pollution.data = pollutionRes.data;
        }
    } else {
        // pollutionTempUrl = '/getPollutionData?pType=' + vm.filter.pType + '&rType=' + vm.filter.rType + '&region=' + vm.filter.region;
        // waterTempUrl = '/getWaterResourceData?rType=' + vm.filter.rType + '&region=' + vm.filter.region;
        vm.mapConfig.accurate = false;
        vm.searchValue = '';
        vm.accurateId = '';
        let params = {};
        for(let i in vm.filter){
            if(vm.filter[i] == 'all'){
                params[i] = ''
            } else {
                if(i == 'pType'){
                    params[i] = vm.filter[i].join(',');
                } else {
                    params[i] = vm.filter[i];
                }
            }
        }
        let pollutionRes = await vm.$http.get(WATER_POLLUTION, params);
        if(pollutionRes){
            vm.mapConfig.pollution.data = pollutionRes.data;
        }
        let resourceRes = await vm.$http.get(WATER_RESOURCE, {
            district: vm.filter.region == 'all' ? '' : vm.filter.region,
            month: vm.filter.month,
            rType: vm.filter.rType == 'all' ? '' : vm.filter.rType,
            queryType: 'map'
        });
        // console.log(resourceRes);
        if(resourceRes){
            vm.mapConfig.water.data = resourceRes.data.list;
        }
    }  
    // 请求响应

    // pollutionResult = vm.$http.get(pollutionTempUrl);
    // pollutionResult = await pollutionResult;
    
    // if (searchType != 'tendency') {
    //     waterResult = vm.$http.get(waterTempUrl);
    //     waterResult = await waterResult;
       
    // }
    if (!noLoading) {
        loading.close();
    }
    // 赋值
    // if (pollutionResult && pollutionResult.code == 0) {
    //     vm.mapConfig.pollution.data = pollutionResult.data;
    // }
    // if (waterResult && waterResult.code == 0) {
    //     vm.mapConfig.water.data = waterResult.data;
    // }
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
        $searchWidth = 250px;
        

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
            $buchongW = 40px;
            $filterPanelWidth = fitPx(100px)
            .regionSelectArea {
                base(110px + $buchongW)
                float left
                margin-right 5px
            }
            .waterTypeSelect{
                base(120px + 60px)
                position relative
                float left
                margin-right 5px
            }
            .pollutionTypeSelect{
                base(129px + 30px)
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
                base(110px + 20px,$btnHeight,$btnHeight)
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
        .filterMonth{
            position absolute
            left fitPx(20px*2) + $panelCommonWidth
            top fitPx(60px) + $headerH
            width: fitPx(220px)
            height: $timeH*$timeLength
            overflow: hidden
            .scroll-box{
                width: 100%
                height: 100%
                .month-list{
                    p{
                        height: $timeH
                        line-height: $timeH
                        margin-left: fitPx(10px);
                        border-left: fitPx(1px) solid #56f4ff
                        label{
                            color: #56f4ff
                            cursor: pointer
                            padding-left: fitPx(18px)
                            &.grayTime{
                                color: #638789
                                cursor: not-allowed !important
                            }
                            &.grayTimeRegion{
                                color: #ccc
                            }
                            &.yearCss{
                                color: #56f4ff
                                cursor: normal
                            }
                            &.current{
                                font-size: fitPx(20px)
                                padding-left: fitPx(24px)
                            }
                        }
                        
                        // box-sizing: border-box
                        // border-bottom: 1px solid #ccc
                        
                        .empty{
                            color: #638789
                            font-size: fitPx(14px)
                        }
                        .grayTimeRegion{
                            color: #ccc
                        }
                        position: relative
                        .short{
                            position: absolute
                            left: 0
                            top: 50%
                            color: #56f4ff
                            transform: translateY(-50%)
                        }
                    }
                }
            }
            .lines{
                position: absolute
                top: 50%
                left: 0
                width: fitPx(20px)
                height: fitPx(20px)
                background: url('~@/image/times.png') no-repeat;
                background-size: cover
                color: red
                transform: translateY(-50%)
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
