<template>
  <div id="amap-box">
    <div class="left">
      <div id="amap"></div>
      <div class="charts-3d" id="echarts-3d"></div>
      <div class="search">
        <el-input
          v-model="search.keyWord"
          placeholder="请输入内容"
          class="search-item"
          @blur="keySearch"
          id="searchId"
        ></el-input>
        <el-select
          v-model="search.selectValue"
          placeholder="请选择"
          class="search-item"
          @change="selectSearch"
        >
          <el-option
            v-for="item in selectOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button @click="keySearch">选择区域</el-button>
      </div>
    </div>
    <div class="right">
      <div class="info">
        <p>{{ storeInfo.name }}</p>
        <p>{{ storeInfo.Address }}</p>
        <p>{{ storeInfo.region }}</p>
      </div>
    </div>
    <!--<Amap></Amap>
    <Amapui></Amapui>-->
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts-gl";
import { myDOM } from "@/assets/js/myUtils.js";
import originData from "../mapJson/home-json.js";
import polygonData from "../mapJson/chengduArea.json";
import chengduPolygon from "@/assets/data/convex_hull.json";
export default {
  components: {},
  data() {
    return {
      mapObj: "",
      keyTimer: "",
      mapCenter: [116.397428, 39.90923],
      currentIndex: 0,
      changeTimer: 0,
      markIcon: [
        {
          iconImg: require("../../assets/images/red.png")
        },
        {
          iconImg: require("../../assets/images/red.png")
        }
      ],
      markerData: [],
      storeInfo: "",
      search: {
        keyWord: "",
        selectValue: ""
      },
      selectOption: [
        {
          value: "成都市",
          label: "成都市"
        },
        {
          value: "高新区",
          label: "高新区"
        },
        {
          value: "成华区",
          label: "成华区"
        }
      ],
      markerObj: [],
      searchObj: "",
      polygonObj: "",
      myChart: ""
    };
  },
  created() {
    //			console.log(originData)
    this.getMarkerData();
  },
  methods: {
    initMap() {
      let _self = this;
      this.mapObj = new AMap.Map("amap", {
        resizeEnable: true,
        zoom: 8,
        mapStyle: "amap://styles/0557538bad9e76aba4f4027e0ef5dea4",
        center: _self.mapCenter,
        animateEnable: true
      });

      this.polygonObj = new AMap.Polygon({
        map: this.mapObj,
        strokeWeight: 1,
        strokeColor: "#0091ea",
        fillColor: "#80d8ff",
        fillOpacity: 0.2,
        path: chengduPolygon.features[0].geometry.coordinates[0]
      });
      AMap.service('AMap.DistrictSearch',()=>{//回调函数

        let searchObj = new AMap.DistrictSearch(
          {
            level: 'province',
            extensions: 'all',
            showbiz: false,
            subdistrict: 1
          }
        )
        searchObj.search('重庆',function(status,result){
          // console.log(result)
        })
      })
      AMap.service('AMap.PlaceSearch',()=>{//回调函数

        let searchObj = new AMap.PlaceSearch(
          {
            city: '重庆'
          }
        )
        searchObj.search('重庆',function(status,result){
          // console.log(result)
        })
      })

      AMap.service('AMap.Autocomplete',()=>{//回调函数

        let searchObj = new AMap.Autocomplete(
          {
            city: '重庆'
          }
        )
        searchObj.search('重庆',function(status,result){
          console.log(result)
        })
      })

      // AMap.plugin('AMap.DistrictSearch', function () {
      //   var districtSearch = new AMap.DistrictSearch({
      //     // 关键字对应的行政区级别，country表示国家
      //     level: 'country',
      //     //  显示下级行政区级数，1表示返回下一级行政区
      //     subdistrict: 1
      //   })

      //   // 搜索所有省/直辖市信息
      //   districtSearch.search('四川省', function(status, result) {
      //     // 查询成功时，result即为对应的行政区信息
      //     console.log(result.districtList[0].boundaries)
      //   })
      // })
    },
    getMarkerData() {
      let _self = this;
      let oldArr = [];
      let outArr = [];
      oldArr = originData.slice(0);
      //				let oneStore = {}
      for (let i = 0, len = oldArr.length; i < len; i++) {
        let LngLatX = oldArr[i].location.split(",")[0];
        let LngLatY = oldArr[i].location.split(",")[1];
        oldArr[i].LngLatX = oldArr[i].location.split(",")[0];
        oldArr[i].LngLatY = oldArr[i].location.split(",")[1];
        oldArr[i].status = 0;
        let oneObj = oldArr[i];
        outArr.push(oneObj);
      }
      _self.mapCenter = [outArr[0].LngLatX, outArr[0].LngLatY];
      _self.markerData = outArr;
    },
    addMarker(data) {
      //				console.log(data)
      let _self = this;
      if (!_self.mapObj) {
        return;
      }
      _self.clearMarker();
      //				_self.mapObj.remove(_self.markerData)
      for (let i = 0, len = data.length; i < len; i++) {
        let iconStatus = 0;
        if (data[i].status) {
          iconStatus = data[i].status;
        }
        if (!data[i].LngLatX || !data[i].LngLatY) {
          return;
        }
        let marker = new AMap.Marker({
          map: _self.mapObj,
          position: [data[i].LngLatX, data[i].LngLatY],
          icon: _self.markIcon[iconStatus].iconImg,
          title: data[i].name
        });
        marker.content = data[i].name;
        // marker节流点击
        marker.on(
          "click",
          myDOM.debounce(function() {
            _self.currentIndex = i;
            _self.setMapCenter();
          }, 200)
        );
        _self.markerObj.push(marker);
      }
      //				_self.mapObj.panTo([data[0].LngLatX, data[0].LngLatY])
    },
    clearMarker() {
      let _self = this;
      _self.currentIndex = 0;
      window.clearTimeout(_self.changeTimer);
      //				for (let i = 0, len = _self.markerObj.length; i < len; i++) {
      //					_self.mapObj.remove(_self.markerObj[i])
      //				}
      _.forEach(_self.markerObj, function(value) {
        _self.mapObj.remove(value);
      });
      _self.setMapCenter();
    },
    setMapCenter() {
      let _self = this;
      if (_self.changeTimer) {
        window.clearTimeout(_self.changeTimer);
      }
      if (_self.markerData.length > 0) {
        if (
          _self.markerData[_self.currentIndex].LngLatX &&
          _self.markerData[_self.currentIndex].LngLatY
        ) {
          _self.mapObj.panTo([
            _self.markerData[_self.currentIndex].LngLatX,
            _self.markerData[_self.currentIndex].LngLatY
          ]);
        }
        _self.mapObj.setZoom(13);
        _self.storeInfo = _self.markerData[_self.currentIndex];
        _self.changeTimer = setTimeout(function() {
          _self.currentIndex++;
          if (_self.currentIndex === _self.markerData.length) {
            _self.currentIndex = 0;
          }
          setTimeout(_self.setMapCenter, 3000);
        }, 3000);
      }
    },
    keySearch() {
      let key = this.search.keyWord;
      let originMarker = this.markerData.splice(0);
      if (key !== "") {
        // let searchMarker = originMarker.filter(function(item, index) {
        //   return item.name.indexOf(key) > -1;
        // });
        // //					let searchMarker = _.filter(originMarker, _.negate((n) => {
        // //						return n.indexOf(key) > -1
        // //					}))
        // this.markerData = searchMarker;
        // this.addMarker(searchMarker);
        for (let i = 0; i < polygonData.features.length; i++) {
          if (polygonData.features[i].properties.name === key) {
            let path = polygonData.features[i].geometry.coordinates[0];
            this.polygonObj.setPath(path);
            this.mapObj.setFitView();
            // this.mapObj.setCenter(polygonData.features[i].properties.cp);
            return;
          }
        }
      } else {
        this.markerData = originMarker;
      }
    },
    selectSearch() {},
    initChart() {
      // 绘制图表

      var hours = [
        "12a",
        "1a",
        "2a",
        "3a",
        "4a",
        "5a",
        "6a",
        "7a",
        "8a",
        "9a",
        "10a",
        "11a",
        "12p",
        "1p",
        "2p",
        "3p",
        "4p",
        "5p",
        "6p",
        "7p",
        "8p",
        "9p",
        "10p",
        "11p"
      ];
      var days = [
        "Saturday",
        "Friday",
        "Thursday",
        "Wednesday",
        "Tuesday",
        "Monday",
        "Sunday"
      ];

      var data = [
        [0, 0, 5],
        [0, 1, 1],
        [0, 2, 0],
        [0, 3, 0],
        [0, 4, 0],
        [0, 5, 0],
        [0, 6, 0],
        [0, 7, 0],
        [0, 8, 0],
        [0, 9, 0],
        [0, 10, 0],
        [0, 11, 2],
        [0, 12, 4],
        [0, 13, 1],
        [0, 14, 1],
        [0, 15, 3],
        [0, 16, 4],
        [0, 17, 6],
        [0, 18, 4],
        [0, 19, 4],
        [0, 20, 3],
        [0, 21, 3],
        [0, 22, 2],
        [0, 23, 5],
        [1, 0, 7],
        [1, 1, 0],
        [1, 2, 0],
        [1, 3, 0],
        [1, 4, 0],
        [1, 5, 0],
        [1, 6, 0],
        [1, 7, 0],
        [1, 8, 0],
        [1, 9, 0],
        [1, 10, 5],
        [1, 11, 2],
        [1, 12, 2],
        [1, 13, 6],
        [1, 14, 9],
        [1, 15, 11],
        [1, 16, 6],
        [1, 17, 7],
        [1, 18, 8],
        [1, 19, 12],
        [1, 20, 5],
        [1, 21, 5],
        [1, 22, 7],
        [1, 23, 2],
        [2, 0, 1],
        [2, 1, 1],
        [2, 2, 0],
        [2, 3, 0],
        [2, 4, 0],
        [2, 5, 0],
        [2, 6, 0],
        [2, 7, 0],
        [2, 8, 0],
        [2, 9, 0],
        [2, 10, 3],
        [2, 11, 2],
        [2, 12, 1],
        [2, 13, 9],
        [2, 14, 8],
        [2, 15, 10],
        [2, 16, 6],
        [2, 17, 5],
        [2, 18, 5],
        [2, 19, 5],
        [2, 20, 7],
        [2, 21, 4],
        [2, 22, 2],
        [2, 23, 4],
        [3, 0, 7],
        [3, 1, 3],
        [3, 2, 0],
        [3, 3, 0],
        [3, 4, 0],
        [3, 5, 0],
        [3, 6, 0],
        [3, 7, 0],
        [3, 8, 1],
        [3, 9, 0],
        [3, 10, 5],
        [3, 11, 4],
        [3, 12, 7],
        [3, 13, 14],
        [3, 14, 13],
        [3, 15, 12],
        [3, 16, 9],
        [3, 17, 5],
        [3, 18, 5],
        [3, 19, 10],
        [3, 20, 6],
        [3, 21, 4],
        [3, 22, 4],
        [3, 23, 1],
        [4, 0, 1],
        [4, 1, 3],
        [4, 2, 0],
        [4, 3, 0],
        [4, 4, 0],
        [4, 5, 1],
        [4, 6, 0],
        [4, 7, 0],
        [4, 8, 0],
        [4, 9, 2],
        [4, 10, 4],
        [4, 11, 4],
        [4, 12, 2],
        [4, 13, 4],
        [4, 14, 4],
        [4, 15, 14],
        [4, 16, 12],
        [4, 17, 1],
        [4, 18, 8],
        [4, 19, 5],
        [4, 20, 3],
        [4, 21, 7],
        [4, 22, 3],
        [4, 23, 0],
        [5, 0, 2],
        [5, 1, 1],
        [5, 2, 0],
        [5, 3, 3],
        [5, 4, 0],
        [5, 5, 0],
        [5, 6, 0],
        [5, 7, 0],
        [5, 8, 2],
        [5, 9, 0],
        [5, 10, 4],
        [5, 11, 1],
        [5, 12, 5],
        [5, 13, 10],
        [5, 14, 5],
        [5, 15, 7],
        [5, 16, 11],
        [5, 17, 6],
        [5, 18, 0],
        [5, 19, 5],
        [5, 20, 3],
        [5, 21, 4],
        [5, 22, 2],
        [5, 23, 0],
        [6, 0, 1],
        [6, 1, 0],
        [6, 2, 0],
        [6, 3, 0],
        [6, 4, 0],
        [6, 5, 0],
        [6, 6, 0],
        [6, 7, 0],
        [6, 8, 0],
        [6, 9, 0],
        [6, 10, 1],
        [6, 11, 0],
        [6, 12, 2],
        [6, 13, 1],
        [6, 14, 3],
        [6, 15, 4],
        [6, 16, 0],
        [6, 17, 0],
        [6, 18, 0],
        [6, 19, 0],
        [6, 20, 1],
        [6, 21, 2],
        [6, 22, 2],
        [6, 23, 6]
      ];
      let options = {
        tooltip: {},
        visualMap: {
          max: 20,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026"
            ]
          }
        },
        xAxis3D: {
          type: "category",
          data: hours
        },
        yAxis3D: {
          type: "category",
          data: days
        },
        zAxis3D: {
          type: "value"
        },
        grid3D: {
          boxWidth: 200,
          boxDepth: 80,
          viewControl: {
            // projection: 'orthographic'
          },
          light: {
            main: {
              intensity: 1.2,
              shadow: true
            },
            ambient: {
              intensity: 0.3
            }
          }
        },
        series: [
          {
            type: "bar3D",
            data: data.map(function(item) {
              return {
                value: [item[1], item[0], item[2]]
              };
            }),
            shading: "lambert",

            label: {
              textStyle: {
                fontSize: 16,
                borderWidth: 1
              }
            },

            emphasis: {
              label: {
                textStyle: {
                  fontSize: 20,
                  color: "#900"
                }
              },
              itemStyle: {
                color: "#900"
              }
            }
          }
        ]
      };
      this.myChart = echarts.init(document.getElementById("echarts-3d"));
      this.myChart.setOption(options);
    }
  },
  mounted() {
    this.initMap();
    // this.initChart();
    // this.addMarker(this.markerData);
    // this.setMapCenter();
  }
};
</script>

<style lang="scss" scoped="scoped">
#amap-box {
  display: flex;
  .left {
    flex: 0 0 500px;
    width: 500px;
    position: relative;
    .charts-3d {
      width: 300px;
      height: 200px;
      position: absolute;
      left: 10px;
      top: 10px;
    }
    #amap {
      position: absolute;
      top: 0;
      right: 0;
      width: 450px;
      height: 450px;
    }
    .search {
      position: absolute;
      top: 10px;
      right: 10px;
      .search-item {
        width: 160px;
      }
    }
  }
  .right {
    flex: 1;
    margin-left: 20px;
  }
}
</style>