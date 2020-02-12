<template>
  <div class="container">
    <van-nav-bar left-arrow @click-right="saveInfo" @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
        @click="checkPhoto"
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell   @click="checkName" is-link title="名称" :value="user.name" />
      <van-cell @click="checkGender" is-link title="性别" :value="user.gender===0?'男':'女'"/>
      <van-cell @click="confirmDate" is-link title="生日" :value="user.birthday" />
    </van-cell-group>
    <!-- 头像弹框组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
       <van-cell @click="getPhoto" title="本地图库获取头像"  is-link/>
       <van-cell title="拍照"  is-link/>
    </van-popup>
    <!-- 姓名弹框组件 -->
    <van-popup v-model="showName" style="width:80%" round>
        <van-field v-model="user.name" :error-message="errMsg" type="textarea" rows='4' placeholder="请输入昵称" />
        <van-button type="primary" size="large" @click="btnName">确认</van-button>
    </van-popup>
    <!-- 性别弹框组件 -->
    <van-action-sheet v-model="showGender" cancel-text="取消" :actions="actions" @select="selectItem" />
     <!-- 生日弹框组件 -->
    <van-popup  v-model="showBirthday" position="bottom">
      <van-datetime-picker
      @confirm="showDate"
         v-model="currentDate"
         type="date"
         :min-date="minDate"
         :max-date="maxDate"
      />
    </van-popup>
    <!-- 本地获取头像组件 -->
    <input @change="upLoad" ref="storePhoto" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { upDataImg, getUserProfile, saveUserInfo } from '@/api/user'
export default {
  name: 'profile',
  data () {
    return {
      errMsg: '',
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 最大时间，最大时间永远小于等于当前时间
      currentDate: new Date(), // 当前时间
      showPhoto: false, // 显示头像弹框
      showName: false, // 显示昵称弹框
      showGender: false, // 显示性别弹框
      showBirthday: false, // 显示生日弹框
      actions: [
        { name: '男' },
        { name: '女' }
      ],
      user: {
        name: '王五',
        gender: 0,
        birthday: '1995-2-24'
      }
    }
  },
  methods: {
    // 四个点击触发弹层事件
    checkPhoto () {
      this.showPhoto = true
    },
    checkName () {
      this.showName = true
    },
    checkGender () {
      this.showGender = true
    },
    // 获取用户信息
    async getuserProfile () {
      let data = await getUserProfile()
      this.user = data
    },
    // 获取本地图片
    getPhoto () {
      // 获取imput这个dom元素,并触发点击事件
      this.$refs.storePhoto.click()
    },
    // 获取本地图片后触发请求
    async upLoad () {
      // 对提交formData数据进行准换
      let data = new FormData()
      data.append('photo', this.$refs.storePhoto.files[0])
      // 发送头像
      let result = await upDataImg(data)
      // console.log(result)
      // 然后把数据跟新给本地
      this.user.photo = result.photo
      // 关闭弹层
      this.showPhoto = false
    },
    // 昵称确认事件
    btnName () {
      // 设置输入的字符 应该在[1-7]
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.errMsg = '昵称为1到7个字'
        return false
      }
      // 清除错误提示
      this.errMsg = ''
      // 关闭昵称弹层
      this.showName = false
    },
    // 点击选择男女事件
    selectItem (item) {
      // console.log(item.name)
      this.user.gender = item.name === '男' ? 0 : 1
      this.showGender = false
    },
    // 点击生日弹窗时，切换组件内的时间，让其显示user内的时间
    confirmDate () {
      this.currentDate = new Date(this.user.birthday)
      this.showBirthday = true
    },
    // 选择时间
    showDate (date) {
      // 转换成字符串格式,并且写入了data里面
      this.user.birthday = dayjs(date).format('YYYY-MM-DD')
      // console.log(this.user.birthday)
      // 关闭时间弹窗
      this.showBirthday = false
    },
    // 保存用户的所有信息
    async saveInfo () {
      try {
        await saveUserInfo({ ...this.user, photo: null })
        this.$notify({ type: 'success', message: '保存成功', duration: 1500 })
      } catch (error) {
        this.$notify({ type: 'danger', message: '保存失败', duration: 1500 })
      }
    }
  },
  created () {
    // 创建阶段就把数据渲染过来
    this.getuserProfile()
  }
}
</script>

<style lang="less" scoped>
</style>
