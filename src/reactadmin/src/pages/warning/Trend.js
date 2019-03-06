import React, { Component } from 'react';
import echarts from 'echarts';
import { throttle } from '../../unit/pub';
import { Button, Checkbox, Tag } from 'antd';
import emitter from './ev';
// import { myDOM } from "./utils/myUtils";

const color = ['#DF6562', '#EFC235', '#4EA739', '#2A6BAF', '#805CCA'];
const CheckboxGroup = Checkbox.Group;

class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart: null,
      filterList: [],
      selectList: ['a', 'b', 'c'],
    };
    this.changeFilter = this.changeFilter.bind(this);
    this.reClick = this.reClick.bind(this);
    // this.addFilter = this.addFilter.bind(this);
    // this.closeTag = this.closeTag.bind(this);
  }
  componentDidMount() {
    // this.getCharts();
  }
  getCharts() {
    let xData = [1, 2, 3, 4, 5];
    let legendData = ['a', 'b'];
    let seriesData = [
      {
        name: 'a',
        type: 'line',
        stack: 'a',
        data: [2, 3, 4, 5, 2],
        areaStyle: {
          color: color[0],
          opacity: 0.1,
        },
        smooth: true,
      },
      {
        name: 'b',
        type: 'line',
        stack: 'a',
        data: [2, 3, 4, 5, 3],
        areaStyle: {
          color: color[1],
          opacity: 0.1,
        },
        smooth: true,
      },
    ];
    let myChart = echarts.init(document.getElementById('trend-chart'));
    let option = {
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let total = 0;
          let addHtml = '';
          params.forEach((item, index) => {
            addHtml += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[index]}"></span>
            <span>${item.seriesName}：</span><span>${item.value}</span><br/>`;
            total += item.value;
          });
          let html = `${params[0].name}<span style="margin-left:10px">${total}</span><br/>`;

          html = html + addHtml;
          return html;
        },
      },
      color: color,
      legend: {
        top: 0,
        right: 30,
        data: legendData,
        // selected: this.selected
      },
      grid: {
        left: 30,
        right: 30,
        bottom: 20,
        top: 40,
        containLabel: true,
      },
      toolbox: {
        show: false,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eee',
          },
        },
      },
      series: seriesData,
    };
    // myChart.setOption(option, true);
    // window.addEventListener("resize", throttle(myChart.resize));
  }
  setStatus(msg) {
    emitter.emit('changeMsg', msg);
  }
  changeFilter(list) {
    this.setState({
      filterList: [...list],
    });
  }
  addFilter(item) {
    let { filterList } = this.state;
    if (filterList.indexOf(item) === -1) {
      this.setState({
        filterList: [...filterList, item],
      });
    }
  }
  closeTag(item) {
    let { filterList } = this.state;
    let index = filterList.indexOf(item);
    filterList.splice(index, 1);
    if (index !== -1) {
      setTimeout(() => {
        this.setState({
          filterList: [...filterList],
        });
      }, 20);
    }
  }
  reClick() {
    console.log(this.state.selectList)
    console.log('a');
  }
  render() {
    let { filterList, selectList } = this.state;
    return (
      <div className="trend">
        <div className="title">
          {/* <Button onClick={this.setStatus.bind(this, "msgs")}>changeMsg</Button> */}
          {/* <Button onClick={this.setFilter}></Button> */}
          <Button onClick={throttle(this.reClick)}>btns</Button>
          {selectList.map((item, index) => {
            return (
              // <span>{item}</span>
              (
                <span
                  onClick={() => {
                    this.addFilter(item);
                  }}
                  key={'ab' + index}
                >
                  {item}
                </span>
              )
            );
          })}
          <br />
          <CheckboxGroup
            options={selectList}
            value={filterList}
            onChange={this.changeFilter}
          />
          {filterList.map((item, index) => {
            return (
              <Tag
                key={item}
                closable={true}
                onClose={() => {
                  this.closeTag(item);
                }}
              >
                {item}
              </Tag>
            );
          })}
        </div>
        {/* <div className="chart" id="trend-chart" /> */}
      </div>
    );
  }
}

export default Trend;
