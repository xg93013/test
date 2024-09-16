<template>
  <div id="InspectionResult">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>{{inspectionType == 'view' ? '预览':'填写'}}现场检查记录</span>
      </div>
      <span class="ent-name">{{enterpriseName}}</span>
    </div>
    <div class="commonWidth ins-result">
      <div class="ins-nav">
        <div
          class="ins-item"
          v-for="(item, index) in insNav"
          :key="index+'insnav'"
          :class="{'active':index==currentNav}"
          @click="changeNav(index)"
        >{{item.label}}</div>
      </div>
    </div>
    <EnterpriseStatus
      v-show="currentNav==0"
      :taskId="taskId"
      :inspectionType="inspectionType"
      :enterpriseType="enterpriseType"
      ref="enterpriseStatusRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <SignTable
      v-show="currentNav==1"
      :taskId="taskId"
      :inspectionType="inspectionType"
      ref="signTableRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <DynamicRisk
      v-show="currentNav==2"
      :enterpriseName="enterpriseName"
      :taskId="taskId"
      :inspectionType="inspectionType"
      :enterpriseType="enterpriseType"
      ref="dynamicRiskRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <AdvanceInspection
      v-show="currentNav==3&&enterpriseType == 'FOOD_PRODUCTION'"
      :enterpriseName="enterpriseName"
      :enterpriseType="enterpriseType"
      :taskId="taskId"
      :inspectionType="inspectionType"
      ref="advanceInspectionRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <InspectionHistory
      v-show="currentNav==(enterpriseType == 'FOOD_PRODUCTION' ? 4: 3)"
      ref="inspectionHistoryRefs"
      :taskId="taskId"
      :inspectionType="inspectionType"
      :enterpriseType="enterpriseType"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <ImportantEvent
      v-show="currentNav==(enterpriseType == 'FOOD_PRODUCTION' ? 5: 4)"
      ref="importantEventRefs"
      :taskId="taskId"
      :inspectionType="inspectionType"
      :enterpriseType="enterpriseType"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <div class="commonWidth step-box" :class="{'last':inspectionType=='view'}">
      <div class="center-page">
        <span @click="prevPage" v-show="currentNav!=0">
          <svg-icon iconClass="left"></svg-icon>上一步
        </span>
        <span @click="nextPage" v-show="currentNav!=5">
          下一步
          <svg-icon iconClass="right"></svg-icon>
        </span>
      </div>
    </div>
    <div class="commonWidth bot" v-show="inspectionType!='view'">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button type="primary" @click="submit">
            <svg-icon iconClass="submit"></svg-icon>
            <span>提交</span>
          </el-button>
          <el-button @click="reset">
            <svg-icon iconClass="reset"></svg-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
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
          <p class="big">是否确认提交</p>
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
import { setStorage, getStorage } from "@/utils/index.js";
import EnterpriseStatus from "./children/EnterpriseStatus.vue";
import SignTable from "./children/SignTable.vue";
import DynamicRisk from "./children/DynamicRisk.vue";
import AdvanceInspection from "./children/AdvanceInspection.vue";
import InspectionHistory from "./children/InspectionHistory.vue";
import ImportantEvent from "./children/ImportantEvent.vue";
import PageBox from "@/components/PageBox/index.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { PLAN, TASKS_TASK } = apis;

