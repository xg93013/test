<template>
    <div class="pollutionStatistics">
        <div class="title">污染类型智能识别分类</div>
        <div class="legendArea">
            <div :class="['pollutionLegendItem',key+'_item']" v-for="(item,key) in $store.state.sensoryLegend" :key="key">
                <div :class="['intro',key]">
                    <!-- <img :src="'~@/image/'+key+'.png'" alt=""> -->
                    <div :class="['img',key]"></div>
                    <p v-text="item.label"></p>
                </div>
                <div class="statistics">
                    <div class="count icon"><span v-text='config.data[key] ? config.data[key].count : 0'></span> 处</div>
                    <div class="area icon"><span v-text='config.data[key] ? $tools.convertArea(config.data[key].area) : 0'></span> km<sup>2</sup></div>
                    <div class="rate icon"><span v-text='config.data[key] && config.data.total.area ? $tools.convertRate(config.data[key].area/config.data.total.area) : 0'></span> %</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

var vm;

export default {
    data () {
        return {

        }
    },
    props:['config'],
    components : {

    },
    computed:{

    },
    methods:{

    },
    created(){
        vm = this;
    },
    mounted(){
    },
    watch:{
        'config.data':function(v){
            console.log(v)
        }
    }

}



</script>
<style lang="stylus">
    @import "~@/common/common.styl"
    .pollutionStatistics {
        // display flow-root
        .legendArea{
            padding-top 20px
            display flex
            flex-direction row
            justify-content space-around
            .pollutionLegendItem{
                padding 0px 2px
                .intro {
                    cursor pointer 
                    margin 0 auto 20px
                    base(80px,80px)
                    // background-color red
                    .img{
                        margin 0 auto 5px
                        base(55px,55px)
                        +p {
                            color #019dff
                        }
                        &.heichou{
                            background url('~@/image/hc.png') no-repeat
                            background-position 4px
                            &.disabled {
                                background-image url('~@/image/hc_d.png')
                            }
                        }
                        &.lvzao{
                            background url('~@/image/zl.png') no-repeat
                            background-position 0px 6px
                            &.disabled {
                                background-image url('~@/image/zl_d.png')
                            }
                        }
                        &.nisha{
                            background url('~@/image/ns.png') no-repeat
                            background-position 0px 6px
                            &.disabled {
                                background-image url('~@/image/ns_d.png')
                            }
                        }
                    }
                    text-align center
                }
                .statistics{
                    .icon{
                        padding-left 20px
                        margin-bottom 8px
                        // color rgba(1,157,255,1)
                        >span {
                            // color rgba(1,157,255,1)
                        }
                        font-size 18px
                        // font-weight bold
                        background-repeat no-repeat
                        background-position 0px 1px
                    }

                    .count{
                        background-image url('~@/image/number_icon.png');
                        background-position 0px 7px
                    }
                    .area{
                        background-image url('~@/image/area_icon.png');
                        background-position 0px 6px
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
