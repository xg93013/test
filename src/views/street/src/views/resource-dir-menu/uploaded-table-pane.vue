<style lang="sass" type="stylesheet/sass">

    @import "../../styles/common.scss";
    .uploaded-table {
        @include routerViewCommon;
        @include normalStyle(null, 80%);
        .filterArea {
            @include positionStyle(relative);
            >div{
                @include clearFloat;
                // @include normalStyle(null, 30px,30px);
                // vertical-align: middle;
                &.businesssType {
                    margin-bottom : 10px;
                }
                &.dateFilter {
                    margin-bottom : 10px;
                }
            }
            .filter-content {
                @include float(left);
                @include clearFloat;
                @include normalStyle(92%);
            }
            .keyWordInput {

            }
            // span {
                // margin-right: 20px;
                
            .filter-item {
                @include float(left);
                padding: 0 20px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                cursor: pointer;
                &.selected {
                    background-color:#2d8cf0;
                    color : white;
                }
            }
            .filter-title {
                @include float(left);
                @include normalStyle(8%,32px,32px);
                padding-right : 20px;
                text-align: right;
            }

            .searchBtn {
                // @include float(left);
                // @include edgeStyle(3px 0px);
                @include normalStyle(100px,32px,32px);
                display: inline-block;
                background-color : #2d8cf0;
                text-align: center;
                cursor: pointer;
                color : white;
                border-radius:2px;
                margin-left: 10px;
            }

            .input {
                // @include positionStyle(relative);
                // bottom : 2px;
                // @include float(left);
                // @include edgeStyle(5px 0px);
                // @include normalStyle(8%,20px,20px);
            }
        }
        .tableArea {
            
            .columnsCommon {
            }
            .pagination {
            }
        }
    }
    .selectTime {
        .ivu-modal-body {
            text-align: center;
        }
    }

