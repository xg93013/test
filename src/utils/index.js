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
