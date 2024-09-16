<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace({
        path: from.path
      });
    });
  },
  mounted() {}
};
</script>