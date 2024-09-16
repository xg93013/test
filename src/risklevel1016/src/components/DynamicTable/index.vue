<template>
  <div class="dynamic-table">
    <el-table
      :data="tableData"
      :span-method="spanMethod"
      style="width: 100%"
      border
      @sort-change="sortChange"
      max-height="500"
    >
      <!-- <el-table-column type="selection" width="55" v-if="type='edit'"></el-table-column> -->
      <el-table-column
        type="index"
        label="序号"
        width="100"
        v-if="type=='view'"
        :index="indexMethod(1)"
      ></el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        :sortable="item.sortable"
        v-for="(item, index) in tableColumn"
        :key="'column'+index"
      ></el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        :sortable="item.sortable"
        :show-overflow-tooltip="true"
        v-for="(item, index) in editColumn"
        :key="'editcolumn'+index"
      >
        <template slot-scope="scope">
          <div v-if="scope.column.property == 'result'" class="select-box">
            <!-- <span v-if="['', null].includes(scope.row[scope.column.property])">-</span>
            <span v-else-if="scope.row.isReasonable">-</span>
            <div v-else @click="changeCheckBox(item, scope.row)">-->
            <span v-if="moreCheck" class="result-score">
              <!-- 合理缺项 -->
              <div v-if="!['', null].includes(scope.row['isReasonable'])" class="relable">
                <el-checkbox
                  v-model="scope.row['isReasonable']"
                  @change="changeCheckBox('isReasonable', scope.row)"
                  v-if="type=='edit'"
                >合理缺项</el-checkbox>
                <div v-else class="select-box">
                  <span :class="scope.row['isReasonable'] ? 'pass': 'normal-pass'">
                    <svg-icon iconClass="check-box"></svg-icon>
                  </span>
                  <span>合理缺项</span>
                </div>
              </div>
              <div
                class="scores"
                @click="changeCheckBox('nopass', scope.row)"
                v-if="!scope.row.isReasonable"
              >
                <span class="normal-pass" v-if="scope.row['nopass'] == '符合'">
                  <svg-icon iconClass="check-box"></svg-icon>
                  <span>符合</span>
                </span>
                <span class="error" v-else-if="scope.row['nopass'] == '不符合'">
                  <svg-icon iconClass="errors"></svg-icon>
                  <span>不符合</span>
                </span>
                <span v-else class="pass">
                  <svg-icon iconClass="check-box"></svg-icon>
                  <span>基本符合</span>
                </span>
              </div>
            </span>
            <span v-else class="result-score">
              <!-- 合理缺项 -->
              <div v-if="!['', null].includes(scope.row['isReasonable'])" class="relable">
                <el-checkbox
                  v-model="scope.row['isReasonable']"
                  @change="changeCheckBox('isReasonable', scope.row)"
                  v-if="type=='edit'"
                >合理缺项</el-checkbox>
                <div v-else class="select-box">
                  <span :class="scope.row['isReasonable'] ? 'pass': 'normal-pass'">
                    <svg-icon iconClass="check-box"></svg-icon>
                  </span>
                  <span>合理缺项</span>
                </div>
              </div>
              <div
                class="scores"
                @click="changeCheckBox('nopass', scope.row)"
                v-if="!scope.row.isReasonable"
              >
                <span class="normal-pass" v-if="scope.row['nopass'] == '符合'">
                  <svg-icon iconClass="check-box"></svg-icon>
                  <span>符合</span>
                </span>
                <span class="pass" v-else-if="scope.row['nopass'] == '不符合'">
                  <svg-icon iconClass="check-box"></svg-icon>
                  <span>不符合</span>
                </span>
              </div>
            </span>
            <!-- 
              <span>{{scope.row[scope.column.property]}}</span>
            </div>-->
          </div>
          <div v-else-if="scope.column.property == 'calScore'">
            <!-- <div v-if="!scope.row.isReasonable"> -->
            <div v-if="!moreCheck&&type=='view'">
              <span v-if="['', null].includes(scope.row[scope.column.property])">-</span>
              <span v-else-if="scope.row.isReasonable">-</span>
              <div v-else class="select-box">
                <span
                  :class="Number(scope.row[scope.column.property]) != 0 ? 'pass': 'normal-pass'"
                >
                  <svg-icon iconClass="check-box"></svg-icon>
                </span>
                <span>{{Number(scope.row['calScore'])==0 ? '无需扣分' : '需要扣分'}}</span>
              </div>
            </div>
            <div v-else>
              <span v-if="['', null].includes(scope.row[scope.column.property])">-</span>
              <span v-else class="warings">{{scope.row[scope.column.property]}}</span>
            </div>
            <!-- </div>
            <span v-else>-</span>-->
          </div>
          <!-- <div v-else-if="scope.column.property == 'isReasonable'">
            <span v-if="['', null].includes(scope.row[scope.column.property])">-</span>
            <div v-else @click="changeCheckBox(item, scope.row)">
              <el-checkbox
                v-model="scope.row[scope.column.property]"
                @change="changeCheckBox(item, scope.row)"
                v-if="type=='edit'"
              >合理缺项</el-checkbox>
              <div v-else class="select-box">
                <span :class="scope.row[scope.column.property] ? 'pass': 'normal-pass'">
                  <svg-icon iconClass="check-box"></svg-icon>
                </span>
                <span>合理缺项</span>
              </div>
            </div>
          </div>-->
          <div v-else-if="scope.column.property == 'remarks'">
            <!-- <el-input
              v-model="scope.row[scope.column.property]"
              @change="editRemarks(scope.row[scope.column.property], scope.row)"
            ></el-input>-->
            <div
              class="remarks"
              v-if="scope.row[scope.column.property]==''"
              @click="editRemarks(scope.row[scope.column.property], scope.row)"
            >
              <svg-icon iconClass="edit"></svg-icon>
              <span>录入</span>
            </div>
            <div
              v-else
              class="remarks"
              @click="editRemarks(scope.row[scope.column.property], scope.row)"
            >{{scope.row[scope.column.property]}}</div>
          </div>
          <div v-else-if="scope.column.property =='operation'">
            <span @click="deleteRow(item, scope.row)" class="operation">
              <svg-icon iconClass="delete"></svg-icon>
              <span>清空</span>
            </span>
          </div>
          <span v-else>{{scope.row[scope.column.property]}}</span>
        </template>
      </el-table-column>
      <el-table-column width="190" v-if="moreCheck&&type=='view'" label="汇总">
        <template slot-scope="scope">
          <div>
            <p>合理缺项分值：{{scope.row.missTotal}} 分</p>
            <p>总分/得分：{{scope.row.totalScore}} / {{scope.row.score}}</p>
            <p>得分比%：{{scope.row.percent}} %</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="editTableData"
      style="width: 100%;"
      border
      :show-header="false"
      v-if="type=='edit'"
      class="default-table"
    >
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        v-for="(item, index) in tableColumn"
        :key="'columna'+index"
      >
        <template slot-scope="scope">
          <div
            v-if="scope.column.property== 'checkProject'"
            @click="selectRow(scope)"
            class="select-down"
          >
            <span>请选择</span>
            <svg-icon iconClass="down"></svg-icon>
          </div>
          <span v-else>{{scope.row[scope.column.property]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        v-for="(item, index) in editColumn"
        :key="'editcolumna'+index"
      >
        <template slot-scope="scope">
          <div v-if="scope.column.property == 'nopass'" class="select-box">
            <span v-if="['', null].includes(scope.row[scope.column.property])">-</span>
            <div v-else @click="changeDefaultCheckBox(item, scope.row)">
              <span v-if="moreCheck">
                <span class="normal-pass" v-if="scope.row[scope.column.property] == '符合'">
                  <svg-icon iconClass="check-box"></svg-icon>
                </span>
                <span class="error" v-else-if="scope.row[scope.column.property] == '不符合'">
                  <svg-icon iconClass="errors"></svg-icon>
                </span>
                <span v-else class="pass">
                  <svg-icon iconClass="check-box"></svg-icon>
                </span>
              </span>
              <span v-else>
                <span class="normal-pass" v-if="scope.row[scope.column.property] == '符合'">
                  <svg-icon iconClass="check-box"></svg-icon>
                </span>
                <span class="pass" v-else-if="scope.row[scope.column.property] == '不符合'">
                  <svg-icon iconClass="check-box"></svg-icon>
                </span>
              </span>

              <span>{{scope.row[scope.column.property]}}</span>
            </div>
          </div>
          <div v-else-if="scope.column.property == 'calScore'">
            <span>-</span>
          </div>
          <div v-else-if="scope.column.property == 'isReasonable'">
            <el-checkbox
              v-model="scope.row[scope.column.property]"
            >{{scope.column.property == 'nopass'? '不符合项' : '合理缺项'}}</el-checkbox>
          </div>
          <div v-else-if="scope.column.property =='operation'">
            <!-- <span @click="deleteRow(item, scope.row)" class="operation">
              <svg-icon iconClass="delete"></svg-icon>
              <span>清空</span>
            </span>-->
          </div>
          <span v-else>{{scope.row[scope.column.property]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="remarksVisible=true">open</el-button>
    <DownTree
      :data="treeObj.data"
      :defaultData="treeObj.defaultData"
      :isLeaf="treeObj.isLeaf"
      :title="treeObj.title"
      @downTree="selectDown"
      @setDefault="setDefault"
      ref="downTreeRefs"
      v-if="type=='edit'"
    />
    <el-dialog
      title="企业体系先进性的备注输入框"
      width="600px"
      :visible.sync="remarksVisible"
      @close="remarksVisible=false"
    >
      <div class="remarks-content">
        <div class="content">
          <p>检查项目：1．许可档案资料</p>
          <p>检查内容：*1.1 营业执照、许可证件（SC编号证书）等材料齐全</p>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="remarks"
            maxlength="300"
            show-word-limit
          ></el-input>
        </div>

        <div class="operation">
          <el-button @click="remarksVisible=false">取消</el-button>
          <el-button @click="confirmRemarks" type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DownTree from "@/components/DownTree/DownTree.vue";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";
const { TASK_TASKDYNAMIC, TASK_TASKADVANCEMENT } = apis;
export default {
  data() {
    return {
      tableData: [],
      editTableData: [],
      modeColspan: {},
      obj: {},
      resultTree: {},
      originTree: {},
      originData: [],
      tableColumn: [
        {
          id: "",
          label: "",
          prop: ""
        }
      ],
      editColumn: [
        {
          id: "",
          label: "",
          prop: "",
          align: ""
        }
      ],
      leafNodesLen: 0,
      treeObj: {
        data: [],
        defaultData: [],
        isLeaf: true,
        title: ""
      },
      submitData: [],
      params: {},
      remarksVisible: false,
      remarks: "",
      currentRow: {},
      currentNode: ""
    };
  },
  components: {
    DownTree
  },
  props: {
    moreCheck: {
      type: Boolean,
      default: false
    },
    showNum: {
      type: Boolean,
      default: false
    },
    // edit 编辑  view 预览
    type: {
      type: String,
      default: "edit"
    },
    title: {
      type: String,
      default: ""
    },
    taskId: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.tableColumn = [
      {
        id: "a",
        label: "检查项目",
        prop: "checkProject",
        sortable: "custom",
        level: 1,
        data: []
      },
      {
        id: "b",
        label: "检查内容",
        sortable: "custom",
        prop: "checkContent",
        width: 350,
        level: 2,
        data: []
      }
    ];
    this.editColumn = [
      {
        id: "c",
        label: "分值",
        prop: "score",
        sortable: "custom",
        align: "center"
      },
      {
        id: "d",
        label: "结果判定",
        prop: "result",
        width: "220",
        align: "center"
      },
      // {
      //   id: "e",
      //   label: this.moreCheck ? "得分" : "扣分项",
      //   prop: "calScore",
      //   align: "center"
      // },
      // {
      //   id: "f",
      //   label: "是否合理缺项",
      //   prop: "isReasonable",
      //   align: "center"
      // },
      {
        id: "h",
        label: "备注",
        prop: "remarks",
        align: "center"
      },
      {
        id: "g",
        label: "操作",
        prop: "operation",
        align: "center"
      }
    ];
    if (this.moreCheck) {
      this.editColumn.splice(2, 0, {
        id: "e",
        label: "得分",
        prop: "calScore",
        align: "center"
      });
    }

    this.editTableData.push({
      date: "aaa",
      checkProject: "default",
      checkContent: "自动填充",
      nopass: "符合",
      score: "自动填充"
    });

    if (this.type == "view") {
      this.editColumn.splice(this.editColumn.length - 1, 1);
      this.getDatas();
    }
    if (this.type == "edit") {
      this.getDatas();
    }
  },
  methods: {
    indexMethod(index) {
      return index++;
    },
    getTreeData() {
      let parentKey = this.tableColumn[0].prop;
      let key = this.tableColumn[1].prop;
      let defaultData = [];
      this.treeObj.data = [
        {
          id: "a",
          label: "检查项目1",
          children: [
            {
              id: "b",
              label: "1.1",
              longLabel: "1.1查验食品原辅料",
              children: []
            },
            {
              id: "c",
              label: "1.2",
              longLabel:
                "1.2查验食品原辅料、食品添加剂、食品相关产品供货者的许可证、产品合格证明文件；供货者无法提供有效合格证明文件的食品原料，有检验记录。",
              children: []
            }
          ]
        },
        {
          id: "d",
          label: "检查项目2",
          children: [
            {
              id: "e",
              label: "2.1",
              longLabel: "2.1食品添加剂",
              children: []
            }
            // {
            //   id: "f",
            //   label: "2.2",
            //   longLabel:
            //     "1.2查验食品原辅料、食品添加剂、食品相关产品供货者的许可证、产品合格证明文件；供货者无法提供有效合格证明文件的食品原料，有检验记录。",
            //   children: []
            // }
          ]
        }
      ];
      this.treeObj.title = `${this.title}检查项目选择框`;
      for (let i = 0; i < this.tableData.length; i++) {
        let resultNode = this.getNodeInSelectTree(
          this.getProjectNode(this.tableData[i][parentKey]),
          this.tableData[i][key]
        );
        defaultData.push({
          id: resultNode.id
        });
      }
      console.log(this.tableData);
      console.log(defaultData);
      this.treeObj.defaultData = defaultData;
    },
    getDefaultData() {},
    getTableData(node) {
      if (!node) {
        return;
      }
      if (node.dataList != null && node.dataList.length > 0) {
        for (let i = 0; i < node.dataList.length; i++) {
          this.obj[node.dataList[i].dimName] = node.dataList[i].dimValue;
          for (let key in node.dataList[i]) {
            if (
              ![
                // "id",
                "dimName",
                "dimValue",
                "dataList",
                "parentId",
                "level"
              ].includes(key)
            ) {
              this.obj[key] = node.dataList[i][key];
            }
          }
          this.getTableData(node.dataList[i]);
        }
      } else {
        if (node.dimName != "start") {
          // console.log({ ...this.obj });
          this.tableData.push({ ...this.obj });
        }
      }
    },
    getMoreColspan() {
      this.modeColspan = {};
      let columnNum = 0;
      let allStandards = [...this.tableColumn];
      let start = this.showNum ? 1 : 0;
      let len = this.showNum ? allStandards.length + 1 : allStandards.length;
      for (let h = start; h < len; h++) {
        let obj = {};
        let rowNum = 0;
        for (let w = 0; w < this.tableData.length; w++) {
          if (rowNum == w) {
            let node = { ...this.resultTree };
            let inLen = this.showNum ? h - 1 : h;
            for (let k = 0; k <= inLen; k++) {
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
      for (let key in this.modeColspan) {
        index = parseInt(key);
      }
      for (let i = 0; i < this.editColumn.length; i++) {
        index++;
        let obj = {};
        for (let j = 0; j < this.tableData.length; j++) {
          obj[j] = 1;
        }
        this.modeColspan[index] = obj;
      }
      if (this.showNum) {
        let obj = {};
        for (let i = 0; i < this.tableData.length; i++) {
          obj[i] = 1;
        }
        this.modeColspan[0] = obj;
      }
      if (this.moreCheck && this.type == "view") {
        index++;
        this.modeColspan[index] = this.showNum
          ? this.modeColspan[1]
          : this.modeColspan[0];
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
    getNodeInSelectTree(node, label) {
      if (node.longLabel == label) {
        return node;
      } else if (node.children != null) {
        let i = 0;
        let result = null;
        for (i = 0; result == null && i < node.children.length; i++) {
          result = this.getNodeInSelectTree(node.children[i], label);
        }
        return result;
      }
      return null;
    },
    selectRow(row) {
      // let addObj = {
      //   date: "2-02",
      //   name: "test",
      //   address: "tess518 弄"
      // };
      // let addArr = [
      //   {
      //     date: "2-01",
      //     name: "test",
      //     address: "tess518 弄"
      //   },
      //   {
      //     date: "2-01",
      //     name: "test",
      //     address: "tess518 弄"
      //   }
      // ];
      // for (let i = 0; i < addArr.length; i++) {
      //   this.tableData.splice(row.$index + i, 0, addArr[i]);
      // }
      // console.log(this.tableData);
      this.$refs.downTreeRefs.open();
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
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
    changeCheckBox(prop, row) {
      if (this.type != "view") {
        let arr = this.moreCheck
          ? ["符合", "不符合", "基本符合"]
          : ["符合", "不符合"];
        let key = "checkContent";
        let node = this.getNodeInTree(this.resultTree, row[key], key);
        let originNode = this.getNodeInTree(this.originTree, row[key], key);
        // score: "20",
        //       nopass: "符合",
        //       calScore: "20",
        //       isReasonable: false,
        //       remarks: "",
        if (prop == "nopass") {
          let index = arr.indexOf(row[prop]);
          index++;
          if (index >= arr.length) {
            index = 0;
          }
          node[prop] = arr[index];
          row[prop] = arr[index];
          if (!this.moreCheck) {
            // 动态风险因素得分
            if (row[prop] == "不符合") {
              node.calScore = node.score;
              row.calScore = node.score;
            } else {
              node.calScore = 0;
              row.calScore = 0;
            }
          } else {
            // 体系检查得分
            if (arr[index] == "不符合") {
              node.calScore = 0;
              row.calScore = 0;
            } else if (arr[index] == "符合") {
              node.calScore = node.score;
              row.calScore = node.score;
            } else {
              node.calScore = 3;
              row.calScore = 3;
            }
          }
        }
        if (prop == "isReasonable") {
          node[prop] = row[prop];
          if (node[prop]) {
            node.nopass = "";
            row.nopass = "";
            node.calScore = "";
            row.calScore = "";
          } else {
            node.nopass = "符合";
            row.nopass = "符合";
            node.calScore = 0;
            row.calScore = 0;
          }
        }

        this.addSubmitData(row, originNode, prop);

        this.getScore();
      }
    },
    addSubmitData(row, node, prop) {
      if (row[prop] != node[prop]) {
        let flag = false;
        let index = 0;
        for (let i = 0; i < this.submitData.length; i++) {
          if (this.submitData[i].id == row.id) {
            flag = true;
            index = i;
            break;
          } else {
            continue;
          }
        }
        if (!flag) {
          this.submitData.push({
            productionDynamicRiskId: "",
            remark: row.nopass,
            result: row.isReasonable
          });
        } else {
          this.submitData.splice(index, 1, {
            productionDynamicRiskId: "",
            remark: row.nopass,
            result: row.isReasonable
          });
        }
      }
    },
    changeDefaultCheckBox(item, row) {
      let arr = this.moreCheck
        ? ["符合", "不符合", "基本符合"]
        : ["符合", "不符合"];
      if (item.prop == "nopass") {
        let index = arr.indexOf(row[item.prop]);
        index++;
        if (index >= arr.length) {
          index = 0;
        }
        row[item.prop] = arr[index];
      }
    },
    getScore() {
      if (!this.moreCheck) {
        let score = {
          riskScore: 0,
          missScore: 0
        };
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].nopass == "不符合" &&
            !this.tableData[i].isReasonable
          ) {
            score.riskScore += Number(this.tableData[i].score);
          }
          if (this.tableData[i].isReasonable) {
            score.missScore += Number(this.tableData[i].score);
          }
        }
        // 计算预览

        let originData = this.resultTree.dataList;
        let scoreList = [];
        for (let i = 0; i < originData.length; i++) {
          let key = originData[i].dimName;
          let arr = originData[i].dataList;
          let obj = {
            checkProject: originData[i].dimValue,
            totalScore: 0,
            riskScore: 0
          };
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].nopass != "不符合") {
              obj.totalScore += Number(arr[j].score);
            }
            if (arr[j].nopass == "不符合") {
              obj.riskScore += Number(arr[j].score);
            }
          }
          scoreList.push(obj);
        }

        this.$emit("getScore", score, scoreList);
      } else {
        let originData = this.resultTree.dataList;
        let score = [];
        for (let i = 0; i < originData.length; i++) {
          let key = originData[i].dimName;
          let arr = originData[i].dataList;
          let obj = {
            checkProject: originData[i].dimValue,
            totalScore: originData[i].totalScore,
            riskScore: 0,
            disagreeScore: 0,
            missScore: 0
          };
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].nopass == "符合" && !arr[j].isReasonable) {
              obj.riskScore += Number(arr[j].score);
            }
            if (arr[j].nopass == "不符合" && !arr[j].isReasonable) {
              obj.disagreeScore += Number(arr[j].score);
            }
            if (arr[j].nopass == "基本符合" && !arr[j].isReasonable) {
              obj.riskScore += 3;
            }
            if (arr[j].isReasonable) {
              obj.missScore += Number(arr[j].score);
            }
          }
          score.push(obj);
        }

        this.$emit("getScore", score);
      }
    },
    deleteRow(item, row) {
      let arr = this.moreCheck
        ? ["符合", "不符合", "基本符合"]
        : ["符合", "不符合"];
      let key = "checkContent";
      let parentKey = "checkProject";
      let node = this.getNodeInTree(this.resultTree, row[key], key);
      node.nopass = arr[0];
      row.nopass = arr[0];
      node.calScore = "";
      row.calScore = "";
      node.isReasonable = false;
      row.isReasonable = false;
      let parent = this.getNodeInTree(
        this.resultTree,
        row[parentKey],
        parentKey
      );
      let resultNode = this.getNodeInSelectTree(
        this.getProjectNode(row[parentKey]),
        row[key]
      );
      if (resultNode) {
        this.$refs.downTreeRefs.tableRowDelete(resultNode.id);
      }
      this.deleteNode(parent, node);
      this.getScore();
    },
    getProjectNode(label) {
      for (let i = 0; i < this.treeObj.data.length; i++) {
        if (this.treeObj.data[i].label == label) {
          return this.treeObj.data[i];
        }
      }
      return "";
    },
    deleteNode(parent, node) {
      for (let i = 0; i < parent.dataList.length; i++) {
        if (parent.dataList[i].id == node.id) {
          parent.dataList.splice(i, 1);
          if (parent.dataList.length == 0) {
            for (let j = 0; j < this.resultTree.dataList.length; j++) {
              if (parent.id == this.resultTree.dataList[j].id) {
                this.resultTree.dataList.splice(j, 1);
                this.showTableData();
                return;
              }
            }
          }
          // console.log(this.resultTree);
          this.showTableData();
          return;
        }
      }
    },
    selectDown(arr, checkList, paramsData) {
      for (let k = 0; k < this.tableColumn.length; k++) {
        this.tableColumn[k].data = [];
      }
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < this.tableColumn.length; j++) {
          if (this.tableColumn[j].level == arr[i].level) {
            let obj = {
              id: arr[i].id,
              level: arr[i].level,
              dimValue: arr[i].label,
              dimName: this.tableColumn[j].prop,
              parentId: arr[i].parentId,
              score: "20",
              nopass: "符合",
              calScore: "",
              isReasonable: false
            };
            this.tableColumn[j].data.push(obj);
          }
        }
      }
      this.treeObj.defaultData = checkList;
      this.params.paramsData = paramsData;
      this.getDatas();
      // this.getScore();
    },
    setDefault(data) {
      this.treeObj.defaultData = data;
    },
    async getDatas() {
      // let url = this.moreCheck ? TASK_TASKDYNAMIC : TASK_TASKADVANCEMENT;
      // let res = await http.get(url + "/992");
      // if (res) {
      //   this.originData = [];
      //   console.log(res);
      //   let datas = res.data.data.dataList;
      //   for (let i = 0; i < datas.length; i++) {
      //     let outObj = {};
      //     outObj.dimName = "checkProject";
      //     outObj.dimValue = datas[i].dataName;
      //     outObj.dataList = [];
      //     for (let j = 0; j < datas[i].dataList.length; j++) {
      //       let inObj = {};
      //       inObj.dimName = "checkContent";
      //       inObj.dimValue = datas[i].dataList[j].content;
      //       inObj.score = datas[i].dataList[j].score;
      //       inObj.remarks = "";
      //       inObj.dataList = [];
      //       if (datas[i].dataList[j].result == "CONFORM") {
      //         inObj.nopass = "符合";
      //         inObj.isReasonable = false;
      //       } else if (datas[i].dataList[j].result == "INCONFORMITY") {
      //         inObj.nopass = "不符合";
      //         inObj.isReasonable = false;
      //       } else {
      //         inObj.isReasonable = true;
      //         inObj.nopass = "";
      //       }
      //       outObj.dataList.push(inObj);
      //     }
      //     this.originData.push(outObj);
      //   }
      //   console.log(this.originData);
      //   this.resultTree = {
      //     id: 0,
      //     dimName: "start",
      //     dataList: this.originData
      //   };
      //   this.originTree = { ...this.resultTree };
      //   this.showTableData();
      //   this.getTreeData();
      // }
      this.originData = [
        {
          // id: 1,
          dimName: "checkProject",
          dimValue: "检查项目1",
          // totalScore: 100,
          // score: 0,
          // missTotal: 0,
          // percent: 20,
          dataList: [
            {
              // id: 2,
              dimName: "checkContent",
              dimValue: "1.1查验食品原辅料",
              score: "20",
              nopass: "符合",
              calScore: "20",
              isReasonable: false,
              remarks: "",
              dataList: []
            },
            {
              id: 3,
              dimName: "checkContent",
              dimValue:
                "1.2查验食品原辅料、食品添加剂、食品相关产品供货者的许可证、产品合格证明文件；供货者无法提供有效合格证明文件的食品原料，有检验记录。",
              score: "20",
              nopass: "基本符合",
              calScore: "3",
              isReasonable: false,
              remarks: "",
              dataList: []
            }
          ]
        },
        {
          // id: 4,
          dimName: "checkProject",
          dimValue: "检查项目2",
          totalScore: 100,
          score: 0,
          missTotal: 0,
          percent: 20,
          dataList: [
            {
              id: 5,
              dimName: "checkContent",
              dimValue: "2.1食品添加剂",
              score: "20",
              nopass: "不符合",
              calScore: "0",
              isReasonable: true,
              remarks: "",
              dataList: []
            }
          ]
        }
      ];
      this.resultTree = {
        id: 0,
        dimName: "start",
        dataList: this.originData
      };
      this.originTree = { ...this.resultTree };
      this.showTableData();
      this.getTreeData();
      console.log(this.originData);
    },
    getParams() {},
    sortChange({ column, prop, order }) {
      this.getDatas();
    },
    showTableData() {
      this.modeColspan = {};
      this.tableData = [];
      this.getTableData(this.resultTree);
      this.getMoreColspan();
      this.getStandardsColspan();
      this.getScore();
    },
    setTree(node, linkParent, children) {
      if (!node) {
        return;
      }
      if (node.dataList && node.dataList.length != 0) {
        for (let i = 0; i < node.dataList.length; i++) {
          this.setTree(node.dataList[i], linkParent, children);
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
    reset() {
      this.tableData = [];
      this.resultTree = {};
      this.treeObj.defaultData = [];
      this.$refs.downTreeRefs.reset();
      this.getScore();
    },
    getResult() {
      return this.submitData;
    },
    editRemarks(value, row) {
      this.remarksVisible = true;
      let key = "checkContent";
      let node = this.getNodeInTree(this.resultTree, row[key], key);
      // node.remarks = value;
      this.currentNode = node;
      this.currentRow = row;
      console.log(row);
      // console.log(this.resultTree);
    },
    confirmRemarks() {
      this.remarksVisible = false;
      this.currentNode.remarks = this.remarks;
      this.currentRow["remarks"] = this.remarks;
      this.addSubmitData(this.currentNode, this.currentNode, "remarks");
      console.log(this.submitData);
    }
  }
};
</script>
<style lang="scss">
.dynamic-table {
  margin: 20px;
  .select-box {
    cursor: pointer;
    overflow: hidden;
    .pass {
      color: #409eff;
    }
    .normal-pass {
      color: #999;
    }
    .error {
      color: red;
    }
    .result-score {
      display: block;
      width: 100%;
      text-align: left;
    }
    .relable {
      display: inline-block;
      margin: 0 10px 0 10px;
    }
    .scores {
      display: inline-block;
    }
  }
  .warings {
    color: #4bd863;
  }
  .operation {
    cursor: pointer;
  }
  .remarks {
    width: 90%;
    margin-left: 5%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .select-down {
    overflow: hidden;
    cursor: pointer;
    span {
      margin: 0 10px;
    }
  }
  .el-table__empty-block {
    display: none;
  }
  .default-table {
    border-top: none;
    td {
      background-color: #f5f7fa;
    }
  }
  .remarks-content {
    padding: 20px;
    overflow: hidden;
    .content {
      p {
        line-height: 30px;
        margin-bottom: 20px;
      }
    }
    .operation {
      float: right;
      overflow: hidden;
      margin: 20px 0;
    }
  }
}
</style>