<template>
  <div>
    <el-dialog
      custom-class="tree-downlist"
      :title.sync="title"
      :visible.sync="visible"
      :placement="placement"
      width="750px"
      @close="cancelCheck"
    >
      <div class="tree-select">
        <div id="down-tree">
          <div class="down-left">
            <!-- <div class="tree-top"> -->
            <!-- <el-input v-model="keyWord" class="tree-search">
                <svg-icon iconClass="search" slot="suffix"></svg-icon>
            </el-input>-->
            <!-- </div> -->
            <div class="tree-content">
              <el-tree
                show-checkbox
                node-key="id"
                :data="data"
                @node-click="nodeClick"
                :check-strictly="checkStrictly"
                :default-expand-all="false"
                :expand-on-click-node="true"
                :check-on-click-node="false"
                :accordion="true"
                @check="check"
                :default-expanded-keys="[0]"
                ref="treeRefs"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <div v-if="!node.isLeaf">
                    <span
                      class="in-node"
                      :title="node.label"
                    >{{node.label}}({{getNodeLen(node)}}/{{node.childNodes.length}})</span>
                  </div>
                  <div v-else>
                    <span :title="node.data.longLabel">{{node.label}}</span>
                  </div>
                </div>
              </el-tree>
              <!-- <el-tree
                ref="treeRefs"                    
                show-checkbox
                :filter-node-method="filterNode"
                :render-content="renderContent"
                lazy
                :load="loadNode"
                lazy
              ></el-tree>-->
            </div>
            <!-- :check-strictly="true" -->
          </div>
          <div class="down-right">
            <div class="tree-top">
              <div class="nums">已选{{selectLen}}/{{totalLen > 0 ? totalLen: 0}}</div>
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
              <el-button @click="cancelCheck">取消</el-button>
              <el-button @click="getCheckedNodes" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div slot="reference" size="small">
        <el-input v-model="value" :placeholder="placeholder" disabled>
          <svg-icon
            :iconClass="icon"
            slot="suffix"
            style="height: 40px;line-height:40px;margin-right:4px;"
          ></svg-icon>
        </el-input>
      </div>-->
    </el-dialog>
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
      // checkLeafList: [],
      selectIndex: 0,
      currentNode: "",
      totalLen: 0,
      selectLen: 0,
      allData: {},
      originData: [],
      // props: {
      //   id: 1,
      //   label: "name",
      //   children: "zones",
      //   isLeaf: "leaf"
      // },
      checkStrictly: false,
      emitData: [],
      paramsData: [],
      selectNodes: [],
      selectAll: false,
      prevDatas: [],
      isFirstReset: false,
      isOpened: false,
      deleteRowIds: []
      // leaf: false
    };
  },
  watch: {
    keyWord(val) {
      this.$refs.treeRefs.filter(val);
    },
    data(a) {
      this.data = a;
      this.totalLen = 0;
      this.getTreeLength(this.data);
      this.selectLen = 0;
    }
    // title(a) {
    //   this.title = a;
    // }
  },
  props: {
    title: {
      type: String,
      default: ""
    },
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
    data: {
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
    },
    backLeaf: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  created() {
    // console.log(this.isLeaf);
  },
  methods: {
    getNodeLen(node) {
      let len = 0;
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].checked) {
          len++;
        }
      }
      return len;
    },
    open() {
      this.visible = true;
      this.isOpened = true;
      this.$nextTick(() => {
        this.setDefaultData();
        // if (this.deleteRowId != "") {
        //   this.deleteTableRow(this.deleteRowId);
        // }
        if (this.deleteRowIds.length > 0) {
          this.deleteTableRow();
        }
        if (this.isFirstReset) {
          this.reset();
        }
      });
    },
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
        return resolve(data);
      }
    },
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
      this.paramsData = [];
      this.selectNodes = [];
      this.selectAll = false;
      let arr = this.$refs.treeRefs.getCheckedNodes(false, true);
      let leafArr = this.$refs.treeRefs.getCheckedNodes(true, false);
      // this.getAllSelectNode(this.$refs.treeRefs.getCheckedNodes(false, true));
      // let arr = this.selectNodes;
      // console.log(arr);
      // let selectAllNode = this.$refs.treeRefs.getNode("0"); // 全选
      // if (selectAllNode.checked) {
      //   this.paramsData = [];
      //   this.selectAll = true;
      // }

      for (let i = 0; i < arr.length; i++) {
        let node = this.$refs.treeRefs.getNode(arr[i].id);
        let parentId = node.level > 1 ? node.parent.data.id : null;
        this.pushEmitData(node, parentId);
        // 懒加载获取
        // if (node.checked) {
        //   this.getStepNodes(this.getChildNode(this.allData, arr[i].id));
        // }
      }

      if (this.backLeaf) {
        // if (arr[i].id.substr(arr[i].id.length - 2, 2) != "00") {
        //   this.paramsData.push(arr[i].id);
        // }
        for (let i = 0; i < leafArr.length; i++) {
          this.paramsData.push(arr[i]);
        }
      }
      // this.emitData = this.unique(this.emitData);
      if (this.isLeaf) {
        this.selectLen = this.$refs.treeRefs.getCheckedNodes(true, true).length;
      } else {
        this.selectLen = this.emitData.length;
      }
    },
    getAllSelectNode(arr) {
      for (let i = 0; i < arr.length; i++) {
        let node = this.$refs.treeRefs.getNode(arr[i].id);
        if (node.level != 1) {
          this.addSelectNode(arr[i]);
          this.selectAllParentNode(node);
        }
      }
    },
    addSelectNode(node) {
      let flag = false;
      for (let i = 0; i < this.selectNodes.length; i++) {
        if (node.id == this.selectNodes[i].id) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.selectNodes.push({
          id: node.id,
          label: node.label
        });
      }
    },
    selectAllParentNode(node) {
      if (node.level > 1) {
        this.addSelectNode(node.data);
        this.selectAllParentNode(node.parent);
      }
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
        // ({checkLen}/{node.childNodes.length})
        return (
          <span class="custom-tree-node">
            <span>
              {node.label}({checkLen}/{node.childNodes.length})
            </span>
          </span>
        );
      } else {
        return <span>{node.label}</span>;
      }
      return <span>{node.label}</span>;
    },
    check(node) {
      let currentNode = this.$refs.treeRefs.getNode(node.id);
      if (this.isLeaf) {
        this.checkLeaf(node);
        // this.getLeafNode(node);
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
        // console.log(currentNode);
        let level = currentNode.level - 1;
        // 不显示全部
        this.checkList.push({
          id: node.data.id,
          label: this.showFullName ? this.addName(node, "") : node.data.label,
          level: level,
          longLabel: node.data.longLabel,
          score: node.data.score,
          nodeLabel: node.data.label,
          parentId: level > 1 ? currentNode.parent.data.id : null,
          show: true
        });
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
    // formatLeafNode(node) {
    //   this.deleteLeafNode(node.data.id);
    //   if (node.checked) {
    //     this.checkLeafList.push({
    //       id: node.data.id,
    //       label: node.data.label,
    //       level: node.data.level,
    //       nodeLabel: node.data.label
    //     });
    //   }
    // },
    // getLeafNode(node) {
    //   let currentNode = this.$refs.treeRefs.getNode(node.id);
    //   if (!currentNode.isLeaf) {
    //     for (let i = 0; i < currentNode.childNodes.length; i++) {
    //       if (currentNode.childNodes[i].isLeaf) {
    //         this.formatLeafNode(currentNode.childNodes[i]);
    //       } else {
    //         this.getLeafNode(currentNode.childNodes[i].data);
    //       }
    //     }
    //   } else {
    //     this.formatLeafNode(currentNode);
    //   }
    // },
    deleteNode(id) {
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].id === id) {
          this.checkList.splice(i, 1);
          return;
        }
      }
    },
    // deleteLeafNode(id) {
    //   for (let i = 0; i < this.checkLeafList.length; i++) {
    //     if (this.checkLeafList[i].id === id) {
    //       this.checkLeafList.splice(i, 1);
    //       return;
    //     }
    //   }
    // },
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
      // this.deleteLeafNode(id);
      this.getSelectLength();
    },
    reset() {
      if (!this.isOpened) {
        this.isFirstReset = true;
      } else {
        this.isFirstReset = false;
        for (let i = 0; i < this.checkList.length; i++) {
          this.$refs.treeRefs.setChecked(this.checkList[i].id, false, true);
        }
        this.checkList = [];
        this.prevDatas = [];
        // this.checkLeafList = [];
        this.getSelectLength();
      }
    },
    getCheckedNodes() {
      // let emitLeaf = [];
      // for (let i = 0; i < this.checkList.length; i++) {
      //   emitLeaf.push(this.checkList[i].label);
      // }
      // if (emitLeaf.indexOf("全部") > -1) {
      //   emitLeaf = [];
      // }
      // console.log(emitLeaf);
      // this.$emit(
      //   "downTree",
      //   this.isLeaf ? this.checkLeafList : this.emitData,
      //   this.modeType,
      //   this.backLeaf ? this.paramsData : emitLeaf,
      //   this.selectAll
      // );
      this.prevDatas = [...this.checkList];
      this.$emit("downTree", this.emitData, this.checkList, this.paramsData);
      this.deleteRowIds = [];
      // console.log(this.emitData);
      this.visible = false;
    },
    cancelCheck() {
      for (let i = 0; i < this.checkList.length; i++) {
        this.$refs.treeRefs.setChecked(this.checkList[i].id, false, true);
      }
      for (let i = 0; i < this.prevDatas.length; i++) {
        this.$refs.treeRefs.setChecked(this.prevDatas[i].id, true, true);
      }
      this.checkList = [...this.prevDatas];
      // this.defaultData = [...this.prevDatas];
      this.$emit("setDefault", this.prevDatas);
      this.visible = false;
      this.getSelectLength();
    },
    tableRowDelete(id) {
      // this.removeCheck(id);
      // if (this.isOpened) {
      //   this.deleteTableRow(id);
      // } else {
      //   this.deleteRowId = id;
      // }
      // this.deleteNode(id);
      // this.$emit("setDefault", this.checkList);
      // this.prevDatas = [...this.checkList];
      let flag = false;
      for (let i = 0; i < this.deleteRowIds.length; i++) {
        if (id == this.deleteRowIds[i]) {
          flag = true;
          break;
        } else {
          continue;
        }
      }
      if (!flag) {
        this.deleteRowIds.push(id);
      }
    },
    deleteTableRow() {
      for (let i = 0; i < this.deleteRowIds.length; i++) {
        this.removeCheck(this.deleteRowIds[i]);
      }
      this.$emit("setDefault", this.checkList);
      this.prevDatas = [...this.checkList];
      this.deleteRowId = [];
    },
    getStepNodes(node) {
      let parentId = node.id;
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          // console.log(node);
          this.pushEmitData(node.children[i], parentId);
          this.getStepNodes(node.children[i]);
        }
      }
    },
    pushEmitData(node, parentId) {
      this.emitData.push({
        id: node.data.id,
        label: node.data.label,
        longLabel: node.data.longLabel,
        score: node.data.score,
        level: node.level,
        parentId: node.level > 1 ? parentId : null
      });
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
      let result = [];
      let obj = {};
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].id]) {
          result.push(arr[i]);
          obj[arr[i].id] = true;
        }
      }
      return result;
    },
    setDefaultData() {
      for (let i = 0; i < this.defaultData.length; i++) {
        // let currentNode = this.$refs.treeRefs.getNode(this.defaultData[i].id);
        // console.log(currentNode);
        // this.$refs.treeRefs.setChecked(this.defaultData[i].id, true, true);
        this.$refs.treeRefs.setChecked(this.defaultData[i].id, true, true);
        this.check(this.defaultData[i]);
        this.prevDatas = [...this.checkList];
      }
    }
  },
  mounted() {
    if (this.data.length > 0) {
      this.checkLeafList = [];
      this.checkList = [];
      this.getTreeLength(this.data);
    }
  }
};
</script>
<style lang="scss">
// @import "~@/assets/style.scss";
#down-tree {
  background: #fff;
  // padding: 20px;
  overflow: hidden;
  width: 100%;
  // display: flex;
  .down-left,
  .down-right {
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
      height: 40px;
      line-height: 40px;
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
      .custom-tree-node {
        width: calc(100% - 70px);
        .in-node {
          width: 80%;
          display: inline-block;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin-top: 4px;
        }
      }
    }
  }
  .down-right {
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
      line-height: 24px;
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

