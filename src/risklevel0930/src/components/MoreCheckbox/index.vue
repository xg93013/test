<template>
  <el-popover
    popper-class="more-checkbox"
    v-model="visible"
    :visible-arrow="false"
    trigger="click"
    placement="bottom-start"
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
        <div class="fr operation">
          <el-button @click="cancelCheck">取消</el-button>
          <el-button type="primary" @click="getLinks">确定</el-button>
        </div>
      </div>
    </div>
    <div slot="reference">
      <el-input v-model="title" :placeholder="title+'(复选)'" disabled>
        <svg-icon
          iconClass="down"
          slot="suffix"
          style="height: 40px;line-height:40px;margin-right:4px;"
        ></svg-icon>
      </el-input>
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
    }
    // defaultData: {
    //   type: Array,
    //   default: []
    // }
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
    cancelCheck() {
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
      this.visible = false;
    },
    getLinks() {
      // this.outList = [];
      // for (let i = 0; i < this.checkLinksList.length; i++) {
      //   for (let j = 0; j < this.allData.length; j++) {
      //     if (this.allData[j].label == this.checkLinksList[i]) {
      //       this.outList.push(this.allData[j]);
      //       break;
      //     }
      //   }
      // }
      this.visible = false;
      this.$emit("backCheck", this.outList, this.propsName, this.outList);
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
    // console.log(this.allData);
    // if (this.defaultData.length > 0) {
    //   for (let i = 0; i < this.defaultData.length; i++) {
    //     this.checkLinksList.push(this.defaultData[i].label);
    //   }
    // }
  }
};
</script>
<style lang="scss">
.el-checkbox + .el-checkbox {
  margin-left: 0;
}
.more-checkbox .more-select .checkbox-box .el-checkbox {
  width: 100%;
  margin-right: 0;
}
.more-checkbox {
  padding: 0;
  .more-select {
    width: 220px;
    .head {
      width: 100%;
      height: 40px;
      padding: 0 10px;
      line-height: 40px;
      background: #f5f5f5;
      position: relative;
      .links-icon {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
      }
    }
    .checkbox-box {
      overflow: hidden;
      margin: 10px 0;
      .el-checkbox {
        padding: 10px 20px;
      }
    }
    .foot {
      width: 100%;
      overflow: hidden;
      border-top: 1px solid #eee;
      padding: 10px;
    }
  }
  // .popper__arrow {
  //   left: 25px;
  // }
  // .el-input__inner {
  //   width: 100%;
  //   height: 40px;
  //   line-height: 40px;
  //   border-radius: 20px;
  // }
  .el-input__suffix {
    right: 10px;
    line-height: 40px;
  }
}
</style>