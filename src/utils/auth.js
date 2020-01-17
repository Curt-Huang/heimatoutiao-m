// 专门用来存储 设置 删除 用户的token的模块 放在localStorge
const USER_TOKEN = 'heima-toutiao-m-91-Token' // 设置本地存储的key
// 设置token
export function setUser (user) {
  localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
// 得到token
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_TOKEN || '{}'))// 短路表达式
}
// 删除Token
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
