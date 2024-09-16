<template>
    <div class='szl-modal-table szl-result-table'>
        <Table id='szlModalTable' :height="height" ref='table' :columns="tableMsg.columns" :data="datas" :row-class-name="rowClassName">
        </Table>
        <Row style='margin-top:10px;color:#fff;' v-show='pageData.total>0'>
            <Col align='right'>
            <span>第 {{pageData.page}} / {{pageData.total}} 页</span>
            <div class='change-page' :class='{"change-page-disable":pageData.page==1}' @click='prevPage'>上一页</div>
            <div class='change-page' :class='{"change-page-disable":pageData.page==pageData.total}' @click='nextPage'>下一页</div>
            <!-- <Page :total.sync="pageData.total" @on-change="changePage" show-elevator></Page> -->
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
            status: '',
            pageData: {
                page: 1,
                total: 17
            }
        };
    },
    methods: {
        rowClassName(row, index){
            if (index%2 == 1) {
                return 'table-hign-row';
            } else{
                return 'table-normal-row';
            }
            return '';
        },
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
            this.getDetails(this.status);
        },
        changePage(page){
            this.pageData.page = page;
            console.log(page);
            this.getDetails(this.status);
        },
        getTableMsg(url,status) {
            this.pageUrl = url;
            this.pageData.page = 1;
            this.pageData.total = 0;
            this.status = status;
            this.datas = [];
            this.$nextTick(() => {
                this.getDetails(status);
            });
        },
        async getDetails(status) {
            this.show = true;
            let res;
            // if(times){
            // 	res = await http.get(this.pageUrl + "/" + this.pageData.page+"?period="+times);
            // }else{
            res = await http.get(this.pageUrl + "/" + '?pageNo=' + this.pageData.page + '&status=' + status);
            // }
            // res = {
            //     data: {
            //         totalPages: 20,
            //         content: []
            //     }
            // }
            // for(let i=0;i<15;i++){
            //     res.data.content.push({
            //         cydRq: i,
            //         ypMc: '测试name测试name测试name测试name测试name',
            //         qyMc: 'w测试name测试name测试name测试name测试name',
            //         qyQx: 'w测试name测试name测试name测试name测试name',
            //         sczMc: 'w'+1,
            //         sczSq: 'w',
            //         jyxm: '2',
            //         sczAndBzxz: '123'
            //     })
            // }
            this.show = false;
            if (res) {
                this.pageData.total = res.data.totalPages;
                this.datas = res.data.content;
            }
        }
    },
    mounted() {
        // this.height = this.tableMsg.type == "punish" ? "500" : "";
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