<template>
    <div id="special-warning">
        <div class="top">
            <div class="left tab-nav">
                <!-- <span class="tab-item leftTab" :class="{'active' : tabIndex===1}" @click="changeTabIndex(1)">流出福建</span>
                <span class="tab-item" :class="{'active' : tabIndex===2}" @click="changeTabIndex(2)">流入福建</span> -->
                <span class="tab-item rightTab" :class="{'active' : tabIndex ===3}" @click="changeTabIndex(3)">福建省内</span>
            </div>
            <div class="rightBtn">
                <TimeBox @timeChange="getTime" :currentTime="time" />
            </div>        
        </div>
        <div class="content">
            <div class="box left">
                <div class="box-in">
                    <div class="mapbox">
                        <div id="flowOutMap" class="main-map flowOutMap" :class="{'visible' : tabIndex === 1}"></div>
                        <div id="flowInMap" class="main-map flowInMap" :class="{'visible' : tabIndex === 2}"></div>
                        <div id="inMap" class="main-map inMap" :class="{'visible' : tabIndex === 3}"></div>
                    </div>                   
                </div>
            </div>
            <div class="right">
                <div class="box right-top">
                    <div class="box-in">
                        <my-table :tableConfig="drugCirculateTable" @exportClick="exportClick" ref="drugCirculateTableRefs"/>
                    </div>
                </div>
                <div class="box right-bot">
                    <div class="box-in">
                        <my-table :tableConfig="enterpriseMainTable" @exportClick="exportClick" ref="enterpriseMainTableRefs"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import areaMapConfig from '@/js/areaMap.js';
