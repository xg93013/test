<template>
  <div id="InspectionHistory">
    <div class="commonWidth first">
      <el-form label-width="200px" :model="form" ref="formRefs">
        <div>
          <div>
            <svg-icon iconClass="tips"></svg-icon>
            <span>现场检查当天情况</span>
          </div>
          <div class="result-form">
            <div class="check-item">
              <el-form-item label="企业状态：" prop="enterpriseStatus">
                <el-radio
                  v-model="form.enterpriseStatus"
                  label="NORMAL"
                  v-show="form.enterpriseStatus=='NORMAL'"
                >正常生产</el-radio>
                <el-radio
                  v-model="form.enterpriseStatus"
                  label="SEMI_SHUTDOWN"
                  v-show="form.enterpriseStatus=='SEMI_SHUTDOWN'"
                >半停产</el-radio>
                <el-radio
                  v-model="form.enterpriseStatus"
                  label="SEASON_SHUTDOWN"
                  v-show="form.enterpriseStatus=='SEASON_SHUTDOWN'"
                >季节性停产</el-radio>
                <el-radio
                  v-model="form.enterpriseStatus"
                  label="SHUTDOWN"
                  v-show="form.enterpriseStatus=='SHUTDOWN'"
                >停产</el-radio>
              </el-form-item>
            </div>
          </div>
        </div>
        <div>
          <div>
            <svg-icon iconClass="tips"></svg-icon>
            <span>企业信息</span>
          </div>
          <div class="tab-item">
            <div class="result-form">
              <div class="check-item">
                <el-form-item label="企业名称：" label-width="170px" prop="enterpriseName">
                  <el-input v-model="form.enterpriseName" disabled class="input-box"></el-input>
                </el-form-item>
                <el-form-item label="企业地址：" label-width="170px" prop="enterpriseAddress">
                  <el-input v-model="form.enterpriseAddress" class="input-box" disabled></el-input>
                </el-form-item>
                <el-form-item label="营业执照编号：" label-width="170px" prop="enterpriseNo">
                  <el-input v-model="form.enterpriseNo" class="input-box" disabled></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="tab-item">
            <div class="result-form">
              <el-form-item label="联系人：" prop="person">
                <el-input v-model="form.person" class="input-box" disabled></el-input>
              </el-form-item>
              <el-form-item label="食品生产许可证食品类别：" prop="produceNo">
                <el-input v-model="form.produceNo" class="input-box" disabled></el-input>
              </el-form-item>
              <el-form-item label="企业上年度风险等级：" prop="riskLevel">
                <el-input v-model="form.riskLevel" class="input-box" disabled></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

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
        <el-table-column label="动态风险因素不符情况描述" align="center">
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
        </el-table-column>
      </el-table>
      <!-- 企业先进性不符情况描述 -->
      <el-table
        :data="adTableData"
        style="width: 100%;margin-top:20px;"
        ref="historyTableRefs"
        border
        @sort-change="adSortChange"
      >
        <el-table-column label="企业先进性不符情况描述" align="center">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :sortable="item.sortable"
            v-for="(item, index) in tableHeader"
            :key="index+'nextcloum'"
          ></el-table-column>
        </el-table-column>
      </el-table>

      <div class="m20">
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
            :disabled="disabled"
          ></el-input>
        </div>
      </div>

      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>检查情况签名</span>
      </div>
      <el-form :model="inputForm" label-width="180px" ref="inputFormRefs" :rules="inputFormRules">
        <div class="check-form">
          <div class="check-item">
            <el-form-item label="检查组长签名：" prop="groupName">
              <!-- <el-select v-model="inputForm.groupName" placeholder="检查组长签名：" style="width:100%;">
                <el-option
                  v-for="(itema ,indexa) in allPersonList"
                  :key="indexa+'groupName'"
                  :label="itema.label"
                  @click.native="changePerson('groupName', itema)"
                  :value="itema.label"
                ></el-option>
              </el-select>-->
              <el-input v-model="inputForm.groupName" disabled></el-input>
            </el-form-item>
            <el-form-item label="检查组员签名：" prop="personName">
              <el-input v-model="inputForm.personName" disabled></el-input>
            </el-form-item>
            <el-form-item label="监管部门检查人员签名：" prop="checkPerson">
              <el-input v-model="inputForm.checkPerson" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="现场检查日期：" prop="dateTime">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.dateTime"
                value-format="yyyy-MM-dd"
                @change="changeDateTime"
                :disabled="disabled"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="check-item">
            <el-form-item label="企业负责人意见：" prop="entResult">
              <el-select v-model="inputForm.entResult" :disabled="disabled">
                <el-option label="同意" :value="true">同意</el-option>
                <el-option label="有异议" :value="false">有异议</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业负责人签名：" prop="entName">
              <el-input v-model="inputForm.entName" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="签字日期：" prop="entDatetime">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.entDatetime"
                value-format="yyyy-MM-dd"
                :disabled="disabled"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import Tips from "@/components/Tips/index";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone } from "@/utils/index.js";

