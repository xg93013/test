import React, { Component } from 'react'
import { Button, Popover} from 'antd'
import 'antd/dist/antd.css'

import '../styles/dateSelect.scss'
import allDate from '../datas/originDate.js'

// function DateTimebox(prop){
//     // const showBox = prop.
//     console.log(prop);
//     // let htmls = '';
//     if(prop.currentDate.data.length > 0){
//         return (
//             <div className="date-item-box">
//                 {/* <DateTimetype dateType={prop.dateType}/> */}
//             </div>
//         )
//     }
// }
// function DateTimetype(prop){
//     if(prop.dateType === 1){
//         return (
//             <div className="type-month" v-show="dateType === 1">
//                 {
//                     this.state.currentDate.data.month.map((item, i) => (
//                         <span key={i} className={`item ${item.mark ? 'disabled' : ''} ${i === this.state.selectItemIndex ? 'active' : ''}`} onClick={this.changeItemStatus.bind(this,(item,i))}>{ item.date }</span>
//                         // <span className="item" key={i} className={{'disabled' : !item.mark, 'active' : i === this.state.selectItemIndex}} onClick={this.state.changeItemStatus.bind(this,(item,index))}>{ item.date }</span>
//                     ))
//                 }
                
//             </div>
//         )
//     }
//     if(prop.dateType === 4){
//         return (
//             <div className="type-allyear" v-show="dateType === 4">
//                 {
//                     this.state.currentDate.data.allYear.map((item, i) => (
//                         <span key={i} className={`item ${item.mark ? 'disabled' : ''} ${i === this.state.selectItemIndex ? 'active' : ''}`} onClick={this.changeItemStatus.bind(this,(item,i))}>{ item.date }</span>
//                         // <span className="item" key={i} className={{'disabled' : !item.mark, 'active' : i === this.state.selectItemIndex}} onClick={this.state.changeItemStatus.bind(this,(item,index))}>{ item.date }</span>
//                     ))
//                 }
//             </div>
//         )
//     }
    
