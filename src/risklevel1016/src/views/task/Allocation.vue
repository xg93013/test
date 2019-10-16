<template>
  <div id="Allocation">
    <div class="commonWidth top" v-show="taskType=='add'">
      <div class="fl top-title">
        <svg-icon iconClass="list"></svg-icon>
        <span>分配任务-《{{planForm.planName}}》</span>
      </div>
      <div class="fr">
        <!-- <el-button type="primary" @click="viewTask">
          <svg-icon iconClass="eye" class="title-icon"></svg-icon>任务预览
        </el-button>-->
        <span class="tips">
          <label class="not-empty">*</label>为必填项
        </span>
      </div>
    </div>
    <div class="commonWidth top" v-show="taskType!='add'">
      <div class="fl top-title">
        <svg-icon iconClass="view"></svg-icon>
        <span>《{{planForm.planName}}》详情</span>
      </div>
    </div>
    <div class="commonWidth setting-form" v-show="taskType=='add'">
      <div class="common-title">设定检查人员</div>
      <div class="setting-btn">
        <el-button type="primary" class="fr" @click="settingPeople">设定</el-button>
      </div>
      <el-form ref="checkFormRefs" :model="checkForm" :rules="checkFormRules" label-width="140px">
        <div class="fl item" v-for="(item, index) in personList" :key="item.prop+index">
          <div class="form">
            <el-form-item :label="item.label" :prop="item.prop">
              <template>
                <div class="form-item">
                  <div class="left-item">
                    <!-- <div
                      class="tag"
                      v-for="(tag,index) in checkForm[item.prop]"
                      :key="'tag'+index"
                      v-if="tag!=''"
                    >
                      <span>{{tag}}</span>
                      <svg-icon
                        iconClass="close"
                        class="tag-icon"
                        @click.native="handleCloseLeader(item.prop, tag)"
                      ></svg-icon>
                    </div>-->
                    <el-select
                      v-model="checkForm[item.prop]"
                      :placeholder="'请选择'+item.label+'人员'"
                      style="width:100%;"
                    >
                      <el-option
                        v-for="(itema ,indexa) in allPersonList"
                        :key="index+''+indexa+'allplan'"
                        :label="itema.label"
                        @click.native="changePerson(item.prop, itema)"
                        :value="itema.label"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="icons" style="cursor:pointer;">
                    <!-- @click="selectPerson(item.prop,item.title)" -->
                    <svg-icon iconClass="user"></svg-icon>
                  </div>
                </div>
              </template>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="commonWidth setting-form" v-show="taskType=='add'">
      <div class="common-title">设定工作时间</div>
      <div class="setting-btn">
        <el-button type="primary" class="fr" @click="settingDate">设定</el-button>
      </div>
      <el-form ref="dateFormRefs" :model="dateForm" :rules="dateFormRules" label-width="160px">
        <div class="fl item" v-for="(item, index) in dateList" :key="item.prop+index">
          <div class="form">
            <el-form-item :label="item.label" :prop="item.prop">
              <template>
                <div class="form-item">
                  <div class="left-item">
                    <el-date-picker
                      type="date"
                      placeholder="请选择执行开始日期"
                      v-model="dateForm[item.prop]"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </div>
                  <div class="icons">
                    <svg-icon iconClass="date"></svg-icon>
                  </div>
                </div>
              </template>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="commonWidth setting-result">
      <div class="plan-detail" v-show="taskType!='add'">
        <div class="detail-title">
          <svg-icon iconClass="tips"></svg-icon>
          <span>计划详情</span>
        </div>
        <div class="normal-table">
          <div class="normal-table-item">
            <div class="title">计划名称：</div>
            <div class="name">{{planForm.planName}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title">计划编号：</div>
            <div class="name">{{planForm.planNo}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title">计划预览：</div>
            <!-- <div class="name" @click="viewPlan">{{planForm.planName}}</div> -->
          </div>
          <div class="normal-table-item">
            <div class="title">备注：</div>
            <div class="name">{{planForm.remarks}}</div>
          </div>
        </div>
        <!-- <div class="normal-table"></div> -->
      </div>
      <div class="setting-title">
        <div class="fl" :class="{'common-title':taskType=='add'}">
          <span v-show="taskType=='add'">配置结果</span>
          <span v-show="taskType!='add'">
            <svg-icon iconClass="tips"></svg-icon>
            <span>分配详情</span>
          </span> （共计
          <!-- <span class="aColor">100</span> 家，已选中 -->
          <span class="bColor">{{statusCount.total}}</span> 家，已配置
          <span class="bColor">{{statusCount.setting}}</span> 家，待配置
          <span class="cColor">{{statusCount.notSetting}}</span> 家）
        </div>
        <div class="fr">
          <MoreCheckbox
            :title="settingTitle"
            :allData="settingCheckbox"
            :defaultData="[]"
            @backLinks="backCheck"
            style="width:200px;"
            placement="bottom-end"
          />
        </div>
      </div>
      <el-table :data="tableData" border style="margin-top: 20px;">
        <el-table-column label="序号" prop="nums"></el-table-column>
        <el-table-column label="企业名称" prop="enterpriseName" sortable></el-table-column>
        <el-table-column label="营业执照号码" prop="enterpriseNum" sortable></el-table-column>
        <el-table-column label="工作日期" prop="date" width="300" sortable sort-by="groupStart">
          <template slot-scope="scope">
            <div>
              <p>
                <span class="aColor">体系检查：</span>
                {{scope.row['groupStart'] }}&nbsp;、{{scope.row['groupEnd']}}
              </p>
              <p>
                <span class="aColor">跟踪指导：</span>
                {{scope.row['trackingStart']}}&nbsp;、{{scope.row['trackingEnd']}}
              </p>
              <p>
                <span class="aColor">报告编制：</span>
                {{scope.row['formulationStart']}}&nbsp;、{{scope.row['formulationEnd']}}
              </p>
              <p>
                <span class="aColor">报告审批：</span>
                {{scope.row['ApprovalStart']}}&nbsp;、{{scope.row['ApprovalEnd']}}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="负责人员" prop="person" width="350" sortable>
          <template slot-scope="scope">
            <div>
              <p>
                <span class="aColor">体系检查：</span>
                负责组长({{scope.row['groupLeader']}})&nbsp;、负责人员({{scope.row['leaderMan']}})
              </p>
              <p>
                <span class="aColor">跟踪指导：</span>
                负责组长({{scope.row['trackingLeader']}})&nbsp;、负责人员({{scope.row['trackingMan']}})
              </p>
              <p>
                <span class="aColor">报告编制：</span>
                负责组长({{scope.row['docFormulation']}})&nbsp;、负责人员({{scope.row['formulationMan']}})
              </p>
              <p>
                <span class="aColor">报告审批：</span>
                负责组长({{scope.row['docApproval']}})&nbsp;、负责人员({{scope.row['approvalMan']}})
              </p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" prop="operation" align="center" v-if="taskType=='add'">
          <template slot-scope="scope">
            <div @click="edit(scope.row)" style="cursor:pointer;">
              <svg-icon iconClass="edit"></svg-icon>
              <label style="cursor:pointer;">编辑</label>
            </div>
          </template>
        </el-table-column>-->
      </el-table>
      <!-- <div class="page-box">
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          class="fr"
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>-->
    </div>
    <div class="commonWidth bot" v-show="taskType=='add'">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button @click="submit">
            <svg-icon iconClass="save"></svg-icon>
            <span>下发任务</span>
          </el-button>
          <el-button @click="reset">
            <svg-icon iconClass="reset"></svg-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="1200px"
      custom-class="allocation-dialog"
    >
      <select-person ref="selectPersonRefs" :personType="dialogTitle"></select-person>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MoreCheckbox from "@/components/MoreCheckbox/index.vue";
import SelectPerson from "@/components/SelectPerson/index.vue";
import DownTree from "@/components/DownTree/index.vue";
import { setStorage, getStorage, deepClone } from "@/utils/index.js";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { TASKS_TASKACTION, ACCOUNTS_ALL, PLAN } = apis;
export default {
  data() {
    var _this = this;
    var groupEndValidator = (rule, value, callback) => {
      // console.log(value);
      if (!value) {
        callback(new Error("请选择日期！"));
      }
      if (value < _this.dateForm.groupStart) {
        callback(new Error("结束日期必须大于开始日期！"));
      } else {
        callback();
      }
    };
    var trackingEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      }
      if (value < _this.dateForm.trackingStart) {
        callback(new Error("结束日期必须大于开始日期！"));
      } else {
        callback();
      }
    };
    var formulationEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      }
      if (value < _this.dateForm.formulationStart) {
        callback(new Error("结束日期必须大于开始日期！"));
      } else {
        callback();
      }
    };
    var ApprovalEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      }
      if (value < _this.dateForm.ApprovalStart) {
        callback(new Error("结束日期必须大于开始日期！"));
      } else {
        callback();
      }
    };
    return {
      allPersonList: [],
      checkForm: {
        groupLeader: "", // 体系检查
        groupLeaderId: "",
        leaderMan: "",
        leaderManId: "",
        trackingLeader: "", // 跟踪指导
        trackingLeaderId: "",
        trackingMan: "",
        trackingManId: "",
        docFormulation: "", // 报告编制
        docFormulationId: "",
        formulationMan: "",
        formulationManId: "",
        docApproval: "", // 报告审批
        docApprovalId: "",
        approvalMan: "",
        approvalManId: ""
      },
      dateForm: {
        groupStart: "",
        groupEnd: "",
        trackingStart: "",
        trackingEnd: "",
        formulationStart: "",
        formulationEnd: "",
        ApprovalStart: "",
        ApprovalEnd: ""
      },
      personList: [
        {
          label: "体系检查组长",
          title: "体系检查",
          prop: "groupLeader"
        },
        {
          label: "负责人员",
          title: "体系检查",
          prop: "leaderMan"
        },
        {
          label: "跟踪指导组长",
          title: "跟踪指导",
          prop: "trackingLeader"
        },
        {
          label: "负责人员",
          title: "跟踪指导",
          prop: "trackingMan"
        },
        {
          label: "报告编制组长",
          title: "报告编制",
          prop: "docFormulation"
        },
        {
          label: "负责人员",
          title: "报告编制",
          prop: "formulationMan"
        },
        {
          label: "报告审批组长",
          title: "报告审批",
          prop: "docApproval"
        },
        {
          label: "负责人员",
          title: "报告审批",
          prop: "approvalMan"
        }
      ],
      dateList: [
        {
          label: "体系检查开始日期",
          prop: "groupStart"
        },
        {
          label: "结束日期",
          prop: "groupEnd"
        },
        {
          label: "跟踪指导开始日期",
          prop: "trackingStart"
        },
        {
          label: "结束日期",
          prop: "trackingEnd"
        },
        {
          label: "编制报告开始日期",
          prop: "formulationStart"
        },
        {
          label: "结束日期",
          prop: "formulationEnd"
        },
        {
          label: "审批报告开始日期",
          prop: "ApprovalStart"
        },
        {
          label: "结束日期",
          prop: "ApprovalEnd"
        }
      ],
      checkFormRules: {},
      dateFormRules: {
        groupStart: [
          {
            required: true,
            // validator: groupStartValidator,
            message: "请选择日期！",
            trigger: "blur"
          }
        ],
        trackingStart: [
          {
            required: true,
            // validator: trackingStartValidator,
            message: "请选择日期！",
            trigger: "blur"
          }
        ],
        formulationStart: [
          {
            required: true,
            // validator: formulationEndValidator,
            message: "请选择日期！",
            trigger: "blur"
          }
        ],
        ApprovalStart: [
          {
            required: true,
            // validator: ApprovalEndValidator,
            message: "请选择日期！",
            trigger: "blur"
          }
        ],
        groupEnd: [
          {
            required: true,
            validator: groupEndValidator,
            trigger: "blur"
          }
        ],
        trackingEnd: [
          {
            required: true,
            validator: trackingEndValidator,
            trigger: "blur"
          }
        ],
        formulationEnd: [
          {
            required: true,
            validator: formulationEndValidator,
            trigger: "blur"
          }
        ],
        ApprovalEnd: [
          {
            required: true,
            validator: ApprovalEndValidator,
            trigger: "blur"
          }
        ]
      },
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },

      tableData: [],
      originData: [],
      totalData: [],
      currentNums: "",
      dialogVisible: false,
      dialogTitle: "",
      dialogProp: "",
      dialogSearch: {
        toSubject: "专业",
        keyWord: ""
      },
      settingTableData: [],
      settingCheckbox: [
        {
          id: "0",
          label: "已配置"
        },
        {
          id: "1",
          label: "未配置"
        }
      ],
      typeNo: "",
      taskType: "",
      taskName: "",

      planForm: {
        planName: "",
        planNo: "",
        remarks: ""
      },
      // planNo: "",
      settingFinish: false,
      statusCount: {
        total: 0,
        setting: 0,
        notSetting: 0
      },
      settingTitle: "选择配置状态"
    };
  },
  components: {
    MoreCheckbox,
    SelectPerson,
    DownTree
  },
  created() {
    let taskType = this.$route.params.taskType;
    this.planForm.planNo = this.$route.params.planNo;
    // this.taskNo = this.$route.params.taskNo;
    // this.planName = this.$route.params.planName;
    this.taskType = taskType;
    this.getPlanData();
    this.getDatas();
    if (taskType == "add") {
      // 添加
      for (let i = 0; i < this.personList.length; i++) {
        this.checkFormRules[this.personList[i].prop] = [
          {
            required: true,
            message: `请选择${this.personList[i].label}`,
            trigger: "change"
          }
        ];
      }
    }
    if (taskType == "view") {
      //预览
      let taskForm = getStorage("taskForm")[0];
      if (taskForm != "") {
        this.planForm = taskForm.planForm;
        this.tableData = taskForm.tableData;
      }
    }

    // 详情
    if (taskType == "detail") {
    }
  },
  methods: {
    async getPlanData() {
      let res = await http.get(PLAN + "/" + this.planForm.planNo);
      if (res) {
        this.planForm.planName = res.data.data.planName;
        // this.planForm.planNo = res.data.data.planNo;
      }
    },
    async getDatas() {
      let lists = getStorage("taskNoList");
      let taskNos = lists.join(",");
      let res = await http.get(TASKS_TASKACTION + "/" + taskNos);
      if (res) {
        this.tableData = [];
        let datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          let obj = {
            nums: i + 1,
            enterpriseName: datas[i].enterpriseName,
            enterpriseNum: datas[i].businessLicense,
            taskNo: datas[i].taskNo
          };
          if (datas[i].dateDTOList && datas[i].dateDTOList.length > 0) {
            let dateList = datas[i].dateDTOList;
            for (let j = 0; j < dateList.length; j++) {
              if (dateList[j].taskActionTypeEnum == "CHECK") {
                obj.groupStart = dateList[j].beginDate;
                obj.groupEnd = dateList[j].endDate;
              }
              if (dateList[j].taskActionTypeEnum == "LEAD") {
                obj.trackingStart = dateList[j].beginDate;
                obj.trackingEnd = dateList[j].endDate;
              }
              if (dateList[j].taskActionTypeEnum == "REPORT") {
                obj.formulationStart = dateList[j].beginDate;
                obj.formulationEnd = dateList[j].endDate;
              }
              if (dateList[j].taskActionTypeEnum == "APPROVE") {
                obj.ApprovalStart = dateList[j].beginDate;
                obj.ApprovalEnd = dateList[j].endDate;
              }
            }
          } else {
            // obj.groupStart = "";
            // obj.groupEnd = "";
            // obj.trackingStart = "";
            // obj.trackingEnd = "";
            // obj.formulationStart = "";
            // obj.formulationEnd = "";
            // obj.ApprovalStart = "";
            // obj.ApprovalEnd = "";
            for (let key in this.checkForm) {
              obj[key] = "";
            }
          }
          if (datas[i].personDTOList && datas[i].personDTOList.length > 0) {
            let personList = datas[i].personDTOList;
            for (let j = 0; j < personList.length; j++) {
              if (personList[j].taskActionTypeEnum == "CHECK") {
                obj.groupLeader = personList[j].groupName;
                obj.leaderMan = personList[j].personName;
                obj.groupLeaderId = personList[j].groupId;
                obj.leaderManId = personList[j].personId;
              }
              if (personList[j].taskActionTypeEnum == "LEAD") {
                obj.trackingLeader = personList[j].groupName;
                obj.trackingMan = personList[j].personName;
                obj.trackingLeaderId = personList[j].groupId;
                obj.trackingManId = personList[j].personId;
              }
              if (personList[j].taskActionTypeEnum == "REPORT") {
                obj.docFormulation = personList[j].groupName;
                obj.formulationMan = personList[j].personName;
                obj.docFormulationId = personList[j].groupId;
                obj.formulationManId = personList[j].personId;
              }
              if (personList[j].taskActionTypeEnum == "APPROVE") {
                obj.docApproval = personList[j].groupName;
                obj.approvalMan = personList[j].personName;
                obj.docApprovalId = personList[j].groupId;
                obj.approvalManId = personList[j].personId;
              }
            }
          } else {
            for (let key in this.dateForm) {
              obj[key] = "";
            }
            for (let key in this.checkForm) {
              obj[key] = "";
            }
          }
          this.tableData.push(obj);
        }
        this.originData = deepClone(this.tableData);
        this.totalData = [...this.tableData];
        this.getStatusCount();
      }
      let resa = await http.get(ACCOUNTS_ALL);
      if (resa) {
        let datas = resa.data.data;
        for (let i = 0; i < datas.length; i++) {
          this.allPersonList.push({
            label: datas[i].name,
            value: datas[i].account
          });
        }
      }
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.getDatas();
    },
    sizeChange() {
      this.getDatas();
    },
    handleCloseLeader(prop, tag) {
      this.checkForm[prop].splice(this.checkForm[prop].indexOf(tag), 1);
    },
    selectPerson(prop, title) {
      this.dialogTitle = "选择" + title;
      this.dialogVisible = true;
      this.dialogProp = prop;
      this.settingTableData = [];
    },
    settingPeople() {
      this.$refs.checkFormRefs.validate(validate => {
        if (validate) {
          if (this.currentNums == "") {
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < this.personList.length; j++) {
                this.tableData[i][this.personList[j].prop] = this.checkForm[
                  this.personList[j].prop
                ];
                // id
                this.tableData[i][
                  this.personList[j].prop + "Id"
                ] = this.checkForm[this.personList[j].prop + "Id"];
              }
            }
          } else {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.currentNums == this.tableData[i].nums) {
                for (let j = 0; j < this.personList.length; j++) {
                  this.tableData[i][this.personList[j].prop] = this.checkForm[
                    this.personList[j].prop
                  ];
                }
                break;
              }
            }
          }
          this.settingFinish = true;
          this.totalData = [...this.tableData];
        } else {
          this.$message.error("请先设定检查工作人员！");
        }
      });
    },
    settingDate() {
      this.$refs.dateFormRefs.validate(validate => {
        if (validate) {
          if (this.currentNums == "") {
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < this.dateList.length; j++) {
                this.tableData[i][this.dateList[j].prop] = this.dateForm[
                  this.dateList[j].prop
                ];
              }
            }
          } else {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.currentNums == this.tableData[i].nums) {
                for (let j = 0; j < this.dateList.length; j++) {
                  this.tableData[i][this.dateList[j].prop] = this.dateForm[
                    this.dateList[j].prop
                  ];
                }
                break;
              }
            }
          }
          this.settingFinish = true;
          this.totalData = [...this.tableData];
        } else {
          this.$message.error("请选择工作时间！");
        }
      });
    },
    settingTotal() {},
    edit(row) {
      // console.log(row);
      this.currentNums = row.nums;
      for (let i = 0; i < this.personList.length; i++) {
        if (
          row[this.personList[i].prop] != "-" &&
          row[this.personList[i].prop] != ""
        ) {
          this.checkForm[this.personList[i].prop] = [
            row[this.personList[i].prop]
          ];
        }
      }
      for (let i = 0; i < this.dateList.length; i++) {
        if (
          row[this.dateList[i].prop] != "-" &&
          row[this.dateList[i].prop] != ""
        ) {
          this.dateForm[this.dateList[i].prop] = row[this.dateList[i].prop];
        }
      }
      this.$refs.checkFormRefs.clearValidate();
      this.$refs.dateFormRefs.clearValidate();
    },
    async save() {
      if (this.settingFinish) {
        let submitData = [];
        for (let i = 0; i < this.tableData.length; i++) {
          let allTypes = ["CHECK", "LEAD", "REPORT", "APPROVE"];
          for (let j = 0; j < allTypes.length; j++) {
            let obj = {};
            obj.taskNo = this.tableData[i].taskNo;
            if (allTypes[j] == "CHECK") {
              obj.type = "CHECK";
              obj.beginDate = this.tableData[i].groupStart;
              obj.endDate = this.tableData[i].groupEnd;
              obj.groupId = this.tableData[i].groupLeaderId;
              obj.groupName = this.tableData[i].groupLeader;
              obj.personId = this.tableData[i].leaderManId;
              obj.personName = this.tableData[i].leaderMan;
            }
            if (allTypes[j] == "LEAD") {
              obj.type = "LEAD";
              obj.beginDate = this.tableData[i].trackingStart;
              obj.endDate = this.tableData[i].trackingEnd;
              obj.groupId = this.tableData[i].trackingLeaderId;
              obj.groupName = this.tableData[i].trackingLeader;
              obj.personId = this.tableData[i].trackingManId;
              obj.personName = this.tableData[i].trackingMan;
            }
            if (allTypes[j] == "REPORT") {
              obj.type = "REPORT";
              obj.beginDate = this.tableData[i].formulationStart;
              obj.endDate = this.tableData[i].formulationEnd;
              obj.groupId = this.tableData[i].docFormulationId;
              obj.groupName = this.tableData[i].docFormulation;
              obj.personId = this.tableData[i].formulationManId;
              obj.personName = this.tableData[i].formulationMan;
            }
            if (allTypes[j] == "APPROVE") {
              obj.type = "APPROVE";
              obj.beginDate = this.tableData[i].ApprovalStart;
              obj.endDate = this.tableData[i].ApprovalEnd;
              obj.groupId = this.tableData[i].docApprovalId;
              obj.groupName = this.tableData[i].docApproval;
              obj.personId = this.tableData[i].approvalManId;
              obj.personName = this.tableData[i].approvalMan;
            }
            submitData.push(obj);
          }
        }
        let res = await http.post(TASKS_TASKACTION, submitData);
        if (res) {
          if (res.data.code == 0) {
            this.$message.success("保存成功！");
          } else {
            this.$message.error("保存失败！");
          }
        }
      } else {
        this.$message.error("请先设定检查人员或工作时间！");
      }
    },
    submit() {},

    reset() {
      this.$refs.checkFormRefs.resetFields();
      this.$refs.dateFormRefs.resetFields();
      this.tableData = this.originData;
    },

    confirmSelect() {
      let tableData = this.$refs.selectPersonRefs.tableData;
      if (tableData.length > 0) {
        this.dialogVisible = false;
        this.checkForm[this.dialogProp] = [tableData[0].name];
      } else {
        this.$message.error("请选择检查人员！");
      }
    },
    backCheck(arr) {
      if (arr.length == 1) {
        let label = arr[0].label;
        if (label == "已配置") {
          this.tableData = this.totalData.filter(item => {
            return item.groupStart != "" && item.groupLeader != "";
          });
        } else {
          this.tableData = this.totalData.filter(item => {
            return item.groupStart == "" || item.groupLeader == "";
          });
        }
      } else {
        this.tableData = [...this.totalData];
      }
    },
    viewTask() {
      setStorage("taskForm", {
        planForm: this.planForm,
        tableData: this.tableData
      });
      let routeUrl = this.$router.resolve({
        name: "任务预览",
        params: {
          taskType: "view",
          // taskNo: this.taskNo,
          planName: this.planName
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    getStatusCount() {
      this.statusCount = {
        total: 0,
        setting: 0,
        notSetting: 0
      };
      this.statusCount.total = this.totalData.length;
      for (let i = 0; i < this.totalData.length; i++) {
        if (
          this.totalData[i].groupStart != "" &&
          this.totalData[i].groupLeader != ""
        ) {
          this.statusCount.setting++;
        } else {
          this.statusCount.notSetting++;
        }
      }
    },
    changePerson(prop, item) {
      this.checkForm[prop] = item.label;
      this.checkForm[prop + "Id"] = item.value;
    },
    viewPlan() {
      let routeUrl = this.$router.resolve({
        name: "预览计划",
        params: { planNo: this.planForm.planNo, planType: "planListView" }
      });
      window.open(routeUrl.href, "_blank");
    }
  }
};
</script>
<style lang="scss" scoped>
#Allocation {
  .setting-form {
    margin: 2px auto;
    .tag {
      display: inline-block;
      height: 30px;
      padding: 0 5px;
      line-height: 30px;
      background: #d3e8ff;
      border-radius: 4px;
      font-size: 12px;
      color: #3d96f5;
      box-sizing: border-box;
      border: 1px solid #a9d2ff;
      margin: 5px;
      .tag-icon {
        font-size: 10px;
        margin: 0 5px;
        cursor: pointer;
      }
    }
    .setting-btn {
      overflow: hidden;
    }
    .el-form {
      width: 100%;
      margin-top: 20px;
      overflow: hidden;
      .item {
        width: 50%;
      }
    }
    .result-table {
      margin-top: 20px;
    }
  }
  .setting-title {
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }
  .edit {
    cursor: pointer;
  }
  .bot {
    margin-bottom: 40px;
  }
  .normal-table {
    margin: 20px 0;
  }
}
.allocation-dialog {
}
</style>