<template>
  <div>
    <el-dialog
      title
      :visible.sync="visible"
      width="700px"
      :append-to-body="true"
      custom-class="dialogDiv"
      @closed="handleClose"
    >
      <div>
        <div v-for="(item, index) in defaultList" :key="index+'sorta'" class="items start">
          <span class="left">显示</span>
          <span class="mid">列名</span>
          <span class="right">拖动排序</span>
        </div>
        <div v-for="item in defaultList" :key="item.prop+'sorta'" class="items disabled">
          <span class="left">
            <el-checkbox v-model="item.show" disabled :checked="true"></el-checkbox>
          </span>
          <span class="mid">{{item.label}}</span>
          <span class="right">
            <svg-icon iconClass="list"></svg-icon>
          </span>
        </div>

        <draggable v-model="sortList" group="people" @update="onEnd" :options="{animation:300}">
          <div v-for="item in sortList" :key="item.prop+'drag'" :name="item.label" class="items">
            <span class="left">
              <el-checkbox v-model="item.show"></el-checkbox>
            </span>
            <span class="mid">{{item.label}}</span>
            <span class="right">
              <svg-icon iconClass="list"></svg-icon>
            </span>
          </div>
        </draggable>
      </div>
      <div slot="title" class="dialog-title">
        <p class="big">自定义显示列项</p>
        <p>列项显示不得少于5项，最多支持自定义10个列项，灰色选中列不支持隐藏和排序</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <span @click="setDefault" class="set-default">恢复默认</span>
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
    }
  },
  watch: {
    list(a) {
      this.originList = [...a];
      this.setDefault();
      console.log("a");
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
      this.$emit("changeHeader", arr);
    },
    handleClose() {
      this.setDefault();
    },
    handleCancel() {
      this.visible = false;
    },
    setDefault() {
      let arr = deepClone(this.list);
      this.defaultList = [];
      this.sortList = [];
      arr.forEach(item => {
        if (item.notSort) {
          this.defaultList.push(item);
        } else {
          this.sortList.push(item);
        }
      });
      console.log(this.list);
    }
  },
  mounted() {
    this.setDefault();
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
}
</style>


