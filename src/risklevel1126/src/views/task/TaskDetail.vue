<template>
  <div id="TaskDetail">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="view"></svg-icon>
        <span>预览任务详情</span>
      </div>
      <span class="ent-name">{{enterpriseName}}</span>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="checkVisible=!checkVisible">
        <span class="fl">检查任务 - 分配详情</span>
        <el-button type="small" class="more fr" @click.stop="taskCheckMore">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="checkVisible">
        <TaskCheck :taskId="taskId" :planNo="planNo" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="staticVisible=!staticVisible">
        <span class="fl">风险评定管理 - 静态风险因素管理</span>
        <el-button type="small" class="more fr" @click.stop="taskStaticMore">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="staticVisible">
        <TaskStatic :taskId="taskId" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="inspectionVisible=!inspectionVisible">
        <span class="fl">风险评定管理 - 动态风险因素管理 - 现场检查记录</span>
        <el-button type="small" class="more fr" @click.stop="taskInspectionMore">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="inspectionVisible">
        <TaskInspection :taskId="taskId" :enterpriseType="enterpriseType" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="trackingVisible=!trackingVisible">
        <span class="fl">风险评定管理 - 动态风险因素管理 - 跟踪指导记录</span>
        <el-button type="small" class="more fr" @click.stop="taskTrackingMore">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="trackingVisible">
        <TaskTracking :taskId="taskId" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="docVisible=!docVisible">
        <span class="fl">体系检查报告管理</span>
        <el-button type="small" class="more fr" @click.stop="taskDocMore">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="docVisible">
        <TaskDoc :taskId="taskId" :enterpriseType="enterpriseType" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="docApprovalVisible=!docApprovalVisible">
        <span class="fl">体系检查报告管理 - 审批详情</span>
        <!-- <el-button type="small" class="more fr">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>-->
      </div>
      <div class="tab-content" v-show="docApprovalVisible">
        <TaskDocApproval :taskId="taskId" />
      </div>
    </div>
  </div>
</template>
<script>
import TaskCheck from "./children/TaskCheck.vue";
import TaskStatic from "./children/TaskStatic.vue";
import TaskInspection from "./children/TaskInspection.vue";
import TaskTracking from "./children/TaskTracking.vue";
import TaskDoc from "./children/TaskDoc.vue";
import TaskDocApproval from "./children/TaskDocApproval.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
import { setStorage } from "@/utils/index.js";

const { TASKS_TASK } = apis;

export default {
  data() {
    return {
      enterpriseName: "a",
      checkVisible: false,
      staticVisible: false,
      inspectionVisible: false,
      trackingVisible: false,
      docVisible: false,
      docApprovalVisible: false,
      taskId: "",
      planNo: "",
      taskStatus: "",
      enterpriseType: ""
    };
  },
  components: {
    TaskCheck,
    TaskStatic,
    TaskInspection,
    TaskTracking,
    TaskDoc,
    TaskDocApproval
  },
  created() {
    this.taskId = Number(this.$route.params.taskId);
    this.planNo = this.$route.params.planNo;
    this.taskStatus = this.$route.params.taskStatus;
    this.enterpriseType = this.$route.params.enterpriseType;
    // this.planNo = "201901-TXJC";
    // this.taskId = 1282;
    // this.taskStatus = "PERSON_MATCH";
    // this.enterpriseType = "FOOD_PRODUCTION";
    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let res = await http.get(TASKS_TASK + "/" + this.taskId);
      if (res) {
        this.enterpriseName = res.data.data.enterpriseName;
      }
    },
    taskCheckMore() {
      let taskIdList = [];
      taskIdList.push(this.taskId);
      setStorage("taskIdList", taskIdList);
      let routeUrl = this.$router.resolve({
        name: "任务预览",
        params: {
          taskType: "detail",
          planNo: this.planNo
          // planName: this.search.planName
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    taskStaticMore() {
      let routeUrl = this.$router.resolve({
        name: "得分详情",
        params: {
          matchType: "view",
          planNo: this.planNo,
          taskId: this.taskId,
          taskStatus: this.taskStatus
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    taskInspectionMore() {
      setStorage("viewIndex", 0);
      setStorage("enterpriseType", this.enterpriseType);
      let routeUrl = this.$router.resolve({
        name: "现场检查详情",
        params: {
          taskId: this.taskId,
          inspectionType: "view"
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    taskTrackingMore() {
      let routeUrl = this.$router.resolve({
        name: "跟踪指导填报详情",
        params: {
          taskId: this.taskId,
          type: "view"
        }
      });
      window.open(routeUrl.href, "_blank");
    },
    taskDocMore() {
      setStorage("enterpriseName", this.enterpriseName);
      setStorage("enterpriseType", this.enterpriseType);
      this.$router.push({
        name: "预览报告",
        params: {
          taskId: this.taskId,
          type: "view"
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#TaskDetail {
  .tab-detail {
    padding: 0 20px;
    margin: 10px auto;
  }
  .tab-title {
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    span {
      font-weight: bold;
    }
    .more {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      .icon {
        // color: #ccc;
      }
    }
  }
}
</style>