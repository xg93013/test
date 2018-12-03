<template>
    <el-tooltip class="item" :content="tips" placement="right">
        <i class="el-icon-question icon"></i>
    </el-tooltip>
</template>
<script>
export default {
    data () {
        return {}
    },
    props: {
        tips: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="scss" scoped>
    .icon{
        font-size: 18px;
        cursor: pointer;
    }
</style>


