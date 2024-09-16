<template>
    <div class="resultPage">
        <div class="top-nav">
            <div class="items">核查总数<span @click="filterData('total')">{{allStatus.total}}</span>家</div>
            <div class="items">已处理<span @click="filterData('processed')">{{allStatus.processed}}</span>家</div>
            <div class="items">待处理<span @click="filterData('unprocess')">{{allStatus.unprocess}}</span>家</div>
        </div>
        <div class="tables">
            <div class="title">
                <span class="titleName">核查商家名单公示</span>
                <Tooltip :content="tipsContent" placement="right" class="helpicon"><Icon type="help"></Icon></Tooltip>
            </div>
            <div class="list">
                <szlResultTable :tableMsg='tableConfig' ref='resultTable' />
            </div>
        </div>
    </div>
</template>
<script>
import szlResultTable from "../../components/szl-result-table.vue";
import apis from '../../unit/apis';
import http from '../../unit/http';
const {
    FOODWASTE_LIST,
    FOODWASTE_STATUS
} = apis
export default {
    components: {
        szlResultTable
    },
    data (){
        return {
            tipsContent: '默认展示全部核查商家名单，点击上方统计数据中的数字，则只展示对应类型的商家名单',
            currentData: [],
            allStatus: {
                processed: 0,
                unprocess: 0,
                total: 0
            },
            currentStatus: 'total',
            year: '',
            month: '',
            paginationModel : {
                current : 1,
                size : 15,
                pages : 0,
                total : 0,
                layout : "prev, pager, next, total, jumper"
            },
            tableConfig: {
                columns: [
                    {
                        title: "序号",
                        key: "num",
                        width: 100
                    },
                    {
                        title: "更新时间",
                        key: "updateTime",
                        ellipsis: true,
                        // width: 100,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.updateTime,
                                        placement: "top-start"
                                    }
                                },
                                params.row.updateTime
                            );
                        }
                    },
                    {
                        title: "预警类别",
                        // width: 140,
                        key: "eventType",
                        ellipsis: true,
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
                    },
                    {
                        title: "商家名称",
                        key: "name",
                        ellipsis: true,
                        // width: 100,
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
                    },
                    {
                        title: "商家类别",
                        // width: 140,
                        key: "shopCategory",
                        ellipsis: true,
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
                    },
                    {
                        title: "商家规模",
                        key: "shopScale",
                        ellipsis: true,
                        width: 100,
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
                    },
                    {
                        title: "所属区域",
                        // width: 140,
                        key: "shopStreet",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.shopStreet,
                                        placement: "top-start"
                                    }
                                },
                                params.row.shopStreet
                            );
                        }
                    },
                    {
                        title: "预警事件",
                        // align: "right",
                        key: "event",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.event,
                                        placement: "top-end"
                                    }
                                },
                                params.row.event
                            );
                        }
                    },
                    {
                        title: "风险等级",
                        // align: "right",
                        key: "riskLevel",
                        // render(h, params) {
                        //     return h(
                        //         "Tooltip",
                        //         {
                        //             props: {
                        //                 content: params.row.sczAndBzxz,
                        //                 placement: "top-start"
                        //             }
                        //         },
                        //         params.row.sczAndBzxz
                        //     );
                        // }
                    },
                    {
                        title: "处理状态",
                        // align: "right",
                        key: "status",
                        // render(h, params) {
                        //     return h(
                        //         "Tooltip",
                        //         {
                        //             props: {
                        //                 content: params.row.sczAndBzxz,
                        //                 placement: "top-start"
                        //             }
                        //         },
                        //         params.row.sczAndBzxz
                        //     );
                        // }
                    }
                ]
            }
            
        }
    },
    props: ['foodWasetTime', 'updateData'],
    watch: {
        foodWasetTime(newTime){
            this.initData();
        },
        updateData(update){
            if(update){
                this.initData();
            }
        }
    },
    created(){},
    methods: {
        showTableData(){
            let month = '';
            if(this.month != ''){
                month = '/'+this.month;
            }
            this.$refs.resultTable.getTableMsg(FOODWASTE_LIST+'/'+this.year+month, this.currentStatus);
        },
        filterData(type){
            this.currentStatus = type;
            this.showTableData();
        },
        async getAllStatus(){
            let month = '';
            if(this.month != ''){
                month = '/'+this.month;
            }
            let res = await http.get(FOODWASTE_STATUS+'/'+this.year+month);
            if(res){
                let statusArr = res.data;
                for (let i = 0; i < statusArr.length; i++) {
                    this.allStatus[statusArr[i].status] = statusArr[i].count
                }
                if(this.allStatus.total == 0){
                    this.allStatus = {
                        processed: 0,
                        unprocess: 0,
                        total: 0
                    }
                }
            }
        },
        initData(){
            let time = JSON.parse(sessionStorage.getItem('foodWasteTime'));
            if(time){
                let year = time.year;
                let month = time.msg;
                this.year = year;
                this.month = month.substring(0,month.indexOf('月'));
                
                this.showTableData();
                this.getAllStatus();
            }
        }
    },
    mounted(){
        this.$parent.$emit('closeLoadingParent', false);
        this.initData();
        
    }
}
</script>
<style lang="scss" scoped>
.resultPage{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    .top-nav{
        width: 100%;
        height: 100px;
        margin-top: 10px;
        position: absolute;
        top: 0;
        overflow: hidden;
        .items{
            float: left;
            width: 20%;
            box-sizing: border-box;
            padding-left: 40px;
            font-size: 24px;
            color: #fff;
            font-weight: bold;
            // margin-left: 40px;
            span{
                font-size: 30px;
                color: #e25371;
                margin: 0 15px;
                cursor: pointer;
            }
        }
    }
    .tables{
        position: absolute;
        width: 100%;
        top: 90px;
        background: rgba(45, 55, 89, 0.5);
        .title{
            padding: 0px 0px 0px 10px;
            margin-top: 20px;
            color: #D7E9FF;
            border-left: 5px solid #1070E7;
            font-size: 18px;
            overflow: hidden;
            .titleName{
                float: left;
            }
            .helpicon{
                float: left;
                margin-left: 10px;
                cursor: pointer;
            }
        }
        .list{
            margin: 20px;
        }
    }
}
</style>




