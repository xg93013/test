<template>
  <div class="search-box">
    <div v-for="(item,index) in lists" :key="index+'search'" class="out-box">
      <div class="label">{{item.type}}：</div>
      <div class="list" :ref="'listRefs'+index">
        <div class="inner">
          <div :class="{'short':item.short}" :ref="'listInRefs'+index">
            <span
              v-for="(itema, indexa) in item.list"
              :key="index+''+indexa+'list'"
              @click="searchItem(item.type, itema)"
              :class="{'active':searchResult[item.type] &&  searchResult[item.type] == itema}"
            >{{itema}}</span>
            <span class="time" v-if="item.type==='标签4'">
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy年MM月dd日"
                @change="selectTime(item.type)"
              ></el-date-picker>
            </span>
          </div>
        </div>
        <div class="btns">
          <span class="more" v-show="!item.open&&item.showBtn" @click="openMore(index)">展开</span>
          <span class="more" v-show="item.open&&item.showBtn" @click="closeMore(index)">收起</span>
        </div>
      </div>
    </div>
    <div class="tags">
      <el-tag
        :key="index+'tag'"
        v-for="(tag,index) in dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >{{tag.value}}</el-tag>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists: [
        {
          type: "标签1",
          list: ["全部", "类型1", "类型2", "类型3"],
          open: false,
          showBtn: false
        },
        {
          type: "标签2",
          list: ["全部"],
          open: false,
          showBtn: false,
          short: true
        },
        {
          type: "标签3",
          list: ["全部", "状态1", "状态2", "状态3"],
          open: false,
          showBtn: false
        },
        {
          type: "标签4",
          list: ["全部", "1月", 2, 3, 4],
          open: false,
          showBtn: false
        }
      ],
      searchResult: {},
      dynamicTags: [],
      dateValue: ""
    };
  },
  // props: {
  //   list: {
  //     type: Array,
  //     default: []
  //   }
  // },
  created() {
    for (var i = 0; i < 26; i++) {
      // console.log();
      this.lists[1].list.push(String.fromCharCode(65 + i));
    }
  },
  methods: {
    searchItem(type, item) {
      console.log(type);
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
    selectTime(type) {
      // this.searchResult.time = "2012-02-02";
      console.log(this.dateValue);
      this.searchItem(type, this.dateValue[0] + "-" + this.dateValue[1]);
    },
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
    }
  },
  mounted() {
    // this.$nextTick(() => {
    this.lists.forEach((item, index) => {
      this.searchResult[item.type] = item.list[0];
      let innerHeight = this.$refs["listInRefs" + index][0].offsetHeight;
      let outHeight = this.$refs["listRefs" + index][0].offsetHeight;
      if (innerHeight > outHeight) {
        this.lists[index].showBtn = true;
      }
    });
    // });

    this.getAllTags();
  }
};
</script>
<style lang="scss" scoped>
$height: 38px;
$marginH: 10px;
.search-box {
  width: 100%;
  .out-box {
    overflow: hidden;
    display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    display: -ms-flexbox; /* TWEENER - IE 10 */
    display: -webkit-flex; /* NEW - Chrome */
    display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
    margin: 10px 0;
    .label {
      -webkit-flex: 0 0 100px; /* Chrome */
      -ms-flex: 0 0 100px; /* IE 10 */
      flex: 0 0 100px; /* NEW, Spec - Opera 12.1, Firefox 20+ */
      -webkit-box-flex: 0 0 100px; /* OLD - iOS 6-, Safari 3.1-6 */
      -moz-box-flex: 0 0 100px; /* OLD - Firefox 19- */
      height: $height + $marginH * 2;
      line-height: $height + $marginH * 2;
    }
    .list {
      // flex: 1;
      -webkit-flex: 1; /* Chrome */
      -ms-flex: 1; /* IE 10 */
      flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
      -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
      -moz-box-flex: 1; /* OLD - Firefox 19- */
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
        border: 1px solid #f5f5f5;
        &.active {
          background: #ccc;
        }
      }
      .more {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
</style>


