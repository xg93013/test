import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import "antd/dist/antd.css";

const { SubMenu } = Menu;

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navList: [
        {
          key: "0",
          label: "",
          iconName: "home",
          path: "/"
        },
        {
          key: "1",
          label: "",
          iconName: "riskMap",
          path: "/riskMap"
        },
        {
          key: "2",
          label: "3",
          iconName: "inspectResult",
          path: "/next"
        },
        {
          key: "3",
          label: "4",
          iconName: "inspectResult",
          path: "/next"
        }
      ]
    };
  }
  render() {
    return (
      <div className="sidebar">
        <ul className="nav">
          {/* {this.state.navList.map((item, i) => (
            <li
              className={
                this.props.location.pathname === item.path
                  ? "normalStyle currentStyle"
                  : "normalStyle"
              }
              key={i}
            >
              <Link
                to={`${item.path}`}
                style={{
                  backgroundImage:
                    this.props.location.pathname === item.path
                      ? "url(" +
                        require(`../../images/${item.iconName}a.png`) +
                        ")"
                      : "url(" +
                        require(`../../images/${item.iconName}.png`) +
                        ")"
                }}
              />
            </li>
          ))} */}
          <Menu style={{ width: "300px" }}>
            <Menu.Item>菜单项</Menu.Item>
            <SubMenu title="子菜单">
              <Menu.Item>子菜单项</Menu.Item>
            </SubMenu>
          </Menu>
        </ul>
      </div>
    );
  }
}
