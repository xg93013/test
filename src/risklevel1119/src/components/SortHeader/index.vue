<template>
  <div>
    <el-dialog
      title
      :visible.sync="visible"
      width="700px"
      :append-to-body="true"
      custom-class="dialogDiv"
      @close="handleClose"
    >
      <div class="drag-box">
        <div class="items start">
          <span class="left">显示</span>
          <span class="mid">列名</span>
          <span class="right">拖动排序</span>
        </div>
        <div class="drag-list">
          <div v-for="(item, index) in defaultList" :key="index+'sorta'" class="items disabled">
            <span class="left">
              <el-checkbox v-model="item.selected" disabled :checked="true"></el-checkbox>
            </span>
            <span class="mid">{{item.label}}</span>
            <span class="right">
              <svg-icon iconClass="list"></svg-icon>
            </span>
          </div>

          <draggable v-model="sortList" group="people" @update="onEnd" :options="{animation:300}">
            <div v-for="item in sortList" :key="item.prop+'drag'" :name="item.label" class="items">
              <span class="left">
                <el-checkbox v-model="item.selected"></el-checkbox>
              </span>
              <span class="mid">{{item.label}}</span>
              <span class="right">
                <svg-icon iconClass="list"></svg-icon>
              </span>
            </div>
          </draggable>
        </div>
      </div>
      <div slot="title" class="dialog-title">
        <p class="big">自定义显示列项</p>
        <p>列项显示不得少于5项，灰色选中列不支持隐藏和排序</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <span @click="setDefault(true)" class="set-default">恢复默认</span>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from "@/utils/index.js";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      visible: false,
      originList: [],
      defaultList: [],
      sortList: []
    };
  },
  components: {
    draggable
  },
  props: {
    list: {
      type: Array,
      default: []
    },
    defaultHeader: {
      type: Array,
      default: []
    }
  },
  watch: {
    list(a) {
      this.originList = [...a];
      this.setDefault(false);
      // console.log("a");
    }
  },
  methods: {
    openDialog() {
      this.visible = true;
    },
    onEnd() {},
    handleConfirm() {
      this.visible = false;
      let arr = this.defaultList.concat(this.sortList);
      let selectLen = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].selected) {
          selectLen++;
        }
      }
      if (selectLen < 5) {
        this.$message.warning("列项不得少于5项！");
      } else {
        this.$emit("changeHeader", arr);
      }
    },
    handleClose() {
      this.setDefault(false);
    },
    handleCancel() {
      this.visible = false;
    },
    setDefault(flag) {
      let arr = flag ? deepClone(this.defaultHeader) : deepClone(this.list);
      this.defaultList = [];
      this.sortList = [];
      arr.forEach(item => {
        if (item.notSort) {
          this.defaultList.push(item);
        } else {
          this.sortList.push(item);
        }
      });
      // console.log(this.list);
    }
  },
  mounted() {
    this.setDefault(false);
  }
};
</script>
<style lang="scss" scoped>
.dialogDiv {
  .items {
    // width: 100%;
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    .left {
      flex: 0 0 50px;
      text-align: left;
      padding-left: 10px;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }
    .mid {
      flex: 1;
      padding-left: 10px;
      border-right: 1px solid #eee;
    }
    .right {
      flex: 0 0 80px;
      text-align: center;
      border-right: 1px solid #eee;
    }
  }
  .start {
    border-top: 1px solid #eee;
    background: #f5f5f5;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
  }
  .disabled {
    cursor: not-allowed;
  }

  .dialog-title {
    font-size: 12px;
    .big {
      font-size: 16px;
      margin-bottom: 4px;
    }
  }
  .set-default {
    float: left;
    margin: 10px 0 0 0;
    cursor: pointer;
  }
  .drag-box {
    position: relative;
    // overflow: auto;
    height: 400px;
    .drag-list {
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      max-height: 350px;
      overflow: auto;
    }
  }
}
</style>


