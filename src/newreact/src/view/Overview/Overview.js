import React from "react";
import { Input, Icon, Progress, Modal } from "antd";
import ModalList from "./ModalList";
import ModalLista from "./ModalLista";
import "./Overview.scss"

const Search = Input.Search;

class Overview extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datas: [{
                name: "行政处罚数据",
                color: "#56B161"
            }, {
                name: "日常监察数据",
                color: "#64707D"
            }, {
                name: "食材溯源数据",
                color: "#F2884F"
            }, {
                name: "明厨亮灶数据",
                color: "#EAD43D"
            }, {
                name: "网络订餐数据",
                color: "#276AB0"
            }, {
                name: "餐厨垃圾数据",
                color: "#6C8FEC"
            }, {
                name: "监督抽检数据",
                color: "#C960F9"
            }],
            searchDatas: [],
            value: "",
            visible: false,
            visiblea: false
        }
    }

    pageBack() {
        this.setState({
            value: ""
        })
        this.props.pageBack();
    }

    keyWordChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    keyWordSearch() {

    }

    allMsgs() {
        this.setState({
            visible: true
        })
    }

    gradeMsg() {
        this.setState({
            visiblea: true
        })
    }

    render() {
        return (
            <div className="over-view">
                <div className="over-view-top">
                    <div className="over-view-title" onClick={this.pageBack.bind(this)}>
                        <Icon style={{ color: "#276AB0", fontSize: "22px" }} type="left" />
                        餐饮企业概述
                    </div>
                    <div className="over-view-search-box">
                        <Search
                            value={this.state.value}
                            placeholder="请输入要查询的企业名称"
                            onChange={this.keyWordChange.bind(this)}
                            onSearch={this.keyWordSearch.bind(this)}
                            enterButton
                        />
                        <div className="search-box-lists" style={{ display: this.state.searchDatas.length ? "block" : "none" }}>
                            {this.state.searchDatas.map((item, index) => {
                                return <div key="index"></div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="base-msg">
                    <div className="msg-title">基本信息</div>
                    <div className="left">
                        <Progress
                            style={{
                                marginBottom: "16px"
                            }}
                            type="circle"
                            gapPosition="right"
                            strokeColor="#56B161"
                            percent={75}
                            width={160}
                            format={() => <div onClick={this.gradeMsg.bind(this)} style={{ lineHeight: "28px", cursor: "pointer" }}>
                                <span style={{ fontSize: "80px", color: "#71B970" }}>A</span><br />
                                <span style={{ fontSize: "18px", color: "#666" }}>监管等级</span>
                            </div>} /> <br />
                        <span style={{ fontSize: "31px" }}>
                            本期得分：
                            <span style={{ fontSize: "41px", color: "#56B161" }}>97</span>
                        </span> <br />
                        <span style={{ fontSize: "22px" }}>XXXXXXX有限责任公司</span>
                    </div>
                    <div className="right">
                        企业名称：成都大风吹餐饮管理有限责任公司 <br />
                        所属区域：金牛区-XX街道 <br />
                        企业地址：成都市金牛区马家花园路 <br />
                        统一社会信用代码：510xxxxxxxxxx <br />
                        食品经营许可证：JY51xxxxxxxx
                    </div>
                </div>
                <div className="supervise-msg">
                    <div className="msg-title">监管信息</div>
                    <div className="supervise-content">
                        {this.state.datas.map((item, index) => {
                            return <div key={index}>
                                <div>
                                    <div className="bg" style={{ background: item.color }}></div>
                                    <div className="supervise-name">
                                        {item.name}
                                    </div>
                                    <div className="detail-msg">
                                        <Progress
                                            style={{
                                                marginBottom: "16px"
                                            }}
                                            type="circle"
                                            gapPosition="right"
                                            strokeColor={item.color}
                                            percent={100}
                                            width={120}
                                            format={() => <div onClick={this.allMsgs.bind(this)} style={{ lineHeight: "22px", cursor: "pointer" }}>
                                                <span style={{ fontSize: "30px", color: item.color }}>70</span>
                                                <span style={{ fontSize: "18px", color: item.color }}>次</span><br />
                                                <span style={{ fontSize: "14px", color: "#666" }}>累计处罚</span>
                                            </div>} /> <br />
                                        <div>
                                            <i></i>本月<span style={{ cursor: "pointer", textDecoration: "underline", color: "#276AB0" }}>10</span>次 <br />
                                            <i></i>累计预警<span style={{ cursor: "pointer", textDecoration: "underline", color: "#276AB0" }}>10</span>条 <br />
                                            <i></i>本月预警<span style={{ cursor: "pointer", textDecoration: "underline", color: "#276AB0" }}>10</span>条
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                <Modal
                    className="overview-pop"
                    maskClosable={false}
                    width="1200px"
                    title="累计抽检记录"
                    visible={this.state.visible}
                    onCancel={() => { this.setState({ visible: false }) }}>
                    <ModalList />
                </Modal>
                <Modal
                    className="overview-pop"
                    maskClosable={false}
                    width="1000px"
                    title="行业评级信息"
                    visible={this.state.visiblea}
                    onCancel={() => { this.setState({ visiblea: false }) }}>
                    <ModalLista />
                </Modal>
            </div>
        )
    }

}

export default Overview