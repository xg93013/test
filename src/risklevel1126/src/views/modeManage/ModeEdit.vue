<template>
  <div id="ModeEdit">
    <div class="commonWidth top-search">
      <div class="fl">
        <el-input v-model="search.keyWord" placeholder="搜索关键词" class="search-items"/>
        <el-select v-if="false" v-model="search.modeClass" placeholder="模板分类" class="search-items">
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
          <el-button @click="onClickModel" type="primary">
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
            <div v-if="item.prop === 'status'" class="status">
              <span v-if="scope.row[item.prop] == 'DISABLE'" class="anomaly">停用</span>
              <span v-if="scope.row[item.prop] == 'ENABLE'" class="normal">启用</span>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <div class="operation">
                <span
                  @click="handleOpen(scope.$index, scope.row)"
                  v-if="scope.row['status'] == 'DISABLE'"
                  class="edit-data"
                >
                  <svg-icon iconClass="lock"></svg-icon>
                  <label>启用</label>
                </span>
                <span
                  @click="handleStop(scope.$index, scope.row)"
                  v-if="scope.row['status'] != 'DISABLE'"
                >
                  <svg-icon iconClass="lock"></svg-icon>
                  <label>停用</label>
                </span>
                <span @click="handleDown(scope.$index, scope.row)">
                  <svg-icon iconClass="downLoad"></svg-icon>

                  <label>下载</label>
                </span>
                <span
                  v-if="scope.row['status'] == 'DISABLE'"
                  @click="handleDel(scope.$index, scope.row)"
                >
                  <svg-icon iconClass="delete"></svg-icon>
                  <label>删除</label>
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
          <el-form-item v-if="false" prop="modeType" label="模板分类：">
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
                <el-select v-model="form.entType" placeholder="试用企业类型" style="width:100%;" @change="entTypeChange">
                  <el-option
                    v-for="(item,index) in (entTypeList.filter(value => value.value!=='ALL'))"
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
                <el-autocomplete
                  class="inline-input"
                  v-model="form.modeName"
                  :fetch-suggestions="querySearch"
                  placeholder="文档名称"
                  style="width:100%;"
                  @select="handleSelect"
                  @blur="handleBlur"
                ></el-autocomplete>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="lvNo" label="版本号：">
            <template>
              <div>
                <el-input
                  placeholder="文档名称"
                  v-model="form.lvNo"
                  :disabled="true">
                </el-input>
                <!--                <el-select v-model="form.lvNo" placeholder="文档名称" style="width:200px;">-->
                <!--                  <el-option-->
                <!--                    v-for="(item,index) in entTypeList"-->
                <!--                    :key="index+'amodetype'"-->
                <!--                    :label="item.label"-->
                <!--                    :value="item.value"-->
                <!--                  ></el-option>-->
                <!--                </el-select>-->
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
              <div style="height: 120px">
                <el-upload
                  class="upload"
                  ref="upload"
                  :action="uploadUrl"
                  :data="submit"
                  :file-list="form.fileList"
                  :multiple="false"
                  :auto-upload="false"
                  :on-change="uploadChange"
                  :on-remove="uploadRemove"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                >
                  <el-button type="default">
                    <svg-icon iconClass="document"></svg-icon>
                    <span>附件</span>
                  </el-button>
                </el-upload>
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
  import apis from '@/utils/apis.js'
  import http from '@/utils/http.js'

  const {
    TEMPLATE_TYPE, TEMPLATE_E_TYPE, TEMPLATE, TEMPLATES_M, TEMPLATE_UPLOAD, TEMPLATE_FILENAME, EXPORT_BASE,
  } = apis
  export default {
    data() {
      return {
        uploadUrl: TEMPLATE_UPLOAD,
              search: {
          keyWord: '',
          // modeClass: '',
          entType: '',
        },
        form: {
          modeType: '',
          entType: '',
          modeName: '',
          lvNo: 'v1',
          changeHistory: '',
          fileList: [],
        },
        submit: {
          changeLog: '',
          enterpriseType: '',
          name: '',
          version: '',
        },
        formRules: {
          modeType:
            {
              required: false,
              message: '请选择模板类型！',
              trigger: 'change',
            },
          entType: {
            required: true,
            message: '请选择企业类型！',
            trigger: 'change',
          },
          modeName: {
            required: true,
            message: '请输入模板名称！',
            trigger: 'change',
          },
          lvNo: {
            required: true,
            message: '版本号为空！',
            trigger: 'change',
          },
          changeHistory: {
            required: false,
          },
          fileList: {
            required: true,
            message: '请选择上传文件！',
            trigger: 'change',
          },

        },
        tableData: [],
        modeTypeList: [],
        entTypeList: [],
        tableHeader: [

          {
            prop: 'name',
            label: '模板名称',
            width: 300,
            notSort: false,
            sortable: true,
            selected: true,
          },
          {
            prop: 'enterpriseName',
            label: '试用企业类型',
            width: 150,
            align: 'center',
            notSort: false,
            sortable: true,
            selected: true,
          },
          {
            prop: 'status',
            label: '模板状态',
            width: 150,
            align: 'center',
            notSort: false,
            sortable: true,
            selected: true,
          },
          {
            prop: 'version',
            label: '版本',
            width: 100,
            align: 'center',
            notSort: false,
            sortable: true,
            selected: true,
          },
          {
            prop: 'publishTime',
            label: '发布时间',
            width: 150,
            align: 'center',
            notSort: false,
            sortable: true,
            selected: true,
          },
          {
            prop: 'operation',
            label: '操作',
            width: 240,
            align: 'center',
            notSort: true,
            sortable: false,
            selected: true,
          },
        ],
        statusCount: {
          okNum: 0,
          noNum: 0,
          allNum: 0,
        },
        page: {
          currentPage: 1,
          totalElements: 0,
          pageSize: 10,
        },
        autoSelect: {
          lastSelect: '',
        },
        selectRow: [],
        visible: false,
        allFileName: {},
      }
    },
    created() {
      this.getDefaultData()
    },
    methods: {
      pageChange(page) {
        this.page.currentPage = page
        this.getDatas()
      },
      sizeChange() {
        this.getDatas()
      },
      onClickModel: function() {
        this.visible = true
        http.get(TEMPLATE_FILENAME).then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.allFileName = []
            this.allFileName = res.data.data
            // res.data.data.forEach((value)=>{
            //   this.allFileName.push({
            //     value:value.name,
            //     version:value.version
            //   })
            // })
          }

        })
      },
      uploadSuccess: function(response) {
        http.get(TEMPLATE_FILENAME).then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.allFileName = []
            this.allFileName = res.data.data
            // res.data.data.forEach((value)=>{
            //   this.allFileName.push({
            //     value:value.name,
            //     version:value.version
            //   })
            // })
          }

        })
        if (response.code === 0) {
          this.$message.success('上传成功')
          this.form.fileList = []
        } else {
          this.$message.error(response.msg)
        }

      },
      uploadError: function(err) {
        http.get(TEMPLATE_FILENAME).then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.allFileName = []
            this.allFileName = res.data.data
            // res.data.data.forEach((value)=>{
            //   this.allFileName.push({
            //     value:value.name,
            //     version:value.version
            //   })
            // })
          }

        })
        this.$message.error(err)
      },
      getDatas: function() {
        let params = {}
        params.pageNo = this.page.currentPage
        params.pageSize = this.page.pageSize
        if(this.search.keyWord!==""){
          params.keyword=this.search.keyWord
        }
        if(this.search.entType!==""){
          params.enterpriseTypeEnum=this.search.entType
        }
        http.get(TEMPLATES_M, params).then((res) => {
          if (res && res.data && res.data.code === 0) {
            let data = res.data.data
            this.tableData = []
            data.content.forEach((value) => {
              this.tableData.push({
                ...value,
              })
            })
            this.statusCount.allNum = data.statusCount.total
            this.statusCount.okNum = data.statusCount.ENABLE
            this.statusCount.noNum = data.statusCount.DISABLE
            this.page.totalElements = data.totalElements
          }
        })
      },
      getDefaultData: function() {

        http.get(TEMPLATE_E_TYPE).then((res) => {
          if (res && res.data && res.data.code === 0) {
            let data = res.data.data
            this.entTypeList = []
            this.form.entType = []
            data.forEach((value) => {
              this.entTypeList.push({
                label: value.name,
                value: value.code,
              })
              this.form.entType.push({
                label: value.name,
                value: value.code,
              })
            })
          }
        })

        this.getDatas()

      },
      addMode() {},
      handleSelectionChange() {},
      searchResult() {
        this.page.currentPage = 1;
        this.getDatas()
      },
      resetSearch() {
        this.page.currentPage = 1;
        this.search.entType=""
        this.search.keyWord=""
      },
      handleOpen(index, row) {
        http.post(TEMPLATE + '/' + row.id + '?enable=true').then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.tableData[index].status = 'ENABLE'
          }
        })

      },
      handleStop(index, row) {
        http.post(TEMPLATE + '/' + row.id + '?enable=false').then((res) => {
          if (res && res.data && res.data.code === 0) {
            this.tableData[index].status = 'DISABLE'
          }
        })
      },
      handleDel(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          http.delete(TEMPLATE + '/' + row.id).then(() => {
            this.getDatas()
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })


    },
    handleDown(index, row) {
      debugger
      let a = document.createElement('a')
      a.download
      a.href = EXPORT_BASE + 'template/' + row.id
      a.click()
    },
    confirmVisible() {
      for (let key in this.formRules) {
        if (this.formRules[key].required) {
          if (this.form[key].length === 0) {
            this.$message.warning(this.formRules[key].message)
            return
          }
        }
      }

      this.submit.changeLog = this.form.changeHistory
      this.submit.enterpriseType = this.form.entType
      this.submit.name = this.form.modeName
      this.submit.version = this.form.lvNo

      this.$refs.upload.submit()

    },
    uploadChange(file, fileList) {
      this.form.fileList = [file]
      debugger
    },
    uploadRemove() {
      this.form.fileList = []
    },
    createFilter(queryString) {
      return (data) => {
        return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.form.entType = item.entType
      this.form.lvNo = 'v' + (item.version.substring(1) - 0 + 1)
      this.autoSelect.lastSelect = item.name
    },
    handleBlur() {
      if (this.autoSelect.lastSelect === this.form.modeName) {
        return
      }
      if (!this.form.entType || !this.form.modeName) {
        this.form.lvNo = 'v1'
      } else {
        let data = this.findModeDataByName(this.form.modeName)
        if (data) {
          this.form.lvNo = 'v' + (data.version.substring(1) - 0 + 1)
        } else {
          this.form.lvNo = 'v1'
        }
      }
      this.autoSelect.lastSelect = this.form.modeName
    },
    entTypeChange() {
      if (!this.form.entType || !this.form.modeName) {
        this.form.lvNo = 'v1'
      } else {
        let data = this.findModeDataByName(this.form.modeName)
        if (data) {
          this.form.lvNo = 'v' + (data.version.substring(1) - 0 + 1)
        } else {
          this.form.lvNo = 'v1'
        }
      }
    },
    findModeDataByName(name) {
      let data = this.dealAllFileData()
      let result = null
      data.forEach((value) => {
        if (value.value === name) {
          result = value
        }
      })
      return result
    },
    dealAllFileData() {
      let data = []
      if (this.form.entType === '' || this.form.entType === 'ALL') {
        for (let allFileNameKey in this.allFileName) {
          this.allFileName[allFileNameKey].forEach((e) => {
            data.push({
              value: e.name,
              version: e.version,
              entType: e.enterpriseType,
            })
          })
        }
      } else {
        if (this.allFileName[this.form.entType] && this.allFileName[this.form.entType].length > 0) {
          this.allFileName[this.form.entType].forEach((e) => {
            data.push({
              value: e.name,
              version: e.version,
              entType: e.enterpriseType,
            })
          })
        }
      }
      return data
    },
    querySearch(queryString, cb) {
      let data = this.dealAllFileData()
      const results = queryString ? data.filter(this.createFilter(queryString)) : data
      cb(results)
    },
  },

  }
</script>
<style lang="scss" scoped>
  #mode-form {
    width: 100%;

    .mode-item {
      width: 100%;
    }
  }
</style>
