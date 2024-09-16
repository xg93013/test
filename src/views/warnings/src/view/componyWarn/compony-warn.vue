<template>
    <div class='warn-list'>
        <div class='warn-list-box'>
            <div class='list-title'>企业主体风险预警</div>
            <div class='list-content'>
                <div>
                    <div class='warn-title'>
                        <div>过度抽检企业预警</div>
                        <!-- <szlDialog :config="foodTableMsgConfig" @item-click="checkModalShow"></szlDialog>
                        <a v-show='foodTableMsg.datas.length' :href='overSampleUrl' class='szl-export'>导出名单</a>  -->
                        <szlDropdown class="dropdown">
							<div>
								<szlDialog class="pop-list" :config="foodTableMsgConfig" @item-click="checkModalShow"></szlDialog>
								<a class="szl-export pop-list" :href='overSampleUrl'>导出名单</a>
							</div>
						</szlDropdown>
                    </div>

                    <szlWarnTable @modalAction='checkModalShow' ref='overCompony' :tableMsg='foodTableMsg' />
                </div>
                <div>
                    <div class='warn-title'>
                        <div>
                        	行政处罚三次以上的企业名单
                        	<span class="time-rang" :class="{'time-rang-active':timeRang==12}" @click="timeRangChange(12)">1年内</span>
                        	<span class="time-rang" :class="{'time-rang-active':timeRang==36}" @click="timeRangChange(36)">3年内</span>
                        </div>
                        <!-- <szlDialog :config="foodTableMsgConfiga" @item-click="punishModalShow"></szlDialog>
                        <a v-show='foodTableMsga.datas.length' :href='punishUrl' class='szl-export'>导出名单</a> -->
                        <szlDropdown class="dropdown">
							<div>
								<szlDialog class="pop-list" :config="foodTableMsgConfiga" @item-click="punishModalShow"></szlDialog>
								<a class="szl-export pop-list" :href='punishUrl'>导出名单</a>
							</div>
						</szlDropdown>
                    </div>

                    <szlWarnTable @modalAction='punishModalShow' ref='punishCompony' :tableMsg='foodTableMsga' />
                </div>
            </div>
        </div>
        <componyWarnCheckModal ref='componyWarnCheckModal' />
        <componyWarnPunishModal ref='componyWarnPunishModal' />
    </div>
</template>

