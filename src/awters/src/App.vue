<template>
    <div id="app">
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
            ]
        }
    }
}

</script>

<style lang="stylus">
@import "./common/common.styl";
@import "./common/global.styl";
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    base(100%,100%,100%);
    
    .header {
        position absolute
        font-size 32px
        font-weight bold
        base(800px,$headerH,$headerH);
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
            // color rgba(1,157,255,1)
            line-height $headerH - 3px
            text-align center
            padding-left 20px
            // background url(./image/topbg.png) no-repeat
            img{
                position absolute
                left 0px
                top 0px
            }
        }
        .userArea {
            display none
            position absolute
            right 0
            top -3px
            font-size 14px
            background url("./image/user.png") no-repeat 98%
            padding-right 50px
            &:hover {
                cursor pointer
            }
        }
    }
    .routerArea {
        // padding-top:$headerH;
        // base(100%,100%)
        background #060620
    }
}
</style>
