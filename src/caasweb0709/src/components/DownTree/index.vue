<template>
  <div id="down-tree">
    <div class="left fl">
      <el-input v-model="keyWord"></el-input>
      <el-tree
        ref="treeRefs"
        :data="data"
        node-key="id"
        :check-strictly="true"
        :filter-node-method="filterNode"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
        @check-change="checkChange"
        @check="checka"
        @node-click="nodeClick"
      ></el-tree>
      <!-- show-checkbox -->
      <!-- :check-strictly="true" -->
    </div>
    <div class="right fl">
      <div class="item" v-for="(item,index) in checkList" :key="'treenode'+index">
        {{item.name}}
        <span @click="removeCheck(item.id)">
          <svg-icon iconClass="close"></svg-icon>
        </span>
      </div>
    </div>
    <el-button @click="clearTreeCheck">清空</el-button>
    <el-button @click="getCheckedNodes">选中节点</el-button>
    <el-button @click="addNodes">添加节点</el-button>
    <el-button @click="addBu">{{btnTxt}}</el-button>
    <div v-show="type=='a'">
      <el-form ></el-form>
    </div>
    <div v-show="type=='b'">修改组</div>
    <div v-show="type=='c'">修改人员</div>
    <div v-show="type=='d'"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyWord: "",
      // data: [
      //   {
      //     id: 1,
      //     label: "一级 1",
      //     children: [
      //       {
      //         id: 4,
      //         label: "二级 1-1",
      //         children: [
      //           {
      //             id: 9,
      //             label: "三级 1-1-1",
      //             children: [
      //               {
      //                 id: 11,
      //                 label: "四级 1-1-1"
      //               }
      //             ]
      //           },
      //           {
      //             id: 10,
      //             label: "三级 1-1-2"
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     id: 2,
      //     label: "一级 2",
      //     children: [
      //       {
      //         id: 5,
      //         label: "二级 2-1"
      //       },
      //       {
      //         id: 6,
      //         label: "二级 2-2"
      //       }
      //     ]
      //   }
      // ],
      data: [
        {
          id: 1,
          label: "部门",
          type: "a",
          children: [
            {
              id: 2,
              label: "组a",
              type: "b",
              children: [
                {
                  id: 2,
                  label: "员a",
                  type: "c"
                },
                {
                  id: 3,
                  label: "员b",
                  type: "c"
                }
              ]
            },
            {
              id: 3,
              label: "组b",
              type: "b"
            }
          ]
        }
      ],
      checkList: [],
      currentNode: "",
      allTypes: ["a", "b", "c", "d"],
      type: "a"
    };
  },
  watch: {
    keyWord(val) {
      this.$refs.treeRefs.filter(val);
    }
  },
  computed: {
    btnTxt() {
      let name = "";
      switch (this.type) {
        case "a":
          name = "添加zu";
          break;
        case "b":
          name = "添加zu2";
          break;
        case "c":
          name = "添加zu3";
          break;
        case "d":
          name = "添加zu4";
          break;
      }
      return name;
    }
  },
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
    checkChange(node, check, flag) {
      // console.log(node);
      // console.log(check);
      // console.log(flag);
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
      } else {
        this.formatNode(currentNodes);
      }
    },
    checka(node, current) {
      let currentNodes = this.$refs.treeRefs.getNode(node.id);
      this.formatNodea(currentNodes);
    },
    formatNode(node) {
      this.deleteNode(node.data.id);
      if (node.checked) {
        this.checkList.push({
          id: node.data.id,
          name: this.addName(node, "")
        });
      }
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
      if (node.parent == null) {
        return name;
      }
      let resName = node.data.label + name;
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
      this.currentNode = node;
      this.formatNodea(node);
      this.type = node.data.type;
    },
    addNodes() {
      // this.$refs.treeRefs.append(
      //   {
      //     id: 20,
      //     label: "XX部门"
      //   },
      //   this.currentNode
      // );
      this.currentNode.data.label = "aaaaaaaa";
      // this.$refs.treeRefs.insertAfter(
      //   {
      //     id: 20,
      //     label: "XX部门"
      //   },
      //   this.currentNode
      // );
      this.$refs.treeRefs.setCurrentNode(this.currentNode);
    },
    addBu() {
      this.data.push({
        id: 1,
        label: "a",
        type: "a"
      });
      let index = this.allTypes.indexOf(this.type);
      this.$refs.treeRefs.append(
        {
          id: 22,
          type: this.allTypes[index + 1],
          label: "员bbbbbb"
        },
        this.currentNode
      );
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
  .left,
  .right {
    width: 300px;
  }
  .left {
  }
}
</style>

