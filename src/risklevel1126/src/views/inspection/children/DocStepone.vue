<template>
  <div id="DocStepone">
    <div class="table-box">
      <div class="ent-info">
        <div class="left">企业信息</div>
        <div class="mid">
          <div class="item">企业名称</div>
          <div class="item">企业地址</div>
          <div class="item">营业制制造编号或信用编号</div>
          <div class="item">联系人及联系方式</div>
          <div class="item">食品经营许可证经营范围</div>
          <div class="item">企业上年度风险等级（2018）</div>
        </div>
        <div class="right">
          <div class="item back">{{enterpriseName}}</div>
          <div class="item back">{{enterpriseAddress}}</div>
          <div class="item back">{{enterpriseNo}}</div>
          <div class="item back">{{contact}}</div>
          <div class="item back" style="background-color: #ffffff">
            <SelectTree :data="productCategory" style="width:100%;" :showBorder="false"></SelectTree>
          </div>
          <div class="item back">

            <el-checkbox-group v-model="preRiskLevel" v-if="enterpriseType=='FOOD_PRODUCTION'">
              <el-checkbox label="A" disabled>A级</el-checkbox>
              <el-checkbox label="B" disabled>B级</el-checkbox>
              <el-checkbox label="C" disabled>C级</el-checkbox>
              <el-checkbox label="D" disabled>D级</el-checkbox>
              <el-checkbox label disabled>未注明</el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="preRiskLevel" v-else>
              <el-checkbox label="1" disabled>1级</el-checkbox>
              <el-checkbox label="2" disabled>2级</el-checkbox>
              <el-checkbox label="3" disabled>3级</el-checkbox>
              <el-checkbox label="4" disabled>4级</el-checkbox>
              <el-checkbox label="5" disabled>5级</el-checkbox>
              <el-checkbox label disabled>未注明</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="ent-info">
        <div class="left ins">现场检查日期</div>
        <div class="mid">
          <div class="item ins-item back">{{date.inspectionDate}}</div>
          <div class="item ins-item titles" v-if="enterpriseType=='FOOD_PRODUCTION'">跟踪指导日期</div>
          <div class="item ins-item titles" v-else>整改复查日期</div>
        </div>
        <div class="right">
          <div class="item insr-item back">{{date.reviewWorkDate}}</div>
          <div class="item insr-item titles">报告签发日期</div>
          <div class="item insr-item back">{{date.reportSignDate}}</div>
        </div>
      </div>
      <div class="ent-info" v-if="enterpriseType=='FOOD_PRODUCTION'">
        <div class="left level">企业风险等级评定</div>
        <div class="mid">
          <div class="item level">企业风险等级评定</div>

          <div class="item">风险等级（2019）</div>
        </div>
        <div class="right">
          <div class="right-item">
            <div class="item">静态风险因素量化风险分值</div>
            <div class="item">动态风险因素量化风险分值</div>
            <div class="item">总分</div>
          </div>
          <div class="right-item">
            <div class="item back">{{mark.dynamicRiskScore}}</div>
            <div class="item back">{{mark.staticRiskScore}}</div>
            <div class="item back">{{mark.totalScore}}</div>
          </div>

          <div class="right-item long back">
            <el-checkbox-group v-model="riskLevel">
              <el-checkbox label="A" disabled>A级</el-checkbox>
              <el-checkbox label="B" disabled>B级</el-checkbox>
              <el-checkbox label="C" disabled>C级</el-checkbox>
              <el-checkbox label="D" disabled>D级</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="ent-info ent-catering" v-else>
        <div class="left level">企业风险等级评定</div>
        <div class="mid">
          <div class="item level">风险评定分值</div>
          <div class="item">风险等级（2019）</div>
        </div>
        <div class="right">
          <div class="item back">{{mark.totalScore}}</div>

          <div class="right-item long back">
            <el-checkbox-group v-model="riskLevel">
              <el-checkbox label="1" disabled>1级</el-checkbox>
              <el-checkbox label="2" disabled>2级</el-checkbox>
              <el-checkbox label="3" disabled>3级</el-checkbox>
              <el-checkbox label="4" disabled>4级</el-checkbox>
              <el-checkbox label="5" disabled>5级</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="ent-info">
        <div class="left risk">风险评估及防控建议</div>
        <div class="right long">
          <div class="item">
            <el-input
              type="textarea"
              :rows="8"
              placeholder="风险评估及防控建议"
              v-model="form.suggest"
              maxlength="300"
              show-word-limit
              style="width:100%;margin-top: 10px;"
              :disabled="disabled"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="ent-info">
        <div class="left remark">备注</div>
        <div class="right long">
          <div class="item last">
            <el-input type="text" :disabled="disabled" v-model="form.remarks"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="res">
      <div class="item">
        <span>核查：</span>
        <el-input type="text" v-model="form.checkPerson" disabled></el-input>
      </div>
      <div class="item">
        <span>指导：</span>
        <el-input type="text" v-model="form.leadPerson" disabled></el-input>
      </div>
      <div class="item">
        <span>编制：</span>
        <el-input type="text" v-model="form.reportPerson" disabled></el-input>
      </div>
      <div class="item">
        <span>批准：</span>
        <el-input type="text" v-model="form.approvePerson" disabled></el-input>
      </div>
    </div>
  </div>
