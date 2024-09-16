import React from "react";
import { Menu, Dropdown } from "antd";
import http from "../../../unit/http.js";

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "admin",
            newBaseUrl: "",
            baseUrl: "",
            userMsg: ""
        }
    }
    async getUserMsg() {
        let [userInfo, outUrl] = await Promise.all([
            http.get("/oidc/user/base-info"),
            http.get("/oidc/app-info")
        ]);
        if (userInfo) {
            this.setState({
                userMsg: userInfo.data.name
            })
        }
        if (outUrl) {
            let { indexUrl } = outUrl.data;
            this.setState({
                newBaseUrl: indexUrl,
                baseUrl: window.location.href.slice(0, "#") + "frontchannel_logout"
            });
            sessionStorage.setItem("newBaseUrl", indexUrl);
        }
    }

    editPassWord() {
        let { newBaseUrl } = this.state;
        window.open(
            newBaseUrl + "#/modifyPassword",
            "newwindow",
            "height=400, width=800,left=400,top=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"
        );
    }
    componentDidMount() {
        this.getUserMsg();
    }
    render() {
        return (
            <div id="Header">
                <div className="left">区县监管效能数字化评价系统</div>
                <div className="right">欢迎回来！{this.state.userMsg}
                    <Dropdown overlay={
                        (
                            <Menu>
                                <Menu.Item key="0">
                                    <span onClick={() => { this.editPassWord() }}>修改密码</span>
                                </Menu.Item>
                                <Menu.Item key="1">
                                    <a href={this.state.baseUrl} >退出登录</a>
                                </Menu.Item>
                            </Menu>
                        )
                    } trigger={['click']}>
                        <img src={require("./images/heada.png")} alt="" />
                    </Dropdown>
                </div>
            </div>
        )
    }

}

export default Index
