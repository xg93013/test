<template>
    <div class="resultPage">
        <div class="top-nav">
            <div class="items">核查总数<span @click="filterData('total')">{{allStatus.total}}</span>家</div>
            <div class="items">下线<span @click="filterData('offline')">{{allStatus.offline}}</span>家</div>
            <div class="items">责令整改<span @click="filterData('change')">{{allStatus.change}}</span>家</div>
            <div class="items">待再核查<span @click="filterData('check')">{{allStatus.check}}</span>家</div>
            <div class="items">合规<span @click="filterData('normal')">{{allStatus.normal}}</span>家</div>
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
    INSPECT_LIST,
    INSPECT_STATUS
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
                offline: 0,
                check: 0,
                normal: 0,
                change: 0,
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
                        title: "平台",
                        // width: 140,
                        key: "platform",
                        ellipsis: true,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.platform,
                                        placement: "top-start"
                                    }
                                },
                                params.row.platform
                            );
                        }
                    },
                    {
                        title: "地址",
                        key: "address",
                        ellipsis: true,
                        // width: 100,
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
                    },
                    {
                        title: "核查单位",
                        // width: 140,
                        key: "inspectUnit",
                        ellipsis: true,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.inspectUnit,
                                        placement: "top-start"
                                    }
                                },
                                params.row.inspectUnit
                            );
                        }
                    },
                    {
                        title: "核查原因",
                        key: "inspectReason",
                        ellipsis: true,
                        width: 100,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.inspectReason,
                                        placement: "top-start"
                                    }
                                },
                                params.row.inspectReason
                            );
                        }
                    },
                    {
                        title: "核查情况",
                        // width: 140,
                        key: "inspectResult",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.inspectResult,
                                        placement: "top-start"
                                    }
                                },
                                params.row.inspectResult
                            );
                        }
                    },
                    {
                        title: "处置结果",
                        // align: "right",
                        key: "proposeResult",
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
    props: ['time', 'updateData'],
    watch: {
        time(newTime){
            this.initData();
        },
        updateData(update){
            console.log(update);
            if(update){
                this.initData();
            }
        }
    },
    created(){},
    methods: {
        showTableData(){
            this.$refs.resultTable.getTableMsg(INSPECT_LIST+'/'+this.year+'/'+this.month, this.currentStatus);
        },
        filterData(type){
            this.currentStatus = type;
            this.initData();
        },
        async getAllStatus(){
            let res = await http.get(INSPECT_STATUS+'/'+this.year+'/'+this.month);
            if(res){
                let statusArr = res.data;
                for (let i = 0; i < statusArr.length; i++) {
                    this.allStatus[statusArr[i].status] = statusArr[i].count
                }
                if(this.allStatus.total == 0){
                    this.allStatus = {
                        offline: 0,
                        check: 0,
                        normal: 0,
                        change: 0,
                        total: 0
                    }
                }
            }
        },
        initData(){
            let time = JSON.parse(sessionStorage.getItem('listTime'));
            let year = time.year;
            let month = time.msg;
            this.year = year;
            this.month = month.substring(0,month.indexOf('月'));
            this.showTableData();
            this.getAllStatus();
        }
    },
    mounted(){
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
        top: 100px;
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




