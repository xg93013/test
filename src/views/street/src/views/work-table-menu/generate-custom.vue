<style lang="sass" type="stylesheet/sass">

    @import "../../styles/common.scss";
    .generateCustomModal {
        .ivu-modal-body {
            @include edgeStyle(null, 15px 30px);
            .content {
                @include normalStyle(null,650px);
                .originTableAndcorrelationTable {
                    @include clearFloat();

                    .origionArea {
                        @include normalStyle(38%);
                        @include edgeStyle(0 4% 0 0);
                        @include float(left);
                    }
                    .correlationArea {
                        @include normalStyle(58%);
                        @include float(left);
                    }
                }
                .ivu-table-header {
                    .operte {
                        .ivu-table-cell {
                            @include positionStyle(relative);
                            right : 7px;
                        }
                    }
                }
                .filterArea {
                    @include edgeStyle(null, 10px 0);
                }
                .tip {
                    padding-bottom: 5px;
                }
                // 选择导出字段
                .selectKeyords {
                    @include normalStyle(null, 100%);
                    @include positionStyle(relative);
                    .selectKeyords_tip {
                        // @include positionStyle(absolute);

                    }
                    .selectKeyords__checkGroups{
                        @include normalStyle(null, 620px);
                        // @include edgeStyle(null, 30px 0 0 0);
                        overflow: auto;
                        .selectKeyords__checkGroup {
                            @include edgeStyle(null, 10px 0)
                            // &:not(:last-of-type) {
                            //     border-bottom : 1px solid #e9eaec;
                            // }
                            border-top : 1px solid #e9eaec;
                            .checkAllArea {
                                margin-bottom: 5px;
                                .checkAll__title {

                                    font-size:16px;
                                    font-weight: 700;
                                }
                            }

                            .ivu-checkbox-group {
                                .ivu-checkbox-group-item {
                                    // 选择字段每个占10，看起来整齐一些
                                    @include normalStyle(10%);
                                }
                            }
                        }
                    }
                }
                // 第三页确认页面
                .result {
                    @include clearFloat;
                    .result__item {
                        @include float(left);
                        @include positionStyle(relative);
                        @include edgeStyle(null, 30px 50px);

                        @include normalStyle(null, 400px);
                        .leftField, .rightField {
                            @include positionStyle(absolute);
                            top : 45%;
                        }
                        .leftField {
                            left:0px;
                        }
                        .rightField {
                            right:0px;
                        }
                        p{
                            margin-bottom: 5px;
                        }
                        .result__item__title {
                            font-weight: 700;
                        }
                    }
                }
            }
            .stepsArea {
                @include edgeStyle(null, 10px 0);
            }
        }
        .ivu-modal-footer {
            .downloadBtn {
                @include positionStyle(relative);
                a {
                    @include normalStyle(100%, 100%);
                    @include positionStyle(absolute);
                    display: inline-block;
                    top : 0;
                    left: 0;
                }
            }
        }
    }
</style>
<style lang="sass" type="stylesheet/sass" scoped>
    .correlateOption__cascader {
        &:first-of-type {
            margin-bottom: 10px;
        }
    }
</style>
<template>
    <div class="generateCustom">
        <Modal class-name="generateCustomModal" v-model="modal.show" :title="modal.title" :mask-closable="false" width="90" height="800">
            <Steps :current="stepModel.current" class="stepsArea">
                <template v-for="item,index in stepModel.steps">
                    <Step :title="item.title"></Step>
                </template>
            </Steps>
            <div class="content">
                <div class="createCorrelation" v-show="stepModel.current==0">
                    <div class="filterArea">
                        <Select v-model="wizardModel.createCorrelation.select.value" placeholder="请选择业务" style="width:200px">
                            <Option v-for="item,index in wizardModel.createCorrelation.select.options" :value="item" :key="item">
                                {{ item }}
                            </Option>
                        </Select>
                        <Input class="input" v-model="wizardModel.createCorrelation.search.value" placeholder="请输入搜索关键字" style="width: 200px" @on-blur="keyWordBlur">
                        </Input>
                        <!-- <span class="searchBtn" @click="getOriginExcels">查询</span> -->
                        <Button type="primary" class="searchBtn" @click="getOriginExcels">{{btnModel.search.text}}</Button>
                    </div>
                    <div class="tip">请逐个添加需要关联的原始表格并设置关联的字段，最多添加6张表。若只导出1张原始表格的数据，则不需设置关联的字段。

