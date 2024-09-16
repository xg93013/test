<style lang="sass" type="stylesheet/sass">

    @import "../../styles/common.scss";
    .ivu-modal-body {
        @include clearFloat;
        .columnsCommon {
            text-align: center;
        }
        .pagination {
            @include edgeStyle(null, 10px 0px);
        }
    }
    .exporBtn {
        // @include normalStyle(20px,17px);
        // @include positionStyle(absolute, 3, 15px,10px);
        // @include backGroundImg();
        // @include backGroundImg(url("../../img/export.png"),no-repeat);
        color: #495060;
        cursor: pointer;
        &:hover {
            // background-color : #1c8de0;
            // @include backGroundImg(url("../../img/export-hover.png"),no-repeat);
        }
    }
</style>
<template>
    <div class="datareportTable">
        <Modal v-model="showModal" :title="title" @on-ok="confirmFn" @on-cancel="cancalFn" :mask-closable="false" width="1500px" height="100px">
            <div class="tableArea">
                <Table border :columns="gridModel.columns" :data="gridModel.data"></Table>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    // import dataReport from './data-report.vue';

    var drtVM;

    export default {
        // components : {
        //     // dataReport : dataReport
        // },
        props : {
            show : {
                type : Boolean
            }
        },
        data : function (argument) {
            return {
                title : "已生成报表",
                showModal : this.show,
                gridModel : {
                    columns : [{
                        title: '序号',
                        key: 'sequenceNumber',
                        className : "columnsCommon",
                        width: 100
                    },{
                        title: '报表名称',
                        key: 'name',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '所属业务',
                        key: 'business',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '生成时间',
                        key: 'addTime',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '操作',
                        key: 'action',
                        className : "columnsCommon operte",
                        render: (h, params) => {
                            let rights=JSON.parse(sessionStorage.getItem("szlUserRights"));
                            let domArr=[];
                            if(rights.create_report_query){
                                domArr.push(h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on : {
                                        click : function () {
                                            drtVM.viewGenerateTable(params);
                                        }
                                    }
                                }, '查看'))
                            }
                            if(rights.create_report_download){
                                domArr.push( h("a", {
                                            props : {
                                                // href : utilService.getResourceUrl("/report/export?id="+params.row.id)
                                            },
                                            attrs : {
                                                href : utilService.getResourceUrl("/report/export?id="+params.row.id),
                                                download : params.row.fullName,
                                                class : "exporBtn table-btn"
                                            },
                                            style : {
                                                // "display" : "inline-block",
                                                // "height" : "100%"
                                            }
                                        },[h("span", {

                                        },"下载")]
                                        ))
                            }
                            return h('div',domArr);
                        }
                    }],
                    data : [],
                    pagination : {
                        total : 0,
                        pageSize : 10,
                        currentPage : 1
                    }
                }
            }
        },
        methods: {
            confirmFn : function () {
                this.showModal = false;
                this.$emit("closeModal");
            },
            cancalFn : function () {
                this.showModal = false;
                this.$emit("closeModal");
            },
            viewGenerateTable : function (args) {
                var tempWindow = window.open();
                if (!tempWindow) {
                    utilService.handleException("浏览器已禁止弹出式窗口，请在浏览器设置中设置允许弹出式窗口。");
                    return;
                }
                communicationService.get(utilService.getResourceUrl("/report/query?id=" + args.row.id), function (result) {
                    if (result.state.code != 0) {
                        tempWindow.close();
                        utilService.handleException(result);
                    } else {
                        tempWindow.document.write(result.data);
                    }
                    
                }, function (result) {
                    utilService.handleException(result);
                });
            },
            changePage : function (args) {
                this.gridModel.pagination.currentPage = args;
                getDataReortList();
            }
        },
        created : function () {
            drtVM = this;
        },
        mounted : function () {

        },
        watch : {
            "show" : {
                handler : function (n, o) {
                    if (n == o) {
                        return;
                    }
                    this.showModal = this.show;
                    if (n) {
                        getDataReortList();
                    }
                }
            }
        }
    }
/*
    查询已生成报表列表
*/
function getDataReortList () {
    // communicationService.get(utilService.getResourceUrl();
    communicationService.get(getFilterUrl("/report/generated-list"), function (result) {
        if (result.state.code == 0 && result.data) {
            drtVM.gridModel.data = result.data;
            // drtVM.gridModel.pagination.total = result.data.totalCount;
        }
    }, function (result) {
        
    });
}

function getFilterUrl (baseUrl) {
    var tempUrl = baseUrl + "?pageNo="+drtVM.gridModel.pagination.currentPage + "&pageSize="+drtVM.gridModel.pagination.pageSize;
    return utilService.getResourceUrl(tempUrl);
}
</script>
