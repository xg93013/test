<template>
    <div class="editMapCon" ref="map">
        <div class="editMaps" id="editMap"></div>
        <div class="filterAreas">            
            <div class="editGridBtns">
                <Select v-model="addGridForm.communityId" class="communitySelect" @on-change="changeComunity" placeholder="请选择社区">
                    <Option v-for="item in communitiesData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button @click="addPolygonGrid" class="otherBtn" :disabled="!canAddGrid">添加网格</Button>
                <!-- <Button @click="confirmPolygonGrid" class="otherBtn" :disabled="!showAddGridBtn">完成添加</Button> -->
                <Button @click="editPolygonGrid" class="otherBtn" :disabled="!canStartEdit" >编辑网格</Button>
                <Button @click="cancelAllEditGridPolygon" class="otherBtn" v-show="showCancelEdit" >取消编辑</Button>
                <Button @click="deletePolygonGrid" class="otherBtn" :disabled="!canEditPolygon" >删除网格</Button>
                <Button @click="confirmPolygonGrid" class="otherBtn saveBtn" :disabled="!showSaveBtn">保存</Button>
            </div>
        </div>
        <!-- 窗口信息 -->
        <card v-show="popModel.show" class="polygonPop" v-bind:style="popModel.tipPopStyle" ref="polygonPop">
            <p slot="title">{{popModel.title}}</p>
            <div v-html="popModel.content"></div>
        </card>

        <!-- 网格信息 -->
        <Modal
            v-model="showAddGridModal"
            title="请输入网格信息"
            :mask-closable="false"
            :closable="false"
            :footer-hide="true"
            width="340">
            <div>
                <Form ref="addGridForms" :model="addGridForm" :rules="isAddOrEdit=='add'?ruleValidate:editRuleValidate" :label-width="80">
                    <FormItem label="网格名称" prop="name">
                        <Input v-model="addGridForm.name" placeholder="请输入网格名称"></Input>
                    </FormItem>
                    <FormItem label="网格编码" prop="code" v-show="isAddOrEdit=='add'">
                        <Input v-model="addGridForm.code" placeholder="请输入网格编码"></Input>
                    </FormItem>
                    <!-- <FormItem label="发案数量" prop="caseNum">
                        <Input v-model="addGridForm.caseNum" placeholder=""></Input>
                    </FormItem> -->
                    <FormItem>
                        <Button type="primary" @click="handleAddGrid('addGridForms')">保存</Button>
                        <Button type="ghost" @click="clearAllTempPolygon()" style="margin-left: 8px">取消</Button>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    import AMap from 'AMap';
    import axios from "axios";
    // 颜色相关枚举
    const color = {
        selectedStorkeOpacity : 1,
        defaultStrokeOpacity : 0.5,
        hoverStrokeOpacity : 1,
        colors : ["#F9ED69","#F08A5D","#FF9A00","#6A2C70","#222831","#FFFCCA","#00ADB5","#3EC1D3","#FF9A00","#FF165D"],
        defaultFillOpacity : 0.5,
        defaultStrokeWeight : 3
    }
    export default {
        data(){
            return {
                isAddOrEdit: 'add',
                showSaveBtn: false,
                canEditPolygon: false,
                canStartEdit: false,
                showAddGridModal: false,
                showCancelEdit: false,
                canAddGrid: true,
                currentGridID: 0,
                currentGridName: '',
                currentEditPolygonId: 0,
                addGridForm:{
                    name: '',
                    code: '',
                    communityId: '',
                    children: [],
                },
                editGridForm: {
                    name: '',
                    children: []
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '网格名称不能为空！', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '网格编码不能为空不能为空！', trigger: 'blur' }
                    ]
                },
                editRuleValidate: {
                    name: [
                        { required: true, message: '网格名称不能为空！', trigger: 'blur' }
                    ]
                },
                communitiesData: [], // 所有社区数据
                maps: '',
                allPolygon: {}, // 所有多边形对象
                allGrids: {},
                allPolygonsData: '', // 所有多边形坐标数据
                allGridDatas: [], // 所有网格坐标数据包含多个多边形
                popModel : {
                    title : "",
                    content : "",
                    show : false,
                    tipPopStyle : {
                        top : "0px",
                        right : "0px"
                    }
                },
                mouseTool: '', // 鼠标工具
                allTempPolygon: [], // 所有临时添加多边形
                editPolygonObj: {}, // 网格多边形编辑对象
                allEditPolygonArr: [], // 所有编辑过网格的多边形
            }
        },
        watch: {
            currentGridID(newV){
                if(newV != 0){
                    this.canAddGrid = false;
                    this.canStartEdit = true;
                    this.canEditPolygon = true;
                } else {
                    this.canAddGrid = true;
                    this.canStartEdit = false;
                    this.canEditPolygon = false;
                }
            }
        },
        methods: {
            isEmptyObject(obj){
                for(let i in obj){
                    return false
                }
                return true
            },
            initEditMap(){
                this.maps = new AMap.Map('editMap',{
                    zoom: 13,
                    center: [103.942682, 30.757462],//new AMap.LngLat(116.39,39.9)
                    mapStyle : 'amap://styles/0021dd08429d3a9d56f5394765ba50c5'
                });
                this.maps.on("click",()=>{
                    let editPolygonObjs = this.editPolygonObj;
                    if(!this.isEmptyObject(editPolygonObjs)){
                        this.$Modal.warning({
                            title: "警告",
                            content: "存在未保存的网格编辑对象!",
                            onOk : function () {}
                        })
                    } else {
                        this.currentGridID = 0;
                        this.setDefaultStyle();
                    }
                })
            },
            // 初始所有多边形
            initPolygon(param){
                var maps = this.maps;
                var tempPolygonObj = new AMap.Polygon({
                    map: maps,
                    path: JSON.parse(param.points),
                    strokeColor: "#fff",
                    strokeOpacity : color.defaultStrokeOpacity,
                    strokeWeight: 2,
                    fillColor: "#fff",
                    fillOpacity : color.defaultStrokeOpacity,
                    strokeStyle : "solid",
                    extData : {
                        id : param.id,
                        points : JSON.parse(param.points),
                        gridId : param.gridId,
                        gridName : param.gridName,
                        communityName: param.communityName,
                        selected : false,
                        addTime: param.addTime,
                        updateTime: param.updateTime
                    }
                })
                this.bindPolygonEvent(tempPolygonObj);
                this.allPolygon[param.id] = {
                    polygonObj : tempPolygonObj,
                    data : {
                        id : param.id,
                        points : JSON.parse(param.points),
                        gridId : param.gridId,
                        gridName : param.gridName,
                        communityName: param.communityName,
                        addTime: param.addTime,
                        updateTime: param.updateTime
                    }
                }
            },
            bindPolygonEvent(polygonObj){
                let allPolygon = this.allPolygon;
                let mapVM = this;
                polygonObj.on("mouseover" ,function (e) {
                    let status = e.target.getOptions().extData.addTime == e.target.getOptions().extData.updateTime ? "未修改":"已修改";
                    mapVM.popModel.title = e.target.getOptions().extData.communityName+e.target.getOptions().extData.gridName;
                    mapVM.popModel.content = '状态：' + status;
                    mapVM.popModel.show = true;
                }).on("mousemove" ,function (e) {
                    // 案发提示框跟随鼠标
                    mapVM.popModel.show = true;
                    if (e.pixel.y + mapVM.$refs.polygonPop.offsetHeight >= mapVM.$refs.map.offsetHeight) {
                        mapVM.popModel.tipPopStyle.top = mapVM.$refs.map.offsetHeight-mapVM.$refs.polygonPop.offsetHeight + "px";
                    } else {
                        mapVM.popModel.tipPopStyle.top = e.pixel.y + "px";
                    }
                    if (e.pixel.x + mapVM.$refs.polygonPop.offsetWidth >= mapVM.$refs.map.offsetWidth) {
                        mapVM.popModel.tipPopStyle.left = mapVM.$refs.map.offsetWidth - mapVM.$refs.polygonPop.offsetWidth + "px";
                    } else {
                        mapVM.popModel.tipPopStyle.left = e.pixel.x + 50 + "px";
                    }
                }).on("mouseout" ,function (e) {
                    mapVM.popModel.show = false;
                }).on("click", function(e) {
                    let polygnoId = e.target.getOptions().extData.id;
                    let editPolygonObjs = mapVM.editPolygonObj;
                    if(mapVM.isEmptyObject(editPolygonObjs)){
                        mapVM.currentGridID = e.target.getOptions().extData.gridId;
                        mapVM.currentGridName = e.target.getOptions().extData.gridName;
                        mapVM.changeStrokeStyleCL({
                            opacity : color.selectedStorkeOpacity,
                            strokeStyle : "dashed",
                            fillOpacity: 0.8
                        }, e.target, true);
                    } else {
                        mapVM.$Modal.warning({
                            title: "警告",
                            content: "存在未保存的网格编辑对象!",
                            onOk : function () {
                                
                            }
                        })
                    }
                })
            },
            setDefaultStyle(){
                var polygonObjMapForCL = this.allPolygon;
                _.each(polygonObjMapForCL, function (item, key) {
                    item.polygonObj.setOptions({
                        strokeOpacity : color.defaultStrokeOpacity,
                        strokeStyle : "solid",
                        fillOpacity: color.defaultStrokeOpacity
                    })
                });
            },
            changeStrokeStyleCL(params, polygon, clear) {
                var polygonObjMapForCL = this.allPolygon;
                var opacity,fillOpacity,strokeStyle = "solid",polygonId = polygon.getOptions().extData.id;
                var gridId = polygon.getOptions().extData.gridId;
                if (clear) {
                    _.each(polygonObjMapForCL, function (item, key) {
                        item.polygonObj.setOptions({
                            strokeOpacity : color.defaultStrokeOpacity,
                            strokeStyle : "solid",
                            fillOpacity: color.defaultStrokeOpacity
                        })
                    });
                    // 清除所有对象的selected状态
                    // selectGriddingCL(null);
                }

                if (_.isObject(params)) {
                    opacity = params.opacity;
                    strokeStyle = params.strokeStyle;
                    fillOpacity = params.fillOpacity;
                } else {
                    opacity = params;
                }
                _.each(polygonObjMapForCL, function (polygonObj, pId) {
                    if (polygonObj.data.gridId == gridId) {
                        polygonObjMapForCL[pId].polygonObj.setOptions({
                            strokeOpacity : opacity,
                            strokeStyle : strokeStyle,
                            fillOpacity: fillOpacity
                        });
                    }
                });
            },
            // 添加所有多边形
            addAllPolygon(){
                this.maps.clearMap();
                let arr = this.allPolygonsData;
                for(let i=0;i<arr.length;i++){
                    this.initPolygon(arr[i]);
                }
            },
            // 所有多边形
            getAllPolygon(){
                communicationService.get(utilService.getResourceUrl('/map/grid-polygon'), result => {
                    if(result.state.code == 0) {
                        this.allPolygonsData = result.data;
                        this.addAllPolygon();
                    }else{
                        utilService.handleException(result);
                    }
                }, result => {
                    utilService.handleException(result);
                });
            },
            changeComunity(){},
             // 添加网格
            addPolygonGrid(){
                this.isAddOrEdit = 'add';
                this.addGridForm.name = '';
                if( this.addGridForm.communityId== ''){
                    this.$Message.error("请选择社区！")
                } else {
                    this.$Message.info("请在地图绘制多边形！")
                    this.addGridPolygon();
                    // addGridPolygon();
                }
            },
            // 编辑网格
            editPolygonGrid(){
                this.isAddOrEdit = 'edit';
                this.canAddGrid = false;
                this.showSaveBtn = true;
                this.canStartEdit = false;
                this.showCancelEdit = true;
                this.editGrid();
            },
            // 删除网格
            deletePolygonGrid(){
                let mapVM = this;
                mapVM.$Modal.confirm({
                    title: "警告",
                    content: "请确定要删除网格吗？删除后无法恢复！",
                    onOk : function () {
                        communicationService.remove(utilService.getResourceUrl('/map/grid/'+mapVM.currentGridID), result => {
                            if(result.state.code == 0) {
                                // 删除成功
                                mapVM.$Message.success('删除成功');
                                mapVM.resetBtnStatus();
                                mapVM.getAllPolygon();
                            }else{
                                utilService.handleException(result);
                            }
                        }, result => {
                            utilService.handleException(result);
                        });
                    }
                })
            },
            // 完成绘制
            confirmPolygonGrid(){
                if(this.isAddOrEdit == 'add'){
                    if(this.mouseTool == ''){
                        this.$Message.error('请选绘制多边形');
                    }else{
                        this.showAddGridModal = true
                    }
                }else{
                    if(this.currentGridID == 0){
                        this.$Message.error('请先编辑网格');
                    }else{
                        this.showAddGridModal = true
                    }
                }
            },
            // 提交网格表单信息
            handleAddGrid(name){
                let mapVM = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        mapVM.submitAddGrid();
                    } else {
                        mapVM.$Message.error('请输入完整信息!');
                    }
                })
            },
            // 重置表单
            handleResetGrid(name){
                this.$refs[name].resetFields();
            },
            // 社区数据
            getCommunityData(){
                let mapVM = this;
                communicationService.get(utilService.getResourceUrl('/map/community-grid'), result => {
                    if(result.state.code == 0) {
                        if(result.data){
                            let arr = result.data;
                            for(let i=0;i<arr.length;i++){
                                let oneJson = {
                                    label: arr[i].name,
                                    value: arr[i].id
                                }
                                this.communitiesData.push(oneJson)
                            }
                        }
                    }else{
                        utilService.handleException(result);
                    }
                }, result => {
                    utilService.handleException(result);
                });
            },
            addGridPolygon(){
                let mapVM = this;
                let map = this.maps;
                mapVM.canAddGrid = false;
                // map.plugin(["AMap.MouseTool"],function(){
                mapVM.mouseTool = new AMap.MouseTool(map);
                // 绘制多边形
                mapVM.mouseTool.polygon({
                    strokeColor: "white",
                    strokeOpacity : color.defaultStrokeOpacity,
                    strokeWeight: 2,
                    fillColor: '#fff',
                    fillOpacity : color.defaultStrokeOpacity,
                    strokeStyle : "solid",
                    extData : {
                        selected : false
                    }
                });
                mapVM.mouseTool.on('draw',function(e){
                    mapVM.showSaveBtn = true;
                    let onePolygon = {};
                    let points = [];
                    let pointsArr = e.obj.getPath();
                    onePolygon.id = '';
                    onePolygon.operation = 'A';
                    
                    for(let i=0;i<pointsArr.length;i++){
                        let onePoints = [pointsArr[i].lng,pointsArr[i].lat];
                        points.push(onePoints);
                    }
                    onePolygon.points = JSON.stringify(points);
                    mapVM.addGridForm.children.push(onePolygon);
                    mapVM.allTempPolygon.push(e.obj);
                })
            },
            submitAddGrid(){
                let mapVM = this;
                if(mapVM.mouseTool != ''){
                    mapVM.mouseTool.close();
                }
                
                mapVM.mouseTool = '';
                
                mapVM.showAddGridModal = false;
                if(mapVM.isAddOrEdit == 'add'){
                    communicationService.post(utilService.getResourceUrl('/map/grid'), mapVM.addGridForm, result => {
                        if(result.state.code == 0) {
                            // 添加成功
                            mapVM.$Message.success('添加成功！');
                            // mapVM.mouseTool.close();
                            mapVM.showAddGridModal = false;
                        }else{
                            utilService.handleException(result);
                            mapVM.showAddGridModal = false;
                        }
                        mapVM.resetBtnStatus();
                        mapVM.getAllPolygon();
                    }, result => {
                        utilService.handleException(result);
                    });
                }
                if(mapVM.isAddOrEdit == 'edit'){
                    mapVM.getAllEditGridPolygon();
                    mapVM.editGridForm.name = mapVM.addGridForm.name;
                    communicationService.put(utilService.getResourceUrl('/map/grid/'+mapVM.currentGridID), mapVM.editGridForm, result => {
                        if(result.state.code == 0) {
                            // 修改成功
                            mapVM.$Message.success('修改成功');
                            mapVM.showAddGridModal = false;
                        }else{
                            utilService.handleException(result);
                            mapVM.showAddGridModal = false;
                        }
                        mapVM.resetBtnStatus();
                        mapVM.getAllPolygon();
                    }, result => {
                        utilService.handleException(result);
                    });
                }
            },
            // 获取所有编辑后网格多边形对象
            getAllEditGridPolygon(){
                let mapVM = this;
                let allEditPolygon = mapVM.allPolygon;
                _.each(allEditPolygon, function(onePolygon, id){
                    if(onePolygon.data.gridId == mapVM.currentGridID){
                        mapVM.editPolygonObj[id].close();
                        mapVM.allEditPolygonArr.push({
                            id: onePolygon.data.id,
                            operation: 'M',
                            points: JSON.stringify(onePolygon.data.points)
                        })
                    }
                })
                mapVM.editGridForm.children = mapVM.allEditPolygonArr;
            },
            // 取消编辑
            cancelAllEditGridPolygon(){
                let mapVM = this;
                let allEditPolygon = mapVM.allPolygon;
                _.each(allEditPolygon, function(onePolygon, id){
                    if(onePolygon.data.gridId == mapVM.currentGridID){
                        mapVM.editPolygonObj[id].close();
                    }
                })
                mapVM.showCancelEdit = false;
                mapVM.resetBtnStatus();
                mapVM.addAllPolygon();
            },
            editGrid(){
                //构造编辑对象
                let mapVM = this;
                let polygonObjMapForCL = this.allPolygon;
                let currentGridID = this.currentGridID;
                let map = this.maps;

                // 获取表格信息
                mapVM.addGridForm.name = mapVM.currentGridName;

                // 获取网格路径
                _.each(polygonObjMapForCL, function (polygonObj, pId) {
                    if (polygonObj.data.gridId == mapVM.currentGridID) {
                        // polygonObjMapForCL[pId].polygonObj.setOptions({
                        //     strokeOpacity : opacity,
                        //     strokeStyle : strokeStyle
                        // });
                        map.plugin(["AMap.PolyEditor"],function(){
                            mapVM.editPolygonObj[pId] = new AMap.PolyEditor(map,polygonObjMapForCL[pId].polygonObj);
                            mapVM.editPolygonObj[pId].open();
                            mapVM.editPolygonObj[pId].on('adjust',(e)=>{
                                let pointsArr = e.target.getPath();
                                let points = [];
                                for(let i=0;i<pointsArr.length;i++){
                                    points.push([pointsArr[i].lng, pointsArr[i].lat]);
                                }
                                mapVM.currentEditPolygonId = pId;
                                polygonObjMapForCL[pId].data.points = points;
                            })
                            mapVM.editPolygonObj[pId].on('end',({type,target})=>{
                                let pathArr = target.getPath();
                                for(let i=0;i<pathArr.length;i++){
                                    let onePoint = [];
                                    if(pathArr[i] instanceof Array){
                                        let inPoint = [];
                                        for(let j=0;j<pathArr[i].length;j++){
                                            inPoint.push([pathArr[i][j].lng,pathArr[i][j].lat])
                                        }
                                        onePoint.push(inPoint);
                                    } else{
                                        onePoint.push = [pathArr[i].lng, pathArr[i].lat];
                                    }
                                }
                            })
                        });
                    }
                });
            },
            resetBtnStatus(){
                this.currentGridID = 0;
                this.editPolygonObj = {};
                this.canEditPolygon = false;
                this.showCancelEdit = false;
                this.canAddGrid = true;
                this.showSaveBtn = false;
            },
            clearAllTempPolygon(){
                this.showAddGridModal = false;
                this.addGridForm.children = [];
                for(let i=0;i<this.allTempPolygon.length;i++){
                    this.allTempPolygon[i].setMap();
                }
                this.allTempPolygon = [];
            }
        },
        mounted(){
            this.initEditMap();
            this.getCommunityData();
            this.getAllPolygon();
        }
    }
</script>
<style lang="scss" scoped>
.editMapCon{
    width: 100%;
    height: 100%;
    padding: 0 20px;
    position: relative;
    .editMaps{
        width: 100%;
        height: 100%;
    }
    .filterAreas{
        position: absolute;
        right: 30px;
        top: 10px;
        border-radius: 5px;
        width: 400px;
        overflow: hidden;
        background: rgba(14, 98, 192, 0.9);
        box-shadow: 4px 4px 5px rgba(4, 36, 93, 0.7);
        .editGridBtns{
            width: 260px;
            overflow: hidden;
            margin: 20px auto 40px;
            .communitySelect{
                width: 260px;
                margin: 20px auto;
            }
            .otherBtn{
                width: 260px;
                margin: 2px auto;
            }
            .saveBtn{
                margin: 20px auto;
            }
        }
        
    }
    .polygonPop {
        position: absolute !important;
        width: 250px;
        z-index: 1000;
        right: 0px;
        background-color:rgba(255,255,255,0.8) !important;
    }
}
</style>
<style lang="sass">
.polygonPop {
    .ivu-card-head {
        padding : 5px 12px 2px;
    }
}
</style>



