<template>
  <el-scrollbar class="detail-scroll" :style="{height:height+'px'}">
    <div id="detailBottoma" :class="{bottoma:isFullScreen,shrink: isShrink,hid:!maxShow}">
      <div class="org-detail" :class="{'org-noborder':isFullScreen}">
        <div class="title">
          <el-tooltip
            :disabled="disabled"
            class="item"
            effect="dark"
            :content="detailsMsg.name"
            :open-delay="500"
            placement="left"
          >
            <div
              ref="orgName"
              @mouseenter="overEnter('orgName')"
              @mouseleave="overLeave"
              class="org-name"
            >{{detailsMsg.name}}</div>
          </el-tooltip>
          <span
            style="position:absolute;right:-2px;top:4px;cursor:pointer;font-weight:normal"
            @click="back"
          >
            <img :src="require('../../images/back.png')" alt />
          </span>
        </div>
        <div>
          <div>
            <div class="d-con" :class="{'d-con-border':!orgImg}" style="width:90px;">
              <img v-show="orgImg" :src="orgImg" alt />
              <img
                v-show="!orgImg"
                :src="isFullScreen?require('../../images/defaulta.png'):require('../../images/default.png')"
                alt
              />
            </div>
            <div class="d-con d-con-r" :class="{'txt-color':isFullScreen}" style="width:280px">
              <div>
                <div style="padding-top:10px;">
                  <span
                    :style="{fontFamily:'TTSTXT',fontSize:isIe?'30px':'36px',color:'#262626'}"
                  >{{detailsMsg.riskValue}}</span>
                  <span style="color:#8C93A2 !important;font-size:12px;">综合风险</span>
                </div>
                <div style="color:#8C93A2">
                  <span>高</span>
                  高于【{{accountArea}}】{{detailsMsg.order}}%的商家
                </div>
              </div>
            </div>
            <!-- <div
              class="d-con"
              :class="{'txt-color bg-span':isFullScreen}"
              style="width:144px;margin-left:10px;color:#666;line-height:24px;padding: 8px 0 0 12px;font-size:12px;"
            >
              <div class="d-con-pts">
                <div v-if="detailsMsg.scores.MEI_TUAN_WM">
                  美团外卖：
                  <span style="margin-left:12px">{{detailsMsg.scores.MEI_TUAN_WM}}</span>
                </div>
                <div v-if="detailsMsg.scores.ELE_ME_WM">
                  饿了么：
                  <span style="margin-left:27px">{{detailsMsg.scores.ELE_ME_WM}}</span>
                </div>
                <div v-if="detailsMsg.scores.BAIDU_WM">
                  饿了么星选：
                  <span>{{detailsMsg.scores.BAIDU_WM}}</span>
                </div>
              </div>
            </div>-->
            <div
              :class="{'txt-color':isFullScreen}"
              style="position:absolute;width: 100%;left:0;top:100px;padding-left:10px;bottom:0;color:#666;font-size:12px;"
            >
              <div class="org-addrs">区域：{{detailsMsg.region}}</div>
              <el-tooltip
                :disabled="disabled"
                class="item"
                effect="dark"
                :content="detailsMsg.address"
                :open-delay="500"
                placement="left"
              >
                <div
                  ref="orgAddr"
                  @mouseenter="overEnter('orgAddr')"
                  @mouseleave="overLeave"
                  class="org-addrs"
                >地址：{{detailsMsg.address}}</div>
              </el-tooltip>
              <div class="org-addrs">复查时间：{{detailsMsg.lastUpdateAt}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="org-pt" :class="{'org-noborder':isFullScreen}">
        <div class="title" style="padding-top:6px">
          <div class="pts">
            <div
              v-if="detailsMsg.details.MEI_TUAN_WM"
              :class="{'pts-active':ptName==='MEI_TUAN_WM'}"
              @click="ptChange('MEI_TUAN_WM')"
            >
              <div></div>
              <!--解决火狐:before切换不生效的bug-->
              <span>美团外卖</span>
            </div>
            <div
              v-if="detailsMsg.details.ELE_ME_WM"
              :class="{'pts-active':ptName==='ELE_ME_WM'}"
              @click="ptChange('ELE_ME_WM')"
            >
              <div></div>
              <span>饿了么</span>
            </div>
            <div
              v-if="detailsMsg.details.BAIDU_WM"
              :class="{'pts-active':ptName==='BAIDU_WM'}"
              @click="ptChange('BAIDU_WM')"
            >
              <div></div>
              <span>饿了么星选</span>
            </div>
          </div>
          <a
            class="links"
            v-show="detailsMsg.details[ptName].accessUrl"
            :href="detailsMsg.details[ptName].accessUrl"
            target="new_window"
          ></a>
        </div>
        <div class="pt-con">
          <div>
            <el-row>
              <el-col :span="6" align="right" style="margin-top:48px">
                <span
                  style="color:#333;font-size:15px;font-weight:bold"
                >{{detailsMsg.details[ptName].scores.ADDRESS||0}}</span>
                <br />
                <span style="color:#666" :class="{'txt-color':isFullScreen}">地址风险</span>
                <br />
                <span
                  class="bg-span"
                  v-show="detailsMsg.details[ptName].scores.ADDRESS&&detailsMsg.details[ptName].scores.ADDRESS!=0"
                >
                  <span :class="{'txt-color':isFullScreen}">地址不符</span>
                  <br />
                  +{{detailsMsg.details[ptName].scores.ADDRESS}}
                </span>
              </el-col>
              <el-col :span="12" align="center" style="position:relative">
                <div style="position:absolute;left:50%;top:32px;transform: translate(-50%,0)">
                  <span style="font-size:26px;color:#333;">{{detailsMsg.scores[ptName]}}</span>
                  <br />
                  <span style="color:#666" :class="{'txt-color':isFullScreen}">风险指数</span>
                </div>
                <img
                  :src="isFullScreen?require('../../images/zb2.png'):require('../../images/zb1.png')"
                  alt
                />
              </el-col>
              <el-col :span="6" align="left" style="margin-top:48px">
                <span
                  style="color:#333;font-size:15px;font-weight:bold"
                >{{detailsMsg.details[ptName].scores.COMMENT||0}}</span>
                <br />
                <span style="color:#666" :class="{'txt-color':isFullScreen}">评论风险</span>
                <br />
                <span
                  class="bg-span"
                  v-show="detailsMsg.details[ptName].scores.COMMENT&&detailsMsg.details[ptName].scores.COMMENT!=0"
                >
                  <span :class="{'txt-color':isFullScreen}">风险评论</span>
                  <br />
                  +{{detailsMsg.details[ptName].scores.COMMENT}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col align="center">
                <span
                  style="color:#333;font-size:15px;font-weight:bold"
                >{{(detailsMsg.scores[ptName]-(detailsMsg.details[ptName].scores.COMMENT||0)-(detailsMsg.details[ptName].scores.ADDRESS||0)).toFixed(2)}}</span>
                <br />
                <span style="color:#666" :class="{'txt-color':isFullScreen}">证照风险</span>
                <br />
                <span
                  class="bg-span"
                  v-show="(detailsMsg.scores[ptName]-(detailsMsg.details[ptName].scores.COMMENT||0)-(detailsMsg.details[ptName].scores.ADDRESS||0))>0"
                >
                  <span
                    v-if="detailsMsg.details[ptName].scores.UN_PUBLICIZED&&detailsMsg.details[ptName].scores.UN_PUBLICIZED!=0"
                  >
                    <span :class="{'txt-color':isFullScreen}">许可证未公示</span>
                    <br />
                    +{{detailsMsg.details[ptName].scores.UN_PUBLICIZED}}
                  </span>
                  <span
                    v-if="detailsMsg.details[ptName].scores.VAGUE&&detailsMsg.details[ptName].scores.VAGUE!=0"
                  >
                    <span :class="{'txt-color':isFullScreen}">证件模糊</span>
                    <br />
                    +{{detailsMsg.details[ptName].scores.VAGUE}}
                  </span>
                  <span
                    v-if="detailsMsg.details[ptName].scores.EXPIRED&&detailsMsg.details[ptName].scores.EXPIRED!=0"
                  >
                    <span :class="{'txt-color':isFullScreen}">证件过期</span>
                    <br />
                    +{{detailsMsg.details[ptName].scores.EXPIRED}}
                  </span>
                  <span
                    v-if="detailsMsg.details[ptName].scores.OVER_RAGE&&detailsMsg.details[ptName].scores.OVER_RAGE!=0"
                  >
                    <span :class="{'txt-color':isFullScreen}">超范围经营</span>
                    <br />
                    +{{detailsMsg.details[ptName].scores.OVER_RAGE}}
                  </span>
                  <span
                    v-if="detailsMsg.details[ptName].scores.FORGERY&&detailsMsg.details[ptName].scores.FORGERY!=0"
                  >
                    <span :class="{'txt-color':isFullScreen}">疑似假证</span>
                    <br />
                    +{{detailsMsg.details[ptName].scores.FORGERY}}
                  </span>
                  <span
                    v-if="detailsMsg.details[ptName].scores.MULTI_PURPOSE&&detailsMsg.details[ptName].scores.MULTI_PURPOSE!=0"
                  >
                    <span :class="{'txt-color':isFullScreen}">一证多用</span>
                    <br />
                    +{{detailsMsg.details[ptName].scores.MULTI_PURPOSE}}
                  </span>
                  <span
                    v-if="detailsMsg.details[ptName].scores.NON_PERMIT&&detailsMsg.details[ptName].scores.NON_PERMIT!=0"
                  >
                    <span :class="{'txt-color':isFullScreen}">证照不符</span>
                    <br />
                    +{{detailsMsg.details[ptName].scores.NON_PERMIT}}
                  </span>
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="base-msg">
        <div class="title" style="font-size:15px;padding-left:10px">基本信息</div>
        <div class="base-msg-con" :class="{'one-msg':!isMore}">
          商家电话：{{detailsMsg.details[ptName].phone?String(detailsMsg.details[ptName].phone).replace(/,/g,"，"):"无"}}
          <br />
          平均配送时间：{{detailsMsg.details[ptName].avgDeliveryTime}}分钟
          <br />
          起送价：{{detailsMsg.details[ptName].startDeliveryFee}}元
          <br />
          营业时间：{{detailsMsg.details[ptName].businessTime}}
          <br />
          店铺评分：{{detailsMsg.details[ptName].compScore}}
          <el-rate
            style="display:inline-block;position:relative;top:-2px;margin-left:4px"
            v-model="detailsMsg.details[ptName].compScore"
            disabled
            text-color="#ff9900"
          ></el-rate>
          <span
            v-if="detailsMsg.details[ptName].scores.ADDRESS&&detailsMsg.details[ptName].scores.ADDRESS!=0"
          >
            <br />
            公示地址：{{detailsMsg.details[ptName].publicAddress}}
            <br />
            许可经营场所：{{detailsMsg.details[ptName].licenseAddress}}
          </span>
        </div>
        <div class="show-more">
          <i @click="isMore=!isMore" class="el-icon-arrow-down" :class="{ismore:isMore}"></i>
        </div>
      </div>
      <div class="org-card">
        <div class="title" style="font-size:15px;padding-left:10px">证照详情</div>
        <div
          style="margin-top:10px;color:#666;text-align:center"
          v-show="!card[ptName].length"
        >商家未公示任何证照信息</div>
        <div
          v-show="card[ptName].length"
          class="card-con org-card-scroll"
          :class="{'card-con-more':card.length>2}"
        >
          <el-scrollbar>
            <div
              @click="maxImgShow(index)"
              class="card-list"
              v-for="(item,index) in card[ptName]"
              :key="index"
            >
              <div>
                <div v-for="(itema,index) in item.ventures" :key="index">
                  <img
                    v-if="itema!=='UN_PUBLICIZED'&&(detailsMsg.scores[ptName]-(detailsMsg.details[ptName].scores.COMMENT||0)-(detailsMsg.details[ptName].scores.ADDRESS||0))!=0"
                    style="margin-left:5px;margin-top:8px"
                    :src="require('../../images/'+imgUrl(itema)+'.png')"
                    alt
                  />
                </div>
                <span class="span-img">
                  <img :src="item.url" alt />
                </span>
                <span v-show="item.name" class="span-txt">
                  {{item.name}}
                  <el-popover
                    v-if="item.showItems.length"
                    placement="bottom-end"
                    width="180"
                    popper-class="risk-card-pop"
                    trigger="hover"
                    :disabled="popdisabled"
                  >
                    <div :class="{'risk-card-pop-full':isFullScreen}">
                      <div class="card-pop-top">
                        <div
                          v-show="item.showItems.includes('MULTI_PURPOSE')"
                          :class="{'card-pop-top-active':item.popNum===0,'card-pop-top-wa':item.showItems.length===2,'card-pop-top-wb':item.showItems.length===1}"
                          @click="item.popNum=0"
                        >一证多用</div>
                        <div
                          v-show="item.showItems.includes('OVER_RAGE')"
                          :class="{'card-pop-top-active':item.popNum===1,'card-pop-top-wa':item.showItems.length===2,'card-pop-top-wb':item.showItems.length===1}"
                          @click="item.popNum=1"
                        >超范围经营</div>
                        <div
                          v-show="item.showItems.includes('EXPIRED')"
                          :class="{'card-pop-top-active':item.popNum===2,'card-pop-top-wa':item.showItems.length===2,'card-pop-top-wb':item.showItems.length===1}"
                          @click="item.popNum=2"
                        >证件过期</div>
                      </div>
                      <div class="card-pop-content" v-show="item.popNum===0">
                        <div>
                          <div class="list">许可证编号：</div>
                          <div class="list">关 联 商 家：</div>
                        </div>
                        <div>
                          <div class="list">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="item.licenseNumber"
                              placement="left"
                            >
                              <span>{{item.licenseNumber}}</span>
                            </el-tooltip>
                          </div>
                          <div
                            class="list list-more"
                            v-for="mul in item.multiPurposes.slice((item.pagea-1)*5,item.pagea*5)"
                            :key="mul.id"
                          >
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="mul.name"
                              placement="left"
                            >
                              <span>{{mul.name}}</span>
                            </el-tooltip>
                            <span class="list-more-r list-more-r-more" @click="goDetails(mul.id)">查看</span>
                          </div>
                        </div>
                      </div>
                      <div class="card-pop-content" v-show="item.popNum===1">
                        <div>
                          <div class="list">经 营 项 目：</div>
                          <div class="list">违 规 菜 品：</div>
                        </div>
                        <div>
                          <div class="list">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="item.businessItem"
                              placement="left"
                            >
                              <span>{{item.businessItem}}</span>
                            </el-tooltip>
                          </div>
                          <div
                            class="list list-more"
                            v-for="(over,i) in item.overRageCommodities.slice((item.pageb-1)*5,item.pageb*5)"
                            :key="'d'+i"
                          >
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="over.name"
                              placement="left"
                            >
                              <span>{{over.name}}</span>
                            </el-tooltip>
                            <span class="list-more-r" v-show="over.type">[{{over.type}}]</span>
                          </div>
                        </div>
                      </div>
                      <div class="card-pop-content" v-show="item.popNum===2">
                        <div>
                          <div class="list">有 效 期 至：</div>
                        </div>
                        <div>
                          <div class="list">{{item.expireAt}}</div>
                        </div>
                      </div>
                      <div class="card-pop-footer" v-show="item.popNum===0&&item.totala>5">
                        <el-pagination
                          small
                          :page-size="5"
                          :pager-count="5"
                          layout="prev, pager, next"
                          :current-page="item.pagea"
                          :total="item.totala"
                          @current-change="(e)=>{popPageChange(e,item,1)}"
                        ></el-pagination>
                      </div>
                      <div class="card-pop-footer" v-show="item.popNum===1&&item.totalb>5">
                        <el-pagination
                          small
                          :page-size="5"
                          :pager-count="5"
                          layout="prev, pager, next"
                          :current-page="item.pageb"
                          :total="item.totalb"
                          @current-change="(e)=>{popPageChange(e,item,2)}"
                        ></el-pagination>
                      </div>
                    </div>

                    <span @mouseenter="showPop" slot="reference">?</span>
                  </el-popover>
                </span>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="evaluate-detail">
        <div class="title" style="font-size:15px;padding-left:10px">
          评论详情
          <span
            style="float:right;font-weight:normal;color:#999;margin-right:10px"
          >全部{{detailsMsg.details[ptName].commentTotalCount}}</span>
        </div>
        <div class="evaluate-detail-con">
          <div>
            <span class="eval-type">风险评论 {{detailsMsg.details[ptName].commentRiskCount}}</span>
          </div>
          <div v-show="total===0" class="no-eval">暂无风险评论</div>
          <div v-for="(item,index) in commentData" :key="'c'+index">
            <el-row style="margin-bottom:10px;">
              <el-col :span="14">{{item.author}}</el-col>
              <el-col align="right" :span="10">{{item.commentAt}}</el-col>
            </el-row>
            <div v-html="formatContent(item.riskWords,item.content)"></div>
          </div>
          <div v-show="total>0">
            <comPageBox
              @changePage="changePage"
              :currentPageNum="Number(page)"
              :totalElements="total"
              :totalPage="totalPage"
            />
          </div>
        </div>
      </div>

      <div class="card-max" v-if="maxShow">
        <i class="el-icon-close" @click="maxShow = false"></i>
        <el-carousel
          height="100%"
          :initial-index="imgIndex"
          :autoplay="false"
          indicator-position="none"
          @change="imgChange"
        >
          <el-carousel-item v-for="(item,index) in card[ptName]" :key="index">
            <div class="img-max" @mousewheel="imgWhell" @DOMMouseScroll="imgWhell">
              <img
                :src="item.url"
                :style="{transform:'scale('+item.scale+') rotate('+item.rotate+'deg)',left: item.left+'px',top: item.top+'px'}"
                @mousedown="imgMouseDown"
                @mousemove="imgMouseMove"
                @mouseup="imgMouseUp"
                @mouseout="imgMouseUp"
                :ref="'d'+index"
                alt
              />
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="max-oper">
          <div class="rb" @click="imgOper(1)"></div>
          <div class="rs" @click="imgOper(2)"></div>
          <div class="rl" @click="imgOper(3)"></div>
          <div class="rr" @click="imgOper(4)"></div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import comPageBox from "@/components/com-page-box.vue";
import http from "@/unit/http";
import apis from "@/unit/apis";
import { formatContent } from "@/unit/pub";
const { VENTURE_SUMMARY, DICT_IMAGE, VENTURE_COMMENT } = apis;
export default {
  data() {
    return {
      height: 0,
      disabled: true,
      orgImg: "",
      ptName: "MEI_TUAN_WM",
      card: {
        MEI_TUAN_WM: [],
        ELE_ME_WM: [],
        BAIDU_WM: []
      },
      maxShow: false,
      imgIndex: 0,
      detailsMsg: {
        details: {
          MEI_TUAN_WM: {
            certificates: {},
            scores: {}
          }
        },
        scores: {}
      },
      baseUrl: process.env.NODE_ENV == "development" ? "/apis" : "",
      isShrink: false,
      canMove: false,
      x: 0,
      y: 0,
      cx: 0,
      cy: 0,
      orgIds: [],
      areaId: "",
      isMore: false,
      page: 1,
      total: 0,
      totalPage: 0,
      commentData: [],
      isIe: false,
      accountArea: "",
      popdisabled: false
    };
  },
  components: {
    comPageBox
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.isFullScreen
    })
  },
  methods: {
    getHeight() {
      if (!document.getElementById("riskAnalysis")) {
        return false;
      }
      let h = document.getElementById("riskAnalysis").offsetHeight;
      this.height = this.isFullScreen ? h - 140 : h - 80;
    },
    imgWhell(e) {
      let arr = this.card[this.ptName][this.imgIndex];
      if (e.deltaY > 0 || e.detail > 0 || e.wheelDelta < 0) {
        arr.scale = arr.scale > 0.4 ? arr.scale - 0.2 : arr.scale;
      } else {
        arr.scale = arr.scale < 4 ? arr.scale + 0.2 : arr.scale;
      }
    },
    imgMouseDown(e) {
      if (e.button == 0) {
        this.canMove = true;
        this.x = e.clientX;
        this.y = e.clientY;
      }
    },
    imgMouseUp(e) {
      if (e.button == 0) {
        this.canMove = false;
        let arr = this.card[this.ptName][this.imgIndex];
        this.cx = arr.left;
        this.cy = arr.top;
      }
    },
    imgMouseMove(e) {
      if (this.canMove) {
        let arr = this.card[this.ptName][this.imgIndex];
        let dom = this.$refs["d" + this.imgIndex][0];
        let w = dom.width,
          h = dom.height,
          ol = dom.offsetLeft,
          ot = dom.offsetTop;
        let mx = this.cx + e.clientX - this.x,
          my = this.cy + e.clientY - this.y;
        arr.left = mx;
        arr.top = my;
      }
    },
    imgChange(e) {
      this.imgIndex = e;
      let arr = this.card[this.ptName][this.imgIndex];
      arr.scale = 1;
      arr.rotate = 0;
      arr.left = 0;
      arr.top = 0;
      this.cx = 0;
      this.cy = 0;
    },
    imgOper(e) {
      //1 2 3 4 放大 缩小 左转 右转
      let arr = this.card[this.ptName][this.imgIndex];
      arr.left = 0;
      arr.top = 0;
      this.cx = 0;
      this.cy = 0;
      if (e == 1) {
        arr.scale = arr.scale < 4 ? arr.scale + 0.2 : arr.scale;
      }
      if (e == 2) {
        arr.scale = arr.scale > 0.4 ? arr.scale - 0.2 : arr.scale;
      }
      if (e == 3) {
        arr.scale = 1;
        arr.rotate -= 90;
      }
      if (e == 4) {
        arr.scale = 1;
        arr.rotate += 90;
      }
    },
    shrinkChange(e) {
      this.isShrink = e;
    },
    overEnter(id) {
      let el =
        this.$refs[id] instanceof Array ? this.$refs[id][0] : this.$refs[id];
      if (el.scrollWidth > el.clientWidth) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    overLeave(key) {
      this.disabled = true;
    },
    imgUrl(e) {
      switch (e) {
        case "VAGUE":
          return "z1";
          break;
        case "NON_PERMIT":
          return "z2";
          break;
        case "FORGERY":
          return "z3";
          break;
        case "MULTI_PURPOSE":
          return "z4";
          break;
        case "OVER_RAGE":
          return "z5";
          break;
        case "EXPIRED":
          return "z6";
          break;
        default:
          break;
      }
    },
    back() {
      if (this.orgIds.length === 1) {
        this.$emit("back", true);
      } else {
        this.orgIds.pop();
        let id = this.orgIds[this.orgIds.length - 1];
        this.$emit("getBaseMsg", id);
        this.getDetail(id, this.areaId, true);
      }
    },
    ptChange(e) {
      if (this.ptName !== e) {
        this.ptName = e;
        this.maxShow = false;
        this.page = 1;
        this.getComment();
      }
    },
    async getImgs(e) {
      if (!e) {
        return "";
      }
      try {
        let res = await axios({
          method: "get",
          url: this.baseUrl + DICT_IMAGE + "?path=" + e,
          responseType: "blob"
        });
        if (res.status === 200) {
          return window.URL.createObjectURL(new Blob([res.data]));
        } else {
          return "";
        }
      } catch (err) {
        return "";
      }
    },
    maxImgShow(e) {
      this.imgIndex = e;
      this.$nextTick(() => {
        this.maxShow = true;
      });
    },
    popPageChange(a, b, c) {
      if (c === 1) {
        b.pagea = a;
      } else {
        b.pageb = a;
      }
    },
    showPop() {
      this.popdisabled = false;
    },
    goDetails(id) {
      this.popdisabled = true;
      this.orgIds.push(id);
      this.$emit("getBaseMsg", id);
      this.getDetail(id, this.areaId, true);
    },
    async getDetail(id, value, currentPage) {
      this.isMore = false;
      this.maxShow = false;
      this.areaId = value;
      this.page = 1;
      if (!currentPage) {
        //判断是否是当前页面再点击进入详情，（预留，下个版本会出现此情况）
        this.orgIds = [id];
      }
      let res = await http.get(
        VENTURE_SUMMARY +
          "/" +
          id +
          "?region=" +
          (value == "default" ? "" : value)
      );
      if (res) {
        let { scores, details, logo } = res.result;
        if (scores.BAIDU_WM) {
          this.ptName = "BAIDU_WM";
        }
        if (scores.ELE_ME_WM) {
          this.ptName = "ELE_ME_WM";
        }
        if (scores.MEI_TUAN_WM) {
          this.ptName = "MEI_TUAN_WM";
        }
        this.detailsMsg = { ...res.result };
        this.orgImg = await this.getImgs(logo);
        let card = { MEI_TUAN_WM: [], ELE_ME_WM: [], BAIDU_WM: [] };
        for (let i in details) {
          let { certificates } = details[i];
          for (let j = 0, n = certificates.length; j < n; j++) {
            let {
              accessPath,
              multiPurposes,
              overRageCommodities,
              ventures
            } = certificates[j];
            let obj = { ...certificates[j] };
            let showItems = [];
            let popNum = 0;
            if (ventures.includes("EXPIRED")) {
              showItems.push("EXPIRED");
              popNum = 2;
            }
            if (ventures.includes("OVER_RAGE")) {
              showItems.push("OVER_RAGE");
              popNum = 1;
            }
            if (ventures.includes("MULTI_PURPOSE")) {
              showItems.push("MULTI_PURPOSE");
              popNum = 0;
            }
            let res = await this.getImgs(accessPath);
            obj = Object.assign(obj, {
              showItems,
              url: res,
              scale: 1,
              rotate: 0,
              left: 0,
              top: 0,
              popNum,
              pagea: 1,
              totala: multiPurposes.length,
              pageb: 1,
              totalb: overRageCommodities.length
            });
            card[i].push(obj);
          }
        }
        this.card = card;
        this.getComment();
      }
    },
    changePage(e) {
      this.page = e;
      this.getComment();
    },
    async getComment() {
      let id = this.detailsMsg.details[this.ptName].id;
      let res = await http.get(
        VENTURE_COMMENT + "/" + id + "/" + this.page + "/10"
      );
      if (res) {
        // commentData
        let { content, totalPage, totalSize } = res.result;
        this.commentData = content;
        this.total = totalSize;
        this.totalPage = totalPage;
      }
    },
    formatContent(riskWords, content) {
      return formatContent(riskWords, content);
    },
    init() {
      let { city, province, zone, regionType } = this.$store.state.userMsg;
      if (regionType === "PROVINCE") {
        this.accountArea = province;
      } else if (regionType === "CITY") {
        this.accountArea = city;
      } else {
        this.accountArea = zone;
      }
    }
  },
  mounted() {
    this.init();
    this.getHeight();
    window.addEventListener("resize", () => {
      this.getHeight();
    });
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      this.isIe = true;
    }
  }
};
</script>
<style lang="scss">
.detail-scroll {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .is-horizontal {
    display: none;
  }
}