// }
export default class DateSelect extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            show: false,
            currentTime: "", // 当前时间
            currentIndex: 0,
            dateType: 1,
            originDate: '',
            selectItemIndex: -1,
            platform: '',
            currentDate: '',
            currentYear: ''
        }
    }
    async init (time) {
        let urls = '';
        let res = '';
        this.dateType = 1;
        // if(this.platFormType == 'netfood'){
        //     urls = LISTDATE;
        //     // res = allDate;
        // }
        // if(this.platFormType == 'foodWaste'){
        //     urls = FOODWASTE_LISTDATE;
        //     // res = allDate1;
        // }
        // res = await http.get(urls);
        res = allDate;
        if(res){
            this.currentIndex = 0;
            this.state.originDate = res.data;
        }
        let month = '';
        // console.log(res);
        console.log(this.state.originDate);
        for(let j = 0;j < this.state.originDate.length;j++){
            for (let i = 11; i > -1; i--) {
                if (this.state.originDate[j].data.month[i].mark) {
                    month = this.state.originDate[j].data.month[i].date;
                    // this.currentTime = this.currentYear + '年' + month;
                    // this.selectItemIndex = i;
                    let currentDate = this.state.originDate[this.state.currentIndex];
                    let currentYear = this.state.originDate[this.state.currentIndex].years;
                    this.setState({
                        currentDate: currentDate,
                        currentYear: currentYear
                    })
                    let currenttime = this.state.currentYear + '年' + month;
                    
                    this.setState({
                        currentTime: currenttime,
                        selectItemIndex: i
                    })
                    
                    
                    let emitTime = {
                        year: currentYear,
                        msg: month
                    }
                    console.log(emitTime);
                    console.log(this.state.currentTime);
                    // if(this.platFormType == 'netfood'){
                    //     sessionStorage.setItem('netfoodTime', JSON.stringify(emitTime));
                    //     this.$emit("timeChange", emitTime);
                    // }
                    // if(this.platFormType == 'foodWaste'){
                    //     sessionStorage.setItem('foodWasteTime', JSON.stringify(emitTime));
                    //     this.$emit("timeChange", emitTime);
                    // }
                    // if(this.platFormType == 'others'){
                    //     this.$emit("timeChange", emitTime);
                    // }
                    
                    return false
                }
            }
        }
        
    }
    changeYear(flag){
        let index = this.state.currentIndex;
        if(flag === 'prev') {
            if (index < this.state.originDate.length-1) {
                // this.state.selectItemIndex = -1;
                this.setState({
                    selectItemIndex: -1
                })
                index++;
            }
        } else {
            if (index > 0) {
                // this.state.selectItemIndex = -1;
                this.setState({
                    selectItemIndex: -1
                })
                index--;
            }
        }
        // this.state.currentIndex = index;
        this.setState({
            currentIndex: index
        })
    }
    changeDateType (type) {
        this.setState({
            dateType: type,
            selectItemIndex: -1
        })
        // this.state.dateType = type;
        // this.state.selectItemIndex = -1;
    }
    changeItemStatus (item, index) {
        if (item.mark) {
            // this.state.selectItemIndex = index;
            this.setState({
                selectItemIndex: index
            })
        }
    }
    cancel() {
        // this.state.show = false;
        this.setState({
            show: false
        })
    }
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
            default: 
                return ''
        }
        return name
    }
    showDateSelect () {
        // this.state.showSelect = !this.state.showSelect;
        let showSelect = this.state.showSelect
        this.setState({
            showSelect: !showSelect
        })
    }
    confirmDate () {
        // this.state.show = false;
        // if(this.state.selectItemIndex == -1){
        //     this.state.dateType = 4;
        //     this.state.selectItemIndex = 0;
        // }
        // let typeName = this.state.switchTypeName(this.state.dateType);
        // let dates = this.state.currentDate.data[typeName][this.state.selectItemIndex].date
        // this.state.currentTime = this.state.currentYear + '年' + dates;
        // let emitTime = {
        //     year: this.state.currentYear,
        //     msg: dates == '全年' ? '': dates
        // }
        // if(this.state.platFormType == 'netfood'){
        //     sessionStorage.setItem('netfoodTime', JSON.stringify(emitTime));
        // }
        // if(this.state.platFormType == 'foodWaste'){
        //     sessionStorage.setItem('foodWasteTime', JSON.stringify(emitTime));
        // }
        // this.state.$emit("timeChange", emitTime);
        
    }
     
    componentDidMount(){
        this.init()
    }
    render(){
        const content = (
            <div className="">
                <div className="date-container">
                    <div className="date-box">
                        <div className="date-type">
                            <span onClick={this.changeDateType.bind(this,1)} className={this.state.dateType === 1 ? 'item active' : 'item' }>月度</span>
                            <span onClick={this.changeDateType.bind(this,4)} className={this.state.dateType === 4 ? 'item active' : 'item' }>年</span>
                        </div>
                         <div className="date-year">
                            <span onClick={this.changeYear.bind(this,'prev')} className={this.state.currentIndex >= (this.state.originDate.length-1) ? 'item prev-year disabled' : ''}>上一年</span>
                            <span className="item current-year">{ this.state.currentYear }</span>
                            <span onClick={this.changeYear.bind(this,'next')} className={this.state.currentIndex <= 0 ? 'item next-year disabled' : ''}>下一年</span>
                        </div>
                        {/* <DateTimebox currentDate={this.state.currentDate} dateType={this.state.dateType}/> */}
                        {
                            this.state.currentDate && 
                            <div className="date-item-box">123</div>
                        }
                        {/* <div className="date-item-box" v-show="currentDate.data">
                            日期类型 
                            <div className="type-month" v-show="dateType === 1">
                                <span className="item" v-for="(item, index) in currentDate.data.month" :key="index" :className="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" onClick="changeItemStatus(item,index)">{{ item.date }}</span>
                            </div>
                            <div className="type-allyear" v-show="dateType === 4">
                                <span className="item" v-for="(item, index) in currentDate.data.allYear" :key="index" :className="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" onClick="changeItemStatus(item,index)">{{ item.date }}</span>
                            </div>
                        </div> */}
                        {/*
                        <div className="date-footer">
                            <div className="left">{{ currentTime }}</div>
                            <div className="right">
                                <span className="btn cancel" onClick="cancel()">取消</span>
                                <span className="btn ok" onClick="confirmDate()">确定</span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        )
        return (
            <div className="dateSelect">
            <Popover placement="bottomLeft" content={content} title="" trigger="click" className="dateContainer">
                <Button>Click</Button>
            </Popover>
            </div>
        );
    }
}