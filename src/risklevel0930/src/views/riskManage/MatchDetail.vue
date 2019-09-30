<template>
  <div id="MatchDetail">
    <div class="commonWidth top">
      <div class="top-title">
        <svg-icon iconClass="view"></svg-icon>
        <span>{{titleName}}</span>
      </div>
    </div>
    <div class="commonWidth">
      <el-form label-width="170px" :model="form" :rules="formRules" disabled>
        <div class="match-item">
          <div class="match-title">
            <svg-icon iconClass="tips"></svg-icon>
            <span>企业基本信息</span>
          </div>

          <div class="match-form">
            <!-- <el-form label-width="160px" :model="form" :rules="formRules"> -->
            <el-form-item label="企业名称：" prop="enterpriseName">
              <el-input v-model="form.enterpriseName"></el-input>
            </el-form-item>
            <el-form-item label="企业地址：" prop="enterpriseAddress">
              <el-input v-model="form.enterpriseAddress"></el-input>
            </el-form-item>
            <el-form-item label="营业执照编号：" prop="enterpriseNo">
              <el-input v-model="form.enterpriseNo"></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="person">
              <el-input v-model="form.person"></el-input>
            </el-form-item>
            <el-form-item label="食品生产许可证：" prop="produceNo">
              <el-input v-model="form.produceNo"></el-input>
            </el-form-item>
            <el-form-item label="企业上年度风险等级：" prop="riskLevel">
              <el-input v-model="form.riskLevel"></el-input>
            </el-form-item>
            <!-- </el-form> -->
          </div>
        </div>
        <div class="match-item">
          <div class="match-title">
            <svg-icon iconClass="tips"></svg-icon>
            <span>现场检查当天情况</span>
          </div>
          <div class="match-form">
            <el-form-item label="企业状态：" prop="enterpriseStatus">
              <!-- 2.1 正常生产， 填写"类别信息"
              2.2 半停产，填写"类别信息"
              2.3 季节性停产，填写"类别信息"
              2.4 停产，填写"类别信息" 与”停产日期“-->
              <!-- <el-input v-model="form.enterpriseStatus"></el-input> -->
              <el-radio v-model="form.enterpriseStatus" label="正常生产"></el-radio>
              <el-radio v-model="form.enterpriseStatus" label="半停产"></el-radio>
              <el-radio v-model="form.enterpriseStatus" label="季节性停产"></el-radio>
              <el-radio v-model="form.enterpriseStatus" label="停产"></el-radio>
            </el-form-item>
            <el-form-item label="企业地址：" prop="checkDate">
              <el-input v-model="form.checkDate"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="commonWidth" :class="{'bot':matchType=='auto'}">
      <div class="match-title">
        <svg-icon iconClass="tips"></svg-icon>
        <span>企业基本信息</span>
      </div>
      <!-- <div class="match-result">

      </div>-->
      <div class="match-score">
        <span>
          企业静态风险因素得分：
          <label class="cColor">{{score.score == '' ? '-':score.score}}</label>
          分&emsp;
          食品静态风险等级：
          <label
            class="cColor"
          >{{score.level == '' ? '-':score.level}}</label>
        </span>
      </div>
      <el-table :data="tableData" border style="margin-top: 20px;">
        <el-table-column label="序号" prop="nums"></el-table-column>
        <el-table-column label="食品、食品添加剂类别" prop="category" width="300" sortable></el-table-column>
        <el-table-column label="类别编号" prop="classNo" sortable></el-table-column>
        <el-table-column label="类别名称" prop="className" sortable></el-table-column>
        <el-table-column label="品种明细" prop="detail"></el-table-column>
        <el-table-column label="食品风险等级" prop="riskLevel" width="140"></el-table-column>
        <el-table-column label="分值（S）" prop="score" width="180">
          <template slot-scope="scope">
            <div v-if="matchType=='auto'">{{scope.row['score']}}</div>
            <div v-else>
              <span
                v-if="scope.row['score'] == ''"
                @click="selectRow(scope.$index, scope.row)"
                style="cursor:pointer;"
              >无法匹配，请点击选择</span>
              <span v-else>{{scope.row['score']}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remarks" width="100"></el-table-column>
      </el-table>
    </div>
    <div class="commonWidth bot" v-show="matchType=='manual'">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button @click="submit">
            <svg-icon iconClass="save"></svg-icon>
            <span>提交</span>
          </el-button>
          <el-button @click="reset">
            <svg-icon iconClass="reset"></svg-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
    <radio-tree :data="treeData" ref="radioTreeRefs" @getRadioTree="getRadioTree"></radio-tree>
  </div>
</template>
<script>
import RadioTree from "@/components/DownTree/RadioTree.vue";
export default {
  data() {
    return {
      titleName: "",
      form: {
        enterpriseName: "",
        enterpriseAddress: "",
        enterpriseNo: "",
        person: "",
        produceNo: "",
        riskLevel: "",
        enterpriseStatus: "",
        checkDate: ""
      },
      formRules: {
        enterpriseName: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        enterpriseAddress: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        enterpriseNo: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        person: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        produceNo: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        riskLevel: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        enterpriseStatus: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        checkDate: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      },
      treeData: [],
      tableData: [],
      originData: [],
      matchType: "",
      currentRow: {},
      currentRowIndex: "",
      score: {
        score: "",
        level: ""
      }
      // formItem: []
    };
  },
  components: {
    RadioTree
  },
  created() {
    this.matchType = this.$route.params.matchType;
    this.titleName =
      "《2019年成都市食品生产经营主体食品安全风险》 - 成都市良兴食品有限公司 -  静态风险因素评分表";
    this.tableData = [
      {
        nums: "1",
        score: 20
      },
      {
        nums: "2",
        score: ""
      }
    ];
    this.originData = [...this.tableData];
  },
  methods: {
    selectRow(index, row) {
      this.currentRow = row;
      row.remarks = "手动匹配";
      this.currentRowIndex = index;
      this.treeData = [
        {
          id: "1",
          label: "大类1",
          children: [
            {
              id: "2",
              label: "细类1",
              riskLevel: "",
              score: "20",
              detail: "xx",
              children: []
            },
            {
              id: "3",
              label: "细类2",
              riskLevel: "I",
              score: "30",
              detail: "dzcx",
              children: []
            }
          ]
        }
      ];
      this.$refs.radioTreeRefs.open();
    },
    getRadioTree(row) {
      console.log(this.currentRowIndex);
      console.log(row);
      this.currentRow.detail = row.detail;
      this.currentRow.riskLevel = row.riskLevel;
      this.currentRow.score = row.score;
      this.tableData.splice(this.currentRowIndex, 1, this.currentRow);
      this.getScore();
    },
    save() {},
    submit() {},
    reset() {
      this.tableData = [...this.originData];
    },
    getScore() {
      let sortTable = this.tableData.sort((a, b) => {
        return Number(b.score) - Number(a.score);
      });
      let max = sortTable[0].score;
      let level = "";
      if (max > 0 && max <= 15) {
        level = "I";
      } else if (max > 15 && max <= 20) {
        level = "II";
      } else if (max > 20 && max <= 25) {
        level = "III";
      } else if (max > 25 && max <= 40) {
        level = "IV";
      } else {
        level = "V";
      }
      this.score = {
        score: max,
        level: level
      };
    }
  }
};
</script>
<style lang="scss" scoped>
#MatchDetail {
  .match-item {
    width: 50%;
    float: left;
    overflow: hidden;
    .match-title {
      margin: 5px 0;
    }
    .match-form {
      margin: 30px 0;
      .el-input {
        width: 90%;
      }
    }
  }
  .match-score {
    text-align: center;
    margin: 20px auto;
    font-weight: bold;
    color: #333;
  }
  .bot {
    margin: 20px auto;
  }
}
</style>