<style lang="sass" type="stylesheet/sass">

    @import "../../styles/common.scss";
    .work-table {
        @include normalStyle(null, 100%);
        .ivu-tabs {
            background-color: rgba(255,255,255,1);
            @include normalStyle(null, 100%);
            .ivu-tabs-bar {
                background-color: rgba(237,241,242,1);
                border: none;
                .ivu-tabs-tab {
                    border:none !important;
                }

            }
            .ivu-tabs-content {
                @include normalStyle(null, 90%);
                .ivu-tabs-tabpane {
                    overflow:hidden;
                    @include normalStyle(null, 100%);
                    .btn-area {
                        text-align: center;
                        @include normalStyle(null, 100%);
                        > div {
                            @include normalStyle(null, 100%);
                        }
                        .upload-btn {
                            @include normalStyle(270px, 70px);
                            font-size: 16px;
                            // display: block;
                            @include edgeStyle(0 auto 0);
                            @include positionStyle(relative);
                            top : 45%;
                        }
                        .again-btn {
                            @include normalStyle(270px);
                            font-size: 16px;
                            // display: block;
                            @include edgeStyle(0 auto 0);
                            @include positionStyle(relative);
                            // top : 45%;
                        }
                        .uploadResult {
                            text-align: left;
                            background-color : rgba(237,241,242,1);
                            @include normalStyle(600px, 300px);
                            @include edgeStyle(200px auto 20px, 20px);
                            border-radius : 2px;
                            overflow: auto;
                            // @include positionStyle(relative);
                            // top : 45%;
                        }
                    }
                }
            }
        }
        
    }

</style>
<template>
    <div class="work-table tabpane-common">
        <!-- 工作表 -->
        <Tabs type="card" :animated="false" v-model="tabModel.value">
            <TabPane label="文件上传" name="upload_file_menu" v-if="userRights.upload_file_menu">
                <div class="btn-area">
                    <input type="file" name="uploadfile" multiple @change="fileChange" style="display:none;" ref="inputFile">
                    <div v-if="uploadModel.showOriginUpload">
                        <Button type="primary" class="upload-btn" @click="selectFile">{{uploadModel.uploadTitle}}</Button>
                    </div>
                    <div v-if="!uploadModel.showOriginUpload">
                        <div class="uploadResult" v-html="uploadModel.result">
                            <!-- {{uploadModel.result}} -->
                        </div>
                        <Button type="primary" class="again-btn" @click="selectFile">{{uploadModel.continueUploadTitle}}</Button>
                        <Button type="primary" class="again-btn" @click="uploadModel.viewUploaded">{{uploadModel.viewTitle}}</Button>
                    </div>
                </div>
            </TabPane>
            <TabPane label="报表生成" name="create_report_menu" v-if="userRights.create_report_menu">
                <data-report></data-report>
            </TabPane>
            <TabPane label="自定义导出" name="custom_export_menu" v-if="userRights.custom_export_menu">
                <custom-export></custom-export>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    import dataReport from './data-report.vue';
    import customExport from './custom-export.vue';
    var wtmVM;

    export default {
        components : {
            dataReport : dataReport,
            customExport : customExport
        },
        data : function (argument) {
            return {
       			userRights:JSON.parse(sessionStorage.getItem("szlUserRights")),
                menuModel : {
                    value : ""
                },
                uploadModel : {
                    showOriginUpload : true,
                    uploadTitle : "上传文件",
                    continueUploadTitle : "继续上传文件",
                    viewTitle : "查看已上传表格",
                    result : "",
                    viewUploaded : function () {
                        wtmVM.$router.push({
                            path: '/main/resource-dir-menu?tab=uploaded'
                        });
                        wtmVM.tabModel.value = "resource-dir-menu";
                    }
                },
                tabModel : {
                    // value : "custom_export_menu"
                    value : (()=>{
                    	let rights=JSON.parse(sessionStorage.getItem("szlUserRights"));
                    	if(rights.upload_file_menu){
                    		return "upload_file_menu";
                    	};
                    	if(rights.create_report_menu){
                    		return "create_report_menu";
                    	};
                    	if(rights.custom_export_menu){
                    		return "custom_export_menu";
                    	};
                    })()
                }
            }
        },
        methods: {
            changeApp (selectedMenu) {
                // this.$Modal.info({
                //     title: 'Bravo',
                //     content: 'Now, enjoy the convenience of iView.'
                // });
                if (this.menuModel.value != selectedMenu) {
                    
                }
                console.log(selectedMenu);
            },
            selectFile : function () {
                // $('input[id=upload_file]').click();
                this.$refs.inputFile.click();
            },
            fileChange : function (args) {
                var formData = new FormData();
                _.forEach(args.target.files, function (item) {
                    formData.append("uploadfile",item);
                });
                // formData.append("uploadfile", _.map(args.target.files, function (item) {
                //     return item;
                // }));
                this.$store.commit("changeRouterSpinShow", true);
                communicationService.post(utilService.getResourceUrl("/excel/upload"), formData,  (result)=> {
                    this.$store.commit("changeRouterSpinShow", false);
                    if (wtmVM.uploadModel.showOriginUpload) {
                        wtmVM.uploadModel.showOriginUpload = false;
                        
                    }
                    wtmVM.uploadModel.result = result.state.description ? result.state.description.split("\\n").join("<br/><br/>") : result.state.code;
                    console.log(result);
                }, (result) => {

                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

            },
        },
        created() {
            wtmVM = this;
        }
    }
</script>
