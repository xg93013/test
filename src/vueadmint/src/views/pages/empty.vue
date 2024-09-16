<template>
  <div></div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      getRes: ""
    };
  },
  created() {
    axios.get("http://172.27.13.165:8080/apis/123").then(res => {
      // document.cookie = JSON.stringify(res);
      this.getRes = JSON.stringify(res);
      // window.onmessage = event => {
      //   console.log(event.origin);
      //   if (event.origin !== "https://localhost:3000") return;
      //   event.source.postMessage(this.getRes, event.origin);
      // };
      window.addEventListener("message", this.getMsg, false);
      // window.parent.postMessage(this.getRes, "https://localhost:3000");
    });
  },
  methods: {
    getMsg(event) {
      console.log("event");
      // event.source 就当前弹出页的来源页面
      // event.data 是 "hello there!"
      // 假设你已经验证了所受到信息的origin (任何时候你都应该这样做), 一个很方便的方式就是把enent.source
      // 作为回信的对象，并且把event.origin作为targetOrigin
      if (event.origin !== "https://localhost:3000") return;
      event.source.postMessage(this.getRes, event.origin);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>

