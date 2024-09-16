<template>
  <div id="TaskDocApproval">
    <!-- <div class="box"> -->
    <el-form class="box" :model="form" label-width="100px">
      <div class="item">
        <el-form-item label="审批结果：" prop="result">
          <template>
            <div>
              <el-input v-model="form.result" disabled></el-input>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="审批人员：" prop="person">
          <template>
            <div>
              <el-input v-model="form.person" disabled></el-input>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="审批日期：" prop="date">
          <template>
            <div>
              <el-date-picker
                type="date"
                placeholder="请选择检查日期"
                v-model="form.date"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                disabled
              ></el-date-picker>
            </div>
          </template>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="备注信息：" prop="remarks">
          <template>
            <div>
              <el-input type="textarea" rows="4" v-model="form.remarks" disabled></el-input>
            </div>
          </template>
        </el-form-item>
      </div>
    </el-form>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        result: "aa",
        person: "aa",
        date: "2018-02-02",
        remarks: ""
      }
    };
  }
};
</script>
<style lang="scss" scoped>
#TaskDocApproval {
  padding: 20px;
  .box {
    width: 100%;
    overflow: hidden;
    .item {
      width: 50%;
      float: left;
    }
  }
}
</style>