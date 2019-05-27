import React from "react";
import { Modal } from "antd";

import AbilityChart from "./PotencyCharts/AbilityChart";
import ActionsChart from "./PotencyCharts/ActionsChart";
import EffectChart from "./PotencyCharts/EffectChart";
import OtherChart from "./PotencyCharts/OtherChart";

import "./PotencyModal.scss";

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            titleData: {},
            tooltipData: {},
            name: ""
        }
    }
    getData() {

    }
    componentDidMount() {
        this.getData();
    }
    showModal(name) {
        this.setState({
            visible: true,
            name: name
        })
        let abilityData = [{
            name: '基础人力指标',
            children: [{
                name: '2bla',
                value: 100
            }, {
                name: '2blaa',
                value: 20
            }]
        }, {
            name: '人员配比指标',
            children: [{
                name: '2bla',
                value: 10
            }, {
                name: '2blaa',
                value: 20

            }]
        }];
        let actionsData = [60, 80];
        this.setState({
            titleData: {
                rank: 20,
                desc: -5
            },
            tooltipData: {
                complaintsNum: 10,
                complaintsPeople: 20,
                unqualified: 20,
                excellent: 20, // 优良率
                coincidence: 30, // 符合率
                simpleCoincidence: 50, 
                pass: 30
            }
        })
        let effectData = [100, 130, 300];
        let otherData = 87;

        this.refs.abilityChartRefs.getCharts(abilityData);
        this.refs.actionsChartRefs.getCharts(actionsData);
        this.refs.EffectChartRefs.getCharts(effectData);
        this.refs.OtherChartRefs.getCharts(otherData);
    }
    hideModal() {
        this.setState({
            visible: false
        })
    }
    render() {
        let { titleData, tooltipData } = this.state;
        return (
            <div className="modal-container">
                <Modal
                    width={800}
                    title={this.state.name + '监管效能分析'}
                    bodyStyle={{ background: '#f5f5f5' }}
                    visible={this.state.visible}
                    onOk={() => { this.hideModal() }}
                    onCancel={() => { this.hideModal() }}
                    destroyOnClose="true"
                    footer={null}
                >
                    <div className="modal-box">
                        <AbilityChart ref="abilityChartRefs" titleData={titleData}/>
                        <ActionsChart ref="actionsChartRefs" titleData={titleData}/>
                        <EffectChart ref="EffectChartRefs" titleData={titleData} tooltipData={tooltipData}/>
                        <OtherChart ref="OtherChartRefs" titleData={titleData}/>
                    </div>
                </Modal>
            </div>
        )
    }

}

export default Index
