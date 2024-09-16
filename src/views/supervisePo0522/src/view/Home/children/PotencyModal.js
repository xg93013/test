import React from "react";
import { Modal } from "antd";

import AbilityChart from "./PotencyCharts/AbilityChart";
import ActionsChart from "./PotencyCharts/ActionsChart";
import EffectChart from "./PotencyCharts/EffectChart";
import OtherChart from "./PotencyCharts/OtherChart";
import http from "../../../unit/http.js";
import apis from "../../../unit/apis.js";

import "./PotencyModal.scss";

const {
    AREA_GRADE
} = apis;

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
    async showModal(name, currentTime) {
        this.setState({
            visible: true,
            name: name
        })
        let urls = currentTime.year + '/' + currentTime.month + '/' + name;
        let [abilityData, actionsData, effectData, otherData] = await Promise.all([
            http.get(AREA_GRADE + '/1/' + urls),
            http.get(AREA_GRADE + '/2/' + urls),
            http.get(AREA_GRADE + '/3/' + urls),
            http.get(AREA_GRADE + '/4/' + urls)
        ])
        if (abilityData) {
            this.refs.abilityChartRefs.getCharts(abilityData.data);
        }
        if (actionsData) {
            this.refs.actionsChartRefs.getCharts(actionsData.data);
        }
        if (effectData) {
            this.refs.EffectChartRefs.getCharts(effectData.data);
        }
        if (otherData) {
            this.refs.OtherChartRefs.getCharts(otherData.data);
        }
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
                    width={880}
                    title={this.state.name + '监管效能分析'}
                    bodyStyle={{ background: '#f5f5f5' }}
                    visible={this.state.visible}
                    onOk={() => { this.hideModal() }}
                    onCancel={() => { this.hideModal() }}
                    destroyOnClose="true"
                    footer={null}
                >
                    <div className="modal-box">
                        <AbilityChart ref="abilityChartRefs" titleData={titleData} />
                        <ActionsChart ref="actionsChartRefs" titleData={titleData} />
                        <EffectChart ref="EffectChartRefs" titleData={titleData} tooltipData={tooltipData} />
                        <OtherChart ref="OtherChartRefs" titleData={titleData} />
                    </div>
                </Modal>
            </div>
        )
    }

}

export default Index
