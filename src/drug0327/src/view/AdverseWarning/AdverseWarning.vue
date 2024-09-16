<template>
    <div id="adverse-warning">
        <div class="top">
            <div class="title">不良反应预警分析</div>
        </div>
        <div class="content">
            <div class="top">
                <div class="left">
                    <div class="box left-top">
                        <div class="box-in">
                            <time-line :timeLineData="timeLineData" />
                        </div>
                    </div>
                    <div class="box left-bot">
                        <div class="box-in">
                            <hospital-report :reportUnitTop10="reportUnitTop10" />
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="box">
                        <div class="box-in">
                            <untoward-effect :dropDownData="dropDownData" :analysisData="analysisData" :genderData="genderData" :ageData="ageData" :importantData="importantData" @selectDropDown="selectDropDown" @selectDrug="selectDrug" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="bot">
                <div class="box left">
                    <div class="box-in">
                        <my-table :tableConfig="unEffectTable" :tableTips="tableTips" @exportClick="exportClick" ref="unEffectTableRefs"/>
                    </div>
                </div>
                <div class="box middle">
                    <div class="box-in">
                        <my-table :tableConfig="blendWarningTable" :tableTips="tableTips" @exportClick="exportClick" ref="blendWarningTableRefs"/>
                    </div>
                </div>
                <div class="box right">
                    <div class="box-in">
                        <my-table :tableConfig="unionWarningTable" :tableTips="tableTips" @exportClick="exportClick" ref="unionWarningTableRefs"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TimeLine from './children/TimeLine';
