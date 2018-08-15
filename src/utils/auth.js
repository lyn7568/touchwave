import store from '@/store'
import Cookies from 'js-cookie'

export function getSession() {
  return Cookies.get('JSESSIONID')
}

export function removeSession() {
  return Cookies.remove('JSESSIONID')
}

export function getIfLoginUser() {
  store.dispatch('GetUserInfo').then(res => { // 判断是否有登录用户
  })
}
