import React from "react";
import styles from "./TeamAbout.scss";
// import { Carousel } from 'antd';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    changeIntroItem(key){
        let {introModel} = this.state;
        introModel.current = key;
        this.setState({introModel});
    }

    render() {
        return (
            <div className={`${styles['teamabout-area']}`}>
                <div className={styles['teamabout-item']}></div>
                <div className={styles['teamabout-item']}></div>
            </div>
        )
    }

}

export default Index
