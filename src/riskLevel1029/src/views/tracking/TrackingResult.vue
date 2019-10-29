<template>
  <div id="TrackingResult">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>填写跟踪指导检查记录</span>
      </div>
      <span class="ent-name">{{form.enterpriseName}}</span>
    </div>
    <div class="commonWidth first">
      <el-form label-width="170px" :model="form" ref="formRefs" :rules="formRules">
        <div class="tab-item">
          <div>
            <svg-icon iconClass="edit"></svg-icon>
            <span>基本信息</span>
          </div>
          <div class="result-form">
            <div class="check-item">
              <el-form-item label="企业名称：" prop="enterpriseName">
                <el-input v-model="form.enterpriseName" disabled class="input-box"></el-input>
              </el-form-item>
              <el-form-item label="企业地址：" prop="enterpriseAddress">
                <el-input v-model="form.enterpriseAddress" class="input-box" disabled></el-input>
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
            <el-form-item label="第一次检查时间：" prop="firstCheckDate">
              <el-input v-model="form.firstCheckDate" class="input-box" disabled></el-input>
            </el-form-item>
            <el-form-item label="跟踪验证时间：" prop="trackingDate">
              <el-date-picker
                type="date"
                placeholder="跟踪验证时间"
                v-model="form.trackingDate"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div class="m20">
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
        <el-table-column label="动态风险因素不符情况列表" align="center">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :sortable="item.sortable"
            v-for="(item, index) in tableHeader"
            :key="index+'cloum'"
          >
            <template slot-scope="scope">
              <div v-if="item.prop == 'verification'">
                <el-input v-model="scope.row['verification']"></el-input>
              </div>
              <div v-else-if="item.prop == 'verificationResult'">
                <el-checkbox v-model="scope.row['verificationResult']">
                  <span v-if="scope.row['verificationResult']">完成</span>
                  <span v-if="!scope.row['verificationResult']">未完成</span>
                </el-checkbox>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
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
        <el-table-column label="企业先进性不符情况列表" align="center">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :sortable="item.sortable"
            v-for="(item, index) in tableHeader"
            :key="index+'nextcloum'"
          >
            <template slot-scope="scope">
              <div v-if="item.prop == 'verification'">
                <el-input v-model="scope.row['verification']"></el-input>
              </div>
              <div v-else-if="item.prop == 'verificationResult'">
                <el-checkbox v-model="scope.row['verificationResult']">
                  <span v-if="scope.row['verificationResult']">完成</span>
                  <span v-if="!scope.row['verificationResult']">未完成</span>
                </el-checkbox>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <div class="operation">
                <span @click="deleteRow(scope.$index, scope.row)">
                  <label>清空</label>
                  <svg-icon iconClass="delete"></svg-icon>
                </span>
              </div>
            </template>
          </el-table-column>-->
        </el-table-column>
      </el-table>

      <div class="m20">
        <svg-icon iconClass="tips"></svg-icon>
        <span>检查情况签名</span>
      </div>
      <el-form :model="inputForm" label-width="180px" ref="inputFormRefs" :rules="inputFormRules">
        <div class="check-form">
          <div class="check-item">
            <el-form-item label="检查员签字：" prop="checkPerson">
              <el-input v-model="inputForm.checkPerson" disabled></el-input>
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
            <el-form-item label="企业负责人签字：" prop="entName">
              <el-input v-model="inputForm.entName"></el-input>
              <!-- <el-select v-model="inputForm.entName" placeholder="企业负责人签字" style="width:100%;">
                <el-option
                  v-for="(itema ,indexa) in allPersonList"
                  :key="indexa+'entName'"
                  :label="itema.label"
                  @click.native="changePerson('entName', itema)"
                  :value="itema.label"
                ></el-option>
              </el-select>-->
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
            <!-- <el-form-item label="企业负责人签名（企业公章）：" prop="entImgUrl" label-width="240px">
              <div class="ent-img">
                <img :src="inputForm.entImgUrl" alt />
              </div>
            </el-form-item>-->
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
          <el-button type="primary" @click="submit">
            <svg-icon iconClass="submit"></svg-icon>
            <span>提交</span>
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
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone } from "@/utils/index.js";

const {
  TASKS_TASK,
  TASKS_VERIFICATION,
  TASKS_TASKSVERIFICATION,
  ACCOUNTS_ALL
} = apis;

