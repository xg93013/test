import React from "react";
import Header from "./children/Header"
import Content from "./children/Content"
import "./Home.scss"

class Index extends React.Component {

    render() {
        return (
            <div id="home">
                <Header />
                <Content />
            </div>
        )
    }

}

export default Index