import mapPosition from '@/js/utils.js';
import MyTable from '@/components/MyTable';
import TimeBox from '@/components/timeSlot';
import http from "@/unit/http";
import apis from "@/unit/apis";
import utils from '@/js/utils';
const {
    BASE,
    DRUG_FLOWIN,
    DRUG_FLOWOUT,
    DRUG_IN,
    DRUG_CIRCULATE,
    DRUG_ENTERPRISE,
    EXPORT_CIRCULATE,
    EXPORT_ENTERPRISE
} = apis;
export default {
    components: {
        MyTable,
        TimeBox
    },
    data () {
        return {
            tabIndex: 3,
            flowOutMap: '',
            flowInMap: '',
            inMap: '',
            mainMapData: '',
            flowOutData: '',
            flowInData: '',
            inData: '',
            drugCirculateTable: '',
            enterpriseMainTable: '',
            allDrugType: [],
            drugFlowIn: [],
            drugFlowOut: [],
            drugIn: [],
            defaultTime: {},
            selectDate: '',
            time: {},
            resizeTimer: '',
            timeType: '去年'
        }
    },
    created () {
        this.setTable();
    },
    watch: {
        time (date) {
            if(date.msg == ''){
                this.timeType = '去年'
            } else if (date.msg.indexOf('季度') > -1){
                this.timeType = '去年同期'
            } else if (date.msg.indexOf('月') > -1){
                this.timeType = '过去半年平均值'
            }
            this.setTable();
            this.getAllData();
        }
    },
    methods: {
        setTable () {
            this.drugCirculateTable = {
                title: "药品流通预警",
                exportUrl: EXPORT_CIRCULATE,
                refName: 'drugCirculateTableRefs',
                overTitle: this.timeType,
                tableColumn: [{
                    prop: 'drugType',
                    label: '药品分类',
                    width: '100'
                },{
                    prop: 'drugName',
                    label: '药品名称',
                    // width: '220'
                },{
                    prop: 'area',
                    label: '流入区域'
                },{
                    prop: 'amount',
                    label: '流入数量'
                },{
                    prop: 'usageNum',
                    label: '使用数量'
                },{
                    prop: 'linkRelativeRatio',
                    label: '使用量环比'
                }
                // ,{
                //     prop: 'otheruseCircle',
                //     label: '上月使用量',
                //     hidden: true,
                //     width: 0
                // }
                ],
                tableData: []
            }
            this.enterpriseMainTable = {
                title: "企业主体预警",
                exportUrl: EXPORT_ENTERPRISE,
                overTitle: this.timeType,
                refName: 'enterpriseMainTableRefs',
                tableColumn: [{
                    prop: 'enterprise',
                    label: '企业名称',
                    width: 'null'
                },{
                    prop: 'area',
                    label: '所属区域',
                    width: 'null'
                },{
                    prop: 'drugType',
                    label: '药品分类',
                    width: '100'
                },{
                    prop: 'drugName',
                    label: '药品名称',
                    width: 'null'
                },{
                    prop: 'amount',
                    label: '进货数量',
                    width: 'null'
                },{
                    prop: 'usageNum',
                    label: '使用数量'
                },{
                    prop: 'linkRelativeRatio',
                    label: '使用量环比'
                }
                // ,{
                //     prop: 'doubtContraband',
                //     label: '怀疑制作违禁品',
                //     width: '130'
                // }
                ],
                tableData: []
            }
        },
        async getAllData () {                        
            this.$emit("closeLoading",true);
            this.selectDate = this.time.year + '年' + this.time.msg;
            let [drugFlowIns,drugFlowOuts,drugins,drugCirculates,drugEnterprises] = await Promise.all([
                http.get(DRUG_FLOWIN, {date: this.selectDate}),
                http.get(DRUG_FLOWOUT, {date: this.selectDate}),
                http.get(DRUG_IN, {date: this.selectDate}),
                http.get(DRUG_CIRCULATE, {date: this.selectDate}),
                http.get(DRUG_ENTERPRISE, {date: this.selectDate})
            ])
            if (drugFlowIns) {
                this.drugFlowIn = [...drugFlowIns.data];
            }
            if (drugFlowOuts) {
                this.drugFlowOut = [...drugFlowOuts.data];
            }
            if (drugins) {
                this.drugIn = [...drugins.data];
            }
            if (drugCirculates) {
                this.drugCirculateTable.tableData = [...drugCirculates.data];
            }
            if (drugEnterprises) {
                this.enterpriseMainTable.tableData = [...drugEnterprises.data];
            }

            this.initAllMapData();
            this.initFlowOutMap();
            this.initFlowInMap();
            this.initInMap();
            this.addResize();
            this.$emit("closeLoading",false);
        },
        changeTabIndex (index) {
            this.tabIndex = index;    
        },
        initAllMapData () {
            let fujianCenter = areaMapConfig.getProvinceCenter();
            let flowOutOrigin = [...this.drugFlowOut];
            let flowInOrigin = [...this.drugFlowIn];
            let inOrigin = [...this.drugIn];
            let centerMap = {
                name: '福建',
                value: fujianCenter
            }
            this.flowOutData = {
                mapName: 'china',
                seriesData: []
            }
            this.flowInData = {
                mapName: 'china',
                seriesData: []
            }
            this.inData = {
                mapName: 'fujian',
                seriesData: []
            }

            // 流出福建
            for (let i = 0; i < flowOutOrigin.length; i++) {
                let oneDrug = {};
                if (flowOutOrigin[i].drugType != '') {
                    oneDrug.name = flowOutOrigin[i].drugType;
                    oneDrug.lineData = [];
                    oneDrug.areaData = [];
                    if(flowOutOrigin[i].distribution.length > 0) {
                        oneDrug.areaData.push(centerMap);
                    }
                    for (let j = 0; j < flowOutOrigin[i].distribution.length; j++) {
                        let oneLocation = flowOutOrigin[i].distribution[j];
                        let status = this.switchStatus(oneLocation.abnormal);
                        let oneLine = [];
                        let oneArea = {};
                        if (oneLocation.locationFrom && oneLocation.locationFrom != '') {
                            // line
                            oneLine[0] = fujianCenter;
                            oneLine[1] = [oneLocation.lngTo, oneLocation.latTo];
                            // area
                            oneArea.name = oneLocation.locationTo;
                            oneArea.value = [oneLocation.lngTo, oneLocation.latTo, status];
                        }
                        oneDrug.lineData.push(oneLine);
                        oneDrug.areaData.push(oneArea);
                    }
                }
                this.flowOutData.seriesData.push(oneDrug);
            }

            // 流入福建
            for (let i = 0; i < flowInOrigin.length; i++) {
                let oneDrug = {};
                if (flowInOrigin[i].drugType != '') {
                    oneDrug.name = flowInOrigin[i].drugType;
                    oneDrug.lineData = [];
                    oneDrug.areaData = [];
                    if (flowInOrigin[i].distribution.length > 0) {
                        oneDrug.areaData.push(centerMap);
                    }
                    for (let j = 0; j < flowInOrigin[i].distribution.length; j++) {
                        let oneLocation = flowInOrigin[i].distribution[j];
                        let status = this.switchStatus(oneLocation.abnormal);
                        let oneLine = [];
                        let oneArea = {};
                        if (oneLocation.locationFrom && oneLocation.locationFrom != '') {
                            // line
                            oneLine[0] = [oneLocation.lngFrom, oneLocation.latFrom];
                            oneLine[1] = fujianCenter;
                            // area
                            oneArea.name = oneLocation.locationFrom;
                            oneArea.value = [oneLocation.lngFrom, oneLocation.latFrom, status];
                        }
                        oneDrug.lineData.push(oneLine);
                        oneDrug.areaData.push(oneArea);
                    }
                }
                this.flowInData.seriesData.push(oneDrug);
                // console.log(this.flowInData);
            }

            // 省内
            for (let i = 0; i < inOrigin.length; i++) {
                let oneDrug = {};
                if (inOrigin[i].drugType != '') {
                    oneDrug.name = inOrigin[i].drugType;
                    oneDrug.lineData = [];
                    oneDrug.areaData = [];
                    for (let j = 0; j < inOrigin[i].distribution.length; j++) {
                        let oneLocation = inOrigin[i].distribution[j];
                        let status = this.switchStatus(oneLocation.abnormal);
                        let oneLine = [];
                        let oneFromArea = {};
                        let areaFromFlag = false;
                        let areaToFlag = false;
                        let oneToArea = {};
                        if (oneLocation.locationFrom && oneLocation.locationFrom != '') {
                            // line
                            oneLine[0] = [oneLocation.lngFrom, oneLocation.latFrom];
                            oneLine[1] = [oneLocation.lngTo, oneLocation.latTo];
                            oneDrug.lineData.push(oneLine);
                            // area
                            oneFromArea = {
                                name: oneLocation.locationFrom,
                                value: [oneLocation.lngFrom, oneLocation.latFrom, status]
                            }
                            oneToArea = {
                                name: oneLocation.locationTo,
                                value: [oneLocation.lngTo, oneLocation.latTo, status]
                            }
                            for (let i = 0; i < oneDrug.areaData.length; i++) {
                                if(oneFromArea.name === oneDrug.areaData[i].name) {
                                    areaFromFlag = true;
                                    break;
                                } else {
                                    areaFromFlag = false;
                                }
                            }
                            for (let i = 0; i < oneDrug.areaData.length; i++) {
                                if(oneToArea.name === oneDrug.areaData[i].name) {
                                    areaToFlag = true;
                                    break;
                                } else {
                                    areaToFlag = false;
                                }
                            }
                            if (!areaFromFlag) {
                                oneDrug.areaData.push(oneFromArea);
                            }
                            if (!areaToFlag) {
                                oneDrug.areaData.push(oneToArea);
                            }
                        }
                    }
                }
                this.inData.seriesData.push(oneDrug);
            }
        },
        initFlowOutMap () {
            if (this.flowOutMap !== '') {
                this.flowOutMap.clear();
            }
            let option = areaMapConfig.mapConfig(this.flowOutData);
            this.flowOutMap = this.$echarts.init(document.getElementById('flowOutMap'));
            this.flowOutMap.setOption(option);
        },
        initFlowInMap () {
            if (this.flowInMap !== '') {
                this.flowInMap.clear();
            }
            let option = areaMapConfig.mapConfig(this.flowInData);
            this.flowInMap = this.$echarts.init(document.getElementById('flowInMap'));
            this.flowInMap.setOption(option);
        },
        initInMap () {
            if (this.inMap !== '') {
                this.inMap.clear();
            }
            let option = areaMapConfig.mapConfig(this.inData);
            this.inMap = this.$echarts.init(document.getElementById('inMap'));
            this.inMap.setOption(option);
        },
        addResize () {
            if (this.flowOutMap && this.flowInMap && this.inMap) {
                window.addEventListener('resize', () => {
                    if (this.resizeTimer) {
                        clearTimeout(this.resizeTimer);
                    }
                    this.resizeTimer = setTimeout(() => {
                        this.flowOutMap.resize();
                        this.flowInMap.resize();
                        this.inMap.resize();
                    }, 300)
                })
            }          
        },
        exportClick(data){
            if (data.length > 0) {
                // window.open(BASE_URL + data.url + '&date=' + this.selectDate);
                let urls = BASE + data.url + '&date=' + this.selectDate;
                utils.exportExport(this, data, urls);
            } else {
                // this.$msgbox({
                //     title: "导出名单",
                //     message: "暂无名单信息",
                //     type: "error"
                // })
            }
        },
        getTime(e){
            this.time = e;
        },
        formatLineData (originData) {
            let arr = [...originData];
        },
        switchStatus (flag) {
            if (flag) {
                return '异常'
            } else {
                return '正常'
            }
        }
    },
    mounted () {
        // let times = new Date();
        // this.time = {
        //     year: times.getFullYear(),
        //     msg: (times.getMonth() + 1) < 10 ? "0" + (times.getMonth() + 1) + "月" : times.getMonth() + 1 + "月"
        // }
        // this.getAllData();
    },
    beforeDestroy () {
        if (this.flowOutMap) {
            this.flowOutMap.clear();
        }
        if (this.flowInMap) {
            this.flowInMap.clear();
        }
        if (this.inMap) {
            this.inMap.clear();
        }
    }
}
</script>
<style lang="scss" scoped>
#special-warning{
    position: relative;
    width: 100%;
    height: 100%;
    color: #A0D2FF;
    .top{
        width: 100%;
        height: 40px;
        overflow: hidden;
        .left{
            float: left;
            overflow: hidden;
            margin: 0 0 0 5px;
            .tab-item{
                display: block;
                width: 80px;
                height: 30px;
                float: left;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                border: 1px solid #0099FF;
                &.active{
                    background: #0099FF;
                    color: #fff;
                }
            }
            .leftTab{
                border-radius: 4px 0 0 4px;
            }
            .rightTab{
                border-radius: 4px 4px 4px 4px;
            }
        }
        .rightBtn{
            float: right;
            margin-right: 5px;
            // margin-top: 25px;
        }
    }
    .content{
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .box{
            height: 100%;
            position: relative;
            .box-in{
                position: absolute;
                top: 5px;
                left: 5px;
                right: 5px;
                bottom: 5px;
                .mapbox{
                    position: relative;
                    width: 100%;
                    height: 100%;
                    .main-map{
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        visibility: hidden;
                    }
                    .visible{
                        visibility: visible;
                    }
                }
            }
        }
        .left{
            width: 55%;
            height: 100%;
            float: left;
            .box{
                width: 100%;
                height: 100%;
            }
        }
        .right{
            width: 45%;
            height: 100%;
            float: left;
            .box{
                width: 100%;
                .box-in{
                    background: rgba($color: #19A0FF, $alpha: 0.1);
                }
            }
            .right-top{
                width: 100%;
                height: 50%;
            }
            .right-bot{
                width: 100%;
                height: 50%;
            }
        }
    }
}
</style>


