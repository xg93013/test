<template>
  <div id="analyze">
    <div class="out-container">
      <div class="out-box filter-data">
        <div class="left">筛选数据</div>
        <div class="mid">
          <div
            class="tabs-item"
            :class="{'timerange':item.prop == 'date'}"
            v-for="(item, index) in moreMode"
            :key="'onemode'+index"
          >
            <more-checkbox
              :title="item.showSelectTips ? ('点击查看'+item.name+'筛选数据') : ('选择'+item.name+'(复选)')"
              :allData="item.originData"
              :defaultData="item.defaultData"
              :propsName="item.prop"
              :ref="item.prop+'TreeRefs'"
              @backLinks="selectDown"
              v-if="item.type == 'checkbox'"
            ></more-checkbox>
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              v-else-if="item.type == 'date'"
              @change="changeTime"
            ></el-date-picker>
            <down-tree
              @downTree="selectDown"
              :isLeaf="item.isLeaf"
              :backLeaf="item.backLeaf"
              :splitStr="item.splitStr"
              :showFullName="item.showFullName"
              :datas="item.originData"
              :defaultData="item.defaultData"
              :modeType="item.prop"
              icon="down"
              :ref="item.prop+'TreeRefs'"
              :placeholder="item.showSelectTips ? ('点击查看'+item.name+'筛选数据') : ('选择'+item.name+'(复选)')"
              v-else
            ></down-tree>
          </div>
          <!-- <div class="tabs-item">
           
          </div>-->
        </div>
        <div class="right">
          <el-button @click="reset" class="btns">重置</el-button>
        </div>
      </div>
      <div class="out-box">
        <div class="left">设定统计维度及指标</div>
        <div class="mid">
          <div class="in-tab">
            <div class="in-item in-title">
              <span>*</span>设定维度：
            </div>
            <div
              class="in-item"
              v-for="(item, index) in moreMode"
              :key="'modes'+index"
              @click="changeMode(index)"
            >
              <span class="mode-item" :class="{'active':moreMode[index].currentStandard>-1}">
                <svg-icon :iconClass="item.icon" class="icons"></svg-icon>
                {{item.name}}
              </span>
            </div>
            <!-- <div class="in-item">食品品类</div>
          <div class="in-item">监测区域</div>
          <div class="in-item">检测项目</div>
          <div class="in-item">抽检环节</div>
          <div class="in-item">任务来源</div>
            <div class="in-item">任务类型</div>-->
          </div>
          <div class="in-tab">
            <div class="in-item in-title">
              <span>*</span>维度层级：
            </div>
            <el-radio-group
              v-model="moreMode[currentMode].currentStandard"
              @change="changeCurrentStandard"
            >
              <el-radio
                :label="index"
                class="in-item"
                v-for="(item, index) in moreMode[currentMode].standards"
                :key="'initem'+index"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </div>
          <div class="in-tab">
            <div class="in-item in-title">统计指标：</div>
            <!-- <el-checkbox-group
              v-model="moreMode[currentMode].selectCheck"
              @change="changeCheckMore"
            >
              <el-checkbox
                :label="item.label"
                :checked="item.checked"
                v-for="(item, index) in moreMode[currentMode].onecheckData"
                :key="'onecheckbox'+index"
              >{{item.label}}</el-checkbox>
            </el-checkbox-group>-->
            <el-checkbox
              v-model="item.checked"
              v-for="(item, index) in moreMode[currentMode].onecheckData"
              :key="'onecheckbox'+index"
              @change="changeCheckMore"
              style="margin-right:20px;"
            >{{item.label}}</el-checkbox>
          </div>
          <div class="in-tab">
            <div class="in-item in-title">
              <el-checkbox v-model="showSummary" @change="checkMore" style="margin-left:20px;">显示总计</el-checkbox>
            </div>
            <!-- <div class="in-item sorts">
              排序字段：
              <el-select v-model="moreMode[currentMode].sortStandard">
                <el-option
                  v-for="(item, index) in moreMode[currentMode].indicators"
                  :label="item.label"
                  :value="item.label"
                  :key="'sorts'+index"
                ></el-option>
              </el-select>
            </div>-->
          </div>
        </div>
        <div class="right">
          <el-button @click="resetMode" class="btns">重置</el-button>
          <el-button @click="modeShow" class="btns">模板管理</el-button>
          <el-button @click="saveMode" class="btns">保存模板</el-button>
        </div>
      </div>
      <div class="out-box">
        <div class="table-result">
          <div class="left">预览报表结果</div>
          <!-- <div class="mid"></div> -->
          <div class="right">
            <el-button @click="search">
              <svg-icon iconClass="search"></svg-icon>查询数据
            </el-button>
            <el-button @click="exportExcel">
              <svg-icon iconClass="export"></svg-icon>导出
            </el-button>
          </div>
        </div>

        <div class="titles">
          <div class="title-box">
            <span>请输入标题：</span>
            <el-input v-model="tableTitle" class="table-title"></el-input>
          </div>
        </div>
        <div class="table-box">
          <!-- 操作提示 -->
          <div class="step-tips" v-show="showStepTips">
            <div class="lefts">
              <svg-icon iconClass="tips"></svg-icon>
            </div>
            <div class="right">
              <p class="bigs">操作提示</p>
              <p>第一步，请先通过筛选条件，筛选要进行统计分析的数据</p>
              <p>第二步，请设定统计维度、维度层级、统计指标；也可以调用已经定义好的模板</p>
              <p>第三步，点击“查询数据”按钮，系统将根据您设定的报表统计维度，生成相应的数据</p>
            </div>
          </div>

          <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            style="width:100%;"
            :highlight-current-row="false"
            :show-summary="showSummary"
            :summary-method="getSummaries"
            border
            v-show="oneModeColumn.length>0"
            empty-text="--"
          >
            <el-table-column
              :label="item.name"
              min-width="200"
              v-for="(item,index) in oneModeColumn"
              :key="'defaultmode'+index"
              v-if="item.prop == 'date'&&item.currentStandard>0"
            >
              <el-table-column
                :prop="itema.prop"
                :label="itema.name"
                min-width="200"
                v-for="(itema,indexa) in item.standards"
                v-if="[0, item.currentStandard].includes(indexa)"
                :key="'standardmode'+indexa"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              :label="['date', 'food', 'qy'].includes(item.prop) ? item.name+'('+item.standards[item.currentStandard].name+')' : item.standards[item.currentStandard].name"
              :prop="item.standards[item.currentStandard].prop"
              min-width="200"
              v-for="(item,index) in oneModeColumn"
              :key="'defaultmodess'+index"
              v-if="item.prop != 'date'||(item.prop=='date'&&item.currentStandard==0)"
            ></el-table-column>
            <el-table-column
              v-for="(item,index) in reverseColumn"
              :label="['date', 'food', 'qy'].includes(item.prop) ? item.name+'('+item.standards[item.currentStandard].name+')' : item.standards[item.currentStandard].name"
              align="center"
              min-width="200"
              v-if="item.indicators.length>0"
              :key="'defaultmodea'+index"
            >
              <el-table-column
                :prop="item.standards[item.currentStandard].prop + itema.prop"
                :label="itema.label"
                align="center"
                min-width="180"
                v-for="(itema,indexa) in item.indicators"
                :key="'defaultmodeb'+indexa"
              ></el-table-column>
            </el-table-column>
          </el-table>
          <div class="max-tips" v-show="reverseColumn.length>0&&showMaxtips">
            <div class="max-inline">
              <svg-icon iconClass="tips"></svg-icon>
              筛选数据大于{{maxLen}}行，请直接导出查看！
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 模板管理 -->
    <el-dialog
      title="模板列表"
      :visible.sync="dialogVisible"
      width="800px"
      height="500px"
      custom-class="modeDialog"
    >
      <div class="mode-manage">
        <el-table :data="modeData" border max-height="530px">
          <el-table-column label="序号" prop="nums" width="80"></el-table-column>
          <el-table-column label="统计报表模板名称" prop="name" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="模板建立时间" prop="createTime" width="140" align="center"></el-table-column>
          <el-table-column label="操作" prop="operation" width="200" align="center">
            <template slot-scope="scope">
              <div class="mode-operation">
                <!-- <span @click="copyMode(scope.row)">
                  <svg-icon iconClass="edit" class="links-icon" @click.native="visible=false"></svg-icon>复制并新增
                </span>
                <span @click="viewMode(scope.row)">
                  <svg-icon iconClass="view" class="links-icon" @click.native="visible=false"></svg-icon>预览
                </span>-->
                <span @click="useMode(scope.row)">
                  <svg-icon iconClass="edit" class="links-icon" @click.native="visible=false"></svg-icon>使用该模板
                </span>
                <span @click="deleteMode(scope.row)">
                  <svg-icon iconClass="delete" class="links-icon" @click.native="visible=false"></svg-icon>删除
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <div class="inline">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="modePage.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size.sync="modePage.pageSize"
              layout="sizes, prev, pager, next"
              :total="modePage.totals"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <export-excel ref="exportRefs"></export-excel>
  </div>
