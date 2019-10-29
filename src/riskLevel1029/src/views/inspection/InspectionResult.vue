<template>
  <div id="InspectionResult">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>填写现场检查记录</span>
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
      ref="enterpriseStatusRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <SignTable
      v-show="currentNav==1"
      :taskId="taskId"
      ref="signTableRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <DynamicRisk
      v-show="currentNav==2"
      :enterpriseName="enterpriseName"
      :taskId="taskId"
      :enterpriseType="enterpriseType"
      ref="dynamicRiskRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <AdvanceInspection
      v-show="currentNav==3"
      :enterpriseName="enterpriseName"
      :enterpriseType="enterpriseType"
      :taskId="taskId"
      ref="advanceInspectionRefs"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <InspectionHistory
      v-show="currentNav==4"
      ref="inspectionHistoryRefs"
      :taskId="taskId"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <ImportantEvent
      v-show="currentNav==5"
      ref="importantEventRefs"
      :taskId="taskId"
      @handleResult="handleResult"
      @handleSubmitResult="handleSubmitResult"
    />
    <div class="commonWidth step-box">
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
    <div class="commonWidth bot">
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
      planName: "",
      enterpriseName: "",
      enterpriseId: "",
      taskId: "",
      allStatus: {
        advancementStatus: "",
        checkStatus: "",
        enterpriseInfoStatus: "",
        importantItemStatus: "",
        staticRiskStatus: ""
      },
      enterpriseType: "FOOD_PRODUCTION",
      refArr: [
        "enterpriseStatusRefs",
        "signTableRefs",
        "dynamicRiskRefs",
        "advanceInspectionRefs",
        "inspectionHistoryRefs",
        "importantEventRefs"
      ]
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
    let index = getStorage("riskNavIndex")[0];
    this.planNo = this.$route.params.planNo;
    this.enterpriseId = this.$route.params.enterpriseId;
    this.taskId = Number(this.$route.params.taskId);
    // this.taskId = 992;
    if (index == 0 || index) {
      this.currentNav = index;
    }
    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let plan = await http.get(PLAN + "/" + this.planNo);
      if (plan) {
        this.planName = plan.data.data.planName;
      }
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
        setTimeout(() => {
          if (changeType == "changePage") {
            this.currentNav = page;
            setStorage("riskNavIndex", page);
          }
          if (changeType == "nextPage") {
            if (this.currentNav != 5) {
              this.currentNav++;
            }
          }
        });
      }
    },
    submit() {
      // 参数2  current save按钮  nextPage 下一步操作  changePage  tab切换
      // this.saveAll("COMMIT", "current", this.currentNav);
      this.$refs[this.refArr[this.currentNav]].validateData();
      if (!this.$refs.enterpriseStatusRefs.validateFlag) {
        this.$message.error("请先填写完整企业信息！");
        return false;
      }
      if (!this.$refs.signTableRefs.validateFlag) {
        this.$message.error("请先选择文件！");
        return false;
      }
      if (!this.$refs.dynamicRiskRefs.validateFlag) {
        this.$message.error("请先正确填写动态风险因素检查记录！");
        return false;
      }
      if (!this.$refs.advanceInspectionRefs.validateFlag) {
        this.$message.error("请先正确填写企业体系先进性检查记录！");
        return false;
      }
      if (!this.$refs.inspectionHistoryRefs.validateFlag) {
        this.$message.error("请先填写检查记录表完整信息！");
        return false;
      }
      if (!this.$refs.importantEventRefs.validateFlag) {
        this.$message.error("请先填写重要事项记录表完整信息！");
        return false;
      }
      this.$refs[this.refArr[this.currentNav]].submit();
    },
    handleSubmitResult(flag) {
      // flag true提交成功
      if (flag) {
        setTimeout(() => {
          this.$message.success("提交成功！");
        });
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
      this.$refs[this.refArr[this.currentNav]].save(changeType, page);
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
}
</style>