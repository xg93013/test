import React from "react";
import { Menu, Dropdown } from "antd";

const menu = (
    <Menu>
        <Menu.Item key="0">
            <span>修改密码</span>
        </Menu.Item>
        <Menu.Item key="1">
            <span>退出登录</span>
        </Menu.Item>
    </Menu>
);

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "admin"
        }
    }
    render() {
        return (
            <div id="Header">
                <div className="left">监管效能辅助评价系统</div>
                <div className="right">欢迎回来！{this.state.userName}
                    <Dropdown overlay={menu} trigger={['click']}>
                        <img src={require("./images/heada.png")} alt=""/>
                    </Dropdown>
                </div>
            </div>
        )
    }

}

export default Index
