/*
封装用户请求数据接口
*/
import request from '@/utils/request'
// import store from '@/store'

export const loginAPI = data => {
  return request({
    method: 'post',
    url: '/v1_0/authorizations',
    data
  })
}
// 每分钟只能获取一次token
export const sendCode = (mobile) => {
  return request({
    method: 'get',
    url: `/v1_0/sms/codes/:${mobile}`
  })
}
/*
获取用户的个人信息
*/
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/v1_0/user'
    // 请求头
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target
    }
  })
}
// 取消关注用户
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}
// 获取用户个人资料
export const userProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}
// 编辑用户个人资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}
// 编辑用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
