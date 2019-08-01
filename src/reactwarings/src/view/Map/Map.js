import React from "react";
import {
    Map,
    Markers
} from "react-amap";
import {
    Input,
    Select,
    Icon,
    Slider,
    Pagination,
    Row,
    Col,
    Progress,
    Tooltip,
    Popover,
    Button,
    Checkbox
} from "antd";
import "./Map.scss";
import Overview from "../Overview/Overview";
import Loading from "../Loading/Loading";
import apis from "../../unit/apis";
import http from "../../unit/http";

const {
    MAP_LIST_TEN,
    MAP_LIST_ONE_HUNDRED,
    MAP_QUERY,
    MAP_INFO,
    MAP_AREA,
    MAP_STREET,
    MAP_BUSINESSITEM
} = apis;

const popStyle = {
    color: "#666",
    fontSize: "18px",
    wordBreak: "break-all",
    wordWrap: "break-word"
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
const CheckboxGroup = Checkbox.Group;

class Cmap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listChange: false,
            searchValue: "",
            center: { longitude: 104.06, latitude: 30.67 },
            color: ["#00A0E9", "#22AC38", "#AF39BA", "#F48C47", "#CE383F"],
            sliderRange: [1, 5],
            isSlider: false,
            orgDatas: [],
            orgDatas100: [],
            page: 1,
            orgTotal: 0,
            popShow: false,
            overViewShow: false,
            orgDetailMsg: {
                orderDatas: []
            },
            orgImg: [],
            areaDatas: [{ area: "成都市" }],
            streetDatas: [{ street: "全部" }],
            areaValue: "成都市",
            streetValue: "全部",
            plainOptions: [],
            buinessChecked: ["经营项目"],
            buinessWillChecked: [],
            detailLoading: false,
            listLoading: false,
            mapPopShow: false
        }
        this.keyWordSearch = this.keyWordSearch.bind(this);
        this.rangeChange = this.rangeChange.bind(this);
        this.orgDetail = this.orgDetail.bind(this);
        this.renderFun = this.renderFun.bind(this);
        this.areaChange = this.areaChange.bind(this);
        this.streetChange = this.streetChange.bind(this);
        this.mapPopChange = this.mapPopChange.bind(this);
        this.checkGroupChange = this.checkGroupChange.bind(this);
        this.businessChange = this.businessChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.moreOrgMsg = this.moreOrgMsg.bind(this);
        this.pageBack = this.pageBack.bind(this);
    }

    rangBorderColor(e) {
        document.getElementsByClassName("ant-slider-handle-2")[0].style.borderLeftColor = e[0];
        document.getElementsByClassName("ant-slider-handle-1")[0].style.borderLeftColor = e[1];
    }

    rangeChange(e) {
        let n1 = 4 - parseInt(e[0] / 20),
            n2 = 4 - parseInt(e[1] / 20);
        let { color } = this.state;
        this.rangBorderColor([color[n2], color[n1]]);
        this.setState({
            page: 1,
            sliderRange: [5 - n1, 5 - n2],
            isSlider: true
        });
        setTimeout(() => {
            this.getSearchList();
        })
    }

    sliderValue(num) {
        return ["1(差)", "2(一般)", "3(较好)", "4(好)", "5(很好)"][parseInt(num / 20)]
    }

    keyWordSearch(value) {
        let { searchValue } = this.state;
        if (searchValue !== value) {
            this.setState({
                page: 1,
                searchValue: value
            })
            setTimeout(() => {
                this.getSearchList();
            })
        }
    }

    async getTopTen() {
        if (sessionStorage.getItem("hundredLists")) {
            this.setState({
                listLoading: true
            })
        }
        let res = await http.get(MAP_LIST_TEN);
        if (res) {
            this.setState({
                orgDatas: [...res.data],
                listLoading: false
            })
        }
    }

    async getSearchList() {
        let {
            listChange,
            searchValue,
            areaValue,
            streetValue,
            buinessChecked,
            sliderRange,
            isSlider,
            page,
            listLoading
        } = this.state
        if (listLoading) {
            return false
        };
        this.props.changeLoading(true);
        if (!listChange) {
            this.setState({
                listChange: true
            })
        }
        this.setState({
            listLoading: true,
            popShow: false
        });
        let res = await http.get(MAP_QUERY +
            "?name=" + searchValue +
            "&area=" + (areaValue === "成都市" ? "" : areaValue) +
            "&street=" + (streetValue === "全部" ? "" : streetValue) +
            "&businessItem=" + (buinessChecked[0] === "经营项目" ? "" : buinessChecked.join(",")) +
            "&level=" + (isSlider ? sliderRange.join(",") : "") +
            "&page=" + page
        )
        if (res) {
            this.props.changeLoading(false);
            let {
                content,
                totalElements
            } = res.data
            let orgDatas100 = [...content].map(item => {
                let { longitude, latitude } = item
                return {
                    ...item,
                    position: {
                        longitude,
                        latitude
                    }
                }
            });
            this.setState({
                orgDatas: content,
                orgDatas100,
                orgTotal: totalElements,
                listLoading: false
            })
        }
    }

    pageChange(page) {
        this.setState({
            page
        });
        setTimeout(() => {
            this.getSearchList();
        });
    }

    async getTopOneHundred() {
        let orgDatas100 = sessionStorage.getItem("hundredLists");
        if (orgDatas100) {
            this.setState({
                orgDatas100: JSON.parse(orgDatas100)
            })
        } else {
            this.props.changeLoading(true)
            let res = await http.get(MAP_LIST_ONE_HUNDRED);
            if (res) {
                let orgDatas100 = [...res.data].map(item => {
                    let { longitude, latitude } = item
                    return {
                        ...item,
                        position: {
                            longitude,
                            latitude
                        }
                    }
                });
                this.setState({
                    orgDatas100
                });
                sessionStorage.setItem("hundredLists", JSON.stringify(orgDatas100));
                this.props.changeLoading(false)
            }
        }
    }

    async orgDetail(name) {
        this.setState({
            popShow: true,
            detailLoading: true
        });
        let res = await http.get(MAP_INFO + name);
        if (res) {
            let arr = [];
            if (res.data.orderDatas.MEI_TUAN_WM) {
                arr.push("mt")
            }
            if (res.data.orderDatas.ELE_ME_WM) {
                arr.push("elm")
            }
            if (res.data.orderDatas.BAIDU_WM) {
                arr.push("elmxx")
            }
            if (res.data.orderDatas.DIDI_WM) {
                arr.push("dd")
            }
            this.setState({
                orgDetailMsg: { ...res.data },
                orgImg: arr,
                detailLoading: false
            });
        }
    }

    renderFun(extData) {
        let { level, name, qylsh } = extData;
        level = ["1", "2", "3", "4", "5"].indexOf(level) > 0 ? level : "6";
        let background = `url(${require(`./images/addr${level}.png`)})`
        return <Tooltip title={name}>
            <div onClick={() => this.orgDetail(qylsh)} style={{ background, ...styleC }}></div>
        </Tooltip>
    }

    async getArea() {
        let res = await http.get(MAP_AREA);
        if (res) {
            let areaDatas = [...this.state.areaDatas, ...res.data];
            this.setState({
                areaDatas
            })
        }
    }

    async areaChange(area) {
        this.setState({
            streetValue: "全部"
        });
        let streetDatas;
        if (area === "成都市") {
            streetDatas = [{ street: "全部" }]
        } else {
            let res = await http.get(MAP_STREET + area);
            if (res) {
                streetDatas = [{ street: "全部" }, ...res.data];
            }
        }
        this.setState({
            page: 1,
            streetDatas,
            areaValue: area
        });
        setTimeout(() => {
            this.getSearchList();
        })
    }

    async getBuiness() {
        let res = await http.get(MAP_BUSINESSITEM);
        if (res) {
            this.setState({
                plainOptions: [...res.data]
            })
        }
    }

    streetChange(streetValue) {
        this.setState({
            page: 1,
            streetValue
        });
        setTimeout(() => {
            this.getSearchList();
        });
    }

    mapPopChange(mapPopShow) {
        if (mapPopShow) {
            let { buinessChecked } = this.state;
            this.setState({
                buinessWillChecked: buinessChecked[0] === "经营项目" ? [] : buinessChecked
            })
        }
        this.setState({
            mapPopShow
        })
    }

    checkGroupChange(buinessWillChecked) {
        this.setState({
            buinessWillChecked
        })
    }

    businessChange() {
        let { buinessWillChecked } = this.state;
        this.setState({
            mapPopShow: false,
            page: 1,
            buinessChecked: buinessWillChecked.length ? buinessWillChecked : ["经营项目"]
        });
        setTimeout(() => {
            this.getSearchList();
        });
    }

    moreOrgMsg(detailValue) {
        this.setState({
            overViewShow: true
        });
        this.refs.orgDetail.getDetails(detailValue)
    }

    pageBack() {
        this.setState({
            overViewShow: false
        })
    }

    goVideo(orgMsg) {
        let id = orgMsg.qylsh;
        let url = orgMsg.kitchenData.videoPageHost;
        window.open(
            url + "?id=" + id,
            "newwindow",
            "height=400, width=600,left=400,top=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"
        );
    }

    componentDidMount() {
        this.rangBorderColor([this.state.color[0], this.state.color[4]]);
        this.getTopTen();
        this.getTopOneHundred();
        this.getArea();
        this.getBuiness();
    }


    render() {
        let {
            listChange,
            overViewShow,
            color,
            orgDatas,
            popShow,
            center,
            orgDatas100,
            orgDetailMsg,
            orgImg,
            detailLoading,
            listLoading,
            areaDatas,
            streetDatas,
            streetValue,
            mapPopShow,
            plainOptions,
            buinessChecked,
            buinessWillChecked,
            page,
            orgTotal
        } = this.state
        return (
            <div id="map">
                <div style={{ display: overViewShow ? "none" : "block" }}>
                    <div className="search-box">
                        <Search
                            placeholder="请输入要查询的企业名称"
                            onSearch={this.keyWordSearch}
                            enterButton
                        />
                    </div>
                    <div className="classify">
                        <Select
                            defaultValue={areaDatas[0].area}
                            onChange={this.areaChange}
                            suffixIcon={
                                <Icon
                                    style={{ color: "#276AB0" }}
                                    type="caret-down"
                                />
                            }
                            style={{
                                width: 140,
                                marginRight: 20
                            }}
                        >
                            {areaDatas.map(item =>
                                <Option
                                    key={item.area}
                                    value={item.area}
                                >
                                    {item.area}
                                </Option>
                            )}
                        </Select>
                        <Select
                            value={streetValue}
                            onChange={this.streetChange}
                            suffixIcon={
                                <Icon
                                    style={{ color: "#276AB0" }}
                                    type="caret-down"
                                />
                            }
                            style={{
                                width: 140,
                                marginRight: 20
                            }}
                        >
                            {streetDatas.map(item =>
                                <Option
                                    key={item.street}
                                    value={item.street}
                                >
                                    {item.street}
                                </Option>
                            )}
                        </Select>
                        <Popover
                            content={<div className="map-popover" style={{ width: "150px" }}>
                                <CheckboxGroup
                                    options={plainOptions}
                                    value={buinessWillChecked}
                                    onChange={this.checkGroupChange}
                                />
                                <div style={{ textAlign: "center", marginTop: "2px" }}>
                                    <Button
                                        onClick={this.businessChange}
                                        size="small"
                                        style={{ marginRight: "4px" }}
                                    >确定</Button>
                                    <Button
                                        onClick={() => this.mapPopChange(false)}
                                        size="small"
                                    >取消</Button>
                                </div>
                            </div>}
                            trigger="click"
                            placement="bottomRight"
                            visible={mapPopShow}
                            onVisibleChange={this.mapPopChange}
                        >
                            <Button className="pop-btn">
                                {buinessChecked.join("/")}
                                <span style={{
                                    position: "absolute",
                                    width: "12px",
                                    height: "12px",
                                    right: "10px",
                                    top: "10px",
                                    lineHeight: "10px",
                                    transition: "all .3s",
                                    transform: "rotate(" + (mapPopShow ? "180" : "0") + "deg)"
                                }}
                                >
                                    <Icon
                                        style={{
                                            color: "#276AB0",
                                            fontSize: "12px"
                                        }}
                                        type="caret-down"
                                    />
                                </span>
                            </Button>
                        </Popover>
                    </div>
                    <div className="slider-box">
                        <Slider
                            vertical
                            range
                            marks={{
                                10: "10",
                                30: "30",
                                50: "50",
                                70: "70",
                                90: "90"
                            }}
                            step={null}
                            defaultValue={[10, 90]}
                            onAfterChange={this.rangeChange}
                            tipFormatter={this.sliderValue}
                        />
                        <div className="rang">
                            {color.map((item, index) => {
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
                    <div
                        className="org-lists"
                        style={{ background: !orgDatas.length && !listLoading ? "rgba(250,250,250,.8)" : "rgba(250,250,250,0)" }}
                    >
                        <div style={{ display: listChange ? "none" : "block" }}>餐饮服务食品安全等级评定TOP10</div>
                        <Loading loading={listLoading && !listChange} />
                        <div
                            className="org-lists-box"
                            style={{
                                overflow: listLoading ? "hidden" : "auto",
                                top: listChange ? "0" : "40px",
                                bottom: listChange ? "50px" : "0"
                            }}
                        >
                            <span style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                textAlign: "center",
                                transform: "translate(-50%,-50%)",
                                fontSize: "18px",
                                display: !orgDatas.length && !listLoading ? "block" : "none"
                            }}>暂无数据</span>
                            {orgDatas.map((item, index) =>
                                <div
                                    key={index}
                                    style={index === 0 ? { marginTop: "0" } : {}}
                                    onClick={() => this.orgDetail(item.qylsh)}
                                >
                                    <span style={{ fontSize: "20px", color: "#333" }}>{item.name}</span> <br />
                                    <span style={{ fontSize: "14px", color: "#666" }}>所属区域：{item.area}</span> <br />
                                    <span style={{ fontSize: "14px", color: "#666" }}>{item.address}</span>
                                    <div className="risk-num">
                                        {item.score ? (("" + item.score).split("").map((item, index) =>
                                            <img
                                                key={index}
                                                style={{ marginLeft: index > 0 ? "-6px" : "" }}
                                                src={require("./images/n" + item + ".png")}
                                                alt=""
                                            />
                                        )) : ""}
                                    </div>
                                    <div className="sort-num">
                                        {index + 1}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            className="pub-table"
                            style={{ display: listChange && orgDatas.length ? "block" : "none" }}
                        >
                            <Pagination
                                current={page}
                                defaultPageSize={100}
                                total={orgTotal}
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>
                    <div
                        className="org-details-box"
                        style={{ display: popShow ? "block" : "none" }}
                    >
                        <Loading loading={detailLoading} />
                        <div className="org-name">
                            餐饮企业概述 — {orgDetailMsg.name}
                            <Icon
                                onClick={() => { this.setState({ popShow: false }) }}
                                style={{
                                    position: "absolute",
                                    fontSize: "20px",
                                    right: "10px",
                                    top: "15px",
                                    cursor: "pointer",
                                    color: "#666"
                                }}
                                type="close"
                            />
                        </div>
                        <div className="org-content">
                            <div>
                                <div>
                                    <div
                                        style={{
                                            width: "100%",
                                            overflow: "hidden",
                                            textAlign: "center",
                                            marginBottom: "40px"
                                        }}
                                    >
                                        <Progress
                                            style={{
                                                marginBottom: "16px"
                                            }}
                                            type="circle"
                                            gapPosition="right"
                                            strokeColor="#56B161"
                                            percent={100}
                                            width={160}
                                            format={() => <div style={{ lineHeight: "28px" }}>
                                                <span style={{ fontSize: "70px", color: "#71B970" }}>{orgDetailMsg.level || "--"}</span><br />
                                                <span style={{ fontSize: "16px", color: "#666" }}>监管等级</span>
                                            </div>}
                                        /> <br />
                                        <span style={{ fontSize: "18px" }}>
                                            本期得分：
                                        <span style={{ fontSize: "24px", color: orgDetailMsg.score ? "#56B161" : "#666" }}>{orgDetailMsg.score || "--"}</span>
                                        </span>
                                        {/* <br />
                                        <span style={{ fontSize: "18px" }}>
                                            建议调整等级至：
                                        <span style={{ fontSize: "24px", color: orgDetailMsg.suggestLevel ? "#56B161" : "#666" }}>{orgDetailMsg.suggestLevel || "--"}</span>
                                        </span> */}
                                    </div>
                                    <Row>
                                        <Col span={6}>
                                            <span style={popStyle}>企业名称：</span>
                                        </Col>
                                        <Col span={18}>
                                            <span style={popStyle}>{orgDetailMsg.name}</span>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "10px" }}>
                                        <Col span={6}>
                                            <span style={popStyle}>所属区域：</span>
                                        </Col>
                                        <Col span={18}>
                                            <span style={popStyle}>{orgDetailMsg.area}</span>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "10px" }}>
                                        <Col span={6}>
                                            <span style={popStyle}>企业地址：</span>
                                        </Col>
                                        <Col span={18}>
                                            <span style={popStyle}>{orgDetailMsg.address}</span>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "10px" }}>
                                        <Col span={11}>
                                            <span style={popStyle}>{
                                                (() => {
                                                    if (orgDetailMsg.idno) {
                                                        return "统一社会信用代码"
                                                    }
                                                    if (orgDetailMsg.businessLicense) {
                                                        return "营业执照号码"
                                                    }
                                                    if (orgDetailMsg.zzjgdm) {
                                                        return "组织机构代码"
                                                    }
                                                    return "统一社会信用代码"
                                                })()
                                            }：</span>
                                        </Col>
                                        <Col span={13}>
                                            <span style={popStyle}>{orgDetailMsg.idno || orgDetailMsg.businessLicense || orgDetailMsg.zzjgdm || "暂无数据"}</span>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "10px" }}>
                                        <Col span={10}>
                                            <span style={popStyle}>食品经营许可证：</span>
                                        </Col>
                                        <Col span={14}>
                                            <span style={popStyle}>{orgDetailMsg.businessPermit || "暂无数据"}</span>
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
                                        {orgImg.length ? orgImg.map((item, index) =>
                                            <img
                                                key={index}
                                                className="org-img"
                                                src={require("./images/" + item + ".png")}
                                                alt=""
                                            />
                                        ) : <span style={popStyle}>暂无数据</span>}
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: orgDetailMsg.orderDatas ? "0px" : "10px" }}>
                                    <Col span={7}>
                                        <span style={popStyle}>明厨亮灶数据：</span>
                                    </Col>
                                    <Col span={17}>
                                        <span style={popStyle}>
                                            {orgDetailMsg.kitchenData ? orgDetailMsg.kitchenData.dataDate : "暂未接入"}
                                            <span
                                                onClick={() => { this.goVideo(orgDetailMsg) }}
                                                style={{ ...popStyle, fontSize: "15px", borderBottom: "1px solid #0A6FD9", color: "#0A6FD9", cursor: "pointer" }}
                                            > {orgDetailMsg.kitchenData && orgDetailMsg.kitchenData.shopIpc ? "查看视频" : ""}</span>
                                        </span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col span={7}>
                                        <span style={popStyle}>食材溯源数据：</span>
                                    </Col>
                                    <Col span={17}>
                                        <span style={popStyle}>
                                            {orgDetailMsg.foodTraceData}
                                        </span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col span={7}>
                                        <span style={popStyle}>餐厨垃圾数据：</span>
                                    </Col>
                                    <Col span={17}>
                                        <span style={popStyle}>
                                            {orgDetailMsg.kitchenWasteData}
                                        </span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col span={7}>
                                        <span style={popStyle}>监督抽查数据：</span>
                                    </Col>
                                    <Col span={17}>
                                        <span style={popStyle}>
                                            {orgDetailMsg.foodCheckData}
                                        </span>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col>
                                        <span
                                            onClick={() => this.moreOrgMsg(orgDetailMsg.qylsh)}
                                            style={{
                                                ...popStyle,
                                                color: "#0A6FD9",
                                                cursor: "pointer",
                                                textDecoration: "underline"
                                            }}
                                        >
                                            查看更多详细数据>>
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <Map
                        plugins={['ToolBar']}
                        center={center}
                        zoom={12}
                        amapkey={"c85b169acc3c5472b5f282ec4cfb5198"}
                    >
                        <Markers
                            markers={orgDatas100}
                            render={this.renderFun}
                        />
                    </Map>
                </div>
                <div style={{ display: overViewShow ? "block" : "none" }}>
                    <Overview
                        pageBack={this.pageBack}
                        ref="orgDetail"
                        changeLoading={this.props.changeLoading}
                    />
                </div>
            </div>
        )
    }
}

export default Cmap