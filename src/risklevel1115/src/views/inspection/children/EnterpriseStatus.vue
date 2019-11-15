<template>
  <div id="EnterpriseStatus">
    <el-form label-width="200px" :model="form" :rules="formRules" ref="formRefs">
      <div class="commonWidth first">
        <div>
          <svg-icon iconClass="tips"></svg-icon>
          <span>现场检查当天情况</span>
        </div>
        <div class="check-status">
          <el-form-item label="产品生产状态：" prop="enterpriseStatus">
            <div class="status-box">
              <el-checkbox
                v-model="normalStatus"
                class="status-check"
                @change="changeNormalVisible"
                :disabled="disabled"
              >正常生产</el-checkbox>
              <el-select
                v-model="enterpriseCategory.normalCategory"
                placeholder="请选择类别信息"
                multiple
                :collapse-tags="true"
                class="status-class"
                @change="changeNormalCat"
                @visible-change="normalVisibleChange"
                v-show="normalVisible"
              >
                <el-option
                  v-for="(item,index) in categoryList"
                  :key="index+'normal'"
                  :label="item.label"
                  :value="item.label"
                  v-if="item.show"
                  :disabled="disabled"
                ></el-option>
              </el-select>
            </div>
            <div class="status-box">
              <el-checkbox
                v-model="semiShutdownStatus"
                class="status-check"
                @change="changeSemiShutDownVisible"
                :disabled="disabled"
              >半停产</el-checkbox>
              <el-select
                v-model="enterpriseCategory.semiShutdownCategory"
                placeholder="请选择类别信息"
                multiple
                :collapse-tags="true"
                class="status-class"
                @change="changeSemiShotDownCat"
                @visible-change="semiVisibleChange"
                v-show="semiShutdownVisible"
              >
                <el-option
                  v-for="(item,index) in semiCategoryList"
                  :key="index+'normal'"
                  :label="item.label"
                  :value="item.label"
                  v-if="item.show"
                  :disabled="disabled"
                ></el-option>
              </el-select>
            </div>
            <div class="status-box">
              <el-checkbox
                v-model="seasonShutdownStatus"
                class="status-check"
                @change="changeSeasonShutDownVisible"
                :disabled="disabled"
              >季节性停产</el-checkbox>
              <el-select
                v-model="enterpriseCategory.seasonShutdownCategory"
                placeholder="请选择类别信息"
                multiple
                :collapse-tags="true"
                class="status-class"
                @change="changeSeasonShotDownCat"
                @visible-change="seasonVisibleChange"
                v-show="seasonShutdownVisible"
              >
                <el-option
                  v-for="(item,index) in seasonCategoryList"
                  :key="index+'normal'"
                  :label="item.label"
                  :value="item.label"
                  v-if="item.show"
                  :disabled="disabled"
                ></el-option>
              </el-select>
            </div>
            <div class="status-box">
              <el-checkbox
                v-model="shutdownStatus"
                class="status-check"
                @change="changeShutDownVisible"
                :disabled="disabled"
              >停产</el-checkbox>
              <el-select
                v-model="enterpriseCategory.shutdownCategory"
                placeholder="请选择类别信息"
                multiple
                :collapse-tags="true"
                class="status-class"
                @change="changeShotDownCat"
                @visible-change="shutdownVisibleChange"
                v-show="shutdownVisible"
              >
                <el-option
                  v-for="(item,index) in shutdownCategoryList"
                  :key="index+'normal'"
                  :label="item.label"
                  :value="item.label"
                  v-if="item.show"
                  :disabled="disabled"
                ></el-option>
              </el-select>
              <el-form-item
                label="停产日期"
                label-width="100px"
                prop="stopStartDate"
                v-show="shutdownVisible"
                style="width:260px;float:left;"
              >
                <el-date-picker
                  type="date"
                  placeholder="请选择开始日期"
                  v-model="form.stopStartDate"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                  :disabled="disabled"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="~"
                label-width="30px"
                prop="stopEndDate"
                v-show="shutdownVisible"
                style="width:220px;float:left;"
              >
                <el-date-picker
                  type="date"
                  placeholder="请选择结束日期"
                  v-model="form.stopEndDate"
                  style="width: 175px;"
                  value-format="yyyy-MM-dd"
                  :disabled="disabled"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-form-item>
          <div class="check-item">
            <el-form-item label="检查日期：" prop="checkDate">
              <el-date-picker
                type="date"
                placeholder="请选择检查日期"
                v-model="form.checkDate"
                style="width: 400px;"
                value-format="yyyy-MM-dd"
                :disabled="disabled"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>

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
            <el-checkbox
              v-model="checkbox.enterpriseAddressChecked"
              class="check-box"
              @change="changeAddressChecked"
              :disabled="disabled"
            >{{checkbox.enterpriseAddressChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box" v-show="checkbox.enterpriseAddressChecked">
              <el-input v-model="checkForm.enterpriseAddress" placeholder="请输入企业地址"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="营业执照编号：" prop="enterpriseNo">
            <el-input v-model="form.enterpriseNo" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="checkbox.enterpriseNoChecked"
              class="check-box"
              @change="changeEnterpriseNoChecked"
              :disabled="disabled"
            >{{checkbox.enterpriseNoChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box" v-show="checkbox.enterpriseNoChecked">
              <el-input v-model="checkForm.enterpriseNo" placeholder="请输入营业执照编号"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="联系人：" prop="person">
            <el-input v-model="form.person" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="checkbox.personChecked"
              class="check-box"
              @change="changePersonChecked"
              :disabled="disabled"
            >{{checkbox.personChecked?'修正':'正确'}}</el-checkbox>
            <div class="edit-box" v-show="checkbox.personChecked">
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
            <div class="error" v-show="phoneError&&checkbox.personChecked">
              <svg-icon iconClass="error"></svg-icon>请填写正确联系人信息！
            </div>
          </el-form-item>
          <!-- <el-checkbox
              v-model="form.productCategoryChecked"
              class="check-box"
            >{{form.productCategoryChecked?'补充':'正确'}}</el-checkbox>
            <div class="edit-box" v-show="form.productCategoryChecked">
              <el-input v-model="checkForm.productCategory" placeholder="请输入食品生产许可证"></el-input>
          </div>-->
          <el-form-item :label="categoryLabel" prop="productCategory">
            <!-- <el-input v-model="form.productCategory" class="input-box" disabled></el-input> -->
            <down-tree
              @downTree="selectDown"
              :isLeaf="categoryTree.isLeaf"
              :backLeaf="categoryTree.backLeaf"
              :splitStr="categoryTree.splitStr"
              :showFullName="categoryTree.showFullName"
              :data="categoryTree.originData"
              :defaultData="categoryTree.defaultData"
              :modeType="categoryTree.prop"
              icon="down"
              ref="categoryTreeRefs"
              :placeholder="'共计'+categoryTree.selectLen+'种'"
              style="width:400px;float:left;"
              v-show="!disabled"
            ></down-tree>
            <SelectTree
              :data="originTree"
              style="width:400px;"
              :showBorder="true"
              v-show="disabled"
            ></SelectTree>

            <!-- <el-checkbox
              v-model="checkbox.productCategoryChecked"
              class="check-box"
              @change="changeProduceNo"
            >{{checkbox.productCategoryChecked?'补充':'正确'}}</el-checkbox>-->
            <!-- <div class="edit-box" v-show="checkbox.productCategoryChecked">
              <el-input
                v-model="checkForm.productCategory"
                placeholder="请输入食品生产许可证食品类别"
                @change="changeProduceNo"
              ></el-input>
            </div>-->
          </el-form-item>
          <el-form-item label="企业上年度风险等级：" prop="riskLevel">
            <el-input v-model="form.riskLevel" class="input-box" disabled></el-input>
            <el-checkbox
              v-model="checkbox.riskLevelChecked"
              class="check-box"
              @change="changeRiskLevelChecked"
              :disabled="disabled"
            >{{checkbox.riskLevelChecked?'修正':'正确'}}</el-checkbox>

            <div class="edit-box" v-show="checkbox.riskLevelChecked">
              <div class="form-item">
                <div class="left-item">
                  <el-select
                    v-model="checkForm.riskLevel"
                    placeholder="请选择企业上年度风险等级"
                    style="width:100%;"
                  >
                    <el-option
                      v-for="(item,index) in riskLevelList"
                      :key="index+'riskLevelList'"
                      :label="item.label+'级'"
                      :value="item.value"
                    ></el-option>
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
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone, getTimeStr } from "@/utils/index.js";
import DownTree from "@/components/DownTree/index.vue";
import SelectTree from "@/components/DownTree/SelectTree.vue";

const {
  TASKS_TASK,
  TASK_ENTERPRISESTATUS,
  SCORE_CATEGORY,
  FOODCATEGORY
} = apis;
export default {
  data() {
    var _this = this;
    var enterpriseNameValidator = (rule, value, callback) => {
      if (_this.form.enterpriseName && _this.checkForm.enterpriseName) {
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
      if (_this.form.productCategory == []) {
        callback(new Error("请选择食品生产许可证食品类别！"));
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
      if (_this.shutdownVisible) {
        if (!value) {
          callback(new Error("请选择开始日期"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var stopEndDateValidator = (rule, value, callback) => {
      let nowDate = getTimeStr(true);
      if (_this.shutdownVisible) {
        if (!value) {
          callback(new Error("请选择开始日期"));
        } else {
          if (value > nowDate) {
            callback(new Error("日期不能大于当前时间！"));
          }
          if (_this.form.stopStartDate == "") {
            callback(new Error("请先填写开始日期！"));
          } else {
            if (value < _this.form.stopStartDate) {
              callback(new Error("填写日期不能小于开始日期"));
            } else {
              callback();
            }
          }
        }
      } else {
        callback();
      }
    };
    var enterpeiseStatusValidator = (rule, value, callback) => {
      let flag = false;
      for (let key in _this.enterpriseCategory) {
        if (_this.enterpriseCategory[key].length > 0) {
          flag = true;
          break;
        } else {
          continue;
        }
      }
      if (flag) {
        callback();
      } else {
        callback(new Error("请填写企业状态！"));
      }
    };
    return {
      enterpriseStatus: "",
      form: {
        enterpriseName: "",
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        productCategory: [],
        riskLevel: "",
        enterpriseStatus: "",
        checkDate: "",
        // stopDate: "",
        stopStartDate: "",
        stopEndDate: ""
        // category: ""
        // shutdownCategory: "",
        // semiShutdownCategory: "",
        // seasonShutdownCategory: "",
        // normalCategory: ""
      },
      originForm: "",
      checkbox: {
        enterpriseAddressChecked: false,
        enterpriseNoChecked: false,
        personChecked: false,
        // productCategoryChecked: false,
        riskLevelChecked: false
      },
      checkForm: {
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        // productCategory: [],
        riskLevel: ""
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
        productCategory: [
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
            validator: enterpeiseStatusValidator,
            trigger: "change"
          }
        ],
        checkDate: [
          {
            required: true,
            message: "请选择检查日期",
            trigger: "change"
          }
        ],
        stopStartDate: [
          {
            required: true,
            // message: "请选择停产开始日期",
            validator: stopDateValidator,
            trigger: "change"
          }
        ],
        stopEndDate: [
          {
            required: true,
            // message: "请选择停产结束日期",
            validator: stopEndDateValidator,
            trigger: "change"
          }
        ]
        // category: [
        //   {
        //     required: true,
        //     message: "请选择类别信息",
        //     // validator: categoryValidator,
        //     trigger: "change"
        //   }
        // ]
      },
      persons: [
        {
          name: "",
          phone: ""
        }
      ],
      phoneError: false,
      riskLevelList: [],
      categoryList: [],
      semiCategoryList: [],
      seasonCategoryList: [],
      shutdownCategoryList: [],
      validateFlag: -1,
      disabled: false,
      categoryTree: {
        name: "食品类别",
        isLeaf: true,
        showFullName: true,
        splitStr: "/",
        originData: [],
        defaultData: [],
        prop: "category",
        showSelectTips: false,
        selectLen: 0
      },
      normalStatus: false,
      shutdownStatus: false,
      semiShutdownStatus: false,
      seasonShutdownStatus: false,
      enterpriseCategory: {
        shutdownCategory: [],
        semiShutdownCategory: [],
        seasonShutdownCategory: [],
        normalCategory: []
      },
      // enerpriseCheckbox: {
      normalVisible: false,
      shutdownVisible: false,
      semiShutdownVisible: false,
      seasonShutdownVisible: false,
      prevShutdownCat: [],
      prevSemiShutdownCat: [],
      prevSeasonShutdownCat: [],
      prevNormalCat: [],
      originTree: [],
      categoryLabel: ""
      // }
    };
  },
  created() {
    this.categoryLabel =
      this.enterpriseType == "FOOD_PRODUCTION"
        ? "食品生产许可证食品类别："
        : "食品经营许可证经营范围：";

    if (this.inspectionType == "view") {
      this.disabled = true;
      this.formRules = {};
    }
    this.getDefaultData();
  },
  components: {
    DownTree,
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
    },
    enterpriseType: {
      type: String,
      default: ""
    }
  },
  computed: {},
  methods: {
    async getDefaultData() {
      let res = await http.get(TASKS_TASK + "/" + this.taskId);
      if (res) {
        // console.log(res);
        if (res.data.code == 0) {
          let data = res.data.data;
          this.form = {
            enterpriseName: data.enterpriseName ? data.enterpriseName : "",
            enterpriseAddress: data.enterpriseAddress
              ? data.enterpriseAddress
              : "",
            enterpriseNo: data.businessLicense ? data.businessLicense : "",
            person: data.contact ? data.contact : "",
            productCategory: data.productCategory
              ? JSON.parse(data.productCategory)
              : [],
            riskLevel: data.preRiskLevel ? data.preRiskLevel : "",
            stopStartDate: data.shutdownDate ? data.shutdownDate : "",
            stopEndDate: data.shutdownEndDate ? data.shutdownEndDate : "",
            checkDate: data.inspectionDate ? data.inspectionDate : ""
          };
          this.originTree = data.productCategory
            ? JSON.parse(data.productCategory)
            : [];
          this.originForm = deepClone(this.form);
          this.getDefauleStatus(data);
          // 第一次读取联系人
          // this.persons = [];
          // let contact = this.form.person;
          // let contactList = contact.split(";");

          // for (let i = 0; i < contactList.length; i++) {
          //   let person = contactList[i].split(",");
          //   this.persons.push({
          //     name: person[0],
          //     phone: person[1]
          //   });
          // }
        }
      }
      let category = await http.get(SCORE_CATEGORY);
      if (category) {
        if (this.inspectionType != "view") {
          for (let i = 0; i < category.data.data.length; i++) {
            this.categoryList.push({
              label: category.data.data[i],
              show: true
            });
          }
          this.semiCategoryList = deepClone(this.categoryList);
          this.seasonCategoryList = deepClone(this.categoryList);
          this.shutdownCategoryList = deepClone(this.categoryList);
          for (let key in this.enterpriseCategory) {
            this.setDefaultStatus(key);
          }
        } else {
          for (let key in this.enterpriseCategory) {
            this.setViewStatus(key);
          }
        }
      }
      if (this.enterpriseType == "FOOD_PRODUCTION") {
        this.riskLevelList = [
          {
            label: "A",
            value: "A"
          },
          {
            label: "B",
            value: "B"
          },
          {
            label: "C",
            value: "C"
          },
          {
            label: "D",
            value: "D"
          }
        ];
      } else {
        this.riskLevelList = [
          {
            label: "1",
            value: "1"
          },
          {
            label: "2",
            value: "2"
          },
          {
            label: "3",
            value: "3"
          },
          {
            label: "4",
            value: "4"
          },
          {
            label: "5",
            value: "5"
          }
        ];
      }
      let treeCategory = await http.get(FOODCATEGORY);
      if (treeCategory) {
        this.categoryTree.originData = [
          {
            id: "0",
            label: "全部",
            children: treeCategory.data.data
          }
        ];
        this.categoryTree.defaultData = this.form.productCategory;
        // this.categoryTree.selectLen = this.categoryTree.defaultData.length;
      }
    },
    setViewStatus(type) {
      let arr = this.enterpriseCategory[type];
      let outArr = [];
      for (let i = 0; i < arr.length; i++) {
        outArr.push({
          label: arr[i],
          show: true
        });
      }
      if (type == "normalCategory") {
        this.categoryList = outArr;
      }
      if (type == "semiShutdownCategory") {
        this.semiCategoryList = outArr;
      }
      if (type == "seasonShutdownCategory") {
        this.seasonCategoryList = outArr;
      }
      if (type == "shutdownCategory") {
        this.shutdownCategoryList = outArr;
      }
    },
    setDefaultStatus(type) {
      // shutdownCategory: [],
      //   semiShutdownCategory: [],
      //   seasonShutdownCategory: [],
      //   normalCategory: []
      let arr = this.enterpriseCategory[type];
      for (let i = 0; i < arr.length; i++) {
        let index = this.getIndexInCategory(arr[i]);
        if (type != "normalCategory") {
          this.categoryList[index].show = false;
        }
        if (type != "semiShutdownCategory") {
          this.semiCategoryList[index].show = false;
        }
        if (type != "seasonShutdownCategory") {
          this.seasonCategoryList[index].show = false;
        }
        if (type != "shutdownCategory") {
          this.shutdownCategoryList[index].show = false;
        }
      }
    },
    getDefauleStatus(data) {
      for (let key in this.enterpriseCategory) {
        if (data[key]) {
          this.enterpriseCategory[key] = data[key].split(",");
        }
      }
      if (data.shutdownCategory) {
        this.shutdownStatus = true;
        this.shutdownVisible = true;
      }
      if (data.normalCategory) {
        this.normalStatus = true;
        this.normalVisible = true;
      }
      if (data.seasonShutdownCategory) {
        this.seasonShutdownStatus = true;
        this.seasonShutdownVisible = true;
      }
      if (data.semiShutdownCategory) {
        this.semiShutdownStatus = true;
        this.semiShutdownVisible = true;
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
      if (this.checkbox.productCategoryChecked) {
        this.form.productCategory = this.checkForm.productCategory;
      }
    },
    save(changeType, page) {
      // 预览不保存
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
    // 验证通过后才能提交
    validateData() {
      this.$refs.formRefs.validate(flag => {
        if (flag) {
          this.validateFlag = 1;
          if (this.checkbox.personChecked) {
            this.phoneError = this.checkPerson();
            if (this.phoneError) {
              this.validateFlag = -1;
            }
          }
        } else {
          this.validateFlag = -1;
          // this.$message.error("请先填写完整信息！");
        }
      });
    },
    async submitData(type, resultForm, changeType, page) {
      let res = await http.patch(TASKS_TASK, {
        enterpriseName: resultForm.enterpriseName,
        // enterpriseStatus: resultForm.enterpriseStatus,
        enterpriseAddress: resultForm.enterpriseAddress,
        businessLicense: resultForm.enterpriseNo,
        inspectionDate: resultForm.checkDate,
        enterpriseInfoStatus: type,
        contact: resultForm.person,
        preRiskLevel: resultForm.riskLevel,
        productCategory: resultForm.productCategory,
        shutdownDate: resultForm.stopStartDate,
        shutdownEndDate: resultForm.stopEndDate,
        shutdownCategory: resultForm.shutdownCategory,
        semiShutdownCategory: resultForm.semiShutdownCategory,
        seasonShutdownCategory: resultForm.seasonShutdownCategory,
        normalCategory: resultForm.normalCategory,
        taskId: this.taskId
      });
      if (res) {
        let msg = type == "SAVE" ? "保存企业状态成功！" : "提交成功！";
        if (type == "SAVE") {
          this.$emit("handleResult", true, changeType, page);
          this.$message.success(msg);
        } else {
          this.$emit("handleSubmitResult", true);
        }
      }
    },
    getResult() {
      this.phoneError = false;
      let resultForm = deepClone(this.form);
      let checkForm = { ...this.checkForm };
      // console.log(checkForm);
      let persons = this.persons;
      for (let key in checkForm) {
        // 选择修改 && this.checkbox.personChecked
        if (key == "person") {
          if (this.checkbox.personChecked) {
            this.phoneError = this.checkPerson();
            if (!this.phoneError) {
              let contactStr = "";
              for (let i = 0; i < this.persons.length; i++) {
                let person = this.persons[i].name + "," + this.persons[i].phone;
                contactStr += person;
                if (i < this.persons.length - 1) {
                  contactStr += ";";
                }
              }
              resultForm["person"] = contactStr;
            }
          }
        } else {
          let keyArr = [];
          for (let key in this.checkbox) {
            keyArr.push(key);
          }
          if (keyArr.includes(key + "Checked")) {
            if (checkForm[key] != "" && this.checkbox[key + "Checked"]) {
              resultForm[key] = checkForm[key].trim();
            }
          } else {
            resultForm[key] = checkForm[key].trim();
          }
        }
      }
      // 企业状态复选
      // shutdownCategory: "",
      //   semiShutdownCategory: "",
      //   seasonShutdownCategory: "",
      //   normalCategory: ""

      for (let key in this.enterpriseCategory) {
        if (this.enterpriseCategory[key].length > 0) {
          resultForm[key] = this.enterpriseCategory[key].join(",");
        } else {
          resultForm[key] = "";
        }
      }

      return resultForm;
    },
    reset() {
      // this.form = deepClone(this.originForm);
      this.persons = [
        {
          name: "",
          phone: ""
        }
      ];
      this.checkForm = {
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        // productCategory: "",
        riskLevel: ""
      };
      for (let key in this.checkbox) {
        this.checkbox[key] = false;
      }
      this.getDefaultData();
      this.$refs.categoryTreeRefs.reset();
    },
    selectDown(arr, len) {
      let outArr = [];
      for (let i = 0; i < arr.length; i++) {
        outArr.push({
          id: arr[i].id,
          label: arr[i].label
        });
      }
      this.form.productCategory = outArr;
      this.categoryTree.selectLen = len;
    },
    // shutdownVisible: false,
    //   semiShutdownVisible: false,
    //   seasonShutdownVisible: false
    changeNormalVisible() {
      this.normalVisible = !this.normalVisible;
      if (!this.normalVisible) {
        this.enterpriseCategory.normalCategory = [];
      }
    },
    changeSemiShutDownVisible() {
      this.semiShutdownVisible = !this.semiShutdownVisible;
      if (!this.semiShutdownVisible) {
        this.enterpriseCategory.semiShutdownCategory = [];
      }
    },
    changeSeasonShutDownVisible() {
      this.seasonShutdownVisible = !this.seasonShutdownVisible;
      if (!this.seasonShutdownVisible) {
        this.enterpriseCategory.seasonShutdownCategory = [];
      }
    },
    changeShutDownVisible() {
      this.shutdownVisible = !this.shutdownVisible;
      if (!this.shutdownVisible) {
        this.enterpriseCategory.shutdownCategory = [];
      }
    },

    getSelectCategoryFlag(arr, label) {
      let flag = false;
      for (let j = 0; j < arr.length; j++) {
        if (label == arr[j]) {
          flag = true;
          break;
        } else {
          continue;
        }
      }
      return flag;
    },
    getIndexInCategory(label) {
      let index = -1;
      for (let j = 0; j < this.categoryList.length; j++) {
        if (this.categoryList[j].label == label) {
          index = j;
          break;
        } else {
          continue;
        }
      }
      return index;
    },
    changeNormalCat(item) {
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          let index = this.prevNormalCat.indexOf(item[i]);
          if (index == -1) {
            let inIndex = -1;
            inIndex = this.getIndexInCategory(item[i]);
            this.semiCategoryList[inIndex].show = false;
            this.seasonCategoryList[inIndex].show = false;
            this.shutdownCategoryList[inIndex].show = false;
          }
        }
      }
    },
    changeSemiShotDownCat(item) {
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          let index = this.prevSemiShutdownCat.indexOf(item[i]);
          if (index == -1) {
            let inIndex = -1;
            inIndex = this.getIndexInCategory(item[i]);
            this.categoryList[inIndex].show = false;
            this.seasonCategoryList[inIndex].show = false;
            this.shutdownCategoryList[inIndex].show = false;
          }
        }
      }
    },
    changeSeasonShotDownCat(item) {
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          let index = this.prevSeasonShutdownCat.indexOf(item[i]);
          if (index == -1) {
            let inIndex = -1;
            inIndex = this.getIndexInCategory(item[i]);
            this.categoryList[inIndex].show = false;
            this.semiCategoryList[inIndex].show = false;
            this.shutdownCategoryList[inIndex].show = false;
          }
        }
      }
    },
    changeShotDownCat(item) {
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          let index = this.prevShutdownCat.indexOf(item[i]);
          if (index == -1) {
            let inIndex = -1;
            inIndex = this.getIndexInCategory(item[i]);
            this.semiCategoryList[inIndex].show = false;
            this.seasonCategoryList[inIndex].show = false;
            this.categoryList[inIndex].show = false;
          }
        }
      }
    },
    normalVisibleChange(flag) {
      if (!flag) {
        let arr = this.enterpriseCategory.normalCategory;
        for (let i = 0; i < this.prevNormalCat.length; i++) {
          let flag = false;
          flag = this.getSelectCategoryFlag(arr, this.prevNormalCat[i]);
          if (!flag) {
            let index = this.getIndexInCategory(this.prevNormalCat[i]);
            this.semiCategoryList[index].show = true;
            this.seasonCategoryList[index].show = true;
            this.shutdownCategoryList[index].show = true;
          }
        }
        this.prevNormalCat = deepClone(arr);
      }
    },
    semiVisibleChange(flag) {
      if (!flag) {
        let arr = this.enterpriseCategory.semiShutdownCategory;
        for (let i = 0; i < this.prevSemiShutdownCat.length; i++) {
          let flag = false;
          flag = this.getSelectCategoryFlag(arr, this.prevSemiShutdownCat[i]);
          if (!flag) {
            let index = this.getIndexInCategory(this.prevSemiShutdownCat[i]);
            this.categoryList[index].show = true;
            this.seasonCategoryList[index].show = true;
            this.shutdownCategoryList[index].show = true;
          }
        }
        this.prevSemiShutdownCat = deepClone(arr);
      }
    },
    seasonVisibleChange(flag) {
      if (!flag) {
        let arr = this.enterpriseCategory.seasonShutdownCategory;
        for (let i = 0; i < this.prevSeasonShutdownCat.length; i++) {
          let flag = false;
          flag = this.getSelectCategoryFlag(arr, this.prevSeasonShutdownCat[i]);
          if (!flag) {
            let index = this.getIndexInCategory(this.prevSeasonShutdownCat[i]);
            this.categoryList[index].show = true;
            this.seasonCategoryList[index].show = true;
            this.shutdownCategoryList[index].show = true;
          }
        }
        this.prevSeasonShutdownCat = deepClone(arr);
      }
    },

    shutdownVisibleChange(flag) {
      if (!flag) {
        let arr = this.enterpriseCategory.shutdownCategory;
        for (let i = 0; i < this.prevShutdownCat.length; i++) {
          let flag = false;
          flag = this.getSelectCategoryFlag(arr, this.prevShutdownCat[i]);
          if (!flag) {
            let index = this.getIndexInCategory(this.prevShutdownCat[i]);
            this.categoryList[index].show = true;
            this.seasonCategoryList[index].show = true;
            this.shutdownCategoryList[index].show = true;
          }
        }
        this.prevShutdownCat = deepClone(arr);
      }
    },
    changeAddressChecked(checked) {
      if (!checked) {
        this.checkForm.enterpriseAddress = "";
      }
    },

    changeEnterpriseNoChecked(checked) {
      if (!checked) {
        this.checkForm.enterpriseNo = "";
      }
    },
    changePersonChecked(checked) {
      if (!checked) {
        this.checkForm.person = "";
        this.persons = [
          {
            name: "",
            phone: ""
          }
        ];
      }
    },
    changeRiskLevelChecked(checked) {
      if (!checked) {
        this.checkForm.riskLevel = "";
      }
    }
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
    .status-box {
      overflow: hidden;
      // margin-bottom: 20px;
      padding-bottom: 20px;
    }
    .status-check {
      float: left;
      width: 130px;
      // margin-right: 20px;
    }
    .status-class {
      float: left;
      width: 270px;
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
<style lang="scss">
#EnterpriseStatus {
  .el-radio {
    margin-right: 10px;
  }
}
</style>