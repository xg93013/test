import 'react-app-polyfill/ie9';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    Switch
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import asyncComponent from './unit/asyncComponent';
import "./style/pub.scss";

const Home = asyncComponent(() => import("./view/Home/Home"));

ReactDOM.render((
    <BrowserRouter >
        <Switch>
            <Route
                path='/'
                component={Home}
            />
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. Learn
// more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();