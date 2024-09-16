import React, { Component } from "react";
import "../../styles/about.scss";
import axios from "axios";
import { Table, Select, Input, Button } from "antd";
import "antd/dist/antd.css";
import Header from "../header/header";
import Nav from "../nav/nav";

const Option = Select.Option;

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headTitle: "admin",
      text: "132",
      dataSource: [],
      openKeys: [],
      columns: [
        {
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
          key: "address"
        }
      ],
      subMenu: [],
      chartOption: "",
      form: {
        userName: "",
        password: ""
      },
      leftList: []
    };
    this.keySearch = this.keySearch.bind(this);
    // this.selectLevel.bind = this.selectLevel.bind.bind(this);
  }
  async getData() {
    let res = await axios.get("/api/tables");
    this.setState({
      dataSource: res.data.data
    });
  }
  async getLeftList() {
    let res = await axios.get("/api/leftList");
    this.setState({
      leftList: res.data.data
    });
  }
  handleChange(value) {
    // console.log(value)
  }
  componentDidMount() {
    this.getData();
    this.getLeftList();
  }
  selectLevel(level) {
    console.log(level);
  }
  keySearch(keyWord) {
    let newList = [];
    for (let i = 0; i < 10; i++) {
      newList.push({
        name: "成都大风炊餐饮管理有限责任公司",
        address: "金牛区-XX街道",
        area: "金牛区",
        percent: "10"
      });
    }
    this.setState({
      leftList: newList
    });
  }
  render() {
    const { dataSource, columns } = this.state;
    return <div className="box" />;
  }
}
