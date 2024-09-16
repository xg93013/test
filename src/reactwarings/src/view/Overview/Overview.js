import React from "react";
import {
    Input,
    Icon,
    Progress,
    Modal,
    Popover
} from "antd";
import ModalList from "./ModalList";
import ModalLista from "./ModalLista";
import ModalListb from "./ModalListb";
import "./Overview.scss";
import apis from "../../unit/apis";
import http from "../../unit/http";

const {
    ORG_DETAIL,
    DETAIL_SEARCH
} = apis;

let myInter = null

class Overview extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datas: [{
                name: "行政处罚数据",
                color: "#56B161"
            }, {
                name: "日常监管数据",
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
            searchWord: "",
            visible: false,
            visiblea: false,
            popShow: false,
            detailName: "",
            baseMsg: {

            },
            dataMsg: [],
            type: "",
            typeTxt: ""
        }
        this.pageBack = this.pageBack.bind(this);
        this.keyWordSearch = this.keyWordSearch.bind(this);
        this.gradeMsg = this.gradeMsg.bind(this);
        this.popChange = this.popChange.bind(this);
        this.allMsgs = this.allMsgs.bind(this);
    }

    pageBack() {
        this.setState({
            value: ""
        })
        this.props.pageBack();
    }



    keyWordSearch(e) {
        clearTimeout(myInter)
        let searchWord = e.target.value;
        if (searchWord) {
            this.setState({
                searchWord,
                popShow: true
            });
            myInter = setTimeout(() => {
                this.getOrgLists()
            }, 200)
        } else {
            this.setState({
                searchWord,
                searchDatas: []
            })
        }
    }

    allMsgs(detailName, type, typeTxt) {
        let orgName = this.state.baseMsg.name;
        this.setState({
            visible: true,
            detailName,
            type,
            typeTxt
        });
        setTimeout(() => {
            this.refs.detailMsg.setDatas(detailName, orgName, type)
        })
    }

    getTxt(index, month) {
        switch (index) {
            case 0:
                return (month ? "本月" : "累计") + "处罚";
            case 1:
                return (month ? "本月" : "累计") + "监管";
            case 4:
                return (month ? "本月" : "累计") + "预警";
            case 6:
                return (month ? "本月" : "累计") + "抽检";
            default:
                return (month ? "本月" : "累计") + "数据";
        }
    }

    gradeMsg(name) {
        return false;
        // this.setState({
        //     visiblea: true
        // });
        // setTimeout(() => {
        //     this.refs.getLevel.getDatas(name);
        // })
    }

    popChange(popShow) {
        this.setState({
            popShow
        })
    }

    async getOrgLists() {
        let { searchWord } = this.state;
        let res = await http.get(DETAIL_SEARCH + "/" + searchWord + "/1");
        if (res) {
            this.setState({
                searchDatas: [...res.data.content]
            })
        }
    }

    searchDetails(searchWord, qylsh) {
        this.setState({
            searchWord,
            popShow: false
        });
        setTimeout(() => {
            this.getOrgLists();
        })
        this.getDetails(qylsh)
    }

    async getDetails(value) {
        this.props.changeLoading(true)
        let res = await http.get(ORG_DETAIL + value);
        if (res) {
            this.props.changeLoading(false)
            let {
                address,
                area,
                businessLicense,
                idno,
                zzjgdm,
                businessPermit,
                name,
                score,
                level,
                punishData,
                regulatoryData,
                foodTraceData,
                kitchenData,
                orderDatas,
                kitchenWasteData,
                foodCheckData,
                jyfw
            } = res.data
            this.setState({
                baseMsg: {
                    address,
                    area,
                    businessLicense,
                    idno,
                    zzjgdm,
                    businessPermit,
                    name,
                    score,
                    level,
                    jyfw
                },
                dataMsg: [punishData, regulatoryData, foodTraceData, kitchenData, orderDatas, kitchenWasteData, foodCheckData]
            })

        }
    }

    render() {
        let {
            searchDatas,
            datas,
            visible,
            visiblea,
            popShow,
            searchWord,
            baseMsg,
            dataMsg,
            detailName,
            typeTxt
        } = this.state;

        let {
            address,
            area,
            businessLicense,
            idno,
            zzjgdm,
            businessPermit,
            name,
            score,
            level,
            jyfw
        } = baseMsg

        return (
            <div className="over-view">
                <div className="over-view-top">
                    <div className="over-view-title" onClick={this.pageBack}>
                        <Icon
                            style={{
                                color: "#276AB0",
                                fontSize: "22px"
                            }}
                            type="left"
                        />
                        餐饮企业概述
                    </div>
                    <div className="over-view-search-box">
                        <Popover
                            content={<div
                                className="search-box-lists"
                            >
                                <span style={{
                                    display: searchDatas.length ? "none" : "block",
                                    fontSize: "16px"
                                }}>无结果</span>
                                {searchDatas.map((item, index) => {
                                    return <div
                                        key={index}
                                        onClick={() => this.searchDetails(item.name, item.qylsh)}
                                    >{item.name}</div>
                                })}
                            </div>}
                            trigger="focus"
                            placement="bottomLeft"
                            visible={popShow}
                            onVisibleChange={this.popChange}
                        >
                            <Input
                                placeholder="请输入要查询的企业名称"
                                value={searchWord}
                                onChange={this.keyWordSearch}
                            />
                        </Popover>
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
                            percent={100}
                            width={160}
                            format={() => <div onClick={() => this.gradeMsg(name)} style={{ lineHeight: "28px" }}>
                                <span style={{ fontSize: "80px", color: "#71B970" }}>{level || "--"}</span><br />
                                <span style={{ fontSize: "18px", color: "#666" }}>监管等级</span>
                            </div>}
                        /> <br />
                        <span style={{ fontSize: "31px" }}>
                            本期得分：
                            <span style={{ fontSize: "41px", color: score ? "#56B161" : "#666" }}>{score || "--"}</span>
                        </span> <br />
                        {/* <span style={{ fontSize: "22px" }}>{name}</span> */}
                    </div>
                    <div className="right">
                        企业名称：{name} <br />
                        所属区域：{area} <br />
                        企业地址：{address} <br />
                        {
                            (() => {
                                if (idno) {
                                    return "统一社会信用代码"
                                }
                                if (businessLicense) {
                                    return "营业执照号码"
                                }
                                if (zzjgdm) {
                                    return "组织机构代码"
                                }
                                return "统一社会信用代码"
                            })()
                        }：{idno || businessLicense || zzjgdm || "暂无数据"}<br />
                        食品经营许可证：{businessPermit || "暂无数据"} <br />
                        经营项目：{jyfw || "暂无数据"}
                    </div>
                </div>
                <div className="supervise-msg">
                    <div className="msg-title">监管信息</div>
                    <div className="supervise-content">
                        {datas.map((item, index) => {
                            return <div key={index}>
                                <div>
                                    <div
                                        className="bg"
                                        style={{ background: item.color }}
                                    ></div>
                                    <div className="supervise-name">
                                        {item.name}
                                    </div>
                                    <div style={{
                                        height: "250px",
                                        lineHeight: "250px",
                                        fontSize: "16px",
                                        textAlign: "center",
                                        display: dataMsg[index] ? "none" : "block"
                                    }}>暂未接入</div>
                                    <div
                                        className="detail-msg"
                                        style={{ display: dataMsg[index] ? "block" : "none" }}
                                    >
                                        <Progress
                                            style={{
                                                marginBottom: "16px"
                                            }}
                                            type="circle"
                                            gapPosition="right"
                                            strokeColor={item.color}
                                            percent={100}
                                            width={120}
                                            format={() => <div onClick={() => this.allMsgs(item.name, "total", this.getTxt(index))} style={{ lineHeight: "22px", cursor: "pointer" }}>
                                                <span style={{ fontSize: "30px", color: item.color }}>{dataMsg[index] ? dataMsg[index].count : ""}</span>
                                                <span style={{ fontSize: "18px", color: item.color }}>条</span><br />
                                                <span style={{ fontSize: "14px", color: "#666" }}>
                                                    {this.getTxt(index)}
                                                </span>
                                            </div>}
                                        /> <br />
                                        <div style={{ height: "72px" }}>
                                            <span style={{
                                                display: index === 4 ? "none" : "inline"
                                            }}>
                                                <i></i>本月
                                                <span
                                                    onClick={() => this.allMsgs(item.name, "month", this.getTxt(index, true))}
                                                    style={{ cursor: "pointer", textDecoration: "underline", color: "#276AB0" }}
                                                >
                                                    {dataMsg[index] ? dataMsg[index].monthCount : ""}
                                                </span>条<br />
                                            </span>
                                            <span style={{
                                                display: index === 0 || index === 1 || index === 4 ? "none" : "inline"
                                            }}>
                                                <i></i>累计预警
                                                <span
                                                    style={{ cursor: "pointer", textDecoration: "underline", color: "#276AB0" }}
                                                    onClick={() => this.allMsgs(item.name, "warn", "累计预警")}
                                                >
                                                    {dataMsg[index] ? dataMsg[index].warn : ""}
                                                </span>条 <br />
                                            </span>
                                            <span style={{
                                                display: index === 0 || index === 1 ? "none" : "inline"
                                            }}>
                                                <i></i>本月预警
                                                <span
                                                    style={{ cursor: "pointer", textDecoration: "underline", color: "#276AB0" }}
                                                    onClick={() => this.allMsgs(item.name, "monthWarn", "本月预警")}
                                                >
                                                    {dataMsg[index] ? dataMsg[index].monthWarn : ""}
                                                </span>条
                                            </span>
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
                    title={name + detailName + " (" + typeTxt + ")"}
                    visible={visible}
                    onCancel={() => { this.setState({ visible: false }) }}>
                    {detailName === "监督抽检数据" ? <ModalList ref="detailMsg" /> : <ModalListb ref="detailMsg" detailName={detailName} />}
                </Modal>
                <Modal
                    className="overview-pop"
                    maskClosable={false}
                    width="1000px"
                    title="行业评级信息"
                    visible={visiblea}
                    onCancel={() => { this.setState({ visiblea: false }) }}>
                    <ModalLista ref="getLevel" />
                </Modal>
            </div>
        )
    }

}

export default Overview