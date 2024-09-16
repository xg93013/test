<style scoped lang="sass">
    
    @import "../../styles/common.scss";
    
    $nullLengthValue:0px;

    // 顶部logo以及tab头的高度
    $topLogoHeight:50px;

    $hunderpercent:100%;

    // *{
    //     margin:0px;
    // }

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
    }
    #container,#containerCL {
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
        height: 32px;
        line-height: 32px;
        // text-align:right;
        padding-right:10px;
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
        width: 250px;
        z-index: 1000;
        right: 0px;
        background-color:rgba(255,255,255,0.8) !important;
    }


    /* 合作镇发案地图的CSS begin*/
    .crimeListTab .spanType {
        width:70px;
    }
    .crimeListTab .spanTypeUnit {
        width:190px;
    }

    .crimeListTab .spanTypeQuarterY {
        width:70px;
    }
    .crimeListTab .spanTypeQuarter {
        width:125px;
    }
    .crimeTableArea {
        // padding-bottom:20px;
        position : absolute;
        bottom : 0px;
        right: 0px;
        margin : 30px;
        opacity: 0.9;
    }
    .crimeTable {
        
        // width: 500px;
        // height: 300px;
        // top:0px;
        position : absolute;
        bottom : 0px;
        right: 0px;
        
    }
    /* 发案图例 */
    .caseColorLegend {
        padding : 10px;
        position : absolute;
        top: 300px;
        left: 25px;
        background-color : rgba(14, 98, 192,0.9);
        box-shadow: 4px 4px 5px rgba(4, 36, 93, 0.7);
        border-radius: 5px;
        // border:1px solid #5cadff;
        color : white;

    }
    .caseColorLegend .legendTitle {
        width : 50px;
        height : 30px;
        line-height: 30px;
        margin-bottom: 5px;
        border-radius: 5px;
        text-align: center;
        
        
    }
    .legendTitle ,.legendText {
        float: left;
    }
    .caseColorLegend .legendText {
        // width : 100px;
        height : 30px;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        padding : 0px 10px;
    }
    .caseColorLegend li:after{
        content: "";
        height: 30px;
        display: inline-block;
        clear: both;
    }

    .crimeListTab .opeartionArea {
        width : 400px;
        background-color:transparent;
        .searchBtn {
            display: block;
            margin : 0 auto;
            // background-color: #2d8cf0;
            // color: white;
        }
    }

    .caseTypeOption li {
        text-overflow: ellipsis !important;
        overflow: hidden;
    }
    
    /* 合作镇发案地图的CSS end*/

