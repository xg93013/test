<template>
  <div id="PlanDetail" class="PlanDetail">
    <div class="commonWidth top">
      <div class="fl top-title approval-top">
        <svg-icon iconClass="list" v-show="planTypeShow=='add'||planTypeShow=='copy'"></svg-icon>
        <svg-icon
          iconClass="eye"
          v-show="planTypeShow=='planView' || planTypeShow == 'planListView'"
        ></svg-icon>
        <svg-icon iconClass="edit" v-show="planTypeShow=='edit'"></svg-icon>
        <span>{{title}} -《{{planTypeShow == 'planView' || planTypeShow == 'planListView' ? normalForm.planName : normalForm.planNo}}》</span>
      </div>
      <div class="fr approval-top">
        <div v-show="planTypeShow=='add'||planTypeShow=='edit'||planTypeShow=='copy' " class="fr">
          <el-button type="primary" @click="viewPlan">
            <svg-icon iconClass="eye" class="title-icon"></svg-icon>计划预览
          </el-button>
          <span class="tips">*为必填项</span>
        </div>
        <div v-show="planTypeShow=='approval'||planTypeShow=='approvalDetail'">
          <div class="fl approval-status">
            <span class="wait" v-show="planStatus == 'UNAPPROVED'">待审批</span>
            <span class="pass" v-show="planStatus == 'APPROVE_PASS'">审批通过</span>
            <span class="nopass" v-show="planStatus == 'APPROVE_NOT_PASS'">审批未通过</span>
            <span class="execute" v-show="planStatus == 'EXECUTE_PLAN'">计划执行</span>
          </div>
          <div class="fr" v-show="planTypeShow=='approval' && planStatus == 'UNAPPROVED'">
            <el-button type="primary" @click="approvalPlan('pass')">
              <svg-icon iconClass="eye" class="title-icon"></svg-icon>
              <span>审批通过</span>
            </el-button>
            <el-button @click="approvalPlan('reject')">
              <svg-icon iconClass="eye" class="title-icon"></svg-icon>
              <span>审批否决</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-form ref="normalFormRefs" :model="normalForm" :rules="normalFormRules" label-width="120px">
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
                        placeholder="请选择计划类型"
                        style="width: 100%;"
                        :disabled="disabled||disabledPlanNo"
                        @change="changePlanType"
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
              <el-form-item label="检查年份" prop="year">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="year"
                        placeholder="请选择检查年份"
                        v-model="normalForm.year"
                        style="width: 100%;"
                        value-format="yyyy"
                        :disabled="disabled||disabledPlanNo"
                        @change="changeYear"
                      ></el-date-picker>
                      <!-- <el-input v-model="normalForm.year"></el-input> -->
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="date"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="计划编号" prop="planNo">
                <template>
                  <div class="form-item">
                    <el-input v-model="normalForm.planNo" disabled placeholder="请输入计划编号"></el-input>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="计划名称" prop="planName">
                <template>
                  <div class="form-item">
                    <!-- <el-autocomplete
                      v-model="normalForm.planName"
                      :fetch-suggestions="remoteMethod"
                      placeholder="请输入计划名称"
                      @select="handleSelect"
                      :disabled="disabled"
                      style="width:100%"
                    ></el-autocomplete>-->
                    <el-input v-model="normalForm.planName" :disabled="true" placeholder="请输入计划名称"></el-input>
                  </div>
                </template>
              </el-form-item>
              <!-- <el-form-item label="计划编号" prop="planDocNo">
                <template>
                  <div class="form-item">
                    <el-input
                      v-model="normalForm.planDocNo"
                      :disabled="disabled"
                      placeholder="请输入计划编号"
                    ></el-input>
                  </div>
                </template>
              </el-form-item>-->
              <el-form-item label="执行开始日期" prop="planBeginDate">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="date"
                        placeholder="请选择执行开始日期"
                        v-model="normalForm.planBeginDate"
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
              <el-form-item label="执行结束日期" prop="planEndDate">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-date-picker
                        type="date"
                        placeholder="请选择执行结束日期"
                        v-model="normalForm.planEndDate"
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
              <el-form-item label="管理单位" label-width="120px" prop="planAdminOrg">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.planAdminOrg"
                        placeholder="请选择管理单位"
                        style="width: 100%;"
                        :disabled="disabled"
                      >
                        <el-option
                          :label="item.label"
                          :value="item.label"
                          v-for="(item, index) in planAdminOrgList"
                          :key="'planAdminOrg'+index"
                          @click.native="changePlanAdminOrg(item)"
                        ></el-option>
                        <!-- <el-option label="类型2" value="beijing"></el-option> -->
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="机构/处室：" label-width="120px" prop="planImplOrg">
                <template>
                  <div class="form-item">
                    <div class="left-item">
                      <el-select
                        v-model="normalForm.planImplOrg"
                        placeholder="请选择机构/处室"
                        style="width: 100%;"
                        :disabled="disabled"
                      >
                        <el-option
                          :label="item.label"
                          :value="item.label"
                          v-for="(item, index) in planImplOrgList"
                          :key="'planImplOrg'+index"
                          @click.native="changePlanImplOrg(item)"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="icons" v-show="!disabled">
                      <svg-icon iconClass="down"></svg-icon>
                    </div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="备注信息" label-width="120px" prop="planMemo">
                <template>
                  <div class="form-item textarea">
                    <el-input
                      type="textarea"
                      v-model="normalForm.planMemo"
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
          <div class="bot-top" v-show="!disabled">
            <div class="common-title">被检查企业主体信息</div>
            <el-form
              :model="projectForm"
              ref="projectFormRefs"
              :rules="projectFormRules"
              label-width="120px"
            >
              <div class="fl item">
                <div class="form">
                  <el-form-item label="所属区域：" prop="type">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.area"
                            placeholder="区域"
                            style="width: 100%;"
                            :disabled="disabled"
                          >
                            <el-option
                              :label="item.name"
                              :value="item.name"
                              v-for="(item, index) in areaList"
                              :key="'areaList'+index"
                            ></el-option>
                            <!-- @click.native="changeType(item)" -->
                          </el-select>
                        </div>
                        <div class="icons" v-show="!disabled">
                          <svg-icon iconClass="down"></svg-icon>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                  <!-- <el-form-item label="大类：" prop="categoryLv1">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.categoryLv1"
                            placeholder="大类"
                            style="width: 100%;"
                            :disabled="disabled"
                          >
                            <el-option
                              v-for="(item,index) in categoryList"
                              :label="item.label"
                              :value="item.label"
                              :key="'kingslist'+index"
                              @click.native="changeCategoryLv1(item)"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="icons" v-show="!disabled">
                          <svg-icon iconClass="down"></svg-icon>
                        </div>
                      </div>
                    </template>
                  </el-form-item>-->
                  <!-- <div
                  class="empty-class"
                  @click="addKinds"
                  v-show="!disabled&&categoryList.length==0"
                  >业态下大类若不存在，请点击此处新增</div>-->
                </div>
              </div>
              <div class="fl item">
                <!-- <div class="common-title">牵头单位</div> -->
                <div class="form">
                  <el-form-item label="企业名称" prop="entName">
                    <template>
                      <div class="form-item">
                        <div class="left-item">
                          <el-select
                            v-model="projectForm.entName"
                            placeholder="企业名称"
                            :disabled="disabled"
                            style="width: 100%;"
                          >
                            <el-option
                              :label="item.label"
                              :value="item.label"
                              v-for="(item, index) in leadOrgList"
                              :key="'leadOrgList'+index"
                              @click.native="changeLeadOrg(item)"
                            ></el-option>
                          </el-select>
                        </div>
                        <div class="icons" v-show="!disabled">
                          <svg-icon iconClass="down"></svg-icon>
                        </div>
                      </div>
                    </template>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="add-list" v-show="!disabled">
            <el-button class="add-btn" @click="addToList">
              <svg-icon iconClass="add"></svg-icon>
              <span>添加至列表</span>
            </el-button>
          </div>
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
              <!-- :span-method="objectSpanMethod" -->
              <el-table :data="tableData" border>
                <!-- nums entName entNo category -->
                <el-table-column label="序号" prop="nums" width="80">
                  <template slot-scope="scope">
                    <div
                      @click="openDetail(scope.$index, scope.row)"
                    >{{scope.row[scope.column.property]}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="企业名称" prop="entName" min-width="260"></el-table-column>
                <el-table-column label="营业执照号码" prop="entNo" min-width="160"></el-table-column>
                <el-table-column label="产品类别" prop="category" min-width="140"></el-table-column>
                <!-- <el-table-column label="项目名称" prop="projectName"></el-table-column> -->
                <el-table-column label="操作" align="center" width="200" v-if="!disabled">
                  <template slot-scope="scope">
                    <span style="cursor:pointer;" @click="deleteProject(scope.$index, scope.row)">
                      <svg-icon iconClass="delete"></svg-icon>
                      <span>删除</span>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next, sizes"
                :total="page.totalElements"
                :page-size.sync="page.pageSize"
                :page-sizes="[10, 20, 30, 40, 50]"
                class="fr"
                @current-change="pageChange"
                @size-change="sizeChange"
              ></el-pagination>
            </div>
          </div>
        </div>

        <!-- <div class="commonWidth last">
          <div class="item">
            <div class="common-title">判定标准</div>
            <div class="last-box">
              <div class="fl in-item">
                <el-form-item label="标准名称" prop="judgementStandard">
                  <template>
                    <div class="form-item">
                      <div class="left-item">
                        <el-select
                          v-model="normalForm.judgementStandard"
                          placeholder="请选择标准名称"
                          :disabled="disabled"
                          style="width: 100%;"
                        >
                          <el-option
                            :label="item.label"
                            :value="item.label"
                            v-for="(item, index) in standardList"
                            :key="'standardlist'+index"
                            @click.native="changeStandard(item)"
                          ></el-option>
                        </el-select>
                      </div>
                      <div class="icons" v-show="!disabled">
                        <svg-icon iconClass="down"></svg-icon>
                      </div>
                    </div>
                  </template>
                </el-form-item>
              </div>
              <div class="fl in-item" @click="downStandard">
                <el-button>
                  <svg-icon iconClass="eye"></svg-icon>
                  <span>查看判定标准</span>
                </el-button>
              </div>
            </div>
          </div>
        </div>-->
      </div>
    </el-form>
    <div class="commonWidth operation" v-show="!disabled">
      <div class="inner">
        <el-button class="btns" type="primary" @click="saveForm">
          <svg-icon iconClass="save"></svg-icon>
          <span>保存</span>
        </el-button>
        <el-button class="btns" type="primary" @click="onSubmit">
          <svg-icon iconClass="submit"></svg-icon>
          <span>提交</span>
        </el-button>
        <el-button class="btns" @click="resetForm">
          <svg-icon iconClass="reset"></svg-icon>
          <span>重置</span>
        </el-button>
      </div>
    </div>
    <!-- <el-dialog
      title="新建大类"
      :visible.sync="kindsDialog"
      width="500px"
      :before-close="handleClose"
      :append-to-body="true"
      label-width="120px"
    >
      <div class="form">
        <el-form :model="kindsForm" ref="kindsFormRefs" :rules="kindsFormRules">
          <el-form-item label="大类名称" prop="oneKind" label-width="100px">
            <template>
              <div class="form-item">
                <el-input v-model="kindsForm.oneKind" placeholder="请输入大类名称"></el-input>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kindsDialog = false">取消</el-button>
        <el-button type="primary" @click="saveKinds">保存</el-button>
      </span>
    </el-dialog>-->
    <div
      class="commonWidth approval-step"
      v-show="planTypeShow=='approval'||planTypeShow=='approvalDetail'"
    >
      <div class="icon-title">
        <svg-icon iconClass="tips"></svg-icon>
        <span>操作人员</span>
      </div>
      <div class="row-item m20">
        <div class="row-item-inner">
          <span>计划编制：</span>
          <span>XXX</span>
        </div>
        <div class="row-item-inner">
          <span>计划审批：</span>
          <span>XXX</span>
        </div>
      </div>
      <div class="icon-title m20">
        <svg-icon iconClass="tips"></svg-icon>
        <span>审核记录(共{{approvalList.length}}条)</span>
      </div>
      <div
        class="approval-steps-box"
        v-for="(item, index) in approvalList"
        :key="'approvallist'+index"
      >
        <div class="approval-steps">
          <div class="steps-title">
            <label></label>
            <span>{{item.approveDate}}</span>
          </div>

          <div class="steps-content">
            <div class="content-text">
              <div class="content-text-top">
                <div class="fl">
                  <svg-icon iconClass="user" class="user-icon"></svg-icon>
                  <span class="user-name">{{item.approver}}</span>
                </div>
                <div class="fr content-time">
                  <svg-icon iconClass="time"></svg-icon>
                  <span>{{item.approveTime}}</span>
                </div>
              </div>
              <div class="content-texts">{{item.memo}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :title="approvalDialog[approvalDialog.status].title"
      :visible.sync="approvalDialog.visible"
      width="450px"
      top="240px"
      custom-class="approvalDialog"
    >
      <div>
        <p class="titles" :class="approvalDialog.status">
          <svg-icon :iconClass="approvalDialog[approvalDialog.status].icon" class="aicon"></svg-icon>
          <span>{{approvalDialog[approvalDialog.status].top}}</span>
        </p>
        <p class="titles">《{{normalForm.planName}}》</p>
        <div class="textarea">
          <div class="txt">{{approvalDialog[approvalDialog.status].textarea}}</div>
          <div class="content">
            <el-input
              type="textarea"
              v-model="approvalDialog.content"
              :autosize="{ minRows: 4, maxRows: 5}"
              maxlength="300"
              show-word-limit
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approvalDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="approvalConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="企业详情"
      :visible.sync="entDetailvisible"
      width="650px"
      top="200px"
      custom-class="approvalDialog"
    >
      <div>
        <div class="common-title">基础信息</div>
        <div>
          <div class="normal-table m20">
            <div class="normal-table-item long">
              <div class="title long-title">企业名称：</div>
              <div class="name long-name"></div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">企业地址：</div>
              <div class="name long-name"></div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">营业执照编号/信用代码：</div>
              <div class="name long-name"></div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">联系人及联系方式：</div>
              <div class="name long-name"></div>
            </div>
            <div class="normal-table-item long">
              <div class="title long-title">食品生产许可证食品类别：</div>
              <div class="name long-name"></div>
            </div>
          </div>
        </div>
        <div class="common-title m20">产品信息</div>
        <div class="m20">
          <el-table border :data="productTableData">
            <el-table-column label="序号" prop="nums" width="100" align="center"></el-table-column>
            <el-table-column label="食品、食品添加剂类别" prop="category" width="200" sortable align="center"></el-table-column>
            <el-table-column label="类别编号" prop="classNo" sortable align="center"></el-table-column>
            <el-table-column label="类别名称" prop="className" sortable align="center"></el-table-column>
            <el-table-column label="品种明细" prop="detail" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="entDetailvisible = false">取 消</el-button>
        <el-button type="primary" @click="entDetailvisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage, exportDoc } from "@/utils/index.js";
import apis from "@/utils/apis.js";
import http from "@/utils/http.js";

const {
  PLAN_APPROVE,
  PLAN,
  AUTO_PLANNONAME,
  VALIDATE,
  EXPORT_BASE,
  META_PRODUCTTYPE,
  META_PRODUCT,
  META_JUDGEMENTSTANDARD,
  META_INSTITUTION,
  PLANAPPROVE_APPROVE
} = apis;

export default {
  data() {
    let _this = this;
    let planValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划名称！"));
      }
      let name = "aa";
      if (name == value) {
        callback(new Error("名称已经存在！"));
      } else {
        if (value.length > 100 || value.length < 3) {
          callback(new Error("名称长度在3到100之间！"));
        } else {
          callback();
        }
      }
    };
    let planStartValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划执行开始日期！"));
      } else {
        if (_this.normalForm.year == "") {
          callback(new Error("请先选择检查年份！"));
        } else {
          let dateArr = value.split("-");
          if (dateArr[0] != _this.normalForm.year) {
            callback(new Error("所选时间年份必须为检查年份！"));
          } else {
            if (value >= _this.normalForm.planEndDate) {
              callback(new Error("日期不能晚于计划执行结束日期！"));
            } else {
              callback();
            }
          }
        }
      }
    };
    let planEndValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入计划执行结束日期！"));
      } else {
        if (_this.normalForm.year == "") {
          callback(new Error("请先选择检查年份！"));
        } else {
          let dateArr = value.split("-");
          if (dateArr[0] != _this.normalForm.year) {
            callback(new Error("所选时间年份必须为检查年份！"));
          } else {
            if (value <= _this.normalForm.planStartDate) {
              callback(new Error("日期不能早于计划执行结束日期！"));
            } else {
              callback();
            }
          }
        }
      }
    };
    let docNumValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入文件编号！"));
      }

      // if (name == value) {
      //   callback(new Error("编号已经存在！"));
      // } else {
      if (_this.normalForm.planNo == "") {
        callback(new Error("请先生成计划编号！"));
      } else {
        if (value.length > 100 || value.length < 3) {
          callback(new Error("文件编号在3到100之间！"));
        } else {
          if (_this.timer) {
            clearTimeout(_this.timer);
          }
          _this.timer = setTimeout(() => {
            let res = _this.validateDocNo(value);
            if (res) {
              // console.log(res);
              callback();
            } else {
              callback(new Error("编号已经存在！"));
            }
          }, 1000);
          callback();
        }
      }

      // }
    };
    let adminOrgValidator = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (!value) {
        callback(new Error("请输入管理单位！"));
      } else {
        if (value.length > 100 || !reg.test(value)) {
          callback(new Error("最长为100个字符，不能包含空格和特殊字符！"));
        } else {
          callback();
        }
      }
    };
    let implOrgValidator = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (!value) {
        callback(new Error("请输入组织实施单位！"));
      } else {
        if (value.length > 100 || !reg.test(value)) {
          callback(new Error("最长为100个字符，不能包含空格和特殊字符！"));
        } else {
          callback();
        }
      }
    };

    // let endDateValidator = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error("请选择结束日期"));
    //   }
    //   if (value < _this.normalForm.planBeginDate) {
    //     callback(new Error("结束日期小于开始日期！"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      timer: "",
      title: "新增计划",
      disabled: false,
      disabledPlanNo: false,
      planTypeShow: "add",
      planStatus: "",
      normalForm: {
        planType: "",
        year: "",
        planNo: "",
        planName: "",
        planDocNo: "",
        planBeginDate: "",
        planEndDate: "",
        planAdminOrg: "",
        planAdminOrgId: "",
        planImplOrg: "",
        planImplOrgId: "",
        planMemo: "",
        judgementStandard: "",
        judgementStandardId: "",
        productVersion: ""
        // judgementStandardVersion: "",
        // planStatus: ""
      },
      projectForm: {
        // type: "",
        // categoryLv1: "",
        // categoryLv1Id: "",
        // leadOrg: "",
        // leadOrgId: ""
        area: "",
        entName: ""
      },
      kindsForm: {
        oneKind: ""
      },
      normalFormRules: {
        planType: [
          { required: true, message: "请输入计划类型", trigger: "change" }
        ],
        year: [{ required: true, message: "请输入计划年份", trigger: "blur" }],
        planNo: [
          { required: true, message: "请输入计划编号", trigger: "change" }
        ],
        planName: [
          {
            required: true,
            validator: planValidator,
            trigger: "change"
          }
        ],
        planDocNo: [
          {
            required: true,
            validator: docNumValidator,
            trigger: "blur"
          }
        ],
        planBeginDate: [
          {
            required: true,
            // message: "请输入执行开始日期",
            validator: planStartValidator,
            trigger: "change"
          }
        ],
        planEndDate: [
          { required: true, validator: planEndValidator, trigger: "blur" }
        ],
        planAdminOrg: [
          { required: true, validator: adminOrgValidator, trigger: "change" }
        ],
        planImplOrg: [
          {
            required: true,
            validator: implOrgValidator,
            message: "请输入组织实施单位",
            trigger: "change"
          }
        ],
        judgementStandard: [
          { required: true, message: "请选择判定标准", trigger: "change" }
        ]
      },
      projectFormRules: {
        area: [{ required: true, message: "请输入区域", trigger: "change" }],
        entName: [
          { required: true, message: "请输入企业名称", trigger: "change" }
        ]
        // leadOrg: [
        //   { required: true, message: "请输入牵头单位", trigger: "change" }
        // ]
      },
      kindsFormRules: {
        oneKind: [
          { required: true, message: "请输入大类名称", trigger: "blur" }
        ]
      },
      tableData: [
        // {
        //   leadOrg: "单位1",
        // leadOrgId: '',
        // categoryLv1Id: '',
        //   type: "type",
        //   categoryLv1: "categoryLv1",
        //   projectName: "projectName"
        // }
      ],
      productTableData: [],
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
      // typeList: [
      //   {
      //     label: "种植业",
      //     value: "种植业"
      //   },
      //   {
      //     label: "畜禽产品",
      //     value: "畜禽产品"
      //   },
      //   {
      //     label: "水产品",
      //     value: "水产品"
      //   }
      // ],
      areaList: [
        {
          name: "成都市",
          value: "成都市"
        }
      ],
      typeVersion: "",
      categoryList: [],
      standardList: [],
      planAdminOrgList: [],
      planImplOrgList: [],
      leadOrgList: [
        {
          label: "a企业",
          value: "成都市"
        }
      ],
      kindsDialog: false,
      approvalList: [],
      approvalDialog: {
        visible: false,
        status: "pass",
        pass: {
          title: "审批通过",
          top: "同意审批",
          textarea: "备注信息",
          icon: "pass"
        },
        reject: {
          title: "审批否决",
          top: "否决审批",
          textarea: "请填写审批不通过的原因",
          icon: "reject"
        },
        result: true,
        content: ""
      },
      submit: false,
      page: {
        currentPage: 1,
        totalElements: 0,
        pageSize: 10
      },
      entDetailvisible: true,
      enterprise: {
        enterpriseName: "",
        enterpriseAddress: ""
      }
    };
  },
  created() {
    // this.getDefaultData();
    let planType = this.$route.params.planType;
    let planNo = this.$route.params.planNo ? this.$route.params.planNo : 0;
    this.planTypeShow = planType;
    if (planType == "add") {
      // add
      // console.log("add");
      this.title = "新增计划";
    }
    if (planType == "edit") {
      this.title = "编辑计划";
      this.disabledPlanNo = true;
      this.getFormData(planNo);
    }
    // 复制并新增
    if (planType == "copy") {
      this.title = "复制并新增";
      this.getFormData(planNo);
    }
    // 预览计划
    if (planType == "planView") {
      this.title = "预览计划";
      this.disabled = true;
      let sessionForm = getStorage("viewForm")[0];
      this.normalForm = sessionForm.normalForm;
      this.tableData = sessionForm.tableData;
      this.formatTable();
    }
    // 列表预览
    if (planType == "planListView") {
      this.title = "预览计划";
      this.disabled = true;
      this.getFormData(planNo);
    }
    // 审批详情
    if (planType == "approvalDetail") {
      this.title = "审批详情";
      this.disabled = true;
      this.getApprovalData(planNo);
    }
    // 审批计划
    if (planType == "approval") {
      this.title = "审批计划";
      this.disabled = true;
      this.getApprovalData(planNo);
    }
  },
  methods: {
    changePlanImplOrg(item) {
      this.normalForm.planImplOrgId = item.value;
    },
    changePlanAdminOrg(item) {
      this.normalForm.planAdminOrgId = item.value;
    },
    changeCategoryLv1(item) {
      this.projectForm.categoryLv1Id = item.value;
    },
    changeLeadOrg(item) {
      this.projectForm.leadOrgId = item.value;
    },
    changeStandard(item) {
      this.normalForm.judgementStandardId = item.value;
      // this.normalForm.judgementStandardVersion = item.judgementStandardVersion;
    },
    async getFormData(planNo) {
      let res = await http.get(PLAN + "/" + planNo);
      if (res) {
        this.normalForm = { ...res.data };
        this.planStatus = res.data.planStatus;
        res.data.groupedProjectInfos.forEach((item, index) => {
          item.projects.forEach((itema, indexa) => {
            this.tableData.push({
              leadOrg: item.leadOrg,
              leadOrgId: item.leadOrgId,
              type: itema.type,
              categoryLv1: itema.categoryLv1,
              categoryLv1Id: itema.categoryLv1Id,
              projectName: itema.projectName
            });
          });
        });
        this.normalForm.year = this.normalForm.year.toString();
        this.formatTable();
      }
    },
    async getApprovalData(planNo) {
      let res = await http.get(PLAN_APPROVE + "/" + planNo);
      if (res) {
        this.normalForm = { ...res.data.plan };
        this.planStatus = res.data.status;
        console.log(this.planStatus);
        res.data.plan.groupedProjectInfos.forEach((item, index) => {
          item.projects.forEach((itema, indexa) => {
            this.tableData.push({
              leadOrg: item.leadOrg,
              leadOrgId: item.leadOrgId,
              type: itema.type,
              categoryLv1: itema.categoryLv1,
              categoryLv1Id: itema.categoryLv1Id,
              projectName: itema.projectName
            });
          });
        });
        this.normalForm.year = this.normalForm.year.toString();
        this.formatTable();
        this.approvalList = res.data.approvals;
      }
    },
    async validateDocNo(docNo) {
      let res = await http.get(VALIDATE, {
        docNo: docNo,
        planNo: this.normalForm.planNo
      });
      console.log(res.data);
      return res.data.result;
    },
    changePlanType() {
      this.$refs.normalFormRefs.validateField(
        ["planType", "year"],
        error => {}
      );
      this.getPlanNoAndName();
    },
    changeYear(year) {
      this.$refs.normalFormRefs.validateField(
        ["planType", "year"],
        error => {}
      );
      this.getPlanNoAndName();
      this.normalForm.planBeginDate = year + "-01-01";
    },
    async getPlanNoAndName() {
      if (this.normalForm.planType != "" && this.normalForm.year != "") {
        let params = {
          planType: this.normalForm.planType,
          year: this.normalForm.year
        };
        let res = await http.get(AUTO_PLANNONAME, params);
        if (res) {
          this.normalForm.planName = res.data.planName;
          this.normalForm.planNo = res.data.planNo;
        }
      }
      // return "a";
    },
    async getDefaultData() {
      // this.normalForm.planNo = "AAABBB";
      this.planAdminOrgList = [
        // {
        //   label: "管理单位",
        //   value: "aaid"
        // }
      ];
      this.planImplOrgList = [
        // {
        //   label: "组织实施单位",
        //   value: "aid"
        // }
      ];
      this.leadOrgList = [
        // {
        //   label: "牵头单位",
        //   value: "牵头单位id"
        // },
        // {
        //   label: "牵头单位a",
        //   value: "牵头单位ida"
        // }
      ];
      this.standardList = [
        // {
        //   label: "标准文件",
        //   value: "标准文件id"
        // }
      ];
      let [res, resa, resb] = await Promise.all([
        http.get(META_PRODUCTTYPE),
        http.get(META_INSTITUTION),
        http.get(META_JUDGEMENTSTANDARD)
      ]);
      if (res.status == 200) {
        // this.typeList = [...res.data.dataList];
        // this.typeVersion = res.data.version;
      }
      if (resa.status == 200) {
        for (let i = 0; i < resa.data.length; i++) {
          this.planAdminOrgList.push({
            label: resa.data[i].name,
            value: resa.data[i].id
          });
          this.planImplOrgList.push({
            label: resa.data[i].name,
            value: resa.data[i].id
          });
          this.leadOrgList.push({
            label: resa.data[i].name,
            value: resa.data[i].id
          });
        }
      }
      if (resb.status == 200) {
        for (let i = 0; i < resb.data.length; i++) {
          this.standardList.push({
            label: resb.data[i].name,
            value: resb.data[i].id
          });
        }
      }
    },
    saveForm() {
      this.submit = false;
      this.$refs.normalFormRefs.validate(validate => {
        if (validate) {
          this.submitForm();
        } else {
          this.$message.error("请填写完整信息！");
        }
      });
    },
    onSubmit() {
      this.submit = true;
      this.$refs.normalFormRefs.validate(validate => {
        if (validate) {
          this.submitForm();
        } else {
          this.$message.error("请填写完整信息！");
        }
      });
    },
    async submitForm() {
      if (this.normalForm.groupedProjectInfos) {
        delete this.normalForm.groupedProjectInfos;
      }
      let form = { ...this.normalForm };
      form.productVersion = this.typeVersion;
      form.projectInfos = this.tableData;
      form.year = parseInt(form.year);
      console.log(form);
      if (this.planTypeShow == "add" || this.planTypeShow == "copy") {
        let res = await http.post(PLAN + "?submit=" + this.submit, form);
        if (res.status == 200) {
          this.$message.success("新增计划成功！");
        } else {
          this.$message.error("新增计划失败！");
        }
      }
      if (this.planTypeShow == "edit") {
        let res = await http.put(PLAN + "?submit=" + this.submit, form);
        if (res.status == 200) {
          this.$message.success("编辑计划成功！");
        } else {
          this.$message.error("编辑计划失败！");
        }
      }
    },
    addToList() {
      this.$refs.projectFormRefs.validate(validate => {
        if (validate) {
          // let name = "";
          let flag = false;
          let index = this.tableData.length - 1;
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].entName == this.projectForm.entName) {
              flag = true;
              break;
            } else {
              continue;
            }
          }
          if (!flag) {
            this.getTableData();
          } else {
            this.$message.error("项目已经存在！");
          }
        } else {
          this.$message.error("请选择企业信息！");
        }
      });
    },
    getTableData() {
      this.tableData = [
        {
          entName: "a"
        }
      ];
    },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     if (this.colObj[rowIndex]) {
    //       return {
    //         rowspan: this.colObj[rowIndex],
    //         colspan: 1
    //       };
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       };
    //     }
    //   }
    // },
    deleteProject(index, row) {
      this.tableData.splice(index, 1);
      // this.formatTable();
    },
    openDetail(index, row) {
      this.entDetailvisible = true;
      this.productTableData = [
        {
          nums: "a",
          category: "b",
          classNo: "c",
          className: "d"
        }
      ];
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
            if (this.tableData[indexc].leadOrg == this.tableTreeData[i].name) {
              flag = true;
              index = i;
              break;
            }
          }
          if (flag) {
            this.tableTreeData[index].children.push({
              type: item.type,
              categoryLv1: item.categoryLv1,
              categoryLv1Id: item.categoryLv1Id,
              projectName: item.projectName
            });
          } else {
            this.tableTreeData.push({
              name: item.leadOrg,
              children: [
                {
                  type: item.type,
                  categoryLv1: item.categoryLv1,
                  categoryLv1Id: item.categoryLv1Id,
                  projectName: item.projectName
                }
              ]
            });
          }
        } else {
          this.tableTreeData.push({
            name: item.leadOrg,
            children: [
              {
                type: item.type,
                categoryLv1: item.categoryLv1,
                categoryLv1Id: item.categoryLv1Id,
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
      // console.log(this.tableData);
    },
    // 保存
    saveForm() {
      this.$refs.normalFormRefs.validate(a => {
        if (a) {
          // console.log("save");
        } else {
          this.$message.error("请填写完整信息！");
          return false;
        }
      });
    },
    handleClose() {
      this.kindsDialog = false;
    },
    resetForm() {
      setStorage("addForm", "");
      this.$refs.normalFormRefs.resetFields();
    },
    viewPlan() {
      // console.log(this.$refs.normalFormRefs.validate());
      this.$refs.normalFormRefs.validate(validate => {
        // console.log(validate);
        if (validate) {
          setStorage("viewForm", {
            normalForm: this.normalForm,
            tableData: this.tableData
          });
          let routeUrl = this.$router.resolve({
            name: "预览计划",
            params: {
              planNo: this.normalForm.planNo,
              planType: "planView"
            }
          });
          window.open(routeUrl.href, "_blank");
        } else {
          this.$message.error("请填写完整信息！");
        }
      });
    },
    // 审批计划
    approvalPlan(status) {
      this.approvalDialog.visible = true;
      this.approvalDialog.content = "";
      this.approvalDialog.status = status;
      this.approvalDialog.result = status == "pass";
    },
    async approvalConfirm() {
      let res = await http.get(PLANAPPROVE_APPROVE, {
        approveNo: this.normalForm.planNo,
        approveResult: this.approvalDialog.result,
        memo: this.approvalDialog.content
      });
      if (res.status == 200) {
        this.$message.success("操作成功！");
        this.$router.replace({
          path: "/refresh"
        });
      } else {
        this.$message.error("操作失败！");
      }
      this.approvalDialog.visible = false;
    },
    async changeType(item) {
      this.projectForm.categoryLv1 = "";
      this.categoryList = [];
      let res = await http.get(META_PRODUCT + "/" + item.id, {
        version: this.typeVersion
      });
      if (res) {
        for (let i = 0; i < res.data.dataList.length; i++) {
          this.categoryList.push({
            label: res.data.dataList[i].name,
            value: res.data.dataList[i].id
          });
        }
      }
    },
    downStandard() {
      let url = "";
      exportDoc(EXPORT_BASE + url);
    },
    pageChange(page) {
      this.page.currentPage = page;
      this.getTableData();
    },
    sizeChange() {
      this.getTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/style/PlanDetail.scss";
</style>
