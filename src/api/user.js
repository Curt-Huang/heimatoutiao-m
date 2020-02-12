import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/authorizations',
    data,
    method: 'post'
  }) // 得到一个promise对象 返回
}

//
export function saveUserInfo (data) {
  return request({
    url: '/user/profile', // 编辑资料的地址
    data,
    method: 'patch'
  })
}
// 请求用户个人信息
export function getUserProfile () {
  return request({
    url: 'user/profile'
  })
}

// 提交用户头像
export function upDataImg (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}
