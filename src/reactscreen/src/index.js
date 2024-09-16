import React from 'react';
import ReactDOM from 'react-dom';
import {history} from "@/unit/pub.js";
import {
    BrowserRouter,
    HashRouter,
    Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import asyncComponent from './unit/asyncComponent';
import "./style/pub.scss";

const Home = asyncComponent(() => import("./view/Home/Home"));

const Major = asyncComponent(() => import("./view/Major/Major"));

ReactDOM.render((
    // <Router history={history}>

    //<BrowserRouter>
    <HashRouter>
        <Switch>
            <Route
                exact
                path="/"
                render={() => <Redirect to={"/home"} /> }
            />
            <Route
                strict
                exact
                path='/home'
                component={Home}
            />
            <Route
                // strict
                // exact
                path='/major'
                // component={Major}
                render={(props) => <Major/>}
                
            />
        </Switch>
    </HashRouter>
    // </BrowserRouter>
    // </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. Learn
// more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();