export default {
  data() {
    return {
      insNav: [
        {
          id: 1,
          label: "企业状态"
        },
        {
          id: 2,
          label: "首末次签到表"
        },
        {
          id: 3,
          label: "动态风险因素检查记录"
        },
        {
          id: 4,
          label: "企业体系先进性检查记录"
        },
        {
          id: 5,
          label: "检查记录表"
        },
        {
          id: 6,
          label: "重要事项记录表"
        }
      ],
      currentNav: 0,
      planNo: "",
      enterpriseName: "",
      taskId: "",
      allStatus: {
        advancementStatus: "",
        checkStatus: "",
        enterpriseInfoStatus: "",
        importantItemStatus: "",
        staticRiskStatus: ""
      },
      enterpriseType: "",
      refArr: [
        "enterpriseStatusRefs",
        "signTableRefs",
        "dynamicRiskRefs",
        "advanceInspectionRefs",
        "inspectionHistoryRefs",
        "importantEventRefs"
      ],
      inspectionType: "",
      dialogVisible: false
    };
  },
  components: {
    EnterpriseStatus,
    SignTable,
    DynamicRisk,
    AdvanceInspection,
    InspectionHistory,
    ImportantEvent,
    PageBox
  },
  watch: {
    currentNav(a) {
      this.$refs[this.refArr[this.currentNav]].getDefaultData();
    }
  },
  created() {
    let index = 0;
    let viewIndex = 0;
    if (getStorage("riskNavIndex")) {
      index = getStorage("riskNavIndex")[0];
    }
    if (getStorage("viewIndex")) {
      viewIndex = getStorage("viewIndex")[0];
    }
    if (getStorage("enterpriseType")) {
      this.enterpriseType = getStorage("enterpriseType")[0];
    }

    this.taskId = Number(this.$route.params.taskId);
    this.inspectionType = this.$route.params.inspectionType;

    // this.inspectionType = "view";
    if (this.enterpriseType != "FOOD_PRODUCTION") {
      this.insNav.splice(3, 1);
      this.refArr.splice(3, 1);
    }
    // this.taskId = 992;
    // 0 == false
    if (this.inspectionType != "view") {
      if (index == 0 || index) {
        this.currentNav = index;
      }
    }

    if (this.inspectionType == "view") {
      if (viewIndex == 0 || viewIndex) {
        this.currentNav = viewIndex;
      }
    }

    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let res = await http.get(TASKS_TASK + "/" + this.taskId);
      if (res) {
        this.allStatus.advancementStatus = res.data.data.advancementStatus;
        this.enterpriseName = res.data.data.enterpriseName;
      }
    },
    changeNav(index) {
      this.saveAll("changePage", index);
    },
    save() {
      // 参数2  current save按钮  nextPage 下一步操作  changePage  tab切换
      this.saveAll("current", this.currentNav);
    },
    handleResult(flag, changeType, page) {
      if (flag) {
        if (changeType == "changePage") {
          this.currentNav = page;
          if (this.inspectionType != "view") {
            setStorage("riskNavIndex", page);
          } else {
            setStorage("viewIndex", page);
          }
        }
        if (changeType == "nextPage") {
          let index = this.enterpriseType == "FOOD_PRODUCTION" ? 5 : 4;
          if (this.currentNav != index) {
            this.currentNav++;
          }
        }
      }
    },
    submit() {
      // 参数2  current save按钮  nextPage 下一步操作  changePage  tab切换
      // this.saveAll("COMMIT", "current", this.currentNav);
      this.$refs[this.refArr[this.currentNav]].validateData();
      if (this.$refs.enterpriseStatusRefs.validateFlag != 1) {
        this.$message.error("请先填写完整企业信息！");
        return false;
      }
      if (this.$refs.signTableRefs.validateFlag != 1) {
        this.$message.error("请先选择文件！");
        return false;
      }
      if (this.$refs.dynamicRiskRefs.validateFlag != 1) {
        let flag = this.$refs.dynamicRiskRefs.validateFlag;
        if (flag == 2) {
          this.$message.error("请先选择动态风险因素检查项目！");
        }
        if (flag == 3) {
          this.$message.error("请填写动态风险因素检查项目不符合项备注！");
        }

        return false;
      }
      if (this.enterpriseType == "FOOD_PRODUCTION") {
        if (this.$refs.advanceInspectionRefs.validateFlag != 1) {
          let flag = this.$refs.advanceInspectionRefs.validateFlag;
          if (flag == 2) {
            this.$message.error("请先选择企业体系先进性检查项目！");
          }
          if (flag == 3) {
            this.$message.error("请填写企业体系先进性检查项目不符合项备注！");
          }
          return false;
        }
      }

      if (!this.$refs.inspectionHistoryRefs.validateFlag) {
        this.$message.error("请先填写检查记录表完整信息！");
        return false;
      }
      if (!this.$refs.importantEventRefs.validateFlag) {
        this.$message.error("请先填写重要事项记录表完整信息！");
        return false;
      }
      // this.$refs[this.refArr[this.currentNav]].submit();
      this.dialogVisible = true;
    },
    handleSubmitResult(flag) {
      // flag true提交成功
      if (flag) {
        this.$message.success("提交成功！");
        let code = "";
        if (getStorage("currentCode")) {
          code = getStorage("currentCode")[0];
        }
        setTimeout(() => {
          this.$router.push({
            path: "/Inspection",
            query: {
              code: code
            }
          });
        }, 1000);
      }
    },
    reset() {
      this.$refs[this.refArr[this.currentNav]].reset();
    },
    prevPage() {
      if (this.currentNav != 0) {
        this.currentNav--;
      }
    },
    nextPage() {
      this.saveAll("nextPage", this.currentNav);
    },
    saveAll(changeType, page) {
      if (changeType == "changePage") {
        if (this.currentNav != page) {
          this.$refs[this.refArr[this.currentNav]].save(changeType, page);
        }
      } else {
        this.$refs[this.refArr[this.currentNav]].save(changeType, page);
      }
    },
    confirmSubmit() {
      this.$refs[this.refArr[this.currentNav]].submit();
      this.dialogVisible = false;
    }
  },
  mounted() {
    for (let i = 0; i < this.refArr.length; i++) {
      this.$refs[this.refArr[i]].validateFlag = 1;
    }
  }
};
</script>
<style lang="scss" scoped>
#InspectionResult {
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
        // background:
        color: #0079fe;
      }
    }
  }
  .step-box {
    text-align: center;
    margin: 0 auto;
    .center-page {
      display: inline;
      span {
        display: inline-block;
        padding: 10px 40px;
        border: 1px solid #0079fe;
        border-radius: 4px;
        color: #0079fe;
        cursor: pointer;
      }
    }
  }
  .last {
    margin: 0 auto 20px;
  }
}
</style>