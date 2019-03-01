import React from 'react';
import styles from './SideMenu.scss';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list : this.props.content,
            current : this.props.content[0].key
        };
    }
    changeItem(key, e) {
        // let {majorModel} = this.state;
        // majorModel.find(item=>item.key === this.state.currentMajor).current = key;
        this.setState({current: key});
        this.props.itemClick(key);
    }
    render(){
        return (
            <div className={styles["side-menu"]}>
                <div
                    className={`${styles['side-menu_item']} ${this.state.current === this.state.list[0].key ? styles['selected'] : ''}`}
                    onClick={(e)=>this.changeItem('ln', e)}
                >
                    <span>{this.state.list[0].label}</span>
                </div>
                <div className={styles['case-title']}>
                    典型案列
                </div>
                {this.state.list.map((item, index) => {
                    if (index === 0) {
                        return void 0;
                    }
                    return (
                        <div className={`${styles['side-menu_item']} ${this.state.current === item.key ? styles['selected'] : ''}`}
                            key={item.key}
                            onClick={(e)=>this.changeItem(item.key, e)}
                        >
                            <span>{item.label}</span>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Index

