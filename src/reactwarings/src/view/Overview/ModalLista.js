import React from "react";
import apis from "../../unit/apis";
import http from "../../unit/http";
import Loading from "../Loading/Loading";

const { DETAIL_EVALUATE } = apis;

class ModalLista extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: null
        }
    }

    async getDatas(name) {
        this.setState({
            loading: true
        });
        let res = await http.get(DETAIL_EVALUATE + name);
        if (res) {
            this.setState({
                loading: false,
                msg: res.data
            })
        }
    }

    render() {
        let {
            loading,
            msg
        } = this.state;

        let {
            sjtgdw,
            level,
            year,
            pjsj,
            jglx,
            pjdw
        } = msg || {}
        return (
            <div className="modal-lists-a">
                <Loading loading={loading} />
                <div
                    style={{
                        width: "100%",
                        height: "50px",
                        textAlign: "center",
                        lineHeight: "50px",
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}
                >
                    食品生产经营企业监督等级信息
                </div>
                <div style={{
                    fontSize: "16px",
                    marginTop: "30px",
                    textAlign: "center",
                    display: msg ? "none" : "block"
                }}>暂无数据</div>
                <div style={{ display: msg ? "block" : "none" }}>
                    <table>
                        <tbody>
                            <tr>
                                <td>监管等级类型</td>
                                <td>{jglx}</td>
                                <td>监管等级</td>
                                <td>{level}</td>
                            </tr>
                            <tr>
                                <td>评级单位</td>
                                <td>{pjdw}</td>
                                <td>评级年度</td>
                                <td>{year}</td>
                            </tr>
                            <tr>
                                <td>数据提供单位</td>
                                <td>{sjtgdw}</td>
                                <td>数据提供时间</td>
                                <td>{pjsj}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

export default ModalLista;