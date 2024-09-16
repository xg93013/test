<template>
  <div id="EnterpriseStatus">
    <el-form label-width="170px" :model="form" :rules="formRules" ref="formRefs">
      <div class="commonWidth first">
        <div>
          <svg-icon iconClass="tips"></svg-icon>
          <span>现场检查当天情况</span>
        </div>
        <div class="check-status">
          <div class="check-item">
            <el-form-item label="企业状态：" prop="enterpriseStatus">
              <el-radio v-model="form.enterpriseStatus" label="NORMAL">正常生产</el-radio>
              <el-radio v-model="form.enterpriseStatus" label="SEMI_SHUTDOWN">半停产</el-radio>
              <el-radio v-model="form.enterpriseStatus" label="SEASON_SHUTDOWN">季节性停产</el-radio>
              <el-radio v-model="form.enterpriseStatus" label="SHUTDOWN">停产</el-radio>
            </el-form-item>
          </div>
          <div class="check-item">
            <el-form-item
              label="停产日期"
              prop="stopDate"
              v-if="form.enterpriseStatus=='SHUTDOWN'"
              label-width="100px"
            >
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="form.stopDate"
                style="width: 60%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>~今天
            </el-form-item>
            <el-form-item label="类别信息" prop="category" label-width="100px" v-else>
              <el-input v-model="form.category" style="width:360px;"></el-input>
            </el-form-item>
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
              v-model="checkbox.enterpriseNameChecked"
              class="check-box"
            >{{checkbox.enterpriseNameChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box">
              <el-input v-model="checkForm.enterpriseName" placeholder="请输入企业名称"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="企业地址：" prop="enterpriseAddress">
            <el-input v-model="form.enterpriseAddress" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="checkbox.enterpriseAddressChecked"
              class="check-box"
            >{{checkbox.enterpriseAddressChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box">
              <el-input v-model="checkForm.enterpriseAddress" placeholder="请输入企业地址"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="营业执照编号：" prop="enterpriseNo">
            <el-input v-model="form.enterpriseNo" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="checkbox.enterpriseNoChecked"
              class="check-box"
            >{{checkbox.enterpriseNoChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box">
              <el-input v-model="checkForm.enterpriseNo" placeholder="请输入营业执照编号"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="联系人：" prop="person">
            <el-input v-model="form.person" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="checkbox.personChecked"
              class="check-box"
            >{{checkbox.personChecked?'修正':'正确'}}</el-checkbox>
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
            <div class="error" v-show="phoneError">
              <svg-icon iconClass="error"></svg-icon>请填写正确联系人信息！
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
              v-model="checkbox.produceNoChecked"
              class="check-box"
            >{{checkbox.produceNoChecked?'补充':'正确'}}</el-checkbox>
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
              v-model="checkbox.riskLevelChecked"
              class="check-box"
            >{{checkbox.riskLevelChecked?'修正':'正确'}}</el-checkbox>

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
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { TASKS_TASK } = apis;
export default {
  data() {
    var _this = this;
    var enterpriseNameValidator = (rule, value, callback) => {
      if (
        _this.form.enterpriseName == "" &&
        _this.checkForm.enterpriseName == ""
      ) {
        callback(new Error("请输入企业名称!"));
      } else {
        callback();
      }
    };
    var enterpriseAddressValidator = (rule, value, callback) => {
      if (
        _this.form.enterpriseAddress == "" &&
        _this.checkForm.enterpriseAddress == ""
      ) {
        callback(new Error("请输入企业地址！"));
      } else {
        callback();
      }
    };
    var enterpriseNoValidator = (rule, value, callback) => {
      if (_this.form.enterpriseNo == "" && _this.checkForm.enterpriseNo == "") {
        callback(new Error("请输入企业营业执照编码！"));
      } else {
        callback();
      }
    };
    var personValidator = (rule, value, callback) => {
      if (_this.form.person == "" && _this.persons[0].name == "") {
        callback(new Error("请输入企业联系人！"));
      } else {
        callback();
      }
    };
    var produceNoValidator = (rule, value, callback) => {
      if (_this.form.produceNo == "" && _this.checkForm.produceNo == "") {
        callback(new Error("请输入食品生产许可证！"));
      } else {
        callback();
      }
    };
    var riskLevelValidator = (rule, value, callback) => {
      if (_this.form.riskLevel == "" && _this.checkForm.riskLevel == "") {
        callback(new Error("请选择企业年度风险等级！"));
      } else {
        callback();
      }
    };
    var stopDateValidator = (rule, value, callback) => {
      if (_this.form.enterpriseStatus == "停产") {
        if (!value) {
          callback(new Error("请输入计划名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var categoryValidator = (rule, value, callback) => {
      if (_this.form.enterpriseStatus != "停产") {
        if (!value) {
          callback(new Error("请输入计划名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      form: {
        enterpriseName: "",
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        produceNo: "",
        riskLevel: "",
        enterpriseStatus: "",
        checkDate: "",
        stopDate: "",
        category: ""
      },
      checkbox: {
        enterpriseNameChecked: false,
        enterpriseAddressChecked: false,
        enterpriseNoChecked: false,
        enterpriseNoChecked: false,
        personChecked: false,
        produceNoChecked: false,
        riskLevelChecked: false
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
        stopDate: "",
        category: ""
      },
      formRules: {
        enterpriseName: [
          {
            required: true,
            validator: enterpriseNameValidator,
            trigger: "change"
          }
        ],
        enterpriseAddress: [
          {
            required: true,
            validator: enterpriseAddressValidator,
            trigger: "change"
          }
        ],
        enterpriseNo: [
          {
            required: true,
            validator: enterpriseNoValidator,
            trigger: "change"
          }
        ],
        person: [
          {
            required: true,
            validator: personValidator,
            trigger: "change"
          }
        ],
        produceNo: [
          {
            required: true,
            validator: produceNoValidator,
            trigger: "change"
          }
        ],
        riskLevel: [
          {
            required: true,
            validator: riskLevelValidator,
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
        ],
        stopDate: [
          {
            required: true,
            message: "请选择",
            validator: stopDateValidator,
            trigger: "change"
          }
        ],
        category: [
          {
            required: true,
            message: "请选择",
            validator: categoryValidator,
            trigger: "change"
          }
        ]
      },
      persons: [
        {
          name: "",
          phone: ""
        }
      ],
      phoneError: false
    };
  },
  created() {
    this.form = {
      enterpriseName: "",
      enterpriseAddress: "",
      enterpriseNo: "",
      person: "",
      produceNo: "",
      riskLevel: "",
      enterpriseStatus: "",
      checkDate: "",
      stopDate: ""
    };
    this.getDefaultData();
  },
  taskId: {
    type: Number,
    default: 0
  },
  computed: {},
  methods: {
    async getDefaultData() {
      let res = await http.get(TASKS_TASK + "/1202");
      if (res) {
        if (res.data.code == 0) {
          this.persons = [];
          let data = res.data.data;
          this.form = {
            enterpriseName: data.enterpriseName,
            enterpriseAddress: data.enterpriseAddress,
            enterpriseNo: data.businessLicense,
            person: "xg,13452440502;bb,13452440000",
            produceNo: data.productCategory,
            riskLevel: data.pre_risk_level,
            enterpriseStatus: data.enterpriseStatus,
            checkDate: "",
            stopDate: ""
          };
          let contact = "xg,13452440502;bb,13452440000";
          let contactList = contact.split(";");

          for (let i = 0; i < contactList.length; i++) {
            let person = contactList[i].split(",");
            this.persons.push({
              name: person[0],
              phone: person[1]
            });
          }
        }
      }
    },
    checkPerson() {
      let flag = false;
      let name = this.persons[this.persons.length - 1].name;
      let phone = this.persons[this.persons.length - 1].phone;
      let phongReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      for (let i = 0; i < this.persons.length; i++) {
        let inputFlag =
          name == this.persons[i].name && phone == this.persons[i].phone;
        if (
          this.persons[i].name == "" ||
          !phongReg.test(this.persons[i].phone || inputFlag)
        ) {
          flag = true;
          return flag;
        }
      }
      return flag;
    },
    addPerson() {
      this.phoneError = this.checkPerson();
      console.log(this.phoneError);
      if (!this.phoneError) {
        this.persons.push({
          name: "",
          phone: ""
        });
      }
    },
    deletePerson(index) {
      this.phoneError = false;
      this.persons.splice(index, 1);
    },
    changeProduceNo() {
      this.form.produceNo = this.checkForm.produceNo;
    },
    save() {
      console.log(this.getResult());
      // this.$refs.formRefs.validateField(["checkDate"], validate => {
      //   if (validate) {
      //     console.log("s");
      //   }
      // });
    },
    getResult() {
      // console.log(this.checkForm);
      this.phoneError = false;
      let resultForm = { ...this.form };
      this.$refs.formRefs.validate(flag => {
        if (flag) {
          for (let key in this.checkForm) {
            if (key == "person" && this.checkbox.personChecked) {
              this.phoneError = this.checkPerson();
              if (this.phoneError) {
                return;
              } else {
                let contactStr = "";
                for (let i = 0; i < this.persons.length; i++) {
                  let person =
                    this.persons[i].name + "," + this.persons[i].phone;
                  contactStr += person;
                  if (i < this.persons.length - 1) {
                    contactStr += ";";
                  }
                }
                console.log(contactStr);
                resultForm["person"] = contactStr;
              }
            }
            if (this.checkForm[key] != "") {
              resultForm[key] = this.checkForm[key];
            }
          }
        }
      });
      return resultForm;
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
      // overflow: hidden;
    }
    .el-input {
      width: 400px;
    }
    .el-checkbox {
      margin: 0 20px;
    }
    .input-box,
    .check-box,
    .edit-box,
    .error {
      float: left;
      // margin: 0 5px;
      .el-input {
        width: 100%;
      }
    }
    .edit-box {
      width: 350px;
      .person-name {
        width: 100px;
      }
      .person-phone {
        width: 160px;
        border-left: 1px solid #eee;
      }
      .icons {
        cursor: pointer;
      }
    }
    .error {
      color: red;
      margin-left: 5px;
    }
  }
}
</style>