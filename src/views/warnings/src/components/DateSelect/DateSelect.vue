<template>
	<el-popover popper-class="szl-time-pop" @after-leave="cancel" v-model="show" width="340" trigger="click">
	    <div class="date-container">
	        <!--<div class="date-select" @click="showDateSelect">{{ currentTime }}</div>-->
	        <div class="date-box">
	            <div class="date-type">
	                <span class="item" @click="changeDateType(1)" :class="{'active' : dateType === 1}">月度</span>
	                <!--<span class="item" @click="changeDateType(2)" :class="{'active' : dateType === 2}">季</span>
	                <span class="item" @click="changeDateType(3)" :class="{'active' : dateType === 3}">半年</span>-->
	                <span class="item" @click="changeDateType(4)" :class="{'active' : dateType === 4}">年</span>
	            </div>
	            <div class="date-year">
	                <span class="item prev-year" @click="changeYear('prev')" :class="{'disabled' : currentIndex >= (originDate.length-1)}" >上一年</span>
	                <span class="item current-year">{{ currentYear }}</span>
	                <span class="item next-year" @click="changeYear('next')" :class="{'disabled' : currentIndex <= 0}" >下一年</span>
	            </div>
	            <div class="date-item-box" v-show="currentDate.data">
	                <!-- 日期类型 -->
	                <div class="type-month" v-show="dateType === 1">
	                    <span class="item" v-for="(item, index) in currentDate.data.month" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
	                </div>
	                <!--<div class="type-season" v-show="dateType === 2">
	                    <span class="item" v-for="(item, index) in currentDate.data.season" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
	                </div>
	                <div class="type-halfyear" v-show="dateType === 3">
	                    <span class="item" v-for="(item, index) in currentDate.data.halfYear" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
	                </div>-->
	                <div class="type-allyear" v-show="dateType === 4">
	                    <span class="item" v-for="(item, index) in currentDate.data.allYear" :key="index" :class="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" @click="changeItemStatus(item,index)">{{ item.date }}</span>
	                </div>
	            </div>
	            <div class="date-footer">
	                <div class="left">2017</div>
	                <div class="right">
	                    <span class="btn cancel" @click="cancel()">取消</span>
	                    <span class="btn ok" @click="confirmDate()">确定</span>
	                </div>
	            </div>
	        </div>
	    </div>
    	<div slot="reference" size="small" class="szl-time">
			{{ currentTime }}
			<img :src="require('./images/arrow.png')" alt="" />
		</div>
    </el-popover>
</template>
<script>
import allDate from '@/assets/data/dateInfo.js'
import allDate1 from '@/assets/data/dateInfo1.js'
export default {
    data () {
        return {
        	show: false,
            currentTime: "", // 当前时间
            currentIndex: 0,
            dateType: 1,
            originDate: '',
            selectItemIndex: -1,
            platform: ''
        }
    },
    props: ['platFormTypes'],
	watch: {
		platFormTypes(platform){
			console.log(platform);
			this.platform = platform
		}
	},
    created () {
//      this.getDate = allDate.allDate
        this.init('mormal')
        // console.log(this.getDate.length)
    },
    computed: {
        currentYear () {
            return this.originDate[this.currentIndex].years;
        },
        currentDate () {
        	return this.originDate[this.currentIndex];
        }
    },
    methods: {
        init (time) {
        	console.log(time);
        	let res = '';
        	this.currentIndex = 0;
        	this.dateType = 1;
        	this.originDate = allDate.allDate;
            if(time != 'mormal'){
            	console.log('change')
            	this.originDate = allDate1.data;
            }
            	console.log(this.originDate);
//         	this.currentDate = this.originDate[this.currentIndex]
//         	this.currentYear = this.originDate[this.currentIndex].years
           
            let month = '';
            for(let j = 0;j < this.originDate.length;j++){
            	for (let i = 11; i > -1; i--) {
	                if (this.originDate[j].data.month[i].mark) {
	                    month = this.originDate[j].data.month[i].date;
	                    this.currentTime = this.currentYear + '年' + month;
	                    this.selectItemIndex = i;
	                    let emitTime = {
	                    	year: this.currentYear,
	                    	msg: month
	                    }
	                    console.log(emitTime)
	                    console.log(this.platFormTypes)
	                    if(this.platFormTypes == 'resultNetfood'){
	                    	console.log('ssssssssssss')
	                    	sessionStorage.setItem('listTime', JSON.stringify(emitTime));
	                    	this.$emit("timeChange", emitTime);
	                    }
	                    if(this.platFormTypes == 'foodWaste'){
//	                    	console.log('ssssssssssss')
	                    	sessionStorage.setItem('foodlistTime', JSON.stringify(emitTime));
//	                    	this.$emit("timeChange", emitTime);
	                    }
	                    
	                    return false
	                }
	            }
            }
            
        },
        changeYear(flag){
            let index = this.currentIndex;
            if(flag === 'prev') {
                if (index < this.originDate.length-1) {
                	this.selectItemIndex = -1;
                    index++;
                }
            } else {
                if (index > 0) {
                	this.selectItemIndex = -1;
                    index--;
                }
            }
            this.currentIndex = index;
        },
        changeDateType (type) {
            this.dateType = type;
            this.selectItemIndex = -1;
//          this.currentDate = this.originDate[this.currentIndex];
        },
        changeItemStatus (item, index) {
            if (item.mark) {
                this.selectItemIndex = index;
            }
        },
        cancel() {
			this.show = false;
//			this.selectItemIndex = -1;
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
        	this.show = false;
            if(this.selectItemIndex == -1){
            	this.dateType = 4;
            	this.selectItemIndex = 0;
            }
            let typeName = this.switchTypeName(this.dateType);
            let dates = this.currentDate.data[typeName][this.selectItemIndex].date
            this.currentTime = this.currentYear + '年' + dates;
            let emitTime = {
            	year: this.currentYear,
            	msg: dates == '全年' ? '': dates
            }
            console.log(emitTime)
            if(this.platFormTypes == 'resultNetfood'){
            	sessionStorage.setItem('listTime', JSON.stringify(emitTime));
            }
            if(this.platFormTypes == 'foodWaste'){
//	                    	console.log('ssssssssssss')
            	sessionStorage.setItem('foodlistTime', JSON.stringify(emitTime));
//	                    	this.$emit("timeChange", emitTime);
            }
            this.$emit("timeChange", emitTime);
            
        }
    },
    mounted () {}
}
</script>
<style lang="scss">
/*@import '~@/assets/scss/common.scss';*/
$dateThemeBack: #1c2543;

