<template>
    <div class="my-title">
        <div class="left">
            <span class="title">{{title}}</span>
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
export default {
    data () {
        return {}
    },
    props: {
        title: {
            type: String,
            default: ""
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
            color: #A0D2FF;
            float: left;
            border-left: 4px solid #67B7FF;
        }
        .leftDown{
            float: left;
            margin-left: 10px;
            margin-top: -5px;
        }
    }
    .right{
        float: right;
        margin-right: 12px;
    }
}
</style>


