<template>
    <div id="componyDetails" v-show="show">
        <div class="back">
            <span @click="goBack">返回</span>
            {{name}}
        </div>
        <div id="mapBox">
            <div :style="{height: mapHeight+'px'}" id="detaisMap"></div>
        </div>
        <div class="details-describe">
            <span style="font-weight:bold">风险等级调级标准</span> <br>
            <span class="point"></span>
            <span style="margin-top:10px" v-show="adjustment!=0">
                <span v-if="grade">
                    将风险等级调至
                    <span style="font-size:18px">{{toHz(headCode+(code[grade]+parseInt(adjustment)))}}</span>
                    级
                </span>
                <span v-if="!grade">
                    <span v-show="adjustment>0">调高{{adjustment}}级</span>
                    <span v-show="adjustment<0">调低{{-adjustment}}级</span>
                </span>
            </span>
            <span style="margin-top:10px" v-show="adjustment==0">
                <span>保持原有等级</span>
            </span>
            <span style="margin-top:10px">
                <span v-show="numa>0">1.故意违反食品安全法律法规，且受到{{numa}}次行政处罚； </span><br>
                <span v-show="numb>0">
                    <span v-text="numa==0?1:2"></span>.有{{numb}}次市级或省级、国家级监督抽检不合格。</span>
            </span> <br>
            <span v-show="numc=='YES'">{{numIndex}}.获得良好生产规范、危害分析与关键控制点体系认证。</span>
            <span v-show="numa==0&&numb==0&&numc=='NO'">未出现符合风险等级调高或调低的情形</span>
            </span>
        </div>
        <Spin v-show='detailShow' fix>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
        </Spin>
    </div>
