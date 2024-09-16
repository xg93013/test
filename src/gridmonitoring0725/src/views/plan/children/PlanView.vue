<template>
  <div id="PlanDetail" class="PlanDetail">
    <div class="commonWidth top">
      <div class="fl top-title">
        <svg-icon iconClass="list"></svg-icon>
        <span>{{title}} -《{{normalForm.planNum}}》</span>
      </div>
      <div class="fr">
        <span class="tips">*为必填项</span>
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
                    <el-input v-model="normalForm.planName" :disabled="disabled"></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="文件编号" prop="docNum">
                <template>
                  <div class="form-item">
                    <el-input v-model="normalForm.docNum" :disabled="disabled"></el-input>
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
                <el-table-column label="牵头单位" prop="topUnit" width="250"></el-table-column>
                <el-table-column label="业态" prop="busniess" width="200"></el-table-column>
                <el-table-column label="大类" prop="kinds" width="160"></el-table-column>
                <el-table-column label="项目名称" prop="projectName"></el-table-column>
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
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/index.js";
export default {
  name: "",

  data() {
    return {
      title: "预览计划",
      disabled: true,
      normalForm: {
        planType: "",
        planYear: "",
        planNum: "",
        planName: "",
        docNum: "",
        startDate: "",
        endDate: "",
        manUnit: "",
        orgUnit: "",
        remarks: "",
        busniess: "",
        kinds: "",
        topUnit: "",
        standard: ""
      },
      kindsForm: {
        oneKind: ""
      },
      tableData: [],
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
      kindsList: []
    };
  },
  created() {
    let planNo = this.$route.params.planNo;
    //
    console.log(this.$route);
    let viewForm = getStorage("viewForm")[0];
    if (viewForm) {
      this.normalForm = viewForm.normalForm;
      this.tableData = viewForm.tableData;
      this.kindsList = viewForm.kindsList;
    }
    this.formatTable();
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/style/PlanDetail.scss";
</style>
