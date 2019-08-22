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
                show-checkbox
                node-key="id"
                :data="datas"
                @node-click="nodeClick"
                :check-strictly="checkStrictly"
                :filter-node-method="filterNode"
                :default-expand-all="false"
                :expand-on-click-node="true"
                :check-on-click-node="false"
                :accordion="true"
                :render-content="renderContent"
                @check="check"
                ref="treeRefs"
              ></el-tree>
              <!-- <el-tree
                ref="treeRefs"
                                :load="loadNode"
                                :data="datas"
                show-checkbox
                :render-content="renderContent"
                lazy
              ></el-tree>-->
            </div>
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
                v-if="item.show"
              >
                {{item.label}}
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
        <el-input v-model="value" :placeholder="placeholder" disabled>
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
      checkLeafList: [],
      selectIndex: 0,
      currentNode: "",
      totalLen: 0,
      selectLen: 0,
      originData: [],
      props: {
        id: 1,
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      checkStrictly: false
      // leaf: false
    };
  },
  watch: {
    keyWord(val) {
      this.$refs.treeRefs.filter(val);
    }
    // datas(a) {
    //   console.log(a);
    //   this.originData = a;
    // }
    // isLeaf(a) {
    //   this.leaf = a;
    // }
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
    // 显示node全名
    showFullName: {
      type: Boolean,
      default: false
    },
    // backLeaf: {
    //   type: Boolean,
    //   default: false
    // },
    datas: {
      type: Array,
      default: []
    },
    icon: {
      type: String,
      default: ""
    },
    splitStr: {
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
    loadNode(node, resolve) {
      // console.log(node);
      if (node.level > 0) {
        let data = [];
        let result = [];
        result = this.getChildNode(node.data, this.datas);
        console.log(result);
        for (let i = 0; i < result.length; i++) {
          data.push({
            id: result[i].id,
            label: result[i].label
          });
        }
        // console.log(data);
        return resolve(data);
      }
      // if (node.level > 0) {
      //   let dataa = [
      //     {
      //       id: 2,
      //       label: "leaf",
      //       leaf: true
      //     },
      //     {
      //       id: 3,
      //       label: "zone"
      //     }
      //   ];
      //   for (let i = 0; i < 100; i++) {
      //     dataa.push({
      //       id: 20 + i,
      //       label: "亚类" + 20 + i
      //     });
      //   }

      //   return resolve(data);
      // }

      // setTimeout(() => {

      // }, 500);
    },
    getChildNode(node, arr) {
      // console.log(node);
      // console.log(arr);
      let flag = false;
      let index = 0;
      for (let i = 0; i < arr.length; i++) {
        if (node.label == arr[i].label) {
          flag = true;
          index = i;
        } else {
          flag = false;
        }
      }
      if (flag) {
        return arr[index].children;
      } else {
        let inFlag = false;
        let res = [];
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].children.length > 0) {
            res = this.getChildNode(node, [...arr[j].children]);
          }
        }
      }
    },
    getTreeLength(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          this.getTreeLength(arr[i].children);
        } else {
          if (this.isLeaf) {
            this.totalLen++;
          }
        }
        if (!this.isLeaf) {
          this.totalLen++;
        }
      }
    },
    getSelectLength() {
      let arr = this.$refs.treeRefs.getCheckedNodes(this.isLeaf);
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
    check(node) {
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      if (this.isLeaf) {
        if (this.checkLeafList.length > 0) {
          let level = this.checkLeafList[0].level;
          if (node.level == level) {
            this.checkLeaf(node);
            this.getLeafNode(node);
          } else {
            this.$refs.treeRefs.setChecked(node.id, !currentNode.checked, true);
            for (let i = 0; i < this.checkLeafList.length; i++) {
              if (this.checkLeafList[i].show) {
                this.$refs.treeRefs.setChecked(
                  this.checkLeafList[i].id,
                  true,
                  true
                );
              }
            }
            this.$message.error("请选择同级节点");
          }
        } else {
          this.checkLeaf(node);
          this.getLeafNode(node);
        }
      } else {
        if (this.checkList.length > 0) {
          let level = this.checkList[0].level;
          if (node.level == level) {
            this.formatNode(currentNode);
            this.checkParent(node);
            this.checkChild(node);
          } else {
            this.$refs.treeRefs.setChecked(node.id, !currentNode.checked, true);
            for (let i = 0; i < this.checkList.length; i++) {
              if (this.checkList[i].show) {
                this.$refs.treeRefs.setChecked(
                  this.checkList[i].id,
                  true,
                  true
                );
              }
            }
            this.$message.error("请选择同级节点");
          }
        } else {
          // console.log(currentNode);
          this.formatNode(currentNode);
          this.checkParent(node);
          this.checkChild(node);
        }
      }
      this.getSelectLength();
      // console.log(this.checkList);
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
        // console.log(node.childNodes[i]);
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
        let currentNode = this.$refs.treeRefs.getNode(node.data.id);
        // 不显示全部
        this.checkList.push({
          id: node.data.id,
          label: this.showFullName ? this.addName(node, "") : node.data.label,
          level: node.data.level,
          nodeLabel: node.data.label,
          parentId: node.data.level > 1 ? currentNode.parent.data.id : null,
          show: true
        });
        console.log(node);
        if (node.data.level > 1) {
          this.formatParentNode(currentNode.parent);
        }

        // 显示全部
        // if (node.isLeaf) {
        //   this.checkList.push({
        //     id: node.data.id,
        //     label: this.showFullName ? this.addName(node, "") : node.data.label,
        //     nodeLabel: node.data.label
        //   });
        // } else {
        //   this.checkList.push({
        //     id: node.data.id,
        //     label: this.showFullName
        //       ? this.addName(node, "") + "/全部"
        //       : node.data.label,
        //     nodeLabel: node.data.label
        //   });
        // }
      }
    },
    formatParentNode(node) {
      this.deleteNode(node.data.id);
      if (!this.isLeaf) {
        this.checkList.push({
          id: node.data.id,
          label: node.data.label,
          level: node.data.level,
          nodeLabel: node.data.label,
          parentId: node.data.level > 1 ? node.parent.data.id : null,
          show: false
        });
        if (node.data.level > 1) {
          this.formatParentNode(node.parent);
        }
      }
    },
    formatLeafNode(node) {
      this.deleteLeafNode(node.data.id);
      if (node.checked) {
        this.checkLeafList.push({
          id: node.data.id,
          label: node.data.label,
          level: node.data.level,
          nodeLabel: node.data.label
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
      for (let i = 0; i < this.checkLeafList.length; i++) {
        if (this.checkLeafList[i].id === id) {
          this.checkLeafList.splice(i, 1);
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
        resName = node.data.label + this.splitStr + name;
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
      this.checkLeafList = [];
      this.getSelectLength();
    },
    getCheckedNodes() {
      console.log(this.checkList);
      this.$emit(
        "downTree",
        this.isLeaf ? this.checkLeafList : this.checkList,
        this.modeType
      );
      this.visible = false;
    },
    nodeClick(data, node, current) {
      // console.log(node);
    }
  },
  mounted() {
    if (this.datas.length > 0) {
      this.checkLeafList = [];
      this.checkList = [];

      for (let i = 0; i < this.datas.length; i++) {
        this.originData.push({
          id: this.datas[i].id,
          label: this.datas[i].label
        });
      }

      // for (let i = 0; i < this.defaultData.length; i++) {
      //   // let currentNode = this.$refs.treeRefs.getNode(this.defaultData[i].id);
      //   // console.log(currentNode);
      //   this.$refs.treeRefs.setChecked(this.defaultData[i].id, true, true);
      //   this.check(this.defaultData[i]);
      // }

      this.getTreeLength(this.datas);
      this.getSelectLength();
    }

    // console.log(this.currentNode);
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

