import React from 'react';
import ReactDOM from 'react-dom';
// import './static/css/reset.css'
// import './index.css';
import './styles/main.scss';
// import App from './App';
import './mocks/mock.js';
import configureStore from './store/configStore.js'
import { Provider } from 'react-redux';

import Routers from './router/newRouter'

import * as serviceWorker from './serviceWorker';

const store = configureStore();

// Mock.bootstrap()
const Root = () => (
    <Provider store={store}>
        <Routers />
    </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister(); 
