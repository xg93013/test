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
        this.refs.abilityChartRefs.getCharts();
        this.refs.actionsChartRefs.getCharts();
        this.refs.EffectChartRefs.getCharts();
        this.refs.OtherChartRefs.getCharts();
    }
    hideModal() {
        this.setState({
            visible: false
        })
    }
    render() {
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
                        <AbilityChart ref="abilityChartRefs" />
                        <ActionsChart ref="actionsChartRefs" />
                        <EffectChart ref="EffectChartRefs" />
                        <OtherChart ref="OtherChartRefs" />
                    </div>
                </Modal>
            </div>
        )
    }

}

export default Index
