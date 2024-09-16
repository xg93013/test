<template>
  <div id="ModeEdit">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.keyWord" placeholder="搜索关键词" class="search-items" />
        <el-select v-model="search.modeClass" placeholder="模板分类" class="search-items">
          <el-option
            v-for="(item,index) in checkAreaList"
            :key="index+'proClass'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.proClass" placeholder="适用企业类型" class="search-items">
          <el-option
            v-for="(item,index) in proClassList"
            :key="index+'proClass'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

      </div>
      <div class="fr">
        <el-button type="primary" @click="searchResult">
          <svg-icon iconClass="search"></svg-icon>
          <span>查询</span>
        </el-button>
        <el-button @click="resetSearch">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
</style>
