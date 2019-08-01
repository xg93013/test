<template>
  <div id="home" :class="{'home-page': !details||num>2}">
    <div class="home-msg" v-show="!details">
      <div class="top">数据关联分析</div>
      <div class="con">
        <div class="l">
          <div class="l-lists">
            <div class="fix-name" @click="foodShow=!foodShow">
              {{food.name}}
              <img
                :class="{'img-rotate': !foodShow}"
                :src="require('./images/arr.png')"
                alt
              >
            </div>
            <div @mouseleave="chooseWord=''" v-show="foodShow" class="lists food-lists">
              <div
                class="list"
                :key="index"
                @mouseenter="o(item.name)"
                v-for="(item,index) in food.children"
                :class="{'is-choose':isChoose}"
              >
                <div class="list-name">{{item.name}}</div>
                <div class="list-more"></div>
                <sideLists
                  @pageChange="pageChange"
                  :lists="item"
                  :chooseWord="chooseWord"
                  :types="1"
                />
              </div>
            </div>
            <div class="fix-name" @click="enterpriseShow=!enterpriseShow">
              {{enterprise.name}}
              <img
                :class="{'img-rotate': !enterpriseShow}"
                :src="require('./images/arr.png')"
                alt
              >
            </div>
            <div @mouseleave="chooseWord=''" v-show="enterpriseShow" class="lists business-lists">
              <div
                class="list"
                :key="index"
                @mouseenter="o(item.name)"
                v-for="(item,index) in enterprise.children"
                :class="{'is-choose':isChoose}"
              >
                <div class="list-name">{{item.name}}</div>
                <div class="list-more"></div>
                <sideLists
                  @pageChange="pageChange"
                  :lists="item"
                  :chooseWord="chooseWord"
                  :types="2"
                />
              </div>
            </div>
          </div>
        </div>
        <pro v-show="msgs.type==1" @setPage="setPage" @goDetails="goDetails" ref="pro"/>
        <business v-show="msgs.type==2" @goDetails="goDetails" ref="business"/>
      </div>
    </div>
    <proDetails
      @back="back"
      @goBusiness="goBusiness"
      ref="proDetails"
      v-show="details&&(num==1||num==2)"
    />
    <businessDetails
      @back="back"
      @goBusiness="goBusiness"
      @goDetails="goDetails"
      v-show="details&&(num==3||num==4)"
      ref="businessDetails"
    />
    <proDetailsa
      @back="back"
      @goBusiness="goBusiness"
      ref="proDetailsa"
      v-show="details&&(num==5)"
    />
  </div>
</template>

