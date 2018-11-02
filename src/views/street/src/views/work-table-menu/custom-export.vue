<style lang="sass" type="stylesheet/sass" scoped>

    @import "../../styles/common.scss";
    .customExport {
        @include routerViewCommon;
        @include normalStyle(null, 100%);
        .operationArea {
            @include positionStyle(relative);
            @include clearFloat;
            .createCustomExport {
                @include float(right);
            }
        }
    }
</style>
<template>
    <div class="customExport" ref="customExport">
        <div class="operationArea">
            <Button class="createCustomExport" @click="createCustomExportFn" v-text="btnModel.createCustomExport.label" :type="btnModel.createCustomExport.type"></Button>
        </div>
        <div class="tableArea">
            <Table border :columns="gridModel.columns" :data="gridModel.data" :height="gridModel.height"></Table>
        </div>
        <Modal v-model="renameModel.show" :title="renameModel.title" @on-ok="confirmRename" @on-cancel="cancelRename" :mask-closable="false" width="300px" class-name="renameModal">
            <Form ref="form" :model="formModel.values" :rules="formModel.rules">
                <FormItem prop="rename">
                    <Input type="text" v-model="formModel.values.rename" :placeholder="renameModel.input.placeholder"></Input>
                </FormItem>
            </Form>
            <slot slot="footer">
                <Button class="renamebtn" @click="cancelRename" v-text="btnModel.renameCancel.label" :type="btnModel.renameCancel.type"></Button>
                <Button class="renamebtn" @click="confirmRename" v-text="btnModel.renameConfirm.label" :type="btnModel.renameConfirm.type"></Button>
            </slot>
        </Modal>
        <Modal v-model="deleteConfirmModel.show" :title="deleteConfirmModel.title" @on-ok="confirmDelete" :mask-closable="false" width="300px" class-name="customConfirmModal">
            <Icon type="android-alert" color="#f90" size="30" />
            <span>{{deleteConfirmModel.content}}</span>
        </Modal>
        <generate-custom v-model="showGenerateCustom" @refreshData="refreshCustomExportTemplate"></generate-custom>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    // import dataReport from './data-report.vue';
    import generateCustom from "./generate-custom.vue";
    var ceVM;

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
                // “新生成自定义导出”对话框显隐
                showGenerateCustom : false,
                btnModel : {
                    createCustomExport : {
                        label : "新生成自定义导出",
                        type : "primary"
                    },
                    renameConfirm : {
                        label : "确定",
                        type : "primary"
                    },
                    renameCancel : {
                        label : "取消",
                        type : "text"
                    }
                },
                gridModel : {
                    columns : [
                        {
                            title: '序号',
                            key: 'sequenceNumber',
                            className : "columnsCommon",
                            width: 100
                        },{
                            title: '历史导出模板',
                            key: 'templateName',
                            className : "columnsCommon"
                            // width: 100
                        },{
                            title: '模板建立时间',
                            key: 'addTime',
                            className : "columnsCommon"
                            // width: 100
                        },{
                            title: '上次导出时间',
                            key: 'lastExportTime',
                            className : "columnsCommon"
                            // width: 100
                        },{
                            title: '操作',
                            key: 'action',
                            width: 250,
                            className : "columnsCommon operte",
                            render: (h, params) => {
                                let rights=JSON.parse(sessionStorage.getItem("szlUserRights"));
                                let domArr=[];
                                if(rights.custom_export_query){//查看
                                    domArr.push(h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on : {
                                            click : function () {
                                                viewTemplate(params);
                                            }
                                        }
                                    }, '查看'))
                                }
                                if(rights.custom_export_download){//下载
                                    domArr.push(h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on : {
                                            click : function () {
                                                downloadTemplate(params);
                                            }
                                        }
                                    }, ["下载"]))
                                }
