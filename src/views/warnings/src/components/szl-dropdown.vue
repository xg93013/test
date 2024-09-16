<template>
        <div class='down-list' @mouseover="showList" @mouseout="hideList">
            <span class="down-list-icon"><Icon type="more"></Icon></span>
            <div class='pop-lists' :style='{height: height}'>
                <slot></slot>
            </div>
        </div>
</template>
<script>
export default {
    data () {
        return {
            height: 0
        }
    },  
    methods: {
        showList () {
            this.height = 'auto'
        },
        hideList () {
            this.height = 0
        }
    }
}
</script>
<style lang="scss">
    .down-list {
        color: #dae6ff;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        &:hover {
            .down-list-icon {
                background-color: #27375f;
            }
        }
        .down-list-icon {
            display:inline-block;
            width:30px;
            height:30px;
            text-align:center;
            border-radius: 3px 3px 0px 0px;
            // &:hover{
            //     background-color: #27375f;
            // }
        }
        .pop-lists {
            position: absolute;
            top: 30px;
            background: #27375f;
            right: -20px;
            z-index: 999;
            transition: all 0.3s;
            overflow: hidden;
            border-radius: 4px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            .pop-list {
                display: block;
                color: #dae6ff;
                height: 30px;
                line-height: 30px;
                width: 100px;
                text-align: center;
                cursor: pointer;
                background: #27375f;
                transition: all 0.3s;
                margin: 5px 0;
                &:hover {
                    background: #1b223e;
                }
            }
        }
    }
</style>


