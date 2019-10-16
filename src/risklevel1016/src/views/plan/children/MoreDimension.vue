<template>
  <div class="more-dimension">
    <div class="commonWidth dimension-top">
      <div class="left">
        <div class="search-item">
          <div class="label common-title">计划</div>
          <div class="list">
            <el-input v-model="name" class="list-t" disabled></el-input>
          </div>
        </div>
        <div class="search-item">
          <div class="label common-title">筛选条件</div>
          <div class="list">
            <div class="list-box">
              <div class="list-item">
                <!-- <down-tree
                  @downTree="selectCategory"
                  :isLeaf="false"
                  :data="categoryTree"
                  icon="list"
                  ref="categoryTreeRefs"
                  placeholder="选择农产品（复选）"
                ></down-tree>-->
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-formate="yyyy-MM-dd"
                  style="width:100%;"
                ></el-date-picker>
              </div>
              <div class="list-item">
                <!-- <down-tree
                  @downTree="selectProject"
                  :isLeaf="true"
                  :data="projectTree"
                  icon="list"
                  ref="projectTreeRefs"
                  placeholder="选择检测项目（复选）"
                ></down-tree>-->
                <MoreCheckbox
                  :title="taskStepResult.length>0?'点击查看选择任务':'选择任务'"
                  :allData="taskStep"
                  @backCheck="backTaskStep"
                />
              </div>
              <!-- <div class="list-item">
                <el-popover
                  popper-class="tree-downlist"
                  v-model="linksVisible"
                  :visible-arrow="false"
                  trigger="click"
                  placement="bottom-start"
                >
                  <div class="more-select">
                    <div class="head">
                      <span class="fl">选择环节</span>
                      <svg-icon
                        iconClass="close"
                        class="fr links-icon"
                        @click.native="linksVisible=false"
                      ></svg-icon>
                    </div>
                    <div class="checkbox-box">
                      <el-checkbox-group v-model="checkLinksList">
                        <el-checkbox label="复选框 A"></el-checkbox>
                        <el-checkbox label="复选框 B"></el-checkbox>
                        <el-checkbox label="复选框 C"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <div class="foot">
                      <div class="fr operation">
                        <el-button @click="linksVisible=false">取消</el-button>
                        <el-button @click="getLinks">确定</el-button>
                      </div>
                    </div>
                  </div>
                  <div slot="reference" size="small">
                    <el-input v-model="linkName" placeholder="选择环节（复选）" disabled>
                      <svg-icon iconClass="list" slot="suffix"></svg-icon>
                    </el-input>
                  </div>
                </el-popover>
              </div>-->
              <div class="list-item">
                <!-- <el-popover
                  popper-class="tree-downlist"
                  v-model="showAreas"
                  :visible-arrow="false"
                  trigger="click"
                  placement="bottom-end"
                >
                  <div class="tree-select">
                    <down-tree></down-tree>
                  </div>
                  <div slot="reference" size="small">
                    <el-input v-model="areaName" placeholder="选择区域（复选）" disabled>
                      <svg-icon iconClass="list" slot="suffix"></svg-icon>
                    </el-input>
                  </div>
                </el-popover>-->
                <down-tree
                  @downTree="selectArea"
                  :isLeaf="false"
                  :data="areaTree"
                  ref="areaTreeRefs"
                  icon="list"
                  placeholder="选择区域（复选）"
                  placement="bottom-end"
                ></down-tree>
              </div>
              <div class="list-item">
                <el-input v-model="person" placeholder="选择人员" @click.native="selectPerson">
                  <svg-icon iconClass="list" slot="suffix"></svg-icon>
                </el-input>
              </div>
            </div>
            <div class="list-box">
              <div class="list-item"></div>
            </div>
          </div>
        </div>
        <div class="search-item">
          <div class="label common-title">监测结果</div>
          <div class="list">
            <!-- <el-input v-model="planName"></el-input> -->
            <!-- <el-checkbox v-model="checkPass">合格</el-checkbox>
            <el-checkbox v-model="checkNotPass">不合格</el-checkbox>-->
            <el-checkbox
              v-for="(item, index) in riskLevel"
              @click="selectRisk(item)"
              :key="'risklevel'+index"
              v-model="item.checked"
            >{{item.label}}</el-checkbox>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" class="btns" @click="searchResult">
          <svg-icon iconClass="search"></svg-icon>
          <span>查询</span>
        </el-button>
        <el-button class="btns" @click="resetSearch">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    <div class="commonWidth dimension-table">
      <div class="table-top">
        <div class="fl">
          <el-button slot="reference" type="primary" @click="exportTable">
            <svg-icon iconClass="export"></svg-icon>
            <span>导出</span>
            <!-- <svg-icon iconClass="down"></svg-icon> -->
          </el-button>
        </div>
        <div class="fr sort">
          <sort-down
            :tableHeader="tableHeader"
            :selectProp="selectProp"
            :selectOrder="selectOrder"
            @tableSort="tableSort"
            @resetSort="resetSort"
          ></sort-down>
          <el-button @click="openDialog" style="margin-left:10px;">
            <svg-icon iconClass="list"></svg-icon>
            <span>列表</span>
          </el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="sortTable"
        :default-sort="defaultSort"
        border
        @sort-change="sortChange"
      >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
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
            <div v-if="item.prop === 'planStatus'" class="status">
              <span v-if="scope.row[item.prop] == 'APPROVE_NOT_PASS'">
                <label class="noPass"></label>审批未通过
              </span>
              <span v-if="scope.row[item.prop] == 'UNAPPROVED'">
                <label class="approval"></label>待审批
              </span>
              <span v-if="scope.row[item.prop] == 'EDIT'">
                <label class="inApproval"></label>编制中
              </span>
              <span v-if="scope.row[item.prop] == 'APPROVE_PASS'">
                <label class="pass"></label>审批通过
              </span>
            </div>
            <div
              v-else-if="['checkDetail', 'staticRiskDetail', 'sceneDetail', 'guideDetail', 'formulationDetail', 'approovalDetail'].includes(item.prop)"
            >
              <span @click="handleView(scope.$index, scope.row, item.prop)" class="view">
                <svg-icon iconClass="view"></svg-icon>
                <span>下载</span>
              </span>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          background
          layout="prev, pager, next, sizes"
          :total="page.totalElements"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          class="fr"
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
    <SortHeader ref="sortRefs" :list="tableHeader" @changeHeader="changeHeader" />
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="1200px"
      custom-class="allocation-dialog"
    >
      <select-person ref="selectPersonRefs"></select-person>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SortHeader from "@/components/SortHeader/index.vue";
