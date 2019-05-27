<template>
    <div class="pollutionStatistics">
        <div class="title">污染类型智能识别分类<span v-show="listDisplay" class="backBtn" @click="listDisplay=false">返回</span></div>
        <div class="legendArea" v-show="!listDisplay">
            <div :class="['pollutionLegendItem',key+'_item']" v-for="(item,key) in $store.state.sensoryLegend" :key="key" @click="showList(key)">
                <div :class="['intro',key]">
                    <!-- <img :src="'~@/image/'+key+'.png'" alt=""> -->
                    <div :class="['img',key]"></div>
                    <p v-text="item.label"></p>
                </div>
                <div class="statistics">
                    <div class="count icon"><span v-text='config.data[key] ? config.data[key].num : 0'></span> 处</div>
                    <div class="area icon"><span v-text='config.data[key] ? $tools.convertArea(config.data[key].area) : 0'></span> km<sup>2</sup></div>
                    <div class="rate icon"><span v-text='config.data[key] ? config.data[key].ratio : 0'></span></div>
                </div>
            </div>
        </div>
        <div v-show="listDisplay" style="flex:1;display:flex;">
            <g-table :options="tableConfig"></g-table>
        </div>
    </div>
</template>

<script>
import gTable from "@/components/gTable.vue";
import apis from "@/util/apis.js";

const {
    WATER_POLLUTION
} = apis

var _this;

export default {
    data () {
        return {
            currentKey : '',
            listDisplay:false,
            tableConfig:{
                // url:'/getWaterResourceData',
                // title:"水资源列表",
                data:[],
                // maxHeight: '100%',
                maxHeight: 215,
                // height: '100%',
                columns:[],
                rowClick:(row, event, column) => {
                    this.$emit("itemClick",{type:'pollution',data:row});
                    // this.detailPanelDisplay = false;
                },
                renderHeader(h, param){
                    if (param.column.property == "area") {
                        return h("span",[param.column.label,h('span',["(km"]),h('sup',["2"]),")"],{
                            // attrs : {
                            //     class : "cell"
                            // }
                        });
                    }
                    return param.column.label;
                },
            }
        }
    },
    props:['config'],
    components : {
        gTable
    },
    computed:{

    },
    methods:{
        showList(key){
            this.tableConfig.data = [];
            if (this.$store.state.view.bigScreen) {
            } else {
                this.listDisplay = true;
            }
            
            let params = {...this.config.params}
            if(params.pType){
                let typeArr = params.pType.split(',');
                if(typeArr.includes(key)){
                    params.pType = key;
                    this.getTableData(params);
                } else {
                    this.tableConfig.data = [];
                }
            } else {
                params.pType = key;
                this.getTableData(params);
            }
            this.currentKey = key;           
        },
        async getTableData(params){
            let res = '';
            res = await this.$http.get(WATER_POLLUTION, params);
            if(res && res.data){
                this.tableConfig.data = res.data;
            } else {
                this.tableConfig.data = [];
            }
        }
    },
    created(){
        
        this.tableConfig.columns = [{
                        key:"name",
                        label:"水资源名称",
                        // width:"fitPx(82px)",
                    },{
                        key:"position",
                        label:"污染位置",
                        formatter(row, column, cellValue, index){
                            return cellValue ? cellValue.toString() : "--";
                        }
                    },{
                        key:"area",
                        label:"污染面积",
                        width:(()=>{return `${110 * (this.$store.state.view.bigScreen ? 4: 1)}px`})(),
                        // width:'440px',
                        formatter(row, column, cellValue, index){
                            return _this.$tools.convertArea(cellValue);
                        }
                    },{
                        key:"pollution_score",
                        label:"污染指数",
                        // width:"fitPx(50px)",
                        // formatter(row, column, cellValue, index){
                        //     return _this.$tools.convertExponent(cellValue);
                        // }
                    }
                ];
        _this = this;
    },
    mounted(){
    },
    watch:{
        'config.data':function(v){
            if (this.$store.state.view.bigScreen) {
                this.showList(Object.keys(this.$store.state.sensoryLegend)[0]);
                this.currentKey = Object.keys(this.$store.state.sensoryLegend)[0];
            } else {
                this.listDisplay = false;
            }
        }
    }

}



</script>
<style lang="stylus" scoped>
    @import "~@/common/common.styl"
    .pollutionStatistics {
        display flex
        flex-direction column
        .backBtn {
            float right
            color rgba($mainColor,1)
            font-size fitPx(16px)
            text-decoration underline
            text-underline-position under
            cursor pointer
        }
        .legendArea{
            flex 1
            padding-top fitPx(20px)
            display flex
            flex-direction row
            justify-content space-around
            .pollutionLegendItem{
                cursor pointer
                padding fitPx(0px) fitPx(2px)
                .intro {
                    margin 0 auto fitPx(20px)
                    base(fitPx(80px),fitPx(80px))
                    // background-color red
                    .img{
                        margin 0 auto fitPx(5px)
                        base(fitPx(55px),fitPx(55px))
                        +p {
                            color rgba($mainColor, 1)
                        }
                        background-size contain !important
                        &.heichou{
                            background url('~@/image/hc.png') no-repeat
                            background-position fitPx(4px)
                            &.disabled {
                                background-image url('~@/image/hc_d.png')
                            }
                        }
                        &.lvzao{
                            background url('~@/image/zl.png') no-repeat
                            background-position fitPx(0px) fitPx(6px)
                            &.disabled {
                                background-image url('~@/image/zl_d.png')
                            }
                        }
                        &.nisha{
                            background url('~@/image/ns.png') no-repeat
                            background-position fitPx(0px) fitPx(6px)
                            &.disabled {
                                background-image url('~@/image/ns_d.png')
                            }
                        }
                    }
                    text-align center
                }
                .statistics{
                    .icon{
                        padding-left fitPx(25px)
                        margin-bottom fitPx(8px)
                        // color rgba(1,157,255,1)
                        >span {
                            // color rgba(1,157,255,1)
                        }
                        font-size fitPx(18px)
                        // font-weight bold
                        background-repeat no-repeat
                        background-position fitPx(0px) fitPx(1px)
                        background-size fitPx(16px) fitPx(16px)
                    }

                    .count{
                        background-image url('~@/image/number_icon.png');
                        background-position fitPx(0px) fitPx(5px)
                    }
                    .area{
                        background-image url('~@/image/area_icon.png');
                        background-position fitPx(0px) fitPx(6px)
                        sup{
                            color inherit
                        }
                    }
                    .rate{
                        background-image url('~@/image/rate_icon.png');
                    }
                }
            }
        }
    }
</style>
