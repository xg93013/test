import axios from "axios"



export function deepClone(obj) {
  var copy;
  if (null == obj || "object" != typeof obj) return obj;
  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}

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


export function exportDoc(fileName, url) {
  // export
  axios({
    method: "get",
    url: url,
    responseType: "blob",
    data: {
      // 参数
      firstName: ""
    },
    // `onDownloadProgress` 允许为下载处理进度事件
    onDownloadProgress: function (progressEvent) { }
  })
    .then(result => {
      if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(new Blob([result.data]), fileName);
      } else {
        let url = window.URL.createObjectURL(new Blob([result.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })
    .catch(result => { });
}