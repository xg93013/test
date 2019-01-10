import React from 'react'
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import AsyncComponent from '../component/asyncComponent'

const Home = AsyncComponent(()=>import('../pages/home/home'))
const riskMap = AsyncComponent(()=>import('../pages/riskMap/riskMap'))
// const Next = AsyncComponent(()=>import('../pages/next/next'))
// const Next = AsyncComponent(()=>import('../containers/next'))
const warningAnalysis = AsyncComponent(()=>import('../pages/warningAnalysis/warningAnalysis'))

const routers = () => (
    <div className="apps">
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}></Route>
                <Route path="/riskMap" component={riskMap}></Route>
                <Route path="/next" component={warningAnalysis}></Route>
            </Switch>
        </BrowserRouter>
    </div>
)
export default routers