<template>
  <div id="analyze">
    <div class="out-box">
      <div class="left">
        <div class="box">
          <div class="item">
            <div class="line">
              <div class="title">维度：</div>
              <div class="tabs">
                <el-select v-model="currentMode">
                  <el-option
                    v-for="(item, index) in allMode"
                    :label="item.name"
                    :value="item.value"
                    @click.native="changeMode(item)"
                    :key="'allmode'+index"
                  >{{item.name}}</el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="item">
            <div class="line">
              <div class="title">统计维度：</div>
              <div class="tabs">
                <!-- <div class="tabs-item">
                  <DateSelect />
                </div>-->
                <div class="tabs-item" v-for="(item, index) in moreModea" :key="'onemode'+index">
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
                  ></down-tree>
                </div>
                <div class="tabs-item">
                  <more-checkbox
                    :title="'选择环节'"
                    :allData="linksMode[0].originData"
                    :defaultData="linksMode[0].defaultData"
                    :propsName="linksMode[0].prop"
                    :ref="linksMode[0].prop+'TreeRefs'"
                    @backLinks="selectDown"
                  ></more-checkbox>
                </div>
              </div>
            </div>
            <div class="line">
              <div class="title">统计指标：</div>
              <div class="tabs">
                <div
                  class="tabs-item"
                  v-for="(item,index) in onecheckData"
                  :key="'onecheckdata'+index"
                >
                  <el-checkbox
                    :label="item.prop"
                    :key="'checkone'+index"
                    v-model="item.checked"
                    @change="changeTwo"
                  >{{item.label}}</el-checkbox>
                </div>
              </div>
            </div>
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
      <!-- <Search :list="searchList" /> -->
    </div>

    <div class="tables">
      <div class="titles">
        <div class="left">title</div>
        <div class="right">
          <el-button @click="search" class="btns">查询</el-button>
        </div>
      </div>
      <el-table :data="tableData" :span-method="objectSpanMethod" border>
        <!-- :summary-method="getSummaries"
        show-summary-->
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
            v-if="itema.list.length>0"
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
</template>
<script>
import DownTree from "@/components/DownTree/index1";
import MoreCheckbox from "@/components/MoreCheckbox/index";
import DateSelect from "@/components/DateSelect/DateSelect";
import Search from "@/components/Search/index";
import SourceTree from "@/assets/treeData.json";
export default {
  data() {
    return {
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
          name: "时间",
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
          standards: [
            {
              name: "年度",
              level: 1,
              prop: "year",
              list: [
                {
                  id: "a1",
                  dimName: "year",
                  level: 1,
                  dimValue: "2017"
                }
              ]
            },
            {
              name: "半年",
              level: 2,
              prop: "halfYear",
              list: [
                {
                  id: "a1",
                  dimName: "halfYear",
                  level: 2,
                  dimValue: "上半年"
                }
              ]
            },
            {
              name: "季度",
              level: 3,
              prop: "season",
              list: [
                {
                  id: "a1",
                  dimName: "season",
                  level: 3,
                  dimValue: "1季度"
                }
              ]
            },
            {
              name: "月度",
              level: 4,
              prop: "month",
              list: [
                {
                  id: "a1",
                  dimName: "month",
                  level: 4,
                  dimValue: "1月"
                }
              ]
            }
          ],
          list: [
            {
              id: "a1",
              prop: "time",
              name: "2017"
            }
          ]
          // standardsList: [{

          // }]
        },
        {
          name: "区域",
          prop: "area",
          checked: true,
          isLeaf: false,
          splitStr: "/",
          showFullName: true,
          originData: [],
          defaultData: [],
          standards: [
            {
              name: "国家",
              level: 1,
              prop: "all",
              list: [
                // {
                //   id: "a1",
                //   prop: "all",
                //   name: "全国"
                // }
              ]
            },
            {
              name: "省份",
              level: 2,
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
              level: 3,
              prop: "city",
              list: [
                {
                  id: "a1",
                  dimName: "city",
                  level: 3,
                  dimValue: "成都市"
                }
              ]
            },
            {
              name: "区/县",
              level: 4,
              prop: "inarea",
              list: [
                {
                  id: "a1",
                  dimName: "inarea",
                  level: 4,
                  dimValue: "高新区"
                }
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
          name: "食品品类",
          prop: "item",
          checked: true,
          isLeaf: false,
          showFullName: true,
          splitStr: "/",
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
                {
                  id: "a1",
                  dimName: "categories",
                  level: 1,
                  dimValue: "大类1"
                }
              ]
            },
            {
              name: "亚类",
              level: 2,
              prop: "subClass",
              list: [
                {
                  id: "a1",
                  dimName: "subClass",
                  level: 2,
                  dimValue: "亚类1"
                }
              ]
            },
            {
              name: "次亚类",
              level: 3,
              prop: "subSubClass",
              list: [
                {
                  id: "a1",
                  dimName: "subSubClass",
                  level: 3,
                  dimValue: "次亚类1"
                }
              ]
            },
            {
              name: "细类",
              level: 4,
              prop: "lastClass",
              list: [
                {
                  id: "a1",
                  dimName: "lastClass",
                  level: 4,
                  dimValue: "细类"
                }
              ]
            }
          ],
          list: [
            {
              id: "c1",
              prop: "item",
              name: "维度3"
            }
          ]
        },
        {
          name: "监测项目",
          prop: "inner",
          checked: true,
          isLeaf: true,
          showFullName: false,
          splitStr: "/",
          originData: [],
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
                {
                  id: "a1",
                  dimName: "detectionCategories",
                  level: 1,
                  dimValue: "检测项目类别"
                }
              ]
            },
            {
              name: "单个检测项目",
              level: 2,
              prop: "detectionSubClass",
              list: [
                {
                  id: "a1",
                  dimName: "detectionSubClass",
                  level: 2,
                  dimValue: "单个检测项目"
                },
                {
                  id: "a1",
                  dimName: "detectionSubClass",
                  level: 2,
                  dimValue: "单个检测项目"
                }
              ]
            }
          ],
          list: [
            {
              id: "d1",
              prop: "inner",
              name: "维度41"
            },
            {
              id: "d1",
              prop: "inner",
              name: "维度42"
            }
          ]
        },
        {
          name: "环节",
          prop: "links",
          checked: false,
          isLeaf: true,
          originData: [],
          defaultData: [
            // {
            //   id: 2,
            //   label: "流通2"
            // }
          ],
          standards: [],
          list: [
            {
              id: "d1",
              prop: "links",
              name: "流通2"
            },
            {
              id: "d1",
              prop: "links",
              name: "流通3"
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
      obj: {},
      modeColspan: {},
      tableData: [],
      // dimName, dimValue, dataList,
      // "total": 480,
      // "unTotal": 0,
      // "unRatio": 0,
      // "qtotal": 480,
      // "qratio": 100
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

      // 根据数据合并行
      totalColumn: 0,
      startColumnNum: 0
    };
  },
  components: {
    DownTree,
    MoreCheckbox,
    Search,
    DateSelect
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
        return item.checked && flag;
      });
    },
    onecheckDataColumn() {
      return this.onecheckData.filter(function(item) {
        return item.checked;
      });
    },
    moreModea() {
      return this.moreMode.filter(function(item) {
        return item.prop != "links";
      });
    },
    linksMode() {
      return this.moreMode.filter(function(item) {
        return item.prop == "links";
      });
    }
  },
  created() {
    this.moreMode[0].originData = [
      {
        id: 1,
        label: "2017年",
        level: 1,
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
      },
      {
        id: 4,
        level: 1,
        label: "2018年",
        children: [
          {
            id: 5,
            level: 4,
            label: "1月"
          },
          {
            id: 6,
            level: 4,
            label: "2月"
          }
        ]
      }
    ];
    this.moreMode[1].originData = [
      // {
      //   id: 1,
      //   level: 1,
      //   label: "中国",
      //   children: [
      // {
      //   id: 2,
      //   level: 2,
      //   label: "四川省",
      //   children: [
      {
        id: 3,
        level: 3,
        label: "成都市",
        children: [
          {
            id: 4,
            level: 4,
            label: "高新区"
          },
          {
            id: 5,
            level: 4,
            label: "武侯区"
          }
        ]
      }
      // ]
      // }
      // {
      //   id: 6,
      //   level: 2,
      //   label: "四川省1",
      //   children: [
      //     {
      //       id: 7,
      //       level: 3,
      //       label: "成都市",
      //       children: [
      //         {
      //           id: 8,
      //           level: 4,
      //           label: "高新区"
      //         },
      //         {
      //           id: 9,
      //           level: 4,
      //           label: "武侯区"
      //         }
      //       ]
      //     }
      //   ]
      // }
      // ]
      // }
    ];
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
      id: 1,
      label: "类1",
      level: 1,
      children: []
    };
    for (let i = 0; i < 30; i++) {
      obj.children.push({
        id: 300 + i,
        level: 2,
        label: "亚类" + 10 + i,
        children: []
      });
      for (let j = 0; j < 30; j++) {
        obj.children[i].children.push({
          id: i * 100 + 2000 + j,
          label: "亚类" + 2000 + j,
          level: 3,
          children: []
        });
        for (let k = 0; k < 20; k++) {
          obj.children[i].children[j].children.push({
            id: (i + 1) * 8000 + (j + 1) * 1000 + k,
            level: 4,
            label: "亚类" + (i + 1) * 8000 + (j + 1) * 1000 + k
          });
        }
      }
    }
    this.moreMode[2].originData[0] = { ...obj };
    // console.log(this.moreMode[2]);
    this.moreMode[3].originData = [
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
    this.checkMore();
    // this.getDatas();
  },
  methods: {
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
    changeTwo() {
      // this.checkMore();
      this.getDatas();
    },
    changeMode(item) {
      this.currentMode = item.value;
    },
    selectDown(arr, modeType) {
      let index = 0;
      console.log(arr);
      // console.log(modeType);
      for (let i = 0; i < this.moreMode.length; i++) {
        if (this.moreMode[i].prop == modeType) {
          index = i;
          break;
        }
      }
      for (let i = 0; i < this.moreMode[index].standards.length; i++) {
        this.moreMode[index].standards[i].list = [];
        let obj = this.moreMode[index].standards[i];
        for (let j = 0; j < arr.length; j++) {
          if (obj.level == arr[j].level) {
            this.moreMode[index].standards[i].list.push({
              id: arr[j].id,
              level: arr[j].level,
              dimValue: arr[j].nodeLabel,
              dimName: obj.prop,
              parentId: arr[j].parentId
            });
          }
        }
      }
      // console.log(this.moreMode[index].standards);
      // this.moreMode[index].list = [];

      // for (let j = 0; j < arr.length; j++) {
      //   this.moreMode[index].list.push({
      //     id: arr[j].id,
      //     name: arr[j].nodeLabel,
      //     prop: modeType
      //   });
      // }
      // this.moreMode.standards.list = [];
      // let list = this.moreMode.standards.list;
      // for (let i = 0; i < list.length; i++) {
      //   for (let j = 0; j < arr.length; j++) {
      //     if (list[i].level == arr[j].level) {
      //       list[i].push({
      //         id: arr[j].id,
      //         level: arr[j].level,
      //         dimValue: arr[j].nodeLabel,
      //         dimName: list[i].prop
      //       });
      //     }
      //   }
      // }
      this.checkMore();
    },
    getTreeNode(node, children) {
      if (!node) {
        return;
      }
      if (node.dataList && node.dataList.length != 0) {
        for (let i = 0; i < node.dataList.length; i++) {
          this.getTreeNode(node.dataList[i], children);
        }
      } else {
        node.dataList = JSON.parse(children);
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
    // {
    //   0, {
    //     0: 8
    //   },
    //   1: {
    //     0: 4,
    //     4: 4
    //   },
    //   2: {
    //     0: 2,
    //     2: 2,
    //     4: 2,
    //     6: 2
    //   },
    //  3: {
    //    1: 1,
    //    2: 1,
    //    3: 1
    //  }
    // }
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
            if (!["id", "dimName", "dimValue", "dataList"].includes(key)) {
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
        for (let i = 0; i < node.dataList.length; i++) {
          let innerObj = {};
          let len = this.calculateTotalLen(node.dataList[i], 1);
          for (let j = 0; j < this.totalColumn; j += len) {
            innerObj[j] = len;
          }
          this.modeColspan[this.startColumnNum] = innerObj;
          this.startColumnNum++;
          this.getOtherColspan(node.dataList[i]);
          return;
        }
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
    checkOne(item) {
      // this.checkMore();
      this.getDatas();
    },
    getDatas() {
      this.tableData = [];
      this.resultTree = {
        id: "0",
        name: "start"
      };
      // this.resultTree.children = this.originData;
      // console.log(SourceTree);
      this.resultTree.dataList = SourceTree;
      // console.log(this.resultTree);
      this.getTableData({ ...this.resultTree });
      this.getMoreColspan();
      // console.log(this.tableData);
    },
    checkMore() {
      this.tableData = [];
      let arr = [...this.oneModeColumn];
      this.resultTree = {
        id: "0",
        name: "start"
      };

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
          // if (arr[i].list.length > 0) {
          //   this.getTreeNode(this.resultTree, JSON.stringify(arr[i].list));
          // }
          for (let j = 0; j < arr[i].standards.length; j++) {
            // for (let k = 0; k < arr[i].standards[j].list.length; k++) {
            // console.log(arr[i].standards[j].list[k]);
            if (arr[i].standards[j].list.length > 0) {
              this.getTreeNode(
                this.resultTree,
                JSON.stringify(arr[i].standards[j].list)
              );
            }

            // }
          }
        }
      }
      // console.log(this.resultTree);
      this.getTableData({ ...this.resultTree });
      this.getMoreColspan();
      // console.log(this.tableData);
    },
    // 计算各列合并行1
    getMoreColspana() {
      let arr = [...this.oneModeColumn];
      this.obj = {};
      this.colsArr = [];
      let total = 1;
      for (let j = 0; j < arr.length; j++) {
        total = total * arr[j].list.length;
      }

      for (let i = 0; i < arr.length; i++) {
        let obj = {};
        let len = 1;
        let num = 0;

        for (let j = i + 1; j < arr.length; j++) {
          len = len * arr[j].list.length;
        }
        // console.log(len);
        if (i == 0) {
          for (let k = 0; k < arr[i].list.length; k++) {
            obj[num] = len;
            num += len;
          }
        } else {
          let inLen = arr[0].list.length;
          for (let y = 0; y < i; y++) {
            inLen = inLen * arr[i].list.length;
          }
          for (let f = 0; f < total; f += len) {
            if (len != 1) {
              obj[num] = len;
            } else {
              obj[num] = 1;
            }

            num += len;
          }
        }
        this.colsArr.push(obj);
      }
      for (let j = 0; j < this.colsArr.length; j++) {
        this.modeColspan[j] = this.colsArr[j];
      }
      let len = this.oneModeColumn.length;
      let index = len;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < this.onecheckDataColumn.length; j++) {
          this.modeColspan[index] = this.colsArr[i];
          index++;
        }
      }
      // console.log(this.modeColspan);
    },
    getMoreColspan() {
      this.obj = {};
      this.startColumnNum = 0;
      this.modeColspan = {};
      this.totalColumn = this.calculateTotalLen(this.resultTree, 1);
      this.getOtherColspan(this.resultTree);
      //
      let len = 0;
      for (let key in this.modeColspan) {
        len++;
      }
      let index = len;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < this.onecheckDataColumn.length; j++) {
          this.modeColspan[index] = this.modeColspan[i];
          index++;
        }
      }
      // console.log(this.moreMode);
      // console.log(this.modeColspan);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // for (let i = 0; i < this.colsArr.length; i++) {
      //   if (columnIndex === i) {
      //     if (this.colsArr[i][rowIndex]) {
      //       return {
      //         rowspan: this.colsArr[i][rowIndex],
      //         colspan: 1
      //       };
      //     } else {
      //       return {
      //         rowspan: 0,
      //         colspan: 0
      //       };
      //     }
      //   }
      // }
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
  padding: 50px 100px;
  .out-box {
    display: flex;
    .left {
      flex: 1;
      .box {
        display: flex;
        .item {
          flex: 1;
          .line {
            display: flex;
            line-height: 40px;
            .title {
              flex: 0 0 140px;
            }
            .tabs {
              flex: 1;
              display: flex;
              margin: 10px 0;
              .tabs-item {
                flex: 0 0 140px;
                cursor: pointer;
                margin: 0 5px;
              }
            }
          }
        }
      }
    }
    .right {
      flex: 0 0 200px;
      .btns {
        display: block;
        width: 140px;
        margin: 10px auto;
      }
    }
  }

  .tables {
    width: 100%;
    // display: flex;
    .titles {
      height: 45px;
      line-height: 45px;
      display: flex;
      .left {
        flex: 1;
      }
      .right {
        flex: 0 0 200px;
      }
    }
  }
}
</style>

