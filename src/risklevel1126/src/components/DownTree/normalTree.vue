<template>
  <div>
    <el-tree
      ref="treeRefs"
      :data="data"
      node-key="id"
      show-checkbox
      :check-strictly="false"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
      @check="check"
    ></el-tree>
    <!-- :filter-node-method="filterNode" -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      result: []
    };
  },
  watch: {
    keyWord(val) {
      this.$refs.treeRefs.filter(val);
    },
    isLeaf(a) {
      this.leaf = a;
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    single: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  created() {},
  methods: {
    renderContent(h, { node, data, store }) {
      // console.log(node);
      let checkLen = 0;
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].checked) {
          checkLen++;
        }
      }
      if (!node.isLeaf) {
        return (
          <span class="custom-tree-node">
            <span>
              {node.label}&emsp; ({checkLen}/{node.childNodes.length})
            </span>
          </span>
        );
      } else {
        return <span>{node.label}</span>;
      }
    },
    check(node, current) {
      let currentNode = { ...this.$refs.treeRefs.getNode(node.id) };
      let arr = this.$refs.treeRefs.getCheckedNodes(true, false);
      if (!this.single) {
        this.result = arr;
        this.$emit("getResult", arr);
      } else {
        // console.log(currentNode);
        // console.log(this.level);
        for (let i = 0; i < arr.length; i++) {
          this.$refs.treeRefs.setChecked(arr[i].id, false, true);
        }
        if (currentNode.level == this.level) {
          this.$refs.treeRefs.setChecked(node.id, currentNode.checked, true);
        } else {
          this.$message.warning("请选择单个人员！");
        }
      }
    },
    reset() {
      if (this.result.length > 0) {
        for (let i = 0; i < this.result.length; i++) {
          this.$refs.treeRefs.setChecked(this.result[i].id, false, true);
        }
      }
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>

