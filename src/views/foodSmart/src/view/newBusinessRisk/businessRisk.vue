<template>
    <div id="newMap">
        <Amap />
        <div id='newMapContent'>

        </div>
        <div class="left">
            <div>
                生产企业调级标准
                <div class='describe' @mouseover="show=true" @mouseout="show=false">
                    ？
                    <transition name="fade">
                        <div v-show="show">更新时间：{{upDateTime}}</div>
                    </transition>
                </div>
            </div>
            <div class="tabs">
                <Cascader @on-change="tabsChange" :data="tabs" trigger="hover"></Cascader>
            </div>
        </div>
        <div class="right-top">
            <Row>
                <Col align="right">
                <Input size='small' v-model="componyName" placeholder="企业名称" style='width:200px' @input="componyChage" @keyup.enter.native="getComponys(1)">
                <Button slot="append" icon="ios-search" @click="getComponys(1)"></Button>
                </Input>
                </Col>
            </Row>
        </div>
        <div class="right">

            <div>
                <div class="title">
                    生产企业列表
                    <a :href="exportUrl"></a>
                </div>
                <!-- <div class="nav-lists">
                    <div>企业名称</div>
                    <div>风险等级</div>
                    <div>调级标准</div>
                </div> -->
            </div>
            <div style="position:absolute;top:0;bottom:0;left:0;right:0">
                <div class="deatils">
                    <span class="no-data" v-show="total==0">暂无数据</span>
                    <div class="detail-lists" :class="{'detail-lists-active':detailIndex==index}" v-for="(item,index) in lists" :key="index">
                        <div>
                            <span class="name">
                                <img class="addr" v-if="!['A','B','C','D'].includes(item.grade)" :src="require('./images/list_'+'Z'+'.png')" alt="">
                                <img class="addr" v-if="['A','B','C','D'].includes(item.grade)" :src="require('./images/list_'+item.grade+'.png')" alt=""> {{index+1}}.{{item.enterpriseName}}
                            </span> <br> {{item.address}}
                        </div>
                        <div>
                            <span>{{['A','B','C','D'].includes(item.grade)?item.grade:"—"}}</span>
                        </div>
                        <span class="cover" @click="mapDetails(item.enterpriseName)"></span>
                        <div @click="detail(item,index)">
                            <span v-if="['A','B','C','D'].includes(item.grade)">
                                {{toHz(headCode+(code[item.grade]+item.adjustment))}}
                                <img v-show="item.adjustment>0" class="standard" :src="require('./images/t.png')" alt="">
                                <img v-show="item.adjustment<0" class="standard" :src="require('./images/b.png')" alt="">
                            </span>
                            <span v-if="!['A','B','C','D'].includes(item.grade)">
                                <img v-show="item.adjustment>0" class="standard" :src="require('./images/t.png')" alt="">
                                <img v-show="item.adjustment<0" class="standard" :src="require('./images/b.png')" alt="">
                                <span v-show="item.adjustment==0">—</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class='page'>
                    <div>共 {{total}} 条</div>
                    <div v-show="total>0">
                        <span class="prev" @click="prevPage">
                            <Icon type="chevron-left"></Icon>
                        </span> 第 {{pageNum}}/{{totalPage}} 页
                        <span class="next" @click="nextPage">
                            <Icon type="chevron-right"></Icon>
                        </span>
                    </div>
                    <div v-show="total>0">
                        跳至 <input @keyup.enter="goPage" v-model="goPageNum" type="number"> 页
                    </div>
                </div>
                <Spin v-show='componyShow' fix>
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
            </div>
        </div>
        <div class="grade-rank">
            <div>
                <span></span> D级
            </div>
            <div>
                <span></span> C级
            </div>
            <div>
                <span></span> B级
            </div>
            <div>
                <span></span> A级
            </div>
            <div>
                <span></span> 暂无风险等级
            </div>
        </div>
        <componyDetails ref="componyDetails" />
    </div>
