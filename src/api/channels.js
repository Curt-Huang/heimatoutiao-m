import request from '@/utils/request'

// 频道组件
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}

// 渲染列表
export function getArticles (params) {
  return ({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
