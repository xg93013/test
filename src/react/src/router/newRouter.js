import React from 'react'
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import AsyncComponent from '../component/asyncComponent'

const Home = AsyncComponent(()=>import('../pages/home/home'))
const About = AsyncComponent(()=>import('../pages/about/about'))
const Next = AsyncComponent(()=>import('../pages/next/next'))

const routers = () => (
    <div className="apps">
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}></Route>
                <Route path="/about" component={About}></Route>
                <Route path="/next" component={Next}></Route>
            </Switch>
        </BrowserRouter>
    </div>
)
export default routers