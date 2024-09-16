import React from "react";
import "./Error.scss";

class Error extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            num: 6
        }
        this.goPage = this.goPage.bind(this);
    }

    goPage() {
        this.props.history.go(-1);
    }
    inter() {
        let { num } = this.state;
        if (num === 0) {
            this.props.history.go(-1);
        } else {
            setTimeout(() => {
                num--;
                this.setState({
                    num
                })
                this.inter();
            }, 1000)
        }
    }

    componentDidMount() {
        this.inter();
    }

    render() {
        let { num } = this.state;
        return (
            <div id='error'>
                <img
                    src="./images/image-404.png"
                    alt=""
                />
                <p className="a">很遗憾，您访问的页面找不到了...</p>
                <p className="b">
                    建议：1.检查您的网址拼写是否正确； <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.检查您是否使用了错误的网址链接。
    	        </p>
                <p className="c">
                    <span>{num}</span>&nbsp;秒后跳转到上一页，如没有跳转，请
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={this.goPage}
                    >点击这里</span>
                </p>
            </div>
        )
    }

}

export default Error