</template>
<script>
  import apis from '@/utils/apis.js'
  import http from '@/utils/http.js'
  import {deepClone, getStorage} from '@/utils/index.js'
  import SelectTree from '../../../components/DownTree/SelectTree'

  const {
    TASKS_PREVIEW,
  } = apis

  export default {
    data() {
      return {
        preRiskLevel: [],
        riskLevel: [],
        disabled: false,
        enterpriseName: '',
        enterpriseAddress: '',
        enterpriseNo: '',
        contact: '',
        productCategory: [],
        mark: {
          dynamicRiskScore: '',
          staticRiskScore: '',
          totalScore: '',
        },
        date: {
          inspectionDate: '',
          reportSignDate: '',
          reviewWorkDate: '',
        },
        form: {
          suggest: '',
          checkPerson: '',
          leadPerson: '',
          reportPerson: '',
          approvePerson: '',
          remarks: '',
        },
        originData: {
          suggest: '',
          remarks: '',
        },
      }
    },
    created() {

      this.disabled = this.type == 'view' ? true : false
      // this.preRiskLevel = [this.data.preRiskLevel];
      // this.riskLevel = [this.data.riskLevel];

      this.getDatas()
    },
    props: {

      taskId: {
        type: Number,
        default: 0,
      },
      enterpriseType: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
    },
    methods: {
      async getDatas() {
        let preview = await http.get(TASKS_PREVIEW + '/' + this.taskId + '/1')
        if (preview && preview.data && preview.data.code === 0) {
          this.setPreviewData(preview.data.data, this)
        }
      },
      setPreviewData(preview, data) {
        data.enterpriseName = preview.enterpriseName
        data.enterpriseAddress = preview.enterpriseAddress
        data.enterpriseNo = preview.businessLicense
        data.contact = preview.contact
        data.productCategory = preview.productCategory ? JSON.parse(preview.productCategory) : []
        data.preRiskLevel = [(preview.preRiskLevel === null || preview.preRiskLevel === undefined) ? '' : preview.preRiskLevel]
        data.riskLevel = [preview.currentRiskLevel]
        data.form.suggest = preview.suggest
        data.form.checkPerson = preview.checkPerson
        data.form.leadPerson = preview.leadPerson
        data.form.reportPerson = preview.reportPerson
        data.form.approvePerson = preview.approvePerson
        data.form.remarks = preview.remark
        data.mark.dynamicRiskScore = preview.dynamicRiskScore
        data.mark.staticRiskScore = preview.staticRiskScore
        data.mark.totalScore = preview.totalScore
        data.date.reviewWorkDate = preview.reviewWorkDate
        data.date.reportSignDate = preview.reportSignDate
        data.date.inspectionDate = preview.inspectionDate

      },
      reset() {
        this.form.remarks = this.originData.remarks
        this.form.suggest = this.originData.suggest
      },
    },
    components: {
      SelectTree,
    },
  }
</script>
<style lang="scss" scoped>
  @import "~@/style/DocDetail.scss";
</style>
<style lang="scss">
  #DocStepone {
    .el-textarea__inner {
      border-color: none;
      border: none;
    }

    .last {
      .el-input__inner {
        border: none;
      }
    }
  }
</style>
