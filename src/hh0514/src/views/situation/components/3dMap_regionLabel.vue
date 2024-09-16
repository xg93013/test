<template>
    <div :class="['text_marker',type,isInit?'':'origin']">
        <div class="completion_inner" v-show="type == 'completion'">
            <p v-text="name"></p>
            <p>
                <span>污染指数：</span><span :class="['num','l'+pLevel]" v-text="exponent"></span>
            </p>
        </div>
        <p v-show="type == 'simple'">
            <span :class="['num','l'+pLevel]" v-text="exponent" :style="styleFn()" :title="name"></span>
        </p>
    </div>
</template>

<script>

var vm;

export default {
    data () {
        return {
            pLevel:"",
            isInit:false
        }
    },
    components : {

    },
    computed:{
    },
    methods:{
        styleFn(){
            var baseWidth = 24;
            return  {
                width: baseWidth + this.pLevel * 3 +'px',
                height: baseWidth + this.pLevel * 3 +'px',
                'line-height': baseWidth + this.pLevel * 3 +'px',
                'border-radius': baseWidth + this.pLevel * 3 +'px',
                top: (69 - baseWidth - this.pLevel * 3) / 2 + "px",
                left: (160 - baseWidth - this.pLevel * 3) / 2 + "px",
            }
        }
    },
    created(){
        // this.pLevel = isNaN(this.exponent) ? '' : Math.floor((this.exponent*1)/(25));
        this.pLevel = isNaN(this.exponent) ? '' : (this.exponent*1 <= 30 ? '1' : (this.exponent*1 <= 70 ? '2': '3'));
    },
    mounted(){
        // this.isInit = true;
    },
    watch:{

    }
}



</script>
<style lang="stylus" scoped>
    @import "~@/common/common.styl"
    // #mapContainer{
        .text_marker{
            position relative
            border-radius 4px
            &.origin {
                base(160px,69px);
            }
            &.completion{
                padding 4px
                .completion_inner {
                    border 1px dashed rgba($mainColor, 1)
                    background-color rgba(9, 25, 50, .6)
                    padding 5px
                    border-radius 4px
                }
                font-size 14px
                // background url('~@/image/text_marker_bg.png') round
                background-color rgba(9, 25, 50, .6)
                border 1px solid rgba($mainColor, 1)
                base(175px)
                $tb = 10px;
                $lr = 10px;
                // padding ($tb + 7px) $lr $tb ($lr + 7px)
                &:hover{
                    trans()
                    opacity 0
                }
                p{
                    .num{
                        font-size 20px
                        color rgba(0, 170, 0, 1)
                        font-weight bold
                        &.l1{
                            color rgba(0, 170, 0, 1)
                        }
                        &.l2{
                            color rgba(0, 151, 255,1)
                        }
                        &.l3,&.l4{
                            color rgba(255,0,0,1)
                        }
                    }
                }
            }
            &.simple{
                p{
                    // top 50% - 
                    // left 50%
                    .num{
                        position absolute
                        display block
                        text-align center
                        font-size 16px
                        background-color rgba(1, 157, 255, 1)
                        // font-weight bold
                        &.l1{
                            background-color rgba(0, 153, 68,1)
                        }
                        &.l2{
                            background-color rgba(126, 107, 90,1)
                        }
                        &.l3,&.l4{
                            background-color rgba(230,0,18,1)
                        }
                        
                    }
                }
            }
        }
    // }
</style>
