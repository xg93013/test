import React from "react";
import { connect } from 'react-redux';
import { Icon } from "antd";
import "./Loading.scss";
class Loading extends React.Component {

    render() {
        return (
            <div id="loadingBox"
                className={this.props.isLoading ? "loading-show" : ""}
                style={{ left: this.props.history.location.pathname === "/result" ? "270px" : "70px" }}>
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                    <Icon style={{ color: "#276AB0", fontSize: "22px" }} type="sync" spin />
                    <span className="loading-text">加载中...</span>
                </div>
            </div>
        )
    }

}

export default connect(state => ({
    isLoading: state.isLoading
}))(Loading)