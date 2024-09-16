import React from "react";
import apis from "../../unit/apis";
import http from "../../unit/http";
import {
    Table,
    LocaleProvider,
    Tooltip
} from "antd";
import Loading from "../Loading/Loading";
import zhCN from 'antd/lib/locale-provider/zh_CN';

const { INSPECT_LIST } = apis;

class Rtable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            locale: {
                emptyText: '暂无数据'
            },
            colunms: [{
                title: "序号",
                align: "center",
                width: 60,
                dataIndex: "num"
            }, {
                title: "商家名称",
                dataIndex: "name",
                align: "center",
                className: "table-min-width"
            }, {
                title: "平台",
                dataIndex: "platform",
                align: "center",
                className: "table-min-width"
            }, {
                title: "地址",
                dataIndex: "address",
                align: "center",
                className: "table-min-width"
            }, {
                title: "核查单位",
                dataIndex: "inspectUnit",
                align: "center",
                className: "table-min-width"
            }, {
                title: "核查原因",
                dataIndex: "inspectReason",
                align: "center",
                className: "table-min-width"
            }, {
                title: "核查情况",
                dataIndex: "inspectResult",
                align: "center",
                className: "table-min-width"
            }, {
                title: "处理结果",
                dataIndex: "proposeResult",
                align: "center",
                className: "table-min-width"
            }],
            data: [],
            pagination: {
                total: 30,
                current: 1,
                onChange: this.getTableList.bind(this),
                defaultCurrent: 1,
                pageSize: 10,
                size: "middle"
            }
        }
    }

    async getTableList(page) {
        let { defaultValue, status, tabs } = this.props;
        let arg = "&year=" + defaultValue[0].split("年")[0] + (defaultValue.length > 1 ? "&month=" + defaultValue[1].split("月")[0] : "");
        this.setState({
            loading: true
        });
        let tableList = await http.get(INSPECT_LIST + "?tab=" + tabs + arg + "&status=" + status + "&pageNo=" + page);
        if (tableList) {
            this.setData({ ...tableList.data })
        }
        this.setState({
            loading: false
        });
    }


    setData(data) {
        let { content, pageNumber, totalElements } = data;
        let { pagination } = this.state;
        pagination.current = pageNumber;
        pagination.total = totalElements;
        this.setState({
            pagination,
            data: content
        })
    }

    render() {
        let {
            loading,
            locale,
            colunms,
            data,
            pagination
        } = this.state
        return (
            <div className="rtable pub-table">
                <div>
                    <div className="title">{this.props.listName}
                        核查商家名单公示
                        <Tooltip title="默认展示全部核查商家名单，点击上方统计数据中的数字，则只展示对应类型的商家名单。">
                            <span style={{
                                display: "inline-block",
                                width: "20px",
                                height: "20px",
                                background: "#666",
                                color: "#fff",
                                textAlign: "center",
                                lineHeight: "20px",
                                fontSize: "18px",
                                cursor: "pointer",
                                borderRadius: "50%",
                                marginLeft: "4px"
                            }}>?</span>

                        </Tooltip>
                    </div>
                    <div style={{ position: "relative", marginTop: "10px" }}>
                        <Loading loading={loading} />
                        <LocaleProvider locale={zhCN}>
                            <Table
                                style={{ background: "#fff" }}
                                rowKey="num"
                                size="middle"
                                locale={locale}
                                bordered
                                columns={colunms}
                                dataSource={data}
                                pagination={pagination}
                            />
                        </LocaleProvider>
                    </div>
                </div>
            </div>
        )
    }

}

export default Rtable