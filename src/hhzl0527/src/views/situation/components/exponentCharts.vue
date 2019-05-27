<template>
    <div id="exponextCharts">
        <div class="title">水质感官污染指数</div>
        <div class="chartsArea">
            <div class="charts_background">
                <div class="pointerArea">
                    <div class="pointer" :style="pointerStyle"></div>
                    <div class="pointerBase">
                        <p v-text="config.water_quality"></p>
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
                    <div v-for="(item,index) in $tools.fitDigit($tools.convertArea(config.pollution_area, true, 4), 4)" :class="{'num_item':true,'dot':item =='.'}" :key="index"><span v-text="item"></span></div>
                    <div class="floatL unit"><span class="child">{{config.pollution_area >= 1e4 ? `km` : 'm'}}</span><sup class="child">2</sup></div>
                </div>
                <div>污染面积</div>
            </div>
            <div class="floatR">
                <div class="numArea">
                    <div v-for="(item,index) in config.ratio" :class="{'num_item':true,'dot':item =='.'}" :key="index"><span v-text="item">0.00</span></div>
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
                transform:`rotateZ(${this.config.water_quality*.9 - 45}deg)`
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
        .title{
            margin fitPx(2px) !important
        }
        .chartsArea
            position relative
            $chartWidth = fitPx(297px);
            // base(100%,100%)
            // flex-grow 1
            .charts_background
                transform scale(.9)
                background url('~@/image/dial_plate.png') no-repeat;
                position relative
                base($chartWidth,fitPx(178px))
                background-color transparent
                margin 0 auto

                .pointerArea
                    $pointerColor = 11, 56, 86
                    position absolute
                    left 50%
                    top fitPx(200px)
                    $pointerLength = fitPx(100px);
                    $pointerBaseD = fitPx(78px);
                    .pointerBase
                        // color red
                        base($pointerBaseD,$pointerBaseD)
                        border fitPx(7px) solid rgba($pointerColor,1)
                        padding-top fitPx(8px)
                        font-weight bold
                        border-radius 50%
                        transform translate(-50%,-50%)
                        font-size fitPx(28.8px)
                        text-align center
                        &:after{
                            content ''
                            display block
                            position absolute
                            z-index -1
                            background rgba($pointerColor,1)
                            border-radius 50%
                            base(fitPx(60px),fitPx(60px))
                            top fitPx(2px)
                            left fitPx(2px)
                        }
                        >p{
                            &:last-child {
                                font-size fitPx(14px)
                                position relative
                                top fitPx(-4px)
                            }
                        }
                    .pointer
                        $pointerWidth=fitPx(7px)
                        position absolute
                        top - $pointerLength - ($pointerBaseD / 2)
                        left - $pointerWidth
                        border none
                        border-top $pointerWidth solid transparent
                        border-left $pointerWidth solid transparent
                        border-right $pointerWidth solid transparent
                        border-bottom $pointerLength solid rgba($pointerColor,1)
                        transform rotateZ(0deg)
                        transform-origin 50% ($pointerLength + $pointerBaseD / 2)
                        trans()
                        // animation pointerMoving 5s infinite
                    // .axias_area
                    //     $axiasHeight = $chartWidth+fitPx(80px)
                    //     .axiax_item
                    //         position absolute
                    //         base(fitPx(27px),$axiasHeight)
                    //         // calcM(top,)
                    //         // top fitPx(-50px)
                    //         calcM(top,50%,($axiasHeight/2))
                    //         calcM(left,50%,fitPx(27px)/2)
                    //         text-align center
                    //         font-size fitPx(14px)
                    //         &:after{
                    //             position absolute
                    //             top fitPx(22px)
                    //             calcM(left,50%,2.fitPx(5px))
                    //             content ""
                    //             base(fitPx(5px),fitPx(27px))
                    //             background-color red
                    //         }
        .exponentDisply 
            position absolute
            base(90%)
            bottom fitPx(34px)
            clf()
            .floatR
                margin-right fitPx(18px)
            .numArea
                clf();
                color rgba($mainColor,1)
                // font-weight bold
                position relative
                .num_item
                    float left
                    font-size fitPx(30px)
                    color rgba($mainColor,1)
                    text-align center
                    position relative
                    >span {
                        position relative
                        z-index 1
                        color inherit
                    }
                    &:not(.dot)
                        margin-right fitPx(5px)
                        base(fitPx(23px),fitPx(41px),fitPx(41px))
                        background-size 100% 100%
                        &:after, &:before {
                            position absolute
                            left 0
                            content ''
                            base(100%)
                            calcM(height, 50%, @margin-right / 2)
                            background rgba(27, 39, 53, 1)
                            z-index 0
                        }
                        &:before {
                            top 0
                        }
                        &:after {
                            bottom 0
                        }
                        // background url('~@/image/num-bg.png') round
                    &.dot 
                        margin-left fitPx(-5px)

                .unit
                    position absolute
                    bottom fitPx(0px)
                    font-size fitPx(20px)
                    font-weight bold
                    color rgba($mainColor,1)
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
