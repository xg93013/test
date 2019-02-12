import React from "react";
import { Menu, Dropdown, Modal } from "antd";

class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userMsg: "张三"
        }
    }

    out() {
        console.log(1)
    }

    loginOut() {
        let _this = this;
        Modal.confirm({
            title: "提示",
            content: "确定要退出登录？",
            okText: "确认",
            cancelText: "取消",
            onOk() {
                _this.out();
            },
            centered: true
        })
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <div>修改密码</div>
                </Menu.Item>
                <Menu.Item key="1">
                    <div onClick={this.loginOut.bind(this)}>退出登录</div>
                </Menu.Item>
            </Menu>
        );
        const isPlat = this.props.history.location.pathname === "/platform";
        return (
            <div id="header" style={{ paddingLeft: isPlat ? 0 : "30px", color: isPlat ? "#fff" : "#276AB0", background: isPlat ? "#276AB0" : "#fff", textAlign: isPlat ? "center" : "left" }}>
                <img src={require(isPlat ? "./images/logo.png" : "./images/logoa.png")} alt="" /> {this.props.navName}
                <div className="user-name" style={{ color: isPlat ? "#fff" : "#B0B0B0" }}>
                    欢迎回来，{this.state.userMsg}
                </div>
                <Dropdown className="user-msg" overlay={menu} trigger={["click"]}>
                    <div>
                        <img src={require(isPlat ? "./images/heada.png" : "./images/head.png")} alt="" />
                    </div>
                </Dropdown>
            </div>
        )
    }
}

export default Header;