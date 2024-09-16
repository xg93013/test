<template>
    <div id="container-warp">
        <Header />
        <Sidebar />
        <div class="main-container">
            <div class="pad-con" >
                <router-view @closeLoading = "closeLoading" />
            </div>
        </div>
        <div v-show="isLoading" v-loading.lock="isLoading" :element-loading-text="loadingText" element-loading-background="rgba(15,33,80,0.6)" class="backLoading">
        </div>
    </div>
</template>
<script>
import Header from './header';
import Sidebar from './sidebar';
export default {
    components: {
        Header,
        Sidebar
    },
    data (){
        return {
            isLoading: true,
            loadingText: '加载中...'
        }
    },
    created () {
        
    },
    methods: {
        closeLoading(e){
            this.isLoading = e;
        }
    },
    mounted () {},
    watch:{
        $route(){
            this.isLoading = true;
        }
    }
}
</script>
<style lang='scss'>
#container-warp{
    .main-container{
        position: absolute;
        left: 48px;
        right: 0;
        top: 66px;
        bottom: 0;
        overflow: auto;
        .pad-con{
            min-height: 740px;
            min-width: 1580px;
            padding: 25px 15px 15px 15px;
            width: 100%;
            height: 100%;
        }
    }
    .backLoading{
        position: fixed;
        top: 66px;
        left: 48px;
        right: 0;
        bottom: 0;
        z-index: 999;
        .el-loading-spinner .path{
            stroke: #fff;
        }
        .el-loading-text{
            color: #fff;
        }
    }
}
</style>
