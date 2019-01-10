import React, { Component } from 'react'
import '../../styles/about.scss'
import axios from 'axios'
import { Table, Select, Input, Button, } from 'antd'
import 'antd/dist/antd.css'
import Header from '../header/header'
import Nav from '../nav/nav'

const Option = Select.Option;

export default class About extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headTitle: 'admin',
            text: '132',
            dataSource: [],
            openKeys: [],
            columns: [{
                title: 'num',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: 'num',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: 'num',
                dataIndex: 'num',
                key: 'num',
            }, {
                title: 'num',
                dataIndex: 'address',
                key: 'address',
            }],
            subMenu: [],
            chartOption: '',
            form: {
                userName: '',
                password: ''
            },
            leftList: []
        }
        this.keySearch = this.keySearch.bind(this);
        // this.selectLevel.bind = this.selectLevel.bind.bind(this);
    }
    async getData() {
        let res = await axios.get('/api/tables');
        this.setState({
            dataSource: res.data.data
        })
    }
    async getLeftList() {
        let res = await axios.get('/api/leftList')
        this.setState({
            leftList: res.data.data
        })
    }
    handleChange(value) {
        // console.log(value)
    }
    componentDidMount() {
        this.getData();
        this.getLeftList();
    }
    selectLevel(level) {
        console.log(level)
    }
    keySearch(keyWord) {
        let newList = [];
        for (let i = 0; i < 10; i++) {
            newList.push({
                name: '成都大风炊餐饮管理有限责任公司',
                address: '金牛区-XX街道',
                area: '金牛区',
                percent: '10'
            })
        }
        this.setState({
            leftList: newList
        })
    }
    render() {
        const {
            dataSource,
            columns
        } = this.state
        return ( <
            div className = "aboutCon" >
            <
            Header headTitle = { this.state.headTitle }
            /> <
            Nav {...this.props }
            /> <
            div className = "abouts" >
            <
            div className = "filters" >
            <
            div className = "leftFilter" >
            <
            div className = "left-search" >
            <
            Input v - model = "leftFilter.keyWork"
            placeholder = "请输入要查询的企业名称"
            className = "leftInput float-item" / >
            <
            Button type = "primary"
            icon = "search"
            width = "40"
            className = "leftBtn float-item"
            onClick = { this.keySearch } > < /Button> < /
            div > <
            div className = "left-list" >
            <
            div className = "head" > TOP10 < /div> <
            div className = "item-box" > {
                this.state.leftList.map((item, i) => ( <
                        div className = "item"
                        key = { i } >
                        <
                        div className = "left" >
                        <
                        span className = "inItem" > { item.name } < /span> <
                        span className = "inItem" > 所属区域： { item.area } < /span> <
                        span className = "inItem" > { item.address } < /span> < /
                        div > <
                        div className = "right" >
                        <
                        Progress type = "circle"
                        percent = { item.percent } > < /Progress> { / * < el - progress type = "circle": percentage = "Number(item.percent)": width = "60" > < /el-progress> */
                    } <
                    /div> < /
                    div >
                ))
        }

        <
        /div>

        <
        /div> < /
        div >

            <
            div className = "rightFilter" >
            <
            div className = "select-box" >
            <
            Select defaultValue = "lucy"
        style = {
            { width: 120 }
        }
        onChange = { this.handleChange } >
            <
            Option value = "jack" > Jack < /Option> <
        Option value = "lucy" > Lucy < /Option> <
        Option value = "disabled"
        disabled > Disabled < /Option> <
        Option value = "Yiminghe" > yiminghe < /Option> < /
        Select > <
            /div> <
        div className = "color-range" >
            <
            span className = "item"
        onClick = { this.selectLevel.bind(this, 1) } > < /span> <
        span className = "item"
        onClick = { this.selectLevel.bind(this, 2) } > < /span> <
        span className = "item"
        onClick = { this.selectLevel.bind(this, 3) } > < /span> <
        span className = "item"
        onClick = { this.selectLevel.bind(this, 4) } > < /span> <
        span className = "item"
        onClick = { this.selectLevel.bind(this, 5) } > < /span> < /
        div > <
            /div>

        <
        /div> <
        div className = "tableList" >
            <
            Table dataSource = { dataSource }
        columns = { columns }
        /> < /
        div >

            <
            /div> < /
        div >
    );
}
}