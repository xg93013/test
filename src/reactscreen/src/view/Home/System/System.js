import React from "react";
import styles from "./System.scss";
import {history} from "@/unit/pub.js";
import { withRouter } from 'react-router';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systemModel : [
                {
                    key: 'scjg',
                    label : "市场监管",
                    suffix : "大数据"
                },
                {
                    key: 'yg',
                    label : "遥感",
                    suffix : "大数据"
                },
                {
                    key: 'zw',
                    label : "政务基础",
                    suffix : "大数据"
                }
            ]
        };
    }

    changeIntroItem(key){
        // history.push(`/major/${key}`);
        this.props.history.push(`/major/${key}`);
    }

    render() {
        return (
            <div className={styles['system-area']}>
                {this.state.systemModel.map(item => 
                    <div className={`${styles['system-area_item']} ${item.key}`}
                        key={item.key}
                    >
                        <div className={`${styles['system-area_item_bridge']}`}
                        >
                        </div>
                        <div className={`${styles['system-area_item_button']}`}
                            onClick={(e)=>this.changeIntroItem(item.key, e)}
                        >
                            <span>{item.label}</span><span>{item.suffix}</span>
                        </div>
                    </div>
                )}
                <div className={styles["decorate-area"]}>
                    <div className={styles["plate-area"]}>
                        <img src={require('./images/plate.png')}
                            alt=""
                        />
                        {/* <img src={require('./images/plate-pointer.png')} alt=""/> */}
                        <img src={require('./images/plate-scale.png')} alt=""/>
                        <img src={require('./images/plate-radial-s.png')} alt=""/>
                        <img src={require('./images/plate-radial-b.png')} alt=""/>
                    </div>
                    
                    <img src="" alt=""/>
                    <img src="" alt=""/>
                    <img src="" alt=""/>
                </div>
            </div>
        )
    }

}

export default withRouter(Index)
