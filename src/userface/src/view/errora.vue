<template>
  <div id="error">
    <img src="../images/image-404.png" alt />
    <p class="a">很遗憾，您访问的页面找不到了...</p>
    <p class="b">
      建议：1.检查您的网址拼写是否正确；
      <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.检查您是否使用了错误的网址链接。
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 6
    };
  },
  methods: {
    goPage() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
#error {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  height: 160px;
  padding-left: 350px;
  > img {
    position: absolute;
    left: 0;
    height: 140px;
    top: 10px;
  }
  .a {
    color: #1e9cfa;
    font-size: 18px;
    margin-top: 10px;
    font-weight: bold;
  }
  .b {
    color: #666;
    margin-top: 10px;
    line-height: 24px;
  }
  .c {
    color: #333;
    width: 306px;
    > span {
      color: #1e9cfa;
    }
    margin-top: 20px;
  }
}
</style>