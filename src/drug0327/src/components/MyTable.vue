<template>
    <div id="out-table">
        <my-title :title="tableConfig.title" :tips="tableTips">
            <div slot="right" v-show="tableConfig.exportUrl!=''">
                <my-export-btn :text="btnText" @btnClick="exportClick" />
            </div>
        </my-title>
        <div class="table-box">
            <el-table
            :data="tableConfig.tableData"
            style="width: 100%;"
            height="100%"
            :row-class-name="tableRowClassName">                  
                <el-table-column v-for="(item, index) in tableConfig.tableColumn" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :key="index" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span v-if="item.prop != 'amount'">
                            <span v-if="item.prop == 'overRatio'">
                                <!-- <div v-if="Math.abs(Number(scope.row['amount']-scope.row['referenceAmount'])/scope.row['referenceAmount']*100)>20">
                                    <div class="redColor" v-if="(scope.row['amount']-scope.row['referenceAmount'])>0">+{{Math.abs((scope.row['amount']-scope.row['referenceAmount'])/scope.row['referenceAmount']*100).toFixed(2)}}%</div>
                                    <div class="greenColor" v-else>-{{Math.abs((scope.row['amount']-scope.row['referenceAmount'])/scope.row['referenceAmount']*100).toFixed(2)}}%</div>
                                </div>
                                <div v-else></div> -->
                                <span v-if="Math.abs(Number(scope.row['overRatio'].substr(0,scope.row['overRatio'].indexOf('%'))))>=20">
                                    <span class="redColor" v-if="Number(scope.row['overRatio'].substr(0,scope.row['overRatio'].indexOf('%')))>0">+{{scope.row['overRatio']}}</span>
                                    <span class="greenColor" v-else>{{scope.row['overRatio']}}</span>
                                </span>
                                <span class="normalColor" v-else>--</span>
                            </span>
                            <span v-if="item.prop != 'overRatio'">
                                <span v-if="item.prop != 'linkRelativeRatio'">
                                    {{ scope.row[item.prop] }}
                                </span>
                                <span v-else>
                                    <span v-if="scope.row['linkRelativeRatio'] != -1">{{ scope.row[item.prop] }}</span>
                                    <el-tooltip placement="top" v-else>
                                        <div slot="content" style="font-size:12px;">上月使用量为0</div>
                                        <span>0.0%</span>
                                    </el-tooltip>
                                </span>
                            </span>
                        </span>
                        <div v-if="item.prop == 'amount'">
                            <el-tooltip class="item" placement="top" v-if="scope.row['referenceAmount']!=null&&scope.row['referenceAmount']!=''">
                                <!-- <div slot="content"><p>正常范围：</p>低于：{{scope.row['referenceAmount'].toString()}}</div> -->
                                <div slot="content" style="font-size:12px;">{{tableConfig.overTitle}}：{{scope.row['referenceAmount']}}</div>
                                <span>{{ scope.row[item.prop] }}</span>
                            </el-tooltip>
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </div>
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
            btnText: "导出名单",
            showEport: ''
        }
    },
    props:{
        tableConfig: {
            type: Object,
            default: {}
        },
        tableTips: {
            type: String,
            default: ''
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
                    title: this.tableConfig.title,
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
    .redColor{
        color: red;
    }
    .greenColor{
        color: rgb(19, 177, 19);
    }
    .normalColor{
        color: #999;
    }
}
</style>


