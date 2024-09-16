<template>
  <div id="ApprovalDetail" class="PlanDetail">
    <div class="commonWidth top">
      <div class="fl top-title approval-top">
        <span>《{{normalForm.planName}}》</span>
      </div>
      <div class="fr approval-top">
        <div class="fl approval-status">
          <span class="wait">待审批</span>
          <!-- <span class="pass">审批通过</span> -->
        </div>
        <div class="fr" v-show="approval">
          <el-button type="primary" @click="approvalPlan">
            <svg-icon iconClass="eye" class="title-icon"></svg-icon>
            <span>审批通过</span>
          </el-button>
          <el-button @click="approvalPlan">
            <svg-icon iconClass="eye" class="title-icon"></svg-icon>
            <span>审批拒绝</span>
          </el-button>
        </div>
      </div>
    </div>
    <el-form ref="normalFormRefs" :model="normalForm" label-width="120px">
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
                    <div class="icons">
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
                        placeholder="选择日期"
                        v-model="normalForm.planYear"
                        style="width: 100%;"
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons">
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
                    <!-- <el-autocomplete
                      v-model="normalForm.planName"
                      :fetch-suggestions="remoteMethod"
                      placeholder="请输入内容"
                      @select="handleSelect"
                      style="width:100%"
                    ></el-autocomplete>-->
                    <el-input v-model="normalForm.planName" style="width:100%" :disabled="disabled"></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="文件编号" prop="docNum">
                <template>
                  <div class="form-item">
                    <!-- <el-autocomplete
                      v-model="normalForm.docNum"
                      :fetch-suggestions="remoteDocNum"
                      placeholder="请输入内容"
                      @select="handleSelect"
                      style="width:100%"
                    ></el-autocomplete>-->
                    <el-input v-model="normalForm.docNum" style="width:100%"></el-input>
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
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons">
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
                        :disabled="disabled"
                      ></el-date-picker>
                    </div>
                    <div class="icons">
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
                        :disabled="disabled"
                      >
                        <el-option label="类型1" value="shanghai"></el-option>
                        <el-option label="类型2" value="beijing"></el-option>
                      </el-select>
                    </div>
                    <div class="icons">
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
                        :disabled="disabled"
                      >
                        <el-option label="类型1" value="shanghai"></el-option>
                        <el-option label="类型2" value="beijing"></el-option>
                      </el-select>
                    </div>
                    <div class="icons">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="备注信息" label-width="120px" prop="desc">
                <template>
                  <div class="form-item textarea">
                    <el-input
                      type="textarea"
                      v-model="normalForm.desc"
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
                          placeholder="管理单位"
                          style="width: 100%;"
                          :disabled="disabled"
                        >
                          <el-option label="类型1" value="shanghai"></el-option>
                          <el-option label="类型2" value="beijing"></el-option>
                        </el-select>
                      </div>
                      <div class="icons">
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
                          placeholder="组织实施单位"
                          style="width: 100%;"
                          :disabled="disabled"
                        >
                          <el-option label="类型1" value="shanghai"></el-option>
                          <el-option label="类型2" value="beijing"></el-option>
                        </el-select>
                      </div>
                      <div class="icons">
                        <svg-icon iconClass="down"></svg-icon>
                      </div>
                    </div>
                  </template>
                </el-form-item>
              </div>
            </div>
            <div class="fl item">
              <div class="common-title">牵头单位</div>
              <div class="form">
                <el-form-item label="牵头单位：" prop="unit">
                  <template>
                    <div class="form-item">
                      <div class="left-item">
                        <el-select
                          v-model="normalForm.unit"
                          placeholder="牵头单位"
                          style="width: 100%;"
                          :disabled="disabled"
                        >
                          <el-option label="类型1" value="shanghai"></el-option>
                          <el-option label="类型2" value="beijing"></el-option>
                        </el-select>
                      </div>
                      <div class="icons">
                        <svg-icon iconClass="down"></svg-icon>
                      </div>
                    </div>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- <div class="add-list" v-show="!disabled">
            <el-button class="add-btn" @click="addToList">
              <svg-icon iconClass="add"></svg-icon>
              <span>添加至列表</span>
            </el-button>
          </div>-->
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
                <el-table-column label="牵头单位" prop="unit"></el-table-column>
                <el-table-column label="业态" prop="busniess"></el-table-column>
                <el-table-column label="大类" prop="kinds"></el-table-column>
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
    <div class="commonWidth approval-step">
      <div class="icon-title">
        <svg-icon iconClass="email"></svg-icon>
        <span>操作人员</span>
      </div>
      <div class="row-item m20">
        <div class="row-item-inner">
          <span>计划编制：</span>
          <span>XXX</span>
        </div>
        <div class="row-item-inner">
          <span>计划审批：</span>
          <span>XXX</span>
        </div>
      </div>
      <div class="icon-title m20">
        <svg-icon iconClass="email"></svg-icon>
        <span>审核记录(共X条)</span>
      </div>
      <div class="approval-steps-box">
        <div class="approval-steps">
          <div class="steps-title">
            <label></label>
            <span>07-10</span>
          </div>

          <div class="steps-content">
            <div class="content-text">
              <div class="content-text-top">
                <div class="fl">
                  <svg-icon iconClass="user" class="user-icon"></svg-icon>
                  <span class="user-name">name</span>
                </div>
                <div class="fr content-time">
                  <svg-icon iconClass="time"></svg-icon>
                  <span>2019-01-01</span>
                </div>
              </div>
              <div class="content-texts">请输入计划名称</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/index.js";
