<template>
    <div :class="['filterArea',filterType]">
        <div v-show="selfTitle" v-text="selfTitle" style="font-size:20px;margin-bottom:20px;">水污染分析</div>
        <div class="rTypeArea">
            <div class="title" style="margin-top:20px;">水资源类型</div>
            <el-checkbox-group v-model="resourceTypeValue" @change="rTypeChanged">
                <el-checkbox class="checkItem" v-for="(item,key) in filter.resourceType.items" :label="item.label" :key="key"></el-checkbox>
            </el-checkbox-group>
        </div>
        <div>
            <div class="title" style="margin-top:20px;">污染类型</div>
            <el-checkbox-group v-model="pollutionTypeValue" @change="pTypeChanged">
                <el-checkbox class="checkItem" v-for="(item,key) in filter.pollutionType.items" :label="key" :key="key">{{item.label}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="btnArea">
            <el-button @click="cancelAnalyze" size="small" class="btnCommon cancel" style="width:100px">取消</el-button>
            <el-button @click="startAnalyze" size="small"  class="btnCommon start">开始分析</el-button>
        </div>
    </div>
</template>

<script>

export default {
    props:{
        filterType : String,
        selfTitle : String
    },
    data () {
        return {
            districtDisabled:true,
            filter : {
                province : {
                    list :[{value:"sc",label:"**省"}],
                    value : ""
                },
                city : {
                    list :[{value:"cd",label:"**市"}],
                    value : ""
                },
                county : {
                    list :[{value:"gx",label:"**区"}],
                    value : ""
                },
                resourceType : {
                    items : {
                        river : {
                            label : "江河",
                            value : "江河",
                        },
                        lake : {
                            label : "湖泊",
                            value : "湖泊",
                        }
                    },
                    value:["江河","湖泊"]
                },
                pollutionType : {
                    items : {
                        hc : {
                            label : "黑臭水体"
                        },
                        ns : {
                            label : "泥沙污染"
                        },
                        zl : {
                            label : "水体富营养"
                        },
                    },
                    value:["hc","ns","zl"],
                    keys:['hc','ns','zl']
                    
                }
            }
        }
    },
    methods:{
        pTypeChanged(value){
            // this.$store.commit("updateSensoryFilterBus",{pollutionType:value});
        },
        rTypeChanged(value){
            // this.$store.commit("updateSensoryFilterBus",{resourceType:value});
        },
        cancelAnalyze(){
            this.$emit("cancel");
        },
        startAnalyze(){
            this.filter.resourceType.value = this.resourceTypeValue;
            this.filter.pollutionType.value = this.pollutionTypeValue;
            this.$emit("confirm",_.cloneDeep(_.mapKeys(this.filter, function(item,key){
                return key;
            })));
        }
    },
    components : {
    },
    created(){
        this.$store.commit("refreshSensoryLegend",this.filter.pollutionType.items);
        this.startAnalyze();
        // this.filter.resourceType.value = this.$store.state.sensoryFilterBus.resourceType;
        // this.filter.pollutionType.value = this.$store.state.sensoryFilterBus.pollutionType;
    },
    mounted () {
        // console.log(this);
    },
    computed:{
        // resourceTypeValue(){
        //     return this.$store.state.sensoryFilterBus.resourceType;
        // },
        resourceTypeValue:{
            set:function(value){
                this.$store.commit("updateSensoryFilterBus",{resourceType:value});
            },
            get:function(){
                return this.$store.state.sensoryFilterBus.resourceType;
            }
        },
        // pollutionTypeValue(){
        //     return this.$store.state.sensoryFilterBus.pollutionType;
        // },
        pollutionTypeValue:{
            set:function(value){
                this.$store.commit("updateSensoryFilterBus",{pollutionType:value});
            },
            get:function(){
                return this.$store.state.sensoryFilterBus.pollutionType;
            }
        }
    }
}
</script>
<style scoped lang="stylus">
    @import "../../common/common.styl"
    .filterArea{
        padding 20px
        trans();
        base(300px)
        // gradientStyle(top,rgba(27, 27, 38, .9) 80%,rgba(49, 49, 122, .8))
        background-color rgba(27, 27, 38, .9)
        border-radius 4px
        // color red
        // .area{
        //     border-bottom 1px solid rgba(255,255,255,.2)
        // }
        .selectCommon>>>{
            width 120px
            margin-right 10px
            .el-input{
                .el-input__inner{
                    background-color rgba(27, 27, 38, 1)
                    border-color rgba(49, 49, 122, 1)
                    color white
                }
                .el-input__suffix-inner{
                    .el-select__caret{
                        color rgba(70, 159, 202, 1)
                    }
                }
                &.is-focus{
                    .el-input__inner{
                        border-color rgba(69, 103, 204, 1)
                    }
                }

                &.is-disabled{
                    .el-input__inner{
                        background-color: rgba(245,247,250,.2);
                        border-color: rgba(49, 49, 122, .5);
                        color: rgba(192,196,204,.5);
                    }
                    .el-input__suffix-inner{
                        .el-select__caret{
                            color rgba(192,196,204,.5);
                        }
                    }
                }
            }
        }
        &.rightFilterPanel >>>{
            .selectCommon{
                display block
                width 275px
                padding-bottom 15px
                &:last-child{
                    border-bottom 1px solid RGBA(255, 255, 255, .2)
                }
            }
            .el-select{
                display block
            }
            .rTypeArea{
                padding-bottom 20px
                border-bottom 1px solid RGBA(255, 255, 255, .2)
            }
            .checkItem{
                width 50%
                margin 0
            }
        }
        &.firstFilterPanel>>>{
            .selectCommon{
                // display inline-block
            }
        }
        .title{
            margin-bottom 20px
        }
        clf()
        .btnArea{
            margin-top 50px
            float right
            .btnCommon{
                width 100px
                trans()
                border-color transparent
                &.cancel{
                    background-color rgba(57, 89, 166, 1)
                    &:hover{
                        background-color RGBA(69, 103, 204, 1)
                    }
                }
                &.start{
                    background-color rgba(75, 173, 220, 1)
                    &:hover{
                        background-color RGBA(130, 215, 255, 1)
                    }
                }
            }
        }
    }
</style>