<script>
import proDetails from "./proDetails";
import proDetailsa from "./proDetailsa";
import businessDetails from "./businessDetails";
import pro from "./pro.vue";
import business from "./business.vue";
import http from "@/unit/http";
import apis from "@/unit/apis";
const { FOOD_MENU } = apis;
export default {
  data() {
    return {
      msgs: {
        type: 1,
        id: ""
      },
      details: false,
      num: 3,
      food: {},
      enterprise: {},
      foodShow: true,
      enterpriseShow: true,
      isChoose: false,
      chooseWord: ""
    };
  },
  components: {
    proDetailsa,
    proDetails,
    businessDetails,
    pro,
    business,
    sideLists: {
      name: "sideLists",
      data() {
        return {
          chooseWorda: "",
          num: 100
        };
      },
      props: ["lists", "types", "chooseWord"],
      methods: {
        pageChange(obj) {
          if (obj.id) {
            this.$emit("pageChange", obj);
          }
        },
        o(e) {
          this.chooseWorda = e;
        },
        handleScroll(name) {
          let id = this.getId(name);
          let tot = this.lists.children.length;
          if (id) {
            let top = document.getElementById(id).scrollTop;
            if (this.num < tot) {
              if (top >= this.num * 46 - 700) {
                this.num += 100;
              }
            }
          }
        },
        getId(name) {
          if (name == "生产企业") {
            return "sc";
          }
          if (name == "流通企业") {
            return "lt";
          }
          if (name == "餐饮企业") {
            return "cy";
          }
          return "";
        }
      },
      template: `<div v-show="chooseWord==lists.name" class="l-lists-child-box">
									<div :id="getId(lists.name)" class="l-lists-child" @scroll="handleScroll(lists.name)">
										<div @mouseenter="o(item.name)" class="list" v-for="(item,index) in lists.children" v-show="index<num">
											<div class="list-name" @click="pageChange({type:types,id:item.id})">{{item.name}}</div>
											<div class="list-more" v-if="!item.end"></div>
											<sideLists @pageChange="pageChange" :lists="item" :types="types" :chooseWord="chooseWorda" v-if="!item.end" />
										</div>
									</div>
								</div>`
    }
  },
  methods: {
    o(e) {
      this.chooseWord = e;
    },
    getId(e) {
      if (e[0].end) {
        this.msgs.id = e[0].id;
        this.$nextTick(() => {
          this.$refs.pro.init(this.msgs.id);
        });
      } else {
        this.getId(e[0].children);
      }
    },
    async getNavLists() {
      let res = await http.get(FOOD_MENU);
      if (res) {
        this.getId(res.data.food.children);
        this.food = { ...res.data.food };
        this.enterprise = { ...res.data.enterprise };
      }
    },
    setPage(id) {
      this.msgs = {
        type: 1,
        id
      };
    },
    pageChange(obj) {
      let { type, id, times } = obj;
      if (this.msgs.id != id) {
        this.$nextTick(() => {
          if (type == 1) {
            this.$refs.pro.init(id, times);
          } else {
            this.$refs.business.init(id, times);
            this.msgs = {
              type,
              id
            };
          }
        });
      }
      this.isChoose = true;
      setTimeout(() => {
        this.isChoose = false;
      }, 1000);
    },
    goBusiness(e) {
      this.details = false;
      this.pageChange(e);
    },
    goDetails(e) {
      this.num = e.num;
      this.details = true;
      this.$nextTick(() => {
        if (e.num == 1 || e.num == 2) {
          this.$refs.proDetails.init(e);
        }
        if (e.num == 3 || e.num == 4) {
          this.$refs.businessDetails.init(e);
        }
        if (e.num == 5) {
          this.$refs.proDetailsa.init(e);
        }
      });
    },
    back(e) {
      this.details = e.details;
      if (e.num) {
        this.num = e.num;
      }
    }
  },
  mounted() {
    this.getNavLists();
  }
};
</script>

<style lang="scss">
#home {
  .home-msg {
    width: 100%;
    height: 100%;
    position: relative;
    padding-top: 30px;
    /*padding-bottom: 100px;*/
  }
  .top {
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    top: 0;
    font-size: 20px;
    color: #d7e9ff;
  }
  .con {
    position: relative;
    width: 100%;
    height: 100%;
    padding-left: 300px;
    .l {
      * {
        color: #c5e6fe;
        font-size: 16px;
      }
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 1000;
      .l-lists {
        position: relative;
        width: 240px;
        height: 100%;
        background: #0e3e9f;
        .fix-name {
          position: relative;
          width: 100%;
          height: 46px;
          line-height: 46px;
          font-size: 18px;
          padding-left: 10px;
          background: #0e62c0;
          border-bottom: 1px solid #0a3179;

          img {
            position: absolute;
            right: 10px;
            top: 18px;
            transition: all 0.3s;
            transform: rotate(0deg);
          }

          .img-rotate {
            transform: rotate(-90deg);
          }
        }
        .lists {
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .food-lists {
          max-height: 64%;
        }
        .business-lists {
          max-height: 22%;
          > .list:last-child {
            border: none;
          }
        }
        .list {
          width: 100%;
          height: 46px;
          line-height: 46px;
          background: #0e3e9f;
          border-bottom: 1px solid #0a3179;
          transition: all 0.3s;
          padding-left: 10px;
          cursor: default;
          &:hover {
            background: #0e62c0;
            /*>.l-lists-child-box {
								display: block;
							}*/
          }
        }

        .is-choose {
          > .l-lists-child-box {
            display: none !important;
          }
        }
        .l-lists-child-box {
          /*display: none;*/
          position: absolute;
          width: 240px;
          left: 239px;
          top: 0;
          bottom: 0;
          border-left: 1px solid #0a3179;
          background: #0e3e9f;
        }
        .l-lists-child {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
      .list-name,
      .list-more {
        float: left;
        height: 100%;
      }
      .list-name {
        width: 190px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding-left: 10px;
      }
      .list-more {
        width: 20px;
        background-image: url(images/arrow.png);
        background-repeat: no-repeat;
        background-position: 3px 20px;
        transform: rotate(-90deg);
        opacity: 0.6;
      }
    }
  }
}

.home-page {
  height: 100%;
}
</style>