</style>
<style lang="sass">
    .caseDetail {
        // &::after{
        //     display: block;
        //     visibility: hidden;
        //     content: "";
        //     width: 0;
        //     clear:both;
        // }
        // p {
        //     float:left;
        // }
        .caseDetailTitle {
            position:absolute;
        }
        .caseDetailText {
            margin-left:60px;
        }
    }
    .caseDetailModal {
        .ivu-modal-body {
            .crimeDetailContentArea {
                div {
                    margin-bottom:5px;
                    span {
                        font-weight:700;
                    }
                }
            }
        }
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
    .crimeTableCloseBtn {
        font-size:31px;
        position: relative;
        top: -10px;
        cursor:pointer;
        color : #999;
        &.ivu-icon-ios-close-empty:hover {
            color : #444444;
        }
    }
    .crimeTable {
        .ivu-card-head {
            padding : 10px 16px;
        }
    }
    .polygonPop {
        .ivu-card-head {
            padding : 5px 16px 2px;
        }
    }
</style>
<template>
    <div class="mapVM" v-cloak>
        <Row class="middle" style="height:100%">
            <Col :span="showLeftSpan()" class="mapContainer" ref="map">
                <div class="suspendDisplayArea crimeListTab" v-show="!showLeft" @mouseover="closePop">
                    <card class="opeartionCard" :bordered="false">
                        <div class="opeartionArea">
                            <Row>
                                <Col span="6">
                                    <p class="leftMenuText">发案时间</p>
                                </Col>
                                <!-- 选择时间过滤类型（年、月、自定义）-->
                                <Col span="18">
                                    <Select v-model="crimeList.spanType.value" class="spanType" @on-change="changeSpanType">
                                        <Option v-for="item in crimeList.spanType.list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                    <!-- 选择年 -->
                                    <date-picker type="year" placeholder="请选择年" class="spanTypeUnit" v-show="crimeList.spanType.value=='year'" v-model="crimeList.dateModel.year.value"></date-picker>
                                    <!-- 选择月 -->
                                    <date-picker type="month" placeholder="请选择月" class="spanTypeUnit" v-show="crimeList.spanType.value=='month'" v-model="crimeList.dateModel.month.value"></date-picker>
                                    <!-- 选择季度 -->
                                    <date-picker type="year" placeholder="请选择季度" class="spanTypeQuarterY" v-show="crimeList.spanType.value=='quarter'" v-model="crimeList.dateModel.quarter.yValue" @on-change="changeQuarter"></date-picker>
                                    <Select v-model="crimeList.dateModel.quarter.qValue" class="spanTypeQuarter" v-show="crimeList.spanType.value=='quarter'" @on-change="changeQuarter">
                                        <Option v-for="item in crimeList.dateModel.quarterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                    <!-- 自定义选择时间范围 -->
                                    <date-picker type="daterange" placeholder="请选择时间范围" class="spanTypeUnit" v-show="crimeList.spanType.value=='custome'" v-model="crimeList.dateModel.custome.value" placement="bottom-end"></date-picker>
                                </Col>
                            </Row>
                            <br>
                            <Row>
                                <Col span="6">
                                    <p class="leftMenuText">案件类型</p>
                                </Col>
                                <!-- 过滤案件类型-->
                                <Col span="18">
                                    <div class="caseTypeOption">
                                        
                                        <Select v-model="crimeList.crimeType.value" style="width:260px" @on-change="changeSpanType" multiple :placeholder="crimeList.crimeType.placeholder">
                                            <Option v-for="item in crimeList.crimeType.list" :value="item.value" :key="item.value" :title="item.label">{{ item.label }}</Option>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>
                            <br>
                            <Row>
                                <!-- 所属网格 -->
                                <Col span="6">
                                    
                                    <p class="leftMenuText">所属网格</p>
                                </Col>
                                <Col span="18">
                                    
                                    <div class="ownGridArea">
                                        <Select v-model="crimeList.gridList.value" style="width:260px" @on-change="crimeList.gridList.changeGrid" multiple :placeholder="crimeList.gridList.placeholder">
                                            <Option v-for="item in crimeList.gridList.list" :value="item.value" :key="item.value" :title="item.label">{{ item.label }}</Option>
                                        </Select>
                                    </div>
                                </Col>
                            </Row>
                            <br>
                            <Row>
                                <Col span="6">
                                    <!-- 显示案件定位 -->
                                    <p class="leftMenuText">显示案件定位</p>
                                    
                                </Col>
                                <Col span="18">
                                    <Switch size="large" v-model="crimeList.crimePosition.show" @on-change="showMarkerChange" style="margin:4px 0;">
                                        <span slot="open">显示</span>
                                        <span slot="close">隐藏</span>
                                    </Switch>
                                </Col>
                            </Row>
                            <br>
                            <Row>
                                <Button @click="refreshCrimeList" class="searchBtn" style="width:260px">搜索</Button>
                            </Row>
                        </div>
                    </card>
                </div>
                <card v-show="popModel.show" class="polygonPop" v-bind:style="popModel.tipPopStyle" ref="polygonPop">
                    <p slot="title">{{popModel.title}}</p>
                    <div v-html="popModel.content"></div>
                </card>
                <div v-show="tabModel.currentTab=='CL'" style="width: 100%;height:100%;">
                    <div id="containerCL" class="container"></div>
                    <!-- 展示案件详情 -->
                    <div class="crimeTableArea" v-show="crimeList.showCirmeTable" @mouseover="closePop">
                        <Modal v-model="crimeList.crimeDetail.show" :mask-closable="false" class-name="caseDetailModal">
                            <div slot="header">
                                <div v-html="crimeList.crimeDetail.title"></div>
                            </div>
                            <div class="crimeDetailContentArea" v-html="crimeList.crimeDetail.content"></div>
                            <div slot="footer">
                                
                            </div>
                        </Modal>
                        <card class="crimeTable">
                            <p slot="title">{{crimeList.crimeListTitle}}</p>
                            <div slot="extra">
                                <Icon type="ios-close-empty" class="crimeTableCloseBtn" @click.native="closeCrimeTable"></Icon>
                            </div>
                            <i-table width="800" height="200" :columns="crimeList.tableColumnList" :data="crimeList.crimeData"></i-table>
                        </card>
                    </div>
                    <!-- legend图例 -->
                    <div class="caseColorLegend" @mouseover="closePop">
                        <h3 style= "text-align: center;margin-bottom:10px ">发案数量图例</h3>
                        <ul>
                            <li v-for="item,index in crimeList.caseNumberLegned.list">
                                <div v-bind:style="item.colorStyle" class="legendTitle"></div>
                                <div class="legendText">{{item.caseNumberStart + " ~ " +item.caseNumberEnd}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    // import uploadedTablePane from './uploaded-table-pane.vue';
    import AMap from 'AMap';
    import axios from "axios";

    var map,// 全局map对象
        polygonArray = [],//保存所有的行政区域
        polygonObjMap = {},//保存所有的行政区域对象
        polygonObjMapForCL = {},//保存所有发案地图多边形对象
        markerObjMapForCL = {},//保存所有发案地点的marker对象
        modifiedPolygonFlag = {},//界面未保存的有修改的多边形数据
        currentPolygonObjEditor,//新建的高德多边形Editor对象
        currentPolygonObj,//临时的高德多边形对象
        griddingMap={},// 所有网格对象
        // 颜色相关枚举
        color = {
            selectedStorkeOpacity : 1,
            defaultStrokeOpacity : 0.5,
            hoverStrokeOpacity : 1,
            colors : ["#F9ED69","#F08A5D","#FF9A00","#6A2C70","#222831","#FFFCCA","#00ADB5","#3EC1D3","#FF9A00","#FF165D"],
            defaultFillOpacity : 0.5,
            defaultStrokeWeight : 3
        },
        defaultCursor = "",
        mapVM;

    export default {
        data : function () {
            return {
                showNewNav : true,
                showLeft : false,
                showLeftSpan : function () {
                    return this.showLeft ? 20 : 24;
                },
                // .TAB选项对象
                tabModel : {
                    currentTab : "CL",
                    tabs : {
                        polygonEditing : {
                            value : "PE",
                            label : "网格绘制"
                        },
                        crimeList : {
                            value : "CL",
                            label : "合作街道发案地图"
                        }
                    }
                },
                // 发案tab模型对象
                crimeList : {
                    mapInit : false,
                    showCirmeTable : false,
                    // 显示案件定位
                    crimePosition : {
                        show : true,
                        change : function (args) {
                            mapVm
                            if (args) {
                                _.each(markerObjMapForCL, function (item,key) {
                                    markerObjMapForCL[key].markerObj.show();
                                });
                            } else {
                                _.each(markerObjMapForCL, function (item,key) {
                                    markerObjMapForCL[key].markerObj.hide();
                                    // markerObjMapForCL[key].markerObj.hide();
                                });
                            }
                        }
                    },
                    spanType : {
                        value : "year",
                        list : [{label:"年",value:"year"},{label:"季度",value:"quarter"},{label:"月",value:"month"},{label:"自定义",value:"custome"}]
                    },
                    dateModel : {
                        year : {
                            value :new Date(),
                            getRange : function () {
                                var tempDate = _.isObject(this.value) ? this.value.getFullYear() : this.value;
                                return {
                                    startTime : tempDate + "0101",
                                    endTime : tempDate + "1231"
                                }
                            }
                        },
                        month : {
                            value :"",
                            getRange : function () {
                                // var tempStartDate = _.isObject(this.value) ? : this.value,
                                //     tempEndDate = _.isObject(this.value) ? this.value.getFullYear() + (this.value.getMonth()*1 + 1) + "01"
                                if (!_.isObject(this.value)) {
                                    return {
                                        startTime : this.value,
                                        endTime : this.value
                                    }
                                }
                                return {
                                    startTime : getDateString(this.value.getFullYear(), this.value.getMonth()+1),
                                    endTime : getDateString(this.value.getFullYear(), this.value.getMonth()+1, true)
                                }
                            }
                        },
                        quarter :{
                            yValue : "",
                            qValue : "",
                            value : "",
                            getRange : function () {
                                var tempStartM = this.qValue * 3 - 2,
                                tempEndM = this.qValue * 3
                                return {
                                    startTime : getDateString(this.yValue.getFullYear(), tempStartM),
                                    endTime : getDateString(this.yValue.getFullYear(), tempEndM, true)
                                }
                            }
                        },
                        quarterList : [{label:"一季度（1-3月）",value:"1"},{label:"二季度（4-6月）",value:"2"},{label:"三季度（7-9月）",value:"3"},{label:"四季度（10-12月）",value:"4"}],
                        custome : {
                            value :"",
                            getRange : function () {
                                var startTime = this.value[0].getFullYear() + "" + getFormatDateString(this.value[0].getMonth() + 1) + getFormatDateString(this.value[0].getDate()),
                                    endTime = this.value[1].getFullYear() + "" + getFormatDateString(this.value[1].getMonth() + 1) + getFormatDateString(this.value[1].getDate())
                                return {
                                    startTime : startTime,
                                    endTime : endTime
                                }
                             }
                        },
                        searchedDateRange : {
                            startTime : "20170101",
                            endTime : "20171231"
                        },
                        searchedCaseType : []
                    },
                    crimeType : {
                        value : [],
                        list : [],
                        placeholder : "请选择案件类型"
                    },
                    gridList : {
                        value : [],
                        list : [],
                        placeholder : "请选择所属网格",
                        changeGrid : function (args) {

                        }
                    },
                    tableColumnList : [
                        {
                            title : "案件编号",
                            key : "caseId",
                            width: 200,
                        },
                        {
                            title : "案件名称",
                            key : "caseName",
                            width: 150,
                            ellipsis : true
                        },
                        {
                            title : "案件类型",
                            key : "caseType"
                        },
                        {
                            title : "发案时间",
                            key : "caseTime",
                            width: 200,
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
                                            showCaseDetail(params.row);
                                            
                                        }
                                    }
                                }, "详情")
                            }
                        },
                    ],
                    // 案件详情modal
                    crimeDetail : {
                        title : "",
                        show : false,
                        content : ""
                    },
                    crimeListTitle : "",
                    caseNumberLegned : {
                        list : []
                    },
                    crimeData : []
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
                    // 用于监听modifiedPolygonFlag
                    modifiedPolygonFlagForWatch : modifiedPolygonFlag
                    // lngAndLatData : []
                },
                popModel : {
                    title : "",
                    content : "",
                    show : false,
                    tipPopStyle : {
                        top : "0px",
                        right : "0px"
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
                if (!_.isEmpty(modifiedPolygonFlag) || mapVM.editor.isPolygonEditting || mapVM.editor.isMouseToolEditting) {
                    mapVM.$Modal.warning({
                        title: "警告",
                        content: "当前网格存在未保存多边形，请先保存后再切换网格编辑",
                        onOk : function () {
                            mapVM.dataModel.currentGridding = mapVM.dataModel.oldGridding;
                            // selectGridding(mapVM.dataModel.oldGridding);
                        }
                    })
                } else {
                    switchEditPolygonStatus(false);
                    selectGridding(value);
                    boldGriddingBorder(value);
                }
            },
            // 切换tab
            changeTabs : function () {
                if (mapVM.tabModel.currentTab == "CL") {
                    if (!mapVM.crimeList.mapInit) {
                        // initMapForCrimeList();
                    }
                }
            },
            changeSpanType : function () {
                mapVM.crimeList.dateModel.type = mapVM.crimeList.spanType.value;
            },
            // 求换季度的年份
            changeQuarter : function () {
                // 选择季度年份和季度均不为空才刷新value值,将该函数执行放到栈底，保证取到改变后的日期值
                setTimeout(function () {
                    if (mapVM.crimeList.dateModel.quarter.yValue != "" && mapVM.crimeList.dateModel.quarter.qValue != "") {
                        mapVM.crimeList.dateModel.quarter.value = mapVM.crimeList.dateModel.quarter.yValue + mapVM.crimeList.dateModel.quarter.qValue;
                    }
                }, 0);
                
            },
            // 刷新发案率
            refreshCrimeList : function () {
                refreshCrimeListFn();
                
            },
            showMarkerChange : function (args) {
                if (args) {
                    _.each(markerObjMapForCL, function (item,key) {
                        markerObjMapForCL[key].markerObj.show();
                    });
                } else {
                    _.each(markerObjMapForCL, function (item,key) {
                        markerObjMapForCL[key].markerObj.hide();
                        // markerObjMapForCL[key].markerObj.G.visible = false;
                    });
                }
            },
            closeCrimeTable : function () {
                this.crimeList.showCirmeTable = false;
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
            initMapForCrimeList();
        }
    }
