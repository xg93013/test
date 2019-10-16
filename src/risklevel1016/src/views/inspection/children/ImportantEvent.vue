<template>
  <div id="ImportantEvent">
    <div class="commonWidth">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>
          记录内容
          <svg-icon iconClass="error" class="tips-icon" @click.native="showTips"></svg-icon>
        </span>
      </div>
      <tips ref="tipsRefs">
        <slot name="contents">
          <p>1．名称：填写食品生产经营许可证书上的食品生产经营者名称。</p>
          <p>2．地址：填写食品生产经营许可证书上载明的生产经营地址。</p>
          <p>3．联系人、联系方式：填写法人代表或者负责人的姓名及联系方式。</p>
          <p>4．许可证编号：与食品生产经营许可证书上载明的内容一致。如果检查对象为食品生产加工小作坊、食品摊贩等，填写负责人的身份证号码，并隐藏身份证号码中第11位到第14位的数字，以“****”替代。</p>
          <p>5．食品类别明细：填写食品生产许可证上载明的类别及品种明细（具体分类见表7.食品、食品添加剂生产者静态风险因素量化分值表）。</p>
          <p>6．检查内容：检查人员应为两名，应明确检查对应使用的检查表。</p>
          <p>7．重要事项记录：检查组在体系检查中发现企业存在重大食品安全隐患或食品安全违法行为的，现场填写此表，由检查组、陪同检查的区（市）县局执法人员签名确认后，由陪同检查的区（市）县局执法人员依法实施行政执法等后续处置，包括对证据的保存、问题食品的封存、限期整改直至责令企业停产、召回等措施。检查组在24小时内向市局食品生产监管处及市食药检研院体系检查项目负责人报告。</p>
          <p>8．说明：对发现问题及处置措施进行详细描述，可附页。</p>
          <p>9．本表一式三份，一份交陪同检查的区（市）县局执法人员，一份报送市局食品生产处，一份市食药检研院存档。</p>
          <p>10. 现场如没有区（市）县局执法人员陪同的，检查组应及时与市局食品生产处联系。市局食品生产处接到报告后，应通知安排区（市）县局执法人员及时赶赴现场。</p>
          <p>11. 如区（市）县局执法人员在市局通知后，不能及时赶到现场的，检查组应对问题项目使用拍照等手段留取证据，并在备注栏里予以注明，将此表及照片等证据一并报送市局食品生产处。</p>
        </slot>
      </tips>
      <div class="event-content">
        <div class="normal-table">
          <div class="normal-table-item">
            <div class="title long-title">企业名称：</div>
            <div class="name long-name">{{entName}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">企业地址：</div>
            <div class="name long-name">{{entAddress}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">联系人：</div>
            <div class="name long-name">{{entPerson}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">联系方式：</div>
            <div class="name long-name">{{entPhone}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">食品生产许可证编号：</div>
            <div class="name long-name">{{productNo}}</div>
          </div>
          <div class="normal-table-item">
            <div class="title long-title">食品类别明细：</div>
            <div class="name long-name">{{classDetail}}</div>
          </div>
        </div>
        <div class="input-table content">
          <p>检查内容：</p>
          <p class="texts">
            &emsp;&emsp;受成都市市场监督管理局委托，成都市食品药品检验研究院食品生产企业体系检查人员根据《中华人民共和国食品安全法》等法律法规及《成都市食品企业生产管理通用规范》等规范、标准的规定，于
            <span
              class="line-text"
            >{{dateTime}}</span>
            <!-- <el-input v-model="dateTime" class="line-text"></el-input> -->
            对
            <span class="line-text">{{entName}}</span>进行了现场检查。
          </p>
        </div>
        <div class="input-table content">
          <p>本次检查发现该企业存在下列重要情况：</p>
          <p class="texts">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="importantContent"
              maxlength="300"
              show-word-limit
            ></el-input>
          </p>
        </div>
        <div class="input-table">
          <p>
            现将发现的线索等资料移交给
            <el-input v-model="area" class="area-input" style="width:200px;"></el-input>区（市）县局执法人员。
          </p>
        </div>
        <div class="input-table remarks">
          <p>备注：</p>
          <p class="texts">
            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="remarks"></el-input>
          </p>
        </div>
        <div class="input-table remarks">
          <p>说明（附页）：</p>
          <!-- maxlength="300" -->
          <!-- show-word-limit -->
          <p class="texts">
            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="others"></el-input>
          </p>
        </div>
      </div>
    </div>
    <div class="commonWidth">
      <div>
        <svg-icon iconClass="tips"></svg-icon>
        <span>检查情况签名</span>
      </div>
      <el-form :model="inputForm" label-width="200px" ref="inputFormRefs" :rules="inputFormRules">
        <div class="check-form">
          <div class="check-item">
            <el-form-item label="检查人员签名：" prop="checkPerson">
              <el-input v-model="inputForm.checkPerson"></el-input>
            </el-form-item>
            <el-form-item label="日期：" prop="checkDate">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.checkDate"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="check-item">
            <el-form-item label="区（市）县局执法人员：" prop="areaPerson">
              <el-input v-model="inputForm.areaPerson"></el-input>
            </el-form-item>

            <el-form-item label="日期：" prop="areaDate">
              <el-date-picker
                type="date"
                placeholder="请选择日期"
                v-model="inputForm.areaDate"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="check-item"></div>
        </div>
      </el-form>
    </div>
    <div class="commonWidth bot">
      <div class="common-operation">
        <div class="inline">
          <el-button type="primary" @click="save">
            <svg-icon iconClass="save"></svg-icon>
            <span>保存</span>
          </el-button>
          <el-button @click="reset">
            <svg-icon iconClass="reset"></svg-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setStorage, getStorage } from "@/utils/index.js";
import Tips from "@/components/Tips/index";

export default {
  data() {
    return {
      dateTime: "2099",
      entName: "aa",
      entAddress: "",
      entPerson: "",
      entPhone: "",
      productNo: "",
      classDetail: "",
      area: "",
      importantContent: "卫生情况还需要再次改进。",
      remarks: "",
      others: "",
      inputForm: {
        checkPerson: "",
        checkDate: "",
        areaPerson: "",
        areaDate: ""
      },
      inputFormRules: {
        checkPerson: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        checkDate: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        areaPerson: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        areaDate: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      }
    };
  },
  components: {
    Tips
  },
  created() {},
  methods: {
    save() {},
    reset() {},
    showTips() {
      this.$refs.tipsRefs.show();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/style/DynamicRisk.scss";
#ImportantEvent {
  .event-content {
    margin: 20px auto;
    color: #333;
    .input-table {
      width: 100%;
      padding: 15px;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
    .content {
      min-height: 150px;
      .line-text {
        width: auto;
        display: inline-block;
        // height: 20px;
        // line-height: 20px;
        text-align: center;
        border-bottom: 1px solid #999;
        min-width: 100px;
      }
    }
    .texts {
      margin: 10px 0;
      line-height: 24px;
    }
  }
  .check-form {
    width: 100%;
    overflow: hidden;
    margin: 20px auto;
    .check-item {
      width: 30%;
      float: left;
    }
  }
}
</style>
<style lang="scss">
.area-input {
  width: 200px;
  border: none;
  .el-input__inner {
    border: none;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #999;
    border-radius: 0;
  }
}
.texts {
  .el-textarea__inner {
    border: none;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>