#detailBottoma {
  position: relative;
  // width: 100%;
  width: 400px;
  // height: 100%;
  background: #fff;
  box-shadow: -4px 6px 8px 0px #ddd;
  border-radius: 4px;
  padding: 6px 10px;
  transition: all 0.3s;

  .org-name {
    width: 240px;
    font-size: 16px;
  }
  .org-addrs {
    height: 33.3%;
    font-size: 14px;
    max-height: 24px;
  }
  .org-addrs,
  .org-name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: default;
  }
  .card-max {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 880px;
    height: 650px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 200;
    transform: translate(-50%, -50%);

    .el-carousel {
      height: 100%;
    }

    i {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      z-index: 10;
    }

    .max-oper {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      height: 30px;
      text-align: center;
      z-index: 100;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;

      div {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 10px;
        cursor: pointer;
        background-repeat: no-repeat;
      }
      .rr {
        margin-right: 0;
      }
      .rb {
        background-image: url(../../images/rb.png);
      }
      .rs {
        background-image: url(../../images/rs.png);
      }
      .rr {
        background-image: url(../../images/rr.png);
      }
      .rl {
        background-image: url(../../images/rl.png);
      }
      .rb,
      .rs {
        background-size: cover;
      }
      .rr,
      .rl {
        background-size: 40px 40px;
        background-position: -5px -3px;
      }
    }

    .img-max {
      position: relative;
      width: 780px;
      height: 580px;
      left: 50px;
      top: 20px;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      overflow: hidden;
      img {
        position: relative;
        max-width: 780px;
        max-height: 580px;
      }
    }
    .el-carousel__arrow--left {
      left: 10px;
    }
    .el-carousel__arrow--right {
      right: 10px;
    }
  }
  // overflow-y: auto;
  .org-detail,
  .org-pt,
  .base-msg,
  .org-card,
  .evaluate-detail {
    position: relative;
    width: 100%;
    padding-top: 40px;

    .title {
      position: absolute;
      height: 30px;
      width: 100%;
      line-height: 30px;
      font-weight: bold;
      font-size: 16px;
      left: 0;
      top: 10px;
      > .pts {
        position: absolute;
        left: 10px;
        top: 6px;
        height: 30px;
        line-height: 30px;
        > div {
          position: relative;
          float: left;
          width: 90px;
          font-weight: normal;
          margin-left: -10px;
          cursor: pointer;
          padding-left: 14px;

          &:first-child {
            margin-left: 0;
            padding-left: 10px;
          }
          &:last-child {
            width: 100px;
            padding-left: 5px;
          }

          span {
            position: relative;
            z-index: 9;
            color: #666;
            top: 1px;
            font-weight: normal;
          }

          > div {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: none;

            &:before {
              content: "";
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 1;
              background-color: #5288c0;
              border: 1px solid rgba(0, 0, 0, 0.4);
              border-bottom: none;
              border-radius: 0.5em 0.5em 0 0;
              box-shadow: 0 0 #aaacb4 inset;
              transform: scaleY(1.3) perspective(0.5em) rotateX(5deg);
              transform-origin: bottom left;
            }
          }
          &:before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            background-color: #e4e8e9;
            border: 1px solid rgba(0, 0, 0, 0.4);
            border-bottom: none;
            border-radius: 0.5em 0.5em 0 0;
            box-shadow: 0 0 #aaacb4 inset;
            transform: scaleY(1.3) perspective(0.5em) rotateX(5deg);
            transform-origin: bottom left;
          }
        }
        // e4e8e9

        .pts-active {
          span {
            font-weight: bold;
            color: #fff;
          }

          > div {
            display: block;
          }
        }
      }
      .links {
        position: absolute;
        right: 0;
        top: 10px;
        width: 20px;
        height: 20px;
        background-image: url(../../images/lj.png);
        background-repeat: no-repeat;
        cursor: pointer;
      }
    }
  }
  .org-detail,
  .org-pt,
  .base-msg,
  .org-card {
    &:after {
      position: absolute;
      bottom: 0;
      left: 10px;
      right: 0;
      height: 1px;
      content: "";
      background: #999;
      opacity: 0.1;
    }
  }
  .org-detail {
    height: 220px;
  }
  .org-pt {
    height: 350px;

    .pt-con {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 50px;

      > div {
        position: absolute;
        width: 100%;
        height: 260px;
        top: 50%;
        transform: translate(0, -50%);

        img {
          width: 170px;
        }

        .bg-span {
          display: inline-block;
          margin-top: 6px;
          color: #666;
          padding: 6px;
          background: #f2f5f6;
          font-size: 12px;

          span {
            float: left;
            margin-left: 6px;
            font-size: 12px;

            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  .base-msg {
    position: relative;
    // height: 100px;
    overflow: hidden;
    padding-bottom: 24px;
    .one-msg {
      height: 26px;
    }
    .base-msg-con {
      padding-left: 10px;
      font-size: 14px;
      color: #747474;
      line-height: 24px;
      word-wrap: break-word;
      overflow: hidden;

      > span {
        font-size: 14px;
        color: #747474;
      }

      i {
        font-size: 18px !important;
      }
    }
    .show-more {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 4px;
      text-align: center;

      i {
        color: #5288c0;
        font-size: 16px;
        cursor: pointer;
      }
      .ismore {
        transform: rotate(180deg);
      }
    }
  }
  .evaluate-detail {
    overflow: hidden;
    .evaluate-detail-con {
      padding-left: 10px;
      > div {
        padding: 15px 0;
        border-bottom: 1px solid #f0f3f3;
        color: #333;
        .eval-type {
          display: inline-block;
          padding: 0 10px;
          height: 26px;
          text-align: center;
          line-height: 24px;
          border: 1px solid #e83c3f;
          border-radius: 26px;
          background: #ffbcbd;
          color: #e83c3f;
        }
        .el-col {
          font-size: 12px;
          color: #999;
        }
        &:last-child {
          border: none;
          text-align: center;
          padding-bottom: 0;
        }
      }
      .no-eval {
        border: none !important;
        color: #666;
        text-align: center;
      }
    }
  }
  .org-card {
    height: 210px;
    border: none;
    .card-con {
      width: 100%;
      height: 100%;
      // overflow-y: auto;
      .el-scrollbar__view,
      .el-scrollbar {
        height: 100%;
      }
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .card-list {
        float: left;
        width: 50%;
        height: 160px;
        padding: 6px;
        cursor: pointer;

        > div {
          position: relative;
          width: 100%;
          height: 100%;
          .span-img {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;

            img {
              width: 100%;
              height: 100%;
            }
          }
          .span-txt {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 22px;
            background: rgba(0, 0, 0, 0.5);
            text-align: center;
            line-height: 22px;
            color: #fff;

            > span {
              position: absolute;
              width: 14px;
              height: 14px;
              color: #fff;
              border: 1px solid #fff;
              border-radius: 8px;
              text-align: center;
              line-height: 13px;
              font-size: 12px;
              right: 10px;
              top: 4px;
            }
          }
          > div {
            position: absolute;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-size: cover;
            z-index: 10;
            &:nth-child(1) {
              left: -5px;
              top: -5px;
            }
            &:nth-child(4) {
              left: -5;
              top: 60px;
            }
            &:nth-child(5) {
              left: 48px;
              top: -5px;
            }
            &:nth-child(2) {
              left: 48px;
              top: 60px;
            }
            &:nth-child(3) {
              left: 98px;
              top: -5px;
            }
            &:nth-child(6) {
              left: 98px;
              top: 60px;
            }
          }
        }
      }
    }
    .card-con-more {
      > div {
        height: 90%;
      }
    }
  }

  .org-detail {
    padding-top: 30px;

    .title {
      top: 0;
    }
    > div:last-child {
      position: relative;
      width: 100%;
      height: 100%;

      > div {
        position: absolute;
        width: 100%;
        padding: 0 10px;
        left: 0;
        height: 90%;
        max-height: 380px;
        top: 50%;
        transform: translate(0, -50%);

        .d-con {
          display: table-cell;
          vertical-align: middle;
          text-align: center;
          height: 90px;

          .d-con-pts {
            position: absolute;
            width: 100%;
            left: 0;
            top: 50%;
            transform: translate(0, -50%);
            padding-left: 8px;
          }

          img {
            max-width: 90px;
            max-height: 90px;
          }
        }
        .d-con-r {
          padding-left: 10px;
          > div {
            width: 100%;
            height: 100%;
            padding: 0 20px;
            background: #f2f5f6;

            > div {
              width: 100%;

              &:last-child {
                border-top: 1px solid #ddd;
                padding-top: 4px;
                span {
                  display: inline-block;
                  width: 16px;
                  height: 16px;
                  line-height: 12px;
                  border: 1px solid #eb6100;
                  font-size: 12px;
                  color: #eb6100 !important;
                  border-radius: 2px;
                }
              }
            }
          }
        }
        .d-con-border {
          border: 2px solid #ccc;
          border-radius: 4px;
        }
      }
    }
  }
}
#detailBottoma.bottoma {
  background: #0b141b;
  box-shadow: 0px 0px 0px 0px #313c46;
  *:not(.el-icon-star-on) {
    color: #fff !important;
  }
  .txt-color {
    color: #7f8697 !important;
  }
  .org-noborder {
    border: none;
  }
  .bg-span {
    background: rgba(250, 250, 250, 0.1) !important;
  }
  // 212e3b
  .org-detail,
  .org-pt,
  .base-msg,
  .org-card {
    &:after {
      height: 0;
    }
  }
  .base-msg,
  .org-card {
    &:after {
      background: #212e3b;
    }
  }
  .pts {
    > div {
      &:before {
        background-color: #37404b !important;
        box-shadow: 0 0.15em #313c46 inset !important;
      }

      span {
        color: #7f8697 !important;
      }
    }
    .pts-active {
      > div {
        &:before {
          background-color: #232a32 !important;
          box-shadow: 0 0.15em #495461 inset !important;
        }
      }
      span {
        color: #fff !important;
      }
    }
  }
  .d-con-border {
    background: #171e27 !important;
    border: 2px solid #69829e !important;
  }
  .eval-type {
    background: rgba(0, 0, 0, 0) !important;
    color: #e83c3f !important;
  }

  .d-con-r {
    > div {
      background: #131e28 !important;

      > div {
        &:last-child {
          color: #7f8697 !important;
        }
      }
    }
  }
  .org-addrs {
    color: #7f8697 !important;
  }
  .evaluate-detail .evaluate-detail-con > div {
    border-bottom: 1px solid #212e3b;

    &:last-child {
      border: none;
    }
  }
}
#detailBottoma.hid {
  overflow: hidden;
}
#detailBottoma.shrink {
  width: 0;
  padding: 0;
}
.el-popper.risk-card-pop {
  padding: 0;
  background: rgba(0, 0, 0, 0);
  box-shadow: 0 0 0 0 red;
  border: none;

  .risk-card-pop-full {
    background: #0b141b;
    border: 1px solid #212e3b;

    .card-pop-top {
      > div {
        background: #1a232c;
        color: #fff;
      }
      .card-pop-top-active {
        background: #4d5b69;
      }
    }
    .card-pop-content {
      * {
        color: #fff;
      }
    }
    .card-pop-footer {
      border-top: 1px solid #212e3b;
      li {
        color: #fff;
      }

      .active {
        color: #409eff;
      }
      .el-pagination .btn-next,
      .el-pagination .btn-prev {
        color: #fff;
      }
      .el-pagination button:disabled {
        color: #c0c4cc;
      }
    }
  }

  > div {
    position: relative;
    left: 16px;
    width: 100%;
    height: 210px;
    border: 1px solid #ddd;
    background: #fff;

    .card-pop-top {
      width: 100%;
      height: 30px;

      > div {
        float: left;
        height: 100%;
        width: 55px;
        background: #eff2f4;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        color: #8d8f90;
        cursor: pointer;
        &:nth-child(2) {
          width: 68px;
        }
      }
      > div.card-pop-top-wa {
        width: 50%;
      }
      > div.card-pop-top-wb {
        width: 100%;
      }
      .card-pop-top-active {
        background: #5288c0;
        color: #fff;
      }
    }
    .card-pop-content {
      width: 100%;
      height: 150px;

      * {
        font-size: 12px;
        color: #747474;
      }

      > div {
        float: left;
        overflow: hidden;
        &:first-child {
          width: 45%;

          .list {
            text-align: right;
          }
        }

        &:last-child {
          width: 55%;
        }

        .list {
          height: 24px;
          line-height: 24px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .list-more {
          position: relative;
          // padding-right: 30px;
          padding-right: 40px;

          .list-more-r {
            position: absolute;
            right: 6px;
            top: 0;
            height: 24px;
            line-height: 24px;
          }
          .list-more-r-more {
            color: #5288c0;
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
    .card-pop-footer {
      width: 100%;
      text-align: center;
      border-top: 1px solid #ddd;
      padding-top: 2px;

      li {
        font-weight: normal !important;
      }
      .el-pagination {
        padding: 0 !important;
        .btn-prev,
        .btn-next {
          position: relative;
          padding: 0;
          top: 1px;
        }

        * {
          background: rgba(0, 0, 0, 0);
        }
      }
      .el-pagination--small .btn-next,
      .el-pagination--small .btn-prev,
      .el-pagination--small .el-pager li,
      .el-pagination--small .el-pager li.btn-quicknext,
      .el-pagination--small .el-pager li.btn-quickprev,
      .el-pagination--small .el-pager li:last-child {
        min-width: 16px;
      }
    }
  }
}
</style>


