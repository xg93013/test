<template>
  <div id="DocDetail">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>编制报告</span>
      </div>
      <span class="ent-name">{{enterprise.enterpriseName}}</span>
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
      <DocStepone v-show="currentNav==0" :data="enterprise" type="edit" ref="stepOneRefs" />
      <DocSteptwo v-show="currentNav==1" :taskId="taskId" type="edit" ref="stepTwoRefs" />
      <DocStepthree v-show="currentNav==2" :taskId="taskId" ref="stepThreeRefs" />
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
import DocStepone from "./DocStepone.vue";
import DocSteptwo from "./DocSteptwo.vue";
import DocStepthree from "./DocStepthree.vue";
import { getStorage } from "@/utils/index.js";

import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { TASKS_TASK } = apis;

export default {
  data() {
    return {
      form: {},
      originForm: {},
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
      ],
      currentNav: 0,
      enterpriseType: "",
      enterprise: {},
      refArr: ["stepOneRefs", "stepTwoRefs", "stepThreeRefs"]
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
    this.enterpriseType = getStorage("enterpriseType")[0];
    // view edit
    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let res = await http.get(TASKS_TASK + "/" + this.taskId);
      if (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          this.enterprise = {
            enterpriseName: data.enterpriseName,
            enterpriseAddress: data.enterpriseAddress,
            enterpriseNo: data.businessLicense,
            person: data.contact,
            productCategory: data.productCategory,
            riskLevel: data.preRiskLevel,
            enterpriseStatus: data.enterpriseStatus,
            category: data.shutdownCategory,
            stopDate: data.shutdownDate,
            checkDate: data.inspectionDate
          };
        }
      }
    },
    changeNav(index) {
      this.currentNav = index;
    },
    save() {},
    submit() {},
    reset() {
      for (let i = 0; i < this.refArr.length; i++) {
        this.$refs[this.refArr[i]].reset();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#DocDetail {
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
}
</style>