/*
    查看案件详情
*/
    function showCaseDetail (args) {
        mapVM.crimeList.crimeDetail.show = true;
        mapVM.crimeList.crimeDetail.title = "<span style='font-weight:700;font-size:15px;'>"+args.caseName+"</span><span style='padding-left:10px;'>案件编号："+args.caseId+"</span>";
        mapVM.crimeList.crimeDetail.content = /*"<div><p>案件编号：" + args.caseId + "</p>"+*/"</div>"+ "<div><p><span>发案时间：</span>" + args.caseTime +"</p></div><div><p><span>案件类型：</span>" + args.caseType + "</p></div><div><p><span>发案区域：</span>" + args.caseArea + "</p></div><div><p><span>发案地址：</span>" + args.caseDetailAddr + "</p></div>"+"<div class='caseDetail'><p class='caseDetailTitle'><span>简要案情：</span></p><p class='caseDetailText'>" + (args.caseDetail || "无") + "</p></div>"+"<div><p><span>是否高校：</span>"+args.isCollege + "</p></div>";
    }


    /**
     * 获取某日的字符串日期
     *
     * @param {number} year 年
     * @param {number} month 月
     * @param {bool} isLastDate 是否取最后一天
     *
     */

    function getDateString(year, month, isLastDate) {
        var new_year = year; //取当前的年份 
        if (!isLastDate) {
            return year + "" + getFormatDateString(month) + "01";
        }
        var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定） 
        if(month>12) { 
            new_month -=12; //月份减 
            new_year++; //年份增 
        }

        var calculate_date = new Date(new_year, new_month, 0);

        // var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天 
        // var calculate_date = new Date(new_date.getTime()-1000*60*60*24);
        var tempDate = calculate_date.getDate() + "";
        // tempDate = tempDate.length < 2 ? "0" + tempDate : tempDate;
        var tempMonth = calculate_date.getMonth() + 1;
        return calculate_date.getFullYear() + "" + getFormatDateString(tempMonth) + getFormatDateString(tempDate);
    }
    /**
     * 将不满两位的数字转换为“0X”，用于月份和日期
     *
     * @param {number} num 数字
     *
     */
    function getFormatDateString(num) {
        return ("0" + num).substr(-2,2);
    }


    /**
     * 根据事件或多边形状态改变边框颜色属性
     *
     * @param {number/obj} params 透明度或者样式对象
     * @param {object} polygon 多边形对象
     * @param {boolean} clear 是否重置其他多边形边框颜色
     */
    function changeStrokeStyle(params, polygon, clear) {
        var opacity,strokeStyle = "solid";
        if (mapVM.editor.isPolygonEditting || mapVM.editor.isMouseToolEditting) {
            return;
        }
        // if (!polygon) {
        //     polygon = currentPolygonObj;
        // }
        if (clear) {    
            _.each(polygonObjMap, function (item, key) {
                item.polygonObj.setOptions({
                    strokeOpacity : item.polygonObj.getOptions().extData.origin.strokeOpacity,
                    strokeStyle : "solid"
                })
            });
            // clear为true需要先清除所有选中项，将currentPolygonObj置空
            currentPolygonObj = null;
            // 清除所有对象的selected状态
            selectPolygon(null);
        }
        if (_.isObject(params)) {
            opacity = params.opacity;
            strokeStyle = params.strokeStyle;
        } else {
            opacity = params;
        }
        if (polygon) {
            polygon.setOptions({
                strokeOpacity : opacity,
                strokeStyle : strokeStyle
            });
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

        _.each(polygonObjMap, function (polygon, id) {
            if (polygon.data.gridId == gridId) {
                polygonObjMap[id].polygonObj.setOptions({
                    fillOpacity : isTransparent ? 0 : color.defaultFillOpacity
                });
            } else if (clear || !gridId) {
                polygonObjMap[id].polygonObj.setOptions({
                    fillOpacity : color.defaultFillOpacity
                });
            }
        })
    }
    /**
     * 选中某个多边形
     *
     * @param {object} polygon 需要选中的多变形，如果不传值则清除所有选中状态
     *
     */
    function selectPolygon (polygon) {
        var extData;
        _.each(polygonObjMap, function (item, key) {
            modifyPolygonExdata(polygonObjMap[key].polygonObj, {
                "selected" : false
            });
        });
        mapVM.editor.hasSelectedPolygon = false;

        if (!_.isEmpty(polygon)) {
            currentPolygonObj = polygon;
            mapVM.editor.hasSelectedPolygon = true;
            modifyPolygonExdata(polygon, {
                "selected" : true
            });
        }
        
    }

    /**
     * 根据选中的可编辑多边形，刷新左边数据展示区域
     *
     * @param {array} param 手动绘制坐标数组
     *
     */
    function refreshDisplayArea (data) {
        mapVM.dataModel.lngAndLatData = data.data;
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
                utilService.handleException(result);
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

            // console.log(allGrid);
            mapVM.crimeList.gridList.list = _.cloneDeep(allGrid);


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
                utilService.handleException(result);
                return;
            }
            _.each(result.data.data, function (item, index) {
                result.data.data[index].colorStyle = "background-color:" + item.color + ";opacity:"+color.defaultFillOpacity;
            });
            mapVM.crimeList.caseNumberLegned.list = result.data.data.reverse();
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
            _.each(polygonObjMap, function (item, key) {
                polygonObjMap[key].polygonObj.setOptions({
                    strokeWeight : color.defaultStrokeWeight,
                    strokeColor : item.polygonObj.getOptions().extData.origin.strokeColor,
                    strokeOpacity : item.polygonObj.getOptions().extData.origin.strokeOpacity
                });
            });
            return;
        }
        _.each(polygonObjMap, function (item, key) {
            polygonObjMap[key].polygonObj.setOptions({
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
     * 刷新发案率
     *
     * @param {string} null
     *
     */
    function refreshCrimeListFn () {
        var spanType = mapVM.crimeList.spanType.value,
            spanTime = mapVM.crimeList.dateModel[spanType].value,
            caseTypes = mapVM.crimeList.crimeType.value,
            caseTypeLabel = mapVM.crimeList.crimeType.value;
        if (spanTime == "" || (_.isObject(spanTime) && spanTime[0] == "")) {
            mapVM.$Modal.info({
                title: "提示",
                content: "请选择您想查看的发案时间范围"
            });
            return;
        }
        // 保存点击搜索过后的过滤条件
        mapVM.crimeList.dateModel.searchedDateRange = mapVM.crimeList.dateModel[spanType].getRange();
        mapVM.crimeList.dateModel.searchedCaseType = caseTypes;
        mapVM.crimeList.dateModel.searchedCaseLabel = _.map(caseTypes, function(item){
            return _.find(mapVM.crimeList.crimeType.list, {value : item}).label;
        }).join(",") || "不限";
        axios.all([getPolygons(), getCrimeCount(mapVM.crimeList.dateModel.searchedDateRange, caseTypes)]).then(axios.spread(function (result1, result2) {
            if (getPolygonsData.state.code == 0) {
                // 先清除先所有多边形
                // map.remove(_.map(polygonObjMapForCL, function (item, key) {
                //     return item.polygonObj;
                // }));
                map.clearMap();
                polygonObjMapForCL = {};
                markerObjMapForCL = {};
                // 清空犯案列表表格
                mapVM.crimeList.crimeData = [];
                mapVM.crimeList.showCirmeTable = false;
                var tempVM = mapVM;
                _.each(getPolygonsData.data, function (item, index) {
                    var tempConfig = {
                        fillColor : _.find(result2.data.data, {gridId : item.gridId}) ? _.find(result2.data.data, {gridId : item.gridId}).color : "#fff",
                        caseNumber : 0
                    }
                    _.each(result2.data.data, function (crimeItem, index) {
                        if (crimeItem.gridId == item.gridId) {
                            tempConfig.caseNumber = crimeItem.caseNumber;
                        }
                    });
                    item.points = JSON.parse(item.points);
                    createPolygonCL(item, tempConfig);
                });

                _.each(result2.data.data, function (crimeItem, index) {
                    _.each(crimeItem.caseDetailList, function (cItem,cIndex) {
                        createCrimeMarker(cItem);
                    });
                });

            }
        }));

    }
    var pngMap = {
        crime : require("./case_marker.png")/*,
        crimeSelect : require("./case_marker_s.png")*/
    }
    function createCrimeMarker (crimeItem) {
        // 防止创建多个点；
        if (_.isEmpty(crimeItem) || _.has(markerObjMapForCL, crimeItem.id)) {
            return;
        }

        var tempMarker = new AMap.Marker({
            map: map,
            icon: pngMap["crime"],
            position: [crimeItem.caseAddr.split(",")[0], crimeItem.caseAddr.split(",")[1]],
            title : crimeItem.caseName,
            visible : mapVM.crimeList.crimePosition.show,
            extData : {
                id : crimeItem.id
            },
            offset : new AMap.Pixel(-7,-24)
            // clickable : true
        });

        tempMarker.on("click", function(e) {
            
            showCaseDetail(markerObjMapForCL[e.target.getExtData().id].data);
        })
        markerObjMapForCL[crimeItem.id] = {
            markerObj : tempMarker,
            data : _.cloneDeep(crimeItem)
        }
    }




    /**
     * 初始化发案地图
     *
     * @param {string} null
     *
     */
    function initMapForCrimeList () {
        map = new AMap.Map('containerCL',{
            zoom: 13,
            center: [103.942682, 30.757462],//new AMap.LngLat(116.39,39.9)
            mapStyle : 'amap://styles/0021dd08429d3a9d56f5394765ba50c5'
        });
        mapVM.crimeList.mapInit = true;
        axios.all([getCommunitiesInfo(), getLegendInfo()]).then(axios.spread(function (acct, perms) {
            createCaseTypeList();
            // refreshCrimeListFn();
        }));
        map.on("click", function () {
            mapVM.crimeList.showCirmeTable = false;
        })
    };
    /**
     * 绘制发案地图的多边形
     *
     * @param {obj} param 绘制参数对象
     * @param {int} param.id 多边形id
     * @param {int} param.gridId 网格id
     * @param {string} param.gridName 网格名称
     * @param {array} param.points 网格坐标点
     * @param {object} config 自定义配置，发案地图
     */
    function createPolygonCL (param, config) {
        // 把没选中的网格隐藏
            // _.forEach(polygonObjMapForCL, function (item,key) {
            //     if (mapVM.crimeList.gridList.value.indexOf(item.data.gridId) == -1) {
            //         polygonObjMapForCL[key].polygonObj.hide();
            //     } else {
            //         polygonObjMapForCL[key].polygonObj.show();
            //     }
            // });
        // 没有选择的网格不绘制
        if (mapVM.crimeList.gridList.value.length > 0 && mapVM.crimeList.gridList.value.indexOf(param.gridId) == -1) {
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
        bindEventOnPolygonCL(tempPolygonObj);
        // 保存所有多边形
        polygonObjMapForCL[param.id] = {
            polygonObj : tempPolygonObj,
            data : {
                id : param.id,
                lnglat : param.points.concat(),
                name : param.name,
                gridId : param.gridId,
                gridName : param.gridName,
                caseNumber : config.caseNumber,
            }
        }
    }

    /**
     * 给发案地图多边形绑定事件
     *
     * @param {obj} polygonObj 多边形对象
     *
     */
    function bindEventOnPolygonCL (polygonObj) {
        polygonObj.on("mouseover" ,function (e) {
            var polygonId = e.target.getOptions().extData.id;
            mapVM.popModel.title = polygonObjMapForCL[polygonId].data.gridName;
            mapVM.popModel.content = "<p>发案数量：" + polygonObjMapForCL[polygonId].data.caseNumber + "</p><p>发案时间：" + 
                mapVM.crimeList.dateModel.searchedDateRange.startTime + "~" + mapVM.crimeList.dateModel.searchedDateRange.endTime + 
                "</p><p>案件类型 ：" + mapVM.crimeList.dateModel.searchedCaseLabel + "</p>";
                ;
            
            changeStrokeStyleCL(color.hoverStrokeOpacity, e.target);
        }).on("mousemove" ,function (e) {
            // 发案提示框跟随鼠标
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
                changeStrokeStyleCL({
                    opacity : color.selectedStorkeOpacity,
                    strokeStyle : "dashed"
                }, e.target);
            } else {
                changeStrokeStyleCL(color.defaultStrokeOpacity, e.target);
                
            }
        }).on("click", function(e) {

            // mapVM.crimeList.showCirmeTable = true;
            // 案件列表标题
            mapVM.crimeList.crimeListTitle = polygonObjMapForCL[e.target.getOptions().extData.id].data.gridName+"案件列表" + "(发案时间："+mapVM.crimeList.dateModel.searchedDateRange.startTime + "~" + mapVM.crimeList.dateModel.searchedDateRange.endTime+" 发案类型："+mapVM.crimeList.dateModel.searchedCaseLabel+")";
            var currentGriddingID = polygonObjMapForCL[e.target.getOptions().extData.id].data.gridId;
            changeStrokeStyleCL({
                    opacity : color.selectedStorkeOpacity,
                    strokeStyle : "dashed"
                }, e.target, true);
            // changeGridStyle(currentGriddingID, true, true);
            // 供非覆盖物触发事件调用polygon调用
            selectGriddingCL(e.target);
            getCrimeList(currentGriddingID, mapVM.crimeList.dateModel.searchedDateRange ,mapVM.crimeList.dateModel.searchedCaseType);
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
    function changeStrokeStyleCL(params, polygon, clear) {
        var opacity,strokeStyle = "solid",gridId = polygonObjMapForCL[polygon.getOptions().extData.id].data.gridId;
        if (clear) {
            _.each(polygonObjMapForCL, function (item, key) {
                item.polygonObj.setOptions({
                    strokeOpacity : color.defaultStrokeOpacity,
                    strokeStyle : "solid"
                })
            });
            // clear为true需要先清除所有选中项，将currentPolygonObj置空
            // 清除所有对象的selected状态
            selectGriddingCL(null);
        }

        if (_.isObject(params)) {
            opacity = params.opacity;
            strokeStyle = params.strokeStyle;
        } else {
            opacity = params;
        }

        _.each(polygonObjMapForCL, function (polygonObj, pId) {
            if (polygonObj.data.gridId == gridId) {
                polygonObjMapForCL[pId].polygonObj.setOptions({
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
    function selectGriddingCL (polygon) {
        var extData,gridId = polygon ? polygonObjMapForCL[polygon.getOptions().extData.id].data.gridId : "null";
        _.each(polygonObjMapForCL, function (item, key) {
            modifyPolygonExdata(polygonObjMapForCL[key].polygonObj, {
                "selected" : item.data.gridId == gridId
            });
        });
    }

    /**
     * 查询网格的犯案列表
     *
     * @param {string} gridId 需要查询犯案列表的网格ID
     * @param {object} rangeObj startTime和endTime
     * @param {string} caseType 犯案类型
     *
     */
    function getCrimeList (gridId, rangeObj, caseType) {
        var caseTypeString = caseType.join("&caseType="),
            tempUrl = "/map/grid-case-detail/"+gridId+"?startTime=" + rangeObj.startTime + "&endTime=" + rangeObj.endTime;
        if (caseType.length>0) {
            tempUrl += "&caseType=" + caseTypeString;
        }
        axios.get(utilService.getResourceUrl(tempUrl)).then(function (result) {
            if (result.data.state.code != 0) {
                utilService.handleException(result);
                return;
            }
            mapVM.crimeList.crimeData = result.data.data || [];
            mapVM.crimeList.showCirmeTable = !_.isEmpty(result.data.data) ? true : false;
        }).catch(function (result) {
            utilService.handleException(result);
        });
    }

    /**
     * 查询每个网格发案以及绘制网格
     *
     * @param {object} rangeObj startTime和endTime
     * @param {string} caseType 犯案类型
     *
     */

    function getCrimeCount (rangeObj, caseType) {
        var caseTypeString = caseType.join("&caseType="),
            gridString = mapVM.crimeList.gridList.value.join("&gridId="),
            tempUrl = "/map/grid-case-info?startTime=" + rangeObj.startTime + "&endTime=" + rangeObj.endTime;
        if (caseType.length>0) {
            tempUrl += "&caseType=" + caseTypeString;
        }
        if (mapVM.crimeList.gridList.value.length>0) {
            tempUrl += "&gridId=" + gridString;

        }
        return axios.get(utilService.getResourceUrl(tempUrl));
    }

    /**
     * 查询并生成案件类型列表
     *
     * @param {string} caseType 犯案类型
     *
     */

    function createCaseTypeList () {
        var tempUrl = "/excel/field-type?type=CASE_TYPE";
        axios.get(utilService.getResourceUrl(tempUrl)).then(function (result) {
            if (result.data.state.code != 0) {
                utilService.handleException(result);
                return;
            }
            var tempList = _.map(result.data.data, function (item, index) {
                return {
                    value : item.sysCode,
                    label : item.codeName
                }
            });
            // tempList.unshift({label:"所有",value:"all"});
            mapVM.crimeList.crimeType.list = tempList;
            refreshCrimeListFn();
        }).catch(function (result) {
            utilService.handleException(result);
        });
    };
        /**
     * 查询并所有网格列表
     *
     * @param {string} caseType 犯案类型
     *
     */

    // function createGridList () {
    //     var tempUrl = "/excel/field-type?type=CASE_TYPE";
    //     axios.get(utilService.getResourceUrl(tempUrl)).then(function (result) {
    //         if (result.data.state.code != 0) {
    //             utilService.handleException(result);
    //             return;
    //         }
    //         var tempList = _.map(result.data.data, function (item, index) {
    //             return {
    //                 value : item.sysCode,
    //                 label : item.codeName
    //             }
    //         });
    //         // tempList.unshift({label:"所有",value:"all"});
    //         mapVM.crimeList.crimeType.list = tempList;
    //         refreshCrimeListFn();
    //     }).catch(function (result) {
    //         utilService.handleException(result);
    //     });
    // };
</script>
