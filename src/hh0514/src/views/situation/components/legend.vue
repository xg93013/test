<template>
    <div class="legendArea">
        <div class="legendItem water" v-if="type === 'pollution'">
            水体
        </div>
        <template v-for="(item) in options">
            <div v-text="item.label" :key="item.value" :style="{background:'rgba('+item.colorRGB+',1)'}" class="legendItem"></div>
        </template>
    </div>
</template>

<script>

var vm;

export default {
    data () {
        return {
            options: []
        }
    },
    props:['type'],
    components : {

    },
    computed:{
    },
    methods:{
    },
    created(){
        vm = this;
        if(this.type === "pollution"){
            this.options = this.$store.state.pollutionLegendOptions;
        } else if (type === "quality") {
            this.options = this.$store.state.qualitiesLegendOptions;
        }
    },
    mounted(){

    },
    watch:{

    }
}



</script>
<style lang="stylus" scoped>
    @import "~@/common/common.styl"
    .legendArea {
        font-size fitPx(14px)
        .legendItem{
            float left
            base(fitPx(80px), fitPx(32px), fitPx(32px))
            text-align center
            // padding fitPx(0px) fitPx(15px)
            &.water{
                background-color rgba(1,157,255,1);
            }
        }
    }
</style>
