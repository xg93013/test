<template>
  <div id="DocStepthree">
    <el-table :data="tableData" style="width: 100%;margin-top:20px;" ref="historyTableRefs" border v-if="enterpriseType==='FOOD_PRODUCTION'">
      <el-table-column label="动态风险因素不符情况描述" align="center">
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
    <!-- 企业先进性不符情况描述 -->
    <el-table
      :data="adTableData"
      style="width: 100%;margin-top:20px;"
      ref="historyTableRefs"
      border
      v-if="enterpriseType==='FOOD_PRODUCTION'"
    >
      <el-table-column label="企业先进性不符情况描述" align="center">
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'nextcloum'"
        ></el-table-column>
      </el-table-column>

    </el-table >
    <el-table :data="tableData" style="width: 100%;margin-top:20px;" ref="historyTableRefs" border v-if="enterpriseType!=='FOOD_PRODUCTION'">
      <el-table-column label="现场发现的问题" align="center">
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeaderCatering"
          :key="index+'cloum'"
        ></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import apis from '@/utils/apis.js'
  import http from '@/utils/http.js'

  const {
    TASKS_PREVIEW,
  } = apis
  export default {
    data() {
      return {
        tableData: [],
        adTableData: [],
        tableHeader: [
          {
            prop: 'item',
            label: '检查项目序号',
            width: '',
            align: 'left',
            sortable: false,
          },
          {
            prop: 'description',
            label: '问题描述',
            width: '',
            align: 'center',
            sortable: false,
          },
        ],
        tableHeaderCatering: [
          {
            prop: 'item',
            label: '评定项目编号',
            width: '',
            align: 'left',
            sortable: false,
          },
          {
            prop: 'description',
            label: '不符合情况描述',
            width: '',
            align: 'center',
            sortable: false,
          },
        ],
      }
    },
    methods: {
      async getData() {
        let res = await http.get(TASKS_PREVIEW + '/' + this.taskId + '/3')
        if (res && res.data && res.data.code === 0) {
          let data = res.data.data
          if(data.dynamicInconformityList&&data.dynamicInconformityList.length>0){
            data.dynamicInconformityList.forEach((value,i)=>{
              this.tableData.push({...value,nums:i})
            })
          }
          if(data.advancementInconformityList&&data.advancementInconformityList.length>0){
            data.advancementInconformityList.forEach((value,i )=>{
              this.adTableData.push({...value,nums:i})
            })
          }
        }
      },
    },
    props: {
      taskId: {
        type: Number,
        default: 0,
      },
      enterpriseType:{
        type: String,
        default: ""
      }
    },
    created() {
      this.tableData = []
      this.adTableData = []

      this.getData()
    },
  }
</script>
<style lang="scss" scoped>
  #DocStepthree {
    padding: 30px 20px;
  }
</style>
<style lang="scss">
  .ad-table {
    border-top: none;
  }

  .ad-table .is-group {
    tr {
      &:last-child {
        display: none;
      }
    }
  }
</style>
