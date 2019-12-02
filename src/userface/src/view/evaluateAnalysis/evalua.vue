<template>
  <div id="evalua" class="evalua">
    <div class="title">评论分析动态</div>
    <div class="con-box">
      <div class="comment-list" v-for="(item, index) in commentsList" :key="index">
        <div class="list-head">
          <div class="item lefts">
            <span>
              {{item.userName.substr(0,1)}}
              <label
                v-for="(itema,index) in item.userName"
                v-if="index<6"
                :key="index+'evalua'"
              >*</label>
            </span>
          </div>
          <div class="item centers">
            <el-tooltip
              class="tipname"
              effect="dark"
              :content="item.storeName"
              placement="top-start"
            >
              <div class="icons">
                <div class="img">
                  <img :src="item.platformPath">
                </div>
                <div class="name">
                  <div class="inners">{{item.storeName}}</div>
                </div>
              </div>
            </el-tooltip>
          </div>
          <div class="item rights">{{item.date}}</div>
        </div>
        <div class="comment-text">
          <p v-html="formatContents(item.riskWords,item.des)"></p>
        </div>
      </div>
      <div class="empty" v-show="commentsList.length == 0">暂无数据</div>
    </div>
  </div>
</template>
<script>
import { formatContent } from "@/unit/pub";
export default {
  data() {
    return {
      commentsList: []
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
          date: item.commentAt,
          des: item.content,
          riskWords: item.riskWords
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
    formatContents(riskWords, content) {
      return formatContent(riskWords, content);
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
    width: 100%;
    height: 100%;
    overflow-y: auto;
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
        .lefts {
          flex: 0 0 85px;
          width: 85px;
        }
        .rights {
          flex: 0 0 145px;
          width: 145px;
          font-size: 12px;
          text-align: right;
        }
        .centers {
          flex: 1;
          color: #333;
          overflow: hidden;
          .icons {
            display: flex;
            .img {
              flex: 0 0 30px;
              width: 30px;
              margin-top: 4px;
              text-align: center;
            }
            .name {
              flex: 1;
              overflow: hidden;
              .inners {
                padding: 0 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
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
