import React from "react";
import {
    Table,
    LocaleProvider
} from "antd";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import apis from "../../unit/apis";
import http from "../../unit/http";

const { EW_LIST } = apis;

class Tablea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            locale: {
                emptyText: '暂无数据'
            },
            data: [],
            pagination: {
                total: 100,
                current: 1,
                onChange: this.getTables.bind(this),
                defaultCurrent: 1,
                pageSize: 10,
                size: "middle"
            }

        }
    }

    async getTables(page) {
        let { tab } = this.props;
        this.setState({
            loading: true
        });
        let res = await http.get(EW_LIST + "?tab=" + tab + "&pageNo=" + page);
        if (res) {
            this.setData(res.data);
        }
        this.setState({
            loading: false
        });
    }

    setData(tableList) {
        let { content, pageNumber, totalElements } = tableList.data;
        let { pagination } = this.state;
        pagination.current = pageNumber;
        pagination.total = totalElements;
        this.setState({
            data: content,
            pagination
        })
    }

    render() {
        let { locale, data, pagination, loading } = this.state;
        let { columns } = this.props;
        return (
            <LocaleProvider locale={zhCN}>
                <Table
                    style={{ background: "#fff", marginTop: "10px" }}
                    rowKey="name"
                    size="middle"
                    loading={loading}
                    locale={locale}
                    bordered
                    columns={columns}
                    dataSource={data}
                    pagination={pagination} />
            </LocaleProvider>
        )
    }

}

export default Tablea