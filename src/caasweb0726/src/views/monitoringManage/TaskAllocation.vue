<template>
  <div id="TaskAllocation">
    <div class="commonWidth">
      <p>《2019年国家种植业（蔬菜）农产品第三季度质量安全例行监测（风险监测）工作》</p>
      <p>批次编码：GJLXJC-201901-P03-0001</p>
    </div>
    <div class="commonWidth">
      <div class="applocation-step">
        <div class="step-box">
          <div class="step-item">
            <div class="lefts"></div>
            <div class="texts">AAA</div>
            <div class="steps"></div>
          </div>
          <div class="step-item">
            <div class="lefts"></div>
            <div class="texts">AAA</div>
            <div class="steps"></div>
          </div>
          <div class="step-item">
            <div class="lefts"></div>
            <div class="texts">AAA</div>
            <div class="steps"></div>
          </div>
          <div class="step-item">
            <div class="lefts"></div>
            <div class="texts">AAA</div>
            <div class="steps"></div>
          </div>
          <div class="step-item">
            <div class="lefts"></div>
            <div class="texts">AAA</div>
            <div class="steps"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentStep: 2
    };
  }
};
</script>
<style lang="scss" scoped>
$stepLen: 5;
$index: 10;
#TaskAllocation {
  width: 100%;
  .step-box {
    width: 100%;
    height: 40px;
    overflow: hidden;
    display: flex;
  }
  .step-item {
    flex: 1;
    position: relative;
    margin-left: -15px;
  }
  @for $i from 1 through $stepLen {
    .step-item:nth-child(#{$i}) {
      z-index: $index - $i;
    }
  }
  .texts {
    // width: 100px;
    height: 40px;
    float: left;
    background: #eee;
    position: absolute;
    left: 0;
    right: 20px;
    color: #999;
    box-sizing: border-box;
    line-height: 40px;
    padding-left: 50px;
  }
  .steps {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    border-top: 20px solid transparent;
    border-right: 20px solid #eee;
    border-bottom: 20px solid transparent;
    // border-left: 20px solid transparent;
    transform: rotate(180deg);
  }
  .lefts {
    width: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    z-index: 20;
    border-top: 20px solid transparent;
    border-right: 20px solid #fff;
    border-bottom: 20px solid transparent;
    transform: rotate(180deg);
  }
  .active {
    .texts {
      background: #999;
    }
    .steps {
      background: #999;
    }
  }
}
</style>

