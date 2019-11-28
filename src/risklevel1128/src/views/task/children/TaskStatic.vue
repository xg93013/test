<template>
  <div id="TaskStatic">
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
      <el-table-column label="序号" prop="nums" width="100" align="center"></el-table-column>
      <el-table-column label="食品生产许可证食品类别" prop="foodLicenseCategory" width="130" align="center"></el-table-column>
      <el-table-column label="食品、食品添加剂类别" prop="category" width="200" sortable align="center"></el-table-column>
      <el-table-column label="类别编号" prop="classNo" sortable align="center"></el-table-column>
      <el-table-column label="类别名称" prop="className" sortable align="center"></el-table-column>
      <el-table-column label="品种明细" prop="detail" align="center"></el-table-column>
      <el-table-column label="食品风险等级" prop="riskLevel" width="140" align="center"></el-table-column>
      <el-table-column label="分值（S）" prop="score" width="120" align="center"></el-table-column>
      <el-table-column label="备注" prop="remarks" width="100" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const { STATICRISK } = apis;

export default {
  data() {
    return {
      tableData: [],
      score: {
        score: "",
        level: ""
      }
    };
  },
  props: {
    taskId: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.getDefaultData();
  },
  methods: {
    async getDefaultData() {
      let tableDatas = await http.get(STATICRISK + "/" + this.taskId);
      if (tableDatas) {
        this.tableData = [];
        let datas = tableDatas.data.data;
        for (let i = 0; i < datas.length; i++) {
          this.tableData.push({
            taskId: datas[i].taskId,
            enterpriseName: datas[i].enterpriseName,
            nums: i + 1,
            category: datas[i].foodCategory,
            foodLicenseCategory: datas[i].foodLicenseCategory,
            classNo: datas[i].categoryId ? datas[i].categoryId : "",
            className: datas[i].categoryName ? datas[i].categoryName : "",
            detail: datas[i].categorySub ? datas[i].categorySub : "",
            riskLevel: datas[i].riskLevel ? datas[i].riskLevel : "",
            score:
              datas[i].riskScore == 0
                ? 0
                : datas[i].riskScore
                ? datas[i].riskScore
                : "",
            remarks: datas[i].memo,
            id: datas[i].id
          });
        }
        this.getScore();
      }
    },
    getScore() {
      let sortTable = this.tableData.sort((a, b) => {
        return Number(b.score) - Number(a.score);
      });
      // II III IV V
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
        score: sortTable[0].score,
        level: sortTable[0].riskLevel
      };
    }
  }
};
</script>
<style lang="scss" scoped>
#TaskStatic {
  padding: 20px;
  .match-score {
    text-align: center;
  }
}
</style>