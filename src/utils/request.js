import axios from 'axios'
import qs from 'qs'
import { comUrl } from '@/utils/index'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: comUrl, // api的base_url
  // timeout: 5000, // 请求超时时间
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// request拦截器
service.interceptors.request.use(config => {
  // 配置config
  config.headers.Accept = 'application/json'
  if (config.method === 'post') {
    config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
    // 处理后后台无需添加RequestBody
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
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
    if (!response.data.success && response.data.code === 1) {
      store.dispatch('FedLogOut').then(() => {
        Message.error('登录状态失效，请重新登录')
        router.push({ path: '/' })
      })
    }
    return response.data
  } else {
    return Promise.resolve(response)
  }
}, error => {
  return Promise.reject(error)
})

export default service