</template>
<script>
import DownTree from "@/components/base/DownTree/index1";
import MoreCheckbox from "@/components/base/MoreCheckbox/index";
import ExportExcel from "@/components/base/ExportExcel/index";
import {
  allTreeData,
  allMode,
  allSelect,
  searchData,
  exportBase,
  reportData,
  exportUrl,
  addTableMode,
  getAllTableMode,
  getOneTableMode,
  deleteOneTableMode,
  analyzeExportUrl
} from "../../assets/api/api";
// import base from "../../assets/api/api";
export default {
  data() {
    return {
      level: 1,
      timeRange: "",
      tableTitle: "",
      showSummary: false,
      // searchList: [],
      allMode: [
        {
          name: "1维",
          value: 1
        },
        {
          name: "2维",
          value: 2
        },
        {
          name: "3维",
          value: 3
        }
      ],
      currentMode: 0,
      onecheckData: [
        {
          label: "数量1",
          prop: "total",
          checked: false
        },
        {
          label: "数量2",
          prop: "unTotal",
          checked: true
        },
        {
          label: "数量3",
          prop: "unRatio",
          checked: true
        },
        {
          label: "数量4",
          prop: "qtotal",
          checked: true
        },
        {
          label: "数量5",
          prop: "qratio",
          checked: true
        }
      ],
      moreMode: [
        {
          name: "抽样时间",
          prop: "date",
          isLeaf: false,
          backLeaf: false,
          checked: true,
          showFullName: true,
          originData: [],
          icon: "date",
          defaultData: [],
          currentStandard: -1,
          sortStandard: "",
          standards: [],
          onecheckData: [],
          indicators: [],
          showSelectTips: false,
          filterData: []
        }
      ],
      resultTree: {
        id: "0",
        name: "start"
      },
      selectTree: {
        id: 0,
        name: "start"
      },
      obj: {},
      modeColspan: {},
      tableData: [],
      originData: [
        {
          dimValue: "2017",
          dimName: "date",
          total: 20000,
          unTotal: 10,
          dataList: [
            {
              dimValue: "上半年",
              dimName: "year",
              total: 100,
              unTotal: 15,
              dataList: [
                {
                  dimValue: "食品大类",
                  dimName: "item",
                  total: 300,
                  unTotal: 5,
                  dataList: null
                },
                {
                  dimValue: "食品大类2",
                  dimName: "item",
                  total: 3000,
                  unTotal: 20,
                  dataList: null
                }
              ]
            }
          ]
        },
        {
          dimValue: "2018",
          dimName: "year",
          total: 30000,
          unTotal: 66,
          dataList: [
            {
              dimValue: "上半年",
              dimName: "half",
              total: 500,
              unTotal: 3,
              dataList: [
                {
                  dimValue: "食品大类6",
                  dimName: "categories",
                  total: 700,
                  unTotal: 14,
                  dataList: null
                },
                {
                  dimValue: "食品大类3",
                  dimName: "categories",
                  total: 3000,
                  unTotal: 20,
                  dataList: null
                },
                {
                  dimValue: "食品大类4",
                  dimName: "categories",
                  total: 3000,
                  unTotal: 20,
                  dataList: null
                }
              ]
            }
          ]
        }
      ],
      leafNodesLen: 0,
      oneId: 1,
      maxLen: 1000,
      dialogVisible: false,
      modeData: [],
      modePage: {
        pageSize: 10,
        currentPage: 1,
        totals: 0
      },
      showMaxtips: false,
      showStepTips: true,
      icons: {
        date: "time",
        food: "category",
        qy: "position",
        item: "bug",
        hj: "links",
        rwly: "task",
        rwlx: "types"
      },
      dataResultEmpty: false,
      sumData: [],
      exportTotal: 0
    };
  },
  components: {
    DownTree,
    MoreCheckbox,
    ExportExcel
  },
  watch: {},
  computed: {
    oneModeColumn() {
      return this.moreMode.filter(function(item) {
        let flag = false;
        for (let i = 0; i < item.standards.length; i++) {
          if (item.standards[i].list.length > 0) {
            flag = true;
            break;
          } else {
            flag = false;
          }
        }
        return item.checked && flag && item.currentStandard > -1;
      });
    },
    reverseColumn() {
      let arr = [
        ...this.moreMode.filter(function(item) {
          let flag = false;
          for (let i = 0; i < item.standards.length; i++) {
            if (item.standards[i].list.length > 0) {
              flag = true;
              break;
            } else {
              flag = false;
            }
          }
          return item.checked && flag && item.currentStandard > -1;
        })
      ];
      return arr.reverse();
    },
    saveModeColumn() {
      return this.moreMode.filter(function(item) {
        return item.currentStandard > -1;
      });
    }
  },
  created() {
    this.getDefaultData();
    // console.log(exportBase);
  },
  methods: {
    getAllTreeData(moreMode) {
      allTreeData().then(res => {
        if (res.data.code == 0) {
          let trees = res.data.data;
          moreMode[0].filterKey = "jy_bgrq";
          moreMode[1].originData = [
            {
              id: "0",
              label: "全部",
              children: trees.yp_fl_xl_bh
            }
          ];
          moreMode[1].filterKey = "yp_fl_xl_bh";
          moreMode[2].originData = [
            {
              id: "0",
              label: "全部",
              children: trees.yp_scz_sq
            }
          ];
          moreMode[2].filterKey = "yp_scz_sq";
          moreMode[3].originData = [
            {
              id: "0",
              label: "全部",
              children: trees.jy_xm_bh
            }
          ];
          moreMode[3].filterKey = "jy_xm_bh";
          moreMode[4].originData = trees.yp_hj_new;
          moreMode[4].filterKey = "yp_hj_new";
          moreMode[5].originData = trees.cyd_rwly_new;
          moreMode[5].filterKey = "cyd_rwly_new";
          moreMode[6].originData = [
            {
              id: "0",
              label: "全部",
              children: trees.cyd_rwlx_new
            }
          ];
          moreMode[6].filterKey = "cyd_rwlx_new";
          this.moreMode = moreMode;
        }
      });
    },
    getDefaultData() {
      let moreMode = [];
      allMode().then(res => {
        if (res.data.code == 0) {
          let allDatas = res.data.data.groupLevel;
          for (let i = 0; i < allDatas.length; i++) {
            let standards = [];
            let type =
              allDatas[i].id == "hj" || allDatas[i].id == "rwly"
                ? "checkbox"
                : allDatas[i].id == "date"
                ? "date"
                : "tree";
            for (let j = 0; j < allDatas[i].children.length; j++) {
              standards.push({
                id: allDatas[i].children[j].id,
                name: allDatas[i].children[j].label,
                level: j + 1,
                prop: allDatas[i].children[j].id,
                list: []
              });
            }
            moreMode.push({
              id: allDatas[i].id,
              name: allDatas[i].label,
              prop: allDatas[i].id,
              isLeaf: false,
              backLeaf: false,
              checked: true,
              showFullName: true,
              type: type,
              originData: [],
              icon: this.icons[allDatas[i].id],
              defaultData: [],
              splitStr: "/",
              currentStandard: -1,
              sortStandard: "",
              standards: standards,
              onecheckData: [],
              indicators: [],
              filterKey: allDatas[i].id,
              filterData: []
            });
          }
          this.getAllChecks(moreMode);
        }
      });
    },
    getAllChecks(moreMode) {
      allSelect().then(res => {
        if (res.data.code == 0) {
          let selects = res.data.data.select;
          for (let i = 0; i < selects.length; i++) {
            for (let j = 0; j < moreMode.length; j++) {
              if (moreMode[j].id == selects[i].id) {
                let onecheckData = [];
                for (let k = 0; k < selects[i].children.length; k++) {
                  onecheckData.push({
                    id: selects[i].children[k].id,
                    label: selects[i].children[k].label,
                    prop: selects[i].children[k].id,
                    checked: false
                  });
                }
                moreMode[j].onecheckData = onecheckData;
              }
            }
          }
          this.getAllTreeData(moreMode);
        }
      });
    },
    handleSizeChange(size) {
      this.modePage.pageSize = size;
      this.modePage.currentPage = 1;
      this.getAllMode();
    },
    handleCurrentChange(page) {
      this.modePage.currentPage = page;
      setTimeout(() => {
        this.getAllMode();
      });
    },
    handleClose() {},
    useMode(row) {
      this.resetMode();
      getOneTableMode(row.nums).then(res => {
        if (res.data.code == 0) {
          let newMode = JSON.parse(res.data.data.content);
          this.tableTitle = newMode.tableTitle;
          this.showSummary = newMode.showTotal;
          for (let i = 0; i < newMode.dimObj.length; i++) {
            for (let j = 0; j < this.moreMode.length; j++) {
              if (this.moreMode[j].id == newMode.dimObj[i].dimensionNameId) {
                for (let k = 0; k < this.moreMode[j].standards.length; k++) {
                  if (
                    this.moreMode[j].standards[k].id ==
                    newMode.dimObj[i].dimensionLevelId
                  ) {
                    this.moreMode[j].currentStandard = k;
                    break;
                  }
                }
                for (
                  let m = 0;
                  m < newMode.dimObj[i].indicatorsIds.length;
                  m++
                ) {
                  for (
                    let n = 0;
                    n < this.moreMode[j].onecheckData.length;
                    n++
                  ) {
                    if (
                      this.moreMode[j].onecheckData[n].id ==
                      newMode.dimObj[i].indicatorsIds[m]
                    ) {
                      this.moreMode[j].onecheckData[n].checked = true;
                      this.moreMode[j].indicators.push(
                        this.moreMode[j].onecheckData[n]
                      );
                    }
                  }
                }
              }
            }
          }
          this.dialogVisible = false;
        }
      });
      // let allMode = {
      //   list: [
      //     {
      //       dimensionNameId: "date",
      //       dimensionLevelId: "year",
      //       indicatorsIds: ["total", "unTotal", "unRatio", "qtotal", "qRatio"]
      //     },
      //     {
      //       dimensionNameId: "food",
      //       dimensionLevelId: "yp_fl_dl",
      //       indicatorsIds: ["total"]
      //     },
      //     {
      //       dimensionNameId: "qy",
      //       dimensionLevelId: "qy_qx",
      //       indicatorsIds: ["total"]
      //     },
      //     {
      //       dimensionNameId: "item",
      //       dimensionLevelId: "jy_fl",
      //       indicatorsIds: ["total", "unTotal"]
      //     },
      //     {
      //       dimensionNameId: "hj",
      //       dimensionLevelId: "yp_hj_new",
      //       indicatorsIds: ["total"]
      //     },
      //     {
      //       dimensionNameId: "rwly",
      //       dimensionLevelId: "cyd_rwly_new",
      //       indicatorsIds: ["total"]
      //     },
      //     {
      //       dimensionNameId: "rwlx",
      //       dimensionLevelId: "cyd_rwlx_new",
      //       indicatorsIds: ["total", "unRatio"]
      //     }
      //   ],
      //   tableTitle: "abc",
      //   showTotal: false
      // };
      // let newMode = {
      //   list: [
      //     {
      //       dimensionNameId: "date",
      //       dimensionLevelId: "year",
      //       indicatorsIds: ["total", "unTotal"]
      //     },
      //     {
      //       dimensionNameId: "food",
      //       dimensionLevelId: "yp_fl_dl_bh",
      //       indicatorsIds: ["total"]
      //     },
      //     {
      //       dimensionNameId: "qy",
      //       dimensionLevelId: "qy_sq",
      //       indicatorsIds: ["total", "unTotal"]
      //     }
      //   ],
      //   tableTitle: "asd",
      //   showTotal: false
      // };
    },
    deleteMode(row) {
      deleteOneTableMode(row.nums).then(res => {
        if (res.data.code == 0) {
          this.$message.success("删除成功！");
          this.getAllMode();
        } else {
          this.$message.error("删除失败！");
        }
      });
    },
    changeCheckMore() {
      this.moreMode[this.currentMode].indicators = [];
      for (
        let j = 0;
        j < this.moreMode[this.currentMode].onecheckData.length;
        j++
      ) {
        if (this.moreMode[this.currentMode].onecheckData[j].checked) {
          this.moreMode[this.currentMode].indicators.push({
            ...this.moreMode[this.currentMode].onecheckData[j]
          });
        }
      }
      this.checkMore();
    },
    changeTime() {
      this.oneId = 1;
      let allDate = this.getYearAndMonthAndDay(
        this.timeRange[0],
        this.timeRange[1]
      );
      // year
      this.moreMode[0].standards[0].list = [];
      for (let i = 0; i < allDate.length; i++) {
        let temp = allDate[i].split("-");
        let id = this.getId();
        let flag = false;
        let nextFlag = false;
        let halfYear = "";
        let season = "";
        let month = parseInt(temp[1]);
        let keyArr = ["half", "quarter", "month"];
        if (month <= 3) {
          halfYear = "上半年";
          season = "第一季度";
        } else if (month > 3 && month <= 6) {
          halfYear = "上半年";
          season = "第二季度";
        } else if (month > 6 && month <= 9) {
          halfYear = "下半年";
          season = "第三季度";
        } else {
          halfYear = "下半年";
          season = "第四季度";
        }

        for (let j = 0; j < this.moreMode[0].standards[0].list.length; j++) {
          if (temp[0] == this.moreMode[0].standards[0].list[j].dimValue) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          this.moreMode[0].standards[0].list.push({
            id: id,
            dimName: "year",
            dimValue: temp[0]
          });
        }
        let parentId = null;
        for (let m = 0; m < this.moreMode[0].standards[0].list.length; m++) {
          if (temp[0] == this.moreMode[0].standards[0].list[m].dimValue) {
            parentId = this.moreMode[0].standards[0].list[m].id;
            break;
          }
        }
        for (let h = 0; h < keyArr.length; h++) {
          nextFlag = false;
          let value = "";
          if (keyArr[h] == "half") {
            value = halfYear;
          } else if (keyArr[h] == "quarter") {
            value = season;
          } else {
            value = month + "月";
          }
          for (
            let k = 0;
            k < this.moreMode[0].standards[h + 1].list.length;
            k++
          ) {
            if (
              parentId != null &&
              parentId == this.moreMode[0].standards[h + 1].list[k].parentId &&
              value == this.moreMode[0].standards[h + 1].list[k].dimValue
            ) {
              nextFlag = true;
              break;
            }
          }
          if (!nextFlag) {
            this.moreMode[0].standards[h + 1].list.push({
              id: this.getId(),
              dimName: keyArr[h],
              dimValue: value,
              parentId: parentId
            });
          }
        }
      }
      this.moreMode[0].filterData = this.timeRange;
      if (this.oneModeColumn.length > 0) {
        this.checkMore();
      }
    },
    changeCurrentStandard() {
      if (this.oneModeColumn.length > 0) {
        this.checkMore();
      } else {
        this.$message.warning("请先设置筛选数据！");
      }
    },
    getId() {
      this.oneId++;
      return this.oneId;
    },
    search() {
      if (this.oneModeColumn.length > 0 && this.tableTitle != "") {
        this.getDatas();
      } else {
        this.$message.warning("请先设置筛选数据、统计维度或标题！");
      }
    },
    exportExcel() {
      if (this.oneModeColumn.length > 0 && this.tableTitle != "") {
        let params = this.getParams(true);
        searchData(params).then(res => {
          if (res.data.code == 0) {
            let obj = {
              id: "0",
              name: "start"
            };
            this.originData = [...res.data.data];
            obj.dataList = this.originData.slice(0, res.data.data.length - 1);

            if (res.data.data.length > 0) {
              this.leafNodesLen = 0;
              this.getLeafNodesLength({ ...obj });
              let exportTotal = this.leafNodesLen;
              let fileName = this.tableTitle + ".xlsx";
              let url = exportBase + analyzeExportUrl;
              if (params != "") {
                this.$refs.exportRefs.export(
                  fileName,
                  url,
                  params,
                  exportTotal
                );
              }
            } else {
            }
          }
        });
      } else {
        this.$message.warning("请先设置筛选数据、统计维度或标题！");
      }
    },
    reset() {
      this.tableData = [];
      this.resultTree = {};
      this.showStepTips = true;
      for (let i = 0; i < this.moreMode.length; i++) {
        this.moreMode[i].defaultData = [];
        this.moreMode[i].filterData = [];
        this.moreMode[i].showSelectTips = false;
        let refName = this.moreMode[i].prop + "TreeRefs";
        for (let j = 0; j < this.moreMode[i].standards.length; j++) {
          this.moreMode[i].standards[j].list = [];
        }
        if (this.moreMode[i].type == "checkbox") {
          this.$refs[refName][0].reset();
        } else if (this.moreMode[i].type == "date") {
          this.timeRange = "";
        } else {
          this.$refs[refName][0].reset();
        }
        let originData = [...this.moreMode[i].originData];
        this.moreMode[i].originData = [...originData];
      }
      for (let i = 0; i < this.onecheckData.length; i++) {
        this.onecheckData[i].checked = false;
      }
    },
    resetMode() {
      this.tableData = [];
      this.modeColspan = {};
      this.showSummary = false;
      this.showStepTips = true;
      for (let i = 0; i < this.moreMode.length; i++) {
        this.moreMode[i].currentStandard = -1;
        this.moreMode[i].indicators = [];
        for (let j = 0; j < this.moreMode[i].onecheckData.length; j++) {
          this.moreMode[i].onecheckData[j].checked = false;
        }
      }
    },
    changeMode(index) {
      this.currentMode = index;
    },
    selectDown(arr, modeType, filterArr, selectAll) {
      // console.log(filterArr);
      let index = 0;
      for (let m = 0; m < this.moreMode.length; m++) {
        if (this.moreMode[m].prop == modeType) {
          index = m;
          break;
        }
      }
      this.moreMode[index].filterData = [];
      if (this.moreMode[index].type != "checkbox") {
        this.moreMode[index].filterData = [...filterArr];
        this.moreMode[index].showSelectTips = selectAll
          ? true
          : filterArr.length > 0;
      } else {
        for (let n = 0; n < filterArr.length; n++) {
          this.moreMode[index].filterData.push(filterArr[n].id);
        }
        this.moreMode[index].showSelectTips = filterArr.length > 0;
      }

      // this.moreMode[index].currentStandard = -1;
      for (let i = 0; i < this.moreMode[index].standards.length; i++) {
        this.moreMode[index].standards[i].list = [];
        let obj = this.moreMode[index].standards[i];
        if (this.moreMode[index].type != "checkbox") {
          for (let j = 0; j < arr.length; j++) {
            if (obj.level == arr[j].level) {
              let inObj = {
                id: arr[j].id,
                level: arr[j].level,
                dimValue: arr[j].label,
                dimName: obj.prop
              };
              if (this.moreMode[index].type == "date") {
                inObj.parentId = arr[j].parentId;
              }
              this.moreMode[index].standards[i].list.push(inObj);
            }
          }
        } else {
          for (let k = 0; k < arr.length; k++) {
            this.moreMode[index].standards[i].list.push({
              id: arr[k].id,
              dimValue: arr[k].label,
              dimName: obj.prop
            });
          }
        }
      }
      if (this.oneModeColumn.length > 0) {
        this.checkMore();
      }
    },
    getTreeNode(node, linkParent, children) {
      if (!node) {
        return;
      }
      if (node.dataList && node.dataList.length != 0) {
        for (let i = 0; i < node.dataList.length; i++) {
          this.getTreeNode(node.dataList[i], linkParent, children);
        }
      } else {
        let origin = JSON.parse(children);
        let arr = [];

        if (linkParent) {
          for (let j = 0; j < origin.length; j++) {
            if (node.id == origin[j].parentId) {
              arr.push({ ...origin[j] });
            }
          }
        } else {
          arr = JSON.parse(children);
        }
        node.dataList = arr;
      }
    },
    treeData(data, pid) {
      var result = [],
        temp;
      for (var i = 0; i < data.length; i++) {
        if (data[i].pid == pid) {
          var obj = { label: data[i].name, id: data[i].id };
          temp = this.treeData(data, data[i].id);
          if (temp.length > 0) {
            obj.children = temp;
          }
          result.push(obj);
        }
      }
      return result;
    },
    getTableData(node) {
      if (!node) {
        return;
      }
      if (node.dataList != null && node.dataList.length > 0) {
        for (let i = 0; i < node.dataList.length; i++) {
          this.obj[node.dataList[i].dimName] = node.dataList[i].dimValue;
          for (let key in node.dataList[i]) {
            // if (!["id", "prop", "name", "children"].includes(key)) {
            //   this.obj[node.children[i].prop + key] = node.children[i][key];
            // }
            if (
              ![
                "id",
                "dimName",
                "dimValue",
                "dataList",
                "parentId",
                "level"
              ].includes(key)
            ) {
              this.obj[node.dataList[i].dimName + key] = node.dataList[i][key];
            }
          }
          this.getTableData(node.dataList[i]);
        }
      } else {
        if (node.name != "start") {
          // console.log({ ...this.obj });
          this.tableData.push({ ...this.obj });
        }
      }
    },
    getOtherColspan(node) {
      if (!node) {
        return;
      }
      if (node.dataList && node.dataList.length > 0) {
        let innerObj = {};
        for (let i = 0; i < node.dataList.length; i++) {
          this.leafNodesLen = 0;
          this.getLeafNodesLength(node.dataList[i]);
          let len = this.leafNodesLen;
          innerObj[i] = len;
        }
        // console.log(innerObj);
        for (let i = 0; i < node.dataList.length; i++) {
          this.getOtherColspan(node.dataList[i]);
        }
        this.modeColspan[this.startColumnNum] = innerObj;
        this.startColumnNum++;
      }
    },
    getNodeInTree(node, label, prop) {
      if (node.dimValue == label && node.dimName == prop) {
        return node;
      } else if (node.dataList != null) {
        let i = 0;
        let result = null;
        for (i = 0; result == null && i < node.dataList.length; i++) {
          result = this.getNodeInTree(node.dataList[i], label, prop);
        }
        return result;
      }
      return null;
    },
    getMoreColspanb() {
      let columnNum = 0;
      let allStandards = [];

      for (let i = 0; i < this.oneModeColumn.length; i++) {
        for (let j = 0; j < this.oneModeColumn[i].standards.length; j++) {
          if (this.oneModeColumn[i].standards[j].list.length > 0) {
            if (this.oneModeColumn[i].prop == "date") {
              if (j == 0 || j == this.oneModeColumn[i].currentStandard) {
                allStandards.push({
                  name: this.oneModeColumn[i].standards[j].name,
                  prop: this.oneModeColumn[i].standards[j].prop
                });
              }
            } else {
              if (j == this.oneModeColumn[i].currentStandard) {
                allStandards.push({
                  name: this.oneModeColumn[i].standards[j].name,
                  prop: this.oneModeColumn[i].standards[j].prop
                });
              }
            }
          }
        }
      }
      for (let h = 0; h < allStandards.length; h++) {
        let obj = {};
        let rowNum = 0;
        for (let w = 0; w < this.tableData.length; w++) {
          if (rowNum == w) {
            let node = { ...this.resultTree };
            for (let k = 0; k <= h; k++) {
              if (k > 0) {
                node = {
                  ...this.getNodeInTree(
                    node,
                    this.tableData[w][allStandards[k].prop],
                    allStandards[k].prop
                  )
                };
              } else {
                node = this.getNodeInTree(
                  { ...this.resultTree },
                  this.tableData[w][allStandards[0].prop],
                  allStandards[k].prop
                );
              }
            }
            this.leafNodesLen = 0;
            this.getLeafNodesLength(node);
            let len = this.leafNodesLen;
            obj[rowNum] = len;
            rowNum += len;
          }
        }
        this.modeColspan[h] = obj;
      }
    },
    getStandardsColspan() {
      let index = 0;
      let start = 0;
      // if (this.moreMode[0].currentStandard > 0) {
      //   start = 1;
      // }
      for (let key in this.modeColspan) {
        index = parseInt(key);
        start = index;
      }

      for (let i = this.moreMode.length - 1; i >= 0; i--) {
        let flag = false;
        for (let j = 0; j < this.moreMode[i].standards.length; j++) {
          if (this.moreMode[i].standards[j].list.length > 0) {
            flag = true;
            break;
          } else {
            flag = false;
          }
        }
        let startFlag =
          this.moreMode[0].currentStandard > 0 ? start >= 1 : start >= 0;
        if (flag && this.moreMode[i].currentStandard > -1 && startFlag) {
          for (let k = 0; k < this.moreMode[i].indicators.length; k++) {
            index++;
            this.modeColspan[index] = { ...this.modeColspan[start] };
          }
          start--;
        }
      }
    },
    getLeafNodesLength(node) {
      if (node.dataList != null && node.dataList.length > 0) {
        for (let i = 0; i < node.dataList.length; i++) {
          this.getLeafNodesLength(node.dataList[i]);
        }
      } else {
        this.leafNodesLen++;
      }
    },
    calculateTotalLen(node, total) {
      if (!node) {
        return 0;
      }
      if (node.dataList && node.dataList.length > 0) {
        for (let i = 0; i < node.dataList.length; i++) {
          return this.calculateTotalLen(
            node.dataList[i],
            node.dataList.length * total
          );
        }
      } else {
        return total;
      }
    },
    getDatas() {
      let params = this.getParams(true);
      if (params != "") {
        // console.log(JSON.stringify(params));
        this.showStepTips = false;
        this.showMaxtips = false;
        this.obj = {};
        this.tableData = [];
        this.modeColspan = {};
        this.resultTree = {
          id: "0",
          name: "start"
        };
        searchData(params).then(res => {
          if (res.data.code == 0) {
            this.originData = [...res.data.data];

            this.resultTree.dataList = this.originData.slice(
              0,
              res.data.data.length - 1
            );
            this.sumData = this.originData.slice(
              res.data.data.length - 1,
              res.data.data.length
            );

            if (res.data.data.length > 0) {
              this.leafNodesLen = 0;
              this.getLeafNodesLength({ ...this.resultTree });
              this.exportTotal = this.leafNodesLen;
              if (this.exportTotal >= this.maxLen) {
                this.showMaxtips = true;
              } else {
                this.showMaxtips = false;
                this.getTableData({ ...this.resultTree });
                this.getMoreColspanb();
                this.getStandardsColspan();
              }
            } else {
              // this.showStepTips = true;
            }
          }
        });
      }
    },
    getParams(search) {
      // params
      let params = {};
      params.dimObj = [];
      if (search) {
        params.filterObj = {};
      }
      params.tableTitle = this.tableTitle;
      params.showTotal = this.showSummary;
      for (let i = 0; i < this.moreMode.length; i++) {
        if (this.moreMode[i].currentStandard > -1) {
          let flag = false;
          let indicators = [];
          let indicatorsIds = [];
          flag =
            this.moreMode[i].standards[this.moreMode[i].currentStandard].list
              .length > 0;
          if (search) {
            if (flag) {
              let filterData = [];
              if (this.moreMode[i].filterKey != "") {
                params.filterObj[this.moreMode[i].filterKey] = this.moreMode[
                  i
                ].filterData;
              }
            } else {
              this.$message.warning(
                `请先选择${this.moreMode[i].name}维度下的筛选数据!`
              );
              return "";
            }
          }
          // else {
          //   // let indicators = [];
          //   // let indicatorsIds = [];
          //   for (let k = 0; k < this.moreMode[i].indicators.length; k++) {
          //     indicatorsIds.push(this.moreMode[i].indicators[k].id);
          //   }
          //   params.dimObj.push({
          //     dimensionNameId: this.moreMode[i].id,
          //     dimensionLevelId: this.moreMode[i].standards[
          //       this.moreMode[i].currentStandard
          //     ].id,
          //     indicatorsIds: indicatorsIds
          //   });
          // }
          for (let k = 0; k < this.moreMode[i].indicators.length; k++) {
            indicatorsIds.push(this.moreMode[i].indicators[k].id);
          }
          params.dimObj.push({
            dimensionNameId: this.moreMode[i].id,
            dimensionLevelId: this.moreMode[i].standards[
              this.moreMode[i].currentStandard
            ].id,
            indicatorsIds: indicatorsIds
          });
        }
      }
      return params;
    },
    checkMore() {
      this.showMaxtips = false;
      let totalLen = this.tableData.length;
      this.obj = {};
      this.tableData = [];
      this.sumData = [];
      this.modeColspan = {};
      this.leafNodesLen = 0;
      let arr = [...this.oneModeColumn];
      let originArr = [...this.moreMode];
      this.resultTree = {
        id: "0",
        name: "start"
      };
      this.getTree = {
        id: "0",
        name: "start"
      };
      if (arr.length > 0) {
        this.showStepTips = false;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            if (arr[i].prop != "date") {
              for (let j = 0; j < arr[i].standards.length; j++) {
                if (j == parseInt(arr[i].currentStandard)) {
                  if (arr[i].standards[j].list.length > 0) {
                    let linkParent = false;
                    if (arr[i].standards[j].list.length >= this.maxLen) {
                      this.showMaxtips = true;
                      return;
                    }
                    this.getTreeNode(
                      this.resultTree,
                      linkParent,
                      JSON.stringify(arr[i].standards[j].list)
                    );
                    this.leafNodesLen = 0;
                    this.getLeafNodesLength(this.resultTree);
                    if (this.leafNodesLen >= this.maxLen) {
                      this.showMaxtips = true;
                      return;
                    }
                  }
                }
              }
            } else {
              for (let j = 0; j < arr[i].standards.length; j++) {
                if (j == 0 || j == arr[i].currentStandard) {
                  if (arr[i].standards[j].list.length > 0) {
                    let linkParent = false;
                    if (j > 0) {
                      linkParent = true;
                    }
                    this.getTreeNode(
                      this.resultTree,
                      linkParent,
                      JSON.stringify(arr[i].standards[j].list)
                    );
                    this.leafNodesLen = 0;
                    this.getLeafNodesLength(this.resultTree);
                    if (this.leafNodesLen >= this.maxLen) {
                      this.moreMode[this.currentMode].currentStandard = -1;
                      this.$message.warning(
                        `显示数据大于${this.maxLen}行，请导出查看！`
                      );
                      return;
                    }
                  }
                }
              }
            }
          }
        }
        this.getTableData({ ...this.resultTree });
        this.getMoreColspanb();
        this.getStandardsColspan();
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.modeColspan[columnIndex]) {
        return {
          rowspan: this.modeColspan[columnIndex][rowIndex],
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    getSummaries(param) {
      let totalData = [
        {
          dimName: "year",
          dimValue: "半年",
          total: 300,
          unTotal: 5
        }
      ];
      let dimName = "";
      for (let i = 0; i < this.moreMode.length; i++) {
        if (this.moreMode[i].indicators.length != 0) {
          dimName = this.moreMode[i].standards[this.moreMode[i].currentStandard]
            .prop;
          break;
        } else {
          continue;
        }
      }
      let keyArr = ["half", "quarter", "month"];
      totalData = this.sumData;
      let obj = {};
      for (let i = 0; i < totalData.length; i++) {
        let start = totalData[i].dimName;
        for (let key in totalData[i]) {
          if (key != "dimName" && key != "dimValue") {
            obj[dimName + key] = totalData[i][key];
          }
        }
      }
      const { columns, data } = param;
      const sums = [];
      // console.log(columns);
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!isNaN(Number(obj[column.property]))) {
          sums[index] = obj[column.property];
        } else {
          sums[index] = "-";
        }
      });
      return sums;
    },
    getYearAndMonthAndDay(start, end) {
      var date_all = [],
        i = 0;
      var startTime = this.getDate(start);
      var endTime = this.getDate(end);
      while (endTime.getTime() - startTime.getTime() >= 0) {
        var year = startTime.getFullYear();
        var month =
          (startTime.getMonth() + 1).toString().length == 1
            ? "0" + (startTime.getMonth() + 1).toString()
            : (startTime.getMonth() + 1).toString();
        var day =
          startTime.getDate().toString().length == 1
            ? "0" + startTime.getDate()
            : startTime.getDate();
        date_all[i] = year + "-" + month + "-" + day;
        startTime.setDate(startTime.getDate() + 1);
        i += 1;
      }
      return date_all;
    },
    getDate(datestr) {
      var temp = datestr.split("-");
      return new Date(temp[0], temp[1] - 1, temp[2]);
    },
    modeShow() {
      this.dialogVisible = true;
      this.getAllMode();
      // this.modeData = [
      //   {
      //     nums: 1,
      //     name: "模板名称",
      //     createTime: "2018-02-02"
      //   }
      // ];
    },
    getAllMode() {
      getAllTableMode(this.modePage.currentPage, this.modePage.pageSize).then(
        res => {
          if (res.data.code == 0) {
            this.modeData = [];
            let datas = res.data.data.content;
            this.modePage.totals = res.data.data.totalElements;
            for (let i = 0; i < datas.length; i++) {
              this.modeData.push({
                // id: datas[i].id,
                nums: datas[i].id,
                name: datas[i].name,
                content: datas[i].content,
                createTime: datas[i].date
              });
            }
          }
        }
      );
    },
    saveMode() {
      if (this.saveModeColumn.length > 0 && this.tableTitle != "") {
        let params = this.getParams(false);
        // console.log(JSON.stringify(params));
        let obj = {};
        obj.name = this.tableTitle;
        obj.content = JSON.stringify(params);
        addTableMode(obj).then(res => {
          if (res.data.code == 0) {
            this.$message.success("保存模板成功！");
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        if (this.tableTitle == "") {
          this.$message.warning("请先设置标题！");
          return;
        }
        this.$message.warning("请先设置统计维度或标题！");
        return;
      }
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
#analyze {
  background: #f9faff;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .out-container {
    // height: auto;
    padding: 20px;
    width: 100%;
    .out-box {
      background: #fff;
      overflow: hidden;
      width: 100%;
      margin-bottom: 20px;
      padding: 20px 0;
      font-size: 14px;
      .left {
        position: relative;
        width: 180px;
        float: left;
        padding-left: 10px;
        box-sizing: border-box;
        height: 50px;
        line-height: 50px;

        &::before {
          position: absolute;
          display: block;
          content: " ";
          width: 4px;
          height: 15px;
          top: 50%;
          left: 0;
          background: #3293fe;
          transform: translateY(-50%);
        }
      }
      .mid {
        float: left;
        width: calc(100% - 420px);
        .tabs-item {
          float: left;
          width: 220px;
          height: 40px;
          line-height: 40px;
          margin: 10px 5px;
          &.timerange {
            width: auto;
          }
        }
        .in-tab {
          overflow: hidden;
          // height: 50px;
          line-height: 50px;

          .in-item {
            float: left;
            margin-right: 15px;
            .mode-item {
              display: inline-block;
              padding: 2px 10px;
              line-height: 32px;
              cursor: pointer;
              color: #333;
              .icons {
                color: #999;
              }
              &.active {
                color: #409eff;
                border: 1px solid #409eff;
                border-radius: 4px;
                .icons {
                  color: #409eff;
                }
              }
            }

            &.in-title {
              width: 90px;
              text-align: right;
            }
            &.sorts {
              width: 500px;
              margin-left: 150px;
            }
            .el-checkbox__label {
              font-size: 14px;
            }
          }
        }
      }
      .right {
        // position: absolute;
        // top: 20px;
        // right: 0;
        float: right;
        width: 240px;
        .btns {
          display: block;
          width: 140px;
          margin: 10px auto;
        }
      }
      .titles {
        text-align: center;

        .title-box {
          display: inline;
          .table-title {
            width: 360px;
            display: inline-block;
            margin: 10px auto;
          }
        }
      }
      .table-result {
        overflow: hidden;
      }
      .table-box {
        margin: 20px;
        width: calc(100% - 40px);
        box-sizing: border-box;
        .step-tips {
          width: 600px;
          margin: 30px auto;
          padding: 20px;
          border-radius: 6px;
          border: 1px solid #409eff;
          background: #ebf5ff;
          overflow: hidden;
          .lefts {
            float: left;
            width: 60px;
            text-align: center;
            color: #409eff;
            font-size: 30px;
            margin-top: 10px;
          }
          .right {
            float: left;
            color: #999;
            width: calc(100% - 60px);
            p {
              line-height: 20px;
              font-size: 14px;
              margin: 10px 0;
              &.bigs {
                font-size: 16px;
              }
            }
          }
        }
        .max-tips {
          width: 100%;
          height: 60px;
          margin: 20px auto;
          text-align: center;
          overflow: hidden;
          .max-inline {
            display: inline-block;
            padding: 15px;

            border-radius: 6px;
            border: 1px solid orange;
            color: orange;
          }
        }
      }
    }
  }
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 240px;
  }
}
</style>
<style lang="scss">
#analyze {
  .el-table .el-table__header tr,
  .el-table .el-table__header th {
    background: #f5f7fa !important;
  }
  .el-table {
    overflow: auto;
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: visible;
  }
  .el-table__body-wrapper {
    overflow: visible;
  }
  .el-table__header-wrapper {
    overflow: visible;
  }
  .el-table__footer-wrapper {
    overflow: visible;
  }
  .el-table::after {
    position: relative !important;
  }
}
</style>

