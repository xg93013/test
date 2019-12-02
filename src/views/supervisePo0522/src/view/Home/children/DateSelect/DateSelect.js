import React, { Component } from 'react'
import { Icon, Popover } from 'antd'
import 'antd/dist/antd.css'

import './dateSelect.scss'
import allDate from './originDate.js'
import http from "../../../../unit/http.js";
import apis from "../../../../unit/apis.js";

const {
    LISTDATE
} = apis;

export default class DateSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            currentTime: "", // 当前时间
            currentIndex: 0,
            dateType: 1,
            originDate: '',
            selectItemIndex: -1,
            currentItemIndex: -1,
            platform: '',
            currentDate: '',
            currentYear: '',
            selectYear: ''
        }
    }
    async init() {
        let date = new Date();
        let month = '';
        let res = '';
        this.setState({
            currentIndex: 0,
            currentDate: allDate.allDate[0],
            originDate: allDate.allDate,
            currentYear: allDate.allDate[0].years,
            dateType: 1
        })
        let resa = await http.get(LISTDATE);
        // resa = {};
        if (resa && resa.data) {
            res = resa.data;
            if (resa.data.allDate && resa.data.allDate.length > 0) {
                this.setState({
                    currentIndex: 0,
                    originDate: res.allDate,
                    dateType: 1
                })
                for (let j = 0; j < res.allDate.length; j++) {
                    for (let i = 11; i > -1; i--) {
                        if (res.allDate[j].data.month[i].mark) {
                            month = res.allDate[j].data.month[i].date;
                            let currentDate = res.allDate[this.state.currentIndex];
                            let currentYear = res.allDate[this.state.currentIndex].years;
                            let currenttime = currentYear + '年' + month;

                            this.setState({
                                currentDate: currentDate,
                                currentYear: currentYear,
                                selectYear: currentYear,
                                currentTime: currenttime,
                                selectItemIndex: i,
                                currentItemIndex: i
                            })

                            let emitTime = {
                                year: currentYear,
                                msg: month
                            }
                            this.props.changeTime(emitTime);
                            return false
                        }
                    }
                }
            } else {
                this.props.changeTime({
                    year: date.getFullYear(),
                    msg: date.getMonth() + 1 + '月'
                });
            }
        } else {
            this.props.changeTime({
                year: date.getFullYear(),
                msg: date.getMonth() + 1 + '月'
            });
        }

    }
    changeYear(flag) {
        let index = this.state.currentIndex;
        if (flag === 'prev') {
            if (index < this.state.originDate.length - 1) {
                this.setState({
                    selectItemIndex: -1
                })
                index++;
            }
        } else {
            if (index > 0) {
                this.setState({
                    selectItemIndex: -1
                })
                index--;
            }
        }
        this.setState({
            currentIndex: index,
            currentDate: this.state.originDate[index],
            currentYear: this.state.originDate[index].years
        })
    }
    changeDateType(type) {
        this.setState({
            dateType: type,
            selectItemIndex: -1
        })
    }
    changeItemStatus(item, index) {
        if (item.mark) {
            this.setState({
                selectItemIndex: index
            })
        }
    }
    cancel() {
        this.setState({
            visible: false
        })
    }
    switchTypeName(i) {
        let name = ''
        switch (i) {
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
    confirmDate() {
        let dateType = this.state.dateType;
        let selectItemIndex = this.state.selectItemIndex;
        if (this.state.selectItemIndex === -1) {
            dateType = 4;
            selectItemIndex = 0;
        }
        if (dateType === 4) {
            selectItemIndex = 0;
        }

        let typeName = this.switchTypeName(dateType);
        let dates = this.state.currentDate.data[typeName][selectItemIndex].date;
        let currentTime = this.state.currentYear + '年' + dates;

        if (dateType === 4) {
            if (this.state.currentDate.data.allYear[0].mark) {
                this.refreshDate(dateType, selectItemIndex, currentTime, dates);
            }
        } else {
            this.refreshDate(dateType, selectItemIndex, currentTime, dates);
        }
    }
    refreshDate(dateType, selectItemIndex, currentTime, dates) {
        this.setState({
            visible: false,
            dateType: dateType,
            selectItemIndex: selectItemIndex,
            selectYear: this.state.currentYear,
            currentItemIndex: selectItemIndex,
            currentTime: currentTime
        })
        let emitTime = {
            year: this.state.currentYear,
            msg: dates === '全年' ? '' : dates
        }
        if (currentTime !== this.state.currentTime) {
            this.props.changeTime(emitTime);
        }
    }
    componentWillMount() {
        this.init();
    }
    componentDidMount() { }
    handleVisibleChange = visible => {
        this.setState({
            visible: visible
        });
        if (this.state.currentYear === this.state.selectYear) {
            this.setState({
                selectItemIndex: this.state.currentItemIndex
            })
        }
    }
    render() {
        return (
            <div className="dateSelect">
                <Popover placement="bottomLeft" content={
                    (
                        <div className="">
                            <div className="date-container">
                                <div className="date-box">
                                    <div className="date-type">
                                        <span onClick={this.changeDateType.bind(this, 1)} className={this.state.dateType === 1 ? 'item active' : 'item'}>月度</span>
                                        <span onClick={this.changeDateType.bind(this, 4)} className={this.state.dateType === 4 ? 'item active' : 'item'}>年度</span>
                                    </div>
                                    <div className="date-year">
                                        <span onClick={this.changeYear.bind(this, 'prev')} className={this.state.currentIndex >= (this.state.originDate.length - 1) ? 'item prev-year disabled' : 'item'}>上一年</span>
                                        <span className="item current-year">{this.state.currentYear}</span>
                                        <span onClick={this.changeYear.bind(this, 'next')} className={this.state.currentIndex <= 0 ? 'item next-year disabled' : 'item'}>下一年</span>
                                    </div>
                                    <div className="date-item-box" style={{ display: this.state.currentDate.data ? 'block' : 'none' }}>
                                        <div className="type-month" style={{ display: this.state.dateType === 1 ? 'block' : 'none' }}>
                                            {
                                                this.state.currentDate.data.month.map((item, i) => (
                                                    <span className={['item', !item.mark ? 'disabled' : '', i === this.state.selectItemIndex ? 'active' : ''].join(' ')} key={i} onClick={this.changeItemStatus.bind(this, item, i)}>{item.date}</span>
                                                ))
                                            }
                                            {/* <span className="item" v-for="(item, index) in currentDate.data.month" :key="index" :className="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" onClick="changeItemStatus(item,index)">{{ item.date }}</span> */}
                                        </div>
                                        <div className="type-allyear" style={{ display: this.state.dateType === 4 ? 'block' : 'none' }}>
                                            {
                                                this.state.currentDate.data.allYear.map((item, i) => (
                                                    <span className={['item', !item.mark ? 'disabled' : '', i === this.state.selectItemIndex ? 'active' : ''].join(' ')} key={i} onClick={this.changeItemStatus.bind(this, item, i)}>{item.date}</span>
                                                ))
                                            }
                                            {/* <span className="item" v-for="(item, index) in currentDate.data.allYear" :key="index" :className="{'disabled' : !item.mark, 'active' : index === selectItemIndex}" onClick="changeItemStatus(item,index)">{{ item.date }}</span> */}
                                        </div>
                                    </div>

                                    <div className="date-footer">
                                        <div className="left">{this.state.currentTime}</div>
                                        <div className="right">
                                            <span className="btn cancel" onClick={() => { this.cancel() }}>取消</span>
                                            <span className="btn ok" onClick={() => { this.confirmDate() }}>确定</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                } title="" visible={this.state.visible} trigger="click" overlayClassName="dateContainer" onVisibleChange={this.handleVisibleChange}>
                    <div className="time-cons">
                        {this.state.currentTime}
                        <Icon type="calendar" style={{ marginLeft: "10px" }} />
                    </div>
                </Popover>
            </div>
        );
    }
}