<template>
    <div id="exponextCharts">
        <div class="title">水质感官污染指数</div>
        <div class="chartsArea">
            <div class="charts_background">
                <div class="pointerArea">
                    <div class="pointer" :style="pointerStyle"></div>
                    <div class="pointerBase">
                        <p v-text="$tools.convertExponent(config.water_quality)"></p>
                        <p>指数</p>
                    </div>
                </div>
                <!-- <div class="axias_area">
                    <template v-for="i in 12">
                        <div v-text="((i-1)*1)*10" :key="i" class="axiax_item" :style="{transform:'rotateZ(' + (90/11*(i-1) - 45) +'deg)'}"></div>
                    </template>
                </div> -->
            </div>
        </div>
        <div class="exponentDisply">
            <div class="floatL">
                <div class="numArea">
                    <div v-for="(item,index) in $tools.fitDigit($tools.convertArea(config.pollution_area, 0), 4)" class="num_item" :key="index" v-text="item"></div>
                    <div class="floatL unit"><span class="child">km</span><sup class="child">2</sup></div>
                </div>
                <div>污染面积</div>
            </div>
            <div class="floatR">
                <div class="numArea">
                    <div v-for="(item,index) in $tools.convertRate(config.pollution_area/(config.total_area))" :class="{'num_item':true,'dot':item =='.'}" :key="index" v-text="item"></div>
                    <div class="floatL unit">%</div>
                </div>
                <div>污染占比</div>
            </div>
        </div>
    </div>
</template>

<script>
var vm;


export default {
    data () {
        return {
            currentExponent:65
        }
    },
    props:["config"],
    computed:{
        pointerStyle:function(){
            return {
                transform:`rotateZ(${this.$tools.convertExponent(this.config.water_quality)*.9 - 45}deg)`
            }
        }
    },
    components : {

    },
    methods:{
        rotateZFn(index){
            // return 'rotateZ(' + (9*index - 90) +'deg)';
        }
    },
    created(){
        vm = this;
    },
    mounted(){
    },
    watch:{
    }

}

</script>
<style lang="stylus">
    @import "~@/common/common.styl"
    
    #exponextCharts
        overflow hidden
        base(100%,100%)
        // display flex
        // flex-direction column
        position relative
        .chartsArea
            position relative
            $chartWidth = 297px;
            // base(100%,100%)
            // flex-grow 1
            .charts_background
                transform scale(.9)
                background url('~@/image/dial_plate.png') no-repeat;
                position relative
                base($chartWidth,178px)
                background-color transparent
                margin 0 auto

                .pointerArea
                    position absolute
                    left 50%
                    top 200px
                    $pointerLength = 100px;
                    $pointerBaseD = 78px;
                    .pointerBase
                        // color red
                        base($pointerBaseD,$pointerBaseD)
                        border 7px solid rgba(1,157,255,1)
                        padding-top 8px
                        font-weight bold
                        border-radius 50%
                        transform translate(-50%,-50%)
                        font-size 28.8px
                        text-align center
                        &:after{
                            content ''
                            display block
                            position absolute
                            z-index -1
                            background rgba(1,157,255,1)
                            border-radius 50%
                            base(60px,60px)
                            top 2px
                            left 2px
                        }
                        >p{
                            &:last-child {
                                font-size 14px
                                position relative
                                top -4px
                            }
                        }
                    .pointer
                        $pointerWidth=7px
                        position absolute
                        top - $pointerLength - ($pointerBaseD / 2)
                        left - $pointerWidth
                        border none
                        border-top $pointerWidth solid transparent
                        border-left $pointerWidth solid transparent
                        border-right $pointerWidth solid transparent
                        border-bottom $pointerLength solid rgba(1,157,255,1)
                        transform rotateZ(0deg)
                        transform-origin 50% ($pointerLength + $pointerBaseD / 2)
                        trans()
                        // animation pointerMoving 5s infinite
                    // .axias_area
                    //     $axiasHeight = $chartWidth+80px
                    //     .axiax_item
                    //         position absolute
                    //         base(27px,$axiasHeight)
                    //         // calcM(top,)
                    //         // top -50px
                    //         calcM(top,50%,($axiasHeight/2))
                    //         calcM(left,50%,27px/2)
                    //         text-align center
                    //         font-size 14px
                    //         &:after{
                    //             position absolute
                    //             top 22px
                    //             calcM(left,50%,2.5px)
                    //             content ""
                    //             base(5px,27px)
                    //             background-color red
                    //         }
        .exponentDisply 
            position absolute
            base(90%)
            bottom 34px
            clf()
            .floatR
                margin-right 18px
            .numArea
                clf();
                color rgba(1,157,255,1)
                // font-weight bold
                position relative
                .num_item
                    float left
                    font-size 30px
                    color rgba(1,157,255,1)
                    margin-right 5px
                    text-align center
                    &:not(.dot)
                        base(23px,41px,41px)
                        background-size 100% 100%
                        background url('~@/image/num-bg.png') round

                .unit
                    position absolute
                    bottom 0px
                    font-size 20px
                    font-weight bold
                    color rgba(1,157,255,1)
                    display inline-block
                    .child 
                        color inherit

    @keyframes pointerMoving 
        0%
            transform rotateZ(45deg)
        50%
            transform rotateZ(-45deg)
        100%
            transform rotateZ(45deg)
    


</style>
