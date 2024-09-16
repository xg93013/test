import React from "react";
import { Table } from "antd";
import apis from "../../unit/apis";
import http from "../../unit/http";
import Loading from "../Loading/Loading";

const {
    DETAIL_PUNISHDATA,
    DETAIL_PUNISHDATA_MONTH,
    DETAIL_REGULATORYDATA,
    DETAIL_REGULATORYDATA_MONTH,
    DETAIL_NETFOOD,
    DETAIL_NETFOOD_MONTH
} = apis

class ModalListb extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locale: {
                emptyText: '暂无数据'
            },
            colunms: [{
                title: "序号",
                render: (text, record, index) => `${index + 1}`,
                align: "center",
                width: 60,
                dataIndex: "tit"
            }, {
                title: "客户名",
                dataIndex: "orgName",
                align: "center",
            }],
            data: [],
            pagination: {
                total: 0,
                current: 1,
                onChange: this.getTableList.bind(this),
                defaultCurrent: 1,
                pageSize: 10,
                size: "middle"
            },
            name: "",
            orgName: "",
            type: "",
            loading: false
        }
    }

    setDatas(name, orgName, type) {
        this.setState({
            name,
            orgName,
            type
        });
        setTimeout(() => {
            this.getTableList(1)
        })
    }

    async getTableList(page) {
        let url,
            {
                pagination,
                name,
                orgName,
                type
            } = this.state
        if (name === "行政处罚数据") {
            url = type === "total" ? DETAIL_PUNISHDATA : DETAIL_PUNISHDATA_MONTH;
        } else if (name === "日常监管数据") {
            url = type === "total" ? DETAIL_REGULATORYDATA : DETAIL_REGULATORYDATA_MONTH;
        } else if (name === "网络订餐数据") {
            url = type === "total" ? DETAIL_NETFOOD : DETAIL_NETFOOD_MONTH;
        }
        this.setState({
            loading: true
        });
        let res = await http.get(url + orgName + (name === "网络订餐数据" ? "" : "/" + page));
        if (res) {
            let {
                content,
                totalElements
            } = res.data;
            pagination.total = totalElements;
            this.setState({
                data: [...content].map((item, index) => {
                    return {
                        ...item,
                        id: index
                    }
                }),
                pagination,
                loading: false
            })
        }
    }

    getColunms(name) {
        if (name === "行政处罚数据") {
            return [{
                title: "处罚决定书日期",
                dataIndex: "cfjdrq",
                width: 120
            }, {
                title: "违法行为类型",
                dataIndex: "wfxw"
            }, {
                title: "处罚决定书号",
                dataIndex: "cfjd"
            }, {
                title: "处罚依据",
                dataIndex: "cfjdyj"
            }, {
                title: "处罚内容",
                dataIndex: "cfnr"
            }, {
                title: "行政处罚决定机关名称",
                dataIndex: "cfjdjgmc",
                width: 200
            }, {
                title: "案结日期",
                dataIndex: "ajrq",
                width: 100
            }]
        }
        if (name === "日常监管数据") {
            return [{
                title: "检查日期",
                dataIndex: "jcrq",
                width: 100
            }, {
                title: "监察类型",
                dataIndex: "jclx"
            }, {
                title: "专业标记",
                dataIndex: "fcbj"
            }, {
                title: "检查结果",
                dataIndex: "jcjg"
            }, {
                title: "处理结果",
                dataIndex: "cljg"
            }]
        }
        if (name === "网络订餐数据") {
            return [{
                title: "更新时间",
                dataIndex: "updateTime",
                width: 140
            }, {
                title: "商家名称",
                dataIndex: "name"
            }, {
                title: "商家地址",
                dataIndex: "address"
            }, {
                title: "所属区域",
                dataIndex: "area"
            }, {
                title: "风险类型",
                dataIndex: "riskType"
            }]
        }

    }

    render() {
        let {
            data,
            locale,
            pagination,
            loading,
            name
        } = this.state;
        let { detailName } = this.props;
        return (
            <div
                className="modal-lists pub-table"
                style={{ minHeight: "300px", maxHeight: "600px", overflowY: "auto" }}
            >
                <Loading loading={loading} />
                <Table
                    style={{ background: "#fff", marginTop: "10px" }}
                    rowKey="id"
                    size="middle"
                    locale={locale}
                    bordered
                    columns={this.getColunms(detailName)}
                    dataSource={data}
                    pagination={name === "网络订餐数据" ? false : pagination}
                />
            </div>
        )
    }

}

export default ModalListb