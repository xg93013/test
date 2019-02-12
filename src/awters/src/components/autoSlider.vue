<template>
    <div class="timeline autoSlider" ref="timeline" v-show="display">
        <div class="slider_wrap">
            <el-slider v-model="current" :step="1" :show-stops="true" :min="1" :max="labelList.length" :format-tooltip="timeLineFormat" @change="currentClick"></el-slider>
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
            return value+"月";
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
            this.timer = setInterval(this.intervalFn,3000);
        },
        intervalPause(){
            clearInterval(this.timer);
            this.timer = 0;
        },
        intervalInit(){
            this.current = 1;
            this.intervalPause();
        }
    },
    watch:{
        "current"(nValue,oValue){
            // if (nValue != oValue) {
            //     refreshFeature(this.config.data, true);
            // }
            this.$emit('valueChanged', this.labelList[nValue - 1]);
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
            this.timer = setInterval(this.intervalFn,3000);
        }

        this.$refs.timeline.onmouseenter=()=>{
            this.intervalPause();
        };
        this.$refs.timeline.onmouseleave=()=>{
            this.intervalStart();
        };
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
            .slider_wrap>>>{
                padding 0px 78px
                // position absolute
                // transform translate(0,-50%)
                // top 50%
                width 100%
                .el-slider__stop{
                    background rgba(65,158,255,1)
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
                        color rgba(65,158,255,1)
                        transform scale(1.5)
                    }
                }
            }
        }
    }
</style>
