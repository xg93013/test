<template>
  <div id="InspectionHistory">
    <div class="commonWidth first">
      <el-form label-width="170px" :model="form" ref="formRefs">
        <div class="tab-item">
          <div>
            <svg-icon iconClass="tips"></svg-icon>
            <span>现场检查当天情况</span>
          </div>
          <div class="result-form">
            <div class="check-item">
              <el-form-item label="企业状态：" prop="enterpriseStatus">
                <el-radio v-model="form.enterpriseStatus" label="正常生产"></el-radio>
                <!-- <el-radio v-model="form.enterpriseStatus" label="半停产"></el-radio> -->
                <!-- <el-radio v-model="form.enterpriseStatus" label="季节性停产"></el-radio> -->
                <!-- <el-radio v-model="form.enterpriseStatus" label="停产"></el-radio> -->
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="tab-item">
          <div>
            <svg-icon iconClass="tips"></svg-icon>
            <span>基本信息</span>
          </div>
          <div class="result-form">
            <el-form-item label="企业名称：" prop="enterpriseName" class="result-item">
              <el-input v-model="form.enterpriseName" disabled class="input-box"></el-input>
            </el-form-item>
            <el-form-item label="企业地址：" prop="enterpriseAddress">
              <el-input v-model="form.enterpriseAddress" class="input-box" disabled></el-input>
            </el-form-item>
            <el-form-item label="营业执照编号：" prop="enterpriseNo">
              <el-input v-model="form.enterpriseNo" class="input-box" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="person">
              <el-input v-model="form.person" class="input-box" disabled></el-input>
            </el-form-item>
            <el-form-item label="食品生产许可证：" prop="produceNo">
              <el-input v-model="form.produceNo" class="input-box" disabled></el-input>
            </el-form-item>
            <el-form-item label="企业上年度风险等级：" prop="riskLevel">
              <el-input v-model="form.riskLevel" class="input-box" disabled></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        enterpriseName: "",
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        produceNo: "",
        riskLevel: "",
        enterpriseStatus: "正常",
        checkDate: "",
        stopDate: "",
        category: ""
      }
    };
  },
  components: {},
  props: {},
  methods: {}
};
</script>
<style lang="scss" scoped>
#InspectionHistory {
  .tab-item {
    width: 50%;
    float: left;
    .result-form {
      margin: 20px 0;
    }
  }
}
</style>