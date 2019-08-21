<template>
  <el-popover
    popper-class="tree-downlist"
    v-model="visible"
    :visible-arrow="false"
    trigger="click"
    placement="bottom-start"
  >
    <div class="more-select">
      <div class="head">
        <span class="fl">{{title}}</span>
        <svg-icon iconClass="close" class="fr links-icon" @click.native="visible=false"></svg-icon>
      </div>
      <div class="checkbox-box">
        <el-checkbox-group
          v-model="checkLinksList"
          v-for="(item, index) in allData"
          :key="'allcheckbox'+index"
        >
          <el-checkbox :label="item.label"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="foot">
        <div class="fr operation">
          <el-button @click="visible=false">取消</el-button>
          <el-button @click="getLinks">确定</el-button>
        </div>
      </div>
    </div>
    <div slot="reference">
      <el-input v-model="title" :placeholder="title+'（复选）'" disabled>
        <svg-icon iconClass="list" slot="suffix"></svg-icon>
      </el-input>
    </div>
  </el-popover>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      checkLinksList: [],
      outList: []
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
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    getLinks() {
      this.outList = [];
      for (let i = 0; i < this.checkLinksList.length; i++) {
        for (let j = 0; j < this.allData.length; j++) {
          if (this.allData[j].label == this.checkLinksList[i]) {
            this.outList.push(this.allData[j]);
            break;
          }
        }
      }
      this.$emit("backLinks", this.outList, this.propsName);
    },
    reset() {
      this.checkLinksList = [];
      this.outList = [];
    }
  },
  mounted() {
    if (this.defaultData.length > 0) {
      for (let i = 0; i < this.defaultData.length; i++) {
        this.checkLinksList.push(this.defaultData[i].label);
      }
    }
  }
};
</script>
<style lang="scss" scope>
</style>