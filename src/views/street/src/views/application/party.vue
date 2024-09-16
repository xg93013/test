<style scoped lang="sass">

    @import "../../styles/common.scss";
    $nullLengthValue:0px;

    // 顶部logo以及tab头的高度
    $topLogoHeight:50px;

    $hunderpercent:100%;

    html {
        min-height: 600px;
        min-width: 800px;
    }
    body {
        background-color: rgb(242,242,242) !important;

    }

    // top阴影
    .top {
        -webkit-box-shadow: 0px 5px 8px rgba(153, 153, 153, 0.349019607843137);
        box-shadow: 0px 5px 8px rgba(153, 153, 153, 0.349019607843137);
    }

    .topCol {
      background-color: white;
    }

    /* 覆盖UI组件样式适配 调整tab头高度*/
    .tabTitle .ivu-tabs-nav .ivu-tabs-tab{
        padding-top: 0px;
        padding-bottom: 0px;
    }

    /* top 需要统一高度和lineheight的 */
    .topHeight, .tabTitle .ivu-tabs-nav .ivu-tabs-tab{
        height: $topLogoHeight;
        line-height: $topLogoHeight;
    }
    /* tab和logo之间的空隙 */
    .tabTitle .ivu-tabs-nav{
        margin-left: 16px;
    }

    /* 覆盖UI组件样式适配 */
    .tabTitle .ivu-tabs-nav-container,.tabTitle .ivu-tabs-nav-wrap{
        margin-bottom: 0px;
    }
    .tabTitle .ivu-tabs-ink-bar {
        bottom:0px;
        height: 3px;
    }


    .tabTitle .ivu-tabs-bar {
        border:0px;
        margin-bottom: 0px;
    }

    .mapVM {
        height: $hunderpercent;
        width: $hunderpercent;
        position: relative;
    }
    #container,#containerPC {
        width: 100%;
        height: $hunderpercent;
        position: relative;
        // padding:20px;
    }

    .displayArea {
        height: $hunderpercent;
        background-color:rgba(73,80,96,1);
        // color: white;
        padding: 20px;
        // min-width: 300px;
    }

    .leftMenuText {
        color: white;
        
        &:not(.include) {
            height: 32px;
            line-height: 32px;
        }
    }

    .logoText {
        color : white;
        // font-family : '微软雅黑 Bold', '微软雅黑';
        font-weight : 700;
        background-color : rgba(51, 102, 204, 1);
        text-align: center;
        font-size: 16px;
        // padding: 15px 0px;
    }

    .middle.ivu-row {
        height: 90%;

    }
    // .top.ivu-row {
    //     height: 10%;
    // }
    // .top div {
    //     height: $hunderpercent;
    // }

    .middle .ivu-col {
        height: $hunderpercent;
    }

    /* top 需要统一高度和lineheight的 */
    .topHeight, .tabTitle .ivu-tabs-nav .ivu-tabs-tab{
        height: $topLogoHeight;
        line-height: $topLogoHeight;
    }

    .userWelcomeMessage {
        float: right;
    }
    /* 退出系统按钮颜色 */
    .ivu-btn-text.logoutBtn {
        color:rgb(0, 0, 255);
    }

    /*  */
    .polygonPop {
        position: absolute !important;
        width: 200px;
        z-index: 99999;
        right: 0px;
        background-color:rgba(255,255,255,0.8) !important;
    }


    /* 合作镇案发地图的CSS begin*/
    .partyCompanyTab .spanType {
        width:70px;
    }
    .partyCompanyTab .spanTypeUnit {
        width:190px;
    }

    .partyCompanyTab .spanTypeQuarterY {
        width:70px;
    }
    .partyCompanyTab .spanTypeQuarter {
        width:125px;
    }
    .partyCompanyTableArea {
        padding-bottom:20px;
        position : absolute;
        bottom : 0px;
        right: 0px;
    }
    .partyCompanyTable {
        
        // width: 500px;
        // height: 300px;
        // top:0px;
        position : absolute;
        bottom : 0px;
        right: 0px;
        
    }

    .legendTitle ,.legendText {
        float: left;
    }

    .include_radio {
        color : white;
        padding-right : 10px;
    }
    .include_group {
        height : 42px;
        line-height: 42px;
    }

    .opeartionArea {
        width : 400px;
        background-color: transparent;
        .searchBtn {
            display: block;
            margin : 0 auto;
        }
    }
    /* 案发图例 */
    .partyColorLegend {
        padding : 10px;
        position : absolute;
        top: 300px;
        left: 25px;
        background-color : rgba(14, 98, 192,0.9);
        box-shadow: 4px 4px 5px rgba(4, 36, 93, 0.7);
        border-radius: 5px;
        // border:1px solid #5cadff;
        color : white;
        .legendTitle {
            // width : 50px;
            // height : 30px;
            // line-height: 30px;
            // margin-bottom: 5px;
            // border-radius: 5px;
            // text-align: center;
        }
        .legendText {
            // width : 100px;
            height : 30px;
            text-align: center;
            line-height: 30px;
            font-size: 20px;
            padding : 0px 10px;
        }
        li:after{
            content: "";
            height: 30px;
            display: inline-block;
            clear: both;
        }
    }
