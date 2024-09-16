<template>
  <div id="PlanDetail" class="PlanDetail">
    <div class="commonWidth top">
      <div class="fl top-title approval-top">
        <svg-icon iconClass="list" v-show="planTypeShow=='add'||planTypeShow=='copy'"></svg-icon>
        <svg-icon iconClass="eye" v-show="planTypeShow=='planView'"></svg-icon>
        <svg-icon iconClass="edit" v-show="planTypeShow=='edit'"></svg-icon>
        <span>{{title}} -《{{planTypeShow == 'planView' ? normalForm.planName : normalForm.planNo}}》</span>
      </div>
      <div class="fr approval-top">
        <div v-show="planTypeShow=='add'||planTypeShow=='edit'||planTypeShow=='copy' " class="fr">
          <el-button type="primary" @click="viewPlan">
            <svg-icon iconClass="eye" class="title-icon"></svg-icon>计划预览
          </el-button>
          <span class="tips">*为必填项</span>
        </div>
        <div v-show="planTypeShow=='approval'||planTypeShow=='approvalDetail'">
          <div class="fl approval-status">
            <span class="wait">待审批</span>
            <span class="pass">审批通过</span>
            <span class="nopass">审批未通过</span>
          </div>
          <div class="fr" v-show="planTypeShow=='approval'">
            <el-button type="primary" @click="approvalPlan('pass')">
              <svg-icon iconClass="eye" class="title-icon"></svg-icon>
              <span>审批通过</span>
            </el-button>
            <el-button @click="approvalPlan('reject')">
              <svg-icon iconClass="eye" class="title-icon"></svg-icon>
              <span>审批否决</span>
            </el-button>
          </div>
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
              <el-form-item label="计划年份" prop="year">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="year"
                        placeholder="请选择计划年份"
                        v-model="normalForm.year"
                        style="width: 100%;"
                        value-format="yyyy"
                        :disabled="disabled"
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
                    <!-- <el-autocomplete
                      v-model="normalForm.planName"
                      :fetch-suggestions="remoteMethod"
                      placeholder="请输入计划名称"
                      @select="handleSelect"
                      :disabled="disabled"
                      style="width:100%"
                    ></el-autocomplete>-->
                    <el-input
                      v-model="normalForm.planName"
                      :disabled="disabled"
                      placeholder="请输入计划名称"
                    ></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="文件编号" prop="planDocNo">
                <template>
                  <div class="form-item">
                    <el-input
                      v-model="normalForm.planDocNo"
                      :disabled="disabled"
                      placeholder="请输入文件编号"
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
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.planAdminOrg"
                        placeholder="请选择管理单位"
                        style="width: 100%;"
                        :disabled="disabled"
                      >
                        <el-option
                          :label="item.label"
                          :value="item.value"
                          v-for="(item, index) in manUnitList"
                          :key="'manunitlist'+index"
                        ></el-option>
                        <!-- <el-option label="类型2" value="beijing"></el-option> -->
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="组织实施单位" label-width="120px" prop="planImplOrg">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.planImplOrg"
                        placeholder="请选择组织实施单位"
                        style="width: 100%;"
                        :disabled="disabled"
                      >
                        <el-option
                          :label="item.label"
                          :value="item.value"
                          v-for="(item, index) in orgUnitList"
                          :key="'orgunitlist'+index"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
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
            <el-form
              :model="projectForm"
              ref="projectFormRefs"
              :rules="projectFormRules"
              label-width="120px"
            >
              <div class="fl item">
                <div class="common-title">项目</div>
                <div class="form">
                  <el-form-item label="业态：" prop="type">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.type"
                            placeholder="业态"
                            style="width: 100%;"
                            :disabled="disabled"
                            @change="changeBusniess"
                          >
                            <el-option
                              :label="item.label"
                              :value="item.value"
                              v-for="(item, index) in busniessList"
                              :key="'businesslist'+index"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="icons" v-show="!disabled">
                          <svg-icon iconClass="down"></svg-icon>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                  <el-form-item label="大类：" prop="categoryLv1">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.categoryLv1"
                            placeholder="大类"
                            style="width: 100%;"
                            :disabled="disabled"
                          >
                            <el-option
                              v-for="(item,index) in kindsList"
                              :label="item.label"
                              :value="item.value"
                              :key="'kingslist'+index"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="icons" v-show="!disabled">
                          <svg-icon iconClass="down"></svg-icon>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                  <!-- <div
                  class="empty-class"
                  @click="addKinds"
                  v-show="!disabled&&kindsList.length==0"
                  >业态下大类若不存在，请点击此处新增</div>-->
                </div>
              </div>
              <div class="fl item">
                <div class="common-title">牵头单位</div>
                <div class="form">
                  <el-form-item label="牵头单位：" prop="leadOrg">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.leadOrg"
                            placeholder="牵头单位"
                            :disabled="disabled"
                            style="width: 100%;"
                          >
                            <el-option
                              :label="item.label"
                              :value="item.value"
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
              <div class="label">项目配置结果</div>
              <div class="result">
                已配置
                <span>{{tableData.length}}</span>个项目
              </div>
              <el-button class="fr" @click="toggleTable">
                <svg-icon :iconClass="showTable?'up':'down'"></svg-icon>
                <span>{{showTable?'折叠':'展开'}}</span>
              </el-button>
            </div>
            <div class="list-table" ref="tableRefs">
              <el-table :data="tableData" border :span-method="objectSpanMethod">
                <el-table-column label="牵头单位" prop="leadOrg" width="200"></el-table-column>
                <el-table-column label="业态" prop="type" width="160"></el-table-column>
                <el-table-column label="大类" prop="categoryLv1" width="160"></el-table-column>
                <el-table-column label="项目名称" prop="projectName"></el-table-column>
                <el-table-column label="操作" align="center" width="240" v-if="!disabled">
                  <template slot-scope="scope">
                    <span style="cursor:pointer;" @click="deleteProject(scope.$index, scope.row)">
                      <svg-icon iconClass="delete"></svg-icon>
                      <span>删除</span>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

        <div class="commonWidth last">
          <div class="item">
            <div class="common-title">判定标准</div>
            <div class="last-box">
              <div class="fl in-item">
                <el-form-item label="标准名称" prop="judgementStandard">
                  <template>
                    <div class="form-item">
                      <!-- <el-input v-model="normalForm.judgementStandard" :disabled="disabled"></el-input> -->
                      <div class="left-item">
                        <el-select
                          v-model="normalForm.judgementStandard"
                          placeholder="请选择标准名称"
                          :disabled="disabled"
                          style="width: 100%;"
                        >
                          <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="(item, index) in standardList"
                            :key="'standardlist'+index"
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
              <div class="fl in-item" @click="downStandard">
                <el-button>
                  <svg-icon iconClass="eye"></svg-icon>
                  <span>查看判定标准</span>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="commonWidth operation" v-show="!disabled">
      <div class="inner">
        <el-button class="btns" type="primary" @click="saveForm">
          <svg-icon iconClass="save"></svg-icon>
          <span>保存</span>
        </el-button>
        <el-button class="btns" type="primary" @click="onSubmit">
          <svg-icon iconClass="save"></svg-icon>
          <span>提交</span>
        </el-button>
        <el-button class="btns" @click="resetForm">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    <!-- <el-dialog
      title="新建大类"
      :visible.sync="kindsDialog"
      width="500px"
      :before-close="handleClose"
      :append-to-body="true"
      label-width="120px"
    >
      <div class="form">
        <el-form :model="kindsForm" ref="kindsFormRefs" :rules="kindsFormRules">
          <el-form-item label="大类名称" prop="oneKind" label-width="100px">
            <template>
              <div class="form-item">
                <el-input v-model="kindsForm.oneKind" placeholder="请输入大类名称"></el-input>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kindsDialog = false">取消</el-button>
        <el-button type="primary" @click="saveKinds">保存</el-button>
      </span>
    </el-dialog>-->
    <div
      class="commonWidth approval-step"
      v-show="planTypeShow=='approval'||planTypeShow=='approvalDetail'"
    >
      <div class="icon-title">
        <svg-icon iconClass="tips"></svg-icon>
        <span>操作人员</span>
      </div>
      <div class="row-item m20">
        <div class="row-item-inner">
          <span>计划编制：</span>
          <span>XXX</span>
        </div>
        <div class="row-item-inner">
          <span>计划审批：</span>
          <span>XXX</span>
        </div>
      </div>
      <div class="icon-title m20">
        <svg-icon iconClass="tips"></svg-icon>
        <span>审核记录(共X条)</span>
      </div>
      <div class="approval-steps-box">
        <div class="approval-steps">
          <div class="steps-title">
            <label></label>
            <span>07-10</span>
          </div>

          <div class="steps-content">
            <div class="content-text">
              <div class="content-text-top">
                <div class="fl">
                  <svg-icon iconClass="user" class="user-icon"></svg-icon>
                  <span class="user-name">name</span>
                </div>
                <div class="fr content-time">
                  <svg-icon iconClass="time"></svg-icon>
                  <span>2019-01-01</span>
                </div>
              </div>
              <div class="content-texts">请输入计划名称</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :title="approvalDialog[approvalDialog.status].title"
      :visible.sync="approvalDialog.visible"
      width="450px"
      top="240px"
      custom-class="approvalDialog"
    >
      <div>
        <p class="titles" :class="approvalDialog.status">
          <svg-icon :iconClass="approvalDialog[approvalDialog.status].icon" class="aicon"></svg-icon>
          <span>{{approvalDialog[approvalDialog.status].top}}</span>
        </p>
        <p class="titles">AAABBB</p>
        <div class="textarea">
          <div class="txt">{{approvalDialog[approvalDialog.status].textarea}}</div>
          <div class="content">
            <el-input
              type="textarea"
              v-model="approvalDialog.content"
              :autosize="{ minRows: 4, maxRows: 5}"
              maxlength="300"
              show-word-limit
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approvalDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="approvalConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/index.js";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { PLAN } = apis;
export default {
  data() {
    var _this = this;
    var planValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划名称"));
      }
      let name = "aa";
      if (name == value) {
        callback(new Error("名称已经存在！"));
      } else {
        if (value.length > 25 || value.length < 3) {
          callback(new Error("名称长度在3到25之间！"));
        } else {
          callback();
        }
      }
    };
    var docNumValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入文件编号"));
      }
      let name = "aa";
      if (name == value) {
        callback(new Error("编号已经存在！"));
      } else {
        if (value.length > 25 || value.length < 3) {
          callback(new Error("文件编号在3到25之间！"));
        } else {
          callback();
        }
      }
    };

    var endDateValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择结束日期"));
      }
      if (value < _this.normalForm.planBeginDate) {
        callback(new Error("结束日期小于开始日期！"));
      } else {
        callback();
      }
    };

    return {
      title: "新增计划",
      disabled: false,
      planTypeShow: "add",
      normalForm: {
        planType: "",
        year: "",
        planNo: "",
        planName: "",
        planDocNo: "",
        planBeginDate: "",
        planEndDate: "",
        planAdminOrg: "",
        planImplOrg: "",
        planMemo: "",
        judgementStandard: "",
        planStatus: 1
      },
      projectForm: {
        type: "",
        categoryLv1: "",
        leadOrg: ""
      },
      kindsForm: {
        oneKind: ""
      },
      normalFormRules: {
        planType: [
          { required: true, message: "请输入计划类型", trigger: "change" }
        ],
        year: [{ required: true, message: "请输入计划年份", trigger: "blur" }],
        planNo: [
          { required: true, message: "请输入计划编号", trigger: "blur" }
        ],
        planName: [
          {
            required: true,
            validator: planValidator,
            trigger: "change"
          }
        ],
        planDocNo: [
          {
            required: true,
            validator: docNumValidator,
            trigger: "change"
          }
        ],
        planBeginDate: [
          { required: true, message: "请输入执行开始日期", trigger: "blur" }
        ],
        planEndDate: [
          { required: true, validator: endDateValidator, trigger: "blur" }
        ],
        planAdminOrg: [
          { required: true, message: "请输入管理单位", trigger: "change" }
        ],
        planImplOrg: [
          { required: true, message: "请输入组织实施单位", trigger: "change" }
        ],
        judgementStandard: [
          { required: true, message: "请选择判定标准", trigger: "change" }
        ]
      },
      projectFormRules: {
        type: [{ required: true, message: "请输入业态", trigger: "change" }],
        categoryLv1: [
          { required: true, message: "请输入大类", trigger: "change" }
        ],
        leadOrg: [
          { required: true, message: "请输入牵头单位", trigger: "change" }
        ]
      },
      kindsFormRules: {
        oneKind: [
          { required: true, message: "请输入大类名称", trigger: "blur" }
        ]
      },
      tableData: [
        // {
        //   leadOrg: "单位1",
        //   type: "type",
        //   categoryLv1: "categoryLv1",
        //   projectName: "projectName"
        // }
      ],
      tableTreeData: [],
      colObj: {},
      showTable: true,
      // 例行监测、风险评估、专项检查、其他
      planTypeList: [
        {
          label: "例行监测",
          value: "例行监测"
        },
        {
          label: "风险评估",
          value: "风险评估"
        },
        {
          label: "专项检查",
          value: "专项检查"
        },
        {
          label: "其他",
          value: "其他"
        }
      ],
      // 种植业 畜禽 水产
      busniessList: [
        {
          label: "种植业",
          value: "种植业"
        },
        {
          label: "畜禽产品",
          value: "畜禽产品"
        },
        {
          label: "水产品",
          value: "水产品"
        }
      ],
      kindsList: [],
      standardList: [
        {
          label: "种植业",
          value: "种植业"
        }
      ],
      manUnitList: [],
      orgUnitList: [],
      leadOrgList: [],
      kindsDialog: false,
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
        content: ""
      }
    };
  },
  created() {
    let planType = this.$route.params.planType;
    let planNo = this.$route.params.planNo;
    this.planTypeShow = planType;
    if (planType == "add") {
      // add
      console.log("add");
      this.title = "新增计划";
      this.getDefaultData();
    }
    if (planType == "edit") {
      this.title = "编辑计划";
      // this.getFormData(planNo);
      // this.normalForm = { ...this.$route.params.row };
    }
    // 复制并新增
    if (planType == "copy") {
      this.title = "复制并新增";
      // this.normalForm = { ...this.$route.params.row };
    }
    // 预览计划
    if (planType == "planView") {
      this.title = "预览计划";
      this.disabled = true;
      let sessionForm = getStorage("viewForm")[0];
      this.normalForm = sessionForm.normalForm;
      this.tableData = sessionForm.tableData;
      this.formatTable();
      // this.getFormData(planNo);
    }
    // 审批详情
    if (planType == "approvalDetail") {
      this.title = "审批详情";
      this.disabled = true;
      // this.normalForm = { ...this.$route.params.row };
    }
    // 审批计划
    if (planType == "approval") {
      this.title = "审批计划";
      this.disabled = true;
      // this.normalForm = { ...this.$route.params.row };
    }
  },
  methods: {
    async getFormData(planNo) {
      let res = await http.get(PLAN + "/" + planNo);
      if (res) {
        this.normalForm = { ...res };
        res.groupedProjectInfos.forEach((item, index) => {
          item.projects.forEach((itema, indexa) => {
            this.tableData.push({
              leadOrg: item.leadOrg,
              type: itema.type,
              categoryLv1: itema.categoryLv1,
              projectName: itema.projectName
            });
          });
        });
        this.normalForm.year = this.normalForm.year.toString();
        this.formatTable();
      }
    },
    handleSelect() {},
    getDefaultData() {
      this.normalForm.planNo = "AAABBB";
      this.manUnitList = [
        {
          label: "管理单位",
          value: "管理单位"
        }
      ];
      this.orgUnitList = [
        {
          label: "组织实施单位",
          value: "组织实施单位"
        }
      ];
      this.leadOrgList = [
        {
          label: "牵头单位",
          value: "牵头单位"
        }
      ];
    },
    onSubmit() {
      this.$refs.normalFormRefs.validate(validate => {
        if (validate) {
          console.log("submit!");
        } else {
          this.$message.error("请填写完整信息！");
        }
      });
    },
    addToList() {
      // let checkList = false;
      this.$refs.projectFormRefs.validate(validate => {
        if (validate) {
          let name = "";
          let flag = false;
          let index = this.tableData.length - 1;
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].leadOrg == this.normalForm.leadOrg) {
              index = i;
            }
            if (
              this.tableData[i].leadOrg == this.normalForm.leadOrg &&
              this.tableData[i].type == this.normalForm.type &&
              this.tableData[i].categoryLv1 == this.normalForm.categoryLv1
            ) {
              flag = true;
            }
          }
          if (!flag) {
            this.$refs.normalFormRefs.validateField(["year"], error => {
              // return;
            });
            if (this.normalForm.year != "") {
              this.tableData.splice(index, 0, {
                leadOrg: this.normalForm.leadOrg,
                type: this.normalForm.type,
                categoryLv1: this.normalForm.categoryLv1,
                projectName:
                  this.normalForm.year +
                  "国家" +
                  this.normalForm.type +
                  "(" +
                  this.normalForm.categoryLv1 +
                  ")" +
                  "质量安全(" +
                  this.planType +
                  ")项目"
              });
              this.formatTable();
            } else {
              this.$message.error("请选择计划年份！");
            }
          } else {
            this.$message.error("项目已经存在！");
          }
        } else {
          this.$message.error("请选择项目信息！");
        }
      });
      // if (
      //   this.normalForm.type &&
      //   this.normalForm.categoryLv1 &&
      //   this.normalForm.leadOrg
      // ) {
      // if (
      //   this.normalForm.type != "" &&
      //   this.normalForm.categoryLv1 != "" &&
      //   this.normalForm.leadOrg != ""
      // ) {
      //   checkList = true;
      // } else {
      //   checkList = false;
      // }
      // // } else {
      // //   checkList = false;
      // // }

      // console.log(checkList);
      // if (checkList) {
      // }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.colObj[rowIndex]) {
          return {
            rowspan: this.colObj[rowIndex],
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    deleteProject(index, row) {
      this.tableData.splice(index, 1);
      this.formatTable();
    },
    toggleTable() {
      this.showTable = !this.showTable;
      if (this.showTable) {
        this.$refs.tableRefs.style.height = "auto";
      } else {
        this.$refs.tableRefs.style.height = 0;
      }
    },
    formatTable() {
      this.tableTreeData = [];
      this.tableData.forEach((item, indexc) => {
        if (this.tableTreeData.length > 0) {
          let flag = false;
          let index = 0;
          for (let i = 0; i < this.tableTreeData.length; i++) {
            if (this.tableData[indexc].leadOrg == this.tableTreeData[i].name) {
              flag = true;
              index = i;
              break;
            }
          }
          if (flag) {
            this.tableTreeData[index].children.push({
              type: item.type,
              categoryLv1: item.categoryLv1,
              projectName: item.projectName
            });
          } else {
            this.tableTreeData.push({
              name: item.leadOrg,
              children: [
                {
                  type: item.type,
                  categoryLv1: item.categoryLv1,
                  projectName: item.projectName
                }
              ]
            });
          }
        } else {
          this.tableTreeData.push({
            name: item.leadOrg,
            children: [
              {
                type: item.type,
                categoryLv1: item.categoryLv1,
                projectName: item.projectName
              }
            ]
          });
        }
      });
      let numa = 0;
      this.colObj = {};
      this.tableTreeData.forEach((item, index) => {
        let num = 0;
        item.children.forEach((itema, indexa) => {
          num++;
          // this.tableData.push({
          //   leadOrg: item.leadOrg,
          //   type: itema.type,
          //   categoryLv1: itema.categoryLv1,
          //   projectName: itema.projectName
          // });
        });
        this.colObj[numa] = num;
        numa = numa + num;
      });
      console.log(this.tableData);
    },
    // 保存
    saveForm() {
      this.$refs.normalFormRefs.validate(a => {
        if (a) {
          console.log("save");
        } else {
          this.$message.error("请填写完整信息！");
          return false;
        }
      });
    },
    handleClose() {
      this.kindsDialog = false;
    },
    saveKinds() {
      this.$refs.kindsFormRefs.validate(validate => {
        if (validate) {
          this.kindsList.push({
            label: this.kindsForm.oneKind,
            value: this.kindsForm.oneKind
          });
          this.kindsDialog = false;
        }
      });
    },
    resetForm() {
      setStorage("addForm", "");
      this.$refs.normalFormRefs.resetFields();
    },
    viewPlan() {
      this.$refs.normalFormRefs.validate(validate => {
        if (validate) {
          setStorage("viewForm", {
            normalForm: this.normalForm,
            tableData: this.tableData
          });
          let routeUrl = this.$router.resolve({
            name: "预览计划",
            params: {
              planNo: this.normalForm.planNo,
              planType: "planView"
            }
          });
          window.open(routeUrl.href, "_blank");
        } else {
          this.$message.error("请填写完整信息！");
        }
      });
    },
    // 审批计划
    approvalPlan(status) {
      this.approvalDialog.visible = true;
      this.approvalDialog.status = status;
    },
    approvalConfirm() {
      this.approvalDialog.visible = false;
      this.$router.replace({
        path: "/refresh"
      });
    },
    changeBusniess() {
      this.kindsList = [];
      this.kindsList = [
        {
          label: "add",
          value: "add"
        }
      ];
    },
    downStandard() {}
  }
};
</script>

<style lang="scss" scoped>
@import "~@/style/PlanDetail.scss";
</style>
