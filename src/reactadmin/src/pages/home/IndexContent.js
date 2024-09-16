import React, { Component } from "react";
import { Route, Link, Redirect, Switch } from "react-router-dom";
import { Menu, Icon } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import "../../styles/index.scss";
import Header from "../header/header";
import Loading from "../../containers/Loading";
import { Provider } from "react-redux";
import store from "../../store/newstore";

import AsyncComponent from "../../component/asyncComponent";

// import { Switch } from 'antd';

// 异步组件
const Warning = AsyncComponent(() => import("../Warning/Warning"));
const Next = AsyncComponent(() => import("../next/next"));
const Logins = AsyncComponent(() => import("../Login/Login"));


const SubMenu = Menu.SubMenu;

export default class IndexContent extends Component {
  rootSubmenuKeys = ["sub1", "sub2"];

  constructor(props) {
    super(props);
    this.state = {
      headTitle: "admin",
      text: "132",
      openKeys: [],
      subMenu: [],
      chartOption: "",
      form: {
        userName: "",
        password: ""
      },
      routers: [{
        name: "warning",
        path: "/warning",
        component: Warning,
        auth: true
      }, {
        name: "next",
        path: "/next",
        component: Next,
        auth: true
      }],
      isLogin: false
    };
  }
  async getMenuData() {
    let res = await axios.get("/api/menuData");
    this.setState({
      subMenu: res.data.data
    });
  }
  menuList() {
    const htmls = this.state.subMenu.map(item => {
      return (
        <SubMenu
          key={item.key}
          title={
            <span>
              <Icon type={item.titleIcon} />
              <span>{item.subValue}</span>
            </span>
          }
        >
          {item.menuItem.map(iitem => {
            return (
              <Menu.Item key={iitem.key}>
                {/* {iitem.value} */}
                <Link to={iitem.value}>{iitem.label}</Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    });
    return htmls;
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };
  clickMenu = ({ key, item, path }) => {
    console.log(key);
  };
  // 组件将要挂载
  componentWillMount() { }
  // 组件渲染完成
  componentDidMount() {
    this.getMenuData();
  }
  //
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps');
  }
  componentWillUpdate(nextProps, nextState) {
    // console.log('componentWillUpdate');
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate');
  }
  render() {
    let { routers, isLogin } = this.state
    return (
      <div className="indexContent">
        <Header headTitle={this.state.headTitle} style={{ display: isLogin ? 'block' : 'none' }} />
        <div className="left" style={{ display: isLogin ? 'block' : 'none' }}>
          <Menu
            mode="inline"
            multiple={false}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            onClick={this.clickMenu}
            className="menus"
          >
            {this.menuList()}
          </Menu>
        </div>
        <div className="right">
          <Switch>
            {/* <Route path="/warning" render={() => {
              let coms = "";
              isLogin ? coms = Warning : coms = <Redirect to="login" />;
              return coms
            }} /> */}
            <Route path="/warning" render={() => {
              // return <Redirect to="/login" />
              return <Warning />
            }}></Route>
            {/* <Route path="/warning" component={Warning}></Route>
            <Route path="/next" component={Next} /> */}
            {/* {
              routers.map((item) => {
                return (
                  <Route path={item.path}
                    key={item.path}
                    render={() => {
                      let coms = ""
                      item.auth === true ?
                        isLogin === true ?
                          coms = <item.component /> :
                          coms = <Redirect to="login" /> : coms = <item.component />
                      return coms;
                      // return <Redirect to="warning" />;
                    }} />
                )
              })
            } */}
            <Route
              path="/"
              render={() => {
                return <Redirect to="/warning" />;
              }}
            />
            <Route path="/login" component={Logins} />
          </Switch>
          <Provider store={store}>
            <Loading />
          </Provider>
        </div>
      </div>
    );
  }
  componentWillUnmount() { }
}
