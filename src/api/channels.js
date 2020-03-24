import request from '@/utils/request'
import store from '@/store'

let CACHE_CHANNEL_T = 'heima_91_toutiao_t' // 游客缓存的key
let CACHE_CHANNEL_U = 'heima_91_toutiao_u' // 登录缓存的key
// 我的频道
export function getMyChannels () {
  // return request({
  //   url: '/user/channels'
  // })
  return new Promise(
    async function (resolve, reject) {
      let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
      // debugger
      let str = localStorage.getItem(key)
      // debugger
      if (str) {
        resolve({ channels: JSON.parse(str) })
      } else {
        const data = await request({ url: '/user/channels' })
        // debugger
        localStorage.setItem(key, JSON.stringify(data.channels))
        resolve(data)
      }
    }
  )
}

// 得到全部频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

// 删除我的频道
export function delChannel (channelId) {
  return new Promise((resolve, reject) => {
    // 首先判断是游客登录，还是用户登录
    if (store.state.user.token) {
      // 用户登录
      let keyValue = JSON.parse(localStorage.getItem(CACHE_CHANNEL_U)) // 获取本都存储的登录用户频道
      let newKeyValue = keyValue.filter(item => !(item.id === channelId)) // 找到要删除的元素，通过id来将它删除
      localStorage.setItem(CACHE_CHANNEL_U, JSON.stringify(newKeyValue)) // 重新渲染到本地
      debugger
      resolve()
    } else {
      // 游客登录
      let keyValue = JSON.parse(localStorage.getItem(CACHE_CHANNEL_T)) // 获取本都存储的登录用户频道
      // console.log(keyValue)
      let newKeyValue = keyValue.filter(item => !(item.id === channelId)) // 找到要删除的元素，通过id来将它删除
      // console.log(newKeyValue)
      localStorage.setItem(CACHE_CHANNEL_T, JSON.stringify(newKeyValue)) // 重新渲染到本地
      // debugger
      resolve()
    }
  }
  )
}

// 添加频道
export function addChannel (channel) {
  return new Promise((resolve, reject) => {
    // 首先三元表达式进行判断，看是登录，还是游客
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    // 得到之后通过key键名，来得到本地存储channel的值
    let str = JSON.parse(localStorage.getItem(key))
    // 通过数组的方法push，将数据直接添加到末尾
    str.push(channel)
    localStorage.setItem(key, JSON.stringify(str))
    resolve()
  })
}
