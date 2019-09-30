<template>
  <div class="fl">
    <el-popover placement="bottom-start" width="100" trigger="click" popper-class="sort">
      <div class="sort-boxs">
        <p
          v-for="(item, index) in tableHeader"
          :key="index"
          class="list"
          :class="{'active':item.prop===prop}"
          @click="changeProp(item.prop)"
          v-if="item.sortable"
        >
          <span class="icon">
            <svg-icon iconClass="radio"></svg-icon>
          </span>
          {{item.label}}
        </p>
      </div>
      <div class="ways">
        <p
          v-for="(item, index) in sortList"
          :key="index"
          class="list"
          :class="{'active':item.key===order}"
          @click="changeOrder(item.key)"
        >
          <span class="icon">
            <svg-icon iconClass="radio"></svg-icon>
          </span>
          {{item.label}}
        </p>
      </div>
      <el-button slot="reference">
        <svg-icon iconClass="sort"></svg-icon>
        <span>排序</span>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      prop: "",
      order: "",
      sortList: [
        {
          label: "正序排序",
          key: "ascending"
        },
        {
          label: "倒序排序",
          key: "descending"
        },
        {
          label: "恢复默认",
          key: null
        }
      ]
    };
  },
  props: {
    tableHeader: {
      type: Array,
      default: []
    },
    selectProp: {
      type: String,
      default: ""
    },
    selectOrder: {
      type: String,
      default: ""
    }
  },
  watch: {
    selectProp(a) {
      this.prop = a;
    },
    selectOrder(a) {
      this.order = a;
    }
  },
  methods: {
    changeProp(prop) {
      this.prop = prop;
      this.$emit("tableSort", this.prop, this.order);
      // order: ascending, descending
    },
    changeOrder(order) {
      this.order = order;
      if (!order) {
        this.prop = "";
        this.order = "";
        this.$emit("resetSort");
      } else {
        this.$emit("tableSort", this.prop, this.order);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sort-boxs {
  max-height: 200px;
  overflow-y: auto;
}
</style>
