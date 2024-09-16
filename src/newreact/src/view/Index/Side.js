import React from "react";
import { NavLink } from "react-router-dom";
import { Tooltip } from "antd";
import ReactSVG from "react-svg";

class Side extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            navLinks: [{
                text: "餐饮智慧监管平台",
                path: "/platform"
            }, {
                text: "餐饮智慧监管地图",
                path: "/map"
            }, {
                text: "餐饮企业全息档案",
                path: "/archives"
            }, {
                text: "餐饮监管预警中心",
                path: "/analysis"
            }, {
                text: "预警处置核查结果",
                path: "/result"
            }]
        }
    }

    render() {
        return (
            <div id="side" style={{ width: this.props.history.location.pathname === "/platform" ? 0 : "70px" }}>
                {this.state.navLinks.map((item, index) => {
                    return (
                        <Tooltip key={index} placement="right" title={item.text}>
                            <NavLink className="side-list" to={item.path} key={item.text} activeClassName="side-active">
                                <ReactSVG className="side-svg" src={require("./images/svg_" + index + ".svg")} />
                            </NavLink>
                        </Tooltip>
                    )
                })}
                <Tooltip placement="right" title="餐饮服务等级评定">
                    <div className="side-list">
                        <ReactSVG className="side-svg" src={require("./images/svg_5.svg")} />
                    </div>
                </Tooltip>
            </div>
        )
    }
}

export default Side