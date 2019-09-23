<template>
  <div id="EnterpriseStatus">
    <el-form label-width="170px" :model="form" :rules="formRules" ref="formRefs">
      <div class="commonWidth" style="margin:2px auto;">
        <div>
          <svg-icon iconClass="tips"></svg-icon>
          <span>现场检查当天情况</span>
        </div>
        <div class="check-status">
          <div class="check-item">
            <el-form-item label="企业状态：" prop="enterpriseStatus">
              <el-radio v-model="form.enterpriseStatus" label="正常生产"></el-radio>
              <el-radio v-model="form.enterpriseStatus" label="半停产"></el-radio>
              <el-radio v-model="form.enterpriseStatus" label="季节性停产"></el-radio>
              <el-radio v-model="form.enterpriseStatus" label="停产"></el-radio>
            </el-form-item>
          </div>
          <div class="check-item">
            <el-form-item label="停产日期" prop="stopDate" v-if="form.enterpriseStatus=='停产'">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="form.stopDate"
                style="width: 60%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>~今天
            </el-form-item>
            <el-form-item label="类别信息" prop="stopCategory" v-else></el-form-item>
          </div>
        </div>
      </div>
      <div class="commonWidth">
        <div>
          <svg-icon iconClass="tips"></svg-icon>
          <span>基本信息</span>
        </div>
        <div class="result-form">
          <el-form-item label="企业名称：" prop="enterpriseName" class="result-item">
            <el-input v-model="form.enterpriseName" disabled class="input-box"></el-input>
            <el-checkbox
              v-model="form.enterpriseNameChecked"
              class="check-box"
            >{{form.enterpriseNameChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box">
              <el-input v-model="checkForm.enterpriseName" placeholder="请输入企业名称"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="企业地址：" prop="enterpriseAddress">
            <el-input v-model="form.enterpriseAddress" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="form.enterpriseAddressChecked"
              class="check-box"
            >{{form.enterpriseAddressChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box">
              <el-input v-model="checkForm.enterpriseAddress" placeholder="请输入企业地址"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="营业执照编号：" prop="enterpriseNo">
            <el-input v-model="form.enterpriseNo" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="form.enterpriseNoChecked"
              class="check-box"
            >{{form.enterpriseNoChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box">
              <el-input v-model="checkForm.enterpriseNo" placeholder="请输入营业执照编号"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="联系人：" prop="person">
            <el-input v-model="form.person" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="form.personChecked"
              class="check-box"
            >{{form.personChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box">
              <div class="form-item" v-for="(item, index) in persons" :key="'persons'+index">
                <div class="left-item">
                  <el-input v-model="item.name" class="person-name" placeholder="请输入联系人"></el-input>
                  <el-input v-model="item.phone" class="person-phone" placeholder="请输入联系方式"></el-input>
                </div>
                <div class="icons" v-show="index<persons.length&&index!=0">
                  <svg-icon iconClass="delete" @click.native="deletePerson(index)"></svg-icon>
                </div>
                <div class="icons" v-show="persons.length-1==index">
                  <svg-icon iconClass="add" @click.native="addPerson"></svg-icon>
                </div>
              </div>
            </div>
          </el-form-item>
          <!-- <el-checkbox
              v-model="form.produceNoChecked"
              class="check-box"
            >{{form.produceNoChecked?'补充':'正确'}}</el-checkbox>
            <div class="edit-box" v-show="form.produceNoChecked">
              <el-input v-model="checkForm.produceNo" placeholder="请输入食品生产许可证"></el-input>
          </div>-->
          <el-form-item label="食品生产许可证：" prop="produceNo">
            <el-input v-model="form.produceNo" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="form.produceNoChecked"
              class="check-box"
            >{{form.produceNoChecked?'补充':'正确'}}</el-checkbox>
            <div class="edit-box">
              <el-input
                v-model="checkForm.produceNo"
                placeholder="请输入食品生产许可证"
                @change="changeProduceNo"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="企业上年度风险等级：" prop="riskLevel">
            <el-input v-model="form.riskLevel" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="form.riskLevelChecked"
              class="check-box"
            >{{form.riskLevelChecked?'修正':'正确'}}</el-checkbox>

            <div class="edit-box">
              <div class="form-item">
                <div class="left-item">
                  <!-- <el-input v-model="checkForm.enterpriseName"></el-input> -->
                  <el-select
                    v-model="checkForm.riskLevel"
                    placeholder="请选择企业上年度风险等级"
                    style="width:100%;"
                  >
                    <el-option label="A" value="A"></el-option>
                  </el-select>
                </div>
                <div class="icons">
                  <svg-icon iconClass="down"></svg-icon>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
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
export default {
  data() {
    return {
      form: {
        enterpriseName: "",
        enterpriseNameChecked: false,
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        produceNo: "",
        riskLevel: "",
        enterpriseStatus: "",
        checkDate: "",
        stopDate: ""
      },
      checkForm: {
        enterpriseName: "",
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        produceNo: "",
        riskLevel: "",
        enterpriseStatus: "",
        checkDate: "",
        stopDate: ""
      },
      formRules: {
        enterpriseName: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        enterpriseAddress: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        enterpriseNo: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        person: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        produceNo: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        riskLevel: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        enterpriseStatus: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        checkDate: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      },
      persons: [
        {
          name: "",
          phone: ""
        }
      ]
    };
  },
  created() {
    this.form = {
      enterpriseName: "as",
      enterpriseNameChecked: false,
      enterpriseAddress: "dd",
      enterpriseNo: "asd",
      person: "a",
      produceNo: "",
      riskLevel: "a",
      enterpriseStatus: "s",
      checkDate: "",
      stopDate: ""
    };
  },
  methods: {
    addPerson() {
      this.persons.push({
        name: "",
        phone: ""
      });
    },
    deletePerson(index) {
      this.persons.splice(index, 1);
    },
    changeProduceNo() {
      this.form.produceNo = this.checkForm.produceNo;
    },
    save() {
      let resultForm = { ...this.form };
      // console.log(this.checkForm);
      for (let key in this.checkForm) {
        // if (key == person) {
        // }
        if (this.checkForm[key] != "") {
          resultForm[key] = this.checkForm[key];
        }
      }
      console.log(resultForm);
    },
    reset() {}
  }
};
</script>
<style lang="scss" scoped>
#EnterpriseStatus {
  .check-status {
    width: 100%;
    overflow: hidden;
    .check-item {
      width: 50%;
      margin-top: 20px;
      float: left;
    }
  }
  .result-form {
    margin: 20px 0;
    overflow: hidden;
    .result-item {
      overflow: hidden;
    }
    .el-input {
      width: 400px;
    }
    .el-checkbox {
      margin: 0 20px;
    }
    .input-box,
    .check-box,
    .edit-box {
      float: left;
      // margin: 0 5px;
      .el-input {
        width: 100%;
      }
    }
    .edit-box {
      width: 400px;
      .person-name {
        width: 100px;
      }
      .person-phone {
        width: 200px;
        border-left: 1px solid #eee;
      }
      .icons {
        cursor: pointer;
      }
    }
  }
}
</style>