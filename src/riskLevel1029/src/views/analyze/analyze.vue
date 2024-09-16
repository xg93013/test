<template>
  <div class="analyze">
    <div class="box">
      <div class="item">
        <div class="line">
          <div class="title">一级维度：</div>
          <div class="tabs">
            <div
              class="tabs-item"
              @click="checkOne(item)"
              v-for="item in oneStandardList"
            >{{item.label}}</div>
          </div>
        </div>
        <div class="line">
          <div class="title">一级维度指标：</div>
          <div class="tabs">
            <el-checkbox-group v-model="oneChecklist">
              <el-checkbox :label="item.prop" v-for="item in onecheckData">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="line">
          <div class="title">二级维度：</div>
          <div class="tabs">
            <div
              class="tabs-item"
              @click="checkTwo(item)"
              v-for="item in twoStandardList"
            >{{item.label}}</div>
          </div>
        </div>
        <div class="line">
          <div class="title">二级维度指标：</div>
          <div class="tabs">
            <el-checkbox-group v-model="twoChecklist">
              <el-checkbox :label="item.prop" v-for="item in twocheckData">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="tables">
      <el-table :data="tableData">
        <el-table-column
          :prop="oneStandard.prop"
          :label="oneStandard.label"
          min-width="150"
          :show-summary="true"
          v-if="oneStandard.label!=''"
        ></el-table-column>
        <el-table-column :label="twoStandard.label" v-if="twoStandard.label!=''">
          <el-table-column
            :prop="itema"
            :label="checkObj[itema]"
            min-width="120"
            v-for="itema in twoChecklist"
          ></el-table-column>
        </el-table-column>
        <el-table-column
          :prop="item"
          :label="checkObj[item]"
          min-width="150"
          v-for="item in oneChecklist"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      oneChecklist: [],
      twoChecklist: [],
      checkObj: {
        pass: "合格率",
        nopass: "不合格率",
        passsum: "总合格率",
        nopasssum: "总不合格率"
      },
      onecheckData: [
        {
          label: "总合格率",
          prop: "passsum"
        },
        {
          label: "总不合格率",
          prop: "nopasssum"
        }
      ],
      twocheckData: [
        {
          label: "合格率",
          prop: "pass"
        },
        {
          label: "不合格率",
          prop: "nopass"
        }
      ],
      tableData: [],
      oneStandardList: [
        {
          label: "一级维度1",
          prop: "aaa1",
          list: []
        },
        {
          label: "一级维度2",
          prop: "aaa2",
          list: []
        },
        {
          label: "一级维度3",
          prop: "aaa3",
          list: []
        }
      ],
      twoStandardList: [
        {
          label: "二级维度1",
          prop: "aaa1",
          list: []
        },
        {
          label: "二级维度2",
          prop: "aaa2",
          list: []
        },
        {
          label: "二级维度3",
          prop: "aaa3",
          list: []
        }
      ],
      oneStandard: {
        label: "",
        prop: "aaa",
        list: []
      },
      twoStandard: {
        label: "",
        prop: "two"
      }
    };
  },
  methods: {
    checkTwo(item) {
      this.twoStandard.label = item.label;
    },
    checkOne(item) {
      this.oneStandard = { ...item };
      this.oneStandard.list = ["a", "b", "c"];
      this.tableData = [];
      this.oneStandard.list.forEach(item => {
        let obj = {};
        obj[this.oneStandard.prop] = item;
        for (let i = 0; i < twoChecklist.length; i++) {}
        this.tableData.push(obj);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.analyze {
  .box {
    display: flex;
    padding: 20px;
    .item {
      flex: 1;
      .line {
        display: flex;
        .title {
          flex: 0 0 100px;
        }
        .tabs {
          flex: 1;
          display: flex;
          .tabs-item {
            flex: 1;
            cursor: pointer;
          }
        }
      }
    }
  }
  .tables {
    width: 100%;
  }
}
</style>

