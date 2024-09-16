import React from "react";
import {
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import asyncComponent from "../../unit/asyncComponent";
import Loading from "../Loading/Loading";

const Platform = asyncComponent(() => import("../Platform/Platform"));
const Analysis = asyncComponent(() => import("../Analysis/Analysis"));
const Archives = asyncComponent(() => import("../Archives/Archives"));
const Map = asyncComponent(() => import("../Map/Map"));
const Result = asyncComponent(() => import("../Result/Result"));
class Content extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.changeLoading = this.changeLoading.bind(this)
    }

    changeLoading(loading) {
        this.setState({
            loading
        })
    }

    render() {
        let { loading } = this.state
        return (
            <div
                id="content"
                style={{
                    left: this.props.history.location.pathname === "/platform" ? 0 : "70px",
                    overflow: loading ? "hidden" : "auto"
                }}
            >
                <Loading
                    loading={loading}
                    fixed
                    page={this.props.history.location.pathname}
                />
                <Switch>
                    <Route
                        exact
                        path='/platform'
                        render={(props) => <Platform {...props} changeLoading={this.changeLoading} />}
                    />
                    <Route
                        exact
                        path='/analysis'
                        render={(props) => <Analysis {...props} changeLoading={this.changeLoading} />}
                    />
                    <Route
                        exact
                        path='/archives'
                        render={(props) => <Archives {...props} changeLoading={this.changeLoading} />}
                    />
                    <Route
                        exact
                        path='/map'
                        render={(props) => <Map {...props} changeLoading={this.changeLoading} />}
                    />
                    <Route
                        exact
                        path='/result'
                        render={(props) => <Result {...props} changeLoading={this.changeLoading} />}
                    />
                    <Route
                        exact
                        path="/"
                        render={() => <Redirect to={"/platform"} />}
                    />
                    <Route render={() => <Redirect to="/error" />} />
                </Switch>
            </div>
        )
    }
}

export default Content