</div>
                    <Button type="primary" class="correlateBtn" @click="correlateExcels" :disabled="!btnModel.correlate.able" v-show="false">{{btnModel.correlate.text}}</Button>
                    <Button type="primary" class="selectBtn" @click="selectExcel" :disabled="!btnModel.select.able">{{btnModel.select.text}}</Button>
                    <div class="originTableAndcorrelationTable">
                        <div class="origionArea">
                            <div class="originExcelArea">
                                <!-- <h5>原始表</h5> -->
                                
                                <div class="tableArea">
                                    <Table border :columns="wizardModel.createCorrelation.originTable.columns" :data="wizardModel.createCorrelation.originTable.data" height="500" @on-selection-change="selectionChange" :highlight-row="true" @on-current-change="selectionChange"></Table>
                                </div>
                            </div>
                        </div>
                        <div class="correlationArea">
                            <!-- <h5>已选表</h5> -->
                            <div class="tableArea">
                                <Table border :columns="wizardModel.createCorrelation.correlationTable.columns" :data="wizardModel.createCorrelation.correlationTable.data" height="500" :no-data-text="wizardModel.createCorrelation.correlationTable.nullTip"></Table>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 第二页，选择导出的字段 -->
                <div class="selectKeyords" v-show="stepModel.current==1">
                    <h3 class="selectKeyords_tip">*请勾选要导出的数据项。</h3>
                    <div class="selectKeyords__checkGroups">
                        <template v-for="item,key in wizardModel.createCorrelation.correlationTable.dataMap">
                            <div class="selectKeyords__checkGroup">
                                <div class="checkAllArea">
                                    <Checkbox :indeterminate="wizardModel.createCorrelation.correlationTable.dataMap[item.sheetCode].indeterminate" :value="wizardModel.createCorrelation.correlationTable.dataMap[item.sheetCode].checkAll" @click.prevent.native="handleCheckAll(item.sheetCode)">
                                        <span class="checkAll__title">{{item.sheetName}}</span>
                                    </Checkbox>
                                </div>
                                <CheckboxGroup v-model="wizardModel.createCorrelation.correlationTable.dataMap[item.sheetCode].checkValue" @on-change="checkChange(item.sheetCode)">
                                    <template v-for="checkItem,checkIndex in item.allField">
                                        <Checkbox :label="checkItem.label"></Checkbox>
                                    </template>
                                </CheckboxGroup>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- 第三页 展示导出结果 并可选择下载以及是否存在模板 -->
                <div class="result" v-show="stepModel.current==2">
                    <h3>已选择工作表</h3>
                        <template v-for="item,key in wizardModel.createCorrelation.correlationTable.data">
                            <div class="result__item" :style="{width:Math.floor(100/wizardModel.createCorrelation.correlationTable.data.length)+'%'}">
                                <p><span class="result__item__title">表名：</span>{{item.name}}</p>
                                <p><span class="result__item__title">工作表：</span>{{item.sheetName}}</p>
                                <p><span class="result__item__title">导出的数据项：</span>{{item.checkValue.join("，") || "无"}}</p>
                                <p><span class="result__item__title">左关联字段：</span>{{item.leftFieldName || "无"}}</p>
                                <p><span class="result__item__title">右关联字段：</span>{{item.rightFieldName || "无"}}</p>
                            </div>
                        </template>
                    </Row>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" v-show="btnModel.prev.show" @click="toPrev">{{btnModel.prev.text}}</Button>
                <Button type="primary" v-show="btnModel.next.show" @click="toNext" :disabled="!btnModel.next.able">{{btnModel.next.text}}</Button>
                <Button type="primary" v-show="btnModel.view.show" @click="viewCustom">{{btnModel.view.text}}</Button>
                <Button type="primary" v-show="btnModel.download.show" @click="downloadCustom" class="downloadBtn" style="position:relative;">
                    {{btnModel.download.text}}
                    <!-- {{btnModel.download.text}}
                    <a :href="btnModel.download.href" download="download"></a> -->
                </Button>
                <Button type="primary" v-show="btnModel.download.show" @click="saveTemplate">{{btnModel.saveTemplate.text}}</Button>
            </div>
        </Modal>
        <!-- 选择两表关联对话框 -->
        <Modal class-name="correlateOption" v-model="correlateOptionModal.show" :title="correlateOptionModal.title" :mask-closable="false" width="500">
            <!-- <template v-for="item,key in correlateOptionModal.datas">
                <Cascader :data="item.data" v-model="item.value" class="correlateOption__cascader" placeholder="请选择表格"></Cascader>
            </template> -->
            <h4>{{correlateOptionModal.one.parentName}}</h4>
            <Cascader :data="correlateOptionModal.one.data" v-model="correlateOptionModal.one.value" class="correlateOption__cascader" placeholder="请选择表格"></Cascader>
            <h4 v-show="correlateOptionModal.two.show">选择关联工作表</h4>
            <Cascader :data="correlateOptionModal.two.data" v-model="correlateOptionModal.two.value" class="correlateOption__cascader" placeholder="请选择表格" v-show="correlateOptionModal.two.show"></Cascader>
            <div slot="footer">
                <Button class="correlateOptionBtn" @click="cancelCorrelate" v-text="btnModel.correlateCancel.text" :type="btnModel.correlateCancel.type" :disabled="!btnModel.correlateCancel.able"></Button>
                <Button class="correlateOptionBtn" @click="confirmCorrelate" v-text="btnModel.correlateConfirm.text" :type="btnModel.correlateConfirm.type"></Button>
            </div>
        </Modal>
        <!-- 保存模板输入名字的对话框 -->
        <Modal class-name="saveTemplateNameInput" v-model="saveTemplateNameInputModel.show" :title="saveTemplateNameInputModel.title" :mask-closable="false">
            <!-- <h4>{{correlateOptionModal.one.parentName}}</h4> -->
            <Form ref="form" :model="saveTemplateNameInputModel.values" :rules="saveTemplateNameInputModel.rules">
                <FormItem prop="templateName">
                    <Input type="text" v-model="saveTemplateNameInputModel.values.templateName" :placeholder="saveTemplateNameInputModel.placeholder" @on-blur="saveTemplateNameInputModel.blur"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <!-- 确认及取消按钮样式文字均一样，只有调用函数不同 -->
                <Button class="correlateOptionBtn" @click="cancelTemplateName" v-text="btnModel.correlateCancel.text" :type="btnModel.correlateCancel.type"></Button>
                <Button class="correlateOptionBtn" @click="confirmTemplateName" v-text="btnModel.correlateConfirm.text" :type="btnModel.correlateConfirm.type"></Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    // import dataReport from './data-report.vue';

    var ecVM;

    export default {
        // components : {
        //     // dataReport : dataReport
        // },
        props : {
            value : {
                type : Boolean,
                default:false
            }
        },
        data : function (argument) {
            return {
                modal : {
                    show : this.value,
                    title : "自定义导出"
                },
                correlateOptionModal : {
                    show : false,
                    title : "选择",
                    one : {
                        data : [],
                        value : [],
                        parentName : ""
                    },
                    two : {
                        data : [],
                        value : [],
                        parentName : "",
                        show : true
                    },
                    datas : {}
                },
                saveTemplateNameInputModel : {
                    show : false,
                    title : "保存为模板",
                    value : "",
                    values : {
                        templateName : ""
                    },
                    rules : {
                        "templateName" : [{
                            required: true,
                            message: '模板名称不能为空',
                            trigger: 'change'
                        }]
                    },
                    placeholder : "请输入模板名称",
                    blur : function (argument) {
                        ecVM.saveTemplateNameInputModel.values.templateName=_.trim(ecVM.saveTemplateNameInputModel.values.templateName);
                    }
                },
                showModal : this.value,
                stepModel : {
                    current : 0,
                    steps : [{
                            title : "选择导出的表"
                        },
                        {
                            title : "选择导出字段"
                        },
                        {
                            title : "完成"
                        }
                    ]
                },
                wizardModel : {
                    createCorrelation : {
                        select : {
                            value : "全部",
                            options : []
                        },
                        search : {
                            value : ""
                        },
                        originTable : {
                            columns : [
                                // {
                                //     type: 'selection',
                                //     width : 60,
                                //     align : "center"
                                //     // className : "columnsCommon"
                                // },
                                {
                                    title: '原始表',
                                    key: 'name',
                                    align : "center"
                                    // className : "columnsCommon"
                                }
                            ],
                            data : [],
                            selection : [],
                            searchedData : {}
                        },
                        correlationTable : {
                            columns : [
                                {
                                    title: '表名',
                                    key: 'name',
                                    align : "center"
                                    // className : "columnsCommon"
                                },{
                                    title: '工作表',
                                    key: 'sheetName',
                                    align : "center"
                                    // className : "columnsCommon"
                                },{
                                    title: '左关联字段',
                                    key: 'leftField',
                                    align : "center"
                                    // className : "columnsCommon"
                                },{
                                    title: '右关联字段',
                                    key: 'rightField',
                                    align : "center"
                                    // className : "columnsCommon"
                                },{
                                //     title: '关联序号',
                                //     key: 'correlateNum',
                                //     align : "center"
                                //     // className : "columnsCommon"
                                // },{
                                    title: '操作',
                                    key: 'action',
                                    className : "columnsCommon operte",
                                    width : 100,
                                    align : "left",
                                    render: (h, params) => {
                                        return h('div', [
                                            /*h('Button', {
                                                props: {
                                                    type: 'text',
                                                    size: 'small'
                                                },
                                                on : {
                                                    click : function () {
                                                        drtVM.viewGenerateTable(params);
                                                    }
                                                }
                                            }, '查看')
                                            ,*/h('Button', {
                                                props: {
                                                    type: 'text',
                                                    size: 'small'
                                                },
                                                on : {
                                                    click : function () {
                                                        // drtVM.downLoadGenerateTable(params);
                                                        removeSelection(params);
                                                    }
                                                }
                                            }, ["删除"])
                                        ]);
                                    }
                                }
                            ],
                            nullTip : "暂无需要导出的表",
                            data : [],
                            dataMap : {}
                        }
                    }
                },
                btnModel : {
                    next : {
                        text : "下一步",
                        show : true,
                        able : false
                    },
                    prev : {
                        text : "上一步",
                        show : false
                    },
                    view : {
                        text : "查看",
                        show : false
                    },
                    download : {
                        text : "下载",
                        show : false,
                        href : "",
                        download : "download"
                    },
                    saveTemplate : {
                        text : "保存为模板",
                        show : false
                    },
                    search : {
                        text : "查询"
                    },
                    correlate : {
                        text : "关联并选择",
                        able : false
                    },
                    select : {
                        text : "添加",
                        able : false
                    },
                    correlateConfirm : {
                        text : "确定",
                        able : false,
                        type : "primary"
                    },
                    correlateCancel : {
                        text : "取消",
                        able : true,
                        type : "text"
                    }
                }
            }
        },
        methods: {
            toNext : function () {
                if (this.stepModel.current<this.stepModel.steps.length-1) {
                    this.stepModel.current++;
                }

                // if (this.stepModel.current==2) {
                //     this.btnModel.download.href = utilService.getResourceUrl("/excel/custom-export");
                //     var tempUrl = utilService.getResourceUrl("/excel/custom-query"),
                //         tempSheets = _.map(ecVM.wizardModel.createCorrelation.correlationTable.dataMap, function (item) {
                //             return {
                //                 getFields : _.cloneDeep(item.checkValue),
                //                 rightField : item.rightField,
                //                 sheetCode : item.sheetCode,
                //                 leftField : item.leftField
                //             }
                //         }),
                //         params = {sheets:tempSheets};
                // }
            },
            toPrev : function () {
                if (this.stepModel.current>0) {
                    this.stepModel.current--;
                }
            },
            viewCustom : function () {
                var tempUrl = utilService.getResourceUrl("/excel/custom-query"),
                    tempSheets = _.map(ecVM.wizardModel.createCorrelation.correlationTable.data, function (item) {
                        return {
                            getFields : _.cloneDeep(item.checkValue),
                            rightField : item.rightField,
                            sheetCode : item.sheetCode,
                            leftField : item.leftField
                        }
                    }),
                    params = {sheets:tempSheets};
                // 删掉第一个左关键字与最后一个右关键字
                delete(params.sheets[0].leftField);
                delete(params.sheets[params.sheets.length-1].rightField);
                var tempWindow = window.open();
                if (!tempWindow) {
                    utilService.handleException("浏览器已禁止弹出式窗口，请在浏览器设置中设置允许弹出式窗口。");
                    return;
                }
                communicationService.post(tempUrl,params, function (result) {
                    utilService.handleResult(result, function (res) {
                        tempWindow.document.write(result.data);
                    }, function (res) {
                        tempWindow.close();
                    });
                }, function (result) {
                    utilService.handleException(result);
                });
            },
            downloadCustom : function () {

                var iframeObj = document.createElement('iframe'),
                    formObj = document.createElement('form'),
                    inputObj = document.createElement('input'),
                    tempSheets = _.map(ecVM.wizardModel.createCorrelation.correlationTable.data, function (item) {
                        return {
                            getFields : _.cloneDeep(item.checkValue),
                            rightField : item.rightField,
                            sheetCode : item.sheetCode,
                            leftField : item.leftField
                        }
                    });
                delete(tempSheets[0].leftField);
                delete(tempSheets[tempSheets.length-1].rightField);

                iframeObj.id = "down-file-iframe";

                formObj.target = "down-file-iframe";
                formObj.method = "post";
                formObj.action = utilService.getResourceUrl("/excel/custom-export");

                inputObj.type = "hidden";
                inputObj.name = "sheets";
                inputObj.value = JSON.stringify(tempSheets);

                formObj.append(inputObj);
                iframeObj.append(formObj);
                document.body.append(iframeObj);
                formObj.submit();

                iframeObj.remove();
            },

            keyWordBlur : function () {
                this.wizardModel.createCorrelation.search.value = _.trim(this.wizardModel.createCorrelation.search.value);
            },
            getOriginExcels : function () {
                
                communicationService.get(getFilterUrl("/excel/excel-list"), function (result) {
                    if (result.state.code == 0) {
                        ecVM.wizardModel.createCorrelation.originTable.data = _.map(result.data, function (item) {
                            return {
                                name : item
                            }
                        });
                        ecVM.wizardModel.createCorrelation.originTable.selection = [];
                    } else {
                        utilService.handleException(result);
                    }
                }, function (result) {
                    utilService.handleException(result);
                });
            },
            selectionChange : function (selection, row) {
                if (_.isUndefined(selection.length)) {
                    selection = [selection];
                }
                this.wizardModel.createCorrelation.originTable.selection = selection || [];
                
            },
            correlateExcels : function () {
                var selection = this.wizardModel.createCorrelation.originTable.selection,
                    selectionNum = selection.length,
                    tempStr = _.map(selection, function (item) {
                        return "excelName=" + item.name;
                    }).join("&"),
                    tempUrl = utilService.getResourceUrl("/excel/excel-relation-list?"+tempStr);
                if (selectionNum <= 2 && selectionNum > 0) {
                    communicationService.get(tempUrl, function (result) {
                        utilService.handleResult(result, function (res) {
                            var tempData = res.data;
                            // ecVM.correlateOptionModal.datas = {};
                            // ecVM.correlateOptionModal
                            _.forEach(tempData, function (item, index) {
                                ecVM.correlateOptionModal.datas[item.name] = {
                                    data : _.map(item.children, function (subItem) {
                                        var tempChildren = _.map(subItem.children, function (thrItem) {
                                            return {
                                                label : thrItem.name,
                                                value : thrItem.code
                                            }
                                        });
                                        return {
                                            label : subItem.name,
                                            value : subItem.code,
                                            children :tempChildren
                                        }
                                    }),
                                    value : []
                                }
                            });

                            if (selectionNum == 2) {
                                //给两个选择表的级联data赋值，只取前两个 
                                ecVM.correlateOptionModal.one.data = ecVM.correlateOptionModal.datas[_.keys(ecVM.correlateOptionModal.datas)[0]].data;
                                ecVM.correlateOptionModal.one.parentName = _.keys(ecVM.correlateOptionModal.datas)[0];
                                ecVM.correlateOptionModal.two.data = ecVM.correlateOptionModal.datas[_.keys(ecVM.correlateOptionModal.datas)[1]].data;
                                ecVM.correlateOptionModal.two.parentName = _.keys(ecVM.correlateOptionModal.datas)[1];
                            } else if (selectionNum == 1) {

                                ecVM.correlateOptionModal.one.data = ecVM.correlateOptionModal.datas[_.keys(ecVM.correlateOptionModal.datas)[0]].data;
                                ecVM.correlateOptionModal.one.parentName = _.keys(ecVM.correlateOptionModal.datas)[0];
                                if (ecVM.correlateOptionModal.one.data.length < 2) {
                                    // 只有一个sheet，需要选择字段，直接添加至右边表格
                                    origin2selected(ecVM.correlateOptionModal.one);
                                    return;
                                } else {
                                    ecVM.correlateOptionModal.two = _.cloneDeep(ecVM.correlateOptionModal.one);
                                }
                            }
                            
                            // 打开关联选择对话框
                            ecVM.correlateOptionModal.show = true;
                        });
                    }, function (result) {
                        utilService.handleException(result);
                    });
                } else {
                    modalService.open({
                        type : "warning",
                        title : "提示",
                        content : "只可以两表创建关联"
                    });
                }
            },
            confirmCorrelate : function () {
                if (this.correlateOptionModal.one.value.length == 0 || (this.wizardModel.createCorrelation.correlationTable.data.length > 0 && this.correlateOptionModal.two.value.length < 2) ) {
                    modalService.open({
                        type : "info",
                        title : "提示",
                        content : "请选择表格"
                    });
                } else if (_.has(ecVM.wizardModel.createCorrelation.correlationTable.dataMap, this.correlateOptionModal.one.value[0])) {
                    modalService.open({
                        type : "info",
                        title : "提示",
                        content : "工作表“"+this.correlateOptionModal.one.value[0]+"”已关联，请重新选择。"
                    });
                } else {

                    var sheetDataOne = _.find(ecVM.correlateOptionModal.one.data, {"value":ecVM.correlateOptionModal.one.value[0]}),
                        sheetDataTwo = ecVM.correlateOptionModal.two.value.length != 0 ? _.find(ecVM.correlateOptionModal.two.data, {"value":ecVM.correlateOptionModal.two.value[0]}) : {},
                        newCorrelation = new Selection({
                            name : ecVM.correlateOptionModal.one.parentName,
                            data : ecVM.correlateOptionModal.one.data,
                            originData : ecVM.correlateOptionModal.one.originData,
                            sheetName : sheetDataOne.label,
                            sheetCode : ecVM.correlateOptionModal.one.value[0],
                            // leftField : ,
                            rightField : ecVM.correlateOptionModal.one.value[1] || "",
                            rightFieldName : ecVM.correlateOptionModal.one.value[1] ? _.find(sheetDataOne.children,{"value":ecVM.correlateOptionModal.one.value[1]}).label : "",
                            leftField : ecVM.correlateOptionModal.one.value[1] || "",
                            leftFieldName : ecVM.correlateOptionModal.one.value[1] ? _.find(sheetDataOne.children,{"value":ecVM.correlateOptionModal.one.value[1]}).label : ""
                        });

                    
                    ecVM.wizardModel.createCorrelation.correlationTable.dataMap[newCorrelation.sheetCode] = newCorrelation;
                    // 第二个级联有值得时候
                    if (ecVM.correlateOptionModal.two.value.length != 0) {
                        var tempIndex = _.findIndex(ecVM.wizardModel.createCorrelation.correlationTable.data,{sheetCode:ecVM.correlateOptionModal.two.value[0]});
                        if (tempIndex == 0 && ecVM.wizardModel.createCorrelation.correlationTable.data.length != 1) {
                            // 如果与第一张表关联，则插到第一
                            newCorrelation.leftField="";
                            newCorrelation.leftFieldName="";
                            ecVM.wizardModel.createCorrelation.correlationTable.data.unshift(newCorrelation);
                            ecVM.wizardModel.createCorrelation.correlationTable.dataMap[sheetDataTwo.value].leftField = ecVM.correlateOptionModal.two.value[1] || "";

                            ecVM.wizardModel.createCorrelation.correlationTable.dataMap[sheetDataTwo.value].leftFieldName = ecVM.correlateOptionModal.two.value[1] ? _.find(sheetDataTwo.children,{"value":ecVM.correlateOptionModal.two.value[1]}).label : "";


                        } else if (tempIndex == ecVM.wizardModel.createCorrelation.correlationTable.data.length-1) {
                            // 如果与最后一张表关联，则插到后面
                            newCorrelation.rightField="";
                            newCorrelation.rightFieldName="";
                            ecVM.wizardModel.createCorrelation.correlationTable.data.push(newCorrelation);
                            ecVM.wizardModel.createCorrelation.correlationTable.dataMap[sheetDataTwo.value].rightField = ecVM.correlateOptionModal.two.value[1] || "";

                            ecVM.wizardModel.createCorrelation.correlationTable.dataMap[sheetDataTwo.value].rightFieldName = ecVM.correlateOptionModal.two.value[1] ? _.find(sheetDataTwo.children,{"value":ecVM.correlateOptionModal.two.value[1]}).label : "";
                        }
                    } else {
                        ecVM.wizardModel.createCorrelation.correlationTable.data.push(newCorrelation);
                    }

                    this.correlateOptionModal.show = false;
                    this.correlateOptionModal.one.value = [];
                    this.correlateOptionModal.two.value = [];
                }
            },
            cancelCorrelate : function () {
                this.correlateOptionModal.show = false;
            },
            // 选择表格添加至“已关联”
            selectExcel : function () {
                if (this.wizardModel.createCorrelation.originTable.selection.length != 1) {
                    modalService.open({
                        type : "info",
                        title : "提示",
                        content : "一次只能选择一张表格"
                    });
                    return;
                }
                if (this.wizardModel.createCorrelation.correlationTable.data.length >= 6) {
                    modalService.open({
                        type : "info",
                        title : "提示",
                        content : "最多只支持6张表关联"
                    });
                    return;
                }

                // 表格没有缓存则查询后缓存工作表数据
                if (!_.has(this.wizardModel.createCorrelation.originTable.searchedData, this.wizardModel.createCorrelation.originTable.selection[0].name)) {
                    var tempUrl = utilService.getResourceUrl("/excel/excel-relation-list?excelName=")+encodeURIComponent(this.wizardModel.createCorrelation.originTable.selection[0].name);

                    communicationService.get(tempUrl, function (result) {
                        utilService.handleResult(result, function (res) {
                            ecVM.wizardModel.createCorrelation.originTable.searchedData[res.data[0].name] = {
                                data : _.map(res.data[0].children, function (subItem) {
                                    var tempChildren = _.map(subItem.children, function (thrItem) {
                                        return {
                                            label : thrItem.name,
                                            value : thrItem.code
                                        }
                                    });
                                    return {
                                        label : subItem.name,
                                        value : subItem.code,
                                        children :tempChildren
                                    }
                                }),
                                value : []
                            }
                            // // 打开关联选择对话框
                            // ecVM.correlateOptionModal.show = true;
                        });
                        origin2selected(ecVM.wizardModel.createCorrelation.originTable.selection[0]);
                    }, function (result) {
                        utilService.handleException(result);
                    });
                } else {
                    origin2selected(ecVM.wizardModel.createCorrelation.originTable.selection[0]);
                }
            },
            handleCheckAll : function (args) {
                var sheetObj = ecVM.wizardModel.createCorrelation.correlationTable.dataMap[args];
                if (sheetObj.indeterminate) {
                    sheetObj.checkAll = false;
                } else {
                    sheetObj.checkAll = !sheetObj.checkAll;
                }
                sheetObj.indeterminate = false;

                if (sheetObj.checkAll) {
                    sheetObj.checkValue = _.map(sheetObj.allField, "value");
                } else {
                    sheetObj.checkValue = [];
                }
            },
            checkChange : function (args) {
                var sheetObj = ecVM.wizardModel.createCorrelation.correlationTable.dataMap[args];
                if (sheetObj.checkValue.length === sheetObj.allField.length) {
                    sheetObj.indeterminate = false;
                    sheetObj.checkAll = true;
                } else if (sheetObj.checkValue.length > 0) {
                    sheetObj.indeterminate = true;
                    sheetObj.checkAll = false;
                } else {
                    sheetObj.indeterminate = false;
                    sheetObj.checkAll = false;
                }
            },
            // “保存为模板”按钮
            saveTemplate : function () {
                // this.saveTemplateNameInputModel.values.templateName="";
                this.saveTemplateNameInputModel.show = true;
                this.$refs.form.resetFields();
                
            },
            cancelTemplateName : function () {
                this.saveTemplateNameInputModel.show = false;
                this.$refs.form.resetFields();
            },
            confirmTemplateName : function (argument) {
                this.$refs.form.validateField("templateName", function (result) {
                    if (result == "") {
                        var tempUrl = utilService.getResourceUrl("/excel/custom-template-save"),
                            tempSheets = _.map(ecVM.wizardModel.createCorrelation.correlationTable.data, function (item) {
                                return {
                                    getFields : _.cloneDeep(item.checkValue),
                                    rightField : item.rightField,
                                    sheetCode : item.sheetCode,
                                    leftField : item.leftField
                                }
                            }),
                            params = {sheets:tempSheets,templateName:ecVM.saveTemplateNameInputModel.values.templateName};
                        // 删除头尾的不需要的左或右关联字段
                        delete(params.sheets[0].leftField);
                        delete(params.sheets[params.sheets.length-1].rightField);

                        communicationService.post(tempUrl, params, function (result) {
                            utilService.handleResult(result, function (result) {
                                ecVM.saveTemplateNameInputModel.show = false;
                                modalService.open({
                                    type : "success",
                                    title : "成功",
                                    content : "模板“" + params.templateName + "”保存成功。"
                                });
                                // 保存为模板后刷新“自定义模板列表”
                                // ecVM.modal.show = false;
                                ecVM.$emit('refreshData');

                            }, function (result) {
                                // body...
                            });
                        }, function (result) {
                            utilService.handleException(result);
                        });

                    } else {
                        modalService.open({
                            type : "info",
                            title : "提示",
                            content : result
                        });
                    }
                });
            }
        },
        created : function () {
            ecVM = this;
            getBusinessList();
            // 组件加载时查询原始表，调试的时候用
            // this.getOriginExcels();
        },
        mounted : function () {

        },
        watch : {
            "value" : {
                handler : function (n, o) {
                    this.modal.show = n;
                    if (n) {
                        initGenerateCustom();
                        this.getOriginExcels();
                        this.wizardModel.createCorrelation.originTable.data = [];
                        this.wizardModel.createCorrelation.correlationTable.data = [];
                        this.wizardModel.createCorrelation.correlationTable.dataMap = {};
                    }
                }
            },
            "modal.show" : {
                handler : function (n, o) {
                    this.$emit('input', n);
                }
            },
            "stepModel.current" : {
                handler : function (n,o) {
                    if (n==0) {
                        this.btnModel.prev.show = false;
                        this.btnModel.next.show = true;
                        this.btnModel.view.show = false;
                        this.btnModel.download.show = false;
                    } else if (n==this.stepModel.steps.length-1) {
                        this.btnModel.next.show = false;
                        this.btnModel.view.show = true;
                        this.btnModel.download.show = true;
                    } else {
                        this.btnModel.prev.show = true;
                        this.btnModel.next.show = true;

                        this.btnModel.view.show = false;
                        this.btnModel.download.show = false;
                    }


                }
            },
            "wizardModel.createCorrelation.originTable.selection" : {
                handler : function (n, o) {
                    // this.btnModel.correlate.able = this.wizardModel.createCorrelation.originTable.selection.length==2 || this.wizardModel.createCorrelation.originTable.selection.length==1;
                    this.btnModel.select.able = this.wizardModel.createCorrelation.originTable.selection.length==1;
                },
                deep : true
            },
            "wizardModel.createCorrelation.correlationTable.data" : {
                handler : function (n, o) {
                    ecVM.btnModel.next.able = (n.length!=0);
                },
                deep : true
            }
        }
    }

