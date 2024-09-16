<template>
  <div class="search-box">
    <div v-for="(item,index) in lists" :key="index+'search'" class="out-box">
      <div class="label">{{item.label}}：</div>
      <div class="list" :ref="'listRefs'+index">
        <div class="inner">
          <div :class="{'short':item.short}" :ref="'listInRefs'+index">
            <span
              v-for="(itema, indexa) in item.list"
              :key="index+''+indexa+'list'"
              @click="searchItem(item.type, itema)"
              :class="{'active':searchResult[item.type] &&  searchResult[item.type] == itema}"
            >{{itema}}</span>
            <!-- <span class="time" v-if="item.type==='标签4'">
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy年MM月dd日"
                @change="selectTime(item.type)"
              ></el-date-picker>
            </span>-->
          </div>
        </div>
        <div class="btns">
          <span class="more" v-show="!item.open&&item.showBtn" @click="openMore(index)">展开</span>
          <span class="more" v-show="item.open&&item.showBtn" @click="closeMore(index)">收起</span>
        </div>
      </div>
    </div>
    <div class="out-box tags">
      <div class="label">已选条件：</div>
      <div class="list">
        <el-tag
          :key="index+'tag'"
          v-for="(tag,index) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag.value}}</el-tag>
        <span @click="saveSearch" class="operation">保存为搜索条件</span>
        <span @click="reset" class="operation">清空搜索条件</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists: [],
      searchResult: {},
      dynamicTags: [],
      dateValue: ""
    };
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  created() {
    this.lists = [];
    for (let i = 0; i < this.list.length; i++) {
      this.lists.push({
        type: this.list[i].type,
        list: this.list[i].list,
        label: this.list[i].label,
        open: false,
        showBtn: false
      });
    }
  },
  methods: {
    searchItem(type, item) {
      if (this.searchResult[type]) {
        // this.searchResult[type] =
        // this.searchResult[type] == item
        //   ? delete this.searchResult[type]
        //   : item;
        if (this.searchResult[type] == item) {
          delete this.searchResult[type];
        } else {
          this.searchResult[type] = item;
        }
      } else {
        this.searchResult[type] = item;
      }
      console.log(this.searchResult);
      this.getAllTags();
    },
    // selectTime(type) {
    //   // this.searchResult.time = "2012-02-02";
    //   console.log(this.dateValue);
    //   this.searchItem(type, this.dateValue[0] + "-" + this.dateValue[1]);
    // },
    getAllTags() {
      this.dynamicTags = [];
      for (let key in this.searchResult) {
        if (this.searchResult[key]) {
          if (this.searchResult[key] != "全部") {
            this.dynamicTags.push({
              key: key,
              value: this.searchResult[key]
            });
          }
        }
      }
    },
    handleClose(tag) {
      for (let i = 0; i < this.dynamicTags.length; i++) {
        if (tag.key === this.dynamicTags[i].key) {
          this.dynamicTags.splice(i, 1);
          delete this.searchResult[tag.key];
          return;
        }
      }
    },
    openMore(index) {
      this.lists[index].open = true;
      this.$refs["listRefs" + index][0].style.height = "auto";
    },
    closeMore(index) {
      this.lists[index].open = false;
      this.$refs["listRefs" + index][0].style.height = "64px";
    },
    saveSearch() {
      this.$emit("saveSearch", this.searchResult);
    },
    reset() {
      this.searchResult = {};
      this.dynamicTags = [];
    }
  },
  mounted() {
    this.lists.forEach((item, index) => {
      this.searchResult[item.type] = item.list[0];
      let innerHeight = this.$refs["listInRefs" + index][0].offsetHeight;
      let outHeight = this.$refs["listRefs" + index][0].offsetHeight;
      let showBtn = false;
      if (innerHeight > outHeight) {
        item.showBtn = true;
      }
    });
    // console.log(this.lists);

    this.getAllTags();
  }
};
</script>
<style lang="scss" scoped>
$height: 30px;
$marginH: 5px;
.search-box {
  width: 100%;
  .out-box {
    overflow: hidden;
    // display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
    // display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    // display: -ms-flexbox; /* TWEENER - IE 10 */
    // display: -webkit-flex; /* NEW - Chrome */
    display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
    margin: 10px 0;
    .label {
      // -webkit-flex: 0 0 100px; /* Chrome */
      // -ms-flex: 0 0 100px; /* IE 10 */
      flex: 0 0 100px; /* NEW, Spec - Opera 12.1, Firefox 20+ */
      // -webkit-box-flex: 0 0 100px; /* OLD - iOS 6-, Safari 3.1-6 */
      // -moz-box-flex: 0 0 100px; /* OLD - Firefox 19- */
      height: $height + $marginH * 2;
      line-height: $height + $marginH * 2;
    }
    .list {
      // flex: 1;
      // -webkit-flex: 1; /* Chrome */
      // -ms-flex: 1; /* IE 10 */
      flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
      // -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
      // -moz-box-flex: 1; /* OLD - Firefox 19- */
      position: relative;
      height: $height + $marginH * 2+6px;
      overflow: hidden;
      display: flex;

      .inner {
        flex: 1;
        .short {
          width: 60%;
        }
      }
      .btns {
        flex: 0 0 100px;
      }

      span {
        display: inline-block;
        padding: 0 10px;
        height: $height;
        line-height: $height;
        margin: $marginH 4px;
        cursor: pointer;
        border: 1px solid #f5f5f5;
        &.active {
          background: #ccc;
        }
        &.operation {
          border: none;
        }
      }
      .more {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .tags {
    .el-tag {
      margin: 0 10px 0 0;
    }
  }
}
</style>


