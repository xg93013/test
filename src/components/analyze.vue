<template>
  <div class="analyze">
    <div class="box">
      <div class="item">
        <div class="line">
          <div class="title">维度：</div>
          <div class="tabs">
            <el-select v-model="currentMode">
              <el-option
                v-for="item in allMode"
                :label="item.name"
                :value="item.value"
                @click.native="changeMode(item)"
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
            <!-- <div class="tabs-item" v-for="(item, index) in moreMode" :key="'onemode'+index">
              <el-checkbox :label="item.name" v-model="item.checked" @change="checkOne(item)">
                <down-tree
                  @downTree="selectDown"
                  :isLeaf="false"
                  :data="timeTree"
                  icon="list"
                  ref="categoryTreeRefs"
                  placeholder="请选择"
                ></down-tree>
              </el-checkbox>
            </div>-->
            <div class="tabs-item" v-for="(item, index) in moreMode" :key="'onemode'+index">
              <down-tree
                @downTree="selectDown"
                :isLeaf="item.isLeaf"
                :data="item.originData"
                :modeType="item.prop"
                icon="list"
                ref="categoryTreeRefs"
                :placeholder="'请选择'+item.name"
              ></down-tree>
            </div>
            <!-- <div class="tabs-item">
              <down-tree
                @downTree="selectArea"
                :isLeaf="false"
                :data="areaTree"
                icon="list"
                ref="categoryTreeRefs"
                placeholder="请选择"
              ></down-tree>
            </div>-->
          </div>
        </div>
        <div class="line">
          <div class="title">统计指标：</div>
          <div class="tabs">
            <div class="tabs-item" v-for="(item,index) in onecheckData">
              <el-checkbox
                :label="item.prop"
                :key="'checkone'+index"
                v-model="item.checked"
                @change="changeTwo"
              >{{item.label}}</el-checkbox>
            </div>
            <!-- </el-checkbox-group> -->
          </div>
        </div>
      </div>
      <!-- <div class="item">
        <div class="line">
          <div class="title">二级维度：</div>
          <div class="tabs">
            <div
              class="tabs-item"
              @click="checkTwo(item)"
              v-for="(item, index) in twoStandardList"
              :key="'tabssss'+index"
            >{{item.label}}</div>
          </div>
        </div>
        <div class="line">
          <div class="title">二级维度指标：</div>
          <div class="tabs">
            <el-checkbox-group v-model="twoChecklist">
              <el-checkbox
                :label="item.prop"
                v-for="(item, index) in twocheckData"
                :key="'tabaassss'+index"
              >{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>-->
    </div>
    <div class="tables">
      <!--   -->
      <el-table :data="tableData" :span-method="objectSpanMethod" border>
        <!-- <el-table-column
          :prop="oneStandard.prop"
          :label="oneStandard.label"
          min-width="150"
          :show-summary="true"
          v-if="oneStandard.label!=''"
        ></el-table-column>-->
        <el-table-column
          :prop="item.prop"
          :label="item.name"
          min-width="150"
          v-for="item in oneModeColumn"
        ></el-table-column>
        <!-- <el-table-column :label="twoStandard.label" v-if="twoStandard.label!=''">
          <el-table-column
            :prop="itema"
            :label="checkObj[itema]"
            min-width="120"
            v-for="itema in twoChecklist"
          ></el-table-column>
        </el-table-column>-->
        <el-table-column
          v-for="item in oneModeColumn"
          :label="item.name"
          align="center"
          v-if="onecheckDataColumn.length>0"
        >
          <el-table-column
            :prop="item.prop + itema.prop"
            :label="itema.label"
            min-width="150"
            v-for="itema in onecheckDataColumn"
          ></el-table-column>
        </el-table-column>
      </el-table>
      <el-button @click="addW">addW</el-button>
    </div>
  </div>
</template>
<script>
import DownTree from "@/components/DownTree/index";
export default {
  data() {
    return {
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
      onecheckData: [
        {
          label: "数量1",
          prop: "totalCount",
          checked: false
        },
        {
          label: "数量2",
          prop: "otherCount",
          checked: false
        }
      ],
      // twocheckData: [
      //   {
      //     label: "合格率",
      //     prop: "pass"
      //   },
      //   {
      //     label: "不合格率",
      //     prop: "nopass"
      //   }
      // ],
      tableData: [],
      // twoStandardList: [
      //   {
      //     label: "二级维度1",
      //     prop: "aaa1",
      //     list: []
      //   },
      //   {
      //     label: "二级维度2",
      //     prop: "aaa2",
      //     list: []
      //   },
      //   {
      //     label: "二级维度3",
      //     prop: "aaa3",
      //     list: []
      //   }
      // ],
      // oneStandard: {
      //   label: "",
      //   prop: "aaa",
      //   list: []
      // },
      // twoStandard: {
      //   label: "",
      //   prop: "two"
      // },
      moreMode: [
        {
          name: "时间",
          prop: "year",
          isLeaf: false,
          checked: true,
          originData: [
            {
              id: 1,
              label: "2017",
              children: [
                {
                  id: 2,
                  label: "1季度"
                }
              ]
            }
          ],
          list: [
            {
              id: "a1",
              prop: "year",
              name: "2017"
            }
            // {
            //   id: "a1",
            //   prop: "year",
            //   name: "2018"
            // },
            // {
            //   id: "a1",
            //   prop: "year",
            //   name: "2019"
            // },
            // {
            //   id: "a1",
            //   prop: "year",
            //   name: "2020"
            // }
          ]
        },
        {
          name: "区域",
          prop: "area",
          checked: true,
          originData: [
            {
              id: 1,
              label: "高新区"
            },
            {
              id: 2,
              label: "武侯区"
            }
          ],
          list: [
            {
              id: "b1",
              prop: "area",
              name: "高新区"
            },
            {
              id: "b2",
              prop: "area",
              name: "武侯区"
            }
          ]
        },
        {
          name: "监测项目",
          prop: "item",
          checked: true,
          isLeaf: true,
          originData: [
            {
              id: 1,
              label: "大类",
              children: [
                {
                  id: 2,
                  label: "次类"
                }
              ]
            }
          ],
          list: [
            {
              // id: "c1",
              prop: "item",
              name: "维度3"
            }
            // {
            //   // id: "c1",
            //   prop: "item",
            //   name: "维度31"
            // }
          ]
        },
        {
          name: "品类",
          prop: "inner",
          checked: true,
          isLeaf: true,
          originData: [
            {
              id: 1,
              label: "品类大类",
              children: [
                {
                  id: 2,
                  label: "品类次类"
                },
                {
                  id: 3,
                  label: "品类次类2"
                }
              ]
            },
            {
              id: 4,
              label: "品类大类1",
              children: [
                {
                  id: 5,
                  label: "品类次类3"
                },
                {
                  id: 6,
                  label: "品类次类4"
                }
              ]
            }
          ],
          list: [
            {
              id: "d1",
              prop: "inner",
              name: "维度41"
            }
          ]
        },
        {
          name: "环节",
          prop: "links",
          checked: false,
          isLeaf: true,
          originData: [
            {
              id: 1,
              label: "品类大类"
            }
          ],
          list: []
        }
      ],
      treeDataa: {
        id: "a",
        name: "start",
        children: [
          {
            id: "a",
            name: "2017",
            prop: "year",
            totalCount: 20000,
            otherCount: 10000,
            children: [
              {
                id: "ab",
                name: "高新区",
                prop: "area",
                totalCount: 200,
                otherCount: 100,
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
                        otherCount: 600
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
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      colsArr: [],
      num: 20,
      resultTree: {
        id: "0",
        name: "start"
      },
      obj: {},
      timeTree: [],
      modeColspan: {}
    };
  },
  components: {
    DownTree
  },
  watch: {
    moreMode(arr) {
      // this.checkMore();
    }
  },
  computed: {
    oneModeColumn() {
      return this.moreMode.filter(function(item) {
        return item.checked && item.list.length > 0;
      });
    },
    onecheckDataColumn() {
      return this.onecheckData.filter(function(item) {
        return item.checked;
      });
    },
    moreModea() {
      return this.onecheckData.length > 0 ? this.oneModeColumn : [];
    }
  },
  created() {
    this.checkMore();
  },
  methods: {
    changeTwo() {
      this.checkMore();
    },
    changeMode(item) {
      this.currentMode = item.value;
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
      this.moreMode[index].list = [];
      for (let j = 0; j < arr.length; j++) {
        this.moreMode[index].list.push({
          id: arr[j].id,
          name: arr[j].label,
          prop: modeType
        });
      }
      this.checkMore();
    },
    getTreeNode(node, children) {
      if (!node) {
        return;
      }
      if (node.children && node.children.length != 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.getTreeNode(node.children[i], children);
        }
      } else {
        // console.log(node);
        node.children = JSON.parse(children);
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
      if (node.children && node.children.length != 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.obj[node.children[i].prop] = node.children[i].name;
          this.getTableData(node.children[i]);
        }
      } else {
        if (node.name != "start") {
          this.tableData.push({ ...this.obj });
        }
      }
    },
    getTableDataa(node) {
      if (!node) {
        return;
      }
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          this.obj[node.children[i].prop] = node.children[i].name;
          for (let key in node.children[i]) {
            if (!["id", "prop", "name", "children"].includes(key)) {
              this.obj[node.children[i].prop + key] = node.children[i][key];
            }
          }
          this.getTableDataa(node.children[i]);
        }
      } else {
        if (node.name != "start") {
          console.log({ ...this.obj });
          this.tableData.push({ ...this.obj });
        }
      }
    },
    // checkTwo(item) {
    //   this.twoStandard.label = item.label;
    // },
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
    checkMore() {
      this.obj = {};
      this.tableData = [];
      this.colsArr = [];
      let total = 1;
      let arr = [...this.oneModeColumn];
      // this.modeColspan = this.oneModeColumn.length;
      // console.log(arr);
      this.resultTree = {
        id: "0",
        name: "start"
      };
      for (let w = 0; w < arr.length; w++) {
        if (arr[w].checked) {
          if (arr[w].list.length > 0) {
            this.getTreeNode(this.resultTree, JSON.stringify(arr[w].list));
          }
        }
      }
      // console.log(this.resultTree);
      // 生成表格数据
      // this.getTableData(this.resultTree);
      this.getTableDataa(this.treeDataa);
      console.log(this.tableData);
      for (let j = 0; j < arr.length; j++) {
        total = total * arr[j].list.length;
      }
      // 计算各列合并行
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
        // if (len != 1) {
        this.colsArr.push(obj);
        // }

        console.log(this.colsArr);
      }
      this.getMoreColspan();
    },
    checkOne(item) {
      // this.oneStandard = { ...item };
      // this.oneStandard.list = ["a", "b", "c"];
      // this.addW();
      // console.log(item);
      this.checkMore();
    },
    getMoreColspan() {
      //       cols = {
      //   4: this.colsArr[0],
      //   5: this.colsArr[0],
      //   6: this.colsArr[0],
      //   7: this.colsArr[0],
      //    8: this.colsArr[1],
      //   5: this.colsArr[1],
      //   6: this.colsArr[1],
      //   7: this.colsArr[1],
      // }
      let len = this.oneModeColumn.length;
      let index = len;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
          this.modeColspan[index] = this.colsArr[i];
          index++;
        }
      }
      console.log(this.modeColspan);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(this.colsArr);
      // this.$nextTick(() => {

      // let indexb = 4; // 4, 5 , 6, 7        8,9,10,11
      // for (let i = 0; i < this.onecheckData.length; i++) {
      //   if (this.onecheckData[i].checked) {
      //     indexb++;
      //   }
      // }
      for (let i = 0; i < this.colsArr.length; i++) {
        // console.log(i);
        if (columnIndex === i) {
          if (this.colsArr[i][rowIndex]) {
            return {
              rowspan: this.colsArr[i][rowIndex],
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
        // if (columnIndex == 4, 5 , 6, 7 ) {
        //   for (let j = 0; j < indexb; j++) {
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
        //     this.modeColspan++;
        //   }
        // }
      }
      // for (let key in this.modeColspan) {
      // if (this.modeColspan[columnIndex]) {
      console.log("aaaa");
      if (this.modeColspan[columnIndex]) {
        return {
          rowspan: this.modeColspan[columnIndex],
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      // }
      // }
      // });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.analyze {
  padding: 50px 100px;
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
  .tables {
    width: 100%;
  }
}
</style>

