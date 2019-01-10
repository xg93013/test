import React, {Component} from 'react'
import axios from 'axios'
import '../../styles/next.scss'
// const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : ''
import Header from '../header/header'
import Nav from '../nav/nav'
import Page2 from '../page2'
import MyTable from '../../component/MyTable'
import {Tabs, Table, Tooltip, Spin, Button} from 'antd'
import 'antd/dist/antd.css'
import DateSelect from '../../component/DateSelect'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
// import {createStore} from 'redux'

import chengdu from '../../datas/chengdu.json'

// import * as types from '@/types/types.js'

echarts.registerMap('chengdu', chengdu)

const TabPane = Tabs.TabPane

// function count(state = 0, action) {
//     switch (action.type) {
//         case 'ADD':
//             return state + 1
//         case 'REDUCER':
//             return state - 1;
//         default:
//             return state
//     }
// }

// let store = createStore(count);

// let currentValue = store.getState();
// console.log('当前的值:', currentValue);

// //定义一个监听的方法
// let listener = () => {
//     const previosValue = currentValue;
//     currentValue = store.getState();
//     console.log('上一个值:', previosValue, '当前值:', currentValue)
// }
// //创建一个监听
// store.subscribe(listener);
// //分发任务
// store.dispatch({type:"ADD"});
// store.dispatch({type:"ADD"});
// store.dispatch({type:"ADD"});
// store.dispatch({type:"REDUCER"});

export default class About extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLoading: false,
            text: 'parentData',
            myChart: '',
            mapChart: '',
            tabPosition: 'top',
            dataSource: [],
            columns: [{
                title: 'num',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: 'num',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: 'num',
                dataIndex: 'num',
                key: 'num',
            }, {
                title: 'num',
                dataIndex: 'address',
                key: 'address',
                width: 200,
                render: (text) => <Tooltip placement="topRight" title={text}><div className="overText w200">{text}</div></Tooltip>
                // render: (text) => <div className="overText">{text}<div className="toolTips"></div></div>
            }],
            nexts: ['next','next']
        }
    }
    getData() {
        // axios.get('/api/getUserInfo').then(response => {
        //     // console.log(response)
        // });
        this.getAllData();
    }
    async getAllData() {
        this.setState({
            showLoading: true
        })
        let res = await axios.get('/api/tables');
        setTimeout(() => {
            this.setState({
                showLoading: false,
                dataSource: res.data.data
            })
        }, 2000)
        
    }
    setNextList(){
        this.props.nextActions.updateNext(this.state)
        // this.setState({
        //     nextList: this.props.nextList
        // })

        // console.log(this.props.nextList.nexts)
    }
    initChart() {
        let mychart = echarts.init(document.getElementById('chart-box'));
        let data = [20, 30, 40, 20, 20];
        let data1 = [30, 10, 10, 20, 20];
        let option = {
            title: {
                text: '',
                left: 20,
                top: 10,
                fontWeight: 'lighter'
            },
            tooltip: {
                formatter: '安全等级：{b0}<br />商家数量：{c0}'
            },
            legend: {
                textStyle: {
                    color: '#fff'
                }
            },
            xAxis: {
                // boundaryGap: false,
                data: [
                    1, 2, 3, 4, 5
                ],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#0E50A7'],
                        width: 1,
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#145BB4'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#698EAF'
                }

            },
            yAxis: {
                type: 'value',
                min: 0,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#0E50A7'],
                        width: 1,
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#145BB4'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#698EAF'
                },
                // max: 200
            },
            series: [
                {
                    name: 'lengend1',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'bars',
                    data: data,
                    itemStyle: {
                        color: "#45BFFE",
                        // barBorderRadius: [22, 22, 0, 0],
                    }
                }, {
                    name: 'lengend2',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'bars',
                    data: data1,
                    itemStyle: {
                        color: "green",
                        // barBorderRadius: [22, 22, 0, 0],
                    }
                }
            ]
        }
        mychart.setOption(option);
        window.addEventListener('resize', () => {
            mychart.resize()
        })
        this.setState({myChart: mychart})
    }
    initMap() {
        let mapChart = echarts.init(document.getElementById('map-area'))
        let options = {
            // backgroundColor: '#1F2F3C',
            title: {
                text: '区域地图',
                top: 10,
                left: 10,
                textStyle: {
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 400
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params, ticket, callback) {
                    //x轴名称
                    var name = params.name
                    //图表title名称
                    var seriesName = params.seriesName
                    //值
                    var value = params.value
                    if (isNaN(value)) {
                        return name + '<br />暂无'
                    } else {
                        return name + '<br />' + seriesName + ':' + value
                    }
                    // var valueFliter = formatter(value)
                }
            },
            visualMap: {
                type: 'continuous',
                min: 10,
                max: 200,
                right: '10',
                bottom: '2',
                color: [
                    '#039bd8', '#a5def6'
                ],
                text: [
                    '高', '低'
                ],
                calculable: true,
                itemWidth: 12,
                itemHeight: 70,
                textGap: 5,
                textStyle: {
                    color: '#ffffff'
                }
            },
            series: [
                {
                    name: "风险指数",
                    type: 'map',
                    mapType: 'chengdu',
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            areaColor: '#fff'
                        },
                        emphasis: {
                            label: {
                                show: true
                            },
                            areaColor: "#b5d5ff"
                        }
                    },
                    data: [
                        {
                            name: '双流区',
                            value: Math.round(Math.random() * 1000)
                        }
                    ]
                }
            ]
        }
        mapChart.setOption(options)
        window.addEventListener('resize', () => {
            mapChart.resize()
        })
        this.setState({mapChart: mapChart})
    }
    rowClick(record) {
        console.log(record)
    }
    changeText(newText) {
        this.setState({text: newText})
    }
    changeTime(time) {
        console.log(time);
    }
    componentWillMount() {
        // this.setNextList()
    }
    componentDidMount() {
        this.getData()
        // this.initChart();
        
        // console.log(this.props.nextList)
        // this.initMap();
    }
    render() {
        return (
            <div className="containers">
                <Header headTitle={this.state.headTitle}/>
                <Nav {...this.props}></Nav>
                <div className="main">
                    <div className="mainWrapper nexts">
                        {/* <Button onClick={this.setNextList.bind(this)}>setNext</Button> */}
                        {/* <div className="chart-x">
                            
                            <div className="chart-box"></div>
                            <div className="chart-box" id="chart-box"></div>
                        </div> */}
                        {/* {
                            this.props.nextList === '' ?
                            <span></span>
                            : 
                            this.props.nextList.nexts.map((item,i)=>(
                                <span key={i}>{item}</span>
                            ))
                        } */}
                        {/* <div className="chart-box" id="map-area"></div> */}
                        {/* <DateSelect changeTime={(time) => this.changeTime(time)}/> */}
                        {/* <Page2 parentData={this.state.text} changeText={newText => this.changeText(newText)}></Page2> */}
                        <div className="panels">
                            <Tabs
                                tabPosition={this.state.tabPosition}
                                animated={false}
                                tabBarStyle={{
                                'background': '#f5f5f5'
                            }}>
                                <TabPane tab="Tab 1" key="1">
                                    <MyTable dataSource={this.state.dataSource} columns={this.state.columns} showLoading={this.state.showLoading} rowClick={(record) => this.rowClick(record)}></MyTable>
                                </TabPane>
                                <TabPane tab="Tab 2" key="2">2</TabPane>
                                <TabPane tab="Tab 3" key="3">3</TabPane>
                            </Tabs>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}