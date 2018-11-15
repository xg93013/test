<template>
    <div id="home">
        <div class="top">
            <div class="item">
                <router-link :to="{path:'home'}"><img src="../../images/u73.png" class="imgs"/></router-link>
                <span>全息档案</span>
            </div>
            <div class="item">
                <router-link :to="{path:'riskMap'}"><img src="../../images/u73.png" class="imgs"/></router-link>
                <span>监管地图</span>
            </div>
            <div class="item">
                <router-link :to="{path:'home'}"><img src="../../images/u73.png" class="imgs"/></router-link>
                <span>预警分析</span>
            </div>
            <div class="item">
                <router-link :to="{path:'home'}"><img src="../../images/u73.png" class="imgs"/></router-link>
                <span>核查结果</span>
            </div>
            <div class="item">
                <router-link :to="{path:'home'}"><img src="../../images/u73.png" class="imgs"/></router-link>
                <span>量化分级</span>
            </div>
        </div>
        <div class="bot">
            <div style="clear:both;overflow:hidden;"></div>
            <div class="bot-top">
                <div class="title">餐饮环节全链条覆盖、全流程监控</div>
                <div>餐饮</div>
                <div class="steps">
                    <div class="text">农产品批发零售</div>
                    <div class="line1"><img src="" /></div>
                    <div class="text">餐饮加工</div>
                    <div class="line2"><img src="" /></div>
                    <div class="text">餐饮消费</div>
                    <div class="line3"><img src="" /></div>
                    <div class="text">餐厨垃圾处理</div>
                </div>
            </div>
            <div class="bot-top bot-bot">
                <div class="steps">
                    <div class="icon firstIcon">
                        <div class="line"></div>
                        <a href="#" class="links">
                            <img src="../../images/u73.png" class="imgs"/>
                            <p>农产品溯源</p>
                        </a>
                    </div>
                    <div class="line1"></div>
                    <div class="icon">
                        <div class="line"></div>
                        <a href="#" class="links">
                            <img src="../../images/u73.png" class="imgs"/>
                            <p>明厨亮灶</p>
                        </a>
                    </div>
                    <div class="icon centerIcon">
                        <div class="line"></div>
                        <a href="#" class="links">
                            <img src="../../images/u73.png" class="imgs"/>
                            <p>乡村群宴</p>
                        </a>
                    </div>
                    <div class="icon">
                        <div class="line"></div>
                        <a href="#" class="links">
                            <img src="../../images/u73.png" class="imgs"/>
                            <p>网络餐饮</p>
                        </a>
                    </div>
                    <div class="line3"></div>
                    <div class="icon">
                        <div class="line"></div>
                        <a href="#" class="links">
                            <img src="../../images/u73.png" class="imgs"/>
                            <p>餐厨垃圾</p>
                        </a>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return{}
    },
    methods: {
        initMap(){

        }
    },
    mounted () {
        this.$emit('closeLoading');
    }
}
</script>
<style lang="scss" scoped>
#home{
    position: relative;
    width: 100%;
    height: 100%;
    .top{
        width: 100%;
        padding: 20px;
        margin: 40px auto;
        overflow: hidden;
        .item{
            width: 20%;
            float: left;
            text-align: center;
            .imgs{
                width: 90%;
                margin-left: 5%;
            }
            span{
                display: block;
                margin-top: 30px;
            }
        }
    }
    .bot{
        width: 100%;
        background: #f5f5f5;
        margin-top: 30px;
        // overflow: hidden;
        
        .bot-top{
            position: relative;
            width: 90%;
            margin-top: 50px;
            margin-left: 5%;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
            // overflow: hidden;
            -webkit-border-radius: 5px;
            .title{
                position: absolute;
                height: 30px;
                font-size: 16px;
                padding: 0 10px;
                background: #f5f5f5;
                line-height: 30px;
                top: -15px;
                left: 50%;
                transform: translate(-50%, 0);
                z-index: 999;
            }
            .steps{
                width: 100%;
                overflow: hidden;
                .text{
                    float: left;
                    width: 14%;
                    height: 36px;
                    line-height: 36px;
                    background: #eee;
                    text-align: center;
                }
                .icon{
                    float: left;
                    width: 14%;
                    text-align: center;
                    .line{
                        width: 1px;
                        height: 60px;
                        margin: 0 auto;
                        background: #ccc;
                    }
                    .links{
                        display: block;
                        color: #333;
                        img{
                            width: 80px;
                            height:80px;
                            border-radius: 50%;
                        }
                    }
                }
                .firstIcon{
                    width: 10%;
                    margin-left: 4%;
                }
                .centerIcon{
                    float: left;
                    width: 16%;
                    text-align: center;
                    .line{
                        width: 1px;
                        height: 100px;
                        margin: 0 auto;
                        background: #ccc;
                    }
                }
                .line1{
                    float: left;
                    width: 14%;
                    height: 30px;
                }
                .line2{
                    float: left;
                    width: 16%;
                    height: 30px;
                }
                .line3{
                    float: left;
                    width: 14%;
                    height: 30px;
                }
            }
        }
        .bot-bot{
            border: none;
            margin-top: -20px;
            padding: 0 20px 30px;
        }
    }
}
</style>