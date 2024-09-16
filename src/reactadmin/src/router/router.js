import React, { Component } from "react";
// import { IndexRoute } from 'react-router'
import { BrowserRouter, Route, HashRouter } from "react-router-dom";

import AsyncComponent from "../component/asyncComponent";

const IndexContent = AsyncComponent(() => import("../pages/home/IndexContent"));
// const Login = AsyncComponent(() => import("../pages/Login/Login"));

export default class Routers extends Component {
  render() {
    return (
      <BrowserRouter>
        {/* <div> */}
        <Route component={IndexContent} />

        {/* </div> */}
      </BrowserRouter>
    );
  }
}
