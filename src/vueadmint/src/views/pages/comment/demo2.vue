<template>
  <div id="demo2" class="wrappers">
    <div class="titles">近期监管提示</div>
    <div class="com-content">
      <div class="tab-list">
        <span @click="changeTab(0)" :class="{'active':tabIndex===0}">高风险业态预测</span>
        <span @click="changeTab(1)" class="bars" :class="{'active':tabIndex===1}">高风险业态预测</span>
      </div>
      <div class="content" v-show="tabIndex==0">
        <div class="items">
          <div class="left">icon</div>
          <div class="right">
            <p class="texts">根据历史评论数据预测，未来30天，海鲜水产、小吃快餐、火锅/干锅类的网络订餐商家风险较高，建议加强监管。</p>
          </div>
        </div>
        <div class="items">
          <div class="left">icon</div>
          <div class="right">
            <div class="tables">
              <div class="item head">
                <span>业态</span>
                <span>风险词TOP3</span>
              </div>
              <div class="item">
                <span>业态</span>
                <span>风险词TOP3</span>
              </div>
              <div class="item">
                <span>业态</span>
                <span>风险词TOP3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content" v-show="tabIndex==1">
        <div class="items">
          <div class="left">icon</div>
          <div class="right">
            <p
              class="texts"
            >近30天，火锅/干锅、小吃快餐、日韩料理类的网络订餐商家风险词频增长大于5%；武侯区、双流区的网络订餐商家风险词频增长大于5%。针对以上风险词频增长异常的业态及区域，建议加强监管。</p>
          </div>
        </div>
        <div class="items types">
          <div class="left">业态</div>
          <div class="right">
            <div class="percent">
              <el-progress type="circle" :percentage="10" :stroke-width="10" :width="60">ttt</el-progress>
              <p>火锅/干锅</p>
            </div>
            <div class="percent">
              <el-progress type="circle" :percentage="10" :stroke-width="10" :width="60">+10%</el-progress>
              <p>火锅/干锅</p>
            </div>
            <div class="percent">
              <el-progress type="circle" :percentage="10" :stroke-width="10" :width="60">+10%</el-progress>
              <p>火锅/干锅</p>
            </div>
          </div>
        </div>
        <div class="items types">
          <div class="left">区域</div>
          <div class="right">
            <div class="percent">
              <el-progress type="circle" :percentage="10" :stroke-width="10" :width="60">+10%</el-progress>
              <p>高新区</p>
            </div>
          </div>
        </div>
        <div class="items types">
          <div class="left">风险类型</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabIndex: 1,
      datas: []
    };
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
    },
    getData() {
      for (let i = 0; i < 10; i++) {
        this.datas.push({
          title: "n"
        });
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
#demo2 {
  .com-content {
    width: 100%;
    .tab-list {
      width: 100%;
      height: 20px;
      span {
        display: inline-block;
        height: 15px;
        line-height: 15px;
        font-size: 14px;
        padding-right: 10px;
        cursor: pointer;
        &.bars {
          border-left: 4px solid #276bb2;
          padding-left: 15px;
        }
      }
    }
    .content {
      // width: 100%;
      position: absolute;
      top: 35px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      overflow: auto;
      .items {
        width: 100%;
        display: flex;
        margin: 20px 0 0 0;
        .left {
          flex: 0 0 64px;
        }
        &.types {
          // height: 100px;
          border-bottom: 1px solid #f5f5f5;
          .left {
            line-height: 100px;
            color: #333;
            font-weight: bold;
          }
          .right {
            // display: flex;
            // width: 100%;
            overflow: hidden;
            .percent {
              // flex: 1;
              width: 33.3%;
              float: left;
              text-align: center;
              p {
                line-height: 24px;
              }
            }
          }
        }

        .right {
          flex: 1;
          .texts {
            line-height: 26px;
          }
          .tables {
            width: 100%;
            .item {
              height: 40px;
              line-height: 40px;
              overflow: hidden;
              display: flex;
              color: #999;
              border-top: 1px solid #f5f5f5;
              span {
                display: inline-block;
                flex: 1;
              }
              &.head {
                color: #333;
                font-weight: bold;
                border-top: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>