function getBusinessList() {
    communicationService.get(utilService.getResourceUrl("/catalog/business"), function (result) {
        if (result.state.code == 0) {
            result.data.unshift("全部");
            ecVM.wizardModel.createCorrelation.select.options = result.data;
        } else {
            utilService.handleException(result);
        }
    }, function (result) {
        utilService.handleException(result);
    });
}

// 获取带过滤条件的url
function getFilterUrl (baseUrl) {
    var tempUrl = baseUrl;
    if (ecVM.wizardModel.createCorrelation.select.value != "" && ecVM.wizardModel.createCorrelation.select.value != "全部") {
        tempUrl += (tempUrl.indexOf("?") == -1 ? "?" : "&") + "business=" + ecVM.wizardModel.createCorrelation.select.value;
    }
    if (ecVM.wizardModel.createCorrelation.search.value != "") {
        tempUrl += (tempUrl.indexOf("?") == -1 ? "?" : "&") + "name=" + ecVM.wizardModel.createCorrelation.search.value;
    }
    return utilService.getResourceUrl(tempUrl);
}
// <!-- 已选表对象的构造函数 -->
function Selection(args) {

    this.name = args.name;
    this.data = args.data || [];
    this.sheetName = args.sheetName || "";
    this.sheetCode = args.sheetCode || "";
    this.leftField = args.leftField || "";
    this.leftFieldName = args.leftFieldName || "";
    this.rightField = args.rightField || "";
    this.rightFieldName = args.rightFieldName || "";
    this.correlateNum = args.correlateNum || "";
    this.originData = args.originData || "";
    this.checkAll = true;
    this.indeterminate = false;
    this.allField = _.map(_.find(this.originData, {value:this.sheetCode}).children, function (item) {
        return {
            value : item.value,
            label : item.label
        }
    });
    this.checkValue = _.map(this.allField, "value");

}
// 选择表格中的工作表后添加到已选区域
function origin2selected (selection) {
    // 打开关联选择框
    ecVM.correlateOptionModal.show = true;

    ecVM.correlateOptionModal.one.data = ecVM.wizardModel.createCorrelation.originTable.searchedData[selection.name].data;
    ecVM.correlateOptionModal.one.originData = _.cloneDeep(ecVM.correlateOptionModal.one.data);
    ecVM.correlateOptionModal.one.parentName = selection.name;
    ecVM.correlateOptionModal.one.value = [];
    ecVM.correlateOptionModal.two.value = [];
    if (ecVM.wizardModel.createCorrelation.correlationTable.data.length < 1) {
        ecVM.correlateOptionModal.one.data = _.map(_.cloneDeep(ecVM.correlateOptionModal.one.data), function (item) {
            delete(item.children);
            return item;
        });
        ecVM.correlateOptionModal.two.show = false;
    } else {
        ecVM.correlateOptionModal.two.show = true;
        var firstData = ecVM.wizardModel.createCorrelation.correlationTable.data[0],
            lastData = ecVM.wizardModel.createCorrelation.correlationTable.data[ecVM.wizardModel.createCorrelation.correlationTable.data.length-1];
        if (ecVM.wizardModel.createCorrelation.correlationTable.data.length == 1) {
            ecVM.correlateOptionModal.two.data = [_.find(firstData.originData,{value:firstData.sheetCode})];
        } else {
            ecVM.correlateOptionModal.two.data = [_.find(firstData.originData,{value:firstData.sheetCode}), _.find(lastData.originData,{value:lastData.sheetCode})];
        }
        
    }
}
/*
    删除已选列表中的条目
*/
function removeSelection (args) {
    ecVM.wizardModel.createCorrelation.correlationTable.data = _.reject(ecVM.wizardModel.createCorrelation.correlationTable.data, function (item) {
        return args.row.sheetCode == item.sheetCode;
    });
    delete(ecVM.wizardModel.createCorrelation.correlationTable.dataMap[args.row.sheetCode]);
}

/*重置“新生成已定义导出”数据*/
function initGenerateCustom () {
    ecVM.stepModel.current = 0;
}
</script>


