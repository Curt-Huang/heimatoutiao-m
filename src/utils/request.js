// 封装request请求模块
import axios from 'axios'
import JSONBig from 'json-bigint'
import store from '@/store'
import router from '@/router'
// 创建axios实例
const instance = axios.create({
  // 下面进行请求配置
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 设置请求地址常量
  transformResponse: [function (data) {
    // data就是后台相应的数据 我们可以通过tansformResponse来对后台相应的data数据进行任意转换
    // return data ? JSONBig.parse(data) : {}
    try {
      return JSONBig.parse(data) // 将大数字转成对象形式
    } catch (error) {
      return data
    }
  }]
})

// 请求拦截器
instance.interceptors.request.use(function (config) {
  // 在此统一注入token
  if (store.state.user.token) {
    config.headers['Authorization'] = `Bearer ${store.state.user.token}`
  }
  return config// 请求拦截函数要返回config函数
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(function (response) {
  // 对返回的数据进行解构，是根据返回的数据的结果进行解构的
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async function (error) {
  // 处理token失效问题 error是对象形式 包含config(配置信息)以及response(响应)
  // 判断返回的status(状态码)是不是401
  if (error.response.status === 401) {
    // 当refresh_token不存在时 跳转到登录界面，并且将当前的页面的路由地址传递给登录界面
    let toPath = {
      path: '/login',
      query: { redirectUrl: router.currentRoute.path }
    }
    // 此时token失效，再判断是否存在refresh_token
    if (store.state.user.refresh_token) {
      try {
      // 当refresh_token存在时,再通过axios去发送请求，拿去token
        let result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }
        })
        // 对请求到的结果直接通过commit调用store的updateUser方法，进行更新数据
        store.commit('updateUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token }
        })
        // 这时再调用instance，将未完成请求，发送出去
        return instance(error.config)
      } catch (error) {
        // 此时refre_token失效了,那么也将跳到登录页面，同时也将token以及refresh_tonken清除
        store.commit('clearUser')
        router.push(toPath)
      }
    } else {
      // 清除本地存储的token
      store.commit('clearUser')
      router.push(toPath)
    }
  }
  return Promise.reject(error)
})
export default instance
