<template>
  <div>
    <!-- <div @click="login">登录</div>
    <div @click="getUser">获取用户</div>-->
    <!-- <div @click="getApi">获取用户</div> -->
    <!-- <div class="maptalks" id="maptalks"></div> -->
    <!-- <div class="content" ref="infoWinfowRefs">
      <div class="pop_title">InfoWindow</div>
      <div class="pop_time">{{new Date().toLocaleTimeString()}}</div>
      <div class="pop_dept">{{infoWindowData.coordinates.x}}</div>
      <div class="pop_dept">{{infoWindowData.coordinates.y}}</div>
      <div class="arrow"></div>
    </div>-->
    <router-view></router-view>
    <draggable v-model="myArrays" group="people" @start="drag=true" @end="onEnd">
      <div v-for="element in myArrays" :key="element.id">{{element.name}}</div>
    </draggable>
    <el-button @click="openFile" id="anchor2">openfile</el-button>
    <div class="time-box">
      <my-scroll
        class="homeScroll"
        ref="scrollRef"
        :probeType="probeType"
        :refreshDelay="refreshDelay"
        :listen-scroll="listenScroll"
        @scroll="scroll"
      >
        <div>
          <p>a1</p>
          <p>a2</p>
          <p>a3</p>
          <p>a4</p>
          <p>a5</p>
          <p>a6</p>
          <p>a7</p>
          <p>a8</p>
          <p>a9</p>
          <p>a10</p>
          <p>a11</p>
          <p>a12</p>
          <p>a13</p>
          <p>a14</p>
          <p>a15</p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <!-- <p></p> -->
        </div>
      </my-scroll>
      <div class="line">----</div>
    </div>
    <div class="getIndex">
      <!-- <el-button @click="getLocal('local')">home</el-button> -->
      <div class="moreTxt">
        <el-tooltip class="item" effect="dark" content="Toplist" placement="top-start">
          <div class="moreTxt">a</div>
        </el-tooltip>
        <span>234</span>
      </div>
      <div
        class="moreTxt"
        style="width:50px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
      >wenzi</div>
      <el-button @click="addLocalStorage"></el-button>
      <chi :bbb="keyObj" :aaa="showA"/>
      <svg ref="baseBarChart" class="base-bar-chart"></svg>
      <!-- <div ref="inHtml"></div>
      <div v-html="htmls"></div>-->
    </div>
    <el-pagination :page-size="20" :pager-count="11" layout="prev, pager, next" :total="1000"></el-pagination>
    <!-- <el-input @change="keyupFun" v-model="keyWords" size="small" :debounce="300"></el-input> -->
    <!-- <input type="text" v-model="keyWords" id="keyWord"> -->
    <template>
      <el-table :data="tableData3" height="250" border style="width: 100%">
        <el-table-column label="简介">
          <el-table-column
            prop="date"
            label="日期"
            align="center"
            label-class-name="labelName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="name" label="姓名" align="center" :show-overflow-tooltip="true"></el-table-column>
        </el-table-column>

        <el-table-column prop="address" label="地址" align="center" :show-overflow-tooltip="true"></el-table-column>
        <div slot="append"></div>
      </el-table>

      <el-cascader
        expand-trigger="hover"
        :options="options"
        v-model="selectedOptions2"
        change-on-select
        @change="handleChange"
      ></el-cascader>
    </template>
    <a href="#" id="links" target="_blank" style="display:none;">a</a>
    <span @click="goPages" :class="flag?'normal':'notallowed'">links</span>
    <router-link to="/routers/5">routers</router-link>
    <p >anchor2</p>
    <!-- <router-link to="/home/warning">warning</router-link> -->
  </div>
</template>

