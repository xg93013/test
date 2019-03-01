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
                <p>2017年6月29日，国务院食品安全委员会办公室、国家食药监总局、农业部在北京启动了“全国食品安全示范城市、农产品质量安全县创建成果展览”。成都作为第一批国家食品安全示范城市的创建市，运用科技手段直观展现食品安全监测预警数据中心在大数据分析应用方面取得的成绩、食品溯源工作的进展，以及在餐饮行业生产工业化、工艺标准化、溯源信息化的探索与亮点，获得高度肯定。</p>
                <h2>项目背景</h2>
                <p>民以食为天，消费者能够“吃得好，吃得安全”是政府食品安全监管部门重点关心的社会问题。然而，随着我国市场经济的发展和经济体制改革，食品安全问题频发，安全形势、舆论环境严峻，政府食品安全监管面临若干挑战：</p>
                <p>1.行业监管对象愈加复杂。食品生产经营单位众多、供给庞大，而安全问题涉及生产、流通、销售、服务等多个环节，不法分子逃避监管、规避检查、对抗执法手段复杂。</p>
                <p>2.安全面临多重风险考验。全国食品“小、脏、散、乱”的传统安全风险依然存在，海关口岸进口食品种类、数量逐年增加，输入性风险不断增强，食品污荣风险因素增多，食品安全问题日益多样化。</p>
                <p>3.新技术、新业态考验监管智慧。网络餐饮、外卖订餐等新业态在“互联网+”带动下快速发展，新技术、新材料广泛应用于食品研制生产。</p>
                <p>4.社会诚信环境有待进一步优化。当前食品企业守法意识、安全意识、责任意识亟待提高，社会信用信息共享体系建设滞后，社会诚实信用机制欠缺，食品安全社会多元共治体系有待完善。</p>
                <p>5.社会舆论环境高度关注。随着食品行业生产量和交易量持续增长，公众消费需求升级，“求吃饱”转向“求吃好”，整个社会对食品安全的关注度、敏感度空前高涨。</p>
                <p>6.监管人员少、执法装备缺。过往食品安全信息化建设，重业务流程电子化而轻数据分析利用，食品安全监管智能化应用严重不足,传统的行政监管方法越来越难以应对海量监管对象，难以发现潜在风险。</p>
                <h2>方案价值</h2>
                <p>成都食品安全监测预警数据中心利用信息化业务系统累计的大量有关食品生产、食品经营、食品餐饮、行政审批以及日常监管、稽查执法、抽检监测、投诉举报方面的数据，构建基于关联规则挖掘、XGBoost的大数据分析挖掘模型的大数据食品安全监管平台，实现多源数据融合、抽检计划自动制定、市杨主体量化评级、网络餐饮监管、组话化抽检信息查询等功能，为推动落实十三五食品安全规划要求，践行基于数据的公共治理模式，实现食品安全智慧监管，为建设食品安全示范县工作提供强劲支撑，带动提升食品安全保障水平，打造安心、放心的食品消费环境。</p>
                <p>1、将多源数据融合技术引入食品安全监管领域，汇聚多方数据，通过分析挖掘最终辅助抽签决策，解决食药监抽检任务的调度，提高工作效率，节省投入成本，提高监管靶向性和高效性。</p>
                <p>2、将知识图谱引入食品安全信息的关联查询，首次以图谱的形式展现标准数据，更符合人类思维和观察习惯。</p>
                <p>3、将时序分析技术引入食品安全指数的分析中，其优点在于补充了部分缺失值让数据更加饱和，并且当前时间戳的拟合合格率从物理上反应的是在较近的时间段内合格率的叠加情况，体现出了合格率的变化趋势，得到的结果更稳定，具有更好的鲁棒性(Rabusness)。</p>
                <p>4、构建市场主体风险量化评级体系，根据融合的多源异构数据，参考借鉴国内外评级机构的理论体系(如榴迪、标普、惠进等)，从主体固有属性体现的静态风险和经营过程中的动态风险两个层次建立市场主体的风险量化评级体系。梳理历史监管数据中的评价改据为标器，通过XCBoost等机器学习技术构建市场主体量化评级模型实现对市场主体自动、客观、快速的分级评价。</p>
            </div>
        )
    }

}

export default Index