</style>
<template>
    <div class="uploaded-table">
        <div class="filterArea">
             <div class="businesssType">
                <!-- <Col span="2"> -->
                    <span class="filter-title">业务：</span>
                <!-- </Col> -->
                <!-- <Col span="22"> -->
                    <div class="filter-content">
                        <span  v-for="item,index in filterModel.businesssTypeList" :id="index" ref="filterItem" class="filter-item" @click="businessTypeClick(item)">{{item}}</span>
                    </div>
                <!-- </Col> -->
            </div>
            <div class="dateFilter">
                <!-- <Col span="1"> -->
                    <span class="filter-title">上传日期：</span>
                <!-- </Col>
                <Col span="23"> -->
                    <DatePicker :type="selectTimeModel.timeType" :placeholder="selectTimeModel.placeHolder" style="width: 200px" :value="selectTimeModel.value" :format="selectTimeModel.format" @on-change="dateChange"></DatePicker>
                <!-- </Col> -->
            </div>
            <div class="keyWord">
                <!-- <Col span="1"> -->
                    <span class="filter-title">关键词：</span>
                <!-- </Col>
                <Col span="23"> -->
                    <Input class="input" v-model="filterModel.keyWord" placeholder="请输入搜索关键字" style="width: 200px" @on-blur="keyWordBlur">
                    
                    </Input>
                    <span class="searchBtn" @click="getUploadedData">查询</span>
                <!-- </Col> -->
            </div>
        </div>
        <div class="tableArea">
            <Table border :columns="gridModel.columns" :data="gridModel.data"></Table>
            <div style="float: right;" class="pagination">
                <Page :total="gridModel.pagination.total" :current.sync="gridModel.pagination.currentPage" :page-size="gridModel.pagination.pageSize" @on-change="changePage" :show-total="true" :show-elevator="true" size="small"></Page>
            </div>
        </div>
        <Modal v-model="deleteConfirmModel.show" :title="deleteConfirmModel.title" @on-ok="confirmDelete" :mask-closable="false" width="300px" class-name="customConfirmModal">
            <Icon type="android-alert" color="#f90" size="30" />
            <span>{{deleteConfirmModel.content}}</span>
        </Modal>
        <Modal v-model="viewSelectSheetModel.show" :title="viewSelectSheetModel.title" @on-ok="viewSelectSheetModel.confirmSelect" :mask-closable="false" @on-visible-change="viewSelectSheetModel.visibleChange" width="300px" class-name="viewSelectSheetModel">
            <h4>请选择需要查看的工作表：</h4>
            <!-- <Select v-model="model1" style="width:200px"> -->
            <Select v-model="viewSelectSheetModel.sheetId">
                <template v-for="item,index in viewSelectSheetModel.data">
                    <Option :value="item.value" :key="item.value">{{ item.label }}</Option>
                </template>
            </Select>
        </Modal>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    var drVM;
    var systemDate = new Date(),
        dateByDay = new Date(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate()),
        dateByMonth = new Date(systemDate.getFullYear(), systemDate.getMonth(), 1);
    export default {
        data : function (argument) {
            return {
                filterModel : {
                    businesssTypeList : [],
                    selectedBuisnessType : "",
                    keyWord : ""
                },
                gridModel : {
                    columns : [{
                        title: '序号',
                        key: 'sequenceNumber',
                        className : "columnsCommon",
                        width: 100
                    },{
                        title: '表格名称',
                        key: 'name',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '所属业务',
                        key: 'business',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '上传时间',
                        key: 'uploadTime',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '上传人',
                        key: 'realName',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '操作',
                        key: 'action',
                        className : "columnsCommon operte",
                        render: (h, params) => {
                            let rights=JSON.parse(sessionStorage.getItem("szlUserRights"));
                            let domArr=[];
                            if(rights.have_upload_table_query){//查看
                                domArr.push(h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on : {
                                            click : function () {
                                                viewUploadTabel(params);
                                            }
                                        }
                                    }, '查看'))
                            }
                            if(rights.have_upload_table_download){//下载
                                domArr.push( h("a", {
                                            props : {
                                                // href : utilService.getResourceUrl("/report/export?id="+params.row.id)
                                            },
                                            attrs : {
                                                href : utilService.getResourceUrl("/excel/upload-excel-export?id="+params.row.id),
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
                            if(rights.have_upload_table_delete){//删除
                                domArr.push(h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on : {
                                            click : function () {
                                                deleteUploadTabel(params);
                                            }
                                        }
                                    }, '删除'))
                            }
                            return h('div', domArr);
                        }
                    }],
                    data : [],
                    pagination : {
                        total : 0,
                        pageSize : 8,
                        currentPage : 1
                    }
                },
                btnModel : {

                },
                modalModel : {
                    show : false
                },
                selectTimeModel : {
                    show : false,
                    timeType : "date",
                    placeHolder : "请选择日期",
                    value : "",
                    format : "yyyy-MM-dd"
                },
                deleteConfirmModel : {
                    show : false,
                    title : "确认",
                    content : "",
                    deleteName : "",
                    deleteID : ""
                },
                viewSelectSheetModel : {
                    show : false,
                    title : "选择工作表",
                    content : "",
                    sheetId : "",
                    excelID : "",
                    data : [],
                    confirmSelect : function (args) {
                        var tempWindow = window.open();
                        if (!tempWindow) {
                            utilService.handleException("浏览器已禁止弹出式窗口，请在浏览器设置中设置允许弹出式窗口。");
                            return;
                        }
                        communicationService.get(utilService.getResourceUrl("/excel/upload-excel-query?id="+drVM.viewSelectSheetModel.excelID+"&sheetId="+drVM.viewSelectSheetModel.sheetId), function (result) {
                            
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
                    visibleChange : function (bool) {
                        if (!bool) {
                            drVM.viewSelectSheetModel.data = [];
                            drVM.viewSelectSheetModel.excelID = "";
                            drVM.viewSelectSheetModel.sheetId = "";
                        }
                    }
                }
            }
        },
        methods: {
            changePage : function (args) {
                this.gridModel.pagination.currentPage = args;
                getUploadedData();
            },
            businessTypeClick : function (name) {
                
                this.filterModel.selectedBuisnessType = name;
                
            },
            getUploadedData : function () {
                
                getUploadedData();
            },
            keyWordBlur : function () {
                this.filterModel.keyWord = _.trim(this.filterModel.keyWord);
            },
            dateToJSON : function (date) {
                // return date.toJSON().split("T")[0] + " " + date.toJSON().split("T")[1].split(".")[0];
                return date.toLocaleDateString().replace(/[/]/g,"-") + " " + date.toTimeString().split(" ")[0];
            },
            dateChange : function (args) {
                // console.log(args);
                // this.selectTimeModel.month.value = args;
                this.selectTimeModel.value = args;
                getUploadedData();
            },
            confirmDelete : function () {
                communicationService.post(utilService.getResourceUrl("/excel/upload-excel-delete"), {
                    id:drVM.deleteConfirmModel.deleteID}, function (result) {
                // drVM.renameModel.show = false;
                    // setTimeout(function () {
                        utilService.handleResult(result, function(res) {
                            modalService.open({
                                type : "success",
                                title : "删除成功",
                                content : "删除已上传表格“"+drVM.deleteConfirmModel.deleteName+"”成功",
                                onOk : getUploadedData,
                                // loading : true
                            });
                        });
                    // },0);
                    
                }, function (result) {
                    utilService.handleException(result);
                });
            }
        },
        created : function () {
            drVM = this;
            getBusinessType(this);
            getUploadedData();
        },
        mounted : function () {
            var permissionList = utilService.getRolePermisson();
            // this.$refs.filterItem[0].className = "filter-item selected";
        },
        watch : {
            "filterModel.selectedBuisnessType" : {
                handler : function (n, o) {
                    getUploadedData();
                    drVM.$nextTick(function() {
                        _.forEach(drVM.$refs.filterItem, function (item, index) {
                            // if (name == item.innerText) {
                            //     drVM.$refs.filterItem[index].className = "filter-item selected";
                            // } else {
                            drVM.$refs.filterItem[index].className = "filter-item";
                            // }
                        });
                        var tempIndex = _.findIndex(drVM.$refs.filterItem, function (item) {
                            return item.innerText == n;
                        });
                        drVM.$refs.filterItem[tempIndex].className = "filter-item selected";
                    });
                }
            }
        }
    }

function getBusinessType (vm) {
    communicationService.get(utilService.getResourceUrl("/catalog/business"), function (result) {
        if (result.state.code != 0) {
            return;
        }
        var tempArray = result.data;
        tempArray.unshift("不限");
        vm.filterModel.selectedBuisnessType = "不限";
        vm.filterModel.businesssTypeList = tempArray;
    }, function (result) {
        
    });
}

// 查询所有报表
function getUploadedData () {
    // communicationService.get(utilService.getResourceUrl();
    communicationService.get(getFilterUrl("/excel/upload-excel-list"), function (result) {
        if (result.state.code == 0 && result.data) {
            drVM.gridModel.data = result.data.resultDatas;
            drVM.gridModel.pagination.total = result.data.totalCount;
            
        }
    }, function (result) {
        
    });
}

function getFilterUrl (baseUrl) {
    var tempUrl = baseUrl + "?pageNo="+drVM.gridModel.pagination.currentPage + "&pageSize="+drVM.gridModel.pagination.pageSize;
    if (drVM.filterModel.selectedBuisnessType != "" && drVM.filterModel.selectedBuisnessType != "不限") {
        tempUrl += "&business=" + drVM.filterModel.selectedBuisnessType;
    }
    if (drVM.filterModel.keyWord != "") {
        tempUrl += "&name=" + drVM.filterModel.keyWord;
    }
    if (drVM.selectTimeModel.value != "") {
        tempUrl += "&uploadTime=" + drVM.selectTimeModel.value + " 00:00:00";
    }
    return utilService.getResourceUrl(tempUrl);
}

function viewUploadTabel (args) {
    drVM.viewSelectSheetModel.show = true;

    drVM.viewSelectSheetModel.data = _.map(args.row.sheets, function(item) {
        return {
            value : item.id,
            label : item.sheetName
        }
    });
    drVM.viewSelectSheetModel.excelID = args.row.id;
    drVM.viewSelectSheetModel.sheetId = drVM.viewSelectSheetModel.data[0].value;
    
}

function downloadUploadTabel () {

}

function deleteUploadTabel (args) {
    drVM.deleteConfirmModel.show = true;
    drVM.deleteConfirmModel.content = "确认删除已上传表格“"+args.row.name+"”？";
    drVM.deleteConfirmModel.deleteName = args.row.name;
    drVM.deleteConfirmModel.deleteID = args.row.id;
}

</script>
