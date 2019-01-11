<template>
  <div id="page-container">
    <div class="total">共{{totalElements}}条</div>
    <div class="page-box">
      <div class="items">
        <i class="icons el-icon-caret-left" @click="goPrev"></i>
      </div>
      <div class="items nums">
        <el-input type="text" class="ins inputs" width="80" v-model="goPageNums"></el-input>
        <span class="ins">/</span>
        <span class="ins total">{{totalPage}}</span>
      </div>
      <div class="items">
        <i class="icons el-icon-caret-right" @click="goNext"></i>
      </div>
    </div>
    <el-button class="goPage" @click="goPage">跳转</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage: 1,
      goPageNums: 1
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
    },
    currentPage(page) {
      this.goPageNums = page;
    }
  },
  methods: {
    goPrev() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.$emit("changePage", this.currentPage);
      }
    },
    goNext() {
      if (this.currentPage < this.totalPage) {
        this.currentPage++;
        this.$emit("changePage", this.currentPage);
      }
    },
    goPage() {
      this.currentPage = this.goPageNums;
      this.$emit("changePage", this.currentPage);
    }
  }
};
</script>
<style lang="scss">
#page-container {
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
      .el-input {
        width: 60px;
        .el-input__inner {
          width: 60px;
          height: 30px;
          float: left;
          line-height: 30px;
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
    width: 70px;
    height: 30px;
    padding: 0;
    border: none;
    font-size: 12px;
    background: #2769b0;
    color: #fff;
    float: left;
  }
}
</style>


