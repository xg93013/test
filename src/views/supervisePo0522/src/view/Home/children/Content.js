import React from "react";
import Top from "./Top";
import PotencyMap from "./PotencyMap";
import PotencyCompare from "./PotencyCompare";
import PotencySort from "./PotencySort";
import PotencyRank from "./PotencyRank";
import Loading from "../../Loading/Loading";

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            topData: [{
                name: '区县个数',
                unit: '个',
                count: 0,
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
            }]
        }
    }
    getData() {
        this.setState({
            loading: true
        })
        setTimeout(() => {
            let data = this.state.topData;
            for (let i = 0; i < 5; i++) {
                data[i].count = i;
                data[i].city = [{
                    area: '高新区',
                    count: 20
                }, {
                    area: '武侯区',
                    count: 20
                }]
            }
            this.setState({
                topData: data,
                loading: false
            })

            this.refs.mapRefs.getCharts([{
                name: '高新区',
                value: 20
            }])
            this.refs.sortRefs.getCharts()
            this.refs.compareRefs.getCharts()
            this.refs.rankRefs.getCharts()

        }, 300)
    }

    changeTime(type) {
        this.getData();
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        let {
            topData
        } = this.state;
        return (
            <div id="Content">
                <div className="wrapper">
                    <Top topData={topData} changeTime={(type) => { this.changeTime(type) }} />
                    <div className="main">
                        <div className="main-left">
                            <div><PotencyMap ref="mapRefs" /></div>
                            <div><PotencySort ref="sortRefs" /></div>
                        </div>
                        <div className="main-right">
                            <div><PotencyCompare ref="compareRefs" /></div>
                            <div><PotencyRank ref="rankRefs" /></div>
                        </div>
                    </div>
                </div>
                <Loading loading={this.state.loading} fixed loadingText="加载中" />
            </div>
        )
    }

}

export default Index
