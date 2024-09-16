import React from "react";
import "./Customers.scss";
import Project1 from "./Project/Project1"
import Project2 from "./Project/Project2"
import Project3 from "./Project/Project3"
import Project4 from "./Project/Project4"
import Project5 from "./Project/Project5"
import Project6 from "./Project/Project6"
import Project7 from "./Project/Project7"
import Project8 from "./Project/Project8"
import Project9 from "./Project/Project9"
import Project10 from "./Project/Project10"
import Project11 from "./Project/Project11"

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectArr: [
                '成都市食品安全监测预警数据中心',
                '福建省食品药品安全监管大数据',
                '山东食药监食品安全风险分析系统',
                '广西省食药监局',
                '中国农业科学院农业质量标准与检测技术研究所',
                '合作街道政务基础大数据平台',
                '宜宾数字经济发展规划',
                '雅安大数据发展规划',
                '新经济委蓉创e平台',
                '成都市智能大数据招投标审计平台',
                '成都市智慧治理中心河湖遥感大数据分析系统'
            ]
        };
    }
    componentDidMount() {

    }
    render() {
        let { projectArr } = this.state;
        return (
            <div className='customer-detail'>
                <div className="detail-con">

                    <div className="inner-content">
                        <div className="inner-title">

                            <span className="title-name">{this.props.projectName}</span>
                            <span onClick={this.props.closeModal} className="close-icon"></span>
                        </div>

                        <div className="contents">
                            <div style={{ display: this.props.projectName === projectArr[0] ? 'block' : 'none' }} ><Project1 /></div>
                            <div style={{ display: this.props.projectName === projectArr[1] ? 'block' : 'none' }} ><Project2 /></div>
                            <div style={{ display: this.props.projectName === projectArr[2] ? 'block' : 'none' }} ><Project3 /></div>
                            <div style={{ display: this.props.projectName === projectArr[3] ? 'block' : 'none' }} ><Project4 /></div>
                            <div style={{ display: this.props.projectName === projectArr[4] ? 'block' : 'none' }} ><Project5 /></div>
                            <div style={{ display: this.props.projectName === projectArr[5] ? 'block' : 'none' }} ><Project6 /></div>
                            <div style={{ display: this.props.projectName === projectArr[6] ? 'block' : 'none' }} ><Project7 /></div>
                            <div style={{ display: this.props.projectName === projectArr[7] ? 'block' : 'none' }} ><Project8 /></div>
                            <div style={{ display: this.props.projectName === projectArr[8] ? 'block' : 'none' }} ><Project9 /></div>
                            <div style={{ display: this.props.projectName === projectArr[9] ? 'block' : 'none' }} ><Project10 /></div>
                            <div style={{ display: this.props.projectName === projectArr[10] ? 'block' : 'none' }} ><Project11 /></div>
                        </div>
                    </div>
                </div>
                <div className="detail-back"></div>
            </div>
        )
    }

}

export default Index
