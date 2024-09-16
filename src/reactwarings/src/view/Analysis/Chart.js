import React from "react";
import echarts from "echarts";
import { throttle } from "../../unit/pub";

class Chart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sel: {
                乡村群宴: false,
                明厨亮灶: false,
                等级评定: false,
                网络餐饮: true,
                食材溯源: false,
                餐厨垃圾: true
            },
            num: 1
        }
    }

    getCharts(area) {
        // let { area } = this.state;
        let chart = echarts.init(document.getElementById("analysisChart"));
        window.addEventListener("resize", throttle(chart.resize));
        this.setOption(chart, area, ["netfood", "foodwaste"], {
            乡村群宴: false,
            明厨亮灶: false,
            等级评定: false,
            网络餐饮: true,
            食材溯源: false,
            餐厨垃圾: false
        });
        chart.on("legendselectchanged", e => {
            let num = 0,
                sel = e.selected;
            for (let i in sel) {
                if (sel[i]) {
                    num++
                }
            }
            this.setState({
                num,
                sel: e.selected
            })
            // e.selected.餐厨垃圾 = true
            let { 乡村群宴, 明厨亮灶, 等级评定, 网络餐饮, 食材溯源, 餐厨垃圾 } = e.selected;
            let arr = [];
            if (乡村群宴) {
                arr.push("banquet")
            }
            if (明厨亮灶) {
                arr.push("kitchen")
            }
            if (等级评定) {
                arr.push("rating")
            }
            if (网络餐饮) {
                arr.push("netfood")
            }
            if (食材溯源) {
                arr.push("foodtrace")
            }
            if (餐厨垃圾) {
                arr.push("foodwaste")
            }
            this.setOption(chart, area, arr, e.selected);
        })
    }

    setOption(chart, area, objs, selected) {
        let newObj = {};
        let totObj = [];
        objs.forEach(item => {
            newObj[item] = {};
            area[item].forEach((itema, index) => {
                let { area, count } = itema;
                newObj[item][area] = count;
                if (!totObj[index]) {
                    totObj[index] = {
                        area,
                        count
                    }
                } else {
                    totObj[index].count += count
                }

            })
        });
        for (let i = 0, n = totObj.length; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                let a = totObj[i],
                    b = totObj[j]
                if (a.count < b.count) {
                    totObj[i] = b;
                    totObj[j] = a;
                }
            }
        }
        let color = ["#7D55CB", "#EAD43D", "#40A42B", "#3384D5", "#276AB0", "#F2884F"];
        let data = ["网络餐饮", "餐厨垃圾", "明厨亮灶", "乡村群宴", "食材溯源", "等级评定"];
        let series = [],
            xData = [],
            yData = [[], [], [], [], [], []]
        // maxNum;
        totObj.forEach((item, num) => {
            let { area } = item
            xData.push(area);
            ["netfood", "foodwaste", "kitchen", "banquet", "foodtrace", "rating"].forEach((itema, index) => {
                // if (num === 0) {
                //     if (objs.includes(itema)) {
                //         maxNum = index
                //     }
                // }
                if (newObj[itema]) {
                    yData[index].push(newObj[itema][area])
                } else {
                    yData[index].push(0)
                }
            })
        })
        data.forEach((item, index) => {
            let obj = {
                name: item,
                type: "bar",
                stack: "a",
                barWidth: 26,
                data: yData[index]
            }
            // if (index === maxNum) {
            //     obj.itemStyle = {
            //         normal: {
            //             barBorderRadius: [13, 13, 0, 0],
            //         }
            //     }
            // }
            series.push(obj)
        })
        let option = {
            color,
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 20,
                right: 20,
                itemWidth: 16,
                itemHeight: 16,
                textStyle: {
                    fontSize: 14
                },
                data,
                selected: selected || {}
            },
            grid: {
                left: 60,
                top: 70,
                bottom: 60,
                right: 40
            },
            xAxis: {
                data: xData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#ccc"
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 15,
                        color: "#666"
                    },
                    rotate: 45
                }
            },
            yAxis: {
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: "#ccc"
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 16,
                        color: "#666"
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ccc',
                        type: "dashed",
                        width: 1,
                    }
                }
            },
            series
        }
        chart.setOption(option, true);
    }

    render() {
        let { num, sel } = this.state;
        return (
            <div className="right">
                <div className="a1" style={{ display: num > 1 || !sel.网络餐饮 ? "none" : "block" }}></div>
                <div className="a2"></div>
                <div className="a3"></div>
                <div className="a4"></div>
                <div className="a5"></div>
                <div className="a6"></div>
                <div style={{ width: "100%", height: "100%" }} id="analysisChart"></div>
            </div>
        )
    }
}

export default Chart