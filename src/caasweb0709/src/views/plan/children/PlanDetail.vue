<template>
  <div id="PlanDetail" class="PlanDetail">
    <div class="commonWidth top">
      <div class="fl top-title">
        <svg-icon iconClass="list"></svg-icon>
        <span>{{title}} -《{{normalForm.planNum}}》</span>
      </div>
      <div class="fr">
        <el-button type="primary" @click="viewPlan" v-show="!disabled">
          <svg-icon iconClass="eye" class="title-icon"></svg-icon>计划预览
        </el-button>
        <span class="tips">*为必填项</span>
      </div>
    </div>
    <el-form
      ref="normalFormRefs"
      :model="normalForm"
      :rules="normalFormRules"
      @validate="validateForm"
      label-width="120px"
    >
      <div>
        <div class="commonWidth mid">
          <div class="fl item">
            <div class="common-title">基础信息</div>
            <div class="form">
              <el-form-item label="计划类型" prop="planType">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.planType"
                        placeholder="计划类型"
                        style="width: 100%;"
                        :disabled="disabled"
                      >
                        <el-option
                          :label="item.label"
                          :value="item.value"
                          v-for="(item, index) in planTypeList"
                          :key="'pType'+index"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="计划年份" prop="planYear">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="year"
                        placeholder="计划年份"
                        v-model="normalForm.planYear"
                        style="width: 100%;"
                        value-format="yyyy"
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="date"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="计划编号" prop="planNum">
                <template>
                  <div class="form-item">
                    <el-input v-model="normalForm.planNum" disabled placeholder="请输入计划编号"></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="计划名称" prop="planName">
                <template>
                  <div class="form-item">
                    <el-autocomplete
                      v-model="normalForm.planName"
                      :fetch-suggestions="remoteMethod"
                      placeholder="请输入内容"
                      @select="handleSelect"
                      :disabled="disabled"
                      style="width:100%"
                    ></el-autocomplete>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="文件编号" prop="docNum">
                <template>
                  <div class="form-item">
                    <el-autocomplete
                      v-model="normalForm.docNum"
                      :fetch-suggestions="remoteDocNum"
                      placeholder="请输入内容"
                      @select="handleSelect"
                      :disabled="disabled"
                      style="width:100%"
                    ></el-autocomplete>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="执行开始日期" prop="startDate">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="date"
                        placeholder="执行开始日期"
                        v-model="normalForm.startDate"
                        style="width: 100%;"
                        value-format="yyyy-MM-dd"
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="date"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="执行结束日期" prop="endDate">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="date"
                        placeholder="执行结束日期"
                        v-model="normalForm.endDate"
                        style="width: 100%;"
                        value-format="yyyy-MM-dd"
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="date"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
            </div>
          </div>
          <div class="fl item">
            <div class="common-title">管理信息</div>
            <div class="form">
              <el-form-item label="管理单位" label-width="120px" prop="manUnit">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.manUnit"
                        placeholder="管理单位"
                        style="width: 100%;"
                        disabled
                      >
                        <el-option label="类型1" value="shanghai"></el-option>
                        <el-option label="类型2" value="beijing"></el-option>
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="组织实施单位" label-width="120px" prop="orgUnit">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.orgUnit"
                        placeholder="组织实施单位"
                        style="width: 100%;"
                        disabled
                      >
                        <el-option label="类型1" value="shanghai"></el-option>
                        <el-option label="类型2" value="beijing"></el-option>
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="备注信息" label-width="120px" prop="remarks">
                <template>
                  <div class="form-item textarea">
                    <el-input
                      type="textarea"
                      v-model="normalForm.remarks"
                      :autosize="{ minRows: 4, maxRows: 5}"
                      maxlength="300"
                      show-word-limit
                      :disabled="disabled"
                    ></el-input>
                  </div>
                </template>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="commonWidth bot">
          <div class="bot-top">
            <div class="fl item">
              <div class="common-title">项目</div>
              <div class="form">
                <el-form-item label="业态：" prop="busniess">
                  <template>
                    <div class="form-item">
                      <div class="left-item">
                        <el-select
                          v-model="normalForm.busniess"
                          placeholder="业态"
                          style="width: 100%;"
                          :disabled="disabled"
                          @change="changeBusniess"
                        >
                          <el-option
                            :label="item.label"
                            :value="item.value"
                            v-for="(item, index) in busniessList"
                            :key="'businesslist'+index"
                          ></el-option>
                        </el-select>
                      </div>
                      <div class="icons" v-show="!disabled">
                        <svg-icon iconClass="down"></svg-icon>
                      </div>
                    </div>
                  </template>
                </el-form-item>
                <el-form-item label="大类：" prop="kinds">
                  <template>
                    <div class="form-item">
                      <div class="left-item">
                        <el-select
                          v-model="normalForm.kinds"
                          placeholder="大类"
                          style="width: 100%;"
                          :disabled="disabled"
                        >
                          <el-option
                            v-for="(item,index) in kindsList"
                            :label="item.label"
                            :value="item.value"
                            :key="'kingslist'+index"
                          ></el-option>
                        </el-select>
                      </div>
                      <div class="icons" v-show="!disabled">
                        <svg-icon iconClass="down"></svg-icon>
                      </div>
                    </div>
                  </template>
                </el-form-item>
                <div class="empty-class" @click="addKinds" v-show="!disabled">业态下大类若不存在，请点击此处新增</div>
              </div>
            </div>
            <div class="fl item">
              <div class="common-title">牵头单位</div>
              <div class="form">
                <el-form-item label="牵头单位：" prop="topUnit">
                  <template>
                    <div class="form-item">
                      <div class="left-item">
                        <el-select
                          v-model="normalForm.topUnit"
                          placeholder="牵头单位"
                          disabled
                          style="width: 100%;"
                        >
                          <el-option label="类型1" value="shanghai"></el-option>
                          <el-option label="类型2" value="beijing"></el-option>
                        </el-select>
                      </div>
                      <div class="icons" v-show="!disabled">
                        <svg-icon iconClass="down"></svg-icon>
                      </div>
                    </div>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="add-list" v-show="!disabled">
            <el-button class="add-btn" @click="addToList">
              <svg-icon iconClass="add"></svg-icon>
              <span>添加至列表</span>
            </el-button>
          </div>
          <div class="list">
            <div class="common-title">
              <div class="label">项目配置结果</div>
              <div class="result">
                已配置
                <span>{{tableData.length}}</span>个项目
              </div>
              <el-button class="fr" @click="toggleTable">
                <svg-icon :iconClass="showTable?'up':'down'"></svg-icon>
                <span>{{showTable?'折叠':'展开'}}</span>
              </el-button>
            </div>
            <div class="list-table" ref="tableRefs">
              <el-table :data="tableData" border :span-method="objectSpanMethod">
                <el-table-column label="牵头单位" prop="topUnit" width="200"></el-table-column>
                <el-table-column label="业态" prop="busniess" width="160"></el-table-column>
                <el-table-column label="大类" prop="kinds" width="160"></el-table-column>
                <el-table-column label="项目名称" prop="projectName"></el-table-column>
                <el-table-column label="操作" align="center" width="240">
                  <template slot-scope="scope">
                    <span style="cursor:pointer;" @click="deleteProject(scope.$index, scope.row)">
                      <svg-icon iconClass="delete"></svg-icon>
                      <span>删除</span>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

        <div class="commonWidth last">
          <div class="item">
            <div class="common-title">判定标准</div>
            <div class="last-box">
              <div class="fl in-item">
                <el-form-item label="标准名称" prop="standard">
                  <template>
                    <div class="form-item">
                      <el-input v-model="normalForm.standard" :disabled="disabled"></el-input>
                    </div>
                  </template>
                </el-form-item>
              </div>
              <div class="fl in-item">
                <el-button>
                  <svg-icon iconClass="eye"></svg-icon>
                  <span>查看判定标准</span>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div class="commonWidth operation" v-show="!disabled">
      <div class="inner">
        <el-button class="btns" type="primary" @click="saveForm">
          <svg-icon iconClass="save"></svg-icon>
          <span>保存</span>
        </el-button>
        <el-button class="btns" type="primary">
          <svg-icon iconClass="save"></svg-icon>
          <span>提交</span>
        </el-button>
        <el-button class="btns" @click="resetForm">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    <el-dialog
      title="新建大类"
      :visible.sync="kindsDialog"
      width="500px"
      :before-close="handleClose"
      :append-to-body="true"
      label-width="120px"
    >
      <div class="form">
        <el-form :model="kindsForm" ref="kindsFormRefs" :rules="kindsFormRules">
          <el-form-item label="大类名称" prop="oneKind" label-width="100px">
            <template>
              <div class="form-item">
                <el-input v-model="kindsForm.oneKind" placeholder="请输入大类名称"></el-input>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kindsDialog = false">取消</el-button>
        <el-button type="primary" @click="saveKinds">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/index.js";
