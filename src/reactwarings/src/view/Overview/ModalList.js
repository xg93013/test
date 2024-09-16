import React from "react";
import {
    Table,
    Pagination
} from "antd";
import apis from "../../unit/apis";
import http from "../../unit/http";
import Loading from "../Loading/Loading";

const {
    DETAIL_CHECKDATA,
    DETAIL_CHECKDATA_MONTH
} = apis
const spanStyle = {
    marginLeft: "20px"
}
class ModalList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locale: {
                emptyText: '暂无数据'
            },
            colunms: [{
                title: "食品名称",
                dataIndex: "ypMc",
                width: 200
            }, {
                title: "食品分类",
                dataIndex: "ypFl"
            }, {
                title: "抽检批次",
                dataIndex: "allCount",
                width: 100
            }, {
                title: "抽检类型",
                dataIndex: "rwlx",
                width: 200
            }, {
                title: "不合格批次",
                dataIndex: "noCount",
                width: 100
            }, {
                title: "检测结果",
                dataIndex: "jg",
                width: 100
            }],
            data: [],
            name: "",
            orgName: "",
            type: "",
            page: 1,
            orgTotal: 0,
            loading: false
        }
        this.pageChange = this.pageChange.bind(this);
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

    pageChange(page) {
        this.setState({
            page
        });
        this.getTableList(page)
    }

    async getTableList(page) {
        let url,
            {
                orgName,
                type
            } = this.state
        if (type === "total") {
            url = DETAIL_CHECKDATA + 1;
        } else if (type === "month") {
            url = DETAIL_CHECKDATA_MONTH + 1;
        } else if (type === "warn") {
            url = DETAIL_CHECKDATA + 0;
        } else {
            url = DETAIL_CHECKDATA_MONTH + 0;
        }
        this.setState({
            loading: true
        })
        let res = await http.get(url + "/" + orgName + "/" + page);
        if (res) {
            let {
                content,
                totalElements
            } = res.data;
            this.setState({
                data: [...content],
                orgTotal: totalElements,
                loading: false
            })
        }
    }

    render() {
        let {
            data,
            page,
            orgTotal,
            loading,
            locale,
            colunms
        } = this.state
        return (
            <div
                className="modal-lists pub-table"
                style={{ paddingBottom: "50px" }}
            >
                <Loading loading={loading} />
                <div style={{ minHeight: "300px", maxHeight: "600px", overflowY: "auto" }}>
                    <div style={{
                        fontSize: "16px",
                        textAlign: "center",
                        marginTop: "50px",
                        display: data.length ? "none" : "block"
                    }}>暂无数据</div>
                    {data.map((item, index) =>
                        <div
                            key={index}
                            className="modal-list"
                        >
                            <div className="modal-list-top">
                                <span style={spanStyle}>抽检时间：{item.bgrq}</span>
                                <span style={spanStyle}>抽检批次：{item.allCount}</span>
                                <span style={spanStyle}>不合格批次：{item.noCount}</span>
                                <span style={spanStyle}>不合格率：{item.noRate.toFixed(2)}%</span>
                            </div>
                            <Table
                                style={{ background: "#fff", marginTop: "10px" }}
                                rowKey="id"
                                size="middle"
                                locale={locale}
                                bordered
                                columns={colunms}
                                dataSource={item.dataList}
                                pagination={false}
                            />
                        </div>
                    )}
                </div>
                <div style={{
                    position: "absolute",
                    width: "100%",
                    left: "0",
                    bottom: "0",
                    textAlign: "center",
                    display: data.length ? "block" : "none"
                }}>
                    <Pagination
                        current={page}
                        defaultPageSize={5}
                        total={orgTotal}
                        onChange={this.pageChange}
                    />
                </div>
            </div>
        )
    }

}

export default ModalList