<script>
import draggable from "vuedraggable";
import riverData from "@/assets/riverData/data.js";
import * as maptalks from "maptalks/dist/maptalks";
import * as maptalksE3 from "maptalks.e3/dist/maptalks.e3";
import * as d3 from "d3";
import axios from "axios";
import { mapMutations, mapGetters } from "vuex";
import { setStorage } from "@/utils";
import { myDOM, myArray, myTime, throttles } from "@/assets/js/myUtils.js";
import chi from "@/components/chi.vue";
import $ from "jquery";
import MyScroll from "@/components/MyScroll.vue";
export default {
  name: "",
  components: {
    chi,
    MyScroll,
    draggable
  },
  data() {
    return {
      myArrays: [
        {
          id: "1",
          name: " list1"
        },
        {
          id: "2",
          name: " list2"
        },
        {
          id: "3",
          name: " list3"
        },
        {
          id: "4",
          name: " list4"
        }
      ],
      drag: false,
      disabled: "disabled",
      flag: false,
      showA: false,
      lista: [
        {
          a: "1",
          b: "2"
        }
      ],
      listb: [
        {
          c: "1",
          d: "2"
        }
      ],
      listc: [
        {
          e: "1",
          f: "2"
        }
      ],
      htmls: "",
      htmlsss: "<yyyy/MM/dd HH:mm:ss>aaa"
        .replace(/</g, "&lt")
        .replace(/>/g, "&gt"),
      msg: "",
      allRiskTypes: ["血腥味", "腥味", "有异物", "配送不当", "其他"],
      mapGis: {},
      maptalks: "",
      infoWindowData: {
        coordinates: {
          x: "",
          y: ""
        }
      },
      mapCenter: [104.06868, 30.56122],
      colors: {
        hc: `rgba(25,23,43, 1)`,
        hc_s: `rgba(25,23,43, 1)`,
        ns: `rgba(154,97,74, 1)`,
        ns_s: `rgba(154,97,74, 1)`,
        zl: `rgba(67,226,100, 1)`,
        zl_s: `rgba(67,226,100, 1)`
      },
      tableData3: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      options: [
        {
          label: "a",
          value: "a",
          children: [
            {
              label: "b",
              value: "b"
            },
            {
              label: "c",
              value: "c"
            }
          ]
        }
      ],
      selectedOptions2: [],
      keyupClick: () => {},
      keyWords: "abc",
      keyObj: {
        a: [],
        b: [],
        c: []
      },
      keyArr: [],
      refreshDelay: 100,
      probeType: 3,
      listenScroll: true
    };
  },
  created() {
    // this.probeType = 3;
    // this.listenScroll = true
    // this.keyupClick = throttles(this.keyupFun);
    // this.getApi()
    // console.log(riverData);
    // let url = "https://www.cnblogs.com/ldyblogs/p/ajax.html";
    let url = "http://www.baidua.com";
    let id = "linkId";
    // let newWin = window.open();

    $.ajax({
      type: "GET",
      cache: false,
      async: false, //使用同步的方式,true为异步方式
      dataType: "jsonp",
      url: url,
      // data: "",
      complete: res => {
        console.log(res);
        if (res.status == 200) {
          // var tempwindow = window.open("_blank");
          // newWin.location.href = url;
          // $("#links").attr("href", url);
          this.flag = true;
          document.getElementById("links").setAttribute("href", url);
          // document.getElementById("links").click();
          // var a = document.createElement("a");
          // a.setAttribute("href", url);
          // a.setAttribute("target", "_blank");
          // a.setAttribute("id", id);
          // // 防止反复添加
          // if (!document.getElementById(id)) {
          //   document.body.appendChild(a);
          // }
          // a.click();
        } else {
          this.flag = false;
        }
      }
    });
  },
  computed: {
    ...mapGetters(["loginUser"])
  },
  methods: {
    ...mapMutations(["SET_USER"]),
    onEnd() {
      console.log(this.myArrays);
      this.drag = false;
    },
    openFile() {
      axios.get("http://localhost:8080/apis/123").then(function(res) {
        console.log(res);
      });
    },
    scroll(pos) {
      console.log(pos.y);
      let line = parseInt(Math.abs(pos.y / 25));
      let position = parseInt(Math.abs(pos.y % 25));
      console.log(line);
      // console.log(position)
    },
    isEllipsis(className) {
      // 内部js实现
      this.$nextTick(() => {
        let dom;
        dom = document.getElementsByClassName(className)[0];
        var checkDom = dom.cloneNode(),
          parent,
          flag;
        checkDom.style.width = dom.offsetWidth + "px";
        checkDom.style.height = dom.offsetHeight + "px";
        checkDom.style.overflow = "auto";
        checkDom.style.position = "absolute";
        checkDom.style.zIndex = -1;
        checkDom.style.opacity = 0;
        checkDom.style.whiteSpace = "nowrap";
        checkDom.innerHTML = dom.innerHTML;

        parent = dom.parentNode;
        parent.appendChild(checkDom);
        flag = checkDom.scrollWidth > checkDom.offsetWidth;
        parent.removeChild(checkDom);
        return flag;
      });
      // console.log(dom);
    },
    getHome() {
      axios.get("http://localhost:8080/apis/123").then(function(res) {
        console.log(res);
      });
      axios.get("http://localhost:8080/apis/234").then(function(res) {
        console.log(res);
      });
    },
    goPages() {
      if (this.flag) {
        document.getElementById("links").click();
      } else {
        this.$message({
          message: "error",
          type: "warning"
        });
      }
    },
    login() {
      this.SET_USER({
        loginUser: {
          userName: "xg",
          userPwd: "123456"
        }
      });
      let loginUser = {
        userName: "xg",
        userPwd: "123456"
      };
      // console.log(loginUser instanceof Object)
      setStorage(loginUser, loginUser);
    },
    getUser() {
      console.log(this.loginUser.userName);
    },
    getApi() {
      axios.get("http://localhost:8080/apis/123").then(function(res) {
        console.log(res);
      });
    },
    initMap() {
      let _self = this;
      _self.mapGis.riverLayer = new maptalks.VectorLayer("vector", [], {
        zIndex: 3,
        enableAltitude: true, // enable altitude
        altitudeProperty: "altitude",
        drawAltitude: {
          polygonFill: function() {
            console.log(1);
          },
          polygonOpacity: 0.3,
          lineWidth: 0
        }
      });
      _self.mapGis.e3OptionData = [];
      let ecOption = {
        series: [
          {
            type: "lines",
            polyline: true,
            data: [],
            lineStyle: {
              normal: {
                width: 0
              }
            },
            effect: {
              constantSpeed: 20,
              show: true,
              trailLength: 1,
              symbolSize: 1.5
            },
            zlevel: 1
          }
        ]
      };

      let infoWindow = {
        autoOpenOn: false,
        properties: {
          altitude: 150
        },
        // custom : true,
        dy: -10,
        dx: -10
      };

      _self.mapGis.e3Layer = new maptalksE3.E3Layer("e3", ecOption, {
        hideOnZooming: true,
        hideOnRotating: true,
        hideOnMoving: true
      });
      let base = new maptalks.TileLayer("base", {
        urlTemplate:
          "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c"],
        attribution: ""
      });
      _self.mapGis.maptalks = new maptalks.Map("maptalks", {
        center: _self.mapCenter,
        room: 7,
        layers: [
          _self.mapGis.e3Layer,
          _self.mapGis.riverLayer
          // _self.mapGis.e3Layer
        ],
        baseLayer: base
      });
      _self.mapGis.infoWindow = new maptalks.ui.InfoWindow(infoWindow);
      _self.mapGis.infoWindow.addTo(_self.mapGis.maptalks);
      // _self.mapGis.maptalks.on('click', (event) => {
      // 	if (_self.mapGis.infoWindow.isVisible) {
      // 		_self.mapGis.infoWindow.hide()
      // 	}
      // })

      _self.addFeatures();
    },
    addFeatures() {
      let _self = this;
      _self.mapGis.rivers = {};
      _.each(riverData, item => {
        let oneFeature = new maptalks.Polygon(item.coo, {
          symbol: {
            lineColor: "#ccc",
            lineWidth: 2,
            lineOpacity: 0,
            polygonFill: "#666",
            polygonOpacity: 1,
            opacity: 1
          },
          properties: {
            altitude: 0,
            // altitude : 150,
            data: item
          }
        });
        oneFeature.on("click", event => {
          // console.log(evt)
          _self.clickFeatureStatus(event.target);
        });
        oneFeature.on("mouseover", event => {
          // console.log(_self.mapGis.rivers)
          _self.moveFeatureStatus(event.target);
        });
        oneFeature.animate(
          {
            symbol: {
              polygonOpacity: 0.5,
              lineOpacity: 1
            }
          },
          {
            duration: 5000,
            repeat: true,
            easing: "upAndDown"
            // startTime:index*3
          },
          function(frame) {}
        );
        oneFeature.on("mouseout", event => {
          _self.outFeatureStatus(event.target);
        });
        _self.mapGis.rivers[item.id] = oneFeature;
      });
      // let e3Options = _self.mapGis.e3Layer.getEChartsOption();
      // e3Options.series[0].data = _.map(riverData, (item) => {
      // 	return {
      // 		'coords': item.coo[0],
      // 		'lineStyle': {
      // 			'normal': {
      // 				'color': '#333'
      // 			}
      // 		}
      // 	}
      // })
      // _self.mapGis.e3Layer.setEChartsOption(e3Options);
      // console.log(_self.mapGis.rivers);
      // 添加
      _self.mapGis.riverLayer.addGeometry(_.map(_self.mapGis.rivers), item => {
        return item;
      });
    },
    clickFeatureStatus(feature) {
      let coords = [feature._coordinates[0].x, feature._coordinates[0].y];
      this.changeView(coords);
    },
    moveFeatureStatus(feature) {
      // feature.pause();
      let _self = this;
      console.log(feature);
      this.infoWindowData.coordinates = {
        x: feature._coordinates[0].x,
        y: feature._coordinates[0].y
      };
      setTimeout(() => {
        this.mapGis.infoWindow.setContent(
          '<div id="infoWindow" ref="infoWinfowRefs" style="background:#000;">' +
            this.$refs.infoWinfowRefs.innerHTML +
            "</div>"
        );
        this.mapGis.infoWindow.show();
      });
      _.each(_self.mapGis.rivers),
        (item, key) => {
          item.updateSymbol({
            polygonFill: "#666"
          });
        };
      feature.updateSymbol({
        polygonFill: "rgb(216,115,149)"
      });
    },
    outFeatureStatus(feature) {
      // feature.play();
      // let _self = this;
      this.mapGis.infoWindow.hide();
      feature.updateSymbol({
        polygonFill: "#666"
      });
    },
    addEvent() {
      console.log("xg-dev");
      this.mapGis.infoWindow.hide();
    },
    changeView(coords) {
      _self.mapGis.maptalks.animateTo(
        {
          center: coords,
          zoom: 13,
          pitch: 0,
          bearing: 20
        },
        {
          duration: 5000
        }
      );
    },
    formatContent(content) {
      let res = content;
      this.allRiskTypes.forEach(item => {
        let reg = "";
        res = res.replace(
          eval("/" + item + "/g"),
          "<label style='color:red;'>" + item + "</label>"
        );
      });

      let outa = [];
      for (let i = 0; i < 50; i++) {
        let str = "";
        for (let j = 0; j < i; j++) {
          str += "b" + i;
        }
        outa.push("aaa" + str);
      }
      setTimeout(() => {
        console.log(
          outa.sort((a, b) => {
            return a.length - b.length;
          })
        );
      }, 3000);
      return res;
    },
    addLocalStorage() {
      window.localStorage.setItem(
        "local",
        JSON.stringify({
          data: "aaa",
          time: new Date().getTime()
        })
      );
    },
    getLocal(key) {
      let exp = 10000;
      let sData = JSON.parse(window.localStorage.getItem(key));
      console.log(sData);
      if (sData != null && sData != "" && sData != "null") {
        let isTimend = new Date().getTime() - sData.time > exp;
        if (isTimend) {
          window.localStorage.removeItem(key);
          console.log("storage过期");
        } else {
          console.log(sData.data);
        }
      }
    },
    keyupFun() {
      console.log(this.keyWords);
    },
    getMax() {
      // 1
      let arr = [
        {
          name: "a",
          value: 2
        },
        {
          name: "b",
          value: 3
        },
        {
          name: "c",
          value: 1
        }
      ];
      let sorta = [];
      for (let i = 0; i < arr.length; i++) {
        sorta.push(arr[i].value);
      }
      // let max = Math.max.apply(null, sorta)
      // console.log(max)

      // 2
      let max = Math.max.call(null, 2, 8, 2, 3);
      console.log(max);

      // // 3
      // let max = sorta.sort().reverse()[0];
      // console.log(max)

      // // 4
      // let arr1 = sorta.sort((a,b)=>{
      //   return b-a
      // })
      // console.log(arr1[0])
    },
    initD3Bar() {
      var chartSvg = d3.select(this.$refs.baseBarChart);
      // 设置图表数据，图表宽度和矩形宽度
      var chartData = [
        {
          name: "a",
          value: 10
        },
        {
          name: "b",
          value: 10
        }
      ];
      chartData = [10, 20, 15];
      var width = 200;
      var barHeight = 20;
      // 画布
      var chartSvg = d3
        .select(this.$refs.baseBarChart)
        .attr("width", width)
        .attr("height", barHeight * chartData.length);

      // x轴比例尺
      var xScale = d3
        .scaleLinear()
        .domain([0, d3.max(chartData)])
        .range([0, width]);

      // 矩形和label文字组合的容
      var g = chartSvg
        .selectAll("g")
        .data(chartData)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          return "translate(0," + i * barHeight + ")";
        });

      // 添加矩形
      g.append("rect")
        .attr("width", xScale)
        .attr("height", barHeight - 10)
        .attr("fill", "#999");
      // 添加label文字
      g.append("text")
        .attr("x", function(d) {
          return xScale(d) + 3;
        })
        .attr("y", barHeight - 10)
        .attr("dy", "0.3em")
        .attr("fill", "#999")
        .style("font-size", "12px")
        .text(function(d) {
          return d;
        });
    },
    handleChange(e) {
      console.log(e);
      console.log(this.selectedOptions2);
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    console.log("beforeenter");
    next();
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    console.log("update");
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log(this);
    next();
  },
  mounted() {
    this.showA = true;
    // let domArr = document.getElementsByClassName("moreTxt");
    // for (let i = 0; i < domArr.length; i++) {
    //   if (this.isEllipsis(domArr[i])) {
    //     domArr[i].innerHTML =
    //       '<el-tooltip class="item" effect="dark" content="Toplist" placement="top-start"><span>' +
    //       domArr[i].innerHTML +
    //       "</span></el-tooltip>";
    //   }
    // }

    // window.open(url);
    // document.getElementById("keyWord").onkeyup = throttles(this.keyupFun);
    // this.initMap();
    // let res = "身体不适123";
    // let item = "身体不适";
    // this.addLocalStorage();
    // console.log(res.replace(eval("/" + item + "/g"), "xxxx"));
    // // this.htmls = this.$refs.inHtml.innerHTML.toString().replace(" ",'')
    // this.htmls =
    //   "<div><label>aaa<label>bbb<label>ccc</label></label></label></div>";
    // this.keyArr = ["a", "b"];
    // this.keyObj.a = ["a", "b"];
    // this.getMax();
    // this.initD3Bar();
    // this.getHome();
  }
};
</script>

