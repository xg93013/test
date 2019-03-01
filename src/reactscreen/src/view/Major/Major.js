import React from 'react';
import styles from './Major.scss';

import {
    Route,
    Switch,
    Router,
    Redirect,
    NavLink,
} from 'react-router-dom';
import {history} from "@/unit/pub.js";
import { withRouter } from 'react-router';
import asyncComponent from '@/unit/asyncComponent';

const SCJG = asyncComponent(() => import("./SCJG/SCJG.js"));
const YG = asyncComponent(() => import("./YG/YG.js"));
const ZWJC = asyncComponent(() => import("./ZWJC/ZWJC.js"));
// import "./style/pub.scss";


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            majorModel : [
                {
                    key: 'scjg',
                    label : "市场监管",
                    suffix : "大数据",
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
            ],
            currentMajor: 'scjg'
        };
    }
    backToHome = (e) => {
        // history.push('/home');
        console.log(this);
        this.props.history.push('/home');
    }
    changeItem(key, e) {
        let {majorModel} = this.state;
        majorModel.find(item=>item.key === this.state.currentMajor).current = key;
        this.setState({majorModel});
    }
    render(){
        return (
            <div className={styles["major-area"]}>
                <div className={styles["nav-area"]}>
                    {this.state.majorModel.map(item => {
                        return (
                            <NavLink
                                to={`${this.props.match.url}/${item.key}`}
                                className={`${styles['nav-item']} ${item.key} ${this.state.currentMajor}`}
                                key={item.key}
                                activeClassName={styles["selected"]}
                            >
                                <div className={styles['label-area']}>
                                    <span>{item.label}</span>
                                    <span>{item.suffix}</span>
                                </div>
                            </NavLink>
                            // <div
                            // >
                            // </div>
                        );
                    })}
                    <div className={styles['back-btn']}>
                        <img 
                            src={require('./images/back-btn.png')}
                            alt=""
                            onClick={this.backToHome}
                        />
                    </div>
                </div>
                <div className={styles['router-area']}>
                    {/* <Router history={history}> */}
                    {/* <BrowserRouter> */}
                    <Switch>
                        <Route
                            strict
                            exact
                            path={`${this.props.match.url}/scjg`}
                            component={SCJG}
                        />
                        <Route
                            strict
                            exact
                            path={`${this.props.match.url}/yg`}
                            component={YG}
                        />
                        <Route
                            strict
                            exact
                            path={`${this.props.match.url}/zw`}
                            component={ZWJC}
                        />
                        <Route
                            exact
                            path={this.props.match.url}
                            render={() => <Redirect to={`${this.props.match.url}/scjg`} /> }
                        />
                    </Switch>
                    {/* </BrowserRouter> */}
                    {/* </Router> */}
                </div>
            </div>
        )
    }
}

export default withRouter(Index)

