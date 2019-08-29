<template>
  <div id="analyze">
    <div class="out-container">
      <div class="out-box filter-data">
        <div class="left">筛选数据</div>
        <div class="mid">
          <div class="tabs-item" v-for="(item, index) in moreMode" :key="'onemode'+index">
            <down-tree
              @downTree="selectDown"
              :isLeaf="item.isLeaf"
              :splitStr="item.splitStr"
              :showFullName="item.showFullName"
              :datas="item.originData"
              :defaultData="item.defaultData"
              :modeType="item.prop"
              icon="list"
              :ref="item.prop+'TreeRefs'"
              :placeholder="'请选择'+item.name"
              v-if="item.prop != 'links'"
            ></down-tree>
            <more-checkbox
              :title="'选择环节'"
              :allData="item.originData"
              :defaultData="item.defaultData"
              :propsName="item.prop"
              :ref="item.prop+'TreeRefs'"
              @backLinks="selectDown"
              v-if="item.prop == 'links'"
            ></more-checkbox>
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
            >{{item.name}}</div>
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
            <!-- <div
            
          >
            <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
            </div>-->
            <!-- -->
            <el-radio-group v-model="moreMode[currentMode].currentStandard" @change="checkMore">
              <el-radio
                :label="index"
                class="in-item"
                v-for="(item, index) in moreMode[currentMode].standards"
                :key="'initem'+index"
              >{{item.name}}</el-radio>
              <!-- <el-radio :label="6">备选项</el-radio>
              <el-radio :label="9">备选项</el-radio>-->
            </el-radio-group>
          </div>
          <div class="in-tab">
            <div class="in-item in-title">统计指标：</div>
            <div
              class="in-item"
              v-for="(item, index) in moreMode[currentMode].onecheckData"
              :key="'onecheckData'+index"
            >
              <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
            </div>
          </div>
        </div>
        <div class="right">
          <el-button @click="reset" class="btns">设置</el-button>
          <el-button @click="reset" class="btns">重置</el-button>
          <el-button @click="reset" class="btns">模板管理</el-button>
        </div>
      </div>
      <div class="out-box">
        <div class="table-result">
          <div class="left">预览报表结果</div>
          <!-- <div class="mid"></div> -->
          <div class="right">
            <el-button>查询</el-button>
            <el-button>导出</el-button>
          </div>
        </div>

        <div class="titles">
          <div class="title-box">
            <span>请输入标题：</span>
            <el-input v-model="tableTitle" class="table-title"></el-input>
          </div>
        </div>
        <div class="table-box">
          <!--  -->
          <el-table :data="tableData" :span-method="objectSpanMethod" border>
            <el-table-column
              :label="item.name"
              min-width="150"
              v-for="(item,index) in oneModeColumn"
              :key="'defaultmode'+index"
            >
              <el-table-column
                :prop="itema.prop"
                :label="itema.name"
                min-width="150"
                v-for="(itema,indexa) in item.standards"
                v-if="indexa<=item.currentStandard"
                :key="'standardmode'+indexa"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              v-for="(item,index) in oneModeColumn"
              :label="item.name"
              align="center"
              v-if="onecheckDataColumn.length>0"
              :key="'defaultmodea'+index"
            >
              <el-table-column
                :prop="item.prop + itema.prop"
                :label="itema.label"
                min-width="150"
                v-for="(itema,indexa) in onecheckDataColumn"
                :key="'defaultmodeb'+indexa"
              ></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <div class="out-box"></div> -->
    </div>
  </div>
