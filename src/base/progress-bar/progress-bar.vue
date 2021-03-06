<template>
  <div class="progress-bar" @click="progressClick" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div @touchend.prevent="progressTouchEnd" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
const progressBtnWidth = 16 // 小球的宽度
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      // 当我们点击progressBtn 的时候 e.offsetX获取不对
      // this._offset(e.offsetX)
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    progressTouchEnd () { // 拖动手势放开动作
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressTouchStart (e) {
      this.touch.initiated = true // 初始化成功
      this.touch.startX = e.touches[0].pageX // 点击的位置
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent (newPercent) { // 计算进度条的宽度
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