const { TASKS_TASK, TASKS_TASKRECORD, ACCOUNTS_ALL } = apis;
export default {
  data() {
    let _this = this;
    var dateValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期"));
      } else {
        if (value != _this.inputForm.dateTime) {
          callback(new Error("请选择一致日期！"));
        } else {
          callback();
        }
      }
    };
    return {
      tipContent: "",
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
      inputForm: {
        // imageUrl: '',
        groupName: "",
        personName: "",
        checkPerson: "",
        dateTime: "",
        entResult: "",
        entName: "",
        entDatetime: "",
        entImgUrl: ""
      },
      inputFormRules: {
        // groupName: [
        //   {
        //     required: true,
        //     message: "请选择",
        //     trigger: "change"
        //   }
        // ],
        // personName: [
        //   {
        //     required: true,
        //     message: "请选择",
        //     trigger: "change"
        //   }
        // ],
        checkPerson: [
          {
            required: true,
            message: "请选择监管部门检查人员签名",
            trigger: "change"
          }
        ],
        dateTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      },
      tableHeader: [
        {
          prop: "project",
          label: "检查项目序号",
          width: "",
          align: "left",
          sortable: false
        },
        {
          prop: "details",
          label: "问题描述",
          width: "",
          align: "center",
          sortable: false
        }
      ],
      tableData: [],
      adTableData: [],
      others: "",
      allPersonList: [],
      validateFlag: 1,
      originInputForm: "",
      disabled: false
    };
  },
  components: {
    Tips
  },
  props: {
    taskId: {
      type: Number,
      default: 0
    },
    inspectionType: {
      type: String,
      default: ""
    }
  },
  created() {
    // this.getDefaultData();
    if (this.inspectionType == "view") {
      this.disabled = true;
    }
  },
  methods: {
    async getDefaultData() {
      this.tableData = [];
      this.adTableData = [];
      this.allPersonList = [];
      let res = await http.get(TASKS_TASK + "/" + this.taskId);
      if (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          this.form = {
            enterpriseName: data.enterpriseName,
            enterpriseAddress: data.enterpriseAddress,
            enterpriseNo: data.businessLicense,
            person: data.contact,
            productCategory: data.productCategory,
            riskLevel: data.preRiskLevel,
            enterpriseStatus: data.enterpriseStatus,
            category: data.shutdownCategory,
            stopDate: data.shutdownDate,
            checkDate: data.inspectionDate
          };
        }
      }
      let recordList = await http.get(TASKS_TASKRECORD + "/" + this.taskId);
      if (recordList) {
        let data = recordList.data.data.items;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type == "DYNAMIC_RISK") {
            this.tableData.push({
              recordId: data[i].recordId,
              project: data[i].item,
              details: data[i].remark
            });
          }
          if (data[i].type == "ADVANCEMENT") {
            this.adTableData.push({
              recordId: data[i].recordId,
              project: data[i].item,
              details: data[i].remark
            });
          }
        }
        this.others = recordList.data.data.remark;
        this.inputForm.groupName = recordList.data.data.taskGroupName;
        this.inputForm.personName = recordList.data.data.taskPersonName;
        this.inputForm.checkPerson = recordList.data.data.recordLeaderName;
        this.inputForm.dateTime = recordList.data.data.recordWorkDate;
        this.inputForm.entResult = recordList.data.data.recordEnterpriseConfirm;
        this.inputForm.entName = recordList.data.data.enterprisePrincipalName;
        this.inputForm.entDatetime = recordList.data.data.recordEnterpriseDate;
      }
      let persons = await http.get(ACCOUNTS_ALL);
      if (persons) {
        let datas = persons.data.data;
        for (let i = 0; i < datas.length; i++) {
          this.allPersonList.push({
            label: datas[i].name,
            value: datas[i].account
          });
        }
      }

      this.originInputForm = deepClone(this.inputForm);
      this.originRemarks = this.others;
    },
    changePerson(prop, item) {
      this.inputForm[prop] = item.label;
      this.inputForm[prop + "Id"] = item.value;
    },
    sortChange() {},
    adSortChange() {},
    save(changeType, page) {
      if (this.inspectionType != "view") {
        this.validateData();
        let type = "SAVE";
        let resultForm = this.getResult();
        // console.log(resultForm);
        this.submitData(type, resultForm, changeType, page);
      } else {
        this.$emit("handleResult", true, changeType, page);
      }
    },
    submit() {
      let type = "COMMIT";
      let resultForm = this.getResult();
      this.submitData(type, resultForm);
    },
    getResult() {
      let resultForm = {};
      resultForm.enterprisePrincipalName = this.inputForm.entName;
      resultForm.recordEnterpriseConfirm = this.inputForm.entResult;
      resultForm.recordEnterpriseDate = this.inputForm.entDatetime;
      resultForm.recordLeaderName = this.inputForm.checkPerson;
      resultForm.recordWorkDate = this.inputForm.dateTime;
      resultForm.remark = this.others;
      resultForm.items = [];
      resultForm.taskGroupName = this.inputForm.groupName;
      resultForm.taskPersonName = this.inputForm.personName;
      return resultForm;
    },
    validateData() {
      this.$refs.inputFormRefs.validate(flag => {
        if (flag) {
          this.validateFlag = 1;
        } else {
          this.validateFlag = -1;
        }
      });
    },
    async submitData(type, resultForm, changeType, page) {
      let res = await http.put(
        TASKS_TASKRECORD + "/" + this.taskId + "/" + type,
        resultForm
      );
      if (res) {
        let msg = type == "SAVE" ? "保存检查记录表成功！" : "提交成功！";
        if (type == "SAVE") {
          this.$emit("handleResult", true, changeType, page);
          this.$message.success(msg);
        } else {
          this.$emit("handleSubmitResult", true);
        }
      }
    },
    reset() {
      this.inputForm = deepClone(this.originInputForm);
      this.others = this.originRemarks;
    },
    changeDateTime(date) {
      this.inputForm.entDatetime = date;
    }
  }
};
</script>
<style lang="scss" scoped>
#InspectionHistory {
  .tab-item {
    width: 50%;
    float: left;
    overflow: hidden;
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