<script>
import szlWarnTable from "../../components/szl-warn-table.vue";
import szlDialog from '../../components/szl-dialog.vue';
import componyWarnCheckModal from "./compony-warn-check-modal.vue";
import componyWarnPunishModal from "./compony-warn-punish-modal.vue";
import szlDropdown from '../../components/szl-dropdown.vue'
import http from "../../unit/http";
import apis from "../../unit/apis";
// import func from './vue-temp/vue-editor-bridge';
const {
    E_OVERSAMPLING_LIST,
    E_PUNISH_LIST,
    UREPORT_EXCEL_OVERSAMPLE,
    UREPORT_EXCEL_PUNISH,
    TIMING
} = apis;
export default {
    data() {
        function handleColumnsCommon (list, config) {
            var temp = _.cloneDeep(list);
            _.forEach(temp, function(item, index){
                if (_.has(config, item.key)) {
                    _.forEach(config[item.key], function(value, subKey){
                        item[subKey] = value;
                    });
                }
            });
            return temp;
        }
        var totalListConfig = {
            qymc: {
                width:350
            },
            list : {
                width : false
            }
            
        },totalListConfiga = {
            qymc: {
                width:350
            }
        }
        const columnsCommon = [
                    {
                        title: "企业名称",
                        key: "qymc",
                        width: 200,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qymc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qymc
                            );
                        }
                    },
                    {
                        title: "所属区域",
                        key: "qx",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qx,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qx
                            );
                        }
                    },
                    {
                        title: "过度类型",
                        key: "list",
                        width: 130,
                        ellipsis: true,
                        render(h, params) {
                            let txt;
                            if (params.row.zcs >= 10) {
                                txt = `所有食品抽检${params.row.zcs}次`;
                            }
                            if (params.row.zcs < 10 && params.row.dlcs >= 5) {
                                txt = `同一大类抽检${params.row.dlcs}次`;
                            }
                            if (params.row.zcs < 10 && params.row.dlcs < 5) {
                                txt = `同一批食品抽检${params.row.pccs}次`;
                            }
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
                    },
                    {
                        title: "最近抽样时间",
                        key: "bgrq"
                    }
                ];
        const columnsCommona = [
                    {
                        title: "企业名称",
                        key: "qymc",
                        width: 200,
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qymc,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qymc
                            );
                        }
                    },
                    {
                        title: "所属区域",
                        key: "qy",
                        render(h, params) {
                            return h(
                                "Tooltip",
                                {
                                    props: {
                                        content: params.row.qy,
                                        placement: "top-start"
                                    }
                                },
                                params.row.qy
                            );
                        }
                    },
                    {
                        title: "处罚次数",
                        key: "count",
                        ellipsis: true
                    },
                    {
                        title: "最近处罚日期",
                        key: "rq"
                    }
                ]
        return {
            overSampleUrl: UREPORT_EXCEL_OVERSAMPLE,
            punishUrl: UREPORT_EXCEL_PUNISH+"&period=12",
            foodTableMsgConfig:{
                name:"过度抽检企业预警",
                modalWidth: 1000,
                url:E_OVERSAMPLING_LIST,
                columns: handleColumnsCommon(columnsCommon, totalListConfig),
                itemClick : function (){}
            },
            foodTableMsgConfiga:{
                name:"1年内行政处罚三次以上的企业名单",
                url:E_PUNISH_LIST,
                period: 12,
                modalWidth: 1000,
                columns: handleColumnsCommon(columnsCommona, totalListConfiga),
                itemClick : function (){}
            },
            foodTableMsg: {
                datas: [],
                columns: columnsCommon
            },
            foodTableMsga: {
                datas: [],
                columns: columnsCommona
            },
            timeRang: 12
        };
    },
    methods: {
    	timeRangChange(e){
    		if(this.timeRang!=e){
    			this.timeRang = e;
    			this.foodTableMsgConfiga.period = e;
    			if(e==12){
    				this.foodTableMsgConfiga.name = "1年内行政处罚三次以上的企业名单";
    				this.punishUrl = UREPORT_EXCEL_PUNISH+"&period=12";
    			}else{
    				this.foodTableMsgConfiga.name = "3年内行政处罚三次以上的企业名单";
    				this.punishUrl = UREPORT_EXCEL_PUNISH+"&period=36";
    			}
    			this.$nextTick(()=>{
    				this.getPunishCompony();
    			})
    		}
    	},
        checkModalShow(e) {
            this.$refs.componyWarnCheckModal.modalShow(e);
        },
        punishModalShow(e) {
        	let data = {
        		...e,
        		period: this.timeRang
        	}
            this.$refs.componyWarnPunishModal.modalShow(data);
        },
        async getOverCompony() {
            //过度抽检企业预警列表
            let res = await http.get(E_OVERSAMPLING_LIST);
            this.$refs.overCompony.closeLoading();
            if (res) {
                this.foodTableMsg.datas = [...res.data];
            }
        },

        async getPunishCompony() {
            //处罚三次以上的企业
            let res = await http.get(E_PUNISH_LIST+"?period="+this.timeRang);
            this.$refs.punishCompony.closeLoading();
            if (res) {
                this.foodTableMsga.datas = [...res.data];
            }
        },
        init() {
            this.getOverCompony();
            this.getPunishCompony();
        }
    },
    components: {
        szlWarnTable,
        componyWarnCheckModal,
        componyWarnPunishModal,
        szlDialog,
        szlDropdown
    },
    mounted() {
        this.init();
        setInterval(() => {
            this.init();
        }, TIMING);
    }
};
</script>

<style lang='scss' scoped>
.list-content > div {
    height: 50%;
    padding: 5px 20px 10px 20px;

    &:first-child {
        border-bottom: 2px solid #131a36;
    }
}

.warn-title {
    height: 30px;
    line-height: 30px;
}

.warn-title {
    >div {
        float: left;
         .time-rang{
        	display: inline-block;
        	border: 1px solid #424242;
        	height: 24px;
        	padding: 0 10px;
        	line-height: 24px;
        	border-radius: 3px;
        	cursor: pointer;
        }
        
        .time-rang-active{
        	background: #0968DF;
        }
    }

    // > a {
    //     display: block;
    //     float: right;
    //     cursor: pointer;
    // }
    .dropdown{
        float: right;
    }
}
</style>