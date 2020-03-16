import request from '@/utils/request'

// 频道组件
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}
