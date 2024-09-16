<template>
  <div id="index">
    <Header @goBuiness="goBusiness"/>
    <Sidebar/>
    <div id="content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" ref="home"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
    </div>
  </div>
</template>

<script>
import Header from "./header";
import Sidebar from "./sidebar";
export default {
  data() {
    return {};
  },
  components: {
    Header,
    Sidebar
  },
  methods: {
    goBusiness(id) {
      this.$refs.home.goBusiness({
        type: 2,
        id
      });
    }
  }
};
</script>

<style lang="scss">
#index {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: url(../images/bg.jpg);
  background-size: cover;
  #content {
    position: fixed;
    left: 48px;
    top: 66px;
    bottom: 0;
    right: 0;
    padding: 24px 20px 20px 20px;
    overflow: auto;

    > div {
      width: 100%;
      min-width: 1152px;
      min-height: 700px;
    }
  }
}
</style>