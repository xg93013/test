<template>
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
        <div class="nums fl">20/1000</div>
        <span class="clear-empty fr" @click="clearTreeCheck">清空</span>
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
        <el-button>取消</el-button>
        <el-button @click="getCheckedNodes">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyWord: "",
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                  children: [
                    {
                      id: 11,
                      label: "四级 1-1-1"
                    }
                  ]
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 20,
          label: "一级 2",
          children: [
            {
              id: 22,
              label: "二级 2-1"
            },
            {
              id: 24,
              label: "二级 2-2"
            },
            {
              id: 25,
              label: "二级 2-1"
            },
            {
              id: 26,
              label: "二级 2-2"
            },
            {
              id: 27,
              label: "二级 2-1"
            }
          ]
        }
      ],
      checkList: [],
      selectIndex: 0,
      currentNode: ""
    };
  },
  watch: {
    keyWord(val) {
      this.$refs.treeRefs.filter(val);
    }
  },
  computed: {},
  created() {},
  methods: {
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
    getCheckedNodes() {
      // console.log(this.$refs.treeRefs.getCheckedNodes());
    },
    check(node, current) {
      let currentNodes = this.$refs.treeRefs.getNode(node.id);
      if (currentNodes.childNodes && currentNodes.childNodes.length > 0) {
        for (let i = 0; i < currentNodes.childNodes.length; i++) {
          if (currentNodes.childNodes[i].childNodes.length > 0) {
            this.check(currentNodes.childNodes[i].data);
          } else {
            this.formatNode(currentNodes.childNodes[i]);
          }
        }
        // console.log(currentNodes);
        // this.formatNode(currentNodes, true);
      } else {
        this.formatNode(currentNodes);
      }
    },
    checka(node, current) {
      let currentNodes = this.$refs.treeRefs.getNode(node.id);
      this.formatNodea(currentNodes);
    },

    deleteAllNode() {},

    formatNode(node) {
      this.deleteNode(node.data.id);
      // if (!all) {
      if (node.checked) {
        this.checkList.push({
          id: node.data.id,
          name: this.addName(node, "")
        });
      }
      // } else {
      //   if (node.checked) {
      //     this.checkList.push({
      //       id: node.data.id,
      //       name: this.addName(node, "") + "/全部"
      //     });
      //   }
      // }
    },
    formatNodea(node) {
      this.deleteNode(node.data.id);
      if (node.checked) {
        this.checkList.push({
          id: node.data.id,
          node: node,
          name: node.data.label
        });
      }
      console.log(this.checkList);
    },
    deleteNode(id) {
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].id === id) {
          this.checkList.splice(i, 1);
          return;
        }
      }
    },
    addName(node, name) {
      console.log(node);
      if (node.level == 1) {
        return node.data.label + "/" + name;
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
    },
    clearTreeCheck() {
      for (let i = 0; i < this.checkList.length; i++) {
        this.$refs.treeRefs.setChecked(this.checkList[i].id, false, true);
      }
      this.checkList = [];
    },
    getCheckedNodes() {
      console.log(this.$refs.treeRefs.getCheckedNodes());
    },
    nodeClick(data, node, current) {
      // console.log(node);
      // this.currentNode = node;
      // this.formatNodea(node);
      // this.type = node.data.type;
    }
  },
  mounted() {
    this.currentNode = this.$refs.treeRefs.getNode(this.data[0].id);
  }
};
</script>
<style lang="scss" scoped>
#down-tree {
  background: #fff;
  padding: 20px;
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
      max-height: 300px;
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

