<style lang="sass">
    @import "../../styles/common.scss";
    @import "./main.scss";
    .fullScreenBtn {
        @include positionStyle(absolute);
        top: 320px;
        left: 45px;
    }
    
    .fullScreenStyle {
        box-sizing: border-box;
        .ivu-modal {
            // width: 100% !important;
            // height: 100%;
            @include normalStyle(100% !important, 100%);
            top: 0px;
            .ivu-modal-content {
                @include normalStyle(null, 100%);
                border-radius: 0px;
                .ivu-modal-header {
                    @include positionStyle(absolute);
                    @include normalStyle(100% !important, 100px);
                    border: none;
                    background-color: #2d8cf0;
                    text-align: center;
                    p {
                        color: white;
                        font-size: 60px;
                        height: 72px;
                        line-height: 72px;
                    }
                }
                .ivu-modal-body {
                    height: 100%;
                    @include edgeStyle(null, 100px 0 0 0);
                    .cancelFullScreenBtn {
                        @include positionStyle(absolute);
                        top: 350px;
                        left: 30px;
                    }
                    >div {
                        height: 100%;
                    }
                    .mapContainer {
                        padding: 0px;
                    }
                }
                .ivu-modal-footer {
                    display: none;
                }
            }
        }
    }
</style>
<template>
    <div class="app tabpane-common">
        <!-- 资源应用 -->
        <Tabs type="card" :animated="false" v-model="tabModel.value" @on-click="tabClick">
            <TabPane v-if="userRights.case_map_menu" class="ivu-tabs-tabpane-map" :label="tabModel.tabs.caseMap.label" :name="tabModel.tabs.caseMap.name">
                <caseMap v-if="!fullScreenModel.showFull"></caseMap>
            </TabPane>
            <TabPane v-if="userRights.group_party_menu" class="ivu-tabs-tabpane-map" :label="tabModel.tabs.partyEnterpriseMap.label" :name="tabModel.tabs.partyEnterpriseMap.name">
                <partyMap v-if="!fullScreenModel.showFull"></partyMap>
            </TabPane>
            <TabPane v-if="userRights.pension_audit_menu" :label="tabModel.tabs.oldAgePension.label" :name="tabModel.tabs.oldAgePension.name">
                <oldAge :pagenum="1" ref="oldagepen"></oldAge>
            </TabPane>
            <TabPane v-if="userRights.senile_cert_menu" :label="tabModel.tabs.senileCardHandling.label" :name="tabModel.tabs.senileCardHandling.name">
                <oldAge :pagenum="2" ref="cardhand"></oldAge>
            </TabPane>
        </Tabs>

        <Button v-show="['caseMap','partyEnterpriseMap'].includes(tabModel.value)" class="fullScreenBtn" v-text="fullScreenModel.fullBtn.label" @click="fullScreenModel.fullBtn.click" :type="fullScreenModel.fullBtn.type">
            
        </Button>
        <Modal v-model="fullScreenModel.showFull" class-name="fullScreenStyle" :closable="false">
            <p slot="header">
                <span>合作街道{{tabModel.tabs[tabModel.value].label}}</span>
            </p>
            <div v-show="tabModel.value=='caseMap'">
                <caseMap v-if="fullScreenModel.showFull"></caseMap>
            </div>
            <div v-show="tabModel.value=='partyEnterpriseMap'">
                <partyMap v-if="fullScreenModel.showFull"></partyMap>
            </div>
            <Button class="cancelFullScreenBtn" v-text="fullScreenModel.cancelFullBtn.label" @click="fullScreenModel.cancelFullBtn.click" :type="fullScreenModel.cancelFullBtn.type">
            </Button>
            <p slot="footer">
                <!-- <span>全屏的</span> --></p>
        </Modal>
    </div>
</template>
<script>
    import { communicationService, utilService, modalService } from '@/libs/uBase';
    import caseMap from './case.vue';
    import partyMap from './party.vue';
    import caseMapF from './case.vue';
    import partyMapF from './party.vue';
    import oldAge from './oldAge.vue';
    var appVM;
    export default {
        data: function(argument) {
            return {
                userRights: JSON.parse(sessionStorage.getItem("szlUserRights")),
                oldAgePension: false,
                senileCardHandling: false,
                tabModel: {
                    value: "",
                    tabs: {
                        caseMap: {
                            name: "caseMap",
                            label: "发案地图"
                        },
                        partyEnterpriseMap: {
                            name: "partyEnterpriseMap",
                            label: "两新组织党建地图"
                        },
                        oldAgePension: {
                            name: "oldAgePension",
                            label: "养老金年审"
                        },
                        senileCardHandling: {
                            name: "senileCardHandling",
                            label: "老年证办理"
                        }

                    }
                },
                fullScreenModel: {
                    fullBtn: {
                        label: "全屏",
                        click: function() {
                            appVM.fullScreenModel.showFull = true;
                        },
                        type: "primary"
                    },
                    cancelFullBtn: {
                        label: "退出全屏",
                        click: function() {
                            appVM.fullScreenModel.showFull = false;
                        },
                        type: "primary"
                    },
                    showFull: false,
                }
            }
        },
        methods: {
            tabClick(e) { ///处理tab页请求
                if(e == "oldAgePension") {
                	this.$refs.oldagepen.clearCheck()
                	if(!this.oldAgePension){
                		this.oldAgePension = true;
                    	this.$refs.oldagepen.init();
                	}
                }
                if(e == "senileCardHandling") {
                	this.$refs.cardhand.clearCheck();
                	if(!this.senileCardHandling){
                		this.senileCardHandling = true;
                    	this.$refs.cardhand.init();
                	}
                }
            },
            currentTab() {
                let rights = JSON.parse(sessionStorage.getItem("szlUserRights"));
                if(rights.case_map_menu) {
                    this.tabModel.value = "caseMap";
                    return false;
                };
                if(rights.group_party_menu) {
                    this.tabModel.value = "partyEnterpriseMap";
                    return false;
                };
                if(rights.pension_audit_menu) {
                    this.tabModel.value = "oldAgePension";
                    this.$nextTick(()=>{
                        this.oldAgePension = true;
                        this.$refs.oldagepen.init();
                    })
                    return false;
                };
                if(rights.senile_cert_menu) {
                    this.tabModel.value = "senileCardHandling";
                    this.$nextTick(()=>{
                        this.senileCardHandling = true;
                        this.$refs.cardhand.init();
                    })
                    return false;
                };
            }
        },
        components: {
            caseMap: caseMap,
            partyMap: partyMap,
            caseMapF: caseMap,
            partyMapF: partyMap,
            oldAge
        },
        created() {
            appVM = this;
            this.currentTab();
        }
    }
</script>