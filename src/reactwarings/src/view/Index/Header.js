import React from "react";
import {
    Menu,
    Dropdown
} from "antd";
import http from "../../unit/http";
class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userMsg: "",
            baseUrl: "",
            newBaseUrl: ""
        }
        this.editPassWord = this.editPassWord.bind(this);
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
        let {
            userMsg,
            baseUrl
        } = this.state
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <div onClick={this.editPassWord}>修改密码</div>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href={baseUrl}>退出登录</a>
                </Menu.Item>
            </Menu>
        );
        const isPlat = this.props.history.location.pathname === "/platform";
        return (
            <div
                id="header"
                style={{
                    paddingLeft: isPlat ? 0 : "30px",
                    color: isPlat ? "#fff" : "#276AB0",
                    background: isPlat ? "#276AB0" : "#fff",
                    textAlign: isPlat ? "center" : "left"
                }}
            >
                <img
                    src={require(isPlat ? "./images/logo.png" : "./images/logoa.png")}
                    alt=""
                />&nbsp;
                {this.props.navName}
                <div
                    className="user-name"
                    style={{ color: isPlat ? "#fff" : "#B0B0B0" }}
                >
                    欢迎回来，{userMsg}
                </div>
                <Dropdown
                    className="user-msg"
                    overlay={menu}
                    trigger={["click"]}
                >
                    <div>
                        <img
                            src={require(isPlat ? "./images/heada.png" : "./images/head.png")}
                            alt=""
                        />
                    </div>
                </Dropdown>
            </div>
        )
    }
}

export default Header;