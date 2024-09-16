import React from "react";
import { Input, Pagination } from "antd";
import "./Archives.scss";
import Overview from "../Overview/Overview";

const Search = Input.Search;

class Archives extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            isSearch: false,
            searchWord: "",
            isDetail: false
        }
        this.detailBack = this.detailBack.bind(this);
    }

    keyWordSearch(e) {
        if (e === this.state.searchWord) {
            return false
        }
        if (e && !this.state.searchWord) {
            this.setState({
                searchWord: e,
                isSearch: true
            })
        }
        if (!e && this.state.searchWord) {
            this.setState({
                searchWord: e,
                isSearch: false
            })
        }
    }

    detailBack() {
        this.setState({
            isDetail: false
        })
    }

    listDetail() {
        this.setState({
            isDetail: true
        })
    }

    componentDidMount() {
        let datas = []
        for (let i = 0; i < 10; i++) {
            datas.push({
                name: "双流麒麟胖哥火锅食府",
                addr: "成都市双流区东升街道金河路3999号"
            })
        }

        this.setState({
            datas
        })
    }

    render() {
        return (
            <div id="archives" className="con-box">
                <div className={this.state.isSearch ? "search-box-b" : "search-box-a"} style={{ display: this.state.isDetail ? "none" : "block" }}>
                    <div style={{ display: this.state.isSearch ? "none" : "",textAlign: "center", marginBottom: "20px", fontSize: "30px", color: "#276AB0" }}>
                        <img src={require("./images/logo.png")} alt="" /> 餐饮企业全息档案
                    </div> 
                    <Search
                        placeholder="请输入要查询的企业名称"
                        onSearch={this.keyWordSearch.bind(this)}
                        enterButton
                    />
                </div>
                <div className="alert-text" style={{ display: this.state.isSearch && !this.state.isDetail ? "block" : "none" }}>
                    查询结果超过 50 调信息，查询用时 16 毫秒，请输入更精确查询条件
                </div>
                <div className="search-lists" style={{ display: this.state.isSearch && !this.state.isDetail ? "block" : "none" }}>
                    {this.state.datas.map((item, index) => {
                        return <div key={index} className="search-list" onClick={this.listDetail.bind(this)}>
                            <span>{item.name}</span> <br />
                            <span>{item.addr}</span>
                        </div>
                    })}
                </div>
                <div className="pag-box pub-table" style={{ display: this.state.isSearch && !this.state.isDetail ? "block" : "none" }}>
                    <Pagination defaultCurrent={6} total={500} />
                </div>
                <div style={{ display: this.state.isDetail ? "block" : "none" }}>
                    <Overview pageBack={this.detailBack} />
                </div>
            </div>
        )
    }
}

export default Archives