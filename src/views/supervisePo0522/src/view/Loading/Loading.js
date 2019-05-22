import React from "react";
import { Icon } from "antd";
import "./Loading.scss";
class Loading extends React.Component {

    render() {
        let {
            loading,
            loadingText,
            fixed
        } = this.props;
        return (
            <div
                className={"loading-box " + (loading ? "loading-show" : "")}
                style={{
                    position: fixed ? "fixed" : "absolute",
                    top: "80px",
                    left: 0
                }}
            >
                <div style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)"
                }}>
                    <Icon
                        style={{
                            color: "#276AB0",
                            fontSize: "22px"
                        }}
                        type="sync"
                        spin
                    />
                    <span className="loading-text">{loadingText || "加载中..."}</span>
                </div>
            </div>
        )
    }

}

export default Loading