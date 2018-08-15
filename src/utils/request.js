import axios from 'axios'
import qs from 'qs'
import { comUrl } from '@/utils/index'
// import { Message } from 'element-ui'
// import store from '@/store'
// import { getSession } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: comUrl, // api的base_url
  // timeout: 5000 // 请求超时时间
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// request拦截器
service.interceptors.request.use(config => {
  // 配置config
  config.headers.Accept = 'application/json'
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
    // 处理后后台无需添加RequestBody
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  // response => {
  // /**
  // * code为非20000是抛错 可结合自己业务进行修改
  // */
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })

  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  let data = response.data
  const status = response.status
  if (status === 200) {
    if (response.data === undefined) {
      // 解决IE9数据问题
      data = response.request.responseText
    } else {
      data = response.data
    }
    if (!(data instanceof Object)) {
      // 判断data不是Object时，解析成Object
      // data = JSON.parse(data)
    }
    return response.data
  } else {
    // 业务异常
    console.log(response)
    return Promise.resolve(response)
  }
}, error => {
  // 系统异常(后期统一处理)
  console.log(error)
  return Promise.reject(error)
})

export default service
