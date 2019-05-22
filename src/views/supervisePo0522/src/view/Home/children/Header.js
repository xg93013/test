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

    render() {
        return (
            <div id="Header">
                <div className="left">监管效能辅助评价系统</div>
                <div className="right">欢迎回来！
                    <Dropdown overlay={menu} trigger={['click']}>
                        <span>admin</span>
                    </Dropdown>
                </div>
            </div>
        )
    }

}

export default Index
