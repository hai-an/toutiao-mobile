/*
封装文章列表请求
*/
import request from '@/utils/request'

export const getArticle = (params) => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
  })
}
/* 根据文章id获取文章详情 */
export const getArticleById = articleId => {
  return request({
    method: 'get',
    url: `/v1_0/articles/${articleId}`
  })
}
/* 收藏文章 */
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}
/* 取消收藏文章 */
export const deleteCollect = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

/* 点赞文章 */
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}
/* 取消收藏文章 */
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
