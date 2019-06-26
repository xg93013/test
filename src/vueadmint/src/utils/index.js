/**
 * 添加localStorage
 * @param {*} key 
 * @param {*} val 
 */
export function setStorage(key, val) {
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
export function getStorage(key) {
    return JSON.parse(window.localStorage.getItem(key))
}

export function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=")
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1
            let c_end = document.cookie.indexOf(";", c_start)
            if (c_end === -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

export function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

export function checkCookie() {
    let username = getCookie('username')
    if (username != null && username !== "") { alert('Welcome again ' + username + '!') } else {
        username = prompt('Please enter your name:', "")
        if (username != null && username !== "") {
            setCookie('username', username, 365)
        }
    }
}

export function checkYear(year) {
    if (((year % 4) == 0) && ((year % 100) != 0) || ((year % 400) == 0)) {
        return true
    } else {
        return false
    }
}
