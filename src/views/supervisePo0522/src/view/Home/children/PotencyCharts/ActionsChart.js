import React from "react";

class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    getCharts() { }

    componentDidMount() {
        // this.getCharts();
    }

    render() {
        return (
            <div className="modal-chart">
                <div className="title">监管行为指标（本期排名：10，较上期下降1位）</div>
                <div className="main-chart">
                    <div className="circle-box">
                        <div className="cirleft">
                            <div className="bar leftbar" style={{ height: '20%' }}><span title="日常巡检指标">日常巡检指标</span></div>
                        </div>
                        <div className="cirright">
                            <div className="bar rightbar" style={{ height: '30%' }}><span title="抽样巡检指标">抽样巡检指标</span></div>
                        </div>
                        <div className="lines"></div>
                    </div>
                </div>
            </div>
        )
    }



}

export default Index
