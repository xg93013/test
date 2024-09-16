<!-- better-scroll 滚动组件 -->
<template>
  <div ref="wrapper" class="my-scroll">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    components: {},
    data () {
      return {}
    },
    props: {
      // 传入的数据
      data: {
        type: Array,
        default: null
      },
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      // 是否监听滚动位置
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenTouch: {
        type: Boolean,
        default: false
      },
      // 是否开启上拉加载
      pullup: {
        type: Boolean,
        default: false
      },
      // 是否开启下拉刷新
      pullDown: {
        type: Boolean,
        default: false
      },
      // 滚动前是否触发事件，如：滚动前让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
      beforeScroll: {
        type: Boolean,
        default: false
      },
      // 延迟刷新
      refreshDelay: {
        type: Number,
        default: 20
      },

      pullDownRefresh: {
        type: Object,
        default: null
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    },
    methods: {
      _initScroll () {
        const options = {
          probeType: this.probeType,
          click: this.click
        }
        if (!this.$refs.wrapper) {
          return
        }

        if (this.pullDown) {
          options.pullDownRefresh = {
            threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
            stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
          }
        }

        this.scroll = new BScroll(this.$refs.wrapper, options)

        // 派发监听滚动位置事件
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            // 向父组件传值
            me.$emit('scroll', pos)
          })
        }

        // 监听touch
        if (this.listenTouch) {
          let me = this
          this.scroll.on('touchEnd', () => {
            // 向父组件传值
            me.$emit('touchEnd')
          })
        }

        // 派发上拉加载更多事件
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY)) {
              // 滑动到底部了
              this.$emit('scrollToEnd')
            }
          })
        }

        // 下拉刷新
        if (this.pullDown) {
          this.scroll.on('pullingDown', () => {
            console.log('刷新')
            this.scroll.finishPullDown()
          })
        }

        // 滚动前是否触发事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart')
          })
        }
      },
      touchEnd () {
        this.scroll && this.scroll.touchEnd()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      stop () {
        this.scroll.stop()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    created () {},
    mounted () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    }
  }
</script>

<style lang="scss" scoped>
</style>
