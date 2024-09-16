import React, { Component } from 'react';
// import { IndexRoute } from 'react-router'
import { BrowserRouter, IndexRoute, Route, Redirect} from 'react-router-dom'

import AsyncComponent from '../component/asyncComponent'

const IndexContent = AsyncComponent(()=>import('../pages/home/IndexContent'))
const About = AsyncComponent(()=>import('../pages/about/about'))

export default class Routers extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="content">
                    {/* <Route path="/" component={IndexContent}></Route> */}
                    <IndexRoute component={IndexContent}></IndexRoute>
                </div>
            </BrowserRouter>
        )
    }

}