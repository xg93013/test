import React from "react";
import styles from "./YG.scss";

import SideMenu from '@/components/SideMenu/SideMenu.js';
import {links} from '@/unit/pub.js';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [{
                label:'核心理念',
                key: 'ln',
                content:['yg-ln.png']
            },{
                label:'河湖治理',
                key: 'hhzl',
                content:['yg-hhzl.png'],
                link: true
            },{
                label:'自然村落识别',
                key: 'clsb',
                content:['yg-clsb.png']
            },{
                label:'生态破坏场景识别',
                key: 'cjsb',
                content:['yg-cjsb.png']
            }],
            currentContentUrl : './content/yg-ln.png',
            currentContentIndex: 0,
            currentListItem : {},
        };
    }
    componentWillMount(){
        this.setState({
            currentListItem : this.state.list[0]
        })
    }
    changeItem = (key, index) => {
        let currentListItem = this.state.list.find(item=>item.key === key);
        if (index >= currentListItem.content.length || index < 0) {
            return;
        }
        var temp = `./content/${currentListItem.content[index || 0]}`;
        let {currentContentUrl} = this.state;
        currentContentUrl = `${temp}`;
        this.setState({
            currentContentUrl,
            currentListItem,
            currentContentIndex: index || 0
        });
    }
    buttonClick (type) {
        switch (type) {
        case 'link' :
            if (this.state.currentListItem.link) {
                window.open(links[this.state.currentListItem.key],'','fullscreen=no');
            }
            break;
        case 'prev' :
            if (this.state.currentContentIndex <= 0) {
                return;
            }
            this.changeItem(this.state.currentListItem.key, this.state.currentContentIndex - 1)
            break;
        case 'next' :
            if (this.state.currentContentIndex >= this.state.currentListItem.content.length) {
                return;
            }
            this.changeItem(this.state.currentListItem.key, this.state.currentContentIndex + 1)
            break;
        default:
            break;
        }
    }
    render() {
        let {currentContentUrl} = this.state;
        return (
            <div className={styles["yg-area"]}>
                <SideMenu
                    content={this.state.list}
                    itemClick={this.changeItem}></SideMenu>
                <div
                    className={styles["content-area"]}
                    style={ {background:`url(${require(`${currentContentUrl}`)}) no-repeat` } }
                >
                </div>
                <div className={`${styles['button-area']}`}>
                    <div
                        onClick={(e)=>this.buttonClick('link')}
                        className={styles["button"]}
                        style={{display:this.state.currentListItem.link ? 'block':'none'}}></div>
                </div>
            </div>
            
        )
    }

}

export default Index
