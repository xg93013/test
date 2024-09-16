<template>
    <el-autocomplete class="searchCustom" v-model="searchVaule" :fetch-suggestions="querySearchAsync" placeholder="请输入江河名称" @select="handleSelect" :popper-append-to-body="false" popper-class="searchCustomPopper" :trigger-on-focus="false" @keyup.enter.native="handleSelect">
        <i class="el-icon-search el-input__icon searchBtn" slot="suffix" @click='handleSelect'></i>
        <template slot-scope="{ item }">
            <span class="name">{{ item.name }}</span>
            <span class="type" v-if="!item.noData">{{ item.type }}</span>
        </template>
    </el-autocomplete>
</template>

<script>
// import riverData from '@/data/mmmm_resource.json';
// var this.quickData = riverData;
import apis from "@/util/apis.js";
const {
    FUZZY_SEARCH
} = apis

export default {
    data () {
        return {
            searchVaule:"",
            quickData:[]
        }
    },
    props:['value','data', 'month'],
    components : {

    },
    methods:{
        handleSelect(item){
            var searchObj={};
            if (item instanceof Event) {
                if (this.searchVaule != "") {
                    return;
                }
                searchObj.type = 'all';
            } else {
                if (item.noData) {
                    this.searchVaule = "";
                    return;
                } else {
                    this.searchVaule = item.name;
                }
                searchObj = item;
            }
            // this.value = this.searchVaule;
            this.$emit("search",searchObj);
            this.$emit('update:value', this.searchVaule)
        },
        async querySearchAsync(queryString, cb){
            // let data = await this.$http.get("/quickQuery");
            // cb(data)

            // function getBriefData(qstr){
            // setTimeout(()=>{
                // console.log(this.quickData);
                // let name = this.quickData;
                let tempData = [];
                let res = await this.$http.get(FUZZY_SEARCH, {
                    name: queryString,
                    month: this.month
                })
                if(res){
                    tempData = res.data;
                }
                
                // var tempData = _.filter(this.quickData, function(item){
                //     return item.name.indexOf(queryString) != -1;
                // });
                if (queryString && tempData.length == 0) {
                    tempData = [{name:"无匹配信息，请重新输入！", noData:true}]
                }
                cb(tempData);
            // }, 500);
            // }
        },
        qualitySelectFn(args){
            args.selected = !args.selected
        },
        typeSelectFn(args){
            args.selected = !args.selected
        }
    },
    watch:{
        "value":function(n,o){
            // if (n=='') {
                this.searchVaule = n;
            // }
        }
    },
    mounted () {
    },
    async created(){
        // if(this.data && this.data.length != 0){
        //     this.quickData = this.data;
        // }
        var that = this;
        // async function getWData () {
        //     return await that.$http.get('/getWaterResourceData');
        // }
        // var rData = await getWData();
        // if (rData) {
        //     this.quickData = rData.data;
        // }
    }
}
</script>
<style scoped lang="stylus">
    @import "../common/common.styl";
    .searchCustom >>> {
        .el-input{
            float left
            .el-input__inner{
                background-color rgba(7, 14, 32,.85)
                color white
                border-color rgba(7, 14, 32,.85)
                &:focus{
                    border-color rgba(1,255,255,1)
                }
            }
        }
        .searchBtn {
            cursor pointer
        }
    }
</style>
<style lang="stylus">
    @import "../common/common.styl";
    .searchCustomPopper {
        .el-scrollbar{
            border-radius 4px
            .el-scrollbar__wrap{
                background-color rgba(7, 14, 32, .85)
                border none
                .el-autocomplete-suggestion__list{
                    li{
                        &:hover,&.highlighted{
                            background-color rgba(69,103,204,.3)
                        }
                        .type{
                            float right
                            color rgba(69,103,204,.9)
                        }
                    }
                }
            }
        }
        .popper__arrow{
            display none
        }
    }
</style>
