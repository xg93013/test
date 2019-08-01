import 'react-app-polyfill/ie9';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    // HashRouter,
    Route,
    Switch
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import asyncComponent from './unit/asyncComponent';
import "./style/pub.scss";

const Index = asyncComponent(() => import("./view/Index/Index"));
const Error = asyncComponent(() => import("./view/Error/Error"));

ReactDOM.render((
    <BrowserRouter >
        <Switch>
            <Route
                path='/error'
                component={Error}
            />
            <Route
                path='/'
                component={Index}
            />
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. Learn
// more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();