export default {
  name: "",

  data() {
    var _this = this;
    // var planValidator = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("请输入计划名称"));
    //   }
    //   let name = "aa";
    //   if (name == value) {
    //     callback(new Error("名称已经存在！"));
    //   } else {
    //     callback();
    //   }
    // };
    // var planNumValidator = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("请输入计划编号"));
    //   }
    //   let name = "aa";
    //   if (name == value) {
    //     callback(new Error("编号已经存在！"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      title: "新增计划",
      disabled: true,
      approval: true,
      normalForm: {
        planType: "",
        planYear: "",
        planNum: "AAB",
        planName: "AAB",
        docNum: "",
        startDate: "",
        endDate: "",
        manUnit: "",
        orgUnit: "",
        desc: "",
        busniess: "",
        kinds: "",
        unit: "",
        standard: ""
      },
      // normalFormRules: {
      //   planType: [
      //     { required: true, message: "请输入计划类型", trigger: "change" }
      //   ],
      //   planYear: [
      //     { required: true, message: "请输入计划年份", trigger: "blur" }
      //   ],
      //   planNum: [
      //     { required: true, message: "请输入计划编号", trigger: "blur" }
      //   ],
      //   planName: [
      //     {
      //       required: true,
      //       validator: planValidator,
      //       trigger: "blur"
      //     }
      //   ],
      //   docNum: [
      //     {
      //       required: true,
      //       validator: planNumValidator,
      //       trigger: "blur"
      //     }
      //   ],
      //   startDate: [
      //     { required: true, message: "请输入执行开始日期", trigger: "blur" }
      //   ],
      //   endDate: [
      //     { required: true, message: "请输入执行结束日期", trigger: "blur" }
      //   ],
      //   manUnit: [
      //     { required: true, message: "请输入管理单位", trigger: "change" }
      //   ],
      //   orgUnit: [
      //     { required: true, message: "请输入组织实施单位", trigger: "change" }
      //   ],
      //   busniess: [
      //     { required: true, message: "请输入业态", trigger: "change" }
      //   ],
      //   kinds: [{ required: true, message: "请输入大类", trigger: "change" }],
      //   unit: [
      //     { required: true, message: "请输入牵头单位", trigger: "change" }
      //   ],
      //   standard: [
      //     { required: true, message: "请选择判定标准", trigger: "blur" }
      //   ]
      // },
      tableData: [
        // {
        //   unit: "单位1",
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
      ]
    };
  },
  created() {
    console.log(this.$route);
    if (this.$route.params.planType == "approval") {
      // approval
      this.title = "approval";
      this.approval = true;
    }
    if (this.$route.params.planType == "edit") {
      this.title = "编辑计划";
    }
    if (this.$route.params.planType == "view") {
      this.title = "预览";
      this.disabled = true;
    }
    this.formatTable();
  },
  methods: {
    onSubmit() {
      console.log("submit!");
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
    formatTable() {
      this.tableTreeData = [];
      this.tableData.forEach((item, indexc) => {
        if (this.tableTreeData.length > 0) {
          let flag = false;
          let index = 0;
          for (let i = 0; i < this.tableTreeData.length; i++) {
            if (this.tableData[indexc].unit == this.tableTreeData[i].name) {
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
              name: item.unit,
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
            name: item.unit,
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
    approvalPlan() {}
  }
};
</script>

<style lang="scss" scoped>
@import "~@/style/PlanDetail.scss";
</style>
