<template>
  <div>
    <el-dialog title="确认提示" :visible.sync="dialogVisible" width="450px">
      <div>
        <p>是否确认删除计划</p>
        <p>{{deletePlanName}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false
    };
  },
  props: {
    topTitle: {},
    msg: {}
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    confirm() {}
  }
};
</script>
<style lang="scss" scope>
</style>

