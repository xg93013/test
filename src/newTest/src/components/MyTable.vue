<template>
    <div id="out-table">
        <my-title :title="tableConfig.title">
            <div slot="right">
                <my-export-btn :text="btnText" @btnClick="exportClick" />
            </div>
        </my-title>
        <div class="table-box">
            <el-table
            :data="tableConfig.tableData"
            style="width: 100%;"
            height="100%"
            :row-class-name="tableRowClassName">                  
                <el-table-column v-for="(item, index) in tableConfig.tableColumn" :prop="item.prop" :label="item.label" :width="item.width" :key="index" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span v-if="item.prop != 'amount'">{{ scope.row[item.prop] }}</span>
                        <el-tooltip class="item" placement="top" v-if="item.prop == 'amount'">
                            <div slot="content"><p>正常范围：</p>低于：{{scope.row['standardAmount'].toString()}}</div>
                            <span>{{ scope.row[item.prop] }}</span>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import MyTitle from '@/components/MyTitle'
import MyExportBtn from '@/components/MyExportBtn'
export default {
    components: {
        MyTitle,
        MyExportBtn
    },
    data () {
        return {
            btnText: "导出名单"
        }
    },
    props:{
        tableConfig: {
            type: Object,
            default: {}
        }
    },
    created () {
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2=== 1) {
                return 'warning-row';
            } else if (rowIndex%2 === 0) {
                return 'success-row';
            }
            return '';
        },
        exportClick () {
            this.$emit('exportClick', {
                    url: this.tableConfig.exportUrl, 
                    length: this.tableConfig.tableData.length,
                    refName: this.tableConfig.refName
                }
            )
        }
    }
}
</script>
<style lang="scss" scoped>
#out-table{
    .table-box{
        position: absolute;
        left: 10px;
        right: 10px;
        top: 40px;
        bottom: 10px;
    }
}
</style>


