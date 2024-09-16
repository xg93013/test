<template>
  <div id="riskAnalysis" :class="{'risk-full': isFullScreen}">
    <Amap />
    <div id="mapUi"></div>
    <div id="mapContent"></div>
    <div id="colorRange" v-show="!pointMsg.ventureType||pointMsg.level>13">
      <el-slider
        @input="setColor"
        @change="sliderChange"
        :show-tooltip="false"
        v-model="value"
        :disabled="pointMsg.shopId||pointMsg.level<14?true:false"
        vertical
        range
        height="157px"
      ></el-slider>
      <div class="bgdiv"></div>
      <!-- <span class="a">0</span>
      <span class="b">100</span>-->
    </div>
    <div id="detailBox">
      <detailBox
        v-if="show"
        ref="detailBox"
        @resizeSlider="resizeSlider"
        @getBaseMsg="getBaseMsg"
        @setMap="setMap"
      />
    </div>
  </div>
</template>
  
<script>
// 省级小于等于5  市级小于等于8  区县级小于等于13 CITY,ZONE
import http from "@/unit/http";
import apis from "@/unit/apis";
import ColorRangeMaker from "@/unit/color";
import { mapState } from "vuex";
import detailBox from "./detailBox";
const { VENTURE_MAP } = apis;
export default {
  data() {
    return {
      map: null,
      mass: null,
      infoWindow: null,
      cm: new ColorRangeMaker({
        // color: [[105,203,4], [242, 245, 26], [227, 122, 53]],
        color: [[105, 203, 4], [250, 175, 10], [185, 8, 8]],
        value: [0, 100]
      }),
      value: [0, 100],
      show: false,
      loading: false,
      pointMsg: {},
      data: [],
      markers: [],
      isSearch: false,
      isMove: false
    };
  },
  components: {
    detailBox,
    Amap: {
      render(createElement) {
        return createElement("script", {
          attrs: {
            type: "text/javascript",
            src:
              "https://webapi.amap.com/maps?v=1.3&key=c85b169acc3c5472b5f282ec4cfb5198&plugin=AMap.ToolBar&callback=init"
          }
        });
      }
    }
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.isFullScreen
    })
  },
  watch: {
    isFullScreen(a, b) {
      if (a) {
        this.map.setMapStyle("amap://styles/grey");
      } else {
        this.map.setMapStyle("amap://styles/macaron");
      }
    }
  },
  methods: {
    getBaseMsg(e, isSearch) {
      this.isSearch = isSearch ? isSearch : false;
      this.pointMsg = { ...this.pointMsg, ...e };
      let { regionType } = this.$store.state.userMsg;
      if (this.isSearch || regionType === "PROVINCE") {
        this.getMapPoint();
      }
    },
    async getMapPoint() {
      if (this.loading) {
        return false;
      }
      if (this.infoWindow.getIsOpen()) {
        this.infoWindow.close();
      }
      if (this.pointMsg.level > 13 && !this.isSearch) {
        this.logMapBounds();
      }
      let obj = this.pointMsg;
      if (!obj.ventureType) {
        delete obj.ventureType;
      }
      this.loading = true;
      this.$store.commit("changeLoading", true);
      let res = await http.post(VENTURE_MAP, obj);
      if (res) {
        this.loading = false;
        if (this.isMove) {
          this.isMove = false;
        }
        this.$store.commit("changeLoading", false);
        let { zoom } = this.pointMsg;
        this.data = [...res.result];
        this.map.remove(this.markers);
        this.markers = [];
        if (!res.result.length) {
          this.$message({
            message: "暂无数据！",
            type: "warning"
          });
        }
        if (this.isSearch) {
          if (this.pointMsg.shopId) {
            let { coordX, coordY } = res.result[0];
            this.setMap({
              zoom: 13,
              center: [coordX, coordY]
            });
          }
          this.setSvgMarks();
        } else {
          if (this.pointMsg.level <= 13) {
            this.setTxtMarks();
          } else {
            this.setSvgMarks();
          }
        }
      }
    },
    setMap(e) {
      if (e.zoom) {
        if (e.zoom > 13) {
          //避免同时移动和放大，两次请求数据
          this.isMove = true;
        } else {
          this.isMove = false;
        }
        this.map.setZoom(e.zoom);
      }
      if (e.center) {
        this.map.setCenter(e.center);
      }

      if (e.clear) {
        ///避免关键字搜索清空不请求数据
        let { regionType } = this.$store.state.userMsg;
        if (e.isViol) {
          //如果是选择的违规类型，直接请求
          this.getMapPoint();
        } else {
          if (regionType === "PROVINCE" && e.zoom === 7) {
            this.getMapPoint();
          }
          if (regionType === "CITY" && e.zoom === 9) {
            this.getMapPoint();
          }
        }
      }
    },

    logMapBounds() {
      let bounds = this.map.getBounds();
      let ne = bounds.northeast; //东北
      let sw = bounds.southwest; //西南
      this.pointMsg.range = {
        northEast: {
          lat: ne.lat,
          lng: ne.lng
        },
        southWest: {
          lat: sw.lat,
          lng: sw.lng
        }
      };
    },
    setTxtMarks() {
      let { ventureType } = this.pointMsg;
      this.data.forEach((item, index) => {
        let color = ventureType
          ? "10,161,229"
          : this.cm.make(item.riskValue ? item.riskValue : 0).join(",");
        let markerContent = `<div class="smog-marker">
        ${item.name}
        <span style="background:rgb(${color})">${item.riskValue}</span>
      </div>`;
        let marker = new AMap.Marker({
          position: [item.coordX, item.coordY],
          content: markerContent,
          offset: new AMap.Pixel(-13, -30)
        });

        // 将 markers 添加到地图
        this.map.add(marker);
        this.markers.push(marker);
      });
    },
    setSvgMarks() {
      let isSet = {};
      this.data.forEach((item, index) => {
        let color = this.cm.make(item.riskValue ? item.riskValue : 0).join(",");
        let markerContent = `<div id="d${index}" class="map-cir" onClick="adScale('d${index}')">
      <svg t="1554181188316" class="icon" style="fill:rgb(${color})" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3356" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30">
        <path d="M839.946482 389.336542c0-179.917116-147.043874-325.820973-328.561518-325.820973-181.460336 0-328.561518 145.903857-328.561518 325.820973 0 59.446709 16.307166 114.955546 44.308214 162.939652l-0.351011 0 284.574638 407.316894 284.690277-407.316894-0.379665 0C823.757001 504.292088 839.946482 448.783251 839.946482 389.336542M511.413617 552.215816c-90.716353 0-164.280247-72.922251-164.280247-162.907928 0-89.927346 73.563895-162.907928 164.280247-162.907928 90.802315 0 164.280247 72.980582 164.280247 162.907928C675.693865 479.293565 602.215932 552.215816 511.413617 552.215816" p-id="3357">
        </path>
      </svg>
      </div>`;
        let position = [item.coordX, item.coordY];
        if (isSet[position.join("-")]) {
          let x =
            item.coordX + Number((Math.random() * 0.0001 + 0.00001).toFixed(5));
          let y =
            item.coordY + Number((Math.random() * 0.0001 + 0.00001).toFixed(5));
          position = [x, y];
        }
        let marker = new AMap.Marker({
          position,
          content: markerContent,
          offset: new AMap.Pixel(-13, -30)
        });
        marker.on("click", e => {
          let div = `<div class="map-con">
            <div>${item.name}</div>
            <div>
              <span>${item.riskValue}</span> <br />
              风险指数 <br />
              <span onClick="winFun('${item.id}')">查看详情</span>
            </div>
          </div>`;
          this.infoWindow.setContent(div);
          this.infoWindow.open(this.map, e.target.getPosition());
        });
        this.map.add(marker);
        this.markers.push(marker);
        isSet[position.join("-")] = true;
      });
    },
    winFun(e) {
      this.$refs.detailBox.goDetail(e);
      this.$refs.detailBox.shrinkChange(false);
    },
    setColor(arr) {
      setTimeout(() => {
        let doms = document
          .getElementById("colorRange")
          .getElementsByClassName("el-slider__button-wrapper");
        for (let i = 0; i < 2; i++) {
          let n = doms[i].style.bottom.replace(/%/, "");
          let color = "rgb(" + this.cm.make(n).join(",") + ")";
          doms[i].getElementsByClassName(
            "el-slider__button"
          )[0].style.borderRight = "solid 18px " + color;
          doms[i].getElementsByClassName(
            "el-slider__button"
          )[0].innerHTML = `<span>${n}</span>`;
        }
      });
    },
    resizeSlider() {
      this.value = [0, 100];
      this.setColor([0, 100]);
    },
    sliderChange(arr) {
      this.pointMsg.riskFrom = arr[0];
      this.pointMsg.riskTo = arr[1];
      this.getMapPoint();
    }
  },
  mounted() {
    window.init = () => {
      this.map = new AMap.Map("mapContent", {
        animateEnable: true,
        mapStyle: "amap://styles/macaron",
        features: ["road", "point"]
      });
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      this.show = true;
      this.map.on("click", () => {
        if (this.infoWindow.getIsOpen()) {
          this.infoWindow.close();
        }
      });
      this.infoWindow.on("open", () => {
        let dom = document.getElementsByClassName("map-cir-active");
        if (dom.length) {
          for (let i = 0; i < dom.length; i++) {
            dom[i].className = "map-cir";
          }
        }
      });
      this.infoWindow.on("close", () => {
        let dom = document.getElementsByClassName("map-cir-active");
        if (dom.length) {
          for (let i = 0; i < dom.length; i++) {
            dom[i].className = "map-cir";
          }
        }
      });
      this.map.on("zoomend", () => {
        if (this.isSearch) {
          //如果为模糊搜索
          return false;
        }
        let zoom = this.map.getZoom();
        if (
          zoom < 14 &&
          (this.pointMsg.riskFrom !== 0 || this.pointMsg.riskFrom !== 100)
        ) {
          this.resizeSlider();
          this.pointMsg.riskFrom = 0;
          this.pointMsg.riskTo = 100;
        }
        this.getBaseMsg({
          level: zoom
        });
        if (!this.isMove) {
          this.getMapPoint();
        }
      });
      this.map.on("moveend", () => {
        if (this.isSearch) {
          return false;
        }
        if (this.map.getZoom() > 13) {
          this.getMapPoint();
        }
      });
    };
    window.winFun = e => {
      this.winFun(e);
    };
    window.adScale = e => {
      document.getElementById(e).className += " map-cir-active";
    };
    this.setColor([0, 100]);
  }
};
</script>
<style lang="scss">
#riskAnalysis {
  position: relative;
  min-height: 800px;
  padding: 0 !important;
  .amap-info-close {
    font: 700 16px/14px 微软雅黑;
    color: #666;
    top: 8px;
    right: 6px !important;
  }
  #mapContent {
    width: 100%;
    height: 100%;

    .amap-drags {
      z-index: 10 !important;
    }
  }
  #detailBox {
    position: absolute;
    // width: 400px;
    right: 10px;
    top: 0;
    bottom: 10px;
    z-index: 100;
  }

  #colorRange {
    position: fixed;
    left: 200px;
    bottom: 10px;
    z-index: 99;
    width: 50px;
    height: 160px;

    .el-slider.is-vertical {
      left: 22px;
    }
    .el-slider.is-vertical .el-slider__button-wrapper {
      left: 5px;
    }
    .el-slider__button {
      border: 2px solid #409eff;
      background-color: transparent;
      border-radius: 50%;
      transition: 0.2s;
      user-select: none;
      width: 0;
      height: 0;
      margin-bottom: -4px;
      margin-left: -7px;
      border-radius: 0;
      border-right: solid 18px #40a9ff;
      border-left: solid 0 transparent;
      border-top: solid 10px transparent;
      border-bottom: solid 10px transparent;
      // cursor: pointer;

      > span {
        position: relative;
        color: #666;
        margin-left: 20px;
        top: -9px;
      }
    }
    .el-slider__button.hover {
      transform: scale(1);
    }

    .bgdiv {
      position: absolute;
      width: 20px;
      height: 100%;
      top: 0;
      right: 0;
      background: linear-gradient(
        0deg,
        rgb(105, 203, 4) 0%,
        rgb(250, 175, 10) 50%,
        rgb(185, 8, 8) 100%
      );
      border-radius: 20px;
    }
    .a,
    .b {
      position: absolute;
      right: -30px;
      color: #333;
      font-size: 14px;
    }
    .b {
      top: 0;
    }
    .a {
      bottom: 0;
      right: -10px;
    }
  }

  .map-cir {
    width: 30px;
    height: 30px;
    // background: #3de753;
  }
  .map-cir-active {
    width: 44px;
    height: 44px;
    svg {
      width: 44px !important;
      height: 44px !important;
    }
  }
  .smog-marker {
    position: relative;
    background-color: #fff;
    border: 1px solid #d7d6d2;
    border-radius: 30px 30px 30px 0;
    white-space: nowrap;
    height: 30px;
    line-height: 30px;
    padding: 0 0 0 10px;
    font-size: 16px;
    color: #333;
    span {
      display: inline-block;
      position: relative;
      // right: 0;
      top: -1px;
      height: 30px;
      min-width: 30px;
      padding: 0 4px;
      border-radius: 0 28px 28px 0;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
      color: #fff;
    }
  }
  .amap-info-sharp {
    display: none;
  }
  .amap-info {
    .amap-info-content {
      border-radius: 4px;
      padding: 16px 24px 10px 16px;

      .map-con {
        display: inline-block;

        > div {
          display: inline-block;

          &:first-child {
            font-size: 16px;
            color: #666;
            margin-right: 16px;
            vertical-align: top;
            max-width: 140px;
            word-break: break-all;
            word-wrap: break-word;
          }

          &:last-child {
            color: #666;
            font-size: 13px;
            span:first-child {
              top: -2px;
              position: relative;
              color: #333;
              font-size: 20px;
              display: inline-block;
              margin-bottom: 4px;
            }
            span:last-child {
              display: inline-block;
              margin-top: 6px;
              font-size: 13px;
              color: #0099ff;
              border-bottom: 1px solid #0099ff;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .amap-logo,
  .amap-copyright {
    display: none !important;
  }

  .amap-simple-marker-position-point {
    display: none !important;
  }
}
#riskAnalysis.risk-full {
  min-height: 860px;
  .amap-info-close {
    color: #fff;
  }
  .amap-info-content {
    background: #313c46;
    border: none;
  }
  #colorRange {
    left: 0px;
    .a,
    .b {
      color: #fff;
    }
  }
  #detailBox {
    top: 74px;
  }
  .amap-info {
    .amap-info-content {
      .map-con {
        > div {
          color: #999;
          &:first-child {
            color: #fff;
          }

          &:last-child {
            span:first-child {
              color: #fff;
            }
          }
        }
      }
    }
  }
  #colorRange {
    .el-slider__button {
      span {
        color: #fff;
      }
    }
  }
}
</style>

