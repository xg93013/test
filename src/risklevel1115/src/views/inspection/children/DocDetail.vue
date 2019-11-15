<template>
  <div id="DocDetail">
    <div class="commonWidth" style="padding:10px;">
      <div class="top-title fl">
        <svg-icon :iconClass="type"></svg-icon>
        <span>{{docName}}</span>
      </div>
      <span class="ent-name">{{enterpriseName}}</span>
      <div v-if="type==='view' " class=" fr  status">
        <span v-if="taskStatus==='APPROVE'" class="blue">待审批</span>
        <span v-if="taskStatus==='APPROVED'" class="pass">审批通过</span>
        <span v-if="taskStatus==='APPROVEFAILED'"  class="anomaly">审批未通过</span>
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
        >{{item.label}}
        </div>
      </div>
      <DocStepone v-show="currentNav==0" :taskId="taskId" :type="this.type" :enterpriseType="enterpriseType" ref="stepOneRefs"/>
      <DocSteptwo v-show="currentNav==1" :taskId="taskId" :type="this.type" :enterpriseType="enterpriseType" ref="stepTwoRefs"/>
      <DocStepthree v-show="currentNav==2" :taskId="taskId" :enterpriseType="enterpriseType" ref="stepThreeRefs"/>
    </div>
    <div class="commonWidth bot" v-if="type==='edit'">
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
  import DocStepone from './DocStepone.vue'
  import DocSteptwo from './DocSteptwo.vue'
  import DocStepthree from './DocStepthree.vue'
  import {getStorage} from '@/utils/index.js'

  import apis from '@/utils/apis.js'
  import http from '@/utils/http.js'

  const {TASKS_TASK, TASKS_UPDATE} = apis

  export default {
    data() {
      return {
        form: {},
        originForm: {},
        insNav: [
          {
            id: 1,
            label: '第1页',
          },
          {
            id: 2,
            label: '第2页',
          },
          {
            id: 3,
            label: '第3页',
          },
        ],
        currentNav: 0,
        enterpriseType: '',
        enterpriseName: '',
        enterprise: {},
        refArr: ['stepOneRefs', 'stepTwoRefs', 'stepThreeRefs'],
        docName: '',
        person: {},
        type: '',
        taskStatus: '',
      }
    },
    components: {
      DocStepone,
      DocSteptwo,
      DocStepthree,
    },
    props: {},
    created() {
      this.taskId = Number(this.$route.params.taskId)
      this.type = this.$route.params.type
      this.type === 'edit' ? this.docName = '编制报告' : this.docName = '预览报告'
      // view edit
      this.getDefaultData()
    },
    methods: {
      async getDefaultData() {
        let res = await http.get(TASKS_TASK + '/' + this.taskId)
        if (res && res.data && res.data.code === 0) {
          let data = res.data.data
          this.enterpriseName = data.enterpriseName
          this.enterpriseType = data.enterpriseType
          this.planName = data.planName
          this.taskStatus = data.taskStatus
        }
      },
      changeNav(index) {
        this.currentNav = index
      },
      async save() {

        let stepOneRefsForm = this.$refs[this.refArr[0]].form
        let res = await http.post(TASKS_UPDATE, {
          'reportRemark': stepOneRefsForm.remarks,
          'reportSuggest': stepOneRefsForm.suggest,
          'status': 'SAVE',//保存SAVE，提交COMMIT
          'taskId': this.taskId, //任务id
        })
        if (res && res.data && res.data.code === 0) {
          this.$msgbox({
            title: '提示',
            message: '保存成功',
            type: 'success',
          })
        } else {
          this.$msgbox({
            title: '提示',
            message: '保存失败',
            type: 'error',
          })
        }
      },
      async submit() {
        let stepOneRefsForm = this.$refs[this.refArr[0]].form
        let res = await http.post(TASKS_UPDATE, {
          'reportRemark': stepOneRefsForm.remarks,
          'reportSuggest': stepOneRefsForm.suggest,
          'status': 'COMMIT',//保存SAVE，提交COMMIT
          'taskId': this.taskId, //任务id
        })
        debugger
        if (res && res.data && res.data.code === 0) {
          this.$msgbox({
            title: '提示',
            message: '提交成功',
            type: 'success',
          })
        } else {
          this.$msgbox({
            title: '提示',
            message: '提交失败',
            type: 'error',
          })
        }
      },
      reset() {
        for (let i = 0; i < this.refArr.length; i++) {
          this.$refs[this.refArr[i]].reset()
        }
      },
    },
  }
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
    .status{
      margin: 10px 14px 0  0;
    }
  }
</style>
