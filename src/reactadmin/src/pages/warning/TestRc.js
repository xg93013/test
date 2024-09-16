import React, { Component } from 'react'
import { throttle } from '../../unit/pub';
import { Button, Checkbox, Tag } from 'antd';
import emitter from './ev';

const CheckboxGroup = Checkbox.Group;

class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterList: [],
      selectList: ['a', 'b', 'c'],
    };
    this.changeFilter = this.changeFilter.bind(this);
    this.reClick = this.reClick.bind(this);
    // this.addFilter = this.addFilter.bind(this);
    // this.closeTag = this.closeTag.bind(this);
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
  // 监听props变化
  //   static getDerivedStateFromProps(props, current_state) {
  //     if (props.topData !== current_state.navList) {
  //         return {

  //             navList: props.topData,
  //         }
  //     }
  //     return current_state.navList
  // }
  render() {
    let { filterList, selectList } = this.state;
    return (
      <div>
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
    )
  }
}

export default componentName