/* 合作镇案发地图的CSS end*/


</style>
<template>
    <div class="mapVM" v-cloak>
        <Row class="middle" style="height:100%">
            <Col span="4" v-if="showLeft">
                <div class="displayArea partyCompanyTab" v-show="tabModel.currentTab=='PC'">
                  
                </div>
            </Col>
            <Col class="mapContainer" :span="showLeftSpan()" ref="map">
                <card v-show="popModel.show" class="polygonPop" v-bind:style="popModel.tipPopStyle" ref="polygonPop">
                    <p slot="title">{{popModel.title}}</p>
                    <div v-html="popModel.content"></div>
                </card>
                <div v-show="tabModel.currentTab=='PC'" style="width: 100%;height:100%;">
                    <div id="containerPC" class="container"></div>
                    <!-- 展示企业详情 -->
                    <div class="partyCompanyTableArea" v-show="partyCompaniesModel.showPartyCompaniesTable">
                        <Modal :title="partyCompaniesModel.company.title" v-model="partyCompaniesModel.company.show" :mask-closable="false">
                            <div v-html="partyCompaniesModel.company.content"></div>
                        </Modal>
                        <card class="partyCompanyTable">
                            <p slot="title">{{partyCompaniesModel.companyListTitle}}</p>
                            <i-table width="800" height="200" :columns="partyCompaniesModel.tableColumnList" :data="partyCompaniesModel.companyData"></i-table>
                        </card>
                    </div>
                </div>
            </Col>
        </Row>
        <div class="suspendDisplayArea crimeListTab" v-show="!showLeft" @mouseover="closePop">
            <card class="opeartionCard" :bordered="false">
                <div class="opeartionArea">
                    <Row>
                        <Col span="6">
                            <p class="leftMenuText">所属网格</p>
                        </Col>
                        <Col span="18">
                            <div class="ownGridArea">
                                <Select v-model="griddingModel.value" style="width:260px" @on-change="griddingModel.changeGrid" multiple :placeholder="griddingModel.placeholder">
                                    <Option v-for="item in griddingModel.list" :value="item.value" :key="item.value" :title="item.label">{{ item.label }}</Option>
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <br>
                    <Row>
                        <Col span="6">
                            <p class="leftMenuText">党组织类型</p>
                        </Col>
                        <!-- 过滤党组织类型-->
                        <Col span="18">
                            <div class="partyTypeArea">
                                
                                <Select v-model="partyTypeModel.value" style="width:260px" @on-change="partyTypeModel.changeType" multiple :placeholder="partyTypeModel.placeholder">
                                    <Option v-for="item in partyTypeModel.list" :value="item.value" :key="item.value" :title="item.label">{{ item.label }}</Option>
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <br>
                    <Row>
                        <!-- 所属网格 -->
                        <Col span="6">
                            <p class="leftMenuText include">党组织关系是否在本街道</p>
                        </Col>
                        <Col span="18">
                            <RadioGroup v-model="includeModel.value" @on-change="includeModel.change" class="include_group">
                                <template v-for="item,index in includeModel.list">
                                    <Radio :label="item.label" :value="item.value" class="include_radio"></Radio>
                                </template>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <br>
                    <Row>
                        <Button @click="searchPartyCompanies" class="searchBtn" style="width:260px">搜索</Button>
                    </Row>
                </div>
            </card>
        </div>
        <!-- legend图例 -->
        <div class="partyColorLegend" @mouseover="closePop">
            <h3 style= "text-align: center;margin-bottom:10px ">党组织类型图例</h3>
            <ul>
                <li>
                    <img class="legendTitle" src="./party-c.png" alt="">
                    <span class="legendText">党委</span>
                </li>
                <li>
                    <img class="legendTitle" src="./party-t.png" alt="">
                    <span class="legendText">党总支</span>
                </li>
                <li>
                    <img class="legendTitle" src="./party-b.png" alt="">
                    <span class="legendText">党支部</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';

    import AMap from 'AMap';
    import axios from "axios";

    var map,// 全局map对象
        infoWindow,//信息窗体
        polygonObjMapForPC = {},//保存所有案发地图多边形对象
        markerMap = {},//保存所有单间企业点对象
        griddingMap = {},// 所有网格对象
        // 颜色相关枚举
        color = {
            selectedStorkeOpacity : 1,
            defaultStrokeOpacity : 0.5,
            hoverStrokeOpacity : 1,
            colors : ["#F9ED69","#F08A5D","#FF9A00","#6A2C70","#222831","#FFFCCA","#00ADB5","#3EC1D3","#FF9A00","#FF165D"],
            defaultFillOpacity : 0.5,
            defaultStrokeWeight : 3
        },
        mapVM;

    export default {
        data : function () {
            return {
                showNewNav : true,
                showLeft : false,
                showLeftSpan : function () {
                    return this.showLeft ? 20 : 24;
                },
                middleStyle : function () {
                    return "height:"+(this.$el.clientHeight - 50)+"px";
                },
                // .TAB选项对象
                tabModel : {
                    currentTab : "PC",
                    tabs : {
                        partyCompanies : {
                            value : "PC",
                            label : "两新组织党建地图"
                        }
                    }
                },
                // 案发tab模型对象
                partyCompaniesModel : {
                    mapInit : false,
                    showPartyCompaniesTable : false,
                    tableColumnList : [
                        {
                            title : "案件编号",
                            key : "caseId",
                            width: 200,
                        },
                        {
                            title : "案发时间",
                            key : "caseTime",
                            width: 200,
                        },
                        {
                            title : "案件类型",
                            key : "caseType"
                        },
                        {
                            title : "案件名称",
                            key : "caseName"
                        },
                        {
                            title : "操作",
                            key : "operate",
                            render : function (h, params) {
                                var tempH = h, tempParams = params;
                                return h("i-button", {
                                    props : {
                                        type : "primary",
                                        size : "small"
                                    },
                                    on : {
                                        click : function () {
                                            mapVM.partyCompaniesModel.company.show = true;
                                            mapVM.partyCompaniesModel.company.title = polygonObjMapForPC[tempParams.row.polygonId].data.gridName;
                                            mapVM.partyCompaniesModel.company.content = "<p>网格名称：" + polygonObjMapForPC[tempParams.row.polygonId].data.gridName + "</p>" +
                                                "<p>案件编号：" + tempParams.row.caseId + "</p><p>案件名称：" + tempParams.row.caseName + "</p><p>案件类别：" + tempParams.row.caseType +
                                                "<p>案发时间：" + tempParams.row.caseTime + "</p><p>案件详情：" + tempParams.row.caseDetail + "</p><p>案发地址：" + tempParams.row.caseAddr + "</p>"
                                            // console.log(tempParams.row.caseId)
                                        }
                                    }
                                }, "详情")
                            }
                        },
                    ],
                    company : {
                        title : "",
                        show : false,
                        content : ""
                    },
                    companyListTitle : "",
                    companyNumberLegned : {
                        list : []
                    },
                    companyData : []
                },
                dataModel : {
                    nameInputAvailable : true,
                    regionName : "",
                    lngAndLatList : [{
                            title : "序号",
                            key : "id"
                        },{
                            title : "经度",
                            key : "lng"
                        },{
                            title : "纬度",
                            key : "lat"
                        },],
                    communitiesData :[],
                    currentGridding:[],
                    oldGridding:[],
                },
                popModel : {
                    title : "",
                    content : "",
                    show : false,
                    tipPopStyle : {
                        top : "0px",
                        right : "0px"
                    }
                },
                griddingModel : {
                    value : [],
                    list : [],
                    placeholder : "请选择所属网格",
                    changeGrid : function (args) {

                    }
                },
                partyTypeModel : {
                    placeholder : "请选择党组织类型",
                    value : [],
                    list : [{
                        value : "党委",
                        label : "党委"
                    },{
                        value : "党总支",
                        label : "党总支"
                    },{
                        value : "党支部",
                        label : "党支部"
                    }],
                    changeType : function () {

                    }
                },
                includeModel : {
                    list : [{label:"全部",value:"all"},{label:"是",value:"1"},{label:"否",value:"0"}],
                    value : "全部",
                    change : function (args) {

                    }
                }
                // showModal : false
            }
        },
        methods : {
            closePop : function () {
                mapVM.popModel.show = false;
            },
            toLogin : function () {
                toLoginPage();
            },
            toHome : function () {
                toHomePage();
            },
            confirm : function () {
                // 点击确定后将输入的名字给绘制区域，并灰化输入框
                this.editor.confirmBtn.action();
            },
            griddingChangeCallBack : function (value, selectedData) {
                switchEditPolygonStatus(false);
                selectGridding(value);
                boldGriddingBorder(value);
            },
            // 切换tab
            changeTabs : function () {
                if (mapVM.tabModel.currentTab == "PC") {
                    if (!mapVM.partyCompaniesModel.mapInit) {
                    }
                }
            },
            searchPartyCompanies : function () {
                map.clearMap();
                getPartyCompanies();
                refreshPartyCompanyStatistics();
            }
        },
        watch : {
            "dataModel.currentGridding" : function (newValue, oldValue) {
                mapVM.dataModel.oldGridding = oldValue;
            },
        },
        created : function () {
            mapVM=this;
        },
        mounted : function () {
            initMapForPartyCompany();
        }
    }
        /**
     * 改变所选网格内所有多边形的填充色
     *
     * @param {string} params 透明度或者样式对象
     * @param {boolean} isTransparent 填充是否为透明
     * @param {boolean} clear 是否将其他网格填充重置
     */
    function changeGridStyle (gridId, isTransparent, clear) {

        _.each(polygonObjMapForPC, function (polygon, id) {
            if (polygon.data.gridId == gridId) {
                polygonObjMapForPC[id].polygonObj.setOptions({
                    fillOpacity : isTransparent ? 0 : color.defaultFillOpacity
                });
            } else if (clear || !gridId) {
                polygonObjMapForPC[id].polygonObj.setOptions({
                    fillOpacity : color.defaultFillOpacity
                });
            }
        })
    }

    /**
     * 修改多边形对象extData中的自定义属性
     *
     * @param {object} pItem polygon对象
     * @param {string} mObj 需要修改属性的对象
     *
     */
    function modifyPolygonExdata (pItem, mObj) {
        var extData = _.cloneDeep(pItem.getOptions().extData);
        _.each(mObj, function (obj, key) {
            extData[key] = obj;
        });
        // extData.selected = false;
        pItem.setOptions({
            "extData" :extData
        });
    }


    /**
     * 查询所有社区信息包含网格
     *
     * @param {string} null
     *
     */
    function getCommunitiesInfo () {
        return axios.get(utilService.getResourceUrl("/map/community-grid"))
        .then(function (result) {
            if (result.data.state.code != 0) {
                utilService.handleException(result.data.state);
                return;
            }
            var allGrid=[];
            mapVM.dataModel.currentGridding = [];

            mapVM.dataModel.communitiesData = _.map(result.data.data, function (community) {

                var griddings = _.map(community.children, function (griddingitem) {
                        griddingMap[griddingitem.id] = {
                            lnglat : [community.longitude, community.latitude],
                            zoom : community.zoom,
                            id : griddingitem.id,
                            name : griddingitem.name,
                            code : griddingitem.code,
                            cId : community.id,
                            cName : community.name,
                            cCode : community.code,
                            centerLngLat : [community.longitude, community.latitude],
                            polygons :[]
                        };
                    
                    return {
                        value : griddingitem.id,
                        label : community.name + griddingitem.name
                    }
                });
                allGrid = allGrid.concat(griddings);
                return {
                    value : community.id,
                    code : community.code,
                    label : community.name,
                    children : griddings
                }
            });
            mapVM.griddingModel.list = _.cloneDeep(allGrid);

        }).catch(function (result) {
            utilService.handleException(result);
        });
    }

    /**
     * 查询图例信息，颜色对应的案件数量
     *
     * @param {string} null
     *
     */
    function getLegendInfo () {
        axios.get(utilService.getResourceUrl("/map/case-color")).then(function (result) {
            if (result.data.state.code != 0) {
                utilService.handleException(result.data.state);
                return;
            }
            _.each(result.data.data, function (item, index) {
                result.data.data[index].colorStyle = "background-color:" + item.color + ";opacity:"+color.defaultFillOpacity;
            });
            mapVM.partyCompaniesModel.companyNumberLegned.list = result.data.data;
        }).catch(function (result) {
            utilService.handleException(result);
        });
    }


    /**
     * 查询所有多边形信息
     *
     * @param {string} null
     *
     */
    var getPolygonsData;
    function getPolygons () {
        return axios.get(utilService.getResourceUrl("/map/grid-polygon")).then(function (result) {
            getPolygonsData = result.data;
            
        }).catch(function (result) {
            utilService.handleException(result);
        });
    }

    /**
     * 加粗网格边框
     *
     * @param {array} param 选择的社区，网格
     *
     */
    function boldGriddingBorder (param) {
        if (!param) {
            _.each(polygonObjMapForPC, function (item, key) {
                polygonObjMapForPC[key].polygonObj.setOptions({
                    strokeWeight : color.defaultStrokeWeight,
                    strokeColor : item.polygonObj.getOptions().extData.origin.strokeColor,
                    strokeOpacity : item.polygonObj.getOptions().extData.origin.strokeOpacity
                });
            });
            return;
        }
        _.each(polygonObjMapForPC, function (item, key) {
            polygonObjMapForPC[key].polygonObj.setOptions({
                strokeWeight : param[1] == item.data.gridId ? 10 : color.defaultStrokeWeight,
                strokeColor : param[1] == item.data.gridId ? "balck" : item.polygonObj.getOptions().extData.origin.strokeColor,
                strokeOpacity : param[1] == item.data.gridId ? 1 :item.polygonObj.getOptions().extData.origin.strokeOpacity
            });
        });
    }

    /**
     * 选择网格触发回调
     *
     * @param {array} param 选择的社区，网格
     *
     */
    function selectGridding (param) {
        if (param.length == 0) {
            return;
        }
        map.setZoomAndCenter(griddingMap[param[1]].zoom, griddingMap[param[1]].lnglat);
    }


    /**
     * 退出登录
     *
     * @param {string} null
     *
     */
    function toLoginPage () {
        axios.post(utilService.getResourceUrl("/my/logout")).then(function (result) {
            location.href = utilService.getResourceUrl("/login");
        }).catch(function (result) {
            utilService.handleException(result);
        });
    }
    /**
     * 到首页
     *
     * @param {string} null
     *
     */
    function toHomePage () {
        location.href = utilService.getResourceUrl("/home");
    }

    /**
     * 刷新网格和党建企业坐标
     *
     * @param {string} null
     *
     */
    function refreshPartyCompanyStatistics () {

        axios.all([getPolygons(), getPartyCompanyStatistics()]).then(axios.spread(function (result1, result2) {
            if (getPolygonsData.state.code == 0) {
                // 先清除先所有多边形
                // map.remove(_.map(polygonObjMapForPC, function (item, key) {
                //     return item.polygonObj;
                // }));
                
                polygonObjMapForPC = {};
                // 清空犯案列表表格
                mapVM.partyCompaniesModel.companyData = [];
                mapVM.partyCompaniesModel.showPartyCompaniesTable = false;

                _.each(getPolygonsData.data, function (item, index) {
                    var tempConfig = {
                        // fillColor : "",
                        partCount : 0,
                        partyMemQty : 0,
                        partyBuildType : ""
                    }
                    _.each(result2.data.data, function (citem, cindex) {
                        if (item.gridId == citem.gridId) {
                            tempConfig.partCount = citem.partCount;
                            tempConfig.partyMemQty = citem.partyMemQty;
                            tempConfig.partyBuildType = citem.partyBuildType;
                        }
                    });
                    item.points = JSON.parse(item.points);
                    createPolygonPC(item, tempConfig);
                });
            }
        })).catch(function (result) {
            utilService.handleException(result);
        });

    }




    /**
     * 初始化党建企业地图
     *
     * @param {string} null
     *
     */
    function initMapForPartyCompany () {
        map = new AMap.Map('containerPC',{
            zoom: 13,
            center: [103.942682, 30.757462],//new AMap.LngLat(116.39,39.9)
            mapStyle : 'amap://styles/0021dd08429d3a9d56f5394765ba50c5'
        });
        // map.setMapStyle('amap://styles/0021dd08429d3a9d56f5394765ba50c5');

        
        infoWindow = new AMap.InfoWindow({
            offset : new AMap.Pixel(20, -30)
        });
        mapVM.partyCompaniesModel.mapInit = true;
        axios.all([getCommunitiesInfo()]).then(axios.spread(function (acct, perms) {
            refreshPartyCompanyStatistics();
        }));
        getPartyCompanies();

    };

    /**
     * 查询所有党建企业的经纬度及详情信息
     * 
     *
     */

    function getPartyCompanies () {
        var tempUrl = utilService.getResourceUrl("/map/party-enterprise"),
            includeKey = "";
        if (mapVM.griddingModel.value.length != 0) {
            var tempGriddingString = mapVM.griddingModel.value.join("&gridIds=");
            tempUrl += (tempUrl.indexOf("?")==-1?"?":"&") + "gridIds=" + tempGriddingString;
        }
        if (mapVM.partyTypeModel.value.length != 0) {
            var tempTypeString = mapVM.partyTypeModel.value.join("&partyBuildTypes=");
            tempUrl += (tempUrl.indexOf("?")==-1?"?":"&") + "partyBuildTypes=" + tempTypeString;
        }
        switch (mapVM.includeModel.value) {
            case "全部" : 
                includeKey = 0;
                break;
            case "是" : 
                includeKey = 1;
                break;
            case "否" : 
                includeKey = 2;
                break;
        }
        if (includeKey) {
            tempUrl += (tempUrl.indexOf("?")==-1?"?":"&") + "currentStreet=" + includeKey;
        }

        axios.get(tempUrl).then(function (result) {
            _.each(result.data.data, function (item, key) {
                createPartyCompanyMaker(item);
            });
        }).catch(function (result) {
            
            utilService.handleException(result);
            
        });
    }

    /**
     * 根据查询党建企业经纬度在地图上打点
     * 
     *
     */
    var pngMap = {
        default : require("./party_flag.png"),
        pc : require("./party-c.png"),
        pt : require("./party-t.png"),
        pb : require("./party-b.png"),
        pcr : require("./party-c-r.png"),
        ptr : require("./party-t-r.png"),
        pbr : require("./party-b-r.png")
    }
    function createPartyCompanyMaker (companyItem) {
        if (_.isEmpty(companyItem)) {
            return;
        }
        var tempIconUrl = "default";
        switch (companyItem.partyBuildType) {
            case "党委":
                tempIconUrl = "pc"
                break;
            case "党总支":
                tempIconUrl = "pt"
                break;
            case "党支部":
                tempIconUrl = "pb"
                break;

        }
        // if (companyItem.migrate == 1) {
        //     tempIconUrl += "r";
        // }
        // 保存所有党建企业点
        markerMap[companyItem.id] = {
            id : companyItem.id,
            name : companyItem.name,
            position : [companyItem.longitude, companyItem.latitude],
            type : companyItem.partyBuildType,
            memberCount : companyItem.partyMemQty
        }
        var tempMarker = new AMap.Marker({
            map: map,
            icon: pngMap[tempIconUrl],
            position: [companyItem.longitude, companyItem.latitude],
            title : companyItem.name,
            extData : {
                infoContent : "<p>企业名称：" + companyItem.name + "</p><p>党组织类型：" + (companyItem.partyBuildType ? companyItem.partyBuildType : "未知") +
                    "</p><p>正式党员人数：" + companyItem.partyMemQty +
                    "</p><p>企业地址：" + companyItem.address +
                    "</p><p>日常党务工作联系人：" + companyItem.contactName + "</p><p>日常党务工作联系人电话："+companyItem.contactMobile+"</p>"
            }
            // clickable : true
        });

        tempMarker.on("click", function(e) {
            infoWindow.setContent(e.target.getExtData().infoContent);
            infoWindow.open(map, e.target.getPosition());
        })
    }

    /**
     * 绘制案发地图的多边形
     *
     * @param {obj} param 绘制参数对象
     * @param {int} param.id 多边形id
     * @param {int} param.gridId 网格id
     * @param {string} param.gridName 网格名称
     * @param {array} param.points 网格坐标点
     * @param {object} config 自定义配置，案发地图
     */
    function createPolygonPC (param, config) {
        // 没有选择的网格不绘制
        if (mapVM.griddingModel.value.length > 0 && mapVM.griddingModel.value.indexOf(param.gridId) == -1) {
            return;
        }
        var tempPolygonObj = new AMap.Polygon({
                map: map,
                path: param.points.concat(),
                strokeColor: "white",
                strokeOpacity : color.defaultStrokeOpacity,
                strokeWeight: 2,
                fillColor: config.fillColor,
                fillOpacity : color.defaultStrokeOpacity,
                strokeStyle : "solid",
                extData : {
                    id:param.id,
                    selected : false
                }
            })
        // 绑定移入移除点击事件
        bindEventOnPolygonPC(tempPolygonObj);
        // 保存所有多边形
        polygonObjMapForPC[param.id] = {
            polygonObj : tempPolygonObj,
            data : {
                id : param.id,
                lnglat : param.points.concat(),
                name : param.name,
                gridId : param.gridId,
                gridName : param.gridName,
                partCount : config.partCount,
                partyMemQty : config.partyMemQty,
                partyBuildType : config.partyBuildType
            }
        }
    }

    /**
     * 给案发地图多边形绑定事件
     *
     * @param {obj} polygonObj 多边形对象
     *
     */
    function bindEventOnPolygonPC (polygonObj) {
        polygonObj.on("mouseover" ,function (e) {
            var polygonId = e.target.getOptions().extData.id;
            mapVM.popModel.title = polygonObjMapForPC[polygonId].data.gridName;
            mapVM.popModel.content = "党建企业数量：" + polygonObjMapForPC[polygonId].data.partCount + "<br>党员数量：" +
                polygonObjMapForPC[polygonId].data.partyMemQty;

            changeStrokeStylePC(color.hoverStrokeOpacity, e.target);
        }).on("mousemove" ,function (e) {
            // 案发提示框跟随鼠标
            mapVM.popModel.show = true;
            if (e.pixel.y + mapVM.$refs.polygonPop.$el.offsetHeight >= mapVM.$refs.map.$el.offsetHeight) {
                mapVM.popModel.tipPopStyle.top = mapVM.$refs.map.$el.offsetHeight-mapVM.$refs.polygonPop.$el.offsetHeight + "px";
            } else {
                mapVM.popModel.tipPopStyle.top = e.pixel.y + "px";
            }
            if (e.pixel.x + mapVM.$refs.polygonPop.$el.offsetWidth >= mapVM.$refs.map.$el.offsetWidth) {
                mapVM.popModel.tipPopStyle.left = mapVM.$refs.map.$el.offsetWidth - mapVM.$refs.polygonPop.$el.offsetWidth + "px";
            } else {
                mapVM.popModel.tipPopStyle.left = e.pixel.x + 100 + "px";
            }
        }).on("mouseout" ,function (e) {
            mapVM.popModel.show = false;
            if (e.target.getOptions().extData.selected) {
                changeStrokeStylePC({
                    opacity : color.selectedStorkeOpacity,
                    strokeStyle : "dashed"
                }, e.target);
            } else {
                changeStrokeStylePC(color.defaultStrokeOpacity, e.target);
                
            }
        }).on("click", function(e) {

            // mapVM.partyCompaniesModel.showPartyCompaniesTable = true;
            // 案件列表标题
            mapVM.partyCompaniesModel.companyListTitle = polygonObjMapForPC[e.target.getOptions().extData.id].data.gridName+"案件列表";
            var currentGriddingID = polygonObjMapForPC[e.target.getOptions().extData.id].data.gridId;
            changeStrokeStylePC({
                    opacity : color.selectedStorkeOpacity,
                    strokeStyle : "dashed"
                }, e.target, true);
            // changeGridStyle(currentGriddingID, true, true);
            // 供非覆盖物触发事件调用polygon调用
            selectGriddingPC(e.target);
            
            // 点击检查按钮可用状态
            // 切换选中网格
            
            
            // mapVM.dataModel.currentGridding = [griddingMap[currentGriddingID].cId, currentGriddingID];
        })
    }

    /**
     * 根据事件或多边形状态改变边框颜色属性
     *
     * @param {number/obj} params 透明度或者样式对象
     * @param {object} polygon 多边形对象
     * @param {boolean} clear 是否重置其他多边形边框颜色
     */
    function changeStrokeStylePC(params, polygon, clear) {
        var opacity,strokeStyle = "solid",gridId = polygonObjMapForPC[polygon.getOptions().extData.id].data.gridId;
        if (clear) {
            _.each(polygonObjMapForPC, function (item, key) {
                item.polygonObj.setOptions({
                    strokeOpacity : color.defaultStrokeOpacity,
                    strokeStyle : "solid"
                })
            });
            // clear为true需要先清除所有选中项，将currentPolygonObj置空
            // 清除所有对象的selected状态
            selectGriddingPC(null);
        }

        if (_.isObject(params)) {
            opacity = params.opacity;
            strokeStyle = params.strokeStyle;
        } else {
            opacity = params;
        }

        _.each(polygonObjMapForPC, function (polygonObj, pId) {
            if (polygonObj.data.gridId == gridId) {
                polygonObjMapForPC[pId].polygonObj.setOptions({
                    strokeOpacity : opacity,
                    strokeStyle : strokeStyle
                });
            }
        });
    }

    /**
     * 选中网格（包含多个多边形）
     *
     * @param {object} polygon 需要选中的多变形，如果不传值则清除所有选中状态
     *
     */
    function selectGriddingPC (polygon) {
        var extData,gridId = polygon ? polygonObjMapForPC[polygon.getOptions().extData.id].data.gridId : "null";
        _.each(polygonObjMapForPC, function (item, key) {
            modifyPolygonExdata(polygonObjMapForPC[key].polygonObj, {
                "selected" : item.data.gridId == gridId
            });
        });
    }


    /**
     * 查询所有网格的党建企业信息
     *
     * @param {object} 
     * @param {string} 
     *
     */

    function getPartyCompanyStatistics () {
        var tempUrl = "/map/party-enterprise-statistics";
        if (mapVM.griddingModel.value.length != 0) {
            var tempGriddingString = mapVM.griddingModel.value.join("&gridIds=");
            tempUrl += (tempUrl.indexOf("?")==-1?"?":"&") + "gridIds=" + tempGriddingString;
        }
        if (mapVM.partyTypeModel.value.length != 0) {
            var tempTypeString = mapVM.partyTypeModel.value.join("&partyBuildTypes=");
            tempUrl += (tempUrl.indexOf("?")==-1?"?":"&") + "partyBuildTypes=" + tempTypeString;
        }
        var tempPromise = axios.get(utilService.getResourceUrl(encodeURI(tempUrl)));

        // tempPromise.then(function (result) {

        // });
        return tempPromise;
    }
</script>
