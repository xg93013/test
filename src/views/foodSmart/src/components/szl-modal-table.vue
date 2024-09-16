<template>
    <div class='szl-modal-table' :class='{"szl-punish-table":tableMsg.type=="punish"}'>
        <Table id='szlModalTable' :height="height" ref='table' :columns="tableMsg.columns" :data="datas">
        </Table>
        <Row style='margin-top:10px' v-show='pageData.total>0'>
            <Col align='right'>
            <span>第 {{pageData.page}} / {{pageData.total}} 页</span>
            <div class='change-page' :class='{"change-page-disable":pageData.page==1}' @click='prevPage'>上一页</div>
            <div class='change-page' :class='{"change-page-disable":pageData.page==pageData.total}' @click='nextPage'>下一页</div>
            </Col>
        </Row>
        <Spin v-show='show' fix>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
        </Spin>
    </div>
</template>

<script>
import http from "../unit/http";
export default {
    data() {
        return {
            show: false,
            pageUrl: "",
            datas: [],
            height: "",
            pageData: {
                page: 1,
                total: 0
            }
        };
    },
    methods: {
        prevPage() {
            if (this.pageData.page == 1) {
                return false;
            }

            this.pageData.page--;
            this.getDetails();
        },
        nextPage() {
            if (this.pageData.page == this.pageData.total) {
                return false;
            }

            this.pageData.page++;
            this.getDetails();
        },
        getTableMsg(url,times="") {
            this.pageUrl = url;
            this.pageData.page = 1;
            this.pageData.total = 0;
            this.datas = [];
            this.$nextTick(() => {
                this.getDetails(times);
            });
        },
        async getDetails(times) {
            console.log(times);
            this.show = true;
            let res;
            if(times){
            	res = await http.get(this.pageUrl + "/" + this.pageData.page+"?period="+times);
            }else{
            	res = await http.get(this.pageUrl + "/" + this.pageData.page);
            }
            this.show = false;
            if (res) {
                this.pageData.total = res.data.totalPages;
                this.datas = res.data.content;
            }
        }
    },
    mounted() {
        this.getTableMsg();
        this.height = this.tableMsg.type == "punish" ? "500" : "";
    },
    props: ["tableMsg"]
};
</script>

<style lang='scss'>
#warnCenter {
    #szlModalTable {
        td {
            background-color: #252f52;
        }

        tr:hover {
            td {
                background-color: #404864;
            }
        }
    }
}
</style>