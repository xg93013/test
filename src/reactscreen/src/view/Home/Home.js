import React from "react";
import "./Home.scss";

import System from "./System/System.js";
import TeamAbout from "./TeamAbout/TeamAbout.js";
import Partners from "./Partners/Partners.js";
import Customers from "./Customers/Customers.js";
import Demonstration from "./Demonstration/Demonstration.js";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            introModel: {
                list : 
                    [{
                        key: 'home',
                        label: "首页",
                        subTitle: "Home"
                    },{
                        key: 'about',
                        label: "团队介绍",
                        subTitle: "About team"
                    },{
                        key: 'partners',
                        label: "合作伙伴",
                        subTitle: "Partners"
                    },{
                        key: 'customers',
                        label: "合作客户",
                        subTitle: "Cooperative Customers"
                    },{
                        key: 'demonstration',
                        label: "系统演示",
                        subTitle: "System Demonstration"
                    }],
                current: 'home'
            }
        };
    }

    changeIntroItem(key){
        let {introModel} = this.state;
        introModel.current = key;
        this.setState({introModel});
    }
    goHome = () => {
        let {introModel} = this.state;
        introModel.current = 'home';
        this.setState({introModel});
    }
    render() {
        return (
            <div id="home">
                <div
                    className="logo"
                    onClick={this.goHome}></div>
                <div
                    className="sub_logo"
                    onClick={this.goHome}></div>
                {(()=>{
                    switch (this.state.introModel.current) {
                    case 'home':
                        return <System></System>
                    case 'about':
                        return <TeamAbout></TeamAbout>
                    case 'partners':
                        return <Partners></Partners>
                    case 'customers':
                        return <Customers></Customers>
                    case 'demonstration':
                        return <Demonstration></Demonstration>
                    default: return '';
                    }
                })()}
                
                <div className="intro-area">
                    {this.state.introModel.list.map(item =>
                        <div className={`intro-area_item_outline ${item.key} ${this.state.introModel.current === item.key ?'selected':''}`}
                            key={item.key}
                            // style={`background:url(${}) no-repeat`}
                            
                        >
                            <div className={`intro-area_item_button ${this.state.introModel.current === item.key ?'selected':''}`}
                                onClick={(e)=>this.changeIntroItem(item.key,e)}
                            >
                                <div className="title-area">
                                    <p className="main-title">{item.label}</p>
                                    <p className="sub-title">{item.subTitle}</p>
                                </div>
                            </div>
                            <div className="intro-area_item">
                            </div>
                        </div>
                    )}
                    <div></div>
                </div>
            </div>
        )
    }

}

export default Index
