<template>
<div class="comment-box">
  <div class="box-item">
    <div class="items left-item">
      <demo1 />
    </div>
    <div class="items right-item">
      <demo2 />
    </div>
  </div>
</div>
</template>
<script>
import demo1 from "./demo1.vue";
import demo2 from "./demo2.vue";
export default {
  components: {
    demo1,
    demo2
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.comment-box {
    width: 100%;
    overflow: hidden;
    padding: 5px;
    background: #eee;
    .box-item {
        width: 100%;
        overflow: hidden;
        &.nopadding {
            padding: 0 5px 5px;
        }
        .items {
            float: left;
            padding: 5px;
            .wrappers {
                background: #fff;
                width: 100%;
                height: 400px;
                border-radius: 4px;
                .titles {
                    padding: 0 20px;
                    height: 40px;
                    font-size: 18px;
                    line-height: 40px;
                    border-bottom: 1px solid #eee;
                }
                .com-content {
                    padding: 15px;
                    height: 360px;
                    position: relative;
                }
            }
        }
        .left-item {
            width: 72%;
        }
        .right-item {
            width: 28%;
        }
    }
}
</style>