</template>
<script>
import echarts from "echarts";
import http from "./http";
function formatText(txt) {
    if (txt && txt != "null") {
        return txt;
    } else {
        return "暂无数据";
    }
}
export default {
    data() {
        return {
            headCode: "\\u004",
            code: {
                A: 1,
                B: 2,
                C: 3,
                D: 4
            },
            name: "",
            show: false,
            detailShow: true,
            numa: "",
            numb: "",
            numc: "",
            numIndex: 3,
            grade: "",
            adjustment: "",
            mapHeight: 0,
            mapDefaultHeight: 0,
            data: [
                {
                    name: "",
                    label: {
                        normal: {
                            show: true,
                            formatter(value) {
                                let arr = value.name.split("");
                                let txt = "";
                                arr.forEach((item, i) => {
                                    if (i != 0 && i % 7 == 0) {
                                        txt += "\n" + item;
                                    } else {
                                        txt += item;
                                    }
                                });
                                return txt;
                            },
                            align: "right",
                            position: "left"
                        }
                    },
                    children: []
                }
            ]
        };
    },
    methods: {
        toHz(e) {
            ///将Unicode转换成中文
            return unescape(e.replace(/\\u/g, "%u"));
        },
        goBack() {
            this.show = false;
            this.detailShow = true;
        },
        getDatas(e) {
            this.name = e;
            this.data[0].name = e;
            this.show = true;
            this.$nextTick(() => {
                this.getMsg();
            });
        },
        getMaps() {
            let myChart = null;
            let div = document.getElementById("detaisMap");
            div.removeAttribute("_echarts_instance_"); //解决重复执行的问题
            myChart = echarts.init(div);
            let data = this.data;
            let option = {
                tooltip: {
                    trigger: "item",
                    triggerOn: "mousemove",
                    backgroundColor: "#1C1F21",
                    padding: [10, 10],
                    formatter(value) {
                        let txt = "",
                            num = 0;
                        value.name.split("").forEach((item, i) => {
                            if (num == 0) {
                                if (item != "：") {
                                    txt += item;
                                } else {
                                    num++;
                                    txt += item + "<br />";
                                }
                            } else {
                                if (num % 20 == 0) {
                                    txt += item + "<br />";
                                } else {
                                    txt += item;
                                }
                                num++;
                            }
                        });
                        return txt;
                    }
                },
                series: [
                    {
                        type: "tree",
                        data: data,
                        top: "6%",
                        left: "7%",
                        bottom: "6%",
                        right: "20%",
                        symbol: "circle",
                        symbolSize: 8,
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                borderColor: "#96C3E1"
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: "#96C3E1",
                                curveness: 0.5
                            }
                        },
                        label: {
                            normal: {
                                position: "top",
                                align: "right",
                                fontSize: 14,
                                color: "#fff"
                            }
                        },

                        leaves: {
                            label: {
                                normal: {
                                    position: "right",
                                    verticalAlign: "middle",
                                    align: "left"
                                }
                            }
                        },

                        expandAndCollapse: true,
                        animationDuration: 500,
                        animationDurationUpdate: 500
                    }
                ]
            };
            myChart.setOption(option);
            let num = 0;
            let h = document.getElementById("mapBox").offsetHeight;
            let nodes = myChart._chartsViews[0]._data._graphicEls;
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i]) {
                    num++;
                }
            }
            this.mapHeight = num * 20 < h ? h : num * 20;
            document
                .getElementById("detaisMap")
                .getElementsByTagName("div")[0].style.height =
                this.mapHeight + "px";
            this.$nextTick(() => {
                myChart.resize();
            });
            // detaisMap
            myChart.on("click", e => {
                let num = 0;
                let h = document.getElementById("mapBox").offsetHeight;
                console.log(h);
                let nodes = myChart._chartsViews[0]._data._graphicEls;
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i]) {
                        num++;
                    }
                }
                this.mapHeight = num * 20 < h ? h : num * 20;
                document
                    .getElementById("detaisMap")
                    .getElementsByTagName("div")[0].style.height =
                    this.mapHeight + "px";
                setTimeout(() => {
                    myChart.resize();
                }, 200);
            });
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
        async getMsg() {
            this.data[0].children = [];
            this.detailShow = true;
            let [res, resa, resb, resc, resd] = await Promise.all([
                http.get(
                    //获取基础信息
                    "/query/enterprises/" + this.name + "/basicInformation"
                ),
                http.get(
                    //抽检信息
                    "/query/enterprises/" + this.name + "/inspection"
                ),
                http.get(
                    //监管信息
                    "/query/enterprises/" + this.name + "/regulatory"
                ),
                http.get(
                    //处罚信息
                    "/query/enterprises/" + this.name + "/punishment"
                ),
                http.get(
                    //后处理数据
                    "/query/enterprises/" + this.name + "/afterProcessing"
                )
            ]);
            if (res) {
                this.numIndex = 3;
                this.numa = res.data.numPunishment;
                this.numb = res.data.numUnqualifiedInspection;
                if (res.data.grade && res.data.grade != "null") {
                    this.grade = res.data.grade;
                } else {
                    this.grade = "";
                }
                this.numc = res.data.hasHaccp;
                if (this.numa == 0) {
                    this.numIndex--;
                }
                if (this.numb == 0) {
                    this.numIndex--;
                }
                this.adjustment = res.data.adjustment;
                let yyzz;
                if (res.data.organizationCode) {
                    yyzz = res.data.organizationCode;
                }
                if (res.data.businessLicense) {
                    yyzz = res.data.businessLicense;
                }
                if (res.data.unifiedCode) {
                    yyzz = res.data.unifiedCode;
                }
                let datas = {
                    name: "基础信息",
                    children: [
                        {
                            name: "营业执照号码：" + formatText(yyzz)
                        },
                        {
                            name: "生产许可证",
                            collapsed: false,
                            children: [
                                {
                                    name:
                                        "编号：" +
                                        formatText(res.data.licenseKey)
                                },
                                {
                                    name:
                                        "有效期至：" +
                                        formatText(res.data.licenseValidity)
                                }
                            ]
                        },
                        {
                            name: "法定代表人：" + formatText(res.data.qy)
                        },
                        {
                            name: "所属区域：" + formatText(res.data.area)
                        },
                        {
                            name: "生产地址：" + formatText(res.data.address)
                        },
                        {
                            name:
                                "成立日期：" +
                                formatText(res.data.licenseIssueDate)
                        }
                    ]
                };

                let datasa = {
                    name: "产品信息",
                    children: [
                        {
                            name:
                                "产品类型：" +
                                formatText(res.data.productCategory)
                        },
                        {
                            name:
                                "产品明细：" +
                                formatText(res.data.productDetail)
                        }
                    ]
                };
                this.data[0].children[0] = { ...datas };
                this.data[0].children[1] = { ...datasa };
            }

            if (resa) {
                let datas = {
                    name: "抽检信息",
                    collapsed: true,
                    children: [
                        {
                            name: "抽检时间",
                            collapsed: false,
                            children: []
                        }
                    ]
                };
                if (resa.data.length) {
                    resa.data.forEach(item => {
                        datas.children[0].children.push({
                            name: item.sampleDate.split(" ")[0],
                            collapsed: false,
                            children: [
                                {
                                    name:
                                        "抽检类型：" + formatText(item.category)
                                },
                                {
                                    name:
                                        "抽检结果：" +
                                        (item.result == 1 ? "合格" : "不合格")
                                },
                                {
                                    name:
                                        "检验报告书编号：" +
                                        formatText(item.sampleNumber)
                                }
                            ]
                        });
                    });
                } else {
                    datas.children = [
                        {
                            name: "暂无数据"
                        }
                    ];
                }
                this.data[0].children[2] = { ...datas };
            }

            if (resb) {
                let datas = {
                    name: "监管信息",
                    collapsed: true,
                    children: [
                        {
                            name: "检查时间",
                            collapsed: false,
                            children: []
                        }
                    ]
                };
                if (resb.data.length) {
                    resb.data.forEach(item => {
                        datas.children[0].children.push({
                            name: item.opDate.split(" ")[0],
                            collapsed: false,
                            children: [
                                {
                                    name: "检查类别：" + formatText(item.fcbj)
                                },
                                {
                                    name: "检查结果：" + formatText(item.jcjg)
                                },
                                {
                                    name: "处理结果：" + formatText(item.cljg)
                                }
                            ]
                        });
                    });
                } else {
                    datas.children = [
                        {
                            name: "暂无数据"
                        }
                    ];
                }
                this.data[0].children[3] = { ...datas };
            }

            if (resc) {
                let datas = {
                    name: "处罚信息",
                    collapsed: true,
                    children: [
                        {
                            name: "处罚日期",
                            collapsed: false,
                            children: []
                        }
                    ]
                };
                if (resc.data.length) {
                    resc.data.forEach(item => {
                        datas.children[0].children.push({
                            name: item.cfjdrq.split(" ")[0],
                            collapsed: false,
                            children: [
                                {
                                    name:
                                        "违法行为类型：" + formatText(item.wfxw)
                                },
                                {
                                    name: "处罚内容：" + formatText(item.cfnr)
                                },
                                {
                                    name: "处罚依据：" + formatText(item.cfjdyj)
                                }
                            ]
                        });
                    });
                } else {
                    datas.children = [
                        {
                            name: "暂无数据"
                        }
                    ];
                }
                this.data[0].children[4] = { ...datas };
            }

            if (resd) {
                let datas = {
                    name: "后处理信息",
                    collapsed: true,
                    children: [
                        {
                            name: "录入时间",
                            collapsed: false,
                            children: []
                        }
                    ]
                };
                if (resd.data.length) {
                    resd.data.forEach(item => {
                        datas.children[0].children.push({
                            name: item.opDate ? item.opDate.split(" ")[0] : "",
                            collapsed: false,
                            children: [
                                {
                                    name:
                                        "产品名称：" +
                                        formatText(item.productName)
                                },
                                {
                                    name:
                                        "后处理类型：" + formatText(item.opDate)
                                },
                                {
                                    name:
                                        "处理措施：" +
                                        formatText(item.doMeasure)
                                },
                                {
                                    name: "罚没金额：" + formatText(item.fine)
                                }
                            ]
                        });
                    });
                } else {
                    datas.children = [
                        {
                            name: "暂无数据"
                        }
                    ];
                }
                this.data[0].children[5] = { ...datas };
            }
            let refe = true;
            if (refe) {
                let datas = {
                    name: "投诉信息",
                    collapsed: true,
                    children: [
                        {
                            name: "暂无信息"
                        }
                    ]
                };
                this.data[0].children[6] = { ...datas };
            }
            let reff = true;
            if (reff) {
                let datas = {
                    name: "诚信信息",
                    collapsed: true,
                    children: [
                        {
                            name: "暂无信息"
                        }
                    ]
                };
                this.data[0].children[7] = { ...datas };
            }
            if (res) {
                //风险等级信息
                let txt;
                if (!res.data.grade || res.data.grade == "null") {
                    txt = "暂无数据";
                } else {
                    switch (res.data.grade) {
                        case "A":
                            txt = "至少1次";
                            break;
                        case "B":
                            txt = "至少1-2次";
                            break;
                        case "C":
                            txt = "至少2-3次";
                            break;
                        case "D":
                            txt = "至少3-4次";
                            break;
                    }
                }
                let datas = {
                    name: "风险分级信息",
                    children: [
                        {
                            name: "评级年度：" + formatText(res.data.year)
                        },
                        {
                            name: "风险等级：" + formatText(res.data.grade)
                        },
                        {
                            name: "年检频次范围：" + txt
                        }
                    ]
                };
                this.data[0].children[8] = { ...datas };
            }
            this.detailShow = false;
            this.getMaps();
        }
    },
    mounted() {}
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
#componyDetails {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #192732;
    z-index: 1000;
    min-width: 1200px;
    min-height: 400px;
    padding-right: 200px;

    .ivu-spin-fix {
        background-color: #192732;
    }

    .back {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 100;

        span {
            position: relative;
            display: inline-block;
            cursor: pointer;
            color: #2681DC;
            padding: 0 6px;
            margin-right: 6px;

            &:after {
                position: absolute;
                right: -2px;
                top: 5px;
                bottom: 5px;
                width: 1px;
                content: '';
                background: #2681DC;
            }
        }
    }

    #mapBox {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        border-right: 1px solid #253542;

        #detaisMap {
            width: 100%;
            min-height: 100%;
        }
    }

    .details-describe {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 200px;
        padding: 20px 10px;
        font-size: 12px;

        >span {
            display: inline-block;
            line-height: 22px;
        }

        .point {
            position: relative;
            top: -2px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #038CEA;
            margin-right: 2px;
        }
    }
}
</style>