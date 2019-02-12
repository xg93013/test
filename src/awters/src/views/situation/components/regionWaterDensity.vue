<template>
    <div id="regionDensity">
        <div class="section_common style_common list">
            <div class="title">区域水资源指数排名</div>
            <el-popover placement="bottom" content="没有更多内容了" trigger="manual" ref="noTip" :visible-arrow="false">
            </el-popover>
            <div class="tableCommon">
                <el-table :data="listData" style="width: 100%" :max-height="510" :stripe="false" ref="riverTable" v-loading="riverTableloading" v-popover:noTip
                @row-click="rowClick" :row-style="{cursor:'pointer'}" :highlight-current-row="false">
                    <template v-for="item in columnsList">
                        <el-table-column :show-overflow-tooltip="true" :key="item.id" :prop="item.key" :label="item.label" :width="item.width" :render-header="headerRender"></el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
var vm;


export default {
    data () {
        return {
            listData : [],
            pagination : {
                current : 0,
                total:0,
                size:20
            },
            riverTableloading:false,
            columnsList:[{
                    key:"index",
                    label:"排名",
                    width:"50px"
                },{
                    key:"region",
                    label:"区域",
                    // width:"50px"
                },{
                    key:"exponent",
                    label:"指数",
                    width:"70px"
                },{
                    key:"level",
                    label:"等级",   
                    width:"70px"
            }],
            
        }
    },
    components : {

    },
    methods:{
        rowClick(row, event, column){
            this.$emit("rowClick",row);
        },
        headerRender(h, param){
            if (param.column.label == "面积") {
                return h("span",[param.column.label,h('span',["(m"]),h('sup',["2"]),")"],{
                    // attrs : {
                    //     class : "cell"
                    // }
                });
            }
            return param.column.label;
        },
        convertArea(num){
            // return num;
            return (num/1000000).toFixed(2);
        },
        convertRate(rate){
            return (rate*100).toFixed(2)+" "+"%";
        }
    },
    created(){
        // console.log()
        vm = this;
        refreshData(true);
    },
    mounted(){
        bindTableScroll(this);
    },
    watch:{
        "filter":{
            handler:function(n){
                refreshData(true);
            },
            deep:true
        }
    }

}
var lastScrollTop = 0;
function bindTableScroll(vm){
    var tableDom = vm.$refs.riverTable.$el.querySelector(".el-table__body");
    vm.$refs.riverTable.$el.querySelector(".el-table__body-wrapper.is-scrolling-none").addEventListener("scroll", function(){
        if (lastScrollTop < event.target.scrollTop && event.target.scrollTop + parseInt(getComputedStyle(event.target).height) >= parseInt(getComputedStyle(tableDom).height) - 20) {
            refreshData();
        }
        lastScrollTop = event.target.scrollTop;
    });
}
// 刷新数据
var ajaxing = false;

function refreshData (isRefreshFilter) {
    // scroll可能触发多次刷新，保证每次只触发一次查询
    if (ajaxing) {
        return;
    }
    
    if (!isRefreshFilter && vm.pagination.total && vm.pagination.current * vm.pagination.size > vm.pagination.total) {

        vm.$refs.noTip.doShow();
        setTimeout(function(){
            vm.$refs.noTip.doClose();
        }, 2000);
        return;
    }
    vm.riverTableloading = true;
    ajaxing = true;
    var ajaxP = new Promise(resolve=>{
        var that = this;
        setTimeout(function (params) {
            resolve();
        }, 500);
    });
    ajaxP.then(function(){
        var filteredData=[{region:"武侯区",index:1,exponent:89,level:"高"},
            {region:"锦江区",index:2,exponent:86,level:"高"},
            {region:"青羊区",index:3,exponent:82,level:"高"},
            {region:"金牛区",index:4,exponent:82,level:"高"},
            {region:"成华区",index:5,exponent:80,level:"高"},
            {region:"龙泉驿区",index:6,exponent:75,level:"高"},
            {region:"温江区 ",index:7,exponent:70,level:"中"},
            {region:"新都区",index:8,exponent:68,level:"中"},
            {region:"青白江区",index:9,exponent:65,level:"中"},
            {region:" 双流区",index:10,exponent:62,level:"中"},
            {region:" 郫都区",index:11,exponent:60,level:"中"},
            {region:" 蒲江县",index:12,exponent:59,level:"中"},
            {region:"大邑县",index:13,exponent:55,level:"中"},
            {region:"金堂县",index:14,exponent:50,level:"低"},
            {region:" 新津县",index:15,exponent:45,level:"低"},
            {region:"都江堰市",index:16,exponent:44,level:"低"},
            {region:"彭州市",index:17,exponent:40,level:"低"},
            {region:"邛崃市",index:18,exponent:35,level:"低"},
            {region:"崇州市",index:19,exponent:30,level:"低"},
            {region:"简阳市",index:20,exponent:29,level:"低"}];

        if (isRefreshFilter) {
            vm.pagination.current = 0;
            vm.listData = [];
            vm.pagination.total = 0;
        }
        
        ajaxing = false;
        vm.pagination.total = filteredData.length;
        vm.riverTableloading = false;
        
        var newData = _.clone(filteredData).splice((vm.pagination.current)*vm.pagination.size, vm.pagination.size);
        vm.listData = vm.listData.concat(newData);
        vm.pagination.current++;
    })
    
}
</script>
<style lang="stylus">
    @import "~@/common/common.styl"
    #regionDensity {
        .section_common{
            base(350px)
            &:not(:last-child){
                margin-bottom 15px
            }
            padding 20px
            clf()
            border 1px solid rgba(49, 49, 122, 1)
            // gradientStyle(top,rgba(27, 27, 38, .9) 50%,rgba(49, 49, 122, .8));
            background-color rgba(27, 27, 38, .9)
            &.stat{
                .title{
                    font-size 20px
                    margin-bottom 15px
                }
                .outline{
                    clf()
                    border-bottom 1px solid rgba(255,255,255,.2)
                    padding-bottom 10px
                    .total_item {
                        p{
                            margin-bottom 10px
                        }
                        .num {
                            font-weight bold
                            font-size 30px
                            color rgba(75, 173, 220, 1)
                            margin-right 5px
                        }
                    }
                    
                }
                .river_lake{
                    padding-top 20px
                    clf()
                    .style_common{
                        base(49%,100%)
                        calcM(width, 50%, 2.5px)
                        // width '-webkit-calc(50% - %s)' % 2.5px
                        float left
                        &:first-child{
                            margin-right 5px
                        }

                        .title {
                            font-size 18px
                            // text-align center
                            margin-bottom 10px
                        }
                        p{
                            margin-bottom 5px
                        }
                    }
                }
                
            }
            &.list{
                .title{
                    font-size 20px
                    margin-bottom 20px
                }
            }
        }
        .style_common{
            // padding 20px
            // background-color rgba(255, 255, 255, 0.8)
            // background-color #999999
        }

        .total_item {
            base(50%)
            // text-align center
        }
    }
</style>
