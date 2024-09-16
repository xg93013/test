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
    <el-table :data="tableData" border style="margin-top:20px;">
      <el-table-column label="序号" prop="nums" width="100" align="center"></el-table-column>
      <el-table-column label="食品、食品添加剂类别" prop="category" width="200" align="center"></el-table-column>
      <el-table-column label="类别编号" prop="classNo" align="center"></el-table-column>
      <el-table-column label="类别名称" prop="className" align="center"></el-table-column>
      <el-table-column label="品种明细" prop="detail" align="center"></el-table-column>
      <el-table-column label="食品风险等级" prop="riskLevel" width="140" align="center"></el-table-column>
      <el-table-column label="分值（S）" prop="score" width="180" align="center"></el-table-column>
      <el-table-column label="备注" prop="remarks" width="100" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      score: {
        score: "",
        level: ""
      }
    };
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