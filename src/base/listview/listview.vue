<template>
  <scroll :probeType="probeType" @scroll="scroll" :listenScroll="listenScroll" class="listview" :data="data" ref="listview">
    <ul>
      <li ref="listGroup" v-for="(group, index) in data" class="list-group" :key="index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items" @click="selectItem(item)"  class="list-group-item" :key="index">
            <img v-lazy="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div @touchmove.stop.prevent="onShortcutmove" @touchstart="onShortcut" class="list-shortcut">
      <ul>
        <li :class="{'current':currentIndex===index}" class="item" v-for="(item, index) in shortcutList" :data-index="index" :key="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedtitle" ref="fixed">
      <h1 class="fixed-title">{{fixedtitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOP_HEIGHT = 18 // 每个dom的高度
const TITLE_HEIGHT = 30 // fixedtitle 的高度

export default {
  created () {
    this.touch = {} // 记录手指坐标位置的对象
    this.listenScroll = true
    this.listHeight = [] // 高度
    this.probeType = 3 // 也监听 scroll 滑动事件
  },
  data () {
    return {
      scrollY: -1, // 观察实时滚动的位置
      currentIndex: 0, // 观察当前应该显示第几个 对应到 shortcutList 的li哪个应该高亮
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  computed: { // 计算属性
    shortcutList () {
      return this.data.map((group) => {
        // 取到data数组的 title，因为有热门二字 substr 截取掉只取第一个字
        return group.title.substr(0, 1)
      })
    },
    fixedtitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    scroll (pos) { // 监听scroll 滚动 $emit的事件
      this.scrollY = pos.y
    },
    onShortcut (event) { // 点击到对应的列表
      let anchorIndex = getData(event.target, 'index')
      // 获取触碰手指
      let firsTouch = event.touches[0]
      this.touch.y1 = firsTouch.pageY
      // 记录一个一开始点击是第几个锚点
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutmove (event) { // 滑动到相应的列表
      // 滚动的时候需要确定onShortcut方法已经跳到哪了。需要拿一个坐标
      let firsTouch = event.touches[0]
      this.touch.y2 = firsTouch.pageY
      // 记录偏移了几个锚点
      let data = (this.touch.y2 - this.touch.y1) / ANCHOP_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + data
      this._scrollTo(anchorIndex)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () { // 计算每个group 的高度 这个方法的调用是运用在当 this.data 发送改变的时候
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      // 循环遍历添加每个listGroup 的高度
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部 newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // 为什么是-newY 呢，因为向上滚动y值是-的 !height2 表示最后一个
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且 -newY大于最后有个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
