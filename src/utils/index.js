/**
 * 添加localStorage
 * @param {*} key 
 * @param {*} val 
 */
export function setStorage (key, val) {
    let arrItem = []
    if (val instanceof Array) {
        arrItem = val
    } else {
        arrItem.push(val)
    }
    let strItem = JSON.stringify(arrItem)
    window.localStorage.setItem(key, strItem)
}

/**
 * 获取localStorage
 * @param {*} key 
 */
export function getStorage (key) {
    return JSON.parse(window.localStorage.getItem(key))
}
