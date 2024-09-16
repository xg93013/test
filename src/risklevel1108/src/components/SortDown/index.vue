<template>
  <div class="fl">
    <el-popover placement="bottom-start" width="100" trigger="click" popper-class="sort">
      <div class="sort-boxs">
        <p
          v-for="(item, index) in tableHeader"
          :key="index"
          class="list"
          :class="{'active':item.prop===prop}"
          @click="changeProp(item)"
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
          @click="changeOrder(item)"
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
      ],
      sortObj: {},
      orderObj: {}
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
    },
    defaultSort: {
      type: Object,
      default: {}
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
    changeProp(item) {
      this.prop = item.prop;
      this.sortObj = item;
      this.$emit("tableSort", item, this.orderObj);
      // order: ascending, descending
    },
    changeOrder(order) {
      if (order.key == null) {
        this.order = this.defaultSort.order;
        this.prop = this.defaultSort.prop;
        this.orderObj = this.sortList[1];
        this.sortObj = {
          prop: this.defaultSort.prop,
          label: this.defaultSort.label
        };
      } else {
        this.orderObj = order;
        this.order = order.key;
      }
      if (!order) {
        this.prop = "";
        this.order = "";
        this.sortObj = {};
        this.orderObj = {};
        this.$emit("resetSort");
      } else {
        this.$emit("tableSort", this.sortObj, this.orderObj);
      }
    }
  },
  mounted() {
    this.order = this.defaultSort.order;
    this.prop = this.defaultSort.prop;
    this.orderObj = this.sortList[1];
  }
};
</script>

<style lang="scss">
.sort-boxs {
  max-height: 200px;
  overflow-y: auto;
}
.sort {
  line-height: 30px;
  min-width: 190px;
  .list {
    cursor: pointer;
    .icon {
      color: #409eff;
      visibility: hidden;
    }
    &.active {
      .icon {
        visibility: visible;
      }
    }
  }
  .ways {
    border-top: 1px solid #eee;
    padding: 10px 0;
    margin: 10px 0 0;
  }
}
</style>
