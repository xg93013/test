<template>
  <div>
    <el-dialog title="提示" :visible.sync="visible" custom-class="radio-tree">
      <div class="tree-select">
        <div class="left">
          <div class="tree-top">
            <el-input v-model="keyWord" class="tree-search">
              <svg-icon iconClass="search" slot="suffix"></svg-icon>
            </el-input>
          </div>
          <div class="tree-content">
            <el-tree
              :data="data"
              node-key="id"
              :filter-node-method="filterNode"
              default-expand-all
              :expand-on-click-node="false"
              ref="treeRefs"
            >
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <el-radio
                  v-model="radioValue"
                  :label="node.data.id"
                  class="radios"
                  v-if="node.level!=1"
                  @change="changeRadio"
                >{{node.label}}</el-radio>
                <span v-else>{{node.label}}</span>
              </div>
            </el-tree>
          </div>
        </div>
        <div class="right">
          <div class="tree-top">
            <div class="tree-title">量化分值详情</div>
          </div>
          <div class="tree-content">
            <div class="detail">
              <p>
                <label class="title">食品风险等级：</label>
                <label>{{currentNode.riskLevel}}</label>
              </p>
              <p>
                <label class="title">得分（S）：</label>
                <label class="cColor">{{currentNode.score}}</label>
              </p>
              <p>
                <label class="title">品种明细：</label>
              </p>
              <p class="des">{{currentNode.detail}}</p>
            </div>
          </div>
          <div class="operation">
            <el-button @click="visible=false">取消</el-button>
            <el-button @click="getCheckedNodes" type="primary">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      visible: false,
      keyWord: "",
      radioValue: "",
      placeholder: "",
      currentNode: {
        level: "I",
        score: 15,
        detail: "详细"
      }
    };
  },
  watch: {
    keyWord(val) {
      this.$refs.treeRefs.filter(val);
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  created() {},
  methods: {
    open() {
      this.visible = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      console.log("asds");
      return data.label.indexOf(value) !== -1;
    },
    changeRadio() {
      let data = this.data[0].children;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == this.radioValue) {
          this.currentNode = data[i];
        }
      }
    },
    getCheckedNodes() {
      // console.log(this.currentNode);
      this.visible = false;
      this.$emit("getRadioTree", this.currentNode);
    }
  }
};
</script>

<style lang="scss">
.radio-tree {
  padding: 0;
  .tree-select {
    // width: 750px;
    overflow: hidden;
    .left,
    .right {
      width: 50%;
      overflow: auto;
      float: left;
      .tree-top {
        width: 100%;
        height: 40px;
        overflow: hidden;
        .tree-search,
        .tree-title {
          display: block;
          width: 80%;
          // margin: 10px auto;
        }
        .tree-title {
          line-height: 40px;
          margin-left: 20px;
          font-weight: bold;
          font-size: 16px;
        }
      }
      .tree-content {
        height: 300px;
        overflow-y: auto;
        .detail {
          box-sizing: border-box;
          padding: 15px;
          margin: 20px;
          border-radius: 4px;
          background: #dceeff;
          border: 1px solid #abcdff;
          .title {
            font-weight: bold;
            color: #666;
            line-height: 30px;
          }
          .des {
            color: #999;
          }
        }
      }
    }
    .right {
      .operation {
        overflow: hidden;
        float: right;
      }
    }
  }

  .custom-tree-node {
    overflow: hidden;
    .el-radio__input {
      float: left;
      margin: 4px 4px 0 0;
    }
    .el-radio__label {
      display: block;
      float: left;
      width: 50px;
      margin: 4px 0 0 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .el-input__inner {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
  }
  .el-input__suffix {
    right: 10px;
    line-height: 40px;
  }
}
</style>