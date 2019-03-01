import React from "react";
import styles from "./Partners.scss";

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
            <div className={styles['partners-area']}>
            </div>
        )
    }

}

export default Index
