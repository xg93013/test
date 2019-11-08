<template>
  <div id="tips" v-show="visible">
    <div class="left">
      <svg-icon iconClass="error" class="tips-icon"></svg-icon>
    </div>
    <div class="right">
      <p class="tit">填写说明</p>
      <slot></slot>
    </div>
    <div class="close">
      <svg-icon iconClass="close" @click.native="visible=false"></svg-icon>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  props: {},
  methods: {
    show() {
      this.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
#tips {
  overflow: hidden;
  margin: 20px;
  padding: 10px 0 20px;
  width: calc(100%-40px);
  background: #ffeee6;
  border: 1px solid rgb(253, 230, 219);
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
  .left,
  .right {
    float: left;
  }
  .left {
    width: 50px;
    text-align: center;
    color: #ff992f;
    margin-top: 10px;
    .tips-icon {
      font-size: 30px;
    }
  }
  .right {
    width: calc(100% - 100px);
    color: #999;
    .tit {
      font-size: 16px;
      margin: 10px 0;
      color: #666;
    }
  }
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }
}
</style>