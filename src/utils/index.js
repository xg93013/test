/**
 * 添加localStorage
 * @param {*} key 
 * @param {*} val json格式
 */
export function setStorage (key, val) {
    // let arrItem = []
    // if (!time || isNaN(time)) {
    //     time = 60
    // }
    // if (val instanceof Array) {
    //     arrItem = val
    // } else {
    //     arrItem.push(val)
    // }
    let time = new Date()
    let value = JSON.stringify({data: val, time: time})
    window.localStorage.setItem(key, value)
}

/**
 * 获取localStorage
 * @param {*} key 
 */
export function getStorage (key, exp) {
    return JSON.parse(window.localStorage.getItem(key))
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result
  
    const later = function() {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp
  
      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
  
    return function(...args) {
      context = this
      timestamp = +new Date()
      const callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }
  
      return result
    }
  }