export default {
  name: "",

  data() {
    var _this = this;
    var planValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划名称"));
      }
      let name = "aa";
      if (name == value) {
        callback(new Error("名称已经存在！"));
      } else {
        if (value.length > 25 || value.length < 3) {
          callback(new Error("名称长度在3到25之间！"));
        } else {
          callback();
        }
      }
    };
    var docNumValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入文件编号"));
      }
      let name = "aa";
      if (name == value) {
        callback(new Error("编号已经存在！"));
      } else {
        if (value.length > 25 || value.length < 3) {
          callback(new Error("文件编号在3到25之间！"));
        } else {
          callback();
        }
      }
    };

    var endDateValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择结束日期"));
      }
      if (value < _this.normalForm.startDate) {
        callback(new Error("结束日期小于开始日期！"));
      }
    };

    return {
      title: "新增计划",
      disabled: false,
      normalForm: {
        planType: "",
        planYear: "",
        planNum: "AAB",
        planName: "",
        docNum: "",
        startDate: "",
        endDate: "",
        manUnit: "AAB",
        orgUnit: "AAB",
        remarks: "",
        busniess: "",
        kinds: "",
        topUnit: "AAB",
        standard: ""
      },
      kindsForm: {
        oneKind: ""
      },
      normalFormRules: {
        planType: [
          { required: true, message: "请输入计划类型", trigger: "change" }
        ],
        planYear: [
          { required: true, message: "请输入计划年份", trigger: "blur" }
        ],
        planNum: [
          { required: true, message: "请输入计划编号", trigger: "blur" }
        ],
        planName: [
          {
            required: true,
            validator: planValidator,
            trigger: "blur"
          }
        ],
        docNum: [
          {
            required: true,
            validator: docNumValidator,
            trigger: "blur"
          }
        ],
        startDate: [
          { required: true, message: "请输入执行开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, validator: endDateValidator, trigger: "blur" }
        ],
        manUnit: [
          { required: true, message: "请输入管理单位", trigger: "change" }
        ],
        orgUnit: [
          { required: true, message: "请输入组织实施单位", trigger: "change" }
        ],
        busniess: [
          { required: true, message: "请输入业态", trigger: "change" }
        ],
        kinds: [{ required: true, message: "请输入大类", trigger: "change" }],
        topUnit: [
          { required: true, message: "请输入牵头单位", trigger: "change" }
        ],
        standard: [
          { required: true, message: "请选择判定标准", trigger: "blur" }
        ]
      },
      kindsFormRules: {
        oneKind: [
          { required: true, message: "请输入大类名称", trigger: "blur" }
        ]
      },
      tableData: [
        // {
        //   topUnit: "单位1",
        //   busniess: "busniess",
        //   kinds: "kinds",
        //   projectName: "projectName"
        // }
      ],
      tableTreeData: [],
      colObj: {},
      showTable: true,
      // 例行监测、风险评估、专项检查、其他
      planTypeList: [
        {
          label: "例行监测",
          value: "例行监测"
        },
        {
          label: "风险评估",
          value: "风险评估"
        },
        {
          label: "专项检查",
          value: "专项检查"
        },
        {
          label: "其他",
          value: "其他"
        }
      ],
      // 种植业 畜禽 水产
      busniessList: [
        {
          label: "种植业",
          value: "种植业"
        },
        {
          label: "畜禽产品",
          value: "畜禽产品"
        },
        {
          label: "水产品",
          value: "水产品"
        }
      ],
      kindsList: [],
      kindsDialog: false
    };
  },
  created() {
    let planType = this.$route.params.planType;
    setStorage("addForm", "");
    // console.log(planType);
    // console.log(this.$route);
    if (planType == "add") {
      // add
      this.title = "新增计划";
      let sessionForm = getStorage("addForm")[0];
      if (sessionForm) {
        this.normalForm = sessionForm.normalForm;
        this.tableData = sessionForm.tableData;
      }
      // console.log(sessionForm);
    }
    if (planType == "edit") {
      this.title = "编辑计划";
    }
    // 复制并新增
    if (planType == "copy") {
      this.title = "复制并新增";
    }
    this.formatTable();
  },
  methods: {
    handleSelect() {},
    onSubmit() {
      console.log("submit!");
    },
    validateForm(prop, flag, msg) {},
    addToList() {
      let checkList = false;
      // console.log(this.$refs.normalFormRefs.validateField());
      this.$refs.normalFormRefs.validateField(
        ["busniess", "kinds", "topUnit"],
        error => {
          // return;
        }
      );
      if (
        this.normalForm.busniess != "" &&
        this.normalForm.kinds != "" &&
        this.normalForm.topUnit != ""
      ) {
        checkList = true;
      } else {
        checkList = false;
      }
      console.log(checkList);
      if (checkList) {
        let name = "";
        let flag = false;
        let index = this.tableData.length - 1;
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].topUnit == this.normalForm.topUnit) {
            index = i;
          }
          if (
            this.tableData[i].topUnit == this.normalForm.topUnit &&
            this.tableData[i].busniess == this.normalForm.busniess &&
            this.tableData[i].kinds == this.normalForm.kinds
          ) {
            flag = true;
          }
        }
        if (!flag) {
          this.$refs.normalFormRefs.validateField(["planYear"], error => {
            // return;
          });
          if (this.normalForm.planYear != "") {
            this.tableData.splice(index, 0, {
              topUnit: this.normalForm.topUnit,
              busniess: this.normalForm.busniess,
              kinds: this.normalForm.kinds,
              projectName:
                this.normalForm.planYear +
                "国家" +
                this.normalForm.busniess +
                "(" +
                this.normalForm.kinds +
                ")" +
                "质量安全（风险监测）项目"
            });
            this.formatTable();
          } else {
            this.$message.error("请选择计划年份！");
          }
        } else {
          this.$message.error("项目已经存在");
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.colObj[rowIndex]) {
          return {
            rowspan: this.colObj[rowIndex],
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    deleteProject(index, row) {
      this.tableData.splice(index, 1);
      this.formatTable();
    },
    toggleTable() {
      this.showTable = !this.showTable;
      if (this.showTable) {
        this.$refs.tableRefs.style.height = "auto";
      } else {
        this.$refs.tableRefs.style.height = 0;
      }
    },
    planView() {
      // this.$refs.normalFormRefs.validate(validate => {
      //   console.log("s");
      // });
    },
    formatTable() {
      this.tableTreeData = [];
      this.tableData.forEach((item, indexc) => {
        if (this.tableTreeData.length > 0) {
          let flag = false;
          let index = 0;
          for (let i = 0; i < this.tableTreeData.length; i++) {
            if (this.tableData[indexc].topUnit == this.tableTreeData[i].name) {
              flag = true;
              index = i;
              break;
            }
          }
          if (flag) {
            this.tableTreeData[index].children.push({
              busniess: item.busniess,
              kinds: item.kinds,
              projectName: item.projectName
            });
          } else {
            this.tableTreeData.push({
              name: item.topUnit,
              children: [
                {
                  busniess: item.busniess,
                  kinds: item.kinds,
                  projectName: item.projectName
                }
              ]
            });
          }
        } else {
          this.tableTreeData.push({
            name: item.topUnit,
            children: [
              {
                busniess: item.busniess,
                kinds: item.kinds,
                projectName: item.projectName
              }
            ]
          });
        }
      });
      let numa = 0;
      this.colObj = {};
      this.tableTreeData.forEach((item, index) => {
        let num = 0;
        item.children.forEach((itema, indexa) => {
          num++;
        });
        this.colObj[numa] = num;
        numa = numa + num;
      });
    },
    saveForm() {
      this.$refs.normalFormRefs.validate(a => {
        if (a) {
          let storage = {
            normalForm: this.normalForm,
            tableData: this.tableData
          };
          setStorage("addForm", storage);
        } else {
          // this.$message.error("请填写完整信息！");
          return false;
        }
      });
    },
    remoteMethod(query, cb) {
      var results = [
        {
          value: "上海市长宁区淞虹路661号上海市长宁区淞虹路661号"
        }
      ];
      cb(results);
    },
    remoteDocNum(query, cb) {
      var results = [
        {
          value: "上海市长宁区淞虹路661号上海市长宁区淞虹路661号"
        }
      ];
      cb(results);
    },
    addKinds() {
      this.kindsDialog = true;
    },
    handleClose() {
      this.kindsDialog = false;
    },
    saveKinds() {
      this.$refs.kindsFormRefs.validate(validate => {
        if (validate) {
          this.kindsList.push({
            label: this.kindsForm.oneKind,
            value: this.kindsForm.oneKind
          });
          this.kindsDialog = false;
        }
      });
    },
    resetForm() {
      setStorage("addForm", "");
      this.$refs.normalFormRefs.resetFields();
    },
    viewPlan() {
      // this.$router.push("/ViewPlan");
      setStorage("planType", "view");
      setStorage("viewForm", {
        normalForm: this.normalForm,
        tableData: this.tableData
      });
      let routeUrl = this.$router.resolve({
        path: "/ViewPlan",
        params: { planType: "view" }
      });
      window.open(routeUrl.href, "_blank");
    },
    changeBusniess() {
      this.kindsList = [
        {
          label: "add",
          value: "add"
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/style/PlanDetail.scss";
</style>
