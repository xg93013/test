import React from "react";
import { Icon } from "antd";
import "./Platform.scss";
import apis from "../../unit/apis";
import http from "../../unit/http";

const { INDEX_APPS } = apis;

class Platform extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            datas: [{
                name: "全息档案",
                page: "archives"
            }, {
                name: "监管地图",
                page: "map"
            }, {
                name: "预警分析",
                page: "analysis"
            }, {
                name: "核查结果",
                page: "result"
            }, {
                name: "量化分级"
            }],
            urls: []
        }
        this.pageChange = this.pageChange.bind(this);
    }

    async getUrls() {
        this.props.changeLoading(true);
        let res = await http.get(INDEX_APPS);
        if (res) {
            let urls = [];
            res.data.forEach(item => {
                urls.push(item.indexUrl)
            });
            this.setState({
                urls
            });
            this.props.changeLoading(false);
        }
    }

    pageChange(page) {
        if (page) {
            this.props.history.push(page);
        } else {
            this.openNewWindow(this.state.urls[0]);
        }
    }

    openNewWindow(url) {
        window.open(url);
    }

    componentDidMount() {
        this.getUrls();
    }

    render() {
        let { urls, datas } = this.state;
        return (
            <div
                id="platform"
                className="con-box"
            >
                <div className="list-box">
                    {datas.map((item, index) =>
                        <div key={index}>
                            <div>
                                <img
                                    src={require("./images/t" + index + ".png")}
                                    alt=""
                                />
                                <span onClick={() => this.pageChange(item.page)}>{item.name}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="process">
                    <div className="process-title">餐饮环节全链条覆盖、全流程管控 </div>
                    <div className="process-box">
                        <div>
                            <div className="box-title">农产品批发零售</div>
                        </div>
                        <div className="has-line">
                            <div className="box-line">
                                <Icon
                                    style={{ color: "#276AB0" }}
                                    type="caret-right"
                                />
                            </div>
                            <div className="box-line-a has-circel">
                                <span></span>
                            </div>
                            <div
                                className="box-img"
                                onClick={() => this.openNewWindow(urls[1])}
                            >
                                <img
                                    src={require("./images/b1.png")}
                                    alt=""
                                />
                                农产品溯源
                            </div>
                        </div>
                        <div>
                            <div className="box-title">餐饮加工</div>
                            <div className="box-line-a"></div>
                            <div
                                className="box-img"
                                onClick={() => this.openNewWindow(urls[2])}
                            >
                                <img
                                    src={require("./images/b2.png")}
                                    alt=""
                                />
                                明厨亮灶
                            </div>
                        </div>
                        <div className="has-line">
                            <div className="box-line">
                                <Icon
                                    style={{ color: "#276AB0" }}
                                    type="caret-right"
                                />
                            </div>
                            <div className="box-line-a has-circel">
                                <span></span>
                            </div>
                            <div
                                className="box-img"
                                onClick={() => this.openNewWindow(urls[3])}
                            >
                                <img
                                    src={require("./images/b3.png")}
                                    alt=""
                                />
                                乡村群宴
                            </div>
                        </div>
                        <div>
                            <div className="box-title">餐饮消费</div>
                            <div className="box-line-a"></div>
                            <div
                                className="box-img"
                                onClick={() => this.openNewWindow(urls[4])}
                            >
                                <img
                                    src={require("./images/b4.png")}
                                    alt=""
                                />
                                网络餐饮
                            </div>
                        </div>
                        <div className="has-line">
                            <div className="box-line">
                                <Icon
                                    style={{ color: "#276AB0" }}
                                    type="caret-right"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="box-title">餐厨垃圾处理</div>
                            <div className="box-line-a"></div>
                            <div
                                className="box-img"
                                onClick={() => this.openNewWindow(urls[5])}
                            >
                                <img
                                    src={require("./images/b5.png")}
                                    alt=""
                                />
                                餐厨垃圾
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Platform