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
                                
                show-checkbox
                :render-content="renderContent"
                lazy
                :load="loadNode"
                lazy
              ></el-tree>-->
            </div>
            <!-- :check-strictly="true" -->
          </div>
          <div class="right">
            <div class="tree-top">
              <div class="nums">{{selectLen}}/{{totalLen > 0 ? totalLen-1: 0}}</div>
              <span class="clear-empty" @click="reset">清空</span>
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
          <svg-icon
            :iconClass="icon"
            slot="suffix"
            style="height: 40px;line-height:40px;margin-right:4px;"
          ></svg-icon>
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
      allData: {},
      originData: [],
      props: {
        id: 1,
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      checkStrictly: false,
      emitData: [],
      paramsData: []
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
      if (node.level > 0) {
        let data = [];
        let result = [];
        result = this.getChildNode(this.allData, node.data.id);
        if (result.children != null && result.children.length > 0) {
          for (let i = 0; i < result.children.length; i++) {
            data.push({
              id: result.children[i].id,
              label: result.children[i].label,
              level: result.children[i].level
            });
          }
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
    // getChildNode(node, arr) {
    //   // console.log(node);
    //   // console.log(arr);
    //   let flag = false;
    //   let index = 0;
    //   for (let i = 0; i < arr.length; i++) {
    //     if (node.label == arr[i].label) {
    //       flag = true;
    //       index = i;
    //     } else {
    //       flag = false;
    //     }
    //   }
    //   if (flag) {
    //     return arr[index].children;
    //   } else {
    //     let inFlag = false;
    //     let res = [];
    //     for (let j = 0; j < arr.length; j++) {
    //       if (arr[j].children.length > 0) {
    //         res = this.getChildNode(node, [...arr[j].children]);
    //       }
    //     }
    //   }
    // },
    getChildNode(node, id) {
      if (node.id == id) {
        return node;
      } else if (node.children != null) {
        let i = 0;
        let result = null;
        for (i = 0; result == null && i < node.children.length; i++) {
          result = this.getChildNode(node.children[i], id);
        }
        return result;
      }
      return null;
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
      this.emitData = [];
      let arr = this.$refs.treeRefs.getCheckedNodes(false, true);
      // console.log(arr);
      for (let i = 0; i < arr.length; i++) {
        let node = this.$refs.treeRefs.getNode(arr[i].id);
        console.log(node);
        // console.log(arr[i].id);
        let parentId = node.level - 1 > 1 ? node.parent.data.id : null;
        this.pushEmitData(node, parentId);

        // 懒加载获取
        // if (node.checked) {
        //   this.getStepNodes(this.getChildNode(this.allData, arr[i].id));
        // }
        if (arr[i].id != "0") {
          if (arr[i].id.substr(arr[i].id.length - 2, 2) != "00") {
            this.paramsData.push(arr[i]);
          }
        }
      }
      console.log(this.emitData);
      this.emitData = this.unique(this.emitData);
      this.selectLen = this.emitData.length;
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
      // let checkLen = 0;
      // for (let i = 0; i < node.childNodes.length; i++) {
      //   if (node.childNodes[i].checked) {
      //     checkLen++;
      //   }
      // }
      // if (!node.isLeaf) {
      //   // ({checkLen}/{node.childNodes.length})
      //   return (
      //     <span class="custom-tree-node">
      //       <span>{node.label}</span>
      //     </span>
      //   );
      // } else {
      //   return <span>{node.label}</span>;
      // }
      return <span>{node.label}</span>;
    },
    check(node) {
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      console.log(currentNode);
      if (this.isLeaf) {
        this.checkLeaf(node);
        this.getLeafNode(node);
      } else {
        this.formatNode(currentNode);
        this.checkParent(node);
        this.checkChild(node);
      }
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
        console.log(currentNode);
        let level = currentNode.level - 1;
        // 不显示全部
        this.checkList.push({
          id: node.data.id,
          label: this.showFullName ? this.addName(node, "") : node.data.label,
          level: level,
          nodeLabel: node.data.label,
          parentId: level > 1 ? currentNode.parent.data.id : null,
          show: true
        });
        // console.log(node);
        // if (node.data.level > 1) {
        //   this.formatParentNode(currentNode.parent);
        // }

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
          level: node.level - 1,
          nodeLabel: node.data.label,
          parentId: node.level - 1 > 1 ? node.parent.data.id : null,
          show: false
        });
        if (node.level - 1 > 1) {
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
        if (node.level > 1) {
          resName = node.data.label + this.splitStr + name;
        } else {
          resName = name;
        }
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
      this.$emit(
        "downTree",
        this.isLeaf ? this.checkLeafList : this.emitData,
        this.modeType,
        this.paramsData
      );
      this.visible = false;
    },
    getStepNodes(node) {
      let parentId = node.id;
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          // console.log(node);
          // let inNode = this.$refs.treeRefs.getNode(node.children[j].id);
          this.pushEmitData(node.children[i], parentId);
          this.getStepNodes(node.children[i]);
        }
      }
    },
    pushEmitData(node, parentId) {
      // let yearId = null;
      // let flag = false;
      // if (this.modeType == "time") {
      //   let allParent = this.getAllParent(this.datas, node.id);
      //   for (let i = 0; i < allParent.length; i++) {
      //     if (allParent[i].level == 1) {
      //       yearId = allParent[i].id;
      //     }
      //   }
      // }
      // for (let i = 0; i < this.emitData.length; i++) {
      //   if (node.id == this.emitData[i].id) {
      //     flag = true;
      //     return;
      //   }
      // }
      if (node.label != "全部") {
        this.emitData.push({
          id: node.data.id,
          label: node.data.label,
          level: node.level - 1,
          parentId: node.level - 1 > 1 ? parentId : null
          // yearId: yearId
        });
      }
    },
    getAllParent(data2, nodeId2) {
      var arrRes = [];
      if (data2.length == 0) {
        if (!!nodeId2) {
          arrRes.unshift(data2);
        }
        return arrRes;
      }
      let rev = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          let node = data[i];
          if (node.id == nodeId) {
            arrRes.unshift(node);
            rev(data2, node.parentId);
            break;
          } else {
            if (!!node.children) {
              rev(node.children, nodeId);
            }
          }
        }
        return arrRes;
      };
      arrRes = rev(data2, nodeId2);
      return arrRes;
    },
    nodeClick(data, node, current) {
      // console.log(node);
    },
    unique(arr) {
      // var hash = [];
      // for (var i = 0; i < arr.length; i++) {
      //   for (var j = i + 1; j < arr.length; j++) {
      //     if (arr[i].id === arr[j].id) {
      //       ++i;
      //     }
      //   }
      //   hash.push({ ...arr[i] });
      // }
      // return hash;

      let result = [];
      let obj = {};
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].id]) {
          result.push(arr[i]);
          obj[arr[i].id] = true;
        }
      }
      return result;
    }
  },
  mounted() {
    if (this.datas.length > 0) {
      this.checkLeafList = [];
      this.checkList = [];
      this.allData = {
        id: -1,
        label: "start",
        children: [...this.datas]
      };
      for (let i = 0; i < this.datas.length; i++) {
        this.originData.push({
          id: this.datas[i].id,
          label: this.datas[i].label,
          level: this.datas[i].level
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
  // display: flex;
  .left,
  .right {
    // flex: 1;
    float: left;
    width: 50%;
    .tree-search {
      display: block;
      width: 230px;
      margin: 10px auto;
    }
    .tree-top {
      width: 100%;
      height: 60px;
      overflow: hidden;
      .nums {
        display: inline-block;
        float: left;
      }
      .clear-empty {
        float: right;
        margin-right: 10px;
      }
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

