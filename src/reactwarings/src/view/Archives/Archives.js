import React from "react";
import {
    Input,
    Pagination
} from "antd";
import "./Archives.scss";
import Overview from "../Overview/Overview";
import apis from "../../unit/apis";
import http from "../../unit/http";

const { DETAIL_SEARCH } = apis;

const Search = Input.Search;

class Archives extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            isSearch: false,
            searchWord: "",
            isDetail: false,
            page: 1,
            orgTotal: 0,
            loading: false,
            times: ""

        }
        this.detailBack = this.detailBack.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.keyWordSearch = this.keyWordSearch.bind(this);
        this.listDetail = this.listDetail.bind(this);
    }

    keyWordSearch(e) {
        let { searchWord } = this.state;
        if (e === searchWord) {
            return false
        }
        if (e) {
            this.setState({
                page: 1,
                searchWord: e,
                isSearch: true
            });
            setTimeout(() => {
                this.getOrgLists();
            });
        } else {
            this.setState({
                searchWord: e,
                isSearch: false,
                page: 1,
                datas: [],
                orgTotal: 0
            })
        }
    }

    async getOrgLists() {
        let {
            searchWord,
            page,
            loading
        } = this.state;
        if (loading) {
            return false;
        }
        this.setState({
            loading: true
        });
        this.props.changeLoading(true);
        let res = await http.get(DETAIL_SEARCH + "/" + searchWord + "/" + page);
        if (res) {
            this.props.changeLoading(false);
            let {
                content,
                totalElements
            } = res.data
            this.setState({
                loading: false,
                datas: [...content],
                orgTotal: totalElements,
                times: res.msg
            })
        }
    }

    detailBack() {
        this.setState({
            isDetail: false
        })
    }

    listDetail(detailValue) {
        this.setState({
            isDetail: true
        });
        this.refs.orgDetail.getDetails(detailValue)
    }

    pageChange(page) {
        this.setState({
            page
        });
        setTimeout(() => {
            this.getOrgLists();
        });
    }

    render() {
        let {
            page,
            orgTotal,
            isSearch,
            isDetail,
            times
        } = this.state;
        return (
            <div
                id="archives"
                className="con-box"
            >
                <div
                    className={isSearch ? "search-box-b" : "search-box-a"}
                    style={{ display: isDetail ? "none" : "block" }}
                >
                    <div
                        style={{
                            display: isSearch ? "none" : "",
                            textAlign: "center",
                            marginBottom: "20px",
                            fontSize: "30px",
                            color: "#276AB0"
                        }}>
                        <img
                            src={require("./images/logo.png")}
                            alt=""
                        /> 餐饮企业全息档案
                    </div>
                    <Search
                        placeholder="请输入要查询的企业名称"
                        onSearch={this.keyWordSearch}
                        enterButton
                    />
                </div>
                <div
                    className="alert-text"
                    style={{ display: isSearch && !isDetail ? "block" : "none" }}
                >
                    {orgTotal ? (orgTotal > 10 ? "查询结果为 " + orgTotal + " 条信息，查询用时 " + times + " 毫秒，请输入更精确查询条件" : "查询用时 " + times + " 毫秒，查询到 " + orgTotal + " 条信息") : "无结果"}
                </div>
                <div
                    className="search-lists"
                    style={{ display: isSearch && !isDetail ? "block" : "none" }}
                >
                    {this.state.datas.map((item, index) => {
                        return <div
                            key={index}
                            className="search-list"
                            onClick={() => this.listDetail(item.qylsh)}
                        >
                            <span>{item.name}</span> <br />
                            <span>{item.address}</span>
                        </div>
                    })}
                </div>
                <div
                    className="pag-box pub-table"
                    style={{ display: isSearch && !isDetail && orgTotal !== 0 ? "block" : "none" }}
                >
                    <Pagination
                        current={page}
                        defaultPageSize={10}
                        total={orgTotal}
                        onChange={this.pageChange}
                    />
                </div>
                <div style={{ display: isDetail ? "block" : "none" }}>
                    <Overview
                        pageBack={this.detailBack}
                        ref="orgDetail"
                        changeLoading={this.props.changeLoading}
                    />
                </div>
            </div>
        )
    }
}

export default Archives