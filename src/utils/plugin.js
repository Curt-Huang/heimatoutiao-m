import dayjs from 'dayjs' // 导入插件
import relativeTime from 'dayjs/plugin/relativeTime' // 按需加载插件
import 'dayjs/locale/zh-cn' // 导入中文语言包
dayjs.extend(relativeTime) // dayjs上挂载插件
export default {
  install (Vue) {
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime) // 注册一个全局的，相对时间过滤函数
  }
}

// 封装休眠函数
function sleep (time = 500) {
  return new Promise(
    function (resolve) {
      setTimeout(() => resolve(), time)
    }
  )
}
// 时间过滤器
function relTime (value) {
  return dayjs().locale('zh-cn').from(value)
}
