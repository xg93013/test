<template>
  <div>
    <el-popover
      popper-class="select-tree"
      v-model="visible"
      :visible-arrow="false"
      trigger="click"
      :placement="placement"
    >
      <div class="select-content">
        <el-tree
          ref="treeRefs"
          :data="originTree"
          node-key="id"
          :check-strictly="false"
          :expand-on-click-node="false"
          :render-content="renderContent"
          :default-expand-all="false"
          :default-expanded-keys="[0]"
        ></el-tree>
      </div>

      <div slot="reference" size="small">
        <div class="show-text" :class="{'noBorder':!showBorder}">
          <span class="text">{{'共'+totalLen+'种'}}</span>
          <svg-icon
            iconClass="down"
            style="float:right;height: 40px;line-height:40px;margin-right:10px;"
          ></svg-icon>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      treeId: 1,
      totalLen: 0,
      originTree: []
    };
  },
  watch: {
    keyWord(val) {
      this.$refs.treeRefs.filter(val);
    },
    data(a) {
      this.formateTree(a);
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    placeholder: {
      type: String,
      default: ""
    },
    showBorder: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  created() {},
  methods: {
    show() {
      this.visible = true;
    },
    renderContent(h, { node, data, store }) {
      if (!node.isLeaf) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      } else {
        return <span>{node.label}</span>;
      }
    },
    setId() {
      return this.treeId++;
    },
    formateTree(data) {
      this.totalLen = 0;
      this.originTree = [{ id: "0", label: "全部", children: [] }];
      let arr = data;
      let allLevels = [
        {
          name: "level1",
          data: []
        },
        {
          name: "level2",
          data: []
        },
        {
          name: "level3",
          data: []
        },
        {
          name: "level4",
          data: []
        }
      ];
      for (let i = 0; i < arr.length; i++) {
        let levels = arr[i].label.split("/");
        let [flag1, flag2, flag3, flag4] = [false, false, false, false];
        for (let j = 0; j < allLevels[0].data.length; j++) {
          if (allLevels[0].data[j].label == levels[0]) {
            flag1 = true;
            break;
          } else {
            continue;
          }
        }
        for (let j = 0; j < allLevels[1].data.length; j++) {
          if (allLevels[1].data[j].label == levels[1]) {
            flag2 = true;
            break;
          } else {
            continue;
          }
        }
        for (let j = 0; j < allLevels[2].data.length; j++) {
          if (allLevels[2].data[j].label == levels[2]) {
            flag3 = true;
            break;
          } else {
            continue;
          }
        }
        for (let j = 0; j < allLevels[3].data.length; j++) {
          if (allLevels[3].data[j].label == levels[3]) {
            flag4 = true;
            break;
          } else {
            continue;
          }
        }
        if (!flag1) {
          allLevels[0].data.push({
            id: this.setId(),
            parent: "全部",
            label: levels[0]
          });
        }
        if (!flag2) {
          allLevels[1].data.push({
            id: this.setId(),
            parent: levels[0],
            label: levels[1]
          });
        }
        if (!flag3) {
          allLevels[2].data.push({
            id: this.setId(),
            parent: levels[1],
            label: levels[2]
          });
        }
        if (!flag4) {
          allLevels[3].data.push({
            id: this.setId(),
            parent: levels[2],
            label: levels[3]
          });
        }
      }
      for (let i = 0; i < allLevels.length; i++) {
        this.setTree(this.originTree[0], allLevels[i].data);
      }
      this.totalLen = data.length;
    },
    setTree(node, children) {
      if (!node) {
        return;
      }
      if (node.children && node.children.length != 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.setTree(node.children[i], children);
        }
      } else {
        let origin = children;
        let arr = [];
        for (let j = 0; j < origin.length; j++) {
          if (node.label == origin[j].parent) {
            arr.push({ ...origin[j] });
          }
        }

        node.children = arr;
      }
    }
  },
  mounted() {
    this.formateTree(this.data);
  }
};
</script>
<style lang="scss" scope>
.select-tree {
  width: 370px;
  .select-content {
    width: 100%;
    height: 350px;
    overflow: auto;
  }
}
.show-text {
  width: 100%;
  height: 40px;
  border: 1px solid #eee;
  border-radius: 4px;
  color: #999;
  overflow: hidden;
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  .text {
    margin-left: 10px;
  }
  &.noBorder {
    border: none;
  }
}
</style>

