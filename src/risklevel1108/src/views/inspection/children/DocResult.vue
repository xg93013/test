<template>
  <div id="DocResult">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>{{title}}</span>
      </div>
      <span class="ent-name">{{enterpriseName}}</span>
      <div class="btns fr">
        <el-button type="primary" @click="approvalDoc('pass')">通过</el-button>
        <el-button @click="approvalDoc('reject')">不通过</el-button>
      </div>
    </div>
    <div class="commonWidth">
      <DocStepone :data="enterprise" type="view" />
    </div>
    <div class="commonWidth">
      <el-table :data="tableData" style="width: 100%;" border>
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
        ></el-table-column>
      </el-table>
    </div>

    <div class="commonWidth bot">
      <el-table :data="tableData" style="width: 100%;" border>
        <el-table-column label="现场发现问题" align="center">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :sortable="item.sortable"
            v-for="(item, index) in tableHeader"
            :key="index+'cloum'"
          ></el-table-column>
        </el-table-column>
      </el-table>
      <div class="res">
        <div class="item">
          <span>核查：</span>
          <el-input type="text" v-model="groupPerson" disabled></el-input>
        </div>
        <div class="item">
          <span>复查：</span>
          <el-input type="text" disabled></el-input>
        </div>
        <div class="item">
          <span>编制：</span>
          <el-input type="text" disabled></el-input>
        </div>
        <div class="item">
          <span>批准：</span>
          <el-input type="text" disabled></el-input>
        </div>
      </div>
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
        <p class="titles">成都市食品生产企业体系检查报告</p>
        <p class="titles">新都区斑竹园镇鹏程食品厂</p>
        <p class="titles">报告编码：201901-TXJC-001-FXBG</p>
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
import DocStepone from "./DocStepone.vue";
import { getStorage } from "@/utils/index.js";

export default {
  data() {
    return {
      // enterpriseName: "",
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
      enterprise: {}
    };
  },
  components: {
    DocStepone
  },
  props: {},
  created() {
    // this.planNo = this.$route.params.planNo;
    // this.enterpriseId = this.$route.params.enterpriseId;
    this.taskId = Number(this.$route.params.taskId);
    this.type = this.$route.params.type;
    // view 预览  edit 审批
    // this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      this.enterprise.enterpriseName = "aaa";
      this.enterpriseType = getStorage("enterpriseType")[0];
    },
    getDefaultData() {},
    approvalDoc(status) {
      this.approvalDialog.visible = true;
      this.approvalDialog.content = "";
      this.approvalDialog.status = status;
      this.approvalDialog.result = status == "pass";
    },
    approvalConfirm() {
      this.approvalDialog.visible = false;
      this.approvalDialog.content = "";
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
}
</style>