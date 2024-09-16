import React from "react";
import store from '../../redux/store';
import { changeLoading } from "../../redux/actions/actions";
import "./Analysis.scss";
import All from "./All";
import Chart from "./Chart";
import Atable from "./Atable";
import apis from "../../unit/apis";
import http from "../../unit/http";

const { FULL_STATISTICS, AREA_FULL_STATISTICS } = apis;

class Analysis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allDatas: [],
            area: {},
            status: ""
        }
    }

    async getAllDatas() {
        store.dispatch(changeLoading(true));
        let res = await http.get(FULL_STATISTICS);
        if (res) {
            let { data } = res;
            this.setState({
                allDatas: [...data]
            });
            this.getOtherDatas(data[0].status)
        }
    }

    async getOtherDatas(status) {
        store.dispatch(changeLoading(true));
        let [area] = await Promise.all([
            http.get(AREA_FULL_STATISTICS + "?dateType=" + status)
        ])
        if (area) {
            this.refs.chart.getCharts({ ...area.data })
        }
        store.dispatch(changeLoading(false));
    }

    componentWillMount() {
        this.getAllDatas();
    }

    render() {
        const { allDatas, area } = this.state;
        return (
            <div id="analysis" className="con-box">
                <div className="top">
                    <All getOtherDatas={this.getOtherDatas.bind(this)} allDatas={allDatas} />
                    <Chart ref="chart" area={area} />
                </div>
                <Atable />
            </div>
        )
    }
}


export default Analysis