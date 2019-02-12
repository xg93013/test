import React from "react";

class All extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datas: [{
                name: "累计预警",
                color: "#F2884F"
            }, {
                name: "本月预警",
                color: "#276AB0"
            }, {
                name: "今日预警",
                color: "#64707D"
            }],
            curNum: 0
        }
    }

    statusChange(res, curNum) {
        this.setState({
            curNum
        })
        this.props.getOtherDatas(res)
    }

    render() {
        const { curNum, datas } = this.state;
        const { allDatas } = this.props;
        return (
            <div className="left">
                {datas.map((item, index) => {
                    return <div key={index} style={{ background: item.color }}>
                        <div onClick={this.statusChange.bind(this, allDatas[index] ? allDatas[index].status : "", index)} className={(index === curNum ? "con-active" : "")}>
                            <div>
                                {item.name} <br />
                                <span>{allDatas[index] ? allDatas[index].count : ""}</span>
                            </div>
                            <div>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div></div>
                    </div>
                })}
            </div>
        )
    }

}

export default All