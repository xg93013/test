<template>
  <div id="DocResult">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon :iconClass="type"></svg-icon>
        <span>{{title}}</span>
      </div>
      <span class="ent-name">{{enterpriseName}}</span>
      <div v-if="type==='edit'" class="btns fr">
        <el-button type="primary" @click="approvalDoc('pass')">通过</el-button>
        <el-button @click="approvalDoc('reject')">不通过</el-button>
      </div>
      <div v-else class="btns fr result">
        <p class="titles" :class="approvalDialog.status">
          <svg-icon :iconClass="approvalDialog[approvalDialog.status].icon" class="aicon"></svg-icon>
          <span>{{approvalDialog[approvalDialog.status].top}}</span>
        </p>
      </div>
    </div>
    <div v-if="type==='view'" class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="tips"></svg-icon>
        <span>审批结果</span>
      </div>
      <div class="res-detail">
        <div class="item">
          <span>* 审批结果：</span>
          <el-input type="text" v-model="form.result" disabled></el-input>
        </div>
        <div class="item">
          <span>* 审批人员：</span>
          <el-input type="text" v-model="form.person" disabled></el-input>
        </div>
        <div class="item">
          <span>* 审批日期：</span>
          <el-input type="text" v-model="form.date" disabled></el-input>
        </div>
        <div class="item" style="display: flex">
          <span>审批意见：</span>
          <el-input type="textarea" v-model="form.content" :rows="4" disabled></el-input>
        </div>
      </div>
    </div>
    <div class="commonWidth bot">
      <div class="ins-nav">
        <div
          class="ins-item"
          v-for="(item, index) in insNav"
          :key="index+'insnav'"
          :class="{'active':index==currentNav}"
          @click="changeNav(index)"
        >{{item.label}}</div>
      </div>
      <DocStepone
        v-show="currentNav==0"
        :taskId="taskId"
        :enterpriseType="enterpriseType"
        :type="'view'"
      />
      <DocSteptwo
        v-show="currentNav==1"
        :taskId="taskId"
        :enterpriseType="enterpriseType"
        :type="'view'"
      />
      <DocStepthree v-show="currentNav==2" :enterpriseType="enterpriseType" :taskId="taskId" />
    </div>

    <el-dialog
      :title="approvalDialog[approvalDialog.status].title"
      :visible.sync="approvalDialog.visible"
      width="550px"
      top="240px"
      custom-class="approvalDialog"
    >
      <div>
        <p class="titles" :class="approvalDialog.status">
          <svg-icon :iconClass="approvalDialog[approvalDialog.status].icon" class="aicon"></svg-icon>
          <span>{{approvalDialog[approvalDialog.status].top}}</span>
        </p>
        <p class="titles">{{planName}}</p>
        <p class="titles">{{enterpriseName}}</p>
        <div class="textarea">
          <div class="txt">
            <span class="cColor" v-show="approvalDialog.status!='pass'">*</span>
            {{approvalDialog[approvalDialog.status].placeholder}}：
          </div>
          <div class="content">
            <el-input
              type="textarea"
              v-model="approvalDialog.content"
              :autosize="{ minRows: 4, maxRows: 5}"
              maxlength="300"
              show-word-limit
              :placeholder="approvalDialog[approvalDialog.status].textarea"
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
import DocStepone from "./DocStepone.vue";
import { getStorage } from "@/utils/index.js";
import DocSteptwo from "./DocSteptwo";
import DocStepthree from "./DocStepthree";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { TASKS_APPROVE_UPDATE, TASKS_APPROVE_DETAIL, TASKS_TASK } = apis;
export default {
  data() {
    return {
      type: "",
      planName: "",
      docName: "",
      enterpriseName: "",
      enterpriseType: "",
      title: "审批报告",
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
      form: {
        content: "",
        person: "",
        date: "",
        result: ""
      },
      approvalDialog: {
        visible: false,
        status: "pass",
        pass: {
          title: "审批通过",
          top: "通过审批",
          textarea: "请输入审批意见",
          placeholder: "审批意见",
          icon: "pass"
        },
        reject: {
          title: "审批否决",
          top: "未通过审批",
          textarea: "请输入否决原因",
          placeholder: "否决原因",
          icon: "reject"
        },
        result: true,
        content: ""
      },
      enterprise: {},
      currentNav: 0,
      insNav: [
        {
          id: 1,
          label: "第1页"
        },
        {
          id: 2,
          label: "第2页"
        },
        {
          id: 3,
          label: "第3页"
        }
      ]
    };
  },
  components: {
    DocStepone,
    DocSteptwo,
    DocStepthree
  },
  props: {},
  created() {
    this.taskId = Number(this.$route.params.taskId);
    this.type = this.$route.params.type;
    if (this.type === "view") {
      this.getApproveDetail();
      this.title = "预览审批详情";
    }

    // view 预览  edit 审批
    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let res = await http.get(TASKS_TASK + "/" + this.taskId);
      if (res && res.data && res.data.code === 0) {
        let data = res.data.data;
        this.enterpriseName = data.enterpriseName;
        this.enterpriseType = data.enterpriseType;
        this.planName = data.planName;
        if (this.type === "view" && this.taskStatus === "APPROVEFAILED") {
          this.approvalDialog.status = "reject";
        }
      }
    },
    async getApproveDetail() {
      let res = await http.get(TASKS_APPROVE_DETAIL + "/" + this.taskId);
      if (res && res.data && res.data.code === 0) {
        let data = res.data.data;
        this.form.date = data.approveDate;
        this.form.person = data.approvePerson;
        this.form.content = data.approveRemark;
        this.form.result = data.result;
      }
    },
    approvalDoc(status) {
      this.approvalDialog.visible = true;
      this.approvalDialog.content = "";
      this.approvalDialog.status = status;
      this.approvalDialog.result = status == "pass";
    },

    async approvalConfirm() {
      // this.approvalDialog.visible = false
      // this.approvalDialog.content = ''
      if (
        this.approvalDialog.content == "" &&
        this.approvalDialog.status != "pass"
      ) {
        this.$msgbox({
          title: "提示",
          message: "请先填写内容！",
          type: "error"
        });
      } else {
        let res = await http.post(TASKS_APPROVE_UPDATE, {
          approveRemark: this.approvalDialog.content, //备注
          status: this.approvalDialog.result ? "APPROVED" : "APPROVEFAILED", //APPROVED通过，APPROVEFAILED未通过
          taskId: this.taskId
        });
        if (res && res.data && res.data.code === 0) {
          this.$msgbox({
            title: "提示",
            message: "审核成功",
            type: "success"
          });

          this.approvalDialog.visible = false;
          this.approvalDialog.content = "";
        } else {
          this.$msgbox({
            title: "提示",
            message: "审核失败",
            type: "error"
          });
        }
      }
    },
    changeNav(index) {
      this.currentNav = index;
    }
  }
};
</script>
<style lang="scss" scoped>
#DocResult {
  .res {
    width: 100%;
    overflow: hidden;
    margin-top: 30px;

    .item {
      width: 25%;
      height: 40px;
      line-height: 40px;
      float: left;

      span {
        margin-left: 20px;
      }

      .el-input {
        width: 200px;
      }
    }
  }

  .res-detail {
    width: 100%;
    overflow: hidden;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 190px;
    padding-top: 10px;

    .item {
      width: 40%;
      height: 40px;
      line-height: 40px;
      margin-bottom: 20px;

      span {
        margin-left: 40px;
      }

      .el-input,
      .el-textarea {
        width: 300px;
        /deep/ .el-input__inner,
        /deep/ .el-textarea__inner {
          color: #000000 !important;
        }
      }
    }
  }

  .approvalDialog {
    .titles {
      text-align: center;
      line-height: 24px;

      .aicon,
      span {
        font-size: 20px;
      }

      &.pass {
        color: #4bd863;
      }

      &.reject {
        color: #ff3300;
      }
    }

    .textarea {
      display: flex;
      margin-top: 20px;

      .txt {
        flex: 0 0 90px;
      }

      .content {
        flex: 1;
      }
    }
  }

  .ins-result {
    padding: 0;
    margin: 2px auto;
  }

  .ins-nav {
    width: 100%;
    overflow: hidden;
    background: #eee;

    .ins-item {
      float: left;
      width: 200px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;

      &.active {
        color: #0079fe;
      }
    }
  }

  .result {
    margin-top: 5px;
    .aicon,
    span {
      font-size: 20px;
    }

    .pass {
      color: #4bd863;
    }

    .reject {
      color: #ff3300;
    }
  }
}
</style>
