import React from "react";
import { Icon, Popover } from "antd";
import DateSelect from "./DateSelect/DateSelect.js";

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    // changeTime(time) {
    //     console.log(time);
    // }
    componentDidMount() { }

    render() {
        let {
            topData,
        } = this.props;
        return (
            <div className="top">
                <div className="top-title">
                    <div className="left">
                        监管效能分析
                        <Popover content={(
                            <div className="tips">
                                <p><span>监管效能定义：</span>监管效能指对监管能力、监管行为、监管效果和其它等指标进行多维度分析，通过合理的算法加权得出区域的综合监管特征，以指导区域的监管工作；</p>
                                <p><span>监管效能公式：</span>效能值=监管能力*15%+监管行为*40%+监管效果*30%+其它指标*15%。</p>
                            </div>
                        )} placement="rightTop" title="" trigger="hover">
                            <Icon type="question-circle" style={ { cursor:'pointer' }}/>
                        </Popover></div>
                    <div className="right">
                        <DateSelect changeTime={(time) => {this.props.changeTime(time)}}/>
                    </div>
                </div>
                <div>
                    {
                        topData.map((item, i) => (
                            <div className="top-item" key={i}>
                                <div className="item-con">
                                    <div className="left">
                                        {/* <span><img src="" /></span> */}
                                        {item.name}({item.unit})
                                    </div>
                                    <span className="text">{item.count}</span>
                                    <div className="right">
                                        <Popover placement="rightTop" title={''} content={
                                            (
                                                <div className="area-list">
                                                    {
                                                        item.city && item.city.length > 0 ? item.city.map((itema, ia) => (
                                                            <p key={i + '' + ia}><span>{itema.area}</span>{itema.count}</p>
                                                        )) : ''
                                                    }
                                                </div>
                                            )
                                        } trigger="hover">
                                            <Icon type="right" style={ { cursor:'pointer' }}/>
                                        </Popover>

                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* <div className="top-item">
                    <div>
                        <div className="left">
                            <p></p>
                            <p>{topData.people}</p>
                        </div>
                        <div className="right">
                            <Popover placement="rightTop" title={''} content={
                                (
                                    <div>
                                        <p>金牛区&emsp;45</p>
                                        <p>高新区&emsp;45</p>
                                        <p>武侯区&emsp;45</p>
                                    </div>
                                )
                            } trigger="hover">
                                <Icon type="right" />
                            </Popover>
                        </div>
                    </div>
                </div> */}

            </div>
        )
    }

}

export default Index
