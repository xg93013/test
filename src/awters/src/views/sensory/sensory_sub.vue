<template>
    <div id="sensory">
        <div class="mapArea">
            <!-- <webMap :config="mapConfig" @featureClick="featureClick" ref="webmap"></webMap> -->
            <webMap3d :config="mapConfig" @featureClick="featureClick" ref="webmap"></webMap3d>
        </div>
        <el-dialog title="水质感官分析" :visible.sync="showDialog" :close-on-click-modal="false">
            <filterPanel filter-type="firstFilterPanel" @cancel="closeInitialFilterWindow" @confirm="startAnalyze"></filterPanel>
        </el-dialog>
        <!-- 切换应用 -->
        <div class="appSelectArea">
            <router-link class="selectItem" to="/situation">水资源</router-link>
            <router-link class="selectItem" to="/sensory_sub">水污染</router-link>
        </div>
        <!-- 搜索 -->
        <auto-search class="riverSearch" @search="doSearch" :data="searchBaseData"></auto-search>
        <div class="rightFilterArea" v-show="!showDialog">
            <div class="rightFilterBtn" @click="showRightFilter = !showRightFilter" v-text="'水污染分析'"></div>
            <filterPanel self-title="水污染分析" filter-type="rightFilterPanel" :style="{transform: showRightFilter?'':'scale(1,0)'}" class="rightFilterPanelLayout" @cancel="showRightFilter=false"  @confirm="startAnalyze"></filterPanel>
        </div>
        <div class="pollutionLegend">
            <template v-for="(item,key) in legendList">
                <div v-text="item.label" :key="key" class="legendItem" :style="{background:mapConfig.colors[key]}"></div>
            </template>
        </div>
        <result-panel class="display_area" ref="resultPanel"></result-panel>
    </div>
</template>

<script>
import webMap from "./sensory_map.vue";
import filterPanel from "./filterPanel.vue";
// import resultPanel from "./resultPanel.vue";
import resultPanel from "./resultPanel_sub.vue";
import autoSearch from '@/components/autoSearch.vue';
import webMap3d from './sensory_map_3d.vue';

import riverDataO from '@/data/data.js';
var riverData = riverDataO;
var pollutionList = ["lak_960","lak_363","lak_792","lak_215","lak_201","lak_605","riv_361"];
var pollutionData = _.filter(_.clone(riverData), function(item, index){
    return _.indexOf(pollutionList, item.id) != -1;
    // return item.pType.length > 0;
})

var opacity = '1',selectedOpacity = '.5';
var colors = {
    hc:`rgba(25,23,43,${opacity})`,
    hc_s:`rgba(25,23,43,${selectedOpacity})`,
    ns:`rgba(154,97,74,${opacity})`,
    ns_s:`rgba(154,97,74,${selectedOpacity})`,
    zl:`rgba(67,226,100,${opacity})`,
    zl_s:`rgba(67,226,100,${selectedOpacity})`,

},
vm;

export default {
    data () {
        return {
            searchBaseData:_.cloneDeep(pollutionData),
            mapConfig:{
                colors,
                list:{},
                data:[]
            },
            showRightFilter:false,
            dialogVis:false
        }
    },
    methods:{
        cancelAnalyze(){
            this.showDialog = false;
        },
        startAnalyze(filter){
            if(this.$refs['resultPanel']){
                this.$refs['resultPanel'].detailClose();
            }
            sensoryAnalyze(filter);
        },
        featureClick(data){
            this.$refs["resultPanel"].getPolllutionDetail(data.id, true);
        },
        doSearch(item){
            sensoryAnalyze(item,true);
        },
        closeInitialFilterWindow(){
            this.showDialog=false;
        }
    },
    components : {
        "webMap":webMap,
        filterPanel,
        resultPanel,
        autoSearch,
        webMap3d
    },
    computed:{
        legendList(){
            this.mapConfig.list = this.$store.state.sensoryLegend;
            return this.$store.state.sensoryLegend;
        },
        showDialog:{
            set(nV){
                this.dialogVis = nV;
            },
            get(){
                // return this.dialogVis && this.$store.state.sensoryFirstAnalyzed;
                return this.dialogVis;
            }
        }
    },
    created(){
        this.showDialog = false;
        // this.$store.commit("refreshFirstAnalyzed",true);
        vm = this;
    },
    mounted () {
        setTimeout(function(){
            vm.showDialog = false;
        }, 1000);
    }
}

