<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  /* position: relative; */
}
#app {
  width: 100%;
  height: 100%;
}
</style>
