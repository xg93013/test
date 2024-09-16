<template>
    <div class="tendency">
        <!-- <webMap :config="mapConfig"></webMap> -->
        <webMap3d :config="mapConfig"></webMap3d>
        <div class="pollutionLegend">
            <template v-for="(item,key) in legendList">
                <div v-text="item.label" :key="key" class="legendItem" :style="{background:mapConfig.colors[key]}"></div>
            </template>
        </div>
    </div>
</template>

<script>
import webMap from "./tendency_map.vue";
import webMap3d from "./tendency_map_3d.vue";

import riverData from '@/data/data.js';
var pollutionList = ["lak_960","lak_363","lak_792","lak_215","lak_201","lak_605","riv_361"];
var pollutionData = _.filter(_.clone(riverData), function(item, index){
    return item.pType.length > 0 && _.indexOf(pollutionList, item.id) != -1;
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
},vm;
export default {
    data () {
        return {
            mapConfig:{
                colors,
                list:{},
                data:riverData
            }
        }
    },
    components : {
        "webMap":webMap,
        webMap3d
    },
    created(){
        vm = this;
    },
    mounted () {
        refreshdata();
    },
    computed:{
        legendList(){
            this.mapConfig.list = this.$store.state.sensoryLegend;
            return this.$store.state.sensoryLegend;
        },
    },
}

async function refreshdata(){
    const loading = vm.$loading({
            lock: true,
            text: '数据加载中...',
            spinner: 'el-icon-loading',
            // spinner: 'analyzing-loading',
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
            // if (isAccurate) {
            //     filterData = _.filter(pollutionData, function(item){
            //         return item.id == filterO.id;
            //     })
            // } else {
                filterData = _.filter(pollutionData, function(item){
                    // return filterO.pollutionType.value.indexOf(item.pType) != -1 && filterO.resourceType.value.indexOf(item.type) != -1;
                    // return new Set([...(new Set(filterO.pollutionType.value))].filter(x => new Set(item.pType).has(x))) != 0 && filterO.resourceType.value.indexOf(item.type) != -1;
                    return item;
                });
            // }
            resolve(filterData);
        }, 1000);
    })

    vm.showDialog = false;
    vm.showRightFilter = false;
    loading.close();
    vm.mapConfig.data = result;
    // vm.$store.commit("refreshSensoryFilter",filterO);
}
</script>
<style scoped lang="stylus">
    .tendency{
        position relative
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
    }
</style>
