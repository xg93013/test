<template>
  <div>
    <el-popover
      popper-class="tree-downlist"
      v-model="visible"
      :visible-arrow="false"
      trigger="click"
      :placement="placement"
    >
      <div class="tree-select">
        <div id="down-tree">
          <div class="left">
            <div class="tree-top">
              <el-input v-model="keyWord" class="tree-search">
                <svg-icon iconClass="search" slot="suffix"></svg-icon>
              </el-input>
            </div>
            <div class="tree-content">
              <el-tree
                ref="treeRefs"
                :data="data"
                node-key="id"
                show-checkbox
                :check-strictly="false"
                :filter-node-method="filterNode"
                default-expand-all
                :expand-on-click-node="false"
                :render-content="renderContent"
                @check="check"
                @node-click="nodeClick"
              ></el-tree>
            </div>

            <!-- -->
            <!-- :check-strictly="true" -->
          </div>
          <div class="right">
            <div class="tree-top">
              <div class="nums fl">{{selectLen}}/{{totalLen}}</div>
              <span class="clear-empty fr" @click="reset">清空</span>
            </div>
            <div class="tree-content">
              <div
                class="item"
                v-for="(item,index) in checkList"
                :key="'treenode'+index"
                :class="{'active':index==selectIndex}"
                @click="selectIndex=index"
              >
                {{item.name}}
                <span
                  @click="removeCheck(item.id)"
                  v-show="index==selectIndex"
                  class="close-btn"
                >
                  <svg-icon iconClass="close"></svg-icon>
                </span>
              </div>
            </div>

            <div class="operation">
              <el-button @click="visible=false">取消</el-button>
              <el-button @click="getCheckedNodes">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <div slot="reference" size="small">
        <el-input v-model="value" :placeholder="placeholder" disabled style="width: 180px;">
          <svg-icon :iconClass="icon" slot="suffix"></svg-icon>
        </el-input>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      value: "",
      keyWord: "",
      // data: [],
      checkList: [],
      backList: [],
      selectIndex: 0,
      currentNode: "",
      totalLen: 0,
      selectLen: 0,
      leaf: false
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
    placeholder: {
      type: String,
      default: ""
    },
    isLeaf: {
      type: Boolean,
      default: false
    },
    // backLeaf: {
    //   type: Boolean,
    //   default: false
    // },
    data: {
      type: Array,
      default: []
    },
    icon: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    modeType: {
      type: String,
      default: ""
    },
    defaultData: {
      type: Array,
      default: []
    }
  },
  computed: {},
  created() {},
  methods: {
    getTreeLength(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          this.getTreeLength(arr[i].children);
        }
        this.totalLen++;
      }
    },
    getSelectLength() {
      let arr = this.$refs.treeRefs.getCheckedNodes();
      this.selectLen = arr.length;
    },
    show() {
      this.visible = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
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
      // this.backList = [];
      // this.checkList = [];
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      // if (this.backLeaf) {
      // }
      if (this.isLeaf) {
        this.checkLeaf(node);
      } else {
        this.formatNode(currentNode);
        this.checkParent(node);
        this.checkChild(node);
      }
      this.getLeafNode(node);
      this.getSelectLength();
    },

    checkParent(node) {
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      if (currentNode.level != 1) {
        let parent = currentNode.parent;
        this.formatNode(parent);
        if (parent.checked) {
          this.deleteAllChildNode(parent);
        } else {
          this.selectChildNode(parent);
        }
        this.checkParent(parent.data);
      }
    },
    checkChild(node) {
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      if (currentNode.childNodes && currentNode.childNodes.length > 0) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          this.deleteNode(currentNode.childNodes[i].data.id);
          if (currentNode.childNodes[i].childNodes.length > 0) {
            this.checkChild(currentNode.childNodes[i].data);
          }
        }
      }
    },

    checkLeaf(node) {
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      if (!currentNode.isLeaf) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          if (currentNode.childNodes[i].isLeaf) {
            this.formatNode(currentNode.childNodes[i]);
          } else {
            this.checkLeaf(currentNode.childNodes[i].data);
          }
        }
      } else {
        this.formatNode(currentNode);
      }
    },

    deleteAllChildNode(node) {
      for (let i = 0; i < node.childNodes.length; i++) {
        this.deleteNode(node.childNodes[i].data.id);
      }
    },
    selectChildNode(node) {
      for (let i = 0; i < node.childNodes.length; i++) {
        this.formatNode(node.childNodes[i]);
      }
    },

    formatNode(node) {
      this.deleteNode(node.data.id);
      if (node.checked) {
        if (node.isLeaf) {
          this.checkList.push({
            id: node.data.id,
            name: this.isLeaf ? node.data.label : this.addName(node, "")
          });
        } else {
          this.checkList.push({
            id: node.data.id,
            name: this.addName(node, "") + "/全部"
          });
        }
      }
    },
    formatLeafNode(node) {
      this.deleteLeafNode(node.data.id);
      if (node.checked) {
        this.backList.push({
          id: node.data.id,
          label: node.data.label
        });
      }
    },
    getLeafNode(node) {
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      if (!currentNode.isLeaf) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          if (currentNode.childNodes[i].isLeaf) {
            this.formatLeafNode(currentNode.childNodes[i]);
          } else {
            this.getLeafNode(currentNode.childNodes[i].data);
          }
        }
      } else {
        this.formatLeafNode(currentNode);
      }
    },
    deleteNode(id) {
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].id === id) {
          this.checkList.splice(i, 1);
          return;
        }
      }
    },
    deleteLeafNode(id) {
      for (let i = 0; i < this.backList.length; i++) {
        if (this.backList[i].id === id) {
          this.backList.splice(i, 1);
          return;
        }
      }
    },
    addName(node, name) {
      if (node.level == 0) {
        return name;
      }
      let resName = "";
      if (name != "") {
        resName = node.data.label + "/" + name;
      } else {
        resName = node.data.label;
      }
      return this.addName(node.parent, resName);
    },
    removeCheck(id) {
      this.$refs.treeRefs.setChecked(id, false, true);
      this.deleteNode(id);
      this.deleteLeafNode(id);
      this.getSelectLength();
    },
    reset() {
      for (let i = 0; i < this.checkList.length; i++) {
        this.$refs.treeRefs.setChecked(this.checkList[i].id, false, true);
      }
      this.checkList = [];
      this.backList = [];
      this.getSelectLength();
    },
    getCheckedNodes() {
      // console.log(this.$refs.treeRefs.getCheckedNodes());
      this.$emit("downTree", this.backList, this.modeType);
      this.visible = false;
    },
    nodeClick(data, node, current) {
      // console.log(node);
    }
  },
  mounted() {
    if (this.data.length > 0) {
      this.currentNode = this.$refs.treeRefs.getNode(this.data[0].id);
    }
    for (let i = 0; i < this.defaultData.length; i++) {
      console.log(this.defaultData[i]);
      this.$refs.treeRefs.setChecked(this.defaultData[i].id, true, true);
      this.checkList.push({
        id: this.defaultData[i].id,
        name: this.defaultData[i].label
      });
      this.backList.push({
        id: this.defaultData[i].id,
        label: this.defaultData[i].label
      });
    }
    this.getTreeLength(this.data);
    this.getSelectLength();
  }
};
</script>
<style lang="scss" scoped>
#down-tree {
  background: #fff;
  // padding: 20px;
  overflow: hidden;
  width: 100%;
  display: flex;
  .left,
  .right {
    flex: 1;
    .tree-search {
      display: block;
      width: 230px;
      margin: 10px auto;
    }
    .tree-top {
      width: 100%;
      height: 60px;
      overflow: hidden;
    }
    .tree-content {
      max-height: 350px;
      min-height: 300px;
      overflow-y: auto;
    }
  }
  .right {
    position: relative;
    padding-bottom: 50px;
    .item {
      display: block;
      padding: 10px 15px;
      margin: 2px 10px;
      border: 1px solid #fff;
      .close-btn {
        float: right;
        cursor: pointer;
      }
      &.active {
        background: #f5f5f5;
        border: 1px solid #eee;
      }
    }
    .tree-top {
      line-height: 60px;
      .clear-empty {
        color: blue;
        cursor: pointer;
      }
    }
    .operation {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>

