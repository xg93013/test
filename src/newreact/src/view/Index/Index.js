import React from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import Header from "./Header";
import Side from "./Side";
import Content from "./Content";
import Loading from "../Loading/Loading";
import "./Index.scss"

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            navName: {
                "/platform": "餐饮智慧监管平台",
                "/map": "餐饮智慧监管地图",
                "/archives": "餐饮企业全息档案",
                "/analysis": "餐饮监管预警中心",
                "/result": "预警处置核查结果"
            }
        }
    }

    componentDidMount() {

    }

    render() {
        const { history } = this.props;
        return (
            <div id="index">
                <Header history={history} navName={this.state.navName[history.location.pathname]} />
                <Side history={history} />
                <Content history={history} />
                <Provider store={store}>
                    <Loading history={this.props.history} />
                </Provider>
            </div>
        )
    }

}

export default Index
