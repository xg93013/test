<style scoped lang="sass">

    @import "../../styles/common.scss";
    .resource-dir {
        .treeArea {
            @include normalStyle(null, 100%);
            @include edgeStyle(0 20px, 10px 20px);
            border: 1px solid #e9eaec;
            overflow: auto;
        }
    }

</style>
<template>
    <div class="resource-dir tabpane-common">
        <!-- 资源目录 -->
        <Tabs type="card" :animated="false" v-model="tabModel.value">
            <TabPane :label="tabModel.tabs.catalog.label" :name="tabModel.tabs.catalog.name" v-if="userRights.data_dir_menu">
                <div class="treeArea">
                    
                    <Tree :data="catalogTreeModel.data"></Tree>
                </div>
            </TabPane>
            <TabPane :label="tabModel.tabs.uploaded.label" :name="tabModel.tabs.uploaded.name"  v-if="userRights.have_upload_table_menu">
                <uploaded-table-pane></uploaded-table-pane>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    import uploadedTablePane from './uploaded-table-pane.vue';
    // import customExport from './custom-export.vue';
    var rdVM;
    export default {
        components : {
            uploadedTablePane : uploadedTablePane
        },
        data : function (argument) {
            return {
            	userRights:JSON.parse(sessionStorage.getItem("szlUserRights")),
                tabModel : {
                    value : (()=>{
                    	let rights=JSON.parse(sessionStorage.getItem("szlUserRights"));
                    	if(rights.data_dir_menu){
                    		return "catalog";
                    	};
                    	if(rights.have_upload_table_menu){
                    		return "uploaded";
                    	};
                    })(),
                    tabs : {
                        catalog : {
                            name : "catalog",
                            label : "数据目录"
                        },
                        uploaded : {
                            name : "uploaded",
                            label : "已上传表格"
                        }
                    }
                },
                catalogTreeModel : {
                    data : []
                }
            }
        },
        methods: {

        },
        created : function (argument) {
            rdVM = this;
            getCatalogData();
            if (!_.isEmpty(this.$route.query) && _.has(this.$route.query,"tab")) {
                this.tabModel.value=this.$route.query.tab;
            }
        },
        mounted : function (argument) {
            
        }
    }

    function getCatalogData () {
        communicationService.get(utilService.getResourceUrl("/catalog/catalog-tree"), function (result) {
            utilService.handleResult(result, function (res) {
                rdVM.catalogTreeModel.data = getTreeStructure(res.data);
            }, function (res) {
                // body...
            });
        }, function (result) {
            
        });
    }

    function getTreeStructure (data) {
        return _.map(data, function (item, index) {
            var tempTreeItem = {
                title : item.name,
                value : item.code,
                expand : false
            };
            if (!_.isUndefined(item.children) && (item.children instanceof Array)) {
                tempTreeItem.children = getTreeStructure(item.children);
            }
            return tempTreeItem;
        });
    }
</script>
