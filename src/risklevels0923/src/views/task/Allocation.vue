<template>
  <div id="Allocation">
    <div class="commonWidth top" v-show="taskType=='add'">
      <div class="fl top-title">
        <svg-icon iconClass="list"></svg-icon>
        <span>{{taskName}}</span>
      </div>
      <div class="fr">
        <el-button type="primary" @click="viewTask">
          <svg-icon iconClass="eye" class="title-icon"></svg-icon>任务预览
        </el-button>
        <span class="tips">*为必填项</span>
      </div>
    </div>
    <div class="commonWidth top" v-show="taskType=='view'">
      <div class="fl top-title">
        <svg-icon iconClass="view"></svg-icon>
        <span>《{{taskName}}》详情</span>
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
                    <div
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
                    </div>
                  </div>
                  <div
                    class="icons"
                    @click="selectPerson(item.prop,item.title)"
                    style="cursor:pointer;"
                  >
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
      <div class="plan-detail" v-show="taskType=='view'">
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
            <div class="name">xxx</div>
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
          <span v-show="taskType=='view'">
            <svg-icon iconClass="tips"></svg-icon>
            <span>分配详情</span>
          </span> （共计
          <!-- <span class="aColor">100</span> 家，已选中 -->
          <span class="bColor">100</span> 家，已配置
          <span class="bColor">50</span> 家，待配置
          <span class="cColor">50</span> 家）
        </div>
        <div class="fr">
          <MoreCheckbox title="配置" :allData="settingCheckbox" @backCheck="backCheck" />
        </div>
      </div>
      <el-table :data="tableData" border style="margin-top: 20px;">
        <el-table-column label="序号" prop="nums"></el-table-column>
        <el-table-column label="企业名称" prop="enterpriseName" sortable></el-table-column>
        <el-table-column label="营业执照号码" prop="enterpriseNum" sortable></el-table-column>
        <el-table-column label="工作日期" prop="date" width="300" sortable>
          <template slot-scope="scope">
            <div>
              <p>
                <span class="aColor">体系检查：</span>
                {{scope.row['groupStart']}}、{{scope.row['groupEnd']}}
              </p>
              <p>
                <span class="aColor">跟踪指导：</span>
                {{scope.row['trackingStart']}}、{{scope.row['trackingEnd']}}
              </p>
              <p>
                <span class="aColor">报告编制：</span>
                {{scope.row['formulationStart']}}、{{scope.row['formulationEnd']}}
              </p>
              <p>
                <span class="aColor">报告审批：</span>
                {{scope.row['ApprovalStart']}}、{{scope.row['ApprovalEnd']}}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="负责人员" prop="person" width="350" sortable>
          <template slot-scope="scope">
            <div>
              <p>
                <span class="aColor">体系检查：</span>
                负责组长({{scope.row['groupLeader']}})、负责人员({{scope.row['leaderMan']}})
              </p>
              <p>
                <span class="aColor">跟踪指导：</span>
                负责组长({{scope.row['trackingLeader']}})、负责人员({{scope.row['trackingMan']}})
              </p>
              <p>
                <span class="aColor">报告编制：</span>
                负责组长({{scope.row['docFormulation']}})、负责人员({{scope.row['formulationMan']}})
              </p>
              <p>
                <span class="aColor">报告审批：</span>
                负责组长({{scope.row['docApproval']}})、负责人员({{scope.row['approvalMan']}})
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" align="center" v-if="taskType=='add'">
          <template slot-scope="scope">
            <div @click="edit(scope.row)" style="cursor:pointer;">
              <svg-icon iconClass="edit"></svg-icon>
              <span>编辑</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
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
      </div>
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
      <select-person ref="selectPersonRefs"></select-person>
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
import { setStorage, getStorage } from "@/utils/index.js";
export default {
  data() {
    var _this = this;
    var groupEndValidator = (rule, value, callback) => {
      console.log(value);
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
      checkForm: {
        groupLeader: ["标签一"], // 体系检查
        leaderMan: ["标签一"],
        trackingLeader: ["标签一"], // 跟踪指导
        trackingMan: ["标签一"],
        docFormulation: ["标签一"], // 报告编制
        formulationMan: ["标签一"],
        docApproval: ["标签一"], // 报告审批
        approvalMan: ["标签一"]
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
      checkFormRules: {
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ],
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ],
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ],
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ],
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ],
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ],
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ],
        // groupLeader: [
        //   { required: true, message: "请选择体系检查组长", trigger: "change" }
        // ]
      },
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
        planName: "z",
        planNo: "z2",
        remarks: "z"
      }
    };
  },
  components: {
    MoreCheckbox,
    SelectPerson
  },
  created() {
    let taskType = this.$route.params.taskType;
    this.taskNo = this.$route.params.taskNo;
    this.taskType = taskType;
    this.taskName = "aaa";
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
      this.tableData = [
        {
          nums: "1",
          enterpriseName: "name",
          enterpriseNum: "12",
          // date: "2018-02-02",
          person: "aa",
          groupStart: "2018-02",
          groupEnd: "2018-02",
          trackingStart: "2018-02",
          trackingEnd: "2018-02",
          formulationStart: "2018-02",
          formulationEnd: "2018-02",
          ApprovalStart: "2018-02",
          ApprovalEnd: "2018-02",
          groupLeader: "标签一", // 体系检查
          leaderMan: "标签一",
          trackingLeader: "", // 跟踪指导
          trackingMan: "",
          docFormulation: "", // 报告编制
          formulationMan: "",
          docApproval: "", // 报告审批
          approvalMan: ""
        },
        {
          nums: "2",
          enterpriseName: "namea",
          enterpriseNum: "12",
          // date: "2018-02-02",
          person: "aa",
          groupStart: "2018-02",
          groupEnd: "2018-02",
          trackingStart: "2018-02",
          trackingEnd: "2018-02",
          formulationStart: "2018-02",
          formulationEnd: "2018-02",
          ApprovalStart: "2018-02",
          ApprovalEnd: "2018-02",
          groupLeader: "标签一", // 体系检查
          leaderMan: "标签一",
          trackingLeader: "标签2", // 跟踪指导
          trackingMan: "",
          docFormulation: "", // 报告编制
          formulationMan: "",
          docApproval: "", // 报告审批
          approvalMan: ""
        }
      ];
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
    getDatas() {},
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
          console.log("success");
          if (this.currentNums == "") {
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < this.personList.length; j++) {
                this.tableData[i][this.personList[j].prop] = this.checkForm[
                  this.personList[j].prop
                ][0];
              }
            }
          } else {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.currentNums == this.tableData[i].nums) {
                for (let j = 0; j < this.personList.length; j++) {
                  this.tableData[i][this.personList[j].prop] = this.checkForm[
                    this.personList[j].prop
                  ][0];
                }
                break;
              }
            }
          }
        }
      });
    },
    settingDate() {
      this.$refs.dateFormRefs.validate(validate => {
        if (validate) {
          console.log("success");
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
        }
      });
    },
    edit(row) {
      console.log(row);
      this.currentNums = row.nums;
      for (let i = 0; i < this.personList.length; i++) {
        this.checkForm[this.personList[i].prop] = [
          row[this.personList[i].prop]
        ];
      }
    },
    save() {},
    submit() {},

    reset() {},

    confirmSelect() {
      this.dialogVisible = false;
      let tableData = this.$refs.selectPersonRefs.tableData;
      this.checkForm[this.dialogProp] = [tableData[0].name];
    },
    backCheck(arr) {
      console.log(arr);
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
          taskNo: this.taskNo
        }
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