<style lang="scss" scoped>
.maptalks {
  width: 500px;
  height: 500px;
}
.content {
  display: none;
}
.time-box {
  width: 200px;
  height: 125px;
  text-align: center;
  position: relative;
  .homeScroll {
    position: relative;
    width: 200px;
    height: 100%;
    overflow: hidden;
    div {
      p {
        margin: 0;
        padding: 0;
        line-height: 25px;
        height: 25px;
      }
    }
  }
  .line {
    position: absolute;
    right: 0;
    top: 13px;
    transform: translateY(-50%);
  }
}
#infoWindow {
  color: #fff;
  width: 190px;
  height: 128px;
  background: #051127;
  border: 1px solid #0c2c45;
  .pop_title {
    float: left;
    padding-left: 10px;
    width: 180px;
    height: 36px;
    line-height: 36px;
    font-weight: bold;
    font-size: 16px;
  }
  .pop_time {
    float: left;
    width: 183px;
    height: 30px;
    margin: 0 10px;
    line-height: 36px;
  }
  .pop_dept {
    float: left;
    padding: 5px;
    max-width: 65px;
    line-height: 15px;
    text-align: center;
    border: 1px solid #192b41;
    margin: 0 10px;
  }
  .pop_arrow {
    float: left;
    width: 15px;
    height: 24px;
    line-height: 24px;
  }
  .arrow {
    display: block;
    width: 17px;
    height: 10px;
    position: absolute;
    left: 50%;
    margin-left: -5px;
    bottom: -10px;
  }
  .base-bar-chart {
    width: 300px;
    visibility: hidden;
    visibility: visible;
    height: 300px;
  }
}
.el-table td,
.el-table th {
  width: 33%;
}
.normal {
  color: #111;
}
.notallowed {
  color: #999;
  cursor: not-allowed !important;
}
.moreTxt {
  width: 50px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
