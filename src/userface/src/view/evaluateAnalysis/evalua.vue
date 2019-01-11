<template>
  <div id="evalua" class="evalua">
    <div class="title">评论分析动态</div>
    <div class="con-box">
      <div class="comment-list" v-for="(item, index) in commentsList" :key="index">
        <div class="list-head">
          <div class="item lefts">
            <span>
              {{item.userName.substr(0,1)}}
              <label v-for="itema in item.userName">*</label>
            </span>
          </div>
          <div class="item centers">
            <div class="icons">
              <img :src="item.platformPath">
              <span>{{item.storeName}}</span>
            </div>
          </div>
          <div class="item rights">{{item.date}}</div>
        </div>
        <div class="comment-text">
          <p>{{item.des}}</p>
        </div>
      </div>
      <div class="empty" v-show="commentsList.length == 0">暂无数据</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      commentsList: [
        // {
        //   platformPath: require("../../images/elm.png"),
        //   storeName: "stores",
        //   userName: "users",
        //   date: "2017-02-02",
        //   des: "内容"
        // }
      ]
    };
  },
  props: {
    evalua: {
      type: Array,
      default: []
    }
  },
  watch: {
    evalua(a) {
      // console.log(a);
      this.commentsList = [];
      a.forEach(item => {
        this.commentsList.push({
          platformPath: require(`../../images/${this.switchPlatForm(
            item.platformType
          )}.png`),
          storeName: item.shopName,
          userName: item.author,
          date: item.commentAt.substr(0, 10),
          des: item.content
        });
      });
    }
  },
  methods: {
    switchPlatForm(name) {
      let result = "";
      switch (name) {
        case "MEI_TUAN_WM":
          result = "mt";
          break;
        case "ELE_ME_WM":
          result = "elm";
          break;
        case "BAIDU_WM":
          result = "elmxx";
          break;
        default:
          break;
      }
      return result;
    },
    getData() {}
  }
};
</script>
<style lang="scss">
#evalua {
  width: 100%;
  .con-box {
    padding: 10px 20px;
    overflow: auto;
    position: relative;
    .comment-list {
      width: 100%;
      border-bottom: 1px solid #f5f5f5;
      padding: 10px 0;
      overflow: hidden;
      .list-head {
        width: 100%;
        display: flex;
        height: 34px;
        color: #999;

        line-height: 34px;
        .item {
          flex: 1;
          font-size: 12px;
        }
        .rights {
          text-align: right;
        }
        .centers {
          text-align: center;
          color: #333;
          .icons {
            display: inline;
            overflow: hidden;
            img {
              float: left;
              margin-top: 4px;
            }
            span {
              float: left;
              margin-left: 4px;
            }
          }
        }
      }
      .comment-text {
        // line-height: 20px;
        margin: 6px 0;
        p {
          color: rgb(83, 83, 83);
        }
      }
    }
    .empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #999;
    }
  }
}
</style>
