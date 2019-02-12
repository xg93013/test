<template>
    <div id="viewDiv">
        <router-view class="viewDiv_router"></router-view>
    </div>
</template>

<script>

export default {
    data () {
        return {
            
        }
    },
    components : {

    },
    mounted () {
    }
}
</script>

<style scoped lang="stylus">
    #viewDiv {
        height: 100%;
        width: 100%;
        .viewDiv_router{
            height: 100%;
            width: 100%;
        }
    }
</style>
