export function addClss(el, className) {
  if (hasClass(el, className)) { // 如果有此class就不做操作，没有就添加
    return
  }
  // 先把classname拆开
  let newClass = el.className.split(' ')
  // 添加进去
  newClass.push(className)
  // 因为是数组，需要join转换为字符串
  el.className = newClass.join(' ')
}

// 判断此元素是否有该className
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  console.log(el, name, val)
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    console.log(el.setAttribute(prefix, val))
    return el.setAttribute(prefix, val)
  } else {
    console.log(el.getAttribute(name))
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style

// 一个立即执行函数 查看浏览器供应商
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
