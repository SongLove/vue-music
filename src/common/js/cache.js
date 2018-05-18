import storage from 'good-storage'

// 搜索记录
const SEATCH_KEY = '__search__'
const SEATCH_MAX_LENGHT = 15

// 播放记录
const PLAY_KEY = '__play__'
const PLAY_INDEX = 50

// 喜欢的歌曲记录
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX = 50

// 检查是否有相同记录，有就删除，把最新在插入在记录最前
// arr 存储的数组 val 插入的值 compare比较函数 maxLen 最大值
function insertArray(arr, val, compare, maxLen) {
  // es6 findIndex 查找数组中是否有某个元素
  const index = arr.findIndex(compare)
  if (index === 0) { // 如果是第一条数据
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  // 如果大于存储的量，把最后一条去除
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
// 删除函数
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 删除全部搜索记录缓存
export function clearSearch() {
  storage.remove(SEATCH_KEY)
  return []
}

export function saveSearch(query) { // 保存到本地缓存
  let searches = storage.get(SEATCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEATCH_MAX_LENGHT)
  storage.set(SEATCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEATCH_KEY, [])
}

// 删除本地缓存搜索记录
export function deleteSearch(query) {
  let searchs = storage.get(SEATCH_KEY, [])
  deleteFromArray(searchs, (item) => {
    return item === query
  })
  storage.set(SEATCH_KEY, searchs)
  return searchs
}

// 存储最近播放列表
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_INDEX)
  storage.set(PLAY_KEY, songs)
  return songs
}
// 读取最近播放列表
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

// 存储喜欢的歌曲
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除喜欢的歌曲列表
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 读取喜欢的歌曲列表
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
