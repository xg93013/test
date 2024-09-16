import React from "react";
import {
    Tabs,
    Modal
} from "antd";
import Tablea from "./Tablea";
import axios from "axios";
import apis from "../../unit/apis";

const { EW_EXPORT } = apis;
const TabPane = Tabs.TabPane;

class Atable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tabs: ["NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD"],
            columns: [
                {
                    title: "更新时间",
                    dataIndex: "updateTime",
                    align: "center",
                    className: "table-min-width"
                }, {
                    title: "商家名称",
                    dataIndex: "name",
                    align: "center",
                    className: "table-min-width"
                }, {
                    title: "商家地址",
                    dataIndex: "address",
                    align: "center",
                    className: "table-min-width"
                }, {
                    title: "所属区域",
                    dataIndex: "area",
                    align: "center",
                    className: "table-min-width"
                }, {
                    title: "风险类型",
                    dataIndex: "riskType",
                    align: "center",
                    className: "table-min-width"
                }, {
                    title: "平台",
                    dataIndex: "platform",
                    align: "center",
                    className: "table-min-width"
                }
            ],
            columnsa: [{
                title: "更新时间",
                dataIndex: "updateTime",
                align: "center",
                className: "table-min-width"
            }, {
                title: "商家名称",
                dataIndex: "name",
                align: "center",
                className: "table-min-width"
            }, {
                title: "所属区域",
                dataIndex: "area",
                align: "center",
                className: "table-min-width"
            }, {
                title: "预警事件",
                dataIndex: "ttt",
                align: "center",
                className: "table-min-width"
            }, {
                title: "风险等级",
                dataIndex: "riskType",
                align: "center",
                className: "table-min-width"
            }],
            tabNames: ["网络餐饮违规商家预警", "餐厨垃圾预警", "明厨亮灶预警", "乡村群宴预警", "食材溯源预警", "等级评定"],
            loadNum: ["0"],
            num: 0,
            isDown: false,
            downTxt: "导出"
        }
        this.callback = this.callback.bind(this);
        this.downLoad = this.downLoad.bind(this);
    }

    callback(e) {
        let { loadNum } = this.state;
        this.setState({
            num: e
        })
        if (!loadNum.includes(e)) {
            loadNum.push(e);
            this.setState({
                loadNum
            });
            setTimeout(() => {
                this.refs["table" + e].getTables(1)
            })
        }
    }

    downLoad() {
        let baseUrl = process.env.NODE_ENV === "development" ? "/pro" : "";
        let {
            tabs,
            num
        } = this.state;
        ///下载excel表格
        if (this.isDown) {
            return false;
        }
        this.setState({
            isDown: true,
            downTxt: "导出中"
        })
        let url = baseUrl + EW_EXPORT + tabs[num]
        axios({
            method: "get",
            url: url,
            responseType: "blob"
        })
            .then(response => {
                this.setState({
                    isDown: false,
                    downTxt: "导出"
                });
                this.startDownload(response);
            })
            .catch(error => {
                this.setState({
                    isDown: false,
                    downTxt: "导出"
                });
                Modal.error({
                    title: '提示',
                    content: error,
                    okText: '确认'
                });
            });
    }

    startDownload(data) {
        let fileName = decodeURI(
            data.headers["content-disposition"].split("fileName=")[1]
        );
        if ("msSaveOrOpenBlob" in navigator) {
            window.navigator.msSaveOrOpenBlob(new Blob([data.data]), fileName);
        } else {
            let url = window.URL.createObjectURL(new Blob([data.data]));
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    componentDidMount() {
        this.refs.table0.getTables(1)
    }

    render() {
        let {
            columns,
            columnsa,
            tabNames,
            tabs,
            downTxt
        } = this.state;
        return (
            <div className="bottom pub-table">
                <div
                    className="table-export"
                    onClick={this.downLoad}
                >
                    <img src={require("./images/export.png")} alt="" />
                    {downTxt}
                </div>
                <Tabs animated={false} defaultActiveKey="0" onChange={this.callback}>
                    {tabNames.map((item, index) => {
                        return <TabPane
                            tab={item}
                            key={"" + index}
                            disabled={index === 0 ? false : true}
                        >
                            <Tablea
                                tab={tabs[index]}
                                columns={(index === 1 || index === 2) ? columnsa : columns}
                                ref={"table" + index}
                            />
                        </TabPane>
                    })}
                </Tabs>
            </div>
        )
    }

}

export default Atable