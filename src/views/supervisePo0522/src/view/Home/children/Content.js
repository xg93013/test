import React from "react";
import Top from "./Top";
import PotencyMap from "./PotencyMap";
import PotencyCompare from "./PotencyCompare";
import PotencySort from "./PotencySort";
import PotencyRank from "./PotencyRank";
import Loading from "../../Loading/Loading";
import http from "../../../unit/http.js";
import apis from "../../../unit/apis.js";

const {
    SUPNUM,
    ETNUM,
    DOWNAREA,
    UPAREA,
    COMPARISON,
    GRADE_AREA,
    AREA_TOP
} = apis;

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            topData: [{
                name: '区县个数',
                unit: '个',
                count: 22,
                city: []
            }, {
                name: '监管人员数量',
                unit: '位',
                count: 0,
                city: []
            }, {
                name: '监管企业数量',
                unit: '家',
                count: 0,
                city: []
            }, {
                name: '效能下降区县数量',
                unit: '环比',
                count: 0,
                city: []
            }, {
                name: '效能上升区县数量',
                unit: '环比',
                count: 0,
                city: []
            }],
            currentTime: {}
        }
    }
    async getData(time) {
        this.setState({
            loading: true
        })
        let urls = '';
        let year = parseInt(time.year);
        if (time.msg === '') {
            urls += '/' + year + '/0';
        } else {
            urls += '/' + year + '/' + parseInt(time.msg.replace('月', ''));
        }
        let topData = this.state.topData;

        let [supNum, etNum, downArea, upArea, comparison, gradeArea, areaTop] = await Promise.all([
            http.get(SUPNUM),
            http.get(ETNUM),
            http.get(DOWNAREA + urls),
            http.get(UPAREA + urls),
            http.get(COMPARISON + urls),
            http.get(GRADE_AREA + urls),
            http.get(AREA_TOP + urls)
        ])
        if (supNum) {
            topData[1].count = supNum.data.totalNum;
            topData[1].city = supNum.data.dataList;
        }
        if (etNum) {
            topData[2].count = etNum.data.totalNum;
            topData[2].city = etNum.data.dataList;
        }
        if (downArea) {
            topData[3].count = downArea.data.totalNum;
            topData[3].city = downArea.data.dataList;
        }
        if (upArea) {
            topData[4].count = upArea.data.totalNum;
            topData[4].city = upArea.data.dataList;
        }
        if (comparison) {
            this.refs.compareRefs.getCharts(comparison.data);
        }
        if (gradeArea) {
            this.refs.rankRefs.getCharts(gradeArea.data);
        }
        if (areaTop) {
            this.refs.mapRefs.getCharts(areaTop.data);
            this.refs.sortRefs.getCharts(areaTop.data);
        }
        this.setState({
            topData: topData,
            currentTime: {
                year: year,
                month: time.msg === '' ? 0 : parseInt(time.msg.replace('月', ''))
            },
            loading: false
        })
    }

    changeTime(time) {
        setTimeout(() => {
            this.getData(time);
        })
    }

    componentDidMount() {
        // this.getData();
    }

    render() {
        let {
            topData,
            currentTime
        } = this.state;
        return (
            <div id="Content">
                <div className="wrapper">
                    <Top topData={topData} changeTime={(time) => { this.changeTime(time) }} />
                    <div className="main">
                        <div className="main-left">
                            <div><PotencyMap ref="mapRefs" currentTime={currentTime} /></div>
                            <div><PotencySort ref="sortRefs" currentTime={currentTime} /></div>
                        </div>
                        <div className="main-right">
                            <div><PotencyCompare ref="compareRefs" currentTime={currentTime} /></div>
                            <div><PotencyRank ref="rankRefs" /></div>
                        </div>
                    </div>
                </div>
                <Loading loading={this.state.loading} fixed loadingText="加载中" />
            </div>
        )
    }

}

export default Content
