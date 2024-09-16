<template>
    <div id="riskMap">
        <div class="leftFilter">
        	<!--左侧筛选-->
            <div class="left-search">
                <el-input v-model="leftFilter.keyWork" placeholder="请输入要查询的企业名称" class="leftInput float-item"></el-input>
                <el-button type="primary" icon="el-icon-search" width="40" class="leftBtn float-item" @click="keyWorkSearch"></el-button>
            </div>
            <div class="left-list">
                <div class="head">TOP10</div>
                <div class="item-box">
                    <div class="item" v-for="(item,index) in leftList" :key="index" @click="selectTopItem(item)">
                        <div class="left">
                            <span class="inItem">{{item.name}}</span>
                            <span class="inItem">所属区域：{{item.area}}</span>
                            <span class="inItem">{{item.address}}</span>
                        </div>
                        <div class="right">
                            <el-progress type="circle" :percentage="Number(item.percent)" :width="60"></el-progress>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
        <!--右侧筛选-->
        <div class="rightFilter">
            <div class="select-box">
                <DateSelect @timeChange="timeChange" :platFormType="timeType"></DateSelect>
                <el-select v-model="rightFilter.selectArea" placeholder="请选择区域" @select="areaSelect">
                    <el-option
                    v-for="item in rightFilter.areaList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="rightFilter.selectRange" placeholder="请选择" @select="rangeSelect">
                    <el-option
                    v-for="item in rightFilter.rangeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="rightFilter.selectProject" placeholder="请选择" @select="projectSelect">
                    <el-option
                    v-for="item in rightFilter.projectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="color-range">
                <span class="item" @click="selectLevel(1)"></span>
                <span class="item" @click="selectLevel(2)"></span>
                <span class="item" @click="selectLevel(3)"></span>
                <span class="item" @click="selectLevel(4)"></span>
                <span class="item" @click="selectLevel(5)"></span>
            </div>
        </div>
        <div class="centerMap" id="centerMap"></div>
        <!--左侧弹信息-->
        <div class="topModal" v-show="showTopModal" id="mouseModal">
            <div class="close" @click="closeModal">X</div>
            <div class="title">概况描述</div>
            <div class="infobox">
                <p class="leftTitle">基本信息</p>
                <div class="right">
                    <div class="items">
                    	<p class="name">企业名称：</p>
                    	<div class="texts">{{modalInfo.enterpriseName}}</div>
                    </div>
                    <div class="items">
                    	<p class="name">所属区域：</p>
                    	<div class="texts">{{modalInfo.area}}</div>
                    </div>
                    <div class="items">
                    	<p class="name">企业地址：</p>
                    	<div class="texts">{{modalInfo.address}}</div>
                    </div>
                    <div class="items">
                        <p class="name">资质许可:</p>
                        <div class="img-pos">
                            <p><img src="" /></p>
                            <p>营业执照</p>
                        </div>
                        <div class="img-pos">
                            <p><img src="" /></p>
                            <p>食品经营许可证</p>
                        </div>
                        <div class="img-pos">
                            <p><img src="" /></p>
                            <p>xxxx证</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="infobox">
                <div class="other-left">
                    <p class="level">A</p>
                    <p>监管等级：{{modalInfo.level}}</p>
                    <p>本期得分：{{modalInfo.score}}</p>
                    <p>建议调整得分至{{modalInfo.toScore}}</p>
                </div>
                <div class="other-right">
                	<div class="items">
                		<p class="name">网络餐饮数据:</p>
                		<div class="texts">{{modalInfo.updatetime}}</div>
                	</div>
                    <div class="items">
                    	<p class="name">明厨亮灶数据:</p>
                		<div class="texts">接入时间{{modalInfo.updatetime}}<a href="#">查看视频</a></div>
                	</div>
                    <div class="items">
                    	<p class="name">食材溯源数据:</p>
                		<div class="texts">暂未接入</div>
                    </div>
                    <div class="items">
                    	<p class="name">餐厨垃圾数据:</p>
                		<div class="texts">数据最近更新日期{{modalInfo.updatetime}}</div>
                    </div>
                    <div class="items">
                    	<p class="name">监督抽检数据:</p>
                		<div class="texts">数据最近更新日期{{modalInfo.updatetime}}</div>
                    </div>
                    <div class="items"></div>
                </div>
                <div class="other-links">
                	<router-link :to="{path: ''}" tag="span">查看更多详细数据</router-link>
                </div>
            </div>
        </div>
        <!-- 弹窗-->
        <!-- <Modal
            v-model="showTopModal"
            title=""
            width="500"
            class-name="mapTopModal"
            >
            <div class="topModal">
                <div class="close" @click="closeModal">X</div>
                <div class="title">概况描述</div>
                <div class="infobox">
                    <p class="leftTitle">基本信息</p>
                    <div class="right">
                        <div class="items">企业名称:</div>
                        <div class="items">企业名称:</div>
                        <div class="items">企业名称:</div>
                        <div class="items">
                            <p class="name">资质许可:</p>
                            <div class="img-pos">
                                <p><img src="" /></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="infobox">
                    <div class="other-left"></div>
                    <div class="other-right"></div>
                </div>
            </div>
        </Modal> -->
        <!-- <el-dialog :visible.sync="showTopModal" width="500px" custom-class="topModal">
            <div>
                <p class="title">概况描述</p>

            </div>
        </el-dialog> -->
    </div>
