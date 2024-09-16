import React from "react";

class ModalLista extends React.Component {

    render() {
        return (
            <div className="modal-lists-a">
                <div style={{ width: "100%", height: "50px", textAlign: "center", lineHeight: "50px", fontSize: "16px", fontWeight: "bold" }}>食品生产经营企业监督等级信息</div>
                <table>
                    <tbody>
                        <tr>
                            <td>监管等级类型</td>
                            <td>餐饮服务</td>
                            <td>监管等级</td>
                            <td>A</td>
                        </tr>
                        <tr>
                            <td>评级单位</td>
                            <td>餐饮服务</td>
                            <td>评级年度</td>
                            <td>7.2</td>
                        </tr>
                        <tr>
                            <td>数据提供单位</td>
                            <td>成都市食品药品监督管理局</td>
                            <td>数据提供时间</td>
                            <td>2016-11-29</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

export default ModalLista;