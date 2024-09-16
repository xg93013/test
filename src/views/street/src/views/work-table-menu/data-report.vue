<style lang="sass" type="stylesheet/sass">

    @import "../../styles/common.scss";
    .data-report {
        @include routerViewCommon;
        @include normalStyle(null, 80%);
        .filterArea {
            @include positionStyle(relative);
            >div{
                @include clearFloat;
                @include normalStyle(null, 40px,40px);
                // vertical-align: middle;
                &.businesssType {
                    margin-bottom : 10px;
                }
            }
            .showGeneratedDatareport {
                @include positionStyle(absolute);
                top : 0;
                right : 0;
            }
            span,.input {
                @include float(left);
                @include edgeStyle(5px 0px);
                @include normalStyle(100px,32px,32px);
                margin-right: 20px;

                &.filter-item {
                    // @include normalStyle();
                    // background: red;
                    text-align: center;
                    cursor: pointer;
                    &.selected {
                        background-color:#2d8cf0;
                        color : white;
                    }
                }
                &.filter-title {
                    @include normalStyle(70px);
                    text-align: right;
                }

                &.searchBtn {
                    background-color : #2d8cf0;
                    text-align: center;
                    cursor: pointer;
                    color : white;
                    border-radius:2px;
                }
            }

            .input {
                @include positionStyle(relative);
                bottom : 2px;
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
    <div class="data-report">
        <div class="filterArea">
            <div class="businesssType">
                <span class="filter-title">业务：</span>
                <span  v-for="item,index in filterModel.businesssTypeList" :id="index" ref="filterItem" class="filter-item" @click="businessTypeClick(item)">{{item}}</span>
            </div>
            <div class="keyWord">
                <span class="filter-title">关键词：</span>
                <Input class="input" v-model="filterModel.keyWord" placeholder="请输入搜索关键字" style="width: 200px" @on-blur="keyWordBlur">
                    
                </Input>
                <span class="searchBtn" @click="getDataReortData">查询</span>
            </div>
            <Button class="showGeneratedDatareport" @click="showGeneratedDatareport" v-text="btnModel.showGeneratedDatareport.label" :type="btnModel.showGeneratedDatareport.type"></Button>
        </div>
        <div class="tableArea">
            <Table border :columns="gridModel.columns" :data="gridModel.data"></Table>
            <div style="float: right;" class="pagination">
                <Page :total="gridModel.pagination.total" :current.sync="gridModel.pagination.currentPage" :page-size="gridModel.pagination.pageSize" @on-change="changePage" :show-total="true" :show-elevator="true" size="small"></Page>
            </div>
        </div>
        <!-- 已生成列表 -->
        <generatedDatareport :show.sync="modalModel.show" @closeModal="modalModel.show=false"></generatedDatareport>
        <Modal v-model="selectTimeModel.showModal" :title="selectTimeModel.title" @on-ok="confirmSelectTime" @on-cancel="cancelSelectTime" :mask-closable="false" width="300px" class-name="selectTime">
            <DatePicker v-show="selectTimeModel.currentType==selectTimeModel.month.timeType" :type="selectTimeModel.month.timeType" :placeholder="selectTimeModel.month.placeHolder" style="width: 200px" v-model="selectTimeModel.month.value" :format="selectTimeModel.month.format" @on-change="monthChange"></DatePicker>
            <DatePicker v-show="selectTimeModel.currentType==selectTimeModel.daterange.timeType" :type="selectTimeModel.daterange.timeType" :placeholder="selectTimeModel.daterange.placeHolder" style="width: 200px" v-model="selectTimeModel.daterange.value" :format="selectTimeModel.daterange.format" @on-change="daterangeChange"></DatePicker>
        </Modal>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    import generatedDatareport from "./generated-datareport.vue";
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
                        title: '报表名称',
                        key: 'name',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '所属业务',
                        key: 'businessName',
                        className : "columnsCommon"
                        // width: 100
                    },{
                        title: '操作',
                        key: 'action',
                        className : "columnsCommon operte",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on : {
                                        click : function () {
                                            drVM.generateTable(params);
                                        }
                                    }/*,
                                    style : {
                                        "text-decoration-line": "underline",
                                        "text-underline-position": "under"
                                    }*/
                                }, '生成报表')]);
                        }
                    }],
                    data : [],
                    pagination : {
                        total : 0,
                        pageSize : 10,
                        currentPage : 1
                    }
                },
                btnModel : {
                    showGeneratedDatareport : {
                        label : "查看已生成报表",
                        type : "primary"
                    }
                },
                modalModel : {
                    show : false
                },
                selectTimeModel : {
                    showModal : false,
                    currentType : "month",
                    title : "选择生成时间",
                    currentDatareportName : "",
                    month : {
                        show : false,
                        timeType : "month",
                        placeHolder : "请选择月份",
                        value : dateByMonth,
                        format : "yyyy-MM"
                    },
                    daterange : {
                        show : false,
                        timeType : "daterange",
                        placeHolder : "请选择时间范围",
                        value : [dateByDay, dateByDay],
                        format : "yyyy-MM-dd"
                    }
                    
                }
            }
        },
        methods: {
            changePage : function (args) {
                this.gridModel.pagination.currentPage = args;
                getDataReortData();
            },
            businessTypeClick : function (name) {

                this.filterModel.selectedBuisnessType = name;
                
            },
            // 查看已生成报表
            showGeneratedDatareport : function () {
                this.modalModel.show = true;
            },
            getDataReortData : function () {
                
                getDataReortData();
            },
            keyWordBlur : function () {
                this.filterModel.keyWord = _.trim(this.filterModel.keyWord);
            },
            confirmSelectTime : function () {
                this.selectTimeModel.showModal = false;
                var filterPostfix = "";
                var params = {
                    reportName : this.selectTimeModel.currentDatareportName
                }

                switch (this.selectTimeModel.currentType) {
                    case "month" : 
                        // filterPostfix = "&time=" + ;
                        params.time = this.dateToJSON(this.selectTimeModel.month.value);
                        break;
                    case "daterange" : 
                        // filterPostfix = "&startTime=" + this.dateToJSON(this.selectTimeModel.daterange.value[0]) + "&endTime=" + this.dateToJSON(this.selectTimeModel.daterange.value[1]);
                        params.startTime = this.dateToJSON(this.selectTimeModel.daterange.value[0]);
                        params.endTime = this.dateToJSON(this.selectTimeModel.daterange.value[1]);
                        break;
                }

                generateDataReport(params);
            },
            dateToJSON : function (date) {
                // return date.toJSON().split("T")[0] + " " + date.toJSON().split("T")[1].split(".")[0];
                return date.toLocaleDateString().replace(/[/]/g,"-") + " " + date.toTimeString().split(" ")[0];
            },
            cancelSelectTime : function () {
                this.selectTimeModel.showModal = false;
            },
            // 生成报表
            generateTable : function (args) {
                this.selectTimeModel.currentDatareportName = args.row.name;
                switch (args.row.selectType+"") {
                    case "1" : 
                        generateDataReport({reportName:args.row.name});
                        break;
                    case "2" : 
                        this.selectTimeModel.showModal = true;
                        this.selectTimeModel.month.value = dateByMonth;
                        // this.selectTimeModel.month.show = true;
                        this.selectTimeModel.currentType = "month";
                        // this.selectTimeModel.daterange.show = false;
                        break;
                    case "3" : 
                        this.selectTimeModel.showModal = true;
                        this.selectTimeModel.daterange.value = [dateByDay,dateByDay];
                        // this.selectTimeModel.month.show = false;
                        this.selectTimeModel.currentType = "daterange";
                        // this.selectTimeModel.daterange.show = true;
                        break;
                }
            },
            monthChange : function (args) {
                // console.log(args);
                // this.selectTimeModel.month.value = args;
            },
            daterangeChange : function (args) {
                // console.log(args)
                // this.selectTimeModel.daterange.value = args;
            }
        },
        created : function () {
            drVM = this;
            getBusinessType(this);
            getDataReortData();
        },
        mounted : function () {
            var permissionList = utilService.getRolePermisson();
            // this.$refs.filterItem[0].className = "filter-item selected";
        },
        watch : {
            "filterModel.selectedBuisnessType" : {
                handler : function (n, o) {
                    _.forEach(drVM.$refs.filterItem, function (item, index) {
                        // if (name == item.innerText) {
                        //     drVM.$refs.filterItem[index].className = "filter-item selected";
                        // } else {
                            drVM.$refs.filterItem[index].className = "filter-item";
                        // }

                    });
                    getDataReortData();
                    drVM.$nextTick(function() {
                        var tempIndex = _.findIndex(drVM.$refs.filterItem, function (item) {
                            return item.innerText == n;
                        });
                        drVM.$refs.filterItem[tempIndex].className = "filter-item selected";
                    });
                }
            }
        },
        components : {
            generatedDatareport : generatedDatareport
        },
    }

