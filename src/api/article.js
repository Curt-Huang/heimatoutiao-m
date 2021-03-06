import request from '@/utils/request.js'

// 渲染文章列表
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}

// 不喜欢文章 删除
export function disLikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
// 举报文章的API
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}

// 搜索建议
export function suggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
