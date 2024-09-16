<template>
    <div class="timeline autoSlider" ref="timeline" v-show="display">
        <div class="slider_wrap">
            <div class="slider_tip" :style="{left:`${(1000-78*2)/10/(labelList.length-1)*(current-1)}%`}">
                <div class="slider_tip_inner">
                    <template v-for="(item,index) in labelList[current-1].toolTip">
                        <div :key="index">
                            <span v-text="item.label+'：'" class="slider_title"></span>
                            <span v-text="labelList[current-1].value || item.value" class="content"></span>
                        </div>
                    </template>
                </div>
            </div>
            <el-slider v-model="current" :step="1" :show-stops="true" :min="1" :max="labelList.length" :show-tooltip="false" @change="currentClick"></el-slider>
        </div>
        <div class="label_area">
            <template v-for="(item,key) in labelList">
                <span v-text="item.label" :key="key" :class="{selected:item==current}" @click="currentClick(key*1 + 1)"></span>
            </template>
            <!-- <span v-for="item in 6" v-text="'2018年'+item+'月'" :key="item" :class="{selected:item==current}" @click="currentClick(item)"></span> -->
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            current:1,
            timer:0,
            init : true
        }
    },
    props:{
        min:{},
        max:{},
        labelList:{
            type: Array
        },
        display:{
            type: Boolean,
            default: true
        }
    },
    components : {

    },
    methods:{
        timeLineFormat(value){
            // return this.labelList[value-1].label
        },
        currentClick(value){
            this.current = value;
        },
        intervalFn () {
            
            if(this.current<this.labelList.length){
                this.current++
            }else{
                this.current=1
            }
        },
        intervalStart(){
            clearInterval(this.timer);
            this.$emit('valueChanged', this.labelList[0], this.init);
            this.init = false;
            this.timer = setInterval(this.intervalFn, 3000);
        },
        intervalPause(){
            clearInterval(this.timer);
            this.timer = 0;
        },
        intervalInit(){
            this.init = true;
            this.current = 1;
            this.intervalPause();
        }
    },
    watch:{
        "current"(nValue,oValue){
            // if (nValue != oValue) {
            //     refreshFeature(this.config.data, true);
            // }
            this.$emit('valueChanged', this.labelList[nValue - 1], this.init);
        },
        "display"(nValue,oValue){
            if (nValue) {
                this.intervalStart();
            } else {
                this.intervalInit();
            }
        }
    },
    mounted () {
        if (this.display) {
            this.intervalStart();
        }

        this.$refs.timeline.onmouseenter=()=>{
            this.intervalPause();
        };
        this.$refs.timeline.onmouseleave=()=>{
            this.intervalStart();
        };
        this.$root.$on('togglePlayStatus', (param) => {
            switch (param) {
                case 'start' :
                    this.intervalStart();
                    break;
                case 'pause' :
                    this.intervalPause();
                    break;
                case 'init' :
                    this.intervalInit();
                    break;
            }
        });
    },
    beforeDestroy(){
        this.intervalInit();
    },
    created(){

    }
}


</script>
<style scoped lang="stylus">
    @import "../common/common.styl";
    .autoSlider {
        &.timeline{
            background rgba(0,0,0,.8)
            border-radius 50px

            base(1000px)
            
            bottom 20px
            padding 15px 0
            // box-shadow 0px 0px 40px 10px rgba(0,0,0,1)
            $sliderPad = 78px;
            .slider_wrap>>>{
                padding 0px $sliderPad
                position relative
                // transform translate(0,-50%)
                // top 50%
                width 100%
                .el-slider__stop{
                    background rgba(1, 255, 255,1)
                }
                .el-slider__bar {
                    background rgba(1, 255, 255,1)
                }
                .el-slider__button-wrapper {
                    .el-slider__button.el-tooltip {
                        border-color rgba(1, 255, 255,1)
                    }
                }
                .slider_tip {
                    // base(100px, 61.8px)
                    background url('')
                    position absolute
                    background-color rgba(9, 25, 50, .6)
                    border 1px solid rgba(1, 255, 255, 1)
                    // top -54px
                    bottom 40px
                    left 0%
                    // trans()
                    padding 2px
                    transform translateX(calc(78px - 50%))
                    .slider_tip_inner {
                        border 1px dashed rgba(1, 255, 255, 1)
                        background-color rgba(9, 25, 50, .6)
                        padding 10px
                        base(100%, 100%)
                        white-space nowrap
                        .slider_title{

                        }
                        .content {
                            font-size 20px
                            color rgba(1, 255, 255, 1)
                        }
                    }
                }
            }
            .label_area{
                >span{
                    width (100%/6)
                    display inline-block
                    text-align center
                    trans()
                    &:hover,&.selected{
                        cursor pointer
                        color rgba(1,255,255,1)
                        transform scale(1.5)
                    }
                }
            }
        }
    }
</style>
