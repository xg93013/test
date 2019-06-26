import React, { Component } from 'react';
import {Tooltip} from 'antd';

class CircleBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      text: 'text'
    };
  }
  componentDidMount() {
    this.getCharts();
  }
  getCharts() {
    
  }

  render() {
    return (
      <div className="trend">
        <div className="title">circle</div>
        <div className="chart" >
          <div className="circle-box">
            <div className="cirleft">
                <div className="bar" style={{height: '50%'}}></div>
            </div>
            <div className="cirright">
              <div className="bar rightbar" style={{height: '30%'}}></div>
            </div>
            <div className="lines"></div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default CircleBar;
