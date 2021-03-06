<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click.stop="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConFirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :refreshDelay="refreshDelay" :data="sequenceList" ref="listContent" class="list-content">
          <transition-group name="list" tag="ul" ref="list">
            <li @click="selectItem(item, index)" class="item" v-for="(item, index) in sequenceList" :key="item.id">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i class="icon" :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSongShow">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <con-firm confirmBtnText="清空" @confirm="confirmClear"  ref="confirm" text="是否清空播放列表"></con-firm>
      <div @click.stop>
        <add-song ref="addSong"></add-song>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import conFirm from 'base/confirm/confirm'
import {playerMixin} from 'common/js/mixin'
import addSong from 'components/add-song/add-song'
export default {
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  components: {
    Scroll,
    conFirm,
    addSong
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    addSongShow () {
      this.$refs.addSong.show()
    },
    showConFirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
    },
    deleteOne (item) { // 删除模态框中的其中一条
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    getCurrentIcon (item) { // 判断当前播放歌曲是否是选择歌曲
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) { // 判断当前是否是随机播放模式
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      // 当列表选中的时候，scroll到当前列表
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currenSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return false
      }
      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
