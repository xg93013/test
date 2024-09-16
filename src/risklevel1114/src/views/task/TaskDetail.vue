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
        <el-button type="small" class="more fr">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="checkVisible">
        <TaskCheck :taskId="taskId" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="staticVisible=!staticVisible">
        <span class="fl">风险评定管理 - 静态风险因素管理</span>
        <el-button type="small" class="more fr">
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
        <el-button type="small" class="more fr">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="inspectionVisible">
        <TaskInspection :taskId="taskId" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="trackingVisible=!trackingVisible">
        <span class="fl">风险评定管理 - 动态风险因素管理 - 跟踪指导记录</span>
        <el-button type="small" class="more fr">
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
        <el-button type="small" class="more fr">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
      </div>
      <div class="tab-content" v-show="docVisible">
        <TaskDoc :taskId="taskId" />
      </div>
    </div>
    <div class="commonWidth tab-detail">
      <div class="tab-title" @click="docApprovalVisible=!docApprovalVisible">
        <span class="fl">体系检查报告管理 - 审批详情</span>
        <el-button type="small" class="more fr">
          更多
          <svg-icon iconClass="right" class="icon"></svg-icon>
        </el-button>
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
      taskId: ""
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
    // this.taskId = Number(this.$route.params.taskId);
    this.taskId = "1282";
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