<template>
  <div id="riskDetailBox" :class="{'risk-detail-full': isFullScreen}">
    <div class="shrink-box" :class="{'shrink-boxa': isShrink}" @click="shrinkChange(true)">
      <div class="shrink-bg"></div>
      <i class="el-icon-arrow-right" v-show="!isShrink"></i>
      <i class="el-icon-arrow-left" v-show="isShrink"></i>
    </div>
    <div class="top">
      <div>
        <img ref="a" @mouseenter="overEnter('a')" :src="require('../../images/riskAddr.png')" alt />
        <el-select
          :popper-class="isFullScreen?'full-poper':''"
          v-model="value"
          size="small"
          placeholder="请选择"
          @visible-change="keyWordClear"
          style="width:150px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-select
          :popper-class="isFullScreen?'full-poper':''"
          v-model="valuea"
          @visible-change="(e)=>{keyWordClear(e,true)}"
          size="small"
          placeholder="请选择"
          style="width:150px"
        >
          <el-option
            v-for="item in optionsa"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <detailArea
      @getBaseMsg="getBaseMsg"
      @goDetail="goDetail"
      :areaLng="areaLng"
      ref="detailArea"
      v-show="!isDetail"
    />
    <detailOrg @back="back" @getBaseMsg="getBaseMsg" ref="detailOrg" v-show="isDetail" />
    <div class="search-box">
      <div class="search-pop" :class="{'search-pop-show':popShow&&searchLists.length}">
        <el-scrollbar :style="{height: (popHeight-12)+'px'}">
          <div
            class="pop-list"
            style="font-weight:bold;cursor:default"
            v-show="searchLists.length&&!searchTxt"
          >
            历史搜索
            <img
              @mousedown="delHistory"
              style="position:relative;top:7px;left:150px;cursor:pointer;height:20px;"
              :src="isFullScreen?require('../../images/dela.png'):require('../../images/del.png')"
              alt
            />
          </div>
          <div
            class="pop-list"
            v-for="(item,index) in searchLists"
            :key="index"
            @mousedown="listChoose(item)"
          >
            <el-tooltip
              :disabled="disabled"
              class="item"
              effect="dark"
              :content="item.name"
              placement="left"
              :open-delay="500"
            >
              <div
                :ref="'name'+index"
                @mouseenter="overEnter('name'+index)"
                @mouseleave="overLeave"
              >{{item.name}}</div>
            </el-tooltip>
            <el-tooltip
              :disabled="disabled"
              class="item"
              effect="dark"
              :content="item.address"
              placement="left"
              :open-delay="500"
            >
              <div
                :ref="'address'+index"
                @mouseenter="overEnter('address'+index)"
                @mouseleave="overLeave"
              >{{item.address}}</div>
            </el-tooltip>
          </div>
        </el-scrollbar>
      </div>
      <el-input
        slot="reference"
        size="small"
        placeholder="搜索商家名称"
        v-model="searchTxt"
        clearable
        class="input-with-select"
        @clear="keyWordClear"
        @focus="popFocus"
        @input="keyWordSearch"
        @blur="popShow=false"
        @keyup.enter.native="handleSearch"
      >
        <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>