import SortDown from "@/components/SortDown/index.vue";
import DownTree from "@/components/DownTree/index.vue";
import SelectPerson from "@/components/SelectPerson/index.vue";
import MoreCheckbox from "@/components/MoreCheckbox/index.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { OVERVIEW_PRODUCT } = apis;
export default {
  data() {
    return {
      name: "",
      categoryName: "",
      linkName: "",
      areaName: "",
      dateRange: "",
      person: "",
      dialogVisible: false,
      linksVisible: false,
      checkPass: true,
      checkNotPass: false,
      tableHeader: [
        {
          prop: "taskNo",
          label: "任务编号",
          width: 150,
          notSort: true,
          sortable: false,
          selected: true
        },
        {
          prop: "enterpriseName",
          label: "企业名称",
          width: 220,
          notSort: true,
          sortable: false,
          selected: true
        },
        {
          prop: "riskLevel",
          label: "风险等级",
          width: 180,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "newRiskScore",
          label: "动态风险得分",
          width: 180,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "staticRiskScore",
          label: "静态风险得分",
          width: 180,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "finishDate",
          label: "完成时间",
          width: 120,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "taskStep",
          label: "任务阶段",
          width: 140,
          notSort: false,
          sortable: true,
          selected: true
        },
        {
          prop: "remarks",
          label: "备注",
          width: 130,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "checkDetail",
          label: "体系检查记录详情",
          width: 150,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "staticRiskDetail",
          label: "静态风险因素详情",
          width: 150,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "sceneDetail",
          label: "现场检查详情",
          width: 130,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "guideDetail",
          label: "跟踪指导详情",
          width: 130,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "formulationDetail",
          label: "报告编制详情",
          width: 130,
          notSort: false,
          sortable: false,
          selected: true
        },
        {
          prop: "approovalDetail",
          label: "报告审批详情",
          width: 130,
          notSort: false,
          sortable: false,
          selected: true
        }
        // {
        //   prop: "AAA",
        //   label: "标称商标",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "companyProvince",
        //   label: "生产企业所属省",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "companyCity",
        //   label: "生产企业所属市",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "companyArea",
        //   label: "生产企业所属区县",
        //   width: 150,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "comes",
        //   label: "样品来源",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "price",
        //   label: "标称价格",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "dateBatch",
        //   label: "生产日期/出厂批号",
        //   width: 150,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "standardNum",
        //   label: "产品执行标准编号",
        //   width: 150,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "units",
        //   label: "规格型号",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "saveTime",
        //   label: "保质期",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "saveCondition",
        //   label: "标称存储条件",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "productAccessNum",
        //   label: "生产许可证编号",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "productLevel",
        //   label: "标称产品等级",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "saveWay",
        //   label: "包装方式",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "spotcheckWay",
        //   label: "抽样方式",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "spotcheckNum",
        //   label: "抽取样品数量",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "demoBase",
        //   label: "样品基数",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "process",
        //   label: "抽取样品过程",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "spotSaveCondition",
        //   label: "样品存储条件",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "spotSaveDes",
        //   label: "样品封样情况",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "spotcheckLink",
        //   label: "抽样环节",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "spotcheckUnit",
        //   label: "抽样单位",
        //   width: 130,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "lastUpdateAt",
        //   label: "最后更新时间",
        //   width: 140,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "docNum",
        //   label: "任务文件编号",
        //   width: 140,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // },
        // {
        //   prop: "spotcheckResult",
        //   label: "检验结果",
        //   width: 140,
        //   notSort: false,
        //   sortable: false,
        //   selected: true
        // }
      ],
      tableData: [],
      selectProp: "",
      selectOrder: "",
      defaultSort: {
        prop: "lastUpdateAt",
        order: "descending"
      },
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 5
      },
      categoryTree: [],
      projectTree: [],
      areaTree: [],
      checkLinksList: [],
      taskStep: [],
      taskStepResult: [],
      dialogTitle: "",
      riskLevel: []
    };
  },
  components: {
    SortHeader,
    SortDown,
    DownTree,
    SelectPerson,
    MoreCheckbox
  },
  created() {
    this.name = this.$route.params.name;
    let planNo = this.$route.params.planNo;
    planNo = "GJLXJC-201801";
    // this.tableData = []
    for (let i = 0; i < 15; i++) {
      this.tableData.push({
        planNo: "20191" + i,
        lastUpdateAt: "2016-05-02",
        planBeginDate: "2016-05-02",
        planEndDate: "2016-05-02",
        leadOrg: "牵头单位",
        planName: "计划名称",
        planType: "计划类型",
        planImplOrg: "承担单位",
        planAdminOrg: "管理单位",
        planMemo: "备注",
        planStatus: "EDIT"
      });
    }
    this.page.totalElements = this.tableData.length;
    this.categoryTree = [
      {
        id: 1,
        label: "一级 1",
        children: [
          {
            id: 4,
            label: "二级 1-1",
            children: [
              {
                id: 9,
                label: "三级 1-1-1",
                children: [
                  {
                    id: 11,
                    label: "四级 1-1-1"
                  },
                  {
                    id: 51,
                    label: "四级 1-1-2"
                  }
                ]
              },
              {
                id: 10,
                label: "三级 1-1-2"
              }
            ]
          },
          {
            id: 34,
            label: "二级 1-2",
            children: [
              {
                id: 39,
                label: "三级 1-2-1",
                children: [
                  {
                    id: 31,
                    label: "四级 1-2-1"
                  }
                ]
              },
              {
                id: 30,
                label: "三级 1-2-2"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: "一级 2",
        children: [
          {
            id: 5,
            label: "二级 2-1"
          },
          {
            id: 6,
            label: "二级 2-2"
          }
        ]
      },
      {
        id: 20,
        label: "一级 3",
        children: [
          {
            id: 22,
            label: "二级 2-1"
          },
          {
            id: 24,
            label: "二级 2-2"
          },
          {
            id: 25,
            label: "二级 2-1"
          },
          {
            id: 26,
            label: "二级 2-2"
          },
          {
            id: 27,
            label: "二级 2-1"
          }
        ]
      }
    ];
    this.projectTree = [
      {
        id: 1,
        label: "一级 1",
        children: [
          {
            id: 4,
            label: "二级 1-1"
          },
          {
            id: 34,
            label: "二级 1-2"
          }
        ]
      },
      {
        id: 2,
        label: "一级 2",
        children: [
          {
            id: 5,
            label: "二级 2-1"
          },
          {
            id: 6,
            label: "二级 2-2"
          }
        ]
      },
      {
        id: 20,
        label: "一级 3",
        children: [
          {
            id: 22,
            label: "二级 2-1"
          },
          {
            id: 24,
            label: "二级 2-2"
          },
          {
            id: 25,
            label: "二级 2-1"
          },
          {
            id: 26,
            label: "二级 2-2"
          },
          {
            id: 27,
            label: "二级 2-1"
          }
        ]
      }
    ];
    this.areaTree = [
      {
        id: 1,
        label: "四川省",
        children: [
          {
            id: 2,
            label: "成都市",
            children: []
          },
          {
            id: 3,
            label: "绵阳市",
            children: []
          }
        ]
      }
    ];
    this.riskLevel = [
      {
        id: "1",
        label: "A",
        checked: false
      },
      {
        id: "2",
        label: "B",
        checked: false
      },
      {
        id: "3",
        label: "C",
        checked: false
      },
      {
        id: "4",
        label: "D",
        checked: false
      },
      {
        id: "5",
        label: "空",
        checked: false
      }
    ];
    this.taskStep = [
      {
        id: "1",
        label: "A",
        children: []
      },
      {
        id: "2",
        label: "B",
        children: []
      }
    ];
    this.getDefaulDatas(planNo);
  },
  methods: {
    async getDefaulDatas(planNo) {
      let res = await http.get(OVERVIEW_PRODUCT, {
        planNo: planNo
      });
      if (res) {
        this.categoryTree = res.data;
      }
    },
    openDialog() {
      this.$refs.sortRefs.openDialog();
    },
    // 恢复默认排序
    resetSort() {
      this.$refs.sortTable.clearSort();
    },
    // 下拉排序
    tableSort(prop, order) {
      this.$refs.sortTable.sort(prop, order);
      this.getDatas();
    },
    sortChange(obj) {
      this.selectProp = obj.prop;
      this.selectOrder = obj.order;
    },
    changeHeader(arr) {
      this.tableHeader = [...arr];
    },
    selectCategory(arr) {
      console.log(arr);
    },
    getLinks() {
      this.linksVisible = false;
    },
    selectProject(arr) {
      console.log(arr);
    },
    selectArea() {},
    pageChange() {},
    sizeChange() {},
    searchResult() {
      let risks = [];
      for (let i = 0; i < this.riskLevel.length; i++) {
        if (this.riskLevel[i].checked) {
          risks.push(this.riskLevel[i]);
        }
      }
    },
    resetSearch() {
      this.$refs.categoryTreeRefs.reset();
      this.$refs.projectTreeRefs.reset();
      this.checkLinksList = [];
      this.$refs.areaTreeRefs.reset();
    },
    exportTable() {},
    handleView(index, row, prop) {
      // 查看详情，下载
    },
    selectPerson() {
      console.log("asd");
      this.dialogVisible = true;
    },
    confirmSelect() {
      this.dialogVisible = false;
      let tableData = this.$refs.selectPersonRefs.tableData;
      this.person = [tableData[0].name];
    },
    selectRisk(item) {
      for (let i = 0; i < this.riskLevel.length; i++) {
        if (item.id == this.riskLevel[i].id) {
          this.riskLevel[i].checked = item.checked;
        }
      }
    },
    backTaskStep(arr) {
      this.taskStepResult = arr;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/MoreDimension.scss";
</style>

