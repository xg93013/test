<template>
  <div>
    <el-form :data="formData" :rules="formRules">
      <el-table :data="tableData">
        <el-table-column prop="name">
          <template slot-scope="scope">
            <div>
              <el-form-item :prop="formData.name">
                <template>
                  <div>
                    <el-input v-model="scope.row['name']"></el-input>
                  </div>
                </template>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date">
          <template slot-scope="scope">
            <div>
              <el-form-item :prop="formData.date">
                <template>
                  <div>
                    <el-input v-model="scope.row['date']"></el-input>
                  </div>
                </template>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address">
          <template slot-scope="scope">
            <div>
              <el-form-item :prop="formData.address">
                <template>
                  <div>
                    <el-input v-model="scope.row['address']"></el-input>
                  </div>
                </template>
              </el-form-item>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var nameValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划名称"));
      }
      let name = "aa";
      if (name == value) {
        callback(new Error("名称已经存在！"));
      } else {
        if (value.length > 100 || value.length < 3) {
          callback(new Error("名称长度在3到100之间！"));
        } else {
          callback();
        }
      }
    };
    return {
      tableData: [
        {
          name: "a",
          date: "b",
          address: "v"
        }
      ],
      formData: {
        name: "",
        date: "",
        address: ""
      },
      formRules: {
        name: [
          {
            required: true,
            validator: nameValidator,
            // message: "请输入",
            trigger: "change"
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
</style>

