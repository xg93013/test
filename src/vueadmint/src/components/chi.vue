<template>
  <div class="temps">
    <!-- {{bbb}} -->
    <div class="show" v-show="show">showa</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    bbb: {
      default: "",
      type: Object
    },
    aaa: {
      default: false,
      type: Boolean
    }
  },
  created() {
    // console.log(this.aaa);
  },
  methods: {},
  watch: {
    bbb(a, b) {},
    aaa(a) {
      // console.log(this.aaa);
      this.show = a;
    }
  },
  mounted() {
    // this.bbb = "abchsjdskjf"
  }
};
</script>
<style lang="scss" scoped>
</style>