</template>
<script>
import DateSelect from '@/components/DateSelect/DateSelect.vue'
import AMap from 'AMap'
export default {
    components: {
        DateSelect
    },
    data () {
        return{
        	timeType: '',
            maps: '',
            leftFilter: {
                keyWork: ''
            },
            rightFilter: {
                selectArea: '',
                selectRange: '',
                selectProject: '',
                areaList: [{
                    value: '成都市',
                    label: '成都市'
                }],
                rangeList: [{
                    value: '全部',
                    label: '全部'
                }],
                projectList: [{
                    value: '',
                    label: ''
                }]
            },
            riskLevel: '',
            leftList: [], // top10列表
            mapDatas: {
                finishInit: false,
                markers: {}
            },
            totalDatas: [],
            showTopModal: false,
            modalInfo: {
                enterpriseName: '成都大风炊餐饮管理有限责任公司',
                area: '金牛区-XX街道',
                address: '成都市金牛区马家花园路2号1-2楼',
                imgs: [{
                    path: 'paths',
                    title: '营业执照'
                }],
                riskLevel: 'A',
                score: '98',
                toScore: '88',
                updatetime: '2017-10-20'
            }
        }
    },
    created(){
    	this.timeType = 'others';
    },
    methods: {
        initMap(){
            this.maps = new AMap.Map('centerMap', {
                resizeEnable: true, //是否监控地图容器尺寸变化
                zoom:11, //初始化地图层级
                center: [116.397428, 39.90923] //初始化地图中心点
            });
            this.mapDatas.finishInit = true;
            this.maps.on('click',()=>{
                this.showTopModal = false;
            })
        },
        timeChange(e){
            console.log(e);
        },
        selectLevel(level){
            this.riskLevel = level
        },
        getLeftList(){
            for(let i=0;i<2;i++){
                this.leftList.push({
                    name: '成都大风炊餐饮管理有限责任公司',
                    address: '金牛区-XX街道',
                    area: '金牛区',
                    percent: '10'
                })
            }
        },
        getTotalDatas(){
            this.totalDatas = [{
                id: '1',
                lng: '116.397428',
                lat: '39.90923',
                riskLevel: 1,
                title: '',
                name: ''
            }];
            this.addMapMarks(this.totalDatas);
        },
        getModalInfo(){
        	this.modalInfo = {
                enterpriseName: '成都大风炊餐饮管理有限责任公司',
                area: '金牛区-XX街道',
                address: '成都市金牛区马家花园路2号1-2楼',
                imgs: [{
                    path: 'paths',
                    title: '营业执照'
                }],
                riskLevel: 'A',
                score: '98',
                toScore: '88',
                updatetime: '2017-10-20'
            }
        },
        keyWorkSearch(){
            this.getLeftList();
            this.getTotalDatas();
            this.addMapMarks(this.totalDatas);
        },
        areaSelect(){},
        rangeSelect(){},
        projectSelect(){},
        addMapMarks(data){
            let maps = this.maps;
            if(!this.mapDatas.finishInit) {
                return;
            }
            // 删除地图上已经存在的点
            if(!_.isEmpty(this.mapDatas.markers)) {
                maps.remove(_.map(this.mapDatas.markers, function(markerItem) {
                    markerItem.setMap(null);
                    return markerItem;
                }));
                // 清空保存点对象
                this.mapDatas.markers = {};
            }
            _.map(data, (item,index)=>{
                let marker = new AMap.Marker({
                    map: maps,
                    title: item.title,
                    extData: {

                    },
                    position: new AMap.LngLat(item.lng, item.lat),
                    icon: require('../../images/float-1.png'),
                    offset: new AMap.Pixel(-13, -30)
                });
                marker.on('click', (e)=>{
                    console.log(e);
                })
                this.mapDatas.markers[item.id] = marker;
            })
        },
        selectTopItem(item){
            console.log(item);
            this.showTopModal = true;
        },
        closeModal(){
            this.showTopModal = false;
        }
    },
    mounted () {
        this.$emit('closeLoading');
        this.initMap();
        this.getLeftList();
        // document.getElementById('mouseModal').addEventListener('mouseleave',(e)=>{
        //     this.showTopModal = false;
        // })
    }
}
</script>
<style lang="scss" scoped>
#riskMap{
    position: relative;
    width: 100%;
    height: 100%;
    .centerMap{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 99;
    }
    .leftFilter{
        .left-search{
            position: absolute;
            top: 50px;
            left: 50px;
            width: 300px;
            overflow: hidden;
            z-index: 999;
            .float-item{
                float: left;
            }
            .leftInput{
                width: 220px;
            }
            .leftBtn{
                width: 36px;
                height: 36px;
                padding: 0;
                text-align: center;
            }
        }
        .left-list{
            position: absolute;
            top: 100px;
            left: 50px;
            bottom: 50px;
            z-index: 999;
            .head{
                width: 300px;
                height: 50px;
                line-height: 50px;
                padding: 0 10px;
                // box-sizing: border-box;
                background: #fff;
                border-bottom: 1px solid #eee;
            }
            .item-box{
                position: absolute;
                top: 50px;
                left: 0;
                bottom: 0;
                width: 300px;
                // padding: 0 5px;
                overflow: auto;
                .item{
                    // width: 100%;
                    // padding: 5px;
                    font-size: 14px;
                    color: #333;
                    background: #fff;
                    overflow: hidden;
                    cursor: pointer;
                    .left{
                        width: 220px;
                        float: left;
                        padding: 16px;
                        box-sizing: border-box;
                        .inItem{
                            width: 100%;
                            display: block;
                        }
                    }
                    .right{
                        width: 60px;
                        float: left;
                        margin-top: 16px;
                    }
                    &:hover{
                        background: #f5f5f5;
                    }
                }
            }
            
        }
    }
    .rightFilter{
        position: absolute;
        right: 50px;
        top: 50px;
        z-index: 999;
        .color-range{
            position: absolute;
            right: 0;
            top: 100px;
            width: 20px;
            .item{
                width: 100%;
                height: 20px;
                background: #999;
                display: block;
                cursor: pointer;
                &:nth-child(1){
                    background: #333;
                }
                &:nth-child(2){
                    background: #666;
                }
                &:nth-child(3){
                    background: #999;
                }
                &:nth-child(4){
                    background: #ccc;
                }
            }
        }
    }
    .topModal{
        position: absolute;
        width: 600px;
        top: 100px;
        left: 360px;
        z-index: 999;
        background: #f5f5f5;
        .title{
            width: 100%;
            text-align: center;
            padding: 15px 0;
        }
        .infobox{
            width: 560px;
            background: #fff;
            margin: 0 20px 20px;
            padding: 30px 0;
            overflow: hidden;
            .leftTitle{
                width: 26px;
                text-align: center;
                float: left;
                margin: 20px 10px 0 20px;
            }
            .right{
                width: 500px;
                float: left;
                .items{
                    width: 100%;
                    overflow: hidden;
                    margin: 10px 0;
                    font-size: 16px;
                    .name{
                    	width: 75px;
                        float: left;
                    }
                    .texts{
                    	width: 400px;
                    	float: left;
                    }
                    .img-pos{
                        float: left;
                        text-align: center;
                        margin:0 10px;
                    }
                }
            }
            .other-left{
                width: 150px;
                text-align: center;
                float: left;
                .level{
                    width: 60px;
                    height: 60px;
                    background: #999;
                    line-height: 60px;
                    border-radius: 50%;
                    margin: 20px auto 10px;
                }
            }
            .other-right{
                width: 410px;
                float: left;
                .items{
                	width: 100%;
                    overflow: hidden;
                    margin: 10px 0;
                    font-size: 16px;
                    .name{
                    	width: 100px;
                        float: left;
                    }
                    .texts{
                    	width: 300px;
                    	float: left;
                    }
                }
            }
            .other-links{
            	width: 100%;
            	span{
            		float: right;
            		margin: 10px 20px 0 0;
            	}
            }
        }
        .close{
            position: absolute;
            right: 0;
            top: 0;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
        }
    }
}

</style>
<style lang="scss">
#riskMap{
    .el-input__inner{
    	width: 180px;
        background-color: #f5f5f5;
        border: none;
        height: 36px;
        line-height: 36px;
        border-radius: 2px;
    }
    .leftInput{
    	.el-input__inner{
    		width: 100%;
    	}
    }
    
}
</style>
