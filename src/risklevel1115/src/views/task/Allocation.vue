<template>
  <div id="Allocation">
    <div class="commonWidth top" v-show="taskType=='add'">
      <div class="fl top-title">
        <svg-icon iconClass="detail"></svg-icon>
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
        <el-button type="primary" class="fr" @click="settingPeople">
          <svg-icon iconClass="addTask"></svg-icon>
          <span>设定</span>
        </el-button>
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
                      filterable
                    >
                      <el-option
                        v-for="(itema ,indexa) in item.personList"
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
        <el-button type="primary" class="fr" @click="settingDate">
          <svg-icon iconClass="addTask"></svg-icon>
          <span>设定</span>
        </el-button>
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
            <div class="name" @click="viewPlan" style="cursor:pointer;">计划详情</div>
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
                <span class="aColor">静态因素：</span>
                {{scope.row['staticStart'] }}&nbsp;、{{scope.row['staticEnd']}}
              </p>
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
                <span class="aColor">静态因素：</span>
                负责组长({{scope.row['staticLeader']}})&nbsp;、负责人员({{scope.row['staticMan']}})
              </p>
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
    </div>
    <div class="commonWidth bot" v-show="taskType=='add'">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button @click="submit">
            <svg-icon iconClass="submit"></svg-icon>
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
    <el-dialog
      title="确认提示"
      :visible.sync="confirmVisible"
      width="470px"
      custom-class="dialogVisible"
    >
      <div class="contents">
        <div class="icons">
          <svg-icon iconClass="question" class="question"></svg-icon>
        </div>
        <div class="texts">
          <p class="big">是否确认下发！</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSubmit">确 定</el-button>
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

const { TASKS_TASKACTION, ACCOUNTS, PLAN } = apis;

