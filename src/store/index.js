import Vue from 'vue'
import Vuex from 'vuex'
// 导入auth中的全部方法 通过auth。的方式可以按需选用
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  // vuex 中 state是用来保存存储数据的
  state: {
    // 得到本地数据(从本地缓存中读取数据)
    user: auth.getUser()
  },
  // 通过mutations对vuex中state的数据进行修改
  mutations: {
    updateUser (state, payload) {
      // 将数据存储到vuex中的state里面
      state.user = payload.user
      // 再将修改后的数据存储到本地
      auth.setUser(payload.user)
    },
    // 删除vuex中存储数据
    clearUser (state) {
      // 将state里面的user清空
      state.user = {}
      // 将本地存储(缓存)的数据进行清空
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
