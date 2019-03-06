import React, { Component } from 'react'
import { Map, Marker, InfoWindow } from "react-amap";
import mapData from "../../datas/mapData.json";
import { Tooltip, Cascader } from 'antd';
import axios from 'axios'

class MapBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: ["#00A0E9", "#22AC38", "#AF39BA", "#F48C47", "#CE383F"],
      mapCenter: [104.06476, 30.5702],
      totalData: [],
      topData: [],
      filterOptions: [{
        code: "abbbbasdas",
        name: "label1",
        items: [{
          code: "asdasd",
          name: "label3",
          items: [{
            code: "asdasdaa",
            name: "label3",
          }],
        }, {
          code: "asdasdv",
          name: "label2",
          items: [{
            code: "asdasdba",
            name: "label3",
          }]
        }]
      }],
      aIndex: 0,
      aTimer: "",
      // popupVisible: true
    }
    this.renderFun = this.renderFun.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    // this.showSelect = this.showSelect.bind(this);
    this.selectMap = {
      created: () => { },
      click: e => {
        this.setState({
          infoWindow: {
            visible: false,
            popupVisible: false,
            offset: [0, 0]
          }
        });
      }
    }
    this.selectMarker = {
      created: () => { },
      click: e => {
        let aIndex = 0;
        for (let i = 0; i < this.state.totalData.length; i++) {
          if (this.state.totalData[i].enterpriseName === e.target.getExtData().enterpriseName) {
            aIndex = i;
          }
        }
        this.setState({
          aIndex: aIndex,
          popupVisible: false,
          mapCenter: [e.target.getPosition().lng, e.target.getPosition().lat]
        })
        // console.log(e)
      },
      mouseover: e => {
        // console.log(e)
      }
    }
  }
  componentDidMount() {
    this.getData()
  }
  async getFilterData() {
    let res = axios.get("/api/filterData");
    if (res) {
      this.setState({
        filterOptions: [...res]
      })
    }
  }
  getData() {
    this.setState({
      totalData: mapData.data.list.slice(0, 10),
      topData: mapData.data.list.slice(0, 10)
    });
    setTimeout(() => {
      // this.setTime();
    }, 2000)

  }
  setTime() {
    let { aIndex, mapCenter, totalData } = this.state

    this.aTimer = setInterval(() => {
      aIndex++
      if (aIndex === totalData.length) {
        aIndex = 0;
      }
      mapCenter = [totalData[aIndex].longitude, totalData[aIndex].latitude];
      this.setState({
        aIndex: aIndex,
        mapCenter: mapCenter
      })
    }, 5000)
  }
  renderFun(extData) {
    let { totalData, aIndex } = this.state
    let grade = 1;
    switch (extData.grade) {
      case 'A':
        grade = 1;
        break;
      case 'B':
        grade = 2;
        break;
      case 'C':
        grade = 3;
        break;
      case 'D':
        grade = 4;
        break;
      case 'E':
        grade = 5;
        break;
      default:
        break;
    }
    return <Tooltip title={extData.area}>
      <img src={extData.grade !== ""
        ? totalData[aIndex].organizationCode === extData.organizationCode
          ? require(`../../images/float-${grade}-b.png`)
          : require(`../../images/float-${grade}-s.png`)
        : require(`../../images/float-1-s.png`)} alt="" />
    </Tooltip>
  }
  onFilterChange(item, options) {
    // console.log(options)
  }
  showSelect(e) {
    console.log(e)
    // setTimeout(() => {
    this.setState({
      popupVisible: true
    })
    // })
  }
  render() {
    let { totalData, filterOptions } = this.state
    return (
      <div className="mapBox">
        <div className="filter">
          <Cascader
            placeholder="select"
            fieldNames={{
              label: 'name',
              value: 'code',
              children: 'items'
            }}
            onClick={() => { this.showSelect() }}
            onChange={this.onFilterChange}
            // popupVisible={this.popupVisible}
            options={filterOptions}
          />
        </div>
        <Map
          amapkey={"c85b169acc3c5472b5f282ec4cfb5198"}
          center={this.state.mapCenter}
          mapStyle={"normal"}
          zoom={8}
          events={this.selectMap}>
          {
            totalData.map((item, i) => {
              return item.longitude !== "null" && item.latitude !== "null" ? (
                // <Marker
                //   position={[item.longitude, item.latitude]}
                //   icon={
                //     item.grade !== ""
                //       ? require(`../../images/float-${item.grade}.png`)
                //       : require(`../../images/float-A.png`)
                //   }
                //   extData={item}
                //   key={'marker' + i}
                //   clickable
                //   events={this.selectMarker}
                // ></Marker>
                <Marker
                  position={[item.longitude, item.latitude]}
                  extData={item}
                  render={this.renderFun}
                  key={'marker' + i}
                  events={this.selectMarker}
                >

                </Marker>
              ) : ("")
            })
          }
        </Map>
      </div>
    )
  }
}

export default MapBox