import React, { Component } from 'react'
import { Select, Input, Button, Progress, Spin} from 'antd'
import 'antd/dist/antd.css'

import '../../styles/about.scss'
import axios from 'axios'

import { Link } from 'react-router-dom'
import Header from '../header/header'
import Nav from '../nav/nav'
import { Map, Marker, InfoWindow } from 'react-amap'

import mapData from '../../datas/mapData.json'

const Option = Select.Option;


export default class About extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headTitle: 'admin',
            keyWord: '',
            totalData: [],
            topData: [],
            showTopModal: false,
            leftList:[],
            cityList: [],
            areaList: [],
            projectList: [],
            mapCenter: [104.06476,30.57020],
            markerArr: [],
            showLoading: false,
            modalInfo: {
                enterpriseName: '成都大风炊餐饮管理有限责任公司',
                area: '金牛区-XX街道',
                address: '成都市金牛区马家花园路2号1-2楼',
                imgs: [{
                    path: 'paths',
                    title: '营业执照'
                }],
                riskLevel: 'A',
                score: '98',
                toScore: '88',
                updatetime: '2017-10-20'
            },
            rightFilter: {
                area: '',
                city: '',
                project: ''
            },
            infoWindow: {
                visible: false,
                // value: 1,
                htmls: '',
                position: {
                    longitude: 120,
                    latitude: 30
                },
                offset: [0, 0],
                size: {
                    width: 200,
                    height: 140,
                }
            }
        }
        this.selectMarker = {
            created:(instance)=>{
                // console.log(instance)
            },
            click:(e)=>{
                let htmls = document.getElementById('infoWindowRefs').innerHTML;
                this.setState({
                    mapCenter: [e.target.getPosition().lng, e.target.getPosition().lat],
                    modalInfo: {
                        enterpriseName: e.target.getExtData().enterpriseName,
                        area: e.target.getExtData().area,
                        address: e.target.getExtData().address
                    },
                    // infoWindow: {
                        
                    //     size: {
                    //         width: 200,
                    //         height: 140,
                    //     }
                    // },
                    infoWindow: Object.assign({}, this.state.infoWindow, {
                        visible: true,
                        position: {
                            longitude: e.target.getPosition().lng,
                            latitude: e.target.getPosition().lat
                        },
                        offset: [0, -10],
                        htmls: htmls,
                    })
                })
            }
        }
        this.selectMap = {
            created: () =>{},
            click: (e) => {
                this.setState({
                    infoWindow: {
                        visible: false,
                        offset: [0, 0]
                    }
                })
            }
        }
        this.windowEvents = {
            created: (iw) => {console.log('iw')},
            open: () => {console.log('InfoWindow opened')},
            close: () => {console.log('InfoWindow closed')},
            change: () => {console.log('InfoWindow prop changed')},
          }
        // this.selectLevel.bind = this.selectLevel.bind.bind(this);
    }
    getData() {
        console.log(mapData);
        this.setState({
            showLoading: true
        })
        setTimeout(()=>{
            this.setState({
                // showLoading: false,
                totalData: mapData.data.list,
                topData: mapData.data.list.slice(0, 10)
            })
        },3000)
        
        // let res = await axios.get('/api/tables');
        // this.setState({
        //     dataSource: res.data.data
        // })
    }
    getSelectList(){
        let citylist = [{
            label: '1',
            value: 'selct1'
        },{
            label: '2',
            value: 'selct2'
        }];
        let arealist = [{
            label: '1',
            value: 'area1'
        },{
            label: '2',
            value: 'area2'
        }];
        let projectlist = [{
            label: '1',
            value: 'selct1'
        },{
            label: '2',
            value: 'selct2'
        }];
        this.setState({
            cityList: citylist,
            areaList: arealist,
            projectList: projectlist
        })
    }
    handleChangeCity(value){
        this.setState({
            rightFilter: Object.assign({}, this.state.rightFilter, {
                city: value
            })
        })
        console.log(value)
    }
    handleChangeArea(value){
        this.setState({
            rightFilter: Object.assign({}, this.state.rightFilter, {
                area: value
            })
        },()=>{
            console.log(this.state.rightFilter)
        }
            
        )
        console.log(value)
    }
    handleChangeProject(value){
        this.setState({
            rightFilter: Object.assign({}, this.state.rightFilter, {
                project: value
            })
        })
        console.log(value)
    }
    componentWillMount(){
        
    }
    componentDidMount(){
        this.getData();
        this.getSelectList();
    }
    selectLevel(level){
        console.log(level)
    }
    keySearch(){
        // let keyWord = findDOMNode(document.getElementById('keyWordRefs'));
        // console.log(keyWord.value);
        let keyWord = this.state.keyWord;
        // console.log(keyWord);
        // let newList = [];
        // for(let i=0;i<1;i++){
        //     newList.push({
        //         name: '成都大风炊餐饮管理有限责任公司',
        //         address: '金牛区-XX街道',
        //         area: '金牛区',
        //         percent: '10',
        //         lng: '104.06476',
        //         lat: '30.57020',
        //         riskLevel: 2
        //     })
        // }
        // this.setState({
        //     leftList: newList
        // })
        this.getData();
    }
    showMoreModal(){
        this.setState({
            showTopModal: true
        })
    }
    closeModal(){
        this.setState({
            showTopModal: false
        })
    }
    changeKeyWord(e){
        this.setState({
            keyWord: e.target.value
        })
    }
    render() {
        return (
            <div className="aboutCon">
                <Header headTitle={this.state.headTitle}/>
                <Nav {...this.props} />
                <div className="main">
                    <div className="abouts">
                        <div className="leftFilter">
                            <div className="left-search">
                                <Input placeholder="请输入要查询的企业名称" className="leftInput float-item" value={this.state.keyWord} onChange={this.changeKeyWord.bind(this)} id="keyWordRefs"/>
                                <Button type="primary" icon="search" width="40" className="leftBtn float-item" onClick={this.keySearch.bind(this)}></Button>
                            </div>
                            <div className="left-list">
                                <div className="head">TOP10</div>
                                <div className="item-box">
                                {
                                    this.state.topData.map((item, i)=> (
                                        <div className="item" key={i} onClick={this.showMoreModal.bind(this)}>
                                            <div className="left">
                                                <span className="inItem">{item.enterpriseName}</span>
                                                <span className="inItem">所属区域：{item.area}</span>
                                                <span className="inItem">{item.address}</span>
                                            </div>
                                            <div className="right">
                                                {/* <divrogress type="circle" percent={Number(item.percent)} width="50"></Progress> */}
                                            </div>
                                        </div>
                                    ))
                                }
                                <div className="loadings">
                                <Spin tip="Loading..." size="small" wrapperClassName="spins" style={{display: this.state.showLoading ? 'block' : 'none', 'marginTop' : '50px'}}></Spin></div>
                                
                                </div>
                                
                            </div>
                            
                        </div>

                        <div className="rightFilter">
                            <div className="select-box">
                                <Select placeholder="city" onChange={this.handleChangeArea.bind(this)} className="select-item">
                                    {
                                        this.state.areaList.map((item,i) => (
                                            <Option value={item.value} key={item.label}>{item.label}</Option>
                                        ))
                                    }
                                </Select>
                                <Select placeholder="lucy" onChange={this.handleChangeCity.bind(this)} className="select-item">
                                    {
                                        this.state.cityList.map((item,i) => (
                                            <Option value={item.value} key={item.label}>{item.label}</Option>
                                        ))
                                    }
                                </Select>
                                <Select placeholder="project" onChange={this.handleChangeProject.bind(this)} className="select-item">
                                    {
                                        this.state.projectList.map((item,i) => (
                                            <Option value={item.value} key={item.label}>{item.label}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className="color-range">
                                <span className="item" onClick={this.selectLevel.bind(this,1)}></span>
                                <span className="item" onClick={this.selectLevel.bind(this,2)}></span>
                                <span className="item" onClick={this.selectLevel.bind(this,3)}></span>
                                <span className="item" onClick={this.selectLevel.bind(this,4)}></span>
                                <span className="item" onClick={this.selectLevel.bind(this,5)}></span>
                            </div>
                        </div>

                        <div className="mapCon">
                            <Map amapkey={'c85b169acc3c5472b5f282ec4cfb5198'} center={this.state.mapCenter} mapStyle={'normal'} events={this.selectMap} >
                                {
                                    this.state.totalData.map((item, i) => (
                                        item.longitude !== 'null' && item.latitude !== 'null' 
                                        ? <Marker position={[item.longitude, item.latitude]} icon={item.grade!=="" 
                                        ? require(`../../images/float-${item.grade}.png`) 
                                        : require(`../../images/float-A.png`)} extData={item} key={i} clickable events={this.selectMarker} /> 
                                        : ''
                                    ))
                                }
                                <InfoWindow 
                                    position={this.state.infoWindow.position}
                                    visible={this.state.infoWindow.visible}
                                    isCustom={true}
                                    content={this.state.infoWindow.htmls}
                                    offset={this.state.infoWindow.offset}
                                    events={this.windowEvents} />
                                
                            </Map>
                        </div>
                        {/* 左侧弹信息 */}
                        <div className={this.state.showTopModal === true ? 'topModal showModal' : 'topModal hideModal'} id="mouseModal">
                            <div className="close" onClick={this.closeModal.bind(this)}>X</div>
                            <div className="title">概况描述</div>
                            <div className="infobox">
                                <div className="leftTitle">基本信息</div>
                                <div className="right">
                                    <div className="items">
                                        <div className="name">企业名称：</div>
                                        <div className="texts">{this.state.modalInfo.enterpriseName}</div>
                                    </div>
                                    <div className="items">
                                        <div className="name">所属区域：</div>
                                        <div className="texts">{this.state.modalInfo.area}</div>
                                    </div>
                                    <div className="items">
                                        <div className="name">企业地址：</div>
                                        <div className="texts">{this.state.modalInfo.address}</div>
                                    </div>
                                    <div className="items">
                                        <div className="name">资质许可:</div>
                                        <div className="img-pos">
                                            <div><img src="" alt=""/></div>
                                            <div>营业执照</div>
                                        </div>
                                        <div className="img-pos">
                                            <div><img src="" alt=""/></div>
                                            <div>食品经营许可证</div>
                                        </div>
                                        <div className="img-pos">
                                            <div><img src="" alt=""/></div>
                                            <div>xxxx证</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="infobox">
                                <div className="other-left">
                                    <div className="level">A</div>
                                    <div>监管等级：{this.state.modalInfo.level}</div>
                                    <div>本期得分：{this.state.modalInfo.score}</div>
                                    <div>建议调整得分至{this.state.modalInfo.toScore}</div>
                                </div>
                                <div className="other-right">
                                    <div className="items">
                                        <div className="name">网络餐饮数据:</div>
                                        <div className="texts">{this.state.modalInfo.updatetime}</div>
                                    </div>
                                    <div className="items">
                                        <div className="name">明厨亮灶数据:</div>
                                        <div className="texts">接入时间{this.state.modalInfo.updatetime}<a href="#">查看视频</a></div>
                                    </div>
                                    <div className="items">
                                        <div className="name">食材溯源数据:</div>
                                        <div className="texts">暂未接入</div>
                                    </div>
                                    <div className="items">
                                        <div className="name">餐厨垃圾数据:</div>
                                        <div className="texts">数据最近更新日期{this.state.modalInfo.updatetime}</div>
                                    </div>
                                    <div className="items">
                                        <div className="name">监督抽检数据:</div>
                                        <div className="texts">数据最近更新日期{this.state.modalInfo.updatetime}</div>
                                    </div>
                                    {/* <div className="items"></div> */}
                                </div>
                                <div className="other-links">
                                    <Link to='/' className="more">查看更多详细数据</Link>
                                    {/* <router-link :to="{path: ''}" tag="span">查看更多详细数据</router-link> */}
                                </div>
                            </div>
                        </div>

                        {/* 弹出窗口 */}
                        <div  ref="infoWindowRefs" id="infoWindowRefs" className="infoWindow">
                            <div style={{padding: '20px',background: '#fff'}}>
                                <p className="title">{this.state.modalInfo.enterpriseName}</p>
                                <div className="content">
                                    <p>{this.state.modalInfo.area}</p>
                                    <p>{this.state.modalInfo.address}</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}