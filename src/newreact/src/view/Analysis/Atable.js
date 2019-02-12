import React from "react";
import { Tabs } from "antd";
import Tablea from "./Tablea";
const TabPane = Tabs.TabPane;

class Atable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tabs: ["NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD"],
            columns: [{
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
            }],

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
            loadNum: ["0"]
        }
    }

    callback(e) {
        let { loadNum } = this.state;
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

    componentDidMount() {
        this.refs.table0.getTables(1)
    }

    render() {
        let { columns, columnsa, tabNames, tabs } = this.state;
        return (
            <div className="bottom pub-table">
                <Tabs animated={false} defaultActiveKey="0" onChange={this.callback.bind(this)}>
                    {tabNames.map((item, index) => {
                        let column
                        if (index === 1 || index === 2) {
                            column = columns
                        } else {
                            column = columnsa
                        }
                        return <TabPane tab={item} key={"" + index}>
                            <Tablea tab={tabs[index]} columns={column} ref={"table" + index} />
                        </TabPane>
                    })}
                </Tabs>
            </div>
        )
    }

}

export default Atable