import React from 'react';
import ReactDOM from 'react-dom';
// import './static/css/reset.css'
// import './index.css';
import './styles/main.scss';
// import App from './App';
import './mocks/mock.js';

import Routers from './router/newRouter'

import * as serviceWorker from './serviceWorker';

// Mock.bootstrap()

ReactDOM.render(<Routers />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister(); 
