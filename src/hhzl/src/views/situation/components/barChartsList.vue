<template>
    <div class="barList">
        <div class="title" v-text="config.title || '标题'"></div>
        <div class="bar-list">
            <template v-for="(item, index) in config.data">
                <div class="bar-list-item" :key="index">
                    <el-tooltip :content="item.label" placement="top" :disabled="item.tooltipDisabled" :open-delay="700" :enterable="false">
                        <div class="bar-list-item__title bar-list-item__child" :class="[config.type == 'pollution' ? 'pollution' :'']" v-text="config.type == 'pollution' ? item.label + '('+ $store.state.pTypeRender(item.type) + ')' : item.label"></div>
                    </el-tooltip>
                    <div class="bar-list-item__bar bar-list-item__child">
                        <el-tooltip class="item" effect="dark" :content="barItemTooltip(item)" placement="top" :key='index' :enterable="false">
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
            popperOptions : {
                boundariesElement : 'scrollParent',
                // gpuAcceleration: true
            }
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
        },
        barItemTooltip(item){
            var divS = document.createElement('div');
            if (this.config.type == 'pollution') {
                divS = `污染指数：${item['value']} \n污染位置：${item.loca}`;
            } else if (this.config.type == 'region_index') {
                divS = `区县名称：${item.label} \n丰富指数：${item['value']}`;
            } else {
                divS = `区县名称：${item.label} \n污染指数：${item['value']}`;
            }
            return divS;
        }
    },
    created(){
        vm = this;
    },
    mounted(){
    },
    watch:{
        'config.data':function(v){
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
            padding fitPx(10px) fitPx(0px)
            .bar-list-item {
                flex-grow 1
                // font-size: $mainText;
                display flex
                align-items center
                position relative
                base(,10%)
                $barHeight = fitPx(12px)
                .bar-list-item__child{
                    display inline-block
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    &.bar-list-item__title {
                        base(fitPx(60px))
                        text-align right
                        // position absolute
                        font-size fitPx(14px)
                        &.pollution {
                            width fitPx(120px)
                        }
                    }
                    &.bar-list-item__bar {
                        // border-radius:fitPx(2px) $barHeight $barHeight fitPx(2px);
                        border-radius $barHeight
                        margin-left fitPx(12px)
                        margin-right fitPx(10px)
                        // background-color #0b0b30
                        flex-grow 1
                        base(,$barHeight,$barHeight)
                        border fitPx(1px) solid rgba(12, 59, 79, 1)
                        padding fitPx(2px)
                        .bar{
                            base(100%, 100%)
                            border-radius $barHeight
                            color transparent
                            gradientStyle(right, rgba(19, 150, 219,1),rgba(37, 235, 209,1))
                            &:hover {
                                background rgba(37, 235, 209,1)/* rgba(38,129,220,1) */;
                                cursor: pointer;
                            }
                        }
                        .barWithEvent {
                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
