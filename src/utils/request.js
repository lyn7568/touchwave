import axios from 'axios'
import qs from 'qs'
import { comUrl } from '@/utils/index'
// import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: comUrl // api的base_url
  // timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 配置config
  config.headers.Accept = 'application/json'
  if (config.method === 'post') {
    // if (config.url !== http.sample.list && config.url !== http.manage.kit.save) {
    config.data = qs.stringify(config.data)
    // 处理后后台无需添加RequestBody
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded charset=UTF-8'
    // }
  }
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
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

  //     // 50008:非法的token 50012:其他客户端登录了  50014:Token 过期了
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload()// 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
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
    return data
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

export default {
  service,
  comUrl
}
