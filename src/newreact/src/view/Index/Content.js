import React from "react";
import {
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import asyncComponent from "../../unit/asyncComponent"
const Platform = asyncComponent(() => import("../Platform/Platform"));
const Analysis = asyncComponent(() => import("../Analysis/Analysis"));
const Archives = asyncComponent(() => import("../Archives/Archives"));
const Map = asyncComponent(() => import("../Map/Map"));
const Result = asyncComponent(() => import("../Result/Result"));
class Content extends React.Component {

    render() {
        return (
            <div id="content" style={{ left: this.props.history.location.pathname === "/platform" ? 0 : "70px" }}>
                <Switch>
                    <Route exact path='/platform' component={Platform} />
                    <Route exact path='/analysis' component={Analysis} />
                    <Route exact path='/archives' component={Archives} />
                    <Route exact path='/map' component={Map} />
                    <Route exact path='/result' component={Result} />
                    <Route exact path="/" render={() => { return <Redirect to={"/platform"} /> }} />
                    <Route render={() => { return <Redirect to="/error" /> }} />
                </Switch>
            </div>
        )
    }
}

export default Content