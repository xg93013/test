<template>
    <div class='szlPage'>
        <div class='szl-modal-table'>
            <Table :row-class-name="rowClassName" ref='table' :columns="config.columns" :data="datas" @on-row-click='rowClick'>
            </Table>
            <Row style='margin-top:10px' v-show='pagination.pages>0'>
                <Col align='right'>
                <span>第 {{pagination.current}} / {{pagination.pages}} 页</span>
                <div class='change-page' :class='{"change-page-disable":pagination.current==1}' @click='prevPage'>上一页</div>
                <div class='change-page' :class='{"change-page-disable":pagination.current==pagination.pages}' @click='nextPage'>下一页</div>
                </Col>
            </Row>
            <Spin v-show='show' fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>加载中...</div>
            </Spin>
        </div>
    </div>
</template>

<script>
import http from "../unit/http";
export default {
    data() {
        return {
            show: false,
            showDialog : false,
            datas :[],
            pagination : {
                current : 1,
                pages:0
            },
            columns : []
        };
    },
    methods: {
        prevPage(){
            if (this.pagination.current <= 1) {
                return false;
            }

            this.pagination.current--;
        },
        showModals(){
            this.showDialog = true;
        },
        nextPage(){
            if (this.pagination.current >= this.pagination.pages) {
                return false;
            }

            this.pagination.current++;
        },
        rowClassName(row, index) {
            if (index % 2 == 0) {
                return "szl-table-row-odd";
            } else {
                return "szl-table-row-even";
            }
        },
        rowClick(index) {
            this.$emit("item-click", [index]);
        },
        closeLoading() {
            this.show = false;
        },
        async getData() {
            //过度抽检企业预警列表
            this.show = true;
            let res;
            if(this.config.period){
            	res = await http.get(this.config.url+"/"+this.pagination.current+"?period="+this.config.period)
            }else{
                // res = await http.get(this.config.url+"/"+this.pagination.current)
                res = await http.get(this.config.url)
            }
            // this.$refs.overCompony.closeLoading();
            if (res) {
                this.show = false;
                this.datas = [...res.data.content];
                this.pagination.pages = res.data.totalPages;
            }
            // this.pagination.pages = 10;
            
        },
    },
    computed:{
        
    },
    props: ["config"],
    created(){
        this.columns = this.columns.concat(this.config.columns)
        this.columns.push({
            title: " ",
            key: "",
            width: 30,
            render(h, params) {
                return h("span",{},">");
            }
        });
    },
    mounted() {
        this.getData()
    },
    watch : {
        // showDialog : function (nV, oV) {
        //     if (nV && nV!=oV) {
        //         this.datas = [];
                
        //     }
        // },
        config(newV){
            this.config = newV;
            this.pagination.current = 1;
            this.pagination.pages = 0;
            this.getData();
            // console.log('updateConfig')
        },
        "pagination.current"(nV, oV){
            this.getData();
        }
    }
};
</script>

<style lang='scss'>
// #warnCenter {
    .slz_dialog {
        // position: relative;

        .ivu-table-wrapper {
            border: none;
        }
        th {
            background-color: #131a36;
            // border: none;
            // height: 35px;
        }
        td,th {
            height: 40px;
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
    .showMore{
        overflow: hidden;
        padding: 0 4px 0 24px;
        background: url(../images/more.png) no-repeat 8px 7px;
        color: #dae6ff;
    }
    
// }
</style>