</template>
<script>
import http from "./http";
import componyDetails from "./compony-details.vue";
export default {
    data() {
        return {
            upDateTime: "",
            exportUrl: "/api/query/docs/enterprises",
            headCode: "\\u004",
            code: {
                A: 1,
                B: 2,
                C: 3,
                D: 4
            },
            numIndex: 3,
            detailIndex: -1,
            show: false,
            componyShow: false,
            tabs: [
                {
                    value: 1,
                    label: "全部"
                },
                {
                    value: 2,
                    label: "区域分布",
                    children: []
                },
                {
                    value: 3,
                    label: "风险等级",
                    children: [
                        {
                            value: "A",
                            label: "A级"
                        },
                        {
                            value: "B",
                            label: "B级"
                        },
                        {
                            value: "C",
                            label: "C级"
                        },
                        {
                            value: "D",
                            label: "D级"
                        },
                        {
                            value: "NULL",
                            label: "暂无风险等级"
                        }
                    ]
                },
                {
                    value: 4,
                    label: "调级标准",
                    children: [
                        {
                            value: "2",
                            label: "调高两级"
                        },
                        {
                            value: "1",
                            label: "调高一级"
                        },
                        {
                            value: "-1",
                            label: "调低一级"
                        },
                        {
                            value: "0",
                            label: "保持原有等级"
                        }
                    ]
                }
            ],
            lists: [],
            componyName: "", //企业名称
            districtName: "", //区域名称
            grade: "", //风险等级
            levelChange: "", //调级标准
            pageNum: 1,
            pageSize: 100,
            total: 0,
            totalPage: 0,
            goPageNum: 1,
            isSearch: false,
            detailMsg: {
                //详情信息
            },
            mapMsg: {
                //地图相关
                map: null,
                markers: [],
                markersAll: [],
                infoWindow: null,
                largeImg: "",
                details: {}
            }
        };
    },
    components: {
        Amap: {
            render(createElement) {
                return createElement("script", {
                    attrs: {
                        type: "text/javascript",
                        src:
                            "https://webapi.amap.com/maps?v=1.3&key=c85b169acc3c5472b5f282ec4cfb5198&plugin=AMap.ToolBar&callback=init"
                    }
                });
            }
        },
        componyDetails
    },
    methods: {
        async getUpDate() {
            //获取更新时间
            let res = await http.get("/query/data/updateDate");
            if (res) {
                this.upDateTime = res.data;
            }
        },
        tabsChange(e) {
            switch (e[0]) {
                case 1:
                    this.tabsChangeFun();
                    break;
                case 2:
                    this.tabsChangeFun(e[1]);
                    break;
                case 3:
                    this.tabsChangeFun("", e[1]);
                    break;
                case 4:
                    this.tabsChangeFun("", "", e[1]);
                    break;
                default:
                    this.tabsChangeFun("", "", "");
                    break;
            }
        },
        tabsChangeFun(name = "", grade = "", level = "") {
            this.pageNum = 1;
            this.districtName = name;
            this.grade = grade;
            this.levelChange = level;
            this.$nextTick(() => {
                this.getComponys();
            });
        },
        detail(item, e) {
            if (this.mapMsg.markersAll[e] != 1) {
                if (this.detailIndex != e) {
                    this.detailIndex = e;
                }
                let img = ["A", "B", "C", "D"].includes(item.grade)
                    ? require("./images/icon-map" + item.grade + ".png")
                    : require("./images/icon-mapZ.png");
                if (this.mapMsg.largeMarker) {
                    this.mapMsg.largeMarker.setIcon(
                        new AMap.Icon({
                            image: this.mapMsg.largeImg
                        })
                    );
                }
                this.mapMsg.markersAll[e].setIcon(
                    new AMap.Icon({
                        image: img,
                        imageSize: new AMap.Size(23.8, 37.8)
                    })
                );
                this.mapMsg.markersAll[e].setTop(true);
                this.mapMsg.largeMarker = this.mapMsg.markersAll[e];
                this.mapMsg.largeImg = img;
                let obj = {
                    target: this.mapMsg.markersAll[e]
                };
                this.markerClick(obj);
            }
        },
        mapDetails(e) {
            this.modalShow = false;
            this.$refs.componyDetails.getDatas(e);
        },
        prevPage() {
            if (this.pageNum > 1) {
                this.pageNum--;
                this.$nextTick(() => {
                    this.getComponys();
                });
            }
        },
        nextPage() {
            if (this.pageNum < this.totalPage) {
                this.pageNum++;
                this.$nextTick(() => {
                    this.getComponys();
                });
            }
        },
        goPage() {
            if (this.goPageNum <= 1) {
                this.goPageNum = 1;
            } else if (this.goPageNum >= this.totalPage) {
                this.goPageNum = this.totalPage;
            } else {
                this.goPageNum = parseInt(this.goPageNum);
            }
            this.pageNum = this.goPageNum;
            this.$nextTick(() => {
                this.getComponys();
            });
        },
        componyChage() {
            //企业名称为空自动搜索
            if (this.isSearch && !this.componyName) {
                this.pageNum = 1;
                this.$nextTick(() => {
                    this.getComponys();
                });
            }
        },
        async getAreas() {
            ///区域获取
            let res = await http.get("/data/getLabel?label=district");
            if (res) {
                this.tabs[1].children = res.map(item => {
                    return {
                        label: item.districtName,
                        value: item.districtName
                    };
                });
            }
        },
        async getComponys(e) {
            if (e) {
                this.pageNum = 1;
            }
            //获取企业列表
            let data = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                area: this.districtName,
                grade: this.grade,
                adjustment: this.levelChange,
                enterpriseName: this.componyName
            };
            this.componyShow = true;
            let res = await http.get("/query/enterprises", data);
            this.componyShow = false;
            if (this.componyName) {
                this.isSearch = true;
            } else {
                this.isSearch = false;
            }
            if (res) {
                this.total = res.data.total;
                this.totalPage = res.data.pages;
                this.lists = [...res.data.list];
                if (this.mapMsg.markers.length) {
                    if (this.mapMsg.markerLarge) {
                        this.mapMsg.markers.push(this.mapMsg.markerLarge);
                    }
                    this.mapMsg.map.remove(this.mapMsg.markers);
                    if (this.mapMsg.infoWindow.getIsOpen()) {
                        this.closeMarker();
                    }
                }
                this.mapMsg.markers = [];
                this.mapMsg.markersAll = [];
                this.detailIndex = -1;
                this.mapMsg.infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -30)
                });
                this.lists.forEach((item, i) => {
                    this.getMarkers(item, i);
                });
            }
        },
        getMarkers(item, i) {
            if (item.latitude && item.latitude != "null") {
                let img = ["A", "B", "C", "D"].includes(item.grade)
                    ? require("./images/icon-map" + item.grade + ".png")
                    : require("./images/icon-mapZ.png");
                let marker = new AMap.Marker({
                    position: [item.longitude, item.latitude],
                    icon: new AMap.Icon({
                        image: img
                    }),
                    title: item.enterpriseName,
                    map: this.mapMsg.map
                });
                let headImg = require("./images/head.png"),
                    addrImg = require("./images/addr.png"),
                    tImg = require("./images/t.png"),
                    bImg = require("./images/b.png"),
                    a = 1,
                    b = 2,
                    c = 3;
                let tbImg = "";
                if (["A", "B", "C", "D"].includes(item.grade)) {
                    if (item.adjustment > 0) {
                        tbImg = `<img src=${tImg} alt="" />`;
                    } else if (item.adjustment < 0) {
                        tbImg = `<img src=${bImg} alt="" />`;
                    } else {
                        tbImg = "";
                    }
                }
                let lastGrade = "",
                    prevGrade = "—",
                    lastTxt = "调整等级至";
                if (["A", "B", "C", "D"].includes(item.grade)) {
                    prevGrade = item.grade;
                    if (item.adjustment == 0) {
                        lastTxt = "保持原有等级";
                    } else {
                        lastGrade = this.toHz(
                            this.headCode +
                                (this.code[item.grade] + item.adjustment)
                        );
                    }
                } else {
                    if (item.adjustment > 0) {
                        lastTxt = "调高" + item.adjustment + "级";
                    } else if (item.adjustment < 0) {
                        lastTxt = "调低" + -item.adjustment + "级";
                    } else {
                        lastTxt = "保持原有等级";
                    }
                }
                let bdiv = "";
                if (item.numPunishment == 0) {
                    b--;
                    c--;
                }
                if (item.numUnqualifiedInspection == 0) {
                    c--;
                }
                if (item.numPunishment > 0) {
                    if (
                        item.numUnqualifiedInspection == 0 &&
                        item.hasHaccp == "NO"
                    ) {
                        bdiv += `<div>${a}.故意违反食品安全法律法规，且受到${
                            item.numPunishment
                        }次行政处罚。</div>`;
                    } else {
                        bdiv += `<div>${a}.故意违反食品安全法律法规，且受到${
                            item.numPunishment
                        }次行政处罚; </div>`;
                    }
                }
                if (item.numUnqualifiedInspection > 0) {
                    if (item.hasHaccp == "YES") {
                        bdiv += `<div>${b}.有${
                            item.numUnqualifiedInspection
                        }次市级或省级、国家级监督抽检不合格; </div>`;
                    } else {
                        bdiv += `<div>${b}.有${
                            item.numUnqualifiedInspection
                        }次市级或省级、国家级监督抽检不合格。 </div>`;
                    }
                }
                if (item.hasHaccp == "YES") {
                    bdiv += `<div>${c}.获得良好生产规范、危害分析与关键控制点体系认证。</div>`;
                }
                if (
                    item.numPunishment == 0 &&
                    item.numUnqualifiedInspection == 0 &&
                    item.hasHaccp == "NO"
                ) {
                    bdiv += `<div style="text-align:center">未出现符合风险等级调高或调低的情形</div>`;
                }
                marker.content = `<div class="map-hader"> 
                                        <div>
										    ${item.enterpriseName}
                                        </div>
                                        <img id="goDetailImg" style="position:relative;top:-10px;cursor:pointer" src=${headImg} alt="" />
									</div>
									<div class="map-content">	
										<div class="map-addr">
											<img src=${addrImg} alt="" />${item.address}
										</div>
										<div class="map-grade">
											<div>
												${item.year}年度风险等级  <br />
												<span>${prevGrade}</span>
											</div>
											<div>
												${lastTxt} <br />
												<span>${lastGrade}</span> 
												${tbImg}
											</div>
										</div>
										<div class="map-txt">
											${bdiv}
										</div>
								    </div>`;
                let obj = {
                    target: marker
                };
                this.mapMsg.markers.push(marker);
                this.mapMsg.markersAll.push(marker);
                AMap.event.addListener(marker, "click", () => {
                    this.detailIndex = i;
                    this.setScroll(i);
                    this.markerClick(obj, i);
                    if (this.mapMsg.largeMarker) {
                        this.mapMsg.largeMarker.setIcon(
                            new AMap.Icon({
                                image: this.mapMsg.largeImg
                            })
                        );
                    }
                    marker.setIcon(
                        new AMap.Icon({
                            image: img,
                            imageSize: new AMap.Size(23.8, 37.8)
                        })
                    );
                    marker.setTop(true);
                    this.mapMsg.largeMarker = marker;
                    this.mapMsg.largeImg = img;
                });
            } else {
                this.mapMsg.markersAll.push(1);
            }
        },
        markerClick(e) {
            this.mapMsg.infoWindow.setContent(e.target.content);
            this.mapMsg.infoWindow.open(
                this.mapMsg.map,
                e.target.getPosition()
            );
            this.mapMsg.infoWindow.on("close", () => {
                if (this.mapMsg.largeMarker) {
                    this.mapMsg.largeMarker.setIcon(
                        new AMap.Icon({
                            image: this.mapMsg.largeImg
                        })
                    );
                    this.mapMsg.largeMarker = null;
                    this.detailIndex = -1;
                }
            });
            setTimeout(() => {
                document.getElementById("goDetailImg").onclick = () => {
                    this.mapDetails(
                        this.lists[this.detailIndex].enterpriseName
                    );
                };
            });
        },
        async getBaseMsg(e) {
            this.modalLoad = true;
            let res = await http.get(
                //获取基础信息
                "/query/enterprises/" + e + "/basicInformation"
            );
            if (res) {
                this.detailMsg = {
                    ...res.data
                };
                this.numIndex = 3;
                if (res.data.numPunishment == 0) {
                    this.numIndex--;
                }
                if (res.data.numUnqualifiedInspection == 0) {
                    this.numIndex--;
                }
            }
            this.modalLoad = false;
        },
        toHz(e) {
            ///将Unicode转换成中文
            return unescape(e.replace(/\\u/g, "%u"));
        },
        closeMarker() {
            this.mapMsg.infoWindow.close();
        },
        setScroll(i) {
            let H = document.getElementsByClassName("deatils")[0].offsetHeight;
            let H1 = document.getElementsByClassName("deatils")[0].scrollTop;
            let H2 = document.getElementsByClassName("detail-lists")[i].offsetTop;
            let H3 = document.getElementsByClassName("detail-lists")[i].offsetHeight;
            let H4 = (H - H3) / 2;
            if (H1 > H2) {
                document.getElementsByClassName("deatils")[0].scrollTo(0, H2 - H4);
            } else {
                if (H2 + H3 > H + H1) {
                    let topH = H2 + H3 - (H + H1);
                    document.getElementsByClassName("deatils")[0].scrollTo(0, H1 + topH + H4);
                } else {
                }
            }
        },
        init() {
            this.getUpDate();
            this.getAreas();
            this.getComponys();
        }
    },
    mounted() {
        window.init = () => {
            this.componyShow = true;
            this.mapMsg.map = new AMap.Map("newMapContent", {
                mapStyle: "amap://styles/307486d5fc38c1746f40f402c371ce37",
                animateEnable: true
            });
            this.init();
            this.mapMsg.map.on("click", () => {
                if (this.mapMsg.infoWindow.getIsOpen()) {
                    this.closeMarker();
                }
            });
        };
    }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type='number'] {
    -moz-appearance: textfield;
}

