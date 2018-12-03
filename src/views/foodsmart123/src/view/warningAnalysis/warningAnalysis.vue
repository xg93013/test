<template>
    <div id="warningAnalysis">
        <div class="wrapper">
            <div class="topA">
                <div class="a-left">
                    <div class="item" v-for="(item, index) in topData" :key="index" @click="filterWarning(item)">
                        <span class="title">{{item.name}}</span>
                        <span class="num">{{item.value}}</span>
                    </div>
                </div>
                <div class="a-right">
                    <div class="city-bar" id="city-bar"></div>
                </div>
            </div>
            <div class="botA">
                <div class="tabs">
                    <div class="item" :class="{'active' : tabIndex === 1}" @click="changTab(1)">tab1</div>
                    <div class="item" :class="{'active' : tabIndex === 2}" @click="changTab(2)">tab2</div>
                    <div class="item" :class="{'active' : tabIndex === 3}" @click="changTab(3)">tab3</div>
                    <div class="item" :class="{'active' : tabIndex === 4}" @click="changTab(4)">tab4</div>
                </div>
                <szlPageTable :config="foodTableMsga" v-show="tabIndex === 1"></szlPageTable>
                <szlPageTable :config="foodTableMsgb" v-show="tabIndex === 2"></szlPageTable>
                <szlPageTable :config="foodTableMsgc" v-show="tabIndex === 3"></szlPageTable>
                <!-- <szlModalTable :tableMsg="foodTableMsga" v-show="tabIndex === 1"></szlModalTable> -->
                <div class="see-more">
                    <szlDropdown class="dropdown">
                        <div>
                            <span class="szl-more pop-list" @click="seeMoreTable">查看更多</span>
                            <a class="szl-export pop-list" :href='exportUrl'>导出名单</a>
                        </div>
                    </szlDropdown>
                </div>
                
                <szlDialog class="pop-list" :config="moreTableConfig" @item-click="modalShow" ref="dialogRefs"></szlDialog>
            </div>
        </div>
        
    </div>
