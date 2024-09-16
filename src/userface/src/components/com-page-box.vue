<template>
  <div id="page-container">
    <div class="total">共{{totalElements}}条</div>
    <div class="page-box">
      <div class="items">
        <i class="icons el-icon-caret-left" :class="{'icons-disable': prevDisable}" @click="goPrev"></i>
      </div>
      <div class="items nums">
        <el-input
          type="number"
          @keyup.enter.native="goPage"
          size="small"
          class="ins inputs"
          width="80"
          v-model="goPageNums"
        ></el-input>
        <span class="ins">/</span>
        <span class="ins total">{{totalPage}}</span>
      </div>
      <div class="items">
        <i
          class="icons el-icon-caret-right"
          :class="{'icons-disable': nextDisable}"
          @click="goNext"
        ></i>
      </div>
    </div>
    <el-button size="small" class="goPage" @click="goPage">跳转</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage: 1,
      goPageNums: 1,
      prevDisable: true,
      nextDisable: true
    };
  },
  props: {
    totalElements: {
      type: Number,
      default: 0
    },
    totalPage: {
      type: Number,
      default: 0
    },
    currentPageNum: {
      type: Number,
      default: 0
    }
  },
  watch: {
    currentPageNum(page) {
      this.currentPage = page;
      if (this.currentPage == 1) {
        this.prevDisable = true;
      }
    },
    currentPage(page) {
      this.goPageNums = page;
    },
    totalPage(a) {
      if (a > 1) {
        this.nextDisable = false;
      }
    }
  },
  methods: {
    goPrev() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.$emit("changePage", this.currentPage);
        if (this.totalPage > 1) {
          this.nextDisable = false;
        }
      }
      if (this.currentPage == 1) {
        this.prevDisable = true;
      }
    },
    goNext() {
      if (this.currentPage < this.totalPage) {
        this.currentPage++;
        this.$emit("changePage", this.currentPage);
        if (this.totalPage > 1) {
          this.prevDisable = false;
        }
      }
      if (this.currentPage == this.totalPage) {
        this.nextDisable = true;
      }
    },
    goPage() {
      if (this.goPageNums <= 1) {
        this.goPageNums = 1;
        this.prevDisable = true;
        if (this.totalPage > 1) {
          this.nextDisable = false;
        }
      } else if (this.goPageNums > 1 && this.goPageNums < this.totalPage) {
        this.prevDisable = false;
        this.nextDisable = false;
      } else if (this.goPageNums >= this.totalPage) {
        this.goPageNums = this.totalPage;
        this.nextDisable = true;
        if (this.totalPage > 1) {
          this.prevDisable = false;
        }
      }
      if (this.goPageNums === this.currentPage) {
        return false;
      }
      this.currentPage = this.goPageNums;
      this.$emit("changePage", this.currentPage);
    }
  },
  mounted() {
    if (this.totalPage > 1) {
      this.nextDisable = false;
    }
  }
};
</script>
<style lang="scss">
#riskAnalysis.risk-full {
  #page-container {
    .el-input__inner {
      background: #313c46;
      border: none;
    }
    .total {
      color: #fff;
    }
  }
}

#page-container {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
  display: inline-block;
  overflow: hidden;
  height: 30px;
  line-height: 30px;
  .total {
    float: left;
    font-size: 12px;
    color: #666;
  }
  .page-box {
    float: left;
    overflow: hidden;
    margin: 0 10px;
    .items {
      float: left;
      overflow: hidden;
      font-size: 12px;
      line-height: 30px;
      .icons {
        font-size: 20px;
        line-height: 30px;
        color: #2769b0;
        cursor: pointer;
      }
      .icons-disable {
        color: #ccc;
        cursor: not-allowed;
      }
      .el-input {
        width: 60px;
        .el-input__inner {
          position: relative;
          top: 2px;
          width: 60px;
          height: 24px;
          float: left;
          line-height: 24px;
        }
      }

      .ins {
        float: left;
        margin: 0 4px;
        font-size: 12px;
      }
    }
  }
  .goPage {
    // width: 70px;
    // height: 30px;
    position: relative;
    top: 2px;
    padding: 5px 14px;
    border: none;
    font-size: 12px;
    background: #2769b0;
    color: #fff;
    float: left;
  }
}
</style>