#newMap {
    /*
     * * 地图弹框样式
     */
    .amap-icon {
        width: 24px !important;
    }

    .amap-info {
        >div:last-child {
            >div {
                position: relative;
                left: 170px;

                .amap-info-close {
                    top: 9px;
                    right: 10px !important;
                    color: #D4E5F9;
                }
            }
        }
    }

    .amap-info-content {
        padding: 0;
        width: 360px;
        background: #24394e;
        color: #D4E5F9;
        border-radius: 6px;
        border: none;
        overflow: hidden;

        .map-hader {
            width: 100%;
            height: 34px;
            line-height: 34px;
            font-size: 15px;
            font-weight: bold;
            padding: 0 20px;
            background: #2681dc;

            div {
                position: relative;
                display: inline-block;
                max-width: 290px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }

        .map-content {
            width: 100%;
            overflow: hidden;
            padding: 20px;

            .map-addr {
                position: relative;
                line-height: 22px;
                margin-bottom: 10px;
                padding: 0 20px;

                img {
                    position: absolute;
                    left: 0;
                    top: 4px;
                }
            }

            .map-grade {
                width: 100%;
                margin-bottom: 16px;
                overflow: hidden;

                >div {
                    box-sizing: border-box;
                    float: left;
                    width: 50%;
                    text-align: center;
                    line-height: 24px;

                    span {
                        font-size: 25px;
                    }

                    &:first-child {
                        position: relative;

                        &:after {
                            position: absolute;
                            right: 0;
                            top: 16px;
                            bottom: 16px;
                            width: 2px;
                            content: '';
                            background: #3C5267;
                        }
                    }
                }
            }

            .map-txt {
                >div {
                    font-size: 12px;
                    margin-top: 4px;
                }
            }
        }
    }

    .amap-info-sharp {
        display: none;
    }

    /*
     * * 地图弹框样式
     */
    .fade-enter-active, .fade-leave-active {
        transition: all 0.7s ease;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    color: #D4E5F9;
    font-size: 14px;
    box-sizing: border-box;

    .ivu-spin {
        color: #fff;
    }

    .ivu-spin-fix {
        background-color: rgba(27, 34, 62, 0.6);
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }

        50% {
            transform: rotate(180deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    .amap-copyright, .amap-logo {
        display: none !important;
    }

    #newMapContent {
        width: 100%;
        height: 100%;
        min-height: 400px;
        min-width: 1000px;
    }

    .left {
        position: absolute;
        right: 10px;
        top: 10px;

        .describe {
            position: relative;
            display: inline-block;
            background: #D4E5F9;
            width: 14px;
            height: 14px;
            text-align: center;
            line-height: 14px;
            font-size: 12px;
            cursor: pointer;
            color: #263C51;
            border-radius: 50%;
            top: -1px;
            z-index: 10;

            div {
                position: absolute;
                width: 160px;
                line-height: 30px;
                border-radius: 2px;
                color: #D4E5F9;
                background: #263C51;
                box-shadow: 1px 1px 2px 1px #1F2E3B;
                left: 14px;
                top: 14px;
            }
        }

        .tabs {
            margin-top: 10px;

            .ivu-input {
                background: #263C51;
                color: #D4E5F9;
                border-color: #263C51;

                &:focus {
                    box-shadow: 0 0 0 0 #1F2E3B;
                }
            }

            .ivu-icon {
                color: #D4E5F9;
            }

            .ivu-select-dropdown {
                background-color: rgba(30, 45, 66, 0.7);
            }

            .ivu-cascader-menu {
                min-width: 160px;
            }

            .ivu-cascader-menu .ivu-cascader-menu-item-active {
                background-color: rgba(30, 45, 66, 0);
                color: #D4E5F9;
            }

            .ivu-cascader .ivu-cascader-menu-item {
                color: #D4E5F9;

                &:hover {
                    background: rgba(57, 93, 126, 0.7);
                    color: #D4E5F9;
                }
            }

            .ivu-cascader-menu {
                border-right: 1px solid #263c51;
            }
        }
    }

    .right-top {
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .right {
        position: absolute;
        left: 10px;
        top: 46px;
        bottom: 10px;
        width: 340px;
        border-radius: 2px;
        overflow: hidden;
        box-shadow: -2px 0 20px 0 #151F29;

        .title {
            position: relative;
            width: 100%;
            height: 36px;
            padding: 0 10px;
            line-height: 36px;
            background: #263C51;

            a {
                display: block;
                position: absolute;
                width: 14px;
                height: 14px;
                right: 10px;
                top: 11px;
                cursor: pointer;
                background: url('images/export.png');
                background-size: 14px 14px;
            }
        }

        .deatils {
            position: absolute;
            right: 0;
            bottom: 40px;
            left: 0;
            top: 0;
            overflow-y: auto;
            background-color: rgba(30, 45, 66, 0.7);

            .addr {
                position: absolute;
                left: 16px;
                top: 10px;
            }

            .standard {
                position: relative;
                height: 16px;
                top: 1px;
            }

            .no-data {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .page {
            position: absolute;
            height: 40px;
            line-height: 40px;
            right: 0;
            left: 0;
            bottom: 0;
            border-top: 1px solid #263C51;
            background-color: rgba(30, 45, 66, 0.7);

            >div {
                float: left;
                height: 100%;
                text-align: center;
                font-size: 12px;

                &:first-child, &:last-child {
                    width: 30%;
                }

                &:nth-child(2) {
                    position: relative;
                    width: 40%;

                    .prev, .next {
                        position: absolute;
                        width: 14px;
                        height: 14px;
                        border: 1px solid #D4E5F9;
                        border-radius: 2px;
                        top: 13px;
                        text-align: center;
                        line-height: 14px;
                        cursor: pointer;

                        .ivu-icon {
                            transform: scale(0.8);
                        }
                    }

                    .prev {
                        left: 10px;
                    }

                    .next {
                        right: 10px;
                    }
                }

                &:last-child {
                    input {
                        width: 36px;
                        height: 18px;
                        background: rgba(30, 45, 66, 0.7);
                        border: 1px solid #D4E5F9;
                        border-radius: 2px;
                        color: #D4E5F9;
                        text-align: center;
                        outline: none;
                        margin: 0 4px;
                    }
                }
            }
        }

        .nav-lists, .detail-lists {
            width: 100%;
            overflow: hidden;
            padding: 0 10px 0 40px;

            >div {
                font-size: 12px;

                &:first-child {
                    width: 60%;
                }

                &:nth-child(2) {
                    width: 20%;
                }

                &:last-child {
                    width: 20%;
                }
            }
        }

        .nav-lists {
            line-height: 26px;
            border-bottom: 1px solid #263C51;
            background-color: rgba(30, 45, 66, 0.7);

            >div {
                float: left;
            }
        }

        .detail-lists {
            position: relative;
            display: flex;
            line-height: 20px;
            padding-top: 10px;
            padding-bottom: 10px;
            transition: all 0.3s;
            border-bottom: 1px solid #263C51;

            &:hover {
                background: rgba(57, 93, 126, 0.7);
            }

            .cover {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
            }

            &:last-child {
                border: none;
            }

            >div {
                align-items: center;

                &:first-child {
                    .name {
                        font-size: 13px;
                    }
                }

                &:nth-child(2), &:last-child {
                    position: relative;
                    text-align: center;

                    span {
                        position: absolute;
                        font-size: 18px;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                    }
                }

                &:last-child {
                    span {
                        cursor: pointer;
                    }
                }
            }
        }

        .detail-lists-active {
            background: rgba(57, 93, 126, 0.7);
        }
    }

    .grade-rank {
        position: absolute;
        right: 10px;
        bottom: 10px;

        >div {
            position: relative;
            padding-left: 30px;
            height: 30px;
            line-height: 30px;

            span {
                position: absolute;
                left: 0;
                top: 0;
                width: 24px;
                height: 30px;
            }

            &:first-child span {
                background: #CD0C0D;
            }

            &:nth-child(2) span {
                background: #C59E20;
            }

            &:nth-child(3) span {
                background: #00B08C;
            }

            &:nth-child(4) span {
                background: #009AFC;
            }

            &:last-child span {
                background: #5C7AAA;
            }
        }
    }

    .ivu-input-group-small .ivu-input {
        background-color: #2C5080;
        border-color: #2C5080;
        color: #D4E5F9;

        &:focus {
            box-shadow: 0 0 0 0 rgba(235, 223, 192, 1);
        }
    }

    .ivu-input-group-small>.ivu-input-group-append {
        padding: 1px 2px;
        background-color: #2681DC;
        color: #D4E5F9;
        border-color: #2681DC;
    }

    .ivu-icon-ios-search {
        position: relative;
        font-size: 16px;
        top: 2px;
    }

    .ivu-input-group-append .ivu-btn, .ivu-input-group-prepend .ivu-btn {
        margin: -7px -7px;
    }
}
</style>