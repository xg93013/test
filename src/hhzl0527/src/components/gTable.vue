<template>
    <div class="g_table">
        <!-- <div class="title" v-text="options.title"></div> -->
        <el-popover placement="bottom" content="没有更多内容了" trigger="manual" ref="noTip" :visible-arrow="false">
        </el-popover>
        <div class="tableCommon">
            <el-table :data="currentData" style="width: 100%;height:100%;" :height="autoHeight" :max-height="autoHeight" :stripe="false" ref="table" v-loading="loading" v-popover:noTip
            @row-click="options.rowClick" :row-style="{cursor:'pointer'}" :highlight-current-row="true" :row-class-name="rowClassName" :header-row-class-name="rowClassName">
                <template v-for="item in options.columns">
                    <el-table-column :formatter="item.formatter" :show-overflow-tooltip="true" :key="item.id" :prop="item.key" :label="item.label" :width="item.width" :render-header="options.renderHeader"></el-table-column>
                </template>
            </el-table>
        </div>
    </div>
</template>

<script>
let _this;
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
            autoHeight : '100%',
            rowClassName :'',
            currentParams: {}
        }
    },
    props:['options'],
    computed : {
        isFrontTable(){
            return typeof this.options.url == 'undefined';
        }
    },
    methods:{
        
    },
    watch:{
        'options.url': function(nV, oV){
            this.pagination.current = 1;
            this.pagination.total = 0;
            this.currentData = [];
            // refreshData(this);
        },
        'options.params': function(nV, oV){
            this.pagination.current = 1;
            this.pagination.total = 0;
            this.currentData = [];
            this.currentParams = nV;
            refreshData(this);
        },
        'options.data': function(nV, oV){
            this.currentData = [...nV];
            this.$nextTick(()=>{
                this.autoHeight = this.$el.parentElement.clientHeight;
            });
        }
    },
    mounted () {
        _bindTableScroll(this);
        this.$root.$on('windowResize', () => {
            this.autoHeight = this.$el.parentElement.clientHeight;
        });
    },
    created(){
        this.rowClassName = this.$store.state.view.bigScreen ? 'big_screen':'';
        // refreshData(this);
        _this = this;
    }
}
// let _dataQuerying = false;
async function refreshData(_this){
    // scroll可能触发多次刷新，保证每次只触发一次查询
    if (_this.isFrontTable || _this.loading) {
        return;
    }
    // 判断是否已经全部加载，全部加载则提示
    if (_this.pagination.total && _this.pagination.current * _this.pagination.size > _this.pagination.total) {
        _this.$refs.noTip.doShow();
        setTimeout(function(){
            _this.$refs.noTip.doClose();
        }, 2000);
        return;
    }

    _this.loading = true;
    let params = {..._this.currentParams};
    params.page = _this.pagination.current;
    params.pageSize = _this.pagination.size;
    params.queryType = 'list';
    let result = await _this.$http.get(_this.options.url, params);
    _this.loading = false;
    if(result && result.status.code===0){
        _this.currentData = _this.currentData.concat(result.data.list);
        _this.pagination.total = result.data.total;
        _this.pagination.current++;
    }
    _this.$nextTick(()=>{
        _this.autoHeight = _this.$el.parentElement.clientHeight;
    });
}

function getPagedUrl (_this) {
    var tempUrl = '';
    if (_this.options.url) {
        tempUrl = _this.options.url + (_this.options.url.includes('?')? '&' : '?') + 'size='+ _this.pagination.size + '&current='+_this.pagination.current;
    }
    return tempUrl;
}

function _bindTableScroll(_this){
    var tableDom = _this.$refs.table.$el.querySelector(".el-table__body");
    _this.$refs.table.$el.querySelector(".el-table__body-wrapper.is-scrolling-none").addEventListener("scroll", function(){
        if (_this.lastScrollTop < event.target.scrollTop && event.target.scrollTop + parseInt(getComputedStyle(event.target).height) >= parseInt(getComputedStyle(tableDom).height) - 20) {
            refreshData(_this);
        }
        _this.lastScrollTop = event.target.scrollTop;
    });
}

</script>
<style scoped lang="stylus">
    @import "../common/common.styl";
    .g_table {
        // height 100%
        flex-grow 1
        display flex
        flex-direction column
        .tableCommon {
            flex-grow 1
        }
    }
</style>
