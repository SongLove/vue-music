<template>
  <scroll :beforeScroll="beforeScroll" @beforeScroll="listScroll" @scrollToEnd="searchMore" :pullup="pullup" :data="result" ref="suggest"  class="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索数据"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  props: {
    query: { // 检索关键词
      type: String,
      default: ''
    },
    showSinger: { // 是否要显示歌手
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [], // 搜索结果
      pullup: true, // 开启上拉刷新
      hasMore: true,
      beforeScroll: true, // 是否开放scroll执行
      tabs: [
        {text: '分类一', id: '1'},
        {text: '分类一', id: '2'},
        {text: '分类一', id: '2'}
      ]
    }
  },
  methods: {
    refresh () {
      this.$refs.suggest.refresh()
    },
    listScroll () { // 列表滚动
      this.$emit('listScroll')
    },
    selectItem (item) { // 搜索结果跳转 详情路由
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({ // 构造一个singer
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer) // 通过vuex实现通讯
      } else {
        this.insertSong(item)
      }
      this.$emit('select') // 派发一个事件，用于存储搜索历史
    },
    searchMore () { // 搜索更多
      if (!this.hasMore) {
        return false
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    search () { // 请求获取检索结果
      this.page = 1 // 每次检索设置1
      this.$refs.suggest.scrollTo(0, 0) // 设置scroll置顶
      this.hasMore = true
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
          console.log(res.data)
        }
      })
    },
    _checkMore (data) { // 检查是否还有更多
      const song = data.song
      // 搜索结果的总条数song.totalnum
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) >= song.totalnum) {
        this.hasMore = false
      }
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) { // 获取歌手和歌曲名
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        // 对象扩展运算符
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
