<template>
    <div class="my-title">
        <div class="left">
            <span class="title">{{title}}</span>
            <div class="tips" v-show="tips != ''">
                <my-tips :tips="tips"/>
            </div>
            <div class="leftDown">
                <slot name="leftDown"></slot>
            </div>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script>
import MyTips from '@/components/MyTips'
export default {
    components: {
        MyTips
    },
    data () {
        return {}
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        tips: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss" scoped>
.my-title{
    width: 100%;
    margin: 10px 0;
    overflow: hidden;
    .left{
        float: left;
        .title{
            display: block;
            height: 18px;
            line-height: 18px;
            padding-left: 10px;
            font-size: 16px;
            margin-top: 4px;
            color: #A0D2FF;
            float: left;
            border-left: 4px solid #67B7FF;
        }
        .leftDown{
            float: left;
            margin-left: 10px;
            margin-top: -5px;
        }
        .tips{
            float: left;
            line-height: 18px;
            margin: 4px 0 0 6px;
        }
    }
    .right{
        float: right;
        margin-right: 12px;
    }
}
</style>