function generateDataReport (args) {
    // alert("生成报表");
    // communicationService.post(utilService.getResourceUrl("report/generate?reportName="+drVM.selectTimeModel.currentDatareportName+args||""), {},function () {
    //     drVM.selectTimeModel.currentDatareportName = "";

    // }, function () {

    // });
    communicationService.post(utilService.getResourceUrl("/report/generate"), args, function (result) {
        drVM.selectTimeModel.currentDatareportName = "";

        modalService.open({
            type : "success",
            title: "生成“" + args.reportName + "”成功",
            content: "报表生成中...<br/>请稍后点击“"+drVM.btnModel.showGeneratedDatareport.label+"”进行查看或下载。",
            onOk : function () {}
        });
    }, function (result) {

    });
}

function getBusinessType (vm) {
    communicationService.get(utilService.getResourceUrl("/catalog/report-business"), function (result) {
        if (result.state.code != 0) {
            return;
        }
        var tempArray = result.data;
        tempArray.unshift("不限");
        vm.filterModel.selectedBuisnessType = "不限";
        vm.filterModel.businesssTypeList = tempArray;
        // vm.$nextTick(function () {
        //     vm.$refs.filterItem[0].className = "filter-item selected";
        // });
    }, function (result) {
        
    });
}

// 查询所有报表
function getDataReortData () {
    // communicationService.get(utilService.getResourceUrl();
    communicationService.get(getFilterUrl("/report/page-list"), function (result) {
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
        tempUrl += "&businessName=" + drVM.filterModel.selectedBuisnessType;
    }
    if (drVM.filterModel.keyWord != "") {
        tempUrl += "&name=" + drVM.filterModel.keyWord;
    }
    return utilService.getResourceUrl(tempUrl);
}

</script>
