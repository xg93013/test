<template>
    <Modal v-model="modal" width='1000' :title="title">
        <div style='padding:20px;position:relative'>
            <szlModalTable :tableMsg='modalTableMsg' ref='modal' />
        </div>
    </Modal>
</template>

<script>
import szlModalTable from "../../components/szl-modal-table.vue";
import apis from "../../unit/apis";
const { UN_C_DETAIL, C_DETAIL } = apis;
export default {
    data() {
        return {
            title: "",
            modal: false,
            modalTableMsg: {},
            modalTableMsga: {
                columns: [
                    {
                        title: "抽样时间",
                        key: "cydRq",
                        width: 100
                    },
                    {
                        title: "食品名称",
                        key: "ypMc",
                        width: 100,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.ypMc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.ypMc
                            );
                        }
                    },
                    {
                        title: "被抽样单位",
                        width: 140,
                        key: "qyMc",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qyMc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qyMc
                            );
                        }
                    },
                    {
                        title: "所属区域",
                        key: "qyQx",
                        width: 100,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qyQx,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qyQx
                            );
                        }
                    },
                    {
                        title: "标称生产企业",
                        width: 140,
                        key: "sczMc",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.sczMc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.sczMc
                            );
                        }
                    },
                    {
                        title: "所属区域",
                        key: "sczSq",
                        width: 100,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.sczSq,
                                        placement: "top-start"
                                    }
                                },
                                params.row.sczSq
                            );
                        }
                    },
                    {
                        title: "不合格检验项目",
                        width: 140,
                        key: "jyxm",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.jyxm,
                                        placement: "top-start"
                                    }
                                },
                                params.row.jyxm
                            );
                        }
                    },
                    {
                        title: "检测值/标准值",
                        align: "right",
                        key: "sczAndBzxz",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.sczAndBzxz,
                                        placement: "top-start"
                                    }
                                },
                                params.row.sczAndBzxz
                            );
                        }
                    }
                ]
            },
            modalTableMsgb: {
                columns: [
                    {
                        title: "抽样时间",
                        key: "cydRq",
                        width: 100
                    },
                    {
                        title: "食品名称",
                        key: "ypMc",
                        width: 100,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.ypMc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.ypMc
                            );
                        }
                    },
                    {
                        title: "被抽样单位",
                        key: "qyMc",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qyMc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qyMc
                            );
                        }
                    },
                    {
                        title: "所属区域",
                        key: "qyQx",
                        width: 100,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qyQx,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qyQx
                            );
                        }
                    },
                    {
                        title: "标称生产企业",
                        key: "sczMc",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.sczMc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.sczMc
                            );
                        }
                    },
                    {
                        title: "检测结果",
                        width: 140,
                        key: "jyxm",
                        render(h, params) {
                            let txt = params.row.jyxm == 1 ? "合格" : "不合格";
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: txt,
                                        placement: "top-start"
                                    }
                                },
                                txt
                            );
                        }
                    }
                ]
            }
        };
    },
    components: {
        szlModalTable
    },
    methods: {
        modalShow(e) {
            this.title = e.fldl;
            this.modal = true;
            let url;
            if (e.i == 1) {
                this.modalTableMsg = { ...this.modalTableMsga };
                url = UN_C_DETAIL + "/" + e.flbh;
            } else {
                this.modalTableMsg = { ...this.modalTableMsgb };
                url = C_DETAIL + "/" + e.flbh;
            }
            this.$refs.modal.getTableMsg(url);
        }
    },
    mounted() {}
};
</script>

<style lang='scss'>

</style>