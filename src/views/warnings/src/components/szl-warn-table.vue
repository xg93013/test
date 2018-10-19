<template>
    <div id='szlWarnTable' width='560'>
        <Table :row-class-name="rowClassName" ref='table' :height="tableMsg.height" :columns="tableMsg.columns" :data="tableMsg.datas" @on-row-click='rowClick'>
        </Table>
        <Spin v-show='show' fix>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
        </Spin>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: true
        };
    },
    methods: {
        rowClassName(row, index) {
            if (index % 2 == 0) {
                return "szl-table-row-odd";
            } else {
                return "szl-table-row-even";
            }
        },
        rowClick(index) {
            this.$emit("modalAction", [index]);
        },
        closeLoading() {
            this.show = false;
        }
    },
    props: ["tableMsg"],
    mounted() {}
};
</script>

<style lang='scss'>
#warnCenter {
    #szlWarnTable {
        position: relative;

        .ivu-table-wrapper {
            border: none;
        }
        th {
            background-color: #131a36;
            border: none;
            height: 30px;
        }
        td {
            height: 30px;
            border: none;
        }
        .ivu-table-cell {
            padding-left: 10px;
            padding-right: 10px;
        }
        .ivu-table {
            color: #dae6ff;
            background-color: #1b223e;
            &:after {
                width: 0;
            }
            &:before {
                height: 0;
            }
        }
        .szl-table-row-even {
            td {
                background-color: #131a36;
            }
        }
        .szl-table-row-odd {
            td {
                background-color: #1b223e;
            }
        }
        .ivu-table-row-hover {
            cursor: pointer;
            td {
                background-color: #404864;
            }
        }
    }
}
</style>