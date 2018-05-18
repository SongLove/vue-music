function getRandomInt(min, max) {
  return Math.floor(Math.random()) * (max - min + 1) + min // Math.random() 返回0 - 1 之间的数不包括1
}

export function shuffle(arr) { // 打乱数组排列
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, deley) { // 截留
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, deley)
  }
}
