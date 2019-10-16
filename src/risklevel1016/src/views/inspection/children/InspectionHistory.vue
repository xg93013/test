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
            <span>企业信息</span>
          </div>
          <div class="result-form">
            <el-form-item label="企业名称：" prop="enterpriseName">
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

    <div class="commonWidth">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>现场问题描述</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;"
        ref="historyTableRefs"
        border
        @sort-change="sortChange"
      >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
        ></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span @click="deleteRow(scope.$index, scope.row)">
                <label>清空</label>
                <svg-icon iconClass="delete"></svg-icon>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="commonWidth bot">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>备注</span>
      </div>
      <div class="other-text">
        <div class="label fl">其他问题：</div>
        <div class="content fl">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="others"
            maxlength="300"
            show-word-limit
          ></el-input>
        </div>
      </div>
    </div>
    <div class="commonWidth">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>检查情况签名</span>
      </div>
      <el-form :model="inputForm" label-width="180px" ref="inputFormRefs" :rules="inputFormRules">
        <div class="check-form">
          <div class="check-item">
            <el-form-item label="检查组长签名：" prop="groupName">
              <!-- <el-input v-model="inputForm.groupName"></el-input> -->
              <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload"
                :auto-upload="true"
                v-show="inputForm.groupNameUrl==''"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
              <img
                :src="inputForm.groupNameUrl"
                style="width:100px;"
                v-show="inputForm.groupNameUrl!=''"
              />
            </el-form-item>
            <el-form-item label="检查组员签名：" prop="personName">
              <el-input v-model="inputForm.personName"></el-input>
            </el-form-item>
            <el-form-item label="监管部门检查人员签名：" prop="checkPerson">
              <el-input v-model="inputForm.checkPerson"></el-input>
            </el-form-item>
            <el-form-item label="日期：" prop="dateTime">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.dateTime"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="check-item">
            <el-form-item label="企业负责人意见：" prop="entResult">
              <el-input v-model="inputForm.entResult"></el-input>
            </el-form-item>
            <el-form-item label="企业负责人签名：" prop="entName">
              <el-input v-model="inputForm.entName"></el-input>
            </el-form-item>
            <el-form-item label="日期：" prop="entDatetime">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.entDatetime"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="check-item">
            <el-form-item label="企业负责人签名（企业公章）：" prop="entImgUrl" label-width="240px">
              <div class="ent-img">
                <img :src="inputForm.entImgUrl" alt />
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="commonWidth bot">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button @click="reset">
            <svg-icon iconClass="reset"></svg-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Tips from "@/components/Tips/index";
export default {
  data() {
    return {
      tipContent: "",
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
      },
      inputForm: {
        // imageUrl: '',
        groupNameUrl: "",
        personName: "",
        checkPerson: "",
        dateTime: "",
        entResult: "",
        entName: "",
        entDatetime: "",
        entImgUrl: ""
      },
      inputFormRules: {
        groupName: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        personName: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        checkPerson: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        dateTime: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      },
      tableHeader: [
        {
          prop: "",
          label: "",
          width: "",
          align: "",
          sortable: false
        }
      ],
      tableData: [],
      others: ""
    };
  },
  components: {
    Tips
  },
  props: {},
  methods: {
    showTips() {
      // this.$refs.tipsRefs.show();
    },
    sortChange() {},
    deleteRow(index, row) {},
    save() {},
    reset() {},
    handlePreview(file) {
      console.log(file);
    },
    handleRemove() {},
    handleSuccess(res, file) {
      console.log(URL.createObjectURL(file.raw));
      this.inputForm.groupNameUrl = URL.createObjectURL(file.raw);
      // this.showResult(URL.createObjectURL(file.raw));
    },
    beforeAvatarUpload(file) {
      let allTypes = ["image/jpeg", "image/jpg", "image/png"];
      let isInType = allTypes.includes(file.type);
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isInType) {
        this.$message.error("上传图片格式不允许！");
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      return isInType && isLt20M;
    }
  }
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
  .check-form {
    width: 100%;
    overflow: hidden;
    margin: 20px auto;
    .check-item {
      width: 33%;
      float: left;
      .ent-img {
        width: 100px;
        height: 100px;
        img {
          width: 100%;
          // height: 100%;
        }
      }
    }
  }
}
</style>