export default {
  data() {
    let _this = this;
    // let staticStartValidator =()

    let groupStartValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value < _this.dateForm.staticEnd) {
          callback(new Error("日期不能小于静态因素结束日期！"));
        } else {
          callback();
        }
      }
    };
    let trackingStartValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value < _this.dateForm.groupEnd) {
          callback(new Error("日期不能小于体系检查结束日期！"));
        } else {
          callback();
        }
      }
    };
    let formulationStartValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value < _this.dateForm.trackingEnd) {
          callback(new Error("日期不能小于跟踪指导结束日期！"));
        } else {
          callback();
        }
      }
    };
    let ApprovalStartValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value < _this.dateForm.formulationEnd) {
          callback(new Error("日期不能小于编制报告结束日期！"));
        } else {
          callback();
        }
      }
    };
    let staticEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value <= _this.dateForm.staticStart) {
          callback(new Error("结束日期必须大于开始日期！"));
        } else {
          callback();
        }
        if (_this.dateForm.groupStart != "") {
          if (value > _this.dateForm.groupStart) {
            callback(new Error("日期不能大于体系检查开始日期！"));
          } else {
            callback();
          }
        }
      }
    };
    let groupEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value <= _this.dateForm.groupStart) {
          callback(new Error("结束日期必须大于开始日期！"));
        } else {
          callback();
        }
        if (_this.dateForm.trackingStart != "") {
          if (value > _this.dateForm.trackingStart) {
            callback(new Error("日期不能大于跟踪指导开始日期！"));
          } else {
            callback();
          }
        }
      }
    };
    let trackingEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value <= _this.dateForm.trackingStart) {
          callback(new Error("结束日期必须大于开始日期！"));
        } else {
          callback();
        }
        if (_this.dateForm.formulationStart != "") {
          if (value > _this.dateForm.formulationStart) {
            callback(new Error("日期不能大于编制报告开始日期！"));
          } else {
            callback();
          }
        }
      }
    };
    let formulationEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      } else {
        if (value <= _this.dateForm.formulationStart) {
          callback(new Error("结束日期必须大于开始日期！"));
        } else {
          callback();
        }
        if (_this.dateForm.ApprovalStart != "") {
          if (value > _this.dateForm.ApprovalStart) {
            callback(new Error("日期不能大于审批报告开始日期!"));
          } else {
            callback();
          }
        }
      }
    };
    let ApprovalEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择日期！"));
      }
      if (value <= _this.dateForm.ApprovalStart) {
        callback(new Error("结束日期必须大于开始日期！"));
      } else {
        callback();
      }
    };
    return {
      allPersonList: [],
      checkForm: {
        staticLeader: "", // 静态因素
        staticLeaderId: "",
        staticMan: "",
        staticManId: "",
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
        staticStart: "",
        staticEnd: "",
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
          label: "静态因素组长",
          title: "静态因素",
          prop: "staticLeader",
          params: "SPOT_RECORD_GFP",
          personList: []
        },
        {
          label: "负责人员",
          title: "静态因素",
          prop: "staticMan",
          params: "SPOT_RECORD_GFP",
          personList: []
        },
        {
          label: "体系检查组长",
          title: "体系检查",
          prop: "groupLeader",
          params: "SPOT_RECORD_GFP",
          personList: []
        },
        {
          label: "负责人员",
          title: "体系检查",
          prop: "leaderMan",
          params: "SPOT_RECORD_GFP",
          personList: []
        },
        {
          label: "跟踪指导组长",
          title: "跟踪指导",
          prop: "trackingLeader",
          params: "TRACK_GUIDE_GFP",
          personList: []
        },
        {
          label: "负责人员",
          title: "跟踪指导",
          prop: "trackingMan",
          params: "TRACK_GUIDE_GFP",
          personList: []
        },
        {
          label: "报告编制组长",
          title: "报告编制",
          prop: "docFormulation",
          params: "REPORT_EDIT_GPF",
          personList: []
        },
        {
          label: "负责人员",
          title: "报告编制",
          prop: "formulationMan",
          params: "REPORT_EDIT_GPF",
          personList: []
        },
        {
          label: "报告审批组长",
          title: "报告审批",
          prop: "docApproval",
          params: "REPORT_APPROVAL_GPF",
          personList: []
        },
        {
          label: "负责人员",
          title: "报告审批",
          prop: "approvalMan",
          params: "REPORT_APPROVAL_GPF",
          personList: []
        }
      ],
      dateList: [
        {
          label: "静态因素开始日期",
          prop: "staticStart"
        },
        {
          label: "结束日期",
          prop: "staticEnd"
        },
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
        staticStart: [
          {
            required: true,
            // validator: groupStartValidator,
            message: "请选择日期！",
            trigger: "change"
          }
        ],
        staticEnd: [
          {
            required: true,
            validator: staticEndValidator,
            // message: "请选择日期！",
            trigger: "change"
          }
        ],
        groupStart: [
          {
            required: true,
            validator: groupStartValidator,
            // message: "请选择日期！",
            trigger: "change"
          }
        ],
        trackingStart: [
          {
            required: true,
            validator: trackingStartValidator,
            // message: "请选择日期！",
            trigger: "change"
          }
        ],
        formulationStart: [
          {
            required: true,
            validator: formulationStartValidator,
            // message: "请选择日期！",
            trigger: "change"
          }
        ],
        ApprovalStart: [
          {
            required: true,
            validator: ApprovalStartValidator,
            // message: "请选择日期！",
            trigger: "change"
          }
        ],
        groupEnd: [
          {
            required: true,
            validator: groupEndValidator,
            trigger: "change"
          }
        ],
        trackingEnd: [
          {
            required: true,
            validator: trackingEndValidator,
            trigger: "change"
          }
        ],
        formulationEnd: [
          {
            required: true,
            validator: formulationEndValidator,
            trigger: "change"
          }
        ],
        ApprovalEnd: [
          {
            required: true,
            validator: ApprovalEndValidator,
            trigger: "change"
          }
        ]
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
      settingPerson: false,
      statusCount: {
        total: 0,
        setting: 0,
        notSetting: 0
      },
      settingTitle: "选择配置状态",
      confirmVisible: false
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
      let dateKeyArr = {
        STATIC: ["staticStart", "staticEnd"],
        CHECK: ["groupStart", "groupEnd"],
        LEAD: ["trackingStart", "trackingEnd"],
        REPORT: ["formulationStart", "formulationEnd"],
        APPROVE: ["ApprovalStart", "ApprovalEnd"]
      };

      let personKeyArr = {
        STATIC: ["staticLeader", "staticMan", "staticLeaderId", "staticManId"],
        CHECK: ["groupLeader", "leaderMan", "groupLeaderId", "leaderManId"],
        LEAD: [
          "trackingLeader",
          "trackingMan",
          "trackingLeaderId",
          "trackingManId"
        ],
        REPORT: [
          "docFormulation",
          "formulationMan",
          "docFormulationId",
          "formulationManId"
        ],
        APPROVE: [
          "docApproval",
          "approvalMan",
          "docApprovalId",
          "approvalManId"
        ]
      };
      let lists = getStorage("taskIdList");
      let taskIds = lists.join(",");
      let res = await http.get(TASKS_TASKACTION + "/" + taskIds);
      if (res) {
        this.tableData = [];
        let datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          let obj = {
            nums: i + 1,
            enterpriseName: datas[i].enterpriseName,
            enterpriseNum: datas[i].businessLicense,
            taskId: datas[i].taskId
          };
          if (datas[i].dateDTOList && datas[i].dateDTOList.length > 0) {
            let dateList = datas[i].dateDTOList;
            for (let j = 0; j < dateList.length; j++) {
              let objKeyArr = dateKeyArr[dateList[j].taskActionTypeEnum];
              obj[objKeyArr[0]] = dateList[j].beginDate
                ? dateList[j].beginDate
                : "";
              obj[objKeyArr[1]] = dateList[j].endDate
                ? dateList[j].endDate
                : "";
            }
          } else {
            for (let key in this.checkForm) {
              obj[key] = "";
            }
          }
          if (datas[i].personDTOList && datas[i].personDTOList.length > 0) {
            let personList = datas[i].personDTOList;
            for (let j = 0; j < personList.length; j++) {
              let personObjKeyArr =
                personKeyArr[personList[j].taskActionTypeEnum];
              obj[personObjKeyArr[0]] = personList[j].groupName;
              obj[personObjKeyArr[1]] = personList[j].personName;
              obj[personObjKeyArr[2]] = personList[j].groupId;
              obj[personObjKeyArr[3]] = personList[j].personId;
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
        this.validateSetting();
      }
      let [
        staticrisk,
        group,
        track,
        report,
        reportApproval
      ] = await Promise.all([
        // 静态风险 STATIC_RISK_GFP
        // 现场检查 SPOT_RECORD_GFP
        // 跟踪指导 TRACK_GUIDE_GFP
        // 报告编制 REPORT_EDIT_GPF
        // 报告审批 REPORT_APPROVAL_GPF
        http.get(ACCOUNTS + "/STATIC_RISK_GFP/accounts"),
        http.get(ACCOUNTS + "/SPOT_RECORD_GFP/accounts"),
        http.get(ACCOUNTS + "/TRACK_GUIDE_GFP/accounts"),
        http.get(ACCOUNTS + "/REPORT_EDIT_GPF/accounts"),
        http.get(ACCOUNTS + "/REPORT_APPROVAL_GPF/accounts")
      ]);
      if (staticrisk) {
        let list = [];
        for (let i = 0; i < staticrisk.data.data.length; i++) {
          list.push({
            label: staticrisk.data.data[i].name,
            value: staticrisk.data.data[i].account
          });
        }
        this.personList[0].personList = list;
        this.personList[1].personList = list;
      }
      if (group) {
        let list = [];
        for (let i = 0; i < group.data.data.length; i++) {
          list.push({
            label: group.data.data[i].name,
            value: group.data.data[i].account
          });
        }
        this.personList[2].personList = list;
        this.personList[3].personList = list;
      }
      if (track) {
        let list = [];
        for (let i = 0; i < track.data.data.length; i++) {
          list.push({
            label: track.data.data[i].name,
            value: track.data.data[i].account
          });
        }
        this.personList[4].personList = list;
        this.personList[5].personList = list;
      }
      if (report) {
        let list = [];
        for (let i = 0; i < report.data.data.length; i++) {
          list.push({
            label: report.data.data[i].name,
            value: report.data.data[i].account
          });
        }
        this.personList[6].personList = list;
        this.personList[7].personList = list;
      }
      if (reportApproval) {
        let list = [];
        for (let i = 0; i < reportApproval.data.data.length; i++) {
          list.push({
            label: reportApproval.data.data[i].name,
            value: reportApproval.data.data[i].account
          });
        }
        this.personList[8].personList = list;
        this.personList[9].personList = list;
      }
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
          this.totalData = [...this.tableData];
        } else {
          this.$message.error("请选择工作时间！");
        }
      });
    },
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
    save() {
      this.validateSetting();
      if (this.settingPerson) {
        this.submitData(false);
      } else {
        this.$message.error("请先设定检查人员！");
      }
    },
    submit() {
      this.validateSetting();
      if (this.settingFinish) {
        this.confirmVisible = true;
      } else {
        this.$message.error("请先设定检查人员或工作时间！");
      }
    },
    async submitData(type) {
      let submitData = this.getResult();
      let res = await http.post(
        TASKS_TASKACTION + "?issued=" + type,
        submitData
      );
      if (res) {
        if (res.data.code == 0) {
          let msg = type ? "下发成功！" : "保存成功！";
          this.$message.success(msg);
          if (type) {
            let code = "";
            if (getStorage("currentCode")) {
              code = getStorage("currentCode")[0];
            }
            setTimeout(() => {
              this.$router.push({
                path: "/TaskAllocation",
                query: {
                  code: code
                }
              });
            }, 1000);
          }
        } else {
          let msg = type ? "下发失败！" : "保存失败！";
          this.$message.error(msg);
        }
      }
    },
    getResult() {
      let submitData = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let allTypes = ["STATIC", "CHECK", "LEAD", "REPORT", "APPROVE"];
        for (let j = 0; j < allTypes.length; j++) {
          let obj = {};
          obj.taskId = this.tableData[i].taskId;
          //静态因素
          if (allTypes[j] == "STATIC") {
            obj.type = "STATIC";
            obj.beginDate = this.tableData[i].staticStart
              ? this.tableData[i].staticStart
              : "";
            obj.endDate = this.tableData[i].staticEnd
              ? this.tableData[i].staticEnd
              : "";
            obj.groupId = this.tableData[i].staticLeaderId
              ? this.tableData[i].staticLeaderId
              : "";
            obj.groupName = this.tableData[i].staticLeader
              ? this.tableData[i].staticLeader
              : "";
            obj.personId = this.tableData[i].staticManId
              ? this.tableData[i].staticManId
              : "";
            obj.personName = this.tableData[i].staticMan
              ? this.tableData[i].staticMan
              : "";
          }
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
      return submitData;
    },
    reset() {
      this.$refs.checkFormRefs.resetFields();
      this.$refs.dateFormRefs.resetFields();
      // this.tableData = deepClone(this.originData);
      this.getDatas();
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
        let personFlag = false;
        let dateFlag = false;
        for (let j = 0; j < this.personList.length; j++) {
          if (!this.tableData[i][this.personList[j].prop]) {
            personFlag = false;
            break;
          } else {
            personFlag = true;
            continue;
          }
        }
        for (let k = 0; k < this.dateList.length; k++) {
          if (!this.tableData[i][this.dateList[k].prop]) {
            dateFlag = false;
            break;
          } else {
            dateFlag = true;
            continue;
          }
        }
        if (personFlag && dateFlag) {
          this.statusCount.setting++;
        } else {
          this.statusCount.notSetting++;
        }
      }
    },
    validateSetting() {
      let personFlag = false;
      let dateFlag = false;
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.personList.length; j++) {
          if (!this.tableData[i][this.personList[j].prop]) {
            personFlag = false;
            break;
          } else {
            personFlag = true;
            continue;
          }
        }
        for (let k = 0; k < this.dateList.length; k++) {
          if (!this.tableData[i][this.dateList[k].prop]) {
            dateFlag = false;
            break;
          } else {
            dateFlag = true;
            continue;
          }
        }
        if (!personFlag) {
          this.settingPerson = false;
        } else {
          this.settingPerson = true;
        }
        if (!personFlag || !dateFlag) {
          this.settingFinish = false;
          break;
        } else {
          this.settingFinish = true;
          continue;
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
    },
    confirmSubmit() {
      this.confirmVisible = false;
      this.submitData(true);
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
  .tips {
    height: 40px;
    line-height: 40px;
  }
}
</style>