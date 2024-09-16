<template>
    <div :id="[$store.state.view.bigScreen ? 'app_big' : (notebook_f ? 'app_m' : 'app')]" class="app">
        <div class="header">
            <div class="header_bg"></div>
            <div class="title">河湖遥感大数据分析平台</div>
            <div class="userArea">
                <span>欢迎回来，</span><span>admin</span><span>！</span>
            </div>
        </div>
        <router-view class="routerArea"/>
    </div>
</template>

<script>
import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element, { zIndex: 3000 });
export default {
    name: 'App',
    data(){
        return {
            navs:[
                {
                    name:"水资源概况",
                    path:"/situation"
                },
                {
                    name:"水质感官分析",
                    path:"/sensory"
                },
                {
                    name:"趋势分析",
                    path:"/tendency"
                }
            ],
            notebook_f: false,
            bigScreen : true
        }
    },
    mounted(){
        window.onresize = ()=>{
            if (window.document.documentElement.clientWidth <= 1366) {
                this.notebook_f = true;
            } else {
                this.notebook_f = false;
            }
            this.$root.$emit('windowResize');
        }
        if (window.document.documentElement.clientWidth <= 1366) {
            this.notebook_f = true;
        } else {
            this.notebook_f = false;
        }
    }
}

</script>

<style lang="stylus">
@import "./common/common.styl";
@import "./common/global.styl";
@import "./common/screenFit.styl";
    
#app, #app_m , #app_big{
    font-family: Microsoft YaHei, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position relative
    base(100%,100%,100%);
    
    .header {
        position absolute
        font-size fitPx(32px)
        font-weight bold
        base(fitPx(800px),$headerH,$headerH);
        left 50%
        transform translateX(-50%)
        background url('./image/header_bg.png') no-repeat
        background-size 100% 100%
        color: white;
        z-index 1
        // .header_bg {
        //     base(100%,$headerH,$headerH);
        // }
        .title {
            position relative !important
            left 0px !important
            top 0px !important
            line-height $headerH - fitPx(3px)
            text-align center
            padding-left fitPx(20px)
            // background url(./image/topbg.png) no-repeat
            img{
                position absolute
                left fitPx(0px)
                top fitPx(0px)
            }
        }
        .userArea {
            display none
            position absolute
            right 0
            top -fitPx(3px)
            font-size fitPx(14px)
            background url("./image/user.png") no-repeat 98%
            padding-right fitPx(50px)
            &:hover {
                cursor pointer
            }
        }
    }
    .routerArea {
        // padding-top:$headerH;
        // base(100%,100%)
        background rgba(3,26,44,1)
    }
}



</style>
