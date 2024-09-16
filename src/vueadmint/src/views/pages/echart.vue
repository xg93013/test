<template>
  <div class="echarts">
    <el-button @click="showE">button</el-button>
    <!-- <div id="main" style="width: 400px;height:300px;"></div> -->
    <!-- <el-dialog :visible.sync="visible" width="400" custom-class="comModal"> -->
      <div id="main" style="width: 600px;height:400px;"></div>
    <!-- </el-dialog> -->
    <!--<div id="out-box">
			<div class="top">
				<div class="total-num">
					<div class="label">总监测商家</div>
					<div class="nums">
						<span>2</span>
						<span>2</span>
						<span>2</span>
						<span>2</span>
					</div>
				</div>
				<div class="total-num"></div>
				<div class="total-num"></div>
				<div class="total-num"></div>
			</div>
			<div class="bot">
				<div class="left">
					<div class="chart-one">one</div>
					<div class="chart-two">two</div>
				</div>
				<div class="middle">
					<div class="chart-map">middle</div>
				</div>
				<div class="right">
					<div class="chart-three">three</div>
					<div class="chart-four">four</div>
				</div>
			</div>
    </div>-->
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts-gl";
// import chengdu from "../mapJson/chengdu.json";
import chengdu from "../mapJson/chengduArea.json";
import "echarts-wordcloud";
echarts.registerMap("chengdu", chengdu);
export default {
  data() {
    return {
      chartData: {
        title: ["好", "很好", "中等", "一般", "整改"],
        amount: [5, 20, 36, 10, 10],
        radiusA: [],
        myChart: ""
      },
      visible: false
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    showE() {
      this.visible = !this.visible;
      if (this.visible) {
        this.$nextTick(() => {
          this.initMap();
        });
      }
    },
    initMap() {
      // require("echarts-wordcloud");
      let maxValue = 100;
      let minValue = 0;
      let totalNum = 20000;
      // 基于准备好的dom，初始化 echarts 实例并绘制图表。
      //				var echarts = require('echarts')
      var _self = this;
      this.radiusA = ["40%", "50%"];
      window.addEventListener("resize", () => {
        if (window.innerWidth < 1400) {
          this.radiusA = ["20%", "30%"];
        }
      });
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById("main"));
      let options = {
        backgroundColor: "#1F2F3C",
        title: {
          text: "区域风险地图",
          top: 10,
          left: 10,
          textStyle: {
            color: "#fff",
            fontSize: 16,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params, ticket, callback) {
            //x轴名称
            var name = params.name;
            //图表title名称
            var seriesName = params.seriesName;
            //值
            var value = params.value;
            if (isNaN(value)) {
              return name + "<br />暂无";
            } else {
              return name + "<br />" + seriesName + ":" + value;
            }
            // var valueFliter = formatter(value)
          }
        },
        visualMap: {
          type: "continuous",
          min: minValue,
          max: maxValue,
          right: "10",
          bottom: "2",
          color: ["#039bd8", "#a5def6"],
          text: ["高", "低"],
          calculable: true,
          itemWidth: 12,
          itemHeight: 70,
          textGap: 5,
          textStyle: {
            color: "#ffffff"
          }
        },
        series: [
          {
            name: "风险指数",
            type: "map",
            mapType: "chengdu",
            roam: true,
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true }, areaColor: "#b5d5ff" }
            },
            data: [
              //			                {name: '北京',value: Math.round(Math.random()*1000)},
              //			                {name: '天津',value: Math.round(Math.random()*1000)},
              //			                {name: '上海',value: Math.round(Math.random()*1000)},
              //			                {name: '重庆',value: Math.round(Math.random()*1000)},
              //			                {name: '河北',value: Math.round(Math.random()*1000)},
              //			                {name: '河南',value: Math.round(Math.random()*1000)},
              //			                {name: '云南',value: Math.round(Math.random()*1000)},
              //			                {name: '辽宁',value: Math.round(Math.random()*1000)},
              //			                {name: '黑龙江',value: Math.round(Math.random()*1000)},
              //			                {name: '湖南',value: Math.round(Math.random()*1000)},
              //			                {name: '安徽',value: Math.round(Math.random()*1000)},
              //			                {name: '山东',value: Math.round(Math.random()*1000)},
              //			                {name: '新疆',value: Math.round(Math.random()*1000)},
              //			                {name: '江苏',value: Math.round(Math.random()*1000)},
              //			                {name: '浙江',value: Math.round(Math.random()*1000)},
              //			                {name: '江西',value: Math.round(Math.random()*1000)},
              //			                {name: '湖北',value: Math.round(Math.random()*1000)},
              //			                {name: '广西',value: Math.round(Math.random()*1000)},
              //			                {name: '甘肃',value: Math.round(Math.random()*1000)},
              //			                {name: '山西',value: Math.round(Math.random()*1000)},
              //			                {name: '内蒙古',value: Math.round(Math.random()*1000)},
              //			                {name: '陕西',value: Math.round(Math.random()*1000)},
              //			                {name: '吉林',value: Math.round(Math.random()*1000)},
              //			                {name: '福建',value: Math.round(Math.random()*1000)},
              //			                {name: '贵州',value: Math.round(Math.random()*1000)},
              //			                {name: '广东',value: Math.round(Math.random()*1000)},
              //			                {name: '青海',value: Math.round(Math.random()*1000)},
              //			                {name: '西藏',value: Math.round(Math.random()*1000)},
              //			                {name: '四川',value: Math.round(Math.random()*1000)},
              //			                {name: '宁夏',value: Math.round(Math.random()*1000)},
              //			                {name: '海南',value: Math.round(Math.random()*1000)},
              //			                {name: '台湾',value: Math.round(Math.random()*1000)},
              //			                {name: '香港',value: Math.round(Math.random()*1000)},
              //			                {name: '澳门',value: Math.round(Math.random()*1000)}
            ]
          }
        ]
      };
      // options = {
      //   title: {
      //     text: "违规商家类型对比",
      //     left: 20,
      //     top: 20,
      //     textStyle: {
      //       color: "#eee"
      //     }
      //   },

      //   tooltip: {
      //     trigger: "item",
      //     formatter: "{b} <br/> {c} ({d}%)",
      //     //				        backgroundColor: 'none',
      //     position: ["50%", "50%"],
      //     extraCssText: "transform:translate(-50%,-50%)"
      //   },

      //   visualMap: {
      //     show: false,
      //     min: 20,
      //     max: 1000,
      //     inRange: {
      //       colorLightness: [0, 1]
      //     }
      //   },
      //   series: [
      //     {
      //       name: "na",
      //       type: "pie",
      //       radius: this.radiusA,
      //       center: ["50%", "50%"],
      //       data: [{ value: 200, name: "a" }, { value: 310, name: "b" }].sort(
      //         function(a, b) {
      //           return a.value - b.value;
      //         }
      //       ),
      //       //				            roseType: 'true',
      //       selectedOffset: 2,
      //       label: {
      //         normal: {
      //           textStyle: {
      //             color: "#999"
      //           }
      //         }
      //       },
      //       labelLine: {
      //         normal: {
      //           lineStyle: {
      //             color: "#999"
      //           },
      //           smooth: 0.2,
      //           length: 10,
      //           length2: 20
      //         }
      //       },
      //       itemStyle: {
      //         normal: {
      //           color: "#c23531"
      //           //				                    shadowBlur: 200,
      //           //				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
      //         }
      //       },

      //       animationType: "scale",
      //       animationEasing: "elasticOut",
      //       animationDelay: function(idx) {
      //         return Math.random() * 200;
      //       }
      //     }
      //   ]
      // };
      // options = {
      //   tooltip: {},
      //   series: [
      //     {
      //       type: "wordCloud",
      //       //	                    gridSize: 2,
      //       sizeRange: [12, 50],
      //       rotationRange: [0, 90],
      //       rotationStep: 90,
      //       shape: "pentagon",
      //       width: 600,
      //       height: 400,
      //       drawOutOfBound: true,
      //       textStyle: {
      //         normal: {
      //           color: function() {
      //             return (
      //               "rgb(" +
      //               [
      //                 Math.round(Math.random() * 160),
      //                 Math.round(Math.random() * 160),
      //                 Math.round(Math.random() * 160)
      //               ].join(",") +
      //               ")"
      //             );
      //           }
      //         },
      //         emphasis: {
      //           shadowBlur: 10,
      //           shadowColor: "#333"
      //         }
      //       },
      //       data: [
      //         {
      //           name: "Sam",
      //           value: 10000,
      //           textStyle: {
      //             normal: {
      //               color: "black"
      //             },
      //             emphasis: {
      //               color: "red"
      //             }
      //           }
      //         },
      //         {
      //           name: "Macys",
      //           value: 6181
      //         },
      //         {
      //           name: "Amy",
      //           value: 4386
      //         }
      //       ]
      //     }
      //   ]
      // };
      // 绘制图表
      
      var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
              '7a', '8a', '9a','10a','11a',
              '12p', '1p', '2p', '3p', '4p', '5p',
              '6p', '7p', '8p', '9p', '10p', '11p'];
      var days = ['Saturday', 'Friday', 'Thursday',
              'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

      var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];
      options = {
          tooltip: {},
          visualMap: {
              max: 20,
              inRange: {
                  color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
              }
          },
          xAxis3D: {
              type: 'category',
              data: hours
          },
          yAxis3D: {
              type: 'category',
              data: days
          },
          zAxis3D: {
              type: 'value'
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
          series: [{
              type: 'bar3D',
              data: data.map(function (item) {
                  return {
                      value: [item[1], item[0], item[2]],
                  }
              }),
              shading: 'lambert',

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
                          color: '#900'
                      }
                  },
                  itemStyle: {
                      color: '#900'
                  }
              }
          }]
      }
      this.myChart.setOption(options);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#out-box {
  width: 100%;
  height: 100%;
  position: relative;
  .top {
    display: flex;
    height: 200px;
    .total-num {
      flex: 1;
      overflow: hidden;
      .label {
        float: left;
      }
      .nums {
        float: left;
      }
    }
  }
  .bot {
    position: absolute;
    top: 200px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>