import React from "react";
import store from '../../redux/store';
import { changeLoading } from "../../redux/actions/actions";
import { Cascader, Icon } from "antd";
import apis from "../../unit/apis";
import http from "../../unit/http";
import All from "./All";
import Chart from "./Chart";
import Rtable from "./Rtable";
import "./Result.scss";

const { INSPECT_LIST_DATE,
    INSPECT_STATUS,
    INSPECT_AREA,
    INSPECT_LIST } = apis;
class Result extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            defaultValue: [],
            leftLists: ["网络餐饮", "餐厨垃圾", "等级评定", "农产品预警", "名厨亮灶", "乡村群宴"],
            tabs: ["NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD", "NETFOOD"],
            leftListNum: -1,
            allDatas: [],
            tableDatas: {},
            status: ""
        }
    }

    async getTimes() {
        let res = await http.get(INSPECT_LIST_DATE + "?tab=" + this.state.tabs[this.state.leftListNum]);
        store.dispatch(changeLoading(true))
        if (res) {
            let options = [];
            res.data.forEach(item => {
                options.push({
                    value: item.years + "年",
                    label: item.years + "年",
                    children: item.data.month.map(itema => {
                        return {
                            value: itema.date,
                            label: itema.date,
                            disabled: !itema.mark
                        }
                    })
                })
            });
            this.setState({
                options,
                defaultValue: [res.data[0].years + "年"]
            });
            this.getDatas([res.data[0].years + "年"])
        }
    }

    listChange(leftListNum) {
        if (this.state.leftListNum === leftListNum) {
            return false;
        }
        this.refs.all.resetNum();
        this.setState({
            leftListNum
        })
        setTimeout(() => {
            this.getTimes()
        })
    }

    async getDatas(arr) {
        this.refs.all.resetNum();
        this.setState({
            defaultValue: arr
        })
        let arg = "&year=" + arr[0].split("年")[0] + (arr.length > 1 ? "&month=" + arr[1].split("月")[0] : "");
        let [all] = await Promise.all([
            http.get(INSPECT_STATUS + "?tab=" + this.state.tabs[this.state.leftListNum] + arg),
        ]);
        if (all) {
            this.setState({
                allDatas: [...all.data]
            });
            this.getOtherDatas(all.data[0].status);
        }
    }

    async getOtherDatas(status) {
        this.setState({
            status
        });
        let arr = this.state.defaultValue;
        let arg = "&year=" + arr[0].split("年")[0] + (arr.length > 1 ? "&month=" + arr[1].split("月")[0] : "");
        store.dispatch(changeLoading(true))
        let [area, tableList] = await Promise.all([
            http.get(INSPECT_AREA + "?tab=" + this.state.tabs[this.state.leftListNum] + arg + "&status=" + status),
            http.get(INSPECT_LIST + "?tab=" + this.state.tabs[this.state.leftListNum] + arg + "&status=" + status + "&pageNo=1")
        ]);
        if (area) {
            this.refs.chart.getCharts([...area.data])
        }
        if (tableList) {
            this.refs.table.setData({ ...tableList.data })
        }
        store.dispatch(changeLoading(false))
    }


    componentDidMount() {
        this.listChange(0)
    }

    render() {
        let { defaultValue, tabs,options, leftListNum, allDatas, leftLists, status } = this.state;
        return (
            <div id="result" className="result">
                <div className="left">
                    <Cascader
                        suffixIcon={<Icon type="caret-down" />}
                        style={{ width: "160px", marginLeft: "20px" }}
                        value={defaultValue}
                        allowClear={false}
                        options={options}
                        onChange={this.getDatas.bind(this)}
                        changeOnSelect
                        expandTrigger="hover" />
                    {
                        leftLists.map((item, index) => {
                            return <div
                                onClick={this.listChange.bind(this, index)}
                                key={index}
                                className={index === leftListNum ? "left-list left-list-active" : "left-list"}>
                                {item}
                            </div>
                        })
                    }
                </div>
                <div className="right">
                    <div className="right-box">
                        <All ref="all" getOtherDatas={this.getOtherDatas.bind(this)} allDatas={allDatas} num={leftListNum} />
                        <Chart ref="chart" />
                        <Rtable ref="table" status={status} tabs={tabs[leftListNum]} defaultValue={defaultValue} listName={leftLists[leftListNum]} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Result