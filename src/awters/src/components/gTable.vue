<template>
    <div class="g_table">
        <div class="title" v-text="options.title"></div>
        <el-popover placement="bottom" content="没有更多内容了" trigger="manual" ref="noTip" :visible-arrow="false">
        </el-popover>
        <div class="tableCommon">
            <el-table :data="currentData" style="width: 100%" :max-height="options.maxHeight" :stripe="false" ref="table" v-loading="loading" v-popover:noTip
            @row-click="options.rowClick" :row-style="{cursor:'pointer'}" :highlight-current-row="true">
                <template v-for="item in options.columns">
                    <el-table-column :formatter="item.formatter" :show-overflow-tooltip="true" :key="item.id" :prop="item.key" :label="item.label" :width="item.width" :render-header="options.renderHeader"></el-table-column>
                </template>
            </el-table>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            lastScrollTop: 0,
            currentData:[],
            loading: false,
            pagination : {
                current : 0,
                total:0,
                size:20
            },
        }
    },
    props:['options'],
    components : {

    },
    methods:{
        
    },
    watch:{
        'options.url': function(nV, oV){
            this.pagination.current = 0;
            this.pagination.total = 0;
            this.currentData = [];
            refreshData(this);
        }
    },
    mounted () {
        _bindTableScroll(this);
    },
    created(){
        refreshData(this);
    }
}
// let _dataQuerying = false;
async function refreshData(vm){
    // scroll可能触发多次刷新，保证每次只触发一次查询
    if (vm.loading) {
        return;
    }
    // 判断是否已经全部加载，全部加载则提示
    if (vm.pagination.total && vm.pagination.current * vm.pagination.size > vm.pagination.total) {
        vm.$refs.noTip.doShow();
        setTimeout(function(){
            vm.$refs.noTip.doClose();
        }, 2000);
        return;
    }

    vm.loading = true;
    let result = await vm.$http.get(getPagedUrl(vm));
    vm.loading = false;
    if(result.code===0){
        vm.currentData = vm.currentData.concat(result.data);
        vm.pagination.total = result.totalCount;
        vm.pagination.current++;
    }
}

function getPagedUrl (vm) {
    var tempUrl = '';
    if (vm.options.url) {
        tempUrl = vm.options.url + (vm.options.url.includes('?')? '&' : '?') + 'size='+ vm.pagination.size + '&current='+vm.pagination.current;
    }
    return tempUrl;
}

function _bindTableScroll(vm){
    var tableDom = vm.$refs.table.$el.querySelector(".el-table__body");
    vm.$refs.table.$el.querySelector(".el-table__body-wrapper.is-scrolling-none").addEventListener("scroll", function(){
        if (vm.lastScrollTop < event.target.scrollTop && event.target.scrollTop + parseInt(getComputedStyle(event.target).height) >= parseInt(getComputedStyle(tableDom).height) - 20) {
            refreshData(vm);
        }
        vm.lastScrollTop = event.target.scrollTop;
    });
}

</script>
<style scoped lang="stylus">
    @import "../common/common.styl";
    .g_table {
        
    }
</style>
