<template>
  <div id="account">
    <el-row>
      <el-col>
        <el-button type="primary" size="small" @click="addAccount">新建账户</el-button>
        <el-button type="danger" size="small" @click="delAccount(false)">删除账户</el-button>
      </el-col>
    </el-row>
    <div v-loading="loading" element-loading-text="加载中...">
      <el-row style="margin-top:10px">
        <el-col>
          <el-table :data="tableData" border @selection-change="changeFun">
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column prop="loginName" show-overflow-tooltip label="用户名" align="center"></el-table-column>
            <el-table-column
              prop="userType"
              show-overflow-tooltip
              label="账户类型"
              align="center"
              v-if="openDisplay"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.userType == 'NORMAL_USER'">普通账户</span>
                <span v-else>演示账户</span>
              </template>
            </el-table-column>
            <el-table-column prop="jur" show-overflow-tooltip label="功能权限" align="center">
              <template slot-scope="scope">
                <template v-for="(item,index) in scope.row.permission">
                  <span v-if="index==0" :key="index">{{item.name}}</span>
                  <span v-else :key="index">、{{item.name}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="area" show-overflow-tooltip label="区域" align="center"></el-table-column>
            <el-table-column prop="note" show-overflow-tooltip label="备注" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.admin"
                  type="text"
                  size="small"
                  style="margin-right:4px;padding-left:0;padding-right:0"
                  @click="editAccount(scope.row)"
                >
                  <span style="color:#409eff">修改</span>
                </el-button>
                <!--<el-button type="text" slot="reference" style="margin-right:4px;margin-left:0;padding-left:0;padding-right:0" @click="resetPassword(scope.row)">
									<span style="color:#E6A23C">重置密码</span>
                </el-button>-->
                <el-popover placement="top" v-model="scope.row.visiblea">
                  <p>
                    <i class="el-icon-warning" style="color:#e6a23c;font-size:16px"></i> 确定要重置该账户密码？
                  </p>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" type="text" @click="scope.row.visiblea = false">取消</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      style="padding:5px 15px"
                      @click="resetPassword(scope.row)"
                    >确定</el-button>
                  </div>
                  <el-button type="text" slot="reference">
                    <span style="color:#E6A23C">重置密码</span>
                  </el-button>
                </el-popover>
                <el-popover v-if="!scope.row.admin" placement="top" v-model="scope.row.visible">
                  <p>
                    <i class="el-icon-warning" style="color:#e6a23c;font-size:16px"></i> 确定要删除该账户吗？
                  </p>
                  <div style="text-align: right; margin-top: 10px">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      style="padding:5px 15px"
                      @click="delAccount(scope.row)"
                    >确定</el-button>
                  </div>
                  <el-button type="text" slot="reference">
                    <span style="color:#f56c6c">删除</span>
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px" v-show="pag.total>0">
        <el-col align="right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pag.page"
            :page-sizes="pag.pageSizes"
            :page-size="pag.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pag.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="dialog.title"
      :visible.sync="dialog.dialogShow"
      width="580px"
      :before-close="handleClose"
    >
      <el-form
        v-loading="dialog.loading"
        :element-loading-text="dialog.loadingTxt"
        :model="formData"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="loginName">
          <el-input
            size="small"
            :disabled="dialog.title=='修改账户'"
            placeholder="请输入用户名"
            v-model="formData.loginName"
            @blur="formData.loginName=formData.loginName.replace(/\s/g,'')"
          />
        </el-form-item>
        <el-form-item label="账户类型" prop="userType" v-show="openDisplay">
          <el-select
            clearable
            v-model="formData.userType"
            size="small"
            placeholder="选择账户类型"
            :disabled="dialog.title=='修改账户'"
            @change="userTypeChange"
          >
            <el-option v-for="item in userTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="系统配置"
          prop="certCoefficientInfo"
          v-show="formData.userType == 'DISPLAY_USER'"
        >
          <div class="config-box">
            <div class="config-item config-header">
              <span>时间</span>
              <span>总监测商家数</span>
              <span>总体违规率</span>
              <span class="last"></span>
            </div>
            <div
              class="config-item"
              v-for="(item, kIndex) in formData.certCoefficientInfo"
              :key="kIndex+'sysconfig'"
            >
              <span>
                <el-input
                  v-model="item.date"
                  placeholder="演示数据时间"
                  :disabled="currentTime==item.date"
                  @change="canSaveEdit"
                ></el-input>
              </span>
              <span>
                <el-input
                  v-model="item.certStoreCoefficient"
                  placeholder="商家总数"
                  @change="canSaveEdit"
                ></el-input>
              </span>
              <span>
                <el-input
                  v-model="item.certRateCoefficient"
                  placeholder="违规率系数"
                  @change="canSaveEdit"
                >
                  <template slot="append">%</template>
                </el-input>
              </span>
              <span class="last">
                <i
                  class="el-icon-circle-plus"
                  @click="addUserConfig(item.date)"
                  v-show="kIndex==formData.certCoefficientInfo.length-1&&kIndex<5"
                ></i>
                <i class="el-icon-remove" @click="delUserConfig(item)" v-show="kIndex!=0"></i>
              </span>
            </div>
            <div class="tips">
              *监测商家总数、违规率系数不填写默认等于真实值
              <br />*实际情况可能与配置值有少许波动
            </div>
          </div>
        </el-form-item>
        <el-form-item label="功能权限" prop="permission">
          <el-input style="display:none" size="small" v-model="formData.permission.join('')" />
          <div class="jurs">
            <span
              v-for="(item,index) in jurs.checkData"
              v-if="!item.children"
              :key="item.id"
              class="jur"
            >
              {{item.name}}
              <i class="jur-close el-icon-close" @click="removeJur(index)"></i>
            </span>
            <span v-show="!jurs.checkData.length" class="jur-default">请选择功能权限</span>
            <div class="jur-arrow" @click="jurs.show=!jurs.show">
              <i class="el-icon-arrow-down" :class="{'arrow-rotate':jurs.show}"></i>
            </div>
            <div class="jurs-modal" :class="{'jurs-modal-rotate':jurs.show}">
              <div>
                <el-tree
                  @check="jurCheck"
                  ref="tree"
                  :data="jurs.jurData"
                  show-checkbox
                  node-key="id"
                  :default-checked-keys="jurs.defaultChecked"
                  :props="jurs.defaultProps"
                ></el-tree>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-input style="display:none" size="small" v-model="formData.area.provinceId" />
          <szlRegione
            @regChange="regChange"
            ref="szlRegione"
            :pdisable="pdisable"
            :adisable="adisable"
            :cdisable="cdisable"
            :regioneIds="formData.area"
          />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input size="small" v-model="formData.note" @keyup.native="inputMsgChange('note')" />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col align="center">
          <el-button
            size="small"
            @click="clickAddBtn"
            :disabled="dialog.btnTxt!='创建'&&isTheSame"
          >{{dialog.btnTxt}}</el-button>
          <el-button size="small" @click="handleClose">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import szlRegione from "@/components/szl-regione.vue";
import http from "@/unit/http";
import apis from "@/unit/apis";
import { throttle } from "@/unit/pub";
const { TENANT, PERMISSION, PASSWORD_RESET } = apis;
export default {
  data() {
    const nameFun = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]+$/;

      if (!value) {
        return callback(new Error("用户名不能为空"));
      }

      if (!reg.test(value)) {
        return callback(new Error("用户名只能包含数字和字母"));
      }

      if (value.length > 18) {
        return callback(new Error("内容不能超过18个字符"));
      }

      return callback();
    };

    const userTypeFun = (rule, value, callback) => {
      if (this.openDisplay) {
        if (value == "") {
          return callback(new Error("账户类型不能为空"));
        }
      }
      return callback();
    };

    const sysConfigFun = (rule, value, callback) => {
      let reg = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])$/);
      let numReg = new RegExp(/^[0-9]*$/);
      let floatReg = new RegExp(/^(\d+|\d+\.\d{1,2})$/);
      if (value.length && this.formData.userType == "DISPLAY_USER") {
        value.forEach((item, index) => {
          let percentNums = item.certRateCoefficient;
          if (item.date == "" || item.date == null) {
            return callback(new Error("请填写演示数据时间！"));
          }
          if (item.date != "") {
            if (!reg.test(item.date)) {
              return callback(
                new Error("演示数据时间不能为空且格式为xxxx-xx，例2019-01")
              );
            } else {
              this.formData.certCoefficientInfo.forEach((itema, indexa) => {
                if (item.date == itema.date && index != indexa) {
                  return callback(new Error("演示数据时间重复！"));
                }
              });
            }
          }

          if (
            !numReg.test(item.certStoreCoefficient) &&
            item.certStoreCoefficient != null
          ) {
            return callback(new Error("商家数量必须为正确数字！"));
          }
          if (
            item.certRateCoefficient != "" &&
            item.certRateCoefficient != null
          ) {
            if (
              !floatReg.test(percentNums) ||
              percentNums < 0 ||
              percentNums > 100
            ) {
              return callback(
                new Error("商家违规率必须为正确百分比，最多两位小数！")
              );
            }
          }
        });
      }
      return callback();
    };

    const jurFun = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error("权限功能不能为空"));
      }

      return callback();
    };
    const areaFun = (rule, value, callback) => {
      if (!value.provinceId) {
        return callback(new Error("请选择区域"));
      }

      return callback();
    };

    const pubFun = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      if (value.length > 50) {
        return callback(new Error("内容不能超过50个字符"));
      }

      return callback();
    };
    return {
      pdisable: false,
      cdisable: false,
      adisable: false,
      tableData: [],
      pag: {
        page: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 0,
        currentSize: 0
      },
      loading: false,
      dialog: {
        loading: false,
        loadingTxt: "",
        dialogShow: false,
        title: "",
        btnTxt: ""
      },
      oldFormData: {
        //修改的时候对比数据有没有变化
      },
      formData: {
        loginName: "",
        permission: [],
        area: {
          cityId: "",
          provinceId: "",
          districtId: ""
        },
        note: "",
        tenantId: "",
        userType: "",
        certCoefficientInfo: []
      },
      userTypes: [
        {
          id: "NORMAL_USER",
          name: "普通账户"
        },
        {
          id: "DISPLAY_USER",
          name: "演示账户"
        }
      ],
      openDisplay: false, // 设置账户类型权限
      currentTime: "",
      isTheSame: true,
      currentChange: "",
      rules: {
        loginName: [
          {
            required: true,
            validator: nameFun,
            trigger: "change"
          }
        ],
        userType: [
          {
            required: true,
            validator: userTypeFun,
            trigger: "change"
          }
        ],
        certCoefficientInfo: [
          {
            required: true,
            validator: sysConfigFun,
            trigger: "blur"
          }
        ],
        permission: [
          {
            required: true,
            validator: jurFun,
            trigger: "change"
          }
        ],
        area: [
          {
            required: true,
            validator: areaFun,
            trigger: "change"
          }
        ],
        note: [
          {
            validator: pubFun,
            trigger: "change"
          }
        ]
      },
      jurs: {
        show: false,
        jurData: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        checkData: [],
        defaultChecked: []
      },
      checkAccount: [],
      clickAddBtn: () => {}
    };
  },
  components: {
    szlRegione
  },
  methods: {
    regChange(e) {
      this.formData.area = e;
    },
    async init() {
      if (this.loading) {
        return false;
      }
      this.loading = true;
      if (!this.jurs.jurData.length) {
        let jurs = await http.get(PERMISSION);

        if (jurs) {
          this.jurs.jurData = [...jurs.result];
        }
      }
      let res = await http.get(
        TENANT + "/" + this.pag.page + "/" + this.pag.pageSize
      );
      if (res) {
        this.tableData = [...res.result.content];
        this.pag.total = res.result.totalSize;
        this.pag.currentSize = res.result.content.length;
      }
      this.loading = false;
    },
    addAccount() {
      [
        this.disable,
        this.dialog.dialogShow,
        this.dialog.title,
        this.dialog.btnTxt
      ] = [false, true, "新建账户", "创建"];
      this.$nextTick(() => {
        this.$refs.szlRegione.init();
      });
    },
    changeFun(e) {
      this.checkAccount = [...e];
    },
    handleSizeChange(e) {
      this.pag.page = 1;
      this.pag.pageSize = e;
      this.$nextTick(() => {
        this.init();
      });
    },
    handleCurrentChange(e) {
      this.pag.page = e;
      this.$nextTick(() => {
        this.init();
      });
    },
    handleClose() {
      let curTime = this.currentTime;
      this.dialog.dialogShow = false;
      this.jurs.checkData = [];
      this.jurs.defaultChecked = [];
      this.jurs.show = false;
      let userMsg = this.$store.state.userMsg;
      this.formData = {
        loginName: "",
        loginPassword: "",
        permission: [],
        area: {
          cityId: userMsg.cityId ? userMsg.cityId : "",
          provinceId: userMsg.provinceId ? userMsg.provinceId : "",
          districtId: userMsg.zoneId ? userMsg.zoneId : ""
        },
        note: "",
        tenantId: "",
        userType: "",
        certCoefficientInfo: []
      };
      if (userMsg.provinceId) {
        this.pdisable = true;
      } else {
        this.pdisable = false;
      }
      if (userMsg.cityId) {
        this.cdisable = true;
      } else {
        this.cdisable = false;
        this.adisable = true;
      }
      if (userMsg.zoneId) {
        this.adisable = true;
      } else {
        this.adisable = false;
      }
      this.$refs.tree.setCheckedKeys([]);
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    addConfirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        this.createAcount();
      });
    },
    jurCheck(e, b) {
      this.jurs.checkData = [...b.checkedNodes];
      let jurIds = [];
      this.formData.permission = this.$refs.tree.getCheckedKeys();
      this.$nextTick(() => {
        this.permissionChange();
      });
    },
    removeJur(e) {
      let id = this.jurs.checkData[e].id;
      this.jurs.checkData.splice(e, 1);
      let jurIds = [];
      this.$refs.tree.getCheckedKeys().forEach(item => {
        if (item != id) {
          jurIds.push(item);
        }
      });
      this.$refs.tree.setCheckedKeys(jurIds);
      this.formData.permission = jurIds;
      this.$nextTick(() => {
        this.permissionChange();
      });
    },
    permissionChange() {
      if (
        (!this.isTheSame || this.dialog.btnTxt == "创建") &&
        this.currentChange != "jur"
      ) {
        return false;
      }
      this.currentChange = "jur";
      if (
        this.formData.permission.length == this.oldFormData.permission.length
      ) {
        for (let i = 0, n = this.formData.permission.length; i < n; i++) {
          if (this.formData.permission[i] != this.oldFormData.permission[i]) {
            this.isTheSame = false;
            break;
          } else {
            if (!this.isTheSame) {
              this.isTheSame = true;
            }
          }
        }
      } else {
        this.isTheSame = false;
      }
    },
    inputMsgChange(e) {
      if (
        (!this.isTheSame || this.dialog.btnTxt == "创建") &&
        this.currentChange != e
      ) {
        return false;
      }
      this.currentChange = e;
      if (this.formData[e] == this.oldFormData[e]) {
        this.isTheSame = true;
      } else {
        this.isTheSame = false;
      }
    },
    async createAcount() {
      if (!this.openDisplay) {
        this.formData.userType = "NORMAL_USER";
      }
      ///新建,修改账户
      [this.dialog.loading, this.dialog.loadingTxt] = [true, "保存中..."];
      let res =
        this.dialog.btnTxt == "创建"
          ? await http.post(TENANT, this.formData)
          : await http.put(TENANT + "/" + this.formData.id, this.formData);
      this.dialog.loading = false;
      if (res) {
        if (res.result) {
          this.init();
          this.handleClose();
          if (this.dialog.btnTxt == "创建") {
            let div = `<div style="display:inline-block;text-align:left">账户创建成功！<br/>初始密码为：${res.result}</div>`;
            this.$alert(div, "提示", {
              dangerouslyUseHTMLString: true,
              center: true,
              customClass: "alert-box"
            });
          } else {
            this.$message({
              message: "账户信息修改成功",
              type: "success"
            });
          }
        }
      }
    },
    async editAccount(obj) {
      this.isTheSame = true;
      [this.dialog.loading, this.dialog.loadingTxt] = [true, "加载中..."];
      [
        this.adisable,
        this.pdisable,
        this.cdisable,
        this.dialog.dialogShow,
        this.dialog.title,
        this.dialog.btnTxt
      ] = [true, true, true, true, "修改账户", "修改"];
      let res = await http.get(TENANT + "/" + obj.id);
      if (res) {
        // this.oldFormData = Object.assign({}, res.result);
        this.oldFormData = JSON.parse(JSON.stringify(res.result));
        this.formData = Object.assign({}, res.result);
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.formData.permission);
          this.jurs.checkData = [...this.$refs.tree.getCheckedNodes()];
          this.$refs.szlRegione.init();
        });
      }
      this.dialog.loading = false;
    },
    resetPassword(e) {
      ///重置密码
      e.visiblea = false;
      this.newPassword(e.id, e.loginName);
    },
    async newPassword(id, name) {
      let res = await http.put(PASSWORD_RESET + "/" + id);
      if (res) {
        if (res) {
          let div = `<div style="display:inline-block;text-align:left">用户"${name}"重置密码成功！<br/>新密码为：${res.result}</div>`;
          this.$alert(div, "提示", {
            dangerouslyUseHTMLString: true,
            center: true,
            customClass: "alert-box"
          });
        }
      }
    },
    delAccount(e) {
      if (e) {
        this.deleteAccount([e.id]);
        e.visible = false;
      } else {
        if (this.checkAccount.length) {
          this.$confirm("确定要删除选中的账户？", "删除账户", {
            type: "warning"
          })
            .then(_ => {
              let ids = [];
              this.checkAccount.forEach(item => {
                ids.push(item.id);
              });
              this.deleteAccount(ids);
            })
            .catch(_ => {});
        } else {
          this.$message.error("请选择要删除的账户");
        }
      }
    },
    async deleteAccount(ids) {
      //删除账户
      let res = await http.delete(
        TENANT + "?id=" + ids.join(","),
        {},
        [],
        true
      );
      if (res) {
        this.$message({
          message: "删除账户成功",
          type: "success"
        });
        setTimeout(() => {
          if (ids.length < this.pag.currentSize) {
            this.init();
          } else {
            if (this.pag.page > 1) {
              this.pag.page--;
              this.init();
            } else {
              this.init();
            }
          }
        }, 200);
      }
    },
    userTypeChange(type) {
      // console.log(type);
      if (type == "NORMAL_USER") {
        this.formData.certCoefficientInfo = [];
      } else {
        if (this.dialog.btnTxt == "创建") {
          this.setNormalConfig();
        } else {
          if (this.oldFormData.userType == "NORMAL_USER") {
            this.setNormalConfig();
          } else {
            this.formData.certCoefficientInfo = JSON.parse(
              JSON.stringify(this.oldFormData.certCoefficientInfo)
            );
          }
        }
      }
      if (type == this.oldFormData.userType) {
        this.isTheSame = true;
      } else {
        this.isTheSame = false;
      }
    },
    addUserConfig(item) {
      let year = Number(item.split("-")[0]);
      let month = Number(item.split("-")[1]);
      if (month == 1) {
        year = year - 1;
        month = 12;
      } else {
        month = month - 1 < 10 ? "0" + (month - 1).toString() : month - 1;
      }
      this.formData.certCoefficientInfo.push({
        date: year + "-" + month,
        certStoreCoefficient: "",
        certRateCoefficient: ""
      });
      this.canSaveEdit();
    },
    delUserConfig(item) {
      let index = this.formData.certCoefficientInfo.indexOf(item);
      if (index != -1) {
        this.formData.certCoefficientInfo.splice(index, 1);
        this.canSaveEdit();
      }
    },
    setNormalConfig() {
      let date = new Date();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month.toString() : month;
      this.currentTime = date.getFullYear() + "-" + month;
      this.formData.certCoefficientInfo = [
        {
          date: this.currentTime,
          certStoreCoefficient: "",
          certRateCoefficient: ""
        }
      ];
    },
    canSaveEdit() {
      if (
        JSON.stringify(this.formData.certCoefficientInfo) ==
        JSON.stringify(this.oldFormData.certCoefficientInfo)
      ) {
        this.isTheSame = true;
      } else {
        this.isTheSame = false;
      }
    }
  },
  created() {
    this.init();
    this.clickAddBtn = throttle(this.addConfirm, 500);
    let userMsg = this.$store.state.userMsg;
    this.openDisplay = userMsg.openDisplay;
    // this.openDisplay = true;
    this.formData.area = {
      cityId: userMsg.cityId ? userMsg.cityId : "",
      provinceId: userMsg.provinceId ? userMsg.provinceId : "",
      districtId: userMsg.zoneId ? userMsg.zoneId : ""
    };

    if (userMsg.provinceId) {
      this.pdisable = true;
    }
    if (userMsg.cityId) {
      this.cdisable = true;
    } else {
      this.adisable = true;
    }
    if (userMsg.zoneId) {
      this.adisable = true;
    }
    if (userMsg.openDisplay) {
      this.setNormalConfig();
    }
  },

  mounted() {}
};
</script>

