<template>
  <div>
    {{$route.params.id}}
    <router-link to="/index">index</router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  props: ['id'],
  created() {
    
  },
  mounted() {
    
  },
}
</script>
<style lang="scss" scoped>

</style>

