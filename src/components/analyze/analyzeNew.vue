<template>
  <div id="analyze">
    <div class="out-container">
      <div class="out-box filter-data">
        <div class="left">筛选数据</div>
        <div class="mid">
          <div
            class="tabs-item"
            :class="{'timerange':item.prop == 'time'}"
            v-for="(item, index) in moreMode"
            :key="'onemode'+index"
          >
            <more-checkbox
              :title="'选择环节'"
              :allData="item.originData"
              :defaultData="item.defaultData"
              :propsName="item.prop"
              :ref="item.prop+'TreeRefs'"
              @backLinks="selectDown"
              v-if="item.prop == 'links'"
            ></more-checkbox>
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              v-else-if="item.prop == 'time'"
              @change="changeTime"
            ></el-date-picker>
            <down-tree
              @downTree="selectDown"
              :isLeaf="item.isLeaf"
              :splitStr="item.splitStr"
              :showFullName="item.showFullName"
              :datas="item.originData"
              :defaultData="item.defaultData"
              :modeType="item.prop"
              icon="down"
              :ref="item.prop+'TreeRefs'"
              :placeholder="item.name"
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
            >{{item.label}}</el-checkbox>
          </div>
          <div class="in-tab">
            <div class="in-item in-title">
              <el-checkbox v-model="showSummary" change="changeTotal">显示总计</el-checkbox>
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
          <!-- <el-button @click="reset" class="btns">设置</el-button> -->
          <el-button @click="resetMode" class="btns">重置</el-button>
          <el-button @click="modeShow" class="btns">模板管理</el-button>
          <!-- <el-button @click="reset" class="btns">保存模板</el-button> -->
        </div>
      </div>
      <div class="out-box">
        <div class="table-result">
          <div class="left">预览报表结果</div>
          <!-- <div class="mid"></div> -->
          <div class="right">
            <el-button @click="search">
              <svg-icon iconClass="search"></svg-icon>查询
            </el-button>
            <el-button>
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
          <div class="step-tips" v-show="tableData.length==0&&oneModeColumn.length==0">
            <div class="lefts">
              <svg-icon iconClass="tips"></svg-icon>
            </div>
            <div class="right">
              <p class="bigs">操作提示</p>
              <p>第一步，请先通过筛选条件，筛选要进行统计分析的数据</p>
              <p>
                第二步，请设定统计维度、维度层级、统计指标；并根据需要设定排名字段
                也可以调用已经定义好的模板
              </p>
              <p>第三步，点击“查询”按钮，系统将根据您设定的报表统计维度，生成相应的数据</p>
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
            <!-- -->
            <el-table-column
              :label="item.name"
              min-width="150"
              v-for="(item,index) in oneModeColumn"
              :key="'defaultmode'+index"
              v-if="item.prop == 'time'&&item.currentStandard>0"
            >
              <el-table-column
                :prop="itema.prop"
                :label="itema.name"
                min-width="150"
                v-for="(itema,indexa) in item.standards"
                v-if="[0, item.currentStandard].includes(indexa)"
                :key="'standardmode'+indexa"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              :label="item.name+'('+item.standards[item.currentStandard].name+')'"
              :prop="item.standards[item.currentStandard].prop"
              min-width="150"
              v-for="(item,index) in oneModeColumn"
              :key="'defaultmodess'+index"
              v-if="item.prop != 'time'||(item.prop=='time'&&item.currentStandard==0)"
            ></el-table-column>
            <el-table-column
              v-for="(item,index) in oneModeColumn"
              :label="item.name"
              align="center"
              v-if="item.indicators.length>0"
              :key="'defaultmodea'+index"
            >
              <el-table-column
                :prop="item.standards[item.currentStandard].prop + itema.prop"
                :label="itema.label"
                min-width="150"
                v-for="(itema,indexa) in item.indicators"
                :key="'defaultmodeb'+indexa"
              ></el-table-column>
            </el-table-column>
          </el-table>
          <div class="max-tips" v-show="oneModeColumn.length>0&&showMaxtips">
            <div class="max-inline">
              <svg-icon iconClass="tips"></svg-icon>
              筛选数据大于{{maxLen}}行，请直接导出查看！
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="out-box"></div> -->
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
        <el-table :data="modeData" border>
          <el-table-column label="序号" prop="nums"></el-table-column>
          <el-table-column label="统计报表模板名称" prop="name"></el-table-column>
          <el-table-column label="模板建立时间" prop="createTime"></el-table-column>
          <el-table-column label="操作" prop="operation" width="320" align="center">
            <template slot-scope="scope">
              <div class="mode-operation">
                <span @click="copyMode(scope.row)">
                  <svg-icon iconClass="edit" class="links-icon" @click.native="visible=false"></svg-icon>复制并新增
                </span>
                <span @click="viewMode(scope.row)">
                  <svg-icon iconClass="view" class="links-icon" @click.native="visible=false"></svg-icon>预览
                </span>
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
              :current-page="modePage.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="modePage.pageSize"
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
  </div>
