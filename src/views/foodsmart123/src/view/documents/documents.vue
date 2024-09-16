<template>
    <div id="documents">
        <div class="top-search" :class="outStyle">
            
            <div class="top-tips" v-show="activeSearch"><span class="backs" @click="backSearch" v-show="activeSearch">返回</span>tips</div>
            <div class="searchBox" :class="searchBoxStyle">
                <el-input v-model="keyWords" placeholder="请输入要查询的企业名称" class="leftInput float-item" @focus="changeActive"></el-input>
                <el-button type="primary" icon="el-icon-search" width="40" class="leftBtn float-item" @click="keyWorkSearch"></el-button>
            </div>
        </div>
        <div class="lists">
            <div class="searching" v-show="showLoading">
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>search..</div>
            </div>
            <div class="item" v-for="(item, index) in searchData.list" :key="index">
                <p class="name">{{ item.name }}</p>
                <p class="des">{{ item.area }}</p>
            </div>
            <div class="pages" v-show="searchData.list.length>0">
                <el-pagination
                background
                layout="prev, pager, next"
                :total="searchData.totalPage"
                >
                </el-pagination>
            </div>
            <div class="tips" v-show="searchData.list.length==0&&!showLoading"></div>
        </div>
    </div>
</template>
<script>
import http from '../../unit/http'
export default {
    data() {
        return {
            keyWords: '',
            activeSearch: false,
            showLoading: false,
            searchBoxStyle: 'normalSearch',
            outStyle: '',
            totalPage: 100,
            searchData: {
                list: [],
                totalPage: 100
            }
        }
    },
    created(){},
    watch: {
        activeSearch(newBol){
            if(newBol){
                this.searchBoxStyle = 'activeSearch'
            } else {
                this.searchBoxStyle = 'normalSearch'
            }
        }
    },
    methods: {
        changeActive(){
            console.log('e');
           
        },
        keyWorkSearch(){
            if(this.keyWords != ''){
                this.showLoading = true;
                this.activeSearch = true;
                setTimeout(() => {
                    this.getData();
                    this.showLoading = false;
                }, 1000)
            }
        },
        backSearch(){
            this.activeSearch = false;
            this.showLoading = false;
            this.searchData.list = [];
        },
        async getData(){
            let res = await http.get('/api/getSearchList');
            if(res){
                this.searchData.list = res.data;
                this.searchData.totalPage = res.page;
            } else {
                this.searchData.list = [];
                this.searchData.totalPage = 0;
            }
            
        }
    },
    mounted(){
        
    }
}
</script>
<style lang="scss" scoped>
#documents{
    width: 100%;
    height: 100%;
    position: relative;
    .top-search{
        padding: 20px;
    }
    .top-tips{
        position: absolute;
        top: 20px;
        left: 20px;
        .backs{
            margin-right: 20px;
        }
    }
    .searchBox{
        transition: all 0.1s;
    }
    .activeSearch{
        position: absolute;
        top: 20px;
        right: 20px;
        transform: none;
    }
    .normalSearch{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 500px;
        overflow: hidden;
        z-index: 999;
    }
    .float-item{
        float: left;
    }
    .leftInput{
        width: 460px;
    }
    .leftBtn{
        width: 36px;
        height: 36px;
        padding: 0;
        // background-color: #ccc;
        text-align: center;
    }
    .lists{
        transition: all 0.2s;
        padding: 20px;
        position: relative;
        min-height: 300px;
        .searching{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 450px;
            text-align: center;
        }
        .pages{
            text-align: center;
        }
        .item{
            width: 100%;
            padding: 20px 0;
            border-bottom: 1px solid #f5f5f5;
        }
    }
}
</style>
<style lang="scss">
#documents{
    .el-input__inner{
    	width: 180px;
        background-color: #eee;
        border: none;
        height: 36px;
        line-height: 36px;
        // border-color: none;
        border-radius: 2px;
    }
    .leftInput{
    	.el-input__inner{
    		width: 100%;
    	}
    }
    .el-pagination{
        display: inline;
        overflow: hidden;
    }
    .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
        // background-color: #ccc;
    }
}
</style>


