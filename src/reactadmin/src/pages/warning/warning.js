import React, { Component } from "react";
import store from "../../store/newstore";
import { changeLoading } from "../../actions/loadaction";
import "./Warning.scss";
import Trend from "./Trend";
import Types from "./Types";
import MapBox from "./MapBox";
import { throttle } from '../../unit/pub';

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
  componentDidMount() {
    this.changeLoad();
    this.addTouchs();
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
  componentWillUnmount() {
    // this.setState = (state, callback) => {
    //   return;
    // };
  }
  render() {
    return (
      <div
        className="warning wrapper"
        id="warning"
        style={{ visibility: this.state.show === true ? "visible" : "none" }}
      >
        <div className="top">
          <div className="item aleft">
            <Trend />
          </div>
          <div className="item aright">
            <Types />
            {/* <MapBox /> */}
          </div>
        </div>
        <div className="bot">
          <div className="item">
            <div className="boxs heightBox" id="left-box" style={{ marginTop: 0 }} ref={this.heightRefs}>
              <div className="inners">1</div>
              <div className="inners">2</div>
              <div className="inners">3</div>
            </div>
          </div>
          <div className="item">
            <div className="boxs">
              <div><div className="animateCircle"></div></div>
            </div>
          </div>
          <div className="item"></div>
        </div>
      </div>
    );
  }
}
export default Warning;
