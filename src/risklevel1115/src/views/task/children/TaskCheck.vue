<template>
  <div id="TaskCheck">
    <div class="common-title">检查工作人员</div>
    <el-form ref="checkFormRefs" :model="checkForm" label-width="140px" class="check-form">
      <div class="fl item" v-for="(item, index) in personList" :key="item.prop+index">
        <div class="form">
          <el-form-item :label="item.label" :prop="item.prop">
            <template>
              <div class="form-item">
                <div class="left-item">
                  <el-input v-model="checkForm[item.prop]" disabled></el-input>
                </div>
              </div>
            </template>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { deepClone, getStorage } from "@/utils/index.js";

const { TASKS_TASKACTION } = apis;

export default {
  data() {
    return {
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
      ]
    };
  },
  props: {
    taskId: {
      type: Number,
      default: 0
    },
    enterpriseType: {
      type: String,
      default: ""
    }
  },
  created() {
    this.getDatas();
  },
  methods: {
    async getDatas() {
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
      let res = await http.get(TASKS_TASKACTION + "/" + this.taskId);

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
            for (let key in this.checkForm) {
              obj[key] = "";
            }
          }
          this.tableData.push(obj);
        }
        this.originData = deepClone(this.tableData);
        this.checkForm = { ...this.tableData[0] };
        console.log(this.checkForm);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#TaskCheck {
  .check-form {
    width: 100%;
    overflow: hidden;
    margin-top: 30px;
    .item {
      width: 50%;
    }
  }
}
</style>