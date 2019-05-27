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
                    count: 300
                }, {
                    area: '青羊区',
                    count: 20
                }]
            }
            this.setState({
                topData: data,
                loading: false
            })
            let mapData = [{
                name: '武侯区',
                value: 300
            },{
                name: '青羊区',
                value: 200
            }]

            let sortData = [{
                type: 'current',
                data: [{
                    name: '武侯区',
                    value: 300,
                    others: {
                        sum: 200,
                        rank: 10
                    }
                },{
                    name: '青羊区',
                    value: 200,
                    others: {
                        sum: 300,
                        rank: 50
                    }
                },{
                    name: '天府新区',
                    value: 200,
                    others: {
                        sum: 300,
                        rank: 50
                    }
                },{
                    name: '高新区',
                    value: 200,
                    others: {
                        sum: 300,
                        rank: 50
                    }
                },{
                    name: '成华区',
                    value: 200,
                    others: {
                        sum: 300,
                        rank: 50
                    }
                }],
                
            },{
                type: 'prev',
                data: [{
                    name: '武侯区',
                    value: 300,
                    others: {
                        sum: 100,
                        rank: 10
                    }
                },{
                    name: '青羊区',
                    value: 200,
                    others: {
                        sum: 100,
                        rank: 10
                    }
                },{
                    name: '天府新区',
                    value: 300,
                    others: {
                        sum: 300,
                        rank: 50
                    }
                },{
                    name: '高新区',
                    value: 200,
                    others: {
                        sum: 300,
                        rank: 50
                    }
                },{
                    name: '成华区',
                    value: 200,
                    others: {
                        sum: 300,
                        rank: 50
                    }
                }]
            }]
            let compareData = {
                'ability': [{
                    name: '武侯区',
                    account: 300,
                    percent: 10
                },{
                    name: '高新区',
                    account: 400,
                    percent: 30
                },{
                    name: '高新区',
                    account: 300,
                    percent: 10
                },{
                    name: '青羊区',
                    account: 600,
                    percent: 30
                }],
                'actions': [{
                    name: '武侯区',
                    account: 3,
                    percent: 10
                },{
                    name: '高新区',
                    account: 234,
                    percent: 30
                }],
                'effect': [{
                    name: '武侯区',
                    account: 345,
                    percent: -50
                },{
                    name: '高新区',
                    account: 300,
                    percent: 30
                }],
                'others': [{
                    name: '武侯区',
                    account: 5467,
                    percent: 10
                },{
                    name: '高新区',
                    account: 500,
                    percent: 30
                },{
                    name: '天府新区',
                    account: 600,
                    percent: 30
                }]
            }

            let rankData = [{
                name: '高',
                value: 100,
                areas: [{
                    name: '高新区',
                    value: 10
                }]
            }, {
                name: '较高',
                value: 20,
                areas: [{
                    name: '高新区',
                    value: 100000
                }]
            }, {
                name: '一般',
                value: 20,
                areas: [{
                    name: '高新区',
                    value: 10
                }]
            }, {
                name: '低',
                value: 20,
                areas: [{
                    name: '高新区',
                    value: 10
                }]
            }];

            this.refs.mapRefs.getCharts(mapData);
            this.refs.sortRefs.getCharts(sortData);
            this.refs.compareRefs.getCharts(compareData);
            this.refs.rankRefs.getCharts(rankData);

        }, 300)
    }

    changeTime(time) {
        // console.log(time);
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
                    <Top topData={topData} changeTime={(time) => { this.changeTime(time) }} />
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
