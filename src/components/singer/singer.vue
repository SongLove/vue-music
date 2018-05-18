<template>
    <div ref="singer" class="singer">
      <list-view ref="list" @select="selectSinger" :data="singers"></list-view>
      <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  mixins: [playlistMixin],
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerlist()
  },
  components: {
    ListView
  },
  methods: {
    handlePlaylist (playlist) { // mixins的方法
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger (singer) { // listview 传过来的时候监听
      this.$router.push({ // 路由
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerlist () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      // 因为得到的数据是没有分类排列的，需要重组数据
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 取到的数据 遍历key value
      list.forEach((item, index) => {
        // 前十条添加到热门
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid, // 后期匹配歌手详情页的id
            name: item.Fsinger_name // 歌手名
          }))
        }
        const key = item.Findex // 歌手名字 字母
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 把相等歌手名字首字母的 添加进去
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表，我们需要处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        // 判断title是否为字母a-z 添加进入不是热门的列表
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
          // 如果是热门，也添加进热门列表
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => { // 数组排序方法
        // charCodeAt 方法返回被选择的字符编码
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // concat 方法用于连接两个或者多个数组
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
