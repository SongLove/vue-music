import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  playing: false, // 播放
  fullScreen: false, // 播放器展开或收起
  playlist: [], // 播放列表
  sequenceList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前的音乐
  disc: {}, // 歌单
  topList: {}, // 排行榜歌单
  searchHistory: loadSearch(), // 搜索记录列表
  playHistory: loadPlay(), // 播放历史
  favoriteList: loadFavorite() // 收藏的列表
}
export default state
