import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../../styles/home.scss'
import Header from '../header/header'
import Nav from '../nav/nav'

export default class IndexContent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async getMenuData() {
        let res = await axios.get('/api/menuData');
    }
    // 组件将要挂载
    componentWillMount() {}
    // 组件渲染完成
    componentDidMount() {

    }
    //
    componentWillReceiveProps(nextProps) {}
    componentWillUpdate(nextProps, nextState) {}
    componentDidUpdate(prevProps, prevState) {}
    render() {
        return (
            <div className="indexContent">
                <Header headTitle={this.state.headTitle}/>
                <Nav {...this.props}></Nav>
                <div className="main">
                    <div className="home">
                        <div className="top">
                            <div className="item">
                                <Link to='/home' ><img src={require('../../images/u73.png')} className="imgs" alt=""/></Link>
                                <span>全息档案</span>
                            </div>
                            <div className="item">
                                <Link to='/riskMap' ><img src={require('../../images/u73.png')} className="imgs" alt=""/></Link>
                                <span>监管地图</span>
                            </div>
                            <div className="item">
                                <Link to='/home' ><img src={require('../../images/u73.png')} className="imgs" alt=""/></Link>
                                <span>预警分析</span>
                            </div>
                            <div className="item">
                                <Link to='/home' ><img src={require('../../images/u73.png')} className="imgs" alt=""/></Link>
                                <span>核查结果</span>
                            </div>
                            <div className="item">
                                <Link to='/home' ><img src={require('../../images/u73.png')} className="imgs" alt=""/></Link>
                                <span>量化分级</span>
                            </div>
                        </div>
                        <div className="bot">
                            <div style={{clear:"both",overflow:"hidden"}}></div>
                            <div className="bot-top">
                                <div className="title">餐饮环节全链条覆盖、全流程监控</div>
                                <div>餐饮</div>
                                <div className="steps">
                                    <div className="text">农产品批发零售</div>
                                    <div className="line1"><img src="" alt=""/></div>
                                    <div className="text">餐饮加工</div>
                                    <div className="line2"><img src="" alt=""/></div>
                                    <div className="text">餐饮消费</div>
                                    <div className="line3"><img src="" alt=""/></div>
                                    <div className="text">餐厨垃圾处理</div>
                                </div>
                            </div>
                            <div className="bot-top bot-bot">
                                <div className="steps">
                                    <div className="icon firstIcon">
                                        <div className="line"></div>
                                        <a href="#" className="links">
                                            <img src={require('../../images/u73.png')} className="imgs" alt=""/>
                                            <p>农产品溯源</p>
                                        </a>
                                    </div>
                                    <div className="line1"></div>
                                    <div className="icon">
                                        <div className="line"></div>
                                        <a href="#" className="links">
                                            <img src={require('../../images/u73.png')} className="imgs" alt=""/>
                                            <p>明厨亮灶</p>
                                        </a>
                                    </div>
                                    <div className="icon centerIcon">
                                        <div className="line"></div>
                                        <a href="#" className="links">
                                            <img src={require('../../images/u73.png')} className="imgs" alt=""/>
                                            <p>乡村群宴</p>
                                        </a>
                                    </div>
                                    <div className="icon">
                                        <div className="line"></div>
                                        <a href="#" className="links">
                                            <img src={require('../../images/u73.png')} className="imgs" alt=""/>
                                            <p>网络餐饮</p>
                                        </a>
                                    </div>
                                    <div className="line3"></div>
                                    <div className="icon">
                                        <div className="line"></div>
                                        <a href="#" className="links">
                                            <img src={require('../../images/u73.png')} className="imgs" alt=""/>
                                            <p>餐厨垃圾</p>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentWillUnmount() {}
}