</template>
<script>
import DownTree from "@/components/DownTree/index1";
import MoreCheckbox from "@/components/MoreCheckbox/index";
import SourceTree from "@/assets/treeData.json";
export default {
  data() {
    return {
      tableTitle: "",
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
      // twoChecklist: [],
      // checkObj: {
      //   pass: "合格率",
      //   nopass: "不合格率",
      //   passsum: "总合格率",
      //   nopasssum: "总不合格率"
      // },
      // "total": 480,
      // "unTotal": 0,
      // "unRatio": 0,
      // "qtotal": 480,
      // "qratio": 100
      onecheckData: [
        {
          label: "数量1",
          prop: "total",
          checked: true
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
          defaultData: [
            // {
            //   id: 1,
            //   label: "2017年"
            // }
          ],
          currentStandard: -1,
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
          ]
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
          ]
        },
        {
          name: "监测区域",
          prop: "area",
          checked: true,
          isLeaf: false,
          splitStr: "/",
          showFullName: true,
          originData: [],
          defaultData: [],
          currentStandard: -1,
          standards: [
            // {
            //   name: "国家",
            //   level: 1,
            //   prop: "all",
            //   list: [
            //     // {
            //     //   id: "a1",
            //     //   prop: "all",
            //     //   name: "全国"
            //     // }
            //   ]
            // },
            {
              name: "省份",
              level: 1,
              prop: "province",
              list: [
                // {
                //   id: "a1",
                //   prop: "province",
                //   name: "四川省"
                // }
              ]
            },
            {
              name: "地市",
              level: 2,
              prop: "city",
              list: [
                // {
                //   id: "a1",
                //   dimName: "city",
                //   level: 2,
                //   dimValue: "成都市"
                // }
              ]
            },
            {
              name: "区/县",
              level: 3,
              prop: "inarea",
              list: [
                // {
                //   id: "a1",
                //   dimName: "inarea",
                //   level: 3,
                //   dimValue: "高新区"
                // }
              ]
            }
          ],
          list: [
            // {
            //   id: "b1",
            //   prop: "area",
            //   name: "高新区"
            // },
            // {
            //   id: "b2",
            //   prop: "area",
            //   name: "武侯区"
            // }
          ]
        },
        {
          name: "检测项目",
          prop: "inner",
          checked: true,
          isLeaf: false,
          showFullName: true,
          splitStr: "/",
          originData: [],
          currentStandard: -1,
          // 检测项目类别、单个检测项目
          defaultData: [
            // {
            //   id: 2,
            //   label: "品类次类"
            // },
            // {
            //   id: 3,
            //   label: "品类次类2"
            // }
          ],
          standards: [
            {
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
          ]
        },
        {
          name: "抽检环节",
          prop: "links",
          checked: true,
          isLeaf: true,
          originData: [],
          defaultData: [
            // {
            //   id: 2,
            //   label: "流通2"
            // }
          ],
          currentStandard: -1,
          standards: [
            {
              name: "单个抽检环节",
              level: 1,
              prop: "linksOne",
              list: []
            }
          ]
        },
        {
          name: "任务来源",
          prop: "taskFrom",
          checked: true,
          isLeaf: false,
          originData: [],
          defaultData: [
            // {
            //   id: 2,
            //   label: "流通2"
            // }
          ],
          currentStandard: -1,
          standards: [
            {
              name: "单个检测项目",
              level: 1,
              prop: "taskFromOne",
              list: []
            }
          ]
        },
        {
          name: "任务类型",
          prop: "taskType",
          checked: true,
          isLeaf: false,
          originData: [],
          defaultData: [
            // {
            //   id: 2,
            //   label: "流通2"
            // }
          ],
          currentStandard: -1,
          standards: [
            {
              name: "单个任务类型",
              level: 1,
              prop: "taskTypeOne",
              list: []
            }
          ]
        }
      ],
      colsArr: [],
      num: 20,
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
          id: "a",
          name: "2017",
          prop: "time",
          totalCount: 20000,
          otherCount: 10000,
          children: [
            {
              id: "ab",
              name: "高新区",
              prop: "area",
              totalCount: "--",
              otherCount: "--",
              children: [
                {
                  id: "abc",
                  name: "维度3",
                  prop: "item",
                  totalCount: 300,
                  otherCount: 400,
                  children: [
                    {
                      id: "abcd",
                      name: "维度4",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600,
                      children: [
                        {
                          id: "abcd",
                          name: "环节",
                          prop: "links",
                          totalCount: 500,
                          otherCount: 600,
                          children: null
                        }
                      ]
                    },
                    {
                      id: "abcd",
                      name: "维度42",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600,
                      children: [
                        {
                          id: "abcd",
                          name: "环节",
                          prop: "links",
                          totalCount: 500,
                          otherCount: 600,
                          children: null
                        }
                      ]
                      // children: null
                    }
                  ]
                }
              ]
            },
            {
              id: "ae",
              name: "武侯区",
              prop: "area",
              totalCount: 300,
              otherCount: 400,
              children: [
                {
                  id: "abc",
                  name: "维度3",
                  prop: "item",
                  totalCount: 700,
                  otherCount: 800,
                  children: [
                    {
                      id: "abcd",
                      name: "维度4",
                      prop: "inner",
                      totalCount: 900,
                      otherCount: 200
                      // children: null
                    },
                    {
                      id: "abcd",
                      name: "维度42",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600
                      // children: null
                    }
                  ]
                }
              ]
            },
            {
              id: "ae",
              name: "双流区",
              prop: "area",
              totalCount: 300,
              otherCount: 400,
              children: [
                {
                  id: "abc",
                  name: "维度3",
                  prop: "item",
                  totalCount: 700,
                  otherCount: 800,
                  children: [
                    {
                      id: "abcd",
                      name: "维度4",
                      prop: "inner",
                      totalCount: 900,
                      otherCount: 200
                      // children: null
                    },
                    {
                      id: "abcd",
                      name: "维度42",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600
                      // children: null
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "a",
          name: "2018",
          prop: "time",
          totalCount: 30000,
          otherCount: 40000,
          children: [
            {
              id: "ab",
              name: "高新区",
              prop: "area",
              totalCount: 9123,
              otherCount: 7896,
              children: [
                {
                  id: "abc",
                  name: "维度3",
                  prop: "item",
                  totalCount: 5344,
                  otherCount: 4680,
                  children: [
                    {
                      id: "abcd",
                      name: "维度4",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600,
                      children: [
                        {
                          id: "abcd",
                          name: "环节",
                          prop: "links",
                          totalCount: 500,
                          otherCount: 600,
                          children: null
                        }
                      ]
                    },
                    {
                      id: "abcd",
                      name: "维度42",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600,
                      children: [
                        {
                          id: "abcd",
                          name: "环节",
                          prop: "links",
                          totalCount: 500,
                          otherCount: 600,
                          children: null
                        }
                      ]
                      // children: null
                    }
                  ]
                }
              ]
            },
            {
              id: "ae",
              name: "武侯区",
              prop: "area",
              totalCount: 300,
              otherCount: 400,
              children: [
                {
                  id: "abc",
                  name: "维度3",
                  prop: "item",
                  totalCount: 700,
                  otherCount: 800,
                  children: [
                    {
                      id: "abcd",
                      name: "维度4",
                      prop: "inner",
                      totalCount: 900,
                      otherCount: 200
                      // children: null
                    },
                    {
                      id: "abcd",
                      name: "维度42",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600
                      // children: null
                    }
                  ]
                }
              ]
            },
            {
              id: "ae",
              name: "双流区",
              prop: "area",
              totalCount: 300,
              otherCount: 400,
              children: [
                {
                  id: "abc",
                  name: "维度3",
                  prop: "item",
                  totalCount: 700,
                  otherCount: 800,
                  children: [
                    {
                      id: "abcd",
                      name: "维度4",
                      prop: "inner",
                      totalCount: 900,
                      otherCount: 200
                      // children: null
                    },
                    {
                      id: "abcd",
                      name: "维度42",
                      prop: "inner",
                      totalCount: 500,
                      otherCount: 600
                      // children: null
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      leafNodesLen: 0,
      oneId: 1,
      maxLen: 1000
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
    },
    onecheckDataColumn() {
      return this.onecheckData.filter(function(item) {
        return item.checked;
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
    let timeObj = {
      id: 100,
      label: "全部",
      level: 0,
      children: [
        {
          id: 1,
          label: "2017年",
          level: 1,
          children: [
            {
              id: 25,
              label: "上半年",
              level: 2,
              children: [
                {
                  id: 26,
                  label: "1季度",
                  level: 3,
                  children: [
                    {
                      id: 2,
                      level: 4,
                      label: "1月"
                    },
                    {
                      id: 3,
                      level: 4,
                      label: "2月"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 4,
          level: 1,
          label: "2018年",
          children: [
            {
              id: 30,
              label: "上半年",
              level: 2,
              children: [
                {
                  id: 31,
                  label: "1季度",
                  level: 3,
                  children: [
                    {
                      id: 32,
                      level: 4,
                      label: "1月"
                    },
                    {
                      id: 33,
                      level: 4,
                      label: "2月"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    // for (let i = 0; i < 9; i++) {
    //   timeObj.children[0].children.push({
    //     id: 7 + i,
    //     level: 4,
    //     label: 3 + i + "月"
    //   });
    // }

    this.moreMode[0].originData = [timeObj];
    let proObj = {
      id: 3,
      level: 1,
      label: "四川省",
      children: [
        {
          id: 4,
          level: 2,
          label: "成都市",
          children: [
            {
              id: 6,
              level: 3,
              label: "高新区"
            }
          ]
        },
        {
          id: 5,
          level: 2,
          label: "达州市",
          children: [
            {
              id: 8,
              level: 3,
              label: "区1"
            }
          ]
        }
      ]
    };
    for (let i = 0; i < 20; i++) {
      proObj.children[0].children.push({
        id: 30 + i,
        level: 3,
        label: "高新区" + i
      });
    }
    this.moreMode[2].originData = [proObj];
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
    for (let i = 0; i < 2; i++) {
      let id = this.getId();
      obj.children.push({
        id: id,
        level: 2,
        label: "亚类" + id,
        children: []
      });
      for (let j = 0; j < 2; j++) {
        let inId = this.getId();
        obj.children[i].children.push({
          id: inId,
          label: "次亚类" + inId,
          level: 3,
          children: []
        });
        for (let k = 0; k < 2; k++) {
          let innerId = this.getId();
          obj.children[i].children[j].children.push({
            id: innerId,
            level: 4,
            label: "细类" + innerId
          });
        }
      }
    }
    this.moreMode[1].originData = [obj];
    // console.log(JSON.stringify(this.moreMode[1].originData));
    // console.log(this.moreMode[2]);
    this.moreMode[3].originData = [
      {
        id: 100,
        label: "全部",
        level: 0,
        children: [
          {
            id: 1,
            label: "品类大类",
            level: 1,
            children: [
              {
                id: 2,
                level: 2,
                label: "品类次类"
              },
              {
                id: 3,
                level: 2,
                label: "品类次类2"
              }
            ]
          },
          {
            id: 4,
            label: "品类大类1",
            level: 1,
            children: [
              {
                id: 5,
                label: "品类次类3",
                level: 2
              },
              {
                id: 6,
                label: "品类次类4",
                level: 2
              }
            ]
          }
        ]
      }
    ];
    this.moreMode[4].originData = [
      {
        id: 1,
        label: "流通"
      },
      {
        id: 2,
        label: "流通2"
      }
    ];
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
  },
  methods: {
    getId() {
      this.oneId++;
      return this.oneId;
    },
    search() {
      this.getDatas();
    },
    reset() {
      for (let i = 0; i < this.moreMode.length; i++) {
        this.moreMode[i].list = [];
        this.moreMode[i].defaultData = [];
        let refName = this.moreMode[i].prop + "TreeRefs";
        if (this.moreMode[i].prop != "links") {
          this.$refs[refName][0].reset();
        } else {
          this.$refs[refName].reset();
        }
      }
      for (let i = 0; i < this.onecheckData.length; i++) {
        this.onecheckData[i].checked = false;
      }
      // this.$refs.innerTreeRefs.reset();
    },
    changeMode(index) {
      this.currentMode = index;
    },
    selectDown(arr, modeType) {
      let index = 0;
      // console.log(arr);
      // console.log(modeType);
      for (let i = 0; i < this.moreMode.length; i++) {
        if (this.moreMode[i].prop == modeType) {
          index = i;
          break;
        }
      }
      this.moreMode[index].currentStandard = -1;
      for (let i = 0; i < this.moreMode[index].standards.length; i++) {
        this.moreMode[index].standards[i].list = [];
        let obj = this.moreMode[index].standards[i];
        if (this.moreMode[index].prop != "links") {
          for (let j = 0; j < arr.length; j++) {
            if (obj.level == arr[j].level) {
              this.moreMode[index].standards[i].list.push({
                id: arr[j].id,
                level: arr[j].level,
                dimValue: arr[j].label,
                dimName: obj.prop,
                parentId: arr[j].parentId
              });
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
      this.checkMore();
      // console.log(this.moreMode);
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
      if (node.dataList != null) {
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
          if (
            this.oneModeColumn[i].standards[j].list.length > 0 &&
            j <= this.oneModeColumn[i].currentStandard
          ) {
            allStandards.push({
              name: this.oneModeColumn[i].standards[j].name,
              prop: this.oneModeColumn[i].standards[j].prop
            });
          }
        }
      }
      // console.log(this.tableData);
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
      // console.log(this.modeColspan);
    },
    getLeafNodesLength(node) {
      if (node.dataList != null) {
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
    addW() {
      this.num++;
      this.moreMode.push({
        name: "维度" + this.num,
        prop: "oneia" + this.num,
        list: [
          {
            id: "c1" + this.num,
            prop: "oneia" + this.num,
            name: this.num + "10维1"
          },
          {
            id: "c2" + this.num,
            prop: "oneia" + this.num,
            name: this.num + "10维2"
          }
        ]
      });
    },
    getDatas() {
      this.tableData = [];
      this.resultTree = {
        id: "0",
        name: "start"
      };
      this.resultTree.dataList = SourceTree;
      this.getTableData({ ...this.resultTree });
      this.getMoreColspanb();
    },
    checkMore() {
      let totalLen = this.tableData.length;
      console.log(totalLen);
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
            for (let j = 0; j < arr[i].standards.length; j++) {
              if (j <= parseInt(arr[i].currentStandard)) {
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
        this.getTableData({ ...this.resultTree });
        this.getMoreColspanb();
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
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
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
        width: 200px;
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
        width: calc(100% - 400px);
        .tabs-item {
          float: left;
          width: 200px;
          line-height: 40px;
          margin: 10px;
        }
        .in-tab {
          overflow: hidden;
          height: 50px;
          line-height: 50px;
          .in-item {
            float: left;
            margin-right: 30px;
            &.active {
              color: blue;
            }
            &.in-title {
              width: 90px;
              text-align: right;
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
      }
    }
  }
}
</style>

