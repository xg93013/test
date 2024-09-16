<template>
  <div id="ImportantEvent">
    <div class="commonWidth first">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>
          记录内容
          <svg-icon iconClass="error" class="tips-icon" @click.native="showTips"></svg-icon>
        </span>
      </div>
      <tips ref="tipsRefs">
        <slot name="contents">
          <p>1．名称：填写食品生产经营许可证书上的食品生产经营者名称。</p>
          <p>2．地址：填写食品生产经营许可证书上载明的生产经营地址。</p>
          <p>3．联系人、联系方式：填写法人代表或者负责人的姓名及联系方式。</p>
          <p>4．许可证编号：与食品生产经营许可证书上载明的内容一致。如果检查对象为食品生产加工小作坊、食品摊贩等，填写负责人的身份证号码，并隐藏身份证号码中第11位到第14位的数字，以“****”替代。</p>
          <p>5．食品类别明细：填写食品生产许可证上载明的类别及品种明细（具体分类见表7.食品、食品添加剂生产者静态风险因素量化分值表）。</p>
          <p>6．检查内容：检查人员应为两名，应明确检查对应使用的检查表。</p>
          <p>7．重要事项记录：检查组在体系检查中发现企业存在重大食品安全隐患或食品安全违法行为的，现场填写此表，由检查组、陪同检查的区（市）县局执法人员签名确认后，由陪同检查的区（市）县局执法人员依法实施行政执法等后续处置，包括对证据的保存、问题食品的封存、限期整改直至责令企业停产、召回等措施。检查组在24小时内向市局食品生产监管处及市食药检研院体系检查项目负责人报告。</p>
          <p>8．说明：对发现问题及处置措施进行详细描述，可附页。</p>
          <p>9．本表一式三份，一份交陪同检查的区（市）县局执法人员，一份报送市局食品生产处，一份市食药检研院存档。</p>
          <p>10. 现场如没有区（市）县局执法人员陪同的，检查组应及时与市局食品生产处联系。市局食品生产处接到报告后，应通知安排区（市）县局执法人员及时赶赴现场。</p>
          <p>11. 如区（市）县局执法人员在市局通知后，不能及时赶到现场的，检查组应对问题项目使用拍照等手段留取证据，并在备注栏里予以注明，将此表及照片等证据一并报送市局食品生产处。</p>
        </slot>
      </tips>
      <div class="event-content">
        <div class="normal-table">
          <div class="normal-table-item">
            <div class="title long-title">企业名称：</div>
            <div class="name long-name">{{entName}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">企业地址：</div>
            <div class="name long-name">{{entAddress}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">联系人：</div>
            <div class="name long-name">{{entPerson}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">联系方式：</div>
            <div class="name long-name">{{entPhone}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">食品生产许可证编号：</div>
            <div class="name long-name">{{productNo}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">食品类别明细：</div>
            <div class="name long-name">
              <SelectTree :data="originTree" style="width:100%;" :showBorder="false"></SelectTree>
            </div>
          </div>
        </div>
        <div class="input-table content">
          <p>检查内容：</p>
          <p class="texts">
            &emsp;&emsp;受成都市市场监督管理局委托，成都市食品药品检验研究院食品生产企业体系检查人员根据《中华人民共和国食品安全法》等法律法规及《成都市食品企业生产管理通用规范》等规范、标准的规定，于
            <span
              class="line-text"
            >&emsp;{{dateTime}}&emsp;</span>
            <!-- <el-input v-model="dateTime" class="line-text"></el-input> -->
            对
            <span class="line-text">&emsp;{{entName}}&emsp;</span>进行了现场检查。
          </p>
        </div>
        <div class="input-table content">
          <p>本次检查发现该企业存在下列重要情况：</p>
          <p class="texts">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="importantContent"
              :disabled="disabled"
            ></el-input>
          </p>
        </div>
        <div class="input-table">
          <p>
            现将发现的线索等资料移交给
            <el-select
              v-model="area"
              placeholder="请选择区域"
              style="width: 200px;"
              :disabled="disabled"
              class="area-input"
            >
              <el-option
                :label="item.label"
                :value="item.label"
                v-for="(item, index) in areaList"
                :key="'areaList'+index"
              ></el-option>
            </el-select>区（市）县局执法人员。
          </p>
        </div>
        <div class="input-table remarks">
          <p>备注：</p>
          <p class="texts">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
              v-model="remarks"
              :disabled="disabled"
            ></el-input>
          </p>
        </div>
        <div class="input-table remarks">
          <p>说明（附页）：</p>
          <!-- maxlength="300" -->
          <!-- show-word-limit -->
          <p class="texts">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
              v-model="others"
              :disabled="disabled"
            ></el-input>
          </p>
        </div>
      </div>
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>检查情况签名</span>
      </div>
      <el-form :model="inputForm" label-width="200px" ref="inputFormRefs" :rules="inputFormRules">
        <div class="check-form">
          <div class="check-item">
            <el-form-item label="检查人员签名：" prop="checkPerson">
              <el-input v-model="inputForm.checkPerson" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="检查日期：" prop="checkDate">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.checkDate"
                value-format="yyyy-MM-dd"
                disabled
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="check-item">
            <el-form-item label="监管人员：" prop="areaPerson">
              <el-input v-model="inputForm.areaPerson" :disabled="disabled"></el-input>
            </el-form-item>

            <!-- <el-form-item label="日期：" prop="areaDate">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.areaDate"
                value-format="yyyy-MM-dd"
                :disabled="disabled"
              ></el-date-picker>
            </el-form-item>-->
          </div>
          <div class="check-item"></div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { setStorage, getStorage, deepClone } from "@/utils/index.js";
import SelectTree from "@/components/DownTree/SelectTree.vue";
import Tips from "@/components/Tips/index";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { TASKS_TASK, TASKS_TASKIMPORANT, PLAN_DISTRICT } = apis;

export default {
  data() {
    let _this = this;
    var dateValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期"));
      } else {
        if (value != _this.inputForm.checkDate) {
          callback(new Error("请选择一致日期！"));
        } else {
          callback();
        }
      }
    };

    return {
      dateTime: "",
      entName: "",
      entAddress: "",
      entPerson: "",
      entPhone: "",
      productNo: "",
      classDetail: "",
      area: "",
      importantContent: "",
      remarks: "",
      others: "",
      inputForm: {
        checkPerson: "",
        checkDate: "",
        areaPerson: "",
        areaDate: ""
      },
      inputFormRules: {
        checkPerson: [
          {
            required: true,
            message: "请填写检查人员签名！",
            trigger: "change"
          }
        ],
        checkDate: [
          {
            required: true,
            message: "请选择检查日期！",
            trigger: "change"
          }
        ]
        // areaPerson: [
        //   {
        //     required: true,
        //     message: "请填写监管人员！",
        //     trigger: "change"
        //   }
        // ]
        // areaDate: [
        //   {
        //     required: true,
        //     // validator: dateValidator,
        //     message: "请选择",
        //     trigger: "change"
        //   }
        // ],
      },
      originRemarks: "",
      originInputForm: "",
      validateFlag: 1,
      disabled: false,
      originTree: [],
      areaList: []
    };
  },
  components: {
    Tips,
    SelectTree
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
      let res = await http.get(TASKS_TASK + "/" + this.taskId);
      if (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          // console.log(data);
          this.entName = data.enterpriseName;
          this.entAddress = data.enterpriseAddress;
          let personArr = [];
          if (data.contact) {
            personArr = data.contact.split(";");
            let person = personArr[0].split(",");
            this.entPerson = person[0];
            this.entPhone = person[1];
          }

          this.productNo = data.foodLicense ? data.foodLicense : "";
          this.originTree = data.productCategory
            ? JSON.parse(data.productCategory)
            : [];
          this.dateTime = data.inspectionDate;
          this.area = data.district;
        }
      }
      let resa = await http.get(TASKS_TASKIMPORANT + "/" + this.taskId);
      if (resa) {
        this.importantContent = resa.data.data.importantItem;
        this.remarks = resa.data.data.importantItemRemark;
        this.others = resa.data.data.importantItemDescribe;
        this.inputForm.checkPerson = resa.data.data.importantPerson;
        this.inputForm.checkDate = resa.data.data.importantClerkDate;
        this.inputForm.areaPerson = resa.data.data.importantOfficial;
        this.inputForm.areaDate = resa.data.data.importantClerkDate;
        if (resa.data.data.inspectionDistrict) {
          this.area = resa.data.data.inspectionDistrict;
        }
      }
      let areas = await http.get(PLAN_DISTRICT);
      if (areas) {
        for (let i = 0; i < areas.data.data.length; i++) {
          this.areaList.push({
            label: areas.data.data[i].districtName,
            value: areas.data.data[i].districtId
          });
        }
      }

      this.originInputForm = deepClone(this.inputForm);
      this.originContent = this.importantContent;
      this.originOthers = this.others;
      this.originRemarks = this.remarks;
    },
    save(changeType, page) {
      if (this.inspectionType != "view") {
        this.validateData();
        let type = "SAVE";
        let resultForm = this.getResult();
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
    validateData() {
      this.$refs.inputFormRefs.validate(flag => {
        if (flag) {
          this.validateFlag = 1;
        } else {
          this.validateFlag = -1;
        }
      });
    },
    getResult() {
      let resultForm = {};
      resultForm.importantClerkDate = this.inputForm.checkDate;
      resultForm.importantItem = this.importantContent
        ? this.importantContent.trim()
        : "无";
      resultForm.importantItemDescribe = this.others ? this.others.trim() : "";
      resultForm.importantItemRemark = this.remarks ? this.remarks.trim() : "";
      resultForm.importantOfficial = this.inputForm.areaPerson
        ? this.inputForm.areaPerson.trim()
        : "";
      resultForm.inspectionDistrict = this.area;
      return resultForm;
    },
    async submitData(type, resultForm, changeType, page) {
      let res = await http.put(
        TASKS_TASKIMPORANT + "/" + this.taskId + "/" + type,
        resultForm
      );
      if (res) {
        let msg = type == "SAVE" ? "保存重要事项记录表成功！" : "提交成功！";
        if (type == "SAVE") {
          this.$emit("handleResult", true, changeType, page);
        } else {
          this.$emit("handleSubmitResult", true);
        }
        this.$message.success(msg);
      }
    },
    reset() {
      // this.importantContent = this.originContent;
      // this.remarks = this.originRemarks;
      // this.others = this.originOthers;
      // this.inputForm = deepClone(this.originInputForm);
      this.getDefaultData();
    },
    showTips() {
      this.$refs.tipsRefs.show();
    },
    formateTree(data) {
      this.originTree = [{ id: "0", label: "全部", children: [] }];
      let arr = data;
      let allLevels = [
        {
          name: "level1",
          data: []
        },
        {
          name: "level2",
          data: []
        },
        {
          name: "level3",
          data: []
        },
        {
          name: "level4",
          data: []
        }
      ];
      for (let i = 0; i < arr.length; i++) {
        let levels = arr[i].label.split("/");
        let [flag1, flag2, flag3, flag4] = [false, false, false, false];
        for (let j = 0; j < allLevels[0].data.length; j++) {
          if (allLevels[0].data[j].label == levels[0]) {
            flag1 = true;
            break;
          } else {
            continue;
          }
        }
        for (let j = 0; j < allLevels[1].data.length; j++) {
          if (allLevels[1].data[j].label == levels[1]) {
            flag2 = true;
            break;
          } else {
            continue;
          }
        }
        for (let j = 0; j < allLevels[2].data.length; j++) {
          if (allLevels[2].data[j].label == levels[2]) {
            flag3 = true;
            break;
          } else {
            continue;
          }
        }
        for (let j = 0; j < allLevels[3].data.length; j++) {
          if (allLevels[3].data[j].label == levels[3]) {
            flag4 = true;
            break;
          } else {
            continue;
          }
        }
        if (!flag1) {
          allLevels[0].data.push({
            id: this.setId(),
            parent: "全部",
            label: levels[0]
          });
        }
        if (!flag2) {
          allLevels[1].data.push({
            id: this.setId(),
            parent: levels[0],
            label: levels[1]
          });
        }
        if (!flag3) {
          allLevels[2].data.push({
            id: this.setId(),
            parent: levels[1],
            label: levels[2]
          });
        }
        if (!flag4) {
          allLevels[3].data.push({
            id: this.setId(),
            parent: levels[2],
            label: levels[3]
          });
        }
      }
      for (let i = 0; i < allLevels.length; i++) {
        this.setTree(this.originTree[0], allLevels[i].data);
      }
      this.getTreeLength(this.originTree[0].children);
    },
    getTreeLength(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          this.getTreeLength(arr[i].children);
        }
        this.totalLen++;
      }
    },
    setTree(node, children) {
      if (!node) {
        return;
      }
      if (node.children && node.children.length != 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.setTree(node.children[i], children);
        }
      } else {
        let origin = children;
        let arr = [];
        for (let j = 0; j < origin.length; j++) {
          if (node.label == origin[j].parent) {
            arr.push({ ...origin[j] });
          }
        }

        node.children = arr;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/DynamicRisk.scss";
#ImportantEvent {
  .event-content {
    margin: 20px auto;
    color: #333;
    .input-table {
      width: 100%;
      padding: 15px;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
    .content {
      min-height: 150px;
      .line-text {
        width: auto;
        display: inline-block;
        // height: 20px;
        // line-height: 20px;
        text-align: center;
        border-bottom: 1px solid #999;
        min-width: 100px;
      }
    }
    .texts {
      margin: 10px 0;
      line-height: 24px;
    }
  }
  .check-form {
    width: 100%;
    overflow: hidden;
    margin: 20px auto;
    .check-item {
      width: 30%;
      float: left;
    }
  }
}
</style>
<style lang="scss">
.area-input {
  width: 200px;
  border: none;
  .el-input__inner {
    border: none;
    // height: 30px;
    // line-height: 30px;
    border-bottom: 1px solid #999;
    border-radius: 0;
  }
}
.texts {
  .el-textarea__inner {
    border: none;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>