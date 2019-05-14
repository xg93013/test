import React from "react";
import "../Customers.scss";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className='project-detail'>
                <h2>客户简介</h2>
                <p>成都市智慧治理中心是贯彻落实党的十九大关于“建设人民满意的服务型政府”和“提高社会治理智能化水平”的重要措施。智慧治理中心的建设目标是：建设城市“智慧大脑”，打造城市服务中心、城市治理中心和应急指挥中心的总体定位，从城市综合管理角度出发，围绕支撑服务综合决策和应急指挥，实现城市运营管理信息资源的全面整合与共享、业务应用的智能协同。</p>
                <h2>项目背景</h2>
                <p>河湖生态治理是城市治理的重要内容，传统河湖污染监测需要人工采集水样或在局部区域建立站点监测。虽然能对指定位置的水质进行分析评价，但监测范围有限。要想实现成都市整体水生态的整体感知，需投入巨量人力物力。</p>
                <h2>方案价值</h2>
                <p>数之联为成都市智慧治理中心提供的河湖遥感大数据分析系统作为智慧治理示范性应用，通过对成都市河湖水资源情况通过遥感影像分析进行人工智能自动解译分析，融合物联网数据与网络理政数据构建成都市河湖遥感大数据分析体系，从水资源丰富情况和水质感官情况两个维度对河湖整体情况进行评价，依据水资源丰富情况建立成都市各个区域水资源丰富指数，依据河湖污染不同类型（黑河污染、水体富营养污染、泥沙污染），定量评估不同种类污染程度，建立水质综合感官指数。从宏观到微观，全方位掌握河湖量分布，水质污染情况及污染演变趋势。</p>
            </div >
        )
    }

}

export default Index