</template>
<script>
import DownTree from "@/components/DownTree/index1";
import MoreCheckbox from "@/components/MoreCheckbox/index";
import SourceTree from "@/assets/treeData.json";
import ClassData from "@/assets/classData.json";
export default {
  data() {
    return {
      level: 1,
      timeRange: "",
      tableTitle: "",
      showSummary: false,
      searchList: [],
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
          prop: "time",
          isLeaf: false,
          checked: true,
          showFullName: true,
          originData: [],
          icon: "time",
          defaultData: [],
          currentStandard: -1,
          sortStandard: "",
          standards: [],
          onecheckData: [],
          indicators: [],
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
          dimName: "year",
          total: 20000,
          unTotal: 10,
          dataList: [
            {
              dimValue: "上半年",
              dimName: "halfYear",
              total: 100,
              unTotal: 15,
              dataList: [
                {
                  dimValue: "食品大类",
                  dimName: "categories",
                  total: 300,
                  unTotal: 5,
                  dataList: null
                },
                {
                  dimValue: "食品大类2",
                  dimName: "categories",
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
              dimName: "halfYear",
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
        totals: 20
      },
      showMaxtips: false
    };
  },
  components: {
    DownTree,
    MoreCheckbox
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
    }
    // moreModea() {
    //   return this.moreMode.filter(function(item) {
    //     return item.prop != "links";
    //   });
    // },
    // linksMode() {
    //   return this.moreMode.filter(function(item) {
    //     return item.prop == "links";
    //   });
    // }
  },
  created() {
    setTimeout(() => {
      let origins = [
        {
          name: "抽样时间",
          prop: "time",
          isLeaf: false,
          checked: true,
          showFullName: true,
          originData: [],
          icon: "time",
          defaultData: [
            // {
            //   id: 1,
            //   label: "2017年"
            // }
          ],
          currentStandard: -1,
          sortStandard: "",
          standards: [
            {
              name: "年度",
              level: 1,
              prop: "year",
              list: [
                // {
                //   id: "a1",
                //   dimName: "year",
                //   level: 1,
                //   dimValue: "2017"
                // }
              ]
            },
            {
              name: "半年",
              level: 2,
              prop: "halfYear",
              list: [
                // {
                //   id: "a1",
                //   dimName: "halfYear",
                //   level: 2,
                //   dimValue: "上半年"
                // }
              ]
            },
            {
              name: "季度",
              level: 3,
              prop: "season",
              list: [
                // {
                //   id: "a1",
                //   dimName: "season",
                //   level: 3,
                //   dimValue: "1季度"
                // }
              ]
            },
            {
              name: "月度",
              level: 4,
              prop: "month",
              list: [
                // {
                //   id: "a1",
                //   dimName: "month",
                //   level: 4,
                //   dimValue: "1月"
                // }
              ]
            }
          ],
          onecheckData: [],
          indicators: [],
          filterKey: "",
          filterData: []
          // list: [
          //   {
          //     id: "a1",
          //     prop: "time",
          //     name: "2017"
          //   }
          // ]
          // standardsList: [{

          // }]
        },
        {
          name: "食品品类",
          prop: "item",
          checked: true,
          isLeaf: false,
          showFullName: true,
          splitStr: "/",
          currentStandard: -1,
          sortStandard: "",
          filterData: [],
          icon: "category",
          originData: [
            // {
            //   id: 1,
            //   label: "大类",
            //   children: [
            //     {
            //       id: 2,
            //       label: "次类",
            //       children: [
            //         {
            //           id: 7,
            //           label: "亚类1",
            //           children: []
            //         },
            //         {
            //           id: 8,
            //           label: "亚类2",
            //           children: []
            //         }
            //       ]
            //     },
            //     {
            //       id: 3,
            //       label: "次类2",
            //       children: []
            //     }
            //   ]
            // },
            // {
            //   id: 4,
            //   label: "大类2",
            //   children: [
            //     {
            //       id: 5,
            //       label: "次类4"
            //     },
            //     {
            //       id: 6,
            //       label: "次类5"
            //     }
            //   ]
            // }
          ],
          defaultData: [
            // {
            //   id: 7,
            //   label: "亚类1"
            // },
            // {
            //   id: 8,
            //   label: "亚类2"
            // }
          ],
          standards: [
            {
              id: "",
              name: "大类",
              level: 1,
              prop: "categories",
              list: [
                // {
                //   id: "a1",
                //   dimName: "categories",
                //   level: 1,
                //   dimValue: "大类1"
                // }
              ]
            },
            {
              id: "",
              name: "亚类",
              level: 2,
              prop: "subClass",
              list: [
                // {
                //   id: "a1",
                //   dimName: "subClass",
                //   level: 2,
                //   dimValue: "亚类1"
                // }
              ]
            },
            {
              id: "",
              name: "次亚类",
              level: 3,
              prop: "subSubClass",
              list: [
                // {
                //   id: "a1",
                //   dimName: "subSubClass",
                //   level: 3,
                //   dimValue: "次亚类1"
                // }
              ]
            },
            {
              id: "",
              name: "细类",
              level: 4,
              prop: "lastClass",
              list: [
                // {
                //   id: "a1",
                //   dimName: "lastClass",
                //   level: 4,
                //   dimValue: "细类"
                // }
              ]
            }
          ],
          onecheckData: [],
          indicators: [],
          filterKey: "",
          filterData: []
        },
        {
          name: "监测区域",
          prop: "area",
          checked: true,
          isLeaf: false,
          splitStr: "/",
          icon: "position",
          showFullName: true,
          originData: [],
          defaultData: [],
          currentStandard: -1,
          sortStandard: "",
          standards: [
            // {
            //   name: "省份",
            //   level: 1,
            //   prop: "province",
            //   list: []
            // },
            // {
            //   name: "地市",
            //   level: 2,
            //   prop: "city",
            //   list: []
            // },
            {
              id: "sdf",
              name: "区/县",
              level: 1,
              prop: "inarea",
              list: []
            }
          ],
          onecheckData: [],
          indicators: [],
          filterKey: "",
          filterData: []
        },
        {
          name: "检测项目",
          prop: "inner",
          checked: true,
          isLeaf: false,
          showFullName: true,
          splitStr: "/",
          icon: "bug",
          originData: [],
          currentStandard: -1,
          sortStandard: "",
          // 检测项目类别、单个检测项目
          defaultData: [],
          standards: [
            {
              id: "sdf",
              name: "检测项目类别",
              level: 1,
              prop: "detectionCategories",
              list: [
                // {
                //   id: "a1",
                //   dimName: "detectionCategories",
                //   level: 1,
                //   dimValue: "检测项目类别"
                // }
              ]
            },
            {
              id: "sdf",
              name: "单个检测项目",
              level: 2,
              prop: "detectionSubClass",
              list: [
                // {
                //   id: "a1",
                //   dimName: "detectionSubClass",
                //   level: 2,
                //   dimValue: "单个检测项目"
                // },
                // {
                //   id: "a1",
                //   dimName: "detectionSubClass",
                //   level: 2,
                //   dimValue: "单个检测项目"
                // }
              ]
            }
          ],
          onecheckData: [],
          indicators: [],
          filterKey: "",
          filterData: []
        },
        {
          name: "抽检环节",
          prop: "links",
          checked: true,
          icon: "links",
          isLeaf: true,
          originData: [],
          defaultData: [],
          currentStandard: -1,
          sortStandard: "",
          standards: [
            {
              id: "asasd",
              name: "单个抽检环节",
              level: 1,
              prop: "linksOne",
              list: []
            }
          ],
          onecheckData: [],
          indicators: [],
          filterKey: "",
          filterData: []
        },
        {
          name: "任务来源",
          prop: "taskFrom",
          checked: true,
          icon: "task",
          isLeaf: false,
          originData: [],
          defaultData: [],
          currentStandard: -1,
          sortStandard: "",
          standards: [
            {
              id: "aa",
              name: "单个检测项目",
              level: 1,
              prop: "taskFromOne",
              list: []
            }
          ],
          onecheckData: [],
          indicators: [],
          filterKey: "",
          filterData: []
        },
        {
          name: "任务类型",
          prop: "taskType",
          checked: true,
          isLeaf: false,
          icon: "types",
          originData: [],
          defaultData: [
            // {
            //   id: 2,
            //   label: "流通2"
            // }
          ],
          currentStandard: -1,
          sortStandard: "",
          standards: [
            {
              id: "aa",
              name: "单个任务类型",
              level: 1,
              prop: "taskTypeOne",
              list: []
            }
          ],
          onecheckData: [],
          indicators: [],
          filterKey: "",
          filterData: []
        }
      ];
      for (let i = 0; i < origins.length; i++) {
        origins[i].onecheckData = [
          {
            id: "1",
            label: "数量1",
            prop: "total",
            checked: false
          },
          {
            id: "2",
            label: "数量2",
            prop: "unTotal",
            checked: false
          },
          {
            id: "3",
            label: "数量3",
            prop: "unRatio",
            checked: false
          },
          {
            id: "4",
            label: "数量4",
            prop: "qtotal",
            checked: false
          },
          {
            id: "5",
            label: "数量5",
            prop: "qratio",
            checked: false
          }
        ];
      }
      this.moreMode = origins;

      // let timeObj = {
      //   id: 100,
      //   label: "全部",
      //   level: 0,
      //   children: [
      //     {
      //       id: 1,
      //       label: "2017年",
      //       level: 1,
      //       children: [
      //         {
      //           id: 25,
      //           label: "上半年",
      //           level: 2,
      //           parentId: 1,
      //           children: [
      //             {
      //               id: 26,
      //               label: "1季度",
      //               level: 3,
      //               parentId: 25,
      //               children: [
      //                 {
      //                   id: 2,
      //                   level: 4,
      //                   label: "1月",
      //                   parentId: 26
      //                 },
      //                 {
      //                   id: 3,
      //                   level: 4,
      //                   label: "2月",
      //                   parentId: 26
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       id: 4,
      //       level: 1,
      //       label: "2018年",
      //       parentId: null,
      //       children: [
      //         {
      //           id: 30,
      //           label: "上半年",
      //           level: 2,
      //           parentId: 4,
      //           children: [
      //             {
      //               id: 31,
      //               label: "1季度",
      //               level: 3,
      //               parentId: 30,
      //               children: [
      //                 {
      //                   id: 32,
      //                   level: 4,
      //                   parentId: 31,
      //                   label: "1月"
      //                 },
      //                 {
      //                   id: 33,
      //                   level: 4,
      //                   parentId: 31,
      //                   label: "2月"
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // };
      // for (let i = 0; i < 9; i++) {
      //   timeObj.children[0].children.push({
      //     id: 7 + i,
      //     level: 4,
      //     label: 3 + i + "月"
      //   });
      // }

      // this.moreMode[0].originData = [timeObj];
      let proObj = {
        id: 0,
        level: 0,
        label: "全部",
        children: ClassData.yp_scz_sq
        // children: [
        //   // {
        //   //   id: 3,
        //   //   level: 1,
        //   //   label: "四川省",
        //   //   children: [
        //   //     {
        //   //       id: 4,
        //   //       level: 2,
        //   //       label: "成都市",
        //   //       children: [
        //   //         {
        //   //           id: 6,
        //   //           level: 3,
        //   //           label: "高新区"
        //   //         }
        //   //       ]
        //   //     },
        //   //     {
        //   //       id: 5,
        //   //       level: 2,
        //   //       label: "达州市",
        //   //       children: [
        //   //         {
        //   //           id: 8,
        //   //           level: 3,
        //   //           label: "区1"
        //   //         }
        //   //       ]
        //   //     }
        //   //   ]
        //   // }
        // ]
      };
      // for (let i = 0; i < 20; i++) {
      //   proObj.children[0].children[0].children.push({
      //     id: 30 + i,
      //     level: 3,
      //     label: "高新区" + i
      //   });
      // }
      this.moreMode[2].originData = [proObj];
      this.moreMode[2].filterKey = "yp_scz_sq";
      this.searchList = [
        {
          type: "label1",
          label: "标签1",
          list: ["全部", "类型1", "类型2", "类型3"]
        },
        {
          type: "label2",
          label: "标签2",
          list: ["全部", "类型1", "类型2", "类型3"]
        },
        {
          type: "label3",
          label: "标签3",
          list: ["全部", "状态1", "状态2", "状态3"]
        }
      ];
      let obj = {
        id: this.getId(),
        label: "大类1",
        level: 1,
        children: [
          // {
          //   id: 2,
          //   label: "亚类1",
          //   level: 2,
          //   children: [
          //     {
          //       id: 5,
          //       label: "次亚类1",
          //       level: 3,
          //       children: [
          //         {
          //           id: 9,
          //           label: "细类1",
          //           level: 4
          //         },
          //         {
          //           id: 10,
          //           label: "细类2",
          //           level: 4
          //         }
          //       ]
          //     }
          //   ]
          // },
          // {
          //   id: 20,
          //   label: "亚类2",
          //   level: 2,
          //   children: [
          //     {
          //       id: 11,
          //       label: "次亚类2",
          //       level: 3,
          //       children: [
          //         {
          //           id: 12,
          //           label: "细类3",
          //           level: 4
          //         },
          //         {
          //           id: 13,
          //           label: "细类4",
          //           level: 4
          //         }
          //       ]
          //     },
          //     {
          //       id: 14,
          //       label: "次亚类3",
          //       level: 3,
          //       children: [
          //         {
          //           id: 15,
          //           label: "细类5",
          //           level: 4
          //         },
          //         {
          //           id: 16,
          //           label: "细类6",
          //           level: 4
          //         }
          //       ]
          //     }
          //   ]
          // },
          // {
          //   id: 30,
          //   label: "亚类3",
          //   level: 2,
          //   children: [
          //     {
          //       id: 31,
          //       label: "次亚类4",
          //       level: 3,
          //       children: [
          //         {
          //           id: 32,
          //           label: "细类7",
          //           level: 4
          //         },
          //         {
          //           id: 33,
          //           label: "细类8",
          //           level: 4
          //         }
          //       ]
          //     },
          //     {
          //       id: 34,
          //       label: "次亚类5",
          //       level: 3,
          //       children: [
          //         {
          //           id: 35,
          //           label: "细类9",
          //           level: 4
          //         },
          //         {
          //           id: 36,
          //           label: "细类10",
          //           level: 4
          //         }
          //       ]
          //     }
          //   ]
          // }
          // {
          //   id: 3,
          //   label: "亚类3",
          //   level: 2
          // },
          // {
          //   id: 4,
          //   label: "亚类4",
          //   level: 2
          // }
        ]
      };
      // for (let i = 0; i < 10; i++) {
      //   let id = this.getId();
      //   obj.children.push({
      //     id: id,
      //     level: 2,
      //     label: "亚类" + id,
      //     children: []
      //   });
      //   for (let j = 0; j < 10; j++) {
      //     let inId = this.getId();
      //     obj.children[i].children.push({
      //       id: inId,
      //       label: "次亚类" + inId,
      //       level: 3,
      //       children: []
      //     });
      //     for (let k = 0; k < 10; k++) {
      //       let innerId = this.getId();
      //       obj.children[i].children[j].children.push({
      //         id: innerId,
      //         level: 4,
      //         label: "细类" + innerId
      //       });
      //     }
      //   }
      // }
      this.level = 1;
      this.moreMode[1].originData = [
        {
          id: 0,
          label: "全部",
          level: 0,
          children: ClassData.yp_fl_xl_bh
        }
      ];
      this.moreMode[1].filterKey = "yp_fl_xl_bh";
      console.log(this.moreMode[1].originData);
      // console.log(JSON.stringify(this.moreMode[1].originData));
      // console.log(this.moreMode[2]);
      this.moreMode[3].originData = [
        {
          id: "0",
          label: "全部",
          children: ClassData.jy_xm_bh
          // level: 0,
          // children: [
          //   {
          //     id: '0',
          //     label: "品类大类",
          //     // level: 1,
          //     children: [
          //       {
          //         id: 2,
          //         // level: 2,
          //         label: "品类大类"
          //       },
          //       {
          //         id: 3,
          //         // level: 2,
          //         label: "品类次类2"
          //       }
          //     ]
          //   },
          //   {
          //     id: 4,
          //     label: "品类大类1",
          //     // level: 1,
          //     children: [
          //       {
          //         id: 5,
          //         label: "品类大类1"
          //         // level: 2
          //       },
          //       {
          //         id: 6,
          //         label: "品类次类4"
          //         // level: 2
          //       }
          //     ]
          //   }
          // ]
        }
      ];
      this.moreMode[3].filterKey = "jy_xm_bh";
      this.moreMode[4].originData = ClassData.yp_hj_new;
      this.moreMode[4].filterKey = "yp_hj_new";
      // [
      //   {
      //     id: 1,
      //     label: "流通"
      //   },
      //   {
      //     id: 2,
      //     label: "流通2"
      //   }
      // ];
      // for (let i = 0; i < 500; i++) {
      //   this.moreMode[2].originData[1].children.push({
      //     id: 3000 + i,
      //     label: "亚类" + 600 + i,
      //     children: []
      //   });
      //   for (let j = 0; j < 500; j++) {
      //     this.moreMode[2].originData[1].children[i].children.push({
      //       id: 5000 + j,
      //       label: "亚类" + 5000 + j
      //     });
      //   }
      // }
      // this.checkMore();
      // this.getDatas();
    }, 500);
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    handleClose() {},
    copyMode(row) {},
    viewMode(row) {},
    useMode(row) {},
    deleteMode(row) {},
    changeCheckMore() {
      this.moreMode[this.currentMode].indicators = [];
      // for (
      //   let i = 0;
      //   i < this.moreMode[this.currentMode].selectCheck.length;
      //   i++
      // ) {
      //   for (
      //     let j = 0;
      //     j < this.moreMode[this.currentMode].onecheckData.length;
      //     j++
      //   ) {
      //     if (
      //       this.moreMode[this.currentMode].onecheckData[j].label ==
      //       this.moreMode[this.currentMode].selectCheck[i]
      //     ) {
      //       this.moreMode[this.currentMode].indicators.push({
      //         ...this.moreMode[this.currentMode].onecheckData[j]
      //       });
      //       break;
      //     }
      //   }
      // }
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
    changeTotal() {
      this.checkMore();
    },
    changeTime() {
      // this.moreMode[0].currentStandard = -1;
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
        let keyArr = ["halfYear", "season", "month"];
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
          if (keyArr[h] == "halfYear") {
            value = halfYear;
          } else if (keyArr[h] == "season") {
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
      this.moreMode[0].filterKey = "time";
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
      if (this.oneModeColumn.length > 0) {
        this.getDatas();
      } else {
        this.$message.warning("请先设置筛选数据和统计维度！");
      }
    },
    reset() {
      this.tableData = [];
      this.resultTree = {};
      for (let i = 0; i < this.moreMode.length; i++) {
        this.moreMode[i].defaultData = [];
        let refName = this.moreMode[i].prop + "TreeRefs";
        for (let j = 0; j < this.moreMode[i].standards.length; j++) {
          this.moreMode[i].standards[j].list = [];
        }
        if (this.moreMode[i].prop == "links") {
          this.$refs[refName][0].reset();
        } else if (this.moreMode[i].prop == "time") {
          this.timeRange = "";
        } else {
          this.$refs[refName][0].reset();
        }
      }
      for (let i = 0; i < this.onecheckData.length; i++) {
        this.onecheckData[i].checked = false;
      }
      // this.$refs.innerTreeRefs.reset();
    },
    resetMode() {
      this.tableData = [];
      this.modeColspan = {};
      this.showSummary = false;
      for (let i = 0; i < this.moreMode.length; i++) {
        this.moreMode[i].currentStandard = -1;
        for (let j = 0; j < this.moreMode[i].onecheckData.length; j++) {
          this.moreMode[i].onecheckData[j].checked = false;
        }
      }
    },
    changeMode(index) {
      this.currentMode = index;
    },
    selectDown(arr, modeType, filterArr) {
      let index = 0;
      for (let i = 0; i < this.moreMode.length; i++) {
        if (this.moreMode[i].prop == modeType) {
          index = i;
          break;
        }
      }
      if (this.moreMode[index].prop != "links") {
        this.moreMode[index].filterData = [...filterArr];
      } else {
        for (let i = 0; i < filterArr.length; i++) {
          this.moreMode[index].filterData.push(filterArr[i].label);
        }
      }

      // this.moreMode[index].currentStandard = -1;
      for (let i = 0; i < this.moreMode[index].standards.length; i++) {
        this.moreMode[index].standards[i].list = [];
        let obj = this.moreMode[index].standards[i];
        if (this.moreMode[index].prop != "links") {
          for (let j = 0; j < arr.length; j++) {
            if (obj.level == arr[j].level) {
              let inObj = {
                id: arr[j].id,
                level: arr[j].level,
                dimValue: arr[j].label,
                dimName: obj.prop
              };
              if (this.moreMode[index].prop == "time") {
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
        // let arr = [...JSON.parse(children)];
        // if(node.level == 1){
        //   arr = children
        // } else {

        // }
        let origin = JSON.parse(children);
        let arr = [];

        if (linkParent) {
          for (let j = 0; j < origin.length; j++) {
            if (node.id == origin[j].parentId) {
              arr.push({ ...origin[j] });
            }
          }
          // arr = arr.filter(function(item) {
          //   return node.id == item.parentId;
          // });
        } else {
          arr = JSON.parse(children);
        }
        // console.log([...arr]);
        // console.log(arr);
        node.dataList = arr;
        // node.colsLevel = this.colsLevel;
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
    getTableDataa(node) {
      if (!node) {
        return;
      }
      if (node.children && node.children.length != 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.obj[node.children[i].prop] = node.children[i].name;
          this.getTableDataa(node.children[i]);
        }
      } else {
        if (node.name != "start") {
          this.tableData.push({ ...this.obj });
        }
      }
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
          // let len = this.calculateTotalLen(node.dataList[i], 1);
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
    getNodeInTree(node, label) {
      if (node.dimValue == label) {
        return node;
      } else if (node.dataList != null) {
        let i = 0;
        let result = null;
        for (i = 0; result == null && i < node.dataList.length; i++) {
          result = this.getNodeInTree(node.dataList[i], label);
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
            if (this.oneModeColumn[i].prop == "time") {
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
      // console.log(this.getNodeInTree(this.resultTree, "2018年"));
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
                    this.tableData[w][allStandards[k].prop]
                  )
                };
              } else {
                node = this.getNodeInTree(
                  { ...this.resultTree },
                  this.tableData[w][allStandards[0].prop]
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
      if (this.moreMode[0].currentStandard > 0) {
        start = 1;
      }
      for (let key in this.modeColspan) {
        index = parseInt(key);
      }

      for (let i = 0; i < this.moreMode.length; i++) {
        let flag = false;
        for (let j = 0; j < this.moreMode[i].standards.length; j++) {
          if (this.moreMode[i].standards[j].list.length > 0) {
            flag = true;
            break;
          } else {
            flag = false;
          }
        }
        if (flag && this.moreMode[i].currentStandard > -1) {
          for (let k = 0; k < this.moreMode[i].indicators.length; k++) {
            index++;
            this.modeColspan[index] = { ...this.modeColspan[start] };
          }
          start++;
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
      this.obj = {};
      this.tableData = [];
      this.modeColspan = {};
      this.resultTree = {
        id: "0",
        name: "start"
      };
      // params
      let params = {};
      params.list = [];
      params.filterObj = {};
      params.showTotal = this.showSummary;
      for (let i = 0; i < this.moreMode.length; i++) {
        let flag = false;
        for (let j = 0; j < this.moreMode[i].standards.length; j++) {
          if (this.moreMode[i].standards[j].list.length > 0) {
            flag = true;
            break;
          } else {
            flag = false;
          }
        }
        if (flag && this.moreMode[i].currentStandard > -1) {
          let indicators = [];
          let indicatorsIds = [];
          let filterData = [];

          if (this.moreMode[i].filterKey != "") {
            params.filterObj[this.moreMode[i].filterKey] = this.moreMode[
              i
            ].filterData;
          }
          for (let k = 0; k < this.moreMode[i].indicators.length; k++) {
            indicators.push(this.moreMode[i].indicators[k].label);
            indicatorsIds.push(this.moreMode[i].indicators[k].id);
          }
          // if (this.moreMode[i].filterData.length > 0) {
          //   filterData =
          //     this.moreMode[i].filterData[0].label == "全部"
          //       ? []
          //       : this.moreMode[i].filterData;
          // }
          params.list.push({
            dimensionName: this.moreMode[i].name,
            dimensionLevel: this.moreMode[i].standards[
              this.moreMode[i].currentStandard
            ].name,
            dimensionLevelId: this.moreMode[i].standards[
              this.moreMode[i].currentStandard
            ].id,
            indicators: indicators,
            indicatorsIds: indicatorsIds
            // sort: this.moreMode[i].sortStandard
          });
        }
      }

      console.log(params);

      this.resultTree.dataList = this.originData;
      this.getTableData({ ...this.resultTree });
      this.getMoreColspanb();
      this.getStandardsColspan();
    },
    checkMore() {
      this.showMaxtips = false;
      let totalLen = this.tableData.length;
      this.obj = {};
      this.tableData = [];
      this.modeColspan = {};
      this.leafNodesLen = 0;
      // this.$nextTick(() => {
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
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].checked) {
            // console.log(arr[i].currentStandard);
            if (arr[i].prop != "time") {
              for (let j = 0; j < arr[i].standards.length; j++) {
                if (j == parseInt(arr[i].currentStandard)) {
                  if (arr[i].standards[j].list.length > 0) {
                    let linkParent = false;
                    // if (j > 0) {
                    //   linkParent = true;
                    // }
                    if (arr[i].standards[j].list.length >= this.maxLen) {
                      // this.moreMode[this.currentMode].currentStandard = -1;
                      this.showMaxtips = true;
                      // this.$message.warning(
                      //   `显示数据大于${this.maxLen}行，请导出查看！`
                      // );
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
                      // this.moreMode[this.currentMode].currentStandard = -1;
                      this.showMaxtips = true;
                      // this.$message.warning(
                      //   `显示数据大于${this.maxLen}行，请导出查看！`
                      // );
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
        // console.log(this.resultTree);
        this.getTableData({ ...this.resultTree });
        this.getMoreColspanb();
        this.getStandardsColspan();
      }
      this.tableData.push({
        year: "合计"
      });
    },

    unique(arr, timeFlag) {
      var hash = [];
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (!timeFlag) {
            if (arr[i].dimValue === arr[j].dimValue) {
              ++i;
            }
          } else {
            if (
              arr[i].dimValue === arr[j].dimValue &&
              arr[i].parentId == arr[j].parentId
            ) {
              ++i;
            }
          }
        }
        hash.push(arr[i]);
      }
      return hash;
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
        // {
        //   dimName: "halfYear",
        //   dimValue: "半年",
        //   total: 300,
        //   unTotal: 5
        // },
        // {
        //   dimName: "categories",
        //   dimValue: "食品品类",
        //   total: 300,
        //   unTotal: 5
        // }
      ];
      let obj = {};
      for (let i = 0; i < totalData.length; i++) {
        let start = totalData[i].dimName;
        for (let key in totalData[i]) {
          if (key != "dimName" && key != "dimValue") {
            obj[start + key] = totalData[i][key];
          }
        }
      }
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        // console.log(column);
        const values = data.map(item => Number(item[column.property]));
        // if (!values.every(value => isNaN(value))) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return prev + curr;
        //     } else {
        //       return prev;
        //     }
        //   }, 0);
        //   sums[index] += " 元";
        // } else {
        //   sums[index] = "";
        // }
        if (!isNaN(Number(obj[column.property]))) {
          sums[index] = obj[column.property];
        } else {
          sums[index] = "";
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
      this.modeData = [
        {
          nums: 1,
          name: "模板名称",
          createTime: "2018-02-02"
        }
      ];
    },
    addLevel(node, levelObj) {
      // node.level = this.level;
      if (node.children && node.children.length > 0) {
        // this.level++;
        for (let i = 0; i < node.children.length; i++) {
          node.children[i].level = this.level;
          this.addLevel(node.children[i]);
        }
      }
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
#analyze {
  background: #f5f5f5;
  width: 100%;
  .out-container {
    // height: auto;
    padding: 20px;
    width: calc(100% - 40px);
    .out-box {
      background: #fff;
      overflow: hidden;
      width: 100%;
      margin: 20px auto;
      padding: 20px 0;
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
          background: #eee;
          transform: translateY(-50%);
        }
      }
      .mid {
        float: left;
        width: calc(100% - 380px);
        .tabs-item {
          float: left;
          width: 200px;
          line-height: 40px;
          margin: 10px;
          &.timerange {
            width: auto;
          }
        }
        .in-tab {
          overflow: hidden;
          height: 50px;
          line-height: 50px;
          .in-item {
            float: left;
            margin-right: 30px;
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
          }
        }
      }
      .right {
        // position: absolute;
        // top: 20px;
        // right: 0;
        float: right;
        width: 200px;
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

