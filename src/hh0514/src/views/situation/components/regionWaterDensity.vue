<template>
    <div id="regionDensity">
        <div class="title">区县水资源指数排名</div>
        <el-popover placement="bottom" content="没有更多内容了" trigger="manual" ref="noTip" :visible-arrow="false">
        </el-popover>
        <div class="tableArea">

            <gTable :options="tableConfig"></gTable>
        </div>
    </div>
</template>

<script>
var vm;
import gTable from "@/components/gTable.vue";

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
            tableConfig: {
                data:[],
                columns: [{
                        key:"index",
                        label:"排名",
                        // width:"50px"
                    },{
                        key:"region",
                        label:"区域",
                        // width:"50px"
                    },{
                        key:"exponent",
                        label:"指数",
                        // width:"70px"
                    },{
                        key:"level",
                        label:"等级",   
                        // width:"70px"
                }],
                rowClick(row, event, column){
                    this.$emit("rowClick",row);
                },
                renderHeader(h, param){
                    if (param.column.label == "面积") {
                        return h("span",[param.column.label,h('span',["(m"]),h('sup',["2"]),")"],{
                            // attrs : {
                            //     class : "cell"
                            // }
                        });
                    }
                    return param.column.label;
                }
            }
        }
    },
    components : {
        gTable
    },
    methods:{
        convertArea(num){
            // return num;
            return (num/1000000).toFixed(2);
        },
        convertRate(rate){
            return (rate*100).toFixed(2)+" "+"%";
        }
    },
    created(){
        vm = this;
        refreshData(true);
    },
    mounted(){
        // bindTableScroll(this);
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
// function bindTableScroll(vm){
//     var tableDom = vm.$refs.riverTable.$el.querySelector(".el-table__body");
//     vm.$refs.riverTable.$el.querySelector(".el-table__body-wrapper.is-scrolling-none").addEventListener("scroll", function(){
//         if (lastScrollTop < event.target.scrollTop && event.target.scrollTop + parseInt(getComputedStyle(event.target).height) >= parseInt(getComputedStyle(tableDom).height) - 20) {
//             refreshData();
//         }
//         lastScrollTop = event.target.scrollTop;
//     });
// }
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
            // vm.listData = [];
            vm.tableConfig.data = [];
            vm.pagination.total = 0;
        }
        
        ajaxing = false;
        vm.pagination.total = filteredData.length;
        vm.riverTableloading = false;
        
        var newData = _.clone(filteredData).splice((vm.pagination.current)*vm.pagination.size, vm.pagination.size);
        // vm.listData = vm.listData.concat(newData);
        vm.tableConfig.data = vm.tableConfig.data.concat(newData);
        vm.pagination.current++;
    })
    
}
</script>
<style lang="stylus">
    @import "~@/common/common.styl"
    #regionDensity {
        .tableArea {
            flex 1
            display flex
        }
    }
</style>
