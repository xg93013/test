<template>
  <div id="InspectionResult">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>数据填报 - {{enterpriseName}} - 《{{planName}}》生产企业体系检查工作评分表</span>
      </div>
      <div class="fr">
        <el-button type="primary">提交</el-button>
      </div>
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
    <EnterpriseStatus v-show="currentNav==0" :taskId="taskId" />
    <SignTable v-show="currentNav==1" :taskId="taskId" />
    <DynamicRisk v-show="currentNav==2" :enterpriseName="enterpriseName" :taskId="taskId" />
    <AdvanceInspection v-show="currentNav==3" :enterpriseName="enterpriseName" :taskId="taskId" />
    <InspectionHistory v-show="currentNav==4" />
    <ImportantEvent v-show="currentNav==5" />
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
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { PLAN } = apis;
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
      taskId: ""
    };
  },
  components: {
    EnterpriseStatus,
    SignTable,
    DynamicRisk,
    AdvanceInspection,
    InspectionHistory,
    ImportantEvent
  },
  created() {
    let index = getStorage("riskNavIndex")[0];
    this.planNo = this.$route.params.planNo;
    this.enterpriseId = this.$route.params.enterpriseId;
    // this.taskId = Number(this.$route.params.taskId);
    this.taskId = 992;
    if (index) {
      this.currentNav = index;
    }
    this.getDatas();
  },
  methods: {
    async getDatas() {
      let plan = await http.get(PLAN + "/" + this.planNo);
      if (plan) {
        this.planName = plan.data.data.planName;
      }
    },
    changeNav(index) {
      this.currentNav = index;
      setStorage("riskNavIndex", index);
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
}
</style>