<template>
  <div class="echarts">
    <div id="main" style="width: 200px;height:200px;"></div>
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
import chengdu from "../mapJson/chengdu.json";
echarts.registerMap("chengdu", chengdu);
export default {
  data() {
    return {
      chartData: {
        title: ["好", "很好", "中等", "一般", "整改"],
        amount: [5, 20, 36, 10, 10]
      }
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      require("echarts-wordcloud");
      let maxValue = 100;
      let minValue = 0;
      let totalNum = 20000;
      // 基于准备好的dom，初始化 echarts 实例并绘制图表。
      // var echarts = require('echarts')
      var _self = this;

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"));
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
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true }, areaColor: "#b5d5ff" }
            },
            data: [
              { name: "北京", value: Math.round(Math.random() * 1000) },
              { name: "天津", value: Math.round(Math.random() * 1000) },
              { name: "上海", value: Math.round(Math.random() * 1000) },
              { name: "重庆", value: Math.round(Math.random() * 1000) },
              { name: "河北", value: Math.round(Math.random() * 1000) },
              { name: "河南", value: Math.round(Math.random() * 1000) },
              { name: "云南", value: Math.round(Math.random() * 1000) },
              { name: "辽宁", value: Math.round(Math.random() * 1000) },
              { name: "黑龙江", value: Math.round(Math.random() * 1000) },
              { name: "湖南", value: Math.round(Math.random() * 1000) },
              { name: "安徽", value: Math.round(Math.random() * 1000) },
              { name: "山东", value: Math.round(Math.random() * 1000) },
              { name: "新疆", value: Math.round(Math.random() * 1000) },
              { name: "江苏", value: Math.round(Math.random() * 1000) },
              { name: "浙江", value: Math.round(Math.random() * 1000) },
              { name: "江西", value: Math.round(Math.random() * 1000) },
              { name: "湖北", value: Math.round(Math.random() * 1000) },
              { name: "广西", value: Math.round(Math.random() * 1000) },
              { name: "甘肃", value: Math.round(Math.random() * 1000) },
              { name: "山西", value: Math.round(Math.random() * 1000) },
              { name: "内蒙古", value: Math.round(Math.random() * 1000) },
              { name: "陕西", value: Math.round(Math.random() * 1000) },
              { name: "吉林", value: Math.round(Math.random() * 1000) },
              { name: "福建", value: Math.round(Math.random() * 1000) },
              { name: "贵州", value: Math.round(Math.random() * 1000) },
              { name: "广东", value: Math.round(Math.random() * 1000) },
              { name: "青海", value: Math.round(Math.random() * 1000) },
              { name: "西藏", value: Math.round(Math.random() * 1000) },
              { name: "四川", value: Math.round(Math.random() * 1000) },
              { name: "宁夏", value: Math.round(Math.random() * 1000) },
              { name: "海南", value: Math.round(Math.random() * 1000) },
              { name: "台湾", value: Math.round(Math.random() * 1000) },
              { name: "香港", value: Math.round(Math.random() * 1000) },
              { name: "澳门", value: Math.round(Math.random() * 1000) }
            ]
          }
        ]
      };
      // 词
      let options = {
        title: {
          text: "违规商家类型对比",
          left: 20,
          top: 20,
          textStyle: {
            color: "#eee"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{b} <br/> {c} ({d}%)",
          //				        backgroundColor: 'none',
          position: ["50%", "50%"],
          extraCssText: "transform:translate(-50%,-50%)"
        },

        visualMap: {
          show: false,
          min: 20,
          max: 1000,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["35%", "50%"],
            center: ["50%", "50%"],
            data: [
              { value: 200, name: "许可证未公示" },
              { value: 310, name: "其他" }
            ].sort(function(a, b) {
              return a.value - b.value;
            }),
            //				            roseType: 'true',
            selectedOffset: 2,
            label: {
              normal: {
                textStyle: {
                  color: "#999"
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "#999"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: "#c23531"
                //				                    shadowBlur: 200,
                //				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      let options = {
        tooltip: {},
        series: [
          {
            type: "wordCloud",
            //	                    gridSize: 2,
            sizeRange: [12, 50],
            rotationRange: [0, 0],
            shape: "pentagon",
            width: 600,
            height: 400,
            drawOutOfBound: true,
            textStyle: {
              normal: {
                color: function() {
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160)
                    ].join(",") +
                    ")"
                  );
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            data: [
              {
                name: "Sam S Club",
                value: 10000,
                textStyle: {
                  normal: {
                    color: "black"
                  },
                  emphasis: {
                    color: "red"
                  }
                }
              },
              {
                name: "Macys",
                value: 6181
              },
              {
                name: "Amy Schumer",
                value: 4386
              },
              {
                name: "Jurassic World",
                value: 4055
              },
              {
                name: "Charter Communications",
                value: 2467
              },
              {
                name: "Chick Fil A",
                value: 2244
              },
              {
                name: "Planet Fitness",
                value: 1898
              },
              {
                name: "Pitch Perfect",
                value: 1484
              },
              {
                name: "Express",
                value: 1112
              },
              {
                name: "Home",
                value: 965
              },
              {
                name: "Johnny Depp",
                value: 847
              },
              {
                name: "Lena Dunham",
                value: 582
              },
              {
                name: "Lewis Hamilton",
                value: 555
              },
              {
                name: "KXAN",
                value: 550
              },
              {
                name: "Mary Ellen Mark",
                value: 462
              },
              {
                name: "Farrah Abraham",
                value: 366
              },
              {
                name: "Rita Ora",
                value: 360
              },
              {
                name: "Serena Williams",
                value: 282
              },
              {
                name: "NCAA baseball tournament",
                value: 273
              },
              {
                name: "Point Break",
                value: 265
              }
            ]
          }
        ]
      };

      let graph = {
        nodes: [
          {
            name: "node1"
          },
          {
            name: "node2"
          },
          {
            name: "node3"
          },
          {
            name: "node4"
          },
          {
            name: "node5"
          },
          {
            name: "node6"
          }
        ],
        links: [
          {
            source: "node1",
            target: "node2",
            value: "",
            lineStyle: {},
            label: {},
            emphasis: {},
            symbol: "", // 线两端标记
            symbolSize: 10
          },
          {
            source: "node1",
            target: "node3"
          },
          {
            source: "node1",
            target: "node4"
          },
          {
            source: "node1",
            target: "node5"
          },
          {
            source: "node1",
            target: "node6"
          }
        ]
      };

      let options1 = {
        title: {
          text: "graph",
          subtext: "Default layout",
          top: "bottom",
          left: "right"
        },
        // tooltip: {},
        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            name: "Les",
            type: "graph",
            layout: "force",
            data: graph.nodes,
            links: graph.links,
            roam: true,
            focusNodeAdjacency: true,
            symbolSize: 14,
            itemStyle: {
              normal: {
                color: "#999",
                borderColor: "#fff",
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.3)"
              },
              emphasis: {
                color: "#999",
                borderColor: "#fff",
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.3)"
              }
            },
            force: {
              repulsion: 300,
              gravity: 0.8,
              edgeLength: [10, 50],
              layoutAnimation: true //迭代动画
            },
            label: {
              position: "right",
              formatter: "{b}"
            },
            lineStyle: {
              color: "#ccc",
              curveness: 0.3
            },
            emphasis: {
              lineStyle: {
                width: 1
              }
            }
          }
        ]
      };
      // 绘制图表
      myChart.setOption(options1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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