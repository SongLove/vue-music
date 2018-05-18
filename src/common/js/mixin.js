import {mapGetters, mapMutations, mapActions} from 'vuex' // 引入vuex 的获取数据方法
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

// player 与 playlist 公用的代码
export const playerMixin = {
  computed: {
    iconMode () { // 播放模式
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList', // 播放列表顺序
      'currentSong',
      'playlist', // 播放列表
      'mode', // 播放模式
      'favoriteList' // 收藏歌曲列表
    ])
  },
  methods: {
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => { // arr findIndex 方法接收一个函数
        return item.id === this.currentSong.id
      })
      this.setCurrenIndex(index)
    },
    getFavoriteIcon (song) { // 切换icon
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite (song) { // 点击添加收藏
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) { // 判断此歌曲是否已在收藏列表
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    changeMode () { // 切换播放模式
      console.log(this.currentSong)
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) { // playMode.random)播放模式
        list = shuffle(this.sequenceList)
      } else { // 播放模式为0
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

// searc 与 add-song公用的代码
export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    saveSearch () { // 保存搜索结果
      this.saveSearchHistory(this.query)
    },
    blurInput () { // 让input 失去焦点
      this.$refs.searchbox.inputBlur()
    },
    onQueryChange (query) { // 监听 search-box组件的 query 发送改变传递的事件
      this.query = query
    },
    addQuery (quer) { // 点击热门搜索关键词
      this.$refs.searchbox.setQuery(quer)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
