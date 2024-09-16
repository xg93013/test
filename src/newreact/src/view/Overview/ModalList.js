import React from "react";
import { Table } from "antd";
const spanStyle = {
    marginLeft: "20px"
}
class ModalList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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
            data: [{
                id: 1,
                orgName: "张三"
            }, {
                id: 2,
                orgName: "李四"
            }, {
                id: 3,
                orgName: "张三"
            }],
        }
    }

    render() {
        return (
            <div className="modal-lists pub-table">
                <div className="modal-list">
                    <div className="modal-list-top">
                        <span style={spanStyle}>抽检时间：2017年10月26日</span>
                        <span style={spanStyle}>抽检类型：监督抽检</span>
                        <span style={spanStyle}>抽检批次：20</span>
                        <span style={spanStyle}>不合格批次：2</span>
                        <span style={spanStyle}>不合格率：10.03%</span>
                    </div>
                    <Table
                        style={{ background: "#fff", marginTop: "10px" }}
                        rowKey="id"
                        size="middle"
                        loading={this.state.loading}
                        locale={this.state.locale}
                        bordered
                        columns={this.state.colunms}
                        dataSource={this.state.data}
                        pagination={false} />
                </div>
                <div className="modal-list">
                    <div className="modal-list-top">
                        <span style={spanStyle}>抽检时间：2017年10月26日</span>
                        <span style={spanStyle}>抽检类型：监督抽检</span>
                        <span style={spanStyle}>抽检批次：20</span>
                        <span style={spanStyle}>不合格批次：2</span>
                        <span style={spanStyle}>不合格率：10.03%</span>
                    </div>
                    <Table
                        style={{ background: "#fff", marginTop: "10px" }}
                        rowKey="id"
                        size="middle"
                        loading={this.state.loading}
                        locale={this.state.locale}
                        bordered
                        columns={this.state.colunms}
                        dataSource={this.state.data}
                        pagination={false} />
                </div>
                <div className="modal-list">
                    <div className="modal-list-top">
                        <span style={spanStyle}>抽检时间：2017年10月26日</span>
                        <span style={spanStyle}>抽检类型：监督抽检</span>
                        <span style={spanStyle}>抽检批次：20</span>
                        <span style={spanStyle}>不合格批次：2</span>
                        <span style={spanStyle}>不合格率：10.03%</span>
                    </div>
                    <Table
                        style={{ background: "#fff", marginTop: "10px" }}
                        rowKey="id"
                        size="middle"
                        loading={this.state.loading}
                        locale={this.state.locale}
                        bordered
                        columns={this.state.colunms}
                        dataSource={this.state.data}
                        pagination={false} />
                </div>
            </div>
        )
    }

}

export default ModalList