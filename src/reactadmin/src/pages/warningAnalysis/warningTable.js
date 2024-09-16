import React, { Component } from "react";
import warningTable from "./warningTable";
import { Tabs, Tooltip } from "antd";
import "antd/dist/antd.css";
import "../../styles/warningTable.scss";
import axios from "axios";
import MyTable from "../../component/MyTable";
import MyForm from "../../component/MyForm";
import { Form } from "antd";

const TabPane = Tabs.TabPane;

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(MyForm);

export default class WarningAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabPosition: "top",
            dataSource: [],
            columns: [{
                    title: "num",
                    dataIndex: "id",
                    key: "id"
                },
                {
                    title: "num",
                    dataIndex: "name",
                    key: "name"
                },
                {
                    title: "num",
                    dataIndex: "num",
                    key: "num"
                },
                {
                    title: "num",
                    dataIndex: "address",
                    key: "address",
                    width: 200,
                    render: text => ( <
                            Tooltip placement = "topRight"
                            title = { text } >
                            <
                            div className = "overText w200" > { text } < /div> <
                            /Tooltip>
                        )
                        // render: (text) => <div className="overText">{text}<div className="toolTips"></div></div>
                }
            ]
        };
    }
    async getTableData() {
        this.setState({
            showLoading: true
        });
        let res = await axios.get("/api/tables");
        setTimeout(() => {
            this.setState({
                showLoading: false,
                dataSource: res.data.data
            });
        }, 2000);
    }
    rowClick(record) {
        console.log(record);
    }
    componentDidMount() {
        this.getTableData();
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
            }
        });
    }
    render() {
        return ( <
            div className = "warningTable" >
            <
            div className = "panels" >
            <
            Tabs tabPosition = { this.state.tabPosition }
            animated = { false }
            tabBarStyle = {
                {
                    background: "#f5f5f5"
                }
            } >
            <
            TabPane tab = "Tab 1"
            key = "1" > {
                /* <MyTable
                                dataSource={this.state.dataSource}
                                columns={this.state.columns}
                                showLoading={this.state.showLoading}
                                rowClick={record => this.rowClick(record)}
                              /> */
            } <
            div className = "form-box" >
            <
            WrappedNormalLoginForm / >
            <
            /div> <
            /TabPane> <
            TabPane tab = "Tab 2"
            key = "2" >
            2 <
            /TabPane> <
            TabPane tab = "Tab 3"
            key = "3" >
            3 <
            /TabPane> <
            /Tabs> <
            /div> <
            /div>
        );
    }
}