</template>
<script>
import szlModalTable from '@/components/szl-modal-table.vue'
import szlDropdown from '@/components/szl-dropdown.vue'
import szlDialog from '@/components/szl-dialog.vue'
import szlPageTable from '@/components/szl-page-table.vue'
import http from '../../unit/http'
import apis from '../../unit/apis'
const {
    TIMING,
    ILLEGALSHOPEW,
    FOODWASTE,
    ATTENTION,
    UREPORT_EXCEL_NETFOOD,
    UREPORT_EXCEL_FOODWASTE,
    UREPORT_EXCEL_ATTENTION
} = apis
export default {
    components: {
        szlModalTable,
        szlDropdown,
        szlDialog,
        szlPageTable
    },
    data() {
        return {
            tabIndex: 1,
            exportUrl: '',
            cityBarChart: '',
            cityBarData: [],
            selected: {},
            allPlatForm: ['netfood', 'foodWaste'], // 所有平台
            filterArr: ['netfood', 'foodWaste'], // 过滤平台
            sortAllData: [],
            topData: [{
                name: '累计预警',
                label: 'total',
                value: '20',
            },{
                name: '本月预警',
                label: 'month',
                value: '30',
            },{
                name: '今日预警',
                label: 'day',
                value: '50',
            }],
            foodTableMsga: {
                height: 180,
                url: '/api/tableaData',
                columns: [{
                    title: '更新时间',
                    key: 'updateTime',
                    width: 120
                    
                },{
                    title: '商家名称',
                    key: 'name',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.name,
                                    placement: "top-start"
                                }
                            },
                            params.row.name
                        );
                    }
                },{
                    title: '商家地址',
                    key: 'address',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.address,
                                    placement: "top-start"
                                }
                            },
                            params.row.address
                        );
                    }
                },{
                    title: '所属区域',
                    key: 'area'
                },{
                    title: '风险类型',
                    key: 'riskType',
                    ellipsis: true,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.riskType,
                                    placement: "top-start"
                                }
                            },
                            params.row.riskType
                        );
                    }
                }]
            },
            foodTableMsgb: {
                height: 180,
                // datas: [],
                url: '/api/tableaData',
                columns: [{
                    title: '更新时间',
                    key: 'updateTime',
                    width: 120
                    
                },{
                    title: '商家名称',
                    key: 'name',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.name,
                                    placement: "top-start"
                                }
                            },
                            params.row.name
                        );
                    }
                },{
                    title: '所属区域',
                    key: 'area'
                },{
                    title: '预警事件',
                    key: 'event',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.event,
                                    placement: "top-start"
                                }
                            },
                            params.row.event
                        );
                    }
                },{
                    title: '风险等级',
                    key: 'riskLevel',
                    ellipsis: true,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.riskLevel,
                                    placement: "top-start"
                                }
                            },
                            params.row.riskLevel
                        );
                    }
                }]
            },
            foodTableMsgc: {
                height: 180,
                // datas: [],
                url: '/api/tableaData',
                columns: [{
                    title: '更新时间',
                    key: 'updateTime',
                    width: 120
                },{
                    title: '商家名称',
                    key: 'name',
                    ellipsis: true,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.name,
                                    placement: "top-start"
                                }
                            },
                            params.row.name
                        );
                    }
                },{
                    title: '所属区域',
                    key: 'area'
                },{
                    title: '预警事件',
                    key: 'event',
                    ellipsis: true,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.event,
                                    placement: "top-start"
                                }
                            },
                            params.row.event
                        );
                    }
                },{
                    title: '风险等级',
                    key: 'riskLevel',
                    ellipsis: true,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.riskLevel,
                                    placement: "top-start"
                                }
                            },
                            params.row.riskLevel
                        );
                    }
                }]
            },
            moreTableConfig:{
                name:'',
                modalWidth: 1200,
                url:'/api/tableaData',
                columns: [],
                itemClick : function (){}
            }
        }
    },
    watch: {
        tabIndex(index){
            this.setMoreTableConfig();
        }
    },
    created() {
        this.setMoreTableConfig();
    },
    methods: {
        changTab(index){
            this.tabIndex = index;
        },
        filterWarning(item){
            this.getData();
        },
        async getData(){
            let res = await http.get('/api/barDatas');
            console.log(res)
            let totalData = res.data;
            if(totalData.length > 0){
                this.sortAllData = this.sortAllArr(totalData,this.filterArr);
                let originData = this.formatterArr(this.sortAllData,this.allPlatForm);
                this.cityBarData = [...originData];
                this.initCityBar();
            }
        },
        initCityBar(){
            let arr = this.cityBarData;
            let colors = ['#4472C4','#FFC000','#E18149','#A5A5A5'];
            let series = [];
            let legend = [];
            let xData = [];
            let yMax = 100;
            let _self = this;

            this.cityBarChart = this.$echarts.init(document.getElementById('city-bar'));

            series = this.getOptionData(arr).series;
            legend = this.getOptionData(arr).legend;
            xData = this.getOptionData(arr).xData;

            let option = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    lineStyle: {
                        type: 'dashed'
                    }
                    },
                    // formatter: function(params){
                    // 	// console.log(params);
                    // 	let htmls = params[0].data.name + '预警信息数量:'+ '<br/>';
                    // 	for(let i=0;i<params.length;i++){
                    // 		htmls +=   params[i].seriesName + '：' + params[i].value + '条<br />'
                    // 	}
                    // 	return htmls
                    // }
                },
                legend: {
                    top: 10,
                    left: 'center',
                    orient: 'horizontal',
                    itemWidth: 10,
                    itemHeight: 8,
                    selectedMode: 'multiple',
                    selected: _self.selected,
                    textStyle: {
                        color: '#333',
                        // color: '#72B5E6',
                        fontSize: 8
                    },
                    data: legend
                },
                grid: {
                    left: 15,
                    right: 15,
                    top: 50,
                    bottom: 10,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xData,
                    boundaryGap: true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee'
                        }
                    },
                    axisLabel: {
                        show: true,
                        color: '#666',
                        fontSize: 12,
                        rotate: 45
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#666'
                        }
                    },
                    axisLabel: {
                        color: '#666',
                        fontSize: 12,
                        interval: 0
                    },
                    axisTick: {
                        alignWithLabel: true,
                        length: 0
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: series
            };
            this.cityBarChart.setOption(option);
            
            this.cityBarChart.on('legendselectchanged', (params) => {

                window.addEventListener('resize', () => {
                    this.cityBarChart.resize();
                })
                this.filterArr = [];
                
                for(let item in params.selected){
                    if(params.selected[item] == true){
                        this.filterArr.push(this.switchNameToKey(item));						
                    }
                }
                // 至少选择一项
                if(this.filterArr.length > 0){
                    this.selected = params.selected;
                    this.sortAllDatas = this.sortAllArr(this.sortAllData,this.filterArr);
                    this.cityBarData = this.formatterArr(this.sortAllDatas,this.allPlatForm);
                }
                
                this.cityBarChart.clear();
                this.cityBarChart.off('legendselectchanged');
                this.initCityBar();
                
            });
        },
        switchKeyToName(key){
            let name = '';
            switch(key){
                case 'netfood':
                    name =  '网络餐饮';
                    break;
                case 'foodWaste':
                    name = '餐厨垃圾';
                    break;
                default:
                    break;
            }
            return name
            
        },
        switchNameToKey(name){
            let key = '';
            switch(name){
                case '网络餐饮':
                    key =  'netfood';
                    break;
                case '餐厨垃圾':
                    key = 'foodWaste';
                    break;
                default:
                    break;
            }
            return key
        },
        sortAllArr(arr, filterArr){
            let len = arr.length;
            let minIndex, temp;
            for (let i = 0; i < len - 1; i++) {
                minIndex = i;
                for (let j = i + 1; j < len; j++) {
                    let prevSum = 0;
                    let nextSum = 0;
                    for (let k = 0; k < filterArr.length; k++) {
                        prevSum += arr[j][filterArr[k]];
                        nextSum += arr[minIndex][filterArr[k]];
                    }
                    if (prevSum > nextSum) {
                        minIndex = j;
                    }
                }
                temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
            }
            return arr;
        },
        formatterArr(arr, filterArr){
            let dataArr = [];
            let _self = this;
            for (let i = 0; i < filterArr.length; i++) {
                let oneJson = {
                    name: _self.switchKeyToName(filterArr[i]),
                    data: []
                }
                for (let j = 0; j < arr.length; j++) {
                    oneJson.data.push({
                        name: arr[j].area,
                        value: arr[j][filterArr[i]]
                    })
                }
                dataArr.push(oneJson)
            }
            return dataArr
        },
        getOptionData(data){
            let arr = data;
            let colors = ['#4472C4','#FFC000','#E18149','#A5A5A5'];
            let optionData = {
                legend: [],
                series: [],
                xData: []
            };
            for (let i=0; i<arr[0].data.length; i++) {
                optionData.xData.push(arr[0].data[i].name)
            }
            for (let i=0; i< arr.length; i++) {
                let oneSeries = {
                    name: arr[i].name,
                    type: 'bar',
                    stack: 'common',
                    data: arr[i].data,
                    barMaxWidth: 10,
                    barGap: '-100%',
                    barCategoryGap: '55%',
                    itemStyle: {
                        normal: {
                            color: colors[i],
                            label: {
                                show: false
                            }
                        }
                    }
                }
                optionData.legend.push(arr[i].name);
                optionData.series.push(oneSeries);
            }
            return optionData
        },
        seeMoreTable(){
            this.$refs.dialogRefs.showModals();
        },
        setMoreTableConfig(){
            let index = this.index;
            if(index === 1){
                this.exportUrl = UREPORT_EXCEL_NETFOOD;
                this.moreTableConfig.name = '网络餐饮违规商家预警';
                this.moreTableConfig.columns = [...this.foodTableMsga.columns];
                this.moreTableConfig.url = ILLEGALSHOPEW;
            } else if(index === 2){
                this.exportUrl = UREPORT_EXCEL_FOODWASTE;
                this.moreTableConfig.name = '餐厨垃圾预警';
                this.moreTableConfig.columns = [{
                    title: '更新时间',
                    key: 'updateTime',
                    width: 90
                    
                },{
                    title: '预警类别',
                    key: 'eventType',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.eventType,
                                    placement: "top-start"
                                }
                            },
                            params.row.eventType
                        );
                    }
                },{
                    title: '商家名称',
                    key: 'name',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.name,
                                    placement: "top-start"
                                }
                            },
                            params.row.name
                        );
                    }
                },{
                    title: '商家类别',
                    key: 'shopCategory',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.shopCategory,
                                    placement: "top-start"
                                }
                            },
                            params.row.shopCategory
                        );
                    }
                },{
                    title: '商家规模',
                    key: 'shopScale',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.shopScale,
                                    placement: "top-start"
                                }
                            },
                            params.row.shopScale
                        );
                    }
                },{
                    title: '所属区域',
                    key: 'area',
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.area,
                                    placement: "top-start"
                                }
                            },
                            params.row.area
                        );
                    }
                },{
                    title: '预警事件',
                    key: 'event',
                    ellipsis: true,
                    // width: 120,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.event,
                                    placement: "top-start"
                                }
                            },
                            params.row.event
                        );
                    }
                },{
                    title: '风险等级',
                    key: 'riskLevel',
                    ellipsis: true,
                    render(h, params) {
                        return h(
                            "Tooltip",
                            {
                                props: {
                                    content: params.row.riskLevel,
                                    placement: "top-start"
                                }
                            },
                            params.row.riskLevel
                        );
                    }
                }]
                this.moreTableConfig.url = FOODWASTE;
            } else {
                this.exportUrl = UREPORT_EXCEL_ATTENTION;
                this.moreTableConfig.name = '重点关注';
                this.moreTableConfig.columns = this.foodTableMsgc.columns;
                this.moreTableConfig.url = ATTENTION;
            }
        },
        modalShow(){
            
        },
        init(){
            this.getData();
        }
    },
    mounted() {
        this.init()
    }
}
</script>
<style lang="scss" scoped>
#warningAnalysis{
    position: relative;
    width: 100%;
    height: 100%;
    .wrapper{
        position: absolute;
        left: 20px;
        right: 20px;
        top: 20px;
        bottom: 20px;
        // padding: 20px;
        .topA{
            width: 100%;
            height: 240px;
            position: relative;
            background: #f5f5f5;
            overflow: hidden;
            .a-left{
                position: absolute;
                top: 20px;
                left: 20px;
                bottom: 0;
                width: 200px;
                .item{
                    font-size: 16px;
                    margin-top: 30px;
                    .title{
                        font-size: 16px;
                        margin-left: 20px;
                    }
                    .num{
                        font-size: 20px;
                    }
                }
            }
            .a-right{
                position: absolute;
                left: 240px;
                right: 0;
                top: 0;
                bottom: 0;
                .city-bar{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .botA{
            width: 100%;
            position: relative;
            .tabs{
                width: 100%;
                margin-top: 20px;
                overflow: hidden;
                .item{
                    width: 20%;
                    height: 40px;
                    float: left;
                    color: #999;
                    line-height: 40px;
                    text-align: center;
                    cursor: pointer;
                }
                .active{
                    background: #eee;
                    color: #fff;
                }
            }
            .tableBox{
                width: 100%;
                margin-top: 20px;
            }
            .see-more{
                position: absolute;
                top: 50px;
                right: 20px;
                z-index: 999;
            }
        }
    }
}
</style>


