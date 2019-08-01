import React from "react";

class All extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lists: ["核查总数", "下线", "责令整改", "待再核查", "合规"],
            lista: ["核查总数", "已处理", "待处理"],
            curNum: 0
        }
    }

    resetNum() {
        this.setState({
            curNum: 0
        })
    }

    statusChange(res, curNum) {
        this.setState({
            curNum
        })
        this.props.getOtherDatas(res)
    }

    render() {
        const { allDatas, num } = this.props;
        const { lists, lista, curNum } = this.state;
        return (
            <div className="top">
                {
                    (num === 0 ? lists : lista).map((item, index) => {
                        return <div key={index} className="top-list" style={{ width: (100 / (num === 0 ? lists : lista).length) + "%" }}>
                            <div onClick={this.statusChange.bind(this, allDatas[index] ? allDatas[index].status : "", index)}>
                                <div className={"con " + (index === curNum ? "con-active" : "")}>
                                    <div>
                                        <div>{item}</div>
                                        <div>{allDatas[index] ? allDatas[index].count : ""}<span>家</span> </div>
                                    </div>
                                    <div>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className="b"></div>
                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}

export default All