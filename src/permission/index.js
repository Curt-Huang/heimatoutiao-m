import router from '@/router'
import store from '@/store'
// 导航守卫
// 前置守卫
router.beforeEach((to, from, next) => {
// 如果跳转页面的首地址是/user开头的 为true 且token为空，再非，则也为true，这样才能进入if判断里面
  if (to.path.startsWith('/user') && !store.state.user.token) {
    let toPath = {
      path: '/login',
      //   为什么要携带这个地址redirectUrl，因为等我们登录成功后还要跳回本页面
      query: { redirectUrl: to.path }
    }
    // 则需要跳转到登录页面
    next(toPath)
  } else {
    // 否则直接放行
    next()
  }
})
export default router
