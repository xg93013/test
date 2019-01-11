<template>
  <div id="wordCloud" class="charts">
    <div class="charts-title">风险词云</div>
    <div id="wordClouds" ref="wordRefs">
      <span v-for="(item, index) in wordData" :key="index">
        <label :style="item.styleObject">{{ item.value }}</label>
      </span>
    </div>
    <div class="empty" v-show="wordData.length==0">暂无数据</div>
  </div>
</template>
<script>
import TagCould from "@/unit/word-cloud.js";
const wordColor = ["#D9534F", "#F4CB25", "#7D55CB", "#276AB0", "#40A42B"];
export default {
  data() {
    return {
      wordData: [],
      tagCloud: ""
    };
  },
  props: {
    wordCloud: {
      type: Array,
      default: []
    }
  },
  watch: {
    wordCloud(a) {
      this.getData(a);
    }
  },
  methods: {
    getData(data) {
      if (data.length > 0) {
        this.wordData = [];
        data.forEach(item => {
          let num = Math.floor(Math.random() * 2 + 1);
          let oneWord = {};
          oneWord.value = item.riskWord;
          oneWord.styleObject = {
            fontSize: 10 + (2 * item.level + 2) + "px",
            color: wordColor[item.level],
            transform: num === 1 ? "rotate(-90deg)" : "rotate(0)"
          };
          this.wordData.push(oneWord);
        });
        // for (let i = 0; i < 50; i++) {
        //   let riskNum = parseInt(Math.random() * 5, 10);
        //   let num = Math.floor(Math.random() * 2 + 1);
        //   let oneWord = {};
        //   oneWord.value = "风险词";
        //   oneWord.styleObject = {
        //     fontSize: 10 + (2 * riskNum + 2) + "px",
        //     color: wordColor[riskNum],
        //     // direction: num === 1 ? "horiontal" : "down",
        //     transform: num === 1 ? "rotate(-90deg)" : "rotate(0)"
        //   };
        //   this.wordData.push(oneWord);
        // }
        this.$nextTick(() => {
          this.tagCloud.start();
        });
      }
    },
    initWordCloud() {
      this.tagCloud = new TagCould("wordClouds", {
        mouseX: 8,
        mouseY: 8
      });
    }
  },
  created() {},
  mounted() {
    this.initWordCloud();
  }
};
</script>
<style lang="scss" scoped>
#wordCloud {
  overflow: hidden;
  position: relative;
  #wordClouds {
    position: relative;
    width: 110%;
    height: 100%;
    margin-left: -5%;
    margin-top: -10px;
    margin-bottom: 40px;
    overflow: hidden;
    span {
      position: absolute;
      top: 0px;
      left: 0px;
      font-family: "Microsoft YaHei";
      // color:#39A0F0;
      display: inline-block;
      font-weight: bold;
      font-size: 20px;
      text-decoration: none;
      padding: 3px 6px;
      label {
        cursor: pointer;
        transition: all 0.2s;
        display: inline-block;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
  }
}
</style>