import HospitalReport from './children/HospitalReport';
import UntowardEffect from './children/UntowardEffect';
import MyTable from '@/components/MyTable';
import MyExportBtn from '@/components/MyExportBtn';
import http from "@/unit/http";
import apis from "@/unit/apis";
import utils from '@/js/utils';
const {
    BASE,
    TIME_LINE,
    REPORT_UNITOP10,
    DROPDOWN_LIST,
    ANALYSIS,
    GENER_DATA,
    AGE_DATA,
    IMPORTANT_DATA,
    ADR_TIMES,
    MERGE_DRUGEWS,
    DRUGEVAL,
    EXPORT_OCCURTIMES,
    EXPORT_MERGEDRUG,
    EXPORT_EVAL
} = apis;
export default {
    components: {
        TimeLine,
        HospitalReport,
        UntowardEffect,
        MyTable,
        MyExportBtn
    },
    data () {
        return {
            unEffectTable: '',
            blendWarningTable: '',
            unionWarningTable: '',
            isLoading: true,
            tableTips: '最近报告日期为近3个月内',
            timeLineData: [],
            reportUnitTop10: [],
            selectOrganName: '', // 不良反应事件筛选药物名称
            selectDrugName: '', //选择的药品名称
            dropDownData: [], // 不良反应下拉菜单
            analysisData: [], // 不良反应药品分布
            genderData: [], // 性别分布
            ageData: [], // 年龄分布
            importantData: [] // 其他相关信息
        }
    },
    watch: {
        selectOrganName (name) {
            this.getAnalysisList(name);
        },
        selectDrugName (name) {
            this.getUnEffectData(name);
        }
    },
    created () {
        this.setTable();
    },
    methods:{
        setTable () {
            this.unEffectTable = {
                title: "同种不良药品反应多次发生提示",
                exportUrl: EXPORT_OCCURTIMES,
                refName: 'unEffectTableRefs',
                tableColumn: [{
                    prop: 'DOUBTDRUG',
                    label: '怀疑药品',
                    width: 'null'
                },{
                    prop: 'ORGANNAME',
                    label: '不良反应',
                    width: 'null'
                },{
                    prop: 'COUNT',
                    label: '发生次数',
                    width: '80'
                },{
                    prop: 'ADRDATE',
                    label: '最近报告日期',
                    width: '120'
                }],
                tableData: []
            };
            this.blendWarningTable = {
                title: "并用药品预警",
                exportUrl: EXPORT_MERGEDRUG,
                refName: 'blendWarningTableRefs',
                tableColumn: [{
                    prop: 'DOUBTDRUG',
                    label: '怀疑药品',
                    width: 'null'
                },{
                    prop: 'MERGEDRUG',
                    label: '并用药品',
                    width: 'null'
                },{
                    prop: 'ORGANNAME',
                    label: '不良反应',
                    width: 'null'
                },{
                    prop: 'ADRDATE',
                    label: '最近报告日期',
                    width: '120'
                }],
                tableData: []
            };
            this.unionWarningTable = {
                title: "关联性预警",
                exportUrl: EXPORT_EVAL,
                refName: 'unionWarningTableRefs',
                tableColumn: [{
                    prop: 'DOUBTDRUG',
                    label: '怀疑药品',
                    width: 'null'
                },{
                    prop: 'ORGANNAME',
                    label: '不良反应',
                    width: 'null'
                },{
                    prop: 'EVALUATE',
                    label: '关联性',
                    width: '80'
                },{
                    prop: 'ADRDATE',
                    label: '最近报告日期',
                    width: '120'
                }],
                tableData: []
            }
        },
        async getAllData () {          
            let [getTimeLine,reportUnitTop10,organRes,adrTimes,mergeDrugEWs,drugEval] = await Promise.all([
                http.get(TIME_LINE),
                http.get(REPORT_UNITOP10),
                http.get(DROPDOWN_LIST),
                http.get(ADR_TIMES),
                http.get(MERGE_DRUGEWS),
                http.get(DRUGEVAL)
            ])

            if(getTimeLine){
                this.timeLineData = [...getTimeLine.data];
            }
            if(reportUnitTop10){
                this.reportUnitTop10 = [...reportUnitTop10.data];
            }
            if(organRes){
                this.dropDownData = [...organRes.data];
                this.selectOrganName = this.dropDownData[0];
            }
            if(adrTimes){
                this.unEffectTable.tableData = [...adrTimes.data];
            }
            if(mergeDrugEWs){
                this.blendWarningTable.tableData = [...mergeDrugEWs.data];
            }
            if(drugEval){
                this.unionWarningTable.tableData = [...drugEval.data];
            }
            this.$emit("closeLoading",false);

        },
        exportClick (data) {
            if (data.length > 0) {
                // window.open(BASE_URL + data.url);
                let urls = BASE + data.url;
                utils.exportExport(this, data, urls);
            } else {
                // this.$msgbox({
                //     title: "导出名单",
                //     message: "暂无名单信息",
                //     type: "error"
                // })
            }
        },
        exportBlendWarning () {},
        // 下拉框
        selectDropDown (name) {
            this.selectOrganName = name;
        },
        // 获取某一不良反应事件累计药品
        selectDrug (name) {
            this.selectDrugName = name;
        },
        // 不良性别、年龄、重要信息分布
        async getUnEffectData(drugName) {
            let organName = this.selectOrganName;
            let [genderDatas,ageDatas,importantDatas] = await Promise.all([
                http.get(GENER_DATA +'/'+organName+'/'+drugName),
                http.get(AGE_DATA +'/'+organName+'/'+drugName),
                http.get(IMPORTANT_DATA +'/'+organName+'/'+drugName)
            ])
            if (genderDatas) {
                this.genderData = [...genderDatas.data];
            }
            if (ageDatas) {
                this.ageData = [...ageDatas.data];
            }
            if (importantDatas) {
                this.importantData = [...importantDatas.data];
                // console.log(this.importantData);
            }
        },
        // 获取不良反应事件累计药品分布
        async getAnalysisList(organName) {
            let res = await http.get(ANALYSIS+'/'+organName);
            let selectOrganDrugData = [...res.data];
            this.analysisData = selectOrganDrugData;
            if (selectOrganDrugData.length > 0) {
                this.selectDrugName = selectOrganDrugData[0].DRUGNAME;
            }
        }
    },
    mounted () {
        this.getAllData();
    }
}
</script>
<style lang="scss" scoped>
#adverse-warning{
    position: relative;
    width: 100%;
    height: 100%;
    color: #A0D2FF;
    .top{
        width: 100%;
        height: 40px;
        line-height: 40px;
        .title{
            font-size: 16px;
        }
    }
    .content{
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        bottom: 0;
        .top{
            width: 100%;
            height: 62%;
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
                    background: rgba($color: #19A0FF, $alpha: 0.1);
                }
            }
            .left{
                width: 33%;
                float: left;
                height: 100%;
                .left-top{
                    width: 100%;
                    height: 45%;
                }
                .left-bot{
                    width: 100%;
                    height: 55%;
                }
            }
            .right{
                width: 67%;
                float: left;
                height: 100%;
            }
        }
        .bot{
            width: 100%;
            height: 38%;
            overflow: hidden;
            display: flex;
            .box{
                width: 33%;
                height: 100%;
                float: left;
                position: relative;
                .box-in{
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    right: 5px;
                    bottom: 5px;
                    background: rgba($color: #19A0FF, $alpha: 0.1);
                }
            }
            .left{
                width: 33%;
            }
            .middle{
                width: 33%;
            }
            .right{
                width: 34%;
            }
        }
    }
}
</style>