<style lang="scss">
.alert-box {
  width: 320px !important;
}

#account {
  .el-input__icon {
    line-height: 28px !important;
  }
  .el-table td {
    padding: 4px 0;
  }
  .el-dialog__body {
    padding-top: 0px;
  }
  .el-form-item {
    margin-bottom: 10px;
    .config-box {
      width: 480px;
      margin-top: 5px;
      .config-header {
        span {
          border-top: 1px solid #eee;
        }
      }
      .config-item {
        width: 100%;
        overflow: hidden;
        span {
          display: block;
          width: 25%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-left: 1px solid #eee;
          border-bottom: 1px solid #eee;
          box-sizing: border-box;
          float: left;
          overflow: hidden;
          .el-input-group {
            vertical-align: none;
          }
          .el-input__inner {
            height: 30px;
            line-height: 30px;
            padding: 0;
            border: none;
            text-align: center;
          }
          .el-input-group__append,
          .el-input-group__prepend {
            background: none;
            border: none;
            padding: 0 10px;
          }
          &.last {
            width: 16%;
            border-top: none;
            border-bottom: none;
            line-height: 40px;
            text-align: left;
            padding-left: 10px;
            .el-icon-circle-plus,
            .el-icon-remove {
              font-size: 24px;
              cursor: pointer;
            }
            .el-icon-circle-plus {
              color: #40a42b;
            }
            .el-icon-remove {
              color: #f56c6c;
            }
          }
        }
      }
      .tips {
        margin: 5px 0;
        font-size: 12px;
        color: #999;
        line-height: 18px;
      }
    }
  }
  .el-form-item__error {
    padding-top: 0;
  }
  .el-table td {
    padding: 4px 0;
  }
  .jurs {
    position: relative;
    top: 4px;
    width: 100%;
    min-height: 32px;
    line-height: 28px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 2px 32px 2px 15px;
    z-index: 10;
    .jur-default {
      color: #c0c4cc;
    }
    .jur {
      display: inline-block;
      margin-right: 4px;
      background: #f0f2f5;
      border-radius: 2px;
      color: #666;
      height: 24px;
      line-height: 24px;
      padding: 0 6px 0 10px;
      .jur-close {
        background-color: #c0c4cc;
        color: #fff;
        border-radius: 50%;
        cursor: pointer;
        &:hover {
          background-color: #999;
        }
      }
    }
    .jur-arrow {
      position: absolute;
      width: 30px;
      height: 30px;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
      text-align: center;
      cursor: pointer;
      .el-icon-arrow-down {
        position: relative;
        top: 3px;
        font-size: 18px;
        color: #c0c4cc;
        transition: all 0.3s;
        transform: rotate(0);
      }
      .arrow-rotate {
        transform: rotate(180deg);
      }
    }
    .jurs-modal {
      position: absolute;
      width: 100%;
      top: 100%;
      left: 0;
      transform-origin: top;
      transform: rotateX(-90deg);
      transition: transform 0.3s ease;
      > div {
        position: relative;
        width: 100%;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 10px 2px;
        left: -2px;
        border-radius: 4px;
        margin-top: 10px;
        border: 1px solid #dcdfe6;
        box-sizing: content-box;
        background: #fff;
      }
    }
    .jurs-modal-rotate {
      transform: rotateX(0deg);
    }
  }
  .jurs-disable {
    background: #f5f7fa;
    border-color: #e4e7ed;
    cursor: not-allowed;
    .jur-arrow {
      cursor: not-allowed;
    }
  }
  .is-error .jurs {
    border-color: #f56c6c;
  }
  .is-success .jurs {
    border-color: #67c23a;
  }
}
</style>