<template>
    <div class="date-container">
        <div class="date-select" @click="showDateSelect">{{ currentTime }}</div>
        <div class="date-box" v-show="showSelect">
            <div class="date-type">
                <span class="item" @click="changeDateType(1)" :class="{'active' : dateType === 1}">月度</span>
                <span class="item" @click="changeDateType(2)" :class="{'active' : dateType === 2}">季</span>
                <span class="item" @click="changeDateType(3)" :class="{'active' : dateType === 3}">半年</span>
                <span class="item" @click="changeDateType(4)" :class="{'active' : dateType === 4}">年</span>
            </div>
            <div class="date-year">
                <span class="item prev-year" @click="changeYear('prev')">上一年</span>
                <span class="item current-year">{{ currentYear }}</span>
                <span class="item next-year" @click="changeYear('next')">下一年</span>
            </div>
            <div class="date-item-box" v-if="currentDate.data">
                <!-- 日期类型 -->
                <div class="type-month" v-show="dateType === 1">
                    <span class="item" v-for="(item, index) in currentDate.data.month" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
                </div>
                <div class="type-season" v-show="dateType === 2">
                    <span class="item" v-for="(item, index) in currentDate.data.season" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
                </div>
                <div class="type-halfyear" v-show="dateType === 3">
                    <span class="item" v-for="(item, index) in currentDate.data.halfYear" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
                </div>
                <div class="type-allyear" v-show="dateType === 4">
                    <span class="item" v-for="(item, index) in currentDate.data.allYear" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
                </div>
            </div>
            <div class="date-footer">
                <div class="left">2017</div>
                <div class="right">
                    <span class="btn cancel">取消</span>
                    <span class="btn ok" @click="confirmDate()">确定</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import allDate from '@/assets/data/dateInfo.js'
export default {
    data () {
        return {
            showSelect: false,
            getDate: "",
            currentDate: "",
            currentTime: "", // 当前时间
            currentIndex: 0,
            dateType: 1,
            selectItemIndex: ""
        }
    },
    created () {
        this.getDate = allDate.allDate
        this.setNormalDate()
        // console.log(this.getDate.length)
    },
    computed: {
        currentYear () {
            return this.getDate[this.currentIndex].years
        }
    },
    methods: {
        setNormalDate () {
            let monthData = this.getDate[0].data
            console.log(monthData)
            let month = ''
            for (let i = 11; i > -1; i--) {
                if (monthData.month[i].mark) {
                    month = monthData.month[i].date
                    this.dateType = 1
                    this.currentDate = this.getDate[this.currentIndex]
                    this.currentTime = this.currentYear + '年' + month
                    return false
                }
            }
        },
        changeYear(flag){
            let index = this.currentIndex
            if(flag === 'prev') {
                if (index >= this.getDate.length-1) {
                    this.$message.error('暂无上一年数据');
                } else {
                    index++
                }
            } else {
                if (index <= 0) {
                    this.$message.error('暂无下一年数据');
                } else {
                    index--
                }
            }
            this.currentIndex = index
            console.log(this.currentIndex)
        },
        changeDateType (type) {
            this.dateType = type
            this.selectItemIndex = ""
            this.currentDate = this.getDate[this.currentIndex]
        },
        changeItemStatus (item, index) {
            if (item.mark) {
                this.selectItemIndex = index
            }
        },
        switchTypeName (i) {
            let name = ''
            switch(i){
                case 1: 
                    name = 'month';
                    break;
                case 2: 
                    name = 'season';
                    break;
                case 3: 
                    name = 'halfYear';
                    break;
                case 4: 
                    name = 'allYear';
                    break;
            }
            return name
        },
        showDateSelect () {
            this.showSelect = !this.showSelect;
        },
        confirmDate () {
            let typeName = this.switchTypeName(this.dateType)
            this.currentTime = this.currentYear + '年' + this.currentDate.data[typeName][this.selectItemIndex].date
        }
    },
    mounted () {}
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/common.scss';
.date-container{
    position: relative;
    .date-select{
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .date-box{
        background: $dateThemeBack;
        width: 400px;
        height: auto;
        padding: 10px;
        position: absolute;
        top: 50px;
        right: 0;
        border-radius: 5px;
        overflow: hidden;
        .date-type{
            width: 100%;
            overflow: hidden;
            margin-right: -2px;
            .item{
                @include spanItem(25%, 32px, $dateItemBack);
                float: left;
            }
        }
        .date-year{
            width: 100%;
            overflow: hidden;
            margin-top: 8px;
            background: $dateItemBack;
            margin-right: -2px;
            // margin-top: 6px;
            .item{
                @include spanItem(25%, 32px, $dateItemBack);
                margin-top: 0;
                float: left;
            }
            .current-year{
                @include spanItem(50%, 32px, $dateItemBack);
                font-size: 14px;
                color: #fff;
                float: left;
            }
        }
        .date-item-box{
            width: 100%;
            margin-top: 6px;
            .type-month{
                width: 100%;
                overflow: hidden;
                margin-right: -2px;
                .item{
                    @include spanItem(25%, 32px, $dateItemBack);
                    float: left;
                    
                }
            }
            .type-season{
                width: 100%;
                overflow: hidden;
                margin-right: -2px;
                .item{
                    @include spanItem(50%, 49px, $dateItemBack);
                    float: left;
                }
            }
            .type-halfyear{
                width: 100%;
                overflow: hidden;
                margin-right: -2px;
                .item{
                    @include spanItem(50%, 100px, $dateItemBack);
                    float: left;
                }
            }
            .type-allyear{
                width: 100%;
                overflow: hidden;
                margin-right: -2px;
                .item{
                    @include spanItem(100%, 100px, $dateItemBack);
                    float: left;
                }
            }
        }
        .date-footer{
            overflow: hidden;
            margin-top: 6px;
            .left{
                width: 100px;
                height: 40px;
                line-height: 40px;
                text-align: left;
                float: left;
                color: #fff;
            }
            .right{
                float: right;
                overflow: hidden;
                .btn{
                    @include spanItem(100px, 32px, $dateItemBack);
                    float: left;
                }
            }
        }
    }
}
</style>


