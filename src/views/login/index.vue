<template>
  <div class='container'>
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 手机号  验证码  登录按钮 -->
    <van-cell-group>
      <van-field :error-message="errMsg.mobile" @blur="checkMobile" label="手机号" placeholder="请输入手机号" v-model="loginForm.mobile"></van-field>
      <van-field :error-message="errMsg.code" @blur="checkCode"  label="验证码" placeholder="请输入验证码" v-model="loginForm.code">
        <!-- slot指定给哪个坑填内容 -->
        <van-button  slot="button" size="small" type="primary" >发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class='btn-box'>
      <van-button type="info" size="small" round block @click="clickLogin">登录</van-button>
    </div>
  </div>
</template>
<script>
// 引入封装api
import { login } from '@/api/user'
// 引入vuex的辅助函数
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']),
    // 检查输入的手机格式
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '手机号不能为空'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '请输入正确的手机格式'
        return false
      }
      // 清空提示信息
      this.errMsg.mobile = ''
      return true
    },
    // 检查验证码格式
    checkCode () {
      if (!this.loginForm.code) {
        this.errMsg.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码格式不正确'
        return false
      }
      // 清空提示信息
      this.errMsg.code = ''
      return true
    },
    // 登录方法
    async clickLogin () {
      // 如果表单验证都通过，就可以向后台发送登录请求了
      if (this.checkMobile && this.checkCode) {
        let data = await login(this.loginForm)
        // console.log(data)
        // 将数据保存在本地
        this.updateUser({ user: data })
        // 提示用户登录成功 这是调用vant组件 老师讲的通过propotype小技巧暂未使用
        this.$notify({ type: 'success', message: '登录成功', duration: 500 })
        // 获取浏览器窗口中的redirectUrl，从而让其跳回原来的登录界面
        let { redirectUrl } = this.$route.query
        // 采用短路表达式，当有redirectUrl的时候，就用它，没有的时候就用短路表达式，调到首页
        this.$router.push(redirectUrl || '/')
      }
    }
  }
}
</script>

<style scoped>
   .btn-box {
     padding: 20px;
   }
</style>
