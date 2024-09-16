import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { Menu, Icon, Table } from 'antd'
import 'antd/dist/antd.css'

import axios from 'axios'
import '../styles/index.scss'
// import About from './About'
import Header from './header/header'

const SubMenu = Menu.SubMenu

export default class IndexContent extends Component {

    rootSubmenuKeys = ['sub1', 'sub2'];

    constructor(props) {
        super(props);
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
            }
        }
    }
    setTable() {
    }
    async getData() {
        let res = await axios.get('/api/tables');
        this.setState({
            dataSource: res.data.data
        })
    }

    async getMenuData() {
        let res = await axios.get('/api/menuData');
        this.setState({
            subMenu: res.data.data
        })
    }
    menuList() {
        const htmls = this.state.subMenu.map((item) => {
            return (
                <SubMenu key={item.key} title={<span><Icon type={item.titleIcon} /><span>{item.subValue}</span></span>}>
                    {
                        item.menuItem.map((iitem) => {
                            return (
                                <Menu.Item key={iitem.key}>
                                    
                                    <Link to={iitem.value}>{iitem.label}</Link>
                                </Menu.Item>
                            )
                        })
                    }
                </SubMenu>
            )
        })
        return htmls
    }

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    // 组件将要挂载
    componentWillMount() {

    }
    // 组件渲染完成
    componentDidMount() {
        this.getData();
        this.getMenuData();
    }
    // 
    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps');
    }
    // shouldComponentUpdate (nextProps,nextState) {
    //     // console.log('shouldComponentUpdate');
    //     return true
    // }
    componentWillUpdate(nextProps, nextState) {
        // console.log('componentWillUpdate');
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log('componentDidUpdate');
    }
    render() {
        return (
            <div className="indexContent">
                <Header headTitle={this.state.headTitle}/>
                <div className="left">
                    <Menu
                        mode="inline"
                        openKeys={this.state.openKeys}
                        onOpenChange={this.onOpenChange}
                        style={{ width: 200 }}
                    >
                        {this.menuList()}
                    </Menu>
                </div>
                <div className="right">
                    {this.props.children}
                </div>
            </div>
        );
    }
    componentWillUnmount() {
    }
}