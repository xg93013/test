<template>
  <div class="commonWidth step-box">
    <div class="center-page">
      <span @click="prevPage">
        <svg-icon iconClass="back" v-show="index!=0"></svg-icon>上一步
      </span>
      <span @click="nextPage" v-show="index!=5">
        下一步
        <svg-icon iconClass="back"></svg-icon>
      </span>
    </div>
  </div>
</template>
<script>
import { getStorage } from "@/utils/index.js";
export default {
  data() {
    return {
      index: 0
    };
  },
  methods: {
    prevPage() {
      this.$emit("prevPage");
    },
    nextPage() {
      this.$emit("nextPage");
    }
  },
  created() {},
  mounted() {
    this.index = getStorage("riskNavIndex")[0];
  }
};
</script>
<style lang="scss" scope>
.step-box {
  text-align: center;
  margin: 0 auto;
  .center-page {
    display: inline;
    span {
      display: inline-block;
      padding: 10px 40px;
    }
  }
}
</style>