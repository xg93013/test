<template>
    <div class="export-btn" @click="btnClick">
        <img src="../images/export.png" class="icon"/>
        <span class="text">{{text}}</span>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    props:{
        text:{
            type: String,
            default: ""
        }
    },
    methods: {
        btnClick () {
            this.$emit('btnClick')
        }
    }
}
</script>
<style lang="scss" scoped>
.export-btn{
    width: 100px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: #0099FF;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    transition: all 0.3s;
    cursor: pointer;
    &:hover{
        background: #1E73FF;
    }
    .icon{
        float: left;
        margin: 7px 0 0 10px;
    }
    .text{
        float: left;
        margin-left: 10px;
    }
}
</style>


