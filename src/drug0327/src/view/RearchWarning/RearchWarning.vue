<template>
    <div id="rearch-warning">
        <div class="top">
            <div class="title">药物研发预警</div>
        </div>
        <div class="content">
            <div class="out-box top-box">
                <div class="box">
                    <div class="box-title">
                        <span>药物申报办件统计</span>
                        <my-tips :tips="tips" class="titleTips"/>
                    </div>
                    <div class="box-in">
                        <more-line-chart :moreLineData="moreLineData" />
                    </div>
                </div>
                <div class="box">
                    <div class="box-in">
                        <area-distribute :distributeData="distributeData" />
                    </div>
                </div>
                <div class="box lastbox">
                    <div class="box-in">
                        <manage-state :manageStateData="manageStateData" />
                    </div>
                </div>
            </div>
            <div class="out-box bot-box">
                <div class="box">
                    <div class="box-title">
                        <span>申报单位风险预警</span>
                        <my-tips :tips="tableTips" class="titleTips"/>
                    </div>
                    <div class="box-in">
                        <my-table :tableConfig="punishmentTable" @exportClick="exportClick" ref="punishmentTableRefs"/>
                    </div>
                </div>
                <div class="box">
                    <div class="box-in">
                        <my-table :tableConfig="noPassTable" @exportClick="exportClick" ref="noPassTableRefs"/>
                    </div>
                </div>
                <div class="box lastbox">
                    <div class="box-in">
                        <my-table :tableConfig="unEffectTable" @exportClick="exportClick" ref="unEffectTableRefs"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import MoreLineChart from './children/MoreLineChart';
import AreaDistribute from './children/AreaDistribute';
import ManageState from './children/ManageState';
import MyTable from '@/components/MyTable';
import MyTips from '@/components/MyTips';
import http from '@/unit/http';
import apis from '@/unit/apis';
import utils from '@/js/utils';
const {
    BASE,
    DEVELOP_TRENDS,
    DEVELOP_DISTRIBUTION,
    DEVELOP_STATUS,
    EARLYWARING_PUNISH,
    EARLYWARING_UNQUALIFY,
    EARLYWARING_ADR,
    EXPORT_PUNISH,
    EXPORT_UNQUALIFIED,
    EXPORT_ADR,
    DEVELOP_BJRISK
} = apis;
export default {
    components: {
        MoreLineChart,
        AreaDistribute,
        ManageState,
        MyTable,
        MyTips
    },
    data () {
        return {
            moreLineData: [],
            distributeData: [],
            manageStateData: [],
            punishmentTable: '', // 行政处罚
            noPassTable: '', // 抽检不合格
            unEffectTable: '', // 不良反应
            tips: '数据统计时间：近3个月',
            tableTips: '仅限于办理中的申报单位'
        }
    },
    created () {
        this.setTable();       
    },
    methods: {
        setTable () {
            this.punishmentTable = {
                title: "行政处罚",
                exportUrl: EXPORT_PUNISH,
                refName: 'punishmentTableRefs',
                tableColumn: [{
                    prop: 'UNIT',
                    label: '医疗机构/企业',
                    width: 'null'
                },{
                    prop: 'AREA',
                    label: '所属区域',
                    width: 'null'
                },{
                    prop: 'PUNISHCOUNT',
                    label: '处罚次数',
                    width: '100'
                },{
                    prop: 'PUNISHDATE',
                    label: '最近处罚日期',
                    width: '120'
                }],
                tableData: []
            };
            this.noPassTable = {
                title: '抽检不合格',
                exportUrl: EXPORT_UNQUALIFIED,
                refName: 'noPassTableRefs',
                tableColumn: [{
                    prop: 'UNIT',
                    label: '医疗机构/企业',
                    width: 'null'
                },{
                    prop: 'AREA',
                    label: '所属区域',
                    width: 'null'
                },{
                    prop: 'UNQUALIFIEDCOUNT',
                    label: '不合格次数',
                    width: '100'
                },{
                    prop: 'REPORTDATE',
                    label: '最近报告日期',
                    width: '120'
                }],
                tableData: []
            };
            this.unEffectTable = {
                title: '不良反应',
                exportUrl: EXPORT_ADR,
                refName: 'unEffectTableRefs',
                tableColumn: [{
                    prop: 'UNIT',
                    label: '医疗机构/企业',
                    width: 'null'
                },{
                    prop: 'DOUBTDRUG',
                    label: '怀疑药品',
                    width: 'null'
                },{
                    prop: 'EVALUATE',
                    label: '关联性',
                    width: '80'
                },{
                    prop: 'REPORTDATE',
                    label: '报告日期',
                    width: '120'
                }],
                tableData: []
            }
        },
        async getAllData () {
            let [moreLineDatas, distributeDatas, manageStateDatas, punishmentTables, noPassTables, unEffectTables] = await Promise.all([
                http.get(DEVELOP_TRENDS),
                http.get(DEVELOP_BJRISK),
                http.get(DEVELOP_STATUS),
                http.get(EARLYWARING_PUNISH),
                http.get(EARLYWARING_UNQUALIFY),
                http.get(EARLYWARING_ADR)
            ])
            if (moreLineDatas) {
                this.moreLineData = [...moreLineDatas.data];
            }
            if (distributeDatas) {
                this.distributeData = [...distributeDatas.data];
            }
            if (manageStateDatas) {
                this.manageStateData = [...manageStateDatas.data];
            }
            if (punishmentTables) {
                this.punishmentTable.tableData = [...punishmentTables.data];
            }
            if (noPassTables) {
                this.noPassTable.tableData = [...noPassTables.data];
            }
            if (unEffectTables) {
                this.unEffectTable.tableData = [...unEffectTables.data];
            }

            this.$emit("closeLoading",false)
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
        }
    },
    mounted () {
        this.getAllData();
    }
}
</script>
<style lang="scss" scoped>
#rearch-warning{
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
        .out-box{
            width: 100%;
            height: 50%;
            overflow: hidden;
            .box{
                width: 33%;
                height: 100%;
                float: left;
                position: relative;
                .box-title{
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    margin-left: 5px;
                    span{
                        font-size: 16px;
                        float: left;
                    }
                    .titleTips{
                        float: left;
                        margin: 12px 0 0 6px;
                    }
                }
                .box-in{
                    position: absolute;
                    top: 45px;
                    left: 5px;
                    right: 5px;
                    bottom: 5px;
                    background: rgba($color: #19A0FF, $alpha: 0.1);
                }
            }
            .lastbox{
                width: 34%;
            }
            &.top-box{
                height: 53%;
            }
            &.bot-box{
                height: 47%;
            }
        }
    }
}
</style>


