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
              :class="{'active':searchResult[item.type] && (multiple ? searchResult[item.type].indexOf(itema) > -1 : searchResult[item.type] == itema)}"
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
    <div class="out-box tags" v-show="showResult">
      <div class="label">已选条件：</div>
      <div class="list results">
        <el-tag
          :key="index+'tag'"
          v-for="(tag,index) in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag.value}}</el-tag>
        <!-- <span @click="saveSearch" class="operation">保存为搜索条件</span> -->
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
      dateValue: "",
      tagId: 1
    };
  },
  props: {
    list: {
      type: Array,
      default: []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showResult: {
      type: Boolean,
      default: false
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
    getId() {
      return this.tagId++;
    },
    searchItem(type, item) {
      if (this.searchResult[type]) {
        if (!this.multiple) {
          if (this.searchResult[type] == item) {
            delete this.searchResult[type];
          } else {
            this.searchResult[type] = item;
          }
        } else {
          if (this.searchResult[type].indexOf(item) > -1) {
            this.searchResult[type].splice(
              this.searchResult[type].indexOf(item),
              1
            );
            if (item == "全部") {
              this.searchResult[type] = [];
            }
          } else {
            // console.log(this.searchResult);

            if (item == "全部") {
              this.searchResult[type] = [item];
            } else {
              if (this.searchResult[type].indexOf("全部") > -1) {
                this.searchResult[type].splice(
                  this.searchResult[type].indexOf("全部"),
                  1
                );
              }
              this.searchResult[type].push(item);
            }
          }
        }
      } else {
        this.searchResult[type] = this.multiple ? [item] : item;
      }
      // console.log(this.searchResult);
      this.$emit("searchResult", this.searchResult);
      this.getAllTags();
    },
    getAllTags() {
      this.dynamicTags = [];
      for (let key in this.searchResult) {
        if (this.searchResult[key]) {
          if (!this.multiple) {
            if (this.searchResult[key] != "全部") {
              this.dynamicTags.push({
                id: this.getId(),
                key: key,
                value: this.searchResult[key]
              });
            }
          } else {
            if (this.searchResult[key].indexOf("全部") == -1) {
              for (let i = 0; i < this.searchResult[key].length; i++) {
                this.dynamicTags.push({
                  id: this.getId(),
                  key: key,
                  value: this.searchResult[key][i]
                });
              }
            }
          }
        }
      }
    },
    handleClose(tag) {
      for (let i = 0; i < this.dynamicTags.length; i++) {
        if (tag.id === this.dynamicTags[i].id) {
          if (!this.multiple) {
            delete this.searchResult[tag.key];
          } else {
            this.searchResult[tag.key].splice(
              this.searchResult[tag.key].indexOf(this.dynamicTags[i].value),
              1
            );
          }
          this.dynamicTags.splice(i, 1);
          this.$emit("searchResult", this.searchResult);
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
      this.$emit("searchResult", "");
    }
  },
  mounted() {
    this.lists.forEach((item, index) => {
      if (!this.multiple) {
        this.searchResult[item.type] = item.list[0];
      } else {
        this.searchResult[item.type] = [item.list[0]];
      }
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
    margin: 2px 0;
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
      height: auto;
      display: flex;
      &.results {
        display: block;
        height: auto;
        overflow: hidden;
      }

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
        padding: 0 20px;
        border-radius: 2px;
        height: $height;
        line-height: $height;
        margin: $marginH 4px;
        cursor: pointer;
        border: 1px solid #f5f5f5;
        &.active {
          background: #f3f9ff;
          color: #3293fe;
          border: 1px solid #f3f9ff;
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


