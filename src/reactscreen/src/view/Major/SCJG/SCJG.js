import React from 'react';
import styles from './SCJG.scss';

import SideMenu from '@/components/SideMenu/SideMenu.js';

import {links} from '@/unit/pub.js';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataModel : {
                key: 'scjg',
                label : "市场监管",
                suffix : "大数据",
            },
            list: [{
                label:'核心理念',
                key: 'ln',
                content:['scjg-ln.png'],
            },{
                label:'食药抽检风险分析',
                key: 'cj',
                content:['scjg-cj-1.png', 'scjg-cj-2.png'],
                link: true
            },{
                label:'食品安全关联图谱',
                key: 'gltp',
                content:['scjg-gltp-1.png'],
                link: true
            },{
                label:'网络餐饮智慧监管',
                key: 'zhjg',
                content:['scjg-zhjg-1.png', 'scjg-zhjg-2.png', 'scjg-zhjg-3.png'],
                link: true
            }],
            currentContentUrl : './content/scjg-ln.png',
            currentContentIndex: 0,
            currentListItem : {},
        };
    }
    componentWillMount(){
        this.setState({
            currentListItem : this.state.list[0]
        })
    }
    changeItem (key, index) {
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
    render(){
        let {currentContentUrl} = this.state;
        return (
            <div className={styles["scjg-area"]}>
                <SideMenu
                    content={this.state.list}
                    itemClick={this.changeItem.bind(this)}
                    className={styles["side-area"]}
                >
                </SideMenu>
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
                    <div
                        onClick={(e)=>this.buttonClick('prev')}
                        className={styles["button"]}
                        style={{display:this.state.currentListItem.content.length > 1 ? 'block':'none'}}></div>
                    <div
                        onClick={(e)=>this.buttonClick('next')}
                        className={styles["button"]}
                        style={{display:this.state.currentListItem.content.length > 1  ? 'block':'none'}}></div>
                </div>
            </div>
        )
    }
}

export default Index

