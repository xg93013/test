<template>
  <div class="dynamic-table">
    <el-table
      :data="tableData"
      :span-method="spanMethod"
      style="width: 100%"
      border
      max-height="600"
    >
      <!-- @sort-change="sortChange" -->
      <!-- <el-table-column type="selection" width="55" v-if="type='edit'"></el-table-column> -->
      <el-table-column
        type="index"
        label="序号"
        width="60"
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
        v-for="(item, index) in editColumn"
        :key="'editcolumn'+index"
      >
        <!-- :show-overflow-tooltip="true" -->
        <template slot-scope="scope">
          <div v-if="scope.column.property == 'result'" class="select-box">
            <span v-if="moreCheck" class="result-score">
              <!-- <div v-if="!['', null].includes(scope.row['isReasonable'])" class="relable">
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
              </div>-->
              <span class="radio-item" @click="changeCheckBox('nopass', scope.row, '不符合')">
                <span class="out" :class="{'active':scope.row['nopass'] == '不符合'}">
                  <label></label>
                </span>不符合
              </span>
              <span class="radio-item" @click="changeCheckBox('nopass', scope.row, '基本符合')">
                <span class="out" :class="{'active':scope.row['nopass'] == '基本符合'}">
                  <label></label>
                </span>基本符合
              </span>
              <span class="radio-item" @click="changeCheckBox('nopass', scope.row, '符合')">
                <span class="out" :class="{'active':scope.row['nopass'] == '符合'}">
                  <label></label>
                </span>符合
              </span>
              <span class="radio-item" @click="changeCheckBox('isReasonable', scope.row)">
                <span class="out" :class="{'active':scope.row['isReasonable'] == true}">
                  <label></label>
                </span>合理缺项
              </span>
            </span>
            <span v-else class="result-score">
              <!-- <div v-if="!['', null].includes(scope.row['isReasonable'])" class="relable">
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
              </div>-->
              <span class="radio-item" @click="changeCheckBox('nopass', scope.row, '不符合')">
                <span class="out" :class="{'active':scope.row['nopass'] == '不符合'}">
                  <label></label>
                </span>
                不符合
              </span>
              <span class="radio-item" @click="changeCheckBox('nopass', scope.row, '符合')">
                <span class="out" :class="{'active':scope.row['nopass'] == '符合'}">
                  <label></label>
                </span>符合
              </span>
              <span class="radio-item" @click="changeCheckBox('isReasonable', scope.row)">
                <span class="out" :class="{'active':scope.row['isReasonable'] == true}">
                  <label></label>
                </span>合理缺项
              </span>

              <!-- <el-radio
                v-model="scope.row['result']"
                label="INCONFORMITY"
                @change="changeCheckBox('nopass', scope.row)"
              >不符合</el-radio>
              <el-radio
                v-model="scope.row['result']"
                label="CONFORM"
                @change="changeCheckBox('nopass', scope.row)"
              >符合</el-radio>
              <el-radio
                v-model="scope.row['result']"
                label="REASONABLE_EXCLUSION"
                @change="changeCheckBox('isReasonable', scope.row)"
              >合理缺项</el-radio>-->
            </span>
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
              <span v-else class="bColor">{{scope.row[scope.column.property]}}</span>
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
              v-if="scope.row[scope.column.property]==''&&type=='edit'"
              @click="editRemarks(scope.row[scope.column.property], scope.row)"
            >
              <svg-icon iconClass="edit"></svg-icon>
              <span>录入</span>
            </div>
            <div
              v-else-if="type=='edit'&&scope.row[scope.column.property]!=''"
              class="remarks"
              @click="editRemarks(scope.row[scope.column.property], scope.row)"
            >{{scope.row[scope.column.property]}}</div>
            <div class="remarks" v-else>{{scope.row[scope.column.property]}}</div>
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
            <p>总分/得分：{{scope.row.totalScore}} / {{scope.row.riskScore}}</p>
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
      :title="title+'的备注输入框'"
      width="600px"
      :visible.sync="remarksVisible"
      @close="remarksVisible=false"
    >
      <div class="remarks-content">
        <div class="content">
          <p>检查项目：{{currentRow.checkProject}}</p>
          <p>检查内容：{{currentRow.checkContent}}</p>
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
import { deepClone, setStorage, getStorage } from "@/utils/index.js";
const { TASK_TASKDYNAMIC, TASK_TASKADVANCEMENT, PDRS_DYNAMICRISK, PARS } = apis;
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
      currentNode: "",
      scoreResult: "",
      totalScore: 0,
      prevTableData: []
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
    },
    enterpriseType: {
      type: String,
      default: ""
    }
  },
  created() {
    this.tableColumn = [
      {
        id: "a",
        label: "检查项目",
        prop: "checkProject",
        // sortable: 'custom', 自定义排序
        sortable: false,
        width: 200,
        level: 1,
        data: []
      },
      {
        id: "b",
        label: "检查内容",
        sortable: false,
        prop: "checkContent",
        width: 330,
        level: 2,
        data: []
      }
    ];
    this.editColumn = [
      {
        id: "c",
        label: "分值",
        prop: "score",
        sortable: false,
        align: "center"
      },
      {
        id: "d",
        label: "结果判定",
        prop: "result",
        width: this.moreCheck ? "320" : "240",
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
      this.getTreeData();
    }
  },
  methods: {
    indexMethod(index) {
      return index++;
    },
    async getTreeData() {
      console.log(this.enterpriseType);
      this.totalScore = 0;
      let url = !this.moreCheck
        ? PDRS_DYNAMICRISK + "/" + this.enterpriseType
        : PARS;
      let res = await http.get(url);
      if (res) {
        // console.log(res);
        let data = res.data.data;
        let outData = [];
        for (let i = 0; i < data.length; i++) {
          let inData = [];
          for (let j = 0; j < data[i].children.length; j++) {
            inData.push({
              id: data[i].children[j].title,
              label: data[i].children[j].title,
              longLabel: data[i].children[j].detail,
              score: data[i].children[j].score,
              children: []
            });
            this.totalScore += data[i].children[j].score;
          }
          outData.push({
            id: data[i].title,
            label: data[i].title,
            longLabel: "",
            children: inData
          });
        }
        this.treeObj.data = [...outData];
        // console.log(this.treeObj);

        // this.treeObj.data = [
        //   {
        //     id: "a",
        //     label: "检查项目1",
        //     children: [
        //       {
        //         id: "b",
        //         label: "1.1",
        //         longLabel: "1.1查验食品原辅料",
        //         children: []
        //       },
        //       {
        //         id: "c",
        //         label: "1.2",
        //         longLabel:
        //           "1.2查验食品原辅料、食品添加剂、食品相关产品供货者的许可证、产品合格证明文件；供货者无法提供有效合格证明文件的食品原料，有检验记录。",
        //         children: []
        //       }
        //     ]
        //   },
        //   {
        //     id: "d",
        //     label: "检查项目2",
        //     children: [
        //       {
        //         id: "e",
        //         label: "2.1",
        //         longLabel: "2.1食品添加剂",
        //         children: []
        //       }
        //       // {
        //       //   id: "f",
        //       //   label: "2.2",
        //       //   longLabel:
        //       //     "1.2查验食品原辅料、食品添加剂、食品相关产品供货者的许可证、产品合格证明文件；供货者无法提供有效合格证明文件的食品原料，有检验记录。",
        //       //   children: []
        //       // }
        //     ]
        //   }
        // ];
        this.treeObj.title = `${this.title}检查项目选择框`;
        // for (let i = 0; i < this.tableData.length; i++) {
        //   let resultNode = this.getNodeInSelectTree(
        //     this.getProjectNode(this.tableData[i][parentKey]),
        //     this.tableData[i][key]
        //   );
        //   defaultData.push({
        //     id: resultNode.id
        //   });
        // }
        // this.treeObj.defaultData = defaultData;
        if (this.type != "view") {
          this.getDatas();
        } else {
          this.setViewData();
          // console.log("view");
        }
      }
    },
    setTreeDefaultData() {
      let parentKey = this.tableColumn[0].prop;
      let key = this.tableColumn[1].prop;
      let defaultData = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let resultNode = this.getNodeInSelectTree(
          this.getProjectNode(this.tableData[i][parentKey]),
          this.tableData[i][key]
        );
        defaultData.push({
          id: resultNode.id
        });
      }
      this.treeObj.defaultData = defaultData;
    },
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
      if (node.id + node.longLabel == label) {
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
      // console.log(this.tableData);
      this.prevTableData = deepClone(this.tableData);
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
    changeCheckBox(prop, row, label) {
      if (this.type != "view" && this.type != "detail") {
        // let arr = this.moreCheck
        //   ? ["符合", "不符合", "基本符合"]
        //   : ["符合", "不符合"];
        let key = "checkContent";
        let node = this.getNodeInTree(this.resultTree, row[key], key);
        let originNode = this.getNodeInTree(this.originTree, row[key], key);
        if (prop == "nopass") {
          // let index = arr.indexOf(row[prop]);
          // index++;
          // if (index >= arr.length) {
          //   index = 0;
          // }
          // node[prop] = arr[index];
          // row[prop] = arr[index];
          // 更新表格数据及树结构数据
          node[prop] = label;
          row[prop] = label;
          node["isReasonable"] = false;
          row["isReasonable"] = false;
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
            // 先进性得分
            if (row[prop] == "符合") {
              node.calScore = node.score;
              row.calScore = node.score;
            } else if (row[prop] == "基本符合") {
              node.calScore = node.score != 0 ? 3 : 0;
              row.calScore = node.score != 0 ? 3 : 0;
            } else {
              node.calScore = 0;
              row.calScore = 0;
            }
          }
        }

        if (prop == "isReasonable") {
          node[prop] = true;
          row[prop] = true;
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
        let result = "";
        if (row.isReasonable) {
          result = "REASONABLE_EXCLUSION";
        }
        if (!row.isReasonable && row["nopass"] == "符合") {
          result = "CONFORM";
        }
        if (!row.isReasonable && row["nopass"] == "不符合") {
          result = "INCONFORMITY";
        }
        if (!row.isReasonable && row["nopass"] == "基本符合") {
          result = "BASICALLY_CONFORM";
        }
        for (let i = 0; i < this.submitData.length; i++) {
          if (this.submitData[i].productionDynamicRiskId == row.id) {
            flag = true;
            index = i;
            break;
          } else {
            continue;
          }
        }
        if (!flag) {
          this.submitData.push({
            productionDynamicRiskId: row.id,
            remark: row.remarks,
            result: result
          });
        } else {
          this.submitData.splice(index, 1, {
            productionDynamicRiskId: row.id,
            remark: row.remarks,
            result: result
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
          disagreeScore: 0,
          totalScore: 0,
          missScore: 0,
          missTotal: 0
        };
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].nopass == "不符合" &&
            !this.tableData[i].isReasonable
          ) {
            score.riskScore += Number(this.tableData[i].score);
            score.disagreeScore += Number(this.tableData[i].score);
          }
          if (this.tableData[i].isReasonable) {
            score.missScore += 1;
            score.missTotal += Number(this.tableData[i].score);
          }
        }
        score.riskScore = score.riskScore >= 60 ? 60 : score.riskScore;
        score.totalScore = this.totalScore;
        let originData = this.resultTree.dataList;
        let scoreList = [];
        for (let i = 0; i < originData.length; i++) {
          let key = originData[i].dimName;
          let arr = originData[i].dataList;
          let obj = {
            checkProject: originData[i].dimValue,
            totalScore: this.totalScore,
            riskScore: 0
          };
          for (let j = 0; j < arr.length; j++) {
            // if (arr[j].nopass != "不符合") {
            //   obj.totalScore += Number(arr[j].score);
            // }
            if (arr[j].nopass == "不符合") {
              obj.riskScore += Number(arr[j].score);
            }
          }
          scoreList.push(obj);
        }
        this.scoreResult = score;

        this.$emit("getScore", score, scoreList);
      } else {
        let originData = this.resultTree.dataList;
        let score = [];
        for (let i = 0; i < originData.length; i++) {
          let key = originData[i].dimName;
          let arr = originData[i].dataList;
          let obj = this.getAdvanceTotalScore(originData[i].dataList);
          obj.checkProject = originData[i].dimValue;
          score.push(obj);
        }
        this.scoreResult = score;
        this.$emit("getScore", score, []);
      }
    },
    deleteRow(item, row) {
      if (this.type == "edit") {
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
      }
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
      // console.log(arr);
      for (let k = 0; k < this.tableColumn.length; k++) {
        this.tableColumn[k].data = [];
      }
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < this.tableColumn.length; j++) {
          if (this.tableColumn[j].level == arr[i].level) {
            let obj = {
              id: arr[i].id,
              level: arr[i].level,
              dimValue:
                arr[i].level == 2 ? arr[i].id + arr[i].longLabel : arr[i].label,
              dimName: this.tableColumn[j].prop,
              parentId: arr[i].parentId,
              score: arr[i].score,
              nopass: "不符合",
              calScore: "",
              remarks: "",
              isReasonable: false
            };
            this.tableColumn[j].data.push(obj);
          }
        }
      }
      this.treeObj.defaultData = checkList;
      this.params.paramsData = paramsData;
      // this.getDatas();
      this.resultTree = {
        id: 0,
        dimName: "start",
        dataList: []
      };
      for (let i = 0; i < this.tableColumn.length; i++) {
        let linkParent = i > 0;
        this.getTreeNode(
          this.resultTree,
          linkParent,
          JSON.stringify(this.tableColumn[i].data)
        );
      }
      // this.showTableData();
      this.originTree = JSON.parse(JSON.stringify(this.resultTree));
      this.setPrevStatus();
    },
    // 保存上一次操作状态
    setPrevStatus() {
      for (let i = 0; i < this.prevTableData.length; i++) {
        let key = "checkContent";
        let node = this.getNodeInTree(
          this.resultTree,
          this.prevTableData[i][key],
          key
        );
        if (node) {
          node.nopass = this.prevTableData[i].nopass;
          node.remarks = this.prevTableData[i].remarks;
          node.calScore = this.prevTableData[i].calScore;
          node.isReasonable = this.prevTableData[i].isReasonable;
        }
      }
      // this.getScore();
      this.showTableData();
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
    setDefault(data) {
      this.treeObj.defaultData = data;
    },
    async getDatas() {
      let url = !this.moreCheck ? TASK_TASKDYNAMIC : TASK_TASKADVANCEMENT;
      // console.log(this.taskId);
      let res = await http.get(url + "/" + this.taskId);
      if (res) {
        // console.log(res);
        this.originData = [];
        let datas = res.data.data.dataList;
        for (let i = 0; i < datas.length; i++) {
          let outObj = {};
          outObj.dimName = "checkProject";
          outObj.dimValue = datas[i].dataName;
          outObj.dataList = [];
          // 企业先进性检查
          if (this.moreCheck) {
            let scoreObj = this.getAdvanceTotalScore(datas[i].dataList);
            outObj.totalScore = scoreObj.totalScore;
            outObj.missTotal = scoreObj.missTotal;
            outObj.riskScore = scoreObj.riskScore;
            outObj.disagreeScore = scoreObj.disagreeScore;
            outObj.percent = scoreObj.percent;
          }
          for (let j = 0; j < datas[i].dataList.length; j++) {
            let inObj = {};
            let result = datas[i].dataList[j].result;
            inObj.id = datas[i].dataList[j].itemNumber;
            inObj.dimName = "checkContent";
            inObj.dimValue =
              datas[i].dataList[j].itemNumber + datas[i].dataList[j].content;
            inObj.score = datas[i].dataList[j].score;
            inObj.remarks = datas[i].dataList[j].remark;
            inObj.itemNumber = datas[i].dataList[j].itemNumber;
            inObj.dataList = [];
            if (result == "CONFORM") {
              inObj.nopass = "符合";
              inObj.isReasonable = false;
              inObj.calScore = inObj.score;
            } else if (result == "INCONFORMITY") {
              inObj.nopass = "不符合";
              inObj.isReasonable = false;
              inObj.calScore = 0;
            } else if (result == "BASICALLY_CONFORM") {
              inObj.nopass = "基本符合";
              inObj.isReasonable = false;
              inObj.calScore = 3;
            } else {
              inObj.isReasonable = true;
              inObj.nopass = "";
              inObj.calScore = "";
            }
            inObj.score = datas[i].dataList[j].score;
            outObj.dataList.push(inObj);
          }
          this.originData.push(outObj);
        }

        this.resultTree = {
          id: 0,
          dimName: "start",
          dataList: this.originData
        };
        // console.log(this.originData);
        this.originTree = JSON.parse(JSON.stringify(this.resultTree));
        this.showTableData();
        // 下拉树默认选中
        this.setTreeDefaultData();
        this.$emit("getRemarks", res.data.data.remark);
      }
      // this.originData = [
      //   {
      //     // id: 1,
      //     dimName: "checkProject",
      //     dimValue: "检查项目1",
      //     // totalScore: 100,
      //     // score: 0,
      //     // missTotal: 0,
      //     // percent: 20,
      //     dataList: [
      //       {
      //         // id: 2,
      //         dimName: "checkContent",
      //         dimValue: "1.1查验食品原辅料",
      //         score: "20",
      //         nopass: "符合",
      //         calScore: "20",
      //         isReasonable: false,
      //         remarks: "",
      //         dataList: []
      //       }]
    },
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
      this.$refs.downTreeRefs.reset();
      this.resultTree = JSON.parse(JSON.stringify(this.originTree));
      this.showTableData();
      // 下拉树默认选中
      this.setTreeDefaultData();
    },
    getResult() {
      let datas = [];
      // console.log(this.tableData);
      for (let i = 0; i < this.tableData.length; i++) {
        let result = "";
        let row = this.tableData[i];
        if (row.isReasonable) {
          result = "REASONABLE_EXCLUSION";
        }
        if (!row.isReasonable && row["nopass"] == "符合") {
          result = "CONFORM";
        }
        if (!row.isReasonable && row["nopass"] == "不符合") {
          result = "INCONFORMITY";
        }
        if (!row.isReasonable && row["nopass"] == "基本符合") {
          result = "BASICALLY_CONFORM";
        }
        if (!this.moreCheck) {
          datas.push({
            productionDynamicRiskId: this.tableData[i].id,
            remark: this.tableData[i].remarks,
            result: result
          });
        } else {
          datas.push({
            productionAdvancementRiskId: this.tableData[i].id,
            remark: this.tableData[i].remarks,
            result: result
          });
        }
      }

      return datas;
    },
    editRemarks(value, row) {
      this.remarksVisible = true;
      let key = "checkContent";
      this.remarks = row.remarks;
      let node = this.getNodeInTree(this.resultTree, row[key], key);
      // node.remarks = value;
      this.currentNode = node;
      this.currentRow = row;
      // console.log(this.resultTree);
    },
    confirmRemarks() {
      this.remarksVisible = false;
      this.currentNode.remarks = this.remarks ? this.remarks.trim() : "";
      this.currentRow["remarks"] = this.remarks ? this.remarks.trim() : "";
      this.addSubmitData(this.currentNode, this.currentNode, "remarks");
    },
    setStorageData() {
      let data = {
        score: this.scoreResult,
        resultTree: this.resultTree
      };
      if (!this.moreCheck) {
        setStorage("dynamicView", data);
      } else {
        setStorage("advanceView", data);
      }
    },
    setViewData() {
      let data = !this.moreCheck
        ? getStorage("dynamicView")[0]
        : getStorage("advanceView")[0];
      let resultData = data.resultTree.dataList;
      if (this.moreCheck) {
        for (let i = 0; i < resultData.length; i++) {
          let scoreObj = this.getAdvanceTotalScore(resultData[i].dataList);
          resultData[i].totalScore = scoreObj.totalScore;
          resultData[i].missTotal = scoreObj.missTotal;
          resultData[i].riskScore = scoreObj.riskScore;
          resultData[i].disagreeScore = scoreObj.disagreeScore;
          resultData[i].percent = scoreObj.percent;
        }
      }

      this.resultTree = {
        id: 0,
        dimName: "start",
        dataList: resultData
      };
      this.showTableData();
      this.getViewTotal();
    },
    setViewTotalData() {
      let data = !this.moreCheck
        ? getStorage("dynamicView")[0]
        : getStorage("advanceView")[0];

      if (data) {
        this.resultTree = data.resultTree;
        // 预览数据
        let viewData = deepClone(this.resultTree.dataList);
        let treeData = deepClone(this.treeObj.data);
        let resultData = [];
        // console.log(viewData);
        // console.log(treeData);
        // 补齐所有项目
        for (let i = 0; i < treeData.length; i++) {
          let obj = {
            dimName: "checkProject",
            dimValue: treeData[i].label,
            dataList: []
          };
          let flag = false;
          let dataIndex = -1;

          for (let j = 0; j < viewData.length; j++) {
            if (treeData[i].label == viewData[j].dimValue) {
              dataIndex = j;
              flag = true;
              break;
            } else {
              continue;
            }
          }

          if (!flag) {
            for (let k = 0; k < treeData[i].children.length; k++) {
              obj.dataList.push({
                dimName: "checkContent",
                dimValue:
                  treeData[i].children[k].id +
                  treeData[i].children[k].longLabel,
                id: treeData[i].children[k].id,
                isReasonable: false,
                nopass: "符合",
                remarks: "",
                calScore: treeData[i].children[k].score,
                score: treeData[i].children[k].score
              });
            }
          } else {
            let list = treeData[i].children;
            for (let m = 0; m < list.length; m++) {
              let inIndex = -1;
              for (let n = 0; n < viewData[dataIndex].dataList.length; n++) {
                if (
                  list[m].id + list[m].longLabel ==
                  viewData[dataIndex].dataList[n].dimValue
                ) {
                  inIndex = n;
                  break;
                } else {
                  continue;
                }
              }
              if (inIndex == -1) {
                obj.dataList.push({
                  dimName: "checkContent",
                  dimValue: list[m].id + list[m].longLabel,
                  id: list[m].id,
                  isReasonable: false,
                  nopass: "符合",
                  remarks: "",
                  calScore: list[m].score,
                  score: list[m].score
                });
              } else {
                obj.dataList.push(viewData[dataIndex].dataList[inIndex]);
              }
            }
          }
          resultData.push(obj);
        }

        if (this.moreCheck) {
          for (let i = 0; i < resultData.length; i++) {
            let scoreObj = this.getAdvanceTotalScore(resultData[i].dataList);
            resultData[i].totalScore = scoreObj.totalScore;
            resultData[i].missTotal = scoreObj.missTotal;
            resultData[i].riskScore = scoreObj.riskScore;
            resultData[i].disagreeScore = scoreObj.disagreeScore;
            resultData[i].percent = scoreObj.percent;
          }
        }

        this.resultTree = {
          id: 0,
          dimName: "start",
          dataList: resultData
        };
        this.showTableData();
        this.getViewTotal();
      }
    },
    getViewTotal() {
      let data = [];
      let originData = this.resultTree.dataList;
      if (!this.moreCheck) {
        for (let i = 0; i < originData.length; i++) {
          let outObj = {
            checkProject: originData[i].dimValue,
            totalScore: 0,
            riskScore: 0
          };
          for (let j = 0; j < originData[i].dataList.length; j++) {
            if (
              originData[i].dataList[j].nopass == "不符合" &&
              originData[i].dataList[j].score != 0
            ) {
              outObj.riskScore += Number(originData[i].dataList[j].score);
            }
            outObj.totalScore += Number(originData[i].dataList[j].score);
          }
          data.push(outObj);
        }
      } else {
        for (let i = 0; i < originData.length; i++) {
          let outObj = {
            checkProject: originData[i].dimValue,
            percent: 0,
            totalScore: 0,
            disagreeScore: 0,
            missTotal: 0
          };
          let scoreObj = this.getAdvanceTotalScore(originData[i].dataList);
          outObj.totalScore = scoreObj.totalScore;
          outObj.missTotal = scoreObj.missTotal;
          outObj.riskScore = scoreObj.riskScore;
          outObj.disagreeScore = scoreObj.disagreeScore;
          outObj.percent = scoreObj.percent;
          data.push(outObj);
        }
      }

      this.$emit("getViewTotal", data);
    },
    getAdvanceTotalScore(arr) {
      let obj = {
        totalScore: this.totalScore,
        riskScore: 0,
        disagreeScore: 0,
        missTotal: 0,
        missNum: 0,
        percent: 0
      };
      for (let i = 0; i < arr.length; i++) {
        if (
          arr[i].nopass == "符合" &&
          !arr[i].isReasonable &&
          arr[i].score != 0
        ) {
          obj.riskScore += Number(arr[i].score);
        }
        if (
          arr[i].nopass == "不符合" &&
          !arr[i].isReasonable &&
          arr[i].score != 0
        ) {
          obj.disagreeScore += Number(arr[i].score);
        }
        if (
          arr[i].nopass == "基本符合" &&
          !arr[i].isReasonable &&
          arr[i].score != 0
        ) {
          obj.riskScore += 3;
        }
        if (arr[i].isReasonable && arr[i].score != 0) {
          obj.missTotal += Number(arr[i].score);
        }
        if (arr[i].isReasonable) {
          obj.missNum += 1;
        }
        // obj.totalScore += Number(arr[i].score);
      }
      let percent =
        obj.totalScore - obj.missTotal != 0
          ? Math.floor((obj.riskScore / (obj.totalScore - obj.missTotal)) * 100)
          : 0;
      obj.percent = percent;
      return obj;
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
      .radio-item {
        display: inline-block;
        // padding-left: 15px;
        margin-right: 4px;
        position: relative;
        .out {
          display: block;
          float: left;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          position: relative;
          border: 1px solid #ccc;
          margin: 7px 2px 0 0;
          label {
            display: block;
            width: 4px;
            height: 4px;
            border-radius: 2px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ccc;
          }
          &.active {
            border: 1px solid #409eff;
            label {
              background: #409eff;
            }
          }
        }
      }
    }
    .relable {
      display: block;
      margin: 0 10px 0 10px;
      float: left;
      width: 90px;
    }
    .scores {
      display: block;
      float: left;
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
    cursor: pointer;
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
        margin-bottom: 10px;
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