<template>
    <div class="barList">
        <div class="title" v-text="config.title || '标题'"></div>
        <div class="bar-list">
            <template v-for="(item, index) in config.data">
                <div class="bar-list-item" :key="index">
                    <el-tooltip :content="item.label" placement="top" :disabled="item.tooltipDisabled" :open-delay="700">
                        <div class="bar-list-item__title bar-list-item__child" v-text="item.label"></div>
                    </el-tooltip>
                    <div class="bar-list-item__bar bar-list-item__child">
                        <el-tooltip class="item" effect="dark" :content="item['value']+''" placement="top" :key='index'>
                            <div class="bar" :style="barStyleRender(item)" @click="itemClick(item)"></div>
                        </el-tooltip>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>

var vm;

export default {
    data () {
        return {
            barClass:'bar',
        }
    },
    props:['config'],
    components : {

    },
    computed:{
        maxValue(){
            return this.config.data[0].value || 0
        }
    },
    methods:{
        barStyleRender:function(item){
            let maxPercent = 80,
                minPercent = 0;
            let tempPercent = minPercent + parseInt(item.value/this.maxValue*(maxPercent-minPercent))
            return {
                width : tempPercent+'%'
            }
        },
        itemClick(params){
            this.$emit('itemClick', {data:params,type:this.config.type});
        }
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
    .barList {
        display flex
        flex-direction column
        .bar-list {
            flex-grow 1
            flex-direction column
            display flex
            padding 10px 20px
            .bar-list-item {
                flex-grow 1
                // font-size: $mainText;
                display flex
                align-items center
                position relative
                base(,10%)
                $barHeight = 12px
                .bar-list-item__child{
                    display inline-block
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    &.bar-list-item__title {
                        base(60px)
                        text-align: right;
                        // position absolute
                        font-size 14px
                    }
                    &.bar-list-item__bar {
                        // border-radius:2px $barHeight $barHeight 2px;
                        border-radius $barHeight
                        margin-left 12px
                        margin-right 20px
                        // background-color #0b0b30
                        flex-grow 1
                        base(,$barHeight,$barHeight)
                        border 1px solid rgba(37, 235, 209,1)
                        // border 1px solid linear-gradient(to right, rgba(20, 162, 236,1),rgba(37, 235, 209,1))
                        // border-image linear-gradient(right, rgba(20, 162, 236,1),rgba(37, 235, 209,1))
                        padding 2px
                        .bar{
                            // background linear-gradient(to right, rgba(20, 162, 236,1),rgba(37, 235, 209,1))
                            base(100%, 100%)
                            // border-radius 2px $barHeight $barHeight 2px
                            border-radius $barHeight
                            color transparent
                            gradientStyle(right, rgba(20, 162, 236,1),rgba(37, 235, 209,1))
                            &:hover {
                                background rgba(37, 235, 209,1)/* rgba(38,129,220,1) */;
                                cursor: pointer;
                            }
                        }
                        .barWithEvent {
                            &:hover {
                                // background:#2681DC/* rgba(38,129,220,1) */;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