export default {
  data() {
    return {
      tipContent: "",
      form: {
        enterpriseName: "",
        enterpriseAddress: "",
        firstCheckDate: "",
        trackingDate: ""
      },
      formRules: {
        enterpriseName: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "change"
          }
        ],
        enterpriseAddress: [
          {
            required: true,
            message: "请输入企业地址",
            trigger: "change"
          }
        ],
        firstCheckDate: [
          {
            required: true,
            message: "请输入第一次检查时间",
            trigger: "change"
          }
        ],
        trackingDate: [
          {
            required: true,
            message: "请输入跟踪验证时间",
            trigger: "change"
          }
        ]
      },
      inputForm: {
        checkPerson: "",
        dateTime: "",
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
          prop: "item",
          label: "检查项目序号",
          width: "",
          align: "left",
          sortable: false
        },
        {
          prop: "verification",
          label: "验证情况",
          width: "",
          align: "center",
          sortable: false
        },
        {
          prop: "verificationResult",
          label: "是否完成",
          width: "",
          align: "center",
          sortable: false
        }
      ],
      tableData: [],
      originData: [],
      adTableData: [],
      originAdTableData: [],
      originForm: {},
      originInputForm: {},
      taskId: 0,
      allPersonList: []
    };
  },
  components: {
    Tips
  },
  props: {
    // taskId: {
    //   type: Number,
    //   default: 0
    // }
  },
  created() {
    this.taskId = Number(this.$route.params.taskId);
    this.getDefaultData();
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
          // this.form = {
          //   enterpriseName: data.enterpriseName,
          //   enterpriseAddress: data.enterpriseAddress,
          //   enterpriseNo: data.businessLicense,
          //   person: data.contact,
          //   productCategory: data.productCategory,
          //   riskLevel: data.preRiskLevel,
          //   enterpriseStatus: data.enterpriseStatus,
          //   category: data.shutdownCategory,
          //   stopDate: data.shutdownDate,
          //   checkDate: data.inspectionDate
          // };
          this.form.enterpriseName = data.enterpriseName;
          this.form.enterpriseAddress = data.enterpriseAddress;
          this.form.firstCheckDate = data.inspectionDate;
          // this.form.enterpriseName = data.enterpriseName;
        }
      }
      let recordList = await http.get(TASKS_VERIFICATION + "/" + this.taskId);
      if (recordList) {
        let data = recordList.data.data.items;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type == "DYNAMIC_RISK") {
            this.tableData.push({
              recordId: data[i].recordId,
              type: data[i].type,
              item: data[i].item,
              remark: data[i].remark,
              verification: data[i].verification,
              verificationResult: data[i].verificationResult
            });
          }
          if (data[i].type == "ADVANCEMENT") {
            this.adTableData.push({
              recordId: data[i].recordId,
              type: data[i].type,
              item: data[i].item,
              remark: data[i].remark,
              verification: data[i].verification,
              verificationResult: data[i].verificationResult
            });
          }
        }
        // this.others = recordList.data.data.remark;
        // this.inputForm.groupName = recordList.data.data.taskGroupName;
        // this.inputForm.personName = recordList.data.data.taskPersonName;
        this.inputForm.checkPerson = recordList.data.data.reviewPerson;
        this.inputForm.dateTime = recordList.data.data.recordClerkVerifyDate;
        this.inputForm.entName =
          recordList.data.data.reviewEnterprisePrincipalName;
        this.inputForm.entDatetime =
          recordList.data.data.recordEnterpriseVerifyDate;

        this.form.trackingDate = recordList.data.data.reviewWorkDate
          ? recordList.data.data.reviewWorkDate
          : "";

        console.log(this.form.trackingDate);
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
      this.originForm = deepClone(this.form);
      this.originInputForm = deepClone(this.inputForm);
      this.originData = deepClone(this.tableData);
      this.originAdTableData = deepClone(this.adTableData);
    },
    showTips() {
      // this.$refs.tipsRefs.show();
    },
    sortChange() {},
    adSortChange() {},
    deleteRow(index, row) {},

    handleSuccess(res, file) {
      this.inputForm.groupNameUrl = URL.createObjectURL(file.raw);
    },
    save() {
      let result = this.getResult();
      if (result) {
        this.submitData("SAVE");
      }
    },
    submit() {
      let result = this.getResult();
      if (result) {
        this.submitData("COMMIT");
      }
    },
    reset() {
      this.form = deepClone(this.originForm);
      this.inputForm = deepClone(this.originInputForm);
      this.tableData = deepClone(this.originData);
      this.adTableData = deepClone(this.originAdTableData);
    },
    getResult() {
      let resultForm = {};
      this.$refs.formRefs.validate(flag => {
        if (flag) {
          this.$refs.inputFormRefs.validate(inFlag => {
            if (inFlag) {
              let items = this.tableData.concat(this.adTableData);
              resultForm.recordClerkVerifyDate = this.inputForm.dateTime;
              resultForm.recordEnterpriseVerifyDate = this.inputForm.entDatetime;
              resultForm.reviewEnterprisePrincipalName = this.inputForm.entName;
              resultForm.reviewPerson = this.inputForm.checkPerson;
              resultForm.reviewWorkDate = this.form.trackingDate;
              resultForm.items = items;
            } else {
              this.$message.error("请先填写检查情况签名信息！");
              resultForm = false;
            }
          });
        } else {
          this.$message.error("请先填写企业基本信息！");
          resultForm = false;
        }
      });
      return resultForm;
    },
    async submitData(type) {
      let resultForm = this.getResult();
      if (!resultForm) {
        return false;
      }
      if (resultForm) {
        let res = await http.put(
          TASKS_TASKSVERIFICATION + "/" + this.taskId + "/" + type,
          resultForm
        );
        if (res) {
          if (res.data.code == 0) {
            let msg = type == "SAVE" ? "保存成功！" : "提交成功！";
            this.$message.success(msg);
          } else {
            let msg = type == "SAVE" ? "保存失败！" : "提交失败！";
            this.$message.error(msg);
          }
        } else {
        }
      }
    },
    changePerson(prop, item) {
      this.inputForm[prop] = item.label;
      // this.inputForm[prop + "Id"] = item.value;
    }
  }
};
</script>
<style lang="scss" scoped>
#TrackingResult {
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