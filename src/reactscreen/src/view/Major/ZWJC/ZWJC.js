import React from "react";
import styles from "./ZWJC.scss";

import SideMenu from '@/components/SideMenu/SideMenu.js';
import {links} from '@/unit/pub.js';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [{
                label:'核心理念',
                key: 'ln',
                content:['zwjc-ln.png']
            },{
                label:'公共服务平台',
                key: 'gfpt',
                content:['zwjc-gfpt.png']
            },{
                label:'招投标审计',
                key: 'ztbsj',
                content:['zwjc-ztbsj.png']
            }],
            currentContentUrl : './content/zwjc-ln.png',
            currentContentIndex: 0,
            currentListItem : {},
        };
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
            <div className={styles["zwjc-area"]}>
                <SideMenu content={this.state.list}
                    itemClick={this.changeItem.bind(this)}></SideMenu>
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
