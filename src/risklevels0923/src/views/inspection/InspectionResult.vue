<template>
  <div id="InspectionResult">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon iconClass="edit"></svg-icon>
        <span>数据填报 - 成都市良兴食品有限公司 - 《2019年成都市食品生产经营主体食品安全风险》生产企业体系检查工作评分表</span>
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
          @click="currentNav=index"
        >{{item.label}}</div>
      </div>
    </div>
    <EnterpriseStatus v-show="currentNav==0" />
  </div>
</template>
<script>
import EnterpriseStatus from "./children/EnterpriseStatus.vue";
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
      currentNav: 0
    };
  },
  components: {
    EnterpriseStatus
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