import React, { Component } from "react";
import store from "../../store/newstore";
import { changeLoading } from "../../actions/loadaction";
import { Redirect } from "react-router-dom";
import "./Warning.scss";
import Trend from "./Trend";
import Types from "./Types";
import HorBar from "./HorBar";
import MapBox from "./MapBox";
import EchartMap from "./EchartMap";
import OlMap from "./OlMap";
import CircleBar from "./CircleBar";
import { throttle } from '../../unit/pub';
import axios from 'axios'
import { Button } from 'antd'
import Flexbox from "./Flexbox";
import Player from 'griffith'
import ReactPlayer from 'react-player'

const sources = {
  hd: {
    play_url: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_hd.mp4',
  },
  sd: {
    play_url: 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_sd.mp4',
  },
}




class Warning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      prevMoveTime: 0,
      moveDirection: 0,
      startHeight: 0
    };
    this.touchMove = this.touchMove.bind(this)
    this.updatePostion = this.updatePostion.bind(this)
    this.calDirection = this.calDirection.bind(this)
    // this.heightRefs = React.createRef(); // 
    this.heightRefs = element => { // 推荐ref
      this.heightDom = element
    }
    // this.getCoo = this.getCoo.bind(this);
  }
  async changeLoad() {
    store.dispatch(changeLoading(true));
    setTimeout(() => {
      store.dispatch(changeLoading(false));
      this.setState({
        show: true
      });
    }, 2000);
  }
  getData() {
    // let openWindow = window.open('http://172.27.13.165:8898');
    // setTimeout(() => {
    //   openWindow.postMessage('ab', "http://172.27.13.165:8898")
    //   window.addEventListener('message', this.recieveMsg, false)
    // }, 5000)

    // window.onmessage = event => {
    //   console.log(event.data);
    // };
  }
  recieveMsg(event) {
    console.log(event)
    // 我们能相信信息的发送者吗?  (也许这个发送者和我们最初打开的不是同一个页面).
    if (event.origin !== "http://172.27.13.165:8898")
      return;
    console.log(event.data)
    // event.source 是我们通过window.open打开的弹出页面 popup
    // event.data 是 popup发送给当前页面的消息 "hi there yourself!  the secret response is: rheeeeet!"
  }
  componentWillMount() { }
  componentDidMount() {
    this.changeLoad();
    // this.addTouchs();
    this.getData();
    // console.log(this.props.match.params.type)
    // console.log(this.props.location.query.type)

    // window.addEventListener('message', this.recieveMsg, false)

  }
  addTouchs() {
    let [startX, startY] = [0, 0, 0, 0];
    document.getElementById('left-box').addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      let height = parseInt(this.heightDom.style.marginTop);
      this.setState({
        startX: startX,
        startY: startY,
        startHeight: height
      })
    })
    document.getElementById('left-box').addEventListener('touchmove', throttle(this.touchMove));
    document.getElementById('left-box').addEventListener('touchend', (e) => { })
  }
  touchMove(e) {
    let [endX, endY] = [0, 0, 0, 0];
    if (e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
    endX = e.touches[0].pageX;
    endY = e.touches[0].pageY;
    this.setState({
      endX: endX,
      endY: endY
    })
    setTimeout(() => {
      this.calDirection()
    }, 20)

  }
  calDirection() {
    let { startX, startY, endX, endY, startHeight } = this.state;
    let wH = document.getElementsByClassName('inners')[0].offsetHeight;
    let dir = this.getDirection(startX, startY, endX, endY);
    if (dir === 1) {
      if (Math.abs(startHeight) < wH * 2) {
        this.heightDom.style.marginTop = startHeight - wH + 'px';
      }
    }
    if (dir === 2) {
      if (startHeight !== 0) {
        this.heightDom.style.marginTop = startHeight + wH + 'px';
      }
    }
  }

  getDirection(startX, startY, endX, endY) {
    let direction = 0;
    let angle = Math.atan2(startY - endY, endX - startX) * 180 / Math.PI;
    if (angle > 45 && angle < 135) {
      direction = 1 // 上
    }
    if (angle > -145 && angle < -45) {
      direction = 2 // 下
    }
    if (angle > 145 || angle < -145) {
      direction = 3 // 左
    }
    if (angle < 45 && angle > -45) {
      direction = 4 // 右
    }
    return direction
  }

  //实时更新dom
  updatePostion(e) {
    setTimeout(() => {
      let { startX, startY, startHeight } = this.state
      let [endX, endY, clientX, clientY] = [0, 0, 0, 0];

      let wH = document.getElementsByClassName('inners')[0].offsetHeight;
      let height = parseInt(this.heightDom.style.marginTop);
      endX = e.touches[0].pageX;
      endY = e.touches[0].pageY;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;

      let dir = this.getDirection(startX, startY, endX, endY)

      if (dir === 1) {
        if (Math.abs(endY - startY) < (wH - 200)) {
          this.heightDom.style.marginTop = startHeight - Math.abs(endY - startY) + 'px';
        } else {
          this.heightDom.style.marginTop = startHeight - wH + 'px';
        }
      }
      if (dir === 2) {
        // if (height !== 0) {
        if (Math.abs(endY - startY) < (wH - 200)) {
          this.heightDom.style.marginTop = startHeight + Math.abs(endY - startY) + 'px';
        } else {
          this.heightDom.style.marginTop = startHeight + wH + 'px';
        }
        // }
      }
    }, 20)

  }
  getCoo() {
    // this.props.params.type
    // this.props.location.query.type
    // this.props.history.push('/warning/a')
  }
  componentWillUnmount() {
    // componentWillUnmount内禁止setState
    // this.setState = (state, callback) => {
    //   return;
    // };
  }
  render() {
    return (
      <div
        className="warning wrapper"
        id="warning"
        style={{ visibility: this.state.show === true ? "visible" : "hidden" }}
      >
        <div className="top">
          <div className="item aleft">
            {/* <Trend /> */}
            {/* <div>
              <Button onClick={this.getCoo.bind(this)}>backLogin</Button>
              <div className="opens" id="Downloads"></div>
            </div> */}
          </div>
          <div className="item aright">
            {/* <OlMap /> */}
            <Types />
            {/* <MapBox /> */}
            {/* <EchartMap /> */}
          </div>
        </div>
        <div className="bot">
          <div className="item">
            {/* touch 上下滑动 */}
            {/* <div className="boxs heightBox" id="left-box" style={{ marginTop: 0 }} ref={this.heightRefs}>
              <div className="inners">1</div>
              <div className="inners">2</div>
              <div className="inners">3</div>
            </div> */}
            <div>
              {/* <CircleBar /> */}
            </div>
          </div>
          <div className="item">
            {/* <div className="boxs">
              <div>
                <div className="animateCircle"></div>
              </div>
            </div> */}
            {/* <MapBox /> */}

            {/* <div><Types /></div> */}
            {/* <Player sources={sources} /> */}
            <ReactPlayer
              className='react-player'
              url='https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_hd.mp4'
              width='100%'
              controls
              muted
              height='100%'
            />
          </div>
          <div className="item">
            {/* <HorBar /> */}
            <Flexbox />
          </div>
        </div>
      </div>
    );
  }
}
export default Warning;