<script>
import http from "@/unit/http";
import apis from "@/unit/apis";
import { mapState } from "vuex";
import detailArea from "./detailArea";
import detailOrg from "./detailOrg";
const { VENTURE_REGIONS, VENTURE_SHOPS } = apis;
export default {
  data() {
    return {
      userMsgId: "",
      disabled: true,
      popShow: false,
      searchTxt: "",
      searchAddr: "",
      searchId: "",
      hasSearch: "",
      options: [],
      optionsa: [
        {
          value: "default",
          label: "全部商家"
        },
        {
          value: "_CERT_VALID",
          label: "证照合规"
        },
        {
          value: "UN_PUBLICIZED",
          label: "证照缺失"
        },
        {
          value: "NON_PERMIT",
          label: "证照不符"
        },
        {
          value: "VAGUE",
          label: "证件模糊"
        },
        {
          value: "FORGERY",
          label: "疑似假证"
        },
        {
          value: "MULTI_PURPOSE",
          label: "一证多用"
        },
        {
          value: "OVER_RAGE",
          label: "超范围经营"
        },
        {
          value: "EXPIRED",
          label: "证件过期"
        },
        {
          value: "ADDRESS",
          label: "地址不符"
        },
        {
          value: "COMMENT",
          label: "风险评论"
        }
      ],
      areaLng: {},
      value: "default",
      valuea: "default",
      isDetail: false,
      searchLists: [],
      popHeight: 0,
      regionType: "",
      isShrink: false
    };
  },
  components: {
    detailArea,
    detailOrg
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.isFullScreen
    })
  },
  methods: {
    shrinkChange(e) {
      this.isShrink = e ? !this.isShrink : e;
      this.$refs.detailArea.shrinkChange(this.isShrink);
      this.$refs.detailOrg.shrinkChange(this.isShrink);
    },
    back(isTrue) {
      this.isDetail = false;
      this.areaChange(
        {
          area: this.value,
          risk: this.valuea
        },
        true,
        true,
        false,
        isTrue
      );
    },
    goDetail(id) {
      this.isDetail = true;
      this.$refs.detailOrg.getDetail(id, this.value);
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
    handleSearch(e) {
      if (this.searchTxt == this.hasSearch) {
        return false;
      }
      if (this.searchTxt) {
        if (!this.searchId) {
          this.listChoose({
            name: this.searchTxt,
            id: "",
            address: ""
          });
        }
      } else {
        this.keyWordClear();
      }
      this.hasSearch = this.searchTxt;
    },
    delHistory() {
      if (localStorage.getItem(this.userMsgId)) {
        localStorage.removeItem(this.userMsgId);
        this.searchLists = [];
        this.getHeight(0);
      }
    },
    popFocus() {
      if (this.searchTxt) {
        this.searchLists = [];
        this.keyWordSearch();
      } else {
        if (localStorage.getItem(this.userMsgId)) {
          this.searchLists = JSON.parse(localStorage.getItem(this.userMsgId));
          this.getHeight(this.searchLists.length + 1);
        }
      }
      this.popShow = true;
    },
    keyWordClear(e, isViol) {
      //isViol是否违规
      if (e) {
        return false;
      }
      this.areaChange(
        {
          area: this.value,
          risk: this.valuea
        },
        true,
        false,
        isViol
      );
    },
    getBaseMsg(id) {
      let obj = {
        level: 14,
        region: "",
        range: {},
        riskFrom: 0,
        riskTo: 100,
        shopId: id,
        shopName: ""
      };
      this.searchId = id;
      this.$emit("getBaseMsg", obj, true);
      this.$emit("resizeSlider");
    },
    listChoose(e) {
      if (!this.searchTxt) {
        this.getHeight(this.searchLists.length);
      }
      let { name, id, address } = e;
      this.searchTxt = name;
      this.searchId = id;
      this.searchAddr = address ? address : "";
      let obj = { level: 14, region: "", range: {}, riskFrom: 0, riskTo: 100 };
      if (id) {
        obj.shopId = id;
        obj.shopName = "";
      } else {
        obj.shopName = name;
        obj.shopId = "";
      }
      this.$emit("getBaseMsg", obj, true);
      this.$emit("resizeSlider");
      if (!id) {
        let zoom;
        if (this.regionType === "PROVINCE") {
          zoom = 7;
        }
        if (this.regionType === "CITY") {
          zoom = 9;
        }
        if (this.regionType === "ZONE") {
          zoom = 14;
        }
        this.$emit("setMap", {
          zoom,
          center: this.areaLng.default
        });
      } else {
        this.goDetail(id);
      }
      let searchLists = localStorage.getItem(this.userMsgId);
      let arr = [];
      if (searchLists) {
        arr = JSON.parse(searchLists);
        let canPush = true;
        for (let i = 0, n = arr.length; i < n; i++) {
          //判断历史记录是否有相同的
          if (
            arr[i].name == name &&
            arr[i].address == address &&
            arr[i].id == id
          ) {
            canPush = false;
            break;
          }
        }
        if (canPush) {
          if (arr.length == 10) {
            arr.pop();
          }
          arr.unshift({
            name,
            address,
            id
          });
        }
      } else {
        arr.unshift({
          name,
          address,
          id
        });
      }

      localStorage.setItem(this.userMsgId, JSON.stringify(arr));
    },
    async keyWordSearch() {
      this.searchAddr = "";
      this.searchId = "";
      if (this.searchTxt) {
        let res = await http.get(
          encodeURI(VENTURE_SHOPS + "?key=" + this.searchTxt)
        );
        if (res) {
          this.searchLists = [...res.result];
          this.getHeight(this.searchLists.length);
        }
      } else {
        if (localStorage.getItem(this.userMsgId)) {
          this.searchLists = JSON.parse(localStorage.getItem(this.userMsgId));
          this.getHeight(this.searchLists.length + 1);
        } else {
          this.searchLists = [];
          this.getHeight(this.searchLists.length);
        }
      }
    },
    getHeight(n) {
      this.popHeight = n * 30 + 12 > 300 ? 300 : n * 30 + 12;
    },
    areaChange(obj, clear, isBack, isViol, isTrue) {
      this.searchTxt = "";
      this.hasSearch = "";
      let e = obj.area;
      let { risk } = obj;
      let ventureType = risk === "default" ? "" : risk;
      let zoom;
      let region = e === "default" ? "" : e;
      if (this.regionType === "CITY") {
        if (e === "default") {
          zoom = 9;
        } else {
          zoom = 14;
        }
      } else if (this.regionType === "ZONE") {
        zoom = 14;
      } else {
        if (e === "default") {
          zoom = 7;
        } else {
          zoom = 9;
        }
      }
      this.$emit("getBaseMsg", {
        level: zoom,
        region,
        shopId: "",
        shopName: "",
        riskFrom: 0,
        riskTo: 100,
        ventureType
      });
      this.$emit("resizeSlider");
      this.$emit("setMap", {
        zoom,
        center: this.areaLng[e],
        clear,
        isViol
      });
      if (!isBack && this.isDetail) {
        this.back();
        // this.$refs.detailArea.init(
        //   {
        //     area: region,
        //     risk: ventureType
        //   },
        //   this.areaLng[e][2]
        // );
      } else {
        this.$refs.detailArea.init(
          {
            area: region,
            risk: ventureType
          },
          this.areaLng[e][2],
          isTrue
        );
      }
    },
    async getAreas() {
      let res = await http.get(VENTURE_REGIONS);
      if (res) {
        let {
          city,
          province,
          zone,
          cityCoordX,
          cityCoordY,
          provinceCoordX,
          provinceCoordY,
          zoneCoordX,
          zoneCoordY,
          regionType
        } = this.$store.state.userMsg;
        this.regionType = regionType;
        let obja = {
          value: "default"
        };
        let obj = {};
        // label: city
        if (regionType == "PROVINCE") {
          obja.label = province;
          obj.default = [provinceCoordX, provinceCoordY, province];
        }
        if (regionType == "CITY") {
          obja.label = city;
          obj.default = [cityCoordX, cityCoordY, city];
        }
        if (regionType == "ZONE") {
          obja.label = zone;
          obj.default = [zoneCoordX, zoneCoordY, zone];
        }
        let areas = [obja];
        res.result.forEach(item => {
          let { id, name, coordX, coordY } = item;
          areas.push({
            value: id,
            label: name
          });
          obj[item.id] = [coordX, coordY, name];
        });
        this.options = [...areas];
        this.areaLng = { ...obj };
        let zoom = 7;
        if (regionType === "CITY") {
          zoom = 9;
        } else if (regionType === "ZONE") {
          zoom = 14;
        } else {
          zoom = 7;
        }
        this.$emit("getBaseMsg", {
          level: zoom
        });
        this.$emit("setMap", {
          zoom,
          center: obj.default
        });
      }
    }
  },
  mounted() {
    this.getAreas();
    this.userMsgId = this.$store.state.userMsg.id;
  }
};
</script>
<style lang="scss">
#riskDetailBox {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px;
    background-color: #fff;
    border: none;
    .el-button {
      padding: 12px 10px;
      margin: -10px -26px;
    }
  }
  .el-input-group--append {
    box-shadow: 0px 0px 0px 0px #ddd;
  }

  position: relative;
  // width: 100%;
  height: 100%;
  padding-top: 60px;

  .shrink-box {
    position: absolute;
    width: 16px;
    height: 100px;
    left: -15px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
    z-index: 10;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    line-height: 94px;
    text-align: center;
    color: #666;

    .shrink-bg {
      position: absolute;
      right: 0;
      top: 0;
      height: 100px;
      width: 0;
      border-width: 10px 16px 10px 0;
      border-style: solid;
      border-color: transparent #fff transparent transparent;
      z-index: -1;
    }
  }
  .shrink-boxa {
    left: -7px;
  }
  .top {
    position: absolute;
    width: 400px;
    height: 40px;
    // left: 0;
    right: 0;
    top: 13px;
    z-index: 10;

    input {
      border: none;
    }

    > div {
      float: left;
      height: 100%;
      position: relative;
      width: 50%;
      padding-top: 5px;
      // box-shadow: 0px 2px 4px 0px #ddd;
      background: #fff;
      border-radius: 2px;
      text-align: center;
      img {
        position: absolute;
        left: 32px;
        top: 12px;
      }
      .el-input__inner {
        padding-left: 6px;
      }
      .el-input--small {
        padding-left: 24px;
      }

      &:first-child:after {
        position: absolute;
        right: 0;
        top: 6px;
        bottom: 6px;
        width: 1px;
        content: "";
        background: #ddd;
      }
    }
  }
  .search-box {
    position: fixed;
    width: 250px;
    left: 230px;
    top: 75px;
    z-index: 100;
    input {
      border: none;
    }

    .search-pop {
      position: absolute;
      left: 0;
      right: 0;
      top: 33px;
      background: #fff;
      border-radius: 4px;
      transition: 0.3s;
      transform: rotateX(90deg);
      transform-origin: top center;
      padding: 6px 0;
      border: 1px solid #ddd;
      z-index: 100;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .pop-list {
        width: 100%;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;

        &:hover {
          background: #f5f7fa;
        }

        &:first-child:hover {
          background: #fff;
        }

        > div {
          float: left;
          height: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          &:first-child {
            width: 68%;
            padding-right: 5px;
          }
          &:last-child {
            width: 32%;
            padding-left: 5px;
            text-align: right;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
    .search-pop-show {
      transform: rotateX(0);
      transform-origin: top center;
    }
  }
}
#riskDetailBox.risk-detail-full {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px;
    background-color: #313c46;
    border: none;
  }

  .el-input-group--append {
    box-shadow: 0px 0px 0px 0px #313c46;
  }
  .shrink-box {
    .shrink-bg {
      border-color: transparent #0b141b transparent transparent;
    }
  }

  .top {
    > div {
      background: #313c46;
      box-shadow: 0px 0px 0px 0px #313c46;
      .el-input__inner {
        background: #313c46;
      }

      &:first-child:after {
        background: #0b141b;
      }
    }
  }
  .search-box {
    top: 86px;
    left: 10px;
    .el-input__inner {
      background: #313c46;
    }
    .search-pop {
      background: #313c46;
      border: none;

      * {
        color: #fff !important;
      }
      .pop-list {
        &:hover {
          background: #0b141b;
        }

        &:first-child:hover {
          background: #313c46;
        }
      }
    }
  }
}
.el-select-dropdown.full-poper {
  background-color: #313c46;
  box-shadow: 0px 0px 0px 0px #313c46;
  border: 1px solid #0b141b;

  * {
    border: none;
    color: #fff;
  }

  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: #0b141b;
  }
}
</style>