$dateItemBack: #293458;

$dateActiveBack: #0099FF;

$disableBack: #7E8E98;

$topBack: #2E4354;

$btnOk: #0FA063;

@mixin spanItem($w, $h, $color) {
    display: inline-block;
    height: $h;
    width: $w;
    font-size: 12px;
    color: #ccc;
    line-height: $h;
    box-sizing: border-box;
    text-align: center;
    /*padding-right: 2px;*/
    background: $color;
    margin-top: 2px;
    background-clip: content-box;
    cursor: pointer;
    &.disabled{
        background: $disableBack;
        background-clip: content-box;
        cursor: default;
        color: #ccc;
        &:hover{
            cursor: not-allowed !important;
        }
    }
    &.active{
        background: $dateActiveBack;
        color: #fff;
        background-clip: content-box;
    }
}
.szl-time-pop.el-popper {
	width: 450px;
	background: rgba(28,37,67,1);
	border: 1px solid rgba(28,37,67,1);
	margin-left: 40px;
	padding: 20px;
	* {
		color: #87b3d1;
	}
}

.szl-time {
	display: inline-block;
	background: #0099FF;
	border: 1px solid #0099FF;
	color: #C5E6FE;
	padding: 0 16px;
	height: 32px;
	line-height: 32px;
	cursor: pointer;
	border-radius: 6px;
	img {
		position: relative;
		top: -1px;
		vertical-align: middle;
		opacity: .8;
	}
}

.szl-time-pop.el-popper .popper__arrow {
	border-bottom-color: #253745 !important;
	&:after {
		border-bottom-color: #253745 !important;
	}
}
.date-container{
/*    position: relative;*/
    z-index: 999;
    .date-select{
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .date-box{
        background: $dateThemeBack;
        /*width: 400px;*/
        height: auto;
        padding: 10px;
        /*position: absolute;*/
        left: 0;
        top: 50px;
        right: 0;
        border-radius: 5px;
        overflow: hidden;
        .date-type{
            width: 100%;
            overflow: hidden;
            background : $topBack;
            margin-right: -2px;
            .item{
                @include spanItem(50%, 32px, $topBack);
                margin-top: 0;
                float: left;
            }
        }
        .date-year{
            width: 100%;
            overflow: hidden;
            margin-top: 8px;
            background: $topBack;
            /*margin-right: -2px;*/
            // margin-top: 6px;
            .item{
                @include spanItem(25%, 32px, $topBack);
                margin-top: 0;
                float: left;
            }
            .current-year{
                @include spanItem(50%, 32px, $topBack);
                margin-top: 0;
                font-size: 14px;
                color: #fff;
                float: left;
            }
        }
        .date-item-box{
            /*width: 100%;*/
            margin-top: 6px;
            margin-right: -2px;
            .item{
            	padding-right: 2px;
            }
            .type-month{
                width: 100%;
                overflow: hidden;
                
                .item{
                    @include spanItem(25%, 32px, $dateItemBack);
                    float: left;
                    
                }
            }
            .type-season{
                width: 100%;
                overflow: hidden;
                /*margin-right: -2px;*/
                .item{
                    @include spanItem(50%, 49px, $dateItemBack);
                    float: left;
                }
            }
            .type-halfyear{
                width: 100%;
                overflow: hidden;
                /*margin-right: -2px;*/
                .item{
                    @include spanItem(50%, 100px, $dateItemBack);
                    float: left;
                }
            }
            .type-allyear{
                width: 100%;
                overflow: hidden;
                /*margin-right: -2px;*/
                .item{
                    @include spanItem(100%, 100px, $dateItemBack);
                    float: left;
                }
            }
        }
        .date-footer{
        	width: 100%;
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
                    @include spanItem(70px, 32px, $dateItemBack);
                    float: left;
                }
                .ok{
                	background: $btnOk;
                }
            }
        }
    }
}
</style>