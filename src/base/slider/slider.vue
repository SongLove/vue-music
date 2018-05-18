<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots"
            :class="{'active':currentPageIndex === index}" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {addClss} from 'common/js/dom'
export default {
  data () {
    return {
      dots: [], // 新建一个数组接收 children的长度，遍历出小点
      currentPageIndex: 0 // 接收当前是第几页
    }
  },
  props: {
    loop: { // 是否循环轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否自动轮播
      type: Boolean,
      default: true
    },
    intarval: { // 多少秒轮播一次
      type: Number,
      default: 4000
    }
  },
  mounted () {
    /* setTimeout(() => { // 设置定时器是为了请求数据后再执行
      this._setSliderWidth()
      this._initDost()
      this._initSlider()
      if (this.autoPlay) { // 如果设置了自动轮播
        this._play()
      }
    }, 10) */
    this._setSliderWidth()
    this._initDost()
    this._initSlider()
    if (this.autoPlay) { // 如果设置了自动轮播
      this._play()
    }
    window.addEventListener('resize', () => {
      // 当slider 没有初始化的时候return
      if (!this.slider) {
        return false
      } else {
        this._setSliderWidth(true)
        this.slider.refresh()
      }
    })
  },
  methods: {
    _play () {
      let pageIndex = this.currentPageIndex + 1
      if (this.autoPlay) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.intarval)
    },
    _initDost () {
      this.dots = new Array(this.children.length)
    },
    _setSliderWidth (isResize) {
      // 因为轮播图横向滚动是没有宽度的，要计算子元素的宽度相加，赋值给父元素
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClss(child, 'slider-item')
        // 每个子元素的宽度
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // isResize 传值是判断是否是resize 执行的方法，因为宽度不需要 *2
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 可以横向滚动
        scrollY: false, // 不能纵向滚动
        momentum: false, // 惯性
        snap: true,
        snapLoop: this.loop, // 循环
        snapThreshold: 0.3,
        snapSpeed: 400
      })
      this.slider.on('scrollEnd', () => {
        // 当slider 事件结束的时候会派发一个事件
        // this.slider.getCurrentPage().pageX 就是当前滚动的值下标
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          // 在循环模式下默认会往第一个元素添加一个拷贝
          // 所以要-1才会回到相应的下标
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
