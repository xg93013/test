<template>
    <div class="editMapCon" ref="map">
        <div class="editMaps" id="editMap"></div>
        <div class="filterArea">            
            <div class="editGridBtns">
                <Select v-model="addGridForm.communityId" class="communitySelect" @on-change="changeComunity" placeholder="请选择社区">
                    <Option v-for="item in communitiesData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button @click="addPolygonGrid" class="otherBtn" :disabled="startAddGrid">添加网格</Button>
                <Button @click="confirmPolygonGrid" class="otherBtn" v-show="startAddGrid">完成添加</Button>
                <Button @click="editPolygonGrid" class="otherBtn" :disabled="!canEditPolygon" >编辑多边形</Button>
                <Button @click="deletePolygonGrid" class="otherBtn" :disabled="!canEditPolygon" >删除多边形</Button>
                <Button @click="finishEditPolygonGrid" class="otherBtn" :disabled="!showEditGridBtn" >完成编辑</Button>
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
                <Form ref="addGridForm" :model="addGridForm" :rules="ruleValidate" :label-width="80">
                    <FormItem label="网格名称" prop="name">
                        <Input v-model="addGridForm.name" placeholder="请输入网格名称"></Input>
                    </FormItem>
                    <!-- <FormItem label="发案数量" prop="caseNum">
                        <Input v-model="addGridForm.caseNum" placeholder=""></Input>
                    </FormItem> -->
                    <FormItem>
                        <Button type="primary" @click="handleAddGrid('addGridForm')">保存</Button>
                        <Button type="ghost" @click="handleResetGrid('addGridForm')" style="margin-left: 8px">重置</Button>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {communicationService,utilService,modalService} from '@/libs/uBase';
    import mapJson from '../polygon.json';
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
                showEditGridBtn: false,
                canEditPolygon: false,
                currentGriddingID: 0,
                currentPolygonIds: 0,
                addGridForm:{
                    name: '',
                    communityId: '',
                    children: [],
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '网格名称不能为空！', trigger: 'blur' }
                    ]
                },
                communitiesData: [],
                showAddGridModal: false,
                startAddGrid: false,
                maps: '',
                allPolygon: {},
                allGrids: {},
                allPolygonsData: '', // 所有多边形
                allGridDatas: [], // 所有网格
                popModel : {
                    title : "",
                    content : "",
                    show : false,
                    tipPopStyle : {
                        top : "0px",
                        right : "0px"
                    }
                },
                mouseTool: '',
                editPolygonObj: '' 
            }
        },
        watch: {
            currentPolygonIds(newV){
                console.log(newV);
                if(newV != 0){
                    this.canEditPolygon = true;
                }
            }
        },
        methods: {
            initEditMap(){
                this.maps = new AMap.Map('editMap',{
                    zoom: 13,
                    center: [103.942682, 30.757462],//new AMap.LngLat(116.39,39.9)
                    mapStyle : 'amap://styles/0021dd08429d3a9d56f5394765ba50c5'
                });
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
                        lnglat : JSON.parse(param.points),
                        name : param.name,
                        gridId : param.gridId,
                        gridName : param.gridName,
                        // caseNumber : config.caseNumber,
                        selected : false
                    }
                })
                this.bindPolygonEvent(tempPolygonObj);
                this.allPolygon[param.id] = {
                    polygonObj : tempPolygonObj,
                    data : {
                        id : param.id,
                        lnglat : param.points.concat(),
                        name : param.name,
                        gridId : param.gridId,
                        gridName : param.gridName
                    }
                }
            },
            // 初始所有网格
            initGrid(param){
                var maps = this.maps;
                // maps.clearMap();
                var tempGridObj = new AMap.Polygon({
                    map: maps,
                    path: param.points,
                    strokeColor: "#fff",
                    strokeOpacity : color.defaultStrokeOpacity,
                    strokeWeight: 2,
                    fillColor: "#fff",
                    fillOpacity : color.defaultStrokeOpacity,
                    strokeStyle : "solid",
                    extData : {
                        id : param.id,
                        // lnglat : param.points,
                        // name : param.name,
                        gridId : param.gridId,
                        gridName : param.gridName,
                        // caseNumber : config.caseNumber,
                        selected : false
                    }
                })
                this.bindGridEvent(tempGridObj);
                this.allGrids[param.id] = {
                    polygonObj : tempGridObj,
                    data : {
                        id : param.id,
                        lnglat : param.points.concat(),
                        // name : param.name,
                        gridId : param.gridId,
                        gridName : param.gridName
                    }
                }
                // this.allGrids[param.id] = {
                //     gridObj: tempGridObj
                // }
            },
            bindPolygonEvent(polygonObj){
                let allPolygon = this.allPolygon;
                let mapVM = this;
                polygonObj.on("mouseover" ,function (e) {
                   mapVM.popModel.title = e.target.getOptions().extData.gridName;
                   mapVM.popModel.content = e.target.getOptions().extData.gridName;
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
                        mapVM.popModel.tipPopStyle.left = e.pixel.x + 100 + "px";
                    }
                }).on("mouseout" ,function (e) {
                    mapVM.popModel.show = false;
                }).on("click", function(e) {
                    let polygnoId = e.target.getOptions().extData.id;
                    mapVM.currentPolygonIds = e.target.getOptions().extData.id;
                    mapVM.changeStrokeStyleCL({
                        opacity : color.selectedStorkeOpacity,
                        strokeStyle : "dashed"
                    }, e.target, true);
                    // this.allPolygon[polygnoId].setOptions({
                    //     strokeOpacity : color.defaultStrokeOpacity,
                    //     strokeStyle : "solid"
                    // })

                })
            },
            bindGridEvent(polygonObj){
                let allPolygon = this.allGrids;
                let mapVM = this;
                polygonObj.on("mouseover" ,function (e) {
                   mapVM.popModel.title = e.target.getOptions().extData.gridName;
                   mapVM.popModel.content = e.target.getOptions().extData.gridName;
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
                        mapVM.popModel.tipPopStyle.left = e.pixel.x + 100 + "px";
                    }
                }).on("mouseout" ,function (e) {
                    mapVM.popModel.show = false;
                }).on("click", function(e) {
                    let polygnoId = e.target.getOptions().extData.id;
                    mapVM.currentPolygonIds = e.target.getOptions().extData.id;
                    mapVM.changeGridStyle({
                        opacity : color.selectedStorkeOpacity,
                        strokeStyle : "dashed"
                    }, e.target, true);
                    // this.allPolygon[polygnoId].setOptions({
                    //     strokeOpacity : color.defaultStrokeOpacity,
                    //     strokeStyle : "solid"
                    // })

                })
            },
            changeGridStyle(params, polygon, clear) {
                var allGrids = this.allGrids;
                var opacity,strokeStyle = "solid",polygonId = polygon.getOptions().extData.id;
                if (clear) {
                    _.each(allGrids, function (item, key) {
                        item.polygonObj.setOptions({
                            strokeOpacity : color.defaultStrokeOpacity,
                            strokeStyle : "solid",
                            fillOpacity: color.defaultStrokeOpacity,
                        })
                    });
                    // 清除所有对象的selected状态
                    // selectGriddingCL(null);
                }

                if (_.isObject(params)) {
                    opacity = params.opacity;
                    strokeStyle = params.strokeStyle;
                } else {
                    opacity = params;
                }
                _.each(allGrids, function (polygonObj, pId) {
                    if (polygonObj.data.id == polygonId) {
                        allGrids[pId].polygonObj.setOptions({
                            strokeOpacity : opacity,
                            strokeStyle : strokeStyle,
                            fillOpacity: opacity
                        });
                    }
                });
            },
            changeStrokeStyleCL(params, polygon, clear) {
                var polygonObjMapForCL = this.allPolygon;
                var opacity,strokeStyle = "solid",polygonId = polygon.getOptions().extData.id;
                if (clear) {
                    _.each(polygonObjMapForCL, function (item, key) {
                        item.polygonObj.setOptions({
                            strokeOpacity : color.defaultStrokeOpacity,
                            strokeStyle : "solid",
                            fillOpacity: color.defaultStrokeOpacity,
                        })
                    });
                    // 清除所有对象的selected状态
                    // selectGriddingCL(null);
                }

                if (_.isObject(params)) {
                    opacity = params.opacity;
                    strokeStyle = params.strokeStyle;
                } else {
                    opacity = params;
                }
                _.each(polygonObjMapForCL, function (polygonObj, pId) {
                    if (polygonObj.data.id == polygonId) {
                        polygonObjMapForCL[pId].polygonObj.setOptions({
                            strokeOpacity : opacity,
                            strokeStyle : strokeStyle,
                            fillOpacity: opacity
                        });
                    }
                });
            },
            addAllPolygon(){
                // this.allGridDatas = [];
                let arr = this.allPolygonsData;
                for(let i=0;i<arr.length;i++){
                    let oneGrid = {};
                    oneGrid.points = [];
                    oneGrid.gridId = arr[i].gridId;
                    oneGrid.gridName = arr[i].gridName;
                    oneGrid.points.push(JSON.parse(arr[i].points));
                    console.log(this.allGridDatas);
                    if(this.allGridDatas.length == 0){
                        
                        this.allGridDatas.push(oneGrid)
                    } else{
                        let isIn = false; // 是否存在多边形
                        for(let j = 0;j<this.allGridDatas.length;j++){
                            if(oneGrid.gridId == this.allGridDatas[j].gridId){
                                // oneGrid.points.push()
                                isIn = true;
                                this.allGridDatas[j].points.push(JSON.parse(arr[i].points));
                                break;
                            } else {
                                isIn = false;
                            }
                        }
                        if(!isIn){
                            this.allGridDatas.push(oneGrid);
                        }
                    }
                }
                this.addAllGrid();
            },
            addAllGrid(){
                for(let i=0;i<this.allGridDatas.length;i++){
                    this.initGrid(this.allGridDatas[i]);
                }
            },
            getAllGrid(){
                this.maps.clearMap();
                // console.log(mapJson);
                // this.allPolygonsData = mapJson.data;
                // this.addAllPolygon();
                communicationService.get(utilService.getResourceUrl('/map/grid-polygon'), result => {
                    if(result.state.code == 0) {
                        this.allPolygonsData = result.data;
                        this.addAllPolygon();
                        // console.log(this.allPolygonsData);
                    }
                }, result => {
                    utilService.handleException(result);
                });
                // communicationService.get(utilService.getResourceUrl("/excel/upload-excel-validate?id="+params.row.id), function (result) {
                //     if (result.state.code != 0) {
                //         utilService.handleException(result);
                //     } else {
                //         window.location.href = utilService.getResourceUrl("/excel/upload-excel-export?id="+params.row.id)
                //     }
                    
                // }, function (result) {
                //     utilService.handleException(result);
                // });
            },
            changeComunity(){},
             // 添加网格
            addPolygonGrid(){
                this.isAddOrEdit = 'add';
                if( this.addGridForm.communityId== ''){
                    this.$Message.error("请选择社区！")
                } else {
                    this.addGridPolygon();
                    // addGridPolygon();
                }
            },
            // 编辑网格
            editPolygonGrid(){
                this.isAddOrEdit = 'edit';
                this.editGrid();
            },
            // 完成编辑
            finishEditPolygonGrid(){
                this.editPolygonObj.close();
            },
            // 删除网格
            deletePolygonGrid(){
                let mapVM = this;
                communicationService.remove(utilService.getResourceUrl('/map/grid/'+mapVM.currentPolygonIds), result => {
                    if(result.state.code == 0) {
                        // 删除成功
                        mapVM.$Message.success('删除成功');
                        // this.refreshCrimeList();
                    }
                }, result => {
                    utilService.handleException(result);
                });
            },
            // 完成绘制
            confirmPolygonGrid(){
                this.showAddGridModal = true
            },
            // 提交网格表单信息
            handleAddGrid(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.submitAddGrid();
                    } else {
                        this.$Message.error('请输入完整信息!');
                    }
                })
            },
            // 重置表单
            handleResetGrid(name){
                this.$refs[name].resetFields();
            },
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
                    }
                }, result => {
                    utilService.handleException(result);
                });
            },
            addGridPolygon(){
                let mapVM = this;
                let map = this.maps;
                mapVM.startAddGrid = true;
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
                    // allPointsArr.push(points);
                    mapVM.addGridForm.children.push(onePolygon);
                })
            },
            submitAddGrid(){
                let mapVM = this;
                console.log(mapVM.addGridForm);
                if(mapVM.isAddOrEdit == 'add'){
                    communicationService.post(utilService.getResourceUrl('/map/grid'), mapVM.addGridForm, result => {
                        if(result.state.code == 0) {
                            // 添加成功
                            mapVM.$Message.success('添加成功！');
                            mapVM.getAllPolygon();
                            mapVM.showAddGridModal = false;
                        }
                    }, result => {
                        utilService.handleException(result);
                    });
                }
                // if(mapVM.isAddOrEdit == 'edit'){
                //     communicationService.put(utilService.getResourceUrl('/map/grid/'+mapVM.currentGriddingID), mapVM.addGridForm, result => {
                //         if(result.state.code == 0) {
                //             // 添加成功
                //             mapVM.currentGriddingID = 0;
                //             mapVM.startAddGrid = false;
                //             mapVM.$Message.success('修改成功');
                //             initMapForCrimeList();
                //             mapVM.showAddGridModal = false;
                //         }
                //     }, result => {
                //         utilService.handleException(result);
                //     });
                // }
            },
            editGrid(){
                //构造编辑对象
                let mapVM = this;
                let polygonObjMapForCL = this.allPolygon;
                let map = this.maps;
                console.log(mapVM.currentPolygonIds);
                _.each(polygonObjMapForCL, function (polygonObj, pId) {
                    if (polygonObj.data.id == mapVM.currentPolygonIds) {
                        // polygonObjMapForCL[pId].polygonObj.setOptions({
                        //     strokeOpacity : opacity,
                        //     strokeStyle : strokeStyle
                        // });
                        map.plugin(["AMap.PolyEditor"],function(){
                            mapVM.editPolygonObj = new AMap.PolyEditor(map,polygonObjMapForCL[pId].polygonObj);
                            mapVM.editPolygonObj.open();
                            mapVM.editPolygonObj.on('adjust',()=>{
                                mapVM.showEditGridBtn = true;
                            })
                            mapVM.editPolygonObj.on('end',({type,target})=>{
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
                                // console.log(target.getPath());
                                // mapVM.showAddGridModal = true;
                                // mapVM.addGridForm.name = polygonObjMapForCL[pId].data.gridName;
                                // mapVM.addGridForm.children = {
                                //     id: polygonObjMapForCL[pId].data.id,
                                //     operation: 'M',
                                //     children: JSON.stringify(target.getPath())
                                // }
                            })
                        });
                    }
                });
            }
        },
        mounted(){
            this.initEditMap();
            this.getCommunityData();
            this.getAllGrid();
        }
    }
</script>
<style lang="scss" scoped>
.editMapCon{
    width: 100%;
    height: 100%;
    position: relative;
    .editMaps{
        width: 100%;
        height: 100%;
    }
    .filterArea{
        position: absolute;
        right: 20px;
        top: 20px;
        border-radius: 5px;
        width: 400px;
        overflow: hidden;
        background: rgba(22,115,213,1);
        
        .editGridBtns{
            width: 260px;
            margin: 20px auto;
            .communitySelect{
                width: 260px;
                margin: 20px auto;
            }
            .otherBtn{
                width: 260px;
                margin: 4px auto;
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
        padding : 5px 16px 2px;
    }
}
</style>



