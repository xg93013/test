<template>
  <el-popover
    popper-class="tree-downlist"
    v-model="visible"
    :visible-arrow="false"
    trigger="click"
    :placement="placement"
    @hide="hideBox"
  >
    <div class="more-select">
      <div class="checkbox-box">
        <el-checkbox
          v-model="item.checked"
          v-for="(item, index) in allCheckbox"
          :key="'allcheckbox'+index"
          @change="changeCheckBox"
        >{{item.label}}</el-checkbox>
      </div>
      <div class="foot">
        <div class="operation">
          <el-button @click="cancelCheck">取消</el-button>
          <el-button type="primary" @click="getLinks">确定</el-button>
        </div>
      </div>
    </div>
    <div slot="reference">
      <div class="show-text">
        <span class="text">{{title}}</span>
        <svg-icon
          iconClass="down"
          style="float:right;height:40px;line-height:40px;margin-right:10px;margin-left:5px;"
        ></svg-icon>
      </div>
    </div>
  </el-popover>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      allCheckbox: [],
      checkLinksList: [],
      outList: [],
      prevDatas: []
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    allData: {
      type: Array,
      default: []
    },
    propsName: {
      type: String,
      default: ""
    },
    defaultData: {
      type: Array,
      default: []
    },
    placement: {
      type: String,
      default: ""
    }
  },
  watch: {
    allData(a) {
      // if (a.length > 0) {
      // }
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    getAllCheckBox() {
      let arr = [];
      for (let i = 0; i < this.allData.length; i++) {
        arr.push({
          id: this.allData[i].id,
          label: this.allData[i].label,
          checked: false
        });
      }
      this.allCheckbox = arr;
    },
    changeCheckBox() {
      this.outList = [];
      for (let i = 0; i < this.allCheckbox.length; i++) {
        if (this.allCheckbox[i].checked) {
          this.outList.push(this.allCheckbox[i]);
        }
      }
    },
    getLinks() {
      this.prevDatas = [...this.outList];
      this.visible = false;
      this.$emit("backLinks", this.outList, this.propsName, this.outList);
    },
    cancelCheck() {
      this.hideBox();
      this.visible = false;
    },
    hideBox() {
      if (this.prevDatas.length > 0) {
        for (let i = 0; i < this.allCheckbox.length; i++) {
          this.allCheckbox[i].checked = false;
        }
        for (let i = 0; i < this.prevDatas.length; i++) {
          for (let j = 0; j < this.allCheckbox.length; j++) {
            if (this.prevDatas[i].id == this.allCheckbox[j].id) {
              this.allCheckbox[j].checked = true;
            }
          }
        }
      } else {
        for (let i = 0; i < this.allCheckbox.length; i++) {
          this.allCheckbox[i].checked = false;
        }
      }
    },
    reset() {
      for (let i = 0; i < this.allCheckbox.length; i++) {
        if (this.allCheckbox[i].checked) {
          this.allCheckbox[i].checked = false;
        }
      }
      this.outList = [];
      this.prevDatas = [];
    }
  },
  mounted() {
    this.getAllCheckBox();
  }
};
</script>
<style lang="scss">
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.tree-downlist .more-select .checkbox-box .el-checkbox {
  width: 100%;
  margin-right: 0;
}
.show-text {
  width: 100%;
  height: 40px;
  padding: 0 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  color: #999;
  overflow: hidden;
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  .text {
    margin-left: 10px;
    line-height: 1;
  }
}
</style>