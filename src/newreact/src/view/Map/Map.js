import React from "react";
import { Map, Markers } from "react-amap";
import { Input, Select, Icon, Slider, Pagination, Row, Col, Progress } from "antd";
import "./Map.scss";
import Overview from "../Overview/Overview";

const popStyle = {
    color: "#666",
    fontSize: "18px"
};
const styleC = {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '30px',
    height: '40px'
};
const Search = Input.Search;
const Option = Select.Option;

class Cmap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            markers: [
                {
                    position: { longitude: 104.0766140918708, latitude: 30.6898746966148 },
                    myIndex: 0
                },
                {
                    position: { longitude: 104.10535542635515, latitude: 30.690852404255995 },
                    myIndex: 1
                }
            ],
            center: { longitude: 104.06, latitude: 30.67 },
            color: ["#CE383F", "#F48C47", "#FFF100", "#22AC38", "#00A0E9"],
            orgDatas: [],
            popShow: false,
            overViewShow: false
        }
    }

    renderFun(extData) {
        let background;
        if (extData.myIndex === 0) {
            background = `url(${require("./a5.png")})`;
        } else {
            background = `url(${require("./a3.png")})`;
        }

        return <div style={{ background, ...styleC }}></div>
    }

    rangBorderColor(e) {
        document.getElementsByClassName("ant-slider-handle-2")[0].style.borderLeftColor = e[0];
        document.getElementsByClassName("ant-slider-handle-1")[0].style.borderLeftColor = e[1];
    }

    rangeChange(e) {
        let n1 = 4 - parseInt(e[0] / 20),
            n2 = 4 - parseInt(e[1] / 20);
        let color = this.state.color;
        this.rangBorderColor([color[n2], color[n1]]);
    }

    keyWordSearch(e) {

    }

    orgDetail() {
        this.setState({
            popShow: true
        })
    }

    moreOrgMsg() {
        this.setState({
            overViewShow: true
        })
    }

    pageBack() {
        this.setState({
            overViewShow: false
        })
    }

    componentDidMount() {
        this.rangBorderColor([this.state.color[0], this.state.color[4]])
        let orgDatas = []
        for (let i = 0; i < 10; i++) {
            orgDatas.push({
                name: "钢管厂五区小郡肝串串香（春熙店）",
                area: "锦江区-春熙路街道",
                addr: "四川省成都市锦江区春熙路新街后巷子7号附7号",
                num: 80+i
            })
        }
        this.setState({
            orgDatas
        })
    }


    render() {
        return (
            <div id="map">
                <div style={{ display: this.state.overViewShow?"none":"block"}}>
                <div className="search-box">
                    <Search
                        placeholder="请输入要查询的企业名称"
                        onSearch={this.keyWordSearch.bind(this)}
                        enterButton
                    />
                </div>
                <div className="classify">
                    <Select defaultValue="lucy" suffixIcon={<Icon style={{ color: "#276AB0" }} type="caret-down" />} style={{ width: 120, marginRight: 20 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>Disabled</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <Select defaultValue="lucy" suffixIcon={<Icon style={{ color: "#276AB0" }} type="caret-down" />} style={{ width: 120, marginRight: 20 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>Disabled</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <Select defaultValue="lucy" suffixIcon={<Icon style={{ color: "#276AB0" }} type="caret-down" />} style={{ width: 120 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>Disabled</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                </div>
                <div className="slider-box">
                    <Slider vertical range defaultValue={[0, 100]} onAfterChange={this.rangeChange.bind(this)} />
                    <div className="rang">
                        {this.state.color.map((item, index) => {
                            let style = {
                                background: item
                            }
                            if (index === 0) {
                                style.borderTopLeftRadius = "9px"
                                style.borderTopRightRadius = "9px"
                            }

                            if (index === 4) {
                                style.borderBottomLeftRadius = "9px"
                                style.borderBottomRightRadius = "9px"
                            }
                            return <div key={index} style={style}></div>
                        })}
                    </div>
                </div>
                <div className="org-lists">
                    <div>餐饮量化等级风险TOP10</div>
                    <div className="org-lists-box">
                        {this.state.orgDatas.map((item, index) =>
                            <div key={index} onClick={this.orgDetail.bind(this)}>
                                <span style={{ fontSize: "20px", color: "#333" }}>{item.name}</span> <br />
                                <span style={{ fontSize: "14px", color: "#666" }}>所属区域：{item.area}</span> <br />
                                <span style={{ fontSize: "14px", color: "#666" }}>{item.addr}</span>
                                <div className="risk-num">
                                    {("" + item.num).split("").map((item, index) =>
                                        <img key={index} style={{ marginLeft: index > 0 ? "-6px" : "" }} src={require("./images/n" + item + ".png")} alt="" />
                                    )}
                                </div>
                                <div className="sort-num">
                                    {index + 1}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="pub-table">
                        <Pagination defaultCurrent={6} total={500} />
                    </div>
                </div>
                <div className="org-details-box" style={{ display: this.state.popShow ? "block" : "none" }}>
                    <div className="org-name">
                        餐饮企业概述 — XXXXX有限责任公司
                        <Icon onClick={() => { this.setState({ popShow: false }) }} style={{ position: "absolute", fontSize: "20px", right: "10px", top: "15px", cursor: "pointer", color: "#666" }} type="close" />
                    </div>
                    <div className="org-content">
                        <div>
                            <div>
                                <div style={{ width: "100%", overflow: "hidden", textAlign: "center", marginBottom: "40px" }}>
                                    <Progress
                                        style={{
                                            marginBottom: "16px"
                                        }}
                                        type="circle"
                                        gapPosition="right"
                                        strokeColor="#56B161"
                                        percent={75}
                                        width={160}
                                        format={() => <div style={{ lineHeight: "28px" }}>
                                            <span style={{ fontSize: "70px", color: "#71B970" }}>A</span><br />
                                            <span style={{ fontSize: "16px", color: "#666" }}>监管等级</span>
                                        </div>} /> <br />
                                    <span style={{ fontSize: "18px" }}>
                                        本期得分：
                                        <span style={{ fontSize: "24px", color: "#56B161" }}>97</span>
                                    </span> <br />
                                    <span style={{ fontSize: "18px" }}>
                                        建议调整等级至：
                                        <span style={{ fontSize: "24px", color: "#56B161" }}>B</span>
                                    </span>
                                </div>
                                <Row>
                                    <Col span={6}>
                                        <span style={popStyle}>企业名称：</span>
                                    </Col>
                                    <Col span={18}>
                                        <span style={popStyle}>成都大风吹餐饮管理有限有限公司</span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col span={6}>
                                        <span style={popStyle}>所属区域：</span>
                                    </Col>
                                    <Col span={18}>
                                        <span style={popStyle}>金牛区-XX街道</span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col span={6}>
                                        <span style={popStyle}>企业地址：</span>
                                    </Col>
                                    <Col span={18}>
                                        <span style={popStyle}>成都市金牛区马家花园路</span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col span={11}>
                                        <span style={popStyle}>统一社会信用代码：</span>
                                    </Col>
                                    <Col span={13}>
                                        <span style={popStyle}>51XXXXXXXXX</span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col span={10}>
                                        <span style={popStyle}>食品经营许可证：</span>
                                    </Col>
                                    <Col span={14}>
                                        <span style={popStyle}>JY51XXXXXXXX</span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={7}>
                                    <span style={popStyle}>网络餐饮数据：</span>
                                </Col>
                                <Col span={17}>
                                    <img style={{ position: "relative", marginRight: "10px", top: "-8px" }} src={require("./images/elmxx.png")} alt="" />
                                    <img style={{ position: "relative", marginRight: "10px", top: "-8px" }} src={require("./images/elm.png")} alt="" />
                                    <img style={{ position: "relative", marginRight: "10px", top: "-8px" }} src={require("./images/mt.png")} alt="" />
                                    <img style={{ position: "relative", marginRight: "10px", top: "-8px" }} src={require("./images/dd.png")} alt="" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    <span style={popStyle}>名厨亮灶数据：</span>
                                </Col>
                                <Col span={17}>
                                    <span style={popStyle}>
                                        接入时间 2018年11月11日
                                        <span style={{ ...popStyle, color: "#0A6FD9", cursor: "pointer" }}> 查看视频</span>
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={7}>
                                    <span style={popStyle}>食材溯源数据</span>
                                </Col>
                                <Col span={17}>
                                    <span style={popStyle}>
                                        接入时间 2018年11月11日
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={7}>
                                    <span style={popStyle}>餐厨垃圾数据</span>
                                </Col>
                                <Col span={17}>
                                    <span style={popStyle}>
                                        接入时间 2018年11月11日
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col span={7}>
                                    <span style={popStyle}>监督抽查数据</span>
                                </Col>
                                <Col span={17}>
                                    <span style={popStyle}>
                                        接入时间 2018年11月11日
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Col>
                                    <span onClick = {this.moreOrgMsg.bind(this)} style={{ ...popStyle, color: "#0A6FD9", cursor: "pointer", textDecoration: "underline" }}>查看更多详细数据>></span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <Map
                    plugins={['ToolBar']}
                    center={this.state.center}
                    zoom={11}
                    amapkey={"c85b169acc3c5472b5f282ec4cfb5198"}>
                    <Markers
                        markers={this.state.markers}
                        render={this.renderFun} />
                    </Map>
                </div>
                <div style={{ display: this.state.overViewShow ? "block" : "none" }}>
                    <Overview pageBack={this.pageBack.bind(this)} />
                </div>
            </div>
        )
    }
}

export default Cmap