//                              custom_export_download
//                                custom_export_query
                                return h('div', [
                                    ...domArr,
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on : {
                                            click : function () {
                                                renameTemplate(params);
                                            }
                                        }
                                    }, '重命名'),
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on : {
                                            click : function () {
                                                deleteTemplate(params);
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ],
                    data : [],
                    height : ""
                },
                renameModel : {
                    show : false,
                    title : "重命名",
                    currentTemplateId : "",
                    input : {
                        placeholder : "请输入名称。",
                        // 用于记录原始值，用于判断是否修改名称
                        value : ""
                    }
                },
                formModel : {
                    values : {
                        rename : ""
                    },
                    rules : {
                        "rename" : [{
                            required: true,
                            message: '名称不能为空',
                            trigger: 'change'
                        }]
                    },
                    rename :""
                },
                deleteConfirmModel : {
                    show : false,
                    title : "确认",
                    content : "",
                    deleteTemplateName : "",
                    deleteTemplateID : ""
                }
            }
        },
        methods: {
            createCustomExportFn : function () {
                this.showGenerateCustom = true;
            },
            confirmRename : function () {
                // if (this.$refs.form.validateField("rename")) {
                //     this.renameModel.show = false;
                // }
                this.$refs.form.validateField("rename", function (result) {
                    if (result == "") {
                        
                        if (ceVM.formModel.values.rename != ceVM.renameModel.input.value) {
                            communicationService.post(utilService.getResourceUrl("/excel/custom-template-rename"), {
                                templateId : ceVM.renameModel.currentTemplateId,
                                templateName : ceVM.formModel.values.rename
                            }, function (result) {
                                if (result.state.code == 0) {
                                    // ceVM.gridModel.data = result.data;
                                    ceVM.renameModel.show = false;
                                    modalService.open({
                                        type : "success",
                                        title : "修改成功",
                                        content : "“"+ceVM.renameModel.input.value+"”名称修改为“"+ceVM.formModel.values.rename+"”",
                                        onOk : getCustomExportTemplate
                                    });
                                } else {
                                    utilService.handleException(result);
                                }
                            }, function (result) {
                                utilService.handleException(result);
                            });
                        } else {
                            ceVM.renameModel.show = false;
                        }
                        
                    }
                })
            },
            cancelRename : function () {
                this.renameModel.show = false;
            },
            confirmDelete : function () {
                communicationService.post(utilService.getResourceUrl("/excel/custom-template-delete"), {
                    templateId:ceVM.deleteConfirmModel.deleteTemplateID}, function (result) {
                // ceVM.renameModel.show = false;
                    setTimeout(function () {
                        modalService.open({
                            type : "success",
                            title : "删除成功",
                            content : "删除“"+ceVM.deleteConfirmModel.deleteTemplateName+"”成功",
                            onOk : getCustomExportTemplate,
                            // loading : true
                        });
                    },0);
                    
                }, function (result) {
                    utilService.handleException(result);
                });
            },
            refreshCustomExportTemplate : function (argument) {
                getCustomExportTemplate();
            }
        },
        created : function () {
            ceVM = this;
            getCustomExportTemplate();
        },
        mounted : function () {
            this.gridModel.height = this.$refs.customExport.clientHeight-40-32-10;
        },
        watch : {
            
        },
        components : {
            generateCustom : generateCustom
        }
    }
// 查询模板
function getCustomExportTemplate () {
    // communicationService.get(utilService.getResourceUrl();
    communicationService.get(utilService.getResourceUrl("/excel/custom-template-list"), function (result) {
        if (result.state.code == 0 && result.data) {
            ceVM.gridModel.data = result.data;
        }
    }, function (result) {
        utilService.handleException(result);
    });
}

//查看模板
function viewTemplate (args) {
    var tempWindow = window.open();
    if (!tempWindow) {
        utilService.handleException("浏览器已禁止弹出式窗口，请在浏览器设置中设置允许弹出式窗口。");
        return;
    }
    communicationService.post(utilService.getResourceUrl("/excel/custom-query"),{templateId:args.row.id}, function (result) {

        if (result.state.code != 0) {
            tempWindow.close();
            utilService.handleException(result);
        } else {
            tempWindow.document.write(result.data);
        }
        
    }, function (result) {
        utilService.handleException(result);
    });
}

// 重命名模板
function renameTemplate (args) {
    // ceVM.renameModel.title = "重命名“"+args.row.templateName+"”";
    ceVM.renameModel.title = "重命名";
    ceVM.renameModel.show = true;
    ceVM.renameModel.currentTemplateId = args.row.id;
    ceVM.renameModel.input.value = args.row.templateName;
    ceVM.formModel.values.rename = args.row.templateName;
    // ceVM.formModel.rename = args.row.templateName;
}
// 删除模板
function deleteTemplate (args) {
    ceVM.deleteConfirmModel.show = true;
    ceVM.deleteConfirmModel.content = "确认删除“"+args.row.templateName+"”？";
    ceVM.deleteConfirmModel.deleteTemplateName = args.row.templateName;
    ceVM.deleteConfirmModel.deleteTemplateID = args.row.id;
}
// 下载模板
function downloadTemplate(argument) {
    var iframeObj = document.createElement('iframe'),
        formObj = document.createElement('form'),
        inputObj = document.createElement('input');

    iframeObj.id = "down-file-iframe";

    formObj.target = "down-file-iframe";
    formObj.method = "post";
    formObj.action = utilService.getResourceUrl("/excel/custom-export");

    inputObj.type = "hidden";
    inputObj.name = "templateId";
    inputObj.value = JSON.stringify(argument.row.id);

    formObj.append(inputObj);
    iframeObj.append(formObj);
    document.body.append(iframeObj);
    formObj.submit();

    iframeObj.remove();
}
</script>
