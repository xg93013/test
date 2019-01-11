<template>
    <div id="comAnalysis">
        <top :top="top" />
        <div class="datas">
            <div>
                <div class="left-top">
                    <against :against="against" />
                </div>
                <div class="left-bottom">
                    <orderDinner :orderDinner="orderDinner" @outFullScreen="outFullScreen" @init="init" />
                </div>
            </div>
            <div>
                <cdMaps :cdMaps="cdMaps" />
            </div>
            <div>
                <div class="right-top">
                    <analysis :analysis="analysis" />
                </div>
                <div class="right-bottom">
                    <wordCloud :wordCloud="wordCloud"/>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
import top from "./top.vue"; //顶部列表
import against from "./against.vue"; //违规类型对比
import orderDinner from "./orderDinner.vue"; //网络订餐平台对比
import analysis from "./analysis.vue"; //商家分析动态
import wordCloud from "./wordCloud.vue"; //风险词云
import cdMaps from "./cdMaps.vue"; //成都地图
import http from "@/unit/http";
import apis from "@/unit/apis";
const {
    STATISTICS, //顶部总监测商家，违规商家，违规率
    ILLEGAL_TYPE_COMPARE, //违规类型对比
    REGION_ILLEGAL_RATIOS, //地图数据
    PLAT_FORM_COMPARE, //网络订餐平台对比
    SHOP_DYNAMIC, //商家动态分析
    RISKWORDCLOUD_TOP50, //风险词云
    UPDATE_TIME
} = apis;
export default {
    data() {
        return {
            nums: [],
            topData: {},
            against: [],
            top: {},
            cdMaps: [],
            orderDinner: [],
            analysis: [],
            wordCloud: [],
            times: "",
            myInter: null,
            cancels:[]
        };
    },
    components: {
        top,
        against,
        orderDinner,
        cdMaps,
        analysis,
        wordCloud
    },
    beforeRouteLeave(to, from, next) {
        //离开页面前先清除轮询
        if (this.myInter) {
            clearInterval(this.myInter);
            this.cancelAjax("CLOSE_AJAX");
        }
        next();
    },
    methods: {
        cancelAjax(){//关闭ajax请求
            this.cancels.forEach(item=>{
                item();
            })
        },
        init(e) {
            this.$emit("init", e);
        },
        outFullScreen() {
            this.$emit("outFullScreen");
        },
        async getData() {
            if (this.analysis.length) {
                this.times = Date.parse(new Date());
            }
            this.cancels = [];
            let [
                top,
                against,
                cdMaps,
                orderDinner,
                analysis,
                wordCloud
            ] = await Promise.all([
                http.get(STATISTICS,{},this.cancels),
                http.get(ILLEGAL_TYPE_COMPARE,{},this.cancels),
                http.get(REGION_ILLEGAL_RATIOS,{},this.cancels),
                http.get(PLAT_FORM_COMPARE,{},this.cancels),
                http.get(SHOP_DYNAMIC + this.times,{},this.cancels),
                http.get(RISKWORDCLOUD_TOP50,{},this.cancels)
            ]);
            if (against) {
                this.against = [...against.result];
            }
            if (top) {
                this.top = {
                    ...top.result
                };
            }
            if (cdMaps) {
                if (cdMaps.result.length != this.cdMaps.length) {
                    this.cdMaps = [...cdMaps.result];
                } else {
                    for (let i = 0, n = cdMaps.result.length; i < n; i++) {
                        ///地图打点自定义图标不改变的bug，暂时采用此方法，后期如有时间再查找原因
                        if (!this.cdMaps[i]) {
                            this.cdMaps = [...cdMaps.result];
                            break;
                        } else {
                            if (
                                cdMaps.result[i].region !=
                                    this.cdMaps[i].region ||
                                cdMaps.result[i].illRate !=
                                    this.cdMaps[i].illRate
                            ) {
                                this.cdMaps = [...cdMaps.result];
                                break;
                            }
                        }
                    }
                }
            }
            if (orderDinner) {
                this.orderDinner = [...orderDinner.result];
            }
            if (analysis) {
                this.analysis = [...analysis.result];
            }
            if (wordCloud) {
                this.wordCloud = [...wordCloud.result];
            }
            if (this.$store.state.loading) {
                this.$store.commit("changeLoading", false);
            }
        }
    },
    created() {
        this.getData();
        this.myInter = setInterval(() => {
            this.getData();
        }, UPDATE_TIME);
    }
};
</script>
<style lang="scss">
#content #comAnalysis {
    height: 100%;
    min-height: 800px;
    padding-top: 180px;
    .datas {
        width: 100%;
        height: 100%;
        > div {
            float: left;
            height: 100%;
            &:first-child {
                width: 26%;
            }
            &:last-child {
                width: 24%;
            }
            &:nth-child(2) {
                width: 50%;
                padding: 0 20px;
            }
        }
        .left-top,
        .left-bottom,
        .right-top,
        .right-bottom {
            width: 100%;
            height: 50%;
        }
        .left-top, .right-top {
            padding-bottom: 10px;
        }
        .left-bottom, .right-bottom {
            padding-top: 10px;
        }
    }
    .charts {
        position: relative;
        width: 100%;
        height: 100%;
        background: #f9fafb;
        .charts-title {
            width: 100%;
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            font-size: 18px;
            border-bottom: 1px solid #e6e6e6;
        }
    }
}

#content.is-full-screen #comAnalysis {
    .charts {
        position: relative;
        background: #464f82;
    }
    .charts-title {
        border-bottom: 1px solid #333969;
    }
}
</style>