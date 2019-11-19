<template>
  <div id="ModeEdit">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.keyWord" placeholder="搜索关键词" class="search-items" />
        <el-select v-model="search.modeClass" placeholder="模板分类" class="search-items">
          <el-option
            v-for="(item,index) in modeTypeList"
            :key="index+'modetype'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="search.entType" placeholder="适用企业类型" class="search-items">
          <el-option
            v-for="(item,index) in entTypeList"
            :key="index+'entType'"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="fr">
        <el-button type="primary" @click="searchResult">
          <svg-icon iconClass="search"></svg-icon>
          <span>查询</span>
        </el-button>
        <el-button @click="resetSearch">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    <div class="commonWidth">
      <div class="table-top">
        <div>
          <el-button @click="visible=true" type="primary">
            <svg-icon iconClass="add"></svg-icon>
            <span>添加模板</span>
          </el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;"
        ref="sortTable"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column type="index" width="60" label="序号"></el-table-column> -->
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align"
          :sortable="item.sortable"
          v-for="(item, index) in tableHeader"
          :key="index+'cloum'"
          v-if="item.selected"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'modeStatus'" class="status">
              <span v-if="scope.row[item.prop] == 'STOP'" class="normal">停用</span>
              <span v-if="scope.row[item.prop] == 'OPEN'" class="blue">启用</span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <span
                  @click="handleOpen(scope.$index, scope.row)"
                  v-if="scope.row['modeStatus'] == 'STOP'"
                  class="edit-data"
                >
                  <svg-icon iconClass="lock"></svg-icon>
                  <label>启用</label>
                </span>
                <span
                  @click="handleStop(scope.$index, scope.row)"
                  v-if="scope.row['modeStatus'] != 'OPEN'"
                >
                  <svg-icon iconClass="lock"></svg-icon>
                  <label>停用</label>
                </span>
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <div class="sum fl">
          <span v-show="statusCount.allNum!=0">
            共
            <label>{{statusCount.allNum}}</label>个模板
          </span>
          <span v-show="statusCount.noNum!=0">
            ，待启用
            <label class="nopass">{{statusCount.noNum}}</label>个
          </span>
          <span v-show="statusCount.okNum!=0">
            ，启用
            <label class="wait">{{statusCount.okNum}}</label>个
          </span>
        </div>
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          class="fr"
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="新增模板"
      :visible.sync="visible"
      width="650px"
      top="200px"
      custom-class="approvalDialog"
    >
      <div class="mode-form">
        <el-form label-width="130px" v-model="form" class="mode-item">
          <el-form-item prop="modeType" label="模板分类：">
            <template>
              <div>
                <el-select v-model="form.modeType" placeholder="模板分类" style="width:100%;">
                  <el-option
                    v-for="(item,index) in modeTypeList"
                    :key="index+'amodetype'"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="entType" label="试用企业类型：">
            <template>
              <div>
                <el-select v-model="form.entType" placeholder="试用企业类型" style="width:100%;">
                  <el-option
                    v-for="(item,index) in modeTypeList"
                    :key="index+'amodetype'"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </el-form-item>

          <el-form-item prop="modeType" label="文档名称：">
            <template>
              <div>
                <el-select
                  v-model="form.modeName"
                  placeholder="文档名称"
                  style="float:left;width:calc(100% - 60px);"
                >
                  <el-option
                    v-for="(item,index) in modeNameList"
                    :key="index+'modename'"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div style="float:left;width:60px;text-align:center;">
                  <svg-icon iconClass="edit"></svg-icon>
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="lvNo" label="版本号：">
            <template>
              <div>
                <el-select v-model="form.lvNo" placeholder="文档名称" style="width:200px;">
                  <el-option
                    v-for="(item,index) in entTypeList"
                    :key="index+'amodetype'"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="lvNo" label="变更记录：">
            <template>
              <div>
                <el-input v-model="form.changeHistory" placeholder="变更记录" type="textarea" max="300"></el-input>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="lvNo" label="上传附件：">
            <template>
              <div>
                <el-button type="default">
                  <svg-icon iconClass="document"></svg-icon>
                  <span>附件</span>
                </el-button>
                <el-input type="file" style="display:none;"></el-input>
                <div>支持格式 .doc .docx ，单个文件不能超过5MB</div>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: {
        keyWord: "",
        modeClass: "",
        entType: ""
      },
      form: {
        modeType: "",
        entType: "",
        modeName: "",
        lvNo: "",
        changeHistory: ""
      },
      formRules: {
        modeType: [
          {
            required: true,
            message: "请选择模板类型！",
            trigger: "change"
          }
        ]
      },
      tableData: [],
      modeTypeList: [],
      entTypeList: [],
      tableHeader: [
        {
          prop: "modeClass",
          label: "模板分类",
          width: 150,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "modeName",
          label: "模板名称",
          width: 150,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "entType",
          label: "试用企业类型",
          width: 150,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "modeStatus",
          label: "模板状态",
          width: 150,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "stardand",
          label: "版本",
          width: 100,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "submitTime",
          label: "发布时间",
          width: 150,
          align: "center",
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "operation",
          label: "操作",
          width: 240,
          align: "center",
          notSort: true,
          sortable: false,
          selected: true
        }
      ],
      statusCount: {
        okNum: 0,
        noNum: 0,
        allNum: 0
      },
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 10
      },
      selectRow: [],
      visible: true
    };
  },
  created() {
    this.getDefaultData();
  },
  methods: {
    getDefaultData() {
      this.modeTypeList = [
        {
          label: "a",
          value: ""
        }
      ];
      this.entTypeList = [
        {
          label: "a",
          value: ""
        }
      ];
    },
    addMode() {},
    handleSelectionChange() {},
    searchResult() {},
    resetSearch() {},
    handleOpen() {},
    handleStop() {},
    confirmVisible() {}
  }
};
</script>
<style lang="scss" scoped>
#mode-form {
  width: 100%;
  .mode-item {
    width: 100%;
  }
}
</style>