// 水质感官分析函数
async function sensoryAnalyze (filterO, isAccurate){
    const loading = vm.$loading({
            lock: true,
            text: '正在分析中...',
            // spinner: 'el-icon-loading',
            spinner: 'analyzing-loading',
            background: 'rgba(0, 0, 0, 0.8)'
        });
    var result = await new Promise(function(resolve, reject){
        // var pollutionList = ["lak_960","lak_363","lak_792","lak_215","lak_201","lak_605","riv_361"];
        setTimeout(() => {
            // var pollutionData = _.filter(_.clone(riverData), function(item, index){
            //     return item.pType.length > 0 && _.indexOf(pollutionList, item.id) != -1;
            //     // return item.pType.length > 0;
            // })
            var filterData;
            if (isAccurate) {
                filterData = _.filter(pollutionData, function(item){
                    return item.id == filterO.id;
                })
            } else {
                filterData = _.filter(pollutionData, function(item){
                    // return filterO.pollutionType.value.indexOf(item.pType) != -1 && filterO.resourceType.value.indexOf(item.type) != -1;
                    // return new Set([...(new Set(filterO.pollutionType.value))].filter(x => new Set(item.pType).has(x))) != 0 && filterO.resourceType.value.indexOf(item.type) != -1;
                    return filterO.resourceType.value.indexOf(item.type) != -1;
                });
            }
            resolve(filterData);
        }, 1000);
    })

    vm.showDialog = false;
    vm.showRightFilter = false;
    loading.close();
    vm.mapConfig.data = result;
    vm.$store.commit("refreshSensoryFilter",filterO);
}
</script>
<style lang="stylus" scoped>
@import "../../common/common.styl"
    #sensory {
        .display_area{
            // position absolute
            left 20px
            top 20px + $headerH
            z-index 1
        }
        position relative
        height: 100%;
        width: 100%;
        .mapArea{
            position absolute
            top 0
            left 0
            z-index 0
            base(100%,100%);
        }
        $searchWidth = 200px
        .riverSearch{
            position absolute
            right 20px
            top 20px + $headerH
            base($searchWidth)
        }
        $btnHeight = 40px;
        $filterPanelWidth = 100px
        .rightFilterArea {
            position absolute
            top 20px + $headerH
            right $searchWidth + 20px*2
            
            
            .rightFilterBtn{
                // position absolute
                base($filterPanelWidth,$btnHeight,$btnHeight)
                float right
                // padding 20px
                text-align center
                cursor pointer
                background-color RGBA(57, 89, 166, 1)
                trans()
                border-radius 4px
                &:hover{
                    background-color RGBA(69, 103, 204, 1)
                }
            }
            .rightFilterPanelLayout{
                trans(,.3s)
                transform-origin top
                // transition-duration .5s
                // background grey
                position absolute
                z-index 1
                right 0px
                top $btnHeight+10px
                // padding 10px
                // base(300px)
            }
        }

        .appSelectArea{
            base(200px)
            position absolute
            top 20px + $headerH
            right $searchWidth+$filterPanelWidth + 20px*3
            .selectItem{
                text-decoration none
                outline none
                base(100px,$btnHeight,$btnHeight)
                float left
                // padding 20px
                text-align center
                cursor pointer
                background-color RGBA(57, 89, 166, 1)
                trans()
                // border-radius 4px
                &:first-child{
                    border-radius 4px 0px 0px 4px
                }
                &:last-child{
                    border-radius 0px 4px 4px 0px
                }
                &:hover,&.active{
                    background-color rgba(69, 103, 204, 1)
                }
            }
        }

        .pollutionLegend{
            position absolute
            right 20px
            bottom 20px
            clf()
            .legendItem{
                padding 10px
                font-size 14px
                float left
            }
        }

        &>>>.el-dialog{
            background transparent
            width 460px
            .el-dialog__header{
                // background-color rgba(49, 49, 122, .8)
                background-color rgba(27, 27, 38, .9)
                
                border-radius 4px 4px 0px 0px
                span {
                    color white
                }
            }
            .el-dialog__body{
                padding 0px
                .filterArea{
                    border-radius 0px 0px 4px 4px
                }
            }
        }
    }
</style>
