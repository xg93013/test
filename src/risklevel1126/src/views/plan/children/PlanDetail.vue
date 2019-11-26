<template>
  <div id="PlanDetail" class="PlanDetail">
    <div class="commonWidth top">
      <div class="fl top-title approval-top">
        <svg-icon iconClass="list" v-show="planTypeShow=='add'||planTypeShow=='copy'"></svg-icon>
        <svg-icon
          iconClass="eye"
          v-show="planTypeShow=='planView' || planTypeShow == 'planListView'"
        ></svg-icon>
        <svg-icon iconClass="edit" v-show="planTypeShow=='edit'"></svg-icon>
        <span>{{title}} -《{{normalForm.planNo}}》</span>
      </div>
      <div class="fr approval-top">
        <div v-show="planTypeShow=='add'||planTypeShow=='edit'||planTypeShow=='copy' " class="fr">
          <!-- <el-button type="primary" @click="viewPlan">
            <svg-icon iconClass="eye" class="title-icon"></svg-icon>计划预览
          </el-button>-->
          <span class="tips">
            <label class="cColor">*</label>为必填项
          </span>
        </div>
      </div>
    </div>
    <el-form ref="normalFormRefs" :model="normalForm" :rules="normalFormRules" label-width="120px">
      <div>
        <div class="commonWidth mid">
          <div class="fl item">
            <div class="common-title">基础信息</div>
            <div class="form">
              <el-form-item label="计划类型" prop="planType">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.planType"
                        placeholder="请选择计划类型"
                        style="width: 100%;"
                        :disabled="disabled"
                      >
                        <el-option
                          :label="item.label"
                          :value="item.value"
                          v-for="(item, index) in planTypeList"
                          :key="'pType'+index"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="检查年份" prop="year">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="year"
                        placeholder="请选择检查年份"
                        v-model="normalForm.year"
                        style="width: 100%;"
                        value-format="yyyy"
                        :disabled="disabled||yearDisabled"
                        @change="changeYear"
                      ></el-date-picker>
                      <!-- <el-input v-model="normalForm.year"></el-input> -->
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="date"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="计划编号" prop="planNo">
                <template>
                  <div class="form-item">
                    <el-input v-model="normalForm.planNo" disabled placeholder="请输入计划编号"></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="计划名称" prop="planName">
                <template>
                  <div class="form-item">
                    <el-input
                      v-model="normalForm.planName"
                      :disabled="disabled"
                      placeholder="请输入计划名称"
                    ></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="执行开始日期" prop="planBeginDate">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="date"
                        placeholder="请选择执行开始日期"
                        v-model="normalForm.planBeginDate"
                        style="width: 100%;"
                        value-format="yyyy-MM-dd"
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="date"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="执行结束日期" prop="planEndDate">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="date"
                        placeholder="请选择执行结束日期"
                        v-model="normalForm.planEndDate"
                        style="width: 100%;"
                        value-format="yyyy-MM-dd"
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="date"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
            </div>
          </div>
          <div class="fl item">
            <div class="common-title">管理信息</div>
            <div class="form">
              <el-form-item label="管理单位" label-width="120px" prop="planAdminOrg">
                <template>
                  <div class="form-item">
                    <el-input
                      v-model="normalForm.planAdminOrg"
                      placeholder="请输入管理单位"
                      :disabled="disabled"
                      style="width: 100%;"
                    ></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="机构/处室：" label-width="120px" prop="planAdminSection">
                <template>
                  <div class="form-item">
                    <el-input
                      v-model="normalForm.planAdminSection"
                      placeholder="请输入机构/处室"
                      :disabled="disabled"
                      style="width: 100%;"
                    ></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="备注信息" label-width="120px" prop="planMemo">
                <template>
                  <div class="form-item textarea">
                    <el-input
                      type="textarea"
                      v-model="normalForm.planMemo"
                      :autosize="{ minRows: 4, maxRows: 5}"
                      maxlength="300"
                      show-word-limit
                      placeholder="请输入备注信息"
                      :disabled="disabled"
                    ></el-input>
                  </div>
                </template>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="commonWidth bot">
          <div class="bot-top" v-show="!disabled">
            <div class="common-title">被检查企业主体信息</div>
            <el-form :model="projectForm" ref="projectFormRefs" label-width="120px">
              <!-- :rules="projectFormRules" -->
              <div class="fl item">
                <div class="form">
                  <el-form-item label="所属区域：" prop="area">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.area"
                            placeholder="请选择区域"
                            style="width: 100%;"
                            :disabled="disabled"
                          >
                            <el-option
                              :label="item.label"
                              :value="item.label"
                              v-for="(item, index) in areaList"
                              :key="'areaList'+index"
                              @click.native="changeArea(item)"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="icons" v-show="!disabled">
                          <svg-icon iconClass="down"></svg-icon>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                </div>
              </div>
              <div class="fl item">
                <div class="form">
                  <el-form-item label="企业名称" prop="enterpriseName">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.enterpriseName"
                            placeholder="请选择企业名称"
                            :disabled="disabled"
                            multiple
                            :collapse-tags="true"
                            style="width: 100%;"
                            @change="changeLeadOrg"
                          >
                            <el-option
                              :label="item.label"
                              :value="item"
                              v-for="(item, index) in leadOrgList"
                              :key="'leadOrgList'+index"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="icons" v-show="!disabled">
                          <svg-icon iconClass="down"></svg-icon>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="add-list" v-show="!disabled">
            <el-button class="add-btn" @click="addToList">
              <svg-icon iconClass="add"></svg-icon>
              <span>添加至列表</span>
            </el-button>
          </div>
          <div class="list">
            <div class="common-title">
              <div class="label">配置结果</div>
              <div class="result">
                已配置
                <span>{{page.totalElements}}</span>家检查企业
              </div>
              <el-button class="fr" @click="toggleTable">
                <svg-icon :iconClass="showTable?'up':'down'"></svg-icon>
                <span>{{showTable?'折叠':'展开'}}</span>
              </el-button>
            </div>
            <div class="list-table" ref="tableRefs">
              <el-table :data="tableData" border>
                <!-- <el-table-column label="序号" prop="nums" width="60"></el-table-column> -->
                <el-table-column label="企业名称" prop="enterpriseName" sortable min-width="260">
                  <template slot-scope="scope">
                    <div
                      @click="openDetail(scope.$index, scope.row)"
                    >{{scope.row[scope.column.property]}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="营业执照号码" prop="enterpriseNo" sortable min-width="160"></el-table-column>
                <el-table-column label="产品类别" prop="category" sortable min-width="140">
                  <template slot-scope="scope">
                    <div>
                      <SelectTree
                        :data="scope.row['category'] ? JSON.parse(scope.row['category']) : []"
                        style="width:100%;"
                        :showBorder="false"
                      ></SelectTree>
                    </div>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="项目名称" prop="projectName"></el-table-column> -->
                <el-table-column label="操作" align="center" width="200" v-if="!disabled">
                  <template slot-scope="scope">
                    <span style="cursor:pointer;" @click="deleteProject(scope.$index, scope.row)">
                      <svg-icon iconClass="delete"></svg-icon>
                      <span>删除</span>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next, sizes"
                :total="page.totalElements"
                :page-size.sync="page.pageSize"
                :current-page.sync="page.currentPage"
                :page-sizes="[10, 20, 30, 40, 50]"
                class="m20 fr"
                @current-change="pageChange"
                @size-change="sizeChange"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="commonWidth operation" v-show="!disabled">
      <div class="inner">
        <el-button class="btns" type="primary" @click="onSubmit(false)">
          <svg-icon iconClass="submit"></svg-icon>
          <span>发布</span>
        </el-button>
        <el-button class="btns" type="primary" @click="save(false)">
          <svg-icon iconClass="save"></svg-icon>
          <span>保存</span>
        </el-button>
        <el-button class="btns" @click="resetForm">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>

    <el-dialog
      title="企业详情"
      :visible.sync="entDetailvisible"
      width="650px"
      top="200px"
      custom-class="approvalDialog"
    >
      <div>
        <div class="common-title">基础信息</div>
        <div>
          <div class="normal-table m20">
            <div class="normal-table-item long">
              <div class="title long-title">企业名称：</div>
              <div class="name long-name">{{enterprise.enterpriseName}}</div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">企业地址：</div>
              <div class="name long-name">{{enterprise.enterpriseAddress}}</div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">营业执照编号/信用代码：</div>
              <div class="name long-name">{{enterprise.enterpriseNo}}</div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">联系人及联系方式：</div>
              <div class="name long-name">{{enterprise.contact}}</div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">食品生产许可证食品类别：</div>
              <div class="name long-name">{{enterprise.productNo}}</div>
            </div>
          </div>
        </div>
        <div class="common-title m20">产品信息</div>
        <div class="m20">
          <el-table border :data="productTableData">
            <!-- <el-table-column label="序号" prop="nums" width="60" align="center"></el-table-column> -->
            <el-table-column label="食品、食品添加剂类别" prop="category" width="200" align="center"></el-table-column>
            <el-table-column label="类别编号" prop="classNo" align="center"></el-table-column>
            <el-table-column label="类别名称" prop="className" align="center"></el-table-column>
            <el-table-column label="品种明细" prop="detail" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="entDetailvisible = false">取 消</el-button>
        <el-button type="primary" @click="entDetailvisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="确认提示"
      :visible.sync="dialogVisible"
      width="470px"
      custom-class="dialogVisible"
    >
      <div class="contents">
        <div class="icons">
          <svg-icon iconClass="question" class="question"></svg-icon>
        </div>
        <div class="texts">
          <p class="big">是否确认发布</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from "@/components/DownTree/SelectTree.vue";
import { setStorage, getStorage, exportDoc, deepClone } from "@/utils/index.js";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const {
  PLAN,
  AUTO_PLANNO,
  VALIDATE,
  EXPORT_BASE,
  META_INSTITUTION,
  ENTERPRISE_DISTRICT,
  PLAN_DISTRICT,
  PLAN_TASK,
  PLAN_ENTERPRISE
} = apis;

export default {
  data() {
    let _this = this;
    let planValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划名称！"));
      } else {
        if (value.length > 100 || value.length < 3) {
          callback(new Error("名称长度在3到100之间！"));
        } else {
          if (_this.timer) {
            clearTimeout(_this.timer);
          }
          _this.timer = setTimeout(() => {
            let res = _this.validatePlanName(value);
            if (res) {
              // console.log(res);
              callback();
            } else {
              callback(new Error("计划名称已经存在！"));
            }
          }, 1000);
          // callback();
        }
      }
    };
    let planStartValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划执行开始日期！"));
      } else {
        if (_this.normalForm.year == "") {
          callback(new Error("请先选择检查年份！"));
        } else {
          let dateArr = value.split("-");
          if (dateArr[0] != _this.normalForm.year) {
            callback(new Error("所选时间年份必须为检查年份！"));
          } else {
            if (_this.normalForm.planEndDate) {
              if (value >= _this.normalForm.planEndDate) {
                callback(new Error("日期不能晚于计划执行结束日期！"));
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      }
    };
    let planEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划执行结束日期！"));
      } else {
        if (_this.normalForm.year == "") {
          callback(new Error("请先选择检查年份！"));
        } else {
          let dateArr = value.split("-");
          if (dateArr[0] != _this.normalForm.year) {
            callback(new Error("所选时间年份必须为检查年份！"));
          } else {
            if (value <= _this.normalForm.planStartDate) {
              callback(new Error("日期不能早于计划执行结束日期！"));
            } else {
              callback();
            }
          }
        }
      }
    };
    let adminOrgValidator = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (!value) {
        callback(new Error("请输入管理单位！"));
      } else {
        if (value.length > 100 || !reg.test(value)) {
          callback(new Error("最长为100个字符，不能包含空格和特殊字符！"));
        } else {
          callback();
        }
      }
    };
    let adminSectionValidator = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (!value) {
        callback(new Error("请输入机构/处室！"));
      } else {
        if (value.length > 100 || !reg.test(value)) {
          callback(new Error("最长为100个字符，不能包含空格和特殊字符！"));
        } else {
          callback();
        }
      }
    };

    return {
      timer: "",
      title: "新增计划",
      disabled: false,
      planTypeShow: "add",
      yearDisabled: false,
      planStatus: "",
      normalForm: {
        planType: "",
        year: "",
        planNo: "",
        planName: "",
        planBeginDate: "",
        planEndDate: "",
        planAdminOrg: "",
        planAdminSection: "",
        planMemo: ""
      },
      projectForm: {
        area: "",
        enterpriseName: "",
        enterpriseId: ""
      },
      normalFormRules: {
        planType: [
          { required: true, message: "请选择计划类型", trigger: "change" }
        ],
        year: [{ required: true, message: "请输入计划年份", trigger: "blur" }],
        planNo: [
          { required: true, message: "请输入计划编号", trigger: "change" }
        ],
        planName: [
          {
            required: true,
            // validator: planValidator,
            message: "请输入计划名称",
            trigger: "change"
          }
        ],

        planBeginDate: [
          {
            required: true,
            // message: "请输入执行开始日期",
            validator: planStartValidator,
            trigger: "change"
          }
        ],
        planEndDate: [
          { required: true, validator: planEndValidator, trigger: "blur" }
        ],
        planAdminOrg: [
          { required: true, validator: adminOrgValidator, trigger: "change" }
        ],
        planAdminSection: [
          {
            required: true,
            validator: adminSectionValidator,
            trigger: "change"
          }
        ]
      },
      projectFormRules: {
        // area: [{ required: true, message: "请选择区域", trigger: "change" }],
        // enterpriseName: [
        //   { required: true, message: "请选择企业名称", trigger: "change" }
        // ]
      },
      tableData: [],
      productTableData: [],
      showTable: true,
      // 例行监测、风险评估、专项检查、其他
      //0.生产企业检查 FOOD_PRODUCTION  1餐饮企业检查  CATERING_BUSINESS
      planTypeList: [
        {
          label: "生产企业检查",
          value: "FOOD_PRODUCTION"
        },
        {
          label: "餐饮企业检查",
          value: "CATERING_BUSINESS"
        }
      ],
      areaList: [],
      typeVersion: "",
      categoryList: [],
      planAdminOrgList: [],
      planImplOrgList: [],
      leadOrgList: [],
      approvalDialog: {
        visible: false,
        status: "pass",
        pass: {
          title: "审批通过",
          top: "同意审批",
          textarea: "备注信息",
          icon: "pass"
        },
        reject: {
          title: "审批否决",
          top: "否决审批",
          textarea: "请填写审批不通过的原因",
          icon: "reject"
        },
        result: true,
        content: ""
      },
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 10
      },
      entDetailvisible: false,
      dialogVisible: false,
      enterprise: {
        enterpriseName: "",
        enterpriseAddress: "",
        enterpriseNo: "",
        contact: "",
        productNo: ""
      },
      originForm: {},
      originTableData: [],
      planId: "",
      isSaved: false,
      savedPlanNo: ""
    };
  },
  components: {
    SelectTree
  },
  created() {
    this.getDefaultData();
    this.getDatas();
  },
  methods: {
    getDatas() {
      let planType = this.$route.params.planType;
      let planNo = this.$route.params.planNo ? this.$route.params.planNo : 0;
      this.planTypeShow = planType;
      if (planType == "add") {
        // add
        this.title = "新增计划";
        this.originForm = {
          planType: "",
          year: "",
          planNo: "",
          planName: "",
          planBeginDate: "",
          planEndDate: "",
          planAdminOrg: "",
          planAdminOrgId: "",
          planAdminSection: "",
          planImplOrgId: "",
          planMemo: ""
        };
        this.originTableData = [];
      }
      if (planType == "edit") {
        this.title = "编辑计划";
        this.getFormData(planNo);
      }
      // 复制并新增
      if (planType == "copy") {
        this.title = "复制并新增";
        // this.getFormData(planNo);
      }
      // 预览计划
      if (planType == "planView") {
        this.title = "预览计划";
        this.disabled = true;
        let sessionForm = getStorage("viewForm")[0];
        this.normalForm = sessionForm.normalForm;
        this.tableData = sessionForm.tableData;
      }
      // 列表预览
      if (planType == "planListView") {
        this.title = "预览计划";
        this.disabled = true;
        this.getFormData(planNo);
      }
    },
    changeLeadOrg(item) {
      let index = -1;
      index = this.validateLeadOrg(item);
      if (index != -1) {
        this.$message.error("当前页所选企业已经配置，请重新选择！");
        this.projectForm.enterpriseName.splice(index, 1);
      }
    },
    validateLeadOrg(arr) {
      let index = -1;
      for (let i = 0; i < arr.length; i++) {
        let flag = false;
        for (let j = 0; j < this.tableData.length; j++) {
          if (arr[i].label == this.tableData[j].enterpriseName) {
            flag = true;
            index = i;
            break;
          } else {
            continue;
          }
        }
        if (flag) {
          break;
        } else {
          continue;
        }
      }
      return index;
    },
    changeArea(item) {
      if (this.normalForm.planType != "") {
        this.getAllEnterprise();
      } else {
        this.$message.error("请先选择企业类型！");
      }
    },
    async getAllEnterprise() {
      this.projectForm.enterpriseName = "";
      this.leadOrgList = [];
      let res = await http.get(
        ENTERPRISE_DISTRICT +
          "/" +
          this.projectForm.area +
          "/" +
          this.normalForm.planType
      );
      if (res) {
        for (let i = 0; i < res.data.data.length; i++) {
          this.leadOrgList.push({
            label: res.data.data[i].enterpriseName,
            value: res.data.data[i].id
          });
        }
      }
    },
    async getFormData(planNo) {
      let res = await http.get(PLAN + "/" + planNo);
      if (res) {
        this.yearDisabled = true;
        this.normalForm = { ...res.data.data };
        this.planStatus = res.data.data.planStatus;
        this.normalForm.year = this.normalForm.year.toString();
        this.getTableData(true);
        this.originForm = deepClone(this.normalForm);
        this.$nextTick(() => {
          this.$refs.normalFormRefs.clearValidate();
        });
      }
    },
    async validatePlanName(name) {
      // let res = await http.get(VALIDATE, {
      //   docNo: docNo,
      //   planNo: this.normalForm.planNo
      // });
      // return res.data.result;
    },
    changeYear(year) {
      this.normalForm.planBeginDate = year + "-01-01";
      this.normalForm.planEndDate = year + "-12-31";
      this.$refs.normalFormRefs.validateField(["year"], flag => {
        if (flag) {
        }
      });
      this.getPlanNo();
    },
    async getPlanNo() {
      let res = await http.get(AUTO_PLANNO + "/" + this.normalForm.year);
      if (res) {
        this.normalForm.planNo = res.data.data.planNo;
      }
    },
    async getDefaultData() {
      this.planAdminOrgList = [];
      this.planImplOrgList = [];
      let areas = await http.get(PLAN_DISTRICT);
      if (areas) {
        for (let i = 0; i < areas.data.data.length; i++) {
          this.areaList.push({
            label: areas.data.data[i].districtName,
            value: areas.data.data[i].districtId
          });
        }
      }
    },
    save(flag) {
      this.$refs.normalFormRefs.validate(validate => {
        if (validate) {
          this.submitForm("SAVE", flag);
        } else {
          this.$message.error("请填写完整信息！");
        }
      });
    },
    onSubmit(flag) {
      this.$refs.normalFormRefs.validate(validate => {
        if (validate) {
          this.submitForm("COMMIT", flag);
        } else {
          this.$message.error("请填写完整信息！");
        }
      });
    },
    async submitForm(type, flag) {
      let form = { ...this.normalForm };
      form.year = parseInt(form.year);
      let res = "";
      res = await http.post(PLAN, form);
      if (res) {
        this.planId = res.data.data.id;
        if (type == "SAVE") {
          this.isSaved = true;
          this.savedPlanNo = form.planNo;
          if (!flag) {
            this.$message.success("保存计划成功！");
          }
        }
        if (type == "COMMIT") {
          if (this.tableData.length > 0) {
            this.dialogVisible = true;
          } else {
            this.$message.error("请先配置一条企业数据！");
          }
        }
        if (flag) {
          this.addEntToList();
        }
        // if(res.data.)
      } else {
        if (type == "SAVE") {
          this.projectForm.enterpriseName = [];
          this.$message.error("保存失败！");
        }
      }
    },
    addToList() {
      // this.$refs.projectFormRefs.validate(validate => {
      if (
        this.projectForm.area != "" &&
        this.projectForm.enterpriseName != ""
      ) {
        // let name = "";
        let index = this.validateLeadOrg(this.projectForm.enterpriseName);
        if (index == -1) {
          if (this.normalForm.planNo != "") {
            this.save(true);
          } else {
            this.$message.error("请先生成计划编号！");
          }
        } else {
          this.$message.error("当前页所选企业已经配置，请重新选择！");
        }
      } else {
        this.$message.error("请选择企业信息！");
      }
      // });
    },
    async addEntToList() {
      let idList = [];
      for (let i = 0; i < this.projectForm.enterpriseName.length; i++) {
        idList.push(this.projectForm.enterpriseName[i].value);
      }
      let res = await http.post(
        PLAN_TASK + "/" + this.normalForm.planNo + "/" + idList.join(",")
      );
      if (res) {
        this.projectForm.enterpriseName = [];
        this.getTableData();
      } else {
        this.projectForm.enterpriseName = [];
      }
    },
    async getTableData(first) {
      let res = await http.get(
        PLAN_TASK +
          "/" +
          this.normalForm.planNo +
          "/" +
          this.page.currentPage +
          "/" +
          this.page.pageSize
      );
      if (res) {
        this.tableData = [];
        let datas = res.data.data.content;
        this.page.totalElements = res.data.data.totalElements;
        for (let i = 0; i < datas.length; i++) {
          this.tableData.push({
            nums: (this.page.currentPage - 1) * this.page.pageSize + i + 1,
            enterpriseId: datas[i].enterpriseId ? datas[i].enterpriseId : "",
            enterpriseName: datas[i].enterpriseName,
            enterpriseNo: datas[i].businessLicense
              ? datas[i].businessLicense
              : "",
            category: datas[i].category,
            taskId: datas[i].id
          });
        }
        if (first) {
          this.originTableData = deepClone(this.tableData);
        }
      }
    },
    async openDetail(index, row) {
      this.productTableData = [];
      this.entDetailvisible = true;
      let res = await http.get(PLAN_ENTERPRISE + "/" + row.enterpriseId);
      if (res) {
        this.enterprise = {
          enterpriseName: res.data.data.enterpriseName,
          enterpriseAddress: res.data.data.district,
          enterpriseNo: res.data.data.businessLicense,
          contact: res.data.data.contact ? res.data.data.contact : "",
          productNo: res.data.data.category
        };
        this.productTableData.push({
          nums: 1,
          category: res.data.data.subcategory,
          classNo: res.data.data.categoryId,
          className: res.data.data.category,
          detail: res.data.data.detail ? res.data.data.detail : ""
        });
      }
    },
    async deleteProject(index, row) {
      let res = await http.delete(PLAN_TASK + "/" + row.taskId);
      if (res) {
        this.$message.success("删除成功！");
        this.page.currentPage = 1;
        // this.page.pageSize = 10;
        this.getTableData(true);
      } else {
        this.$message.error("删除失败！");
      }
    },
    toggleTable() {
      this.showTable = !this.showTable;
      if (this.showTable) {
        this.$refs.tableRefs.style.height = "auto";
      } else {
        this.$refs.tableRefs.style.height = 0;
      }
    },
    resetForm() {
      // this.normalForm = deepClone(this.originForm);
      // this.tableData = deepClone(this.originTableData);
      this.projectForm = {
        area: "",
        enterpriseName: ""
      };
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      if (this.isSaved) {
        this.getFormData(this.savedPlanNo);
      } else {
        this.normalForm = {
          planType: "",
          year: "",
          planNo: "",
          planName: "",
          planBeginDate: "",
          planEndDate: "",
          planAdminOrg: "",
          planAdminSection: "",
          planMemo: ""
        };
        this.tableData = [];
        this.page.totalElements = 0;
      }
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.getTableData();
    },
    sizeChange() {
      this.getTableData();
    },
    async confirmSubmit() {
      this.dialogVisible = false;
      let resa = await http.patch(PLAN + "/" + this.planId);
      if (resa) {
        this.$message.success("发布成功！");
        let code = "";
        if (getStorage("currentCode")) {
          code = getStorage("currentCode")[0];
        }
        setTimeout(() => {
          this.$router.push({
            path: "/PlanFormulation",
            query: {
              code: code
            }
          });
        }, 1000);
      } else {
        this.$message.success("发布失败！");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/style/PlanDetail.scss";
</style>
