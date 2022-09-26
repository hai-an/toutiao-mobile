import axios from 'axios'
import store from '@/store'

// import JSONBig from 'json-bigint'
// const json = '{ "value" : 9223372036854775807, "v2": 123 }'
// console.log(jsonBig.parse(json))

/* 复制一个axios  */
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
  // transformResponse 允许自定义原始的响应数据（字符串）
  // transformResponse: [function (data) {
  //   try {
  //     // 如果转换成功则返回转换的数据结果
  //     return JSONBig.parse(data)
  //   } catch (err) {
  //     // 如果转换失败，则包装为统一数据格式并返回
  //     return {
  //       data
  //     }
  //   }
  // }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log(config)
  const { user } = store.state/* 把该对象里的user解构给user */
  console.log(user)

  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (err) {
  // Do something with request error
  return Promise.reject(err)
})

// 响应拦截器

export default request
