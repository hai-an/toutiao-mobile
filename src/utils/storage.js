/* 封装一个获取本地数据的容器 */

/* det 保存本地数据 */
export const setItem = (key, val) => {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  window.localStorage.setItem(key, val)
}

/* get 获取本地数据 */
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}
/* remove 删除本地数据 */
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
