import Vue from 'vue'
import App from './App.vue'
import router from './permission'
import store from './store'
import Vant, { Lazyload } from 'vant'
import plugins from './utils/plugin' // 引入封装的休眠函数
import 'vant/lib/index.less'
import 'amfe-flexible'// 引入插件amfe-flexible

Vue.use(Vant)// 全局注册 实际上是调用了Vant导出的对象的方法install
Vue.use(plugins) // 全局注册 通过原型链封装的休眠函数
Vue.use(Lazyload) // 全局注册使用lazyload 相对时间过滤器
Vue.config.productionTip = false // 关闭生产模式的消息提示

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
