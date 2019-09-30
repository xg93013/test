<template>
  <div id="tips" v-show="visible">
    <div class="left">
      <svg-icon iconClass="error" class="tips-icon"></svg-icon>
    </div>
    <div class="right">
      <p class="tit">填写说明</p>
      <p>{{contents}}</p>
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
  props: {
    contents: {
      type: String,
      default: ""
    }
  },
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
  .left,
  .right {
    float: left;
  }
  .left {
    width: 60px;
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
      font-size: 18px;
      margin: 10px 0;
      color: #666;
    }
  }
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
}
</style>